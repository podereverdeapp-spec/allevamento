# Sezione Coltivazione — specifica e stato

_Documento di lavoro. Riassume quanto richiesto da Filippo (prompt del 07/09/2026 + file CAMPI.xlsx) e fissa le decisioni di struttura. Da tenere aggiornato come STATO_PROGETTO.md._

**Stato: COSTRUITA (v103, 07/09/2026)** — schema Supabase applicato, 16 campi caricati con foto, modulo `src/coltivazione.jsx` in tab "🌾 Campi".

## 0. Decisioni prese con Filippo

| Domanda | Risposta |
|---|---|
| Stagione agricola | **Campagna a cavallo d'anno**: "2025/2026". Confine il 1° settembre, così semina d'autunno e trebbiatura dell'estate dopo restano insieme |
| Più colture sullo stesso campo nella stessa campagna | **Spesso sì** — le successioni sono la norma, non l'eccezione: trattate come caso normale |
| Colture annotate nel file CAMPI (erbaio, medica, pisello, orzo) | **Non precaricate** — caricata solo l'anagrafica dei campi |
| Chi registra | **Sborchia e gli operatori**, spesso da telefono → interfaccia a pochi tap, schermo stretto |

## 1. I campi — dati acquisiti

16 campi, **84,43 ha** complessivi, tutti nel Comune di Roma. Da `CAMPI.xlsx` (un foglio per campo + foglio RIEPILOGO):

| # | Campo | ha | m² | Foglio | Particelle |
|---|---|---|---|---|---|
| 1 | PISANA RISTORANTE | 5,60 | 56.000 | 753 | 121, 122, 123, 124, 125, 164 |
| 2 | PISANA API | 1,40 | 14.000 | 753 | 167, 354 |
| 3 | PISANA PRINCIPE SCEMO | 4,30 | 43.000 | 767 | 371, 372 |
| 4 | PISANA (SULLA) | 3,40 | 34.000 | 767 | 295 |
| 5 | PORTUENSE VIGNETO | 3,00 | 30.000 | 753 | 8, 9, 359 |
| 6 | PORTUENSE EX CAVA | 7,00 | 70.000 | 753 | 25, 359 |
| 7 | PORTUENSE ULIVETO | 1,80 | 18.000 | 753 | 59, 63, 189, 359 |
| 8 | PASCOLO RIPRODUTTORI | 1,30 | 13.000 | 753 | 359 |
| 9 | PASCOLO INGRASSO | 2,00 | 20.000 | 753 | 67, 355, 359 |
| 10 | PORTUENSE CAPANNONI | 1,85 | 18.500 | 753 | 27, 28, 69, 70 |
| 11 | PORTUENSE BETTACCHI | 2,00 | 20.000 | 767 | 721 |
| 12 | BAYCUS PICCOLO | 5,2533 | 52.533 | 753 | **mancanti** |
| 13 | BAYCUS GRANDE | 11,23 | 112.300 | 753 | **mancanti** |
| 14 | PRATI FIORITI FOTOVOLTAICO | 13,90 | 139.000 | 745 | 101, 102, 288 |
| 15 | PRATI FIORITI CASALE | 17,00 | 170.000 | 745 | 287 |
| 16 | PRATI FIORITI OLTRE AUTOSTRADA | 3,40 | 34.000 | 745 | 99 |

**Foto**: 18 immagini estratte dai fogli (satellitari con perimetro rosso). Campi 10 e 11 ne hanno due ciascuno; la seconda del campo 10 è identica alla prima del campo 11 — probabile copia/incolla, da verificare quale tenere.

**Annotazioni trovate nei fogli** (coltura a margine, anno non indicato): campo 1 = erbaio, campo 2 = medica, campo 3 = pisello proteico + medica, campo 4 = orzo.

## 2. Quattro correzioni di struttura rispetto al prompt

### 2.1 Le lavorazioni ripetibili non sono solo l'irrigazione

