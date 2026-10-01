// ============================================================================
// CONSEGNE AL MACELLO — PACCHETTO PER LA FATTURAZIONE — v125
// ----------------------------------------------------------------------------
// Dopo l'uscita per macellazione l'operatore completa, capo per capo:
// peso della carcassa, numero di partita del cliente, cliente (dall'elenco
// della Contabilita' Industriale o scritto a mano) e, se serve, il peso vivo.
// Al salvataggio i dati vanno nella scheda dell'animale (o dell'unita' del
// lotto suini) e nella tabella uscite_consegne, che la Contabilita'
// Industriale legge per emettere la fattura.
// Nella prima pagina compare un avviso finche' ci sono capi da completare.
// ============================================================================
import { useState, useEffect } from "react";
import { t } from "./i18n";
import { supabase } from "./supabase";

const C = { primary:"#5C3D1E", border:"#D4C4A8", muted:"#8B7355", text:"#2D1B0E", red:"#C0392B", green:"#4A7C59", bg:"#F5F0E8", yellow:"#D4A017" };
const MACELLAZIONE = ["Macellato", "Macellazione"];
export const INIZIO_CONSEGNE = "2026-09-24";   // le uscite da questa data in poi vanno completate
const fData = d => d ? d.split("-").reverse().join("/") : "—";
const icona = s => ({ bovino:"🐄", suino:"🐷", ovino:"🐑" }[s] || "🐾");
const vuoto = v => v === null || v === undefined || String(v).trim() === "";
const num = v => vuoto(v) ? null : parseFloat(String(v).replace(",", "."));
const inputStyle = { width:"100%", boxSizing:"border-box", border:`1.5px solid ${C.border}`, borderRadius:10,
  padding:"10px 12px", fontSize:15, background:"#FAFAF8", color:C.text, outline:"none" };

// Capi usciti per macellazione dal INIZIO_CONSEGNE, con lo stato della consegna
async function caricaUscite() {
  const [an, un, co, ab] = await Promise.all([
    supabase.from("animali").select("id,bdn,nome,specie,data_uscita,motivo_uscita,peso_vivo_uscita,peso_carcassa")
      .neq("stato", "attivo").gte("data_uscita", INIZIO_CONSEGNE).in("motivo_uscita", MACELLAZIONE),
    supabase.from("suini_lotto").select("id,nr,codice_completo,lotto_id,data_uscita,motivo_uscita,peso_vivo_uscita,peso_carcassa,lotti_suini(codice_lotto,codice)")
      .eq("vivo", false).gte("data_uscita", INIZIO_CONSEGNE).in("motivo_uscita", MACELLAZIONE),
    supabase.from("uscite_consegne").select("*"),
    supabase.from("modelli4_abbinamenti").select("animale_id,suino_lotto_id,modelli4_documenti(id,numero_documento,destinatario)"),
  ]);
  const consegne = co.data || [];
  const abb = ab.data || [];
  const capi = [
    ...(an.data || []).map(a => ({
      chiave:"a" + a.id, animale_id:a.id, suino_lotto_id:null, specie:a.specie,
      matricola:a.bdn || a.nome, lotto:null, nome:a.nome, data_uscita:a.data_uscita,
      peso_vivo:a.peso_vivo_uscita, peso_carcassa:a.peso_carcassa,
      consegna:consegne.find(c => c.animale_id === a.id),
      doc:abb.find(x => x.animale_id === a.id)?.modelli4_documenti || null,
    })),
    ...(un.data || []).map(u => {
      const lotto = u.lotti_suini?.codice_lotto || u.lotti_suini?.codice || null;
      return {
        chiave:"s" + u.id, animale_id:null, suino_lotto_id:u.id, specie:"suino",
        matricola:u.codice_completo || (lotto ? `${lotto}-${u.nr}` : `#${u.nr}`), lotto, nome:null, data_uscita:u.data_uscita,
        peso_vivo:u.peso_vivo_uscita, peso_carcassa:u.peso_carcassa,
        consegna:consegne.find(c => c.suino_lotto_id === u.id),
        doc:abb.find(x => x.suino_lotto_id === u.id)?.modelli4_documenti || null,
      };
    }),
  ];
  capi.forEach(c => {
    const k = c.consegna;
    c.completo = !!k && !vuoto(k.peso_carcassa) && !vuoto(k.numero_partita) && !vuoto(k.cliente_nome);
  });
  capi.sort((x, y) => (y.data_uscita || "").localeCompare(x.data_uscita || ""));
  return capi;
}

