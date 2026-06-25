import { useState, useMemo } from "react";

const C = {
  bg: "#F5F0E8", card: "#FFFFFF", primary: "#5C3D1E", accent: "#A0522D",
  green: "#4A7C59", red: "#C0392B", yellow: "#D4A017", blue: "#2C6E9B",
  text: "#2D1B0E", muted: "#8B7355", border: "#D4C4A8",
  bovini: "#8B6914", suini: "#B5547A", ovini: "#4A7C59",
};

const VOCI = [
  { id: "alimentazione", label: "Alimentazione", icon: "🌾", color: C.bovini },
  { id: "sanitario",     label: "Sanitario",     icon: "💉", color: C.red },
  { id: "manodopera",    label: "Manodopera",    icon: "👷", color: C.blue },
  { id: "ammortamenti",  label: "Ammortamenti",  icon: "🏗️", color: "#7A5C8A" },
  { id: "energia",       label: "Energia",       icon: "⚡", color: C.yellow },
  { id: "affitti",       label: "Affitti",       icon: "🏠", color: C.green },
];

const specieColor = s => ({ bovino: C.bovini, suino: C.suini, ovino: C.ovini }[s] || C.muted);
const specieIcon  = s => ({ bovino: "🐄", suino: "🐷", ovino: "🐑" }[s] || "🐾");
const today = () => new Date().toISOString().split("T")[0];

