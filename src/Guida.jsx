import { useState } from "react";
import { t } from "./i18n";   // v119 — guida in tre lingue

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", muted:"#8B7355", border:"#D4C4A8", text:"#2D1B0E",
  blue:"#2C6E9B", red:"#C0392B", yellow:"#D4A017", suini:"#B5547A",
};

const SEZIONI = [
  {
    id:"accesso", icon:"🔐", titolo:"Accesso e installazione",
    contenuto:[
      {tipo:"h3",testo:"Primo accesso"},
      {tipo:"steps",passi:[
        "Apri Chrome o Safari sul telefono o PC",
        "Vai su www.podereverdeapp.it",
        "Tocca 'Registrati' → inserisci nome, email, password → 'Crea account'",
        "Accedi subito — nessuna conferma email necessaria",
      ]},
      {tipo:"h3",testo:"Installa sul telefono (accesso rapido senza browser)"},
      {tipo:"bullets",voci:[
        "Android — Chrome: menu ⋮ → 'Aggiungi a schermata Home'",
        "iPhone — Safari: icona 📤 → 'Aggiungi a schermata Home'",
      ]},
      {tipo:"nota",testo:"Tutti i dati vengono salvati automaticamente nel database condiviso. Ogni operatore vede gli stessi dati in tempo reale da qualsiasi dispositivo. ⚠️ Usa sempre il browser in modalità normale (non in incognito) per restare connesso."},
      {tipo:"h3",testo:"🌐 Lingua dell'app"},
      {tipo:"p",testo:"Nella pagina di accesso e nel menu utente (il tuo nome in alto a destra) ci sono le bandiere: italiano, inglese e punjabi. Tocca la bandiera: tutta l'app, guida compresa, passa a quella lingua. La scelta resta salvata nel tuo profilo e vale su ogni dispositivo. I dati registrati (nomi, note, descrizioni) restano come sono stati scritti."},
      {tipo:"h3",testo:"🔢 Numero di versione dell'app"},
      {tipo:"p",testo:"Toccando il proprio nome in alto a destra, sotto il ruolo compare la versione dell'app (per esempio v126). Serve a capire subito se un aggiornamento è arrivato davvero o se il browser mostra una copia vecchia: in quel caso basta ricaricare la pagina con Ctrl+F5 (sul telefono: chiudere e riaprire l'app)."},
    ]
  },
  {
    id:"navigazione", icon:"🗺️", titolo:"Navigazione — tutti i moduli",
    contenuto:[
      {tipo:"p",testo:"In basso ci sono i pulsanti per le sezioni principali. Scorri la barra per vederli tutti."},
      {tipo:"tabella",righe:[
        ["🐄 Gestione","Anagrafica animali, sanitario, alimentazione, magazzino, report, riproduttori"],
        ["🧬 Pedigree","Albero genealogico, consanguineità, prevenzione accoppiamenti a rischio"],
        ["🐷 Lotti","Lotti suini (nati e acquistati) con tatuaggio automatico"],
        ["🌾 Coltivazione","I campi aziendali: colture, semine, lavorazioni, raccolta, programma, costi, report e storico"],
        ["⛽ Gasolio","Registro dei prelievi di gasolio dalle cisterne: mezzo, operatore, litri, motivo e contalitri"],
        ["🏆 Selezione","Ranking genetico: IIP, produttività, età primo parto, resa media figli"],
        ["📤 Uscite","Macellazioni, vendite, morti — con resa % e IPG"],
        ["📄 Modelli 4","Archivio dei modelli 4 con i PDF originali, abbinamento alle uscite degli animali"],
        ["🐾 UBA","Calcolo UBA medio per fascia di età con ripartizione presenza effettiva"],
        ["📥 Esporta","Export Excel granulare — anagrafica, uscite, UBA, consanguineità"],
        ["📮 Email","Destinatari e invio automatico mensile di report e backup"],
        ["📖 Guida","Questo manuale"],
      ]},
      {tipo:"nota",testo:"Le vecchie tab 📊 Costi, 🧾 Origine e 🏭 Struttura non sono più nella barra: i costi per animale si consultano ora direttamente nella scheda dell'animale (tab 💰 Costi), e il grosso dell'analisi economica è passato al programma di Contabilità Industriale. I dati non sono stati cancellati."},
      {tipo:"h3",testo:"📤 Filtro Attivi / Usciti in tutte le sezioni"},
      {tipo:"p",testo:"Anagrafica, Pedigree e Selezione Genetica hanno un doppio filtro: specie + stato (Attivi / Usciti / Tutti). Default: solo Attivi. Nell'Export gli animali attivi e usciti sono in fogli separati."},
    ]
  },
  {
    id:"animali", icon:"🐄", titolo:"Scheda animale — cercare, consultare, modificare",
    contenuto:[
      {tipo:"h3",testo:"Trovare un animale"},
      {tipo:"bullets",voci:[
        "Vai in 🐄 Gestione → tab 🏷️ Animali",
        "Usa la barra di ricerca: digita BDN completo, ultime 4 cifre del codice, nome o razza",
        "Usa i filtri specie (bovino / suino / ovino) e 'Solo attivi'",
      ]},
      {tipo:"h3",testo:"Aprire la scheda"},
      {tipo:"p",testo:"Tocca il pulsante colorato '📋 Apri scheda completa' su ogni card. La scheda ha 5 tab:"},
      {tipo:"tabella",righe:[
        ["📋 Info","BDN, razza, sesso, nascita, pesi, provenienza, azienda origine, prezzo acquisto, costo nascita, stato, vaccinazioni ricevute"],
        ["🧬 Genealogia","Padre, madre, discendenti diretti — cliccabili"],
        ["📅 Eventi","Timeline di tutto: nascita, ingresso, parti, eventi sanitari, uscita"],
        ["💰 Costi","Costi anno per anno calcolati dalla Contabilità Industriale — sola lettura"],
        ["⚖️ Pesate","Storico di tutte le pesate dell'animale nel tempo"],
      ]},
      {tipo:"h3",testo:"Modificare i dati"},
      {tipo:"p",testo:"Dalla scheda tocca ✏️ in alto a destra → modifica quello che vuoi → Salva."},
      {tipo:"h3",testo:"Registrare un nuovo animale"},
      {tipo:"steps",passi:[
        "Tocca '+ Aggiungi' in cima alla lista",
        "Seleziona SPECIE — i campi cambiano per bovino / suino / ovino",
        "Inserisci BDN / Matricola, nome (facoltativo), razza, categoria, sesso, data nascita",
        "Per acquistati: provenienza 'Acquistato' → compilare prezzo acquisto e azienda di origine",
        "Per maschi destinati alla riproduzione: attiva il toggle '♂ Riproduttore'",
        "Collega padre e madre dalla lista per la genealogia",
        "La razza del figlio viene calcolata: stessa razza → pura; razze diverse → METICCIA",
        "Tocca Salva",
      ]},
      {tipo:"h3",testo:"⚠️ Avviso costo di acquisto mancante"},
      {tipo:"p",testo:"Quando un animale acquistato non ha il prezzo di acquisto, compare un badge rosso in Anagrafica e un avviso nella sua scheda. Lo stesso avviso compare nella Contabilità Industriale, perché il campo è lo stesso: si compila da una parte e sparisce da entrambe."},
      {tipo:"h3",testo:"📏 Peso all'ingresso"},
      {tipo:"p",testo:"Accanto a peso alla nascita e peso attuale c'è il campo peso all'ingresso: quanto pesava l'animale quando è entrato in azienda. Serve soprattutto per gli acquistati, di cui non si conosce il vero peso alla nascita."},
      {tipo:"h3",testo:"📅 Timeline degli eventi"},
      {tipo:"p",testo:"Nella scheda di ogni animale, il tab 📅 Eventi mostra ora una timeline cronologica che unisce nascita, ingresso, qualifica riproduttore, parti, eventi sanitari e uscita, con separatori per anno e statistiche riassuntive in cima."},
      {tipo:"h3",testo:"🧬 Genitori esterni (non registrati in azienda)"},
      {tipo:"p",testo:"Nel form animale e nel form parto, accanto al menu genitori aziendali, ora c'è un campo per inserire la matricola di un padre esterno (non registrato in azienda). Al salvataggio l'app crea automaticamente una scheda minima per quel padre esterno, con la razza scelta. Comparirà nel Pedigree e sarà disponibile per parti futuri."},
      {tipo:"h3",testo:"🏷️ Data di registrazione BDN"},
      {tipo:"p",testo:"Ora ogni animale ha due date: data di nascita e data registrazione BDN (attribuzione ufficiale matricola). Compare nella scheda e nell'export."},
    ]
  },
  {
    id:"riproduttori", icon:"♂", titolo:"Registro riproduttori",
    contenuto:[
      {tipo:"h3",testo:"Registrare un maschio come riproduttore"},
      {tipo:"steps",passi:[
        "Cerca il maschio nella lista Animali",
        "Apri la scheda → ✏️ Modifica",
        "Attiva il toggle '♂ Riproduttore' (compare solo per i maschi)",
        "Salva",
      ]},
      {tipo:"h3",testo:"Consultare il registro riproduttori"},
      {tipo:"p",testo:"In cima alla lista Animali tocca '♂ Riproduttori'. Vedi tutti i maschi registrati divisi per specie con nome, razza, età e numero di figli già registrati. Tocca una card per aprire la scheda."},
      {tipo:"nota",testo:"Nel form parto, il campo 'Padre' mostra SOLO i maschi registrati come riproduttori della stessa specie. Se non ne hai ancora, mostra tutti i maschi come alternativa."},
      {tipo:"h3",testo:"⚠️ Cambiato: i maschi NON nascono più riproduttori"},
      {tipo:"p",testo:"Fino all'estate 2026 ogni maschio veniva marcato riproduttore automaticamente alla nascita, solo perché maschio. Era sbagliato e gonfiava il registro. Da settembre 2026 un maschio nasce NON riproduttore: lo diventa solo quando qualcuno attiva a mano il toggle '♂ Riproduttore' nella sua scheda."},
      {tipo:"bullets",voci:[
        "Le femmine restano invece automatiche: diventano riproduttrici al primo parto registrato",
        "Dalla data in cui attivi il toggle, l'app registra anche la data di qualifica, che compare nella timeline del tab 📅 Eventi",
        "Se un vecchio maschio risulta riproduttore per sbaglio, apri la scheda, Modifica, e spegni il toggle",
      ]},
      {tipo:"h3",testo:"♀ Riproduttrici — qualifica automatica"},
      {tipo:"bullets",voci:[
        "Il toggle riproduttore/riproduttrice è ora disponibile anche per le femmine",
        "Alla registrazione di un parto, la madre viene marcata automaticamente come riproduttrice",
        "Il Registro Riproduttori mostra sia maschi (♂) sia femmine (♀)",
      ]},
    ]
  },
  {
    id:"parto_bovini_ovini", icon:"🐣", titolo:"Registrare un parto (bovini e ovini)",
    contenuto:[
      {tipo:"h3",testo:"Nuovo parto (crea schede figli)"},
      {tipo:"steps",passi:[
        "Apri la scheda della MADRE",
        "Tab '📅 Eventi' → '🐣 Nuovo parto'",
        "Inserisci data, tipo parto, N° nati TOTALI e N° nati morti",
        "I nati vivi sono calcolati automaticamente (totali − morti)",
        "Seleziona il padre dalla lista riproduttori",
        "Per ogni nato vivo: BDN, sesso, peso nascita",
        "Tocca 'Registra parto'",
      ]},
      {tipo:"nota",testo:"Le schede dei nati vengono create AUTOMATICAMENTE con razza calcolata, madre, padre, data nascita e provenienza 'Nato in azienda'."},
      {tipo:"h3",testo:"Parto storico (solo statistiche)"},
      {tipo:"bullets",voci:[
        "Tocca '📅 Parto storico'",
        "Inserisci: data, nati totali, nati morti",
        "Nessun BDN richiesto — utile per parti già avvenuti con figli non in azienda",
        "Alimenta automaticamente la Selezione Genetica per il calcolo IIP",
      ]},
      {tipo:"h3",testo:"Modificare o eliminare un parto"},
      {tipo:"p",testo:"Nel tab 📅 Eventi: ogni parto mostra ✏️ (modifica dati) e 🗑️ (elimina evento). La modifica aggiorna solo i dati statistici — le schede dei figli già creati non vengono toccate."},
      {tipo:"h3",testo:"👥 Parti gemellari"},
      {tipo:"p",testo:"Registrando un parto con più nati vivi, l'app apre un blocco per ogni gemello con matricola, sesso e peso individuali."},
      {tipo:"h3",testo:"🧬 Genitori esterni (non registrati in azienda)"},
      {tipo:"p",testo:"Nel form animale e nel form parto, accanto al menu genitori aziendali, ora c'è un campo per inserire la matricola di un padre esterno (non registrato in azienda). Al salvataggio l'app crea automaticamente una scheda minima per quel padre esterno, con la razza scelta. Comparirà nel Pedigree e sarà disponibile per parti futuri."},
    ]
  },
  {
    id:"parto_suini", icon:"🐷", titolo:"Lotti suini — perché, codice, tatuaggio, uscite e passaggio alla matricola",
    contenuto:[
      {tipo:"h3",testo:"Perché esiste la sezione Lotti"},
      {tipo:"p",testo:"I suini da ingrasso nascono e crescono in gruppi: tutti i suinetti di un parto, o tutti quelli comprati insieme. Dare a ognuno una scheda completa con matricola individuale sarebbe lungo e inutile, e la legge non lo chiede: per i suini da ingrasso basta il tatuaggio del lotto. Per questo l'app gestisce i suini in due modi:"},
      {tipo:"tabella",righe:[
        ["Scheda individuale con matricola (🐄 Gestione → Animali, specie suino)","Riproduttori (verri e scrofe) e razze pregiate: Cinta Senese, Nero Apulo-Calabrese, Mora Romagnola, Nero Casertano"],
        ["Lotto con tatuaggio (🐷 Lotti)","Tutti gli altri suini: i suinetti nati in azienda e quelli acquistati per l'ingrasso"],
      ]},
      {tipo:"nota",testo:"⚠️ Se in Gestione → Animali non trovi tutti i maiali, è normale: la maggior parte dei suini sta nei Lotti, non nell'elenco degli animali. Per sapere quanti suini ci sono davvero bisogna guardare tutte e due le sezioni."},
      {tipo:"h3",testo:"Il codice del lotto: si compone da solo"},
      {tipo:"p",testo:"Il codice non va inventato né scritto a mano. Quando registri il parto inserendo la data di nascita, la madre e il padre, l'app compone da sola il codice del lotto e lo mostra subito. Il codice si legge a coppie, di due cifre o di due lettere, e ogni coppia ha un significato preciso:"},
      {tipo:"tabella",righe:[
        ["1ª coppia — anno","ultime 2 cifre dell'anno di nascita: 2023 → 23"],
        ["2ª coppia — mese","mese di nascita, sempre con 2 cifre: aprile → 04"],
        ["3ª coppia — razze","1ª lettera razza della madre, 2ª lettera razza del padre: Cinta Senese × Cinta Senese → CC"],
        ["4ª coppia — madre","ultime 2 cifre della matricola della madre: 392019 → 19"],
        ["5ª coppia — suinetto","numero progressivo assegnato dall'app: 01, 02, 03…"],
      ]},
      {tipo:"nota",testo:"Esempio: 23 04 CC 19 → lotto 2304CC19; i suinetti sono 2304CC1901, 2304CC1902, 2304CC1903… Altri esempi: madre Large White matricola …47, padre Duroc, parto di novembre 2025 → 2511LD47; madre meticcia matricola …03, padre Cinta Senese, parto di gennaio 2026 → 2601MC03. Leggendo il tatuaggio si capisce subito, anche senza l'app, quando è nato il maiale, la razza dei genitori e chi è la madre."},
      {tipo:"h3",testo:"Le lettere delle razze (3ª coppia)"},
      {tipo:"tabella",righe:[
        ["A","Nero Apulo-Calabrese"],
        ["C","Cinta Senese"],
        ["D","Duroc"],
        ["G","Mora Romagnola"],
        ["L","Large White"],
        ["M","Meticcio"],
        ["N","Nero Casertano"],
        ["R","Landrace"],
        ["0","Altra razza o razza non indicata"],
      ]},
      {tipo:"p",testo:"Perché il codice sia giusto, madre e padre nell'app devono avere la razza e la madre la matricola compilate: se manca la razza la lettera diventa «0», se manca la matricola della madre l'ultima coppia diventa «00»."},
      {tipo:"h3",testo:"🔴 Tatuare SEMPRE i suinetti con il codice del lotto"},
      {tipo:"p",testo:"Il tatuaggio è l'unico legame tra il maiale in stalla e i suoi dati nell'app: madre, padre, data di nascita, peso alla nascita, costi e resa al macello. Un suinetto senza tatuaggio, o con un tatuaggio sbagliato, perde tutta la sua storia: non sapremo più quale scrofa ha fatto i figli migliori, quanto è costato allevarlo e quanto ha reso. Sono dati preziosi per la selezione e per i conti dell'azienda."},
      {tipo:"bullets",voci:["Tatuare i suinetti appena possibile, copiando esattamente il codice mostrato dall'app, coppia per coppia","Prima di registrare un'uscita, una pesata o il passaggio alla matricola, leggere il tatuaggio e cercarlo nell'app"]},
      {tipo:"h3",testo:"🧰 Pinza per tatuare: caratteri, cassettina, borsa e responsabile"},
      {tipo:"p",testo:"La pinza deve avere 10 spazi: il codice di un suinetto nato in azienda ha 10 caratteri, cioè 5 coppie (esempio 2609LM0310). Il codice dei suini dei lotti acquistati generato dall'app ha 8 caratteri (esempio 2601AQ01): con la stessa pinza si lasciano vuoti 2 spazi."},
      {tipo:"p",testo:"Caratteri da avere e quantità. Per ogni carattere la quantità necessaria è il numero massimo di volte che può comparire in un solo codice. Il calcolo è fatto su tutti i codici possibili dal 2026 al 2035: ogni mese, ogni coppia finale della matricola della madre da 00 a 99, suinetti da 01 a 47 (oggi il numero più alto in un lotto è 47) e tutte le razze. A ogni carattere si aggiunge 1 pezzo di scorta."},
      {tipo:"tabella",righe:[
        ["0","Necessari 7, da avere 8. Esempio: 3001 00 00 01 (razza della madre e del padre non indicata)"],
        ["1","Necessari 7, da avere 8. Esempio: 3111 CC 11 11"],
        ["2","Necessari 6, da avere 7. Esempio: 2602 CC 22 22"],
        ["3","Necessari 7, da avere 8. Esempio: 3303 CC 33 33"],
        ["4","Necessari 6, da avere 7. Esempio: 3404 CC 44 44"],
        ["5","Necessari 5, da avere 6. Esempio: 3505 CC 55 05"],
        ["6","Necessari 5, da avere 6. Esempio: 2606 CC 66 06"],
        ["7","Necessari 5, da avere 6. Esempio: 2707 CC 77 07"],
        ["8","Necessari 5, da avere 6. Esempio: 2808 CC 88 08"],
        ["9","Necessari 5, da avere 6. Esempio: 2909 CC 99 09"],
        ["A (Nero Apucalabro)","Necessari 2, da avere 3. Serve anche per i lotti acquistati (AQ)"],
        ["C (Cinta Senese)","Necessari 2, da avere 3"],
        ["D (Duroc)","Necessari 2, da avere 3"],
        ["L (Large White)","Necessari 2, da avere 3"],
        ["M (Meticcio)","Necessari 2, da avere 3"],
        ["Q","Necessari 1, da avere 2. Solo per i lotti acquistati (AQ)"],
        ["G, N, R","Mora Romagnola, Nero Casertano, Landrace: oggi in azienda non ci sono. Se arrivano, comprare 3 pezzi per ciascuna lettera"],
      ]},
      {tipo:"nota",testo:"Totale da avere oggi: 85 pezzi, cioè 68 numeri e 17 lettere. Perché bastano: con questi pezzi si compone qualunque codice che l'app genera fino al 2035, anche quello con più caratteri uguali, e resta 1 ricambio per ogni carattere se un pezzo si rompe o si perde. Dopo il 2035, o se si aggiunge una razza nuova, il conto va rifatto."},
      {tipo:"p",testo:"Cassettina a scomparti: i caratteri si tengono in una cassettina separata a scomparti, del tipo usato per chiodi e viti, con almeno 16 scomparti, uno per ogni numero da 0 a 9 e uno per ciascuna lettera A, C, D, L, M, Q. Meglio una da 20 scomparti, per avere posto anche per G, N, R se arrivano nuove razze."},
      {tipo:"p",testo:"Ogni scomparto porta l'etichetta del suo carattere. Il 6 e il 9 si confondono se capovolti: controllarli prima di montarli. Lo 0 (zero) non è la lettera O."},
      {tipo:"p",testo:"Borsa: la pinza e la cassettina si tengono insieme in una borsa chiusa, sempre nello stesso posto."},
      {tipo:"p",testo:"Responsabile della custodia: il Dott. Bizzarri nomina un responsabile della borsa con la pinza e la cassettina. Il responsabile:"},
      {tipo:"bullets",voci:["consegna la borsa a chi deve tatuare e se la fa restituire a fine lavoro","dopo ogni uso controlla che nella cassettina ci siano tutti gli 85 pezzi, ognuno nel suo scomparto","fa pulire la pinza e i caratteri dopo l'uso","segnala subito al Dott. Bizzarri i pezzi rotti o persi, perché siano ricomprati"]},
      {tipo:"nota",testo:"Prima di tatuare: comporre il codice sulla pinza e confrontarlo carattere per carattere con quello mostrato dall'app."},
      {tipo:"h3",testo:"Creare un lotto da un parto in azienda"},
      {tipo:"steps",passi:["Apri la scheda della scrofa (🐄 Gestione → Animali), tab 📅 Eventi, e tocca «🐣 Nuovo parto»","Inserisci la data del parto e scegli il padre (la madre è la scrofa della scheda): il codice del lotto si compone da solo e compare nel riquadro verde «🏷️ Codice lotto generato automaticamente»","Inserisci nati totali e nati morti: i vivi si calcolano da soli","Facoltativo: data dell'accoppiamento, da cui l'app calcola la data prevista del parto (+3 mesi, 3 settimane e 3 giorni)","Tocca «Registra parto»: l'app crea il lotto nella sezione 🐷 Lotti, un'unità per ogni nato vivo già numerata con il suo tatuaggio (…01, …02…) e il parto nella scheda della madre"]},
      {tipo:"h3",testo:"Creare un lotto da un acquisto"},
      {tipo:"steps",passi:["Tocca '📦 Lotto acquistato'","Inserisci data di acquisto, fornitore, data e numero della fattura, numero di capi, razza e prezzo totale","Il codice del tatuaggio si genera da solo; se i maiali arrivano già tatuati, scrivi il loro codice","Tocca '📦 Crea lotto con N unità'"]},
      {tipo:"h3",testo:"Gestire le unità di un lotto"},
      {tipo:"p",testo:"Tocca un lotto: si apre la scheda con tutte le unità e, in alto, il riepilogo di vivi, macellati, morti, passati alla matricola, maschi e femmine. Su ogni unità ci sono questi pulsanti:"},
      {tipo:"bullets",voci:["⚖️ Peso e sesso: peso alla nascita (o in entrata per gli acquistati) e sesso (maschio, femmina, castrato)","🏷️ BDN: passaggio alla matricola individuale (vedi sotto)","📤 Uscita: macello, vendita, morte (vedi sotto)","↩️ Annulla l'uscita, se registrata per errore · 🗑️ Elimina, solo per unità create per sbaglio","Ricerca: nella barra in alto scrivi il tatuaggio completo (2304CC1901), il codice del lotto (2304CC19) o la matricola della madre"]},
      {tipo:"h3",testo:"Uscita dal lotto: macello o vendita"},
      {tipo:"p",testo:"L'uscita di un suino del lotto funziona come quella dei bovini e dei suini con matricola:"},
      {tipo:"steps",passi:["Leggi il tatuaggio, trova l'unità e tocca 📤","Scegli il motivo: Macellato, Venduto vivo, Morto, Predato, Smarrito, Altro","Compare l'avviso «⚖️ Ricordati di pesare l'animale vivo!»: pesa il maiale e scrivi il peso vivo","Il riquadro «📄 Modello 4 pronto per questa uscita» propone il modello 4 dei suini di quei giorni: toccalo per abbinarlo, anche se risulta già «pieno»","Tocca '✓ Conferma'","Dopo la macellazione il capo compare nella prima pagina tra gli «🔪 Animali usciti per la macellazione»: lì si inseriscono peso della carcassa, numero di partita del cliente e cliente"]},
      {tipo:"h3",testo:"🏷️ Passaggio alla matricola (BDN): riproduttori e razze pregiate"},
      {tipo:"p",testo:"Quando un suinetto del lotto viene scelto come riproduttore (futuro verro o scrofa), o è di razza pregiata e deve avere la matricola individuale:"},
      {tipo:"steps",passi:["Prima imposta il sesso con ⚖️: senza sesso l'app non procede","Tocca 🏷️ BDN sull'unità, scrivi la matricola BDN e, se vuoi, un nome","Tocca '✓ Registra e trasferisci'"]},
      {tipo:"p",testo:"L'unità esce dal lotto (segnata «→ BDN: matricola») e diventa una scheda individuale in 🐄 Gestione → Animali, che eredita dal lotto data di nascita, madre e padre, peso alla nascita e i costi già maturati. Da quel momento il suino si gestisce come un animale con matricola: sanitario, pesate, parti e uscita. Quando tutti i suinetti hanno la matricola o sono usciti, il lotto si chiude da solo."},
      {tipo:"nota",testo:"Il pulsante «📊 Excel» scarica l'elenco dei lotti e delle unità."},
    ]
  },
  {
    id:"sanitario", icon:"💉", titolo:"Registro sanitario",
    contenuto:[
      {tipo:"h3",testo:"Tre modalità di registrazione"},
      {tipo:"tabella",righe:[
        ["+ Singolo","Un singolo animale — apri, compila, salva"],
        ["💉 Gruppo","Più animali dell'anagrafica (bovini, ovini, suini con matricola) — selezione multipla con spunte"],
        ["🐷 Lotto","Suinetti di un lotto specifico — selezione per lotto poi per unità"],
      ]},
      {tipo:"h3",testo:"Evento di gruppo"},
      {tipo:"steps",passi:[
        "Tocca '💉 Gruppo'",
        "STEP 1: seleziona gli animali con le spunte (cerca per BDN, ultime 4 cifre o nome)",
        "Usa 'Seleziona tutti' per trattare l'intera mandria",
        "STEP 2: compila tipo, descrizione, prodotto, veterinario, data, costo totale",
        "Il costo viene diviso automaticamente per il numero di animali",
        "Tocca 'Registra evento su N animali'",
      ]},
      {tipo:"h3",testo:"Trattamento su lotto suini"},
      {tipo:"steps",passi:[
        "Tocca '🐷 Lotto'",
        "STEP 1: scegli il lotto dalla lista (cerca per codice lotto)",
        "Seleziona le unità da trattare (o 'Seleziona tutte le vive')",
        "STEP 2: compila i dati del trattamento",
        "Tocca 'Registra trattamento su N unità'",
      ]},
      {tipo:"nota",testo:"Nella registrazione singola e di gruppo usa il filtro per specie (bovino / suino / ovino / tutti) per vedere solo gli animali interessati: utile per i vaccini di una sola specie. Il pulsante 🌾 Tutti seleziona in un tocco tutti gli animali attivi dell'azienda"},
      {tipo:"h3",testo:"Tipi di evento sanitario"},
      {tipo:"p",testo:"Si può scegliere tra 11 tipi: vaccino, richiamo vaccinale, farmaco, antiparassitario, visita, intervento chirurgico, diagnostica, gravidanza, malattia, cura, altro."},
      {tipo:"h3",testo:"⏰ Scadenze dei richiami"},
      {tipo:"bullets",voci:["In cima al Registro sanitario c'è il riquadro delle scadenze dei richiami: in rosso quelli già scaduti, in giallo quelli in scadenza nei prossimi 30 giorni","Sull'icona 💉 Salute nel menu compare un numero con i richiami da gestire; lo stesso avviso compare anche nella prima pagina dell'app e toccandolo si apre il Registro sanitario","Su ogni scadenza il pulsante «✓ Registra» apre il modulo già compilato con animale, tipo e prodotto. L'app non registra niente da sola: il richiamo va sempre confermato a mano, dopo averlo fatto davvero"]},
      {tipo:"h3",testo:"Ricerca eventi"},
      {tipo:"p",testo:"Usa la barra di ricerca in cima: cerca per BDN, ultime 4 cifre, nome animale, tipo evento o prodotto farmaceutico."},
      {tipo:"nota",testo:"Le vaccinazioni compaiono automaticamente nella scheda di ogni animale (tab 📋 Info → sezione Vaccinazioni)."},
    ]
  },
  {
    id:"alimentazione", icon:"🌾", titolo:"Alimentazione",
    contenuto:[
      {tipo:"h3",testo:"Due modalità"},
      {tipo:"tabella",righe:[
        ["+ Singolo","Razione per un singolo animale o specie"],
        ["🌾 Gruppo","Stessa razione su più animali con selezione multipla"],
      ]},
      {tipo:"h3",testo:"Razione di gruppo"},
      {tipo:"steps",passi:[
        "Tocca '🌾 Gruppo'",
        "STEP 1: seleziona gli animali",
        "STEP 2: tipo mangime, quantità PER CAPO, unità, data, costo totale",
        "Il costo viene diviso per i capi — vedi anteprima quantità totale (es. 3 kg × 45 = 135 kg)",
        "Tocca 'Registra razione su N animali'",
      ]},
    ]
  },
  {
    id:"pesate", icon:"⚖️", titolo:"Pesate — lo storico dei pesi",
    contenuto:[
      {tipo:"p",testo:"Prima c'era un solo campo 'peso attuale' che si sovrascriveva a ogni aggiornamento: della pesata precedente non restava traccia. Ora ogni pesata è una riga a sé, e la storia dell'animale resta tutta."},
      {tipo:"h3",testo:"Registrare una pesata"},
      {tipo:"steps",passi:[
        "Apri la scheda dell'animale → tab ⚖️ Pesate",
        "Tocca '+ Registra pesata'",
        "Inserisci data e peso in kg",
        "Scegli il tipo di rilevazione (vedi tabella sotto)",
        "Salva — la riga compare nell'elenco, eliminabile con 🗑️ se hai sbagliato",
      ]},
      {tipo:"h3",testo:"I tipi di rilevazione"},
      {tipo:"tabella",righe:[
        ["Nascita","Peso alla nascita"],
        ["Ingresso","Peso rilevato quando l'animale entra in azienda — importante per gli acquistati, di cui non conosciamo il peso di nascita vero"],
        ["In vita","Una pesata qualsiasi durante l'allevamento"],
        ["Uscita vivo","Peso vivo al momento dell'uscita"],
        ["Uscita carcassa","Peso della carcassa dal referto del macello"],
      ]},
      {tipo:"h3",testo:"La spunta 'stimato'"},
      {tipo:"p",testo:"Serve a distinguere un peso REALE da uno messo per convenzione. Quando un animale è stato acquistato e il peso di nascita non si conosce, si usa lo standard di specie (45 kg bovino, 0,5 kg suino, 2 kg ovino) e si spunta 'stimato'. Così chi legge i dati sa che quel numero non è stato misurato."},
      {tipo:"nota",testo:"Perché ha senso pesare spesso: la Contabilità Industriale userà tutti questi punti data/peso per stimare l'accrescimento e il costo al kg per fascia di età. Più pesate reali ci sono, più quella stima è affidabile — e i pesi si accumulano solo se qualcuno li registra."},
    ]
  },
  {
    id:"coltivazione", icon:"🌾", titolo:"Coltivazione — campi, colture, costi e report",
    contenuto:[
      {tipo:"p",testo:"La sezione 🌾 Coltivazione raccoglie i campi aziendali (16 in uso oggi, 84,43 ettari, più quelli coltivati negli anni passati) con foto aerea e dati catastali, e tutto quello che ci si fa sopra campagna per campagna: colture, semine, lavorazioni, concimi, raccolte, costi e risultati."},
      {tipo:"h3",testo:"La campagna agraria — si sceglie in cima"},
      {tipo:"p",testo:"Il selettore in alto comanda l'intera sezione: cambiando campagna cambia tutto quello che vedi sotto. La campagna va dal 1° settembre al 31 agosto: la semina d'autunno e la trebbiatura dell'estate dopo stanno nella stessa campagna, e anche le semine di primavera-estate (pascoli, erbai in irriguo) appartengono alla campagna iniziata il settembre precedente. Si arriva indietro fino al 2019/2020; la 2022/2023 non è caricata."},
      {tipo:"h3",testo:"Le cinque linguette"},
      {tipo:"tabella",righe:[
        ["🗺️ Campi","Lista dei campi e scheda di ogni campo: si registra qui"],
        ["📊 Riepilogo","Ettari, giornate di lavoro, quantità e rese della campagna, per coltura"],
        ["🗓️ Programma","Cosa seminare e concimare in ogni campo, e cosa comprare"],
        ["📈 Report","Costi, valore di mercato e rese della campagna scelta"],
        ["📚 Storico","Tutte le stagioni insieme: per coltura, per campo e classifiche"],
      ]},
      {tipo:"h3",testo:"🗺️ Campi — la scheda del campo"},
      {tipo:"steps",passi:[
        "Tocca un campo: si apre la scheda con le colture della campagna",
        "Per metterne una nuova tocca '+ Aggiungi coltura' e scegli fra Avena, Erba Medica, Erbaio Misto, Grano, Orzo, Pisello Proteico, Produzione Seme, Sulla — oppure 'Altro' e scrivi il nome",
        "Per medica e sulla, che sono poliennali, indica in quale campagna sono state seminate: nelle campagne dopo la semina non viene più chiesta",
        "Salva — compare il blocco della coltura con tre linguette: Semina, Lavorazioni, Raccolta",
      ]},
      {tipo:"nota",testo:"Sullo stesso campo puoi mettere PIÙ colture nella stessa campagna: le successioni (orzo mietuto a giugno e poi un erbaio estivo, o il sorgo dopo il pascolo) e le porzioni di campo con colture diverse. Basta premere di nuovo '+ Aggiungi coltura'."},
      {tipo:"h3",testo:"🌱 Semina"},
      {tipo:"bullets",voci:[
        "Nel menu 'Seme' compaiono per primi, con 📋, i semi previsti dal Programma per quella coltura; sotto, tutti i semi già usati in azienda. Se manca, scegli '✏️ Altro seme' e scrivi il nome",
        "Inserisci la quantità in quintali: l'app calcola da sola i chilogrammi, i quintali per ettaro e i chilogrammi per ettaro sugli ettari della coltura",
        "Per GRANO e ORZO puoi usare le 'dosi' (confezioni) al posto dei quintali: in quel caso calcola le dosi per ettaro",
        "Per ERBAIO MISTO e PRODUZIONE SEME registra una riga per ciascuna essenza (trifoglio, avena, loietto) con '+ Aggiungi seme'",
      ]},
      {tipo:"h3",testo:"🚜 Lavorazioni"},
      {tipo:"p",testo:"L'elenco delle 15 lavorazioni è sempre lì: aratura, estirpatura, erpicatura, morganatura, rippatura, spietratura, concimazione, semina, disserbo, sfalcio, ranghinatura, pressatura balle, raccolta balle, trebbiatura, irrigazione."},
      {tipo:"steps",passi:[
        "Tocca la riga della lavorazione eseguita — si apre",
        "Tocca 'Registra esecuzione'",
        "Metti la data e le giornate di lavoro impiegate — anche mezze giornate, si scrive 0,5",
        "Salva: la spunta della riga diventa verde",
      ]},
      {tipo:"nota",testo:"La stessa lavorazione si registra più volte: la medica si sfalcia 3-4 volte l'anno e l'irrigazione si ripete per tutta l'estate. Ogni volta aggiungi una nuova esecuzione con la sua data e le sue giornate: accanto al nome compare ×3 e le giornate si sommano."},
      {tipo:"bullets",voci:[
        "CONCIMAZIONE: il form chiede quali concimi — binario, ternario, stallatico, letame o altro — e i quintali di ciascuno; se ne possono mettere più di uno nella stessa passata",
        "DISSERBO: il form chiede il prodotto, la quantità e se è in litri o in chilogrammi",
        "La quantità per ettaro si calcola da sola sugli ettari della coltura",
      ]},
      {tipo:"h3",testo:"🌾 Raccolta"},
      {tipo:"steps",passi:[
        "Linguetta Raccolta → '+ Registra raccolta'",
        "Scegli il PRODOTTO raccolto (non la coltura): avena, erba medica, erbaio misto, grano, orzo, paglia, pisello proteico, sulla, seme misto, seme di medica, seme di sulla, o Altro",
        "L'unità si imposta da sola — quintali per i cereali, balloni per i foraggi — ma puoi cambiarla in quintali, balloni, rotoballe o chilogrammi",
        "Inserisci la quantità e la data: la resa per ettaro si calcola da sola",
      ]},
      {tipo:"nota",testo:"PAGLIA, SEME DI MEDICA e SEME DI SULLA sono sottoprodotti: escono dagli stessi ettari della coltura principale e nel riepilogo non ne raddoppiano ettari e giornate. Le colture PASCOLATE non hanno raccolta: il loro costo va tutto al pascolo."},
      {tipo:"h3",testo:"✏️ Correggere un dato"},
      {tipo:"p",testo:"Le esecuzioni delle lavorazioni e le raccolte si correggono o si cancellano con la matita e il cestino accanto alla riga: ognuno può farlo sulle righe inserite da lui, entro 48 ore dall'inserimento. Dopo, o per le righe di altri, serve l'amministratore. Una riga corretta mostra '✏️ Corretto il…' e il valore di prima resta nello storico delle rettifiche."},
      {tipo:"h3",testo:"📊 Riepilogo"},
      {tipo:"p",testo:"Tutti i campi della campagna raggruppati per coltura: ettari dedicati, giornate di lavoro e, per ciascun prodotto, quantità raccolta, resa per ettaro e resa per giornata di lavoro. Si compila da solo man mano che si inseriscono i dati."},
      {tipo:"h3",testo:"🗓️ Programma"},
      {tipo:"bullets",voci:[
        "🗺️ Per campo: per ogni coltura i semi e i concimi previsti, con dose per ettaro e quantità totale (dose × ettari); le confezioni sono arrotondate per eccesso. Sotto, '▸ Istruzioni per semina e concimazione' apre le note del piano approvato",
        "🛒 Da acquistare: gli stessi prodotti sommati su tutta l'azienda, cioè la lista della spesa della campagna",
        "Il programma lo prepara l'amministratore dal piano approvato dal dott. Bizzarri; chi semina trova i semi previsti già proposti nel menu della Semina",
      ]},
      {tipo:"h3",testo:"📈 Report — la campagna scelta"},
      {tipo:"p",testo:"Il costo di ogni coltura è semi + concimi + fitosanitari + lavorazioni + altro, dalle schede campo approvate. Le lavorazioni fatte in azienda sono valutate a tariffa, senza fattura. Il costo della coltura si divide fra tutti i suoi prodotti (paglia e seme compresi) in proporzione al valore di mercato."},
      {tipo:"bullets",voci:[
        "In cima: superficie, costo totale, costo per ettaro e saldo contro il mercato",
        "DOVE GUADAGNI e DOVE PERDI: i prodotti che sono costati meno o più del loro prezzo di mercato, con il semaforo (verde sotto il mercato, giallo poco sopra, rosso oltre la soglia)",
        "RESE CONTRO IL RIFERIMENTO: la resa per ettaro confrontata con la media ISTAT della provincia di Roma, solo per orzo, avena e favino; per fieni, paglia, sementi e pascoli un riferimento affidabile non c'è",
        "PASCOLI: le colture pascolate senza raccolta, con il loro costo per ettaro",
        "COSTI PER COLTURA: tocca una coltura per vedere i suoi campi",
        "⚙️ Prezzi e rese: prezzi di mercato in euro al quintale, peso del ballone e della rotoballa (340 chilogrammi), soglia del semaforo e rese di riferimento. Li modifica solo l'amministratore; il report si ricalcola subito",
        "📥 Esporta Excel e 📅 Confronto tra stagioni (tutte le stagioni affiancate: superficie, costo per ettaro, saldo e produzione)",
      ]},
      {tipo:"h3",testo:"📚 Storico — tutte le stagioni"},
      {tipo:"tabella",righe:[
        ["🌱 Per coltura","Stagione per stagione: ettari, resa, costo e costo di ogni unità di prodotto contro il mercato"],
        ["🗺️ Per campo","Per un campo: coltura, produzione, costi, concimi con la dose per ettaro e risultato contro il mercato"],
        ["🏅 Ranking stagione","In ogni stagione i campi dal migliore al peggiore per costo del prodotto rapportato al prezzo di mercato"],
        ["🏆 Ranking resa","I campi su tutte le stagioni, confrontati con gli altri della stessa coltura: 100 = media dell'azienda"],
        ["🥇 Ranking per coltura","Per una coltura, i campi che l'hanno avuta sommando tutte le stagioni, al quintale del prodotto principale"],
      ]},
      {tipo:"nota",testo:"Report e Storico non si compilano: si ricalcolano ogni volta dai dati del database. Se si corregge una scheda, un prezzo o una resa, cambiano subito. Esclusi i pascoli, che non hanno un prodotto misurato."},
      {tipo:"h3",testo:"🏭 Collegamento con la Contabilità Industriale"},
      {tipo:"p",testo:"La Contabilità Industriale legge, in sola lettura, gli stessi dati delle coltivazioni attraverso le viste del database, e trova i report Excel delle coltivazioni (rese delle stagioni, schede campo, piano della campagna) nell'archivio dei report, sempre all'ultima versione. Dall'app Coltivazione non si scrive mai nei dati della Contabilità Industriale."},
    ]
  },
  // v126 — sezione Gasolio
  {
    id:"gasolio", icon:"⛽", titolo:"Gasolio — registro dei prelievi",
    contenuto:[
      {tipo:"h3",testo:"A cosa serve"},
      {tipo:"p",testo:"Il gasolio è una delle spese più grandi dell'azienda. Nella sezione Gasolio si registra ogni prelievo dalle cisterne: chi l'ha fatto, con quale mezzo, quanti litri e per quale lavoro. Con questi dati la contabilità industriale calcola quanto costa davvero produrre il fieno e l'orzo e allevare gli animali: si capisce cosa conviene coltivare e cosa comprare, e quale macchina usare per ogni lavoro."},
      {tipo:"nota",testo:"Regola d'oro: registrare OGNI prelievo, subito dopo averlo fatto. Bastano 30 secondi."},
      {tipo:"h3",testo:"Dove si trova, campagna e riepilogo"},
      {tipo:"bullets",voci:["Nella barra in basso, icona ⛽ Gasolio.","In alto si sceglie la campagna agraria (1 settembre – 31 agosto, come in Coltivazione): di base è aperta quella in corso; scegliendo una campagna passata si vedono i suoi rifornimenti.","Il riquadro «Gasolio prelevato» mostra i litri totali della campagna, i litri per ogni mezzo (dal più consumato) e l'ultima lettura del contalitri di ogni cisterna, con data e ora."]},
      {tipo:"h3",testo:"Come si registra un rifornimento"},
      {tipo:"steps",passi:["Tocca «+ Registra rifornimento»","Data e ora si registrano da sole al salvataggio e non si possono cambiare. Per un prelievo fatto prima (per esempio ieri sera) spunta «Registrazione tardiva» e indica giorno e ora: non si può mettere una data nel futuro","Scegli la cisterna, l'operatore e il mezzo: basta iniziare a scrivere e l'elenco si restringe. Se il nome non c'è, scrivilo per intero e scegli «➕ Altro»: resterà in elenco, segnato «da verificare» finché l'amministratore non lo controlla","Motivo: tocca 🌾 Coltivazione, 🐄 Allevamento oppure Altro (con Altro scrivi per cosa serve, per esempio generatore o trasporto merci)","Scrivi i litri prelevati (si può usare la virgola, per esempio 45,5)","Lettura del contalitri dopo il prelievo (facoltativa ma consigliata): l'app la confronta con l'ultima lettura più i litri appena presi. Se la differenza supera 1 litro compare un avviso giallo: ricontrolla, il numero può essere letto male o può mancare un prelievo precedente","Note facoltative, poi tocca «✓ Salva»: il rifornimento compare nell'elenco in basso. I campi con l'asterisco rosso * sono obbligatori"]},
      {tipo:"h3",testo:"L'elenco dei rifornimenti"},
      {tipo:"p",testo:"In basso ci sono tutti i rifornimenti della campagna, dal più recente: mezzo, data e ora, cisterna, operatore, motivo, contalitri e litri. Le registrazioni tardive lo indicano, con la data in cui sono state scritte."},
      {tipo:"h3",testo:"Se hai sbagliato"},
      {tipo:"bullets",voci:["Un dato sbagliato (mezzo, litri, motivo…): tocca la matita ✏️ sulla riga, correggi solo quel dato e tocca «Salva correzione». Data e ora restano quelle del prelievo","Rifornimento inserito due volte, o che non andava inserito: cancellalo con il cestino 🗑️","Hai 48 ore per correggere o cancellare i rifornimenti inseriti da te. Dopo, matita e cestino spariscono: bisogna chiedere all'amministratore, che può correggere sempre","Ogni correzione resta scritta sulla riga («✏️ Corretto il… da…»): toccando «cosa è cambiato» si vedono il valore di prima e quello nuovo"]},
      {tipo:"nota",testo:"Registra il prelievo subito, quando sei ancora alla cisterna. Leggi sempre il contalitri dopo il prelievo e scrivilo. Scegli sempre il mezzo giusto e il motivo giusto: da qui si capisce quanto consuma ogni macchina e quanto gasolio va alla coltivazione e all'allevamento."},
    ]
  },
  {
    id:"uscite", icon:"📤", titolo:"Registro uscite",
    contenuto:[
      {tipo:"h3",testo:"Come registrare un'uscita"},
      {tipo:"steps",passi:[
        "Vai in 📤 Uscite",
        "Usa i filtri specie (bovini / suini / ovini) per restringere la lista",
        "Cerca per BDN, ultime 4 cifre, nome, lotto o razza",
        "Tab 'In stalla': trova l'animale → tocca '📤 Uscita'",
        "Scegli motivo, data, peso vivo — pesa sempre l'animale vivo",
        "Abbina l'uscita al modello 4 proposto (vedi sotto)",
        "Se macellato: inserisci peso carcassa → resa % calcolata automaticamente",
        "I giorni di permanenza in stalla vengono calcolati automaticamente",
        "Tocca 'Registra uscita'",
      ]},
      {tipo:"h3",testo:"Tipi di uscita"},
      {tipo:"bullets",voci:[
        "🔪 Macellato — con peso vivo, peso carcassa, resa %",
        "✝️ Morto (cause naturali o malattia)",
        "💰 Venduto vivo",
        "🚨 Furto · 🏃 Scappato · 🔄 Trasferito",
      ]},
      {tipo:"h3",testo:"Tab 'Usciti'"},
      {tipo:"p",testo:"Storico di tutti gli animali usciti con filtro per specie. Mostra riepilogo macellazioni: peso vivo totale, carcassa totale, resa media."},
      // v126 — peso vivo, abbinamento al modello 4, completamento dopo la macellazione
      {tipo:"h3",testo:"⚖️ Ricordati di pesare l'animale vivo"},
      {tipo:"p",testo:"Con motivo Macellato, Venduto vivo, Trasferito o Altro, in alto nel modulo di uscita compare il riquadro arancione «⚖️ Ricordati di pesare l'animale vivo!». Quando inserisci il peso vivo diventa verde. Se salvi senza peso vivo l'app chiede se vuoi salvare comunque."},
      {tipo:"h3",testo:"📄 Abbinare l'uscita al modello 4"},
      {tipo:"p",testo:"Quando registri un'uscita (dal Registro uscite, dalla scheda dell'animale o dai lotti suini), dopo la data compare il riquadro giallo «📄 Modello 4 pronto per questa uscita» con i modelli 4 della stessa specie arrivati nei 10 giorni prima o dopo: per ognuno data, capi, categoria, macello e quanti capi sono già abbinati"},
      {tipo:"bullets",voci:["Bovini e capi con matricola: se la matricola è scritta nel modello 4 il documento è già selezionato («✅ questa matricola è nel modello 4»): basta salvare","Suini e ovini: tocca il modello 4 giusto. Si può abbinare anche un modello 4 già «pieno» (per esempio 3 abbinati su 3): il numero dei capi può essere diverso, l'importante è chiudere la scheda. Se non c'è un modello 4 tocca «Nessun modello 4»","Salvando, l'uscita resta collegata al suo modello 4. Se annulli l'uscita (↩️) si toglie anche il collegamento"]},
      {tipo:"h3",testo:"🔪 Dopo la macellazione: carcassa, partita e cliente"},
      {tipo:"steps",passi:["Nella prima pagina dell'app compare l'avviso rosso «🔪 Animali usciti per la macellazione — N capi da completare»","Toccandolo si apre l'elenco dei capi usciti, con matricola o lotto, specie, data e modello 4","Tocca un capo e compila: peso vivo (già scritto se inserito all'uscita), peso della carcassa (la resa si calcola da sola), numero di partita del cliente (il numero con cui il cliente ha caricato il capo nel suo sistema: ogni capo ha il suo) e cliente (dall'elenco dei clienti della contabilità, oppure «✏️ Altro» per scriverlo)","Tocca «✓ Salva»: i dati vanno nella scheda dell'animale e il capo passa nel pacchetto per la fatturazione, che la contabilità industriale legge da sola per emettere la fattura. Gli ovini si completano uno per uno, come bovini e suini"]},
      {tipo:"nota",testo:"Nella scheda dell'animale compaiono numero di partita, cliente e stato della fatturazione («pronto da fatturare» o «fatturato»)"},
      {tipo:"h3",testo:"⚖️ Peso della carcassa arrivato dopo l'uscita"},
      {tipo:"p",testo:"Strada consigliata, per le macellazioni dal 24/09/2026: nella prima pagina tocca l'avviso «🔪 Animali usciti per la macellazione», scegli il capo e inserisci peso della carcassa, numero di partita del cliente e cliente. Così il dato va nella scheda dell'animale e nel pacchetto per la fatturazione."},
      {tipo:"p",testo:"Per correggere un dato o completare uscite più vecchie:"},
      {tipo:"bullets",voci:["Apri la scheda dell'animale già uscito, anche se non è più attivo: da 🐄 Gestione → Animali oppure da 📤 Uscite → tab «Usciti»","Tocca ✏️ Modifica e vai alla sezione Dati uscita: inserisci o correggi il peso della carcassa (kg) in qualsiasi momento, anche mesi dopo","La resa % (carcassa ÷ peso vivo) si ricalcola da sola ogni volta che aggiorni il dato","Suini dei lotti: apri il lotto, trova l'unità dal tatuaggio e tocca 📤 ✏️ per modificare l'uscita"]},
      {tipo:"h3",testo:"📈 IPG — Incremento Peso Giornaliero"},
      {tipo:"p",testo:"Calcolato automaticamente dove ci sono peso ingresso e peso uscita:"},
      {tipo:"bullets",voci:[
        "IPG peso vivo (kg/gg) = peso_vivo_uscita / giorni_permanenza",
        "IPG carcassa (kg/gg) = peso_carcassa / giorni_permanenza",
        "Compare nella scheda animale uscito, nel Registro Uscite, e negli export Excel",
      ]},
    ]
  },
  // v126 — sezione Modelli 4
  {
    id:"modelli4", icon:"📄", titolo:"Modelli 4 — documenti di accompagnamento",
    contenuto:[
      {tipo:"p",testo:"Il modello 4 è il documento di accompagnamento della Banca Dati Nazionale che segue ogni animale che esce dall'azienda, verso il macello o un altro allevamento. Lo prepara Stefano Cortesi prima dell'uscita, di solito il giorno prima. Nella sezione 📄 Modelli 4 (barra in basso, dopo Uscite) c'è l'archivio di tutti i modelli 4 dal 2021 a oggi, con il PDF originale di ciascuno: serve a sapere quando, dove e con quale documento è uscito ogni capo, a chiudere correttamente le schede degli animali usciti e a preparare i dati per la fatturazione."},
      {tipo:"h3",testo:"Come arrivano i modelli 4"},
      {tipo:"bullets",voci:["In automatico: ogni ora l'app controlla la casella email aziendale. Quando arriva un modello 4 di Cortesi lo legge e lo salva da sola, con tutti i dati e il PDF; in Gmail l'email prende l'etichetta «Modelli4-caricati». Non bisogna fare niente","A mano, per i modelli 4 che arrivano da altre persone: tocca «📥 Carica PDF», scegli uno o più PDF (anche tutti insieme). L'app legge ogni documento e mostra l'esito: ✅ nuovo modello 4 salvato, 🔗 già in archivio (PDF collegato), ⚠️ non è un modello 4","Modello 4 su carta o scansionato: l'app non sa leggere le immagini. Scansiona o fotografa BENE il documento (tutto il foglio, dritto, a fuoco, con buona luce, tutte le pagine), poi in «Carica PDF» apri il riquadro «🤖 Modello 4 su carta o scansionato? Fallo leggere all'IA»: tocca «📋 Copia il prompt», incollalo in un'intelligenza artificiale (per esempio Claude) insieme alla scansione e carica nell'app il PDF che l'IA restituisce. Controlla prima che numeri e matricole siano giusti: nel documento resterà la nota «Trascritto dall'intelligenza artificiale da una scansione»"]},
      {tipo:"h3",testo:"Consultare i modelli 4"},
      {tipo:"bullets",voci:["Ricerca 🔍: si può scrivere una matricola, il numero del documento, il nome del macello o del trasportatore","Filtri: specie (Tutti, Bovini, Suini, Ovini), anno e movimento (Uscite da Podere Verde, Uscite da registrare nell'app, Altri movimenti come gli ingressi da altre aziende, Tutti i movimenti)","Il riquadro marrone riassume documenti e capi del filtro scelto, divisi per specie","Toccando un modello 4 si apre il dettaglio: data del documento, progressivo, codice di controllo, destinazione con codice e indirizzo, trasporto, email di arrivo, l'elenco dei capi (matricola per bovini, ovini e caprini; marchio aziendale e insieme per suini e agnelli) e il pulsante «📄 Apri PDF» per vedere l'originale","Riga gialla: lo stesso numero di documento è stato emesso due volte con codice di controllo diverso (di solito annullato e riemesso). Si controlla nella Banca Dati Nazionale quale vale","Solo l'amministratore può eliminare un modello 4 caricato per errore (🗑️ Elimina): si cancellano anche i capi e il PDF"]},
      {tipo:"h3",testo:"Modello 4 e animali usciti"},
      {tipo:"bullets",voci:["Avviso rosso in alto «⏳ N modelli 4 con uscite ancora da registrare nell'app»: toccandolo si vedono solo quei documenti","Su ogni modello 4 recente: «Uscite registrate nell'app: 1 di 3» in rosso se mancano capi, in verde quando sono tutti registrati. Il numero dei capi può non coincidere (per esempio un modello 4 di prelievo): l'importante è chiudere la scheda di ogni animale","Nel dettaglio, per ogni capo con matricola: ✅ «Uscita registrata nell'app»; ⏳ «Ancora attivo nell'app» con il pulsante «📤 Registra uscita», che chiude il capo con data, motivo e modello 4 in un tocco; ⚠️ «Matricola non registrata nell'app»: il capo va inserito in anagrafica","Nella scheda dei bovini usciti, sezione Gestione, compare la riga «Modello 4» con il numero del documento e il pulsante «📄 Apri PDF»"]},
    ]
  },
  {
    id:"pedigree", icon:"🧬", titolo:"Pedigree e genealogia",
    contenuto:[
      {tipo:"p",testo:"Il modulo Pedigree legge automaticamente i dati genealogici delle schede. Non serve inserire nulla in più."},
      {tipo:"bullets",voci:[
        "Albero visuale a 3 generazioni (soggetto → genitori → nonni)",
        "Nodi cliccabili: tocca un antenato per aprirne la scheda",
        "Badge 'pedigree ✓' sugli animali con genealogia tracciata",
        "Storico parti con nati vivi/morti",
        "Discendenti diretti con link alle schede",
      ]},
      {tipo:"nota",testo:"Per un albero completo, collega sempre padre e madre nella scheda di ogni animale."},
      {tipo:"h3",testo:"🚫 Consanguineità"},
      {tipo:"bullets",voci:[
        "Nella scheda animale del Pedigree c'è ora il tab 🚫 Consanguineità con elenco genitori/figli/fratelli",
        "Report Excel con due fogli: Accoppiamenti a rischio (prevenzione monta) e Capi con genealogia consanguinea",
        "Nell'elenco a schermo degli accoppiamenti a rischio, accanto a nome e matricola di maschio e femmina compare la RAZZA in evidenza — utile per capire subito se la coppia riguarda animali di razza pregiata",
      ]},
      {tipo:"h3",testo:"🚫 Accoppiamenti a rischio ordinati per priorità genetica"},
      {tipo:"p",testo:"Nel Report Consanguineità, dentro ogni specie, le coppie a rischio sono raggruppate per gravità genetica. Il meticcio non è una razza ma il risultato di un incrocio, quindi la consanguineità tra due soggetti della stessa razza pura pesa molto più che tra due meticci."},
      {tipo:"tabella",righe:[
        ["1. Stessa razza","I due animali sono della stessa razza pura — il caso più grave, si concentra la parentela dentro una linea di sangue di valore"],
        ["2. Razze pure diverse","Due razze pure differenti — comunque due soggetti di pregio"],
        ["3. Razza × meticcio","Un animale di razza pura con un meticcio"],
        ["4. Meticcio × meticcio","Entrambi incroci — rilevanza genetica minore"],
        ["5. Razza non indicata","Manca la razza su almeno uno dei due: va completata nella scheda"],
      ]},
      {tipo:"nota",testo:"Lo stesso ordine si ritrova nel file Excel, sia in quello del pulsante 📊 Excel dentro il Report Consanguineità sia nel foglio 'Accoppiamenti a rischio' del modulo 📥 Esporta: le righe sono ordinate per specie e priorità, con due colonne in più (Priorità e Categoria) per poter filtrare."},
    ]
  },
  {
    id:"selezione", icon:"🏆", titolo:"Selezione genetica",
    contenuto:[
      {tipo:"h3",testo:"KPI calcolati automaticamente"},
      {tipo:"tabella",righe:[
        ["N° parti","Totale parti registrati per femmina"],
        ["IIP medio","Intervallo inter-parto in giorni E mesi (meno = meglio)"],
        ["% nati vivi","Nati vivi su totale nati"],
        ["Prolificità","Media nati vivi per parto"],
        ["Longevità","Anni di carriera riproduttiva"],
      ]},
      {tipo:"h3",testo:"Massimizzare l'accuratezza del ranking"},
      {tipo:"bullets",voci:[
        "Registra TUTTI i parti (presenti e storici) nella scheda di ogni fattrice",
        "Per parti storici usa '📅 Parto storico' — bastano data, totali, morti",
        "Più parti hai registrati, più accurato è il ranking",
        "Il ranking si aggiorna in tempo reale appena aggiungi nuovi eventi",
      ]},
      {tipo:"h3",testo:"🏆 Indicatori della selezione"},
      {tipo:"bullets",voci:[
        "Età al primo parto (mesi)",
        "Produttività annua stimata (figli/anno di carriera)",
        "🥩 Statistiche figli macellati: resa carcassa media, peso carcassa medio, IPG carcassa medio dei figli — indicatore genetico del valore del riproduttore per la resa",
      ]},
    ]
  },
  {
    id:"uba", icon:"🐾", titolo:"UBA — Unità di Bestiame Adulto",
    contenuto:[
      {tipo:"p",testo:"Calcolo delle Unità di Bestiame Adulto (UBA) per ogni animale con media ponderata secondo la fascia di età. Base per la ripartizione dei costi. Dati chiave:"},
      {tipo:"bullets",voci:[
        "UBA medio = coefficiente medio ponderato tra le fasce di età nel periodo di calcolo",
        "Periodo di calcolo = MAX(nascita, 1° gennaio) → oggi (o data uscita)",
        "UBA-giorni = UBA medio × giorni nel periodo (base per la ripartizione costi)",
        "Data di riferimento configurabile (utile per bilanci parziali)",
        "Filtri per specie (tutti / bovino / suino / ovino) e per stato (attivi / usciti / tutti)",
      ]},
    ]
  },
  {
    id:"email", icon:"📮", titolo:"Email — report mensili e backup automatici",
    contenuto:[
      {tipo:"p",testo:"Nel tab 📮 Email si gestisce l'invio automatico di report e backup ai soggetti registrati (commercialista, direttore allevamento, consulenti, ecc.)."},
      {tipo:"bullets",voci:[
        "Registra destinatari con nome, email, ruolo e permessi (Report / Backup / Alert)",
        "Il 1° di ogni mese alle 06:00 il sistema invia automaticamente via email: report Excel (anagrafica, uscite del mese, sanitario) allegato a chi ha permesso Report",
        "Backup completo del database (file .sql) allegato a chi ha permesso Backup",
        "Pulsante 🧪 Test invio per verificare il funzionamento in qualsiasi momento senza aspettare fine mese",
        "Storico di tutti gli invii consultabile dal tab Email",
      ]},
    ]
  },
  {
    id:"costi", icon:"💰", titolo:"Costi — dove si guardano adesso",
    contenuto:[
      {tipo:"p",testo:"L'analisi economica è passata al programma di Contabilità Industriale, che lavora sullo stesso database di questa app ed è usato dai contabili. Qui dentro restano le due cose che servono a chi sta in allevamento."},
      {tipo:"h3",testo:"💰 Costi nella scheda dell'animale"},
      {tipo:"p",testo:"Apri un animale → tab 💰 Costi. Vedi anno per anno: UBA-giorni, categoria contabile, costo di mantenimento, costo di nascita ereditato, quota già scaricata sui figli e totale dell'anno, con il cumulato in fondo."},
      {tipo:"nota",testo:"Questi numeri li CALCOLA la Contabilità Industriale, qui si leggono soltanto. Se un valore è sbagliato non si corregge da qui: si corregge là."},
      {tipo:"h3",testo:"⚠️ Manca costo acquisto"},
      {tipo:"p",testo:"Se un animale ha provenienza 'Acquistato' ma il prezzo di acquisto è vuoto, compare un badge rosso sulla sua card in Anagrafica e un avviso in cima alla scheda. Serve perché un capo comprato senza prezzo falsa tutti i conti a valle."},
      {tipo:"bullets",voci:[
        "Per sistemarlo: apri la scheda → ✏️ Modifica → compila Prezzo acquisto → Salva",
        "Il campo è condiviso con la Contabilità Industriale: appena lo compili da una parte, l'avviso sparisce da entrambe",
      ]},
      {tipo:"h3",testo:"Le vecchie tab Costi, Origine e Struttura"},
      {tipo:"p",testo:"Sono state tolte dalla barra perché quel lavoro si fa ora nella Contabilità Industriale. I dati non sono stati cancellati: macchinari, ammortamenti e costi generali sono tutti ancora nel database, e le tab si possono rimettere in qualsiasi momento."},
    ]
  },
  {
    id:"export", icon:"📥", titolo:"Esportare dati in Excel",
    contenuto:[
      {tipo:"p",testo:"Il tab 📥 Esporta permette di generare un file Excel su misura con solo i dati che ti servono."},
      {tipo:"h3",testo:"Come funziona"},
      {tipo:"steps",passi:[
        "Vai in 📥 Esporta",
        "Imposta opzionalmente un filtro data (Da / A) — si applica a sanitario, alimentazione, parti, costi",
        "Spunta le sezioni da includere (o usa 'Seleziona tutto')",
        "Tocca '📥 Genera Excel (N fogli)' — il file viene scaricato automaticamente",
      ]},
      {tipo:"h3",testo:"Sezioni esportabili"},
      {tipo:"tabella",righe:[
        ["🐄 Anagrafica Bovini","Tutti i dati di ogni bovino: BDN, razza, pesi, provenienza, uscita, resa"],
        ["🐷 Anagrafica Suini","Come sopra per i suini con matricola"],
        ["🐑 Anagrafica Ovini","Come sopra per gli ovini"],
        ["📤 Uscite","Tutti gli animali usciti con giorni permanenza e resa macellazione"],
        ["🐣 Parti","Registro completo parti per specie con padre, madre, nati"],
        ["💉 Sanitario","Tutti gli eventi sanitari inclusi i trattamenti su lotti suini"],
        ["🌾 Alimentazione","Tutte le somministrazioni"],
        ["📋 Lotti Riepilogo","Un lotto per riga: vivi/macellati/deceduti/riproduttori/maschi/femmine"],
        ["🏷️ Lotti Unità","Una riga per ogni suinetto con tatuaggio, stato, pesi, resa"],
        ["🏆 KPI Selezione","IIP giorni e mesi, prolificità, % vivi per ogni fattrice"],
        ["🧾 Costi Animale","Costi per singolo animale"],
        ["📊 Costi Generali","Costi fissi aziendali"],
        ["🐄 Bovini attivi/usciti","Fogli separati per attivi e usciti"],
        ["🐷 Suini attivi/usciti","Come sopra"],
        ["🐑 Ovini attivi/usciti","Come sopra"],
        ["🐾 UBA Riepilogo","Aggregato UBA totali e UBA-giorni per specie e categoria"],
        ["📋 UBA Dettaglio (tutti/bovini/ovini/suini)","Dettaglio animali con UBA medio, UBA-giorni, categoria, stato"],
        ["⚠️ Accoppiamenti a rischio","Coppie maschio-femmina attive che sono consanguinee"],
        ["🧬 Capi con genealogia consanguinea","Animali attivi nati da unioni consanguinee"],
        ["🏭 Macchinari","Con quota annua, totale ammortizzato e valore residuo calcolati"],
      ]},
      {tipo:"nota",testo:"Il file Excel scaricato contiene un foglio separato per ogni sezione selezionata. Il nome del file include la data di export."},
      {tipo:"h3",testo:"📅 Giorni di vita"},
      {tipo:"p",testo:"Nell'export Excel degli animali, subito dopo «Data uscita», c'è la colonna con i giorni tra nascita e uscita, già calcolati."},
    ]
  },
];

