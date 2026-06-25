import { useState, useMemo } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  bovini:"#8B6914", suini:"#B5547A", ovini:"#4A7C59",
  alimentazione:"#8B6914", sanitario:"#C0392B", manodopera:"#2C6E9B",
  ammortamenti:"#7A5C8A", energia:"#D4A017", affitti:"#4A7C59",
};

const VOCI = [
  { id:"alimentazione", label:"Alimentazione", icon:"🌾", color:C.alimentazione },
  { id:"sanitario",     label:"Sanitario",     icon:"💉", color:C.sanitario },
  { id:"manodopera",    label:"Manodopera",    icon:"👷", color:C.manodopera },
  { id:"ammortamenti",  label:"Ammortamenti",  icon:"🏗️", color:C.ammortamenti },
  { id:"energia",       label:"Energia",       icon:"⚡", color:C.energia },
  { id:"affitti",       label:"Affitti",       icon:"🏠", color:C.affitti },
];

const SPECIE = ["bovino","suino","ovino"];
const specieLabel = s => ({ bovino:"Bovini", suino:"Suini", ovino:"Ovini" }[s]||s);
const specieIcon  = s => ({ bovino:"🐄", suino:"🐷", ovino:"🐑" }[s]||"🐾");
const specieColor = s => ({ bovino:C.bovini, suino:C.suini, ovino:C.ovini }[s]||C.muted);
const today = () => new Date().toISOString().split("T")[0];

// ─── DATI INIZIALI ────────────────────────────────────────────────────────────
const initialData = {
  // Costi complessivi per periodo
  costi: [
    { id:1,  voce:"alimentazione", specie:"bovino", importo:4200, data_inizio:"2024-01-01", data_fine:"2024-03-31", descrizione:"Fieno e mangime Q1 bovini", fornitore:"Az. Verdi" },
    { id:2,  voce:"alimentazione", specie:"suino",  importo:2800, data_inizio:"2024-01-01", data_fine:"2024-03-31", descrizione:"Mangime completo Q1 suini", fornitore:"AgroFeed" },
    { id:3,  voce:"alimentazione", specie:"ovino",  importo:980,  data_inizio:"2024-01-01", data_fine:"2024-03-31", descrizione:"Fieno ovini Q1", fornitore:"Az. Verdi" },
    { id:4,  voce:"sanitario",     specie:"bovino", importo:850,  data_inizio:"2024-01-01", data_fine:"2024-06-30", descrizione:"Vaccini e visite H1 bovini", fornitore:"Dr. Rossi" },
    { id:5,  voce:"sanitario",     specie:"suino",  importo:620,  data_inizio:"2024-01-01", data_fine:"2024-06-30", descrizione:"Profilassi suini H1", fornitore:"Dr. Bianchi" },
    { id:6,  voce:"manodopera",    specie:null,     importo:6400, data_inizio:"2024-01-01", data_fine:"2024-06-30", descrizione:"2 operai H1 2024", fornitore:"" },
    { id:7,  voce:"energia",       specie:null,     importo:1840, data_inizio:"2024-01-01", data_fine:"2024-06-30", descrizione:"Elettricità + gasolio H1", fornitore:"Enel" },
    { id:8,  voce:"affitti",       specie:null,     importo:3600, data_inizio:"2024-01-01", data_fine:"2024-06-30", descrizione:"Affitto pascoli H1", fornitore:"Proprietà Bianchi" },
    { id:9,  voce:"alimentazione", specie:"bovino", importo:4600, data_inizio:"2024-04-01", data_fine:"2024-06-30", descrizione:"Alimentazione Q2 bovini", fornitore:"Az. Verdi" },
    { id:10, voce:"alimentazione", specie:"suino",  importo:3100, data_inizio:"2024-04-01", data_fine:"2024-06-30", descrizione:"Mangime Q2 suini", fornitore:"AgroFeed" },
  ],
  // Consistenza capi per periodo (numero animali presenti)
  capi: [
    { id:1, specie:"bovino", numero:28, data_inizio:"2024-01-01", data_fine:"2024-06-30", note:"" },
    { id:2, specie:"suino",  numero:85, data_inizio:"2024-01-01", data_fine:"2024-06-30", note:"" },
    { id:3, specie:"ovino",  numero:42, data_inizio:"2024-01-01", data_fine:"2024-06-30", note:"" },
  ],
  // Kg carcassa prodotti nel periodo
  produzioni: [
    { id:1, specie:"bovino", kg_carcassa:1240, data_inizio:"2024-01-01", data_fine:"2024-06-30", note:"6 capi macellati" },
    { id:2, specie:"suino",  kg_carcassa:3200, data_inizio:"2024-01-01", data_fine:"2024-06-30", note:"22 capi" },
    { id:3, specie:"ovino",  kg_carcassa:480,  data_inizio:"2024-01-01", data_fine:"2024-06-30", note:"15 agnelli" },
  ],
  nextId:{ costi:11, capi:4, produzioni:4 },
};