// ─── DATI INIZIALI ────────────────────────────────────────────────────────────
const initialData = {
  animali: [
    // Riproduttori fondatori (acquistati)
    { id: 1, bdn: "IT034BN001", nome: "Ercole",  specie: "bovino", sesso: "M", razza: "Limousine", nascita: "2019-04-10", origine: "acquistato", prezzo_acquisto: 1800, stato: "attivo" },
    { id: 2, bdn: "IT034BN002", nome: "Bella",   specie: "bovino", sesso: "F", razza: "Limousine", nascita: "2020-02-15", origine: "acquistato", prezzo_acquisto: 1400, stato: "attivo" },
    { id: 3, bdn: "IT034BN003", nome: "Rosa",    specie: "bovino", sesso: "F", razza: "Limousine", nascita: "2020-06-01", origine: "acquistato", prezzo_acquisto: 1350, stato: "attivo" },
    { id: 4, bdn: "IT034SU001", nome: "Arturo",  specie: "suino",  sesso: "M", razza: "Large White", nascita: "2021-03-20", origine: "acquistato", prezzo_acquisto: 420, stato: "attivo" },
    { id: 5, bdn: "IT034SU002", nome: "Peppa",   specie: "suino",  sesso: "F", razza: "Large White", nascita: "2021-07-10", origine: "acquistato", prezzo_acquisto: 380, stato: "attivo" },
    // Nati in azienda
    { id: 6, bdn: "IT034BN010", nome: "Figlio1", specie: "bovino", sesso: "M", razza: "Limousine", nascita: "2023-03-10", origine: "nato", madreId: 2, padreId: 1, stato: "attivo" },
    { id: 7, bdn: "IT034BN011", nome: "Figlia1", specie: "bovino", sesso: "F", razza: "Limousine", nascita: "2024-04-05", origine: "nato", madreId: 2, padreId: 1, stato: "attivo" },
    { id: 8, bdn: "IT034BN012", nome: "Figlio2", specie: "bovino", sesso: "M", razza: "Limousine", nascita: "2023-05-20", origine: "nato", madreId: 3, padreId: 1, stato: "attivo" },
    { id: 9, bdn: "IT034SU010", nome: "Suino1",  specie: "suino",  sesso: "M", razza: "Large White", nascita: "2023-08-15", origine: "nato", madreId: 5, padreId: 4, stato: "attivo" },
  ],
  // Costi allevamento individuali
  costi: [
    { id:1,  animaleId:1, voce:"alimentazione", importo:950,  data:"2023-01-01", descrizione:"Alimentazione annuale" },
    { id:2,  animaleId:1, voce:"sanitario",     importo:180,  data:"2023-01-01", descrizione:"Sanitario" },
    { id:3,  animaleId:1, voce:"manodopera",    importo:420,  data:"2023-01-01", descrizione:"Manodopera" },
    { id:4,  animaleId:1, voce:"energia",       importo:90,   data:"2023-01-01", descrizione:"Energia" },
    { id:5,  animaleId:1, voce:"ammortamenti",  importo:150,  data:"2023-01-01", descrizione:"Ammortamenti" },
    { id:6,  animaleId:1, voce:"affitti",       importo:120,  data:"2023-01-01", descrizione:"Affitti" },
    { id:7,  animaleId:2, voce:"alimentazione", importo:820,  data:"2023-01-01", descrizione:"Alimentazione" },
    { id:8,  animaleId:2, voce:"sanitario",     importo:140,  data:"2023-01-01", descrizione:"Sanitario" },
    { id:9,  animaleId:2, voce:"manodopera",    importo:380,  data:"2023-01-01", descrizione:"Manodopera" },
    { id:10, animaleId:2, voce:"energia",       importo:80,   data:"2023-01-01", descrizione:"Energia" },
    { id:11, animaleId:3, voce:"alimentazione", importo:790,  data:"2023-01-01", descrizione:"Alimentazione" },
    { id:12, animaleId:3, voce:"sanitario",     importo:130,  data:"2023-01-01", descrizione:"Sanitario" },
    { id:13, animaleId:3, voce:"manodopera",    importo:360,  data:"2023-01-01", descrizione:"Manodopera" },
    { id:14, animaleId:4, voce:"alimentazione", importo:280,  data:"2023-01-01", descrizione:"Alimentazione" },
    { id:15, animaleId:4, voce:"sanitario",     importo:65,   data:"2023-01-01", descrizione:"Sanitario" },
    { id:16, animaleId:4, voce:"manodopera",    importo:180,  data:"2023-01-01", descrizione:"Manodopera" },
    { id:17, animaleId:5, voce:"alimentazione", importo:260,  data:"2023-01-01", descrizione:"Alimentazione" },
    { id:18, animaleId:5, voce:"sanitario",     importo:55,   data:"2023-01-01", descrizione:"Sanitario" },
    { id:19, animaleId:5, voce:"manodopera",    importo:160,  data:"2023-01-01", descrizione:"Manodopera" },
    // Costi propri dei nati
    { id:20, animaleId:6, voce:"alimentazione", importo:380,  data:"2024-01-01", descrizione:"Alimentazione anno 1" },
    { id:21, animaleId:6, voce:"sanitario",     importo:75,   data:"2024-01-01", descrizione:"Vaccini" },
    { id:22, animaleId:7, voce:"alimentazione", importo:210,  data:"2024-06-01", descrizione:"Alimentazione" },
    { id:23, animaleId:8, voce:"alimentazione", importo:350,  data:"2024-01-01", descrizione:"Alimentazione" },
    { id:24, animaleId:9, voce:"alimentazione", importo:140,  data:"2024-01-01", descrizione:"Alimentazione" },
  ],
  // Parti registrati (per contare i nati sopravvissuti per genitore)
  parti: [
    { id:1, madreId:2, padreId:1, data:"2023-03-10", nati_sopravvissuti:1 },
    { id:2, madreId:2, padreId:1, data:"2024-04-05", nati_sopravvissuti:1 },
    { id:3, madreId:3, padreId:1, data:"2023-05-20", nati_sopravvissuti:1 },
    { id:4, madreId:5, padreId:4, data:"2023-08-15", nati_sopravvissuti:9 },
    { id:5, madreId:5, padreId:4, data:"2024-09-02", nati_sopravvissuti:10 },
  ],
  nextId: { animali:10, costi:25, parti:6 },
};

