import { useState } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", muted:"#8B7355", border:"#D4C4A8", text:"#2D1B0E",
  blue:"#2C6E9B", red:"#C0392B", yellow:"#D4A017",
};

const SEZIONI = [
  {
    id:"accesso", icon:"🔐", titolo:"Come Accedere",
    contenuto:[
      {tipo:"h3",testo:"Primo accesso"},
      {tipo:"steps",passi:[
        "Apri il browser (Chrome o Safari)",
        "Vai su www.podereverdeapp.it",
        "Tocca 'Registrati'",
        "Inserisci nome, email e password",
        "Tocca 'Crea account' — accedi subito",
      ]},
      {tipo:"nota",testo:"Non è necessaria la conferma email. L'accesso è immediato."},
      {tipo:"h3",testo:"Aggiungere l'app al telefono"},
      {tipo:"bullets",voci:[
        "Android: Chrome → menu ⋮ → 'Aggiungi a schermata Home'",
        "iPhone: Safari → icona condivisione 📤 → 'Aggiungi a schermata Home'",
      ]},
    ]
  },
  {
    id:"navigazione", icon:"🗺️", titolo:"Navigazione",
    contenuto:[
      {tipo:"p",testo:"In basso ci sono 9 pulsanti per le diverse sezioni:"},
      {tipo:"tabella",righe:[
        ["🏠 Home","Dashboard con riepilogo capi e allerte"],
        ["🏷️ Animali","Anagrafica, schede per specie, eventi parto"],
        ["💉 Salute","Registro sanitario: vaccini, farmaci, visite"],
        ["🌾 Dieta","Somministrazioni mangimi e foraggi"],
        ["📦 Magazzino","Scorte con allerta livello minimo"],
        ["📊 Report","Riepilogo costi e consistenza"],
        ["🧬 Pedigree","Albero genealogico 3 generazioni"],
        ["🏆 Selezione","Ranking genetico con KPI reali"],
        ["📊 Costi","Costi complessivi aggregati"],
        ["🧾 Origine","Costo di origine per animale"],
        ["📤 Uscite","Macellazioni, vendite, morti"],
        ["🏭 Struttura","Macchinari, ammortamenti, costi fissi"],
      ]},
    ]
  },
  {
    id:"animali", icon:"🐄", titolo:"Registrare un Animale",
    contenuto:[
      {tipo:"h3",testo:"Nuova scheda animale"},
      {tipo:"steps",passi:[
        "Vai in 🏷️ Animali → tocca '+ Aggiungi'",
        "Seleziona la SPECIE (bovino/suino/ovino) — i campi cambiano automaticamente",
        "Inserisci BDN/Matricola e nome",
        "Compila razza, categoria, sesso, data di nascita",
        "Aggiungi peso nascita e peso attuale se disponibili",
        "Seleziona provenienza: Nato in azienda / Acquistato / Trasferito",
        "Collega padre e madre dalla lista animali (genealogia)",
        "Tocca 'Salva'",
      ]},
      {tipo:"nota",testo:"🧬 La razza del figlio viene calcolata automaticamente: se padre e madre hanno la stessa razza → razza del figlio; se razze diverse → METICCIA."},
      {tipo:"h3",testo:"Specie e campi specifici"},
      {tipo:"bullets",voci:[
        "Bovini: BDN 14 cifre, passaporto, categorie (vitello, manza, vacca...)",
        "Suini: tatuaggio aziendale, categorie (lattonzolo, scrofa, verro...)",
        "Ovini: marchio auricolare, categorie (agnello, pecora, ariete...)",
      ]},
    ]
  },
  {
    id:"parto", icon:"🐣", titolo:"Registrare un Parto",
    contenuto:[
      {tipo:"h3",testo:"Registrazione parto dalla scheda animale"},
      {tipo:"steps",passi:[
        "Apri la scheda della MADRE (animale femmina)",
        "Vai al tab 'Eventi' in basso",
        "Tocca '🐣 Registra parto'",
        "Inserisci: data parto, tipo (naturale/assistito), nati vivi, nati morti",
        "Seleziona il padre dalla lista",
        "Per ogni nato vivo: inserisci BDN/tatuaggio, sesso, peso nascita",
        "Tocca 'Registra parto'",
      ]},
      {tipo:"nota",testo:"✅ Le schede dei nati vengono create AUTOMATICAMENTE con i dati ereditati dalla madre (specie, razza, data nascita, provenienza, padre e madre). La razza è calcolata in automatico."},
      {tipo:"h3",testo:"Cosa viene creato in automatico"},
      {tipo:"bullets",voci:[
        "Scheda anagrafica per ogni nato con BDN inserito",
        "Collegamento madre → figlio e padre → figlio",
        "Razza calcolata (pura o meticcia)",
        "Provenienza: 'Nato in azienda'",
        "Stato: 'Attivo'",
      ]},
    ]
  },
  {
    id:"uscite", icon:"📤", titolo:"Registrare un'Uscita",
    contenuto:[
      {tipo:"h3",testo:"Tipi di uscita"},
      {tipo:"bullets",voci:[
        "🔪 Macellato — con peso vivo, peso carcassa, resa % calcolata",
        "✝️ Morto — cause naturali o malattia",
        "💰 Venduto vivo — a terzi",
        "🚨 Furto",
        "🏃 Scappato",
        "🔄 Trasferito",
      ]},
      {tipo:"steps",passi:[
        "Vai in 📤 Uscite",
        "Nel tab 'In stalla' trova l'animale",
        "Tocca il pulsante '📤 Uscita'",
        "Scegli il motivo uscita",
        "Inserisci data uscita e peso vivo",
        "Se macellato: inserisci anche peso carcassa → la resa % si calcola automaticamente",
        "I giorni di permanenza in stalla vengono calcolati in automatico",
        "Tocca 'Registra uscita'",
      ]},
      {tipo:"nota",testo:"📊 I dati di uscita si aggiornano anche sulla scheda anagrafica dell'animale, nella tab Info → Gestione."},
    ]
  },
  {
    id:"pedigree", icon:"🧬", titolo:"Pedigree e Genealogia",
    contenuto:[
      {tipo:"h3",testo:"Come funziona"},
      {tipo:"p",testo:"Il modulo Pedigree legge automaticamente i dati genealogici registrati nelle schede anagrafiche. Non serve inserire nulla di aggiuntivo."},
      {tipo:"bullets",voci:[
        "Albero visuale a 3 generazioni (soggetto → genitori → nonni)",
        "Nodi cliccabili: tocca un antenato per aprirne la scheda",
        "Badge 'pedigree ✓' sugli animali con genealogia tracciata",
        "Storico parti: tutti i parti registrati con nati vivi/morti",
        "Discendenti diretti elencati con link alla loro scheda",
      ]},
      {tipo:"nota",testo:"Per avere un albero completo, collega padre e madre nella scheda di ogni animale."},
    ]
  },
  {
    id:"selezione", icon:"🏆", titolo:"Selezione Genetica",
    contenuto:[
      {tipo:"h3",testo:"KPI calcolati automaticamente"},
      {tipo:"tabella",righe:[
        ["N° parti","Totale parti registrati per ogni femmina"],
        ["IIP medio","Intervallo inter-parto in giorni (meno = meglio)"],
        ["% nati vivi","Percentuale nati vivi sul totale nati"],
        ["Prolificità","Media nati vivi per parto"],
        ["Peso nati","Peso medio dei nati alla nascita"],
        ["Longevità","Anni di carriera riproduttiva"],
      ]},
      {tipo:"h3",testo:"Come si costruisce il ranking"},
      {tipo:"p",testo:"Il ranking viene calcolato automaticamente non appena esistono eventi parto registrati. Ogni riproduttore riceve un INDICE da 0 a 100 basato sui KPI sopra."},
      {tipo:"nota",testo:"📅 Più parti vengono registrati, più accurato è il ranking. Inizia registrando i parti dalle schede anagrafiche delle femmine."},
    ]
  },
  {
    id:"costi", icon:"💰", titolo:"Gestione Costi",
    contenuto:[
      {tipo:"h3",testo:"Moduli costi disponibili"},
      {tipo:"tabella",righe:[
        ["📊 Costi","Aggregazione automatica da tutte le sezioni"],
        ["🧾 Origine","Costo di origine per singolo animale"],
        ["🏭 Struttura","Macchinari con ammortamento automatico"],
      ]},
      {tipo:"h3",testo:"Costo di origine"},
      {tipo:"bullets",voci:[
        "Animali acquistati: prezzo acquisto + costi allevamento individuali",
        "Animali nati: costi allevamento individuali accumulati",
        "Costo per kg calcolato automaticamente dal peso attuale",
      ]},
      {tipo:"h3",testo:"Ammortamenti macchinari"},
      {tipo:"p",testo:"Inserisci costo storico, anno acquisto e anni di ammortamento. La quota annua, il totale ammortizzato e il valore residuo vengono calcolati in automatico."},
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
        borderRadius:10,padding:"10px 14px",fontSize:13,color:C.text,margin:"8px 0 12px",lineHeight:1.5}}>
        {item.testo}
      </div>
    );
    if (item.tipo==="tabella") return (
      <div key={i} style={{margin:"0 0 12px"}}>
        {item.righe.map((r,j)=>(
          <div key={j} style={{display:"flex",gap:12,padding:"8px 0",
            borderBottom:`1px solid ${C.border}`,fontSize:13}}>
            <div style={{fontWeight:700,color:C.primary,minWidth:100,flexShrink:0}}>{r[0]}</div>
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
          App Allevamento — Podere Verde
        </div>
      </div>
      <div style={{padding:"0 16px"}}>
        <div style={{background:C.green+"15",border:`1px solid ${C.green}33`,
          borderRadius:14,padding:"14px 16px",marginBottom:16,fontSize:13,
          color:C.text,lineHeight:1.6}}>
          <strong>Tutti i dati vengono salvati automaticamente</strong> nel database condiviso.
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
          App Allevamento v14 · Podere Verde<br/>
          podereverdeapp.it
        </div>
      </div>
    </div>
  );
}