// ─── CALCOLI ──────────────────────────────────────────────────────────────────
function filtraPerPeriodo(lista, dal, al) {
  if (!dal && !al) return lista;
  return lista.filter(r =>
    (!dal || r.data_fine >= dal) &&
    (!al  || r.data_inizio <= al)
  );
}

function calcolaRiepilogo(data, dal, al) {
  const costi    = filtraPerPeriodo(data.costi, dal, al);
  const capi     = filtraPerPeriodo(data.capi, dal, al);
  const prod     = filtraPerPeriodo(data.produzioni, dal, al);

  // Totale generale
  const totale = costi.reduce((s,c) => s+c.importo, 0);

  // Per voce
  const perVoce = {};
  VOCI.forEach(v => { perVoce[v.id] = costi.filter(c=>c.voce===v.id).reduce((s,c)=>s+c.importo,0); });

  // Per specie
  const perSpecie = {};
  SPECIE.forEach(sp => {
    const costiSp = costi.filter(c => c.specie===sp || c.specie===null);
    // Costi specifici specie + quota proporzionale dei costi generali (specie null)
    const costiSpecifici  = costi.filter(c=>c.specie===sp).reduce((s,c)=>s+c.importo,0);
    const costiGenerali   = costi.filter(c=>c.specie===null).reduce((s,c)=>s+c.importo,0);
    const totCapi         = capi.reduce((s,c)=>s+c.numero,0);
    const capiSp          = capi.filter(c=>c.specie===sp).reduce((s,c)=>s+c.numero,0);
    const quotaGenerali   = totCapi>0 ? costiGenerali*(capiSp/totCapi) : 0;
    const totSpecie       = costiSpecifici + quotaGenerali;

    const kgSp   = prod.filter(p=>p.specie===sp).reduce((s,p)=>s+p.kg_carcassa,0);
    const capiN  = capiSp;

    perSpecie[sp] = {
      costiSpecifici, quotaGenerali, totale:totSpecie,
      capi:capiN, kg:kgSp,
      costoPerCapo: capiN>0  ? +(totSpecie/capiN).toFixed(2)  : null,
      costoPerKg:   kgSp>0   ? +(totSpecie/kgSp).toFixed(2)   : null,
    };
  });

  // Totali capi e kg
  const totCapi = capi.reduce((s,c)=>s+c.numero,0);
  const totKg   = prod.reduce((s,p)=>s+p.kg_carcassa,0);
  const costoPerCapo = totCapi>0 ? +(totale/totCapi).toFixed(2) : null;
  const costoPerKg   = totKg>0   ? +(totale/totKg).toFixed(2)   : null;

  return { totale, perVoce, perSpecie, totCapi, totKg, costoPerCapo, costoPerKg };
}