// ─── CALCOLO COSTO TOTALE ANIMALE (acquisto + allevamento) ───────────────────
function costoTotaleAnimale(animaleId, data) {
  const a = data.animali.find(x => x.id === animaleId);
  if (!a) return 0;
  const costiAllevamento = data.costi.filter(c => c.animaleId === animaleId).reduce((s, c) => s + c.importo, 0);
  const acquisto = a.prezzo_acquisto || 0;
  return acquisto + costiAllevamento;
}

// ─── NATI SOPRAVVISSUTI PER GENITORE ─────────────────────────────────────────
function natiSopravvissuti(genitoreId, ruolo, data) {
  // ruolo: "madre" o "padre"
  return data.parti
    .filter(p => ruolo === "madre" ? p.madreId === genitoreId : p.padreId === genitoreId)
    .reduce((s, p) => s + (p.nati_sopravvissuti || 0), 0);
}

// ─── CALCOLO COSTO ORIGINE ───────────────────────────────────────────────────
function calcolaCostoOrigine(animale, data) {
  if (animale.origine === "acquistato") {
    return {
      tipo: "acquistato",
      prezzo_acquisto: animale.prezzo_acquisto || 0,
      costo_origine: animale.prezzo_acquisto || 0,
      dettaglio: null,
    };
  }

  // Nato in azienda
  const madre = animale.madreId ? data.animali.find(a => a.id === animale.madreId) : null;
  const padre = animale.padreId ? data.animali.find(a => a.id === animale.padreId) : null;

  // Quota madre
  let quotaMadre = 0, costoMadre = 0, natiMadre = 0;
  if (madre) {
    costoMadre = costoTotaleAnimale(madre.id, data);
    natiMadre = natiSopravvissuti(madre.id, "madre", data);
    quotaMadre = natiMadre > 0 ? costoMadre / natiMadre : 0;
  }

  // Quota padre
  let quotaPadre = 0, costoPadre = 0, natiPadre = 0;
  if (padre) {
    costoPadre = costoTotaleAnimale(padre.id, data);
    natiPadre = natiSopravvissuti(padre.id, "padre", data);
    quotaPadre = natiPadre > 0 ? costoPadre / natiPadre : 0;
  }

  const costo_origine = quotaMadre + quotaPadre;

  return {
    tipo: "nato",
    madre: madre ? { nome: madre.nome, bdn: madre.bdn, costoTotale: costoMadre, natiSopravvissuti: natiMadre, quota: quotaMadre } : null,
    padre: padre ? { nome: padre.nome, bdn: padre.bdn, costoTotale: costoPadre, natiSopravvissuti: natiPadre, quota: quotaPadre } : null,
    costo_origine,
  };
}

// ─── CALCOLO ECONOMICO COMPLETO ───────────────────────────────────────────────
function calcolaEconomiaCompleta(animale, data) {
  const origine = calcolaCostoOrigine(animale, data);
  const costiPropri = data.costi.filter(c => c.animaleId === animale.id).reduce((s, c) => s + c.importo, 0);
  const costoTotale = origine.costo_origine + costiPropri;
  return { origine, costiPropri, costoTotale };
}

// ─── UI BASE ──────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: `1px solid ${C.border}`, ...style }}>
    {children}
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ background: color+"22", color, border:`1px solid ${color}44`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
    {label}
  </span>
);

const Btn = ({ label, onClick, variant="primary", small=false, icon }) => {
  const styles = { primary:{bg:C.primary,fg:"#FFF"}, success:{bg:C.green,fg:"#FFF"}, ghost:{bg:"transparent",fg:C.text}, outline:{bg:"transparent",fg:C.primary} };
  const s = styles[variant]||styles.primary;
  return (
    <button onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.fg, border:variant==="outline"?`1.5px solid ${C.primary}`:"none", borderRadius:10, padding:small?"6px 12px":"10px 18px", fontSize:small?13:15, fontWeight:600, cursor:"pointer", boxShadow:variant==="primary"||variant==="success"?"0 2px 6px rgba(0,0,0,0.15)":"none" }}>
      {icon}{label}
    </button>
  );
};

