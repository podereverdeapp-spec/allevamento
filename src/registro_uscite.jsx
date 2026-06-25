import { useState, useMemo } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  bovini:"#8B6914", suini:"#B5547A", ovini:"#4A7C59",
};

const MOTIVAZIONI = [
  { id:"macellazione",     label:"Macellazione",          icon:"🔪", color:C.red,     hasPesi:true  },
  { id:"cessione_macello", label:"Cessione a macello terzo",icon:"🚛", color:"#8B4513", hasPesi:true  },
  { id:"vendita",          label:"Vendita ad allevamento", icon:"🤝", color:C.blue,    hasPesi:false },
  { id:"morte",            label:"Morte in azienda",       icon:"💀", color:C.muted,   hasPesi:false },
  { id:"furto",            label:"Furto / Smarrimento",    icon:"❓", color:C.yellow,  hasPesi:false },
];

const specieColor = s => ({ bovino:C.bovini, suino:C.suini, ovino:C.ovini }[s] || C.muted);
const specieIcon  = s => ({ bovino:"🐄", suino:"🐷", ovino:"🐑" }[s] || "🐾");
const today = () => new Date().toISOString().split("T")[0];

// ─── DATI INIZIALI ────────────────────────────────────────────────────────────
const initialData = {
  animali: [
    { id:1, bdn:"IT034BN001", nome:"Ercole",  specie:"bovino", sesso:"M", razza:"Limousine",   nascita:"2021-04-10", stato:"attivo" },
    { id:2, bdn:"IT034BN002", nome:"Bella",   specie:"bovino", sesso:"F", razza:"Limousine",   nascita:"2021-07-20", stato:"attivo" },
    { id:3, bdn:"IT034BN003", nome:"Tornado", specie:"bovino", sesso:"M", razza:"Chianina",    nascita:"2020-11-05", stato:"attivo" },
    { id:4, bdn:"IT034SU001", nome:"Arturo",  specie:"suino",  sesso:"M", razza:"Large White", nascita:"2022-03-20", stato:"attivo" },
    { id:5, bdn:"IT034SU002", nome:"Peppa",   specie:"suino",  sesso:"F", razza:"Large White", nascita:"2022-07-10", stato:"attivo" },
    { id:6, bdn:"IT034OV001", nome:"Lana",    specie:"ovino",  sesso:"F", razza:"Sarda",       nascita:"2022-01-05", stato:"attivo" },
    // Già usciti (demo)
    { id:7, bdn:"IT034BN099", nome:"Bruno",   specie:"bovino", sesso:"M", razza:"Limousine",   nascita:"2020-03-01", stato:"uscito" },
    { id:8, bdn:"IT034SU099", nome:"Lardo",   specie:"suino",  sesso:"M", razza:"Duroc",       nascita:"2021-06-15", stato:"uscito" },
  ],
  uscite: [
    { id:1, animaleId:7, motivazione:"macellazione", data:"2024-03-15", peso_vivo:620, peso_carcassa:347, resa_percent:null, prezzo_kg:4.80, acquirente:"Macello Coop Roma",    note:"Ottima resa" },
    { id:2, animaleId:8, motivazione:"cessione_macello", data:"2024-05-20", peso_vivo:185, peso_carcassa:144, resa_percent:null, prezzo_kg:2.10, acquirente:"Salumificio Norcia", note:"" },
  ],
  nextId:{ uscite:3 },
};

