// v137 — Quaderno «Sanità e benessere dei suini» del Tenente Contabilità (11/10/2026),
// generato dal file quaderno_sanita_benessere_suini.md (MD5 536933ada403b64d662acce3683c5f1c).
// Il testo NON va modificato qui: le correzioni le fa il Tenente nel quaderno.
const QUADERNO = {
 "titolo": "Quaderno — Sanità e benessere dei suini, dai suinetti agli adulti — Podere Verde",
 "intro": [
  {
   "tipo": "p",
   "testo": "Redatto dal Tenente Contabilità per il Dott. Filippo Bizzarri — 11 ottobre 2026. Accompagna il «Protocollo benessere suinetti» e lo studio «fabbisogni_per_classe_e_razioni_attuali»."
  },
  {
   "tipo": "p",
   "testo": "**Come leggere**"
  },
  {
   "tipo": "elenco",
   "numerato": false,
   "voci": [
    {
     "testo": "Le fonti sono raccolte per argomento nella **Bibliografia** in fondo al quaderno. **NON TROVATO** indica un dato cercato senza riscontro."
    },
    {
     "testo": "Nessuna dose di farmaco: **ogni trattamento va prescritto dal veterinario**."
    },
    {
     "testo": "Nessuna modifica a database o programma."
    }
   ]
  }
 ],
 "capitoli": [
  {
   "id": "cap01",
   "titolo": "1. Punti urgenti per Podere Verde",
   "contenuto": [
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Peste suina africana (PSA) di nuovo nella provincia di Roma.**",
       "sotto": [
        "Il 27/08/2026 il Centro di referenza nazionale ha confermato la positività di un cinghiale trovato a **Riano**. Al 3/09/2026 le positività erano 4, tutte a Riano.",
        "La zona infetta comprende 22 territori: Campagnano di Roma, Capena, Castelnuovo di Porto, Civitella San Paolo, Fiano Romano, Filacciano, Fonte Nuova, Formello, Guidonia Montecelio, Magliano Romano, Mazzano Romano, Mentana, Monterotondo, Morlupo, Nazzano, Ponzano Romano, Riano, Rignano Flaminio, Sacrofano, Sant'Oreste, Roma Municipio III e Roma Municipio XV.",
        "**Va controllato subito se l'allevamento ricade in uno di questi territori.**",
        "Ordinanza del Commissario straordinario n. 4/2026 (6/07/2026, valida fino al 28/03/2027). In zona di restrizione:",
        "morti da registrare in BDN entro 48 ore;",
        "verifica della biosicurezza con priorità ai semibradi;",
        "carenze non sanate in 15 giorni: svuotamento senza indennizzo;",
        "**semibradi entro 3 km da una carcassa positiva: obbligo di stabulazione al chiuso.**",
        "In zona indenne: check-list di biosicurezza su ClassyFarm entro 30 giorni dalla verifica."
       ]
      },
      {
       "testo": "**Castrazione a 2–4 settimane: non conforme** se non la esegue il veterinario con anestesia e analgesia prolungata (D.Lgs. 122/2011).",
       "sotto": [
        "Sanzione da 1.550 a 9.296 €.",
        "Alternative: castrare entro il 7° giorno di vita, oppure farla eseguire al veterinario.",
        "Inoltre, la ferita a quell'età coincide con il periodo di rischio di *Streptococcus suis* e delle artriti."
       ]
      },
      {
       "testo": "**Aujeszky:** nel Lazio la vaccinazione è **obbligatoria** (piano nazionale).",
       "sotto": [
        "Nel 2022–2023 il Lazio era tra le regioni con più allevamenti positivi: 6 da riproduzione su 123 testati.",
        "Data e numero delle vaccinazioni vanno sul Modello 4."
       ]
      },
      {
       "testo": "**Diarrea dei suinetti:** oggi non c'è nessuna profilassi specifica. Con il veterinario vanno valutati:",
       "sotto": [
        "vaccino delle scrofe contro *E. coli* e *Clostridium perfringens*;",
        "toltrazuril contro la coccidiosi;",
        "diagnosi di laboratorio (§6.1)."
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "cap02",
   "titolo": "2. Perdite dei suinetti: obiettivi, allarmi e cause non infettive",
   "contenuto": [
    {
     "tipo": "h3",
     "testo": "Obiettivi e soglie di allarme per Podere Verde"
    },
    {
     "tipo": "p",
     "testo": "Questi numeri non sono cause di morte: sono i **traguardi** con cui misurare l'allevamento e le **soglie** oltre le quali Podere Verde deve allarmarsi e cercare la causa nella tabella successiva."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Indicatore",
      "Obiettivo",
      "Riferimenti",
      "Soglia di allarme",
      "Podere Verde"
     ],
     "righe": [
      [
       "Nati morti, in percentuale dei nati totali",
       "4%",
       "5–7% al chiuso; 3,8% all'aperto contro 5,5% al chiuso",
       "oltre 7% (proposta del Tenente)",
       "**2024: 47,2% (162 nati morti su 343 nati). 2025: 60,1%. ALLARME**"
      ],
      [
       "Mortalità sottoscrofa, in percentuale dei nati vivi morti prima dello svezzamento",
       "7%",
       "sotto 10% ottimo, 10–14% buono, oltre 14% scarso; Italia CRPA 2010–2013: 10,1–11,2%; InterPIG 2025 sui dati 2024: mediana 12,7%, da 7,8% a 16,2%; Italia 2024: NON TROVATO",
       "oltre 14% (fascia «scarso»)",
       "**NON CALCOLATA:** servono, per ogni nidiata, nati vivi e svezzati"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Come si usano**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Calcolarli ogni mese e per ogni nidiata, dal registro dei parti: nati totali, nati vivi, nati morti, morti fino allo svezzamento con la data, svezzati."
      },
      {
       "testo": "**Un dato sopra la soglia di allarme** si confronta subito con la tabella delle cause qui sotto e con le malattie per età (§3–6)."
      },
      {
       "testo": "**I nati morti di Podere Verde sono da 6,7 a 8,6 volte la soglia di allarme (47,2 e 60,1 diviso 7).** Un valore così alto fa sospettare, oltre a un problema reale, anche un problema di registrazione: suinetti nati vivi e morti nelle prime ore segnati come nati morti. Se così fosse, la mortalità sottoscrofa risulterebbe invece troppo bassa."
      },
      {
       "testo": "La **prova del galleggiamento del polmone** distingue un nato morto, i cui polmoni affondano in acqua perché non ha mai respirato, da un morto dopo il parto."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Le cause non infettive: i numeri"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Parametro",
      "Valore"
     ],
     "righe": [
      [
       "Temperatura richiesta dal suinetto neonato",
       "34–36 °C"
      ],
      [
       "Pavimento del nido",
       "giorni 0–4: 34–36 °C; giorni 4–14: 32–34 °C; da 14 giorni allo svezzamento: 30 °C"
      ],
      [
       "Sala parto",
       "circa 22 °C; lampade accese 1–2 giorni prima del parto"
      ],
      [
       "Freddo",
       "dopo circa 2 ore su pavimento freddo la temperatura corporea cala e il rischio di malattia cresce molto"
      ],
      [
       "Deglutizione",
       "sotto 34 °C di temperatura rettale il riflesso di deglutizione si riduce"
      ],
      [
       "Colostro",
       "almeno 250 g per suinetto nelle prime 24 ore. Sotto 200 g muore circa il 25%, sotto 100 g il 65%. Prime 6 ore critiche"
      ],
      [
       "Parto lungo",
       "oltre l'80% dei nati morti è vivo all'inizio del parto; un intervallo di oltre 30 minuti tra due suinetti è un segnale di rischio"
      ],
      [
       "Ipoglicemia",
       "il suinetto non produce glucosio a sufficienza fino a 7 giorni; morte 24–36 ore dopo i primi segni"
      ],
      [
       "Basso peso",
       "sotto 1 kg «assolutamente sottopeso»; ogni kg di peso medio in più della figliata riduce di circa 31 punti la mortalità dei primi 3 giorni. Si agisce con l'alimentazione della scrofa in gestazione (Appendice A)"
      ],
      [
       "Schiacciamento",
       "63,9% delle morti della prima settimana nei box a parto libero svizzeri; ogni ora sopra 30 °C aumenta il rischio del 4%"
      ],
      [
       "Anemia da ferro",
       "riserve esaurite in 2–3 settimane; sospetta con emoglobina sotto 8 g/100 ml. All'aperto i suinetti prendono ferro dal terreno"
      ],
      [
       "Splay leg",
       "mortalità fino al 50%; più frequente nei maschi, nei leggeri e su pavimenti scivolosi o grigliati"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Per Podere Verde:** con il pavimento grigliato il nido deve essere asciutto e a 34 °C o più."
    },
    {
     "tipo": "p",
     "testo": "**Alimentazione della scrofa in gestazione:** peso dei suinetti alla nascita, colostro e latte dipendono da come mangia la scrofa. Il vademecum con razioni per fase, preparazione della miscela e costi è in **Appendice A**."
    },
    {
     "tipo": "h3",
     "testo": "2.1 Il calore in pratica: la cuccia riscaldata"
    },
    {
     "tipo": "p",
     "testo": "**Perché serve.** Il suinetto nasce bagnato e senza grasso di riserva: sul pavimento del nido vuole 34–36 °C nei primi 4 giorni, 32–34 °C fino a 14 giorni, poi circa 30 °C; la scrofa invece sta bene a 15–20 °C. Su un pavimento freddo, dopo circa 2 ore la temperatura del suinetto scende; sotto i 34 °C di temperatura interna succhia male e prende meno colostro. Il grigliato lascia passare aria fredda da sotto. Una **cuccia coperta** risolve il conflitto: il caldo resta dentro per i suinetti, la sala resta fresca e ventilata per la scrofa."
    },
    {
     "tipo": "p",
     "testo": "**Da dove viene l'idea.** Allevamento descritto da 3tre3 (J. Ventura, 2019): cuccia ricavata da un fusto di plastica da 250 litri o da un contenitore per liquidi tagliato, con molta carta dentro e la lampada che scalda solo l'interno; lampade dimezzate e consumo elettrico ridotto del 50% (dichiarato dall'allevamento, mortalità non misurata). Le foto originali sono nell'articolo: [3tre3, nido innovativo per i suinetti](https://www.3tres3.com/it/articoli/trucco-nido-innovativo-per-i-suinetti-in-sala-parto_8183/)."
    },
    {
     "tipo": "p",
     "testo": "**Prova danese (DanBred, 148 scrofe):** con il grigliato riscaldato a 33–34 °C al parto, i suinetti sotto 900 g «freddi» (temperatura interna fino a 35 °C) sono scesi dal 25,2% al 16,3%; stima di circa 0,3 suinetti salvati per nidiata."
    },
    {
     "tipo": "p",
     "testo": "**Materiale scelto: un serbatoio, due cucce.** Serbatoio per acqua potabile **Cordivari, 500 litri, cilindrico verticale** (codice 3500262010006), in polietilene, diametro 730 mm, altezza 1370 mm. Tagliato in tre pezzi dà **due cucce alte 550 mm**, con una pianta di 0,42 m² ciascuna; l'anello centrale di 270 mm si scarta."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Dove si compra",
      "Prezzo del serbatoio",
      "Costo per cuccia"
     ],
     "righe": [
      [
       "Promoclima (offerta)",
       "170 €",
       "85 €"
      ],
      [
       "Homelide",
       "213,90 €",
       "107 €"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "In alternativa: **Elbi CV 500 litri** (Ø 700 × 1460 mm, 225,70 € da Dasidrotecnica, cucce da 0,39 m²) oppure **Giurgola 500 litri parallelepipedo verticale** (860 × 600 × 1020 mm, 299 € su eBay, due cucce da 0,52 m² alte 510 mm senza scarto). Il serbatoio è nuovo e fatto per l'acqua potabile: nessun residuo chimico. Prima dell'ordine chiedere al venditore il diametro del tappo."
    },
    {
     "tipo": "p",
     "testo": "**Le misure del taglio, della porticina e l'impianto sono una proposta del Tenente Contabilità: provare due cucce prima di farne altre.**"
    },
    {
     "tipo": "h4",
     "testo": "Realizzazione, in quattro passaggi"
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k1.png",
     "didascalia": "Passaggio 1 – Sul serbatoio intero si tracciano due linee di taglio: a 550 mm dalla cima e a 550 mm dal fondo."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k2.png",
     "didascalia": "Passaggio 2 – Tre pezzi: la parte alta (cuccia A) ha già tetto e tappo; la parte bassa (cuccia B) ha il fondo; l'anello centrale si scarta."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k3.png",
     "didascalia": "Passaggio 3 – Cuccia A: si toglie il tappo e si ritaglia la porticina ad arco 300 × 280 mm a filo del pavimento. Cuccia B: si capovolge, il fondo diventa il tetto; si ritaglia un foro Ø 300 mm al centro e la porticina. Bordi limati."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k4.png",
     "didascalia": "Passaggio 4 – In opera: cuccia sopra una lastra piena con carta, lampada appesa con catena sopra la bocca, fuori dalla plastica."
    },
    {
     "tipo": "h4",
     "testo": "Tavola di costruzione (misure in mm)"
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k5.png",
     "didascalia": "A – Prospetto: diametro 730, altezza 550, porticina larga 300 e alta 280 a filo del pavimento."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k6.png",
     "didascalia": "B – Pianta: bocca Ø 300 al centro. Nella cuccia A è la bocca del tappo, da allargare se più stretta; nella cuccia B è un foro ritagliato nel fondo."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k7.png",
     "didascalia": "C – Sezione: bulbo fuori dalla cuccia, almeno 100 mm sopra la bocca; sonda del regolatore dentro, a circa 100 mm dal pavimento, fuori dal fascio di luce."
    },
    {
     "tipo": "h4",
     "testo": "Tavola di impianto nel box parto"
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_k8.png",
     "didascalia": "D – Pianta: cuccia sulla lastra nell'angolo dei suinetti, lato mammelle e verso il corridoio; porticina verso la scrofa; regolatore R fuori dal box; cavi in alto."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_05.png",
     "didascalia": "E – Collegamenti: quadro con differenziale e magnetotermico, regolatore con sonda, lampada. Il lavoro elettrico lo fa e lo certifica un elettricista, secondo le norme per gli ambienti zootecnici."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Fase",
      "Cosa fare",
      "Controllo"
     ],
     "righe": [
      [
       "1. Box vuoto e pulito",
       "Prima del parto, dopo lavaggio, disinfezione e asciugatura (capitolo 9)",
       "Box asciutto"
      ],
      [
       "2. Lastra",
       "Lastra piena 800 × 800 mm sul grigliato nell'angolo dei suinetti, carta sopra",
       "La lastra non si muove"
      ],
      [
       "3. Cuccia",
       "Sopra la lastra, porticina verso la scrofa, fissata alle sbarre in 2–3 punti",
       "Non si sposta spingendola"
      ],
      [
       "4. Lampada",
       "Gancio sopra la bocca, catena regolabile, bulbo ad almeno 100 mm sopra il bordo della bocca",
       "Bulbo centrato sulla bocca"
      ],
      [
       "5. Sonda",
       "Dentro la cuccia, a circa 100 mm dal pavimento, non sotto il fascio di luce",
       "Cavo fuori dalla portata della scrofa"
      ],
      [
       "6. Accensione",
       "1–2 giorni prima del parto, regolatore a 34–36 °C",
       "Termometro all'altezza dei suinetti"
      ],
      [
       "7. Regolazione",
       "Dopo 4 giorni 32–34 °C; da 14 giorni circa 30 °C",
       "Suinetti sparsi, non ammucchiati"
      ],
      [
       "8. Fine ciclo",
       "Allo svezzamento la cuccia si toglie, si lava e si disinfetta con il box",
       "Procedura del capitolo 9"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Come si legge il comportamento dei suinetti**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Sparsi sotto la cuccia: temperatura giusta."
      },
      {
       "testo": "Ammucchiati uno sull'altro: freddo, abbassare la lampada o alzare il regolatore."
      },
      {
       "testo": "Lontani dalla lampada o fuori dalla cuccia: troppo caldo."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Quale fonte di calore**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Lampada a infrarossi da allevamento** (vetro rosso duro, resistente agli spruzzi, portalampada in ceramica e griglia): scalda direttamente il suinetto; la luce rossa non abbaglia. Nella prova danese si usavano lampade da 100 W; con la cuccia chiusa bastano potenze basse, meglio con regolatore. Non va bene una normale lampadina a luce bianca."
      },
      {
       "testo": "**Riscaldatore in ceramica a infrarossi:** stesso calore, senza luce; non si vede se è acceso (serve la spia sul regolatore). Dati specifici per i suinetti: NON TROVATI."
      },
      {
       "testo": "**Tappetino riscaldante sotto la cuccia** (es. Medi Nova, Reggio Emilia: 50–70 W, 135–149 € più IVA, regolatore 130 € a parte): scalda da sotto, dove il grigliato raffredda; nessuna lampada vicino alla plastica; la bocca si può richiudere con il tappo. Valutazione del Tenente, da provare."
      },
      {
       "testo": "**Prova proposta:** due box con lampada a infrarossi sopra la cuccia e un box con tappetino sotto la cuccia e tappo chiuso; temperatura misurata sotto la cuccia e morti annotati per un mese, con e senza cuccia."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Sicurezza e pulizia**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Lampada mai a contatto con plastica, carta o paglia; cavi protetti dai morsi. **Il rischio d'incendio va valutato prima dell'uso.**"
      },
      {
       "testo": "La cuccia di plastica si lava e si disinfetta meglio del legno, che assorbe sporco e oocisti."
      },
      {
       "testo": "**Variante per due nidiate:** mezza cisterna da 1000 litri a cavallo di due box, con divisorio interno alto 35 cm (scheda di costruzione «Nido doppio suinetti»)."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "2.2 Il colostro in pratica"
    },
    {
     "tipo": "p",
     "testo": "**Perché serve.** Il suinetto nasce senza anticorpi, perché la placenta della scrofa non li lascia passare, e con pochissima energia di riserva. Il colostro gli dà in un colpo solo anticorpi, energia per scaldarsi e il primo nutrimento. Gli anticorpi passano nel sangue solo nelle prime ore: dopo circa 6 ore l'intestino comincia a chiudersi e a 24 ore non assorbe quasi più nulla. Insieme al calore del §2.1 è la prima difesa contro freddo, ipoglicemia, schiacciamento e diarrea."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_c1.png",
     "didascalia": "Le prime 36 ore. Curva degli anticorpi IgG: 62,3 mg/ml all'inizio, 16,8 a 24 ore; il tratto tratteggiato oltre le 24 ore è solo indicativo. Le scadenze sono quelle di questo paragrafo."
    },
    {
     "tipo": "h4",
     "testo": "Quanto ne fa la scrofa e quanto ne serve"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Dato",
      "Valore"
     ],
     "righe": [
      [
       "Produzione della scrofa nelle prime 24 ore",
       "media 3,67 kg (da 1,91 a 5,31); in un altro studio 3,32 kg (da 1,66 a 5,60)"
      ],
      [
       "Scrofe che non bastano",
       "circa una su tre non produce abbastanza per dare 250 g a ogni suinetto"
      ],
      [
       "Calo degli anticorpi (IgG)",
       "da 62,3 mg/ml all'inizio del parto a 16,8 mg/ml a 24 ore: −70,9%"
      ],
      [
       "Calo del Brix",
       "sotto 24% già dopo circa 240 minuti dall'inizio"
      ],
      [
       "Fabbisogno del suinetto",
       "almeno 250 g nelle prime 24 ore; oppure almeno 150 ml per kg di peso alla nascita entro 16 ore"
      ],
      [
       "Ritardo della prima poppata",
       "ogni minuto di ritardo costa circa 11 g di colostro"
      ],
      [
       "Peso alla nascita",
       "ogni 100 g di peso in più, circa 28 g di colostro in più"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Esempio con la regola AHDB (calcolo del Tenente):** suinetto di 1,3 kg → almeno 195 ml entro 16 ore; suinetto di 0,9 kg → almeno 135 ml. Con 14 suinetti da 1,3 kg servono circa 3,5 kg di colostro in 24 ore (14 × 250 g): proprio la media che una scrofa produce. **Con nidiate numerose il colostro non basta per tutti, e i primi a restare senza sono i piccoli.**"
    },
    {
     "tipo": "h4",
     "testo": "Come si misura"
    },
    {
     "tipo": "p",
     "testo": "**1. Pesando i suinetti (formula di Theil 2014).** Si pesa il suinetto alla nascita e di nuovo circa 24 ore dopo."
    },
    {
     "tipo": "p",
     "testo": "Colostro preso (g) = −106 + 2,26 × aumento di peso (g) + 200 × peso alla nascita (kg) + 0,111 × minuti tra le due pesate − 1414 × aumento di peso (g) ÷ minuti + 0,0182 × aumento di peso (g) ÷ peso alla nascita (kg)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Esempio:** nato 1,3 kg, dopo 1440 minuti (24 ore) pesa 1,42 kg, aumento 120 g → circa **469 g**: bene."
      },
      {
       "testo": "Nato 0,9 kg, aumento 30 g in 24 ore → circa **273 g**: appena sopra il minimo."
      },
      {
       "testo": "Un suinetto che **perde peso** nelle prime 24 ore ha preso poco colostro: va aiutato subito."
      },
      {
       "testo": "Serve una bilancia da 0–5 kg con precisione di 5–10 g. Basta farlo su qualche nidiata per capire come va l'allevamento, non su tutte."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**2. Misurando il colostro con il rifrattometro Brix.** Si spreme una goccia dai primi capezzoli entro 4 ore dalla nascita del primo suinetto e si legge il valore."
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_c2.png",
     "didascalia": "Scala Brix per il colostro della scrofa."
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Strumento: rifrattometro Brix ottico 0–32% (esempio LW Scientific BR32: 235,73 dollari). Prezzo in Italia: NON TROVATO; i modelli ottici generici costano meno, ma la precisione va controllata con acqua distillata, che deve dare 0."
      },
      {
       "testo": "Il Brix misura i solidi del colostro e dà un'idea degli anticorpi, non il numero esatto."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "La prima ora e il primo giorno, passo per passo"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Parto sorvegliato.** Se tra un suinetto e l'altro passano più di 30 minuti, chiamare chi sa intervenire o il veterinario."
      },
      {
       "testo": "**Asciugare** ogni suinetto con carta o polvere essiccante e metterlo subito alla mammella. **Prima poppata entro 30 minuti.**"
      },
      {
       "testo": "**Controllare che succhi davvero**: muso attaccato, deglutisce, pancia che si riempie."
      },
      {
       "testo": "**Nella cuccia calda** (§2.1) tra una poppata e l'altra: un suinetto freddo non succhia."
      },
      {
       "testo": "**Segnare con il pennarello** chi non ha poppato o è sotto 1 kg: riceve aiuto (poppata a turni o colostro dato a mano)."
      },
      {
       "testo": "**Non spostare i suinetti tra nidiate nelle prime 24 ore**: prima ognuno deve aver preso il colostro della propria madre."
      },
      {
       "testo": "**Pareggiamento tra 24 e 36 ore** (vedi sotto)."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Poppata a turni"
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_c3.png",
     "didascalia": "Poppata a turni: i più grandi stanno 90 minuti nella cuccia chiusa mentre i piccoli poppano da soli, poi tutti insieme."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Indicazione",
      "Come",
      "Risultato"
     ],
     "righe": [
      [
       "PIC",
       "da 15 o più nati; si tolgono i 5–7 più grandi per 90 minuti, due volte al giorno",
       "raccomandazione pratica"
      ],
      [
       "AHDB",
       "due gruppi che si scambiano ogni 90 minuti",
       "raccomandazione pratica"
      ],
      [
       "Kansas State 2017",
       "6 più pesanti tolti per 1,5 ore a circa 6 ore di vita",
       "i piccoli hanno preso 210–227 g contro 194 g; crescita migliore a 7 giorni"
      ],
      [
       "Romero 2023",
       "poppata a turni",
       "mortalità allo svezzamento più alta: 25% contro 17,1%"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Giudizio:** le prove sono contrastanti. Ha senso solo per nidiate grandi, con qualcuno che può stare in sala parto, ed è da provare su poche nidiate confrontando i morti."
    },
    {
     "tipo": "h4",
     "testo": "Colostro dato a mano"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Con la siringa o il biberon:** 5–10 ml alla volta; al massimo circa 30 ml per kg di peso a poppata, non oltre 30 ml, fino a 4 volte nelle 24 ore. Goccia a goccia sulla lingua, suinetto dritto: se il colostro va nei polmoni il suinetto muore."
      },
      {
       "testo": "**Con la sonda gastrica:** tubicino morbido in silicone di circa 25 cm, colostro a circa 39 °C, **mai forzare**. La tecnica la insegna il veterinario: senza addestramento è meglio la siringa."
      },
      {
       "testo": "**Dopo:** riportare il suinetto alla mammella entro 30 minuti e controllarlo di nuovo dopo 60 minuti. Il colostro dato a mano aiuta a ripartire, non sostituisce la scrofa."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Pareggiamento delle nidiate"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Quando:** tra 24 e 36 ore di vita, dopo il colostro della propria madre."
      },
      {
       "testo": "**Chi spostare:** di preferenza i suinetti grandi verso scrofe con figliate più piccole o con mammelle libere; i piccoli restano con la madre."
      },
      {
       "testo": "**Quanto:** il meno possibile. Ogni spostamento in più costa circa 300 g di peso allo svezzamento."
      },
      {
       "testo": "**Con diarrea o malattie in corso:** decide il veterinario, perché gli spostamenti diffondono i germi."
      },
      {
       "testo": "**Regola di base:** non più suinetti dei capezzoli funzionanti della scrofa."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Banca del colostro dell'allevamento"
    },
    {
     "tipo": "immagine",
     "src": "/guida/sanita_suini/img_c4.png",
     "didascalia": "Banca del colostro: dalla mungitura alla somministrazione. La soglia di Brix per conservare è una scelta del Tenente."
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Da chi:** scrofe sane di 3°–5° parto dello stesso allevamento, dai primi tre paia di capezzoli, 1–3 ore dopo la nascita dei primi suinetti, 10–15 ml per capezzolo, senza togliere troppo ai suoi suinetti."
      },
      {
       "testo": "**Ossitocina** per far scendere il latte: solo con ricetta del veterinario."
      },
      {
       "testo": "**Conservazione:** frigorifero fino a 48 ore; congelatore a −20 °C fino a 30 giorni. Dopo il congelamento gli anticorpi restano uguali, i globuli bianchi del colostro diminuiscono."
      },
      {
       "testo": "**Uso:** scongelare lentamente, mai nel microonde (il calore forte distrugge gli anticorpi); dare a circa 39 °C."
      },
      {
       "testo": "**Comprare colostro di scrofa congelato:** nessuna offerta trovata in commercio (NON TROVATO). Prenderlo da altri allevamenti porta il rischio di introdurre malattie, e oggi c'è la peste suina africana nel Lazio (§1): la banca va fatta solo con le proprie scrofe."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Cosa riduce il colostro della scrofa"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Parto lungo:** ogni minuto in più di parto costa circa 2,2 g di colostro per suinetto."
      },
      {
       "testo": "**Scrofa troppo grassa** al parto: circa 1 kg di colostro in meno."
      },
      {
       "testo": "**Caldo:** sala parto oltre 22–25 °C, la scrofa mangia e produce meno. Con la cuccia del §2.1 la sala può restare fresca."
      },
      {
       "testo": "**Alimentazione:** in fine gestazione l'aggiunta di plasma e di antiossidanti ha alzato il Brix negli studi. Razioni della gestazione: vademecum in **Appendice A**."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Box informativo: PorcaCol® (Arts Food Products, Paesi Bassi)"
    },
    {
     "tipo": "p",
     "testo": "**Cos'è (dati del venditore):**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "polvere a base di colostro di prima mungitura, maltodestrine e destrosio;"
      },
      {
       "testo": "proteine oltre il 56%, di cui oltre il 30% immunoglobuline;"
      },
      {
       "testo": "uso: 5 g sciolti in 15 ml d'acqua, si danno 9 ml alla nascita e si ripete entro 4–6 ore;"
      },
      {
       "testo": "prezzo 78 € per 750 g: 0,52 € ogni 5 g; con due dosi da 9 ml (circa 6 g) circa 0,62 € a suinetto (calcolo del Tenente)."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Pro**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Costa poco a suinetto."
      },
      {
       "testo": "Dà subito energia (destrosio e maltodestrine) e proteine: può aiutare il suinetto debole o freddo ad arrivare alla mammella."
      },
      {
       "testo": "Facile da preparare e conservare, sempre pronto, anche quando non c'è colostro in banca."
      },
      {
       "testo": "Il venditore dichiara l'origine da allevamenti controllati per paratubercolosi e BVD, malattie dei bovini."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Limiti**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**L'origine animale non è scritta in chiaro:** che sia colostro di vacca lo si deduce dalle malattie bovine citate (dedotto, non dichiarato)."
      },
      {
       "testo": "**Nessuno studio** sui suinetti citato dal venditore (NON TROVATO). Numero di registrazione come mangime non indicato; dichiarata solo la certificazione GMP+."
      },
      {
       "testo": "**Quantità piccola:** una dose da 9 ml contiene circa 3 g di polvere, quindi circa 0,5 g di immunoglobuline al minimo dichiarato (calcolo del Tenente). Un suinetto ha bisogno di almeno 250 g di colostro di scrofa."
      },
      {
       "testo": "**Anticorpi della specie sbagliata:** gli anticorpi di vacca non sono fatti contro i germi del maiale. In uno studio su un prodotto simile a base di colostro bovino (258 suinetti) la mortalità è stata 12,7% con il prodotto contro 10,2% senza, differenza non significativa; gli autori concludono che le immunoglobuline bovine non danno una protezione passiva degna di nota contro i patogeni del suino."
      },
      {
       "testo": "**Da verificare:** le regole europee sull'uso di prodotti di origine animale nei mangimi per suini (Regolamento CE 999/2001) per questo tipo di prodotto."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Giudizio del Tenente:** utile come energia di soccorso per il suinetto debole, **non** come sostituto del colostro della scrofa né come protezione contro le diarree. Prima l'allattamento e la banca del colostro; PorcaCol eventualmente dopo, sentito il veterinario."
    },
    {
     "tipo": "h4",
     "testo": "Protocollo pratico delle prime 24 ore"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Quando",
      "Cosa fare",
      "Chi controlla"
     ],
     "righe": [
      [
       "1–2 giorni prima del parto",
       "cuccia e lampada accese (§2.1); scrofa non troppo grassa, sala fresca",
       "addetto sala parto"
      ],
      [
       "Durante il parto",
       "sorvegliare; più di 30 minuti tra due nati = intervento",
       "addetto o veterinario"
      ],
      [
       "0–30 minuti di vita",
       "asciugare, mettere alla mammella, verificare che succhi",
       "addetto"
      ],
      [
       "1–3 ore",
       "raccolta per la banca da scrofe adatte",
       "addetto"
      ],
      [
       "0–4 ore",
       "Brix della scrofa; sotto 20% nidiata da seguire",
       "addetto"
      ],
      [
       "Prime 6 ore",
       "segnare chi non ha poppato o è sotto 1 kg; colostro a mano, massimo 30 ml a volta",
       "addetto"
      ],
      [
       "6–24 ore",
       "poppata a turni nelle nidiate da 15 o più nati, se si decide di provarla",
       "addetto"
      ],
      [
       "24 ore",
       "pesare qualche nidiata campione: chi ha perso peso va aiutato",
       "addetto"
      ],
      [
       "24–36 ore",
       "pareggiamento delle nidiate",
       "addetto, sentito il veterinario se ci sono malattie"
      ],
      [
       "Ogni giorno",
       "registrare i morti con la causa probabile (freddo, schiacciato, debole, diarrea)",
       "responsabile"
      ]
     ]
    }
   ]
  },
  {
   "id": "cap03",
   "titolo": "3. Suinetti da 0 a 7 giorni: le diarree",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "**Perché conta.** Nella prima settimana quasi tutte le malattie infettive del suinetto si presentano come **diarrea**. Il suinetto ha poche riserve: con la diarrea perde acqua e calore in poche ore, smette di succhiare e muore disidratato o schiacciato. Le cause sono batteri e virus; si sospettano dall'**età**, dal **colore delle feci**, dalla presenza di **sangue** o di **vomito**. La conferma la dà solo il laboratorio (§6.1)."
    },
    {
     "tipo": "h4",
     "testo": "Come orientarsi: cosa si vede e cosa può essere"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Cosa si vede",
      "Età",
      "Causa probabile",
      "Gravità"
     ],
     "righe": [
      [
       "Diarrea **con sangue**, suinetti che muoiono in poche ore, anche prima della diarrea",
       "1–5 giorni",
       "*Clostridium perfringens* tipo C",
       "molto grave: fino al 100% delle nidiate colpite"
      ],
      [
       "Diarrea **acquosa gialla**, abbondante, suinetti disidratati (occhi infossati, pelle grinzosa)",
       "primi giorni",
       "*E. coli* (colibacillosi)",
       "grave se non si interviene subito"
      ],
      [
       "Diarrea **giallastra pastosa o acquosa**, a volte dalla nascita; ogni tanto pancia gonfia, respiro affannoso",
       "1–7 giorni",
       "*Clostridioides difficile*",
       "variabile"
      ],
      [
       "Diarrea **cremosa o schiumosa giallastra**, molti malati ma pochi morti",
       "dalla nascita allo svezzamento",
       "*Clostridium perfringens* tipo A",
       "lieve"
      ],
      [
       "Diarrea acquosa **con vomito**, che colpisce tutte le età e si diffonde in fretta",
       "tutte le età",
       "virus TGE o PED",
       "molto grave nei suinetti: con la TGE muoiono quasi tutti quelli della prima settimana"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "Dopo il 5° giorno, con feci pastose biancastre che non migliorano con gli antibiotici, si pensa alla **coccidiosi** (§4)."
    },
    {
     "tipo": "h4",
     "testo": "Cosa fare subito con una nidiata con diarrea"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Annotare** nidiata, data, età dei suinetti, aspetto delle feci, quanti malati e quanti morti. Una foto delle feci con il telefono aiuta il veterinario."
      },
      {
       "testo": "**Calore:** cuccia a 34–36 °C (§2.1). Il suinetto con diarrea si raffredda molto prima degli altri."
      },
      {
       "testo": "**Acqua ed elettroliti:** soluzione reidratante per suinetti in una ciotola bassa vicino alla cuccia; prodotto e dose li indica il veterinario."
      },
      {
       "testo": "**Veterinario lo stesso giorno**, subito se c'è sangue, vomito o più di un morto."
      },
      {
       "testo": "**Campioni (§6.1):** feci fresche di 3–5 suinetti; suinetti appena morti in frigorifero tra +1 e +10 °C, non congelati, consegnati entro 24 ore."
      },
      {
       "testo": "**Kit rapido per i virus** (Anigen PED/TGE/Rota, §6.2): in 10 minuti dice se è un virus. Se è negativo, con buona probabilità è un batterio."
      },
      {
       "testo": "**Igiene:** questa nidiata si visita per ultima, con stivali e guanti dedicati; feci tolte ogni giorno; nessuno spostamento di suinetti verso altre nidiate."
      },
      {
       "testo": "**Antibiotici solo con ricetta**, scelti con l'antibiogramma: molti ceppi di *E. coli* sono resistenti."
      },
      {
       "testo": "**Registrare i morti** con la causa probabile."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Colibacillosi neonatale (E. coli)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un batterio dell'intestino che si attacca alla parete con le sue «fimbrie» e produce tossine che fanno uscire acqua: la diarrea svuota il suinetto."
      },
      {
       "testo": "**Come si riconosce:** diarrea acquosa gialla e abbondante, disidratazione rapida, morte. Raramente il suinetto muore prima che compaia la diarrea."
      },
      {
       "testo": "**Cosa la favorisce:** freddo e umido, poco colostro."
      },
      {
       "testo": "**Cura:** antibiotico tempestivo scelto con l'antibiogramma, più liquidi, elettroliti e calore. Decide il veterinario."
      },
      {
       "testo": "**Prevenzione:** vaccino delle scrofe in gestazione (§9.6), che passa gli anticorpi ai suinetti con il colostro; colostro abbondante nelle prime ore (§2.2); nido caldo e asciutto; box parto pulito e disinfettato tra un parto e l'altro (§9.3)."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Clostridium perfringens tipo C"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un batterio che produce una tossina (beta) che distrugge la parete dell'intestino."
      },
      {
       "testo": "**Come si riconosce:** suinetti di meno di una settimana deboli e a terra, diarrea con sangue, morte in poche ore; alcuni muoiono senza diarrea. Quelli che sopravvivono restano spesso stentati. I suinetti deboli vengono anche schiacciati più facilmente dalla scrofa."
      },
      {
       "testo": "**Cura:** i suinetti già malati si salvano raramente."
      },
      {
       "testo": "**Prevenzione:**",
       "sotto": [
        "**vaccino delle scrofe**, due dosi prima del parto e richiamo a ogni parto (§9.6): è la difesa principale;",
        "in un focolaio, il veterinario può valutare l'antitossina nelle prime 2 ore di vita (in Italia NON TROVATA) o un antibiotico preventivo per pochi giorni;",
        "pulizia della sala parto tra un gruppo e l'altro: le spore resistono nell'ambiente (§9.1)."
       ]
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Clostridioides difficile"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un batterio con tossine che colpisce il grosso intestino."
      },
      {
       "testo": "**Come si riconosce:** diarrea giallastra, da pastosa ad acquosa, spesso dalla nascita, nei primi 7 giorni; a volte pancia gonfia, respiro affannoso, scroto gonfio. All'autopsia il segno tipico è l'**edema del mesocolon** (gonfiore gelatinoso vicino al colon). A occhio la diarrea non si distingue da quella da *E. coli*: serve il laboratorio."
      },
      {
       "testo": "**Da dove viene:** scrofe portatrici e ambiente, dove il batterio sopravvive a lungo."
      },
      {
       "testo": "**Cura:** nessuna cura sicura dimostrata."
      },
      {
       "testo": "**Prevenzione:** pulizia e disinfezione della sala parto (§9.3). Esiste un vaccino europeo per le scrofe, Suiseng Diff/A (§9.6); in alternativa il vaccino stabulogeno."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "TGE e PED (virus)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** due coronavirus dell'intestino, molto contagiosi."
      },
      {
       "testo": "**Come si riconosce:** vomito e diarrea acquosa in suini di tutte le età, che si diffondono in pochi giorni in tutto l'allevamento. Con la TGE muoiono quasi tutti i suinetti della prima settimana."
      },
      {
       "testo": "**Cura:** nessun farmaco contro il virus: calore, acqua ed elettroliti."
      },
      {
       "testo": "**Prevenzione:** **biosicurezza** (§7): nessun ingresso di persone, mezzi o animali senza le regole della zona filtro; controllo di roditori, cani, gatti e uccelli."
      },
      {
       "testo": "**Diagnosi rapida:** kit Anigen PED/TGE/Rota (§6.2) e conferma con la PCR in laboratorio."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Per Podere Verde:** in azienda sono state viste diarree nei suinetti, ma oggi non si fa nessuna profilassi specifica. Prima di scegliere il vaccino delle scrofe serve sapere quale batterio c'è: diagnosi di laboratorio (§6.1), poi decisione con il veterinario."
    },
    {
     "tipo": "h3",
     "testo": "3.1 Se compare una malattia: come evitare che si diffonda"
    },
    {
     "tipo": "p",
     "testo": "**Perché serve.** I germi delle diarree passano da una nidiata all'altra con gli stivali, le mani, gli attrezzi, le feci, i suinetti spostati e gli animali che girano in sala parto (roditori, mosche, cani, gatti). Le spore dei clostridi e le oocisti dei coccidi restano nell'ambiente per mesi (§9.1). Il protocollo va applicato **dal primo caso**, senza aspettare la diagnosi."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Regola",
      "Come si applica"
     ],
     "righe": [
      [
       "1. **Ordine di lavoro**",
       "ogni giorno dai sani ai malati, dai giovani agli adulti: la nidiata malata si visita e si pulisce **per ultima**"
      ],
      [
       "2. **Stivali, tuta e guanti dedicati**",
       "un paio di stivali e una tuta solo per la nidiata o il box malato, lasciati davanti al box; guanti monouso cambiati all'uscita"
      ],
      [
       "3. **Pediluvio davanti al box malato**",
       "prima si toglie il fango dagli stivali con la spazzola, poi il pediluvio; rinnovarlo quando è sporco e almeno una volta alla settimana"
      ],
      [
       "4. **Attrezzi propri**",
       "pala, raschietto, secchio e siringhe usati solo in quel box, lavati e disinfettati a fine giornata"
      ],
      [
       "5. **Nessuno spostamento**",
       "niente adozioni né pareggiamenti da o verso la nidiata malata; nessun suinetto «prestato» ad altre scrofe"
      ],
      [
       "6. **Isolamento**",
       "suinetti o suini malati separati dagli altri; per la legge vanno previste misure di isolamento o separazione degli animali malati (DM 28 giugno 2022, art. 3)"
      ],
      [
       "7. **Feci e lettiera**",
       "tolte ogni giorno dal box malato, per ultime, e portate direttamente alla concimaia senza passare dagli altri box"
      ],
      [
       "8. **Morti**",
       "tolti subito, con i guanti, in sacco chiuso; cella frigorifera o ritiro della ditta entro 24 ore; i più freschi vanno al laboratorio (§6.1)"
      ],
      [
       "9. **Visite**",
       "sospese le visite non necessarie finché la malattia non è chiarita"
      ],
      [
       "10. **Veterinario**",
       "chiamato lo stesso giorno; per qualsiasi sospetto di **peste suina africana** (febbre, chiazze rosse o violacee sulla pelle, morti improvvise) avviso immediato al veterinario e al Servizio veterinario dell'ASL"
      ],
      [
       "11. **Fine del focolaio**",
       "box svuotato, pulito, asciugato e disinfettato con la procedura del §9.3 prima di una nuova nidiata"
      ]
     ]
    },
    {
     "tipo": "h3",
     "testo": "3.2 Regole di igiene dell'allevamento, tutti i giorni"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Quando",
      "Cosa fare"
     ],
     "righe": [
      [
       "**Ogni giorno**",
       "cambio di abiti e calzature all'ingresso nella zona degli animali e all'uscita; lavaggio delle mani; giro dai più giovani ai più vecchi, dai sani ai malati"
      ],
      [
       "**Ogni giorno**",
       "feci tolte dai box parto; mangiatoie e abbeveratoi controllati e puliti; mangime sparso raccolto (attira roditori e mosche)"
      ],
      [
       "**Ogni giorno**",
       "morti in cella frigorifera o ritirati entro 24 ore; registro dei morti con la causa"
      ],
      [
       "**Ogni settimana**",
       "pediluvi rinnovati; lettiera bagnata cambiata; fango e letame rimossi intorno ai box e alle capannine; controllo di roditori e mosche (§3.3)"
      ],
      [
       "**A ogni svezzamento**",
       "**tutto pieno / tutto vuoto**: box parto svuotato, lavato, asciugato e disinfettato (§9.3); animali reintrodotti solo **due giorni dopo** la fine di pulizia e disinfezione (DM 28 giugno 2022)"
      ],
      [
       "**All'aperto**",
       "capannine parto spostate su terreno pulito tra un parto e l'altro; lettiera tolta o bruciata dopo ogni svezzamento; niente pozze stagnanti nei paddock parto (§9.4)"
      ],
      [
       "**Sempre**",
       "procedura scritta di pulizia e disinfezione appesa in azienda; solo disinfettanti autorizzati in Italia (§6.4); mezzi di terzi lavati e disinfettati all'ingresso; mangime e lettiera al riparo da animali selvatici"
      ]
     ]
    },
    {
     "tipo": "h3",
     "testo": "3.3 Protocollo contro roditori e insetti"
    },
    {
     "tipo": "p",
     "testo": "**Perché serve.** Ratti e topi portano leptospirosi, salmonella, dissenteria e i clostridi, mangiano e sporcano il mangime e rovinano isolamenti e cavi elettrici. Le mosche spostano germi da un box all'altro, disturbano gli animali e si moltiplicano nel letame umido. Per gli allevamenti semibradi ad alta capacità e per tutti gli stabulati la legge chiede un **piano aziendale di derattizzazione** (e, per gli stabulati, anche di disinfestazione) **scritto e documentato** (DM 28 giugno 2022). Per Podere Verde è comunque raccomandato."
    },
    {
     "tipo": "p",
     "testo": "Prodotti autorizzati in Italia (rodenticidi, larvicidi, esche, lotta biologica): tabelle del **§6.5**."
    },
    {
     "tipo": "h4",
     "testo": "Ratti e topi"
    },
    {
     "tipo": "p",
     "testo": "**1. Sopralluogo.** Un giro al tramonto, quando i roditori sono più attivi, una volta al mese e a ogni segnalazione. Segni da cercare: escrementi, tane, camminamenti lungo i muri, sacchi e cavi rosicchiati, mangime sparso. Vedere ratti di giorno vuol dire che sono molti."
    },
    {
     "tipo": "p",
     "testo": "**2. Prevenzione, prima del veleno.**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Mangime in silos metallici o contenitori chiusi; mangime sparso raccolto ogni giorno."
      },
      {
       "testo": "Striscia di **0,6–1 m senza erba** intorno agli edifici, con una fascia di ghiaia grossa larga 60 cm e profonda 15 cm lungo le fondamenta."
      },
      {
       "testo": "Fessure chiuse con malta o lamiera: **un ratto passa da 1,2 cm, un topo da 1 cm**. Rete metallica interrata per 30–45 cm dove scavano."
      },
      {
       "testo": "Niente rifiuti, legname o macchinari abbandonati vicino ai locali degli animali."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**3. Esche, solo in erogatori.**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Erogatori chiusi a chiave, fissati, fuori dalla portata di suini, cani, gatti e uccelli; numerati su una piantina."
      },
      {
       "testo": "Ratti: esche dove mangiano (mangiano in uno o due punti). Topi: più punti esca lungo i loro percorsi."
      },
      {
       "testo": "Rodenticidi anticoagulanti con principio attivo dallo 0,003% in su: **solo per uso professionale**, in confezioni da almeno 1,5 kg; si usano come indica l'etichetta, compreso l'uso all'interno o all'esterno degli edifici."
      },
      {
       "testo": "Mai esche sfuse sul pavimento o vicino a mangime e acqua degli animali."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**4. Durata e controlli.**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Controllare gli erogatori a ogni giro (ogni giorno se l'infestazione è forte): esca mangiata, spostata, mancante."
      },
      {
       "testo": "Con gli anticoagulanti il controllo deve arrivare **entro 35 giorni**; se l'esca continua a essere mangiata senza risultato, cambiare esca o principio attivo."
      },
      {
       "testo": "Cercare e smaltire i roditori morti durante e dopo il trattamento: possono morire anche a **100 metri e oltre** dal punto esca."
      },
      {
       "testo": "A fine trattamento togliere le esche avanzate. Negli erogatori fissi lasciare **esca non tossica** come spia: se viene mangiata, si riparte con il trattamento."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**5. Trappole.** A scatto o a cattura multipla nei punti più frequentati; controllate **ogni giorno**."
    },
    {
     "tipo": "p",
     "testo": "**6. Registro.** Piantina con gli erogatori numerati; per ogni controllo: data, punto, esca messa (prodotto e quantità), consumo, roditori morti trovati, chi ha fatto il controllo. In alternativa si affida il servizio a una ditta di disinfestazione, che rilascia il registro."
    },
    {
     "tipo": "h4",
     "testo": "Mosche e altri insetti"
    },
    {
     "tipo": "p",
     "testo": "**1. Togliere i luoghi dove nascono.** Con il caldo una mosca completa il ciclo da uovo ad adulto in circa **2 settimane**: letame, lettiera bagnata, mangime sparso e fango vanno tolti o rimossi **almeno una volta alla settimana**. Il letame stoccato deve avere una crosta asciutta in superficie; zone bagnate drenate; aria che circola."
    },
    {
     "tipo": "p",
     "testo": "**2. Barriere.** Reti alle finestre dei locali chiusi, tenute integre."
    },
    {
     "tipo": "p",
     "testo": "**3. Lotta biologica.** Piccole vespe parassite che depongono le uova nelle pupe delle mosche, liberate nel letame: funzionano se il letame non è troppo bagnato. Si comprano da ditte specializzate (fornitore e prezzo NON TROVATI)."
    },
    {
     "tipo": "p",
     "testo": "**4. Insetticidi, solo se servono.**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Solo prodotti autorizzati in Italia come biocidi (insetticidi) o presidi medico-chirurgici, con il numero di registrazione in etichetta."
      },
      {
       "testo": "**Larvicidi** sul letame per bloccare la nascita; **esche e trappole** per gli adulti, sempre fuori dalla portata degli animali e lontano da mangime e acqua."
      },
      {
       "testo": "Spruzzi contro gli adulti: effetto breve (1–2 ore). Alternare i principi attivi per non far nascere mosche resistenti."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**5. Controllo.** Da prima della stagione delle mosche e poi **ogni 2 settimane**: contare le mosche o le macchioline lasciate su fogli di carta appesi nei locali. Se aumentano, ripassare i punti 1–4."
    },
    {
     "tipo": "h3",
     "testo": "3.4 Preparare la scrofa prima del parto: vaccini, antiparassitari, lavaggio"
    },
    {
     "tipo": "p",
     "testo": "**Perché serve.** Le difese del suinetto nelle prime settimane arrivano quasi tutte dalla madre, con il colostro: una scrofa vaccinata nel momento giusto passa ai suinetti gli anticorpi contro *E. coli* e clostridi. Una scrofa sporca o con parassiti porta in sala parto feci, uova di vermi, acari della rogna e germi, proprio dove nascono i suinetti. Per legge, le scrofe messe negli stalli da parto devono essere **accuratamente pulite** e, se necessario, **trattate contro i parassiti** interni ed esterni (Direttiva 2008/120/CE, recepita dal D.Lgs. 122/2011)."
    },
    {
     "tipo": "h4",
     "testo": "Calendario della scrofa"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Quando",
      "Cosa fare",
      "Note"
     ],
     "righe": [
      [
       "**Scrofette, prima della prima copertura**",
       "vaccino contro **parvovirus** e **mal rosso**",
       "il parvovirus dà mummificati di dimensioni diverse nella stessa nidiata"
      ],
      [
       "**Scrofette, prima del primo parto**",
       "ciclo completo del vaccino contro *E. coli* e clostridi (con alcuni vaccini 3 dosi)",
       "schema del vaccino scelto (§9.6)"
      ],
      [
       "**6–8 settimane prima del parto**",
       "prima dose del vaccino *E. coli* + clostridi, solo la prima volta",
       "Porcilis ColiClos: 6–8 settimane; Enteroporc Coli AC: 5 settimane; Suiseng: 6 settimane"
      ],
      [
       "**2–4 settimane prima del parto**",
       "seconda dose, oppure **richiamo a ogni parto**",
       "Porcilis ColiClos: 2–4 settimane; Enteroporc Coli AC: 2 settimane; Suiseng: 3 settimane"
      ],
      [
       "**1–2 settimane prima del parto**",
       "antiparassitario contro i vermi intestinali (Strongyloides, ascaridi)",
       "riduce i parassiti che passano ai suinetti con il latte (§4)"
      ],
      [
       "**All'ingresso in sala parto**",
       "trattamento contro la **rogna**, se prescritto; **lavaggio** (sotto)",
       "sala parto già pulita, disinfettata e asciutta (§9.3)"
      ],
      [
       "**Ingresso in sala parto**",
       "**4–7 giorni prima** del parto, non all'ultimo momento",
       "l'ingresso meno di 4 giorni prima del parto è un fattore di rischio della sindrome post-parto della scrofa"
      ],
      [
       "**Due volte l'anno, tutti i riproduttori**",
       "richiamo del **mal rosso**",
       ""
      ],
      [
       "**Secondo il piano regionale**",
       "vaccino contro l'**Aujeszky**, obbligatorio nel Lazio",
       "data e numero delle vaccinazioni sul Modello 4 (§1)"
      ],
      [
       "**Da valutare**",
       "circovirus (già in uso), rotavirus, vaccino stabulogeno",
       "con il veterinario"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Quale vaccino contro le diarree:** dipende da cosa trova il laboratorio (§6.1). Porcilis ColiClos copre *E. coli* e il clostridio tipo C; Enteroporc Coli AC anche il tipo A; Suiseng Diff/A copre *C. difficile* e tipo A ma non il tipo C né *E. coli* (§9.6)."
      },
      {
       "testo": "**Prodotti e dosi:** li decide e li prescrive il veterinario. Ogni vaccinazione e ogni trattamento vanno **registrati** (data, scrofa, prodotto, lotto)."
      },
      {
       "testo": "**Scheda della scrofa:** per ogni scrofa annotare la data prevista del parto e, all'indietro, le date dei vaccini e dei trattamenti: così nessuna scadenza viene saltata."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Lavaggio della scrofa prima della sala parto"
    },
    {
     "tipo": "p",
     "testo": "**Dove.** In una zona di lavaggio **fuori** dalla sala parto (corridoio o area di attesa), con scolo dell'acqua; mai dentro il box parto già pulito."
    },
    {
     "tipo": "p",
     "testo": "**Attrezzatura.** Idropulitrice con serbatoio, meglio ad acqua calda o con acqua riscaldata; spazzola a manico lungo; sapone o detergente per animali (shampoo zootecnico); asciugamani o teli; recinto riparato dalle correnti per l'asciugatura."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Passo",
      "Cosa fare"
     ],
     "righe": [
      [
       "1. Bagnare",
       "acqua **tiepida, 20–25 °C**, su tutto il corpo, dal dorso verso il basso"
      ],
      [
       "2. Insaponare",
       "sapone o detergente per animali, con la spazzola su zampe, unghioni, pancia, **mammelle** e zona della vulva, dove si accumulano feci e fango"
      ],
      [
       "3. Lasciare agire",
       "qualche minuto, come indica l'etichetta del prodotto"
      ],
      [
       "4. Risciacquare",
       "acqua tiepida a **pressione bassa**; mai il getto forte su mammelle, vulva, occhi e orecchie"
      ],
      [
       "5. Asciugare",
       "in un recinto asciutto e senza correnti; la scrofa entra in sala parto **asciutta**"
      ],
      [
       "6. Entrare in sala parto",
       "nel box già disinfettato e asciutto; trattamento contro la rogna, se prescritto, dopo il lavaggio"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "In uno studio su quattro allevamenti belgi le scrofe sono state lavate con acqua a 15–25 °C, detergente e risciacquo, anche con l'idropulitrice ad alta pressione: **nessuna ha avuto irritazioni della pelle**."
    },
    {
     "tipo": "p",
     "testo": "**Estate e inverno** (proposta del Tenente: non ho trovato fonti con una temperatura limite)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Estate:** lavaggio completo come sopra; aiuta anche la scrofa a sopportare il caldo."
      },
      {
       "testo": "**Inverno:** la scrofa sopporta il lavaggio se l'acqua è tiepida, se si lava al coperto e se viene **asciugata** prima di entrare in sala parto. Nelle giornate fredde, o se manca un posto riparato per asciugarla:",
       "sotto": [
        "pulizia a secco con la spazzola su tutto il corpo;",
        "lavaggio con acqua tiepida **solo** di mammelle, pancia, zampe e zona della vulva, poi asciugatura con un telo;",
        "mai lavare la scrofa all'aperto con il freddo né lasciarla bagnata."
       ]
      },
      {
       "testo": "**La polvere** asciugante si sparge nel box e sulla lettiera per tenere il nido asciutto; non sostituisce il lavaggio della scrofa."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Per Podere Verde:** preparare una **scheda per ogni scrofa** con il calendario qui sopra, partendo dalla data prevista del parto, e scegliere con il veterinario il vaccino contro le diarree dopo la diagnosi di laboratorio."
    }
   ]
  },
  {
   "id": "cap04",
   "titolo": "4. Suinetti sottoscrofa da 1 a 4 settimane",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "**Perché conta.** Dalla seconda settimana il suinetto cresce in fretta, ma le difese prese con il colostro calano e le sue non sono ancora pronte. In questo periodo i problemi principali sono la **coccidiosi**, i **parassiti** passati dalla scrofa, l'**anemia** per mancanza di ferro e le **infezioni delle ferite** (castrazione, ombelico, ginocchia). Molti si prevengono **prima**: trattando la scrofa prima del parto, dando il ferro nella prima settimana, tenendo il box asciutto e pulito (calendario della scrofa nel §3.4)."
    },
    {
     "tipo": "h4",
     "testo": "Come orientarsi: cosa si vede e cosa può essere"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Cosa si vede",
      "Età",
      "Causa probabile",
      "Gravità"
     ],
     "righe": [
      [
       "Feci **pastose biancastre o gialle**, poi acquose, che **non migliorano con gli antibiotici**; suinetti magri e con il pelo ispido",
       "5–15 giorni",
       "**coccidiosi**",
       "fino al 20% di morti, anche all'aperto; i sopravvissuti crescono meno"
      ],
      [
       "Diarrea **gialla o grigia, acquosa poi pastosa**, che dura 2–5 giorni",
       "da 5 giorni a 3 settimane, e subito dopo lo svezzamento",
       "rotavirus",
       "pochi morti"
      ],
      [
       "Diarrea grave, suinetti pallidi e magri",
       "sotto le 2 settimane",
       "parassita *Strongyloides*, passato con il latte",
       "possono morire i più giovani"
      ],
      [
       "**Pallore**, respiro veloce, debolezza, a volte pelle giallastra",
       "2–3 settimane",
       "**anemia da ferro**",
       "crescita ridotta, più malattie"
      ],
      [
       "**Prurito**, suinetti che si grattano e scuotono la testa; lesioni che partono dalle orecchie",
       "già dai 4 giorni",
       "**rogna** passata dalla scrofa",
       "crescita ridotta"
      ],
      [
       "**Zoppia**, articolazioni gonfie e calde, febbre",
       "1–4 settimane, spesso dopo castrazione o ferite",
       "artrite da batteri (streptococchi e altri)",
       "da curare subito"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "Per le diarree dei primi giorni vedi la tabella del §3. Se compare una malattia si applicano le regole del §3.1."
    },
    {
     "tipo": "h4",
     "testo": "Cosa fare subito"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Annotare** nidiata, età, sintomi, malati e morti; foto delle feci o delle lesioni."
      },
      {
       "testo": "**Diarrea:** calore, acqua ed elettroliti, veterinario, campioni, igiene, come nel §3. Per i coccidi le feci si raccolgono **da più nidiate e si ripete il prelievo**: le oocisti compaiono nelle feci dopo i sintomi, quindi un esame negativo non esclude la coccidiosi."
      },
      {
       "testo": "**Pallore:** controllare sul registro se la nidiata ha avuto il ferro; il veterinario può misurare l'emoglobina (anemia sotto 8 g ogni 100 ml di sangue)."
      },
      {
       "testo": "**Prurito:** il veterinario conferma la rogna con un raschiato della pelle dell'orecchio."
      },
      {
       "testo": "**Zoppia:** veterinario lo stesso giorno; antibiotico solo con ricetta."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Coccidiosi"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un parassita microscopico dell'intestino (*Cystoisospora suis*). I suinetti lo prendono ingoiando le **oocisti** lasciate nel box parto dalle nidiate precedenti."
      },
      {
       "testo": "**Come si riconosce:** tra i 5 e i 15 giorni, feci cremose, pastose o biancastre fino a diarrea acquosa giallastra; suinetti magri e con il pelo ispido per settimane. Gli antibiotici non servono."
      },
      {
       "testo": "**Perché il box parto si ricontamina:** al caldo delle lampade (25–35 °C) le oocisti diventano infettanti in 12–24 ore e restano vive per **oltre 10 mesi**; resistono ai disinfettanti comuni. Più presto il suinetto si infetta, più la malattia è grave."
      },
      {
       "testo": "**Cura:** acqua ed elettroliti a tutta la nidiata; farmaco scelto dal veterinario."
      },
      {
       "testo": "**Prevenzione:**",
       "sotto": [
        "**toltrazuril** ai suinetti nei primi giorni di vita, per bocca o iniettabile insieme al ferro (§9.5): prodotto e dose li decide il veterinario;",
        "box parto **tutto pieno / tutto vuoto**: pulizia, asciugatura, disinfezione con **prodotti a base di cresolo** o **vapore** (§9.2–9.3);",
        "feci tolte ogni giorno, canali di scolo puliti, lettiera cambiata spesso, ambiente asciutto;",
        "controllo di roditori e insetti (§3.3);",
        "esami delle feci periodici per controllare che il farmaco funzioni ancora: in Olanda è stato trovato un ceppo resistente."
       ]
      },
      {
       "testo": "**Vaccino:** non esiste in commercio."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Rotavirus"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un virus dell'intestino, molto diffuso negli allevamenti."
      },
      {
       "testo": "**Come si riconosce:** diarrea gialla o grigia, prima acquosa poi pastosa, per 2–5 giorni; colpisce i suinetti da 5 giorni a 3 settimane e di nuovo dopo lo svezzamento. Muoiono pochi suinetti."
      },
      {
       "testo": "**Cura:** nessun farmaco contro il virus: calore, acqua ed elettroliti."
      },
      {
       "testo": "**Prevenzione:** colostro abbondante (§2.2), calore (§2.1), igiene del box parto. Il vaccino delle scrofe contro il rotavirus di gruppo A: disponibilità in Italia da chiedere al veterinario. Il kit rapido Anigen (§6.2) lo riconosce in 10 minuti."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Strongyloides (verme filiforme)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un piccolo verme intestinale. Le larve restano nascoste nella mammella della scrofa e passano ai suinetti **con il latte**, anche per più parti di seguito; entrano anche attraverso la pelle."
      },
      {
       "testo": "**Come si riconosce:** le infezioni leggere non si vedono; quelle forti danno diarrea, anemia e dimagrimento; i morti sono di solito sotto le 2 settimane."
      },
      {
       "testo": "**Diagnosi:** esame delle feci prese dal retto e tenute al fresco."
      },
      {
       "testo": "**Prevenzione:** **trattare la scrofa 1–2 settimane prima del parto** con l'antiparassitario prescritto dal veterinario; box pulito e asciutto."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Anemia da ferro"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** il suinetto nasce con poche riserve di ferro, il latte della scrofa ne contiene poco e senza ferro il sangue non porta abbastanza ossigeno. Le riserve finiscono in 2–3 settimane."
      },
      {
       "testo": "**Come si riconosce:** pelle e mucose pallide, respiro veloce, debolezza, a volte pelle giallastra; crescita ridotta e più malattie."
      },
      {
       "testo": "**Prevenzione:** **ferro iniettabile nella prima settimana di vita** a tutti i suinetti; prodotto e dose dal veterinario. Esistono anche prodotti che uniscono ferro e toltrazuril (§9.5)."
      },
      {
       "testo": "**All'aperto:** i suinetti che grufolano nel terreno prendono ferro dalla terra e rischiano meno; quelli su grigliato o pavimento pieno dipendono solo dall'iniezione."
      },
      {
       "testo": "**Registro:** segnare data e nidiata di ogni trattamento con il ferro."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Rogna sarcoptica"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un acaro della pelle che passa dalla scrofa ai suinetti per contatto; bastano 24 ore in un box infestato per prenderlo."
      },
      {
       "testo": "**Come si riconosce:** prurito già a 4 giorni di vita; i suinetti si grattano e scuotono la testa; le lesioni partono dalle orecchie e si estendono a corpo, coda e zampe. I suini infestati crescono meno."
      },
      {
       "testo": "**Diagnosi:** raschiato della pelle dell'orecchio."
      },
      {
       "testo": "**Prevenzione:** **trattare le scrofe prima che entrino in sala parto**, con il prodotto prescritto dal veterinario. Per eliminarla dall'allevamento bisogna trattare tutti gli animali nello stesso periodo, trattare l'ambiente e mettere in quarantena e trattare i nuovi arrivati."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Artriti e infezioni delle ferite"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** batteri (soprattutto streptococchi) che entrano dalle ferite (castrazione, ombelico, denti, ginocchia sbucciate sul pavimento ruvido) e arrivano alle articolazioni."
      },
      {
       "testo": "**Come si riconosce:** zoppia, articolazioni gonfie e calde, febbre; con *Streptococcus suis* anche meningite (il suinetto pedala a terra)."
      },
      {
       "testo": "**Cura:** antibiotico precoce, prescritto dal veterinario."
      },
      {
       "testo": "**Prevenzione:** castrazione **entro il 7° giorno** di vita, con strumenti puliti e disinfettati (§1); disinfezione dell'ombelico alla nascita; pavimento del nido liscio e asciutto; nessuna operazione inutile sui denti."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Per Podere Verde:**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "oggi non si fa nessuna profilassi specifica contro le diarree, quindi nemmeno contro i coccidi: da decidere con il veterinario dopo l'esame delle feci;"
      },
      {
       "testo": "verificare se le scrofe ricevono un antiparassitario prima del parto (dato NON TROVATO);"
      },
      {
       "testo": "la castrazione tra 2 e 4 settimane coincide con il periodo delle artriti: anticiparla entro il 7° giorno (§1);"
      },
      {
       "testo": "verificare che tutti i suinetti ricevano il ferro nella prima settimana e che sia registrato."
      }
     ]
    }
   ]
  },
  {
   "id": "cap05",
   "titolo": "5. Svezzamento e post-svezzamento (4–10 settimane)",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "**Perché conta.** Lo svezzamento è il momento più stressante della vita del suinetto: in un giorno perde la madre e il latte, cambia box, cibo e compagni. Per qualche giorno mangia poco, l'intestino si indebolisce e i batteri (soprattutto *E. coli*) ne approfittano. Dopo il ritiro dell'**ossido di zinco ad alto dosaggio** (dal 26/06/2022) la prevenzione si fa con la **gestione**: suinetti pesanti e abituati al mangime già sottoscrofa, caldo, acqua, pulizia e alimentazione adatta. Per legge lo svezzamento **non avviene prima dei 28 giorni** (fino a 21 giorni solo in locali specializzati; D.Lgs. 122/2011)."
    },
    {
     "tipo": "h4",
     "testo": "Come orientarsi: cosa si vede e cosa può essere"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Cosa si vede",
      "Quando",
      "Causa probabile",
      "Gravità"
     ],
     "righe": [
      [
       "Diarrea **acquosa** in più suinetti",
       "primi giorni dopo lo svezzamento",
       "colibacillosi post-svezzamento (*E. coli* F4 o F18)",
       "grave se non si interviene; disidratazione"
      ],
      [
       "**Morte improvvisa** dei suinetti più belli, barcollamento, **gonfiore di palpebre e fronte**",
       "1–2 settimane dopo lo svezzamento",
       "malattia degli edemi (*E. coli* F18 con tossina)",
       "fino al 90% dei colpiti muore"
      ],
      [
       "Febbre, suinetto a terra che **pedala**, articolazioni gonfie, morte improvvisa",
       "2–5 settimane dopo lo svezzamento",
       "*Streptococcus suis*",
       "grave; **si trasmette all'uomo**"
      ],
      [
       "Febbre alta (41,5 °C), articolazioni gonfie, respiro difficile",
       "4–8 settimane di vita",
       "malattia di Glässer",
       "grave"
      ],
      [
       "Suinetti che **deperiscono**, linfonodi ingrossati",
       "8–18 settimane di vita",
       "circovirus (PCV2)",
       "crescita ridotta, morti"
      ],
      [
       "Diarrea gialla o grigia per 2–5 giorni",
       "subito dopo lo svezzamento",
       "rotavirus (§4)",
       "lieve"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "Se compare una malattia si applicano le regole del §3.1."
    },
    {
     "tipo": "h4",
     "testo": "Come svezzare bene"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Cosa",
      "Come"
     ],
     "righe": [
      [
       "**Prima dello svezzamento**",
       "mangime per suinetti nel box parto dal 4°–5° giorno di vita, poco e spesso, perché imparino a mangiare; suinetti pesanti e sani (colostro §2.2, ferro §4)"
      ],
      [
       "**Box di svezzamento**",
       "pulito, disinfettato e **asciutto** prima dell'arrivo (§9.3); tutto pieno / tutto vuoto"
      ],
      [
       "**Temperatura**",
       "**26–28 °C** all'arrivo, senza correnti d'aria; i più piccoli con lampada, paglia o carta. Suinetti ammucchiati = freddo"
      ],
      [
       "**Acqua**",
       "sempre disponibile e facile da trovare; i primi giorni anche in una ciotola in più per farli bere subito; acqua controllata almeno due volte l'anno"
      ],
      [
       "**Mangime**",
       "lo stesso usato in sala parto per i primi giorni, poi cambio graduale; nelle prime 48 ore far mangiare e bere tutti"
      ],
      [
       "**Gruppi**",
       "non mescolare suinetti di età e provenienze diverse più del necessario; maneggiarli con calma"
      ],
      [
       "**Controllo**",
       "ogni giorno: chi non mangia, chi ha diarrea, chi zoppica, chi respira male; pesate a campione"
      ]
     ]
    },
    {
     "tipo": "h4",
     "testo": "Colibacillosi post-svezzamento"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** *E. coli* con fimbrie F4 o F18 che si attaccano all'intestino indebolito dallo svezzamento."
      },
      {
       "testo": "**Come si riconosce:** diarrea acquosa nei primi giorni dopo lo svezzamento, disidratazione, a volte morte."
      },
      {
       "testo": "**Cura:** acqua ed elettroliti; antibiotico solo con ricetta e antibiogramma."
      },
      {
       "testo": "**Prevenzione:** la gestione della tabella sopra; **vaccino vivo per bocca** ai suinetti contro F4 e F18, su indicazione del veterinario; pulizia del box di svezzamento."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Malattia degli edemi"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un *E. coli* F18 che produce una tossina che danneggia i vasi sanguigni."
      },
      {
       "testo": "**Come si riconosce:** 1–2 settimane dopo lo svezzamento muoiono all'improvviso i suinetti **più grossi e voraci**; altri barcollano, hanno **palpebre e fronte gonfie**."
      },
      {
       "testo": "**Cura:** spesso troppo tardi quando si vedono i segni; il veterinario decide."
      },
      {
       "testo": "**Prevenzione:** dieta **più ricca di fibra e meno proteica** nelle prime settimane, mangime razionato i primi giorni; vaccino."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Streptococcus suis"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un batterio che molti suini portano nelle tonsille e che si attiva con lo stress (svezzamento, mescolamenti, freddo, ferite)."
      },
      {
       "testo": "**Come si riconosce:** febbre, meningite (il suinetto è a terra e pedala), artriti, morte improvvisa."
      },
      {
       "testo": "**Attenzione:** **si trasmette all'uomo** attraverso ferite delle mani: guanti quando si maneggiano suini malati o morti."
      },
      {
       "testo": "**Cura:** antibiotico **precoce**, prescritto dal veterinario."
      },
      {
       "testo": "**Prevenzione:** meno stress, niente sovraffollamento, buona ventilazione, castrazione entro il 7° giorno (§1); vaccini stabulogeni preparati con il ceppo dell'allevamento."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Malattia di Glässer"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un batterio che infiamma le membrane di articolazioni, torace e addome."
      },
      {
       "testo": "**Come si riconosce:** tra le 4 e le 8 settimane, febbre alta (41,5 °C), articolazioni gonfie, respiro difficile, morte."
      },
      {
       "testo": "**Prevenzione:** vaccini; meno stress allo svezzamento e nei trasferimenti."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Circovirus (PCV2)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Cos'è:** un virus diffusissimo che indebolisce le difese."
      },
      {
       "testo": "**Come si riconosce:** tra le 8 e le 18 settimane, suini che deperiscono, linfonodi ingrossati."
      },
      {
       "testo": "**Prevenzione:** vaccino, **già in uso** a Podere Verde."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Per Podere Verde:**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "registrare età, peso medio e numero dei suinetti a ogni svezzamento, e i morti nelle settimane successive con la causa probabile;"
      },
      {
       "testo": "dare il mangime per suinetti nel box parto dalla prima settimana;"
      },
      {
       "testo": "preparare un box di svezzamento caldo (26–28 °C) e asciutto; con il semibrado, ripari e lettiera abbondante d'inverno;"
      },
      {
       "testo": "con il veterinario: vaccino contro *E. coli* dei suinetti e vaccini contro streptococco e Glässer, solo se la diagnosi li indica."
      }
     ]
    }
   ]
  },
  {
   "id": "cap06",
   "titolo": "6. Laboratorio, medicinali e prodotti",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "**Come si usa questo capitolo.** Prima la diagnosi (§6.1–6.2), poi la scelta del medicinale con il veterinario (§6.3); i prodotti per la disinfezione e per la lotta a roditori e insetti sono nelle tabelle §6.4–6.5. In Italia vale sempre l'**etichetta italiana** del prodotto."
    },
    {
     "tipo": "h3",
     "testo": "6.1 Cosa chiedere al veterinario e all'IZS Lazio e Toscana"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Necroscopia** di 2–3 suinetti con diarrea, vivi e non trattati, soppressi dal veterinario, più suinetti morti freschi. Esami da chiedere:",
       "sotto": [
        "istologia dell'intestino;",
        "*E. coli* con tipizzazione delle fimbrie e delle tossine;",
        "tossine di *C. perfringens* e *C. difficile*;",
        "PCR per rotavirus e PED/TGE;",
        "ricerca dei coccidi."
       ]
      },
      {
       "testo": "**Feci per coccidi** da più figliate tra 7 e 21 giorni, ripetendo il prelievo."
      },
      {
       "testo": "**Antibiogramma** prima di qualsiasi antibiotico."
      },
      {
       "testo": "**Aborti, mummificati, nati morti:** feti e placenta al laboratorio; esami del sangue delle scrofe per PRRS, parvovirus e leptospira."
      },
      {
       "testo": "**Registro dei morti con la causa:** schiacciato, debole, diarrea, nato morto (prova del galleggiamento del polmone), mummificato."
      },
      {
       "testo": "**Conservazione dei campioni** (indicazioni generali IZSLER): refrigerati tra +1 e +10 °C; consegna entro 24 ore, altrimenti congelare; istologia in formalina. Regole specifiche dell'IZS Lazio e Toscana: NON TROVATE, da chiedere alla sede di Roma."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "6.2 Kit rapidi per la diarrea"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Kit rapidi da allevamento per E. coli dei suinetti o per la tossina beta di C. perfringens (tipo C): NON TROVATI.**"
      },
      {
       "testo": "Utile in sala parto: **Bionote Anigen Rapid PED/TGE/Rota Ag** (feci, 10 minuti, sensibilità circa 92% rispetto alla PCR). Se è negativo, la diarrea con buona probabilità non è virale."
      },
      {
       "testo": "Kit esaminati e scartati:",
       "sotto": [
        "test GDH per *C. difficile* (Securlab): uso umano, altro batterio. Nel suinetto anche i test umani per le tossine A e B trovano solo il 41–64% dei casi;",
        "Megacor FASTest C. perfringens Toxin: rileva l'enterotossina, non la tossina beta;",
        "VETDiagnostix CPE Ag: rileva la tossina alfa, comune a tutti i tipi, ed è validato solo per il cavallo;",
        "VetExpert C. perfringens Ag: scheda non leggibile."
       ]
      },
      {
       "testo": "La tossina beta si cerca solo in laboratorio: Bio-X BIO K 267 (ELISA) o PCR all'IZS Lazio e Toscana."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "6.3 Medicinali autorizzati in Italia, per malattia"
    },
    {
     "tipo": "p",
     "testo": "**Regole**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Ogni medicinale veterinario richiede la ricetta elettronica** del veterinario (D.Lgs. 218/2023). Prodotto, dose e durata li decide lui: in questo quaderno non ci sono dosi."
      },
      {
       "testo": "**Registrazione dei trattamenti** obbligatoria per l'allevatore (data, animali, prodotto, lotto, tempo di attesa); sanzione da 2.600 a 15.500 €."
      },
      {
       "testo": "**Antibiotici** (Reg. UE 2019/6, art. 107): mai di routine né per compensare igiene o gestione carenti; prevenzione solo in casi eccezionali e sul singolo animale; trattamento del gruppo solo con rischio alto e nessuna alternativa; scelta con l'antibiogramma."
      },
      {
       "testo": "**Ossido di zinco ad alto dosaggio:** ritirato dal 26/06/2022."
      },
      {
       "testo": "**Tempo di attesa:** giorni che devono passare dall'ultimo trattamento alla macellazione. Va rispettato per ogni suino venduto o macellato."
      },
      {
       "testo": "**Autorizzato non vuol dire in vendita:** alcuni prodotti sono autorizzati in Italia ma non distribuiti; prima di ordinarli il veterinario verifica con il distributore."
      },
      {
       "testo": "Elenco controllato sulla banca dati europea dei medicinali veterinari, ottobre 2026."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Vaccini, antiparassitari e altri medicinali**"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Malattia",
      "Medicinali autorizzati in Italia (titolare)",
      "Tempo di attesa carne"
     ],
     "righe": [
      [
       "Colibacillosi neonatale (vaccino delle scrofe)",
       "**Porcilis ColiClos** (MSD), anche contro clostridio tipo C; **Suiseng Coli/C** (Hipra), anche contro clostridio tipo C; **Porcilis Porcoli Diluvac Forte** (MSD); Enteroporc Coli AC (Ceva), anche tipo A",
       "0 giorni"
      ],
      [
       "Colibacillosi post-svezzamento (vaccino dei suinetti)",
       "**Coliprotec F4/F18** (Elanco), vaccino vivo per bocca",
       "0 giorni"
      ],
      [
       "Malattia degli edemi",
       "**Ecoporc Shiga** (Ceva)",
       "0 giorni"
      ],
      [
       "*Clostridium perfringens* tipo C",
       "Porcilis ColiClos; Suiseng Coli/C; Enteroporc Coli AC (vaccini delle scrofe)",
       "0 giorni"
      ],
      [
       "*C. perfringens* tipo A e *C. difficile*",
       "**Suiseng Diff/A** (Hipra)",
       "0 giorni"
      ],
      [
       "Coccidiosi",
       "**Baycox Multi** (Elanco) e **Zuritol** (Calier), toltrazuril per bocca: 77 giorni. **Forceris** (Ceva), toltrazuril + ferro iniettabile: 70 giorni. **Baycox Iron** (Elanco), toltrazuril + ferro iniettabile: 53 giorni",
       "vedi a sinistra"
      ],
      [
       "Anemia da ferro",
       "**Endofer** (Fatro), ferro destrano: 0 giorni; Forceris e Baycox Iron (sopra)",
       "vedi a sinistra"
      ],
      [
       "Vermi intestinali (*Strongyloides*, ascaridi)",
       "**Ivomec** iniettabile (Boehringer), ivermectina: 14 giorni; **Dectomax** (Zoetis), doramectina: 77 giorni; **Flubenvet** premiscela (Elanco), flubendazolo, solo vermi: 7 giorni",
       "vedi a sinistra"
      ],
      [
       "Rogna sarcoptica",
       "Ivomec; Dectomax",
       "14 / 77 giorni"
      ],
      [
       "Rotavirus",
       "vaccino autorizzato in Italia: NON TROVATO",
       "–"
      ],
      [
       "PED / TGE",
       "vaccino autorizzato in Italia: NON TROVATO",
       "–"
      ],
      [
       "*Streptococcus suis*",
       "vaccino autorizzato: NON TROVATO; vaccino stabulogeno dall'IZS; antibiotici (penicilline) su ricetta",
       "–"
      ],
      [
       "Malattia di Glässer",
       "**Porcilis Glässer** (MSD)",
       "0 giorni"
      ],
      [
       "Circovirus (PCV2)",
       "**Ingelvac CircoFLEX** (Boehringer); **Circovac** (Ceva); **Porcilis PCV M Hyo** (MSD), anche contro Mycoplasma",
       "0 giorni"
      ],
      [
       "Polmonite enzootica (*Mycoplasma*)",
       "**Hyogen** (Ceva); Porcilis PCV M Hyo",
       "0 giorni"
      ],
      [
       "Pleuropolmonite (APP)",
       "**Coglapix** (Ceva)",
       "0 giorni"
      ],
      [
       "Influenza",
       "**Respiporc FLUpan H1N1** e **Respiporc FLU3** (Ceva)",
       "0 giorni"
      ],
      [
       "Ileite (*Lawsonia*)",
       "**Enterisol Ileitis** (Boehringer), vivo per bocca; **Porcilis Lawsonia** (MSD); antibiotico Aivlosin (sotto)",
       "0 giorni (vaccini)"
      ],
      [
       "Dissenteria (*Brachyspira*)",
       "**Aivlosin** (ECO Animal Health), tilvalosina: 2 giorni; **Doximutil** (Trei), doxiciclina + tiamulina: 8 giorni",
       "vedi a sinistra"
      ],
      [
       "Salmonella",
       "**Salmoporc** (Ceva), vaccino vivo; autorizzazione italiana da confermare",
       "6 settimane"
      ],
      [
       "Mal rosso, parvovirus, leptospirosi",
       "**Porcilis Ery+Parvo+Lepto** (MSD); **Eryseng Parvo** (Hipra), mal rosso + parvovirus; **ReproCyc ParvoFLEX** (Boehringer), solo parvovirus",
       "0 giorni"
      ],
      [
       "PRRS",
       "**Porcilis PRRS** (MSD); **Ingelvac PRRSFLEX EU** (Boehringer)",
       "0 giorni"
      ],
      [
       "**Aujeszky** (obbligatorio nel Lazio)",
       "**ADiuvant-SUIVAX** (Fatro); **Porcilis Begonia IDAL** (MSD), intradermico",
       "0 giorni"
      ],
      [
       "Sindrome post-parto della scrofa",
       "**Metacam** 5 mg/ml (Boehringer), meloxicam: 5 giorni; **Izossitocina** (Izo), ossitocina: 0 giorni; indicazione per questa sindrome da controllare sul foglietto",
       "vedi a sinistra"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Prodotti non più autorizzati** (da togliere da eventuali piani): Neocolipor (rinuncia del 28/01/2025), Suvaxyn Aujeszky 783 (rinuncia del 04/10/2024), Econor (valnemulina)."
    },
    {
     "tipo": "p",
     "testo": "**Antibiotici per suini: esempi per classe** (sempre con ricetta e, quando possibile, antibiogramma)"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Classe",
      "Esempi autorizzati in Italia",
      "Tempo di attesa carne",
      "Note"
     ],
     "righe": [
      [
       "Penicilline",
       "**Longocillina L.A.** (Ceva), amoxicillina; **Vetamplius Suini** (Fatro), ampicillina",
       "20 giorni; 1 giorno",
       "prima scelta per streptococchi, su indicazione del veterinario"
      ],
      [
       "Fenicoli",
       "**Nuflor Suini** iniettabile (MSD), florfenicolo",
       "18 giorni",
       ""
      ],
      [
       "Macrolidi",
       "**Draxxin** (Zoetis), tulatromicina; **Aivlosin** (ECO), tilvalosina",
       "13 giorni; 2 giorni",
       ""
      ],
      [
       "Tetracicline + pleuromutiline",
       "**Doximutil** (Trei), doxiciclina + tiamulina",
       "8 giorni",
       "la tiamulina nel mangime è limitata dal 2020 a trattamento e metafilassi della dissenteria"
      ],
      [
       "Cefalosporine di 3ª generazione",
       "**Naxcel** (Zoetis), ceftiofur",
       "71 giorni",
       "**antibiotico critico**: solo con antibiogramma e se non c'è alternativa"
      ],
      [
       "Fluorochinoloni",
       "**Baytril** 100 mg/ml (Elanco), enrofloxacina",
       "13 giorni",
       "**antibiotico critico**: solo con antibiogramma e se non c'è alternativa"
      ]
     ]
    },
    {
     "tipo": "h3",
     "testo": "6.4 Disinfettanti e prodotti per l'igiene"
    },
    {
     "tipo": "p",
     "testo": "**Regole**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "In Italia un prodotto può essere venduto e usato come disinfettante solo se in etichetta c'è **«Presidio medico chirurgico Reg. n.»** oppure **«Prodotto biocida»** con il numero di autorizzazione. Senza numero è solo un detergente. Il D.Lgs. 179/2021 sanziona anche l'allevatore che usa prodotti non autorizzati."
      },
      {
       "testo": "I numeri qui sotto vengono da depliant e schede dei distributori italiani: **prima del primo acquisto vanno controllati** sul portale del Ministero della Salute (banca dati biocidi e presidi medico chirurgici)."
      },
      {
       "testo": "Prezzi trovati online a ottobre 2026, da confermare con il fornitore."
      }
     ]
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Uso",
      "Prodotto (titolare)",
      "Principi attivi",
      "Efficacia dichiarata",
      "Stato in Italia",
      "Prezzo trovato"
     ],
     "righe": [
      [
       "Ampio spettro: box vuoti, pediluvi, mezzi",
       "**Virkon S** (Lanxess; distributore Unitec)",
       "perossimonosolfato di potassio",
       "batteri, virus (anche PSA), funghi; pediluvi e mezzi all'1%",
       "**PMC Reg. n. 15973**",
       "1 kg 64,90 €; 5 kg 179 € + IVA (Medi Nova)"
      ],
      [
       "Ampio spettro: vuoto sanitario, mezzi",
       "**Virocid** (CID Lines; distributore Unitec)",
       "sali d'ammonio quaternario + glutaraldeide",
       "batteri, virus (PSA, Aujeszky), funghi",
       "**PMC Reg. n. 19726**",
       "20 litri 410 € + IVA (Medi Nova)"
      ],
      [
       "Pediluvi, stivali, mezzi",
       "**Virex** (Kersia)",
       "troclosene sodico + perossimonosolfato",
       "batteri, lieviti, virus (PSA); non dichiara oocisti né spore",
       "**PMC n. 20800**",
       "5 kg 149 € + IVA (Medi Nova)"
      ],
      [
       "Vuoto sanitario, mezzi",
       "**Hypred Force 7** (Kersia)",
       "glutaraldeide + sali d'ammonio quaternario",
       "batteri, lieviti, virus (PSA)",
       "PMC dichiarato, numero NON TROVATO",
       "22 litri 195 € + IVA (Medi Nova)"
      ],
      [
       "**Coccidi (oocisti)**, uova di vermi",
       "**Neopredisan 135-1** (Menno Chemie; in Italia Chemifarma)",
       "clorocresolo 25%",
       "oocisti di coccidi, uova di vermi, criptosporidi, batteri, funghi, virus",
       "n. 19217 dichiarato da un rivenditore: **da verificare**",
       "500 ml 32,50 €; 2 litri 73,80 € (ZooPiro)"
      ],
      [
       "**Coccidi (oocisti)**, uova di vermi",
       "**Fumagri Effisafe** (Kersia)",
       "clorocresolo + orto-fenilfenolo",
       "coccidi (*Eimeria*) al 2% per 120 minuti; uova di ascaridi al 3%; PSA all'1%",
       "PMC dichiarato, numero NON TROVATO",
       "22 litri 298 € + IVA (Medi Nova)"
      ],
      [
       "Spore dei clostridi",
       "nessun prodotto con numero italiano e dichiarazione sporicida trovato",
       "–",
       "–",
       "NON TROVATO: usare **vapore oltre 80 °C** (§9.2)",
       "–"
      ],
      [
       "Pavimenti, letame, imbiancatura",
       "**Calce viva CaO PT03** (Saniblanc D, Q2; Lhoist) e **calce idrata Ca(OH)2 PT03** (Saniblanc H90; Lhoist)",
       "ossido o idrossido di calcio",
       "batteri, lieviti, funghi, virus; letame anche uova di vermi; pavimenti 800 g/m² con acqua, contatto almeno 48 ore",
       "**autorizzazioni dell'Unione** EU-0029492-0000 e EU-0029520-0000, valide fino al 30/11/2033",
       "NON TROVATO"
      ],
      [
       "Lettiera e nido (asciugare)",
       "**Envirex+** (Kersia)",
       "caolino + 2% Virex",
       "polvere essiccante e igienizzante",
       "nessun numero: **non è un disinfettante**",
       "25 kg 44 € + IVA (Medi Nova)"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Altri prodotti al clorocresolo citati negli studi (Aldecoc CMK, Prophyl S, AGAKOK, Interkokask) e **Kenocox**: autorizzazione italiana NON TROVATA."
      },
      {
       "testo": "La calce generica «edile» o «agricola» si può usare, ma senza numero non può essere venduta come disinfettante."
      },
      {
       "testo": "Disinfezione dell'acqua di abbeverata: categoria diversa (PT5); nessun prodotto verificato."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "6.5 Prodotti contro roditori e insetti"
    },
    {
     "tipo": "p",
     "testo": "**Rodenticidi** (esche anticoagulanti, solo in erogatori chiusi; regole d'uso nel §3.3)"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Prodotto (titolare)",
      "Principio attivo",
      "Uso",
      "Chi può usarlo",
      "Autorizzazione italiana"
     ],
     "righe": [
      [
       "**Racumin Expert** pasta (Envu)",
       "cumatetralile 0,0026% (anticoagulante di prima generazione)",
       "ratto all'interno; ratto e arvicole intorno agli edifici; allevamenti citati in etichetta; scatola da 5 kg",
       "professionali",
       "IT/2021/00757/MRS"
      ],
      [
       "**Stermibrom Pasta HC / Gardentop Pasta Plus** (Zapi)",
       "bromadiolone 0,005%",
       "topo e ratto, interno ed esterno intorno agli edifici; da 1,5 a 15 kg",
       "professionali e professionisti formati",
       "IT/2014/00220/MRA"
      ],
      [
       "**Murin Forte Minipellet**",
       "bromadiolone 0,005%",
       "interno ed esterno; da 1,5 a 25 kg",
       "professionali; esca permanente solo professionisti formati",
       "IT/2013/00087/AUT"
      ],
      [
       "**Bocaraton / Murin Dife Fioccato** (Mayer Braun)",
       "difenacoum 0,005%",
       "interno ed esterno; da 1,5 a 25 kg",
       "professionali",
       "IT/2017/00432/AUT, scade il 31/12/2026"
      ],
      [
       "**Ratomide Pellet** (Colkim)",
       "brodifacoum 0,0025%",
       "interno e intorno agli edifici",
       "professionali (aree aperte solo formati)",
       "IT/2018/00448/AUT"
      ],
      [
       "**Storm Ultra Secure** blocchi (BASF)",
       "flocoumafen 0,0025%",
       "interno ed esterno; da 1,5 a 10 kg",
       "professionali",
       "IT/2019/00556/MRP, scade il 31/12/2026"
      ],
      [
       "**Notrac Blox** (Bell Labs; Colkim)",
       "bromadiolone 0,005%",
       "ratto e topo; 8 kg; **vietato come esca permanente**",
       "**solo professionisti formati**",
       "IT/2015/00285/MRS"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Confezioni per professionali: **almeno 1,5 kg**. Esca permanente: solo professionisti formati, nei siti ad alto rischio, con controllo almeno ogni 4 settimane."
      },
      {
       "testo": "Erogatori e trappole non sono biocidi: nessuna autorizzazione richiesta. Prezzi dei rodenticidi: NON TROVATI."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Insetticidi** (regole d'uso nel §3.3)"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Tipo",
      "Prodotto (titolare)",
      "Principio attivo",
      "Uso",
      "Autorizzazione italiana"
     ],
     "righe": [
      [
       "Larvicida sul letame",
       "**Baycidal GR4** (Envu)",
       "S-metoprene 0,4%",
       "letame e lettiera nelle porcilaie chiuse; concimaie impermeabili; mosca domestica e mosca cavallina; secchio da 15 kg",
       "IT/2020/00646/MRP"
      ],
      [
       "Larvicida sul letame",
       "**Solfac Antilarvale** (Envu)",
       "S-metoprene 0,4%",
       "come sopra; anche coleotteri della lettiera",
       "IT/2022/00789/MRS"
      ],
      [
       "Larvicida sul letame",
       "**Neporex 2SG** (Elanco)",
       "ciromazina",
       "sciolto in acqua e distribuito con l'annaffiatoio, 250 g per 10 m²",
       "autorizzazione dell'Unione EU-0032480-0000 (2025–2035)"
      ],
      [
       "Esca contro le mosche adulte",
       "**QuickBayt GR** (Envu)",
       "imidacloprid 0,5% + feromone",
       "dentro i ricoveri, in punti non raggiungibili dagli animali; secchio da 2 kg",
       "IT/2018/00477/MRP"
      ],
      [
       "Esca da pennellare o spruzzare",
       "**QuickBait WG10 Forte** (Envu)",
       "imidacloprid 10% + feromone",
       "solo all'interno dei ricoveri; flacone da 750 g",
       "IT/2018/00485/MRP"
      ],
      [
       "Esca da pennellare su pannelli",
       "**Agita 10 WG** (Elanco)",
       "tiametoxam",
       "su pannelli appesi, non direttamente sui muri",
       "IT/2018/00538/MRP"
      ],
      [
       "Larvicida e adulticida",
       "**Elector** (Elanco)",
       "spinosad",
       "spruzzato anche con animali presenti; principio attivo ammesso in agricoltura biologica",
       "IT/2015/00286/MRA"
      ],
      [
       "Lotta biologica",
       "**Biopar** (Koppert)",
       "vespe parassite *Muscidifurax raptorellus*",
       "liberate nel letame: circa 100 femmine per m² da aprile a giugno e fino a 200 da luglio a settembre, ogni settimana (Università di Modena)",
       "non serve autorizzazione; vendita in Italia e prezzo da confermare"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Gli spruzzi K-Othrine (deltametrina, Envu) **non** sono autorizzati nei ricoveri degli animali."
      },
      {
       "testo": "Prezzi degli insetticidi: NON TROVATI."
      }
     ]
    }
   ]
  },
  {
   "id": "cap07",
   "titolo": "7. Biosicurezza (DM 28 giugno 2022)",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "**Perché conta.** La biosicurezza è l'insieme delle regole che impediscono ai germi di **entrare** in allevamento (con persone, mezzi, animali nuovi, mangime, cinghiali, roditori) e di **muoversi** al suo interno. Con la peste suina africana nel Lazio (§1) è la prima difesa dell'allevamento: un solo focolaio significa abbattimento di tutti i suini e blocco delle vendite. Il DM 28 giugno 2022 fissa i requisiti minimi; le verifiche le fa il Servizio veterinario dell'ASL."
    },
    {
     "tipo": "p",
     "testo": "**Che allevamento è Podere Verde.** Allevamento **commerciale semibrado**. I requisiti cambiano se la capacità registrata in BDN è **bassa** (fino a 300 capi) o **alta**: va verificata la capacità registrata."
    },
    {
     "tipo": "h4",
     "testo": "Requisiti per gli allevamenti semibradi"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Requisito",
      "Bassa capacità",
      "Alta capacità",
      "Cosa fare a Podere Verde"
     ],
     "righe": [
      [
       "**Recinzione** perimetrale alta almeno 1,5 m; con reti contro i selvatici, **seconda recinzione** interna, anche elettrificata, ad almeno 1 m",
       "sì",
       "sì",
       "controllare altezza, integrità e interramento della rete; percorrerla ogni settimana"
      ],
      [
       "**Zona filtro** all'ingresso: calzari dedicati, abiti dedicati, lavandino, disinfettante",
       "sì",
       "sì",
       "locale o container all'ingresso con lato «sporco» e lato «pulito»"
      ],
      [
       "**Cambio di abiti e calzature** in entrata e in uscita; disinfezione all'ingresso",
       "sì",
       "sì",
       "stivali e tute solo per l'allevamento; pediluvio all'ingresso"
      ],
      [
       "**Mezzi**: attrezzatura per lavarli e disinfettarli all'ingresso",
       "sì",
       "in un punto fisso dedicato",
       "pompa e disinfettante per ruote e passaruota (§6.4)"
      ],
      [
       "**Mangime e lettiera** in depositi protetti dagli animali selvatici",
       "sì",
       "sì",
       "silos chiusi, paglia al coperto e recintata"
      ],
      [
       "**Carcasse**: cella frigorifera fuori dalla zona pulita, oppure ritiro da ditta entro 24 ore dalla chiamata; smaltimento secondo il Reg. (CE) 1069/2009",
       "sì",
       "sì",
       "cella frigorifera accessibile al camion **senza entrare** nell'allevamento"
      ],
      [
       "**Procedure scritte** di pulizia e disinfezione; disinfettanti di efficacia provata; animali reintrodotti **due giorni dopo** la fine di pulizia e disinfezione",
       "sì",
       "sì",
       "procedura del §9.3 appesa in azienda"
      ],
      [
       "**Piano di derattizzazione** scritto e documentato; manutenzione delle aree intorno all'allevamento",
       "consigliato",
       "obbligatorio",
       "piano e registro del §3.3"
      ],
      [
       "**Quarantena** dei riproduttori nuovi in locali separati, con accesso dalla zona filtro",
       "consigliata",
       "obbligatoria",
       "recinto separato per scrofette e verri acquistati"
      ],
      [
       "**Isolamento** degli animali malati",
       "sì (art. 3)",
       "sì (art. 3)",
       "box o recinto infermeria (§3.1)"
      ],
      [
       "**Registro** di ingresso di persone e veicoli; formazione del personale",
       "sì",
       "sì",
       "quaderno all'ingresso con data, nome, motivo, targa"
      ],
      [
       "**Caccia**: nessun contatto con i suini nelle 48 ore dopo una battuta",
       "sì",
       "sì",
       "regola scritta per dipendenti e familiari"
      ]
     ]
    },
    {
     "tipo": "h4",
     "testo": "Le regole in pratica"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Zona sporca e zona pulita.** Tutto quello che arriva da fuori (camion del mangime, ditta delle carcasse, veterinari, fornitori) si ferma nella zona sporca. Il camion del mangime scarica da fuori recinto; il camion delle carcasse non entra."
      },
      {
       "testo": "**Persone.** Entra solo chi serve. Chi è stato in un altro allevamento di suini o a caccia aspetta 48 ore. Tutti si cambiano nella zona filtro e firmano il registro."
      },
      {
       "testo": "**Attrezzi.** Attrezzi e mezzi aziendali restano in azienda; quelli prestati o noleggiati si lavano e disinfettano prima di entrare."
      },
      {
       "testo": "**Nuovi animali.** Solo da allevamenti di stato sanitario conosciuto, con documenti in regola (Modello 4). Quarantena separata, osservazione e vaccinazioni (§3.4) prima di unirli al gruppo."
      },
      {
       "testo": "**Cinghiali e selvatici.** Doppia recinzione; mangime, acqua e lettiera non raggiungibili dai selvatici; mai dare ai suini avanzi di cucina o carne (vietato per legge e via principale di diffusione della peste suina africana)."
      },
      {
       "testo": "**Morti.** Tolti subito, con i guanti, e messi in cella frigorifera o consegnati alla ditta; ogni morto registrato. Con sospetto di peste suina africana (febbre, chiazze rosse o violacee, morti improvvise): avviso immediato al veterinario e all'ASL (§3.1)."
      },
      {
       "testo": "**Roditori, insetti, cani e gatti:** fuori dai locali degli animali (§3.3)."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Peste suina africana: regole in vigore nel Lazio"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Zona infetta intorno a Riano dal 27/08/2026 (§1). Ordinanza del Commissario straordinario n. 4/2026, valida fino al 28/03/2027:",
       "sotto": [
        "morti da registrare in BDN entro 48 ore;",
        "verifica della biosicurezza con priorità ai semibradi; carenze non sanate in 15 giorni: svuotamento senza indennizzo;",
        "**semibradi entro 3 km da una carcassa positiva: obbligo di tenere i suini al chiuso.**"
       ]
      },
      {
       "testo": "In zona indenne: check-list di biosicurezza su ClassyFarm entro 30 giorni dalla verifica."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**ClassyFarm** (Ministero della Salute, portale Vetinfo): classifica ogni allevamento per biosicurezza, benessere, uso dei farmaci e lesioni al macello. Lo compilano il veterinario dell'ASL e il veterinario aziendale. L'adesione è facoltativa, ma l'autovalutazione annuale, la valutazione del rischio di morsicatura della coda e le check-list per la peste suina africana passano di lì."
    },
    {
     "tipo": "p",
     "testo": "**Per Podere Verde: cosa verificare subito**"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "Capacità registrata in BDN (bassa o alta): decide quali requisiti sono obbligatori."
      },
      {
       "testo": "Se l'allevamento ricade nella zona infetta o entro 3 km da una carcassa positiva."
      },
      {
       "testo": "Recinzione doppia integra, zona filtro, cella frigorifera o contratto con la ditta delle carcasse."
      },
      {
       "testo": "Registro dei visitatori, procedura scritta di pulizia e disinfezione, piano di derattizzazione."
      },
      {
       "testo": "Recinto di quarantena per gli animali acquistati e box infermeria."
      }
     ]
    }
   ]
  },
  {
   "id": "cap08",
   "titolo": "8. Allevamento all'aperto (semibrado)",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "**Perché conta.** All'aperto i suini stanno meglio sotto molti aspetti (movimento, comportamento naturale, ferro dal terreno, meno nati morti: 3,8% contro 5,5% al chiuso), ma il terreno, il clima e il contatto con i selvatici portano rischi propri. Il terreno non si disinfetta come un pavimento: si gestisce con la **rotazione** dei recinti."
    },
    {
     "tipo": "h4",
     "testo": "I rischi dell'aperto e cosa fare"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Rischio",
      "Perché all'aperto",
      "Cosa fare"
     ],
     "righe": [
      [
       "**Peste suina africana**",
       "contatto con i cinghiali attraverso la recinzione o il mangime",
       "doppia recinzione; mangime e acqua al riparo dai selvatici; regole del §7"
      ],
      [
       "**Vermi** (ascaridi, tricocefali)",
       "le uova di ascaridi restano vive nel suolo oltre 1–1,5 anni; in allevamenti biologici svedesi il 58% dei suini di 12 settimane era positivo",
       "rotazione dei recinti; esami delle feci periodici; antiparassitari prescritti (§6.3); letame compostato prima di spargerlo"
      ],
      [
       "**Coccidi e clostridi**",
       "capannine e lettiere contaminate da una nidiata all'altra",
       "capannine spostate su terreno pulito dopo ogni lattazione; lettiera tolta o bruciata; calcinazione del terreno (§9.4)"
      ],
      [
       "**Leptospirosi e dissenteria**",
       "roditori, uccelli acquatici, acque libere",
       "abbeveratoi puliti; suini lontani da stagni, fossi e corsi d'acqua; lotta ai roditori (§3.3)"
      ],
      [
       "**Mal rosso**",
       "il batterio vive nel terreno",
       "vaccino dei riproduttori due volte l'anno (§3.4)"
      ],
      [
       "**Caldo e sole**",
       "scottature e stress da caldo; la scrofa mangia e produce meno latte",
       "ombra in ogni recinto; **due pozze fangose per recinto, usate a turno** così una può asciugarsi"
      ],
      [
       "**Freddo, pioggia e fango**",
       "il suinetto bagnato si raffredda; la scrofa perde stato di carne",
       "capannine asciutte su terreno più alto; paglia abbondante, rinnovata due volte alla settimana nelle capannine parto; razione aumentata d'inverno (Appendice A)"
      ],
      [
       "**Volpi, corvi e altri predatori**",
       "possono uccidere e mangiare i suinetti",
       "recinto elettrico a tre fili intorno ai recinti parto"
      ]
     ]
    },
    {
     "tipo": "h4",
     "testo": "Densità e rotazione"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Situazione",
      "Scrofe al massimo per ettaro"
     ],
     "righe": [
      [
       "Recinti fissi, senza rotazione",
       "17"
      ],
      [
       "Rotazione con ritorno sullo stesso terreno dopo 2 anni",
       "21"
      ],
      [
       "Rotazione con ritorno dopo 1 anno",
       "24"
      ],
      [
       "Rotazione con colture, ritorno dopo almeno 2 anni",
       "32"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Fonte: linee guida dei suinicoltori neozelandesi; altre fonti indicano 15–20 scrofe per ettaro. Riferimento italiano volontario: **1.500 kg di peso vivo per ettaro**, dal disciplinare della Cinta Senese. Limite di legge per il semibrado convenzionale: NON TROVATO."
      },
      {
       "testo": "**Copertura del terreno:** nei recinti parto almeno il 70% di erba; per le scrofe in gestazione almeno il 40% su tre quarti del terreno. Quando l'erba sparisce e resta fango, il recinto va lasciato riposare."
      },
      {
       "testo": "**Recinti in pendenza:** i suini si spostano dall'alto verso il basso; le pozze e il fango non devono scolare nei corsi d'acqua."
      },
      {
       "testo": "**Mangiatoie e punti di alimentazione** distanti almeno 3 m tra loro e spostati spesso, per non creare zone di fango e di parassiti."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Capannine"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Capannine parto:** spostate su terreno pulito dopo ogni lattazione; asciutte, senza correnti, con paglia; controllate ogni giorno nella stagione fredda."
      },
      {
       "testo": "**Capannine per la gestazione:** porta rivolta dalla parte opposta al vento dominante; paglia asciutta."
      },
      {
       "testo": "La cuccia riscaldata del §2.1 vale per i box chiusi; nelle capannine all'aperto contano soprattutto paglia, asciutto e riparo dal vento."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Norme"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Ombra, pozza in estate e ripari d'inverno:** obbligo generale per gli animali tenuti all'aperto (D.Lgs. 146/2001, da verificare); valori numerici NON TROVATI."
      },
      {
       "testo": "**Anello al naso:** ammesso solo negli allevamenti all'aperto (D.Lgs. 122/2011)."
      },
      {
       "testo": "**Svezzamento:** non prima dei 28 giorni (D.Lgs. 122/2011)."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "**Per Podere Verde:**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "piantina dei recinti con il calendario di rotazione e il numero di scrofe per ettaro;"
      },
      {
       "testo": "esame delle feci per i vermi due volte l'anno e dopo ogni cambio di recinto (proposta del Tenente);"
      },
      {
       "testo": "capannine parto spostate dopo ogni lattazione, con data annotata;"
      },
      {
       "testo": "controllo settimanale della doppia recinzione."
      }
     ]
    }
   ]
  },
  {
   "id": "cap09",
   "titolo": "9. Coccidiosi e clostridi: prevenzione, disinfezione, trattamenti",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "**Avvertenze**"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Solo dati letti su schede ufficiali e studi; nessuna dose decisa da noi. Farmaci e vaccini: **ricetta e decisione del veterinario**."
      },
      {
       "testo": "**Disinfettanti:** in Italia si può usare solo un prodotto con la dicitura «PRODOTTO BIOCIDA (PT3)» e numero di autorizzazione, oppure «Presidio medico chirurgico Reg. n.» (nota del Ministero della Salute 2019). I prodotti con numero italiano trovati sono nella tabella del **§6.4**; vale sempre l'etichetta italiana. Medicinali e vaccini autorizzati in Italia: **§6.3**."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.1 Perché i normali disinfettanti non bastano"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Oocisti dei coccidi:** resistono ai disinfettanti comuni; restano infettanti per mesi in ambiente umido (oltre 10 mesi). **Sotto le lampade a 32–35 °C diventano infettanti in 12–16 ore**: per questo il box parto si ricontamina in fretta."
      },
      {
       "testo": "**Spore dei clostridi:** molto più resistenti; alcoli, fenoli e sali d'ammonio quaternario possono non distruggerle nemmeno ad alta concentrazione; **lo sporco organico blocca quasi ogni disinfettante**. Ogni focolaio arricchisce di spore l'ambiente del parto."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.2 Cosa funziona"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Mezzo",
      "Contro le oocisti",
      "Contro le spore dei clostridi"
     ],
     "righe": [
      [
       "**Clorocresolo** (p-cloro-m-cresolo)",
       "**Efficace.** Neopredisan 135-1: oltre il 95% delle oocisti distrutte in 30 minuti in laboratorio; in allevamento circa il 50% in meno di nidiate positive",
       "Solo Neopredisan dichiara efficacia: 4% per 1 ora su superfici pulite, in laboratorio. In generale i fenoli sono poco efficaci sulle spore"
      ],
      [
       "**Perossido di idrogeno + acido peracetico**",
       "efficacia non dimostrata",
       "**I migliori:** al 10% riduzione di 4,9–6,0 log in 20–60 minuti; al 2% quasi inefficaci con sporco presente"
      ],
      [
       "Glutaraldeide + benzalconio 2%",
       "non dimostrata",
       "riduzione 2,9–5,7 log"
      ],
      [
       "Ipoclorito (candeggina)",
       "fonti discordanti",
       "5%: efficace solo in acqua pulita, quasi nullo con sporco"
      ],
      [
       "Sali d'ammonio quaternario",
       "scarsi",
       "deboli"
      ],
      [
       "**Vapore / calore**",
       "vapore almeno 65 °C per almeno 15 minuti, oppure lanciafiamme",
       "**servono oltre 80 °C**; lanciafiamme"
      ],
      [
       "Calce viva, latte di calce",
       "imbiancatura efficace; 3–4 giorni prima di rimettere gli animali",
       "fonti in conflitto: efficace per alcune, inefficace sotto 80 °C per altre"
      ],
      [
       "Asciutto e sole",
       "riducono le oocisti; i raggi UV agiscono solo in superficie",
       "solo superficie"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Prodotti a base di clorocresolo con dati pubblicati** (nessuno ha efficacia dimostrata sulle spore):"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Prodotto",
      "Principio attivo",
      "Dati contro i coccidi",
      "In Italia"
     ],
     "righe": [
      [
       "Neopredisan 135-1 (Menno Chemie)",
       "clorocresolo",
       "2,5% per 2 ore (protozoi); *Isospora suis* 2% per 1 ora in laboratorio. Una scheda più vecchia indica 4% per 2 ore: vale l'etichetta in uso",
       "n. 19217 dichiarato da un rivenditore, da verificare (§6.4)"
      ],
      [
       "Aldecoc CMK (Lanxess)",
       "clorocresolo 25%",
       "2% per 2 ore a 20 °C, 400 ml/m², solo locali vuoti, poi risciacquo",
       "NON TROVATO"
      ],
      [
       "Prophyl S (Huvepharma)",
       "clorocresolo 17% + acido glicolico",
       "2% per almeno 2 ore; 0,4 l/m² su cemento, 0,5 l/m² su terra battuta; oocisti ridotte del 99,7%",
       "NON TROVATO"
      ],
      [
       "AGAKOK 2.5 (Kersia)",
       "clorocresolo",
       "2% per 2 ore a 20 °C",
       "NON TROVATO"
      ],
      [
       "Interkokask, Kokzi-Des, Bi-OO-Cyst",
       "clorocresoli / non indicato",
       "2 ore di contatto (dati parziali)",
       "NON TROVATO"
      ],
      [
       "Kenocox (CID Lines)",
       "ammina + benzalconio",
       "2–4% per 2 ore, **ma la registrazione belga non copre i coccidi**",
       "venduto online senza numero italiano: NON TROVATO"
      ],
      [
       "Fumagri Effisafe (Kersia)",
       "clorocresolo + orto-fenilfenolo",
       "*Eimeria* 2% per 120 minuti; uova di ascaridi 3%",
       "PMC dichiarato, numero NON TROVATO (§6.4)"
      ]
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.3 Procedura per il box parto (tutto pieno / tutto vuoto)"
    },
    {
     "tipo": "p",
     "testo": "**Il principio.** Nessuna nidiata deve trovare nel box le feci, le oocisti e le spore della nidiata precedente. Il box si svuota del tutto, si pulisce, si **asciuga**, si disinfetta e resta vuoto prima della scrofa successiva. Il disinfettante su una superficie sporca o bagnata non funziona: la pulizia vale più del disinfettante."
    },
    {
     "tipo": "h4",
     "testo": "Calendario di un box, dallo svezzamento alla scrofa successiva"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Giorno",
      "Fase",
      "Cosa fare",
      "Controllo"
     ],
     "righe": [
      [
       "**0**",
       "1. Svuotamento",
       "scrofa e suinetti fuori; smontare mangiatoie, abbeveratoi, cuccia, lampada e attrezzi mobili (si lavano a parte)",
       "box vuoto"
      ],
      [
       "**0**",
       "2. Pulizia a secco",
       "togliere tutta la sostanza organica con pala e raschietto; niente paglia riutilizzata; svuotare sotto il grigliato o tenere il liquame almeno 30 cm sotto il piano",
       "nessun accumulo visibile"
      ],
      [
       "**0**",
       "3. Ammollo",
       "acqua e detergente a bassa pressione o in schiuma su tutte le superfici",
       "almeno 30 minuti, meglio tutta la notte"
      ],
      [
       "**1**",
       "4. Lavaggio",
       "idropulitrice con acqua a **70 °C o più**, dall'alto verso il basso, insistendo su fessure, giunti, angoli, canali di scolo, sotto le mangiatoie",
       "controllo con una torcia: nessun residuo di feci"
      ],
      [
       "**1–2**",
       "5. **Asciugatura completa**",
       "ventilare, scaldare se serve",
       "superfici asciutte al tatto"
      ],
      [
       "**2**",
       "6. Disinfezione contro i coccidi",
       "clorocresolo autorizzato in Italia (§6.4), locale a circa 20 °C; pavimento e pareti fino a 1 m di altezza",
       "2% per 2 ore, 400 ml di soluzione per m² (o come da etichetta)"
      ],
      [
       "**3**",
       "7. Disinfezione contro le spore",
       "passata separata con **vapore oltre 80 °C**, oppure lanciafiamme sulle superfici non infiammabili; in alternativa disinfettante ad ampio spettro (§6.4)",
       "tutte le superfici trattate"
      ],
      [
       "**3**",
       "8. Risciacquo e seconda asciugatura",
       "come da etichetta",
       "personale dentro solo dopo il tempo indicato in etichetta"
      ],
      [
       "**3–5**",
       "9. Vuoto sanitario",
       "box chiuso e asciutto; per legge gli animali rientrano **almeno 2 giorni dopo** la fine di pulizia e disinfezione (DM 28 giugno 2022)",
       "almeno 2 giorni"
      ],
      [
       "**5 o più**",
       "10. Preparazione",
       "rimontare attrezzi lavati e disinfettati; lastra, cuccia e lampada (§2.1); lettiera asciutta",
       "lampade accese 1–2 giorni prima del parto"
      ],
      [
       "**5 o più**",
       "11. Ingresso della scrofa",
       "lavata e asciutta (§3.4), **4–7 giorni prima del parto**",
       "scheda della scrofa aggiornata"
      ],
      [
       "in lattazione",
       "12. Mantenimento",
       "feci tolte ogni giorno; polvere asciugante sulla lettiera; eventuale disinfezione intermedia circa 7 giorni dopo il parto solo se l'etichetta italiana la permette con animali presenti",
       "nido asciutto"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Il box parto resta quindi libero almeno 5 giorni tra uno svezzamento e l'ingresso della scrofa successiva:** se ne tiene conto nella programmazione delle coperture."
    },
    {
     "tipo": "h4",
     "testo": "Quanto prodotto serve: un esempio"
    },
    {
     "tipo": "p",
     "testo": "Box parto di 2,0 × 2,5 m (calcolo del Tenente, da adattare alle misure reali):"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "pavimento: 2,0 × 2,5 = **5 m²**;"
      },
      {
       "testo": "pareti fino a 1 m di altezza: perimetro 9 m × 1 m = **9 m²**;"
      },
      {
       "testo": "totale da bagnare: **14 m²**; a 400 ml per m² servono **5,6 litri di soluzione**;"
      },
      {
       "testo": "al 2%: **112 ml di prodotto** in 5,5 litri d'acqua."
      }
     ]
    },
    {
     "tipo": "p",
     "testo": "Regola semplice per diluire: **2% = 20 ml di prodotto per ogni litro d'acqua**; 1% = 10 ml per litro."
    },
    {
     "tipo": "h4",
     "testo": "Pediluvi e stivali"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "Spazzola e acqua per **togliere il fango** dagli stivali prima del pediluvio: il disinfettante non agisce attraverso il fango."
      },
      {
       "testo": "Vaschetta profonda abbastanza da coprire la suola, al riparo dalla pioggia."
      },
      {
       "testo": "Disinfettante per pediluvi (§6.4) alla diluizione dell'etichetta."
      },
      {
       "testo": "Rinnovato **quando è sporco e almeno una volta alla settimana**."
      },
      {
       "testo": "Stivali dedicati alla sala parto: il clostridio viaggia sugli stivali."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Attrezzi e cuccia"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Mangiatoie, abbeveratoi, cuccia di plastica (§2.1), pale e raschietti: lavati con la stessa procedura e lasciati asciugare al sole o in un locale caldo prima di rimontarli."
      },
      {
       "testo": "Pavimento in legno o cemento rovinato: si pulisce male; sigillare o verniciare. Pozzetti e fosse: imbiancatura a calce, poi asciugatura."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Sicurezza dell'operatore"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Con i prodotti al clorocresolo: guanti resistenti ai prodotti chimici (EN 374), tuta impermeabile, protezione del viso, stivali, maschera con filtro P2, pompa dosatrice, ventilazione."
      },
      {
       "testo": "Mai mescolare prodotti diversi (per esempio candeggina con acidi o con sali d'ammonio)."
      },
      {
       "testo": "Prodotti chiusi a chiave, nella confezione originale, lontano da mangimi e alimenti."
      }
     ]
    },
    {
     "tipo": "h4",
     "testo": "Registro della pulizia"
    },
    {
     "tipo": "p",
     "testo": "Per ogni box: data di svuotamento, prodotti usati e diluizioni, data della disinfezione, data di ingresso della nuova scrofa, firma di chi ha fatto il lavoro. È anche la prova della «procedura scritta» chiesta dal DM 28 giugno 2022."
    },
    {
     "tipo": "h3",
     "testo": "9.4 All'aperto e semibrado"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Capannine parto:** spostarle su terreno pulito tra un parto e l'altro; togliere o bruciare la lettiera dopo ogni svezzamento; niente insogli nei paddock parto; terreno drenato."
      },
      {
       "testo": "**Calcinazione del terreno**: 3,2 kg di calce viva per m² per trattare fino a 10 cm, poi fresatura ad almeno 30 cm; in alternativa asportare lo strato superficiale. Rischio d'incendio; sotto 10 °C l'efficacia è incompleta."
      },
      {
       "testo": "**Persistenza delle spore nel suolo:** anni. Persistenza delle oocisti di *C. suis* nel terreno: NON TROVATA."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.5 Farmaci contro la coccidiosi (toltrazuril)"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Prodotto",
      "Via",
      "Età (scheda ufficiale)",
      "Tempo di attesa carne",
      "Italia"
     ],
     "righe": [
      [
       "Zuritol 50 mg/ml (Calier)",
       "bocca",
       "scheda non letta",
       "77 giorni",
       "**autorizzato**"
      ],
      [
       "Baycox Multi 50 mg/ml (Elanco)",
       "bocca",
       "3°–5° giorno di vita, dose unica, negli allevamenti con coccidiosi confermata",
       "77 giorni",
       "**autorizzato**"
      ],
      [
       "**Forceris** (Ceva): toltrazuril + ferro",
       "iniezione intramuscolare",
       "tra 24 e 96 ore di vita, dose unica",
       "70 giorni",
       "**autorizzazione europea, valida in Italia**"
      ],
      [
       "**Baycox Iron** (Elanco): toltrazuril + ferro",
       "iniezione intramuscolare",
       "tra 48 e 72 ore di vita, dose unica",
       "53 giorni",
       "**autorizzazione europea**"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Tutti richiedono **ricetta veterinaria**. Elenco completo dei medicinali per malattia: **§6.3**."
      },
      {
       "testo": "**Attenzione per Podere Verde:** la scheda di Forceris dice di **non usarlo nei suinetti con sospetta carenza di vitamina E e/o selenio**. Senza integratore minerale-vitaminico (Appendice A) le scrofe rischiano proprio questa carenza: da segnalare al veterinario."
      },
      {
       "testo": "**Efficacia:** il toltrazuril è stato l'unico farmaco efficace in uno studio sperimentale. Con igiene scarsa il rischio di diarrea resta alto anche con il trattamento."
      },
      {
       "testo": "**Resistenza:** documentato in Olanda un ceppo completamente resistente al toltrazuril: gli autori consigliano esami delle feci periodici per verificare che il farmaco funzioni ancora e la disinfezione con prodotti al cresolo."
      },
      {
       "testo": "Diclazuril per suini: nessun prodotto autorizzato trovato."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.6 Vaccini delle scrofe contro clostridi ed E. coli"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Vaccino",
      "Cosa copre",
      "Schema (scheda ufficiale)",
      "Italia"
     ],
     "righe": [
      [
       "**Porcilis ColiClos** (MSD)",
       "*E. coli* (F4ab, F4ac, F5, F6, tossina LT) + *C. perfringens* **tipo C**",
       "prima volta 6–8 settimane prima del parto, seconda dose 4 settimane dopo; richiamo 2–4 settimane prima di ogni parto",
       "**autorizzato** dal 14/06/2012"
      ],
      [
       "**Enteroporc Coli AC** (IDT / Ceva)",
       "*E. coli* (F4ab, F4ac, F5, F6) + *C. perfringens* **tipo A** (tossine alfa e beta2) e **tipo C**",
       "5 e 2 settimane prima del parto; richiamo 2 settimane prima di ogni parto",
       "**autorizzazione europea**"
      ],
      [
       "Suiseng Diff/A (Hipra)",
       "*C. difficile* + *C. perfringens* tipo A; **non** tipo C né *E. coli*",
       "6 e 3 settimane prima del parto; richiamo 3 settimane prima",
       "autorizzazione europea"
      ],
      [
       "Suiseng Coli/C (Hipra)",
       "*E. coli* + *C. perfringens* tipo C + *C. novyi*",
       "6 e 3 settimane prima; richiamo 3 settimane prima",
       "**autorizzato**"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Tempo di attesa dei vaccini: 0 giorni. Ricetta veterinaria. Altri vaccini, come il vaccino vivo per bocca dei suinetti contro *E. coli* (Coliprotec F4/F18): **§6.3**."
      },
      {
       "testo": "**Vaccino stabulogeno** (preparato con i ceppi isolati in azienda): l'IZSLER lo prepara su ricetta elettronica, solo con ceppi dello stesso allevamento; per il Lazio chiedere all'IZS Lazio e Toscana."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.7 Suinetti già malati"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Clostridio tipo C:** curare i suinetti già malati serve a poco, le lesioni sono di solito irreversibili; in un focolaio protegge solo l'antitossina entro 2 ore dalla nascita e/o l'antibiotico in profilassi. **Antitossina autorizzata in Italia: NON TROVATA.** La vera difesa è il vaccino delle scrofe."
      },
      {
       "testo": "**E. coli:** antibiotico tempestivo scelto con antibiogramma (molti ceppi sono resistenti), più liquidi ed elettroliti e calore."
      },
      {
       "testo": "**Regole sugli antibiotici** (Reg. UE 2019/6, art. 107): mai di routine né per compensare igiene o gestione carenti."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.8 Gestione che previene tutte e tre le cause"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "**Colostro:** almeno 200 g per suinetto, meglio 300–400 g; mortalità 43,4% sotto i 200 g contro 7,1% sopra; ogni minuto di ritardo della prima poppata costa circa 11 g di colostro; adozioni solo dopo la prima poppata."
      },
      {
       "testo": "Calore nelle prime ore; nido asciutto; igiene contro i coccidi."
      },
      {
       "testo": "Alimentazione della scrofa in rapporto ai clostridi: NON TROVATO."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "9.9 Opzioni da discutere con il veterinario"
    },
    {
     "tipo": "elenco",
     "numerato": true,
     "voci": [
      {
       "testo": "**Prima la diagnosi:** esame delle feci per i coccidi (2ª–3ª settimana di vita), necroscopia con ricerca delle tossine dei clostridi e delle fimbrie di *E. coli*, antibiogramma. Dalla diagnosi dipende quale vaccino scegliere."
      },
      {
       "testo": "**Coccidi:** toltrazuril (per bocca, oppure iniettabile insieme al ferro, attenzione a vitamina E e selenio) + disinfezione al clorocresolo + controllo periodico delle feci."
      },
      {
       "testo": "**Clostridio tipo C ed E. coli:** vaccino delle scrofe (Porcilis ColiClos o, se c'è anche il tipo A, Enteroporc Coli AC)."
      },
      {
       "testo": "**Ceppi non coperti:** vaccino stabulogeno dall'IZS."
      },
      {
       "testo": "**Sempre:** colostro, calore, pulizia, asciutto, box parto disinfettato tra un parto e l'altro."
      },
      {
       "testo": "Costi per dose: NON TROVATI, da chiedere al veterinario o al distributore."
      }
     ]
    }
   ]
  },
  {
   "id": "cap10",
   "titolo": "Appendice A — Vademecum: piano alimentare delle scrofe in gestazione",
   "contenuto": [
    {
     "tipo": "p",
     "testo": "Razioni per fase, preparazione della miscela, costi e controlli. Calcolato sui fabbisogni ANAS 2021 e sui prezzi di ottobre 2026 (11/10/2026)."
    },
    {
     "tipo": "h3",
     "testo": "A.1 Obiettivo"
    },
    {
     "tipo": "p",
     "testo": "Portare la scrofa al parto in buono stato di carne, né magra né grassa, con suinetti di buon peso alla nascita e una buona produzione di colostro. Il piano usa l'orzo e il fieno di medica dell'azienda, integrati con soia e minerali acquistati."
    },
    {
     "tipo": "h3",
     "testo": "A.2 Le esigenze della scrofa, al giorno"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Fase",
      "Cosa succede",
      "Mangime",
      "Energia netta",
      "Lisina",
      "Calcio",
      "Fosforo digeribile",
      "Acqua"
     ],
     "righe": [
      [
       "Dalla fecondazione al giorno 84",
       "i feti sono piccoli: la scrofa si mantiene, senza ingrassare",
       "2,5–2,8 kg",
       "5.250–5.880 kcal",
       "9,5–10,6 g",
       "19–21 g",
       "5,3–5,9 g",
       "15–20 litri"
      ],
      [
       "Giorni 85–110",
       "i feti crescono: si decide il peso alla nascita",
       "2,8–3,0 kg",
       "5.880–6.300 kcal",
       "15,1–16,2 g",
       "21–22,5 g",
       "7,0–7,5 g",
       "15–20 litri"
      ],
      [
       "Dal giorno 111 al parto",
       "si preparano la mammella e il colostro",
       "2–3 kg",
       "4.600–6.900 kcal",
       "16,4–24,6 g",
       "17–25,5 g",
       "6,4–9,6 g",
       "sempre a disposizione"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "La **lisina** è l'amminoacido che limita le proteine dell'orzo: è il primo valore da rispettare."
    },
    {
     "tipo": "h3",
     "testo": "A.3 La razione, per scrofa al giorno"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Fase",
      "Orzo macinato",
      "Soia farina di estrazione 44%",
      "Fieno di erba medica",
      "Fosfato bicalcico",
      "Vitasol Complex SBC"
     ],
     "righe": [
      [
       "Fecondazione – giorno 84",
       "**2,2 kg**",
       "**0,1 kg**",
       "**0,8 kg**",
       "**15 g**",
       "**25 g**"
      ],
      [
       "Giorni 85–110",
       "**2,2 kg**",
       "**0,3 kg**",
       "**0,8 kg**",
       "**25 g**",
       "**25 g**"
      ],
      [
       "Giorno 111 – parto",
       "**1,9 kg**",
       "**0,6 kg**",
       "**0,5 kg**",
       "**30 g**",
       "**25 g**"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Cosa copre la razione**"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Fase",
      "Energia netta",
      "Lisina",
      "Calcio",
      "Fosforo digeribile"
     ],
     "righe": [
      [
       "Fecondazione – giorno 84",
       "5.782 kcal ✔",
       "11,8 g ✔",
       "19,6 g ✔",
       "5,7 g ✔"
      ],
      [
       "Giorni 85–110",
       "6.204 kcal ✔",
       "16,6 g ✔",
       "22,6 g ✔",
       "7,3 g ✔"
      ],
      [
       "Giorno 111 – parto",
       "5.966 kcal ✔",
       "21,8 g ✔",
       "20,1 g ✔",
       "8,1 g ✔"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "Il Complex SBC porta anche vitamine A, D3, E e del gruppo B, selenio, zinco, ferro, rame, manganese, iodio e sale."
    },
    {
     "tipo": "h3",
     "testo": "A.4 Come preparare la miscela"
    },
    {
     "tipo": "p",
     "testo": "Orzo, soia e minerali si mescolano insieme; il fieno si dà a parte."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Fase",
      "Per ogni 100 kg di miscela",
      "Miscela al giorno per scrofa"
     ],
     "righe": [
      [
       "Fecondazione – giorno 84",
       "orzo 95,6 kg + soia 4,4 kg + fosfato bicalcico 0,65 kg + Complex SBC 1,1 kg",
       "2,34 kg"
      ],
      [
       "Giorni 85–110",
       "orzo 88 kg + soia 12 kg + fosfato bicalcico 1 kg + Complex SBC 1 kg",
       "2,55 kg"
      ],
      [
       "Giorno 111 – parto",
       "orzo 76 kg + soia 24 kg + fosfato bicalcico 1,2 kg + Complex SBC 1 kg",
       "2,56 kg"
      ]
     ]
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Mescolare prima i minerali con qualche chilo di farina, poi con il resto: così si distribuiscono in modo uniforme."
      },
      {
       "testo": "Due pasti al giorno, sempre alla stessa ora."
      },
      {
       "testo": "Fieno di medica in rastrelliera, pulito e senza muffa: partire da 0,3 kg e arrivare alla dose piena in 7–10 giorni."
      },
      {
       "testo": "Acqua pulita sempre disponibile."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "A.5 Costi"
    },
    {
     "tipo": "p",
     "testo": "**Prezzi usati**"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Alimento",
      "Prezzo",
      "Rilevazione"
     ],
     "righe": [
      [
       "Orzo aziendale",
       "0,192 €/kg",
       "prezzo a cui l'azienda vende il proprio orzo"
      ],
      [
       "Soia farina di estrazione 44%",
       "0,500 €/kg",
       "Borsa merci di Bologna, 8/10/2026, IVA esclusa, franco partenza"
      ],
      [
       "Fieno di erba medica aziendale",
       "0,190 €/kg",
       "Borsa merci di Bologna, 6/08/2026, 2° taglio in rotoballe 175–205 €/t, valore medio"
      ],
      [
       "Fosfato bicalcico 18% di fosforo",
       "0,89 €/kg",
       "Shopyfarm, sacco da 25 kg a 22,25 €"
      ],
      [
       "Vitasol Complex SBC",
       "4,20 €/kg",
       "Shopyfarm, sacco da 25 kg a 105,00 €"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Costo per scrofa**"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Fase",
      "Giorni",
      "Costo al giorno",
      "Costo della fase"
     ],
     "righe": [
      [
       "Fecondazione – giorno 84",
       "84",
       "0,74 €",
       "62,39 €"
      ],
      [
       "Giorni 85–110",
       "26",
       "0,85 €",
       "22,14 €"
      ],
      [
       "Giorno 111 – parto",
       "5",
       "0,89 €",
       "4,46 €"
      ],
      [
       "**Gestazione intera**",
       "**115**",
       "**0,77 € in media**",
       "**88,99 €**"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "**Quantità e costo per scrofa a ogni gestazione**"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Alimento",
      "Quantità",
      "Costo"
     ],
     "righe": [
      [
       "Orzo",
       "251,5 kg",
       "48,29 €"
      ],
      [
       "Fieno di erba medica",
       "90,5 kg",
       "17,20 €"
      ],
      [
       "Vitasol Complex SBC",
       "2,9 kg",
       "12,08 €"
      ],
      [
       "Soia farina di estrazione 44%",
       "19,2 kg",
       "9,60 €"
      ],
      [
       "Fosfato bicalcico",
       "2,1 kg",
       "1,83 €"
      ],
      [
       "**Totale**",
       "",
       "**88,99 €**"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "Un sacco da 25 kg di Complex SBC basta per circa 8 gestazioni; un sacco di fosfato bicalcico per circa 12."
    },
    {
     "tipo": "h3",
     "testo": "A.6 Controllo e correzioni"
    },
    {
     "tipo": "p",
     "testo": "Ogni mese si valuta lo stato di carne di ogni scrofa. Obiettivo al parto: lardo dorsale 15–24 mm."
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Situazione",
      "Come si riconosce",
      "Correzione al giorno"
     ],
     "righe": [
      [
       "Scrofa magra",
       "costole e spina dorsale si sentono facilmente",
       "+0,3 kg di orzo"
      ],
      [
       "Scrofa grassa",
       "le ossa del bacino non si sentono premendo con il palmo",
       "−0,3 kg di orzo"
      ],
      [
       "Inverno, scrofe all'aperto",
       "perdono stato di carne con il freddo",
       "+0,3–0,5 kg di orzo"
      ],
      [
       "Il fieno non viene mangiato",
       "resta nella rastrelliera",
       "+0,1 kg di soia"
      ]
     ]
    },
    {
     "tipo": "h3",
     "testo": "A.7 Acquisti"
    },
    {
     "tipo": "griglia",
     "intestazione": [
      "Prodotto",
      "Dove",
      "Confezione"
     ],
     "righe": [
      [
       "Vitasol Complex SBC",
       "Shopyfarm (105,00 €); Il Grifoglio (125,00 €); ZooPiro",
       "sacco da 25 kg"
      ],
      [
       "Fosfato bicalcico 18% di fosforo",
       "Shopyfarm (22,25 €); Dibotek (32,07 € IVA inclusa); ZooPiro (62,40 € IVA inclusa)",
       "sacco da 25 kg"
      ],
      [
       "Soia farina di estrazione 44%",
       "Progeo, Veronesi o consorzio agrario: chiedere il prezzo per la quantità annua",
       "sfusa o in sacchi"
      ]
     ]
    },
    {
     "tipo": "p",
     "testo": "Prima dell'acquisto chiedere la scheda tecnica del fosfato bicalcico (deve indicare calcio e fosforo) e se i prezzi online comprendono l'IVA."
    }
   ]
  },
  {
   "id": "cap11",
   "titolo": "Bibliografia",
   "contenuto": [
    {
     "tipo": "h3",
     "testo": "Perdite dei suinetti, calore e nido (§2, §2.1)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Atria, *The environment of piglets* (manuale H13) — https://www.atriatuottajat.fi/globalassets/alkutuotanto/hankkeet/arkisto/liitteet-ja-tiedostot/sika-tuotantomanuaalit/farrowing-section/h13---the-environment-of-piglets.pdf"
      },
      {
       "testo": "NADIS, nati morti — https://nadis.org.uk/disease-a-z/pigs/stillbirths/"
      },
      {
       "testo": "Frontiers in Veterinary Science 2023, mortalità dei suinetti nei box a parto libero — https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2023.1172446/pdf"
      },
      {
       "testo": "Wientjes e coll. 2012, peso alla nascita e mortalità."
      },
      {
       "testo": "CRPA 2010–2013 e Bertacchini, dati italiani di mortalità sottoscrofa (tesi Università di Padova)."
      },
      {
       "testo": "InterPIG 2025, dati 2024 (sintesi Tonisity)."
      },
      {
       "testo": "Food & Agribusiness / Pig Progress, ipoglicemia — https://www.foodagribusiness.world/pigs/dossier/hypoglycaemia"
      },
      {
       "testo": "MSD Veterinary Manual, splay leg — https://www.msdvetmanual.com"
      },
      {
       "testo": "3tre3, nido innovativo per i suinetti (J. Ventura 2019) — https://www.3tres3.com/it/articoli/trucco-nido-innovativo-per-i-suinetti-in-sala-parto_8183/"
      },
      {
       "testo": "DanBred, prova sul grigliato riscaldato in sala parto (148 scrofe)."
      },
      {
       "testo": "Serbatoi per la cuccia: Cordivari, scheda dei serbatoi cilindrici verticali — https://www.cordivari.it/wp-content/uploads/2022/10/Cordivari-Scheda-tecnica-Serbatoi-Polietilene-c-verticali.pdf · Homelide — https://www.homelide.com/products/serbatoio-polietilene-cilindrico-verticale-blu-o730-500lt · Dasidrotecnica (Elbi CV 500) — https://www.dasidrotecnica.com/vendita/serbatoio-elbi-verticale-500-litri · eBay (Giurgola 500) — https://www.ebay.it/itm/332369061085"
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Colostro (§2.2)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Devillers e coll. 2007; Quesnel e coll. 2011: produzione di colostro della scrofa."
      },
      {
       "testo": "Theil e coll. 2014: formula per stimare il colostro preso dal suinetto."
      },
      {
       "testo": "Hasan e coll. 2016: rifrattometro Brix e qualità del colostro."
      },
      {
       "testo": "Jansen; AHDB; PIC; Svendsen; Peet: fabbisogno del suinetto, colostro dato a mano, poppata a turni."
      },
      {
       "testo": "Kansas State University 2017; Romero e coll. 2023: poppata a turni."
      },
      {
       "testo": "Maciag e coll. 2022; Embrapa: conservazione del colostro congelato."
      },
      {
       "testo": "Viehmann e coll. 2015: colostro bovino nei suinetti."
      },
      {
       "testo": "3tre3, colostro — https://www.3tres3.com/en/articles/key-questions-of-colostrum-management_17653/ · https://www.3tres3.com/en/articles/factors-affecting-colostrum-intake-in-piglets_10098/"
      },
      {
       "testo": "Arts Food Products, scheda di PorcaCol (sito del venditore)."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Malattie per età (§3–5, §8)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "3tre3, svezzare senza ossido di zinco: ambiente, acqua e altri fattori — https://www.3tres3.com/en/articles/weaning-without-zinc-oxide-3-3-environment-water-and-other-factors_18172/"
      },
      {
       "testo": "AHDB, gestire lo svezzamento senza ossido di zinco — https://ahdb.org.uk/news/a-holistic-approach-to-managing-without-zinc-oxide"
      },
      {
       "testo": "Studio sul lavaggio delle scrofe prima del parto in quattro allevamenti belgi (Swine Health and Production 2013) — https://www.aasv.org/shap/issues/v21n6/v21n6p313.pdf"
      },
      {
       "testo": "MSD Veterinary Manual: coccidiosi — https://www.msdvetmanual.com/digestive-system/coccidiosis/coccidiosis-of-pigs · Strongyloides — https://www.msdvetmanual.com/digestive-system/gastrointestinal-parasites-of-pigs/strongyloides-sp-in-pigs · rogna — https://www.msdvetmanual.com/integumentary-system/mange/mange-in-pigs"
      },
      {
       "testo": "3tre3, anemia da ferro — https://www.3tres3.com/en/pig-diseases/iron-deficiency-anemia_6"
      },
      {
       "testo": "MSD Veterinary Manual, sezioni suini — https://www.msdvetmanual.com"
      },
      {
       "testo": "Iowa State University, diarree da clostridi nel suinetto — https://vetmed.iastate.edu/node/7715"
      },
      {
       "testo": "MSD Veterinary Manual, *Clostridioides difficile* nel suino — https://www.msdvetmanual.com/digestive-system/enteric-bacterial-diseases-in-pigs/clostridioides-difficile-colitis-in-pigs"
      },
      {
       "testo": "Iowa State University, Swine Disease Manual, diarree — https://webhost-dev.cvm.iastate.edu/vdpam/about/focus-areas/swine/swine-disease-manual/index-of-diseases/diarrheal-diseases"
      },
      {
       "testo": "NADIS, malattie dei suini — https://nadis.org.uk"
      },
      {
       "testo": "Lindgren e coll. 2020, parassiti negli allevamenti all'aperto — https://link.springer.com/article/10.1007%2Fs13165-019-00273-3"
      },
      {
       "testo": "Ceva Italia, coccidiosi dei suinetti."
      },
      {
       "testo": "3tre3, Atlante di patologia e Manuale delle malattie — https://www.3tres3.com"
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Laboratorio e kit rapidi (§6.1–6.2)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "IZSLER, conservazione dei campioni e vaccini stabulogeni — https://www.izsler.it/wp-content/uploads/sites/2/2023/06/Istruzioni-richiesta-vaccino-stabulogeno-aggiornato.pdf"
      },
      {
       "testo": "Bionote, Anigen Rapid PED/TGE/Rota Ag (catalogo)."
      },
      {
       "testo": "Silva e coll. 2013: test per *C. difficile* nel suinetto."
      },
      {
       "testo": "Megacor, VETDiagnostix, VetExpert: schede dei test per *C. perfringens*."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Roditori e insetti (§3.3)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Governo del Manitoba, controllo dei roditori negli allevamenti suini — https://gov.mb.ca/agriculture/livestock/pork/controlling-rodents-around-swine-barns.html"
      },
      {
       "testo": "Farmers Journal, controllo dei ratti in azienda (codice CRRU) — https://www.farmersjournal.ie/amp/focus/winter-indoor-management/how-to-keep-rats-under-control-on-your-farm-318094"
      },
      {
       "testo": "CRRU, fine dell'esca permanente intorno agli edifici rurali — https://www.thinkwildlife.org/pest-controllers-alerted-to-end-of-routine-permanent-rat-baiting-around-rural-buildings/"
      },
      {
       "testo": "IZS Teramo, biocidi e rodenticidi — https://www.izs.it/IZS/Engine/RAServeFile.php/f/pdf_normativa/Biocidi-Rodenticidi/Biocidi_IZSTeramo.pdf"
      },
      {
       "testo": "Iowa State University, controllo delle mosche — https://www.cfsph.iastate.edu/Infection_Control/Routes/English/fly_control.pdf"
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Medicinali, disinfettanti, rodenticidi e insetticidi (§6.3–6.5)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Banca dati europea dei medicinali veterinari (schede dei singoli prodotti) — https://medicines.health.europa.eu/veterinary"
      },
      {
       "testo": "EMA, Forceris — https://www.ema.europa.eu/en/medicines/veterinary/EPAR/forceris · decisione 2020 sulla tiamulina — https://www.ema.europa.eu/pt/medicines/veterinary/referrals/tiamulin-hydrogen-fumarate-presented-premix-medicated-feeding-stuff-oral-powder-feed-use-be-administered-pigs"
      },
      {
       "testo": "Unitec, numeri di registrazione Virkon S e Virocid — https://www.biosicurezzaweb.net/formazione/speciale-peste-suina-africana/ · nota sul numero di registrazione — https://www.biosicurezzaweb.net/numero-di-registrazione-minsal/"
      },
      {
       "testo": "Kersia, schede Virex, Effisafe, Envirex — https://3tre3.it/3tres3_common/pdf_usu/209835/virex.pdf?s=387 · https://3tre3.it/3tres3_common/pdf_usu/209835/effisafe.pdf?s=386 · https://3tre3.it/3tres3_common/pdf_usu/209835/envirex.pdf?s=389"
      },
      {
       "testo": "Medi Nova, prezzi detergenti e disinfettanti — https://www.medi-nova.store/12-detergenti-e-disinfettanti · ZooPiro, Neopredisan 135-1 — https://www.zoopiro.it/neopredisanr-135-1-disinfettante-ad-ampio-spettro-ad-uso-zootecnico.html"
      },
      {
       "testo": "Gruppo veterinario suinicolo mantovano, disinfettanti (2023) — https://www.gruppoveterinariosuinicolomantovano.it/documenti/disinfettanti_23-10-2023_mantova.pdf"
      },
      {
       "testo": "Calce: Reg. (UE) 2024/1302 e 2024/2422 (autorizzazioni dell'Unione Lhoist)"
      },
      {
       "testo": "Envu, schede tecniche Racumin Expert, Baycidal GR4, Solfac Antilarvale, QuickBayt — https://www.assets.envu.com/-/media/prfitaly/schede-tecniche-prodotti-envu/2023/st-racumin-expert-01-23.ashx"
      },
      {
       "testo": "ECHA, documenti di autorizzazione dei rodenticidi (Zapi, Colkim, Mayer Braun, BASF, Murin) — https://echa.europa.eu/information-on-chemicals/biocidal-products"
      },
      {
       "testo": "Elanco, prodotti per l'igiene ambientale — https://www.3tres3.com/guia333/empresas/elanco-italia-spa/bioprotection_462 · Reg. (UE) 2025/221 (Neporex 2SG) — https://eur-lex.europa.eu/eli/reg_impl/2025/221/oj/eng"
      },
      {
       "testo": "Università di Modena, lotta biologica alle mosche — https://iris.unimore.it/bitstream/11380/1227298/1/Darco%202020-approccio%20sostenibile%20controllo%20Mosca%20Entomata.pdf"
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Allevamento all'aperto (§8)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "NZ Pork, buone pratiche per i suini all'aperto — https://uploads-ssl.webflow.com/5f87a6eb2f34a3a32b6165cf/5fc43dd9d0b0240d1cd4fd21_Good-Management-Practices-for-Outdoor-Pigs-V2.2-.pdf"
      },
      {
       "testo": "The Pig Site, salute e benessere delle scrofe all'aperto — https://thepigsite.com/disease-and-welfare/managing-welfare/the-health-and-welfare-of-sows-outdoors"
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Coccidiosi, clostridi e disinfezione (§9)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "MSD Veterinary Manual: coccidiosi — https://www.msdvetmanual.com/digestive-system/coccidiosis/coccidiosis-of-pigs · clostridio tipo C — https://www.msdvetmanual.com/digestive-system/enteric-bacterial-diseases-in-pigs/clostridium-perfringens-type-c-enteritis-in-pigs · colibacillosi — https://www.msdvetmanual.com/digestive-system/enteric-bacterial-diseases-in-pigs/enteric-colibacillosis-in-pigs"
      },
      {
       "testo": "NADIS: coccidiosi — https://nadis.org.uk/disease-a-z/pigs/coccidiosis-in-piglets · clostridi — https://www.nadis.org.uk/disease-a-z/pigs/clostridium-perfringens-infection-in-piglets/"
      },
      {
       "testo": "Straberg e Daugschies 2007, disinfettanti contro le oocisti — https://link.springer.com/article/10.1007/s00436-007-0521-z"
      },
      {
       "testo": "Studio 2021 sulle spore di *Clostridium* — https://pmc.ncbi.nlm.nih.gov/articles/PMC8234884"
      },
      {
       "testo": "Lista DVG dei disinfettanti, 21/10/2025 — https://bad-sulza.de/wp-content/uploads/2025/10/pdfDesinfektionsDB.php_.pdf"
      },
      {
       "testo": "AHDB, pulizia e disinfezione — https://ahdb.org.uk/knowledge-library/cleaning-and-disinfection-on-pig-farms"
      },
      {
       "testo": "FLI (Istituto federale tedesco): calce — https://www.openagrar.de/servlets/MCRFileNodeServlet/openagrar_derivate_00052128/FLI-5-3-3-1-Chemische-Desinfektionsmittel-Kalk-RL-Desinfektion-V1-1.pdf · suoli — https://www.openagrar.de/servlets/MCRFileNodeServlet/openagrar_derivate_00052211/FLI-5-4-8-Desinfektion-Boeden-RL-Desinfektion-V1-1.pdf"
      },
      {
       "testo": "Autorizzazione belga Aldecoc CMK — https://docs.health.belgium.be/BE2025-0007_1_SPC.pdf"
      },
      {
       "testo": "The Pig Site; Università di Zurigo: igiene della sala parto."
      },
      {
       "testo": "Farmaci: Zuritol — https://medicines.health.europa.eu/veterinary/it/600000044987 · Forceris — https://medicines.health.europa.eu/veterinary/en/documents/download/a7e69281-4faa-408d-9fc1-7015b8b8d85d · Baycox Iron — https://www.ema.europa.eu/en/documents/overview/baycox-iron-epar-medicine-overview_en.pdf"
      },
      {
       "testo": "Mundt e coll. 2007 (toltrazuril); Università veterinaria di Vienna 2011; Shrestha e coll. 2017, resistenza al toltrazuril — https://pmc.ncbi.nlm.nih.gov/articles/PMC5492287"
      },
      {
       "testo": "Vaccini: Porcilis ColiClos — https://medicines.health.europa.eu/veterinary/it/600000003319 · Enteroporc Coli AC — https://www.ema.europa.eu/documents/smop-initial/cvmp-summary-positive-opinion-enteroporc-coli-ac_en.pdf · Suiseng Diff/A — https://ema.europa.eu/en/documents/smop-initial/cvmp-summary-positive-opinion-suiseng-diffa_en.pdf"
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Norme, biosicurezza e farmaci (§1, §6.3, §7)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "Direttiva 2008/120/CE sulla protezione dei suini (pulizia e trattamento antiparassitario delle scrofe negli stalli da parto), recepita dal D.Lgs. 122/2011."
      },
      {
       "testo": "DM 28 giugno 2022, allegato: piano di derattizzazione, procedure di pulizia e disinfezione, isolamento dei malati, carcasse (vedi sopra)."
      },
      {
       "testo": "PSA a Riano, Quotidiano Sanità 3/09/2026 — https://www.quotidianosanita.it/?p=153145"
      },
      {
       "testo": "Ordinanza del Commissario PSA n. 4/2026 — https://fnovi.it/sites/default/files/Ordinanza%204%202026%20Misure%20di%20eradicazione%20e%20sorveglianza%20della%20peste%20suina%20africana.pdf"
      },
      {
       "testo": "IZSLER, relazione Aujeszky 2023 — https://www.izsler.it/crma/wp-content/uploads/sites/15/2024/03/relazione-CdR-AUJ-2023-per-sito.pdf"
      },
      {
       "testo": "D.Lgs. 122/2011, protezione dei suini — https://miolegale.it/norme/dlgs-122-2011-protezione-dei-suini/"
      },
      {
       "testo": "Nota del Ministero della Salute 27719 del 2/11/2023 — https://www.3tre3.it/3tres3_common/art/it/14151/fitxers/Nuove-linee-guida-per-la-protezione-dei-suini-ex-d-lgs-122-2011.-nota-27719-del-2-nov-2023.pdf"
      },
      {
       "testo": "DM 28 giugno 2022, biosicurezza — https://consulenzaagricola.it/files/file/normativa/decreto_psa_28_06_2022.pdf"
      },
      {
       "testo": "ClassyFarm, Ministero della Salute (portale Vetinfo)."
      },
      {
       "testo": "D.Lgs. 218/2023, farmaci veterinari — https://www.normattiva.it/eli/id/2024/01/03/23G00225/CONSOLIDATED"
      },
      {
       "testo": "Reg. UE 2019/6, art. 107 — https://legislation.gov.uk/eur/2019/6/article/107/2018-12-11?view=plain"
      },
      {
       "testo": "Nota del Ministero della Salute 2019 sui biocidi — https://www.certifico.com/id/10294"
      },
      {
       "testo": "D.Lgs. 146/2001, protezione degli animali negli allevamenti."
      }
     ]
    },
    {
     "tipo": "h3",
     "testo": "Alimentazione delle scrofe (Appendice A)"
    },
    {
     "tipo": "elenco",
     "numerato": false,
     "voci": [
      {
       "testo": "ANAS, linee guida per l'alimentazione del suino, 2021."
      },
      {
       "testo": "INRAE-CIRAD-AFZ, tavole degli alimenti — https://www.feedtables.com"
      },
      {
       "testo": "Feedipedia, fieno di erba medica — https://feedipedia.org/node/11743"
      },
      {
       "testo": "Wageningen University, foraggi per scrofe in gestazione — https://edepot.wur.nl/24904"
      },
      {
       "testo": "Borsa merci di Bologna, 8/10/2026 — https://www.ruminantia.it/borsa-merci-di-bologna-8-ottobre-2026/ · 6/08/2026 — https://www.bo.camcom.gov.it/sites/default/files/borsa-merci-e-rilevazione-prezzi/listino-dei-prezzi-settimanali/anno-2026/n.32_%206%20agosto_2026.pdf"
      },
      {
       "testo": "Vitasol Complex SBC: Shopyfarm — https://www.shopyfarm.it/varie-specie/acq-vc001x25-vitasol-complex-tipo-s-b-c/ · ZooPiro — https://www.zoopiro.it/mangime-complementare-minerale-complex-sbc.html · Il Grifoglio — https://www.lagrifogliosas.it/vitasol-complex-tipo-sbc-25kg"
      },
      {
       "testo": "Fosfato bicalcico: Shopyfarm — https://www.shopyfarm.it/bovini-da-carne/fosfato-bicalcico-18-p/ · Dibotek — https://dibotek.it/dettaglio_prodotto/fosfato-bicalcico-sc-kg-25-minerale-alimentazione · ZooPiro — https://www.zoopiro.it/fosfato-bicalcico-18-p.html"
      }
     ]
    }
   ]
  }
 ]
};
export default QUADERNO;
