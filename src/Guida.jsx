import { useState } from "react";

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
        ["🌾 Coltivazione","I 16 campi aziendali: colture, semine, lavorazioni, raccolta e rese"],
        ["🏆 Selezione","Ranking genetico: IIP, produttività, età primo parto, resa media figli"],
        ["📤 Uscite","Macellazioni, vendite, morti — con resa % e IPG"],
        ["🐾 UBA","Calcolo UBA medio per fascia di età con ripartizione presenza effettiva"],
        ["📥 Esporta","Export Excel granulare — anagrafica, uscite, UBA, consanguineità"],
        ["📮 Email","Destinatari e invio automatico mensile di report e backup"],
        ["📖 Guida","Questo manuale"],
      ]},
      {tipo:"nota",testo:"Le vecchie tab 📊 Costi, 🧾 Origine e 🏭 Struttura non sono più nella barra: i costi per animale si consultano ora direttamente nella scheda dell'animale (tab 💰 Costi), e il grosso dell'analisi economica è passato al programma di Contabilità Industriale. I dati non sono stati cancellati."},
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
    ]
  },
  {
    id:"parto_suini", icon:"🐷", titolo:"Gestione parto e lotti suini",
    contenuto:[
      {tipo:"h3",testo:"Identificazione suini — due sistemi normativi"},
      {tipo:"tabella",righe:[
        ["Matricola individuale","Razze pregiate (Cinta Senese, Nero Apucalabro, Mora Romagnola, Nero Casertano) e riproduttori (verri e scrofe)"],
        ["Codice lotto (tatuaggio)","Animali da ingrasso — tutti i suinetti di un parto portano lo stesso numero tatuato sull'orecchio"],
      ]},
      {tipo:"h3",testo:"Codice lotto — come viene generato"},
      {tipo:"p",testo:"Il codice è composto da: AA (anno) + MM (mese) + lettera razza madre + lettera razza padre + ultime 2 cifre matricola madre."},
      {tipo:"tabella",righe:[
        ["A","Nero Apucalabro"],
        ["C","Cinta Senese"],
        ["D","Duroc"],
        ["G","Mora Romagnola"],
        ["L","Large White"],
        ["M","Meticcio"],
        ["N","Nero Casertano"],
        ["R","Landrace"],
        ["0","Altra"],
      ]},
      {tipo:"nota",testo:"Esempio: madre Cinta Senese matricola 392019 + padre Cinta Senese + parto 22/04/2023 → codice lotto 2304CC19. Unità: 2304CC1901, 2304CC1902, ..."},
      {tipo:"h3",testo:"Registrare un parto suini dalla sezione Lotti"},
      {tipo:"steps",passi:[
        "Vai in 🐷 Lotti → '+ Nuovo parto'",
        "Scegli madre e padre → il codice lotto appare subito automaticamente",
        "Inserisci data parto, nati totali, nati morti → i vivi si calcolano",
        "Facoltativo: data accoppiamento → calcola data prevista parto (+3 mesi +3 sett. +3 giorni)",
        "Tocca 'Registra parto e crea lotto'",
        "L'app crea il lotto + N unità (una per ogni nato vivo) + evento riproduttivo sulla madre",
      ]},
      {tipo:"h3",testo:"Gestire le unità di un lotto"},
      {tipo:"bullets",voci:[
        "Tocca un lotto nella lista → si apre la scheda con tutte le unità",
        "Cerca per tatuaggio completo (es. 2304CC1901) o parziale",
        "Su ogni unità (✏️): assegna sesso, destinazione (ingrasso / riproduzione / macello), matricola individuale",
        "Pulsante 📤 per registrare uscita: motivo, data, peso vivo, peso carcassa, resa % calcolata",
        "La scheda lotto mostra in sintesi: vivi / macellati / deceduti / riproduttori / maschi / femmine",
      ]},
      {tipo:"h3",testo:"Trovare un suinetto per tatuaggio"},
      {tipo:"p",testo:"Nella lista lotti: usa la barra di ricerca in cima — digita il tatuaggio completo (es. 2304CC1901) o il codice lotto (es. 2304CC19) per trovare subito l'unità."},
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
    id:"coltivazione", icon:"🌾", titolo:"Coltivazione — campi, colture, raccolta",
    contenuto:[
      {tipo:"p",testo:"La sezione 🌾 Coltivazione raccoglie i 16 campi aziendali (84,43 ettari) con la loro foto aerea, l'identificazione catastale, e tutto quello che ci si fa sopra campagna per campagna."},
      {tipo:"h3",testo:"La campagna agraria — si sceglie in cima"},
      {tipo:"p",testo:"Il selettore in alto comanda l'intera sezione: cambiando campagna cambia tutto quello che vedi sotto. La campagna va dal 1° settembre al 31 agosto, così il grano seminato a novembre e trebbiato a giugno resta tutto dentro la stessa (2025/2026, per esempio). Le campagne passate restano consultabili."},
      {tipo:"h3",testo:"Lista campi"},
      {tipo:"bullets",voci:[
        "Ogni campo mostra foto, ettari, tipo (seminativo / pascolo / arboreo / altro) e le colture della campagna scelta",
        "In cima il totale: numero campi, ettari totali, ettari seminativi",
        "Tocca un campo per aprirne la scheda",
      ]},
      {tipo:"h3",testo:"Scheda campo — mettere una coltura"},
      {tipo:"steps",passi:[
        "Apri il campo → in fondo tocca '+ Aggiungi coltura'",
        "Scegli fra Avena, Erba Medica, Erbaio Misto, Grano, Orzo, Pisello Proteico, Produzione Seme, Sulla — oppure 'Altro' e scrivi il nome",
        "Per medica e sulla, che sono poliennali, indica in quale campagna sono state seminate",
        "Salva — compare il blocco della coltura con tre linguette: Semina, Lavorazioni, Raccolta",
      ]},
      {tipo:"nota",testo:"Sullo stesso campo puoi mettere PIÙ colture nella stessa campagna: è il caso delle successioni, per esempio orzo mietuto a giugno e poi un erbaio estivo. Basta premere di nuovo '+ Aggiungi coltura'."},
      {tipo:"h3",testo:"🌱 Semina"},
      {tipo:"bullets",voci:[
        "Inserisci la quantità di seme in quintali — l'app calcola da sola i kg, i quintali/ha e i kg/ha sugli ettari di quel campo",
        "Per GRANO e ORZO puoi usare le 'dosi' al posto dei quintali: in quel caso calcola dosi/ha, e le dosi non vengono convertite in kg",
        "Per ERBAIO MISTO e PRODUZIONE SEME registra una riga per ciascuna essenza — trifoglio, avena, loietto — premendo '+ Aggiungi seme'. Puoi metterle tutte e tre, o anche una sola se hai usato solo quella",
        "Per le poliennali già seminate in una campagna precedente la semina non viene chiesta: si registrano solo lavorazioni e raccolta",
      ]},
      {tipo:"h3",testo:"🚜 Lavorazioni"},
      {tipo:"p",testo:"L'elenco delle 15 lavorazioni è sempre lì: aratura, estirpatura, erpicatura, morganatura, rippatura, spietratura, concimazione, semina, disserbo, sfalcio, ranghinatura, pressatura balle, raccolta balle, trebbiatura, irrigazione."},
      {tipo:"steps",passi:[
        "Tocca la riga della lavorazione che hai eseguito — si apre",
        "Tocca 'Registra esecuzione'",
        "Metti la data (calendario) e le giornate lavoro impiegate — anche mezze giornate, si scrive 0,5",
        "Salva: la spunta della riga diventa verde",
      ]},
      {tipo:"nota",testo:"IMPORTANTE — la stessa lavorazione si può registrare più volte. L'erba medica si sfalcia 3-4 volte l'anno e l'irrigazione si ripete per tutta l'estate: ogni volta apri la riga e aggiungi una nuova esecuzione, con la sua data e le sue giornate. Accanto al nome comparirà ×3, e la colonna giornate mostra il totale sommato."},
      {tipo:"h3",testo:"Concimazione e disserbo"},
      {tipo:"bullets",voci:[
        "Spuntando CONCIMAZIONE il form chiede quali concimi — binario, ternario, stallatico, letame o altro — e i quintali di ciascuno. Non sono alternativi: puoi sceglierne più di uno nella stessa passata",
        "Spuntando DISSERBO il form chiede il nome del prodotto (testo libero), la quantità e se è in litri o kg",
        "In entrambi i casi la quantità ad ettaro viene calcolata da sola sugli ettari del campo",
      ]},
      {tipo:"h3",testo:"🌾 Raccolta"},
      {tipo:"steps",passi:[
        "Linguetta Raccolta → '+ Registra raccolta'",
        "Scegli il PRODOTTO raccolto (non la coltura): avena, erba medica, erbaio misto, grano, orzo, paglia, pisello proteico, sulla, seme misto, seme di medica, seme di sulla, o Altro",
        "L'unità si imposta da sola — quintali per i cereali, balloni per i foraggi — ma puoi cambiarla",
        "Inserisci la quantità e la data: la resa ad ettaro si calcola da sola",
      ]},
      {tipo:"nota",testo:"La PAGLIA, il SEME DI MEDICA e il SEME DI SULLA sono sottoprodotti: escono dagli stessi ettari della coltura principale. Il programma li segna come tali e nel riepilogo mostra la loro quantità e la loro resa, senza però contare due volte ettari e giornate di lavoro. Se li trattasse da colture a sé, la superficie aziendale risulterebbe più grande di quella che possediamo."},
      {tipo:"h3",testo:"📊 Riepilogo"},
      {tipo:"p",testo:"La seconda linguetta in alto raccoglie tutti i campi della campagna scelta, raggruppati per coltura. Per ognuna: ettari dedicati, giornate lavorative, e per ciascun prodotto la quantità raccolta, la resa ad ettaro e la resa a giornata lavorativa. Si compila da solo man mano che si inseriscono i dati nei campi — non c'è niente da compilare a mano."},
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
        "Scegli motivo, data, peso vivo",
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
    id:"nuove_funzionalita", icon:"📚", titolo:"Storico aggiornamenti v29 → v64",
    contenuto:[
      {tipo:"h3",testo:"⚖️ Modifica peso carcassa su animali già usciti"},
      {tipo:"p",testo:"Spesso passa del tempo tra il momento in cui un animale esce dall'allevamento (e un operatore registra data uscita e peso vivo) e il momento in cui arriva il referto del macello con il peso della carcassa (registrato magari da un altro operatore, giorni dopo)."},
      {tipo:"bullets",voci:[
        "Apri la scheda dell'animale già uscito dall'Anagrafica (anche se il capo non è più attivo)",
        "Tocca Modifica e vai alla sezione Dati Uscita",
        "Inserisci o correggi il Peso carcassa (kg) in qualsiasi momento, anche mesi dopo",
        "La Resa % (carcassa/peso vivo) si ricalcola automaticamente ogni volta che aggiorni il dato",
        "Utile per completare progressivamente la scheda man mano che arrivano i referti dal macello",
      ]},
      {tipo:"h3",testo:"📮 Report Mensili automatici via Email"},
      {tipo:"p",testo:"Nuovo tab 📮 Email per gestire l'invio automatico di report e backup ai soggetti registrati (commercialista, direttore allevamento, consulenti, ecc.)."},
      {tipo:"bullets",voci:[
        "Registra destinatari con nome, email, ruolo e permessi (Report / Backup / Alert)",
        "Il 1° di ogni mese alle 06:00 il sistema invia automaticamente via email: report Excel (anagrafica, uscite del mese, sanitario) allegato a chi ha permesso Report",
        "Backup completo del database (file .sql) allegato a chi ha permesso Backup",
        "Pulsante 🧪 Test invio per verificare il funzionamento in qualsiasi momento senza aspettare fine mese",
        "Storico di tutti gli invii consultabile dal tab Email",
      ]},
      {tipo:"h3",testo:"🐾 Registro Sanitario — Filtri specie e scadenze"},
      {tipo:"bullets",voci:[
        "Filtro per specie (bovino/suino/ovino/tutti) nella registrazione singola e di gruppo — utile per vaccini specie-specifici",
        "Pulsante 🌾 Tutti per selezionare in un click tutti gli animali attivi dell'azienda",
        "11 tipi di evento sanitario (vaccino, richiamo, farmaco, antiparassitario, visita, intervento chirurgico, diagnostica, gravidanza, malattia, cura, altro)",
        "Box scadenze richiami in cima al Registro Sanitario (scaduti in rosso, imminenti 30gg in giallo)",
        "Badge notifica sull'icona 💉 Salute nel menu con il numero di richiami da gestire",
        "Pulsante ✓ Registra su ogni scadenza per aprire il form già pre-compilato (nessuna registrazione automatica, sempre conferma manuale)",
      ]},
      {tipo:"h3",testo:"📅 Timeline eventi unificata nella scheda animale"},
      {tipo:"p",testo:"Nella scheda di ogni animale, il tab 📅 Eventi mostra ora una timeline cronologica che unisce nascita, ingresso, qualifica riproduttore, parti, eventi sanitari e uscita, con separatori per anno e statistiche riassuntive in cima."},
      {tipo:"h3",testo:"🐷 Lotti suini — Rifatti completamente"},
      {tipo:"bullets",voci:[
        "Al salvataggio del parto suino, il lotto viene creato automaticamente nella sezione Lotti",
        "Nuovo pulsante 📦 Lotto acquistato — per registrare lotti comprati da terzi (fornitore, prezzo, N capi)",
        "Ogni unità del lotto ha 2 pulsanti: 🏷️ BDN (assegna matricola individuale) e 📤 Uscita (macellato/morto/venduto/predato/smarrito)",
        "Quando assegni un BDN a un suinetto del lotto, esce dal lotto ed entra nel Registro Suini con tutti i dati ereditati",
        "Quando tutti i suinetti hanno BDN o sono usciti, il lotto si chiude automaticamente",
      ]},
      {tipo:"h3",testo:"🧬 Genitori esterni nel form animale e parto"},
      {tipo:"p",testo:"Nel form animale e nel form parto, accanto al menu genitori aziendali, ora c'è un campo per inserire la matricola di un padre esterno (non registrato in azienda). Al salvataggio l'app crea automaticamente una scheda minima per quel padre esterno, con la razza scelta. Comparirà nel Pedigree e sarà disponibile per parti futuri."},
      {tipo:"h3",testo:"🐾 Sezione UBA — Nuova"},
      {tipo:"p",testo:"Calcolo delle Unità di Bestiame Adulto (UBA) per ogni animale con media ponderata secondo la fascia di età. Base per la ripartizione dei costi. Dati chiave:"},
      {tipo:"bullets",voci:[
        "UBA medio = coefficiente medio ponderato tra le fasce di età nel periodo di calcolo",
        "Periodo di calcolo = MAX(nascita, 1° gennaio) → oggi (o data uscita)",
        "UBA-giorni = UBA medio × giorni nel periodo (base per la ripartizione costi)",
        "Data di riferimento configurabile (utile per bilanci parziali)",
        "Filtri per specie (tutti / bovino / suino / ovino) e per stato (attivi / usciti / tutti)",
      ]},
      {tipo:"h3",testo:"🧬 Consanguineità — Nuova sezione nel Pedigree"},
      {tipo:"bullets",voci:[
        "Nella scheda animale del Pedigree c'è ora il tab 🚫 Consanguineità con elenco genitori/figli/fratelli",
        "Report Excel con due fogli: Accoppiamenti a rischio (prevenzione monta) e Capi con genealogia consanguinea",
      ]},
      {tipo:"h3",testo:"🏷️ Data registrazione BDN — Nuovo campo"},
      {tipo:"p",testo:"Ora ogni animale ha due date: data di nascita e data registrazione BDN (attribuzione ufficiale matricola). Compare nella scheda e nell'export."},
      {tipo:"h3",testo:"♀ Riproduttrice — Qualifica automatica"},
      {tipo:"bullets",voci:[
        "Il toggle riproduttore/riproduttrice è ora disponibile anche per le femmine",
        "Alla registrazione di un parto, la madre viene marcata automaticamente come riproduttrice",
        "Il Registro Riproduttori mostra sia maschi (♂) sia femmine (♀)",
      ]},
      {tipo:"h3",testo:"🏆 Selezione Genetica — Nuovi indicatori"},
      {tipo:"bullets",voci:[
        "Età al primo parto (mesi)",
        "Produttività annua stimata (figli/anno di carriera)",
        "🥩 Statistiche figli macellati: resa carcassa media, peso carcassa medio, IPG carcassa medio dei figli — indicatore genetico del valore del riproduttore per la resa",
      ]},
      {tipo:"h3",testo:"📈 IPG — Incremento Peso Giornaliero"},
      {tipo:"p",testo:"Calcolato automaticamente dove ci sono peso ingresso e peso uscita:"},
      {tipo:"bullets",voci:[
        "IPG peso vivo (kg/gg) = peso_vivo_uscita / giorni_permanenza",
        "IPG carcassa (kg/gg) = peso_carcassa / giorni_permanenza",
        "Compare nella scheda animale uscito, nel Registro Uscite, e negli export Excel",
      ]},
      {tipo:"h3",testo:"📤 Filtro Attivi / Usciti in tutte le sezioni"},
      {tipo:"p",testo:"Anagrafica, Pedigree e Selezione Genetica hanno un doppio filtro: specie + stato (Attivi / Usciti / Tutti). Default: solo Attivi. Nell'Export gli animali attivi e usciti sono in fogli separati."},
      {tipo:"h3",testo:"🐄 Nuova razza bovina: Limousine"},
      {tipo:"p",testo:"Aggiunta alle razze bovine disponibili sia nel form animale sia nel form padre esterno."},
      {tipo:"h3",testo:"👥 Parti gemellari bovini e ovini"},
      {tipo:"p",testo:"Registrando un parto con più nati vivi, l'app apre un blocco per ogni gemello con matricola, sesso e peso individuali."},
    ]
  },
  {
    id:"novita_2026", icon:"✨", titolo:"Novità v65 → v107 (settembre 2026)",
    contenuto:[
      {tipo:"h3",testo:"🌾 Sezione Coltivazione — completamente nuova"},
      {tipo:"p",testo:"I 16 campi aziendali con foto aeree, catasto, colture per campagna, semine, le 15 lavorazioni ripetibili, raccolta per prodotto e riepilogo rese. Ha una sua sezione dedicata in questa guida."},
      {tipo:"h3",testo:"⚖️ Storico Pesate"},
      {tipo:"p",testo:"Nuovo tab nella scheda animale: ogni pesata è una riga, con tipo di rilevazione e distinzione fra peso reale e stimato. Sostituisce il vecchio campo unico che si sovrascriveva. Vedi la sezione Pesate."},
      {tipo:"h3",testo:"♂ I maschi non nascono più riproduttori"},
      {tipo:"p",testo:"Correzione importante: prima ogni maschio veniva marcato riproduttore automaticamente alla nascita. Ora lo diventa solo con l'attivazione esplicita del toggle, e viene registrata la data di qualifica. Le femmine restano automatiche al primo parto."},
      {tipo:"h3",testo:"💰 Costi nella scheda animale"},
      {tipo:"p",testo:"Nuovo tab 💰 Costi: mostra anno per anno i costi calcolati dalla Contabilità Industriale, con UBA-giorni, mantenimento, quota scaricata sui figli e cumulato. Sola lettura."},
      {tipo:"h3",testo:"⚠️ Avviso costo di acquisto mancante"},
      {tipo:"p",testo:"Badge rosso in Anagrafica e avviso nella scheda quando un animale acquistato non ha il prezzo. Lo stesso avviso compare nella Contabilità Industriale, ed è lo stesso campo: si compila da una parte e sparisce da entrambe."},
      {tipo:"h3",testo:"📏 Peso all'ingresso"},
      {tipo:"p",testo:"Nuovo campo accanto a peso nascita e peso attuale, per registrare quanto pesava l'animale quando è entrato in azienda. Serve soprattutto per gli acquistati, di cui il peso di nascita vero non si conosce."},
      {tipo:"h3",testo:"🐷 I costi seguono il suinetto quando prende il BDN"},
      {tipo:"p",testo:"Quando assegni un BDN a un'unità di lotto, i costi che quella unità aveva già maturato mentre stava nel lotto vengono ricollegati alla nuova scheda animale, invece di ripartire da zero."},
      {tipo:"h3",testo:"📅 Giorni di vita nell'export"},
      {tipo:"p",testo:"Nuova colonna nell'export Excel degli animali, subito dopo Data uscita: i giorni fra nascita e uscita, che prima andavano calcolati a mano ogni volta."},
      {tipo:"h3",testo:"🗺️ Barra dei moduli riordinata"},
      {tipo:"p",testo:"Tolte dalla barra 📊 Costi, 🧾 Origine e 🏭 Struttura, il cui lavoro è passato alla Contabilità Industriale. Aggiunta 🌾 Coltivazione. Nessun dato è stato cancellato."},
      {tipo:"h3",testo:"🔢 Numero di versione nel menu"},
      {tipo:"p",testo:"Toccando il proprio nome in alto a destra, sotto il ruolo compare ora la versione dell'app. Serve a capire in un attimo se un aggiornamento è arrivato davvero o se il browser sta mostrando una copia vecchia: in quel caso basta ricaricare con Ctrl+F5."},
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
        {item.testo}
      </div>
    );
    if (item.tipo==="p") return (
      <p key={i} style={{fontSize:14,color:C.text,margin:"0 0 10px",lineHeight:1.6}}>
        {item.testo}
      </p>
    );
    if (item.tipo==="steps") return (
      <ol key={i} style={{paddingLeft:20,margin:"0 0 12px"}}>
        {item.passi.map((p,j)=>(
          <li key={j} style={{fontSize:14,color:C.text,marginBottom:6,lineHeight:1.5}}>{p}</li>
        ))}
      </ol>
    );
    if (item.tipo==="bullets") return (
      <ul key={i} style={{paddingLeft:20,margin:"0 0 12px"}}>
        {item.voci.map((v,j)=>(
          <li key={j} style={{fontSize:14,color:C.text,marginBottom:6,lineHeight:1.5}}>{v}</li>
        ))}
      </ul>
    );
    if (item.tipo==="nota") return (
      <div key={i} style={{background:C.primary+"12",border:`1px solid ${C.primary}33`,
        borderRadius:10,padding:"10px 14px",fontSize:13,color:C.text,
        margin:"8px 0 12px",lineHeight:1.5}}>
        {item.testo}
      </div>
    );
    if (item.tipo==="tabella") return (
      <div key={i} style={{margin:"0 0 12px"}}>
        {item.righe.map((r,j)=>(
          <div key={j} style={{display:"flex",gap:12,padding:"8px 0",
            borderBottom:`1px solid ${C.border}`,fontSize:13}}>
            <div style={{fontWeight:700,color:C.primary,minWidth:110,flexShrink:0}}>{r[0]}</div>
            <div style={{color:C.text,flex:1}}>{r[1]}</div>
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
          <span style={{fontSize:18,fontWeight:800}}>{s.icon} {s.titolo}</span>
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
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>📖 Guida per Allevatori</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",marginTop:4}}>
          App Allevamento — Podere Verde · v28
        </div>
      </div>
      <div style={{padding:"0 16px"}}>
        <div style={{background:C.green+"15",border:`1px solid ${C.green}33`,
          borderRadius:14,padding:"14px 16px",marginBottom:16,fontSize:13,
          color:C.text,lineHeight:1.6}}>
          Tutti i dati vengono <strong>salvati automaticamente</strong> nel database condiviso.
          Ogni operatore vede gli stessi dati in tempo reale da qualsiasi dispositivo.
        </div>
        {SEZIONI.map(s=>(
          <button key={s.id} onClick={()=>setAperta(s.id)}
            style={{display:"flex",alignItems:"center",gap:14,width:"100%",
              background:C.card,border:`1px solid ${C.border}`,borderRadius:16,
              padding:"14px 16px",marginBottom:10,cursor:"pointer",textAlign:"left",
              boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
            <span style={{fontSize:28}}>{s.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15,color:C.text}}>{s.titolo}</div>
            </div>
            <span style={{color:C.muted,fontSize:18}}>›</span>
          </button>
        ))}
        <div style={{textAlign:"center",padding:"20px 0",fontSize:12,color:C.muted}}>
          App Allevamento v28 · Podere Verde · podereverdeapp.it
        </div>
      </div>
    </div>
  );
}