const inputStyle = { width:"100%", boxSizing:"border-box", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 12px", fontSize:15, background:"#FAFAF8", color:C.text, outline:"none" };

const Field = ({ label, value, onChange, type="text", options, required }) => (
  <div style={{ marginBottom:12 }}>
    <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:4 }}>{label}{required&&" *"}</div>
    {options
      ? <select value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}>
          <option value="">— seleziona —</option>
          {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
        </select>
      : <input type={type} value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}/>
    }
  </div>
);

// ─── SCHEDA COSTO ORIGINE ─────────────────────────────────────────────────────
function SchedaCostoOrigine({ animale, data, onBack, onAddCosto, onAddParto }) {
  const eco = calcolaEconomiaCompleta(animale, data);
  const { origine } = eco;

  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>←</button>
        <span style={{ fontSize:18, fontWeight:800, color:C.text }}>Costo di Origine</span>
      </div>

      {/* Header animale */}
      <Card style={{ borderLeft:`5px solid ${specieColor(animale.specie)}`, background:`linear-gradient(135deg,${specieColor(animale.specie)}12,${C.card})` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:800 }}>{specieIcon(animale.specie)} {animale.nome}</div>
            <div style={{ fontSize:13, color:C.muted }}>{animale.bdn} · {animale.razza}</div>
            <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
              <Badge label={animale.origine === "acquistato" ? "🛒 Acquistato" : "🐣 Nato in azienda"} color={animale.origine === "acquistato" ? C.blue : C.green}/>
              <Badge label={animale.sesso === "M" ? "♂ Maschio" : "♀ Femmina"} color={animale.sesso === "M" ? C.blue : "#B5547A"}/>
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>COSTO TOTALE</div>
            <div style={{ fontSize:30, fontWeight:900, color:C.primary }}>€{eco.costoTotale.toFixed(0)}</div>
          </div>
        </div>
      </Card>

      {/* Costo origine */}
      <Card style={{ borderLeft:`4px solid ${animale.origine==="acquistato"?C.blue:C.green}` }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
          {animale.origine === "acquistato" ? "🛒 Costo di acquisto" : "🧬 Costo di origine (ripartito dai genitori)"}
        </div>

        {animale.origine === "acquistato" ? (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:15, color:C.text }}>Prezzo di acquisto</span>
            <span style={{ fontSize:24, fontWeight:800, color:C.blue }}>€{origine.prezzo_acquisto.toFixed(2)}</span>
          </div>
        ) : (
          <>
            {/* Quota madre */}
            {origine.madre && (
              <div style={{ background:C.suini+"10", borderRadius:12, padding:12, marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#B5547A", marginBottom:8 }}>♀ Quota Madre — {origine.madre.nome}</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>{origine.madre.bdn}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  <div style={{ background:"#FFF", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>COSTO MADRE</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.text }}>€{origine.madre.costoTotale.toFixed(0)}</div>
                  </div>
                  <div style={{ background:"#FFF", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>NATI SOPRAV.</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.text }}>{origine.madre.natiSopravvissuti}</div>
                  </div>
                  <div style={{ background:"#B5547A"+"15", borderRadius:8, padding:"8px 10px", textAlign:"center", border:`1.5px solid ${"#B5547A"}33` }}>
                    <div style={{ fontSize:10, color:"#B5547A", fontWeight:700 }}>QUOTA</div>
                    <div style={{ fontSize:16, fontWeight:800, color:"#B5547A" }}>€{origine.madre.quota.toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.muted, marginTop:8, fontStyle:"italic" }}>
                  €{origine.madre.costoTotale.toFixed(0)} ÷ {origine.madre.natiSopravvissuti} nati sopravvissuti = €{origine.madre.quota.toFixed(2)}/capo
                </div>
              </div>
            )}

            {/* Quota padre */}
            {origine.padre && (
              <div style={{ background:C.blue+"10", borderRadius:12, padding:12, marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.blue, marginBottom:8 }}>♂ Quota Padre — {origine.padre.nome}</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>{origine.padre.bdn}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  <div style={{ background:"#FFF", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>COSTO PADRE</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.text }}>€{origine.padre.costoTotale.toFixed(0)}</div>
                  </div>
                  <div style={{ background:"#FFF", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>NATI SOPRAV.</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.text }}>{origine.padre.natiSopravvissuti}</div>
                  </div>
                  <div style={{ background:C.blue+"15", borderRadius:8, padding:"8px 10px", textAlign:"center", border:`1.5px solid ${C.blue}33` }}>
                    <div style={{ fontSize:10, color:C.blue, fontWeight:700 }}>QUOTA</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.blue }}>€{origine.padre.quota.toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.muted, marginTop:8, fontStyle:"italic" }}>
                  €{origine.padre.costoTotale.toFixed(0)} ÷ {origine.padre.natiSopravvissuti} nati sopravvissuti = €{origine.padre.quota.toFixed(2)}/capo
                </div>
              </div>
            )}

            {/* Totale origine */}
            <div style={{ background:`linear-gradient(135deg,${C.green}15,${C.primary}10)`, borderRadius:12, padding:"12px 16px", border:`1.5px solid ${C.green}33`, marginTop:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.green }}>COSTO DI ORIGINE TOTALE</div>
                  <div style={{ fontSize:12, color:C.muted }}>Quota madre + Quota padre</div>
                </div>
                <div style={{ fontSize:28, fontWeight:900, color:C.green }}>€{origine.costo_origine.toFixed(2)}</div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Riepilogo costi propri */}
      <Card>
        <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Costi di allevamento propri</div>
        {VOCI.map(v => {
          const tot = data.costi.filter(c => c.animaleId===animale.id && c.voce===v.id).reduce((s,c)=>s+c.importo,0);
          if (tot === 0) return null;
          return (
            <div key={v.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:14, color:C.text }}>{v.icon} {v.label}</span>
              <span style={{ fontWeight:700, color:v.color }}>€{tot.toFixed(2)}</span>
            </div>
          );
        })}
        {eco.costiPropri === 0 && <div style={{ color:C.muted, fontSize:13, fontStyle:"italic" }}>Nessun costo proprio registrato</div>}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, paddingTop:8, borderTop:`2px solid ${C.border}` }}>
          <span style={{ fontWeight:700, color:C.text }}>Totale costi propri</span>
          <span style={{ fontWeight:900, fontSize:18, color:C.accent }}>€{eco.costiPropri.toFixed(2)}</span>
        </div>
      </Card>

      {/* Riepilogo finale */}
      <Card style={{ background:`linear-gradient(135deg,${C.primary}12,${C.accent}08)` }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Riepilogo costo totale</div>
        {[
          { label: animale.origine==="acquistato" ? "Prezzo acquisto" : "Costo di origine (genitori)", value: origine.costo_origine, color: animale.origine==="acquistato" ? C.blue : C.green },
          { label: "Costi allevamento propri", value: eco.costiPropri, color: C.accent },
        ].map(row => (
          <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:14, color:C.text }}>{row.label}</span>
            <span style={{ fontWeight:700, color:row.color }}>€{row.value.toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, padding:"12px 16px", background:C.primary+"15", borderRadius:12 }}>
          <span style={{ fontWeight:800, fontSize:15, color:C.primary }}>COSTO TOTALE ANIMALE</span>
          <span style={{ fontWeight:900, fontSize:22, color:C.primary }}>€{eco.costoTotale.toFixed(2)}</span>
        </div>
      </Card>

      {/* Bottoni azione */}
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <Btn label="+ Costo" onClick={onAddCosto} variant="primary" small icon="💰 "/>
        {animale.sesso==="F" && <Btn label="+ Parto" onClick={onAddParto} variant="success" small icon="🐣 "/>}
      </div>
    </div>
  );
}

