import { useState, useMemo, useReducer } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  manodopera:"#2C6E9B", gasolio:"#8B6914", energia:"#D4A017",
  ammortamenti:"#7A5C8A", bovini:"#8B6914", suini:"#B5547A", ovini:"#4A7C59",
};

const VOCI_GENERALI = [
  { id:"manodopera", label:"Manodopera",  icon:"👷", color:C.manodopera, unita:"ore/€" },
  { id:"gasolio",    label:"Gasolio",     icon:"⛽", color:C.gasolio,    unita:"litri/€" },
  { id:"energia",    label:"Energia elettrica", icon:"⚡", color:C.energia, unita:"kWh/€" },
];

const today      = () => new Date().toISOString().split("T")[0];
const thisYear   = () => new Date().getFullYear();
const specieIcon = s => ({ bovino:"🐄", suino:"🐷", ovino:"🐑" }[s] || "🐾");

// ─── DATI INIZIALI ────────────────────────────────────────────────────────────
const initialData = {
  // Macchinari con ammortamento a quote costanti
  macchinari: [
    { id:1, nome:"Trattore New Holland T5",  categoria:"trattore",    costo_storico:45000, anno_acquisto:2020, anni_ammortamento:10, note:"" },
    { id:2, nome:"Carro miscelatore Faresin", categoria:"alimentazione", costo_storico:18000, anno_acquisto:2021, anni_ammortamento:8,  note:"" },
    { id:3, nome:"Impianto mungitura",        categoria:"mungitura",   costo_storico:22000, anno_acquisto:2022, anni_ammortamento:12, note:"" },
    { id:4, nome:"Generatore elettrico",      categoria:"energia",     costo_storico:5500,  anno_acquisto:2023, anni_ammortamento:7,  note:"" },
    { id:5, nome:"Rimorchio trasporto",       categoria:"trasporto",   costo_storico:8000,  anno_acquisto:2021, anni_ammortamento:10, note:"" },
  ],
  // Costi generali per periodo (manodopera, gasolio, energia)
  costi_generali: [
    { id:1,  voce:"manodopera", importo:3200, data_inizio:"2024-01-01", data_fine:"2024-03-31", descrizione:"Q1 2024 — 3 operai",      quantita:320,  unita:"ore"   },
    { id:2,  voce:"manodopera", importo:3400, data_inizio:"2024-04-01", data_fine:"2024-06-30", descrizione:"Q2 2024 — stagione alta", quantita:340,  unita:"ore"   },
    { id:3,  voce:"gasolio",    importo:1850, data_inizio:"2024-01-01", data_fine:"2024-06-30", descrizione:"Semestre 1 2024",          quantita:1500, unita:"litri" },
    { id:4,  voce:"energia",    importo:980,  data_inizio:"2024-01-01", data_fine:"2024-03-31", descrizione:"Q1 2024 bollette",         quantita:4200, unita:"kWh"   },
    { id:5,  voce:"energia",    importo:1120, data_inizio:"2024-04-01", data_fine:"2024-06-30", descrizione:"Q2 2024 bollette",         quantita:4800, unita:"kWh"   },
  ],
  // Macellazioni del periodo (kg carcassa prodotti)
  macellazioni_periodo: [
    { id:1, bdn:"IT034BN099", nome:"Bruno",  specie:"bovino", data:"2024-02-10", peso_vivo:620, peso_carcassa:347, resa:56.0 },
    { id:2, bdn:"IT034BN098", nome:"Stella", specie:"bovino", data:"2024-03-22", peso_vivo:590, peso_carcassa:325, resa:55.1 },
    { id:3, bdn:"IT034SU099", nome:"Lardo",  specie:"suino",  data:"2024-05-15", peso_vivo:185, peso_carcassa:144, resa:77.8 },
    { id:4, bdn:"IT034SU098", nome:"Ciccia", specie:"suino",  data:"2024-06-01", peso_vivo:192, peso_carcassa:152, resa:79.2 },
    { id:5, bdn:"IT034OV001", nome:"Lana",   specie:"ovino",  data:"2024-04-10", peso_vivo:68,  peso_carcassa:32,  resa:47.1 },
  ],
  nextId:{ macchinari:6, costi_generali:6 },
};