Il prompt chiede come gestire l'irrigazione, che si fa più volte a stagione. Il problema è più largo: **l'erba medica si sfalcia 3-4 volte l'anno**, e ogni sfalcio si porta dietro ranghinatura, pressatura e raccolta balle. Con una spunta sola e una data sola, dal secondo sfalcio in poi si perdono giornate lavoro e si perde la storia.

**Soluzione**: la lista delle 15 lavorazioni resta un catalogo fisso; ogni **esecuzione** è una riga a sé (data + giornate lavoro + note). L'elenco a schermo resta identico a quello del prompt — spunta, lavorazione, data, giornate — ma:

- la spunta è verde se c'è **almeno una** esecuzione
- la colonna data mostra l'ultima, con "×3" accanto se sono più di una
- la colonna giornate mostra il **totale** delle esecuzioni
- cliccando la riga si espande l'elenco delle singole esecuzioni, con "+ aggiungi"

Nessuna lavorazione è speciale: vale per irrigazione, sfalcio e qualunque altra.

### 2.2 La paglia non è una coltura, è un sottoprodotto

Nella tabella Raccolta del prompt la paglia sta in fila con avena, grano e orzo. Ma la paglia non si semina: **esce dallo stesso ettaro del grano**. Stessa cosa per il seme di medica e il seme di sulla, che vengono dalla medica e dalla sulla.

Se la si tratta come coltura, nella scheda riepilogativa i suoi ettari e le sue giornate lavoro **vengono contati due volte**, e il totale aziendale risulta più grande della superficie che possiedi.

**Soluzione**: la raccolta registra un **prodotto**, non una coltura. Ogni prodotto sa se è principale o sottoprodotto, e da quale coltura arriva. Nel riepilogo i sottoprodotti compaiono con la loro quantità e la loro resa/ha, ma ettari e giornate restano attribuiti alla coltura madre e non si sommano nel totale.

### 2.3 L'erba medica dura più anni

La medica si semina una volta e si raccoglie per 4-5 stagioni. Se il programma pretende la quantità di seme ogni anno, dal secondo anno l'operatore o inventa un numero o lascia vuoto.

**Soluzione**: la semina è **facoltativa**. Una coltura può essere marcata "poliennale, seminata nel <anno>", e negli anni successivi la scheda mostra le lavorazioni e la raccolta senza chiedere il seme. La resa per ettaro continua a calcolarsi normalmente.

### 2.4 Non tutti i campi sono seminativi

Vigneto (3 ha), uliveto (1,8), i due pascoli (3,3), i capannoni (1,85): messi nel riepilogo colture, gonfiano gli ettari e abbassano tutte le rese.

**Soluzione**: ogni campo ha un **tipo** — seminativo, pascolo, arboreo, altro. Il riepilogo per coltura considera i seminativi; gli altri restano visibili nella lista campi con il loro tipo. I pascoli sono anche l'aggancio naturale, più avanti, con gli animali.

## 3. Struttura dati (Supabase)

Sette tabelle nuove, tutte con RLS come da regola del progetto.

- **`campi`** — anagrafica permanente: nome, ettari, m², comune, foglio, particelle (array), tipo, foto (URL Storage), attivo. 16 righe precaricate.
- **`colture_campo`** — una riga per campo × stagione: anno, coltura (menu + "Altro" con nome libero), poliennale, anno di semina. È il perno di tutto.
- **`semine`** — quantità di seme: quintali **oppure** dosi (alternative, per grano e orzo), con kg calcolati e q/ha o dosi/ha. Per erbaio misto e produzione seme, una riga per ciascuna delle tre sementi (trifoglio, avena, loietto), anche una sola.
- **`lavorazioni_campo`** — le singole esecuzioni: tipo (dal catalogo di 15), data, giornate lavoro, note.
- **`concimazioni`** — legata all'esecuzione di concimazione: tipo (binario, ternario, stallatico, letame — **cumulabili**), quintali, q/ha calcolati.
- **`diserbi`** — legata all'esecuzione di diserbo: prodotto (testo libero), quantità, unità (litri/kg), quantità/ha.
- **`raccolte`** — prodotto, unità (quintali/balloni), quantità, resa/ha calcolata.

