// v149 — «Spese pagate»: lettura dei dati dal testo del documento (scontrino, fattura, ricevuta,
// acquisto online) e della ricevuta di pagamento. Il testo arriva da Tesseract (foto) o da pdf.js
// (PDF con testo). Qui solo regole sul testo: niente rete, niente database.
// Regola del Dottore (12/11/2026 09:32): tra il valore letto e quello scritto vale il documento;
// la persona conferma o corregge, e se sono diversi compare l'avviso rosso.

// ---------------------------------------------------------------- controlli
// partita IVA italiana: 11 cifre con la cifra finale di controllo
// Partita IVA come la vuole il database della 391 (lettera del Tenente 20/11 13:10, punto 8):
// si toglie «P.IVA», «IT» e gli spazi; italiana = 11 cifre con il carattere di controllo;
// estera = codice del Paese davanti (UE più CH, GB, NO, SM, US, CN).
const PAESI = "AT|BE|BG|CY|CZ|DE|DK|EE|EL|GR|ES|FI|FR|HR|HU|IE|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK|XI|CH|GB|NO|SM|US|CN";
export function partitaIvaPulita(v) {
  let x = String(v || "").toUpperCase().replace(/P\.?\s*IVA|PARTITA\s*IVA|VAT/g, "").replace(/[^A-Z0-9]/g, "");
  if (/^IT\d{11}$/.test(x)) x = x.slice(2);
  return x.slice(0, 15);
}
export function partitaIvaAccettabile(v) {
  const x = partitaIvaPulita(v);
  if (/^\d+$/.test(x)) return partitaIvaValida(x);
  return new RegExp(`^(${PAESI})[A-Z0-9]{2,13}$`).test(x);
}
export function partitaIvaValida(p) {
  const s = String(p || "").replace(/\s/g, "");
  if (!/^\d{11}$/.test(s) || /^0{11}$/.test(s)) return false;
  let somma = 0;
  for (let i = 0; i < 10; i++) {
    let d = +s[i];
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    somma += d;
  }
  return (10 - (somma % 10)) % 10 === +s[10];
}

// codice fiscale di una persona: 16 caratteri con il carattere di controllo
const DISPARI = { 0: 1, 1: 0, 2: 5, 3: 7, 4: 9, 5: 13, 6: 15, 7: 17, 8: 19, 9: 21, A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21, K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14, U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23 };
export function codiceFiscaleValido(cf) {
  const s = String(cf || "").toUpperCase().replace(/\s/g, "");
  if (!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(s)) return false;
  let somma = 0;
  for (let i = 0; i < 15; i++) {
    const c = s[i];
    if (i % 2 === 0) somma += DISPARI[c];
    else somma += /\d/.test(c) ? +c : c.charCodeAt(0) - 65;
  }
  return String.fromCharCode(65 + (somma % 26)) === s[15];
}