// ─── CALCOLI AMMORTAMENTO ────────────────────────────────────────────────────
function quotaAnnua(m) {
  return m.costo_storico / m.anni_ammortamento;
}
function valoreResiduo(m) {
  const anniTrascorsi = thisYear() - m.anno_acquisto;
  return Math.max(0, m.costo_storico - quotaAnnua(m) * anniTrascorsi);
}
function percentualeAmmortata(m) {
  const anni = thisYear() - m.anno_acquisto;
  return Math.min(100, +(anni / m.anni_ammortamento * 100).toFixed(1));
}
function totaleAmmortamentiAnno(macchinari) {
  return macchinari.reduce((s, m) => {
    const anni = thisYear() - m.anno_acquisto;
    if (anni >= m.anni_ammortamento) return s; // già ammortizzato
    return s + quotaAnnua(m);
  }, 0);
}

// ─── CALCOLO RIPARTIZIONE SUL KG ─────────────────────────────────────────────
function calcolaRipartizione(data, filtroInizio, filtroFine) {
  // Filtra costi generali per periodo
  const costiNelPeriodo = data.costi_generali.filter(c => {
    if (!filtroInizio && !filtroFine) return true;
    return (!filtroInizio || c.data_fine >= filtroInizio) &&
           (!filtroFine   || c.data_inizio <= filtroFine);
  });

  const totPerVoce = {};
  VOCI_GENERALI.forEach(v => {
    totPerVoce[v.id] = costiNelPeriodo.filter(c => c.voce === v.id).reduce((s,c) => s + c.importo, 0);
  });

  // Ammortamenti quota annua proporzionata al periodo
  const giorniPeriodo = (filtroInizio && filtroFine)
    ? Math.max(1, (new Date(filtroFine) - new Date(filtroInizio)) / 86400000)
    : 365;
  const ammortAmento = totaleAmmortamentiAnno(data.macchinari) * (giorniPeriodo / 365);
  totPerVoce["ammortamenti"] = ammortAmento;

  const costoTotaleGenerale = Object.values(totPerVoce).reduce((a,b) => a+b, 0);

  // Kg carcassa macellati nel periodo
  const macellazioniPeriodo = data.macellazioni_periodo.filter(m => {
    if (!filtroInizio && !filtroFine) return true;
    return (!filtroInizio || m.data >= filtroInizio) &&
           (!filtroFine   || m.data <= filtroFine);
  });

  const kgTotali = macellazioniPeriodo.reduce((s,m) => s + (m.peso_carcassa || 0), 0);
  const costoKgGenerale = kgTotali > 0 ? costoTotaleGenerale / kgTotali : null;

  return { totPerVoce, costoTotaleGenerale, kgTotali, costoKgGenerale, macellazioniPeriodo, costiNelPeriodo };
}

