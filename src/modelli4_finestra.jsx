// ============================================================================
// MODELLI 4 — AVVISO NELLA PRIMA PAGINA E FINESTRA DELLE USCITE — v140
// ----------------------------------------------------------------------------
// Procedura del Dott. Bizzarri (19/10/2026):
// - quando arriva un modello 4 di uscita, nella prima pagina compare l'avviso
//   «📄 Modelli 4 arrivati — animali da far uscire»;
// - toccandolo si apre la finestra di compilazione, in cui si inseriscono gli
//   animali del modello 4:
//   · se il modello 4 riporta la matricola, l'animale e' gia' inserito;
//   · altrimenti si sceglie secondo la specie del modello 4 (bovini tra i
//     bovini, suini tra i suini e le unita' dei lotti, ovini tra gli ovini);
//   · il numero degli animali deve coincidere con i capi del modello 4;
//   · il peso vivo e' obbligatorio: senza, non si puo' salvare;
// - salvando, ogni animale viene registrato in uscita (stessi campi del
//   Registro uscite e dei Lotti suini) e abbinato al modello 4.
// Le uscite diverse da quelle del modello 4 si registrano come prima.
// ============================================================================
import { useState, useEffect } from "react";
import { t } from "./i18n";
import { supabase } from "./supabase";
import { salvaAbbinamento } from "./modelli4_abbina";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", green:"#4A7C59", red:"#C0392B",
  orange:"#E67E22", yellow:"#D4A017", text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
};
const fData = d => d ? d.split("-").reverse().join("/") : "—";
export const USCITA_PV = "Uscita da Podere Verde";
// da questa data in poi le uscite vanno abbinate ai modelli 4 (come nella pagina Modelli 4)
export const INIZIO_ABBINAMENTI = "2026-09-24";
const conMatricola = m => /^[A-Z]{2}\d/.test(m || "");
const pulisci = m => String(m || "").replace(/\s/g, "").toUpperCase();
const gruppo = s => (s === "Ovicaprini" || s === "Caprini") ? "Ovini" : s;
const SPECIE_APP = { Bovini:"bovino", Suini:"suino", Ovini:"ovino" };
const ICONA = { Bovini:"🐄", Suini:"🐷", Ovini:"🐑" };
// un animale uscito ma non abbinato si propone se l'uscita e' entro 10 giorni dalla data del modello 4
const GIORNI_USCITI = 10;
const spostaGiorni = (iso, n) => {
  const x = new Date((iso || new Date().toISOString().slice(0, 10)) + "T12:00:00");
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

// Un modello 4 ha ancora uscite da registrare nell'app?
export const daRegistrare = d =>
  d.tipo_movimento === USCITA_PV && (d.data_uscita || "") >= INIZIO_ABBINAMENTI
  && (d.modelli4_abbinamenti || []).length < (d.numero_capi || 0);

// Valore numerico del peso: null se vuoto o non valido
export const pesoValido = v => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const inputStyle = { width:"100%", boxSizing:"border-box", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"10px 12px", fontSize:15, background:"#FAFAF8", color:C.text, outline:"none" };

// ─── FINESTRA DI COMPILAZIONE ────────────────────────────────────────────────
export function FinestraUscite({ documento, onChiudi, onSalvato }) {
  const d = documento;
  const specie = gruppo(d.specie);
  const specieApp = SPECIE_APP[specie];
  const macello = d.destinazione_tipo === "Macello";
  const motivo = macello ? "Macellato" : "Venduto vivo";
  const stato = macello ? "macellato" : "venduto";
  const giaAbbinati = (d.modelli4_abbinamenti || []).length;
  const servono = Math.max(0, (d.numero_capi || 0) - giaAbbinati);

  const [candidati, setCandidati] = useState(null);   // animali e unita' attivi della specie
  const [righe, setRighe] = useState([]);              // { chiave, fissa, scelta, peso, avviso }
  const [dataUscita, setDataUscita] = useState(d.data_uscita || "");
  const [errore, setErrore] = useState("");
  const [salvo, setSalvo] = useState(false);
  const [esito, setEsito] = useState(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      // tutti gli abbinamenti, a pagine di 1000 righe (limite del database)
      let ab = [], e0 = null;
      for (let da = 0; ; da += 1000) {
        const r = await supabase.from("modelli4_abbinamenti").select("animale_id,suino_lotto_id,documento_id").range(da, da + 999);
        if (r.error) { e0 = r.error; break; }
        ab = ab.concat(r.data || []);
        if ((r.data || []).length < 1000) break;
      }
      const { data: an, error: e1 } = await supabase.from("animali")
        .select("id,bdn,nome,specie,stato,vivo,data_uscita,motivo_uscita,peso_vivo_uscita").eq("specie", specieApp);
      let un = [], e2 = null;
      if (specieApp === "suino") {
        const sel = "id,nr,codice_completo,lotto_id,stato,vivo,data_uscita,motivo_uscita,peso_vivo_uscita,lotti_suini(codice_lotto,codice)";
        const r1 = await supabase.from("suini_lotto").select(sel).eq("stato", "attivo");
        const r2 = await supabase.from("suini_lotto").select(sel).eq("vivo", false)
          .gte("data_uscita", spostaGiorni(d.data_uscita, -GIORNI_USCITI)).lte("data_uscita", spostaGiorni(d.data_uscita, GIORNI_USCITI));
        un = [...(r1.data || []), ...(r2.data || [])]; e2 = r1.error || r2.error;
      }
      if (!vivo) return;
      const e = e0 || e1 || e2;
      if (e) { setErrore(t("Errore nel caricamento degli animali") + ": " + e.message); setCandidati([]); return; }
      const abbAnimali = new Map(ab.filter(x => x.animale_id).map(x => [x.animale_id, x.documento_id]));
      const abbUnita = new Map(ab.filter(x => x.suino_lotto_id).map(x => [x.suino_lotto_id, x.documento_id]));
      // numeri dei modelli 4 a cui sono gia' abbinati gli animali con matricola di questo documento
      const perMatricola = {};
      (an || []).forEach(a => { if (a.bdn) perMatricola[pulisci(a.bdn)] = a; });
      const altriDoc = [...new Set((d.modelli4_capi || []).map(c => perMatricola[pulisci(c.matricola)])
        .filter(a => a && abbAnimali.has(a.id) && abbAnimali.get(a.id) !== d.id).map(a => abbAnimali.get(a.id)))];
      const numeri = {};
      if (altriDoc.length) {
        const { data: nd } = await supabase.from("modelli4_documenti").select("id,numero_documento").in("id", altriDoc);
        (nd || []).forEach(x => { numeri[x.id] = x.numero_documento; });
      }
      if (!vivo) return;
      // usciti ma non abbinati: stesso motivo del modello 4, dal 24/09/2026, entro 10 giorni dalla data del modello 4.
      // Per questi la finestra NON riscrive l'uscita: aggiunge solo l'abbinamento (e il peso vivo se mancava).
      const uscitoNonAbbinato = x => !!x.data_uscita && x.motivo_uscita === motivo && x.data_uscita >= INIZIO_ABBINAMENTI
        && Math.abs(new Date(x.data_uscita) - new Date(d.data_uscita)) <= GIORNI_USCITI * 86400000;
      const attivo = x => x.stato === "attivo" && x.vivo !== false;
      const sottoUscito = x => t("già uscito il {0}, non abbinato a un modello 4", { 0:fData(x.data_uscita) });
      const lista = [
        ...(an || []).filter(a => !abbAnimali.has(a.id) && (attivo(a) || uscitoNonAbbinato(a)))
          .map(a => ({ chiave:"a" + a.id, tipo:"animale", id:a.id, etichetta:a.bdn || a.nome || "#" + a.id, peso:a.peso_vivo_uscita, uscito:!attivo(a),
            sotto:attivo(a) ? (a.nome && a.bdn ? a.nome : t("animale in anagrafica")) : sottoUscito(a) })),
        ...un.filter(u => !abbUnita.has(u.id) && (attivo(u) || uscitoNonAbbinato(u))).map(u => {
          const lotto = u.lotti_suini?.codice_lotto || u.lotti_suini?.codice || "";
          return { chiave:"s" + u.id, tipo:"unita", id:u.id, peso:u.peso_vivo_uscita, uscito:!attivo(u),
            etichetta:u.codice_completo || (lotto ? `${lotto}${String(u.nr).padStart(2, "0")}` : "#" + u.nr),
            sotto:attivo(u) ? t("unità del lotto {0}", { 0:lotto || "—" }) : sottoUscito(u) };
        }),
      ].filter((x, i, arr) => arr.findIndex(y => y.chiave === x.chiave) === i)
       .sort((x, y) => x.etichetta.localeCompare(y.etichetta));
      setCandidati(lista);

      // righe: prima i capi con matricola scritta nel modello 4, poi i posti da scegliere
      const nuove = [];
      let liberi = servono;
      const pesoIniziale = v => (v === null || v === undefined) ? "" : String(v);
      for (const c of (d.modelli4_capi || [])) {
        if (!conMatricola(c.matricola) || liberi <= 0) continue;
        const a = perMatricola[pulisci(c.matricola)];
        if (a && abbAnimali.get(a.id) === d.id) continue;   // gia' abbinato a questo modello 4
        liberi--;
        if (!a) nuove.push({ chiave:"m" + c.id, fissa:c.matricola, scelta:null, peso:"",
          avviso:t("Matricola {0} non registrata nell'app: va inserita in anagrafica prima dell'uscita", { 0:c.matricola }) });
        else if (abbAnimali.has(a.id)) nuove.push({ chiave:"m" + c.id, fissa:c.matricola, scelta:null, peso:"",
          avviso:t("{0} è già abbinato a un altro modello 4 ({1}): va controllato prima di salvare", { 0:c.matricola, 1:numeri[abbAnimali.get(a.id)] || "—" }) });
        else if (!attivo(a) && !uscitoNonAbbinato(a)) nuove.push({ chiave:"m" + c.id, fissa:c.matricola, scelta:null, peso:"",
          avviso:t("{0} risulta uscito nell'app con dati diversi dal modello 4 ({1}, {2}): va controllato prima di salvare", { 0:c.matricola, 1:a.motivo_uscita || a.stato, 2:fData(a.data_uscita) }) });
        else nuove.push({ chiave:"m" + c.id, fissa:c.matricola, scelta:"a" + a.id, peso:pesoIniziale(a.peso_vivo_uscita), avviso:null,
          nota:attivo(a) ? null : t("{0} risulta già uscito nell'app ({1}, {2}): salvando viene abbinato a questo modello 4", { 0:c.matricola, 1:a.stato, 2:fData(a.data_uscita) }) });
      }
      for (let i = 0; i < liberi; i++) nuove.push({ chiave:"p" + i, fissa:null, scelta:"", peso:"", avviso:null });
      setRighe(nuove);
    })();
    return () => { vivo = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.id]);

  const cambia = (i, campo, v) => setRighe(r => r.map((x, j) => {
    if (j !== i) return x;
    if (campo === "scelta") {
      const c = (candidati || []).find(y => y.chiave === v);
      const peso = x.peso === "" && c && c.peso !== null && c.peso !== undefined ? String(c.peso) : x.peso;
      return { ...x, scelta:v, peso };
    }
    return { ...x, [campo]:v };
  }));
  const scelti = righe.map(r => r.scelta).filter(Boolean);
  const inseriti = righe.filter(r => r.scelta && !r.avviso).length;
  const candidato = k => (candidati || []).find(c => c.chiave === k);

  const salva = async () => {
    setErrore("");
    const bloccate = righe.filter(r => r.avviso);
    if (bloccate.length) { setErrore(bloccate.map(r => r.avviso).join("\n")); return; }
    if (inseriti !== servono) {
      setErrore(t("Gli animali inseriti devono essere esattamente i capi del modello 4: inseriti {0} di {1}. Non si può salvare.", { 0:inseriti, 1:servono }));
      return;
    }
    if (new Set(scelti).size !== scelti.length) { setErrore(t("Lo stesso animale è stato inserito due volte. Non si può salvare.")); return; }
    const senzaPeso = righe.filter(r => pesoValido(r.peso) === null).map(r => candidato(r.scelta)?.etichetta || r.fissa || "?");
    if (senzaPeso.length) { setErrore(t("⚠️ Peso vivo mancante: non si può salvare") + " — " + senzaPeso.join(", ")); return; }
    if (!dataUscita) { setErrore(t("⚠️ Inserire la data.")); return; }
    setSalvo(true);
    const fatti = [];
    for (const r of righe) {
      const c = candidato(r.scelta);
      // animale gia' uscito: l'uscita resta com'e' (si scrive solo il peso vivo se mancava); altrimenti si registra l'uscita
      const campi = c.uscito
        ? (pesoValido(c.peso) === null ? { peso_vivo_uscita:pesoValido(r.peso) } : null)
        : { stato, vivo:false, motivo_uscita:motivo, data_uscita:dataUscita, peso_vivo_uscita:pesoValido(r.peso) };
      const tabella = c.tipo === "animale" ? "animali" : "suini_lotto";
      const { error } = campi ? await supabase.from(tabella).update(campi).eq("id", c.id) : { error:null };
      if (error) {
        setSalvo(false);
        setErrore(t("⚠️ Errore nel salvataggio dell'uscita di {0}: {1}", { 0:c.etichetta, 1:error.message })
          + "\n" + t("Toccare di nuovo «Salva»: gli animali già salvati restano nell'elenco e vengono abbinati.")
          + (fatti.length ? "\n" + t("Uscite già salvate: {0}", { 0:fatti.join(", ") }) : ""));
        onSalvato && onSalvato(false);
        return;
      }
      const { error: e2 } = await salvaAbbinamento(c.tipo === "animale"
        ? { documentoId:d.id, animaleId:c.id } : { documentoId:d.id, suinoLottoId:c.id });
      if (e2) {
        setSalvo(false);
        setErrore(t("⚠️ Uscita di {0} salvata, ma abbinamento al modello 4 non riuscito: {1}", { 0:c.etichetta, 1:e2.message })
          + "\n" + t("Toccare di nuovo «Salva»: l'animale resta nell'elenco e viene abbinato.")
          + (fatti.length ? "\n" + t("Uscite già salvate: {0}", { 0:fatti.join(", ") }) : ""));
        onSalvato && onSalvato(false);
        return;
      }
      fatti.push(c.etichetta);
    }
    setSalvo(false);
    setEsito(fatti);
    onSalvato && onSalvato(true);
  };

  const testa = (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
      <button onClick={() => { if (!salvo) onChiudi(); }} disabled={salvo} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer" }}>←</button>
      <div style={{ fontSize:18, fontWeight:800 }}>{ICONA[specie] || "📄"} {t("Uscite del modello 4")}</div>
    </div>
  );
  const riquadroDoc = (
    <div style={{ background:"#FFF8E1", border:`1.5px solid ${C.yellow}`, borderRadius:12, padding:12, marginBottom:12, fontSize:13 }}>
      <div style={{ fontWeight:800, color:C.primary }}>{d.numero_documento}</div>
      <div>{t(d.specie || "")} · {d.numero_capi} {t("capi")} · {macello ? "🔪" : "🏡"} {d.destinatario || "—"}</div>
      <div style={{ color:C.muted }}>{t("Data di uscita prevista")}: {fData(d.data_uscita)} · {t("Motivo")}: {t(motivo)}</div>
      {giaAbbinati > 0 && <div style={{ color:C.green, fontWeight:700, marginTop:4 }}>✅ {t("Già registrati: {0}", { 0:giaAbbinati })}</div>}
    </div>
  );

  if (esito) return (
    <div>
      {testa}{riquadroDoc}
      <div style={{ background:"#E8F5E9", border:`2px solid ${C.green}`, borderRadius:12, padding:14, color:C.green, fontWeight:800 }}>
        ✅ {t("Uscite registrate e abbinate al modello 4: {0}", { 0:esito.length })}
        <div style={{ fontWeight:600, color:C.text, marginTop:6 }}>{esito.join(", ")}</div>
      </div>
      <button onClick={onChiudi} style={{ width:"100%", marginTop:12, background:C.primary, color:"#FFF", border:"none",
        borderRadius:12, padding:12, fontSize:16, fontWeight:700, cursor:"pointer" }}>{t("Chiudi")}</button>
    </div>
  );

  return (
    <div>
      {testa}{riquadroDoc}
      {candidati === null ? <div style={{ textAlign:"center", color:C.muted, padding:30 }}>⏳ {t("Caricamento...")}</div> : (<>
        <div style={{ fontSize:14, fontWeight:800, marginBottom:8,
          color: inseriti === servono ? C.green : C.red }}>
          {inseriti === servono ? "✅ " : "⏳ "}{t("Inseriti {0} di {1}", { 0:inseriti, 1:servono })}
        </div>
        <label style={{ display:"block", fontSize:12, color:C.muted, marginBottom:4 }}>{t("Data uscita")}</label>
        <input type="date" value={dataUscita} onChange={e => setDataUscita(e.target.value)} style={{ ...inputStyle, marginBottom:12 }}/>
        {righe.map((r, i) => {
          const scelto = candidato(r.scelta);
          return (
            <div key={r.chiave} style={{ background:C.card, border:`1px solid ${C.border}`, borderLeft:`5px solid ${r.avviso ? C.red : (r.scelta && pesoValido(r.peso)) ? C.green : C.orange}`,
              borderRadius:12, padding:10, marginBottom:8 }}>
              <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{t("Animale {0}", { 0:i + 1 })}</div>
              {r.fissa ? (
                <div style={{ fontWeight:800, fontSize:15, marginBottom:6 }}>
                  {r.fissa} <span style={{ fontSize:11, fontWeight:600, color:C.muted }}>· {t("matricola del modello 4")}</span>
                </div>
              ) : (
                <select value={r.scelta || ""} onChange={e => cambia(i, "scelta", e.target.value)} style={{ ...inputStyle, marginBottom:6 }}>
                  <option value="">{t("— Scegli l'animale —")}</option>
                  {(candidati || []).filter(c => c.chiave === r.scelta || !scelti.includes(c.chiave)).map(c => (
                    <option key={c.chiave} value={c.chiave}>{c.etichetta} — {c.sotto}</option>
                  ))}
                </select>
              )}
              {r.nota && <div style={{ color:C.orange, fontSize:12, fontWeight:700, marginBottom:4 }}>ℹ️ {r.nota}</div>}
              {r.avviso ? (
                <div style={{ color:C.red, fontSize:13, fontWeight:700 }}>⚠️ {r.avviso}</div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:13, whiteSpace:"nowrap" }}>⚖️ {t("Peso vivo (kg)")} *</span>
                  <input type="number" inputMode="decimal" value={r.peso} onChange={e => cambia(i, "peso", e.target.value)}
                    disabled={!!(scelto?.uscito && pesoValido(scelto.peso) !== null)}
                    aria-label={t("Peso vivo (kg)") + " " + (scelto?.etichetta || r.fissa || i + 1)}
                    style={{ ...inputStyle, borderColor: pesoValido(r.peso) ? C.green : C.orange }}/>
                </div>
              )}
            </div>
          );
        })}
        {candidati.length === 0 && righe.some(r => !r.fissa) &&
          <div style={{ color:C.red, fontSize:13, marginBottom:8 }}>⚠️ {t("Nessun animale attivo di questa specie da scegliere")}</div>}
        {errore && <div style={{ whiteSpace:"pre-line", background:C.red + "12", border:`1.5px solid ${C.red}`, color:C.red,
          borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:700, marginBottom:10 }}>{errore}</div>}
        <button onClick={salva} disabled={salvo || servono === 0}
          style={{ width:"100%", background:C.green, color:"#FFF", border:"none", borderRadius:12, padding:12,
            fontSize:16, fontWeight:700, cursor:"pointer", opacity:(salvo || servono === 0) ? 0.6 : 1 }}>
          {salvo ? t("Salvataggio...") : "✓ " + t("Salva")}
        </button>
        <div style={{ fontSize:12, color:C.muted, marginTop:8 }}>
          {t("Le uscite di animali che non sono in questo modello 4 si registrano come sempre dal Registro uscite o dai Lotti suini.")}
        </div>
      </>)}
    </div>
  );
}