// ─── CALCOLI ──────────────────────────────────────────────────────────────────
function calcolaResa(peso_vivo, peso_carcassa) {
  if (!peso_vivo || !peso_carcassa) return null;
  return +((peso_carcassa / peso_vivo) * 100).toFixed(1);
}
function valutazioneResa(resa, specie) {
  const benchmark = { bovino:{ottima:58,buona:54}, suino:{ottima:80,buona:76}, ovino:{ottima:50,buona:46} };
  const b = benchmark[specie] || benchmark.bovino;
  if (resa >= b.ottima) return { label:"Ottima", color:C.green };
  if (resa >= b.buona)  return { label:"Buona",  color:C.yellow };
  return                       { label:"Bassa",  color:C.red };
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

// ─── FORM REGISTRA USCITA ─────────────────────────────────────────────────────
function FormUscita({ animale, onSave, onCancel }) {
  const [form, setForm] = useState({
    animaleId: animale.id,
    motivazione: "macellazione",
    data: today(),
    peso_vivo: "",
    peso_carcassa: "",
    prezzo_kg: "",
    acquirente: "",
    note: "",
  });

  const motiv = MOTIVAZIONI.find(m => m.id === form.motivazione);
  const resa = calcolaResa(parseFloat(form.peso_vivo), parseFloat(form.peso_carcassa));
  const valut = resa ? valutazioneResa(resa, animale.specie) : null;
  const ricavoTotale = form.peso_carcassa && form.prezzo_kg
    ? (parseFloat(form.peso_carcassa) * parseFloat(form.prezzo_kg)).toFixed(2)
    : null;

  const salva = () => {
    if (!form.motivazione || !form.data) return;
    onSave({
      ...form,
      peso_vivo:     form.peso_vivo     ? parseFloat(form.peso_vivo)     : null,
      peso_carcassa: form.peso_carcassa ? parseFloat(form.peso_carcassa) : null,
      resa_percent:  resa,
      prezzo_kg:     form.prezzo_kg     ? parseFloat(form.prezzo_kg)     : null,
    });
  };

  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onCancel} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>←</button>
        <span style={{ fontSize:18, fontWeight:800, color:C.text }}>Registra Uscita</span>
      </div>

      {/* Header animale */}
      <Card style={{ borderLeft:`4px solid ${specieColor(animale.specie)}`, marginBottom:16 }}>
        <div style={{ fontWeight:700, fontSize:16 }}>{specieIcon(animale.specie)} {animale.nome}</div>
        <div style={{ fontSize:13, color:C.muted }}>{animale.bdn} · {animale.razza}</div>
      </Card>

      <Field label="Motivazione uscita" value={form.motivazione} onChange={v=>setForm(f=>({...f,motivazione:v}))}
        options={MOTIVAZIONI.map(m=>({value:m.id, label:m.icon+" "+m.label}))} required/>
      <Field label="Data uscita" value={form.data} onChange={v=>setForm(f=>({...f,data:v}))} type="date" required/>

      {/* Campi peso — solo per macellazione e cessione macello */}
      {motiv?.hasPesi && (
        <>
          <div style={{ fontSize:13, fontWeight:700, color:C.muted, margin:"4px 0 10px", textTransform:"uppercase", letterSpacing:0.8 }}>Dati di macellazione</div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}><Field label="Peso vivo (kg)" value={form.peso_vivo} onChange={v=>setForm(f=>({...f,peso_vivo:v}))} type="number"/></div>
            <div style={{ flex:1 }}><Field label="Peso carcassa (kg)" value={form.peso_carcassa} onChange={v=>setForm(f=>({...f,peso_carcassa:v}))} type="number"/></div>
          </div>

          {/* Calcolo resa in tempo reale */}
          {resa && valut && (
            <Card style={{ background:valut.color+"12", borderLeft:`4px solid ${valut.color}`, marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, color:C.muted, fontWeight:600 }}>RESA CARCASSA</div>
                  <div style={{ fontSize:11, color:C.muted }}>peso carcassa ÷ peso vivo × 100</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:36, fontWeight:900, color:valut.color, lineHeight:1 }}>{resa}%</div>
                  <Badge label={valut.label} color={valut.color}/>
                </div>
              </div>
              <div style={{ marginTop:8, fontSize:12, color:C.muted }}>
                Benchmark {animale.specie}: ottima ≥{animale.specie==="suino"?"80":animale.specie==="ovino"?"50":"58"}% · buona ≥{animale.specie==="suino"?"76":animale.specie==="ovino"?"46":"54"}%
              </div>
            </Card>
          )}

          <Field label="Prezzo di vendita (€/kg carcassa)" value={form.prezzo_kg} onChange={v=>setForm(f=>({...f,prezzo_kg:v}))} type="number"/>

          {ricavoTotale && (
            <Card style={{ background:C.green+"12", borderLeft:`4px solid ${C.green}`, marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:600, color:C.green }}>Ricavo totale stimato</span>
                <span style={{ fontSize:24, fontWeight:900, color:C.green }}>€{ricavoTotale}</span>
              </div>
              <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{form.peso_carcassa} kg × €{form.prezzo_kg}/kg</div>
            </Card>
          )}
        </>
      )}

      <Field label={form.motivazione==="vendita"?"Acquirente / Allevamento":form.motivazione==="macellazione"||form.motivazione==="cessione_macello"?"Macello / Destinatario":"Destinatario / Note"} value={form.acquirente} onChange={v=>setForm(f=>({...f,acquirente:v}))}/>
      <Field label="Note aggiuntive" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>

      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <Btn label="Registra uscita" onClick={salva} variant="danger" icon="📤 "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── SCHEDA ANIMALE CON USCITA ────────────────────────────────────────────────
