// ============================================================================
// CONSEGNE AL MACELLO — PACCHETTO PER LA FATTURAZIONE — v134
// ----------------------------------------------------------------------------
// Dopo l'uscita per macellazione l'operatore completa, capo per capo:
// peso della carcassa, cliente e, per OGNI PEZZO, il numero di partita del
// cliente (v134, decisione del Dott. Bizzarri dell'08/10/2026):
//   suino  -> 2 mezzene · bovino -> 4 quarti · ovino -> carcassa intera.
// Peso del pezzo e cliente diverso per pezzo sono facoltativi.
// Tabelle: uscite_consegne (una riga per capo) e uscite_consegne_pezzi (una riga
// per pezzo). La colonna uscite_consegne.numero_partita non si usa piu' per i
// nuovi capi (resta per i vecchi).
// Fatturazione: «fatturato» = almeno una riga ATTIVA in ci_fatture_emesse_righe
// per il capo; «pronto da fatturare» = tutti i pezzi con partita e nessuna riga
// attiva. Il database rifiuta le modifiche ai capi e pezzi gia' fatturati.
// Ordine dei salvataggi: prima uscite_consegne, poi i pezzi, per ultima la
// scheda dell'animale: se il database rifiuta il capo, l'animale non cambia.
// ============================================================================
import { useState, useEffect } from "react";
import { t } from "./i18n";
import { supabase } from "./supabase";

const C = { primary:"#5C3D1E", border:"#D4C4A8", muted:"#8B7355", text:"#2D1B0E", red:"#C0392B", green:"#4A7C59", bg:"#F5F0E8", yellow:"#D4A017", orange:"#D35400" };
const MACELLAZIONE = ["Macellato", "Macellazione"];
export const INIZIO_CONSEGNE = "2026-09-24";   // le uscite da questa data in poi vanno completate
export const PEZZI = {
  suino:  ["mezzena 1", "mezzena 2"],
  bovino: ["quarto 1", "quarto 2", "quarto 3", "quarto 4"],
  ovino:  ["carcassa intera"],
};
const pezziDi = specie => PEZZI[(specie || "").toLowerCase().trim()] || [];
const nomePezzo = p => ({ "mezzena 1":t("Mezzena 1"), "mezzena 2":t("Mezzena 2"), "quarto 1":t("Quarto 1"), "quarto 2":t("Quarto 2"),
  "quarto 3":t("Quarto 3"), "quarto 4":t("Quarto 4"), "carcassa intera":t("Carcassa intera") }[p] || p);
const fData = d => d ? d.split("-").reverse().join("/") : "—";
const icona = s => ({ bovino:"🐄", suino:"🐷", ovino:"🐑" }[s] || "🐾");
const vuoto = v => v === null || v === undefined || String(v).trim() === "";
const num = v => vuoto(v) ? null : parseFloat(String(v).replace(",", "."));
const inputStyle = { width:"100%", boxSizing:"border-box", border:`1.5px solid ${C.border}`, borderRadius:10,
  padding:"10px 12px", fontSize:15, background:"#FAFAF8", color:C.text, outline:"none" };

// Messaggio leggibile quando il database rifiuta (capo o pezzo gia' fatturato)
const messaggioErrore = err => {
  const m = err?.message || String(err || "");
  if (m.includes("PEZZO GIÀ FATTURATO") || m.includes("CAPO GIÀ FATTURATO"))
    return t("Capo già fatturato: per cambiare carcassa, cliente, partite o pesi va prima annullata la fattura.") + " (" + m + ")";
  return m;
};

