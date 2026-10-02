// ============================================================================
// MODELLI 4 — PROMPT PER L'INTELLIGENZA ARTIFICIALE — v126
// Per i modelli 4 su carta o scansionati (immagini senza testo): si fotografa
// o scansiona bene il documento, lo si dà a un'IA (Claude o simili) con questo
// prompt e si carica nell'app il PDF che l'IA restituisce.
// Lo schema e' quello che il lettore dei modelli 4 (modelli4_lettura.js) sa
// leggere: se si cambia qui, va provato con il lettore.
// Il testo resta in italiano perche' e' rivolto all'IA, non all'operatore.
// ============================================================================
export const PROMPT_IA_MODELLO4 = `Sei un assistente che trascrive documenti veterinari italiani.
Ti allego la scansione (foto o PDF) di un MODELLO 4 – Documento di accompagnamento degli animali della Banca Dati Nazionale.
Trascrivilo e restituiscimi un FILE PDF con testo selezionabile (non un'immagine), formato A4, carattere semplice, una informazione per riga, ESATTAMENTE con lo schema qui sotto. Non aggiungere titoli, commenti o righe diverse dallo schema.

REGOLE
- Scrivi solo quello che leggi nel documento. Non inventare e non dedurre nulla.
- Se un dato è illeggibile scrivi ILLEGGIBILE al suo posto e riportalo anche nell'elenco finale DA VERIFICARE.
- Se un dato non c'è, lascia vuoto dopo i due punti.
- Date nel formato gg/mm/aaaa, tranne la data di nascita dei capi: gg/mm/aa.
- Matricole tutte attaccate, senza spazi (esempio IT058990412075).
- Sesso: M, F oppure N.
- Razza: il codice di tre lettere scritto sul documento (esempio MCG, MTT, CNS, SPV).
- Dopo la riga «Gli animali sono destinati a:» scrivi una riga con X seguita dalla destinazione barrata sul documento: Macello, Allevamento, Pascolo, Fiere oppure Altre tipologie.
- Nella riga del TOTALE scrivi la specie in maiuscolo come sul documento: BOVINI, SUINI, OVINI, OVICAPRINI oppure CAPRINI.

SCHEMA
TRASCRIZIONE DA SCANSIONE
N. Modello 4: [numero del documento, esempio IT091RMA90202600009]
Data Modello 4: [data del documento]
Codice controllo: [codice di controllo]
Progressivo di allevamento: [esempio 9/2026]
Codice Aziendale: [codice dell'allevamento di partenza, esempio 091RMA90]
PROPRIETARIO: [ragione sociale del proprietario]
C) DESTINAZIONE
Gli animali sono destinati a:
X [Macello oppure Allevamento oppure altra destinazione barrata]
Codice: [codice della destinazione]
Approval number: [numero di riconoscimento, se c'è]
Denominazione: [nome del macello o dell'allevamento]
Indirizzo: [indirizzo e comune]
Data di uscita prevista [data]
D) TRASPORTO
I capi sono trasportati da [nome e cognome del conducente] conducente
ragione sociale [ditta di trasporto] sita
Data: [data di partenza], ora partenza: [ora:minuti]
ELENCO CAPI MOVIMENTATI
TOTALE CAPI [SPECIE] MOVIMENTATI: [numero]

Poi l'elenco dei capi, in uno di questi due modi.

A) Capi con matricola (bovini, ovini, caprini): una riga per capo
[numero d'ordine] [matricola] [BOVINI oppure OVI oppure CAP] [nascita gg/mm/aa] [sesso] [razza] [provenienza] [data di ingresso gg/mm/aaaa]
dove provenienza è «Nato in stabilimento» oppure «Azienda [codice] documento [numero] del [gg/mm/aa]»
esempio:
1 IT058990412075 BOVINI 07/06/22 M MCG Nato in stabilimento 07/06/2022

B) Capi per insieme (suini, agnelli): due righe per ogni gruppo
[marchio aziendale] [età in mesi] [sesso] [razza]
[numero dell'insieme oppure -] [categoria] [Suini oppure Ovini oppure Caprini] [numero di capi] [codice dell'azienda di provenienza]
esempio:
IT091RMA90 12 N CNS
641966 Grassi Suini 20 091RMA90

In fondo, solo se serve:
DA VERIFICARE: [elenco dei dati illeggibili o dubbi]

Chiama il file come il numero del documento, per esempio IT091RMA90202600009.pdf.`;