function SchedaAnimale({ animale, data, onBack, onRegistraUscita }) {
  const uscita = data.uscite.find(u => u.animaleId === animale.id);
  const motiv  = uscita ? MOTIVAZIONI.find(m => m.id === uscita.motivazione) : null;
  const valut  = uscita?.resa_percent ? valutazioneResa(uscita.resa_percent, animale.specie) : null;

  return (
    <div style={{ padding:"16px 16px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22 }}>←</button>
        <span style={{ fontSize:18, fontWeight:800, color:C.text }}>Scheda Animale</span>
      </div>

      {/* Header */}
      <Card style={{ borderLeft:`5px solid ${specieColor(animale.specie)}`, background:`linear-gradient(135deg,${specieColor(animale.specie)}12,${C.card})` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:24, fontWeight:800 }}>{specieIcon(animale.specie)} {animale.nome}</div>
            <div style={{ fontSize:13, color:C.muted }}>{animale.bdn} · {animale.razza}</div>
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              <Badge label={animale.sesso==="M"?"♂ Maschio":"♀ Femmina"} color={animale.sesso==="M"?C.blue:"#B5547A"}/>
              <Badge label={`nato ${animale.nascita}`} color={C.muted}/>
            </div>
          </div>
          <Badge label={animale.stato==="attivo"?"● Attivo":"✓ Uscito"} color={animale.stato==="attivo"?C.green:C.muted}/>
        </div>
      </Card>

      {/* Uscita registrata */}
      {uscita && motiv ? (
        <>
          <Card style={{ borderLeft:`5px solid ${motiv.color}`, background:`linear-gradient(135deg,${motiv.color}10,${C.card})` }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
              {motiv.icon} Uscita registrata
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              <div style={{ background:C.bg, borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>MOTIVAZIONE</div>
                <div style={{ fontSize:15, fontWeight:700, color:motiv.color }}>{motiv.icon} {motiv.label}</div>
              </div>
              <div style={{ background:C.bg, borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>DATA USCITA</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.text }}>📅 {uscita.data}</div>
              </div>
            </div>

            {/* Dati macellazione */}
            {(uscita.peso_vivo || uscita.peso_carcassa) && (
              <>
                <div style={{ fontSize:13, fontWeight:700, color:C.muted, margin:"8px 0 10px", textTransform:"uppercase", letterSpacing:0.8 }}>Dati di macellazione</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
                  <div style={{ background:"#FFF", borderRadius:10, padding:"10px 12px", textAlign:"center", border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>PESO VIVO</div>
                    <div style={{ fontSize:20, fontWeight:800, color:C.text }}>{uscita.peso_vivo}</div>
                    <div style={{ fontSize:11, color:C.muted }}>kg</div>
                  </div>
                  <div style={{ background:"#FFF", borderRadius:10, padding:"10px 12px", textAlign:"center", border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>PESO CARCASSA</div>
                    <div style={{ fontSize:20, fontWeight:800, color:C.accent }}>{uscita.peso_carcassa}</div>
                    <div style={{ fontSize:11, color:C.muted }}>kg</div>
                  </div>
                  {uscita.resa_percent && valut && (
                    <div style={{ background:valut.color+"15", borderRadius:10, padding:"10px 12px", textAlign:"center", border:`1.5px solid ${valut.color}33` }}>
                      <div style={{ fontSize:10, color:valut.color, fontWeight:700 }}>RESA %</div>
                      <div style={{ fontSize:24, fontWeight:900, color:valut.color }}>{uscita.resa_percent}%</div>
                      <Badge label={valut.label} color={valut.color}/>
                    </div>
                  )}
                </div>

                {/* Barra visiva resa */}
                {uscita.resa_percent && (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:4 }}>
                      <span>0%</span>
                      <span style={{ fontWeight:600, color:valut?.color }}>Resa: {uscita.resa_percent}%</span>
                      <span>100%</span>
                    </div>
                    <div style={{ background:C.border, borderRadius:99, height:14, overflow:"hidden", position:"relative" }}>
                      <div style={{ width:`${uscita.resa_percent}%`, background:`linear-gradient(90deg,${valut?.color}88,${valut?.color})`, height:"100%", borderRadius:99, transition:"width 0.6s" }}/>
                    </div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:4, textAlign:"center" }}>
                      {uscita.peso_carcassa} kg carcassa su {uscita.peso_vivo} kg vivo
                    </div>
                  </div>
                )}

                {/* Ricavo */}
                {uscita.prezzo_kg && uscita.peso_carcassa && (
                  <div style={{ background:C.green+"12", borderRadius:12, padding:"12px 16px", border:`1.5px solid ${C.green}33` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.green }}>RICAVO MACELLAZIONE</div>
                        <div style={{ fontSize:12, color:C.muted }}>{uscita.peso_carcassa} kg × €{uscita.prezzo_kg}/kg</div>
                      </div>
                      <div style={{ fontSize:28, fontWeight:900, color:C.green }}>
                        €{(uscita.peso_carcassa * uscita.prezzo_kg).toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {uscita.acquirente && (
              <div style={{ fontSize:13, color:C.muted, marginTop:10 }}>📍 {uscita.acquirente}</div>
            )}
            {uscita.note && (
              <div style={{ fontSize:13, color:C.muted, fontStyle:"italic", marginTop:4 }}>💬 {uscita.note}</div>
            )}
          </Card>
        </>
      ) : (
        <Card style={{ borderLeft:`4px solid ${C.green}` }}>
          <div style={{ fontSize:14, color:C.green, fontWeight:600, marginBottom:8 }}>✅ Animale presente in azienda</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:14 }}>Nessuna uscita registrata. Registra l'uscita quando l'animale lascia l'azienda.</div>
          <Btn label="Registra uscita" onClick={onRegistraUscita} variant="danger" icon="📤 "/>
        </Card>
      )}
    </div>
  );
}

// ─── REGISTRO GENERALE USCITE ─────────────────────────────────────────────────
function RegistroUscite({ data, onSeleziona }) {
  const [filtroMotiv, setFiltroMotiv] = useState("tutti");
  const [filtroSpecie, setFiltroSpecie] = useState("tutti");

  const uscite = useMemo(() => {
    return [...data.uscite]
      .sort((a,b) => b.data.localeCompare(a.data))
      .filter(u => {
        const a = data.animali.find(x => x.id === u.animaleId);
        return (filtroMotiv==="tutti" || u.motivazione===filtroMotiv) &&
               (filtroSpecie==="tutti" || a?.specie===filtroSpecie);
      });
  }, [data, filtroMotiv, filtroSpecie]);

  // KPI
  const macellazioni = data.uscite.filter(u => u.motivazione==="macellazione"||u.motivazione==="cessione_macello");
  const resaMedia = macellazioni.filter(u=>u.resa_percent).length > 0
    ? (macellazioni.filter(u=>u.resa_percent).reduce((s,u)=>s+u.resa_percent,0) / macellazioni.filter(u=>u.resa_percent).length).toFixed(1)
    : null;
  const kgTotali = macellazioni.reduce((s,u)=>s+(u.peso_carcassa||0),0);
  const ricavoTotale = macellazioni.reduce((s,u)=>s+((u.peso_carcassa&&u.prezzo_kg)?u.peso_carcassa*u.prezzo_kg:0),0);

  return (
    <div style={{ paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:"0 0 28px 28px", padding:"28px 20px 24px", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#FFF" }}>📤 Registro Uscite</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginTop:4 }}>{data.uscite.length} movimenti registrati</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:16 }}>
          {[
            { label:"Resa media", value: resaMedia ? resaMedia+"%" : "—", color:"#FFD700" },
            { label:"Kg prodotti", value: kgTotali>0 ? kgTotali+"kg" : "—", color:"#FFF" },
            { label:"Ricavo totale", value: ricavoTotale>0 ? "€"+ricavoTotale.toFixed(0) : "—", color:"#ADFFB5" },
          ].map(k=>(
            <div key={k.label} style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"8px 10px", textAlign:"center" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>{k.label}</div>
              <div style={{ fontSize:17, fontWeight:800, color:k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"0 16px" }}>
        {/* Filtri */}
        <div style={{ display:"flex", gap:8, marginBottom:12, overflowX:"auto", paddingBottom:4 }}>
          <button onClick={()=>setFiltroMotiv("tutti")} style={{ background:filtroMotiv==="tutti"?C.primary:C.card, color:filtroMotiv==="tutti"?"#FFF":C.muted, border:`1.5px solid ${filtroMotiv==="tutti"?C.primary:C.border}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
            Tutte
          </button>
          {MOTIVAZIONI.map(m=>(
            <button key={m.id} onClick={()=>setFiltroMotiv(m.id)} style={{ background:filtroMotiv===m.id?m.color:C.card, color:filtroMotiv===m.id?"#FFF":C.muted, border:`1.5px solid ${filtroMotiv===m.id?m.color:C.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {m.icon} {m.label.split(" ")[0]}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
          {["tutti","bovino","suino","ovino"].map(s=>(
            <button key={s} onClick={()=>setFiltroSpecie(s)} style={{ background:filtroSpecie===s?C.blue:C.card, color:filtroSpecie===s?"#FFF":C.muted, border:`1.5px solid ${filtroSpecie===s?C.blue:C.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {s==="tutti"?"Tutte specie":specieIcon(s)+" "+s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>

        {uscite.length===0 && (
          <div style={{ textAlign:"center", color:C.muted, padding:40, fontSize:15 }}>Nessuna uscita registrata</div>
        )}

        {uscite.map(u => {
          const a     = data.animali.find(x=>x.id===u.animaleId);
          const motiv = MOTIVAZIONI.find(m=>m.id===u.motivazione);
          const valut = u.resa_percent ? valutazioneResa(u.resa_percent, a?.specie) : null;
          return (
            <div key={u.id} onClick={()=>a&&onSeleziona(a)} style={{ background:C.card, borderRadius:16, padding:16, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", border:`1px solid ${C.border}`, cursor:"pointer", borderLeft:`4px solid ${motiv?.color||C.muted}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:16 }}>{a ? specieIcon(a.specie)+" "+a.nome : "?"}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{a?.bdn} · {u.data}</div>
                  <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                    <Badge label={motiv?.icon+" "+motiv?.label} color={motiv?.color||C.muted}/>
                    {valut && <Badge label={"Resa "+u.resa_percent+"%"} color={valut.color}/>}
                  </div>
                  {u.acquirente && <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>📍 {u.acquirente}</div>}
                </div>
                <div style={{ textAlign:"right", minWidth:80 }}>
                  {u.peso_vivo && <div style={{ fontSize:13, color:C.muted }}>{u.peso_vivo} kg vivo</div>}
                  {u.peso_carcassa && <div style={{ fontSize:18, fontWeight:800, color:C.accent }}>{u.peso_carcassa} kg</div>}
                  {u.peso_carcassa && <div style={{ fontSize:11, color:C.muted }}>carcassa</div>}
                  {u.peso_carcassa && u.prezzo_kg && (
                    <div style={{ fontSize:14, fontWeight:700, color:C.green }}>€{(u.peso_carcassa*u.prezzo_kg).toFixed(0)}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LISTA ANIMALI IN AZIENDA ─────────────────────────────────────────────────
function ListaAnimali({ data, onSeleziona, onRegistraUscita }) {
  const [vista, setVista] = useState("attivi"); // attivi | usciti | tutti

  const animali = data.animali.filter(a =>
    vista==="tutti" || (vista==="attivi" && a.stato==="attivo") || (vista==="usciti" && a.stato==="uscito")
  );

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:"0 0 28px 28px", padding:"28px 20px 24px", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#FFF" }}>📋 Movimenti Animali</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginTop:4 }}>
          {data.animali.filter(a=>a.stato==="attivo").length} in azienda · {data.animali.filter(a=>a.stato==="uscito").length} usciti
        </div>
      </div>
      <div style={{ padding:"0 16px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[["attivi","✅ In azienda",C.green],["usciti","📤 Usciti",C.muted],["tutti","Tutti",C.primary]].map(([id,label,col])=>(
            <button key={id} onClick={()=>setVista(id)} style={{ flex:1, background:vista===id?col:C.card, color:vista===id?"#FFF":C.muted, border:`1.5px solid ${vista===id?col:C.border}`, borderRadius:20, padding:"7px 0", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {animali.map(a => {
          const uscita = data.uscite.find(u=>u.animaleId===a.id);
          const motiv  = uscita ? MOTIVAZIONI.find(m=>m.id===uscita.motivazione) : null;
          return (
            <div key={a.id} style={{ background:C.card, borderRadius:16, padding:16, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", border:`1px solid ${C.border}`, borderLeft:`4px solid ${specieColor(a.specie)}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div onClick={()=>onSeleziona(a)} style={{ cursor:"pointer", flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:16 }}>{specieIcon(a.specie)} {a.nome}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{a.bdn} · {a.razza}</div>
                  <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                    <Badge label={a.stato==="attivo"?"● Attivo":"✓ Uscito"} color={a.stato==="attivo"?C.green:C.muted}/>
                    {uscita && motiv && <Badge label={motiv.icon+" "+uscita.data} color={motiv.color}/>}
                    {uscita?.resa_percent && <Badge label={"Resa "+uscita.resa_percent+"%"} color={valutazioneResa(uscita.resa_percent,a.specie).color}/>}
                  </div>
                </div>
                {a.stato==="attivo" && (
                  <Btn label="Uscita" onClick={()=>onRegistraUscita(a)} variant="danger" small icon="📤 "/>
                )}
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
  const [data, setData]     = useState(initialData);
  const [view, setView]     = useState("lista");   // lista | scheda | form_uscita | registro
  const [selected, setSelected] = useState(null);
  const [subTab, setSubTab] = useState("animali"); // animali | registro

  const registraUscita = (uscita) => {
    setData(d => ({
      ...d,
      animali: d.animali.map(a => a.id===uscita.animaleId ? {...a, stato:"uscito"} : a),
      uscite:  [...d.uscite, {...uscita, id:d.nextId.uscite}],
      nextId:  {...d.nextId, uscite:d.nextId.uscite+1},
    }));
    setView("scheda");
  };

  const wrap = ch => (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:C.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto" }}>
      {ch}
    </div>
  );

  if (view==="form_uscita" && selected) return wrap(
    <FormUscita animale={selected} onSave={registraUscita} onCancel={()=>setView("scheda")}/>
  );
  if (view==="scheda" && selected) return wrap(
    <SchedaAnimale animale={selected} data={data} onBack={()=>setView("lista")} onRegistraUscita={()=>setView("form_uscita")}/>
  );

  return wrap(
    <div style={{ paddingBottom:80 }}>
      {/* Sub-tab interno */}
      <div style={{ display:"flex", background:"#FFF", borderBottom:`1.5px solid ${C.border}` }}>
        {[["animali","📋 Animali"],["registro","📤 Registro uscite"]].map(([id,label])=>(
          <button key={id} onClick={()=>setSubTab(id)} style={{ flex:1, padding:"14px 0", background:"none", border:"none", borderBottom:`3px solid ${subTab===id?C.primary:"transparent"}`, fontWeight:subTab===id?700:500, fontSize:14, color:subTab===id?C.primary:C.muted, cursor:"pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {subTab==="animali" && (
        <ListaAnimali data={data} onSeleziona={a=>{setSelected(a);setView("scheda");}} onRegistraUscita={a=>{setSelected(a);setView("form_uscita");}}/>
      )}
      {subTab==="registro" && (
        <RegistroUscite data={data} onSeleziona={a=>{setSelected(a);setView("scheda");}}/>
      )}
    </div>
  );
}
