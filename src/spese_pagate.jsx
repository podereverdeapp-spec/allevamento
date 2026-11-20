/* eslint-disable react-hooks/exhaustive-deps */
// ============================================================================
// v148 — SPESE PAGATE (ordine del Dott. Bizzarri; specifica del Sergente del 14/11/2026 ore 12:50;
// database e funzioni della versione 382 del programma di contabilità).
// v149 — nuova spesa rifatta (spese_nuova.jsx, procedura del Tenente del 20/11/2026 ore 11:59);
// «Le mie spese» con «Rimborsata» in blu e «Rifai la foto»; strumenti con residui ed elenco delle spese.
// Chi paga per l'azienda fotografa il documento: la spesa entra nel programma con il PDF,
// chi ha pagato e con che cosa. L'ufficio (Demaria, il Dottore o Colabucci) la controlla.
// - Solo gli abilitati (ci_spese_abilitati): il menu compare solo a loro (App.js).
// - L'app NON scrive mai nelle tabelle: archivio «cassa» + funzioni ci_* del database.
// - I messaggi del database si mostrano così come sono (sono già in italiano).
// ============================================================================
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { t } from "./i18n";
import { oggiRoma } from "./dateRoma";
import { md5 } from "./md5";
import { caricaOpenCV, apriFoto, angoliTuttaFoto, trovaAngoli, raddrizza, biancoNero, jpegDa, creaPdf, centesimi, euro, leggiTesto, leggiPdf } from "./scanner";
import { leggiDocumento } from "./spese_lettura";
import { ARCHIVIO, CARTELLA, elencoCoda, togliDallaCoda, aggiornaInCoda, riprovaCoda, erroreDiRete } from "./spese_coda";
import NuovaSpesa from "./spese_nuova";   // v149 — passi 1–8 della nuova spesa

const C = { primary: "#5C3D1E", border: "#D4C4A8", muted: "#8B7355", bg: "#F5F0E8", red: "#C0392B",
  green: "#2E7D32", orange: "#E67E22", yellow: "#B7950B", grey: "#7F8C8D", blue: "#1F6FB2", text: "#2D1B0E" };

const COLORE_STATO = { "Da controllare": C.grey, "Controllata": C.green, "Da chiarire": C.orange, "Annullata": C.grey, "Rimborsata": C.blue };
const SOLDI_PROPRI = ["Pagato da me", "La mia carta", "Carta di credito personale"];

const dataIt = (d) => d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : "";
const oraIt = (ts) => ts ? new Date(ts).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
const euroN = (n) => euro(Math.round(Number(n || 0) * 100));

// ---------------------------------------------------------------- piccoli pezzi grafici
const st = {
  scheda: { background: "#FFF", border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, margin: "10px 12px" },
  titolo: { fontSize: 16, fontWeight: 800, color: C.primary, margin: "0 0 8px" },
  etichetta: { display: "block", fontSize: 13, fontWeight: 700, color: C.text, margin: "10px 0 4px" },
  campo: { width: "100%", boxSizing: "border-box", padding: "12px 12px", fontSize: 17, border: `1.5px solid ${C.border}`, borderRadius: 10, background: "#FFF" },
  piccolo: { fontSize: 12, color: C.muted },
};
function Tasto({ children, onClick, colore = C.primary, pieno = true, disabled, grande, style }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      style={{ width: "100%", padding: grande ? "16px 12px" : "12px 12px", margin: "6px 0", fontSize: grande ? 17 : 15, fontWeight: 700,
        borderRadius: 12, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1,
        background: pieno ? colore : "#FFF", color: pieno ? "#FFF" : colore, border: `2px solid ${colore}`, ...style }}>
      {children}
    </button>
  );
}
function Avviso({ tipo = "info", children }) {
  const col = { ok: [C.green, "#E8F5E9"], ko: [C.red, "#FDECEA"], giallo: [C.yellow, "#FEF9E7"], info: [C.blue, "#EAF2FB"] }[tipo];
  return <div style={{ border: `1.5px solid ${col[0]}`, background: col[1], color: col[0], borderRadius: 10, padding: "10px 12px", fontSize: 14, fontWeight: 600, margin: "8px 0", whiteSpace: "pre-wrap" }}>{children}</div>;
}
function Bollino({ stato }) {
  return <span style={{ background: COLORE_STATO[stato] || C.grey, color: "#FFF", borderRadius: 8, padding: "2px 8px", fontSize: 12, fontWeight: 700,
    textDecoration: stato === "Annullata" ? "line-through" : "none" }}>{t(stato)}</span>;
}
// file scelto con un <input type=file> nascosto
function SceltaFile({ accept, capture, onFile, children, colore, pieno }) {
  const rif = useRef(null);
  return (
    <>
      <input ref={rif} type="file" accept={accept} capture={capture} style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) onFile(f); }} />
      <Tasto colore={colore} pieno={pieno} grande onClick={() => rif.current && rif.current.click()}>{children}</Tasto>
    </>
  );
}