// ─── FORM AGGIUNGI ANIMALE ────────────────────────────────────────────────────
function FormAnimale({ data, onSave, onCancel }) {
  const [form, setForm] = useState({ bdn:"", nome:"", specie:"bovino", sesso:"M", razza:"", nascita:today(), origine:"acquistato", prezzo_acquisto:"", madreId:"", padreId:"", stato:"attivo" });
  const maschi = data.animali.filter(a => a.sesso==="M" && a.specie===form.specie).map(a=>({value:a.id, label:`${a.nome} — ${a.bdn}`}));
  const femmine = data.animali.filter(a => a.sesso==="F" && a.specie===form.specie).map(a=>({value:a.id, label:`${a.nome} — ${a.bdn}`}));

  const salva = () => {
    if (!form.bdn || !form.nome) return;
    onSave({ ...form, prezzo_acquisto: form.origine==="acquistato" ? parseFloat(form.prezzo_acquisto)||0 : 0, madreId: form.madreId ? parseInt(form.madreId) : null, padreId: form.padreId ? parseInt(form.padreId) : null });
  };

  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onCancel} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>←</button>
        <span style={{ fontSize:18, fontWeight:800 }}>Nuovo animale</span>
      </div>
      <Field label="BDN / Matricola" value={form.bdn} onChange={v=>setForm(f=>({...f,bdn:v}))} required/>
      <Field label="Nome" value={form.nome} onChange={v=>setForm(f=>({...f,nome:v}))} required/>
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}><Field label="Specie" value={form.specie} onChange={v=>setForm(f=>({...f,specie:v,madreId:"",padreId:""}))} options={["bovino","suino","ovino"]}/></div>
        <div style={{ flex:1 }}><Field label="Sesso" value={form.sesso} onChange={v=>setForm(f=>({...f,sesso:v}))} options={[{value:"M",label:"♂ Maschio"},{value:"F",label:"♀ Femmina"}]}/></div>
      </div>
      <Field label="Razza" value={form.razza} onChange={v=>setForm(f=>({...f,razza:v}))}/>
      <Field label="Data nascita" value={form.nascita} onChange={v=>setForm(f=>({...f,nascita:v}))} type="date"/>
      <Field label="Origine" value={form.origine} onChange={v=>setForm(f=>({...f,origine:v}))} options={[{value:"acquistato",label:"🛒 Acquistato"},{value:"nato",label:"🐣 Nato in azienda"}]}/>
      {form.origine==="acquistato"
        ? <Field label="Prezzo di acquisto (€)" value={form.prezzo_acquisto} onChange={v=>setForm(f=>({...f,prezzo_acquisto:v}))} type="number"/>
        : <>
            <Field label="Madre" value={form.madreId} onChange={v=>setForm(f=>({...f,madreId:v}))} options={femmine}/>
            <Field label="Padre" value={form.padreId} onChange={v=>setForm(f=>({...f,padreId:v}))} options={maschi}/>
          </>
      }
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── FORM COSTO ───────────────────────────────────────────────────────────────
function FormCosto({ animale, onSave, onCancel }) {
  const [form, setForm] = useState({ animaleId:animale.id, voce:"alimentazione", importo:"", data:today(), descrizione:"" });
  const salva = () => {
    if (!form.importo || !form.descrizione) return;
    onSave({ ...form, importo:parseFloat(form.importo) });
  };
  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onCancel} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>←</button>
        <span style={{ fontSize:18, fontWeight:800 }}>Aggiungi costo — {animale.nome}</span>
      </div>
      <Field label="Voce di costo" value={form.voce} onChange={v=>setForm(f=>({...f,voce:v}))} options={VOCI.map(v=>({value:v.id,label:v.icon+" "+v.label}))} required/>
      <Field label="Importo (€)" value={form.importo} onChange={v=>setForm(f=>({...f,importo:v}))} type="number" required/>
      <Field label="Descrizione" value={form.descrizione} onChange={v=>setForm(f=>({...f,descrizione:v}))} required/>
      <Field label="Data" value={form.data} onChange={v=>setForm(f=>({...f,data:v}))} type="date"/>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── FORM PARTO ───────────────────────────────────────────────────────────────
