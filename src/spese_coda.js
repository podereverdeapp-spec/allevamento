// v149 — «Spese pagate»: salvataggio della spesa e lavoro senza rete.
// Regola del programma di contabilità: l'app NON scrive mai nelle tabelle.
// 1) carica nell'archivio privato «cassa» il documento (PDF), la ricevuta di pagamento e la foto del bene;
// 2) chiama la funzione ci_spesa_registra, che controlla tutto, scrive e restituisce il numero.
// Senza rete la spesa resta nel telefono (IndexedDB) e si invia da sola quando torna la rete.
import { supabase } from "./supabase";

export const ARCHIVIO = "cassa";

// stessa tabella della funzione ci_spese_cartella del database; la cartella vera arriva da
// ci_spese_strumenti_attivi() (campo «cartella»), questa serve solo se manca
export const CARTELLA = {
  "Contanti": "CONTANTI",
  "Carta prepagata 8006": "CARTA 8006",
  "Carta di debito 1894": "CARTA 1894",
  "Pagato da me": "PAGATE DALLE PERSONE",
  "La mia carta": "PAGATE DALLE PERSONE",
  "Carta di credito personale": "PAGATE DALLE PERSONE",
};
const cartellaDi = (s) => s.cartella || CARTELLA[s.pagatoCon];
const base = (s) => `${cartellaDi(s)}/${s.data.slice(0, 4)}/${s.data.slice(5, 7)}/${s.impronta}`;
export const percorsoPdf = (s) => `${base(s)}.pdf`;
export const percorsoPagamento = (s) => `${base(s)}-pagamento.${s.pagamentoTipo === "pdf" ? "pdf" : "jpg"}`;
export const percorsoFoto = (s) => `${base(s)}-oggetto.jpg`;
export const percorsoInsegna = (s) => `${base(s)}-insegna.jpg`;

// ---------------------------------------------------------------- errori
export function erroreDiRete(err) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  const m = String((err && (err.message || err.error || err)) || "");
  return /failed to fetch|networkerror|network request failed|load failed|fetch failed|internet|timed? ?out|err_network|err_internet/i.test(m);
}
const giaPresente = (err) => {
  const m = String((err && (err.message || err.error)) || ""), s = String((err && (err.statusCode || err.status)) || "");
  return s === "409" || /already exists|duplicate/i.test(m);
};
async function carica(percorso, byte, tipo) {
  const { error } = await supabase.storage.from(ARCHIVIO).upload(percorso, new Blob([byte], { type: tipo }), { contentType: tipo, upsert: false });
  if (error && !giaPresente(error)) throw error;     // «già nell'archivio» non è un errore: si va avanti
}

// ---------------------------------------------------------------- parametri di ci_spesa_registra
// UNICO punto in cui si costruiscono i parametri (lettera del Tenente del 20/11 ore 11:59, sezione 4).
const n2 = (x) => (x == null || x === "" ? null : Math.round(Number(x) * 100) / 100);
export function parametriRegistra(s) {
  const p = {
    p_pagato_con: s.pagatoCon,
    p_quota_da_me: n2(s.quotaDaMe || 0),
    p_ora_pago: s.oraPago,
    p_tipo: s.tipo,
    p_tipo_ricevuta: s.tipo === "Ricevuta" ? s.tipoRicevuta : null,
    p_tipo_altro: s.tipo === "Altro" || (s.tipo === "Ricevuta" && s.tipoRicevuta === "Altro") ? (s.tipoAltro || "").trim() : null,
    p_data: s.data,
    p_ora_documento: s.oraDocumento || null,
    p_importo: n2(s.importo),
    p_totale_letto: n2(s.totaleLetto),
    p_fornitore: (s.fornitore || "").trim(),
    p_partita_iva: (s.partitaIva || "").trim() || null,
    p_numero_documento: (s.numeroDocumento || "").trim() || null,
    p_iva: s.tipo === "Fattura" && s.iva && s.iva.length ? s.iva : null,
    p_ordine_numero: s.tipo === "Acquisto online" ? (s.ordineNumero || "").trim() : null,
    p_venditore: s.tipo === "Acquisto online" ? (s.venditore || "").trim() : null,
    p_cf_percipiente: s.prestazione ? String(s.cfPercipiente || "").toUpperCase().replace(/\s/g, "") : null,
    p_lordo: s.prestazione ? n2(s.lordo) : null,
    p_ritenuta: s.prestazione ? n2(s.ritenuta) : null,
    p_acquisto: (s.acquisto || "").trim(),
    p_acquisto_origine: s.acquistoOrigine,
    p_bene: !!s.bene,
    p_pdf_percorso: s.pdf ? percorsoPdf(s) : null,     // null solo per «Altro» senza documento
    p_pdf_impronta: s.pdf ? s.impronta : null,
    p_pagamento_percorso: s.pagamento ? percorsoPagamento(s) : null,
    p_foto_percorso: s.bene && s.foto ? percorsoFoto(s) : null,
    p_insegna_percorso: s.insegna ? percorsoInsegna(s) : null,
    p_fattura_da_sdi: s.tipo === "Fattura" && !!s.fatturaDaSdi,
    p_carta_letta: /^\d{4}$/.test(String(s.cartaLetta || "")) ? String(s.cartaLetta) : null,
    p_nota: (s.nota || "").trim() || null,
  };
  if (s.confermaDoppione) p.p_conferma_doppione = s.confermaDoppione;
  return p;
}

