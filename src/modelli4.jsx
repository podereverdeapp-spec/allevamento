// ============================================================================
// MODELLI 4 — v121
// ----------------------------------------------------------------------------
// Archivio dei Documenti di accompagnamento (modelli 4) della Banca Dati
// Nazionale: elenco con ricerca per matricola, numero, macello; dettaglio dei
// capi; apertura del PDF originale; caricamento di nuovi PDF (uno o piu'
// insieme), che vengono letti in automatico e salvati.
// Dati: tabelle modelli4_documenti e modelli4_capi. PDF: archivio "modelli4"
// di Supabase Storage (privato, si apre con un collegamento temporaneo).
// ============================================================================
import { useState, useEffect, useMemo, useRef } from "react";
import { t } from "./i18n";
import { supabase } from "./supabase";
import { caricaPdfjs, testoDaPdf, leggiModello4 } from "./modelli4_lettura";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  bovini:"#8B6914", suini:"#B5547A", ovini:"#4A7C59",
};
const gruppo = s => (s === "Ovicaprini" || s === "Caprini") ? "Ovini" : s;
const specieIcon  = s => ({ Bovini:"🐄", Suini:"🐷", Ovini:"🐑" }[gruppo(s)] || "🐾");
const specieColor = s => ({ Bovini:C.bovini, Suini:C.suini, Ovini:C.ovini }[gruppo(s)] || C.muted);
const fData = d => d ? d.split("-").reverse().join("/") : "—";
const USCITA_PV = "Uscita da Podere Verde";
const BUCKET = "modelli4";
// v123 — da questa data in poi le uscite vanno abbinate ai modelli 4 (prima no)
const INIZIO_ABBINAMENTI = "2026-09-24";
const numAbbinati = d => (d.modelli4_abbinamenti || []).length;

const inputStyle = { width:"100%", boxSizing:"border-box", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"10px 12px", fontSize:15, background:"#FAFAF8", color:C.text, outline:"none" };
const Card = ({ children, style = {} }) => (
  <div style={{ background:C.card, borderRadius:16, padding:14, marginBottom:10,
    boxShadow:"0 2px 8px rgba(0,0,0,0.08)", border:`1px solid ${C.border}`, ...style }}>{children}</div>
);
const Btn = ({ label, icon, onClick, variant = "primary", small = false, disabled = false }) => {
  const bg = { primary:C.primary, danger:C.red, success:C.green, outline:"transparent" }[variant] || C.primary;
  const fg = variant === "outline" ? C.primary : "#FFF";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", gap:6, background:bg, color:fg,
        border:variant === "outline" ? `1.5px solid ${C.primary}` : "none", borderRadius:10,
        padding:small ? "6px 12px" : "10px 16px", fontSize:small ? 13 : 14, fontWeight:600,
        cursor:disabled ? "default" : "pointer", opacity:disabled ? 0.5 : 1 }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
};
const Riga = ({ label, value }) => value ? (
  <div style={{ display:"flex", gap:8, fontSize:13, padding:"3px 0", borderBottom:`1px dashed ${C.border}` }}>
    <div style={{ color:C.muted, minWidth:128, flexShrink:0 }}>{label}</div>
    <div style={{ color:C.text, fontWeight:600, wordBreak:"break-word" }}>{value}</div>
  </div>
) : null;