function FormParto({ animale, data, onSave, onCancel }) {
  const maschi = data.animali.filter(a => a.sesso==="M" && a.specie===animale.specie).map(a=>({value:a.id,label:`${a.nome} — ${a.bdn}`}));
  const [form, setForm] = useState({ madreId:animale.id, padreId:"", data:today(), nati_sopravvissuti:1 });
  const salva = () => {
    onSave({ ...form, padreId:form.padreId?parseInt(form.padreId):null, nati_sopravvissuti:parseInt(form.nati_sopravvissuti)||0 });
  };
  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onCancel} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>←</button>
        <span style={{ fontSize:18, fontWeight:800 }}>Registra parto — {animale.nome}</span>
      </div>
      <Field label="Data parto" value={form.data} onChange={v=>setForm(f=>({...f,data:v}))} type="date"/>
      <Field label="Padre" value={form.padreId} onChange={v=>setForm(f=>({...f,padreId:v}))} options={maschi}/>
      <Field label="Nati sopravvissuti" value={form.nati_sopravvissuti} onChange={v=>setForm(f=>({...f,nati_sopravvissuti:v}))} type="number" required/>
      <Card style={{ background:C.green+"10", borderLeft:`3px solid ${C.green}` }}>
        <div style={{ fontSize:13, color:C.green, fontWeight:600 }}>
          ℹ️ I nati sopravvissuti aggiornano automaticamente il costo di origine di tutti i figli futuri di questa madre.
        </div>
      </Card>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── LISTA ANIMALI ────────────────────────────────────────────────────────────