// ============================================================================
export default function SpesePagate({ abilitazione, utente, onCambio }) {
  const [vista, setVista] = useState("nuova");
  const [daChiarire, setDaChiarire] = useState(0);
  const [inAttesa, setInAttesa] = useState(0);
  const [giro, setGiro] = useState(0);           // cresce a ogni aggiornamento: «Le mie spese» si ricarica
  const contanti = !!abilitazione?.puo_avere_contanti;

  const aggiornaContatori = async () => {
    const { count } = await supabase.from("ci_spese").select("id", { count: "exact", head: true }).eq("salvata_da", utente).eq("stato", "Da chiarire");
    setDaChiarire(count || 0);
    setInAttesa((await elencoCoda(utente)).length);
    setGiro((g) => g + 1);
    if (onCambio) onCambio();
  };
  useEffect(() => {
    aggiornaContatori();
    // spese rimaste nel telefono: si riprova all'apertura e quando torna la rete
    const riprova = async () => { await riprovaCoda(utente); aggiornaContatori(); };
    riprova();
    window.addEventListener("online", riprova);
    return () => window.removeEventListener("online", riprova);
  }, [utente]);

  const VISTE = [
    { id: "nuova", label: "Nuova spesa", icon: "➕" },
    { id: "mie", label: "Le mie spese", icon: "🧾", numero: daChiarire, attesa: inAttesa },
    ...(contanti ? [{ id: "contanti", label: "I miei contanti", icon: "💶" }] : []),
    { id: "strumenti", label: "Strumenti di pagamento", icon: "💳" },
  ];
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "12px 12px 0" }}>
        {VISTE.map((v) => (
          <button key={v.id} type="button" onClick={() => setVista(v.id)}
            style={{ position: "relative", padding: "10px 6px", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: `2px solid ${vista === v.id ? C.primary : C.border}`, background: vista === v.id ? C.primary : "#FFF", color: vista === v.id ? "#FFF" : C.text }}>
            {v.icon} {t(v.label)}
            {v.numero > 0 && <span style={{ position: "absolute", top: -7, right: -4, background: C.red, color: "#FFF", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{v.numero}</span>}
            {!v.numero && v.attesa > 0 && <span style={{ position: "absolute", top: -7, right: -4, background: C.orange, color: "#FFF", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>📵 {v.attesa}</span>}
          </button>
        ))}
      </div>
      {/* la nuova spesa resta aperta anche se si guarda un'altra scheda: foto e dati non si perdono */}
      <div style={{ display: vista === "nuova" ? "block" : "none" }}><NuovaSpesa utente={utente} onFatto={aggiornaContatori} vaiAMie={() => setVista("mie")} /></div>
      {vista === "mie" && <LeMieSpese utente={utente} giro={giro} onCambio={aggiornaContatori} />}
      {vista === "contanti" && contanti && <IMieiContanti utente={utente} />}
      {vista === "strumenti" && <Strumenti utente={utente} />}
    </div>
  );
}

// ============================================================================
// LE MIE SPESE
// ============================================================================
function LeMieSpese({ utente, giro, onCambio }) {
  const [spese, setSpese] = useState(null);
  const [domande, setDomande] = useState({});
  const [coda, setCoda] = useState([]);
  const [aperta, setAperta] = useState(null);
  const [errore, setErrore] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [riprovo, setRiprovo] = useState(false);

  const carica = async () => {
    setErrore("");
    setCoda(await elencoCoda(utente));
    // la lettura del database mostra anche le spese degli altri a chi gestisce i conti: qui solo le proprie
    const { data, error } = await supabase.from("ci_spese").select("*").eq("salvata_da", utente).order("salvata_il", { ascending: false }).limit(200);
    if (error) { setErrore(error.message); setSpese([]); return; }
    setSpese(data || []);
    const ids = (data || []).map((s) => s.id);
    if (ids.length) {
      const { data: d } = await supabase.from("ci_spese_domande").select("*").in("spesa_id", ids).order("scritta_il");
      const per = {}; (d || []).forEach((x) => { (per[x.spesa_id] = per[x.spesa_id] || []).push(x); });
      setDomande(per);
    } else setDomande({});
  };
  useEffect(() => { carica(); }, [utente, giro]);

  const riprova = async () => {
    setRiprovo(true); setMessaggio("");
    const r = await riprovaCoda(utente);
    const salvate = r.filter((x) => x.esito === "salvata").map((x) => x.numero);
    const rete = r.some((x) => x.esito === "rete");
    setMessaggio(rete ? t("Ancora niente rete: riprova più tardi.") : salvate.length ? t("Inviate: {n}", { n: salvate.join(", ") }) : t("Fatto."));
    setRiprovo(false); if (onCambio) onCambio(); else await carica();
  };

  return (
    <div>
      {coda.length > 0 && (
        <div style={st.scheda}>
          <div style={st.titolo}>📵 {t("Nel telefono, da inviare")}: {coda.length}</div>
          {coda.map((v) => (
            <div key={v.chiave} style={{ borderBottom: `1px solid ${C.border}`, padding: "8px 0" }}>
              <div style={{ fontWeight: 700 }}>{dataIt(v.data)} · {euroN(v.importo)} · {t(v.pagatoCon)} · {t(v.tipo)}{v.fornitore ? " · " + v.fornitore : ""}</div>
              {v.versione !== 149 && (
                <Avviso tipo="giallo">
                  {t("Preparata con la versione precedente dell'app: rifalla con la nuova (le foto restano nel telefono) oppure toglila.")}
                  <Tasto pieno={false} colore={C.red} onClick={async () => { await togliDallaCoda(v.chiave); if (onCambio) onCambio(); else carica(); }}>{t("Togli dal telefono")}</Tasto>
                </Avviso>
              )}
              {v.ultimoErrore && /^DOPPIONE:/.test(v.ultimoErrore) && <MotivoDoppione voce={v} utente={utente} onFatto={() => { if (onCambio) onCambio(); else carica(); }} />}
              {v.ultimoErrore && !/^DOPPIONE:/.test(v.ultimoErrore) && <Avviso tipo="ko">{t("Non salvata")}: {v.ultimoErrore}</Avviso>}
              {v.ultimoErrore && <Tasto pieno={false} colore={C.red} onClick={async () => { await togliDallaCoda(v.chiave); if (onCambio) onCambio(); else carica(); }}>{t("Togli dal telefono")}</Tasto>}
            </div>
          ))}
          <Tasto onClick={riprova} disabled={riprovo}>{riprovo ? t("Invio…") : t("Riprova ora")}</Tasto>
          {messaggio && <Avviso>{messaggio}</Avviso>}
        </div>
      )}
      {errore && <div style={st.scheda}><Avviso tipo="ko">{errore}</Avviso></div>}
      {spese === null && <div style={st.scheda}>{t("Caricamento...")}</div>}
      {spese && spese.length === 0 && !coda.length && <div style={st.scheda}>{t("Nessuna spesa salvata.")}</div>}
      {spese && spese.map((s) => (
        <div key={s.id} style={{ ...st.scheda, borderColor: s.stato === "Da chiarire" ? C.orange : C.border, borderWidth: s.stato === "Da chiarire" ? 2 : 1 }}>
          <div onClick={() => setAperta(aperta === s.id ? null : s.id)} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16, textDecoration: s.stato === "Annullata" ? "line-through" : "none", color: s.stato === "Annullata" ? C.grey : C.text }}>{euroN(s.importo)}</span>
              <Bollino stato={s.stato} />
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              n. {s.numero} · {dataIt(s.data_documento)} · {t(s.pagato_con)} · {s.tipo_documento === "Altro" ? s.tipo_altro || t("Altro") : t(s.tipo_documento)}
              {s.fornitore_testo ? ` · ${s.fornitore_testo}` : ""}
            </div>
          </div>
          {aperta === s.id && <DettaglioSpesa spesa={s} domande={domande[s.id] || []} onCambio={() => { if (onCambio) onCambio(); else carica(); }} />}
        </div>
      ))}
    </div>
  );
}

