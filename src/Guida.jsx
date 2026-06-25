import { useState } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
};

const SEZIONI = [
  {
    id:"accesso", icon:"🔐", titolo:"Come Accedere",
    contenuto: [
      { tipo:"h3", testo:"Primo accesso" },
      { tipo:"steps", passi:[
        "Apri il browser (Chrome o Safari)",
        "Vai su www.podereverdeapp.it",
        "Tocca 'Registrati'",
        "Inserisci nome, email e password",
        "Tocca 'Crea account' — accedi subito",
      ]},
      { tipo:"nota", testo:"Non è necessaria la conferma email. L'accesso è immediato." },
      { tipo:"h3", testo:"Aggiungere l'app al telefono" },
      { tipo:"bullets", voci:[
        "Android: Chrome → menu ⋮ → 'Aggiungi a schermata Home'",
        "iPhone: Safari → icona condivisione 📤 → 'Aggiungi a schermata Home'",
      ]},
    ]
  },
  {
    id:"navigazione", icon:"🗺️", titolo:"Navigazione",
    contenuto: [
      { tipo:"p", testo:"In basso ci sono 8 pulsanti per le diverse sezioni:" },
      { tipo:"tabella", righe:[
        ["🐄 Gestione","Dashboard, anagrafica, sanità, alimentazione"],
        ["🧬 Pedigree","Genealogia, parti bovini e ovini"],
        ["🐷 Lotti","Gestione lotti suini per parto"],
        ["🏆 Selezione","Ranking genetico riproduttori"],
        ["💰 Costi","Costi di allevamento per animale"],
        ["🧾 Origine","Costo di origine acquistato/nato"],
        ["📤 Uscite","Macellazioni, vendite, morti"],
        ["🏭 Struttura","Macchinari, ammortamenti, €/kg"],
      ]},
    ]
  },
  {
    id:"animali", icon:"🐄", titolo:"Registrare un Animale",
    contenuto: [
      { tipo:"steps", passi:[
        "Vai in 🐄 Gestione → Anagrafica",
        "Tocca il pulsante verde '+ Aggiungi'",
        "Inserisci: BDN/Matricola, nome, specie, razza, sesso, data di nascita",
        "Seleziona l'origine: 'Acquistato' o 'Nato in azienda'",
        "Tocca 'Salva'",
      ]},
      { tipo:"nota", testo:"La matricola BDN è obbligatoria. Per i suini puoi usare anche solo il codice lotto." },
    ]
  },
  {
    id:"parto", icon:"🐣", titolo:"Registrare un Parto",
    contenuto: [
      { tipo:"h3", testo:"Bovini e Ovini" },
      { tipo:"steps", passi:[
        "Vai nella sezione 🧬 Pedigree",
        "Trova la femmina che ha partorito",
        "Tocca '+ Parto'",
        "Inserisci: data, padre, nati vivi, nati morti",
        "Per ogni figlio: BDN, sesso, peso alla nascita",
      ]},
      { tipo:"nota", testo:"I nati morti si registrano senza BDN. Il pedigree si aggiorna automaticamente." },
      { tipo:"h3", testo:"Suini — per Lotto" },
      { tipo:"steps", passi:[
        "Vai nella sezione 🐷 Lotti",
        "Tocca '+ Parto'",
        "Inserisci madre, padre, data, nati vivi e morti",
        "Il sistema assegna il codice lotto automaticamente (es. L2024-001)",
        "Per ogni suino: BDN (opzionale), sesso, peso nascita",
      ]},
      { tipo:"nota", testo:"La BDN può essere aggiunta anche in seguito dalla scheda del lotto." },
    ]
  },
  {
    id:"sanitario", icon:"💉", titolo:"Evento Sanitario",
    contenuto: [
      { tipo:"steps", passi:[
        "Vai in 🐄 Gestione → Salute",
        "Tocca '+ Aggiungi'",
        "Seleziona l'animale",
        "Scegli il tipo: Vaccino, Farmaco, Visita, Intervento",
        "Inserisci: descrizione, data, veterinario, prodotto, costo",
        "Inserisci la data di scadenza/richiamo se prevista",
      ]},
      { tipo:"nota", testo:"Le scadenze entro 30 giorni appaiono automaticamente nella dashboard." },
    ]
  },
  {
    id:"uscita", icon:"📤", titolo:"Registrare un'Uscita",
    contenuto: [
      { tipo:"steps", passi:[
        "Vai nella sezione 📤 Uscite",
        "Trova l'animale e tocca 'Uscita'",
        "Seleziona la motivazione: Macellazione, Vendita, Morte, Furto",
        "Inserisci la data",
      ]},
      { tipo:"h3", testo:"Per macellazioni" },
      { tipo:"bullets", voci:[
        "Inserisci il peso vivo all'uscita",
        "Inserisci il peso carcassa (dalla bolla del macello)",
        "La % di resa si calcola automaticamente",
        "Inserisci il prezzo €/kg per vedere il ricavo totale",
      ]},
      { tipo:"nota", testo:"La resa viene valutata: verde = ottima, giallo = buona, rosso = bassa." },
    ]
  },
  {
    id:"costi", icon:"💰", titolo:"Registrare i Costi",
    contenuto: [
      { tipo:"h3", testo:"Costi per animale" },
      { tipo:"steps", passi:[
        "Vai nella sezione 💰 Costi",
        "Tocca l'animale desiderato",
        "Tocca '+ Costo'",
        "Scegli la voce: Alimentazione, Sanitario, Manodopera, ecc.",
        "Inserisci importo, descrizione e data",
      ]},
      { tipo:"h3", testo:"Costi generali di struttura" },
      { tipo:"bullets", voci:[
        "🏭 Struttura → Tab 'Costi': registra manodopera, gasolio, energia per periodo",
        "🏭 Struttura → Tab 'Macchinari': aggiungi macchinari con anni di ammortamento",
        "🏭 Struttura → Tab '€/kg': vedi il costo generale ripartito per kg carcassa",
      ]},
    ]
  },
  {
    id:"excel", icon:"📊", titolo:"Esportare in Excel",
    contenuto: [
      { tipo:"steps", passi:[
        "Tocca il tuo nome in alto a destra",
        "Seleziona 'Esporta tutto in Excel'",
        "Si scarica un file .xlsx con tutti i dati",
      ]},
      { tipo:"nota", testo:"Il file contiene un foglio per ogni sezione: Anagrafica, Sanitario, Costi, Lotti, Uscite, Macchinari." },
    ]
  },
];