// campo con etichetta (fuori dai componenti, cosi' le caselle non perdono il cursore)
const Campo = ({ label, children }) => (
  <div style={{ marginBottom:12 }}>
    <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:4 }}>{label}</div>
    {children}
  </div>
);

// ─── SCHEDA DA COMPILARE ──────────────────────────────────────────────────────
function SchedaConsegna({ capo, clienti, onChiudi, onSalvato }) {
  const k = capo.consegna || {};
  const [f, setF] = useState({
    peso_vivo: k.peso_vivo ?? capo.peso_vivo ?? "",
    peso_carcassa: k.peso_carcassa ?? capo.peso_carcassa ?? "",
    numero_partita: k.numero_partita ?? "",
    cliente_nome: k.cliente_nome ?? "",
  });
  const [salvo, setSalvo] = useState(false);
  const [errore, setErrore] = useState("");
  const nomiClienti = [...new Set(clienti.map(c => c.nome))].sort();
  const inElenco = nomiClienti.includes(f.cliente_nome);
  const [scrivi, setScrivi] = useState(!vuoto(k.cliente_nome) && !clienti.some(c => c.nome === k.cliente_nome));
  const pv = num(f.peso_vivo), pc = num(f.peso_carcassa);
  const resa = pv && pc ? Math.round(pc / pv * 1000) / 10 : null;

  const salva = async () => {
    if (vuoto(f.peso_carcassa) || vuoto(f.numero_partita) || vuoto(f.cliente_nome)) {
      setErrore(t("Inserire peso della carcassa, numero di partita e cliente")); return;
    }
    setSalvo(true); setErrore("");
    // 1) scheda dell'animale / unita' del lotto
    const agg = { peso_vivo_uscita:pv, peso_carcassa:pc, resa_percent:resa };
    const r1 = capo.animale_id
      ? await supabase.from("animali").update(agg).eq("id", capo.animale_id)
      : await supabase.from("suini_lotto").update(agg).eq("id", capo.suino_lotto_id);
    if (r1.error) { setSalvo(false); setErrore(r1.error.message); return; }
    // 2) pacchetto per la fatturazione
    const cliente = clienti.find(c => c.nome === f.cliente_nome.trim());
    const riga = {
      animale_id:capo.animale_id, suino_lotto_id:capo.suino_lotto_id, specie:capo.specie,
      matricola:capo.matricola, lotto:capo.lotto, data_uscita:capo.data_uscita,
      modello4_documento_id:capo.doc?.id ?? null, modello4_numero:capo.doc?.numero_documento ?? null,
      destinatario:capo.doc?.destinatario ?? null,
      peso_vivo:pv, peso_carcassa:pc, resa_percentuale:resa,
      numero_partita:f.numero_partita.trim(), cliente_id:cliente?.id ?? null, cliente_nome:f.cliente_nome.trim(),
      aggiornato_il:new Date().toISOString(),
    };
    const r2 = capo.consegna
      ? await supabase.from("uscite_consegne").update(riga).eq("id", capo.consegna.id)
      : await supabase.from("uscite_consegne").insert(riga);
    setSalvo(false);
    if (r2.error) { setErrore(r2.error.message); return; }
    onSalvato();
  };

  return (
    <div>
      <button onClick={onChiudi} style={{ background:"none", border:"none", fontSize:14, color:C.primary, cursor:"pointer", padding:0, marginBottom:10 }}>← {t("Torna all'elenco")}</button>
      <div style={{ background:"#FFF", borderRadius:14, padding:12, marginBottom:12, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:16, fontWeight:800 }}>{icona(capo.specie)} {capo.matricola}{capo.nome && capo.nome !== capo.matricola ? ` · ${capo.nome}` : ""}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
          {t("Uscita")} {fData(capo.data_uscita)}{capo.lotto ? ` · ${t("lotto")} ${capo.lotto}` : ""}
        </div>
        <div style={{ fontSize:12, color:capo.doc ? C.green : C.red, marginTop:2, fontWeight:600 }}>
          📄 {capo.doc ? `${t("Modello 4")} ${capo.doc.numero_documento} → ${capo.doc.destinatario || ""}` : t("Nessun modello 4 abbinato")}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <Campo label={t("Peso vivo (kg)")}>
          <input type="number" inputMode="decimal" value={f.peso_vivo} onChange={e => setF({ ...f, peso_vivo:e.target.value })} style={inputStyle}/>
        </Campo>
        <Campo label={t("Peso carcassa (kg)") + " *"}>
          <input type="number" inputMode="decimal" value={f.peso_carcassa} onChange={e => setF({ ...f, peso_carcassa:e.target.value })} style={inputStyle}/>
        </Campo>
      </div>
      {resa && <div style={{ fontSize:12, color:C.green, marginBottom:10 }}>⚖️ {t("Resa")}: <b>{resa}%</b></div>}
      <Campo label={t("Numero di partita del cliente") + " *"}>
        <input value={f.numero_partita} onChange={e => setF({ ...f, numero_partita:e.target.value })} style={inputStyle}
          placeholder={t("Numero con cui il cliente ha caricato il capo")}/>
      </Campo>
      <Campo label={t("Cliente") + " *"}>
        {!scrivi ? (
          <select value={inElenco ? f.cliente_nome : ""} style={inputStyle}
            onChange={e => { if (e.target.value === "__scrivi__") { setScrivi(true); setF({ ...f, cliente_nome:"" }); } else setF({ ...f, cliente_nome:e.target.value }); }}>
            <option value="">{t("— scegli il cliente —")}</option>
            {nomiClienti.map(n => <option key={n} value={n}>{n}</option>)}
            <option value="__scrivi__">✏️ {t("Altro: scrivi il nome")}</option>
          </select>
        ) : (
          <div style={{ display:"flex", gap:6 }}>
            <input value={f.cliente_nome} onChange={e => setF({ ...f, cliente_nome:e.target.value })} style={inputStyle} placeholder={t("Nome del cliente")}/>
            <button onClick={() => { setScrivi(false); setF({ ...f, cliente_nome:"" }); }} style={{ border:`1.5px solid ${C.border}`, background:"#FFF", borderRadius:10, padding:"0 10px", cursor:"pointer" }}>☰</button>
          </div>
        )}
      </Campo>
      {errore && <div style={{ color:C.red, fontSize:13, marginBottom:10 }}>⚠️ {errore}</div>}
      <button onClick={salva} disabled={salvo}
        style={{ width:"100%", background:C.green, color:"#FFF", border:"none", borderRadius:12, padding:"12px", fontSize:16, fontWeight:700, cursor:"pointer", opacity:salvo ? 0.6 : 1 }}>
        {salvo ? t("Salvataggio...") : "✓ " + t("Salva")}
      </button>
    </div>
  );
}