export default function Guida() {
  const [aperta, setAperta] = useState(null);

  const Card = ({children, style={}}) => (
    <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,
      boxShadow:"0 2px 8px rgba(0,0,0,0.07)",border:`1px solid ${C.border}`,...style}}>
      {children}
    </div>
  );

  const renderContenuto = (items) => items.map((item, i) => {
    if (item.tipo==="h3") return (
      <div key={i} style={{fontWeight:700,fontSize:14,color:C.primary,margin:"14px 0 6px"}}>
        {t(item.testo)}
      </div>
    );
    if (item.tipo==="p") return (
      <p key={i} style={{fontSize:14,color:C.text,margin:"0 0 10px",lineHeight:1.6}}>
        {t(item.testo)}
      </p>
    );
    if (item.tipo==="steps") return (
      <ol key={i} style={{paddingLeft:20,margin:"0 0 12px"}}>
        {item.passi.map((p,j)=>(
          <li key={j} style={{fontSize:14,color:C.text,marginBottom:6,lineHeight:1.5}}>{t(p)}</li>
        ))}
      </ol>
    );
    if (item.tipo==="bullets") return (
      <ul key={i} style={{paddingLeft:20,margin:"0 0 12px"}}>
        {item.voci.map((v,j)=>(
          <li key={j} style={{fontSize:14,color:C.text,marginBottom:6,lineHeight:1.5}}>{t(v)}</li>
        ))}
      </ul>
    );
    if (item.tipo==="nota") return (
      <div key={i} style={{background:C.primary+"12",border:`1px solid ${C.primary}33`,
        borderRadius:10,padding:"10px 14px",fontSize:13,color:C.text,
        margin:"8px 0 12px",lineHeight:1.5}}>
        {t(item.testo)}
      </div>
    );
    if (item.tipo==="tabella") return (
      <div key={i} style={{margin:"0 0 12px"}}>
        {item.righe.map((r,j)=>(
          <div key={j} style={{display:"flex",gap:12,padding:"8px 0",
            borderBottom:`1px solid ${C.border}`,fontSize:13}}>
            <div style={{fontWeight:700,color:C.primary,minWidth:110,flexShrink:0}}>{t(r[0])}</div>
            <div style={{color:C.text,flex:1}}>{t(r[1])}</div>
          </div>
        ))}
      </div>
    );
    return null;
  });

  if (aperta) {
    const s = SEZIONI.find(x=>x.id===aperta);
    return (
      <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
        minHeight:"100vh",maxWidth:480,margin:"0 auto",padding:"16px 16px 80px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={()=>setAperta(null)}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
          <span style={{fontSize:18,fontWeight:800}}>{s.icon} {t(s.titolo)}</span>
        </div>
        <Card>{renderContenuto(s.contenuto)}</Card>
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,
        borderRadius:"0 0 28px 28px",padding:"28px 20px 24px",marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>📖 {t("Guida per Allevatori")}</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",marginTop:4}}>
          {t("App Allevamento")} — Podere Verde · v119
        </div>
      </div>
      <div style={{padding:"0 16px"}}>
        <div style={{background:C.green+"15",border:`1px solid ${C.green}33`,
          borderRadius:14,padding:"14px 16px",marginBottom:16,fontSize:13,
          color:C.text,lineHeight:1.6}}>
          {t("Tutti i dati vengono salvati automaticamente nel database condiviso. Ogni operatore vede gli stessi dati in tempo reale da qualsiasi dispositivo.")}
        </div>
        {SEZIONI.map(s=>(
          <button key={s.id} onClick={()=>setAperta(s.id)}
            style={{display:"flex",alignItems:"center",gap:14,width:"100%",
              background:C.card,border:`1px solid ${C.border}`,borderRadius:16,
              padding:"14px 16px",marginBottom:10,cursor:"pointer",textAlign:"left",
              boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
            <span style={{fontSize:28}}>{s.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15,color:C.text}}>{t(s.titolo)}</div>
            </div>
            <span style={{color:C.muted,fontSize:18}}>›</span>
          </button>
        ))}
        <div style={{textAlign:"center",padding:"20px 0",fontSize:12,color:C.muted}}>
          {t("App Allevamento")} v119 · Podere Verde · podereverdeapp.it
        </div>
      </div>
    </div>
  );
}
