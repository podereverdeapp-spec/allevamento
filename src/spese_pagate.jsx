/* eslint-disable react-hooks/exhaustive-deps */
// ============================================================================
// v148 — SPESE PAGATE (ordine del Dott. Bizzarri; specifica del Sergente del 14/11/2026 ore 12:50;
// database e funzioni della versione 382 del programma di contabilità).
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
import {
  caricaOpenCV, apriFoto, angoliTuttaFoto, trovaAngoli, raddrizza, biancoNero,
  jpegDa, creaPdf, centesimi, euro, leggiTotale,
} from "./scanner";
import { ARCHIVIO, inviaSpesa, mettiInCoda, elencoCoda, togliDallaCoda, riprovaCoda, erroreDiRete } from "./spese_coda";

const C = { primary: "#5C3D1E", border: "#D4C4A8", muted: "#8B7355", bg: "#F5F0E8", red: "#C0392B",
  green: "#2E7D32", orange: "#E67E22", yellow: "#B7950B", grey: "#7F8C8D", blue: "#1F6FB2", text: "#2D1B0E" };

const TIPI = ["Fattura", "Scontrino", "Ricevuta", "Acquisto online", "Altro"];
const PAGATO_CON = ["Contanti", "Carta prepagata 8006", "Carta di debito 1894", "Pagato da me", "Carta di credito personale"];
const CARTE = ["Carta prepagata 8006", "Carta di debito 1894"];
const COLORE_STATO = { "Da controllare": C.grey, "Controllata": C.green, "Da chiarire": C.orange, "Annullata": C.grey };

const dataIt = (d) => d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : "";
const oraIt = (ts) => ts ? new Date(ts).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
const euroN = (n) => euro(Math.round(Number(n || 0) * 100));
const kb = (n) => n >= 1048576 ? (n / 1048576).toFixed(1).replace(".", ",") + " MB" : Math.round(n / 1024) + " KB";

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
function Scelta({ voci, valore, onScegli, etichetta = (v) => t(v) }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {voci.map((v) => (
        <button key={v} type="button" onClick={() => onScegli(v)}
          style={{ padding: "16px 8px", fontSize: 15, fontWeight: 700, borderRadius: 12, cursor: "pointer", minHeight: 58,
            border: `2px solid ${valore === v ? C.primary : C.border}`, background: valore === v ? C.primary : "#FFF", color: valore === v ? "#FFF" : C.text }}>
          {etichetta(v)}
        </button>
      ))}
    </div>
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
    { id: "nuova", label: "Nuova spesa", icon: "📷" },
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
      {vista === "nuova" && <NuovaSpesa contanti={contanti} utente={utente} onFatto={aggiornaContatori} vaiAMie={() => setVista("mie")} />}
      {vista === "mie" && <LeMieSpese utente={utente} giro={giro} onCambio={aggiornaContatori} />}
      {vista === "contanti" && contanti && <IMieiContanti utente={utente} />}
      {vista === "strumenti" && <Strumenti />}
    </div>
  );
}