// ─── UI BASE ──────────────────────────────────────────────────────────────────
const Card = ({children,style={}}) => (
  <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.07)",border:`1px solid ${C.border}`,...style}}>
    {children}
  </div>
);
const Badge = ({label,color}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{label}</span>
);
const Btn = ({label,onClick,variant="primary",small=false,icon}) => {
  const s={primary:{bg:C.primary,fg:"#FFF"},success:{bg:C.green,fg:"#FFF"},danger:{bg:C.red,fg:"#FFF"},ghost:{bg:"transparent",fg:C.text},outline:{bg:"transparent",fg:C.primary}}[variant]||{bg:C.primary,fg:"#FFF"};
  return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:5,background:s.bg,color:s.fg,border:variant==="outline"?`1.5px solid ${C.primary}`:"none",borderRadius:10,padding:small?"6px 12px":"10px 18px",fontSize:small?13:15,fontWeight:600,cursor:"pointer"}}>{icon}{label}</button>;
};
const inputStyle = {width:"100%",boxSizing:"border-box",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 12px",fontSize:15,background:"#FAFAF8",color:C.text,outline:"none"};
const Field = ({label,value,onChange,type="text",options,required}) => (
  <div style={{marginBottom:12}}>
    <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>{label}{required&&" *"}</div>
    {options
      ? <select value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}><option value="">— seleziona —</option>{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}</select>
      : <input type={type} value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}/>}
  </div>
);

// ─── FORM NUOVO COSTO ─────────────────────────────────────────────────────────
function FormCosto({onSave, onCancel}) {
  const [form, setForm] = useState({voce:"alimentazione",specie:"",importo:"",data_inizio:"",data_fine:"",descrizione:"",fornitore:""});
  const salva = () => {
    if (!form.voce||!form.importo||!form.data_inizio) return;
    onSave({...form, importo:parseFloat(form.importo), specie:form.specie||null});
  };
  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:18,fontWeight:800}}>Nuovo costo complessivo</span>
      </div>
      <Field label="Voce di costo" value={form.voce} onChange={v=>setForm(f=>({...f,voce:v}))}
        options={VOCI.map(v=>({value:v.id,label:v.icon+" "+v.label}))} required/>
      <Field label="Specie (lascia vuoto = tutte)" value={form.specie} onChange={v=>setForm(f=>({...f,specie:v}))}
        options={[{value:"",label:"🐾 Tutte le specie"},{value:"bovino",label:"🐄 Bovini"},{value:"suino",label:"🐷 Suini"},{value:"ovino",label:"🐑 Ovini"}]}/>
      <Field label="Importo totale (€)" value={form.importo} onChange={v=>setForm(f=>({...f,importo:v}))} type="number" required/>
      <Field label="Descrizione" value={form.descrizione} onChange={v=>setForm(f=>({...f,descrizione:v}))} required/>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><Field label="Dal" value={form.data_inizio} onChange={v=>setForm(f=>({...f,data_inizio:v}))} type="date" required/></div>
        <div style={{flex:1}}><Field label="Al" value={form.data_fine} onChange={v=>setForm(f=>({...f,data_fine:v}))} type="date"/></div>
      </div>
      <Field label="Fornitore / Note" value={form.fornitore} onChange={v=>setForm(f=>({...f,fornitore:v}))}/>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── FORM CONSISTENZA CAPI ────────────────────────────────────────────────────
function FormCapi({onSave, onCancel}) {
  const [form, setForm] = useState({specie:"bovino",numero:"",data_inizio:"",data_fine:"",note:""});
  const salva = () => {
    if (!form.specie||!form.numero||!form.data_inizio) return;
    onSave({...form, numero:parseInt(form.numero)});
  };
  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:18,fontWeight:800}}>Registra consistenza capi</span>
      </div>
      <Field label="Specie" value={form.specie} onChange={v=>setForm(f=>({...f,specie:v}))}
        options={SPECIE.map(s=>({value:s,label:specieIcon(s)+" "+specieLabel(s)}))} required/>
      <Field label="Numero capi presenti" value={form.numero} onChange={v=>setForm(f=>({...f,numero:v}))} type="number" required/>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><Field label="Dal" value={form.data_inizio} onChange={v=>setForm(f=>({...f,data_inizio:v}))} type="date" required/></div>
        <div style={{flex:1}}><Field label="Al" value={form.data_fine} onChange={v=>setForm(f=>({...f,data_fine:v}))} type="date"/></div>
      </div>
      <Field label="Note" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── FORM PRODUZIONE KG ───────────────────────────────────────────────────────