Tutti i "per ettaro" sono **calcolati**, mai digitati: quantità ÷ ettari del campo.

### 3.1 Note di implementazione

- **Campagna**: campo `campagna` testuale ("2025/2026") + `anno_inizio` intero per ordinare. Il confine è il 1° settembre (`campagnaDiData()` in `coltivazione.jsx`).
- **Successioni**: più righe in `colture_campo` per la stessa coppia (campo, campagna), distinte da `ordine`. Vincolo `unique (campo_id, campagna, ordine)`.
- **Cancellazioni**: deviazione consapevole dalla convenzione "cancellazione solo admin". Gli operatori possono cancellare le proprie righe operative (semine, lavorazioni, concimazioni, diserbi, raccolte), perché sono loro a registrarle e un errore di battitura non deve diventare una telefonata. Restano admin-only le cancellazioni strutturali (`campi`, `colture_campo`), che si portano via a cascata il lavoro di un'intera campagna.
- **Foto**: 16 JPEG in `public/campi/campo-NN.jpg` (1200px max, ~2,7 MB in tutto), non su Supabase Storage. `campi.foto_url` contiene il percorso relativo, quindi spostarle su Storage un domani è solo un UPDATE.

## 4. Le schermate

1. **Lista campi** — 16 righe con nome, ettari, tipo, coltura dell'anno selezionato. Selettore anno in alto, che governa tutta la sezione.
2. **Scheda campo** — foto aerea, ettari/m², identificazione catastale, e per l'anno scelto: coltura + semina, tabella lavorazioni (con le espansioni del punto 2.1), raccolta.
3. **Riepilogo per coltura** — la tabella 5 del prompt: ettari dedicati, giornate lavorative, quantità raccolta, resa/ha, resa/giornata. Sottoprodotti separati come da punto 2.2.

Cambiando anno cambia tutto, e gli anni passati restano consultabili in sola lettura.

## 5. Fuori perimetro per ora (fase 2)

Il **ponte con il Magazzino e la Contabilità Industriale**: i balloni di fieno prodotti qui dovrebbero entrare nel magazzino foraggi e da lì scaricarsi come costo sugli animali che li mangiano. Oggi la Contabilità Industriale vede solo il foraggio **acquistato** (Mariotti, 1 rotoballa = 340 kg): tutto il foraggio autoprodotto è invisibile al costo per capo, e l'esclusione della voce "Coltivazione" dai costi alimentari nasce proprio da lì.

È il vero premio di questa sezione, ma va costruito dopo, quando i dati di raccolta hanno cominciato ad accumularsi.

## 6. Da chiedere a Filippo

1. **Particelle catastali dei campi 12 (Baycus Piccolo) e 13 (Baycus Grande)** — mancanti nel file CAMPI.xlsx. Le schede le segnalano in rosso.
2. **Tipo dei campi** — attribuzione fatta a occhio dai nomi, da confermare: arborei il vigneto (5) e l'uliveto (7); pascoli il 8 e il 9; "altro" i capannoni (10) e il fotovoltaico (14); seminativi tutti gli altri, prati fioriti inclusi. Il tipo decide chi entra nel conteggio "ha seminativi".
3. **Foto del campo 10** — nel file ce n'erano due, la seconda identica alla prima del campo 11. È stata tenuta la prima; verificare che sia quella giusta.
4. **Unità della raccolta** — "balloni" per medica, erbaio e sulla, "quintali" per i cereali, come da tua tabella. Se un domani serve il ponte col magazzino foraggi, servirà sapere quanti kg pesa un ballone (per i rotoballe acquistati da Mariotti sappiamo 340 kg).