function ListaAnimali({ data, onSeleziona, onNuovo }) {
  const [filtroSpecie, setFiltroSpecie] = useState("tutti");
  const [filtroOrigine, setFiltroOrigine] = useState("tutti");

  const animali = data.animali
    .filter(a => filtroSpecie==="tutti" || a.specie===filtroSpecie)
    .filter(a => filtroOrigine==="tutti" || a.origine===filtroOrigine);

  // KPI globali
  const costoMedioAcquistati = useMemo(() => {
    const acq = data.animali.filter(a=>a.origine==="acquistato");
    if (!acq.length) return 0;
    return acq.reduce((s,a)=>{
      const eco = calcolaEconomiaCompleta(a,data);
      return s+eco.costoTotale;
    },0)/acq.length;
  },[data]);

  const costoMedioNati = useMemo(() => {
    const nati = data.animali.filter(a=>a.origine==="nato");
    if (!nati.length) return 0;
    return nati.reduce((s,a)=>{
      const eco = calcolaEconomiaCompleta(a,data);
      return s+eco.costoTotale;
    },0)/nati.length;
  },[data]);

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:"0 0 28px 28px", padding:"28px 20px 24px", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#FFF" }}>🧾 Costo di Origine</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginTop:4 }}>Acquistati vs. nati in azienda</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16 }}>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"10px 14px" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>COSTO MEDIO ACQUISTATI</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#FFF" }}>€{costoMedioAcquistati.toFixed(0)}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"10px 14px" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>COSTO MEDIO NATI</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#ADFFB5" }}>€{costoMedioNati.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"0 16px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
          {["tutti","bovino","suino","ovino"].map(s=>(
            <button key={s} onClick={()=>setFiltroSpecie(s)} style={{ background:filtroSpecie===s?C.primary:C.card, color:filtroSpecie===s?"#FFF":C.muted, border:`1.5px solid ${filtroSpecie===s?C.primary:C.border}`, borderRadius:20, padding:"5px 14px", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {s==="tutti"?"Tutti":specieIcon(s)+" "+s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
          {["tutti","acquistato","nato"].map(s=>(
            <button key={s} onClick={()=>setFiltroOrigine(s)} style={{ background:filtroOrigine===s?C.blue:C.card, color:filtroOrigine===s?"#FFF":C.muted, border:`1.5px solid ${filtroOrigine===s?C.blue:C.border}`, borderRadius:20, padding:"5px 14px", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {s==="tutti"?"Tutte le origini":s==="acquistato"?"🛒 Acquistati":"🐣 Nati"}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
          <Btn label="+ Animale" onClick={onNuovo} small icon="➕ "/>
        </div>

        {animali.map(a => {
          const eco = calcolaEconomiaCompleta(a, data);
          return (
            <div key={a.id} onClick={()=>onSeleziona(a)} style={{ background:C.card, borderRadius:16, padding:16, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", border:`1px solid ${C.border}`, cursor:"pointer", borderLeft:`4px solid ${specieColor(a.specie)}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:16 }}>{specieIcon(a.specie)} {a.nome}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{a.bdn} · {a.razza}</div>
                  <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                    <Badge label={a.origine==="acquistato"?"🛒 Acquistato":"🐣 Nato"} color={a.origine==="acquistato"?C.blue:C.green}/>
                    <Badge label={a.sesso==="M"?"♂":"♀"} color={a.sesso==="M"?C.blue:"#B5547A"}/>
                  </div>
                  {a.origine==="nato" && (
                    <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>
                      {a.madreId && "♀ "+data.animali.find(x=>x.id===a.madreId)?.nome}
                      {a.padreId && " · ♂ "+data.animali.find(x=>x.id===a.padreId)?.nome}
                    </div>
                  )}
                </div>
                <div style={{ textAlign:"right", minWidth:80 }}>
                  <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>COSTO TOTALE</div>
                  <div style={{ fontSize:22, fontWeight:900, color:C.primary }}>€{eco.costoTotale.toFixed(0)}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                    origine: €{eco.origine.costo_origine.toFixed(0)}
                  </div>
                  <div style={{ fontSize:11, color:C.accent }}>
                    propri: €{eco.costiPropri.toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState("lista");
  const [selected, setSelected] = useState(null);

  const addAnimale = (animale) => {
    setData(d => ({ ...d, animali:[...d.animali,{...animale,id:d.nextId.animali}], nextId:{...d.nextId,animali:d.nextId.animali+1} }));
    setView("lista");
  };
  const addCosto = (costo) => {
    setData(d => ({ ...d, costi:[...d.costi,{...costo,id:d.nextId.costi}], nextId:{...d.nextId,costi:d.nextId.costi+1} }));
    setView("scheda");
  };
  const addParto = (parto) => {
    setData(d => ({ ...d, parti:[...d.parti,{...parto,id:d.nextId.parti}], nextId:{...d.nextId,parti:d.nextId.parti+1} }));
    setView("scheda");
  };

  const wrap = (children) => (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto" }}>
      {children}
    </div>
  );

  if (view==="nuovo") return wrap(<FormAnimale data={data} onSave={addAnimale} onCancel={()=>setView("lista")}/>);
  if (view==="form_costo" && selected) return wrap(<FormCosto animale={selected} onSave={addCosto} onCancel={()=>setView("scheda")}/>);
  if (view==="form_parto" && selected) return wrap(<FormParto animale={selected} data={data} onSave={addParto} onCancel={()=>setView("scheda")}/>);
  if (view==="scheda" && selected) return wrap(
    <SchedaCostoOrigine
      animale={selected}
      data={data}
      onBack={()=>setView("lista")}
      onAddCosto={()=>setView("form_costo")}
      onAddParto={()=>setView("form_parto")}
    />
  );

  return wrap(<ListaAnimali data={data} onSeleziona={a=>{setSelected(a);setView("scheda");}} onNuovo={()=>setView("nuovo")}/>);
}
