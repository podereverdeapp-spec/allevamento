# podereverdeapp.it (Allevamento) — Stato del Progetto
_Documento di riferimento — creato per la prima volta insieme al backup della Contabilità Industriale, così un'eventuale nuova sessione possa ripartire senza soluzione di continuità. Da tenere aggiornato come il documento gemello della Contabilità Industriale._

## 0. Chi fa cosa — i quattro pezzi (verificato il 07/09/2026)

Da leggere per primo: confondere questi ruoli fa perdere ore a cercare guasti dove non sono.

| Pezzo | Cosa fa davvero | Cosa NON fa |
|---|---|---|
| **Aruba** | Registrar e **DNS** del dominio: dice ai browser dove andare. Nameserver verificati: `dns.technorail.com`, `dns2.technorail.com`, `dns3.arubadns.net`, `dns4.arubadns.cz` | **Non ospita il sito.** È l'elenco telefonico, non la casa |
| **GitHub** (`podereverdeapp-spec/allevamento`) | **Archivia** il codice con tutta la storia, e fa da **innesco**: a ogni push su `main`, Vercel ricompila | Non esegue niente. Da solo non serve pagine a nessuno |
| **Vercel** | **Ospita e serve il sito.** Compila il codice preso da GitHub e consegna i file al browser | Non conserva dati: quelli stanno su Supabase |
| **Supabase** (`pyjymnpnxatqwfhguaus`) | **Memoria** (tutte le tabelle), **autenticazione** (chi entra, con che ruolo) ed **Edge Function** (`invio-report-mensile`, `super-action`, chiamate da pg_cron) | Non serve l'interfaccia |

Flusso di una modifica: `file scritti nella cartella → pusha.bat → GitHub → Vercel compila e pubblica → il browser ci arriva grazie al DNS di Aruba → i dati arrivano da Supabase`.

Conseguenze pratiche: spegnendo Vercel l'app sparisce ma i dati restano; spegnendo Supabase l'app si apre e non sa più niente; spegnendo Aruba si perde l'indirizzo, non il contenuto.

**Anomalia DNS nota, non un guasto**: il dominio senza `www` ha **due record A** — `76.76.21.21` (Vercel) e `62.149.128.40` (Aruba). Il `www` invece è un CNAME pulito verso `vercel-dns-017.com`, quindi solo Vercel. Non ha mai dato problemi in cento versioni, quindi il record Aruba è verosimilmente un redirect che rimanda al posto giusto. Per togliere l'ambiguità basterebbe cancellare quel record A nel pannello Aruba. Nel dubbio, `www.podereverdeapp.it` parla di sicuro con Vercel.

## 1. Architettura

- **App**: React 19 (Create React App, `react-scripts` 5.0.1) — non Next.js/Vite
- **Database**: Supabase (`pyjymnpnxatqwfhguaus`) — **stesso identico progetto Supabase** usato dalla Contabilità Industriale (`podereverde-contabilita-industriale`). Non c'è sincronizzazione: sono due app separate sullo stesso database condiviso.
- **Client Supabase**: `src/supabase.js`
- **Librerie**: `xlsx` + `xlsx-js-style` (export Excel con formattazione)
- **Autenticazione**: `Auth.jsx` — richiede login (utenti autenticati), a differenza della Contabilità Industriale che si connette come `anon` senza login
  - **Nota tecnica importante**: le tabelle `animali`, `lotti_suini`, `suini_lotto` avevano RLS che permetteva la SELECT solo ad utenti autenticati. È stata aggiunta una policy aggiuntiva `FOR SELECT TO anon USING (true)` (per permettere alla Contabilità Industriale, che si connette senza login, di leggerle) — non tocca in alcun modo l'autenticazione o le policy di scrittura di questa app.

## 2. Struttura dell'app — 12 tab principali (`App.js`)

Gestione 🐄 · Pedigree 🧬 · Lotti 🐷 · Selezione 🏆 · Costi 📊 · Origine 🧾 · Uscite 📤 · Struttura 🏭 · UBA 🐾 · Esporta 📥 · Email 📮 · Guida 📖