function RenderContenuto({ item }) {
  if (item.tipo === "h3") return (
    <div style={{ fontWeight:700, fontSize:15, color:C.primary, margin:"12px 0 6px" }}>{item.testo}</div>
  );
  if (item.tipo === "p") return (
    <div style={{ fontSize:14, color:C.text, marginBottom:8 }}>{item.testo}</div>
  );
  if (item.tipo === "nota") return (
    <div style={{ background:C.green+"15", borderLeft:`3px solid ${C.green}`, borderRadius:"0 8px 8px 0", padding:"8px 12px", margin:"10px 0", fontSize:13, color:C.green, fontStyle:"italic" }}>
      💡 {item.testo}
    </div>
  );
  if (item.tipo === "steps") return (
    <div style={{ margin:"8px 0" }}>
      {item.passi.map((p, i) => (
        <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
          <div style={{ background:C.primary, color:"#FFF", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</div>
          <div style={{ fontSize:14, color:C.text, paddingTop:2 }}>{p}</div>
        </div>
      ))}
    </div>
  );
  if (item.tipo === "bullets") return (
    <div style={{ margin:"8px 0" }}>
      {item.voci.map((v, i) => (
        <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
          <div style={{ color:C.accent, fontSize:16, lineHeight:1.4, flexShrink:0 }}>•</div>
          <div style={{ fontSize:14, color:C.text }}>{v}</div>
        </div>
      ))}
    </div>
  );
  if (item.tipo === "tabella") return (
    <div style={{ margin:"8px 0" }}>
      {item.righe.map((r, i) => (
        <div key={i} style={{ display:"flex", gap:0, borderBottom:`1px solid ${C.border}`, padding:"8px 0" }}>
          <div style={{ minWidth:110, fontWeight:700, fontSize:13, color:C.primary }}>{r[0]}</div>
          <div style={{ fontSize:13, color:C.text }}>{r[1]}</div>
        </div>
      ))}
    </div>
  );
  return null;
}

export default function Guida() {
  const [aperta, setAperta] = useState(null);

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:"0 0 28px 28px", padding:"28px 20px 24px", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#FFF" }}>📖 Guida per gli Allevatori</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginTop:4 }}>App Allevamento · www.podereverdeapp.it</div>
      </div>

      <div style={{ padding:"0 16px" }}>
        {SEZIONI.map(s => (
          <div key={s.id} style={{ background:C.card, borderRadius:16, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", border:`1px solid ${C.border}`, overflow:"hidden" }}>
            <div onClick={()=>setAperta(aperta===s.id?null:s.id)}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", cursor:"pointer" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:22 }}>{s.icon}</span>
                <span style={{ fontWeight:700, fontSize:15, color:C.text }}>{s.titolo}</span>
              </div>
              <span style={{ color:C.muted, fontSize:18, transform:aperta===s.id?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
            </div>
            {aperta===s.id && (
              <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${C.border}` }}>
                {s.contenuto.map((item, i) => <RenderContenuto key={i} item={item}/>)}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{ textAlign:"center", padding:"20px 0", color:C.muted, fontSize:13 }}>
          Per assistenza contattare l'amministratore aziendale
        </div>
      </div>
    </div>
  );
}