// spesa rimasta nel telefono che il database ha fermato come «DOPPIONE»: si invia di nuovo con il motivo
function MotivoDoppione({ voce, utente, onFatto }) {
  const [motivo, setMotivo] = useState("");
  const [lavoro, setLavoro] = useState(false);
  return (
    <Avviso tipo="giallo">
      {voce.ultimoErrore.replace(/^DOPPIONE:\s*/, "")}{"\n"}{t("Confermi che è una spesa diversa? Scrivi il motivo")}
      <input style={{ ...st.campo, marginTop: 6 }} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
      <Tasto disabled={!motivo.trim() || lavoro} onClick={async () => {
        setLavoro(true);
        await aggiornaInCoda({ ...voce, confermaDoppione: motivo.trim(), ultimoErrore: null });
        await riprovaCoda(utente, voce.chiave);
        setLavoro(false); onFatto();
      }}>{t("Salva con il motivo")}</Tasto>
    </Avviso>
  );
}

async function apriDallArchivio(percorso) {
  const { data, error } = await supabase.storage.from(ARCHIVIO).createSignedUrl(percorso, 300);
  if (error) throw error;
  window.open(data.signedUrl, "_blank", "noopener");
}

function DettaglioSpesa({ spesa, domande, onCambio }) {
  const [risposta, setRisposta] = useState("");
  const [motivo, setMotivo] = useState("");
  const [annullo, setAnnullo] = useState(false);
  const [lavoro, setLavoro] = useState(false);
  const [errore, setErrore] = useState("");
  const apri = async (p) => { setErrore(""); try { await apriDallArchivio(p); } catch (e) { setErrore(e.message || String(e)); } };
  const chiama = async (funzione, parametri) => {
    setLavoro(true); setErrore("");
    const { error } = await supabase.rpc(funzione, parametri);
    setLavoro(false);
    if (error) { setErrore(erroreDiRete(error) ? t("Niente rete: riprova più tardi.") : error.message); return false; }
    onCambio(); return true;
  };
  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
      <div style={st.piccolo}>{t("Salvata il {d}", { d: oraIt(spesa.salvata_il) })}{spesa.data_pagamento && spesa.data_pagamento !== spesa.data_documento ? ` · ${t("Data del pagamento")}: ${dataIt(spesa.data_pagamento)}` : ""}</div>
      {spesa.totale_letto != null && Number(spesa.totale_letto) !== Number(spesa.importo_scritto) && <div style={st.piccolo}>{t("Totale letto sul documento")}: {euroN(spesa.totale_letto)}</div>}
      {spesa.nota && <div style={{ fontSize: 14, margin: "6px 0" }}>📝 {spesa.nota}</div>}
      {spesa.annullata_motivo && <div style={{ fontSize: 14, margin: "6px 0", color: C.grey }}>{t("Motivo dell'annullamento")}: {spesa.annullata_motivo}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        {spesa.pdf_percorso && <Tasto pieno={false} colore={C.blue} onClick={() => apri(spesa.pdf_percorso)}>📄 {t("Apri il PDF")}</Tasto>}
        {spesa.pagamento_percorso && <Tasto pieno={false} colore={C.blue} onClick={() => apri(spesa.pagamento_percorso)}>💳 {t("Ricevuta del pagamento")}</Tasto>}
        {spesa.foto_percorso && <Tasto pieno={false} colore={C.blue} onClick={() => apri(spesa.foto_percorso)}>📸 {t("Foto dell'oggetto")}</Tasto>}
      </div>
      {spesa.stato === "Da controllare" && <RifaiFoto spesa={spesa} onCambio={onCambio} />}
      {domande.length > 0 && (
        <div style={{ margin: "8px 0" }}>
          {domande.map((d) => (
            <div key={d.id} style={{ background: d.tipo === "Domanda" ? "#FEF5E7" : "#EAF2FB", borderRadius: 10, padding: "8px 10px", margin: "6px 0", fontSize: 14 }}>
              <div style={{ fontSize: 11, color: C.muted }}>{t(d.tipo)} · {oraIt(d.scritta_il)}</div>
              {d.testo}
            </div>
          ))}
        </div>
      )}
      {spesa.stato === "Da chiarire" && (
        <div>
          <label style={st.etichetta}>{t("La tua risposta all'ufficio")}</label>
          <textarea style={{ ...st.campo, minHeight: 70 }} value={risposta} onChange={(e) => setRisposta(e.target.value)} />
          <Tasto colore={C.orange} disabled={!risposta.trim() || lavoro} onClick={async () => { if (await chiama("ci_spesa_rispondi", { p_spesa: spesa.id, p_testo: risposta.trim() })) setRisposta(""); }}>{t("Invia la risposta")}</Tasto>
        </div>
      )}
      {spesa.stato === "Da controllare" && spesa.pagato_con === "Contanti" && (
        <div style={st.piccolo}>{t("Spesa in contanti: è già nella cassa. Se va annullata, chiedi all'ufficio.")}</div>
      )}
      {spesa.stato === "Da controllare" && spesa.pagato_con !== "Contanti" && !annullo && <Tasto pieno={false} colore={C.red} onClick={() => setAnnullo(true)}>{t("Annulla questa spesa")}</Tasto>}
      {spesa.stato === "Da controllare" && spesa.pagato_con !== "Contanti" && annullo && (
        <div>
          <label style={st.etichetta}>{t("Motivo dell'annullamento")}</label>
          <input style={st.campo} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          <Tasto colore={C.red} disabled={!motivo.trim() || lavoro} onClick={() => chiama("ci_spesa_annulla", { p_spesa: spesa.id, p_motivo: motivo.trim() })}>{t("Conferma l'annullamento")}</Tasto>
          <Tasto pieno={false} onClick={() => setAnnullo(false)}>{t("Non annullare")}</Tasto>
        </div>
      )}
      {errore && <Avviso tipo="ko">{errore}</Avviso>}
    </div>
  );
}