// ─── AVVISO NELLA PRIMA PAGINA ───────────────────────────────────────────────
export function AvvisoModelli4() {
  const [docs, setDocs] = useState(null);
  const [aperto, setAperto] = useState(false);
  const [scelto, setScelto] = useState(null);
  const [errore, setErrore] = useState("");

  const carica = async () => {
    const { data, error } = await supabase.from("modelli4_documenti")
      .select("id,numero_documento,data_uscita,specie,numero_capi,destinazione_tipo,destinatario,tipo_movimento,modelli4_capi(id,matricola,categoria,numero_capi,riferimento_insieme),modelli4_abbinamenti(id,animale_id,suino_lotto_id)")
      .eq("tipo_movimento", USCITA_PV).gte("data_uscita", INIZIO_ABBINAMENTI).order("data_uscita", { ascending:true });
    if (error) { setErrore(error.message); setDocs([]); return; }
    setErrore("");
    setDocs((data || []).filter(daRegistrare));
  };
  useEffect(() => { carica(); }, []);

  if (!docs) return null;
  if (!aperto && docs.length === 0 && !errore) return null;

  if (!aperto) return (
    <div onClick={() => { setAperto(true); if (docs.length === 1) setScelto(docs[0]); }}
      style={{ cursor:"pointer", background:C.red + "12", border:`1.5px solid ${C.red}55`, borderRadius:16, padding:14, marginBottom:12,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ fontSize:13, fontWeight:800, color:C.red, marginBottom:4 }}>
          📄 {errore ? t("Modelli 4") : t("{n} modelli 4 arrivati — animali da far uscire", { n:docs.length })}
        </div>
        <div style={{ fontSize:12, color:C.text }}>
          {errore ? "⚠️ " + t("Errore nel caricamento dei modelli 4") + ": " + errore
            : docs.map(d => `${ICONA[gruppo(d.specie)] || "📄"} ${fData(d.data_uscita)} · ${(d.modelli4_abbinamenti || []).length}/${d.numero_capi}`).join("   ")}
        </div>
      </div>
      <div style={{ fontSize:18, color:C.muted }}>›</div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:C.bg, zIndex:400, overflowY:"auto" }}>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"16px 16px 100px" }}>
        {scelto ? (
          <FinestraUscite documento={scelto}
            onChiudi={async () => { setScelto(null); await carica(); if (docs.length <= 1) setAperto(false); }}
            onSalvato={() => {}}/>
        ) : (<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <button onClick={() => setAperto(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer" }}>←</button>
            <div style={{ fontSize:18, fontWeight:800 }}>📄 {t("Modelli 4 con animali da far uscire")}</div>
          </div>
          {docs.length === 0 && <div style={{ textAlign:"center", color:C.muted, padding:30 }}>✅ {t("Nessun modello 4 da completare")}</div>}
          {docs.map(d => (
            <div key={d.id} onClick={() => setScelto(d)} style={{ cursor:"pointer", background:"#FFF", borderRadius:14, padding:12, marginBottom:8,
              border:`1px solid ${C.border}`, borderLeft:`5px solid ${C.red}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                <div style={{ fontWeight:800, fontSize:15 }}>{ICONA[gruppo(d.specie)] || "📄"} {fData(d.data_uscita)} · {d.numero_capi} {t("capi")}</div>
                <div style={{ fontSize:12, color:C.red, fontWeight:700, whiteSpace:"nowrap" }}>{(d.modelli4_abbinamenti || []).length}/{d.numero_capi}</div>
              </div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{d.numero_documento} · {d.destinatario || "—"}</div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  );
}
