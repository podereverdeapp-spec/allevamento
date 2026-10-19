// v139 — Report «Piccioni ai box bovini» del Tenente Contabilità (16/10/2026),
// generato dal file report_piccioni_box_bovini.md (MD5 e7985bf03e65c102dca14bc945bdbd7b).
// Il testo NON va modificato qui: le correzioni le fa il Tenente nel quaderno.
const QUADERNO = {
 "titolo": "Piccioni ai box bovini",
 "intro": [
  {
   "tipo": "p",
   "testo": "Circa 200 piccioni mangiano dalle mangiatoie dei 5 box bovini e si sono abituati al cannoncino. Questo documento fa tre cose. Misura il danno. Spiega, con le prove scientifiche, quale soluzione funziona davvero e quali no. Descrive come costruirla e come gestirla ogni giorno."
  }
 ],
 "capitoli": [
  {
   "id": "cap01",
   "titolo": "1. Il danno",
   "contenuto": [
    {
     "tipo": "h3",
     "testo": "1.1 Quanto mangia un piccione"
    },
    {
     "tipo": "p",
     "testo": "Un piccione adulto mangia **circa 30 grammi di granaglie al giorno.** Le fonti consultate danno valori vicini:"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Fonte",
      "Grammi al giorno"
     ],
     "righe": [
      [
       "Comune di Norimberga, ufficio ambiente",
       "25–40"
      ],
      [
       "Associazione Hamburger Stadttauben",
       "20 per sopravvivere, 30 per vivere, 40 per vivere molto bene"
      ],
      [
       "Brieftaubenshop, alimentazione dei colombi",
       "30–50"
      ],
      [
       "Gandolf Taubenfreunde, scheda del piccione di città",
       "40"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "Per il calcolo uso **30 grammi**, con l'intervallo 25–40 come margine. In un anno sono **10,95 kg di mangime per piccione** (30 g × 365 giorni)."
    },
    {
     "tipo": "h3",
     "testo": "1.2 Quanto vale"
    },
    {
     "tipo": "p",
     "testo": "Il prezzo è quello reale pagato da Podere Verde: farina d'orzo della Cooperativa Ceri 0,28–0,31 €/kg; Finissaggio Bovini Veronesi 397–408 €/t. Il calcolo usa gli estremi, 0,28 €/kg e 0,408 €/kg."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "",
      "Per 1 piccione",
      "100 piccioni",
      "200 piccioni",
      "300 piccioni"
     ],
     "righe": [
      [
       "**Mangime all'anno, a 30 g al giorno**",
       "10,95 kg",
       "1.095 kg",
       "2.190 kg",
       "3.285 kg"
      ],
      [
       "Valore a 0,28 €/kg (farina d'orzo)",
       "3,07 €",
       "306,60 €",
       "613,20 €",
       "919,80 €"
      ],
      [
       "Valore a 0,408 €/kg (Finissaggio)",
       "4,47 €",
       "446,76 €",
       "893,52 €",
       "1.340,28 €"
      ],
      [
       "**Intervallo a 25–40 g al giorno**",
       "9,1–14,6 kg",
       "913–1.460 kg",
       "1.825–2.920 kg",
       "2.738–4.380 kg"
      ],
      [
       "Valore a 25–40 g al giorno",
       "2,56–5,96 €",
       "256–596 €",
       "511–1.191 €",
       "767–1.787 €"
      ]
     ]
    },
    {
     "tipo": "immagine",
     "src": "/guida/piccioni/fig1_danno.png",
     "didascalia": "Figura 1 – Mangime mangiato dai piccioni in un anno, a 30 g al giorno per piccione"
    },
    {
     "tipo": "p",
     "testo": "**Ipotesi dichiarata:** il calcolo suppone che i piccioni prendano tutto il loro cibo dalle nostre mangiatoie. Se una parte la trovano nei campi, il danno diretto è minore. Se il numero cresce, il danno cresce in proporzione."
    },
    {
     "tipo": "h3",
     "testo": "1.3 I danni che non si possono ancora misurare in euro"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Spreco e sporco:** i piccioni spargono e sporcano il mangime con il guano. In un'indagine tra gli allevatori di vacche da latte dello Stato di Washington (Elser e colleghi, 2019) lo spreco causato dagli uccelli era dello stesso ordine del mangime mangiato. Quegli uccelli erano soprattutto storni, quindi il dato non si trasferisce direttamente ai nostri piccioni."
      },
      {
       "testo": "**Sanità:** Ohio State University indica Salmonella, Escherichia coli e criptococco tra i rischi portati dagli uccelli negli allevamenti. Nello studio di Washington la Salmonella dichiarata dagli allevatori era associata alla presenza di oltre 10.000 uccelli al giorno: non è il nostro ordine di grandezza, ma il rischio esiste."
      },
      {
       "testo": "**Strutture:** guano su travi, mangiatoie e attrezzi; pulizia con mascherina e guanti."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**In sintesi:** con 200 piccioni il solo mangime perso vale **circa 600–900 euro all'anno.** Il costo della soluzione va confrontato con questa cifra, più i danni sanitari che non si contano in euro."
    }
   ]
  },
  {
   "id": "cap02",
   "titolo": "2. Che cosa funziona e che cosa no",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "La rassegna scientifica più completa (Giunchi e colleghi, Università di Pisa, 2012) e l'esperto svizzero Haag-Wackernagel (Università di Basilea) concordano: **i risultati duraturi si ottengono solo togliendo il cibo e i posti dove nidificare.** Prova principale: a Venezia, dopo il divieto di dare mais nel 2008, i piccioni in piazza San Marco sono scesi da oltre 10.000 a circa 1.000."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Metodo",
      "Verdetto",
      "Motivo"
     ],
     "righe": [
      [
       "**Togliere l'accesso al cibo** (reti)",
       "**Funziona: è la soluzione**",
       "Venezia: da oltre 10.000 a circa 1.000. Le reti sono indicate come molto efficaci e durature"
      ],
      [
       "**Chiudere i posti dove nidificano**",
       "Funziona",
       "Perugia: −23% della popolazione in un anno"
      ],
      [
       "Cannoncino",
       "Solo come rinforzo",
       "Gli uccelli si abituano, anche con colpi casuali. Va usato solo quando i piccioni ci sono e spostato ogni 2–3 giorni"
      ],
      [
       "Punte smussate o affilate",
       "No",
       "Spostano il piccione di pochi metri, sui campi vicini. Le affilate feriscono: rischio di maltrattamento (codice penale, articolo 544-ter)"
      ],
      [
       "Fili tesi",
       "No",
       "Gli uccelli molto motivati li superano, e i nostri lo sono: c'è cibo"
      ],
      [
       "Scossa elettrica",
       "No",
       "Nessuna prova indipendente. Protegge il posatoio, non la mangiatoia. Polvere e paglia la mettono in corto"
      ],
      [
       "Laser",
       "No",
       "Classe 3B: non si può puntare dove i bovini mangiano. Li spaventerebbe"
      ],
      [
       "Magneti, ultrasuoni, gel",
       "No",
       "«Tutti i sistemi antipiccioni sviluppati finora che agiscono a distanza si sono dimostrati inefficaci» (Haag-Wackernagel)"
      ],
      [
       "Gabbie-trappola e abbattimento",
       "Da sole no; **sì come complemento dopo la tenda** (sezione 4)",
       "«Nessuno studio scientifico ha dimostrato l'efficacia» da sole: la popolazione compensa perdite fino a oltre il 30% all'anno. I piani di controllo le ammettono solo insieme alla rimozione del cibo"
      ],
      [
       "Contraccettivo (nicarbazina)",
       "No",
       "Al massimo −59% di nascite, solo finché lo si dà. Costa 18–19 € per piccione all'anno, cioè 3.600–3.800 € per 200 piccioni"
      ],
      [
       "Colombaie con sostituzione delle uova",
       "No",
       "Nessuna prova di efficacia. I piccioni depongono di più"
      ]
     ]
    }
   ]
  },
  {
   "id": "cap03",
   "titolo": "3. La soluzione: una sola voliera per i 5 box",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "I piccioni arrivano al cibo per **due strade:**"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Da fuori,** sul lato dove si riempiono le mangiatoie."
      },
      {
       "testo": "**Da dentro:** scendono nella zona scoperta, camminano sotto la tettoia e passano dalla barriera. L'apertura per la testa del bovino è sempre più larga di un piccione."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "Per chiuderle entrambe, la fila dei 5 box diventa **un'unica voliera,** fatta di tre parti:"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**A – Copertura** in rete sopra le zone scoperte, tesa su funi d'acciaio dalla gronda delle tettoie ai pali sul lato del corridoio."
      },
      {
       "testo": "**B – Pareti** in rete sul perimetro (lato corridoio, testata nord e testata sud), da terra alla copertura, con porte per persone, trattore e incastrino."
      },
      {
       "testo": "**C – Tenda di alimentazione** sul lato delle mangiatoie, secondo lo schizzo del Dottore: rete robusta ancorata alla gronda, tubo zavorrato a terra."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Conseguenza importante:** le tettoie restano dentro la voliera. La rete orizzontale nel sottotetto, prevista nel primo report, **non serve più.** Basta chiudere in rete le testate (timpani) delle tettoie."
    },
    {
     "tipo": "immagine",
     "src": "/guida/piccioni/fig2_pianta_voliera.png",
     "didascalia": "Figura 2 – Pianta: una sola voliera per i 5 box"
    },
    {
     "tipo": "immagine",
     "src": "/guida/piccioni/fig3_sezione_voliera.png",
     "didascalia": "Figura 3 – Sezione: la voliera chiude tutto, i bovini lavorano e mangiano come oggi"
    },
    {
     "tipo": "h3",
     "testo": "3.1 La tenda di alimentazione"
    },
    {
     "tipo": "immagine",
     "src": "/guida/piccioni/fig4_tenda.png",
     "didascalia": "Figura 4 – La tenda di alimentazione nelle due posizioni"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Durante il pasto:** la tenda scende inclinata dalla gronda a terra, oltre la mangiatoia. Il bovino mangia da dentro, il piccione resta fuori."
      },
      {
       "testo": "**Durante il riempimento:** il tubo si sposta a mano e si appoggia a terra al piede del pilastro. La mangiatoia è libera da fuori e la rete chiude il fronte ai bovini, così si riempie senza teste in mezzo."
      },
      {
       "testo": "**Nessuna carrucola e nessun gancio a terra:** tiene tutto il peso del tubo (scelta del Dottore). Solo in alto resta la barra in gronda a cui è legata la rete."
      },
      {
       "testo": "**Rete robusta** (filo 2,2 mm): resiste a teste e corna e alla manovra quotidiana."
      },
      {
       "testo": "**Distanza dalla testa:** il tubo, in posizione di pasto, va appoggiato oltre la portata della testa protesa del bovino. La misura va presa sui nostri capi e segnata a terra, così l'operaio rimette il tubo sempre nello stesso punto."
      },
      {
       "testo": "**Tubo di zavorra:** in acciaio zincato, abbastanza pesante da non muoversi con il vento e con le spinte dei bovini, ma spostabile a mano. Tubi da 1½ pollice pesano circa 3,6 kg al metro, da 2 pollici circa 5,1 kg al metro (serie media, norma UE 10255): il peso si regola con il diametro o riempiendo il tubo di sabbia."
      },
      {
       "testo": "**Lunghezza dei tratti:** il tubo di ogni box si divide in tratti che una persona sposta da sola. Per la movimentazione manuale dei carichi la massa di riferimento per un uomo adulto è 25 kg: per esempio un tratto di tubo da 1½ pollice lungo 5 m pesa circa 18 kg, più la rete. Tra un tratto e l'altro le reti si sovrappongono di almeno 30 cm, così non resta fessura."
      },
      {
       "testo": "**Chiusure:** ai due capi della fila servono triangoli fissi di rete tra tenda e pilastro. A terra, una bandella in gomma chiude le fessure del terreno."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "3.2 Dettagli costruttivi"
    },
    {
     "tipo": "immagine",
     "src": "/guida/piccioni/fig5_dettagli.png",
     "didascalia": "Figura 5 – Dettagli costruttivi"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Bordi:** ogni bordo di rete si lega a una fune d'acciaio tesa con tenditore, con fascette o cordino ogni 20–30 cm. Nessun bordo libero: dalle fessure il piccione entra e resta intrappolato."
      },
      {
       "testo": "**Attacco alla tettoia:** una barra fissata lungo la gronda, a cui si legano copertura e tenda senza lasciare luce."
      },
      {
       "testo": "**Pali:** sul perimetro lato corridoio e, se la campata è lunga, alcuni dentro i box, protetti dagli urti dei bovini. Numero e posizione li decide l'installatore in base alle misure."
      },
      {
       "testo": "**Porte:** per le persone, rete con cerniera lampo da 200 cm; per il trattore, telo di rete scorrevole su fune; un passaggio verso l'incastrino."
      },
      {
       "testo": "**Altezza libera H:** deve far passare il trattore con la balla alzata sopra la rastrelliera. **Misura da prendere: è la domanda ancora aperta.**"
      },
      {
       "testo": "**Vento:** la maglia da 50 mm fa poca vela, ma funi e pali vanno dimensionati dall'installatore per i venti dell'Agro Romano. Per la tenda, senza ganci, il peso del tubo va verificato nei primi giorni di vento forte: se si solleva, si aumenta il peso."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "3.3 Materiali, quantità e prezzi trovati"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Parte",
      "Materiale",
      "Fornitore e dati verificati",
      "Prezzo trovato",
      "Quantità"
     ],
     "righe": [
      [
       "A – Copertura",
       "Rete voliera annodata, maglia 50 mm",
       "Mister Nets: polietilene, filo 1,2 mm, stabilizzata contro i raggi ultravioletti, 48 g/m², su misura",
       "1,26 € + Iva (il sito non indica l'unità; quasi certamente al m²)",
       "246 m² più i sormonti (somma delle zone scoperte: 53 + 37 + 48 + 54 + 54)"
      ],
      [
       "A – Copertura, alternativa",
       "Rete in polietilene nera, maglia 50 mm",
       "Ziwi: filo 1,0 mm, stabilizzata contro i raggi ultravioletti, 21 g/m²",
       "0,65 € Iva compresa (anche qui quasi certamente al m²)",
       "come sopra"
      ],
      [
       "B – Pareti, primi 2 m da terra; C – Tenda",
       "Rete annodata ad alta tenacità, maglia 45 mm",
       "Retificio Italia: polietilene ad alta tenacità, filo 2,2 mm, annodata a mano, stabilizzata contro i raggi ultravioletti, 90 g/m², su misura",
       "1,65 €/m² + Iva",
       "dipende da lunghezza del perimetro e del fronte mangiatoie: da misurare"
      ],
      [
       "B – Pareti, sopra i 2 m",
       "Rete voliera maglia 50 mm",
       "come la copertura",
       "come la copertura",
       "da misurare"
      ],
      [
       "Funi, tenditori, pali, barre, tubi di zavorra",
       "Acciaio zincato o inox",
       "installatore",
       "a preventivo",
       "dal progetto dell'installatore"
      ],
      [
       "Posa",
       "Installatore di reti antivolatili",
       "a preventivo: Rentokil, Birdstop, Ekonore, Cortesini Tetti (questi ultimi tre non ancora verificati)",
       "a preventivo",
       "almeno 3 preventivi"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Costo noto oggi:** solo la rete della copertura, circa 310 € + Iva (246 m² × 1,26 €, se il prezzo è al m²). Pali, funi, pareti, tenda e posa vanno chiesti a preventivo: il confronto si fa con il danno di circa 600–900 € all'anno."
    },
    {
     "tipo": "p",
     "testo": "**Foto dei prodotti:** i siti dei fornitori bloccano lo scaricamento delle immagini. Le foto si vedono alle pagine indicate nelle fonti."
    }
   ]
  },
  {
   "id": "cap04",
   "titolo": "4. Gabbie di cattura: il complemento dopo la tenda",
   "contenuto": [
    {
     "tipo": "h3",
     "testo": "4.1 Quando servono"
    },
    {
     "tipo": "p",
     "testo": "Da sole le gabbie non riducono la popolazione: i piccioni catturati vengono sostituiti da altri. Dopo la tenda, invece, servono a togliere i piccioni abituati che restano a girare intorno ai box, perché senza cibo non ne arrivano di nuovi. I piani di controllo le ammettono solo così, insieme alla rimozione del cibo e dei siti di nido. Sono anche più efficaci: finché le mangiatoie sono aperte, il grano della gabbia attira poco; senza cibo intorno, la gabbia diventa l'unica fonte."
    },
    {
     "tipo": "h3",
     "testo": "4.2 Le regole (esempio: piano della Provincia di Modena)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Cattura solo dentro un **piano di controllo autorizzato** (legge 157/1992, articoli 19 e 19 bis). **Per il Lazio non ho trovato un piano:** prima di usare la gabbia va chiesto alla Regione Lazio se esiste e se un'azienda agricola può aderirvi."
      },
      {
       "testo": "**Chi:** personale degli enti o, su loro incarico, proprietari e conduttori dei fondi **con licenza di caccia**, assicurati."
      },
      {
       "testo": "**Quando:** da inizio novembre a fine marzo."
      },
      {
       "testo": "**Controllo:** in modo che nessun uccello muoia dentro; le altre specie si liberano subito."
      },
      {
       "testo": "**Destinazione:** soppressione secondo le norme; carcasse interrate ad almeno 50 cm di profondità e a 200 m dall'acqua, oppure incenerite. **Vietato mangiare o vendere i piccioni.**"
      },
      {
       "testo": "**Comprare la gabbia è libero, usarla no.**"
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "4.3 Come funziona"
    },
    {
     "tipo": "immagine",
     "src": "/guida/piccioni/trappola_funzionamento.png",
     "didascalia": "Figura 6 – Gabbia a 2 entrate basculanti: vista d'insieme, sezione dell'ingresso e sequenza d'uso"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Ingresso a basculante:** una fila di aste appese in alto a una barra, che appoggiano in basso su una barra di battuta. Il piccione spinge e le aste si alzano verso l'interno; dietro di lui ricadono da sole. Spingendo da dentro, le aste battono contro la battuta e non si aprono."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Sequenza d'uso:**"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Abituazione, 5–7 giorni:** aste bloccate alzate, grano dentro e qualche chicco davanti agli ingressi."
      },
      {
       "testo": "**Cattura:** aste sbloccate; chi entra resta dentro."
      },
      {
       "testo": "**Dentro la gabbia:** grano, acqua e ombra."
      },
      {
       "testo": "**Controllo almeno una volta al giorno,** più volte nei primi giorni; altre specie liberate subito."
      },
      {
       "testo": "**Destinazione** come prevede il piano autorizzato."
      }
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Posizione:** dove i piccioni già si posano, fuori dalla portata dei bovini e lontano dal cannoncino."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "4.4 Quanti piccioni cattura"
    },
    {
     "tipo": "p",
     "testo": "Il produttore della gabbia scelta non dichiara la capacità. La stima viene dalle gabbie simili che la dichiarano, rapportata alla superficie del fondo:"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Gabbia",
      "Superficie del fondo",
      "Piccioni dichiarati",
      "Piccioni per m²"
     ],
     "righe": [
      [
       "Tomahawk 502R (Stati Uniti)",
       "0,37 m²",
       "oltre 15",
       "circa 40"
      ],
      [
       "LCS Pigeon Trap (Stati Uniti)",
       "0,29 m²",
       "comodamente fino a 14",
       "circa 48"
      ],
      [
       "Scubla (Italia)",
       "0,40 m²",
       "15–30",
       "37–75"
      ],
      [
       "**Digitalbird GBP1**",
       "**0,60 m²**",
       "non dichiarato",
       "**stima: 25–30 per volta**"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "La stima di 25–30 è un calcolo in proporzione, non un dato del produttore. Il numero catturato al giorno dipende da quante volte si vuota la gabbia: con 200 piccioni intorno, nei primi giorni va vuotata più volte."
    },
    {
     "tipo": "h3",
     "testo": "4.5 Dove comprarla"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Gabbia",
      "Venditore",
      "Dati verificati",
      "Prezzo"
     ],
     "righe": [
      [
       "**Gabbia di cattura piccioni a 2 entrate grande (GBP1) – consigliata**",
       "Digitalbird Srl, Italia (digitalbirdshop.it)",
       "100 × 60 × 30 cm, acciaio zincato, maglia 25 × 20 mm, 2 entrate basculanti, pieghevole",
       "110,00 € Iva compresa"
      ],
      [
       "Gabbia di cattura piccioni a 2 entrate piccola (GBP11)",
       "Digitalbird Srl, Italia",
       "65 × 55 × 33 cm, stessi materiali, disponibile (14 pezzi)",
       "103,00 € Iva compresa"
      ],
      [
       "Gabbia per piccioni",
       "Tecnoambiente, Italia",
       "100 × 60 × 30 cm, zincata, 2 ingressi a pettine",
       "205,00 €, esaurita"
      ],
      [
       "Gabbia di cattura 103 × 42 × 32 cm",
       "Leroy Merlin Italia, venduta e spedita da LaTiendadelJardin.com (Spagna)",
       "2 porte che si aprono solo verso l'interno, sportello superiore; la scheda ha dati incoerenti sul colore",
       "170,95 €"
      ],
      [
       "Trappola per piccioni a un compartimento",
       "BirdGard (birdgard.it, società BirdGard Iberia)",
       "misure non indicate nell'elenco",
       "103,42 €"
      ],
      [
       "Trappola per piccioni a doppia porta",
       "Scubla, Italia",
       "100 × 40 × 30 cm, 36 kg, 15–30 piccioni",
       "su richiesta, **solo enti pubblici**"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Scelta:** Digitalbird GBP1. È la più grande tra quelle acquistabili da un'azienda, è zincata, ha due entrate basculanti e il prezzo più basso. Per cominciare ne basta una; una seconda solo se il conteggio dopo la tenda mostra un gruppo numeroso."
    }
   ]
  },
  {
   "id": "cap05",
   "titolo": "5. Procedura di costruzione",
   "contenuto": [
    {
     "tipo": "h3",
     "testo": "Fase 0 – Misure e osservazione (prima settimana)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Contare i piccioni per 3 giorni, alla stessa ora, prima del pasto. È il numero di partenza."
      },
      {
       "testo": "☐ Osservare da dove arrivano alla mangiatoia: da fuori, da dentro, o da entrambi i lati."
      },
      {
       "testo": "☐ Misurare per ogni box: lunghezza del fronte mangiatoie, altezza della gronda, profondità e larghezza della zona scoperta."
      },
      {
       "testo": "☐ Misurare l'altezza libera H per il trattore con la balla alzata, e la larghezza delle porte."
      },
      {
       "testo": "☐ Misurare fin dove arriva la testa protesa del bovino oltre la barriera."
      },
      {
       "testo": "☐ Chiedere almeno 3 preventivi, consegnando a ogni installatore queste misure e le figure 2–5."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Fase 1 – Subito, senza spese"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Concentrato dosato per essere finito in poco tempo, avanzi tolti dopo ogni pasto."
      },
      {
       "testo": "☐ Pulizia giornaliera degli spandimenti di granella e mangime in tutta l'azienda."
      },
      {
       "testo": "☐ Cannoncino rimesso in uso con le regole del vademecum (sezione 6)."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Fase 2 – Tenda di alimentazione"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Montare la barra in gronda, la tenda, il tubo di zavorra a tratti e la bandella sul primo box. Segnare a terra la posizione del tubo durante il pasto."
      },
      {
       "testo": "☐ Collaudo di una settimana: manovra, distanza dalle teste, tenuta a terra, vento. Correggere e poi montare gli altri 4 box."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Fase 3 – Voliera"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Pali e funi perimetrali, poi copertura (A), poi pareti (B) e porte."
      },
      {
       "testo": "☐ Prima di chiudere: togliere i nidi vuoti dal sottotetto e pulire il guano bagnandolo, con mascherina e guanti. Per i nidi con uova o piccoli chiedere al veterinario."
      },
      {
       "testo": "☐ Chiudere l'ultima parete a metà giornata, quando i piccioni sono fuori. Controllare che nessuno resti dentro e far uscire gli eventuali rimasti dalle porte aperte."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Fase 4 – Verifica"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Conteggio settimanale per 8 settimane, stesso giorno e stessa ora, nel registro."
      },
      {
       "testo": "☐ Risultato atteso: nessun piccione dentro la voliera. Ogni piccione dentro significa un varco da trovare e chiudere."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Fase 5 – Gabbia di cattura (solo con autorizzazione, novembre–marzo)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Se dopo la tenda resta un gruppo stabile di piccioni intorno ai box, chiedere alla Regione Lazio l'adesione al piano di controllo."
      },
      {
       "testo": "☐ Con l'autorizzazione: comprare la gabbia, abituare i piccioni per 5–7 giorni, poi catturare con controllo giornaliero."
      },
      {
       "testo": "☐ Registrare i piccioni catturati e continuare il conteggio settimanale."
      }
     ]
    }
   ]
  },
  {
   "id": "cap06",
   "titolo": "6. Vademecum di gestione",
   "contenuto": [
    {
     "tipo": "h3",
     "testo": "Ogni pasto"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "Alzare la tenda: spostare a mano il tubo al piede del pilastro."
      },
      {
       "testo": "Riempire la mangiatoia."
      },
      {
       "testo": "Riportare il tubo sul segno a terra, con i tratti sovrapposti, e controllare che la bandella tocchi terra per tutta la lunghezza."
      },
      {
       "testo": "Raccogliere gli spandimenti fuori dalla tenda."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Cannoncino"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Acceso solo nelle fasce in cui i piccioni ci sono, soprattutto durante il riempimento; mai a orario fisso."
      },
      {
       "testo": "Spostato ogni 2–3 giorni, cambiando posizione e direzione."
      },
      {
       "testo": "Lontano dall'incastrino e mai puntato verso i box; spento durante trattamenti, pesate e spostamenti degli animali."
      },
      {
       "testo": "Sotto la bocca niente erba secca e niente bombole; mai di notte."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Ogni settimana"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Conteggio dei piccioni nel registro."
      },
      {
       "testo": "☐ Giro della voliera: buchi, bordi slegati, fessure a terra, piccioni intrappolati da liberare."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Ogni mese e dopo ogni vento forte"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "☐ Tensione di funi e tenditori, cerniere, usura della tenda e della bandella, legature tra rete e tubo."
      }
     ]
    }
   ]
  },
  {
   "id": "cap07",
   "titolo": "7. Fonti",
   "contenuto": [
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "[Giunchi e colleghi 2012, «Feral Pigeons: Problems, Dynamics and Control Methods»](https://cdn.intechopen.com/pdfs/29607/InTech-Feral_pigeons_problems_dynamics_and_control_methods.pdf)"
      },
      {
       "testo": "[Haag-Wackernagel, Università di Basilea – Ufficio federale svizzero di sicurezza alimentare e veterinaria](https://www.blv.admin.ch/dam/blv/it/dokumente/tiere/heim-und-wildtierhaltung/taubenabwehrsysteme.pdf.download.pdf/Standpunkt_Daniel_Haag_Wackernagel_Sistemi_dissuasione_piccioni.pdf)"
      },
      {
       "testo": "[Comune di Norimberga – fabbisogno alimentare del piccione](https://www.nuernberg.de/internet/umweltreferat/taubenfuetterungsverbot.html)"
      },
      {
       "testo": "[Hamburger Stadttauben – 30 g al giorno](https://www.hamburgerstadttauben.de/dass-stadttauben-eigentlich-koernerfresser-sind-und-davon-30-g-am-tag-benoetigen/)"
      },
      {
       "testo": "[Brieftaubenshop – alimentazione dei colombi](https://www.brieftaubenshop.de/en/what-do-pigeons-eat/)"
      },
      {
       "testo": "[Gandolf Taubenfreunde – scheda del piccione di città](https://www.gandolfstaubenfreunde.de/wp-content/uploads/2022/08/GTH_Grundlagen-Stadttauben-1.pdf)"
      },
      {
       "testo": "[Elser e colleghi 2019, uccelli negli allevamenti da latte, PLoS ONE](https://pmc.ncbi.nlm.nih.gov/articles/PMC6752787)"
      },
      {
       "testo": "[Ohio State University, uccelli negli allevamenti: economia e prevenzione](https://dairy.osu.edu/newsletter/buckeye-dairy-news/volume-24-issue-6/nuisance-bird-economics-prevention-and-control)"
      },
      {
       "testo": "[Dipartimento dell'Agricoltura degli Stati Uniti – cannoni a gas e dissuasori non chimici](https://www.aphis.usda.gov/sites/default/files/28-nonchemical-deterrent.pdf)"
      },
      {
       "testo": "[Mister Nets – rete voliera 50 mm su misura](https://www.misternets.com/shop/caccia-pesca/reti-voliere/rete-voliera-su-misura-50mm/)"
      },
      {
       "testo": "[Ziwi – rete in polietilene 50×50 mm](https://ziwi-dissuasori-piccioni.it/Rete-in-polietilene-nera-maglia-50x50-mm/650S10100)"
      },
      {
       "testo": "[Retificio Italia – reti da protezione filo 2,2 mm](https://retificioitalia.it/rete-da-protezione/)"
      },
      {
       "testo": "[Rentokil – reti barriera contro i volatili](https://www.rentokil.com/it/servizi/disinfestazione-topi-insetti-volatili/allontanamento-volatili/dissuasori-piccioni-volatili/rete-barriera-contro-volatili)"
      },
      {
       "testo": "[Provincia di Modena – piano di controllo del colombo di città](https://provincia-modena.e-pal.it/AttiVisualizzatore/download/allegato/127533?fId=127534&sbustato=true)"
      },
      {
       "testo": "[Digitalbird – gabbia di cattura a 2 entrate grande](https://www.digitalbirdshop.it/gabbie-cattura-colombi-piccioni/365-gabbia-di-cattura-piccioni-a-2-entrate.html)"
      },
      {
       "testo": "[Digitalbird – gabbia di cattura a 2 entrate piccola](https://www.digitalbirdshop.it/gabbie-cattura-colombi-piccioni/378-gabbia-di-cattura-piccioni-a-2-entrate-piccola.html)"
      },
      {
       "testo": "[Tecnoambiente – gabbia per piccioni](https://shop.tecnoambiente-ro.it/prodotto/gabbie-piccioni/)"
      },
      {
       "testo": "[Leroy Merlin – gabbia di cattura 103 × 42 × 32 cm](https://www.leroymerlin.it/prodotti/gabbia-di-cattura-per-piccioni-gabbia-trappola-per-animali-vivi-uccelli-103x42x32-cm-85578037.html)"
      },
      {
       "testo": "[BirdGard – trappole per uccelli](https://www.birdgard.it/trappole-per-uccelli/)"
      },
      {
       "testo": "[Scubla – trappola per piccioni](https://scubla.it/it/gestione-faunistica/strumenti-di-gestione-e-cattura/trappola-per-piccioni-pigeon-trap/)"
      },
      {
       "testo": "[Tomahawk 502R](https://www.domyown.com/tomahawk-pigeon-trap-double-door-model-502r-p-3149.html)"
      },
      {
       "testo": "[LCS Pigeon Trap](https://lcsupply.com/products/lcs-pigeon-trap)"
      }
     ]
    }
   ]
  }
 ]
};
export default QUADERNO;
