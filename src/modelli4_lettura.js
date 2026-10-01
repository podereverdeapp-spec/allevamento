// ============================================================================
// MODELLI 4 — LETTURA DEL PDF — v121
// ----------------------------------------------------------------------------
// Legge un Documento di accompagnamento (modello 4) generato dalla Banca Dati
// Nazionale e ne estrae i dati: numero, date, specie, capi, destinazione,
// trasporto ed elenco dei capi (matricole per bovini, ovini e caprini; marchio
// aziendale e insieme per suini e agnelli).
// 1) testoDaPdf: ricostruisce il testo riga per riga, colonne comprese.
// 2) leggiModello4: dal testo ricava i dati. Restituisce null se il PDF non e'
//    un modello 4.
// La libreria pdf.js si scarica solo quando si apre il caricamento.
// ============================================================================

const PDFJS_VERSIONE = "3.11.174";
const PDFJS_FONTI = [
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSIONE}/build`,
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSIONE}`,
];
let pdfjsPromessa = null;

function caricaScript(src){
  return new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => ok(); s.onerror = () => { s.remove(); ko(new Error("script " + src)); };
    document.head.appendChild(s);
  });
}

export function caricaPdfjs(){
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfjsPromessa) return pdfjsPromessa;
  pdfjsPromessa = (async () => {
    for (const base of PDFJS_FONTI) {
      try {
        await caricaScript(`${base}/pdf.min.js`);
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${base}/pdf.worker.min.js`;
          return window.pdfjsLib;
        }
      } catch (e) { /* prova la fonte successiva */ }
    }
    pdfjsPromessa = null;
    throw new Error("Impossibile caricare il lettore PDF");
  })();
  return pdfjsPromessa;
}

// Testo del PDF con l'impaginazione: gli elementi sulla stessa altezza formano
// una riga, gli spazi tra le colonne diventano gruppi di spazi.
export async function testoDaPdf(pdfjsLib, dati){
  const pdf = await pdfjsLib.getDocument({ data: dati }).promise;
  const righeTutte = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const pagina = await pdf.getPage(p);
    const contenuto = await pagina.getTextContent();
    const el = contenuto.items
      .filter(i => i.str && i.str.trim() !== "")
      .map(i => ({ x: i.transform[4], y: i.transform[5], w: i.width, h: Math.abs(i.transform[3]) || 8, s: i.str }));
    el.sort((a, b) => b.y - a.y || a.x - b.x);
    const righe = [];
    for (const e of el) {
      const r = righe.length ? righe[righe.length - 1] : null;
      if (r && Math.abs(r.y - e.y) <= Math.max(2, Math.min(r.h, e.h) * 0.45)) r.el.push(e);
      else righe.push({ y: e.y, h: e.h, el: [e] });
    }
    for (const r of righe) {
      r.el.sort((a, b) => a.x - b.x);
      let s = "", fine = null;
      for (const e of r.el) {
        const cw = Math.max(2.5, (e.s.length ? e.w / e.s.length : e.h * 0.5));
        if (fine === null) s += " ".repeat(Math.max(0, Math.round(e.x / cw / 3)));
        else {
          const gap = e.x - fine;
          if (gap > cw * 1.5) s += " ".repeat(Math.max(3, Math.round(gap / cw)));
          else if (gap > cw * 0.25) s += " ";
        }
        s += e.s; fine = e.x + e.w;
      }
      righeTutte.push(s);
    }
    righeTutte.push("");
  }
  return righeTutte.join("\n");
}

// ─── LETTURA DEI DATI ─────────────────────────────────────────────────────────
const RE_DATA = /\d\d\/\d\d\/\d{2,4}/g;
const isoData = s => {
  if (!s) return null;
  const [d, m, y0] = s.split("/");
  const y = y0.length === 2 ? "20" + y0 : y0;
  return `${y}-${m}-${d}`;
};
const date = s => (s.match(RE_DATA) || []);
const SPECIE = { BOVINI:"Bovini", SUINI:"Suini", OVINI:"Ovini", OVICAPRINI:"Ovicaprini", CAPRINI:"Caprini" };
const SPECIE_CAPO = { BOVINI:"Bovino", BUFALINI:"Bufalino", OVI:"Ovino", CAP:"Caprino", "":"Suino" };
const RAZZE = { MTT:"Meticcio", MCG:"Marchigiana", SPV:"Sopravissana", MRN:"Maremmana", LMS:"Limousine", FRS:"Frisona", CNS:"Cinta Senese" };
const SESSO = { M:"Maschio", F:"Femmina", N:"Non indicato" };
const razza = r => r ? (RAZZE[r] ? `${RAZZE[r]} (${r})` : r) : null;
const titolo = s => s ? s.toLowerCase().replace(/(^|[\s'.(])([a-zà-ù])/g, (m, a, b) => a + b.toUpperCase()) : s;
export const CODICE_PODERE_VERDE = "091RMA90";

export function leggiModello4(t){
  if (!t) return null;
  const righe = t.split("\n");
  const mNum = t.match(/(?:N\. Modello 4|Documento di accompagnamento|Modello 4):\s*(IT[0-9A-Z]+)/);
  if (!mNum) return null;
  const numero = mNum[1];

  // data del documento
  let dataDoc = null;
  const m2 = t.match(/Data Modello 4:\s*(\d\d\/\d\d\/\d{4})/);
  const m3 = t.match(/Modello 4: IT\w+ del (\d\d\/\d\d\/\d{4})/);
  if (m2) dataDoc = m2[1];
  else if (m3) dataDoc = m3[1];
  else {
    for (const l of righe.slice(0, 8)) {
      if (l.includes("Documento di accompagnamento: IT") && l.includes(numero)) {
        const ds = date(l.split(numero).slice(1).join(numero));
        if (ds.length) { dataDoc = ds[0]; break; }
      }
    }
  }
  // codice di controllo
  let controllo = (t.match(/Codice controllo:\s*(\d+)/) || [])[1] || null;
  if (!controllo) {
    for (const l of righe.slice(0, 8)) {
      if (l.includes("Documento di accompagnamento: IT")) {
        const x = l.match(/\s(\d{6,9})(?=\s)/);
        if (x) { controllo = x[1]; break; }
      }
    }
  }
  const prog = (t.match(/Progressivo di allevamento:\s*(\S+)/) || [])[1] || null;
  const tot = t.match(/TOTALE CAPI (BOVINI|SUINI|OVINI|OVICAPRINI|CAPRINI) (?:MOVIMENTATI|PRENOTATI):\s*(\d+)/);
  const spAll = t.match(/specie allevata\s+([A-Z]+)/);
  let specie = tot ? SPECIE[tot[1]] : (spAll ? titolo(spAll[1]) : null);
  const origine = (t.match(/Codice Aziendale:\s*(\w+)/) || [])[1] || null;
  const proprietario = ((t.match(/PROPRIETARIO:\s*(.+?)(?:\s{2,}|$)/m) || [])[1] || "").trim() || null;

  // destinazione
  let tipo = null;
  const md = t.match(/Gli animali sono destinati a:\s*\n(?:\s*\n)*(.*)/);
  if (md) {
    const x = md[1].match(/(?:\bX|\[X\])\s+(Allevamento|Macello|Stalla di \w+(?:\/Centro di raccolta)?|Vendita per autoconsumo|Fiere?\/?\S*|Pascolo|Altre tipologie)/);
    if (x) tipo = x[1];
  }
  const iC = t.indexOf("C) DESTINAZIONE");
  const sezC = iC >= 0 ? t.slice(iC) : "";
  const cod = (sezC.match(/Codice:\s*(?:Codice:\s*)?(\S+)/) || [])[1] || null;
  const appr = (sezC.match(/Approval number:\s*([A-Z0-9]+)/) || [])[1] || null;
  const den = ((sezC.match(/Denominazione:\s*(.+)/) || [])[1] || "").trim().replace(/\s{2,}.*$/, "") || null;
  const ind = ((sezC.match(/Indirizzo:\s*(.+)/) || [])[1] || "").trim().replace(/\s{2,}.*$/, "") || null;
  let uscita = null;
  if (sezC) {
    const cl = sezC.split("\n").slice(0, 40);
    const i = cl.findIndex(l => l.includes("Data di uscita prevista"));
    if (i >= 0) for (const j of [i, i + 1, i - 1, i + 2, i - 2]) {
      if (j >= 0 && j < cl.length) { const ds = date(cl[j]); if (ds.length) { uscita = ds[0]; break; } }
    }
  }
  const tr = t.match(/Data:\s*(\d\d\/\d\d\/\d{4}),\s*ora partenza:\s*([\d:]+)/);
  const trasp = t.match(/trasportati da\s+([\s\S]+?)\s+conducente/);
  const ditta = t.match(/ragione\s+sociale\s+([\s\S]+?)\s+sita/);

  // capi con matricola
  const capi = []; const visti = new Set();
  righe.forEach((l, li) => {
    const x = l.match(/^\s*(\d+)\s+(IT\d{9,14}|[A-Z]{2}\d{9,14})\s+(BOVINI|BUFALINI|OVI|CAP|)\s*(\d\d\/\d\d\/\d\d)\s+([MF])\s+(\S+)(.*)/);
    if (!x || visti.has(x[2])) return;
    visti.add(x[2]);
    const resto = x[7];
    const dsr = date(resto);
    let prov = resto.replace(/\s{2,}/g, " ").trim().replace(/\s*\d\d\/\d\d\/\d{2,4}$/, "").replace("SI ", "").replace("NO ", "").trim();
    if (/(Documento|Modello):$/.test(prov)) {
      let nx = "";
      for (let k = li + 1; k < Math.min(li + 4, righe.length); k++) if (/\d+ del \d\d\/\d\d\/\d\d/.test(righe[k])) { nx = righe[k].trim().replace(/\s{2,}.*$/, ""); break; }
      const [az, tipoDoc] = prov.split(/\s+/);
      prov = nx ? `Azienda ${az} (${tipoDoc.replace(":", "").toLowerCase()} ${nx})` : `Azienda ${az}`;
    }
    capi.push({ specie: SPECIE_CAPO[x[3]], matricola: x[2], riferimento_insieme: null, categoria: null, numero_capi: 1,
      sesso: SESSO[x[5]] || x[5], razza: razza(x[6]), data_nascita: isoData(x[4]), eta_mesi: null,
      provenienza: prov || null, data_ingresso: dsr.length ? isoData(dsr[dsr.length - 1]) : null });
  });
  // capi per insieme (suini, agnelli)
  righe.forEach((l, i) => {
    const x = l.match(/^\s*(\d+|-)?\s+([A-Z][a-z]+(?: [a-z]+)*)\s+(Suini|Ovini|Caprini)\s+(\d+)\s*(\w+)?/);
    if (!x || x[2] === "Categoria") return;
    let prev = "";
    for (let k = i - 1; k > Math.max(i - 6, 0); k--) if (/IT\w{6,}/.test(righe[k])) { prev = righe[k]; break; }
    const pm = prev.match(/(IT\w+)\s+(\d+)?\s*([MFN])?\s*(\w+)?/);
    const nd = righe.slice(Math.max(0, i - 2), i + 3).join(" ").match(/in data (\d\d\/\d\d\/\d{4})/);
    const rz = pm && pm[4] && pm[4] !== "NATI" ? pm[4] : null;
    capi.push({ specie: x[3], matricola: `Marchio ${pm ? pm[1] : "IT" + (origine || "")} (tatuaggio aziendale)`,
      riferimento_insieme: x[1] && x[1] !== "-" ? x[1] : null, categoria: x[2], numero_capi: parseInt(x[4], 10),
      sesso: pm && pm[3] ? (SESSO[pm[3]] || pm[3]) : null, razza: razza(rz), data_nascita: null,
      eta_mesi: pm && pm[2] ? parseInt(pm[2], 10) : null,
      provenienza: "Nati in stalla" + (nd ? ` (dal ${nd[1]})` : ""), data_ingresso: null });
  });

  const nCapi = tot ? parseInt(tot[2], 10) : (capi.reduce((s, c) => s + c.numero_capi, 0) || null);
  if (!specie && capi.length) specie = capi[0].specie;
  if (specie === "Ovicaprini") {
    const sp = new Set(capi.map(c => c.specie === "Ovini" ? "Ovino" : c.specie === "Caprini" ? "Caprino" : c.specie));
    specie = [...sp].every(s => s === "Ovino") ? "Ovini" : "Ovicaprini";
  }
  let movimento;
  if (origine === CODICE_PODERE_VERDE) movimento = "Uscita da Podere Verde";
  else if (cod === CODICE_PODERE_VERDE) movimento = `Ingresso in Podere Verde da ${titolo(proprietario)} (${origine})`;
  else movimento = `Uscita da ${titolo(proprietario)} (${origine})`;

  const documento = {
    numero_documento: numero, codice_controllo: controllo || "", data_documento: isoData(dataDoc),
    data_uscita: isoData(uscita) || (tr ? isoData(tr[1]) : null) || isoData(dataDoc),
    specie, numero_capi: nCapi, progressivo_allevamento: prog,
    codice_azienda_partenza: origine, proprietario_partenza: proprietario, tipo_movimento: movimento,
    destinazione_tipo: tipo, destinatario: den, destinatario_codice: cod, numero_riconoscimento: appr,
    destinatario_indirizzo: ind, data_trasporto: tr ? isoData(tr[1]) : null, ora_partenza: tr ? tr[2] : null,
    trasportatore: trasp ? trasp[1].replace(/\s+/g, " ") : null, ditta_trasporto: ditta ? ditta[1].replace(/\s+/g, " ") : null,
  };
  return { documento, capi };
}
