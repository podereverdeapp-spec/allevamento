import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { supabase } from "./supabase";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  suini:"#B5547A", morto:"#888888",
};
const today = () => new Date().toISOString().split("T")[0];

// Mappa razza → lettera per codice lotto
const RAZZA_LETTERA = {
  "Nero Apucalabro":"A","Cinta Senese":"C","Duroc":"D",
  "Mora Romagnola":"G","Large White":"L","Meticcia":"M","Meticcio":"M",
  "Nero Casertano":"N","Landrace":"R","Altra":"0",
};
const getRazzaLettera = r => {
  if(!r) return "0";
  const match = Object.keys(RAZZA_LETTERA).find(k=>k.toLowerCase()===r.trim().toLowerCase());
  return match ? RAZZA_LETTERA[match] : "0";
};
const generaCodLotto = (dataParto, razzaMadre, razzaPadre, bdnMadre) => {
  if(!dataParto) return "";
  const d = new Date(dataParto);
  const aa = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const lM = getRazzaLettera(razzaMadre);
  const lP = getRazzaLettera(razzaPadre);
  const ultime2 = (bdnMadre||"").replace(/[^0-9]/g,"").slice(-2).padStart(2,"0");
  return `${aa}${mm}${lM}${lP}${ultime2}`;
};
const codiceUnitá = (codLotto, nr) => `${codLotto}${String(nr).padStart(2,"0")}`;

// ─── UI BASE ──────────────────────────────────────────────────────────────────
const inputStyle = {width:"100%",boxSizing:"border-box",border:`1.5px solid ${C.border}`,
  borderRadius:10,padding:"10px 12px",fontSize:15,background:"#FAFAF8",color:C.text,outline:"none"};
const Card = ({children,style={}}) => (
  <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,
    boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:`1px solid ${C.border}`,...style}}>
    {children}
  </div>
);
const Badge = ({label,color}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,
    borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{label}</span>
);
const Btn = ({label,onClick,variant="primary",small=false,icon,disabled=false,full=false}) => {
  const bg = {primary:C.primary,danger:C.red,success:C.green,
    ghost:"transparent",outline:"transparent",yellow:C.yellow}[variant]||C.primary;
  const fg = variant==="ghost"||variant==="outline"?C.text:"#FFF";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,
        background:bg,color:fg,
        border:variant==="outline"?`1.5px solid ${C.primary}`:"none",
        borderRadius:10,padding:small?"6px 12px":"10px 18px",
        fontSize:small?13:15,fontWeight:600,cursor:disabled?"default":"pointer",
        width:full?"100%":"auto",opacity:disabled?0.5:1}}>
      {icon&&<span>{icon}</span>}{label}
    </button>
  );
};
const Field = ({label,value,onChange,type="text",options,required,placeholder}) => (
  <div style={{marginBottom:12}}>
    <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>
      {label}{required&&<span style={{color:C.red}}> *</span>}
    </div>
    {options
      ?<select value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}>
         <option value="">— seleziona —</option>
         {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
       </select>
      :<input type={type} value={value??""} placeholder={placeholder||""}
         onChange={e=>onChange(e.target.value)} style={inputStyle}/>
    }
  </div>
);
const Spinner = () => (
  <div style={{textAlign:"center",padding:60,color:C.muted}}>
    <div style={{fontSize:36,marginBottom:12}}>⏳</div><div>Caricamento lotti...</div>
  </div>
);
const statColor = s => ({attivo:C.green,macellato:C.muted,deceduto:C.red,venduto:C.blue,disperso:C.yellow}[s]||C.muted);
const statLabel = s => ({attivo:"Vivo",macellato:"Macellato",deceduto:"Deceduto",venduto:"Venduto",disperso:"Disperso"}[s]||s);
const destColor = d => ({ingrasso:C.yellow,riproduzione:C.blue,macello:C.muted}[d]||C.muted);