// spesa: tutti i campi raccolti nei passi 1–7, più pdf (Uint8Array), impronta, pagamento (Uint8Array|null),
// pagamentoTipo ("jpg"|"pdf"), foto (Uint8Array|null).
// Restituisce { esito: "salvata", numero } | { esito: "doppione", messaggio } | { esito: "rete" } | { esito: "errore", messaggio }
export async function inviaSpesa(spesa) {
  try {
    if (spesa.pdf) await carica(percorsoPdf(spesa), spesa.pdf, "application/pdf");
    if (spesa.pagamento) await carica(percorsoPagamento(spesa), spesa.pagamento, spesa.pagamentoTipo === "pdf" ? "application/pdf" : "image/jpeg");
    if (spesa.bene && spesa.foto) await carica(percorsoFoto(spesa), spesa.foto, "image/jpeg");
    if (spesa.insegna) await carica(percorsoInsegna(spesa), spesa.insegna, "image/jpeg");
  } catch (e) {
    if (erroreDiRete(e)) return { esito: "rete" };
    return { esito: "errore", messaggio: (e && e.message) || String(e) };
  }
  let risposta;
  try { risposta = await supabase.rpc("ci_spesa_registra", parametriRegistra(spesa)); }
  catch (e) { return erroreDiRete(e) ? { esito: "rete" } : { esito: "errore", messaggio: (e && e.message) || String(e) }; }
  const { data, error } = risposta;
  if (error) {
    if (erroreDiRete(error)) return { esito: "rete" };
    const m = error.message || String(error);
    if (/^\s*DOPPIONE:/i.test(m)) return { esito: "doppione", messaggio: m.replace(/^\s*DOPPIONE:\s*/i, "") };
    return { esito: "errore", messaggio: m };
  }
  const numero = typeof data === "string" ? data : data && (data.numero || data.n);
  return { esito: "salvata", numero };
}

// ---------------------------------------------------------------- spese in attesa nel telefono (IndexedDB)
const DB = "podereverde_spese", NEGOZIO = "da_inviare";
function apriDb() {
  return new Promise((ok, ko) => {
    if (typeof indexedDB === "undefined") return ko(new Error("memoria del telefono non disponibile"));
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore(NEGOZIO, { keyPath: "chiave" }); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => ko(r.error || new Error("memoria del telefono non disponibile"));
  });
}
async function operazione(modo, fare) {
  const db = await apriDb();
  try {
    return await new Promise((ok, ko) => {
      const tx = db.transaction(NEGOZIO, modo);
      const req = fare(tx.objectStore(NEGOZIO));
      tx.oncomplete = () => ok(req ? req.result : undefined);
      tx.onerror = () => ko(tx.error);
      tx.onabort = () => ko(tx.error || new Error("operazione annullata"));
    });
  } finally { db.close(); }
}
// utente: chi l'ha preparata (si inviano solo le proprie, con la propria sessione)
export const mettiInCoda = (spesa, utente) =>
  operazione("readwrite", (s) => s.put({ ...spesa, versione: 149, chiave: spesa.impronta, utente, messaTel: new Date().toISOString(), ultimoErrore: null }));
export const togliDallaCoda = (chiave) => operazione("readwrite", (s) => s.delete(chiave));
export const aggiornaInCoda = (voce) => operazione("readwrite", (s) => s.put(voce));
export async function elencoCoda(utente) {
  try {
    const tutte = (await operazione("readonly", (s) => s.getAll())) || [];
    return tutte.filter((x) => x.utente === utente).sort((a, b) => String(a.messaTel).localeCompare(String(b.messaTel)));
  } catch (e) { return []; }
}

// Riprova le spese in attesa dell'utente. Quelle con un errore (anche «DOPPIONE») aspettano una scelta della
// persona e non si riprovano da sole, salvo quella indicata in «anche». Le spese lasciate nel telefono dalla
// 148 non si mandano più: la persona le rifà con la 149 oppure le toglie.
let inCorso = false;
export async function riprovaCoda(utente, anche = null) {
  if (inCorso) return [];
  inCorso = true;
  const risultati = [];
  try {
    for (const voce of await elencoCoda(utente)) {
      // spese della 148: dalla 391 ci_spesa_salva non salva più (lettera del Tenente 20/11 13:10, punto 1): non si mandano
      if (voce.versione !== 149) continue;
      if (voce.ultimoErrore && voce.chiave !== anche) continue;
      const r = await inviaSpesa(voce);
      if (r.esito === "rete") { risultati.push({ voce, ...r }); break; }
      if (r.esito === "salvata") await togliDallaCoda(voce.chiave);
      else await aggiornaInCoda({ ...voce, ultimoErrore: r.esito === "doppione" ? "DOPPIONE: " + r.messaggio : r.messaggio, ultimoTentativo: new Date().toISOString() });
      risultati.push({ voce, ...r });
    }
  } finally { inCorso = false; }
  return risultati;
}