// ─── CARICAMENTO PDF ─────────────────────────────────────────────────────────
function Caricamento({ onFine }) {
  const [lavoro, setLavoro] = useState(false);
  const [esiti, setEsiti] = useState([]);
  const inputRef = useRef(null);

  const percorso = d => `${d.numero_documento}_${d.codice_controllo || "senza-codice"}.pdf`;

  const carica = async (files) => {
    if (!files?.length) return;
    setLavoro(true); setEsiti([]);
    let pdfjsLib;
    try { pdfjsLib = await caricaPdfjs(); }
    catch (e) { setEsiti([{ nome:"", stato:"errore", testo:t("Impossibile caricare il lettore PDF. Controllare la connessione e riprovare.") }]); setLavoro(false); return; }
    const out = [];
    for (const f of Array.from(files)) {
      const voce = { nome:f.name };
      try {
        const buf = await f.arrayBuffer();
        const testo = await testoDaPdf(pdfjsLib, new Uint8Array(buf.slice(0)));
        const letto = leggiModello4(testo);
        if (!letto) { out.push({ ...voce, stato:"scartato", testo:t("Non è un modello 4 (o è una scansione senza testo)") }); setEsiti([...out]); continue; }
        const d = letto.documento;
        const path = percorso(d);
        const { error: eUp } = await supabase.storage.from(BUCKET).upload(path, new Blob([buf], { type:"application/pdf" }), { upsert:true, contentType:"application/pdf" });
        if (eUp) throw eUp;
        const { data: esiste } = await supabase.from("modelli4_documenti").select("id,file_percorso")
          .eq("numero_documento", d.numero_documento).eq("codice_controllo", d.codice_controllo).maybeSingle();
        if (esiste) {
          const { error } = await supabase.from("modelli4_documenti").update({ file_nome:f.name, file_percorso:path }).eq("id", esiste.id);
          if (error) throw error;
          out.push({ ...voce, stato:"collegato", testo:t("Già in archivio: PDF collegato") + ` — ${d.numero_documento}` });
        } else {
          const { data: nuovo, error } = await supabase.from("modelli4_documenti")
            .insert({ ...d, file_nome:f.name, file_percorso:path }).select("id").single();
          if (error) throw error;
          if (letto.capi.length) {
            const { error: e2 } = await supabase.from("modelli4_capi").insert(letto.capi.map(c => ({ ...c, documento_id:nuovo.id })));
            if (e2) throw e2;
          }
          out.push({ ...voce, stato:"nuovo", testo:t("Nuovo modello 4 salvato: {n} — {s}, {c} capi, uscita {d}",
            { n:d.numero_documento, s:t(d.specie || ""), c:d.numero_capi ?? "?", d:fData(d.data_uscita) }) });
        }
      } catch (e) {
        out.push({ ...voce, stato:"errore", testo:t("Errore") + ": " + (e.message || String(e)) });
      }
      setEsiti([...out]);
    }
    setLavoro(false);
    if (inputRef.current) inputRef.current.value = "";
    onFine();
  };

  const col = { nuovo:C.green, collegato:C.blue, scartato:C.yellow, errore:C.red };
  const icona = { nuovo:"✅", collegato:"🔗", scartato:"⚠️", errore:"❌" };
  return (
    <Card style={{ background:"#FFFDF7" }}>
      <div style={{ fontWeight:700, color:C.primary, marginBottom:6 }}>📥 {t("Carica modelli 4 (PDF)")}</div>
      <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>
        {t("Si possono scegliere più PDF insieme. L'app legge ogni documento e salva numero, date, specie, capi e destinazione. Se il modello 4 è già in archivio, collega solo il PDF.")}
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple disabled={lavoro}
        onChange={e => carica(e.target.files)} style={{ fontSize:13, marginBottom:8, width:"100%" }}/>
      {lavoro && <div style={{ fontSize:13, color:C.muted }}>⏳ {t("Lettura in corso: {n} di {m}", { n:esiti.length, m:inputRef.current?.files?.length || "?" })}</div>}
      {esiti.length > 0 && (
        <div style={{ marginTop:8, maxHeight:260, overflowY:"auto" }}>
          {esiti.map((e, i) => (
            <div key={i} style={{ fontSize:12, padding:"4px 0", borderBottom:`1px solid ${C.border}`, color:col[e.stato] }}>
              {icona[e.stato]} <b style={{ color:C.text }}>{e.nome}</b><br/>{e.testo}
            </div>
          ))}
          {!lavoro && (
            <div style={{ fontSize:12, fontWeight:700, color:C.primary, paddingTop:6 }}>
              {t("Nuovi: {a} · PDF collegati: {b} · Scartati: {c} · Errori: {d}", {
                a:esiti.filter(e => e.stato === "nuovo").length, b:esiti.filter(e => e.stato === "collegato").length,
                c:esiti.filter(e => e.stato === "scartato").length, d:esiti.filter(e => e.stato === "errore").length })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── SCHEDA DOCUMENTO ─────────────────────────────────────────────────────────
function Documento({ d, doppio, admin, onElimina, animaliPerMatricola, onAggiorna }) {
  const [aperto, setAperto] = useState(false);
  const capi = d.modelli4_capi || [];
  const col = specieColor(d.specie);
  const altro = d.tipo_movimento !== USCITA_PV;
  const abbinati = numAbbinati(d);
  const daRegistrare = !altro && d.data_uscita >= INIZIO_ABBINAMENTI && abbinati < (d.numero_capi || 0);

  // v123 — registra l'uscita nell'app di un capo con matricola scritto nel modello 4
  const registraUscita = async (a) => {
    const macello = d.destinazione_tipo === "Macello";
    if (!window.confirm(t("Registrare l'uscita di {0} il {1} ({2}) con il modello 4 {3}?",
      { 0:a.bdn, 1:fData(d.data_uscita), 2:macello ? t("Macellato") : t("Venduto vivo"), 3:d.numero_documento }))) return;
    const { error } = await supabase.from("animali").update({
      stato: macello ? "macellato" : "venduto", vivo:false,
      motivo_uscita: macello ? "Macellato" : "Venduto vivo", data_uscita: d.data_uscita,
    }).eq("id", a.id);
    if (error) { window.alert(t("Errore") + ": " + error.message); return; }
    await supabase.from("modelli4_abbinamenti").delete().eq("animale_id", a.id);
    const { error: e2 } = await supabase.from("modelli4_abbinamenti").insert({ documento_id:d.id, animale_id:a.id, numero_capi:1 });
    if (e2) window.alert(t("Errore") + ": " + e2.message);
    onAggiorna();
  };

  const apriPdf = async () => {
    const w = window.open("", "_blank");
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(d.file_percorso, 300);
    if (error || !data?.signedUrl) { if (w) w.close(); window.alert(t("PDF non disponibile")); return; }
    if (w) w.location.href = data.signedUrl; else window.location.href = data.signedUrl;
  };

  return (
    <Card style={{ borderLeft:`5px solid ${col}`, background:doppio ? "#FFF8E1" : C.card }}>
      <div onClick={() => setAperto(!aperto)} style={{ cursor:"pointer" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text }}>
              {specieIcon(d.specie)} {fData(d.data_uscita)} · {d.numero_capi ?? "?"} {t("capi")}
            </div>
            <div style={{ fontSize:13, color:C.text, marginTop:2 }}>
              {d.destinazione_tipo === "Macello" ? "🔪" : "🏡"} {d.destinatario || "—"}
            </div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{t(d.specie || "")} · {d.numero_documento}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
            <span style={{ fontSize:18, color:C.muted }}>{aperto ? "▲" : "▼"}</span>
            {d.file_percorso ? <span style={{ fontSize:11 }}>📄</span> : null}
          </div>
        </div>
        {altro && <div style={{ fontSize:11, fontWeight:700, color:C.blue, marginTop:4 }}>↔️ {d.tipo_movimento}</div>}
        {!altro && d.data_uscita >= INIZIO_ABBINAMENTI && (
          <div style={{ fontSize:11, fontWeight:700, marginTop:4, color: daRegistrare ? C.red : C.green }}>
            {daRegistrare ? "⏳ " : "✅ "}{t("Uscite registrate nell'app: {0} di {1}", { 0:abbinati, 1:d.numero_capi ?? "?" })}
          </div>
        )}
        {doppio && <div style={{ fontSize:11, fontWeight:700, color:"#9A6B00", marginTop:4 }}>
          ⚠️ {t("Stesso numero emesso due volte con codice di controllo diverso: verificare in Banca Dati Nazionale quale è valido")}
        </div>}
      </div>

      {aperto && (
        <div style={{ marginTop:10 }}>
          <Riga label={t("Numero documento")} value={d.numero_documento}/>
          <Riga label={t("Data documento")} value={fData(d.data_documento)}/>
          <Riga label={t("Data di uscita prevista")} value={fData(d.data_uscita)}/>
          <Riga label={t("Progressivo di allevamento")} value={d.progressivo_allevamento}/>
          <Riga label={t("Codice di controllo")} value={d.codice_controllo}/>
          <Riga label={t("Destinazione")} value={t(d.destinazione_tipo || "")}/>
          <Riga label={t("Destinatario")} value={d.destinatario}/>
          <Riga label={t("Codice di destinazione")} value={d.destinatario_codice}/>
          <Riga label={t("Numero di riconoscimento")} value={d.numero_riconoscimento}/>
          <Riga label={t("Indirizzo")} value={d.destinatario_indirizzo}/>
          <Riga label={t("Partenza")} value={d.data_trasporto ? `${fData(d.data_trasporto)}${d.ora_partenza ? " " + d.ora_partenza : ""}` : null}/>
          <Riga label={t("Trasportatore")} value={d.trasportatore}/>
          <Riga label={t("Ditta di trasporto")} value={d.ditta_trasporto}/>
          <Riga label={t("Email")} value={d.email_oggetto ? `${fData(d.email_data)} — ${d.email_oggetto}` : null}/>

          <div style={{ fontSize:13, fontWeight:700, color:C.primary, margin:"12px 0 6px" }}>
            {t("Capi nel documento")} ({capi.reduce((s, c) => s + (c.numero_capi || 0), 0)})
          </div>
          {capi.map(c => (
            <div key={c.id} style={{ background:C.bg, borderRadius:10, padding:"8px 10px", marginBottom:6, fontSize:12 }}>
              <div style={{ fontWeight:800, color:C.text, fontSize:13 }}>
                {c.matricola}{c.riferimento_insieme ? ` · ${t("insieme")} ${c.riferimento_insieme}` : ""}
              </div>
              <div style={{ color:C.muted }}>
                {[c.categoria && `${c.categoria} × ${c.numero_capi}`, c.specie && t(c.specie), c.sesso && t(c.sesso), c.razza,
                  c.data_nascita && `${t("nato il")} ${fData(c.data_nascita)}`, c.eta_mesi && t("{n} mesi", { n:c.eta_mesi })]
                  .filter(Boolean).join(" · ")}
              </div>
              {c.provenienza && <div style={{ color:C.muted }}>{t("Provenienza")}: {c.provenienza}{c.data_ingresso ? ` · ${t("ingresso")} ${fData(c.data_ingresso)}` : ""}</div>}
              {!altro && /^[A-Z]{2}\d/.test(c.matricola || "") && (() => {
                const a = animaliPerMatricola[c.matricola];
                if (!a) return <div style={{ color:C.red, fontWeight:700, marginTop:2 }}>⚠️ {t("Matricola non registrata nell'app")}</div>;
                const qui = (d.modelli4_abbinamenti || []).some(x => x.animale_id === a.id);
                if (qui) return <div style={{ color:C.green, fontWeight:700, marginTop:2 }}>✅ {t("Uscita registrata nell'app")} ({a.nome || a.bdn})</div>;
                if (a.stato !== "attivo") return <div style={{ color:C.muted, marginTop:2 }}>{t("Nell'app: {0}, uscita {1}", { 0:a.stato, 1:fData(a.data_uscita) })}</div>;
                return (
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                    <span style={{ color:C.red, fontWeight:700 }}>⏳ {t("Ancora attivo nell'app")}</span>
                    <Btn small icon="📤" label={t("Registra uscita")} onClick={() => registraUscita(a)}/>
                  </div>
                );
              })()}
            </div>
          ))}

          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {d.file_percorso
              ? <Btn icon="📄" label={t("Apri PDF")} onClick={apriPdf} small/>
              : <span style={{ fontSize:12, color:C.muted }}>{t("PDF non ancora caricato")}</span>}
            {admin && <Btn icon="🗑️" label={t("Elimina")} variant="danger" small onClick={() => onElimina(d)}/>}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── PAGINA ───────────────────────────────────────────────────────────────────
export default function Modelli4() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [specie, setSpecie] = useState("Tutti");
  const [anno, setAnno] = useState("Tutti");
  const [movimento, setMovimento] = useState("uscite");
  const [cerca, setCerca] = useState("");
  const [mostraCarica, setMostraCarica] = useState(false);
  const [quanti, setQuanti] = useState(30);
  const [animaliPerMatricola, setAnimaliPerMatricola] = useState({});

  const carica = async () => {
    const { data, error } = await supabase.from("modelli4_documenti")
      .select("*, modelli4_capi(*), modelli4_abbinamenti(id,animale_id,suino_lotto_id)").order("data_uscita", { ascending:false }).order("numero_documento", { ascending:false });
    if (!error) {
      setDocs(data || []);
      const matricole = [...new Set((data || []).flatMap(d => (d.modelli4_capi || []).map(c => c.matricola)).filter(m => /^[A-Z]{2}\d/.test(m || "")))];
      const mappa = {};
      for (let i = 0; i < matricole.length; i += 150) {
        const { data: an } = await supabase.from("animali").select("id,bdn,nome,stato,data_uscita").in("bdn", matricole.slice(i, i + 150));
        (an || []).forEach(a => { mappa[String(a.bdn).replace(/\s/g, "").toUpperCase()] = a; });
      }
      setAnimaliPerMatricola(mappa);
    }
    setLoading(false);
  };
  useEffect(() => {
    carica();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) return;
      const { data: p } = await supabase.from("profili").select("ruolo").eq("id", data.user.id).single();
      setAdmin(p?.ruolo === "admin");
    });
  }, []);

  const anni = useMemo(() => [...new Set(docs.map(d => d.data_uscita?.slice(0, 4)).filter(Boolean))].sort().reverse(), [docs]);
  const doppi = useMemo(() => {
    const n = {}; docs.forEach(d => { const k = d.numero_documento + "|" + d.specie; n[k] = (n[k] || 0) + 1; });
    return new Set(Object.keys(n).filter(k => n[k] > 1));
  }, [docs]);

  const filtrati = useMemo(() => {
    const q = cerca.trim().toLowerCase();
    return docs.filter(d => {
      if (specie !== "Tutti" && gruppo(d.specie) !== specie) return false;
      if (anno !== "Tutti" && d.data_uscita?.slice(0, 4) !== anno) return false;
      if (movimento === "uscite" && d.tipo_movimento !== USCITA_PV) return false;
      if (movimento === "altri" && d.tipo_movimento === USCITA_PV) return false;
      if (movimento === "da_registrare" && !(d.tipo_movimento === USCITA_PV && d.data_uscita >= INIZIO_ABBINAMENTI && numAbbinati(d) < (d.numero_capi || 0))) return false;
      if (!q) return true;
      const testo = [d.numero_documento, d.destinatario, d.destinatario_codice, d.trasportatore, d.email_oggetto, d.file_nome,
        ...(d.modelli4_capi || []).flatMap(c => [c.matricola, c.riferimento_insieme, c.categoria, c.razza])].join(" ").toLowerCase();
      return testo.includes(q);
    });
  }, [docs, specie, anno, movimento, cerca]);

  const totCapi = filtrati.reduce((s, d) => s + (d.numero_capi || 0), 0);
  const perSpecie = ["Bovini", "Suini", "Ovini"].map(s => ({ s,
    doc:filtrati.filter(d => gruppo(d.specie) === s).length,
    capi:filtrati.filter(d => gruppo(d.specie) === s).reduce((a, d) => a + (d.numero_capi || 0), 0) }));
  const senzaPdf = docs.filter(d => !d.file_percorso).length;

  const elimina = async (d) => {
    if (!window.confirm(t("Eliminare il modello 4 {n}? Verranno cancellati anche i capi e il PDF.", { n:d.numero_documento }))) return;
    if (d.file_percorso) await supabase.storage.from(BUCKET).remove([d.file_percorso]);
    const { error } = await supabase.from("modelli4_documenti").delete().eq("id", d.id);
    if (error) window.alert(t("Errore") + ": " + error.message);
    carica();
  };

  const chip = (val, sel, onClick, label, col = C.primary) => (
    <button key={val} onClick={onClick}
      style={{ background:sel ? col : C.card, color:sel ? "#FFF" : C.muted, border:`1.5px solid ${sel ? col : C.border}`,
        borderRadius:20, padding:"5px 12px", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
      {label}
    </button>
  );

  return (
    <div style={{ padding:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, gap:8 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:C.primary }}>📄 {t("Modelli 4")}</div>
          <div style={{ fontSize:12, color:C.muted }}>{t("Documenti di accompagnamento degli animali")}</div>
        </div>
        <Btn icon={mostraCarica ? "✖" : "📥"} label={mostraCarica ? t("Chiudi") : t("Carica PDF")} small
          variant={mostraCarica ? "outline" : "primary"} onClick={() => setMostraCarica(!mostraCarica)}/>
      </div>

      {mostraCarica && <Caricamento onFine={carica}/>}

      <input value={cerca} onChange={e => { setCerca(e.target.value); setQuanti(30); }}
        placeholder={t("🔍 Cerca matricola, numero, macello...")} style={{ ...inputStyle, marginBottom:10 }}/>

      <div style={{ display:"flex", gap:6, marginBottom:8, overflowX:"auto", paddingBottom:4 }}>
        {chip("Tutti", specie === "Tutti", () => setSpecie("Tutti"), t("🐾 Tutti"))}
        {["Bovini", "Suini", "Ovini"].map(s => chip(s, specie === s, () => setSpecie(s), `${specieIcon(s)} ${t(s)}`, specieColor(s)))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <select value={anno} onChange={e => setAnno(e.target.value)} style={{ ...inputStyle, padding:"8px 10px", fontSize:14 }}>
          <option value="Tutti">{t("Tutti gli anni")}</option>
          {anni.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={movimento} onChange={e => setMovimento(e.target.value)} style={{ ...inputStyle, padding:"8px 10px", fontSize:14 }}>
          <option value="uscite">{t("Uscite da Podere Verde")}</option>
          <option value="da_registrare">{t("Uscite da registrare nell'app")}</option>
          <option value="altri">{t("Altri movimenti")}</option>
          <option value="tutti">{t("Tutti i movimenti")}</option>
        </select>
      </div>

      <Card style={{ background:C.primary, border:"none" }}>
        <div style={{ display:"flex", justifyContent:"space-around", color:"#FFF", textAlign:"center" }}>
          <div><div style={{ fontSize:22, fontWeight:800 }}>{filtrati.length}</div><div style={{ fontSize:11, opacity:0.85 }}>{t("documenti")}</div></div>
          <div><div style={{ fontSize:22, fontWeight:800 }}>{totCapi}</div><div style={{ fontSize:11, opacity:0.85 }}>{t("capi")}</div></div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-around", color:"#FFF", fontSize:12, marginTop:8, opacity:0.9 }}>
          {perSpecie.map(p => <div key={p.s}>{specieIcon(p.s)} {p.doc} · {p.capi} {t("capi")}</div>)}
        </div>
      </Card>

      {(() => {
        const n = docs.filter(d => d.tipo_movimento === USCITA_PV && d.data_uscita >= INIZIO_ABBINAMENTI && numAbbinati(d) < (d.numero_capi || 0)).length;
        return n > 0 && !loading && movimento !== "da_registrare" ? (
          <div onClick={() => setMovimento("da_registrare")} style={{ cursor:"pointer", background:"#FDE9E7", border:`1.5px solid ${C.red}`,
            borderRadius:12, padding:"10px 12px", marginBottom:10, fontSize:13, fontWeight:700, color:C.red }}>
            ⏳ {t("{n} modelli 4 con uscite ancora da registrare nell'app — tocca per vederli", { n })}
          </div>
        ) : null;
      })()}

      {senzaPdf > 0 && !loading && (
        <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>
          📎 {t("{n} documenti in archivio senza PDF: caricare i PDF con «Carica PDF» per poterli aprire.", { n:senzaPdf })}
        </div>
      )}

      {loading
        ? <div style={{ textAlign:"center", padding:40, color:C.muted }}>⏳ {t("Caricamento...")}</div>
        : filtrati.length === 0
          ? <div style={{ textAlign:"center", padding:40, color:C.muted }}>{t("Nessun modello 4 trovato")}</div>
          : <>
              {filtrati.slice(0, quanti).map(d => (
                <Documento key={d.id} d={d} admin={admin} onElimina={elimina}
                  animaliPerMatricola={animaliPerMatricola} onAggiorna={carica}
                  doppio={doppi.has(d.numero_documento + "|" + d.specie)}/>
              ))}
              {filtrati.length > quanti && (
                <div style={{ textAlign:"center", marginTop:8 }}>
                  <Btn variant="outline" small label={t("Mostra altri ({n})", { n:filtrati.length - quanti })} onClick={() => setQuanti(quanti + 30)}/>
                </div>
              )}
            </>}
    </div>
  );
}