// «Rifai la foto»: si sostituisce un file della spesa finché l'ufficio non l'ha controllata
// (decisioni del 17/11 21:13 e dell'11/11 21:49; funzione ci_spesa_sostituisci_file del Tenente).
function RifaiFoto({ spesa, onCambio }) {
  const [aperto, setAperto] = useState(false);
  const [quale, setQuale] = useState("");
  const [lavoro, setLavoro] = useState("");
  const [errore, setErrore] = useState("");
  const [fatto, setFatto] = useState("");
  // CARTELLA/anno/mese: dal PDF; per «Altro» senza documento dagli altri file della spesa
  const unFile = spesa.pdf_percorso || spesa.pagamento_percorso || spesa.foto_percorso || "";
  const dd = String(spesa.data_documento || "");
  const cartella = unFile ? String(unFile).split("/").slice(0, 3).join("/") : `${CARTELLA[spesa.pagato_con] || "PAGATE DALLE PERSONE"}/${dd.slice(0, 4)}/${dd.slice(5, 7)}`;
  const voci = [["documento", "Il documento"], ...(spesa.pagamento_percorso || !["Contanti", "Pagato da me"].includes(spesa.pagato_con) ? [["pagamento", "La ricevuta del pagamento"]] : []), ...(spesa.foto_percorso || spesa.bene ? [["bene", "La foto del bene"]] : [])];
  const nuovoFile = async (file) => {
    setErrore(""); setFatto(""); setLavoro(t("Preparo il file…"));
    try {
      const pdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");
      let byte, tipo, testi = null;
      if (quale === "documento") {
        if (pdf) { byte = new Uint8Array(await file.arrayBuffer()); const { pagine } = await leggiPdf(byte); testi = pagine.map((p) => p.testo); }
        else {
          const foto = await apriFoto(file);
          let ang = null;
          try { const x = await caricaOpenCV(); const r = trovaAngoli(x.cv, foto); ang = r && r.angoli; } catch (e) { ang = null; }
          const bn = biancoNero(raddrizza(foto, ang || angoliTuttaFoto(foto)));
          byte = creaPdf([{ jpeg: await jpegDa(bn, 0.7), w: bn.width, h: bn.height }]);
          testi = [await leggiTesto(bn)];
        }
        tipo = "pdf";
      } else if (pdf && quale === "pagamento") { byte = new Uint8Array(await file.arrayBuffer()); tipo = "pdf"; }
      else { const c = await apriFoto(file, quale === "bene" ? 1280 : 1600); byte = await jpegDa(c, 0.8); tipo = "jpg"; }
      const impronta = md5(byte);
      // nomi dei file (lettera del Tenente del 20/11 ore 12:28, punto 4): il vecchio file resta come traccia
      const improntaDoc = (String(unFile).split("/").pop().match(/^[0-9a-f]{32}/) || [""])[0];
      const percorso = quale === "documento" ? `${cartella}/${impronta}.pdf`
        : improntaDoc ? `${cartella}/${improntaDoc}-${quale === "pagamento" ? "pagamento" : "oggetto"}-${impronta}.${tipo}`
        : `${cartella}/${impronta}-${quale === "pagamento" ? "pagamento" : "oggetto"}-${impronta}.${tipo}`;   // senza file: la stessa impronta due volte
      setLavoro(t("Salvo…"));
      const up = await supabase.storage.from(ARCHIVIO).upload(percorso, new Blob([byte], { type: tipo === "pdf" ? "application/pdf" : "image/jpeg" }), { contentType: tipo === "pdf" ? "application/pdf" : "image/jpeg", upsert: false });
      if (up.error && !/already exists|duplicate/i.test(up.error.message || "") && String(up.error.statusCode) !== "409") throw up.error;
      const { error } = await supabase.rpc("ci_spesa_sostituisci_file", { p_spesa: spesa.id, p_quale: quale, p_percorso: percorso, p_impronta: impronta });
      if (error) throw error;
      let msg = t("File sostituito");
      if (testi) {
        const l = leggiDocumento(spesa.tipo_documento, testi);
        if (l.cent != null && Math.round(Number(spesa.importo) * 100) !== l.cent) msg += "\n" + t("Il documento dice {a}, la spesa ha {b}: avvisa l'ufficio", { a: euro(l.cent), b: euroN(spesa.importo) });
      }
      setFatto(msg); setQuale(""); onCambio();
    } catch (e) { setErrore(erroreDiRete(e) ? t("Niente rete: riprova più tardi.") : (e.message || String(e))); }
    setLavoro("");
  };
  if (!aperto) return <Tasto pieno={false} onClick={() => setAperto(true)}>📷 {t("Rifai la foto")}</Tasto>;
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, margin: "6px 0" }}>
      {!quale && voci.map(([v, e]) => <Tasto key={v} pieno={false} onClick={() => setQuale(v)}>{t(e)}</Tasto>)}
      {quale && (
        <>
          <SceltaFile accept="image/*" capture="environment" onFile={nuovoFile}>📷 {t("Scatta la foto")}</SceltaFile>
          <SceltaFile accept={quale === "bene" ? "image/*" : "image/*,application/pdf,.pdf"} onFile={nuovoFile} pieno={false}>📁 {t("Carica dal telefono")}</SceltaFile>
          <Tasto pieno={false} onClick={() => setQuale("")}>← {t("Indietro")}</Tasto>
        </>
      )}
      {lavoro && <Avviso>{lavoro}</Avviso>}
      {errore && <Avviso tipo="ko">{errore}</Avviso>}
      {fatto && <Avviso tipo="ok">✓ {fatto}</Avviso>}
      <Tasto pieno={false} colore={C.grey} onClick={() => { setAperto(false); setQuale(""); }}>{t("Chiudi")}</Tasto>
    </div>
  );
}

