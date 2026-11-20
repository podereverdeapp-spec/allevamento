/* eslint-disable react-hooks/exhaustive-deps */
// ============================================================================
// v149 — «Spese pagate»: NUOVA SPESA, passi 1–8.
// Procedura del Tenente del 20/11/2026 ore 11:59 (decisioni del Dott. Bizzarri del 17–20/11).
// 1 con che cosa paghi → 2 che documento hai → 3 documento d'acquisto (scansione e lettura) →
// 4 ricevuta di pagamento → 5 che cosa hai comprato → 6 foto del bene → 7 riepilogo → 8 salva.
// L'app non scrive nelle tabelle: archivio «cassa» + funzione ci_spesa_registra (spese_coda.js).
// ============================================================================
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { t } from "./i18n";
import { oggiRoma } from "./dateRoma";
import { md5 } from "./md5";
import {
  caricaOpenCV, apriFoto, angoliTuttaFoto, trovaAngoli, raddrizza, biancoNero,
  jpegDa, creaPdf, centesimi, euro, leggiTesto, leggiPdf, qrImmagine, raddrizzaDaSolo,
} from "./scanner";
import {
  leggiDocumento, leggiPagamento, pdfLeggibile, partitaIvaAccettabile, partitaIvaPulita, codiceFiscaleValido, altraCarta,
} from "./spese_lettura";
import { inviaSpesa, mettiInCoda, erroreDiRete } from "./spese_coda";

// natura dell'operazione con IVA 0 (codici della fattura elettronica)
const NATURE = [["N1", "Escluse ex articolo 15"], ["N2.1", "Non soggette: articoli da 7 a 7-septies"], ["N2.2", "Non soggette: altri casi"],
  ["N3.1", "Non imponibili: esportazioni"], ["N3.2", "Non imponibili: cessioni intracomunitarie"], ["N3.5", "Non imponibili: dichiarazione d'intento"],
  ["N3.6", "Non imponibili: altre operazioni"], ["N4", "Esenti"], ["N5", "Regime del margine"], ["N6.9", "Inversione contabile: altri casi"]];
const C = { primary: "#5C3D1E", border: "#D4C4A8", muted: "#8B7355", red: "#C0392B", green: "#2E7D32",
  orange: "#E67E22", yellow: "#B7950B", blue: "#1F6FB2", text: "#2D1B0E" };

const TIPI = ["Scontrino", "Fattura", "Ricevuta", "Acquisto online", "Altro"];
const TIPI_RICEVUTA = ["Parcheggio o pedaggio", "PagoPA o bollettino", "Quietanza di un privato", "Prestazione occasionale", "Altro"];
const SENZA_RICEVUTA_PAGAMENTO = ["Contanti", "Pagato da me"];      // strumenti che non emettono un documento di pagamento
const SOLDI_PROPRI = ["Pagato da me", "La mia carta", "Carta di credito personale"];

// dati per la fattura (decisione del 17/11 21:49, confermati il 18/11 11:23)
const DATI_FATTURA = [
  ["Ragione sociale", "SOCIETA' AGRICOLA PODERE VERDE A RESPONSABILITA' LIMITATA"],
  ["Indirizzo", "Via Portuense 1118, 00148 Roma"],
  ["Codice fiscale e partita IVA", "15117871002"],
  ["Codice destinatario", "KRRH6B9"],
  ["PEC", "agricolapodereverdesrl@pec.it"],
];
const ISTRUZIONI_ONLINE = [
  "Gli acquisti online si fanno solo con l'account Google podereverdeapp@gmail.com.",
  "Metti l'account nel tuo PC: apri Chrome, fai clic sull'icona del profilo in alto a destra, scegli «Aggiungi», crea il profilo «Podere Verde» e accedi con podereverdeapp@gmail.com e la password che ti dà il Dott. Bizzarri.",
  "Fai gli acquisti online solo da quel profilo.",
  "Registra la spesa nell'app, nello strumento che hai usato, con il documento dell'ordine, il numero dell'ordine, il venditore e la conferma di pagamento.",
];

const dataIt = (d) => (d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : "");
const euroN = (n) => (n == null ? "—" : euro(Math.round(Number(n) * 100)));
const centInput = (c) => (c == null ? "" : (c / 100).toFixed(2).replace(".", ","));
const cifreDi = (nome) => { const m = String(nome || "").match(/\b(\d{4})\b/); return m ? m[1] : null; };
const emetteRicevuta = (strumento, tipo) => tipo === "Acquisto online" || (strumento && !SENZA_RICEVUTA_PAGAMENTO.includes(strumento));
const trattini = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");