// ─── UI BASE ──────────────────────────────────────────────────────────────────
const Card = ({ children, style={} }) => (
  <div style={{ background:C.card, borderRadius:16, padding:16, marginBottom:12, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", border:`1px solid ${C.border}`, ...style }}>
    {children}
  </div>
);
const Badge = ({ label, color }) => (
  <span style={{ background:color+"22", color, border:`1px solid ${color}44`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{label}</span>
);
const Btn = ({ label, onClick, variant="primary", small=false, icon }) => {
  const s = { primary:{bg:C.primary,fg:"#FFF"}, success:{bg:C.green,fg:"#FFF"}, danger:{bg:C.red,fg:"#FFF"}, ghost:{bg:"transparent",fg:C.text}, outline:{bg:"transparent",fg:C.primary} }[variant]||{bg:C.primary,fg:"#FFF"};
  return (
    <button onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.fg, border:variant==="outline"?`1.5px solid ${C.primary}`:"none", borderRadius:10, padding:small?"6px 12px":"10px 18px", fontSize:small?13:15, fontWeight:600, cursor:"pointer", boxShadow:["primary","success","danger"].includes(variant)?"0 2px 6px rgba(0,0,0,0.15)":"none" }}>
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
const SectionTitle = ({ label }) => (
  <div style={{ fontSize:12, fontWeight:700, color:C.muted, margin:"16px 0 8px", textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
);

// ─── SEZIONE MACCHINARI ───────────────────────────────────────────────────────
function Macchinari({ data, dispatch }) {
  const [form, setForm] = useState(null);
  const empty = { nome:"", categoria:"trattore", costo_storico:"", anno_acquisto:thisYear(), anni_ammortamento:10, note:"" };
  const totAmm = totaleAmmortamentiAnno(data.macchinari);

  const salva = () => {
    if (!form.nome || !form.costo_storico) return;
    const payload = { ...form, costo_storico:parseFloat(form.costo_storico), anno_acquisto:parseInt(form.anno_acquisto), anni_ammortamento:parseInt(form.anni_ammortamento) };
    if (form.id) dispatch({ type:"UPDATE_MACCHINARIO", payload });
    else         dispatch({ type:"ADD_MACCHINARIO",    payload });
    setForm(null);
  };

  if (form) return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <button onClick={()=>setForm(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20 }}>←</button>
        <span style={{ fontSize:16, fontWeight:700 }}>{form.id?"Modifica":"Nuovo"} macchinario</span>
      </div>
      <Field label="Nome / Descrizione" value={form.nome} onChange={v=>setForm(f=>({...f,nome:v}))} required/>
      <Field label="Categoria" value={form.categoria} onChange={v=>setForm(f=>({...f,categoria:v}))}
        options={["trattore","alimentazione","mungitura","trasporto","energia","irrigazione","altro"]}/>
      <Field label="Costo storico di acquisto (€)" value={form.costo_storico} onChange={v=>setForm(f=>({...f,costo_storico:v}))} type="number" required/>
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}><Field label="Anno acquisto" value={form.anno_acquisto} onChange={v=>setForm(f=>({...f,anno_acquisto:v}))} type="number"/></div>
        <div style={{ flex:1 }}><Field label="Anni ammortamento" value={form.anni_ammortamento} onChange={v=>setForm(f=>({...f,anni_ammortamento:v}))} type="number"/></div>
      </div>
      {form.costo_storico && form.anni_ammortamento && (
        <Card style={{ background:C.ammortamenti+"10", borderLeft:`3px solid ${C.ammortamenti}`, marginBottom:12 }}>
          <div style={{ fontSize:13, color:C.ammortamenti, fontWeight:600 }}>Quota annua di ammortamento</div>
          <div style={{ fontSize:24, fontWeight:900, color:C.ammortamenti }}>
            €{(parseFloat(form.costo_storico)/parseInt(form.anni_ammortamento)).toFixed(2)}<span style={{ fontSize:13 }}>/anno</span>
          </div>
          <div style={{ fontSize:12, color:C.muted }}>€{(parseFloat(form.costo_storico)/parseInt(form.anni_ammortamento)/12).toFixed(2)}/mese</div>
        </Card>
      )}
      <Field label="Note" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={()=>setForm(null)} variant="ghost"/>
      </div>
    </div>
  );

  return (
    <div>
      <Card style={{ background:`linear-gradient(135deg,${C.ammortamenti}15,${C.card})`, borderLeft:`4px solid ${C.ammortamenti}` }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:8 }}>QUOTA AMMORTAMENTI ANNO {thisYear()}</div>
        <div style={{ fontSize:32, fontWeight:900, color:C.ammortamenti }}>€{totAmm.toFixed(2)}</div>
        <div style={{ fontSize:13, color:C.muted }}>su {data.macchinari.length} macchinari · €{(totAmm/12).toFixed(2)}/mese</div>
      </Card>

      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}>
        <Btn label="+ Macchinario" onClick={()=>setForm({...empty})} small icon="➕ "/>
      </div>

      {data.macchinari.map(m => {
        const qa   = quotaAnnua(m);
        const vr   = valoreResiduo(m);
        const pct  = percentualeAmmortata(m);
        const done = pct >= 100;
        return (
          <Card key={m.id} style={{ borderLeft:`4px solid ${done?C.muted:C.ammortamenti}`, opacity:done?0.7:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>🚜 {m.nome}</div>
                <div style={{ fontSize:12, color:C.muted }}>{m.categoria} · acquistato {m.anno_acquisto}</div>
                <div style={{ display:"flex", gap:6, marginTop:4 }}>
                  <Badge label={done?"✓ Ammortizzato":`${m.anni_ammortamento} anni`} color={done?C.muted:C.ammortamenti}/>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                {!done && <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:C.muted }}>quota/anno</div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.ammortamenti }}>€{qa.toFixed(0)}</div>
                </div>}
                <button onClick={()=>setForm({...m})} style={{ background:C.blue+"20", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", fontSize:14 }}>✏️</button>
              </div>
            </div>
            {/* Barra avanzamento ammortamento */}
            <div style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:3 }}>
                <span>Costo storico: €{m.costo_storico.toLocaleString()}</span>
                <span style={{ color:done?C.muted:C.ammortamenti, fontWeight:600 }}>{pct}%</span>
              </div>
              <div style={{ background:C.border, borderRadius:99, height:10, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, background:done?C.muted:C.ammortamenti, height:"100%", borderRadius:99, transition:"width 0.5s" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, marginTop:3 }}>
                <span>Ammortizzato: €{(m.costo_storico - vr).toFixed(0)}</span>
                <span>Residuo: <b style={{ color:vr>0?C.primary:C.muted }}>€{vr.toFixed(0)}</b></span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── SEZIONE COSTI GENERALI ───────────────────────────────────────────────────
function CostiGenerali({ data, dispatch }) {
  const [form, setForm] = useState(null);
  const empty = { voce:"manodopera", importo:"", quantita:"", unita:"ore", data_inizio:"", data_fine:"", descrizione:"" };

  const salva = () => {
    if (!form.voce || !form.importo || !form.data_inizio) return;
    dispatch({ type:"ADD_COSTO_GENERALE", payload:{ ...form, importo:parseFloat(form.importo), quantita:form.quantita?parseFloat(form.quantita):null } });
    setForm(null);
  };

  const unitaPerVoce = { manodopera:["ore","giorni"], gasolio:["litri","€ diretti"], energia:["kWh","€ diretti"] };

  if (form) return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <button onClick={()=>setForm(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20 }}>←</button>
        <span style={{ fontSize:16, fontWeight:700 }}>Nuovo costo generale</span>
      </div>
      <Field label="Voce" value={form.voce} onChange={v=>setForm(f=>({...f,voce:v,unita:unitaPerVoce[v]?.[0]||"€"}))}
        options={VOCI_GENERALI.map(v=>({value:v.id,label:v.icon+" "+v.label}))} required/>
      <Field label="Importo totale (€)" value={form.importo} onChange={v=>setForm(f=>({...f,importo:v}))} type="number" required/>
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}><Field label="Quantità (opz.)" value={form.quantita} onChange={v=>setForm(f=>({...f,quantita:v}))} type="number"/></div>
        <div style={{ flex:1 }}><Field label="Unità" value={form.unita} onChange={v=>setForm(f=>({...f,unita:v}))}
          options={(unitaPerVoce[form.voce]||["€"]).map(u=>({value:u,label:u}))}/></div>
      </div>
      <Field label="Descrizione" value={form.descrizione} onChange={v=>setForm(f=>({...f,descrizione:v}))} required/>
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}><Field label="Dal" value={form.data_inizio} onChange={v=>setForm(f=>({...f,data_inizio:v}))} type="date" required/></div>
        <div style={{ flex:1 }}><Field label="Al" value={form.data_fine} onChange={v=>setForm(f=>({...f,data_fine:v}))} type="date"/></div>
      </div>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={()=>setForm(null)} variant="ghost"/>
      </div>
    </div>
  );

  const grouped = {};
  VOCI_GENERALI.forEach(v => {
    grouped[v.id] = data.costi_generali.filter(c=>c.voce===v.id);
  });

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}>
        <Btn label="+ Registra" onClick={()=>setForm({...empty})} small icon="➕ "/>
      </div>
      {VOCI_GENERALI.map(v => {
        const voci = grouped[v.id] || [];
        const tot  = voci.reduce((s,c)=>s+c.importo,0);
        return (
          <Card key={v.id} style={{ borderLeft:`4px solid ${v.color}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontWeight:700, fontSize:15 }}>{v.icon} {v.label}</div>
              <div style={{ fontSize:20, fontWeight:900, color:v.color }}>€{tot.toFixed(0)}</div>
            </div>
            {voci.sort((a,b)=>b.data_inizio.localeCompare(a.data_inizio)).map(c=>(
              <div key={c.id} style={{ background:C.bg, borderRadius:10, padding:"8px 12px", marginBottom:6, fontSize:13 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:600 }}>{c.descrizione}</span>
                  <span style={{ fontWeight:700, color:v.color }}>€{c.importo.toFixed(0)}</span>
                </div>
                <div style={{ color:C.muted, marginTop:2 }}>
                  {c.data_inizio}{c.data_fine?" → "+c.data_fine:""}
                  {c.quantita && ` · ${c.quantita} ${c.unita}`}
                </div>
              </div>
            ))}
            {voci.length===0 && <div style={{ fontSize:13, color:C.muted, fontStyle:"italic" }}>Nessuna registrazione</div>}
          </Card>
        );
      })}
    </div>
  );
}

// ─── SEZIONE RIPARTIZIONE SUL KG ─────────────────────────────────────────────
function Ripartizione({ data }) {
  const [dal,  setDal]  = useState("2024-01-01");
  const [al,   setAl]   = useState("2024-06-30");

  const ris = useMemo(() => calcolaRipartizione(data, dal, al), [data, dal, al]);

  const VOCI_TOTALI = [
    ...VOCI_GENERALI,
    { id:"ammortamenti", label:"Ammortamenti macchinari", icon:"🏗️", color:C.ammortamenti },
  ];

  return (
    <div>
      {/* Selettore periodo */}
      <Card>
        <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:10 }}>PERIODO DI ANALISI</div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Dal</div>
            <input type="date" value={dal} onChange={e=>setDal(e.target.value)} style={inputStyle}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Al</div>
            <input type="date" value={al} onChange={e=>setAl(e.target.value)} style={inputStyle}/>
          </div>
        </div>
      </Card>

      {/* KPI principali */}
      <Card style={{ background:`linear-gradient(135deg,${C.primary}12,${C.accent}08)` }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Risultato periodo</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <div style={{ background:"#FFF", borderRadius:12, padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>COSTI GENERALI TOTALI</div>
            <div style={{ fontSize:24, fontWeight:900, color:C.primary }}>€{ris.costoTotaleGenerale.toFixed(0)}</div>
          </div>
          <div style={{ background:"#FFF", borderRadius:12, padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>KG CARCASSA PRODOTTI</div>
            <div style={{ fontSize:24, fontWeight:900, color:C.accent }}>{ris.kgTotali.toFixed(0)} kg</div>
          </div>
        </div>

        {ris.costoKgGenerale !== null ? (
          <div style={{ background:C.primary, borderRadius:14, padding:"16px 20px", textAlign:"center" }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", fontWeight:600, marginBottom:4 }}>COSTO GENERALE / KG CARCASSA</div>
            <div style={{ fontSize:42, fontWeight:900, color:"#FFD700", lineHeight:1 }}>€{ris.costoKgGenerale.toFixed(2)}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:4 }}>
              €{ris.costoTotaleGenerale.toFixed(0)} ÷ {ris.kgTotali.toFixed(0)} kg
            </div>
          </div>
        ) : (
          <div style={{ background:C.yellow+"20", borderRadius:12, padding:12, fontSize:14, color:C.yellow, textAlign:"center" }}>
            ⚠ Nessuna macellazione registrata nel periodo selezionato
          </div>
        )}
      </Card>

      {/* Composizione costi */}
      <Card>
        <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Composizione costi generali</div>
        {VOCI_TOTALI.map(v => {
          const val = ris.totPerVoce[v.id] || 0;
          const pct = ris.costoTotaleGenerale > 0 ? (val/ris.costoTotaleGenerale*100).toFixed(1) : 0;
          const kgQ = ris.costoKgGenerale && ris.kgTotali > 0 ? (val/ris.kgTotali).toFixed(2) : null;
          return (
            <div key={v.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3 }}>
                <span style={{ fontWeight:600 }}>{v.icon} {v.label}</span>
                <div style={{ textAlign:"right" }}>
                  <span style={{ color:v.color, fontWeight:700 }}>€{val.toFixed(0)}</span>
                  <span style={{ color:C.muted }}> ({pct}%)</span>
                  {kgQ && <div style={{ fontSize:11, color:C.muted }}>€{kgQ}/kg</div>}
                </div>
              </div>
              <div style={{ background:C.border, borderRadius:6, height:10, overflow:"hidden" }}>
                <div style={{ background:v.color, width:`${pct}%`, height:"100%", borderRadius:6, transition:"width 0.4s" }}/>
              </div>
            </div>
          );
        })}
        <div style={{ display:"flex", justifyContent:"space-between", borderTop:`2px solid ${C.border}`, paddingTop:8, marginTop:4 }}>
          <span style={{ fontWeight:700 }}>Totale</span>
          <span style={{ fontWeight:900, fontSize:16, color:C.primary }}>€{ris.costoTotaleGenerale.toFixed(2)}</span>
        </div>
      </Card>

      {/* Dettaglio per animale macellato */}
      {ris.macellazioniPeriodo.length > 0 && (
        <Card>
          <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
            Quota generale per animale macellato
          </div>
          {ris.macellazioniPeriodo.map(m => {
            const quotaAnimale = ris.costoKgGenerale ? m.peso_carcassa * ris.costoKgGenerale : null;
            return (
              <div key={m.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{specieIcon(m.specie)} {m.nome}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{m.data} · {m.peso_carcassa} kg carcassa · resa {m.resa}%</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  {quotaAnimale && (
                    <>
                      <div style={{ fontSize:16, fontWeight:800, color:C.primary }}>€{quotaAnimale.toFixed(2)}</div>
                      <div style={{ fontSize:11, color:C.muted }}>quota generale</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch(action.type) {
    case "ADD_MACCHINARIO":
      return { ...state, macchinari:[...state.macchinari,{...action.payload,id:state.nextId.macchinari}], nextId:{...state.nextId,macchinari:state.nextId.macchinari+1} };
    case "UPDATE_MACCHINARIO":
      return { ...state, macchinari:state.macchinari.map(m=>m.id===action.payload.id?action.payload:m) };
    case "ADD_COSTO_GENERALE":
      return { ...state, costi_generali:[...state.costi_generali,{...action.payload,id:state.nextId.costi_generali}], nextId:{...state.nextId,costi_generali:state.nextId.costi_generali+1} };
    default: return state;
  }
}

export default function App() {
  const [data, dispatch] = useReducer(reducer, initialData);
  const [subTab, setSubTab] = useState("ripartizione");

  const TABS = [
    { id:"ripartizione", label:"€/kg",        icon:"📊" },
    { id:"generali",     label:"Costi",        icon:"💶" },
    { id:"macchinari",   label:"Macchinari",   icon:"🚜" },
  ];

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", paddingBottom:20 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:"0 0 28px 28px", padding:"24px 20px 20px", marginBottom:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#FFF" }}>🏭 Costi Generali</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginTop:4 }}>Manodopera · Gasolio · Energia · Ammortamenti</div>
      </div>

      {/* Sub-tab */}
      <div style={{ display:"flex", background:"#FFF", borderBottom:`1.5px solid ${C.border}`, marginBottom:0 }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)} style={{ flex:1, padding:"12px 0", background:"none", border:"none", borderBottom:`3px solid ${subTab===t.id?C.primary:"transparent"}`, fontWeight:subTab===t.id?700:500, fontSize:13, color:subTab===t.id?C.primary:C.muted, cursor:"pointer" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"16px 16px 40px" }}>
        {subTab==="ripartizione" && <Ripartizione data={data}/>}
        {subTab==="generali"    && <CostiGenerali data={data} dispatch={dispatch}/>}
        {subTab==="macchinari"  && <Macchinari    data={data} dispatch={dispatch}/>}
      </div>
    </div>
  );
}
