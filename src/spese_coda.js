// v148 — «Spese pagate»: salvataggio della spesa e lavoro senza rete.
// Regola del programma di contabilità (versione 382): l'app NON scrive mai nelle tabelle.
// 1) carica il PDF (e la foto dell'oggetto) nell'archivio privato «cassa»;
// 2) chiama la funzione ci_spesa_salva, che controlla tutto e restituisce il numero.
// Senza rete la spesa resta nel telefono (IndexedDB) e si riprova.
import { supabase } from "./supabase";

export const ARCHIVIO = "cassa";

// stessa tabella della funzione ci_spese_cartella del database
export const CARTELLA = {
  "Contanti": "CONTANTI",
  "Carta prepagata 8006": "CARTA 8006",
  "Carta di debito 1894": "CARTA 1894",
  "Pagato da me": "PAGATE DALLE PERSONE",
  "Carta di credito personale": "PAGATE DALLE PERSONE",
};

export const percorsoPdf = (pagatoCon, data, impronta) =>
  `${CARTELLA[pagatoCon]}/${data.slice(0, 4)}/${data.slice(5, 7)}/${impronta}.pdf`;
export const percorsoFoto = (pagatoCon, data, impronta) =>
  `${CARTELLA[pagatoCon]}/${data.slice(0, 4)}/${data.slice(5, 7)}/${impronta}-oggetto.jpg`;

// ---------------------------------------------------------------- errori
// Errore di rete (niente connessione): la spesa resta nel telefono.
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
  if (error && !giaPresente(error)) throw error;   // «già nell'archivio» non è un errore: si va avanti
}

// spesa = { pdf: Uint8Array, impronta, foto: Uint8Array|null, tipo, tipoAltro, pagatoCon, data, dataPagamento, importo, totaleLetto, fornitore, nota }
// Restituisce { esito:"salvata", numero, codice } | { esito:"doppia", messaggio } | { esito:"rete" } | { esito:"errore", messaggio }
export async function inviaSpesa(spesa) {
  const pdfPercorso = percorsoPdf(spesa.pagatoCon, spesa.data, spesa.impronta);
  const fotoPercorso = spesa.foto ? percorsoFoto(spesa.pagatoCon, spesa.data, spesa.impronta) : null;
  try {
    await carica(pdfPercorso, spesa.pdf, "application/pdf");
    if (spesa.foto) await carica(fotoPercorso, spesa.foto, "image/jpeg");
  } catch (e) {
    if (erroreDiRete(e)) return { esito: "rete" };
    return { esito: "errore", messaggio: (e && e.message) || String(e) };
  }
  let risposta;
  try {
    risposta = await supabase.rpc("ci_spesa_salva", {
      p_tipo: spesa.tipo,
      p_tipo_altro: spesa.tipo === "Altro" ? (spesa.tipoAltro || null) : null,
      p_pagato_con: spesa.pagatoCon,
      p_data: spesa.data,
      p_importo: spesa.importo,
      p_totale_letto: spesa.totaleLetto ?? null,
      p_fornitore: spesa.fornitore || null,
      p_nota: spesa.nota || null,
      p_pdf_percorso: pdfPercorso,
      p_pdf_impronta: spesa.impronta,
      p_foto_percorso: fotoPercorso,
      p_data_pagamento: spesa.dataPagamento || null,
    });
  } catch (e) {
    if (erroreDiRete(e)) return { esito: "rete" };
    return { esito: "errore", messaggio: (e && e.message) || String(e) };
  }
  const { data, error } = risposta;
  if (error) {
    if (erroreDiRete(error)) return { esito: "rete" };
    const m = error.message || String(error);
    if (/già salvato/i.test(m)) return { esito: "doppia", messaggio: m };
    return { esito: "errore", messaggio: m };
  }
  return { esito: "salvata", numero: data && data.numero, codice: data && data.codice_attesa, id: data && data.id };
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
  operazione("readwrite", (s) => s.put({ ...spesa, chiave: spesa.impronta, utente, messaTel: new Date().toISOString(), ultimoErrore: null }));
export const togliDallaCoda = (chiave) => operazione("readwrite", (s) => s.delete(chiave));
export async function elencoCoda(utente) {
  try {
    const tutte = (await operazione("readonly", (s) => s.getAll())) || [];
    return tutte.filter((x) => x.utente === utente).sort((a, b) => String(a.messaTel).localeCompare(String(b.messaTel)));
  } catch (e) { return []; }
}
const segnaErrore = (voce, messaggio) => operazione("readwrite", (s) => s.put({ ...voce, ultimoErrore: messaggio, ultimoTentativo: new Date().toISOString() }));

// Riprova tutte le spese in attesa dell'utente. Restituisce l'elenco dei risultati.
let inCorso = false;
export async function riprovaCoda(utente) {
  if (inCorso) return [];
  inCorso = true;
  const risultati = [];
  try {
    for (const voce of await elencoCoda(utente)) {
      const r = await inviaSpesa(voce);
      if (r.esito === "rete") { risultati.push({ voce, ...r }); break; }   // ancora senza rete: inutile provare le altre
      if (r.esito === "salvata" || r.esito === "doppia") await togliDallaCoda(voce.chiave);
      else await segnaErrore(voce, r.messaggio);
      risultati.push({ voce, ...r });
    }
  } finally { inCorso = false; }
  return risultati;
}