// ============================================================================
// NUOVA SPESA — passi 1–5 della procedura approvata
// ============================================================================
function NuovaSpesa({ contanti, utente, onFatto, vaiAMie }) {
  const [passo, setPasso] = useState(1);
  // passo 1 — documento
  const [cv, setCv] = useState(null);
  const [statoCv, setStatoCv] = useState("caricamento");
  const [foto, setFoto] = useState(null);           // canvas della foto in lavorazione
  const [angoli, setAngoli] = useState(null);
  const [comeAngoli, setComeAngoli] = useState("");
  const [pagine, setPagine] = useState([]);         // [{ jpeg, w, h, anteprima }]
  const [pdfCaricato, setPdfCaricato] = useState(null);   // PDF scelto dal telefono (acquisto online)
  const [prima, setPrima] = useState(null);         // ImageData della prima pagina, per leggere il totale
  const [lavoro, setLavoro] = useState("");
  const [errore, setErrore] = useState("");
  // passo 2
  const [tipo, setTipo] = useState("");
  const [tipoAltro, setTipoAltro] = useState("");
  const [pagatoCon, setPagatoCon] = useState("");
  // passo 3
  const [importo, setImporto] = useState("");
  const [totale, setTotale] = useState(null);       // { cent, regola, riga } letto dalla foto
  const [statoTotale, setStatoTotale] = useState("");
  const [data, setData] = useState(oggiRoma());
  const [dataPagamento, setDataPagamento] = useState("");
  const [fornitore, setFornitore] = useState("");
  const [nota, setNota] = useState("");
  const [fotoOggetto, setFotoOggetto] = useState(null);   // { jpeg, url }
  // passo 4–5
  const [pdf, setPdf] = useState(null);             // { byte, impronta, url }
  const [esito, setEsito] = useState(null);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    caricaOpenCV().then((s) => { setCv(s.cv); setStatoCv("pronto"); }, () => setStatoCv("assente"));
  }, []);
  useEffect(() => () => { if (pdf && pdf.url) URL.revokeObjectURL(pdf.url); }, [pdf]);

  const ricomincia = () => {
    setPasso(1); setFoto(null); setAngoli(null); setPagine([]); setPdfCaricato(null); setPrima(null); setErrore("");
    setTipo(""); setTipoAltro(""); setPagatoCon(""); setImporto(""); setTotale(null); setStatoTotale("");
    setData(oggiRoma()); setDataPagamento(""); setFornitore(""); setNota(""); setFotoOggetto(null); setPdf(null); setEsito(null);
  };

  // ---- passo 1: foto → angoli → pagina in bianco e nero
  const nuovaFoto = async (file) => {
    setErrore(""); setLavoro(t("Apro la foto…"));
    try {
      const c = await apriFoto(file);
      setFoto(c);
      let m = cv;
      if (!m) { try { m = (await caricaOpenCV()).cv; setCv(m); setStatoCv("pronto"); } catch (e) { m = null; } }
      const r = m ? trovaAngoli(m, c) : null;
      if (r) { setAngoli(r.angoli); setComeAngoli(r.sicuro ? t("Bordi trovati: controlla gli angoli gialli") : t("Bordi incerti: sposta gli angoli gialli con il dito")); }
      else { setAngoli(angoliTuttaFoto(c)); setComeAngoli(t("Bordi non trovati: sposta gli angoli gialli con il dito")); }
    } catch (e) { setErrore(t("La foto non si apre") + ": " + e.message); }
    setLavoro("");
  };
  const confermaPagina = async () => {
    setErrore(""); setLavoro(t("Raddrizzo la pagina…"));
    await new Promise((r) => setTimeout(r, 30));      // lascia comparire la scritta
    try {
      const dritta = raddrizza(foto, angoli);
      const bn = biancoNero(dritta);
      const jpeg = await jpegDa(bn, 0.7);
      const k = Math.min(1, 360 / Math.max(bn.width, bn.height));
      const mini = document.createElement("canvas"); mini.width = Math.round(bn.width * k); mini.height = Math.round(bn.height * k);
      mini.getContext("2d").drawImage(bn, 0, 0, mini.width, mini.height);
      setPagine((p) => [...p, { jpeg, w: bn.width, h: bn.height, anteprima: mini.toDataURL("image/jpeg", 0.6) }]);
      if (!pagine.length) setPrima(dritta);
      setFoto(null); setAngoli(null); setPdf(null);
    } catch (e) { setErrore(t("Pagina non raddrizzata") + ": " + e.message); }
    setLavoro("");
  };
  const scegliPdf = async (file) => {
    setErrore("");
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name || "")) { setErrore(t("Il file scelto non è un PDF")); return; }
    if (file.size > 20 * 1024 * 1024) { setErrore(t("Il PDF supera 20 MB")); return; }
    const byte = new Uint8Array(await file.arrayBuffer());
    setPdfCaricato({ byte, nome: file.name || "documento.pdf", dimensione: file.size });
    setPagine([]); setPrima(null); setFoto(null); setAngoli(null); setPdf(null);
    if (!tipo) setTipo("Acquisto online");
  };
  const documentoPronto = pagine.length > 0 || !!pdfCaricato;

  // lettura del totale sulla prima pagina (in sottofondo, mentre si sceglie il tipo)
  useEffect(() => {
    if (!prima) { setTotale(null); setStatoTotale(""); return; }
    let vivo = true;
    setStatoTotale("lettura");
    leggiTotale(prima).then(
      (r) => { if (!vivo) return; setTotale(r); setStatoTotale(r ? "letto" : "nessuno"); if (r) setImporto((v) => v || (r.cent / 100).toFixed(2).replace(".", ",")); },
      () => { if (vivo) setStatoTotale("errore"); });
    return () => { vivo = false; };
  }, [prima]);

  // ---- passo 3: foto dell'oggetto (a colori, lato lungo 1.280 pixel)
  const scegliFotoOggetto = async (file) => {
    try {
      const c = await apriFoto(file, 1280);
      const jpeg = await jpegDa(c, 0.8);
      setFotoOggetto({ jpeg, url: c.toDataURL("image/jpeg", 0.6) });
    } catch (e) { setErrore(t("La foto non si apre") + ": " + e.message); }
  };

  // ---- controlli prima del riepilogo
  const oggi = oggiRoma();
  const cent = centesimi(importo);
  const controlliPasso3 = () => {
    if (cent == null || cent <= 0) return t("Scrivi l'importo pagato");
    if (!data) return t("Scrivi la data del documento");
    if (data > oggi) return t("La data del documento non può essere nel futuro");
    if (CARTE.includes(pagatoCon) && dataPagamento) {
      if (dataPagamento > oggi) return t("La data del pagamento non può essere nel futuro");
      const minimo = new Date(data + "T12:00:00Z"); minimo.setUTCDate(minimo.getUTCDate() - 30);
      if (dataPagamento < minimo.toISOString().slice(0, 10)) return t("La data del pagamento non può essere più di 30 giorni prima del documento");
    }
    return "";
  };
  const vaiRiepilogo = () => {
    const e = controlliPasso3(); if (e) { setErrore(e); return; }
    setErrore("");
    const byte = pdfCaricato ? pdfCaricato.byte : creaPdf(pagine);
    if (pdf && pdf.url) URL.revokeObjectURL(pdf.url);
    setPdf({ byte, impronta: md5(byte), url: URL.createObjectURL(new Blob([byte], { type: "application/pdf" })) });
    setPasso(4);
  };

  // ---- passo 4 → 5: salvataggio
  const salva = async () => {
    if (salvo) return;
    setSalvo(true); setErrore("");
    const spesa = {
      pdf: pdf.byte, impronta: pdf.impronta, foto: fotoOggetto ? fotoOggetto.jpeg : null,
      tipo, tipoAltro: tipo === "Altro" ? tipoAltro.trim() : "", pagatoCon, data,
      dataPagamento: CARTE.includes(pagatoCon) && dataPagamento && dataPagamento !== data ? dataPagamento : null,
      importo: cent / 100, totaleLetto: totale ? totale.cent / 100 : null, fornitore: fornitore.trim(), nota: nota.trim(),
    };
    let r = await inviaSpesa(spesa);
    if (r.esito === "rete") {
      try { await mettiInCoda(spesa, utente); r = { esito: "telefono" }; }
      catch (e) { r = { esito: "errore", messaggio: t("Niente rete e memoria del telefono non disponibile: la spesa NON è salvata") }; }
    }
    setEsito(r); setPasso(5); setSalvo(false);
    if (onFatto) onFatto();
  };

  // ---------------------------------------------------------------- disegno
  const intestazione = (
    <div style={{ display: "flex", gap: 4, margin: "10px 12px 0" }}>
      {[1, 2, 3, 4].map((n) => <div key={n} style={{ flex: 1, height: 6, borderRadius: 3, background: passo >= n ? C.primary : C.border }} />)}
    </div>
  );

  if (passo === 5 && esito) return (
    <div style={st.scheda}>
      {esito.esito === "salvata" && <Avviso tipo="ok">✓ {t("Salvata")} – n. {esito.numero}{esito.codice ? `\n${t("In attesa della banca")}: ${esito.codice}` : ""}</Avviso>}
      {esito.esito === "telefono" && <Avviso tipo="giallo">📵 {t("Niente rete: la spesa è rimasta nel telefono. Si invia da sola quando torna la rete (oppure da «Le mie spese» → «Riprova ora»).")}</Avviso>}
      {esito.esito === "doppia" && <Avviso tipo="giallo">{esito.messaggio}</Avviso>}
      {esito.esito === "errore" && <Avviso tipo="ko">{t("Non salvata")}: {esito.messaggio}</Avviso>}
      {esito.esito === "errore"
        ? <><Tasto onClick={() => setPasso(4)}>{t("Torna al riepilogo")}</Tasto><Tasto pieno={false} onClick={ricomincia}>{t("Lascia perdere e ricomincia")}</Tasto></>
        : <><Tasto grande onClick={ricomincia}>📷 {t("Nuova spesa")}</Tasto><Tasto pieno={false} onClick={vaiAMie}>🧾 {t("Le mie spese")}</Tasto></>}
    </div>
  );

  return (
    <div>
      {intestazione}
      {passo === 1 && (
        <div style={st.scheda}>
          <div style={st.titolo}>1 · {t("Foto del documento")}</div>
          {!foto && (
            <>
              <SceltaFile accept="image/*" capture="environment" onFile={nuovaFoto}>📷 {pagine.length ? t("Fotografa un'altra pagina") : t("Fotocamera")}</SceltaFile>
              <SceltaFile accept="image/*" onFile={nuovaFoto} pieno={false}>🖼️ {t("Scegli dalla galleria")}</SceltaFile>
              {!pagine.length && <SceltaFile accept="application/pdf,.pdf" onFile={scegliPdf} pieno={false} colore={C.blue}>📄 {t("Ho già il PDF (acquisto online)")}</SceltaFile>}
              {statoCv === "caricamento" && <div style={st.piccolo}>{t("Preparo il riconoscimento dei bordi…")}</div>}
              {statoCv === "assente" && <div style={st.piccolo}>{t("Riconoscimento dei bordi non disponibile: gli angoli si mettono a mano.")}</div>}
            </>
          )}
          {foto && angoli && <Angoli foto={foto} angoli={angoli} onCambia={setAngoli} />}
          {foto && angoli && (
            <>
              <div style={st.piccolo}>{comeAngoli}</div>
              <Tasto grande onClick={confermaPagina} disabled={!!lavoro}>✓ {t("Conferma la pagina")}</Tasto>
              <Tasto pieno={false} onClick={() => setAngoli(angoliTuttaFoto(foto))}>{t("Usa tutta la foto")}</Tasto>
              <Tasto pieno={false} colore={C.red} onClick={() => { setFoto(null); setAngoli(null); }}>{t("Scarta questa foto")}</Tasto>
            </>
          )}
          {lavoro && <Avviso>{lavoro}</Avviso>}
          {errore && <Avviso tipo="ko">{errore}</Avviso>}
          {pagine.length > 0 && !foto && (
            <>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", margin: "10px 0" }}>
                {pagine.map((p, i) => (
                  <div key={i} style={{ position: "relative", flex: "0 0 auto" }}>
                    <img src={p.anteprima} alt={t("Pagina {n}", { n: i + 1 })} style={{ height: 150, border: `1px solid ${C.border}`, borderRadius: 6 }} />
                    <button type="button" onClick={() => { setPagine((x) => x.filter((_, j) => j !== i)); if (i === 0) setPrima(null); }}
                      style={{ position: "absolute", top: 2, right: 2, background: C.red, color: "#FFF", border: "none", borderRadius: 10, width: 24, height: 24, fontWeight: 800 }}>×</button>
                  </div>
                ))}
              </div>
              <div style={st.piccolo}>{t("Pagine: {n}. Il PDF esce in bianco e nero.", { n: pagine.length })}</div>
            </>
          )}
          {pdfCaricato && <Avviso tipo="ok">📄 {pdfCaricato.nome} ({kb(pdfCaricato.dimensione)})</Avviso>}
          {pdfCaricato && <Tasto pieno={false} colore={C.red} onClick={() => setPdfCaricato(null)}>{t("Togli il PDF")}</Tasto>}
          {documentoPronto && !foto && <Tasto grande onClick={() => { setErrore(""); setPasso(2); }}>{t("Avanti")} →</Tasto>}
        </div>
      )}

      {passo === 2 && (
        <div style={st.scheda}>
          <div style={st.titolo}>2 · {t("Che documento è e come hai pagato")}</div>
          <div style={st.etichetta}>{t("Tipo di documento")}</div>
          <Scelta voci={TIPI} valore={tipo} onScegli={setTipo} />
          {tipo === "Altro" && <input style={{ ...st.campo, marginTop: 8 }} value={tipoAltro} onChange={(e) => setTipoAltro(e.target.value)} placeholder={t("Che cos'è?")} />}
          <div style={st.etichetta}>{t("Pagato con")}</div>
          <Scelta voci={PAGATO_CON.filter((p) => contanti || p !== "Contanti")} valore={pagatoCon} onScegli={setPagatoCon} />
          <Tasto grande disabled={!tipo || !pagatoCon || (tipo === "Altro" && !tipoAltro.trim())} onClick={() => setPasso(3)}>{t("Avanti")} →</Tasto>
          <Tasto pieno={false} onClick={() => setPasso(1)}>← {t("Indietro")}</Tasto>
        </div>
      )}

      {passo === 3 && (
        <div style={st.scheda}>
          <div style={st.titolo}>3 · {t("Importo e data")}</div>
          <label style={st.etichetta}>{t("Importo pagato (€)")}</label>
          <input style={{ ...st.campo, fontSize: 22, fontWeight: 800 }} inputMode="decimal" value={importo} onChange={(e) => setImporto(e.target.value)} placeholder="0,00" />
          {statoTotale === "lettura" && <div style={st.piccolo}>{t("Leggo il totale sul documento…")}</div>}
          {statoTotale === "nessuno" && <div style={st.piccolo}>{t("Nessun totale letto sul documento: controlla a vista.")}</div>}
          {statoTotale === "errore" && <div style={st.piccolo}>{t("Lettura del totale non riuscita: scrivi l'importo.")}</div>}
          {totale && cent != null && cent !== totale.cent && (
            <Avviso tipo="giallo">⚠ {t("Sul documento leggo {a}, è scritto {b}: vale il documento, controlla.", { a: euro(totale.cent), b: euro(cent) })}</Avviso>
          )}
          {totale && cent === totale.cent && <div style={{ ...st.piccolo, color: C.green }}>✓ {t("Coincide con il totale letto sul documento.")}</div>}
          <label style={st.etichetta}>{t("Data del documento")}</label>
          <input style={st.campo} type="date" value={data} max={oggi} onChange={(e) => setData(e.target.value)} />
          {CARTE.includes(pagatoCon) && (
            <>
              <label style={st.etichetta}>{t("Data del pagamento (solo se diversa)")}</label>
              <input style={st.campo} type="date" value={dataPagamento} max={oggi} onChange={(e) => setDataPagamento(e.target.value)} />
              <div style={st.piccolo}>{t("Per esempio una fattura vecchia pagata oggi. Se resta vuota vale la data del documento.")}</div>
            </>
          )}
          <label style={st.etichetta}>{t("Fornitore (facoltativo)")}</label>
          <input style={st.campo} value={fornitore} onChange={(e) => setFornitore(e.target.value)} />
          <label style={st.etichetta}>{t("Nota (facoltativa)")}</label>
          <textarea style={{ ...st.campo, minHeight: 60 }} value={nota} onChange={(e) => setNota(e.target.value)} />
          <div style={st.etichetta}>{t("Foto dell'oggetto (facoltativa)")}</div>
          {fotoOggetto
            ? <div><img src={fotoOggetto.url} alt="" style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8 }} /><Tasto pieno={false} colore={C.red} onClick={() => setFotoOggetto(null)}>{t("Togli la foto dell'oggetto")}</Tasto></div>
            : <SceltaFile accept="image/*" capture="environment" onFile={scegliFotoOggetto} pieno={false}>📸 {t("Fotografa l'oggetto")}</SceltaFile>}
          {errore && <Avviso tipo="ko">{errore}</Avviso>}
          <Tasto grande onClick={vaiRiepilogo}>{t("Avanti")} →</Tasto>
          <Tasto pieno={false} onClick={() => { setErrore(""); setPasso(2); }}>← {t("Indietro")}</Tasto>
        </div>
      )}

      {passo === 4 && pdf && (
        <div style={st.scheda}>
          <div style={st.titolo}>4 · {t("Riepilogo")}</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 8 }}>
            {pagine.map((p, i) => <img key={i} src={p.anteprima} alt="" style={{ height: 120, border: `1px solid ${C.border}`, borderRadius: 6 }} />)}
          </div>
          <a href={pdf.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>📄 {t("Apri il PDF")} ({kb(pdf.byte.length)})</a>
          {[
            [t("Documento"), tipo === "Altro" ? `${t("Altro")}: ${tipoAltro}` : t(tipo), 2],
            [t("Pagato con"), t(pagatoCon), 2],
            [t("Importo"), euro(cent), 3],
            [t("Data del documento"), dataIt(data), 3],
            ...(CARTE.includes(pagatoCon) && dataPagamento && dataPagamento !== data ? [[t("Data del pagamento"), dataIt(dataPagamento), 3]] : []),
            ...(fornitore.trim() ? [[t("Fornitore"), fornitore.trim(), 3]] : []),
            ...(nota.trim() ? [[t("Nota"), nota.trim(), 3]] : []),
            [t("Foto dell'oggetto"), fotoOggetto ? t("sì") : t("no"), 3],
          ].map(([e, v, p]) => (
            <div key={e} onClick={() => setPasso(p)} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "11px 2px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
              <span style={{ color: C.muted, fontSize: 14 }}>{e}</span>
              <span style={{ fontWeight: 700, fontSize: 15, textAlign: "right" }}>{v} ✎</span>
            </div>
          ))}
          {totale && cent !== totale.cent && <Avviso tipo="giallo">⚠ {t("Sul documento leggo {a}, è scritto {b}: vale il documento, controlla.", { a: euro(totale.cent), b: euro(cent) })}</Avviso>}
          {errore && <Avviso tipo="ko">{errore}</Avviso>}
          <Tasto grande colore={C.green} onClick={salva} disabled={salvo}>{salvo ? t("Salvo…") : "💾 " + t("Salva")}</Tasto>
          <Tasto pieno={false} onClick={() => setPasso(3)}>← {t("Indietro")}</Tasto>
        </div>
      )}
    </div>
  );
}