// Righe di fattura ATTIVE per capo: { uscita_consegna_id: ["numero fattura", ...] }
async function fattureAttive(idsCapi) {
  if (!idsCapi.length) return {};
  const { data, error } = await supabase.from("ci_fatture_emesse_righe")
    .select("uscita_consegna_id,ci_fatture_emesse(numero)").eq("attiva", true).in("uscita_consegna_id", idsCapi);
  if (error) throw error;
  const out = {};
  (data || []).forEach(r => {
    const n = r.ci_fatture_emesse?.numero || "?";
    out[r.uscita_consegna_id] = [...new Set([...(out[r.uscita_consegna_id] || []), n])];
  });
  return out;
}

// Capi usciti per macellazione dal INIZIO_CONSEGNE, con pezzi e stato della fatturazione
async function caricaUscite() {
  const [an, un, co, pz, ab] = await Promise.all([
    supabase.from("animali").select("id,bdn,nome,specie,data_uscita,motivo_uscita,peso_vivo_uscita,peso_carcassa")
      .neq("stato", "attivo").gte("data_uscita", INIZIO_CONSEGNE).in("motivo_uscita", MACELLAZIONE),
    supabase.from("suini_lotto").select("id,nr,codice_completo,lotto_id,data_uscita,motivo_uscita,peso_vivo_uscita,peso_carcassa,lotti_suini(codice_lotto,codice)")
      .eq("vivo", false).gte("data_uscita", INIZIO_CONSEGNE).in("motivo_uscita", MACELLAZIONE),
    supabase.from("uscite_consegne").select("*"),
    supabase.from("uscite_consegne_pezzi").select("*"),
    supabase.from("modelli4_abbinamenti").select("animale_id,suino_lotto_id,modelli4_documenti(id,numero_documento,destinatario)"),
  ]);
  const errore = [an, un, co, pz, ab].find(r => r.error);
  if (errore) throw errore.error;
  const consegne = co.data || [];
  const pezzi = pz.data || [];
  const abb = ab.data || [];
  const fatt = await fattureAttive(consegne.map(c => c.id));
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
    c.pezzi = k ? pezzi.filter(p => p.uscita_consegna_id === k.id) : [];
    c.fatture = k ? (fatt[k.id] || []) : [];
    c.fatturato = c.fatture.length > 0;
    const servono = pezziDi(c.specie);
    const partiteComplete = servono.length > 0 && servono.every(p => c.pezzi.some(x => x.pezzo === p && !vuoto(x.numero_partita)));
    c.completo = c.fatturato || (!!k && !vuoto(k.peso_carcassa) && !vuoto(k.cliente_nome) && partiteComplete);
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
  const servono = pezziDi(capo.specie);
  const [f, setF] = useState({
    peso_vivo: k.peso_vivo ?? capo.peso_vivo ?? "",
    peso_carcassa: k.peso_carcassa ?? capo.peso_carcassa ?? "",
    cliente_nome: k.cliente_nome ?? "",
  });
  const [pz, setPz] = useState(() => servono.map(p => {
    const e = capo.pezzi.find(x => x.pezzo === p) || {};
    return { pezzo:p, id:e.id ?? null, numero_partita:e.numero_partita ?? "", peso_kg:e.peso_kg ?? "", cliente_nome:e.cliente_nome ?? "" };
  }));
  const [salvo, setSalvo] = useState(false);
  const [errore, setErrore] = useState("");
  const nomiClienti = [...new Set(clienti.map(c => c.nome))].sort();
  const inElenco = nomiClienti.includes(f.cliente_nome);
  const [scrivi, setScrivi] = useState(!vuoto(k.cliente_nome) && !clienti.some(c => c.nome === k.cliente_nome));
  const pv = num(f.peso_vivo), pc = num(f.peso_carcassa);
  const resa = pv && pc ? Math.round(pc / pv * 1000) / 10 : null;
  const setPezzo = (i, campo, val) => setPz(pz.map((x, j) => j === i ? { ...x, [campo]:val } : x));
  // avviso arancione: tutti i pezzi pesati ma la somma non torna con la carcassa
  const pesi = pz.map(x => num(x.peso_kg));
  const sommaPesi = pesi.every(v => v !== null && !isNaN(v)) ? Math.round(pesi.reduce((s, v) => s + v, 0) * 100) / 100 : null;
  const pesiNonTornano = sommaPesi !== null && pc !== null && Math.abs(sommaPesi - pc) > 0.005;

  // capo gia' fatturato: solo lettura
  if (capo.fatturato) return (
    <div>
      <button onClick={onChiudi} style={{ background:"none", border:"none", fontSize:14, color:C.primary, cursor:"pointer", padding:0, marginBottom:10 }}>← {t("Torna all'elenco")}</button>
      <div style={{ background:"#FFF", borderRadius:14, padding:12, marginBottom:12, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:16, fontWeight:800 }}>{icona(capo.specie)} {capo.matricola}</div>
        <div style={{ fontSize:13, color:C.green, fontWeight:700, marginTop:6 }}>🧾 {t("fatturato")} — {capo.fatture.join(", ")}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>{t("Capo già fatturato: per cambiare carcassa, cliente, partite o pesi va prima annullata la fattura.")}</div>
        <div style={{ fontSize:13, marginTop:8 }}>{t("Carcassa")} {k.peso_carcassa ?? "—"} kg · {k.cliente_nome || "—"}</div>
        {capo.pezzi.map(p => (
          <div key={p.id} style={{ fontSize:13, marginTop:4 }}>
            {nomePezzo(p.pezzo)}: {t("partita")} <b>{p.numero_partita}</b>{p.peso_kg ? ` · ${p.peso_kg} kg` : ""}{p.cliente_nome ? ` · ${p.cliente_nome}` : ""}
          </div>
        ))}
      </div>
    </div>
  );

  const salva = async () => {
    if (!servono.length) { setErrore(t("Specie del capo non riconosciuta: impossibile stabilire i pezzi")); return; }
    if (vuoto(f.peso_carcassa) || vuoto(f.cliente_nome) || pz.some(x => vuoto(x.numero_partita))) {
      setErrore(t("Inserire peso della carcassa, cliente e il numero di partita di ogni pezzo")); return;
    }
    if (pc === null || isNaN(pc) || pc <= 0 || (pv !== null && (isNaN(pv) || pv <= 0))) { setErrore(t("I pesi devono essere numeri maggiori di zero")); return; }
    if (pz.some(x => { const v = num(x.peso_kg); return v !== null && (isNaN(v) || v <= 0); })) { setErrore(t("I pesi devono essere numeri maggiori di zero")); return; }
    setSalvo(true); setErrore("");
    try {
      // 0) controllo fresco: nel frattempo il capo puo' essere stato fatturato
      if (capo.consegna) {
        const fatt = await fattureAttive([capo.consegna.id]);
        if ((fatt[capo.consegna.id] || []).length) throw new Error(t("Capo già fatturato: per cambiare carcassa, cliente, partite o pesi va prima annullata la fattura."));
      }
      // 1) pacchetto per la fatturazione (uscite_consegne) — se il database rifiuta, non si tocca altro
      const cliente = clienti.find(c => c.nome === f.cliente_nome.trim());
      const riga = {
        animale_id:capo.animale_id, suino_lotto_id:capo.suino_lotto_id, specie:capo.specie,
        matricola:capo.matricola, lotto:capo.lotto, data_uscita:capo.data_uscita,
        modello4_documento_id:capo.doc?.id ?? null, modello4_numero:capo.doc?.numero_documento ?? null,
        destinatario:capo.doc?.destinatario ?? null,
        peso_vivo:pv, peso_carcassa:pc, resa_percentuale:resa,
        cliente_id:cliente?.id ?? null, cliente_nome:f.cliente_nome.trim(),
        aggiornato_il:new Date().toISOString(),
      };
      const r1 = capo.consegna
        ? await supabase.from("uscite_consegne").update(riga).eq("id", capo.consegna.id).select("id").single()
        : await supabase.from("uscite_consegne").insert(riga).select("id").single();
      if (r1.error) throw r1.error;
      const idCapo = r1.data.id;
      // 2) un numero di partita per ogni pezzo
      for (const x of pz) {
        const cp = clienti.find(c => c.nome === (x.cliente_nome || "").trim());
        const dati = {
          numero_partita:x.numero_partita.trim(), peso_kg:num(x.peso_kg),
          cliente_id:vuoto(x.cliente_nome) ? null : (cp?.id ?? null),
          cliente_nome:vuoto(x.cliente_nome) ? null : x.cliente_nome.trim(),
        };
        const r2 = x.id
          ? await supabase.from("uscite_consegne_pezzi").update(dati).eq("id", x.id)
          : await supabase.from("uscite_consegne_pezzi").insert({ ...dati, uscita_consegna_id:idCapo, pezzo:x.pezzo });
        if (r2.error) throw r2.error;
      }
      // 3) per ultima, la scheda dell'animale / unita' del lotto
      const agg = { peso_vivo_uscita:pv, peso_carcassa:pc, resa_percent:resa };
      const r3 = capo.animale_id
        ? await supabase.from("animali").update(agg).eq("id", capo.animale_id)
        : await supabase.from("suini_lotto").update(agg).eq("id", capo.suino_lotto_id);
      if (r3.error) throw r3.error;
      setSalvo(false);
      onSalvato();
    } catch (e) {
      setSalvo(false);
      setErrore(messaggioErrore(e));
    }
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
      <div style={{ fontSize:13, fontWeight:800, color:C.primary, margin:"6px 0 8px" }}>
        {t("Numeri di partita del cliente: uno per ogni pezzo")}
      </div>
      {!servono.length && <div style={{ color:C.red, fontSize:13, marginBottom:10 }}>⚠️ {t("Specie del capo non riconosciuta: impossibile stabilire i pezzi")}</div>}
      {pz.map((x, i) => (
        <div key={x.pezzo} style={{ background:"#FFF", border:`1px solid ${C.border}`, borderRadius:12, padding:10, marginBottom:8 }}>
          <div style={{ fontSize:13, fontWeight:800, marginBottom:6 }}>{nomePezzo(x.pezzo)}</div>
          <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:8 }}>
            <Campo label={t("Numero di partita") + " *"}>
              <input value={x.numero_partita} onChange={e => setPezzo(i, "numero_partita", e.target.value)} style={inputStyle}
                placeholder={t("Numero del cliente")}/>
            </Campo>
            <Campo label={t("Peso del pezzo (kg)")}>
              <input type="number" inputMode="decimal" value={x.peso_kg} onChange={e => setPezzo(i, "peso_kg", e.target.value)} style={inputStyle}/>
            </Campo>
          </div>
          <Campo label={t("Cliente di questo pezzo (se diverso)")}>
            <select value={x.cliente_nome} onChange={e => setPezzo(i, "cliente_nome", e.target.value)} style={inputStyle}>
              <option value="">{t("— stesso cliente del capo —")}</option>
              {[...new Set([...nomiClienti, ...(vuoto(x.cliente_nome) ? [] : [x.cliente_nome])])].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Campo>
        </div>
      ))}
      {pesiNonTornano && (
        <div style={{ background:C.orange + "18", border:`1.5px solid ${C.orange}`, color:C.orange, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:600, marginBottom:10 }}>
          ⚠️ {t("La somma dei pesi dei pezzi ({0} kg) non torna con il peso della carcassa ({1} kg)", { 0:sommaPesi, 1:pc })}
        </div>
      )}
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
  const [erroreCarica, setErroreCarica] = useState("");

  const carica = async () => {
    try { setCapi(await caricaUscite()); setErroreCarica(""); }
    catch (e) { setErroreCarica(e?.message || String(e)); setCapi([]); }
  };
  useEffect(() => {
    carica();
    supabase.from("ci_clienti").select("id,nome").then(({ data }) => setClienti((data || []).filter(c => c.nome)));
  }, []);

  if (!capi) return null;
  const daFare = capi.filter(c => !c.completo);
  if (!aperto && daFare.length === 0 && !erroreCarica) return null;

  if (!aperto) return (
    <div onClick={() => setAperto(true)} style={{ cursor:"pointer", background:C.red + "12", border:`1.5px solid ${C.red}55`,
      borderRadius:16, padding:14, marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ fontSize:13, fontWeight:800, color:C.red, marginBottom:4 }}>🔪 {t("Animali usciti per la macellazione")}</div>
        <div style={{ fontSize:12, color:C.text }}>
          {erroreCarica
            ? "⚠️ " + t("Errore nel caricamento delle consegne") + ": " + erroreCarica
            : t("{n} capi da completare: peso della carcassa, cliente e partite dei pezzi", { n:daFare.length })}
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
          {erroreCarica && <div style={{ color:C.red, fontSize:13, marginBottom:10 }}>⚠️ {t("Errore nel caricamento delle consegne")}: {erroreCarica}</div>}
          <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>
            {t("Tocca un capo per inserire peso della carcassa, cliente e il numero di partita di ogni pezzo: 2 mezzene per i suini, 4 quarti per i bovini, la carcassa intera per gli ovini.")}
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
                {c.fatturato
                  ? `🧾 ${t("fatturato")} — ${c.fatture.join(", ")}`
                  : c.completo
                    ? `✅ ${t("Carcassa")} ${c.consegna.peso_carcassa} kg · ${t("partite")} ${c.pezzi.map(p => p.numero_partita).join(", ")} · ${c.consegna.cliente_nome}`
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
    (async () => {
      const { data } = await supabase.from("uscite_consegne").select("id,specie,numero_partita,cliente_nome").eq("animale_id", animaleId).maybeSingle();
      if (!data) { if (vivo) setK(null); return; }
      const [pz, fatt] = await Promise.all([
        supabase.from("uscite_consegne_pezzi").select("pezzo,numero_partita,peso_kg,cliente_nome").eq("uscita_consegna_id", data.id),
        fattureAttive([data.id]).catch(() => ({})),
      ]);
      if (vivo) setK({ ...data, pezzi:pz.data || [], fatture:fatt[data.id] || [] });
    })();
    return () => { vivo = false; };
  }, [animaleId]);
  if (!k) return null;
  const riga = (label, val) => val ? (
    <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
      <span style={{ color:C.muted, fontSize:13 }}>{label}</span>
      <span style={{ fontWeight:600, textAlign:"right", maxWidth:"60%" }}>{val}</span>
    </div>
  ) : null;
  const ordine = p => ["mezzena 1","mezzena 2","quarto 1","quarto 2","quarto 3","quarto 4","carcassa intera"].indexOf(p);
  return (<>
    {k.pezzi.length
      ? [...k.pezzi].sort((a, b) => ordine(a.pezzo) - ordine(b.pezzo)).map(p =>
          riga(`${t("Numero di partita")} — ${nomePezzo(p.pezzo)}`,
               `${p.numero_partita}${p.peso_kg ? ` · ${p.peso_kg} kg` : ""}${p.cliente_nome ? ` · ${p.cliente_nome}` : ""}`))
      : riga(t("Numero di partita del cliente"), k.numero_partita)}
    {riga(t("Cliente"), k.cliente_nome)}
    {riga(t("Fatturazione"), k.fatture.length ? `${t("fatturato")} — ${k.fatture.join(", ")}`
      : pezziDi(k.specie).every(p => k.pezzi.some(x => x.pezzo === p && !vuoto(x.numero_partita))) && pezziDi(k.specie).length
        ? t("pronto da fatturare") : t("Da completare"))}
  </>);
}