// ============================================================================
// I MIEI CONTANTI
// ============================================================================
function IMieiContanti({ utente }) {
  const [saldo, setSaldo] = useState(null);
  const [movimenti, setMovimenti] = useState([]);
  const [persone, setPersone] = useState([]);
  const [modulo, setModulo] = useState("");          // "prelievo" | "consegna"
  const [importo, setImporto] = useState("");
  const [data, setData] = useState(oggiRoma());
  const [nota, setNota] = useState("");
  const [aChi, setAChi] = useState("");
  const [ricevuta, setRicevuta] = useState(null);    // { jpeg }
  const [lavoro, setLavoro] = useState(false);
  const [errore, setErrore] = useState("");
  const [fatto, setFatto] = useState("");
  const [annullaId, setAnnullaId] = useState(null);
  const [motivo, setMotivo] = useState("");

  const carica = async () => {
    const [s, m, p] = await Promise.all([
      supabase.rpc("ci_contanti_saldi"),
      supabase.from("ci_contanti").select("*").or(`persona.eq.${utente},a_persona.eq.${utente}`).order("creato_il", { ascending: false }).limit(60),
      supabase.rpc("ci_spese_persone_contanti"),
    ]);
    if (s.error) setErrore(s.error.message);
    setSaldo(((s.data || []).find((r) => r.persona === utente)) || { prelievi: 0, ricevuti: 0, spese: 0, consegnati: 0, saldo: 0 });
    setMovimenti(m.data || []);
    setPersone(p.data || []);
  };
  useEffect(() => { carica(); }, [utente]);

  const nomeDi = (id) => (persone.find((p) => p.profilo_id === id) || {}).nome || t("altra persona");
  const chiudi = () => { setModulo(""); setImporto(""); setData(oggiRoma()); setNota(""); setAChi(""); setRicevuta(null); setErrore(""); };
  const cent = centesimi(importo);

  const registra = async () => {
    if (cent == null || cent <= 0) { setErrore(t("Scrivi l'importo")); return; }
    if (!data || data > oggiRoma()) { setErrore(t("La data non può essere nel futuro")); return; }
    setLavoro(true); setErrore(""); setFatto("");
    try {
      if (modulo === "prelievo") {
        if (!ricevuta) { setLavoro(false); setErrore(t("Manca la foto della ricevuta del bancomat")); return; }
        let foto = null;
        {
          const impronta = md5(ricevuta.jpeg);
          foto = `PRELIEVI/${data.slice(0, 4)}/${data.slice(5, 7)}/${impronta}.jpg`;
          const { error } = await supabase.storage.from(ARCHIVIO).upload(foto, new Blob([ricevuta.jpeg], { type: "image/jpeg" }), { contentType: "image/jpeg", upsert: false });
          if (error && !/already exists|duplicate/i.test(error.message || "") && String(error.statusCode) !== "409") throw error;
        }
        const { data: r, error } = await supabase.rpc("ci_prelievo_registra", { p_data: data, p_importo: cent / 100, p_foto_percorso: foto, p_nota: nota.trim() || null });
        if (error) throw error;
        setFatto(t("Prelievo registrato") + (r && r.codice_attesa ? ` (${r.codice_attesa})` : ""));
      } else {
        if (!aChi) { setLavoro(false); setErrore(t("Scegli chi riceve i contanti")); return; }
        const { error } = await supabase.rpc("ci_contanti_consegna", { p_a_persona: aChi, p_data: data, p_importo: cent / 100, p_nota: nota.trim() || null });
        if (error) throw error;
        setFatto(t("Consegna registrata: aspetta la conferma di {n}", { n: nomeDi(aChi) }));
      }
      chiudi(); await carica();
    } catch (e) {
      setErrore(erroreDiRete(e) ? t("Niente rete: riprova più tardi.") : (e.message || String(e)));
    }
    setLavoro(false);
  };
  const azione = async (funzione, parametri, okTesto) => {
    setLavoro(true); setErrore(""); setFatto("");
    const { error } = await supabase.rpc(funzione, parametri);
    setLavoro(false);
    if (error) { setErrore(erroreDiRete(error) ? t("Niente rete: riprova più tardi.") : error.message); return; }
    setFatto(okTesto); setAnnullaId(null); setMotivo(""); carica();
  };

  const daConfermare = movimenti.filter((m) => m.tipo === "Consegna" && m.a_persona === utente && !m.confermata_il && !m.annullata_il);
  return (
    <div>
      <div style={st.scheda}>
        <div style={st.titolo}>💶 {t("I miei contanti")}</div>
        {saldo === null ? t("Caricamento...") : (
          <>
            <div style={{ fontSize: 15 }}>{t("Devi avere in mano")}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: Number(saldo.saldo) < 0 ? C.red : C.primary }}>{euroN(saldo.saldo)}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginTop: 4 }}>
              + {t("Prelievi")}: {euroN(saldo.prelievi)}<br />
              + {t("Ricevuti")}: {euroN(saldo.ricevuti)}<br />
              − {t("Spese")}: {euroN(saldo.spese)}<br />
              − {t("Consegnati")}: {euroN(saldo.consegnati)}
            </div>
          </>
        )}
      </div>

      {daConfermare.length > 0 && (
        <div style={{ ...st.scheda, borderColor: C.orange, borderWidth: 2 }}>
          <div style={st.titolo}>{t("Contanti da confermare")}</div>
          {daConfermare.map((m) => (
            <div key={m.id} style={{ padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700 }}>{euroN(m.importo)} {t("da")} {nomeDi(m.persona)} · {dataIt(m.data)}</div>
              {m.nota && <div style={st.piccolo}>{m.nota}</div>}
              <Tasto colore={C.green} disabled={lavoro} onClick={() => azione("ci_contanti_conferma", { p_id: m.id }, t("Ricevuta confermata"))}>✓ {t("Confermo di averli ricevuti")}</Tasto>
            </div>
          ))}
        </div>
      )}

      <div style={st.scheda}>
        {!modulo && (
          <>
            <Tasto grande onClick={() => { chiudi(); setModulo("prelievo"); }}>🏧 {t("Prelievo con la carta 1894")}</Tasto>
            <Tasto grande pieno={false} onClick={() => { chiudi(); setModulo("consegna"); }}>🤝 {t("Consegna a un'altra persona")}</Tasto>
            <div style={st.piccolo}>{t("Anche la restituzione in ufficio è una consegna: si consegna a chi tiene la cassa.")}</div>
          </>
        )}
        {modulo && (
          <>
            <div style={st.titolo}>{modulo === "prelievo" ? "🏧 " + t("Prelievo con la carta 1894") : "🤝 " + t("Consegna a un'altra persona")}</div>
            {modulo === "consegna" && (
              <>
                <label style={st.etichetta}>{t("A chi")}</label>
                <select style={st.campo} value={aChi} onChange={(e) => setAChi(e.target.value)}>
                  <option value="">—</option>
                  {persone.filter((p) => p.profilo_id !== utente).map((p) => <option key={p.profilo_id} value={p.profilo_id}>{p.nome}</option>)}
                </select>
              </>
            )}
            <label style={st.etichetta}>{t("Importo (€)")}</label>
            <input style={{ ...st.campo, fontSize: 22, fontWeight: 800 }} inputMode="decimal" value={importo} onChange={(e) => setImporto(e.target.value)} placeholder="0,00" />
            <label style={st.etichetta}>{t("Data")}</label>
            <input style={st.campo} type="date" value={data} max={oggiRoma()} onChange={(e) => setData(e.target.value)} />
            {modulo === "prelievo" && (ricevuta
              ? <Tasto pieno={false} colore={C.red} onClick={() => setRicevuta(null)}>{t("Togli la foto della ricevuta")}</Tasto>
              : <SceltaFile accept="image/*" capture="environment" pieno={false} onFile={async (f) => { try { const c = await apriFoto(f, 1600); setRicevuta({ jpeg: await jpegDa(c, 0.75) }); } catch (e) { setErrore(e.message); } }}>📸 {t("Foto della ricevuta del bancomat (obbligatoria)")}</SceltaFile>)}
            {ricevuta && <div style={{ ...st.piccolo, color: C.green }}>✓ {t("Foto della ricevuta pronta")}</div>}
            <label style={st.etichetta}>{t("Nota (facoltativa)")}</label>
            <input style={st.campo} value={nota} onChange={(e) => setNota(e.target.value)} />
            <Tasto grande colore={C.green} disabled={lavoro || (modulo === "prelievo" && !ricevuta)} onClick={registra}>{lavoro ? t("Salvo…") : t("Registra")}</Tasto>
            <Tasto pieno={false} onClick={chiudi}>{t("Annulla")}</Tasto>
          </>
        )}
        {errore && <Avviso tipo="ko">{errore}</Avviso>}
        {fatto && <Avviso tipo="ok">✓ {fatto}</Avviso>}
      </div>

      <div style={st.scheda}>
        <div style={st.titolo}>{t("Movimenti")}</div>
        {movimenti.length === 0 && <div style={st.piccolo}>{t("Nessun movimento.")}</div>}
        {movimenti.map((m) => {
          const mio = m.persona === utente;
          const annullabile = mio && !m.annullata_il && (m.tipo === "Prelievo" || (m.tipo === "Consegna" && !m.confermata_il));
          const testo = m.tipo === "Prelievo" ? t("Prelievo")
            : mio ? t("Consegnati a {n}", { n: nomeDi(m.a_persona) }) : t("Ricevuti da {n}", { n: nomeDi(m.persona) });
          return (
            <div key={m.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}`, color: m.annullata_il ? C.grey : C.text }}>
              <div style={{ display: "flex", justifyContent: "space-between", textDecoration: m.annullata_il ? "line-through" : "none" }}>
                <span>{dataIt(m.data)} · {testo}</span><b>{euroN(m.importo)}</b>
              </div>
              <div style={st.piccolo}>
                {m.annullata_il ? `${t("Annullato")}: ${m.annullata_motivo || ""}` : m.tipo === "Consegna" ? (m.confermata_il ? `✓ ${t("Confermata")} ${oraIt(m.confermata_il)}` : t("In attesa di conferma")) : ""}
                {m.nota ? ` · ${m.nota}` : ""}
              </div>
              {annullabile && annullaId !== m.id && <button type="button" onClick={() => { setAnnullaId(m.id); setMotivo(""); }} style={{ background: "none", border: "none", color: C.red, fontWeight: 700, padding: "4px 0", cursor: "pointer" }}>{t("Registrato per errore? Annulla")}</button>}
              {annullaId === m.id && (
                <div>
                  <input style={st.campo} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder={t("Motivo dell'annullamento")} />
                  <Tasto colore={C.red} disabled={!motivo.trim() || lavoro} onClick={() => azione("ci_contanti_annulla", { p_id: m.id, p_motivo: motivo.trim() }, t("Annullato"))}>{t("Conferma l'annullamento")}</Tasto>
                  <Tasto pieno={false} onClick={() => setAnnullaId(null)}>{t("Non annullare")}</Tasto>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// STRUMENTI DI PAGAMENTO
// ============================================================================
function Strumenti({ utente }) {
  const [elenco, setElenco] = useState(null);       // [{ nome, limite, resta, nota }]
  const [errore, setErrore] = useState("");
  const [aperto, setAperto] = useState(null);
  const [spese, setSpese] = useState(null);
  const [erroreSpese, setErroreSpese] = useState("");
  useEffect(() => {
    (async () => {
      const att = await supabase.rpc("ci_spese_strumenti_attivi");
      if (att.error) { setErrore(erroreDiRete(att.error) ? t("Niente rete: riprova più tardi.") : att.error.message); setElenco([]); return; }
      const l = (att.data || []).map((r) => ({ nome: r.nome, limite: null, resta: null, nota: null }));
      const res = await supabase.rpc("ci_spese_residui");
      if (!res.error && Array.isArray(res.data)) {
        for (const r of res.data) { const x = l.find((e) => e.nome === r.strumento); if (x) Object.assign(x, { limite: r.limite, resta: r.resta, nota: r.nota }); }
      } else {
        const [sal, sta] = await Promise.all([supabase.rpc("ci_contanti_saldi"), supabase.rpc("ci_strumenti_stato")]);
        const mio = ((sal.data || []).find((r) => r.persona === utente)) || null;
        for (const x of l) {
          if (x.nome === "Contanti" && mio) { x.limite = mio.saldo; x.resta = mio.saldo; }
          if (x.nome === "Carta di debito 1894" && sta.data && sta.data.carta_1894) { x.limite = sta.data.carta_1894.limite; x.resta = sta.data.carta_1894.residuo; }
          if (SOLDI_PROPRI.includes(x.nome)) x.nota = "Soldi tuoi: ti saranno rimborsati";
        }
      }
      setElenco(l);
    })();
  }, [utente]);
  const apriSpese = async (nome) => {
    if (aperto === nome) { setAperto(null); return; }
    setAperto(nome); setSpese(null); setErroreSpese("");
    const { data, error } = await supabase.rpc("ci_spese_dello_strumento", { p_strumento: nome });
    if (error) { setErroreSpese(erroreDiRete(error) ? t("Niente rete: riprova più tardi.") : error.message); setSpese([]); return; }
    setSpese(Array.isArray(data) ? data : []);
  };
  return (
    <div>
      {errore && <div style={st.scheda}><Avviso tipo="ko">{errore}</Avviso></div>}
      {elenco === null && <div style={st.scheda}>{t("Caricamento...")}</div>}
      {elenco && elenco.map((x) => {
        const giallo = x.nome === "Carta di debito 1894" && x.resta != null && Number(x.resta) < 1600;
        const rosso = x.resta != null && Number(x.resta) < 0;
        const condivisa = !SOLDI_PROPRI.includes(x.nome) && x.nome !== "Contanti";
        return (
          <div key={x.nome} style={st.scheda}>
            <div style={st.titolo}>💳 {t(x.nome)}</div>
            {x.limite != null || x.resta != null ? (
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                {x.nome !== "Contanti" && x.limite != null && <>{t("Limite")}: <b>{euroN(x.limite)}</b><br /></>}
                {x.nome === "Contanti" ? t("In carico") : t("Resta")}: <b style={{ color: rosso ? C.red : giallo ? C.yellow : C.green, fontSize: 20 }}>{euroN(x.resta)}</b>
              </div>
            ) : <div style={{ fontSize: 14, color: C.muted }}>{t(x.nota || "Saldo non disponibile")}</div>}
            {condivisa && <Tasto pieno={false} onClick={() => apriSpese(x.nome)}>{aperto === x.nome ? t("Chiudi") : t("Spese di questo strumento")}</Tasto>}
            {aperto === x.nome && (
              <div>
                {erroreSpese && <Avviso tipo="ko">{erroreSpese}</Avviso>}
                {spese === null && <div style={st.piccolo}>{t("Caricamento...")}</div>}
                {spese && spese.length === 0 && !erroreSpese && <div style={st.piccolo}>{t("Nessuna spesa.")}</div>}
                {spese && spese.map((r, i) => (
                  <div key={r.id || i} style={{ padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{dataIt(r.data_documento || r.data)} · {r.fornitore || r.fornitore_testo || ""}</span><b>{euroN(r.importo)}</b>
                    </div>
                    <div style={st.piccolo}>{r.numero ? `n. ${r.numero} · ` : ""}{r.persona || r.nome || ""}{r.stato ? ` · ${t(r.stato)}` : ""}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