// ─── AVVISO NELLA PRIMA PAGINA + ELENCO ───────────────────────────────────────
export function AvvisoConsegne() {
  const [capi, setCapi] = useState(null);
  const [clienti, setClienti] = useState([]);
  const [aperto, setAperto] = useState(false);
  const [scelto, setScelto] = useState(null);
  const [tutti, setTutti] = useState(false);

  const carica = async () => setCapi(await caricaUscite());
  useEffect(() => {
    carica();
    supabase.from("ci_clienti").select("id,nome").then(({ data }) => setClienti((data || []).filter(c => c.nome)));
  }, []);

  if (!capi) return null;
  const daFare = capi.filter(c => !c.completo);
  if (!aperto && daFare.length === 0) return null;

  if (!aperto) return (
    <div onClick={() => setAperto(true)} style={{ cursor:"pointer", background:C.red + "12", border:`1.5px solid ${C.red}55`,
      borderRadius:16, padding:14, marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ fontSize:13, fontWeight:800, color:C.red, marginBottom:4 }}>🔪 {t("Animali usciti per la macellazione")}</div>
        <div style={{ fontSize:12, color:C.text }}>
          {t("{n} capi da completare: peso della carcassa, partita e cliente", { n:daFare.length })}
        </div>
      </div>
      <div style={{ fontSize:18, color:C.muted }}>›</div>
    </div>
  );

  const elenco = tutti ? capi : daFare;
  return (
    <div style={{ position:"fixed", inset:0, background:C.bg, zIndex:400, overflowY:"auto" }}>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"16px 16px 100px" }}>
        {scelto ? (
          <SchedaConsegna capo={scelto} clienti={clienti} onChiudi={() => setScelto(null)}
            onSalvato={async () => { setScelto(null); await carica(); }}/>
        ) : (<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <button onClick={() => setAperto(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer" }}>←</button>
            <div style={{ fontSize:18, fontWeight:800 }}>🔪 {t("Animali usciti per la macellazione")}</div>
          </div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>
            {t("Tocca un capo per inserire peso della carcassa, numero di partita del cliente e cliente.")}
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, marginBottom:10, color:C.text }}>
            <input type="checkbox" checked={tutti} onChange={e => setTutti(e.target.checked)}/> {t("Mostra anche quelli già completati")}
          </label>
          {elenco.length === 0 && <div style={{ textAlign:"center", color:C.muted, padding:30 }}>✅ {t("Nessun capo da completare")}</div>}
          {elenco.map(c => (
            <div key={c.chiave} onClick={() => setScelto(c)} style={{ cursor:"pointer", background:"#FFF", borderRadius:14, padding:12, marginBottom:8,
              border:`1px solid ${C.border}`, borderLeft:`5px solid ${c.completo ? C.green : C.red}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                <div style={{ fontWeight:800, fontSize:15 }}>{icona(c.specie)} {c.matricola}</div>
                <div style={{ fontSize:12, color:C.muted, whiteSpace:"nowrap" }}>{fData(c.data_uscita)}</div>
              </div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
                {[t({ bovino:"Bovino", suino:"Suino", ovino:"Ovino" }[c.specie] || c.specie), c.lotto && `${t("lotto")} ${c.lotto}`,
                  c.doc ? `${t("Modello 4")} ${c.doc.numero_documento}` : t("Nessun modello 4 abbinato")].filter(Boolean).join(" · ")}
              </div>
              <div style={{ fontSize:12, marginTop:4, fontWeight:600, color:c.completo ? C.green : C.red }}>
                {c.completo
                  ? `✅ ${t("Carcassa")} ${c.consegna.peso_carcassa} kg · ${t("partita")} ${c.consegna.numero_partita} · ${c.consegna.cliente_nome}`
                  : "⏳ " + t("Da completare")}
              </div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  );
}

// ─── RIGHE NELLA SCHEDA DELL'ANIMALE ──────────────────────────────────────────
export function ConsegnaInScheda({ animaleId }) {
  const [k, setK] = useState(null);
  useEffect(() => {
    let vivo = true;
    supabase.from("uscite_consegne").select("numero_partita,cliente_nome,stato,fattura_numero").eq("animale_id", animaleId).maybeSingle()
      .then(({ data }) => { if (vivo) setK(data || null); });
    return () => { vivo = false; };
  }, [animaleId]);
  if (!k) return null;
  const riga = (label, val) => val ? (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
      <span style={{ color:C.muted, fontSize:13 }}>{label}</span>
      <span style={{ fontWeight:600, textAlign:"right", maxWidth:"60%" }}>{val}</span>
    </div>
  ) : null;
  return (<>
    {riga(t("Numero di partita del cliente"), k.numero_partita)}
    {riga(t("Cliente"), k.cliente_nome)}
    {riga(t("Fatturazione"), k.stato === "fatturato" ? `${t("fatturato")}${k.fattura_numero ? " — " + k.fattura_numero : ""}` : t("pronto da fatturare"))}
  </>);
}