// ─── FORM USCITA UNITÀ ────────────────────────────────────────────────────────
function FormUscitaUnita({unita, lotto, onSave, onCancel}) {
  const [form,setForm] = useState({
    stato:"macellato",
    motivo_uscita:"Macellato",
    data_uscita:today(),
    peso_vivo_uscita:"",
    peso_carcassa:"",
  });
  const [saving,setSaving] = useState(false);
  const resa = form.peso_carcassa&&form.peso_vivo_uscita
    ? Math.round(parseFloat(form.peso_carcassa)/parseFloat(form.peso_vivo_uscita)*1000)/10
    : null;

  const salva = async () => {
    setSaving(true);
    const payload = {
      stato: form.stato,
      vivo: false,
      motivo_uscita: form.motivo_uscita||null,
      data_uscita: form.data_uscita||null,
      peso_vivo_uscita: form.peso_vivo_uscita?parseFloat(form.peso_vivo_uscita):null,
      peso_carcassa: form.peso_carcassa?parseFloat(form.peso_carcassa):null,
      resa_percent: resa,
    };
    await supabase.from("suini_lotto").update(payload).eq("id",unita.id);
    setSaving(false);
    onSave();
  };

  return (
    <div style={{background:C.bg,borderRadius:16,padding:16,marginBottom:12,
      border:`2px solid ${C.red}`}}>
      <div style={{fontWeight:700,color:C.red,marginBottom:12}}>
        📤 Registra uscita — {unita.codice_completo||`${lotto.codice_lotto}${String(unita.nr).padStart(2,"0")}`}
      </div>
      <Field label="Motivo uscita" value={form.motivo_uscita}
        onChange={v=>setForm(f=>({...f,motivo_uscita:v,
          stato:v==="Macellato"?"macellato":v==="Deceduto"?"deceduto":
                v==="Venduto"?"venduto":v==="Disperso"?"disperso":"macellato"}))}
        options={["Macellato","Deceduto (malattia)","Deceduto (trauma)","Venduto vivo","Disperso","Altro"]}/>
      <Field label="Data uscita" value={form.data_uscita}
        onChange={v=>setForm(f=>({...f,data_uscita:v}))} type="date"/>
      {form.motivo_uscita==="Macellato"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Peso vivo (kg)" value={form.peso_vivo_uscita}
            onChange={v=>setForm(f=>({...f,peso_vivo_uscita:v}))} type="number"/>
          <Field label="Peso carcassa (kg)" value={form.peso_carcassa}
            onChange={v=>setForm(f=>({...f,peso_carcassa:v}))} type="number"/>
        </div>
        {resa&&<div style={{background:C.green+"15",borderRadius:8,padding:"6px 12px",
          fontSize:13,marginBottom:8}}>⚖️ Resa: <strong style={{color:C.green}}>{resa}%</strong></div>}
      </>}
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <Btn label={saving?"...":"Conferma uscita"} onClick={salva} variant="danger" disabled={saving}/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── CARD SINGOLA UNITÀ ───────────────────────────────────────────────────────
function CardUnita({u, lotto, onUpdate, onUscita}) {
  const [edit,setEdit] = useState(false);
  const [form,setForm] = useState({
    sesso:u.sesso||"",
    destinazione:u.destinazione||"ingrasso",
    matricola:u.matricola||u.bdn||"",
  });
  const [saving,setSaving] = useState(false);
  const codice = u.codice_completo || `${lotto.codice_lotto}${String(u.nr).padStart(2,"0")}`;
  const vivo = u.vivo!==false && u.stato==="attivo";

  const salva = async () => {
    setSaving(true);
    const isRiproduttore = form.destinazione==="riproduzione";
    await supabase.from("suini_lotto").update({
      sesso: form.sesso||null,
      destinazione: form.destinazione,
      matricola: form.matricola||null,
      bdn: form.matricola||u.bdn||null,
      stato: isRiproduttore?"riproduttore":u.stato,
    }).eq("id",u.id);
    setSaving(false);
    setEdit(false);
    onUpdate();
  };

  return (
    <div style={{background:vivo?C.card:"#F5F5F5",borderRadius:12,padding:12,
      marginBottom:8,border:`1.5px solid ${vivo?C.border:"#DDD"}`,
      borderLeft:`4px solid ${statColor(u.stato)}`,opacity:vivo?1:0.75}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontFamily:"monospace",fontSize:16,fontWeight:800,
            color:vivo?C.primary:C.muted,letterSpacing:1}}>{codice}</div>
          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
            <Badge label={statLabel(u.stato)} color={statColor(u.stato)}/>
            {u.sesso&&<Badge label={u.sesso==="M"?"♂ Maschio":"♀ Femmina"}
              color={u.sesso==="M"?C.blue:C.suini}/>}
            {u.destinazione&&u.destinazione!=="ingrasso"&&
              <Badge label={u.destinazione} color={destColor(u.destinazione)}/>}
            {u.matricola&&<Badge label={"🏷 "+u.matricola} color={C.green}/>}
          </div>
          {u.data_uscita&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>
            Uscito: {u.data_uscita}
            {u.peso_vivo_uscita&&` · ${u.peso_vivo_uscita}kg vivo`}
            {u.peso_carcassa&&` · ${u.peso_carcassa}kg carcassa`}
            {u.resa_percent&&<strong style={{color:C.green}}> · resa {u.resa_percent}%</strong>}
          </div>}
        </div>
        {vivo&&!edit&&(
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button onClick={()=>setEdit(true)}
              style={{background:C.blue+"20",border:"none",borderRadius:8,
                padding:"5px 8px",cursor:"pointer",fontSize:12}}>✏️</button>
            <button onClick={()=>onUscita(u)}
              style={{background:C.red+"20",border:"none",borderRadius:8,
                padding:"5px 8px",cursor:"pointer",fontSize:12}}>📤</button>
          </div>
        )}
      </div>
      {edit&&(
        <div style={{marginTop:10,padding:"10px",background:C.bg,borderRadius:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Field label="Sesso" value={form.sesso}
              onChange={v=>setForm(f=>({...f,sesso:v}))}
              options={["M","F"]}/>
            <Field label="Destinazione" value={form.destinazione}
              onChange={v=>setForm(f=>({...f,destinazione:v}))}
              options={[{value:"ingrasso",label:"Ingrasso"},{value:"riproduzione",label:"Riproduzione"},{value:"macello",label:"Macello"}]}/>
          </div>
          {(form.destinazione==="riproduzione"||(u.matricola))&&
            <Field label="Matricola individuale" value={form.matricola}
              onChange={v=>setForm(f=>({...f,matricola:v}))}
              placeholder="Solo per riproduttori o razze pregiate"/>}
          <div style={{display:"flex",gap:8}}>
            <Btn label={saving?"...":"Salva"} onClick={salva} variant="success" small disabled={saving}/>
            <Btn label="Annulla" onClick={()=>setEdit(false)} variant="ghost" small/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCHEDA LOTTO ─────────────────────────────────────────────────────────────
function SchedaLotto({lotto, suini, animali, onBack, onUpdate}) {
  const [cerca,setCerca] = useState("");
  const [unitaUscita,setUnitaUscita] = useState(null);

  const unita = useMemo(()=>
    suini.filter(s=>s.lotto_id===lotto.id)
      .sort((a,b)=>a.nr-b.nr)
  ,[suini,lotto.id]);

  const unitaFiltrate = useMemo(()=>{
    if(!cerca.trim()) return unita;
    const q=cerca.trim().toLowerCase();
    return unita.filter(u=>{
      const cod=(u.codice_completo||`${lotto.codice_lotto}${String(u.nr).padStart(2,"0")}`).toLowerCase();
      return cod.includes(q)||(u.matricola||"").toLowerCase().includes(q);
    });
  },[unita,cerca,lotto.codice_lotto]);

  const madre = animali.find(a=>a.id===lotto.madre_id);
  const padre = animali.find(a=>a.id===lotto.padre_id);

  // Statistiche
  const totVivi     = unita.filter(u=>u.vivo!==false&&u.stato==="attivo").length;
  const totMacellati= unita.filter(u=>u.stato==="macellato").length;
  const totDeceduti = unita.filter(u=>u.stato==="deceduto").length;
  const totRiprod   = unita.filter(u=>u.destinazione==="riproduzione").length;
  const totM        = unita.filter(u=>u.sesso==="M").length;
  const totF        = unita.filter(u=>u.sesso==="F").length;

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.suini},${C.primary})`,
        padding:"20px 16px 24px",borderRadius:"0 0 24px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",
            border:"none",borderRadius:10,padding:"6px 10px",color:"#FFF",
            cursor:"pointer",fontSize:18}}>←</button>
          <div>
            <div style={{fontSize:22,fontWeight:900,color:"#FFF",
              fontFamily:"monospace",letterSpacing:2}}>{lotto.codice_lotto}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>
              Parto {lotto.data_parto}
            </div>
          </div>
        </div>
        {(madre||padre)&&(
          <div style={{fontSize:13,color:"rgba(255,255,255,0.85)"}}>
            {madre&&`♀ ${madre.nome||madre.bdn}`}
            {madre&&padre&&" · "}
            {padre&&`♂ ${padre.nome||padre.bdn}`}
          </div>
        )}
      </div>

      <div style={{padding:"16px"}}>
        {/* Statistiche */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
          {[
            {label:"Vivi",val:totVivi,col:C.green},
            {label:"Macellati",val:totMacellati,col:C.muted},
            {label:"Deceduti",val:totDeceduti,col:C.red},
            {label:"Riproduttori",val:totRiprod,col:C.blue},
            {label:"Maschi",val:totM,col:C.blue},
            {label:"Femmine",val:totF,col:C.suini},
          ].map(s=>(
            <div key={s.label} style={{background:C.card,borderRadius:12,
              padding:"10px 8px",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:20,fontWeight:800,color:s.col}}>{s.val}</div>
              <div style={{fontSize:10,color:C.muted,fontWeight:600}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ricerca per tatuaggio */}
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
            fontSize:18,color:C.muted,pointerEvents:"none"}}>🔍</span>
          <input type="text" value={cerca} onChange={e=>setCerca(e.target.value)}
            placeholder="Cerca per tatuaggio (es. 2304CC1901) o matricola..."
            style={{...inputStyle,border:`2px solid ${cerca?C.primary:C.border}`,
              borderRadius:12,padding:"11px 40px 11px 42px"}}/>
          {cerca&&<button onClick={()=>setCerca("")}
            style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.muted}}>✕</button>}
        </div>

        {/* Gestione uscita */}
        {unitaUscita&&(
          <FormUscitaUnita unita={unitaUscita} lotto={lotto}
            onSave={()=>{setUnitaUscita(null);onUpdate();}}
            onCancel={()=>setUnitaUscita(null)}/>
        )}

        {/* Lista unità */}
        <div style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:8}}>
          UNITÀ DEL LOTTO ({unitaFiltrate.length}/{unita.length})
        </div>
        {unitaFiltrate.map(u=>(
          <CardUnita key={u.id} u={u} lotto={lotto}
            onUpdate={onUpdate} onUscita={setUnitaUscita}/>
        ))}
      </div>
    </div>
  );
}

// ─── EXPORT EXCEL ─────────────────────────────────────────────────────────────
function esportaExcel(lotti, suini, animali) {
  const wb = XLSX.utils.book_new();

  // Foglio riepilogo lotti
  const righeRiep = lotti.map(l=>{
    const us = suini.filter(s=>s.lotto_id===l.id);
    const madre = animali.find(a=>a.id===l.madre_id);
    const padre = animali.find(a=>a.id===l.padre_id);
    return {
      "Codice Lotto": l.codice_lotto||l.codice,
      "Data Parto": l.data_parto,
      "Madre BDN": madre?.bdn||"",
      "Madre Nome": madre?.nome||"",
      "Razza Madre": l.razza_madre||madre?.razza||"",
      "Padre BDN": padre?.bdn||"",
      "Razza Padre": l.razza_padre||padre?.razza||"",
      "Nati Totali": l.nati_totali||us.length,
      "Nati Vivi": l.nati_vivi||us.filter(u=>u.vivo!==false).length,
      "Nati Morti": l.nati_morti||0,
      "Vivi Attuali": us.filter(u=>u.vivo!==false&&u.stato==="attivo").length,
      "Macellati": us.filter(u=>u.stato==="macellato").length,
      "Deceduti": us.filter(u=>u.stato==="deceduto").length,
      "Riproduttori": us.filter(u=>u.destinazione==="riproduzione").length,
      "Maschi": us.filter(u=>u.sesso==="M").length,
      "Femmine": us.filter(u=>u.sesso==="F").length,
    };
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(righeRiep), "Riepilogo Lotti");

  // Foglio dettaglio unità
  const righeUnita = suini.map(u=>{
    const lotto = lotti.find(l=>l.id===u.lotto_id);
    const codice = u.codice_completo||`${lotto?.codice_lotto||""}${String(u.nr).padStart(2,"0")}`;
    return {
      "Tatuaggio": codice,
      "Codice Lotto": lotto?.codice_lotto||lotto?.codice||"",
      "Nr. Unità": u.nr,
      "Sesso": u.sesso||"",
      "Destinazione": u.destinazione||"ingrasso",
      "Stato": u.stato||"",
      "Matricola": u.matricola||u.bdn||"",
      "Peso Nascita (kg)": u.peso_nascita||"",
      "Data Uscita": u.data_uscita||"",
      "Motivo Uscita": u.motivo_uscita||"",
      "Peso Vivo Uscita (kg)": u.peso_vivo_uscita||"",
      "Peso Carcassa (kg)": u.peso_carcassa||"",
      "Resa %": u.resa_percent||"",
    };
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(righeUnita), "Dettaglio Unità");

  XLSX.writeFile(wb, `Lotti_Suini_${today()}.xlsx`);
}

// ─── LISTA LOTTI ──────────────────────────────────────────────────────────────
function ListaLotti({lotti, suini, animali, onSeleziona, onNuovo}) {
  const [cerca,setCerca] = useState("");

  const lottiFiltrati = useMemo(()=>{
    if(!cerca.trim()) return lotti;
    const q=cerca.trim().toLowerCase();
    return lotti.filter(l=>{
      const cod=(l.codice_lotto||l.codice||"").toLowerCase();
      if(cod.includes(q)) return true;
      // Cerca anche per tatuaggio unità
      return suini.some(u=>{
        const codU=(u.codice_completo||`${l.codice_lotto}${String(u.nr).padStart(2,"0")}`).toLowerCase();
        return u.lotto_id===l.id&&codU.includes(q);
      });
    });
  },[lotti,suini,cerca]);

  const totViviGlobal = suini.filter(u=>u.vivo!==false&&u.stato==="attivo").length;

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.suini},${C.primary})`,
        borderRadius:"0 0 28px 28px",padding:"24px 20px 20px",marginBottom:0}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>🐷 Lotti Suini</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",marginTop:4}}>
          {lotti.length} lotti · <strong style={{color:"#FFF"}}>{totViviGlobal} suini vivi</strong> in totale
        </div>
      </div>

      <div style={{padding:"16px"}}>
        {/* Barra ricerca */}
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:12,top:"50%",
            transform:"translateY(-50%)",fontSize:18,color:C.muted,pointerEvents:"none"}}>🔍</span>
          <input type="text" value={cerca} onChange={e=>setCerca(e.target.value)}
            placeholder="Cerca lotto (es. 2304CC19) o tatuaggio unità (es. 2304CC1901)..."
            style={{...inputStyle,border:`2px solid ${cerca?C.suini:C.border}`,
              borderRadius:12,padding:"11px 40px 11px 42px"}}/>
          {cerca&&<button onClick={()=>setCerca("")}
            style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.muted}}>✕</button>}
        </div>

        {/* Azioni */}
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          <Btn label="+ Nuovo parto" onClick={onNuovo} variant="primary" icon="🐣"/>
          <Btn label="📊 Export Excel" onClick={()=>esportaExcel(lotti,suini,animali)} variant="outline" small/>
        </div>

        {/* Lista lotti */}
        {lottiFiltrati.length===0?(
          <div style={{textAlign:"center",padding:48,color:C.muted}}>
            <div style={{fontSize:48,marginBottom:12}}>🐷</div>
            <div style={{fontWeight:700,fontSize:16}}>
              {cerca?"Nessun lotto trovato":"Nessun lotto registrato"}
            </div>
            <div style={{fontSize:14,marginTop:8}}>
              {cerca?"Prova con un codice diverso":"Registra il primo parto"}
            </div>
          </div>
        ):lottiFiltrati.map(l=>{
          const us = suini.filter(s=>s.lotto_id===l.id);
          const vivi     = us.filter(u=>u.vivo!==false&&u.stato==="attivo").length;
          const macellati= us.filter(u=>u.stato==="macellato").length;
          const deceduti = us.filter(u=>u.stato==="deceduto").length;
          const riprod   = us.filter(u=>u.destinazione==="riproduzione").length;
          const pct = us.length>0?Math.round(vivi/us.length*100):0;
          const madre = animali.find(a=>a.id===l.madre_id);
          const padre = animali.find(a=>a.id===l.padre_id);
          return (
            <div key={l.id} onClick={()=>onSeleziona(l)}
              style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,
                boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:`1px solid ${C.border}`,
                borderLeft:`5px solid ${C.suini}`,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:22,fontWeight:900,color:C.suini,
                    fontFamily:"monospace",letterSpacing:2}}>
                    {l.codice_lotto||l.codice}
                  </div>
                  <div style={{fontSize:13,color:C.muted}}>Parto {l.data_parto}</div>
                  {(madre||padre)&&(
                    <div style={{fontSize:12,color:C.muted,marginTop:2}}>
                      {madre&&`♀ ${madre.nome||madre.bdn}`}
                      {madre&&padre&&" · "}
                      {padre&&`♂ ${padre.nome||padre.bdn}`}
                    </div>
                  )}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:28,fontWeight:900,color:C.green}}>{vivi}</div>
                  <div style={{fontSize:11,color:C.muted}}>vivi / {us.length}</div>
                </div>
              </div>
              {/* Barra progresso */}
              {us.length>0&&(
                <div style={{background:C.border,borderRadius:6,height:6,marginBottom:8,overflow:"hidden"}}>
                  <div style={{background:C.green,width:`${pct}%`,height:"100%",borderRadius:6}}/>
                </div>
              )}
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Badge label={`${vivi} vivi`} color={C.green}/>
                {macellati>0&&<Badge label={`${macellati} macellati`} color={C.muted}/>}
                {deceduti>0&&<Badge label={`${deceduti} deceduti`} color={C.red}/>}
                {riprod>0&&<Badge label={`${riprod} riproduttori`} color={C.blue}/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FORM NUOVO PARTO ─────────────────────────────────────────────────────────
function FormNuovoParto({animali, onSave, onCancel}) {
  const [form,setForm] = useState({
    madre_id:"",padre_id:"",
    data_parto:today(),data_accoppiamento:"",
    nati_totali:"",nati_morti:"0",
    tipo_parto:"Naturale",note:"",
  });
  const [saving,setSaving] = useState(false);

  const scrofe = animali.filter(a=>a.sesso==="F"&&a.specie==="suino"&&a.stato==="attivo");
  const verri  = animali.filter(a=>a.sesso==="M"&&a.specie==="suino");

  const madre  = form.madre_id?animali.find(a=>a.id===parseInt(form.madre_id)):null;
  const padre  = form.padre_id?animali.find(a=>a.id===parseInt(form.padre_id)):null;
  const vivi   = Math.max(0,(parseInt(form.nati_totali)||0)-(parseInt(form.nati_morti)||0));
  const codice = generaCodLotto(
    form.data_parto,
    madre?.razza_calcolata||madre?.razza,
    padre?.razza_calcolata||padre?.razza,
    madre?.bdn
  );

  const dataPrevista = form.data_accoppiamento?(()=>{
    const d=new Date(form.data_accoppiamento);
    d.setMonth(d.getMonth()+3);
    d.setDate(d.getDate()+24);
    return d.toISOString().split("T")[0];
  })():"";

  const salva = async () => {
    if(!form.madre_id||!form.data_parto||!form.nati_totali) return;
    setSaving(true);

    // 1. Crea lotto
    const {data:nuovoLotto,error} = await supabase.from("lotti_suini").insert([{
      codice: codice,
      codice_lotto: codice,
      anno: new Date(form.data_parto).getFullYear(),
      data_parto: form.data_parto,
      madre_id: parseInt(form.madre_id),
      padre_id: form.padre_id?parseInt(form.padre_id):null,
      razza_madre: madre?.razza_calcolata||madre?.razza||null,
      razza_padre: padre?.razza_calcolata||padre?.razza||null,
      nati_totali: parseInt(form.nati_totali)||0,
      nati_vivi: vivi,
      nati_morti: parseInt(form.nati_morti)||0,
      note: form.note||null,
      specie: "suino",
    }]).select().single();

    if(!error&&nuovoLotto&&vivi>0) {
      // 2. Crea unità per ogni nato vivo
      const unita = Array.from({length:vivi},(_,i)=>({
        lotto_id: nuovoLotto.id,
        nr: i+1,
        codice_completo: codiceUnitá(codice, i+1),
        vivo: true,
        stato: "attivo",
        destinazione: "ingrasso",
      }));
      await supabase.from("suini_lotto").insert(unita);

      // 3. Crea anche evento riproduttivo
      await supabase.from("eventi_riproduttivi").insert([{
        animale_id: parseInt(form.madre_id),
        tipo_evento: "parto",
        data_evento: form.data_parto,
        tipo_parto: form.tipo_parto||null,
        nati_vivi: vivi,
        nati_morti: parseInt(form.nati_morti)||0,
        padre_id: form.padre_id?parseInt(form.padre_id):null,
        data_accoppiamento: form.data_accoppiamento||null,
        note: `Lotto ${codice}`,
      }]);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto",padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:18,fontWeight:800}}>🐣 Nuovo parto suini</span>
      </div>

      {/* Anteprima codice lotto */}
      {codice&&(
        <div style={{background:C.suini+"12",border:`2px solid ${C.suini}`,
          borderRadius:14,padding:"12px 16px",marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:700,color:C.suini,marginBottom:4}}>
            🏷️ CODICE LOTTO — TATUAGGIO BASE
          </div>
          <div style={{fontSize:32,fontWeight:900,color:C.suini,
            fontFamily:"monospace",letterSpacing:3}}>{codice}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>
            Unità: {codice}01 · {codice}02 · ... · {codice}{String(vivi||1).padStart(2,"0")}
          </div>
        </div>
      )}

      <Field label="Madre (scrofa) *" value={form.madre_id}
        onChange={v=>setForm(f=>({...f,madre_id:v}))}
        options={scrofe.map(a=>({value:a.id,label:`${a.nome||a.bdn} · ${a.razza||"—"}`}))} required/>
      <Field label="Padre (verro)" value={form.padre_id}
        onChange={v=>setForm(f=>({...f,padre_id:v}))}
        options={verri.map(a=>({value:a.id,label:`${a.nome||a.bdn} · ${a.razza||"—"}`}))}/>
      <Field label="Data parto *" value={form.data_parto}
        onChange={v=>setForm(f=>({...f,data_parto:v}))} type="date" required/>
      <Field label="Tipo parto" value={form.tipo_parto}
        onChange={v=>setForm(f=>({...f,tipo_parto:v}))}
        options={["Naturale","Assistito"]}/>

      {/* Accoppiamento */}
      <div style={{background:C.yellow+"10",border:`1px solid ${C.yellow}33`,
        borderRadius:12,padding:"12px 14px",marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:700,color:C.yellow,marginBottom:8}}>
          🐷 Accoppiamento (facoltativo)
        </div>
        <Field label="Data accoppiamento" value={form.data_accoppiamento}
          onChange={v=>setForm(f=>({...f,data_accoppiamento:v}))} type="date"/>
        {dataPrevista&&(
          <div style={{fontSize:12,color:C.muted}}>
            📅 Data prevista parto: <strong style={{color:C.primary}}>{dataPrevista}</strong>
            <span style={{fontSize:11}}> (3 mesi + 3 sett. + 3 giorni)</span>
          </div>
        )}
      </div>

      {/* Nati */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Field label="Nati totali *" value={form.nati_totali}
          onChange={v=>setForm(f=>({...f,nati_totali:v}))} type="number" required/>
        <Field label="Nati morti" value={form.nati_morti}
          onChange={v=>setForm(f=>({...f,nati_morti:v}))} type="number"/>
      </div>

      {(form.nati_totali)&&(
        <div style={{background:C.green+"12",border:`1px solid ${C.green}33`,
          borderRadius:10,padding:"8px 14px",marginBottom:12,display:"flex",gap:16,fontSize:13}}>
          <span>🟢 Vivi: <strong style={{color:C.green}}>{vivi}</strong></span>
          <span>🔴 Morti: <strong style={{color:C.red}}>{parseInt(form.nati_morti)||0}</strong></span>
          {codice&&<span>🏷️ Unità: {codice}01…{codice}{String(vivi).padStart(2,"0")}</span>}
        </div>
      )}

      <Field label="Note" value={form.note}
        onChange={v=>setForm(f=>({...f,note:v}))} placeholder="Osservazioni sul parto..."/>

      <div style={{display:"flex",gap:10,marginTop:8}}>
        <Btn label={saving?"Salvataggio...":"Registra parto e crea lotto"} icon="✓"
          onClick={salva} variant="success"
          disabled={saving||!form.madre_id||!form.data_parto||!form.nati_totali} full/>
      </div>
      <Btn label="Annulla" onClick={onCancel} variant="ghost" full/>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function LottiSuini() {
  const [animali,setAnimali]   = useState([]);
  const [lotti,setLotti]       = useState([]);
  const [suini,setSuini]       = useState([]);
  const [loading,setLoading]   = useState(true);
  const [view,setView]         = useState("lista");  // lista | lotto | form
  const [selLotto,setSelLotto] = useState(null);

  const carica = async () => {
    setLoading(true);
    const [{data:anim},{data:lot},{data:sui}] = await Promise.all([
      supabase.from("animali").select("*").eq("specie","suino").order("nome"),
      supabase.from("lotti_suini").select("*").order("data_parto",{ascending:false}),
      supabase.from("suini_lotto").select("*").order("lotto_id").order("nr"),
    ]);
    setAnimali(anim||[]);
    setLotti(lot||[]);
    setSuini(sui||[]);
    setLoading(false);
  };
  useEffect(()=>{carica();},[]);

  if(loading) return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}><Spinner/></div>
  );

  if(view==="form") return(
    <FormNuovoParto animali={animali}
      onSave={()=>{carica();setView("lista");}}
      onCancel={()=>setView("lista")}/>
  );

  if(view==="lotto"&&selLotto) return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <SchedaLotto lotto={selLotto} suini={suini} animali={animali}
        onBack={()=>setView("lista")}
        onUpdate={carica}/>
    </div>
  );

  return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <ListaLotti lotti={lotti} suini={suini} animali={animali}
        onSeleziona={l=>{setSelLotto(l);setView("lotto");}}
        onNuovo={()=>setView("form")}/>
    </div>
  );
}
