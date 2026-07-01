import { useState } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", muted:"#8B7355", border:"#D4C4A8", text:"#2D1B0E",
  blue:"#2C6E9B", red:"#C0392B", yellow:"#D4A017",
};

const SEZIONI = [
  {
    id:"accesso", icon:"🔐", titolo:"Accesso e installazione",
    contenuto:[
      {tipo:"h3",testo:"Primo accesso"},
      {tipo:"steps",passi:[
        "Apri Chrome o Safari",
        "Vai su www.podereverdeapp.it",
        "Tocca 'Registrati' → inserisci nome, email e password → 'Crea account'",
        "Accedi subito — nessuna conferma email necessaria",
      ]},
      {tipo:"h3",testo:"Installa l'app sul telefono (accesso rapido)"},
      {tipo:"bullets",voci:[
        "Android: Chrome → menu ⋮ → 'Aggiungi a schermata Home'",
        "iPhone: Safari → icona 📤 → 'Aggiungi a schermata Home'",
      ]},
      {tipo:"nota",testo:"Tutti i dati vengono salvati automaticamente nel database condiviso. Ogni operatore vede gli stessi dati in tempo reale da qualsiasi dispositivo."},
    ]
  },
  {
    id:"navigazione", icon:"🗺️", titolo:"Navigazione — i moduli",
    contenuto:[
      {tipo:"p",testo:"In basso ci sono i pulsanti per le diverse sezioni:"},
      {tipo:"tabella",righe:[
        ["🏠 Home","Dashboard con riepilogo capi, allerte magazzino, ultimi eventi"],
        ["🏷️ Animali","Anagrafica completa + registro riproduttori"],
        ["💉 Salute","Registro sanitario: vaccini, farmaci, visite"],
        ["🌾 Dieta","Somministrazioni mangimi e foraggi"],
        ["📦 Magazzino","Scorte con allerta livello minimo"],
        ["📊 Report","Riepilogo costi e consistenza per specie"],
        ["🧬 Pedigree","Albero genealogico a 3 generazioni"],
        ["🏆 Selezione","Ranking genetico con KPI reali"],
        ["📊 Costi","Costi aggregati da tutte le fonti"],
        ["🧾 Origine","Costo di origine per singolo animale"],
        ["📤 Uscite","Macellazioni, vendite, morti — con resa %"],
        ["🏭 Struttura","Macchinari, ammortamenti, costi fissi"],
        ["🐷 Lotti Suini","Gestione nidiate e tatuaggi suini"],
        ["📖 Guida","Questo manuale"],
      ]},
    ]
  },
  {
    id:"animali", icon:"🐄", titolo:"Scheda animale — consultare e modificare",
    contenuto:[
      {tipo:"h3",testo:"Trovare un animale"},
      {tipo:"bullets",voci:[
        "Apri 🏷️ Animali",
        "Usa la barra di ricerca in cima: digita il BDN completo, le ultime 4 cifre del codice, oppure il nome",
        "Usa i filtri specie (bovino/suino/ovino) e 'Solo attivi'",
        "Ogni card mostra: nome, BDN, razza, data nascita, data ingresso, prezzo acquisto o costo nascita",
      ]},
      {tipo:"h3",testo:"Aprire la scheda completa"},
      {tipo:"p",testo:"Tocca il pulsante colorato '📋 Apri scheda completa' su ogni card. La scheda ha 3 tab:"},
      {tipo:"tabella",righe:[
        ["📋 Info","Tutti i dati: BDN, razza, sesso, nascita, peso, provenienza, azienda, prezzo acquisto, stato, vaccinazioni ricevute, note"],
        ["🧬 Genealogia","Padre, madre, discendenti diretti con link alle schede"],
        ["📅 Eventi","Storico parti con modifica/eliminazione"],
      ]},
      {tipo:"h3",testo:"Modificare i dati"},
      {tipo:"p",testo:"Dalla scheda, tocca ✏️ in alto a destra. Il form si apre precompilato — modifica ciò che vuoi e tocca Salva."},
      {tipo:"h3",testo:"Registrare un nuovo animale"},
      {tipo:"steps",passi:[
        "Tocca '+ Aggiungi' in cima alla lista",
        "Seleziona la SPECIE — i campi cambiano automaticamente per bovini/suini/ovini",
        "Inserisci BDN/Matricola, nome (facoltativo), razza, categoria, sesso, data nascita",
        "Per acquistati: seleziona provenienza 'Acquistato' → appare il campo prezzo acquisto e azienda di origine",
        "Collega padre e madre dalla lista animali per tracciare la genealogia",
        "La RAZZA del figlio viene calcolata automaticamente: stessa razza padre e madre = razza pura / razze diverse = METICCIA",
        "Tocca Salva",
      ]},
    ]
  },
  {
    id:"riproduttori", icon:"♂", titolo:"Registro riproduttori",
    contenuto:[
      {tipo:"h3",testo:"Come registrare un maschio come riproduttore"},
      {tipo:"steps",passi:[
        "Cerca il maschio nella lista Animali",
        "Apri la scheda → tocca ✏️ Modifica",
        "Attiva il toggle '♂ Riproduttore' (compare solo per i maschi)",
        "Tocca Salva",
      ]},
      {tipo:"h3",testo:"Consultare il registro"},
      {tipo:"p",testo:"In cima alla lista Animali tocca il pulsante '♂ Riproduttori'. Vedi tutti i maschi registrati divisi per specie (bovino/suino/ovino) con nome, razza, età e numero di figli già registrati."},
      {tipo:"h3",testo:"Registrazione parto: scelta del padre"},
      {tipo:"nota",testo:"Nel form parto, il campo 'Padre' mostra SOLO i maschi registrati come riproduttori della stessa specie. Se non ne hai ancora nessuno registrato, mostra tutti i maschi come alternativa."},
    ]
  },
  {
    id:"parto", icon:"🐣", titolo:"Registrare un parto",
    contenuto:[
      {tipo:"h3",testo:"Parto attuale (crea schede figli)"},
      {tipo:"steps",passi:[
        "Apri la scheda della MADRE",
        "Vai al tab '📅 Eventi'",
        "Tocca '🐣 Nuovo parto'",
        "Inserisci data, tipo parto, N° nati TOTALI e N° nati morti",
        "I nati vivi vengono calcolati automaticamente (totali − morti)",
        "Scegli il padre dalla lista riproduttori",
        "Per ogni nato vivo: inserisci BDN/tatuaggio, sesso, peso nascita",
        "Tocca 'Registra parto'",
      ]},
      {tipo:"nota",testo:"✅ Le schede dei nati vengono create AUTOMATICAMENTE con i dati ereditati dalla madre: specie, razza calcolata (pura o meticcia), data nascita, madre, padre, provenienza 'Nato in azienda'."},
      {tipo:"h3",testo:"Parto storico (solo statistiche, no schede figli)"},
      {tipo:"bullets",voci:[
        "Tocca '📅 Parto storico' invece di 'Nuovo parto'",
        "Inserisci: data, nati totali, nati morti — nati vivi calcolati automaticamente",
        "Nessun BDN richiesto — utile per parti già avvenuti con figli non più in azienda",
        "I dati alimentano il calcolo IIP e la Selezione Genetica",
      ]},
      {tipo:"h3",testo:"Modificare o eliminare un parto"},
      {tipo:"bullets",voci:[
        "Nel tab 📅 Eventi della madre, ogni parto ha i pulsanti ✏️ (modifica) e 🗑️ (elimina)",
        "La modifica aggiorna solo i dati statistici — le schede dei figli già creati non vengono toccate",
        "L'eliminazione rimuove solo l'evento — le schede animali rimangono",
      ]},
    ]
  },
  {
    id:"sanitario", icon:"💉", titolo:"Registro sanitario",
    contenuto:[
      {tipo:"h3",testo:"Evento singolo (un animale)"},
      {tipo:"steps",passi:[
        "Vai in 💉 Salute → tocca '+ Singolo'",
        "Seleziona l'animale, scegli tipo (vaccino/farmaco/visita/intervento)",
        "Compila descrizione, data, prodotto, veterinario, costo",
        "Tocca Salva",
      ]},
      {tipo:"h3",testo:"Evento di gruppo (vaccino o trattamento su più animali)"},
      {tipo:"steps",passi:[
        "Vai in 💉 Salute → tocca '💉 Gruppo'",
        "STEP 1: seleziona gli animali con le spunte — cerca per BDN o nome, 'Seleziona tutti' per la mandria intera",
        "STEP 2: compila UN SOLO form — tipo, descrizione, prodotto, veterinario, data, costo totale",
        "Il costo viene diviso automaticamente per il numero di animali selezionati",
        "Tocca 'Registra evento su N animali'",
      ]},
      {tipo:"h3",testo:"Ricerca eventi sanitari"},
      {tipo:"p",testo:"Usa la barra di ricerca in cima per trovare eventi per BDN (anche ultime 4 cifre), nome animale, tipo evento o nome prodotto."},
      {tipo:"h3",testo:"Vaccinazioni nella scheda animale"},
      {tipo:"p",testo:"Nella scheda di ogni animale (tab 📋 Info) compare la sezione 'Vaccinazioni' con tutti i vaccini ricevuti, date e richiami."},
    ]
  },
  {
    id:"alimentazione", icon:"🌾", titolo:"Alimentazione",
    contenuto:[
      {tipo:"h3",testo:"Razione singola"},
      {tipo:"p",testo:"Vai in 🌾 Dieta → '+ Singolo'. Seleziona specie, tipo mangime, quantità, unità, data, costo."},
      {tipo:"h3",testo:"Razione di gruppo (stesso mangime a più animali)"},
      {tipo:"steps",passi:[
        "Vai in 🌾 Dieta → tocca '🌾 Gruppo'",
        "STEP 1: seleziona gli animali con le spunte",
        "STEP 2: compila tipo mangime, quantità PER CAPO, unità, data, costo totale",
        "Il costo viene diviso per il numero di capi selezionati",
        "Mostra anteprima: quantità totale distribuita (es. 3 kg × 45 = 135 kg)",
        "Tocca 'Registra razione su N animali'",
      ]},
    ]
  },
  {
    id:"uscite", icon:"📤", titolo:"Registrare un'uscita",
    contenuto:[
      {tipo:"h3",testo:"Tipi di uscita"},
      {tipo:"bullets",voci:[
        "🔪 Macellato — con peso vivo, peso carcassa, resa % calcolata automaticamente",
        "✝️ Morto (cause naturali o malattia)",
        "💰 Venduto vivo",
        "🚨 Furto / 🏃 Scappato / 🔄 Trasferito",
      ]},
      {tipo:"steps",passi:[
        "Vai in 📤 Uscite → tab 'In stalla'",
        "Trova l'animale → tocca '📤 Uscita'",
        "Scegli motivo, data, peso vivo",
        "Se macellato: inserisci peso carcassa → la RESA % si calcola automaticamente",
        "I giorni di permanenza in stalla vengono calcolati automaticamente",
        "Tocca 'Registra uscita'",
      ]},
      {tipo:"nota",testo:"I dati di uscita si aggiornano anche sulla scheda anagrafica dell'animale (tab Info → sezione Gestione)."},
    ]
  },
  {
    id:"lotti_suini", icon:"🐷", titolo:"Lotti suini e sistema tatuaggio",
    contenuto:[
      {tipo:"h3",testo:"Sistema di identificazione"},
      {tipo:"p",testo:"Ogni nidiata di suinetti riceve un codice numerico da tatuatrice: 2 cifre anno + 3 cifre progressivo. Esempio: 24001 = primo lotto del 2024."},
      {tipo:"nota",testo:"Lo stesso numero va tatuato su TUTTA la nidiata. È il numero del lotto — non il numero individuale del singolo suinetto."},
      {tipo:"tabella",righe:[
        ["Tatuaggio lotto (es. 24001)","Stesso per tutta la nidiata — scritto sulla pelle"],
        ["Nr. interno (1, 2, 3…)","Solo nell'app per distinguere i capi — non va tatuato"],
        ["Marchio individuale","Solo per capi scelti come riproduttori"],
      ]},
      {tipo:"h3",testo:"Registrare un parto suini"},
      {tipo:"steps",passi:[
        "Vai in 🐷 Lotti Suini → '+ Parto'",
        "L'app assegna automaticamente il codice tatuaggio — appare grande e visibile",
        "STEP 1: inserisci madre, padre, data, nati vivi, nati morti",
        "STEP 2: per ogni suinetto vivo inserisci sesso e peso nascita (BDN solo se diventerà riproduttore)",
        "Salva — il codice è pronto da tatuare sull'intera nidiata",
      ]},
    ]
  },
  {
    id:"pedigree", icon:"🧬", titolo:"Pedigree e genealogia",
    contenuto:[
      {tipo:"h3",testo:"Come funziona"},
      {tipo:"p",testo:"Il modulo Pedigree legge automaticamente i dati genealogici registrati nelle schede. Non serve inserire nulla di aggiuntivo."},
      {tipo:"bullets",voci:[
        "Albero visuale a 3 generazioni (soggetto → genitori → nonni)",
        "Nodi cliccabili: tocca un antenato per aprirne la scheda",
        "Badge 'pedigree ✓' sugli animali con genealogia tracciata",
        "Storico parti con nati vivi/morti e collegamento ai figli",
        "Discendenti diretti elencati con link alle loro schede",
      ]},
      {tipo:"nota",testo:"Per avere un albero completo, collega padre e madre nella scheda di ogni animale."},
    ]
  },
  {
    id:"selezione", icon:"🏆", titolo:"Selezione genetica — ranking",
    contenuto:[
      {tipo:"h3",testo:"KPI calcolati automaticamente dagli eventi parto"},
      {tipo:"tabella",righe:[
        ["N° parti","Totale parti registrati per femmina"],
        ["IIP medio","Intervallo inter-parto in giorni e mesi (meno = meglio)"],
        ["% nati vivi","Percentuale nati vivi sul totale"],
        ["Prolificità","Media nati vivi per parto"],
        ["Peso medio nati","Peso medio dei nati alla nascita"],
        ["Longevità","Anni di carriera riproduttiva"],
      ]},
      {tipo:"h3",testo:"Come migliorare il ranking"},
      {tipo:"bullets",voci:[
        "Registra tutti i parti (presenti e storici) nella scheda di ogni fattrice",
        "Per i parti storici usa il pulsante '📅 Parto storico' — bastano data, nati totali e nati morti",
        "Più parti registri, più accurato è l'indice",
      ]},
      {tipo:"nota",testo:"Il ranking si aggiorna in tempo reale appena aggiungi nuovi eventi parto."},
    ]
  },
  {
    id:"costi", icon:"💰", titolo:"Gestione costi",
    contenuto:[
      {tipo:"h3",testo:"Le 3 sezioni costi"},
      {tipo:"tabella",righe:[
        ["📊 Costi","Aggregazione automatica da tutte le fonti: costi generali + per animale + alimentazione + sanitario"],
        ["🧾 Costo Origine","Per ogni animale: prezzo acquisto + costi individuali accumulati = totale con €/kg"],
        ["🏭 Struttura","Macchinari con ammortamento automatico (quota annua, residuo, %) + costi fissi"],
      ]},
      {tipo:"h3",testo:"Costo di nascita per animali nati in azienda"},
      {tipo:"p",testo:"Nella scheda di un animale nato in azienda puoi aggiungere un 'valore allevamento' dal modulo Costo Origine → Aggiungi costo. Compare direttamente nella card della lista animali."},
      {tipo:"h3",testo:"Ammortamenti automatici"},
      {tipo:"p",testo:"Inserisci in 🏭 Struttura: nome macchinario, costo storico, anno acquisto, anni di ammortamento. L'app calcola automaticamente quota annua, totale ammortizzato e valore residuo con barra di avanzamento."},
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
          App Allevamento — Podere Verde · v22
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
          App Allevamento v22 · Podere Verde · podereverdeapp.it
        </div>
      </div>
    </div>
  );
}