// angoli spostabili col dito sopra la foto
function Angoli({ foto, angoli, onCambia }) {
  const tela = useRef(null);
  const preso = useRef(-1);
  useEffect(() => {
    const c = tela.current; if (!c) return;
    const k = Math.min(1, 1200 / Math.max(foto.width, foto.height));
    c.width = Math.round(foto.width * k); c.height = Math.round(foto.height * k);
    const g = c.getContext("2d");
    g.drawImage(foto, 0, 0, c.width, c.height);
    const p = angoli.map(([x, y]) => [x * k, y * k]);
    g.fillStyle = "rgba(46,94,62,.18)"; g.strokeStyle = "#ffd400"; g.lineWidth = Math.max(3, c.width / 250);
    g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.stroke();
    const raggio = Math.max(10, c.width / 45);
    p.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, raggio, 0, 7); g.fillStyle = "rgba(255,212,0,.85)"; g.fill(); g.lineWidth = 2; g.strokeStyle = "#1d2b22"; g.stroke(); });
  }, [foto, angoli]);
  const punto = (e) => {
    const r = tela.current.getBoundingClientRect();
    const sx = foto.width / r.width, sy = foto.height / r.height;
    return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sy, sx];
  };
  return (
    <canvas ref={tela} style={{ width: "100%", touchAction: "none", borderRadius: 8, border: `1px solid ${C.border}` }}
      onPointerDown={(e) => {
        const [x, y, sx] = punto(e);
        let meglio = -1, dist = 45 * sx;
        angoli.forEach(([ax, ay], i) => { const d = Math.hypot(ax - x, ay - y); if (d < dist) { dist = d; meglio = i; } });
        preso.current = meglio; if (meglio >= 0) e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (preso.current < 0) return;
        const [x, y] = punto(e);
        const nuovi = angoli.map((a) => [...a]);
        nuovi[preso.current] = [Math.max(0, Math.min(foto.width, x)), Math.max(0, Math.min(foto.height, y))];
        onCambia(nuovi);
      }}
      onPointerUp={() => { preso.current = -1; }}
      onPointerCancel={() => { preso.current = -1; }} />
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
              <div style={{ fontWeight: 700 }}>{dataIt(v.data)} · {euroN(v.importo)} · {t(v.pagatoCon)} · {t(v.tipo)}</div>
              {v.ultimoErrore && <Avviso tipo="ko">{t("Non salvata")}: {v.ultimoErrore}</Avviso>}
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
        <Tasto pieno={false} colore={C.blue} onClick={() => apri(spesa.pdf_percorso)}>📄 {t("Apri il PDF")}</Tasto>
        {spesa.foto_percorso && <Tasto pieno={false} colore={C.blue} onClick={() => apri(spesa.foto_percorso)}>📸 {t("Foto dell'oggetto")}</Tasto>}
      </div>
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
      {spesa.stato === "Da controllare" && !annullo && <Tasto pieno={false} colore={C.red} onClick={() => setAnnullo(true)}>{t("Annulla questa spesa")}</Tasto>}
      {spesa.stato === "Da controllare" && annullo && (
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
        let foto = null;
        if (ricevuta) {
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
              : <SceltaFile accept="image/*" capture="environment" pieno={false} onFile={async (f) => { try { const c = await apriFoto(f, 1600); setRicevuta({ jpeg: await jpegDa(c, 0.75) }); } catch (e) { setErrore(e.message); } }}>📸 {t("Foto della ricevuta del bancomat (facoltativa)")}</SceltaFile>)}
            {ricevuta && <div style={{ ...st.piccolo, color: C.green }}>✓ {t("Foto della ricevuta pronta")}</div>}
            <label style={st.etichetta}>{t("Nota (facoltativa)")}</label>
            <input style={st.campo} value={nota} onChange={(e) => setNota(e.target.value)} />
            <Tasto grande colore={C.green} disabled={lavoro} onClick={registra}>{lavoro ? t("Salvo…") : t("Registra")}</Tasto>
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
function Strumenti() {
  const [stato, setStato] = useState(null);
  const [errore, setErrore] = useState("");
  useEffect(() => {
    supabase.rpc("ci_strumenti_stato").then(({ data, error }) => { if (error) setErrore(error.message); else setStato(data); });
  }, []);
  const c = stato && stato.carta_1894;
  const residuo = c ? Number(c.residuo) : null;
  const colore = c ? (Number(c.usato) > Number(c.limite) ? C.red : residuo < 1600 ? C.yellow : C.green) : C.text;
  return (
    <div>
      <div style={st.scheda}>
        <div style={st.titolo}>💳 {t("Carta di debito 1894")}</div>
        {errore && <Avviso tipo="ko">{errore}</Avviso>}
        {!c && !errore && t("Caricamento...")}
        {c && (
          <>
            <div style={st.piccolo}>{t("Mese")}: {c.mese ? `${c.mese.slice(5, 7)}/${c.mese.slice(0, 4)}` : ""}</div>
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              {t("Limite del mese")}: <b>{c.limite == null ? "—" : euroN(c.limite)}</b><br />
              {t("Già usato")}: <b>{euroN(c.usato)}</b><br />
              {t("Residuo")}: <b style={{ color: colore, fontSize: 20 }}>{c.limite == null ? "—" : euroN(c.residuo)}</b>
            </div>
            {Number(c.usato) > Number(c.limite) && <Avviso tipo="ko">{t("Limite superato")}</Avviso>}
          </>
        )}
      </div>
      <div style={st.scheda}>
        <div style={st.titolo}>💳 {t("Carta prepagata 8006")}</div>
        <div style={{ fontSize: 14, color: C.muted }}>{t("Saldo non disponibile")}</div>
      </div>
    </div>
  );
}