function FormProduzione({onSave, onCancel}) {
  const [form, setForm] = useState({specie:"bovino",kg_carcassa:"",data_inizio:"",data_fine:"",note:""});
  const salva = () => {
    if (!form.specie||!form.kg_carcassa||!form.data_inizio) return;
    onSave({...form, kg_carcassa:parseFloat(form.kg_carcassa)});
  };
  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:18,fontWeight:800}}>Registra produzione kg carcassa</span>
      </div>
      <Field label="Specie" value={form.specie} onChange={v=>setForm(f=>({...f,specie:v}))}
        options={SPECIE.map(s=>({value:s,label:specieIcon(s)+" "+specieLabel(s)}))} required/>
      <Field label="Kg carcassa prodotti" value={form.kg_carcassa} onChange={v=>setForm(f=>({...f,kg_carcassa:v}))} type="number" required/>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><Field label="Dal" value={form.data_inizio} onChange={v=>setForm(f=>({...f,data_inizio:v}))} type="date" required/></div>
        <div style={{flex:1}}><Field label="Al" value={form.data_fine} onChange={v=>setForm(f=>({...f,data_fine:v}))} type="date"/></div>
      </div>
      <Field label="Note (es. n. capi macellati)" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── DASHBOARD RIEPILOGO ──────────────────────────────────────────────────────