// ---------------------------------------------------------------- numeri e date
// «1.082,00» «438,70» «52.20» → centesimi; null se non è un importo con due decimali
export function centesimiDa(t) {
  const m = String(t || "").trim().match(/^(\d{1,3}(?:[.' ]\d{3})+|\d+)[,.](\d{2})$/);
  return m ? parseInt(m[1].replace(/[.' ]/g, ""), 10) * 100 + parseInt(m[2], 10) : null;
}
const RE_IMPORTO = /(\d{1,3}(?:[.' ]\d{3})+|\d+)[,.](\d{2})(?!\d)/g;
const importiRiga = (riga) => [...String(riga).matchAll(RE_IMPORTO)].map((m) => centesimiDa(m[0])).filter((c) => c != null);

const MESI = { gen: 1, feb: 2, mar: 3, apr: 4, mag: 5, giu: 6, lug: 7, ago: 8, set: 9, ott: 10, nov: 11, dic: 12 };
function dataValida(a, m, g) {
  if (a < 100) a += 2000;
  if (a < 2020 || a > 2100 || m < 1 || m > 12 || g < 1 || g > 31) return null;
  const d = new Date(Date.UTC(a, m - 1, g));
  if (d.getUTCMonth() !== m - 1) return null;
  return `${a}-${String(m).padStart(2, "0")}-${String(g).padStart(2, "0")}`;
}
// prima data trovata nel testo (gg/mm/aaaa, gg-mm-aa, gg.mm.aaaa, «20 nov 2026»), con l'ora se è sulla stessa riga
export function cercaDataOra(testo) {
  const righe = String(testo || "").split(/\n/);
  for (const riga of righe) {
    let data = null, m;
    if ((m = riga.match(/\b(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})\b/))) data = dataValida(+m[3], +m[2], +m[1]);
    if (!data && (m = riga.match(/\b(\d{4})-(\d{2})-(\d{2})\b/))) data = dataValida(+m[1], +m[2], +m[3]);
    if (!data && (m = riga.toLowerCase().match(/\b(\d{1,2})\s+(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)[a-z]*\.?\s+(\d{4})\b/))) data = dataValida(+m[3], MESI[m[2]], +m[1]);
    if (data) {
      const o = riga.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)(?![.,]\d)\b/g);
      const ora = o ? o.map((x) => x.replace(".", ":")).find((x) => !riga.includes(x.replace(":", ",") + "€")) : null;
      return { data, ora: ora ? ora.padStart(5, "0") : null };
    }
  }
  return { data: null, ora: null };
}

// partita IVA: 11 cifre dopo «P.IVA», «P. IVA», «Partita IVA», «P.I.», «C.F./P.IVA», «VAT IT»; solo se il controllo torna.
// Esclusa quella di Podere Verde (è l'acquirente sulle fatture).
export const PARTITA_IVA_PODERE_VERDE = "15117871002";
export function cercaPartitaIva(testo) {
  // la lettera O letta al posto dello zero dentro un numero (niente «lookbehind»: i vecchi iPhone non lo conoscono)
  const t = String(testo || "").replace(/(\d)[Oo]/g, "$10").replace(/[Oo](\d)/g, "0$1");
  const re = /(?:p\.?\s*i(?:va)?\.?|partita\s*iva|vat(?:\s*(?:n|no|number)\.?)?|c\.?\s*f\.?\s*\/?\s*p\.?\s*i(?:va)?\.?)\s*[:.]?\s*(?:it\s*)?((?:\d[\s]?){11})/gi;
  const trovate = [];
  for (const m of t.matchAll(re)) {
    const p = m[1].replace(/\s/g, "");
    if (partitaIvaValida(p) && p !== PARTITA_IVA_PODERE_VERDE) trovate.push(p);
  }
  if (trovate.length) return { valore: trovate[0], valida: true };
  // ripiego: qualunque gruppo di 11 cifre con il controllo giusto
  for (const m of t.matchAll(/\b(\d{11})\b/g)) if (partitaIvaValida(m[1]) && m[1] !== PARTITA_IVA_PODERE_VERDE) return { valore: m[1], valida: true };
  // c'è una scritta P.IVA ma le cifre non tornano: «non letta»
  return { valore: null, valida: false };
}

// nome di chi ha venduto: la prima riga «di testo» in alto (non indirizzi, non numeri, non parole di servizio)
const NON_NOME = /^(documento|scontrino|ricevuta|fattura|copia|conferma|riepilogo|pagamento|cortesia|cliente|spett|data|ora|tel|telefono|fax|www|http|e-?mail|p\.?\s*iva|partita|c\.?\s*f\.?|codice|cod\.|via |viale |piazza |p\.za|corso |c\.so|loc\.|localit|strada|vicolo|largo |\d)/i;
export function cercaVenditore(testo) {
  // prima le righe con l'etichetta («Venditore: …», «Ente creditore: …», «Beneficiario: …»)
  const et = String(testo || "").match(/^\s*(?:venditore|ente\s*creditore|beneficiario|esercente|fornitore|ragione\s*sociale|intestatario|incassato\s*da)\s*[:.]\s*(.{3,80})$/im);
  if (et) { const v = et[1].split(/\s+-\s+|\s+p\.?\s*iva|\s+c\.?\s*f\./i)[0].trim(); if (v.length >= 3) return v; }
  for (const r of String(testo || "").split(/\n/).map((x) => x.replace(/\s+/g, " ").trim())) {
    if (r.length < 3 || r.length > 60) continue;
    if (NON_NOME.test(r)) continue;
    if ((r.match(/[A-Za-zÀ-ÿ]/g) || []).length < 3) continue;
    if (/podere\s*verde/i.test(r)) continue;            // sulle fatture Podere Verde è il cliente
    // nei PDF la riga del nome può continuare con «FATTURA N. …»: si taglia lì
    const taglio = r.search(/\s(?:fattura|documento|ricevuta|scontrino|ordine|n\.\s*\d|del\s+\d{1,2}[/.-])/i);
    return taglio > 2 ? r.slice(0, taglio).trim() : r;
  }
  return null;
}

// ---------------------------------------------------------------- totale
const REGOLE_TOTALE = [
  ["netto a pagare", /netto\s*a\s*pagare|importo\s*pagato|totale\s*da\s*pagare|totale\s*a\s*pagare|totale\s*dovuto/],
  ["totale documento", /totale\s*(documento|complessivo|fattura|euro|eur\b|€|ordine|generale)/],
  ["pagamento", /pagamento\s*(elettronico|carta|pos|bancomat|contante)/],
  ["totale", /\btotale\b|\btot\.?\b|\bimporto\b/],
];
const NON_TOTALE = /imponibile|\biva\b|i\.v\.a|esent|escluso|sub\s*tot|subtot|parziale|sconto|resto|ricevuto|contanti\s*ricevut|di\s*cui/;
// testi: un testo per pagina. Il totale si cerca dall'ultima pagina verso la prima (la fattura lo ha in fondo).
export function cercaTotale(testi) {
  const pagine = Array.isArray(testi) ? testi : [testi];
  for (let p = pagine.length - 1; p >= 0; p--) {
    const righe = String(pagine[p] || "").split(/\n/).map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);
    for (const [nome, re] of REGOLE_TOTALE) {
      let trovato = null;
      for (let i = 0; i < righe.length; i++) {
        const r = righe[i].toLowerCase();
        if (!re.test(r) || (nome !== "netto a pagare" && NON_TOTALE.test(r))) continue;
        let imp = importiRiga(righe[i]);
        if (!imp.length && righe[i + 1]) imp = importiRiga(righe[i + 1]);   // importo sulla riga sotto
        if (imp.length) trovato = { cent: imp[imp.length - 1], regola: nome, riga: righe[i].slice(0, 80), pagina: p + 1 };
      }
      if (trovato) return trovato;
    }
  }
  return null;
}

// fattura: numero e righe IVA (aliquota, imponibile, imposta)
export function cercaNumeroFattura(testo) {
  const m = String(testo || "").match(/(?:fattura|documento|doc\.)\s*(?:n\.?|nr\.?|num(?:ero)?\.?|n°|nº)\s*[:.]?\s*([A-Z0-9][A-Z0-9/\-_.]{0,19})/i);
  return m ? m[1].replace(/[.]$/, "") : null;
}
export function cercaRigheIva(testi) {
  const testo = (Array.isArray(testi) ? testi : [testi]).join("\n");
  const righe = [];
  const visti = new Set();
  for (const riga of testo.split(/\n/)) {
    const al = riga.match(/\b(4|5|10|22)\s*(?:%|\bper\s*cento)/);
    if (!al) continue;
    const imp = importiRiga(riga.replace(al[0], " "));
    if (imp.length < 2) continue;
    const [imponibile, iva] = imp.slice(-2);
    const aliquota = +al[1];
    // controllo: l'imposta deve essere l'aliquota dell'imponibile (scarto di 2 centesimi)
    if (Math.abs(Math.round(imponibile * aliquota / 100) - iva) > 2) continue;
    const chiave = `${aliquota}-${imponibile}-${iva}`;
    if (visti.has(chiave)) continue;
    visti.add(chiave);
    righe.push({ aliquota, imponibile: imponibile / 100, iva: iva / 100, natura: null });
  }
  if (righe.length) return righe;
  // seconda forma: imponibile e IVA su due righe diverse («Imponibile 22% 180,00» / «IVA 22% 39,60»)
  const imponibili = {}, imposte = {};
  for (const riga of testo.split(/\n/)) {
    const al = riga.match(/\b(4|5|10|22)\s*%/);
    if (!al) continue;
    const imp = importiRiga(riga.replace(al[0], " "));
    if (imp.length !== 1) continue;
    if (/imponibil/i.test(riga)) imponibili[al[1]] = imp[0];
    else if (/\biva\b|imposta/i.test(riga)) imposte[al[1]] = imp[0];
  }
  for (const k of Object.keys(imponibili)) {
    const imponibile = imponibili[k], iva = imposte[k];
    if (iva == null || Math.abs(Math.round(imponibile * k / 100) - iva) > 2) continue;
    righe.push({ aliquota: +k, imponibile: imponibile / 100, iva: iva / 100, natura: null });
  }
  return righe;
}

// ricevuta: causale e chi ha incassato
export function cercaCausale(testo) {
  const m = String(testo || "").match(/(?:causale|per|oggetto|descrizione)\s*[:.]\s*(.{3,80})/i);
  return m ? m[1].trim() : null;
}
// acquisto online: numero dell'ordine
export function cercaNumeroOrdine(testo) {
  const m = String(testo || "").match(/(?:ordine|order|n\.?\s*ordine|numero\s*(?:d[ei]ll?'?\s*)?ordine|order\s*(?:no|number|#))\s*[:#n.°º]*\s*([A-Z0-9][A-Z0-9-]{3,30})/i);
  return m ? m[1] : null;
}

// «che cosa hai comprato»: le righe di descrizione con un prezzo (non totali, non IVA)
export function cercaAcquisto(testi) {
  const testo = (Array.isArray(testi) ? testi : [testi]).join("\n");
  const voci = [];
  for (const r0 of testo.split(/\n/)) {
    const r = r0.replace(/\s+/g, " ").trim();
    if (r.length < 4) continue;
    const l = r.toLowerCase();
    if (/totale|subtot|iva|imponibile|pagamento|pagato|resto|contant|import|sconto|carta|bancomat|documento|scontrino|p\.?\s*iva|rt\s|descrizione|prezzo|commission|spedizion|codice|aliq/.test(l)) continue;
    if (!importiRiga(r).length) continue;
    const desc = r.replace(/^\s*\d+\s*[x×]\s+/i, "").replace(RE_IMPORTO, "").replace(/\b\d{1,2}\s*%/g, "").replace(/€|\s[x×*]\s|\s[x×*]$/gi, " ").replace(/\s+/g, " ").trim();
    if ((desc.match(/[A-Za-zÀ-ÿ]/g) || []).length >= 3) voci.push(desc);
  }
  return voci.length ? voci.slice(0, 6).join(", ") : null;
}

// ---------------------------------------------------------------- ricevuta di pagamento (POS)
// Le 4 cifre dopo gli asterischi si leggono male (una cifra sbagliata è frequente): si considera
// «altra carta» solo se almeno 2 cifre su 4 sono diverse da quelle dello strumento.
export function altraCarta(lette, attese) {
  if (!lette || !attese || lette.length !== 4 || attese.length !== 4) return false;
  let diverse = 0;
  for (let i = 0; i < 4; i++) if (lette[i] !== attese[i]) diverse++;
  return diverse >= 2;
}
// testoSparso (facoltativo): lettura in modo sparso, usata per prima per le ultime 4 cifre
export function leggiPagamento(testo, testoSparso = "") {
  const t = String(testo || "");
  const tot = cercaTotale([t]);
  // ultime 4 cifre: «**** **** **** 1894», «XXXX1894», «PAN: ...1894», «carta ...1894»
  // prima il testo normale, poi quello sparso (prove del 20/11: i due modi sbagliano su ricevute diverse)
  let cifre = null;
  for (const x of [t, String(testoSparso || "")]) {
    let m;
    if ((m = x.match(/(?:pan|carta|card)\b[^\n]{0,45}?(\d{4})[ \t]*$/im)) || (m = x.match(/[*xX•]{2,}[\s-]*(\d{4})\b/))) { cifre = m[1]; break; }
  }
  const { data, ora } = cercaDataOra(t);
  return { cent: tot ? tot.cent : null, cifre, data, ora, venditore: cercaVenditore(t), partitaIva: cercaPartitaIva(t).valore };
}

// ---------------------------------------------------------------- lettura completa del documento, per tipo
// testi: un testo per pagina. Restituisce i campi letti (null = non letto).
export function leggiDocumento(tipo, testi) {
  const pagine = Array.isArray(testi) ? testi : [testi];
  const tutto = pagine.join("\n");
  const prima = pagine[0] || "";
  const piva = cercaPartitaIva(tutto);
  const { data, ora } = cercaDataOra(tutto);
  const totale = cercaTotale(pagine);
  const letto = {
    venditore: cercaVenditore(prima),
    partitaIva: piva.valore,
    data, ora,
    cent: totale ? totale.cent : null,
    rigaTotale: totale ? totale.riga : null,
    acquisto: cercaAcquisto(pagine),
  };
  if (tipo === "Fattura") { letto.numero = cercaNumeroFattura(tutto); letto.iva = cercaRigheIva(pagine); }
  if (tipo === "Ricevuta") letto.causale = cercaCausale(tutto);
  if (tipo === "Acquisto online") letto.ordine = cercaNumeroOrdine(tutto);
  return letto;
}

// Il PDF è «leggibile» se dalla stessa immagine si rileggono venditore, data e totale (decisione 18/11 14:42)
export const pdfLeggibile = (l) => !!(l && l.venditore && l.data && l.cent != null);