// ---------------------------------------------------------------- pezzi grafici
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
function Scelta({ voci, valore, onScegli, colonne = 2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${colonne}, 1fr)`, gap: 8 }}>
      {voci.map((v) => (
        <button key={v} type="button" onClick={() => onScegli(v)}
          style={{ padding: "14px 8px", fontSize: 15, fontWeight: 700, borderRadius: 12, cursor: "pointer", minHeight: 54,
            border: `2px solid ${valore === v ? C.primary : C.border}`, background: valore === v ? C.primary : "#FFF", color: valore === v ? "#FFF" : C.text }}>
          {t(v)}
        </button>
      ))}
    </div>
  );
}
function Avviso({ tipo = "info", children }) {
  const col = { ok: [C.green, "#E8F5E9"], ko: [C.red, "#FDECEA"], giallo: [C.yellow, "#FEF9E7"], info: [C.blue, "#EAF2FB"] }[tipo];
  return <div style={{ border: `1.5px solid ${col[0]}`, background: col[1], color: col[0], borderRadius: 10, padding: "10px 12px", fontSize: 14, fontWeight: 600, margin: "8px 0", whiteSpace: "pre-wrap" }}>{children}</div>;
}
function SceltaFile({ accept, capture, onFile, children, colore, pieno, disabled }) {
  const rif = useRef(null);
  return (
    <>
      <input ref={rif} type="file" accept={accept} capture={capture} style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) onFile(f); }} />
      <Tasto colore={colore} pieno={pieno} grande disabled={disabled} onClick={() => rif.current && rif.current.click()}>{children}</Tasto>
    </>
  );
}
// le due possibilità per OGNI scansione (decisione dell'11/11 21:30, ribadita il 20/11 11:18)
function DuePossibilita({ onFile, accetta = "image/*,application/pdf,.pdf", disabled, scatta = "Scatta la foto" }) {
  return (
    <>
      <SceltaFile accept="image/*" capture="environment" onFile={onFile} disabled={disabled}>📷 {t(scatta)}</SceltaFile>
      <SceltaFile accept={accetta} onFile={onFile} pieno={false} disabled={disabled}>📁 {t("Carica dal telefono")}</SceltaFile>
    </>
  );
}
// campo con il valore letto: se la persona scrive un valore diverso compare l'avviso rosso
function CampoLetto({ etichetta, valore, letto, onCambia, mostra = (x) => x, tipo = "text", inputMode, placeholder }) {
  const diverso = letto != null && letto !== "" && String(valore ?? "").trim() !== "" && trattini(valore) !== trattini(letto);
  return (
    <div>
      <label style={st.etichetta}>{t(etichetta)}{letto != null && letto !== "" ? <span style={{ fontWeight: 400, color: C.muted }}> · {t("letto")}: {mostra(letto)}</span> : <span style={{ fontWeight: 400, color: C.muted }}> · {t("non letto")}</span>}</label>
      <input style={{ ...st.campo, borderColor: diverso ? C.red : C.border }} type={tipo} inputMode={inputMode} value={valore ?? ""} placeholder={placeholder}
        onChange={(e) => onCambia(e.target.value)} />
      {diverso && <div style={{ color: C.red, fontSize: 13, fontWeight: 700, marginTop: 4 }}>⚠ {t("Il documento dice {a}, tu hai scritto {b}: controlla", { a: mostra(letto), b: valore })}</div>}
    </div>
  );
}

// ============================================================================
const VUOTA = () => ({
  // passo 1
  pagatoCon: "", cartella: "", resto: false, oraPago: null,
  // passo 2
  tipo: "", tipoRicevuta: "", tipoAltro: "", lordo: "", cfPercipiente: "", ordineNumero: "", venditore: "",
  // passo 3
  fornitore: "", partitaIva: "", data: oggiRoma(), oraDocumento: "", importo: "", numeroDocumento: "", fatturaInArrivo: false, iva: [],
  // passo 5–6
  acquisto: "", acquistoOrigine: "", bene: null,
  // passo 7
  nota: "",
});

export default function NuovaSpesa({ utente, onFatto, vaiAMie }) {
  const [passo, setPasso] = useState(1);
  const [s, setS] = useState(VUOTA());
  const cambia = (x) => setS((v) => ({ ...v, ...x }));
  const [chiediAnnulla, setChiediAnnulla] = useState(false);

  // ---- passo 1: strumenti e residui
  const [strumenti, setStrumenti] = useState(null);       // [{ nome, cartella, limite, resta, nota }]
  const [datiDel, setDatiDel] = useState(null);            // ora dei numeri mostrati se senza rete
  const [erroreStrumenti, setErroreStrumenti] = useState("");
  const [fatturaAperta, setFatturaAperta] = useState(false);
  const [qr, setQr] = useState(null);

  // ---- passo 3: documento
  const [cv, setCv] = useState(null);
  const [foto, setFoto] = useState(null);
  const [angoli, setAngoli] = useState(null);
  const [comeAngoli, setComeAngoli] = useState("");
  const [pagine, setPagine] = useState([]);                // foto: [{ bn, grigio (canvas), jpeg, w, h, anteprima }]
  const [pdfCaricato, setPdfCaricato] = useState(null);    // { byte, nome, pagine: [{ testo, tela }] }
  const [letto, setLetto] = useState(null);                // dati letti dal documento
  const [tentativi, setTentativi] = useState(0);
  const [migliore, setMigliore] = useState(null);          // { pagine, letto } della prova con più dati letti
  const [aMano, setAMano] = useState(false);
  const [serveInsegna, setServeInsegna] = useState(false);  // scontrino illeggibile (decisioni 17/11 21:01 e 21:13): con ogni strumento
  const [insegna, setInsegna] = useState(null);            // { jpeg, url }
  const [senzaDocumento, setSenzaDocumento] = useState(false); // tipo «Altro» senza documento (decisione del Dottore 20/11 12:39)
  const [controllo, setControllo] = useState(false);       // schermata «Controlla i dati letti»
  const [documento, setDocumento] = useState(null);        // { byte, impronta, url, anteprime }
  // ---- passo 4
  const [pagamento, setPagamento] = useState(null);        // { byte, tipo, anteprima, letto }
  // ---- passo 6
  const [fotoBene, setFotoBene] = useState(null);          // { jpeg, url }
  // ---- passo 7–8
  const [regole, setRegole] = useState(null);              // { ok, messaggio }
  const [chiediQuota, setChiediQuota] = useState(false);
  const [esito, setEsito] = useState(null);
  const [motivoDoppione, setMotivoDoppione] = useState("");
  const [lavoro, setLavoro] = useState("");
  const [errore, setErrore] = useState("");

  // ------------------------------------------------------------------ passo 1: caricamento
  const caricaStrumenti = async () => {
    setErroreStrumenti("");
    const att = await supabase.rpc("ci_spese_strumenti_attivi");
    if (att.error) {
      // senza rete: ultimi numeri salvati nel telefono
      try {
        const salvati = JSON.parse(localStorage.getItem("spese_strumenti_" + utente) || "null");
        if (salvati) { setStrumenti(salvati.elenco); setDatiDel(salvati.ora); return; }
      } catch (e) { /* memoria non disponibile */ }
      setErroreStrumenti(erroreDiRete(att.error) ? t("Niente rete: riprova più tardi.") : att.error.message);
      setStrumenti([]);
      return;
    }
    const elenco = (att.data || []).map((r) => ({ nome: r.nome, cartella: r.cartella, limite: null, resta: null, nota: null }));
    // numeri: ci_spese_residui() (nuova); se non c'è ancora, ci_contanti_saldi() e ci_strumenti_stato()
    const res = await supabase.rpc("ci_spese_residui");
    if (!res.error && Array.isArray(res.data)) {
      for (const r of res.data) {
        const x = elenco.find((e) => e.nome === r.strumento);
        if (x) Object.assign(x, { limite: r.limite, resta: r.resta, nota: r.nota });
      }
    } else {
      const [sal, sta] = await Promise.all([supabase.rpc("ci_contanti_saldi"), supabase.rpc("ci_strumenti_stato")]);
      const mio = ((sal.data || []).find((r) => r.persona === utente)) || null;
      for (const x of elenco) {
        if (x.nome === "Contanti" && mio) { x.limite = mio.saldo; x.resta = mio.saldo; }
        if (x.nome === "Carta di debito 1894" && sta.data && sta.data.carta_1894) { x.limite = sta.data.carta_1894.limite; x.resta = sta.data.carta_1894.residuo; }
        if (x.nome === "Carta prepagata 8006" && sta.data && sta.data.carta_8006) { x.resta = sta.data.carta_8006.saldo ?? sta.data.carta_8006.residuo ?? null; }
        if (SOLDI_PROPRI.includes(x.nome)) x.nota = "Soldi tuoi: ti saranno rimborsati";
      }
    }
    setStrumenti(elenco); setDatiDel(null);
    try { localStorage.setItem("spese_strumenti_" + utente, JSON.stringify({ elenco, ora: new Date().toLocaleTimeString("it-IT", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit" }) })); } catch (e) { /* niente */ }
  };
  useEffect(() => {
    caricaStrumenti();
    caricaOpenCV().then((x) => setCv(x.cv), () => setCv(null));
  }, [utente]);
  useEffect(() => () => { if (documento && documento.url) URL.revokeObjectURL(documento.url); }, [documento]);

  const strumento = strumenti && strumenti.find((x) => x.nome === s.pagatoCon);
  const contantiInCarico = strumento && s.pagatoCon === "Contanti" && strumento.resta != null ? Number(strumento.resta) : null;

  // Scontrino e Fattura: partita IVA obbligatoria; senza, si va avanti solo con la foto dell'insegna (ogni strumento)
  const chiedeInsegna = (s.tipo === "Scontrino" || s.tipo === "Fattura") && !String(s.partitaIva || "").trim() && (aMano || serveInsegna || !!letto);
  const ricomincia = () => {
    setS(VUOTA()); setPasso(1); setChiediAnnulla(false); setFoto(null); setAngoli(null); setPagine([]); setPdfCaricato(null);
    setLetto(null); setTentativi(0); setMigliore(null); setAMano(false); setControllo(false); setDocumento(null);
    setPagamento(null); setFotoBene(null); setRegole(null); setChiediQuota(false); setEsito(null); setMotivoDoppione("");
    setServeInsegna(false); setInsegna(null); setSenzaDocumento(false);
    setLavoro(""); setErrore(""); caricaStrumenti();
  };

  // ------------------------------------------------------------------ passo 3: foto → pagina
  const nuovaFoto = async (file) => {
    setErrore("");
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")) return caricaPdfDocumento(file);
    setLavoro(t("Apro la foto…"));
    try {
      const c = await apriFoto(file);
      setFoto(c);
      let m = cv;
      if (!m) { try { m = (await caricaOpenCV()).cv; setCv(m); } catch (e) { m = null; } }
      const r = m ? trovaAngoli(m, c) : null;
      if (r) { setAngoli(r.angoli); setComeAngoli(r.sicuro ? t("Bordi trovati: controlla gli angoli gialli") : t("Bordi incerti: sposta gli angoli gialli con il dito")); }
      else { setAngoli(angoliTuttaFoto(c)); setComeAngoli(t("Bordi non trovati: sposta gli angoli gialli con il dito")); }
    } catch (e) { setErrore(t("La foto non si apre") + ": " + e.message); }
    setLavoro("");
  };
  const confermaPagina = async () => {
    setErrore(""); setLavoro(t("Raddrizzo la pagina…"));
    await new Promise((r) => setTimeout(r, 30));
    try {
      const dritta = raddrizza(foto, angoli);
      const bn = biancoNero(dritta);
      // pagina raddrizzata in grigi: è quella che si legge meglio (prova del 20/11 sulle prove 01 e 08)
      const grigio = document.createElement("canvas"); grigio.width = dritta.width; grigio.height = dritta.height;
      grigio.getContext("2d").putImageData(dritta, 0, 0);
      const jpeg = await jpegDa(bn, 0.7);
      const k = Math.min(1, 360 / Math.max(bn.width, bn.height));
      const mini = document.createElement("canvas"); mini.width = Math.round(bn.width * k); mini.height = Math.round(bn.height * k);
      mini.getContext("2d").drawImage(bn, 0, 0, mini.width, mini.height);
      setPagine((p) => [...p, { bn, grigio, jpeg, w: bn.width, h: bn.height, anteprima: mini.toDataURL("image/jpeg", 0.6) }]);
      setFoto(null); setAngoli(null);
    } catch (e) { setErrore(t("Pagina non raddrizzata") + ": " + e.message); }
    setLavoro("");
  };
  const caricaPdfDocumento = async (file) => {
    if (file.size > 20 * 1024 * 1024) { setErrore(t("Il PDF supera 20 MB")); return; }
    setLavoro(t("Apro il PDF…"));
    try {
      const byte = new Uint8Array(await file.arrayBuffer());
      const { pagine: pp } = await leggiPdf(byte);
      setPdfCaricato({ byte, nome: file.name || "documento.pdf", pagine: pp });
      setPagine([]); setFoto(null); setAngoli(null);
    } catch (e) { setErrore(t("Il PDF non si apre") + ": " + (e.message || e)); }
    setLavoro("");
  };

  // lettura del documento: PDF con testo → testo del PDF; altrimenti Tesseract su TUTTE le pagine.
  // Foto: i dati si leggono sulla pagina in grigi (più precisa); poi si rilegge il PDF in bianco e nero
  // (prima e ultima pagina: venditore, data, totale) per essere sicuri che il PDF sia leggibile
  // su qualunque telefono (decisione 18/11 14:42). Se il PDF non si rilegge: seconda prova.
  const leggiDocumentoOra = async () => {
    setErrore("");
    let testi = [];
    let pdfOk = true;
    try {
      if (pdfCaricato) {
        const conTesto = pdfCaricato.pagine.map((p) => p.testo || "").join("").replace(/\s/g, "").length > 30;
        if (conTesto) testi = pdfCaricato.pagine.map((p) => p.testo);
        else for (let i = 0; i < pdfCaricato.pagine.length; i++) {
          setLavoro(t("Leggo la pagina {n} di {m}…", { n: i + 1, m: pdfCaricato.pagine.length }));
          testi.push(await leggiTesto(pdfCaricato.pagine[i].tela));
        }
      } else {
        for (let i = 0; i < pagine.length; i++) {
          setLavoro(t("Leggo la pagina {n} di {m}…", { n: i + 1, m: pagine.length }));
          testi.push(await leggiTesto(pagine[i].grigio || pagine[i].bn));
        }
        const daRileggere = pagine.length > 1 ? [0, pagine.length - 1] : [0];
        const testiBn = [];
        for (const i of daRileggere) {
          setLavoro(t("Rileggo il PDF in bianco e nero…"));
          testiBn.push(await leggiTesto(pagine[i].bn));
        }
        pdfOk = pdfLeggibile(leggiDocumento(s.tipo, testiBn));
      }
    } catch (e) {
      setLavoro(""); setErrore(t("Lettura non riuscita: scrivi i dati a mano.")); setAMano(true); preparaControllo({}); return;
    }
    setLavoro("");
    const l = leggiDocumento(s.tipo, testi);
    const n = ["venditore", "data", "cent"].filter((k) => l[k] != null).length;
    if (pdfCaricato || (pdfLeggibile(l) && pdfOk)) { preparaControllo(l); return; }
    // foto non leggibile: seconda prova, poi a mano con la foto migliore
    const prova = tentativi + 1;
    setTentativi(prova);
    const meglio = !migliore || n > migliore.n ? { pagine, letto: l, n } : migliore;
    setMigliore(meglio);
    if (prova < 2) { setErrore(t("Foto non leggibile: rifalla (seconda prova).")); setPagine([]); return; }
    setPagine(meglio.pagine); setAMano(true);
    if (s.tipo === "Scontrino" || s.tipo === "Fattura") {
      setServeInsegna(true);
      setErrore(t("Anche la seconda foto non si legge: fotografa l'insegna o la ragione sociale del negozio, poi scrivi tu venditore, data e importo."));
    } else setErrore(t("Anche la seconda foto non si legge: scrivi tu venditore, data e importo."));
    preparaControllo(meglio.letto);
  };
  const preparaControllo = (l) => {
    setLetto(l);
    cambia({
      fornitore: (s.tipo === "Acquisto online" && s.venditore) || l.venditore || "", partitaIva: l.partitaIva || "", data: l.data || oggiRoma(), oraDocumento: l.ora || "",
      importo: s.tipoRicevuta === "Prestazione occasionale" ? centInput(nettoCent()) : centInput(l.cent),
      numeroDocumento: l.numero || "", iva: l.iva || [],
      ...(s.tipo === "Acquisto online" ? { ordineNumero: s.ordineNumero || l.ordine || "", venditore: s.venditore || l.venditore || "" } : {}),
      acquisto: (s.tipo === "Ricevuta" ? l.causale || l.acquisto : l.acquisto || l.causale) || "",
    });
    setControllo(true);
  };
  const lordoCent = () => centesimi(s.lordo);
  const nettoCent = () => { const l = lordoCent(); return l == null ? null : l - Math.round(l * 0.2); };
  const ritenutaCent = () => { const l = lordoCent(); return l == null ? null : Math.round(l * 0.2); };

  const chiudiDocumento = () => {
    // controlli dei dati del documento, poi PDF e impronta
    const cent = centesimi(s.importo);
    if (!s.fornitore.trim()) return setErrore(t("Scrivi chi ha venduto"));
    if (!s.data) return setErrore(t("Scrivi la data del documento"));
    if (s.data > oggiRoma()) return setErrore(t("La data del documento non può essere nel futuro"));
    if (cent == null || cent <= 0) return setErrore(t("Scrivi l'importo pagato"));
    if (s.partitaIva && !partitaIvaAccettabile(s.partitaIva)) return setErrore(t("Partita IVA non valida: correggila"));
    if (chiedeInsegna && !insegna) return setErrore(t("Scrivi la partita IVA di chi ha venduto (è sul documento); se il documento non si legge, fotografa l'insegna del negozio"));
    if (s.tipo === "Fattura" && !s.fatturaInArrivo && !s.numeroDocumento.trim()) return setErrore(t("Scrivi il numero della fattura"));
    if (s.tipo === "Fattura" && s.iva.some((r) => Number(r.aliquota) === 0 && !r.natura)) return setErrore(t("IVA 0: scegli la natura"));
    if (s.tipo === "Acquisto online" && (!s.ordineNumero.trim() || !s.venditore.trim())) return setErrore(t("Numero dell'ordine e venditore sono obbligatori"));
    if (serveInsegna && (s.tipo === "Scontrino" || s.tipo === "Fattura") && !s.partitaIva && !insegna) return setErrore(t("Manca la foto dell'insegna o della ragione sociale del negozio"));
    setErrore("");
    if (documento && documento.url) URL.revokeObjectURL(documento.url);
    if (senzaDocumento) {
      // nessun file del documento: l'impronta (che dà il nome agli altri file e alla spesa nel telefono)
      // si calcola sui dati scritti e sull'ora
      const chiave = new TextEncoder().encode([s.pagatoCon, s.tipoAltro, s.fornitore, s.data, s.importo, new Date().toISOString()].join("|"));
      setDocumento({ byte: null, impronta: md5(chiave), url: null, anteprime: [] });
      setControllo(false);
      setPasso(emetteRicevuta(s.pagatoCon, s.tipo) ? 4 : 5);
      return;
    }
    const byte = pdfCaricato ? pdfCaricato.byte : creaPdf(pagine);
    const anteprime = pdfCaricato ? pdfCaricato.pagine.slice(0, 4).map((p) => miniDa(p.tela)) : pagine.map((p) => p.anteprima);
    setDocumento({ byte, impronta: md5(byte), url: URL.createObjectURL(new Blob([byte], { type: "application/pdf" })), anteprime });
    setControllo(false);
    setPasso(emetteRicevuta(s.pagatoCon, s.tipo) ? 4 : 5);
  };

  // ------------------------------------------------------------------ passo 4: ricevuta di pagamento
  const nuovoPagamento = async (file) => {
    setErrore(""); setLavoro(t("Leggo la ricevuta…"));
    try {
      let byte, tipo, testo, anteprima, sparso = "";
      if (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")) {
        byte = new Uint8Array(await file.arrayBuffer()); tipo = "pdf";
        const { pagine: pp } = await leggiPdf(byte);
        testo = pp.map((p) => p.testo).join("\n");
        if (testo.replace(/\s/g, "").length < 10) testo = (await Promise.all(pp.map((p) => leggiTesto(p.tela)))).join("\n");
        anteprima = pp[0] ? miniDa(pp[0].tela) : null;
      } else {
        // bordi trovati da soli e ricevuta raddrizzata (si legge meglio); anche le schermate PNG diventano JPG
        const c = await raddrizzaDaSolo(await apriFoto(file, 1600));
        byte = await jpegDa(c, 0.8); tipo = "jpg";
        testo = await leggiTesto(c);
        sparso = await leggiTesto(c, "sparso");
        anteprima = miniDa(c);
      }
      impostaPagamento({ byte, tipo, anteprima, letto: leggiPagamento(testo, sparso) });
    } catch (e) { setErrore(t("La ricevuta non si apre") + ": " + (e.message || e)); }
    setLavoro("");
  };
  const impostaPagamento = (p) => {
    setPagamento(p);
    // documento non letto: si propongono i dati della ricevuta del POS (decisione del 17/11 21:09)
    const l = p.letto || {};
    const agg = {};
    if (!s.fornitore && l.venditore) agg.fornitore = l.venditore;
    if (!s.partitaIva && l.partitaIva) agg.partitaIva = l.partitaIva;
    if (!centesimi(s.importo) && l.cent != null) agg.importo = centInput(l.cent);
    if (Object.keys(agg).length) cambia(agg);
  };
  const stessoDocumento = () => impostaPagamento({ byte: documento.byte, tipo: "pdf", anteprima: documento.anteprime[0], letto: { cent: centesimi(s.importo), cifre: null }, stesso: true });
  const cifreStrumento = s.pagatoCon === "La mia carta" ? null : cifreDi(s.pagatoCon);
  const avvisiPagamento = () => {
    const a = [];
    if (!pagamento || pagamento.stesso) return a;
    const l = pagamento.letto || {};
    const cent = centesimi(s.importo);
    if (l.cent != null && cent != null && l.cent !== cent) a.push({ tipo: "ko", testo: t("La ricevuta dice {a}, il documento {b}: controlla", { a: euro(l.cent), b: euro(cent) }) });
    if (cifreStrumento && altraCarta(l.cifre, cifreStrumento)) a.push({ tipo: "ko", testo: t("Questa ricevuta è della carta ****{c}: hai scelto lo strumento giusto?", { c: l.cifre }) });
    if (l.cent == null) a.push({ tipo: "giallo", testo: t("Importo non letto sulla ricevuta: controlla a vista.") });
    return a;
  };

  const nuovaInsegna = async (file) => {
    try { const c = await apriFoto(file, 1600); setInsegna({ jpeg: await jpegDa(c, 0.8), url: c.toDataURL("image/jpeg", 0.6) }); setErrore(""); }
    catch (e) { setErrore(t("La foto non si apre") + ": " + e.message); }
  };

  // ------------------------------------------------------------------ passo 6: foto del bene
  const nuovaFotoBene = async (file) => {
    try { const c = await apriFoto(file, 1280); setFotoBene({ jpeg: await jpegDa(c, 0.8), url: c.toDataURL("image/jpeg", 0.6) }); }
    catch (e) { setErrore(t("La foto non si apre") + ": " + e.message); }
  };

  // ------------------------------------------------------------------ passo 7: riepilogo e regole
  const centImporto = centesimi(s.importo);
  const quotaDaMeCent = s.pagatoCon === "Contanti" && s.resto && contantiInCarico != null && centImporto != null
    ? Math.max(0, centImporto - Math.max(0, Math.round(contantiInCarico * 100))) : 0;
  useEffect(() => {
    if (passo !== 7) return;
    let vivo = true;
    setRegole(null);
    (async () => {
      const [mc, dm] = await Promise.all([
        supabase.rpc("ci_spese_mese_chiuso", { p: s.data }),
        supabase.rpc("ci_spese_data_minima", { p_pagato_con: s.pagatoCon }),
      ]);
      if (!vivo) return;
      if (mc.error || dm.error) {
        const e = mc.error || dm.error;
        setRegole({ ok: true, messaggio: erroreDiRete(e) ? t("Niente rete: le regole le controlla il database al salvataggio.") : "" });
        return;
      }
      if (mc.data === true) {
        const mese = new Date(s.data + "T12:00:00Z").toLocaleDateString("it-IT", { month: "long", year: "numeric", timeZone: "UTC" });
        setRegole({ ok: false, messaggio: t("Il mese di {m} è chiuso: chiedi all'amministrazione", { m: mese }) }); return;
      }
      if (dm.data && s.data < dm.data) { setRegole({ ok: false, messaggio: t("Per questo strumento le spese si registrano dal {d}: chiedi all'amministrazione", { d: dataIt(dm.data) }) }); return; }
      setRegole({ ok: true, messaggio: "" });
    })();
    // contanti che non bastano: proposta «Contanti + resto pagato da me»
    if (s.pagatoCon === "Contanti" && !s.resto && contantiInCarico != null && centImporto != null && centImporto > Math.round(contantiInCarico * 100)) setChiediQuota(true);
    return () => { vivo = false; };
  }, [passo]);

  // ------------------------------------------------------------------ passo 8: salva
  const spesaDaInviare = (confermaDoppione) => ({
    ...s,
    importo: centImporto / 100,
    totaleLetto: letto && letto.cent != null ? letto.cent / 100 : null,
    quotaDaMe: quotaDaMeCent / 100,
    prestazione: s.tipo === "Ricevuta" && s.tipoRicevuta === "Prestazione occasionale",
    lordo: lordoCent() != null ? lordoCent() / 100 : null,
    ritenuta: ritenutaCent() != null ? ritenutaCent() / 100 : null,
    pdf: documento.byte, impronta: documento.impronta,
    pagamento: pagamento ? pagamento.byte : null, pagamentoTipo: pagamento ? pagamento.tipo : null,
    foto: s.bene && fotoBene ? fotoBene.jpeg : null,
    insegna: insegna && (s.tipo === "Scontrino" || s.tipo === "Fattura") && !s.partitaIva ? insegna.jpeg : null,
    // cifre lette sulla ricevuta del POS: si mandano solo se sicure (uguali alla carta scelta o di un'altra carta);
    // una sola cifra diversa è quasi sempre un errore di lettura e non si manda
    cartaLetta: pagamento && !pagamento.stesso && pagamento.letto && pagamento.letto.cifre
      && (!cifreStrumento || pagamento.letto.cifre === cifreStrumento || altraCarta(pagamento.letto.cifre, cifreStrumento)) ? pagamento.letto.cifre : null,
    fatturaDaSdi: s.tipo === "Fattura" && !!s.fatturaInArrivo,
    confermaDoppione: confermaDoppione || null,
  });
  const salva = async (confermaDoppione) => {
    if (lavoro) return;
    setLavoro(t("Salvo…")); setErrore("");
    const spesa = spesaDaInviare(confermaDoppione);
    let r = await inviaSpesa(spesa);
    if (r.esito === "rete") {
      try { await mettiInCoda(spesa, utente); r = { esito: "telefono" }; }
      catch (e) { r = { esito: "errore", messaggio: t("Niente rete e memoria del telefono non disponibile: la spesa NON è salvata") }; }
    }
    setLavoro("");
    setEsito(r);
    if (r.esito === "salvata" || r.esito === "telefono") { setPasso(8); if (onFatto) onFatto(); }
  };

  // ------------------------------------------------------------------ disegno
  const annulla = passo >= 2 && passo <= 7 && !(passo === 8) && (
    <div style={{ margin: "0 12px" }}>
      {!chiediAnnulla
        ? <Tasto pieno={false} colore={C.red} onClick={() => setChiediAnnulla(true)}>✖ {t("Annulla – ricomincia")}</Tasto>
        : <Avviso tipo="ko">{t("Vuoi davvero ricominciare? Le foto fatte si perdono.")}
            <div style={{ display: "flex", gap: 8 }}>
              <Tasto colore={C.red} onClick={ricomincia}>{t("Sì, ricomincia")}</Tasto>
              <Tasto pieno={false} onClick={() => setChiediAnnulla(false)}>{t("No, continuo")}</Tasto>
            </div>
          </Avviso>}
    </div>
  );
  const barra = (
    <div style={{ display: "flex", gap: 4, margin: "10px 12px 0" }}>
      {[1, 2, 3, 4, 5, 6, 7].map((n) => <div key={n} style={{ flex: 1, height: 6, borderRadius: 3, background: passo >= n ? C.primary : C.border }} />)}
    </div>
  );
  const indietro = (n) => <Tasto pieno={false} onClick={() => { setErrore(""); setPasso(n); }}>← {t("Indietro")}</Tasto>;

  // ---- PASSO 8: esito
  if (passo === 8 && esito) return (
    <div style={st.scheda}>
      {esito.esito === "salvata" && <Avviso tipo="ok">✓ {t("Salvata")} – n. {esito.numero}</Avviso>}
      {esito.esito === "telefono" && <Avviso tipo="ko">{t("Non salvata: rete assente.")}{"\n"}{t("Si invierà da sola appena torna la rete.")}</Avviso>}
      <Tasto grande onClick={ricomincia}>➕ {t("Nuova spesa")}</Tasto>
      <Tasto pieno={false} onClick={vaiAMie}>🧾 {t("Le mie spese")}</Tasto>
    </div>
  );

  // ---- PASSO 1: con che cosa paghi
  if (passo === 1) return (
    <div>
      {barra}
      <div style={st.scheda}>
        <div style={st.titolo}>{t("Nuova spesa – con che cosa paghi")}</div>
        {strumenti === null && <div>{t("Caricamento...")}</div>}
        {datiDel && <Avviso tipo="giallo">{t("Niente rete: numeri di {o}", { o: datiDel })}</Avviso>}
        {erroreStrumenti && <Avviso tipo="ko">{erroreStrumenti}</Avviso>}
        {strumenti && strumenti.length === 0 && !erroreStrumenti && <Avviso tipo="ko">{t("Non hai strumenti abilitati: chiedi all'amministrazione")}</Avviso>}
        {strumenti && strumenti.map((x) => {
          const scelto = s.pagatoCon === x.nome;
          const giallo = x.nome === "Carta di debito 1894" && x.resta != null && Number(x.resta) < 1600;
          const corpo = (
            <>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{t(x.nome)}</div>
              {x.limite != null || x.resta != null ? (
                <div style={{ fontSize: 15, marginTop: 4 }}>
                  {x.nome !== "Contanti" && x.limite != null && <span>{t("Limite")} <b>{euroN(x.limite)}</b> · </span>}
                  {x.nome === "Contanti" && <span>{t("In carico")} · </span>}
                  <span style={{ fontSize: 19, fontWeight: 800, color: giallo ? C.yellow : scelto ? "#FFF" : C.primary }}>{t("resta")} {euroN(x.resta)}</span>
                </div>
              ) : <div style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>{t(x.nota || (SOLDI_PROPRI.includes(x.nome) ? "Soldi tuoi: ti saranno rimborsati" : "Saldo non disponibile"))}</div>}
            </>
          );
          const stile = (sel) => ({ width: "100%", textAlign: "left", padding: "14px 14px", margin: "6px 0", borderRadius: 14, cursor: "pointer",
            border: `2px solid ${sel ? C.primary : C.border}`, background: sel ? C.primary : "#FFF", color: sel ? "#FFF" : C.text });
          if (x.nome !== "Contanti") return <button key={x.nome} type="button" style={stile(scelto)} onClick={() => cambia({ pagatoCon: x.nome, cartella: x.cartella, resto: false })}>{corpo}</button>;
          return (
            <div key={x.nome} style={{ ...stile(false), cursor: "default" }}>
              {corpo}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                {[[false, "Contanti"], [true, "Contanti + resto pagato da me"]].map(([resto, nome]) => {
                  const sel = scelto && s.resto === resto;
                  return <button key={nome} type="button" onClick={() => cambia({ pagatoCon: "Contanti", cartella: x.cartella, resto })}
                    style={{ padding: "12px 6px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", border: `2px solid ${sel ? C.primary : C.border}`, background: sel ? C.primary : "#FFF", color: sel ? "#FFF" : C.text }}>{t(nome)}</button>;
                })}
              </div>
            </div>
          );
        })}
        <Tasto pieno={false} colore={C.blue} onClick={async () => { setFatturaAperta(!fatturaAperta); if (!qr) { try { setQr(await qrImmagine(DATI_FATTURA.map((d) => d[1]).join("\n"))); } catch (e) { setQr("errore"); } } }}>🧾 {t("Dati per la fattura")}</Tasto>
        {fatturaAperta && (
          <div style={{ border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: 12, margin: "4px 0 10px" }}>
            {qr && qr !== "errore" && <img src={qr} alt={t("Codice QR con i dati per la fattura")} style={{ display: "block", width: 220, height: 220, margin: "0 auto 8px", imageRendering: "pixelated" }} />}
            {qr === "errore" && <Avviso tipo="giallo">{t("Codice QR non disponibile: usa i dati qui sotto.")}</Avviso>}
            {DATI_FATTURA.map(([e, v]) => (
              <div key={e} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ flex: 1 }}><div style={st.piccolo}>{t(e)}</div><div style={{ fontWeight: 700, fontSize: 14 }}>{v}</div></div>
                <button type="button" onClick={() => { try { navigator.clipboard.writeText(v); } catch (er) { /* niente */ } }}
                  style={{ border: `1.5px solid ${C.blue}`, color: C.blue, background: "#FFF", borderRadius: 8, padding: "8px 10px", fontWeight: 700 }}>{t("copia")}</button>
              </div>
            ))}
          </div>
        )}
        <Tasto grande colore={C.green} disabled={!s.pagatoCon} onClick={() => { cambia({ oraPago: new Date().toISOString() }); setPasso(2); }}>💳 {t("Pago")}</Tasto>
      </div>
    </div>
  );

  // ---- PASSO 2: che documento hai
  if (passo === 2) {
    const prest = s.tipo === "Ricevuta" && s.tipoRicevuta === "Prestazione occasionale";
    const cfOk = !prest || codiceFiscaleValido(s.cfPercipiente);
    const manca =
      !s.tipo ? t("Scegli il tipo di documento")
      : s.tipo === "Ricevuta" && !s.tipoRicevuta ? t("Scegli il tipo di ricevuta")
      : (s.tipo === "Altro" || (s.tipo === "Ricevuta" && s.tipoRicevuta === "Altro")) && !s.tipoAltro.trim() ? t("Scrivi che cosa hai pagato e a chi")
      : prest && (lordoCent() == null || lordoCent() <= 0) ? t("Scrivi il compenso lordo")
      : prest && !cfOk ? t("Codice fiscale non valido")
      : s.tipo === "Acquisto online" && (!s.ordineNumero.trim() || !s.venditore.trim()) ? t("Numero dell'ordine e venditore sono obbligatori")
      : "";
    return (
      <div>
        {barra}
        <div style={st.scheda}>
          <div style={st.titolo}>2 · {t("Che documento hai")}</div>
          <Scelta voci={TIPI} valore={s.tipo} onScegli={(v) => cambia({ tipo: v, tipoRicevuta: "" })} />
          {s.tipo === "Ricevuta" && (<><div style={st.etichetta}>{t("Che ricevuta è")}</div><Scelta voci={TIPI_RICEVUTA} valore={s.tipoRicevuta} onScegli={(v) => cambia({ tipoRicevuta: v })} /></>)}
          {(s.tipo === "Altro" || (s.tipo === "Ricevuta" && s.tipoRicevuta === "Altro")) && (
            <><label style={st.etichetta}>{t("Che cosa hai pagato e a chi")}</label>
              <input style={{ ...st.campo, borderColor: s.tipoAltro.trim() ? C.border : C.red }} value={s.tipoAltro} onChange={(e) => cambia({ tipoAltro: e.target.value })} /></>
          )}
          {prest && (
            <>
              <label style={st.etichetta}>{t("Compenso lordo (€)")}</label>
              <input style={st.campo} inputMode="decimal" value={s.lordo} onChange={(e) => cambia({ lordo: e.target.value })} placeholder="0,00" />
              <label style={st.etichetta}>{t("Codice fiscale di chi riceve")}</label>
              <input style={{ ...st.campo, textTransform: "uppercase", borderColor: s.cfPercipiente && !cfOk ? C.red : C.border }} value={s.cfPercipiente} onChange={(e) => cambia({ cfPercipiente: e.target.value })} />
              {s.cfPercipiente && !cfOk && <div style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>{t("Codice fiscale non valido")}</div>}
              {lordoCent() != null && (
                <Avviso>{t("Consegna: netto")} <b>{euro(nettoCent())}</b>{"\n"}{t("Ritenuta da versare: 20%")} <b>{euro(ritenutaCent())}</b></Avviso>
              )}
            </>
          )}
          {s.tipo === "Acquisto online" && (
            <>
              <div style={{ background: "#EAF2FB", borderRadius: 10, padding: 10, margin: "10px 0", fontSize: 14 }}>
                <b>{t("ACQUISTI ONLINE")}</b>
                <ol style={{ margin: "6px 0 0", paddingLeft: 20 }}>{ISTRUZIONI_ONLINE.map((x, i) => <li key={i} style={{ marginBottom: 4 }}>{t(x)}</li>)}</ol>
              </div>
              <label style={st.etichetta}>{t("Numero dell'ordine")}</label>
              <input style={{ ...st.campo, borderColor: s.ordineNumero.trim() ? C.border : C.red }} value={s.ordineNumero} onChange={(e) => cambia({ ordineNumero: e.target.value })} />
              <label style={st.etichetta}>{t("Venditore")}</label>
              <input style={{ ...st.campo, borderColor: s.venditore.trim() ? C.border : C.red }} value={s.venditore} onChange={(e) => cambia({ venditore: e.target.value })} />
            </>
          )}
          {manca && s.tipo && <div style={{ color: C.red, fontSize: 13, fontWeight: 700, marginTop: 8 }}>{manca}</div>}
          <Tasto grande disabled={!!manca} onClick={() => setPasso(3)}>{t("Avanti")} →</Tasto>
          {indietro(1)}
        </div>
        {annulla}
      </div>
    );
  }

  // ---- PASSO 3: documento d'acquisto
  if (passo === 3) return (
    <div>
      {barra}
      <div style={st.scheda}>
        <div style={st.titolo}>3 · {t("Il documento d'acquisto")}</div>
        {!controllo && (
          <>
            {!foto && !pdfCaricato && <DuePossibilita onFile={nuovaFoto} disabled={!!lavoro} scatta={pagine.length ? "Aggiungi pagina" : "Scatta la foto"} />}
            {foto && angoli && (
              <>
                <Angoli foto={foto} angoli={angoli} onCambia={setAngoli} />
                <div style={st.piccolo}>{comeAngoli}</div>
                <Tasto grande onClick={confermaPagina} disabled={!!lavoro}>✓ {t("Conferma la pagina")}</Tasto>
                <Tasto pieno={false} onClick={() => setAngoli(angoliTuttaFoto(foto))}>{t("Usa tutta la foto")}</Tasto>
                <Tasto pieno={false} colore={C.red} onClick={() => { setFoto(null); setAngoli(null); }}>{t("Scarta questa foto")}</Tasto>
              </>
            )}
            {pagine.length > 0 && !foto && (
              <>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", margin: "10px 0" }}>
                  {pagine.map((p, i) => (
                    <div key={i} style={{ position: "relative", flex: "0 0 auto" }}>
                      <img src={p.anteprima} alt={t("Pagina {n}", { n: i + 1 })} style={{ height: 140, border: `1px solid ${C.border}`, borderRadius: 6 }} />
                      <button type="button" onClick={() => setPagine((x) => x.filter((_, j) => j !== i))}
                        style={{ position: "absolute", top: 2, right: 2, background: C.red, color: "#FFF", border: "none", borderRadius: 10, width: 24, height: 24, fontWeight: 800 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={st.piccolo}>{t("Pagine: {n}. Il PDF esce in bianco e nero.", { n: pagine.length })}</div>
              </>
            )}
            {pdfCaricato && (
              <>
                <Avviso tipo="ok">📄 {pdfCaricato.nome} · {t("Pagine: {n}", { n: pdfCaricato.pagine.length })}</Avviso>
                <Tasto pieno={false} colore={C.red} onClick={() => setPdfCaricato(null)}>{t("Togli il PDF")}</Tasto>
              </>
            )}
            {lavoro && <Avviso>{lavoro}</Avviso>}
            {errore && <Avviso tipo="ko">{errore}</Avviso>}
            {(pagine.length > 0 || pdfCaricato) && !foto && <Tasto grande disabled={!!lavoro} onClick={leggiDocumentoOra}>{t("Leggi i dati")} →</Tasto>}
            {s.tipo === "Altro" && !pagine.length && !pdfCaricato && !foto && (
              <Tasto pieno={false} disabled={!!lavoro} onClick={() => { setSenzaDocumento(true); setAMano(true); setErrore(""); preparaControllo({}); }}>{t("Non ho un documento: scrivo i dati")} →</Tasto>
            )}
          </>
        )}
        {controllo && (
          <>
            <div style={{ ...st.titolo, fontSize: 15 }}>{t("Controlla i dati letti")}</div>
            {senzaDocumento && <Avviso tipo="giallo">{t("Spesa senza documento: scrivi chi hai pagato, la data e l'importo.")}</Avviso>}
            {aMano && !senzaDocumento && <Avviso tipo="giallo">{t("Scrivi tu i dati che mancano.")}</Avviso>}
            {chiedeInsegna && (
              <Avviso tipo={insegna ? "ok" : "ko"}>
                {t("Manca la partita IVA: scrivila oppure fotografa l'insegna o la ragione sociale del negozio.")}
                {insegna && <img src={insegna.url} alt="" style={{ display: "block", height: 90, margin: "6px 0", borderRadius: 6 }} />}
                <SceltaFile accept="image/*" capture="environment" pieno={!insegna} onFile={nuovaInsegna}>📸 {t(insegna ? "Rifai la foto dell'insegna" : "Foto dell'insegna")}</SceltaFile>
              </Avviso>
            )}
            <CampoLetto etichetta="Chi ha venduto" valore={s.fornitore} letto={letto && letto.venditore} onCambia={(v) => cambia({ fornitore: v })} />
            <CampoLetto etichetta="Partita IVA" valore={s.partitaIva} letto={letto && letto.partitaIva} onCambia={(v) => cambia({ partitaIva: partitaIvaPulita(v) })} />
            {s.partitaIva && !partitaIvaAccettabile(s.partitaIva) && <div style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>{t("Partita IVA non valida: correggila")}</div>}
            <CampoLetto etichetta="Data del documento" tipo="date" valore={s.data} letto={letto && letto.data} mostra={dataIt} onCambia={(v) => cambia({ data: v })} />
            <CampoLetto etichetta="Ora" valore={s.oraDocumento} letto={letto && letto.ora} onCambia={(v) => cambia({ oraDocumento: v })} placeholder="hh:mm" />
            {s.tipo === "Ricevuta" && s.tipoRicevuta === "Prestazione occasionale"
              ? <Avviso>{t("Importo della spesa: netto consegnato")} <b>{euro(nettoCent())}</b></Avviso>
              : <CampoLetto etichetta="Importo pagato (€)" valore={s.importo} letto={letto && letto.cent != null ? centInput(letto.cent) : null} onCambia={(v) => cambia({ importo: v })} inputMode="decimal" />}
            {s.tipo === "Fattura" && (
              <>
                <label style={{ ...st.etichetta, display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" checked={s.fatturaInArrivo} onChange={(e) => cambia({ fatturaInArrivo: e.target.checked })} />
                  {t("Fattura richiesta, arriverà dallo SDI (non ho il numero)")}
                </label>
                {s.fatturaInArrivo && <div style={st.piccolo}>{t("Come documento basta la foto dello scontrino: la fattura arriverà dallo SDI.")}</div>}
                {!s.fatturaInArrivo && <CampoLetto etichetta="Numero della fattura" valore={s.numeroDocumento} letto={letto && letto.numero} onCambia={(v) => cambia({ numeroDocumento: v })} />}
                <div style={st.etichetta}>{t("Imponibile e IVA")}</div>
                {s.iva.map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1.2fr auto", gap: 6, marginBottom: 6, alignItems: "center" }}>
                    <input style={st.campo} inputMode="numeric" value={r.aliquota} onChange={(e) => cambia({ iva: s.iva.map((x, j) => j === i ? { ...x, aliquota: Number(e.target.value.replace(/\D/g, "")) || 0 } : x) })} aria-label={t("Aliquota")} />
                    <input style={st.campo} inputMode="decimal" value={centInput(Math.round(r.imponibile * 100))} onChange={(e) => { const c = centesimi(e.target.value); cambia({ iva: s.iva.map((x, j) => j === i ? { ...x, imponibile: c == null ? 0 : c / 100 } : x) }); }} aria-label={t("Imponibile")} />
                    <input style={st.campo} inputMode="decimal" value={centInput(Math.round(r.iva * 100))} onChange={(e) => { const c = centesimi(e.target.value); cambia({ iva: s.iva.map((x, j) => j === i ? { ...x, iva: c == null ? 0 : c / 100 } : x) }); }} aria-label={t("IVA")} />
                    <button type="button" onClick={() => cambia({ iva: s.iva.filter((_, j) => j !== i) })} style={{ border: "none", background: C.red, color: "#FFF", borderRadius: 8, width: 32, height: 32 }}>×</button>
                    {Number(r.aliquota) === 0 && (
                      <select style={{ ...st.campo, gridColumn: "1 / -1", borderColor: r.natura ? C.border : C.red }} value={r.natura || ""} onChange={(e) => cambia({ iva: s.iva.map((x, j) => j === i ? { ...x, natura: e.target.value || null } : x) })}>
                        <option value="">{t("IVA 0: scegli la natura")}</option>
                        {NATURE.map(([c, d]) => <option key={c} value={c}>{c} – {t(d)}</option>)}
                      </select>
                    )}
                  </div>
                ))}
                <div style={st.piccolo}>{t("Aliquota % · imponibile · IVA")}</div>
                <Tasto pieno={false} onClick={() => cambia({ iva: [...s.iva, { aliquota: 22, imponibile: 0, iva: 0, natura: null }] })}>+ {t("Aggiungi aliquota")}</Tasto>
              </>
            )}
            {s.tipo === "Acquisto online" && (
              <>
                <CampoLetto etichetta="Numero dell'ordine" valore={s.ordineNumero} letto={letto && letto.ordine} onCambia={(v) => cambia({ ordineNumero: v })} />
                <CampoLetto etichetta="Venditore" valore={s.venditore} letto={letto && letto.venditore} onCambia={(v) => cambia({ venditore: v })} />
              </>
            )}
            {errore && <Avviso tipo="ko">{errore}</Avviso>}
            <Tasto grande onClick={chiudiDocumento}>{t("Avanti")} →</Tasto>
            <Tasto pieno={false} onClick={() => { setControllo(false); setSenzaDocumento(false); setErrore(""); }}>{t(senzaDocumento ? "Indietro" : "Rifai la scansione")}</Tasto>
          </>
        )}
        {!controllo && indietro(2)}
      </div>
      {annulla}
    </div>
  );

  // ---- PASSO 4: ricevuta di pagamento
  if (passo === 4) {
    const online = s.tipo === "Acquisto online";
    const avvisi = avvisiPagamento();
    return (
      <div>
        {barra}
        <div style={st.scheda}>
          <div style={st.titolo}>4 · {online ? t("Conferma di pagamento del venditore") : t("Ricevuta del POS")}</div>
          {!pagamento && <DuePossibilita onFile={nuovoPagamento} disabled={!!lavoro} />}
          {!pagamento && s.tipoRicevuta === "PagoPA o bollettino" && <Tasto pieno={false} onClick={stessoDocumento}>{t("La ricevuta PagoPA è anche la prova del pagamento: usa lo stesso file")}</Tasto>}
          {pagamento && (
            <>
              {pagamento.anteprima && <img src={pagamento.anteprima} alt="" style={{ maxHeight: 160, border: `1px solid ${C.border}`, borderRadius: 6 }} />}
              {!pagamento.stesso && <div style={{ fontSize: 14, margin: "6px 0" }}>
                {t("Letto")}: {pagamento.letto.cent != null ? euro(pagamento.letto.cent) : "—"}{pagamento.letto.cifre ? ` · ****${pagamento.letto.cifre}` : ""}{pagamento.letto.data ? ` · ${dataIt(pagamento.letto.data)}` : ""}
              </div>}
              {avvisi.map((a, i) => <Avviso key={i} tipo={a.tipo}>⚠ {a.testo}</Avviso>)}
              <Tasto pieno={false} colore={C.red} onClick={() => setPagamento(null)}>{t("Rifai la ricevuta")}</Tasto>
            </>
          )}
          {lavoro && <Avviso>{lavoro}</Avviso>}
          {errore && <Avviso tipo="ko">{errore}</Avviso>}
          {!pagamento && <div style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>{t("Serve la ricevuta del pagamento")}</div>}
          {pagamento && (
            <>
              <CampoLetto etichetta="Importo pagato (€)" valore={s.importo} letto={pagamento.letto && pagamento.letto.cent != null && !pagamento.stesso ? centInput(pagamento.letto.cent) : null} onCambia={(v) => cambia({ importo: v })} inputMode="decimal" />
            </>
          )}
          <Tasto grande disabled={!pagamento || !!lavoro || centesimi(s.importo) == null} onClick={() => setPasso(5)}>{t("Avanti")} →</Tasto>
          {indietro(3)}
        </div>
        {annulla}
      </div>
    );
  }

  // ---- PASSO 5: che cosa hai comprato
  const acquistoLetto = letto ? (s.tipo === "Ricevuta" ? letto.causale || letto.acquisto : letto.acquisto || letto.causale) : null;
  if (passo === 5) return (
    <div>
      {barra}
      <div style={st.scheda}>
        <div style={st.titolo}>5 · {t("Che cosa hai comprato")}</div>
        {letto && (letto.acquisto || letto.causale) && s.acquistoOrigine !== "scritto" && (
          <Avviso>{t("Letto")}: {acquistoLetto}</Avviso>
        )}
        <textarea style={{ ...st.campo, minHeight: 70, borderColor: s.acquisto.trim() ? C.border : C.red }} value={s.acquisto}
          onChange={(e) => cambia({ acquisto: e.target.value, acquistoOrigine: "scritto" })} placeholder={t("Scrivi che cosa hai comprato")} />
        {letto && (letto.acquisto || letto.causale) && (
          <div style={{ display: "flex", gap: 8 }}>
            <Tasto pieno={s.acquistoOrigine === "letto"} onClick={() => cambia({ acquisto: acquistoLetto, acquistoOrigine: "letto" })}>✓ {t("Ok")}</Tasto>
            <Tasto pieno={s.acquistoOrigine === "scritto"} onClick={() => cambia({ acquisto: "", acquistoOrigine: "scritto" })}>✎ {t("Scrivo io")}</Tasto>
          </div>
        )}
        <div style={st.etichetta}>{t("È un bene o un servizio?")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[[true, "Un bene"], [false, "Un servizio"]].map(([v, nome]) => (
            <button key={nome} type="button" onClick={() => cambia({ bene: v })}
              style={{ padding: "16px 8px", fontSize: 16, fontWeight: 700, borderRadius: 12, cursor: "pointer", border: `2px solid ${s.bene === v ? C.primary : C.border}`, background: s.bene === v ? C.primary : "#FFF", color: s.bene === v ? "#FFF" : C.text }}>{t(nome)}</button>
          ))}
        </div>
        <div style={st.piccolo}>{t("Un servizio è per esempio una riparazione, un trasporto, un parcheggio, una consulenza.")}</div>
        <Tasto grande disabled={!s.acquisto.trim() || s.bene === null} onClick={() => { if (!s.acquistoOrigine) cambia({ acquistoOrigine: letto && s.acquisto === acquistoLetto ? "letto" : "scritto" }); setPasso(s.bene ? 6 : 7); }}>{t("Avanti")} →</Tasto>
        {indietro(emetteRicevuta(s.pagatoCon, s.tipo) ? 4 : 3)}
      </div>
      {annulla}
    </div>
  );

  // ---- PASSO 6: foto del bene
  if (passo === 6) return (
    <div>
      {barra}
      <div style={st.scheda}>
        <div style={st.titolo}>6 · {t("Fotografa quello che hai comprato")}</div>
        {fotoBene
          ? <><img src={fotoBene.url} alt="" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8 }} /><Tasto pieno={false} colore={C.red} onClick={() => setFotoBene(null)}>{t("Rifai la foto")}</Tasto></>
          : <DuePossibilita onFile={nuovaFotoBene} accetta="image/*" />}
        {errore && <Avviso tipo="ko">{errore}</Avviso>}
        <Tasto grande disabled={!fotoBene} onClick={() => setPasso(7)}>{t("Avanti")} →</Tasto>
        {indietro(5)}
      </div>
      {annulla}
    </div>
  );

  // ---- PASSO 7: riepilogo
  const restaDopo = strumento && strumento.resta != null && centImporto != null
    ? (s.pagatoCon === "Contanti" && s.resto ? 0 : Number(strumento.resta) - centImporto / 100) : null;
  const oltreLimite = s.pagatoCon === "Carta di debito 1894" && restaDopo != null && restaDopo < 0;
  const righe = [
    [t("Strumento"), `${t(s.pagatoCon)}${s.resto ? " + " + t("resto pagato da me") : ""}${restaDopo != null ? ` · ${t("resta dopo")}: ${euroN(restaDopo)}` : ""}`, 1],
    [t("Documento"), `${t(s.tipo)}${s.tipo === "Ricevuta" ? " – " + t(s.tipoRicevuta) : ""}${s.tipoAltro ? ": " + s.tipoAltro : ""}`, 2],
    ...(s.tipo === "Fattura" ? [[t("Numero"), s.fatturaInArrivo ? t("in arrivo dallo SDI") : s.numeroDocumento, 3], [t("Imponibile e IVA"), s.iva.map((r) => `${r.aliquota}%: ${euroN(r.imponibile)} + ${euroN(r.iva)}`).join(" · ") || "—", 3]] : []),
    ...(s.tipo === "Acquisto online" ? [[t("Ordine"), `${s.ordineNumero} · ${s.venditore}`, 3]] : []),
    ...(s.tipoRicevuta === "Prestazione occasionale" ? [[t("Prestazione occasionale"), `${t("lordo")} ${euro(lordoCent())} · ${t("ritenuta")} ${euro(ritenutaCent())} · ${s.cfPercipiente.toUpperCase()}`, 2]] : []),
    [t("Che cosa hai comprato"), `${s.acquisto} · ${s.bene ? t("Un bene") : t("Un servizio")}`, 5],
  ];
  return (
    <div>
      {barra}
      <div style={st.scheda}>
        <div style={st.titolo}>7 · {t("Riepilogo")}</div>
        <div onClick={() => { setControllo(true); setPasso(3); }} style={{ background: "#F5F0E8", borderRadius: 12, padding: 12, cursor: "pointer" }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{s.fornitore} ✎</div>
          <div style={{ fontSize: 13, color: C.muted }}>{s.partitaIva ? `P. IVA ${s.partitaIva}` : t("Partita IVA non letta")}</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{dataIt(s.data)}{s.oraDocumento ? ` · ${s.oraDocumento}` : ""}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.primary, marginTop: 4 }}>{centImporto != null ? euro(centImporto) : "—"}</div>
        </div>
        {s.pagatoCon === "Contanti" && s.resto && contantiInCarico != null && (
          <Avviso>{t("dalla cassa")} <b>{euro(centImporto - quotaDaMeCent)}</b> – {t("messo da te")} <b>{euro(quotaDaMeCent)}</b></Avviso>
        )}
        {oltreLimite && <Avviso tipo="ko">⚠ {t("La spesa supera quanto resta sulla carta 1894: la banca potrebbe rifiutare il pagamento.")}</Avviso>}
        {chiediQuota && (
          <Avviso tipo="giallo">
            {t("Hai {a} di contanti: il resto, {b}, è pagato da te?", { a: euroN(contantiInCarico), b: euro(centImporto - Math.round(contantiInCarico * 100)) })}
            <div style={{ display: "flex", gap: 8 }}>
              <Tasto onClick={() => { cambia({ resto: true }); setChiediQuota(false); }}>{t("Sì")}</Tasto>
              <Tasto pieno={false} colore={C.red} onClick={() => setChiediAnnulla(true)}>{t("Annulla – ricomincia")}</Tasto>
            </div>
          </Avviso>
        )}
        {righe.map(([e, v, p]) => (
          <div key={e} onClick={() => { if (p === 3) setControllo(true); setPasso(p); }} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "11px 2px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
            <span style={{ color: C.muted, fontSize: 14 }}>{e}</span>
            <span style={{ fontWeight: 700, fontSize: 14, textAlign: "right" }}>{v} ✎</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, margin: "10px 0", overflowX: "auto" }}>
          {documento && documento.anteprime.map((a, i) => <img key={"d" + i} src={a} alt="" onClick={() => window.open(documento.url, "_blank", "noopener")} style={{ height: 90, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer" }} />)}
          {pagamento && pagamento.anteprima && <img src={pagamento.anteprima} alt="" onClick={() => setPasso(4)} style={{ height: 90, border: `2px solid ${C.blue}`, borderRadius: 6 }} />}
          {s.bene && fotoBene && <img src={fotoBene.url} alt="" onClick={() => setPasso(6)} style={{ height: 90, border: `2px solid ${C.green}`, borderRadius: 6 }} />}
        </div>
        <label style={st.etichetta}>{t("Nota (facoltativa)")}</label>
        <input style={st.campo} value={s.nota} onChange={(e) => cambia({ nota: e.target.value })} />
        {regole === null && <div style={st.piccolo}>{t("Controllo le regole…")}</div>}
        {regole && regole.messaggio && <Avviso tipo={regole.ok ? "giallo" : "ko"}>{regole.messaggio}</Avviso>}
        {esito && esito.esito === "errore" && <Avviso tipo="ko">{t("Non salvata")}: {esito.messaggio}</Avviso>}
        {esito && esito.esito === "doppione" && (
          <Avviso tipo="giallo">
            {esito.messaggio}{"\n"}{t("Confermi che è una spesa diversa? Scrivi il motivo")}
            <input style={{ ...st.campo, marginTop: 6 }} value={motivoDoppione} onChange={(e) => setMotivoDoppione(e.target.value)} />
            <Tasto disabled={!motivoDoppione.trim() || !!lavoro} onClick={() => salva(motivoDoppione.trim())}>{t("Salva con il motivo")}</Tasto>
          </Avviso>
        )}
        {lavoro && <Avviso>{lavoro}</Avviso>}
        <Tasto grande colore={C.green} disabled={!regole || !regole.ok || chiediQuota || !!lavoro || (esito && esito.esito === "doppione") || (s.tipo === "Altro" && !s.tipoAltro.trim())} onClick={() => salva(null)}>💾 {t("Salva")}</Tasto>
        {indietro(s.bene ? 6 : 5)}
      </div>
      {annulla}
    </div>
  );
}

function miniDa(tela) {
  const k = Math.min(1, 360 / Math.max(tela.width, tela.height));
  const m = document.createElement("canvas"); m.width = Math.round(tela.width * k); m.height = Math.round(tela.height * k);
  m.getContext("2d").drawImage(tela, 0, 0, m.width, m.height);
  return m.toDataURL("image/jpeg", 0.6);
}

// angoli spostabili col dito sopra la foto (come nella 148)
export function Angoli({ foto, angoli, onCambia }) {
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