function Dashboard({data, onNuovoCosto, onNuovoCapi, onNuovaProd}) {
  const [dal, setDal] = useState("2024-01-01");
  const [al,  setAl]  = useState("2024-06-30");
  const [tab, setTab] = useState("riepilogo"); // riepilogo | dettaglio | registrazioni

  const ris = useMemo(()=>calcolaRiepilogo(data,dal,al),[data,dal,al]);

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,borderRadius:"0 0 28px 28px",padding:"24px 20px 20px",marginBottom:0}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>📊 Costi Complessivi</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",marginTop:4}}>Analisi per periodo, specie e voce</div>
      </div>

      {/* Sub-tab */}
      <div style={{display:"flex",background:"#FFF",borderBottom:`1.5px solid ${C.border}`}}>
        {[["riepilogo","📊 Riepilogo"],["dettaglio","🐄 Per specie"],["registrazioni","📋 Registrazioni"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"12px 0",background:"none",border:"none",borderBottom:`3px solid ${tab===id?C.primary:"transparent"}`,fontWeight:tab===id?700:500,fontSize:12,color:tab===id?C.primary:C.muted,cursor:"pointer"}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{padding:"16px 16px 20px"}}>
        {/* Filtro periodo */}
        <Card>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:10}}>PERIODO DI ANALISI</div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Dal</div>
              <input type="date" value={dal} onChange={e=>setDal(e.target.value)} style={inputStyle}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Al</div>
              <input type="date" value={al} onChange={e=>setAl(e.target.value)} style={inputStyle}/>
            </div>
          </div>
        </Card>

        {tab==="riepilogo" && <>
          {/* KPI principali */}
          <Card style={{background:`linear-gradient(135deg,${C.primary}12,${C.accent}08)`}}>
            <div style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Totale allevamento</div>
            <div style={{fontSize:38,fontWeight:900,color:C.primary,marginBottom:12}}>€{ris.totale.toLocaleString("it-IT",{minimumFractionDigits:2})}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"#FFF",borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
                <div style={{fontSize:11,color:C.muted,fontWeight:600}}>COSTO/CAPO</div>
                <div style={{fontSize:22,fontWeight:900,color:C.blue}}>{ris.costoPerCapo ? `€${ris.costoPerCapo}` : "—"}</div>
                <div style={{fontSize:11,color:C.muted}}>{ris.totCapi} capi totali</div>
              </div>
              <div style={{background:"#FFF",borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
                <div style={{fontSize:11,color:C.muted,fontWeight:600}}>COSTO/KG CARCASSA</div>
                <div style={{fontSize:22,fontWeight:900,color:ris.costoPerKg>5?C.red:ris.costoPerKg>3?C.yellow:C.green}}>{ris.costoPerKg ? `€${ris.costoPerKg}` : "—"}</div>
                <div style={{fontSize:11,color:C.muted}}>{ris.totKg} kg prodotti</div>
              </div>
            </div>
          </Card>

          {/* Grafico composizione costi */}
          <Card>
            <div style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Composizione costi</div>
            {VOCI.map(v=>{
              const val = ris.perVoce[v.id]||0;
              const pct = ris.totale>0 ? (val/ris.totale*100).toFixed(1) : 0;
              if(val===0) return null;
              return (
                <div key={v.id} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}>
                    <span style={{fontWeight:600}}>{v.icon} {v.label}</span>
                    <div style={{textAlign:"right"}}>
                      <span style={{color:v.color,fontWeight:700}}>€{val.toLocaleString("it-IT")}</span>
                      <span style={{color:C.muted}}> ({pct}%)</span>
                    </div>
                  </div>
                  <div style={{background:C.border,borderRadius:6,height:10,overflow:"hidden"}}>
                    <div style={{background:v.color,width:`${pct}%`,height:"100%",borderRadius:6,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </Card>
        </>}

        {tab==="dettaglio" && <>
          {SPECIE.map(sp=>{
            const s = ris.perSpecie[sp];
            return (
              <Card key={sp} style={{borderLeft:`5px solid ${specieColor(sp)}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:18,fontWeight:800}}>{specieIcon(sp)} {specieLabel(sp)}</div>
                    <div style={{fontSize:13,color:C.muted}}>{s.capi} capi · {s.kg} kg prodotti</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:24,fontWeight:900,color:specieColor(sp)}}>€{s.totale.toLocaleString("it-IT",{minimumFractionDigits:0})}</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div style={{background:C.blue+"12",borderRadius:10,padding:"8px 12px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.blue,fontWeight:700}}>COSTO/CAPO</div>
                    <div style={{fontSize:18,fontWeight:800,color:C.blue}}>{s.costoPerCapo ? `€${s.costoPerCapo}` : "—"}</div>
                  </div>
                  <div style={{background:s.costoPerKg>5?C.red+"12":s.costoPerKg>3?C.yellow+"12":C.green+"12",borderRadius:10,padding:"8px 12px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:s.costoPerKg>5?C.red:s.costoPerKg>3?C.yellow:C.green,fontWeight:700}}>COSTO/KG CARC.</div>
                    <div style={{fontSize:18,fontWeight:800,color:s.costoPerKg>5?C.red:s.costoPerKg>3?C.yellow:C.green}}>{s.costoPerKg ? `€${s.costoPerKg}` : "—"}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:C.muted,background:C.bg,borderRadius:8,padding:"6px 10px"}}>
                  Costi specifici: €{s.costiSpecifici.toLocaleString("it-IT",{minimumFractionDigits:0})} + quota generali: €{s.quotaGenerali.toFixed(0)}
                </div>
              </Card>
            );
          })}
        </>}

        {tab==="registrazioni" && <>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <Btn label="+ Costo" onClick={onNuovoCosto} small icon="💶 " variant="primary"/>
            <Btn label="+ Capi" onClick={onNuovoCapi} small icon="🐄 " variant="outline"/>
            <Btn label="+ Kg prod." onClick={onNuovaProd} small icon="⚖️ " variant="outline"/>
          </div>

          {/* Lista costi */}
          <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"8px 0",textTransform:"uppercase",letterSpacing:1}}>
            Costi registrati ({filtraPerPeriodo(data.costi,dal,al).length})
          </div>
          {filtraPerPeriodo(data.costi,dal,al).sort((a,b)=>b.data_inizio.localeCompare(a.data_inizio)).map(c=>{
            const v = VOCI.find(x=>x.id===c.voce);
            return (
              <div key={c.id} style={{background:C.card,borderRadius:12,padding:"10px 14px",marginBottom:8,border:`1px solid ${C.border}`,borderLeft:`3px solid ${v?.color||C.muted}`}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{v?.icon} {c.descrizione}</div>
                    <div style={{fontSize:12,color:C.muted}}>{c.data_inizio}{c.data_fine?" → "+c.data_fine:""}</div>
                    <div style={{display:"flex",gap:6,marginTop:4}}>
                      <Badge label={v?.label||c.voce} color={v?.color||C.muted}/>
                      {c.specie && <Badge label={specieIcon(c.specie)+" "+specieLabel(c.specie)} color={specieColor(c.specie)}/>}
                      {!c.specie && <Badge label="🐾 Tutte specie" color={C.muted}/>}
                    </div>
                    {c.fornitore && <div style={{fontSize:11,color:C.muted,marginTop:4}}>📦 {c.fornitore}</div>}
                  </div>
                  <div style={{fontSize:20,fontWeight:900,color:C.accent}}>€{c.importo.toLocaleString("it-IT")}</div>
                </div>
              </div>
            );
          })}

          {/* Consistenza capi */}
          <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"16px 0 8px",textTransform:"uppercase",letterSpacing:1}}>Consistenza capi</div>
          {filtraPerPeriodo(data.capi,dal,al).map(c=>(
            <div key={c.id} style={{background:C.card,borderRadius:12,padding:"10px 14px",marginBottom:8,border:`1px solid ${C.border}`,borderLeft:`3px solid ${specieColor(c.specie)}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:600}}>{specieIcon(c.specie)} {specieLabel(c.specie)}</div>
                  <div style={{fontSize:12,color:C.muted}}>{c.data_inizio}{c.data_fine?" → "+c.data_fine:""}</div>
                </div>
                <div style={{fontSize:22,fontWeight:900,color:specieColor(c.specie)}}>{c.numero} <span style={{fontSize:13}}>capi</span></div>
              </div>
            </div>
          ))}

          {/* Produzioni kg */}
          <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"16px 0 8px",textTransform:"uppercase",letterSpacing:1}}>Produzioni kg carcassa</div>
          {filtraPerPeriodo(data.produzioni,dal,al).map(p=>(
            <div key={p.id} style={{background:C.card,borderRadius:12,padding:"10px 14px",marginBottom:8,border:`1px solid ${C.border}`,borderLeft:`3px solid ${specieColor(p.specie)}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:600}}>{specieIcon(p.specie)} {specieLabel(p.specie)}</div>
                  <div style={{fontSize:12,color:C.muted}}>{p.data_inizio}{p.data_fine?" → "+p.data_fine:""}</div>
                  {p.note && <div style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>{p.note}</div>}
                </div>
                <div style={{fontSize:22,fontWeight:900,color:C.accent}}>{p.kg_carcassa} <span style={{fontSize:13}}>kg</span></div>
              </div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState("dashboard");

  const addCosto = c => { setData(d=>({...d,costi:[...d.costi,{...c,id:d.nextId.costi}],nextId:{...d.nextId,costi:d.nextId.costi+1}})); setView("dashboard"); };
  const addCapi  = c => { setData(d=>({...d,capi:[...d.capi,{...c,id:d.nextId.capi}],nextId:{...d.nextId,capi:d.nextId.capi+1}})); setView("dashboard"); };
  const addProd  = p => { setData(d=>({...d,produzioni:[...d.produzioni,{...p,id:d.nextId.produzioni}],nextId:{...d.nextId,produzioni:d.nextId.produzioni+1}})); setView("dashboard"); };

  const wrap = ch => <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>{ch}</div>;

  if (view==="form_costo")  return wrap(<FormCosto     onSave={addCosto} onCancel={()=>setView("dashboard")}/>);
  if (view==="form_capi")   return wrap(<FormCapi      onSave={addCapi}  onCancel={()=>setView("dashboard")}/>);
  if (view==="form_prod")   return wrap(<FormProduzione onSave={addProd}  onCancel={()=>setView("dashboard")}/>);

  return wrap(
    <Dashboard data={data}
      onNuovoCosto={()=>setView("form_costo")}
      onNuovoCapi={()=>setView("form_capi")}
      onNuovaProd={()=>setView("form_prod")}
    />
  );
}