File principali in `src/`:
- `allevamento_app.jsx` (il più grande, ~165.000 caratteri) — contiene `Anagrafica` (gestione/scheda animali, il cuore dell'app), `Dashboard`, `Sanitario`, `Alimentazione`, `Magazzino`, `Report`
- `ExportManager.jsx` — motore di export (Excel), include il motore UBA reale e il calcolo "Costo netto residuo"
- `UBAReport.jsx` — report UBA a schermo (probabilmente la tab "UBA")
- `lotti_suini.jsx` — gestione lotti suini (nascite non individualizzate, assegnazione BDN)
- `pedigree.jsx` — genealogia
- `selezione_genetica.jsx` — tab Selezione
- `registro_uscite.jsx` — tab Uscite
- `costi_allevamento.jsx`, `costi_complessivi.jsx`, `costi_generali.jsx`, `costo_origine.jsx` — varie viste costo (pre-esistenti, indipendenti dalla Contabilità Industriale)
- `destinatari.jsx` — probabilmente la tab Email

## 3. Anagrafica animali — struttura dati chiave

Tabella `animali` — campi principali (dal `SELECT` in `ExportManager.jsx`): `id,bdn,nome,specie,sesso,nascita,stato,data_uscita,motivo_uscita,causa_morte,data_ingresso,razza,razza_calcolata,categoria,peso_nascita,peso_attuale,provenienza,origine,fornitore,data_fattura,numero_fattura,prezzo_acquisto,lotto_box,destinazione,resa_percent,peso_carcassa,peso_vivo_uscita,note_sanitarie,note,riproduttore,data_registrazione_bdn,padre_id,madre_id,costo_iniziale,tipo_costo_iniziale,costi_mantenimento_cumulati,quota_scaricata_figli,valore_v_riforma,categoria_contabile`

**Campi scritti dalla Contabilità Industriale (in prospettiva, non ancora collegati salvo il tab Costi)**: `costi_mantenimento_cumulati`, `quota_scaricata_figli` — letti da `ExportManager.jsx` nel calcolo "Costo netto residuo" (riga 888-890): `costoNetto = Math.max(0, costoIniz + mantCum - quotaFig - vRiforma)`.

**Scheda animale (dentro `Anagrafica`)**: apertura tramite lo stato `dettaglio` (oggetto animale o null), con tab interne gestite da `tabDettaglio`: `info` · `genealogia` · `eventi` · **`costi`** (aggiunta v94, vedi sezione 5).

## 4. Lotti suini — struttura dati chiave

- `lotti_suini` — un parto/nascita di gruppo (non ogni suinetto ha subito un BDN individuale)
- `suini_lotto` — le singole unità dentro un lotto, identificate da `nr` (numero progressivo), con `codice_completo` o `matricola`, `stato` (`attivo` di norma, o `registrato_individuale` quando gli viene assegnato un BDN proprio)
- **Assegnazione BDN**: pulsante/form (`FormAssegnaBDN`, citato nelle sessioni precedenti) che trasforma un'unità di lotto in un animale individuale con BDN proprio — crea un nuovo record in `animali` e marca l'unità di lotto come `stato:"registrato_individuale"`.
  - **Requisito registrato ma NON ancora implementato**: quando questo passaggio avviene, i costi già maturati dalla Contabilità Industriale mentre l'unità era ancora nel lotto (righe in `ci_costo_animale_annuale` con `lotto_id`+`unita_nr`) devono traghettare sul nuovo `animale_id` — oggi ripartirebbero da zero. Da costruire lato Contabilità Industriale quando si arriva a quel punto.

## 5. Collegamento con la Contabilità Industriale (in corso)

**Peso all'ingresso — nuovo campo `peso_ingresso` su `animali`**: aggiunto per registrare il peso rilevato all'ingresso in azienda — utile soprattutto per gli animali acquistati (di cui non si conosce il vero peso di nascita), ma è un secondo punto di crescita reale utile per qualunque animale. Campo nel form (`allevamento_app.jsx`, vicino a Peso nascita/Peso attuale) e mostrato nella scheda (tab Info).

**Bug di dati reale trovato e corretto**: 8 bovini acquistati avevano il loro peso all'ingresso (275-500 kg) registrato per errore nel campo "peso di nascita" — impossibile per un vitello. Corretti manualmente (spostato il valore nel nuovo campo `peso_ingresso`, azzerato `peso_nascita` per quei record) dopo verifica su un export reale caricato da Filippo.

**Giorni di vita — aggiunto solo all'esportazione Excel** (non a schermo, per scelta di Filippo): nuova colonna "Giorni di vita" (nascita→uscita) nell'export principale animali di `ExportManager.jsx`, subito dopo "Data uscita" — prima andava calcolato a mano in Excel ogni volta.

**Perché serve tutto questo**: la Contabilità Industriale (Performance per Fascia d'Età) usa sia il peso di nascita sia — quando disponibile — il peso all'ingresso come punti reali per una regressione che stima crescita/IPG per fascia d'età; più punti reali per animale (non solo nascita+uscita) rendono la stima più solida, specialmente per gli acquistati.

**Storico Pesate — COSTRUITO** (`pesate_storico`, nuova tabella condivisa — **eccezione consapevole**: qui, a differenza dei costi, è podereverdeapp.it a scrivere, non solo a leggere, dato che è qui che si pesano gli animali). Sostituisce concettualmente il vecchio campo singolo `peso_attuale` (che si sovrascriveva) con una riga per ogni pesata nel tempo — tipo di rilevazione (nascita/ingresso/vita/uscita_vivo/uscita_carcassa), con un flag `stimato` per distinguere un peso reale da uno standard di specie usato quando la nascita reale è sconosciuta (animali acquistati). Nuova tab "⚖️ Pesate" nella scheda animale (`allevamento_app.jsx`), con form di registrazione ed elenco storico eliminabile riga per riga.

**Perché**: prepara i dati per un futuro report nella Contabilità Industriale che stimerà, per fascia d'età, il peso medio/IPG/costo per kg — usando una **regressione lineare** sui punti data/peso di tutti gli animali (decisione presa con Filippo: la regressione, a differenza di medie semplici o ponderate, sfrutta naturalmente sempre più punti man mano che si accumulano pesate nel tempo, senza dover cambiare formula). Tabella di supporto `pesi_standard_specie` (45kg bovino, 0,5kg suino, 2kg ovino) per quando il peso di nascita reale non è noto.

**Ancora da fare**: lo stesso meccanismo di pesata per le unità di lotto suini (oggi la tab Pesate esiste solo per animali con BDN individuale); il report di analisi vero e proprio in Contabilità Industriale (regressione per fascia d'età, calcolo IPG/costo al kg/FCR) — bozze Excel dimostrative create (`Bozza_Costo_Mangime_Cumulato_Vitello.xlsx`, `Bozza_Performance_Fascia_Eta.xlsx`) ma non ancora integrate nel programma.

**Perché questa app è la fonte di verità sui dati grezzi**: qui gli operatori dentro l'allevamento registrano quello che succede realmente — nascite, ingressi, uscite, vaccinazioni, nati morti, ecc. La Contabilità Industriale (gestita dai contabili) non ha altro modo di sapere cosa succede in azienda se non attraverso quello che è già stato registrato qui. Quadro completo dei flussi:

1. **Questa app → Contabilità Industriale** (lettura): dati grezzi per il calcolo UBA-gg (nascita, uscita, stato) — nessuna tabella con UBA-gg pre-calcolato, la Contabilità Industriale lo ricalcola da sola con la stessa formula di `ExportManager.jsx`
2. **Contabilità Industriale → questa app** (scrittura, senso unico): `ci_costo_animale_annuale`, letta nella tab "💰 Costi"
3. **Bidirezionale**: costo di acquisto (`prezzo_acquisto`), stesso campo condiviso
4. **Questa app → Contabilità Industriale** (eccezione consapevole): traghettamento costi lotto→BDN dentro `FormAssegnaBDN`

**Traghettamento costi lotto→BDN — COSTRUITO in `FormAssegnaBDN`** (`lotti_suini.jsx`): al momento della conferma di assegnazione BDN (dopo aver creato la scheda animale e aggiornato l'unità di lotto), un terzo passaggio cerca le righe già calcolate in `ci_costo_animale_annuale` (chiave `lotto_id`+`unita_nr`) e le ricollega al nuovo `animale_id` — fondendo con eventuali righe già esistenti per lo stesso anno invece di sovrascrivere. **Eccezione consapevole al principio "solo la Contabilità Industriale scrive in quella tabella"**: qui si spostano righe già calcolate altrove, non se ne calcolano di nuove — Filippo ha confermato che va bene così, dato che il pulsante BDN è il punto naturale per farlo (si conosce già la corrispondenza esatta lotto+unità→animale in quel preciso momento). Resta anche un pulsante di recupero manuale in Contabilità Industriale (Scheda Animale, "🔄 Traghetta costi lotto→BDN") per i passaggi avvenuti PRIMA di questa modifica.

**Costo di acquisto mancante — alert rosso (v96)**: quando `provenienza==="Acquistato"` e `prezzo_acquisto` è vuoto, compare un badge "⚠️ Manca costo acquisto" nella card della lista Anagrafica, e un banner rosso prominente in cima alla tab Info della scheda dettaglio. Stesso alert (elenco) anche in Report Acquisto Animali della Contabilità Industriale — è lo stesso campo condiviso (`animali.prezzo_acquisto`), scrivibile da entrambi i programmi: una volta inserito da uno dei due, l'alert sparisce su entrambi.

**Flusso a senso unico**: la Contabilità Industriale (progetto separato, stesso Supabase) calcola e scrive `ci_costo_animale_annuale`; questa app **legge soltanto**, non scrive mai in quella tabella.

**Fatto (v94)**: nuova tab "💰 Costi" nella scheda animale (`Anagrafica`, dentro `allevamento_app.jsx`) — al click su un animale, un `useEffect` interroga `ci_costo_animale_annuale` filtrando per `animale_id` e mostra: tabella anno per anno (UBA-giorni, categoria contabile, costo mantenimento, costo nascita ereditato, quota scaricata sui figli, totale anno) + totale cumulato in fondo. Stati aggiunti: `costiAnimale`, `caricandoCosti`.

**Verificato nel codice prima di costruire**: "Costo netto residuo" esisteva PRIMA solo come colonna nell'export Excel (`ExportManager.jsx` riga 852, `UBAReport.jsx` riga 202) — nessuna vista a schermo lo mostrava. Ora c'è, nella tab Costi.

**Da fare**: stessa vista per le unità di lotto suini (oggi la tab Costi cerca solo per `animale_id`, non gestisce `lotto_id`+`unita_nr` — serve capire dove si apre il "dettaglio" di un'unità di lotto in `lotti_suini.jsx`, probabilmente un meccanismo simile a `dettaglio`/`tabDettaglio` di Anagrafica ma non ancora esplorato).

## 6. Motore UBA reale (`ExportManager.jsx`) — riferimento autorevole

Questo è il motore che la Contabilità Industriale ha **copiato identico** (in `motoreUba.js`) per calcolare Report UBA/Report Costi. Se il motore qui cambia, va aggiornato anche lì (o viceversa, valutare se unificarli in futuro invece di mantenerne due copie).

- `UBA_FASCE_EXP`: bovino 0.40/0.70/1.00 a 210/730/∞ giorni; suino 0.027/0.30/0.50 a 90/365/∞ giorni; ovino 0.027/0.10/0.15 a 120/365/∞ giorni
- `categoriaContabileExp(animale)`: PRODUTTIVO se attivo o uscito con motivo che contiene macellazione/macellato/venduto/riformato/riforma/vendita (sottostringa); RIPRODUTTORE se inoltre `riproduttore:true`; altrimenti IMPRODUTTIVO_USCITO (include "Altro", "Morto", "Predato", ecc.)
- `periodoNellAnnoExp`, `calcolaUBAMedioExp` — calcolo giorni di presenza e UBA medio ponderato tra fasce d'età

**Formula costo/UBA-giorno QUI (diversa da quella scelta per la Contabilità Industriale)**: formula SEMPLICE `(C(t)-V(t))/F(t)` con F(t) = tutti gli UBA-giorni, inclusi gli improduttivi. La Contabilità Industriale usa invece una formula "aggressiva" (esclude gli improduttivi dal divisore) per scelta esplicita di Filippo — le due app calcolano il tasso in modo diverso, di proposito.

## 7. Tabella `prezzi_riforma`

Usata per stimare il valore di realizzo degli animali. Campi noti: `specie`, `razza`, `prezzo_kg_vivo`, `resa_percentuale`, e **`prezzo_kg_carcassa`** (aggiunto su richiesta della Contabilità Industriale — prima esisteva solo `prezzo_kg_vivo`+`resa_percentuale`, insufficiente perché derivare il prezzo carcassa da quello vivo tramite la resa dava un valore matematicamente equivalente, non una stima indipendente).

## 8. Riproduttore automatico per i maschi — CORRETTO (v102, 07/09/2026)

**Il bug**: in `allevamento_app.jsx`, dentro la registrazione parto, ogni maschio nato veniva marcato automaticamente riproduttore solo in base al sesso:
```js
riproduttore: nato.sesso==="M"?true:false,   // ← era così
```

**La correzione (v102)** — tre modifiche, tutte in `allevamento_app.jsx`:

1. **Nascita**: `riproduttore:false` per tutti i nati. Un maschio diventa riproduttore SOLO tramite l'attivazione esplicita del toggle "♂ Riproduttore" già presente nel form della scheda animale (il pulsante esisteva già: `form.riproduttore` con toggle visibile per M e F, verificato nel codice prima di intervenire — non è stato necessario costruirlo).
2. **Data di qualifica**: il campo `animali.data_qualifica_riproduttore` (di tipo `date`, già esistente a DB) veniva **letto** dalla timeline della scheda animale ma non era **mai scritto** da nessuna parte — la voce "♂♀ Qualifica riproduttore" quindi non compariva mai. Ora viene scritto nel `salva()` dell'Anagrafica: alla prima attivazione del flag prende la data odierna, se il flag viene tolto torna `null`, e se una data c'è già non viene sovrascritta.
3. **Madre al primo parto**: la marcatura automatica della madre (comportamento voluto, invariato) ora registra anche `data_qualifica_riproduttore` = data del parto.

**Le femmine restano come prima**: diventano riproduttrici automaticamente al primo parto registrato — comportamento voluto, non toccare.

**Dati storici da verificare a mano**: alla data della correzione risultavano 9 maschi marcati `riproduttore:true` senza alcun figlio registrato. Di questi, 6 sono `Acquistato`/`Esterno` — il bug NON li tocca (sono nati fuori azienda, il flag è stato messo a mano, quindi è verosimilmente corretto). I soli **3 sospetti reali** sono i `Nato in azienda`, gli unici passati dal codice buggato:

| id | BDN | specie | stato | nascita |
|---|---|---|---|---|
| 342 | IT058990390828 | bovino | macellato | 10/04/2020 |
| 110 | IT058990412079 | bovino | attivo | 20/05/2023 |
| 443 | MACULATO01 | suino | attivo | 15/10/2023 |

Da verificare uno per uno in Anagrafica e, dove è il caso, disattivare il toggle. Attenzione: un giovane maschio destinato alla monta che non ha ancora avuto figli è legittimamente riproduttore — l'assenza di figli da sola non è prova del bug.

## 8-bis. RLS orfane — CORRETTO (v103, 07/09/2026)

Controllando il database prima di costruire la Coltivazione sono emerse **cinque tabelle con RLS attiva e ZERO policy**: `pesate_storico`, `pesi_standard_specie`, `prezzi_riforma`, `nati_parto`, `costi_animale_annuali`. RLS senza policy **nega tutto senza dare errore**: la tabella risulta semplicemente vuota, e l'app non se ne accorge.

Conseguenze reali in produzione:

- **La tab Pesate (v99) non ha mai funzionato**: non leggeva né scriveva nulla. `pesate_storico` ha infatti 0 righe. Tutto il lavoro fatto per preparare la regressione peso/età della Contabilità Industriale non stava raccogliendo dati.
- **`prezzi_riforma` era invisibile** a `ExportManager.jsx` e `UBAReport.jsx`: la tabella ha 23 righe, ma l'app ne leggeva 0. Il "Costo netto residuo" calcolava quindi con `valore_v_riforma` mancante.

Verificato eseguendo le query con `set local role authenticated`: prima della correzione `prezzi_riforma` restituiva 0 righe su 23, dopo ne restituisce 23.

Applicate le policy della convenzione del progetto (lettura/inserimento/modifica autenticati, cancellazione solo admin), più lettura `anon` su `pesate_storico` e `pesi_standard_specie` per la Contabilità Industriale.

**Lezione da tenere presente**: creare una tabella con `enable row level security` e dimenticare le policy produce un guasto silenzioso. Vale la pena, dopo ogni nuova tabella, verificare con `set local role authenticated; select count(*) ...`.

## 8-ter. Sezione Coltivazione — COSTRUITA (v103, 07/09/2026)

Nuovo modulo `src/coltivazione.jsx`, tab "🌾 Campi" (inserita dopo Lotti). 7 tabelle nuove: `campi`, `colture_campo`, `semine`, `lavorazioni_campo`, `concimazioni`, `diserbi`, `raccolte`. 16 campi caricati (84,43 ha) con foto aeree in `public/campi/`.

**La specifica completa, con le motivazioni delle scelte di struttura, sta in `SPEC_COLTIVAZIONE.md`** — leggerla prima di metterci mano.

In sintesi, tre punti dove la struttura si discosta dal foglio Excel di partenza: le lavorazioni sono esecuzioni ripetibili (la medica si sfalcia 3-4 volte l'anno); la raccolta registra un prodotto e non una coltura (la paglia esce dagli ettari del grano); le poliennali non richiedono la semina ogni campagna.

Il ponte con Magazzino e Contabilità Industriale (foraggio autoprodotto → costo per capo) **non è stato costruito**: è la fase 2, vedi SPEC sezione 5.

## 8-quater. v104 (07/09/2026)

- Tab rinominata da "Campi" a **"Coltivazione"**.
- Tab **"Struttura"** (macchinari e costi generali) **tolta dalla barra** su richiesta di Filippo, per fare spazio. Il modulo `costi_generali.jsx`, le tabelle `macchinari` e `costi_generali` e i loro dati **non sono stati toccati**: in `App.js` la voce di TABS, l'import e la riga di render sono commentati con marcatore `v104`, quindi per riattivarla basta togliere i commenti.
- **Numero di versione visibile nel menu utente** (`VERSIONE` in `App.js`, riga "Versione: v104" sotto il ruolo). Serve a distinguere in un secondo un deploy non arrivato da una cache del browser: si apre il menu e si legge il numero. **Da aggiornare a ogni versione.**

## 9. Note per chi riprende questo progetto da zero

- Ambiente di lavoro: la cartella sorgente (`allevamento`) potrebbe non essere presente in una sandbox nuova — chiedere a Filippo l'ultimo pacchetto `allevamento_vNN.tar.gz`, o verificare `/mnt/user-data/outputs/` prima di chiedere
- Prima di ogni modifica: `cd allevamento && npm install && npm run build` per verificare che l'app compili, poi ripacchettare con `tar -czf allevamento_vNN.tar.gz --exclude=.git .`
- **Attenzione**: `CI=true npm run build` **fallisce**, e non per colpa di chi ha appena modificato. `CI=true` trasforma i warning in errori, e ci sono decine di `no-unused-vars` preesistenti in `allevamento_app.jsx`, `lotti_suini.jsx`, `pedigree.jsx`, `selezione_genetica.jsx`, `UBAReport.jsx` e `App.js`. Usare `npm run build` semplice e controllare che i warning nuovi siano zero — quelli vecchi restano finché non si fa una pulizia dedicata.
- Le versioni sono numerate progressivamente (v66...v94 al momento di scrivere) — usare il numero successivo per ogni nuovo pacchetto, mai sovrascrivere
- Repo GitHub e deploy Vercel separati da quelli della Contabilità Industriale, ma stesso account/proprietario (Filippo) per entrambi i progetti — l'accesso condiviso è a livello di **database** (stesso Supabase), non di codice sorgente: ogni sessione di chat vede solo i file che vengono caricati o che restano nell'ambiente di lavoro di quella sessione specifica.
