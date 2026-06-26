import { useState, useEffect, useMemo } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  suini:"#B5547A", maschio:"#2C6E9B", femmina:"#B5547A", morto:"#999",
};

const today     = () => new Date().toISOString().split("T")[0];
const thisYear  = () => new Date().getFullYear();
import { supabase } from "./supabase";
// ─── CALCOLI LOTTO ────────────────────────────────────────────────────────────
function statsLotto(lottoId, suini) {
  const ss = suini.filter(s=>s.lottoId===lottoId);
  const vivi    = ss.filter(s=>s.vivo);
  const morti   = ss.filter(s=>!s.vivo);
  const conBdn  = vivi.filter(s=>s.bdn);
  const conSvez = vivi.filter(s=>s.peso_svezzamento);
  const pesoMedioSvez = conSvez.length > 0
    ? (conSvez.reduce((a,s)=>a+s.peso_svezzamento,0)/conSvez.length).toFixed(1)
    : null;
  const macellati = ss.filter(s=>s.stato==="macellato").length;
  return { totale:ss.length, vivi:vivi.length, morti:morti.length, conBdn:conBdn.length, conSvez:conSvez.length, pesoMedioSvez, macellati };
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
const Btn = ({label,onClick,variant="primary",small=false,icon,full=false}) => {
  const s={primary:{bg:C.primary,fg:"#FFF"},success:{bg:C.green,fg:"#FFF"},danger:{bg:C.red,fg:"#FFF"},ghost:{bg:"transparent",fg:C.text},outline:{bg:"transparent",fg:C.primary}}[variant]||{bg:C.primary,fg:"#FFF"};
  return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,background:s.bg,color:s.fg,border:variant==="outline"?`1.5px solid ${C.primary}`:"none",borderRadius:10,padding:small?"6px 12px":"10px 18px",fontSize:small?13:15,fontWeight:600,cursor:"pointer",width:full?"100%":"auto"}}>{icon}{label}</button>;
};
const inputStyle = {width:"100%",boxSizing:"border-box",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 12px",fontSize:15,background:"#FAFAF8",color:C.text,outline:"none"};
const Field = ({label,value,onChange,type="text",options,required,placeholder}) => (
  <div style={{marginBottom:12}}>
    <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>{label}{required&&" *"}</div>
    {options
      ? <select value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}><option value="">— seleziona —</option>{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}</select>
      : <input type={type} value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle} placeholder={placeholder||""}/>}
  </div>
);

// ─── CARD SINGOLO SUINO ───────────────────────────────────────────────────────
function CardSuino({s, lotto, onUpdate}) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(s);

  const col = !s.vivo ? C.morto : s.sesso==="M" ? C.maschio : C.femmina;
  const statoColor = {attivo:C.green,macellato:C.muted,morto:C.red,venduto:C.blue}[s.stato]||C.muted;

  const salva = () => {
    onUpdate({...form, peso_nascita:form.peso_nascita?parseFloat(form.peso_nascita):null, peso_svezzamento:form.peso_svezzamento?parseFloat(form.peso_svezzamento):null, peso_attuale:form.peso_attuale?parseFloat(form.peso_attuale):null});
    setEdit(false);
  };

  if (edit) return (
    <Card style={{borderLeft:`3px solid ${col}`}}>
      <div style={{fontWeight:700,color:C.primary,marginBottom:10}}>
        {lotto.codice} / nr.{s.nr} — Modifica
      </div>
      <Field label="BDN / Matricola individuale" value={form.bdn||""} onChange={v=>setForm(f=>({...f,bdn:v||null}))} placeholder="opzionale"/>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}>
          <Field label="Sesso" value={form.sesso} onChange={v=>setForm(f=>({...f,sesso:v}))} options={[{value:"M",label:"♂ Maschio"},{value:"F",label:"♀ Femmina"}]}/>
        </div>
        <div style={{flex:1}}>
          <Field label="Stato" value={form.stato} onChange={v=>setForm(f=>({...f,stato:v,vivo:v!=="morto"}))} options={["attivo","macellato","venduto","morto"].map(x=>({value:x,label:x}))}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><Field label="Peso nascita (kg)" value={form.peso_nascita||""} onChange={v=>setForm(f=>({...f,peso_nascita:v}))} type="number"/></div>
        <div style={{flex:1}}><Field label="Peso svezzamento (kg)" value={form.peso_svezzamento||""} onChange={v=>setForm(f=>({...f,peso_svezzamento:v}))} type="number"/></div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}><Field label="Data svezzamento" value={form.data_svezzamento||""} onChange={v=>setForm(f=>({...f,data_svezzamento:v}))} type="date"/></div>
        <div style={{flex:1}}><Field label="Peso attuale (kg)" value={form.peso_attuale||""} onChange={v=>setForm(f=>({...f,peso_attuale:v}))} type="number"/></div>
      </div>
      <Field label="Note" value={form.note||""} onChange={v=>setForm(f=>({...f,note:v}))}/>
      <div style={{display:"flex",gap:8}}>
        <Btn label="Salva" onClick={salva} variant="success" small icon="✓ "/>
        <Btn label="Annulla" onClick={()=>{setForm(s);setEdit(false);}} variant="ghost" small/>
      </div>
    </Card>
  );

  return (
    <div style={{background:!s.vivo?C.morto+"08":C.bg,borderRadius:12,padding:"10px 12px",marginBottom:8,border:`1.5px solid ${col}22`,borderLeft:`3px solid ${col}`,opacity:s.vivo?1:0.65}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{flex:1}}>
          {/* Identificativo principale */}
          <div style={{fontWeight:700,fontSize:14,color:s.vivo?C.text:C.morto}}>
            <span style={{color:C.suini,fontSize:12,fontWeight:600}}>{lotto.codice}</span>
            <span style={{color:C.muted,fontSize:13}}> / </span>
            <span style={{fontSize:15}}>nr.{s.nr}</span>
            {s.bdn && <span style={{color:C.muted,fontSize:12,marginLeft:8}}>· {s.bdn}</span>}
          </div>
          <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
            <Badge label={s.sesso==="M"?"♂":"♀"} color={col}/>
            <Badge label={s.stato} color={statoColor}/>
            {!s.vivo&&<Badge label="✝ nato morto" color={C.morto}/>}
            {s.bdn&&<Badge label="BDN ✓" color={C.green}/>}
          </div>
          {/* Pesi */}
          {s.vivo&&(
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>
              {s.peso_nascita&&`nasc: ${s.peso_nascita}kg`}
              {s.peso_svezzamento&&` → svezz: ${s.peso_svezzamento}kg`}
              {s.peso_attuale&&` → att: ${s.peso_attuale}kg`}
            </div>
          )}
        </div>
        {s.vivo&&(
          <button onClick={()=>setEdit(true)} style={{background:C.blue+"20",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13}}>✏️</button>
        )}
      </div>
    </div>
  );
}

// ─── SCHEDA LOTTO ─────────────────────────────────────────────────────────────
function SchedaLotto({lotto, data, onBack, onUpdateSuino, onAddSuini}) {
  const madre = data.riproduttori.find(r=>r.id===lotto.madreId);
  const padre = data.riproduttori.find(r=>r.id===lotto.padreId);
  const suiniLotto = data.suini.filter(s=>s.lottoId===lotto.id).sort((a,b)=>a.nr-b.nr);
  const stats = statsLotto(lotto.id, data.suini);

  const [cerca, setCerca] = useState("");
  const [filtroStato, setFiltroStato] = useState("tutti");

  const suiniFiltrati = suiniLotto.filter(s=>
    (filtroStato==="tutti"||s.stato===filtroStato||(filtroStato==="morto"&&!s.vivo))&&
    (!cerca||String(s.nr).includes(cerca)||(s.bdn&&s.bdn.toLowerCase().includes(cerca.toLowerCase())))
  );

  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:C.suini}}>🐷 {lotto.codice}</div>
          <div style={{fontSize:13,color:C.muted}}>Parto {lotto.data_parto}</div>
        </div>
      </div>

      {/* KPI lotto */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {[
          {label:"Nati",    value:lotto.nati_totali, color:C.primary},
          {label:"Vivi",    value:stats.vivi,         color:C.green},
          {label:"Morti",   value:stats.morti,         color:C.morto},
          {label:"BDN reg.",value:stats.conBdn,        color:C.blue},
        ].map(k=>(
          <div key={k.label} style={{background:k.color+"12",borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
            <div style={{fontSize:10,color:k.color,fontWeight:700}}>{k.label}</div>
            <div style={{fontSize:20,fontWeight:900,color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Genitori */}
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:8}}>GENITORI</div>
        <div style={{display:"flex",gap:10}}>
          {madre&&<div style={{flex:1,background:C.femmina+"10",borderRadius:10,padding:"8px 12px"}}>
            <div style={{fontSize:10,color:C.femmina,fontWeight:700}}>♀ MADRE</div>
            <div style={{fontWeight:700}}>{madre.nome}</div>
            <div style={{fontSize:12,color:C.muted}}>{madre.bdn}</div>
          </div>}
          {padre&&<div style={{flex:1,background:C.maschio+"10",borderRadius:10,padding:"8px 12px"}}>
            <div style={{fontSize:10,color:C.maschio,fontWeight:700}}>♂ PADRE</div>
            <div style={{fontWeight:700}}>{padre.nome}</div>
            <div style={{fontSize:12,color:C.muted}}>{padre.bdn}</div>
          </div>}
        </div>
        {lotto.note&&<div style={{fontSize:12,color:C.muted,marginTop:8,fontStyle:"italic"}}>💬 {lotto.note}</div>}
      </Card>

      {/* Peso medio svezzamento */}
      {stats.pesoMedioSvez&&(
        <Card style={{borderLeft:`4px solid ${C.yellow}`,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:12,color:C.muted,fontWeight:600}}>PESO MEDIO SVEZZAMENTO</div>
              <div style={{fontSize:12,color:C.muted}}>su {stats.conSvez} suini</div>
            </div>
            <div style={{fontSize:28,fontWeight:900,color:C.yellow}}>{stats.pesoMedioSvez} <span style={{fontSize:14}}>kg</span></div>
          </div>
        </Card>
      )}

      {/* Lista suini */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"8px 0 10px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>
          Suini ({suiniLotto.length})
        </div>
        <Btn label="+ Aggiungi" onClick={onAddSuini} small icon="➕ " variant="outline"/>
      </div>

      {/* Filtri suini */}
      <div style={{display:"flex",gap:6,marginBottom:10,overflowX:"auto",paddingBottom:2}}>
        {["tutti","attivo","macellato","venduto","morto"].map(s=>(
          <button key={s} onClick={()=>setFiltroStato(s)} style={{background:filtroStato===s?C.suini:C.card,color:filtroStato===s?"#FFF":C.muted,border:`1.5px solid ${filtroStato===s?C.suini:C.border}`,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
            {s==="tutti"?"Tutti":s}
          </button>
        ))}
      </div>

      <input placeholder="🔍  Cerca nr. o BDN..." value={cerca} onChange={e=>setCerca(e.target.value)} style={{...inputStyle,marginBottom:10}}/>

      {suiniFiltrati.map(s=>(
        <CardSuino key={s.id} s={s} lotto={lotto} onUpdate={onUpdateSuino}/>
      ))}
      {suiniFiltrati.length===0&&(
        <div style={{textAlign:"center",color:C.muted,padding:20}}>Nessun suino trovato</div>
      )}
    </div>
  );
}

// ─── FORM NUOVO LOTTO (PARTO) ─────────────────────────────────────────────────
function FormNuovoLotto({data, onSave, onCancel}) {
  const madri  = data.riproduttori.filter(r=>r.sesso==="F").map(r=>({value:r.id,label:`${r.nome} — ${r.bdn}`}));
  const maschi = data.riproduttori.filter(r=>r.sesso==="M").map(r=>({value:r.id,label:`${r.nome} — ${r.bdn}`}));

  const [parto, setParto] = useState({madreId:"",padreId:"",data_parto:today(),nati_vivi:10,nati_morti:0,note:""});
  const [suini, setSuini] = useState([]);
  const [step,  setStep]  = useState(1); // 1=info parto, 2=registra suini

  const totale = parseInt(parto.nati_vivi||0) + parseInt(parto.nati_morti||0);
  const anno   = parseInt((parto.data_parto||today()).substring(0,4));
  const codice = genCodiceLotto(data.lotti, anno);

  // Genera automaticamente i suini quando si passa allo step 2
  const generaSuini = () => {
    const vivi  = parseInt(parto.nati_vivi||0);
    const morti = parseInt(parto.nati_morti||0);
    const lista = [];
    for (let i=1; i<=vivi; i++)  lista.push({nr:i,  bdn:"",sesso:"M",vivo:true, stato:"attivo",peso_nascita:"",note:""});
    for (let i=1; i<=morti;i++)  lista.push({nr:vivi+i,bdn:"",sesso:"M",vivo:false,stato:"morto", peso_nascita:"",note:"nato morto"});
    setSuini(lista);
    setStep(2);
  };

  const aggiorna = (i,k,v) => setSuini(ss=>ss.map((s,idx)=>idx===i?{...s,[k]:v}:s));

  const salva = () => {
    if (!parto.madreId||!parto.data_parto) return;
    onSave({
      parto:{
        ...parto,
        madreId:parseInt(parto.madreId),
        padreId:parto.padreId?parseInt(parto.padreId):null,
        nati_vivi:parseInt(parto.nati_vivi),
        nati_morti:parseInt(parto.nati_morti),
        nati_totali:totale,
        codice, anno,
      },
      suini: suini.map(s=>({...s,bdn:s.bdn||null,peso_nascita:s.peso_nascita?parseFloat(s.peso_nascita):null})),
    });
  };

  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={step===2?()=>setStep(1):onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <div>
          <div style={{fontSize:18,fontWeight:800}}>Nuovo parto suini</div>
          <div style={{fontSize:13,color:C.muted}}>Passo {step} di 2</div>
        </div>
      </div>

      {/* Anteprima codice lotto */}
      <Card style={{background:C.suini+"12",borderLeft:`4px solid ${C.suini}`,marginBottom:16}}>
        <div style={{fontSize:12,color:C.muted,fontWeight:600}}>CODICE LOTTO ASSEGNATO</div>
        <div style={{fontSize:28,fontWeight:900,color:C.suini}}>{codice}</div>
        <div style={{fontSize:12,color:C.muted}}>Anno {anno} · lotto progressivo automatico</div>
      </Card>

      {step===1&&(<>
        <Field label="Madre" value={parto.madreId} onChange={v=>setParto(p=>({...p,madreId:v}))} options={madri} required/>
        <Field label="Padre (opz.)" value={parto.padreId} onChange={v=>setParto(p=>({...p,padreId:v}))} options={maschi}/>
        <Field label="Data parto" value={parto.data_parto} onChange={v=>setParto(p=>({...p,data_parto:v}))} type="date" required/>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1}}><Field label="Nati vivi" value={parto.nati_vivi} onChange={v=>setParto(p=>({...p,nati_vivi:v}))} type="number"/></div>
          <div style={{flex:1}}><Field label="Nati morti" value={parto.nati_morti} onChange={v=>setParto(p=>({...p,nati_morti:v}))} type="number"/></div>
        </div>
        <Card style={{background:C.primary+"10",borderLeft:`3px solid ${C.primary}`,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:C.muted}}>Totale nati:</span>
            <span style={{fontWeight:800,fontSize:18,color:C.primary}}>{totale}</span>
          </div>
        </Card>
        <Field label="Note" value={parto.note} onChange={v=>setParto(p=>({...p,note:v}))}/>
        <Btn label="Avanti: registra i nati →" onClick={generaSuini} variant="primary" full icon="🐷 "/>
      </>)}

      {step===2&&(<>
        <div style={{fontSize:13,color:C.muted,marginBottom:14}}>
          Compila BDN e sesso per ogni suino. I campi sono opzionali — puoi aggiornarli in seguito.
        </div>

        {suini.map((s,i)=>(
          <div key={i} style={{background:!s.vivo?C.morto+"08":C.bg,borderRadius:12,padding:"12px 14px",marginBottom:10,border:`1.5px solid ${!s.vivo?C.morto:s.sesso==="M"?C.maschio:C.femmina}22`,borderLeft:`3px solid ${!s.vivo?C.morto:s.sesso==="M"?C.maschio:C.femmina}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontWeight:700,color:C.suini}}>{codice} / nr.{s.nr}</div>
              {!s.vivo&&<Badge label="✝ NATO MORTO" color={C.morto}/>}
            </div>
            {s.vivo&&<>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:2}}><Field label="BDN (opz.)" value={s.bdn} onChange={v=>aggiorna(i,"bdn",v)} placeholder="es. IT034SU200"/></div>
                <div style={{flex:1}}><Field label="Sesso" value={s.sesso} onChange={v=>aggiorna(i,"sesso",v)} options={[{value:"M",label:"♂"},{value:"F",label:"♀"}]}/></div>
              </div>
              <Field label="Peso nascita (kg)" value={s.peso_nascita} onChange={v=>aggiorna(i,"peso_nascita",v)} type="number"/>
            </>}
            {!s.vivo&&<div style={{fontSize:12,color:C.morto,fontStyle:"italic"}}>Registrato come nato morto — nessun dato richiesto</div>}
          </div>
        ))}

        <div style={{display:"flex",gap:10,marginTop:8}}>
          <Btn label="Salva lotto" onClick={salva} variant="success" icon="✓ " full/>
        </div>
        <div style={{fontSize:12,color:C.muted,textAlign:"center",marginTop:8}}>
          BDN e pesi possono essere aggiunti/modificati in seguito dalla scheda lotto
        </div>
      </>)}
    </div>
  );
}

// ─── FORM AGGIUNGI SUINI AL LOTTO ─────────────────────────────────────────────
function FormAggiungiSuini({lotto, data, onSave, onCancel}) {
  const ultimoNr = data.suini.filter(s=>s.lottoId===lotto.id).reduce((m,s)=>Math.max(m,s.nr),0);
  const [suini, setSuini] = useState([{bdn:"",sesso:"M",vivo:true,stato:"attivo",peso_nascita:"",note:""}]);
  const aggiorna = (i,k,v) => setSuini(ss=>ss.map((s,idx)=>idx===i?{...s,[k]:v}:s));
  const salva = () => onSave(suini.map((s,i)=>({...s,nr:ultimoNr+i+1,lottoId:lotto.id,bdn:s.bdn||null,peso_nascita:s.peso_nascita?parseFloat(s.peso_nascita):null})));
  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:17,fontWeight:800}}>Aggiungi suini — {lotto.codice}</span>
      </div>
      {suini.map((s,i)=>(
        <Card key={i} style={{borderLeft:`3px solid ${C.suini}`}}>
          <div style={{fontWeight:700,color:C.suini,marginBottom:8}}>{lotto.codice} / nr.{ultimoNr+i+1}</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[{v:true,l:"✓ Vivo",c:C.green},{v:false,l:"✝ Morto",c:C.morto}].map(opt=>(
              <button key={String(opt.v)} onClick={()=>aggiorna(i,"vivo",opt.v)} style={{flex:1,background:s.vivo===opt.v?opt.c:C.bg,color:s.vivo===opt.v?"#FFF":C.muted,border:`1.5px solid ${s.vivo===opt.v?opt.c:C.border}`,borderRadius:10,padding:"7px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>{opt.l}</button>
            ))}
          </div>
          {s.vivo&&<>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:2}}><Field label="BDN (opz.)" value={s.bdn} onChange={v=>aggiorna(i,"bdn",v)}/></div>
              <div style={{flex:1}}><Field label="Sesso" value={s.sesso} onChange={v=>aggiorna(i,"sesso",v)} options={[{value:"M",label:"♂"},{value:"F",label:"♀"}]}/></div>
            </div>
            <Field label="Peso nascita (kg)" value={s.peso_nascita} onChange={v=>aggiorna(i,"peso_nascita",v)} type="number"/>
          </>}
        </Card>
      ))}
      <Btn label="+ Aggiungi altro" onClick={()=>setSuini(ss=>[...ss,{bdn:"",sesso:"M",vivo:true,stato:"attivo",peso_nascita:"",note:""}])} variant="outline" small icon="➕ "/>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <Btn label="Salva" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── LISTA LOTTI ──────────────────────────────────────────────────────────────
function ListaLotti({data, onSeleziona, onNuovo}) {
  const [cerca, setCerca] = useState("");

  const lotti = useMemo(()=>
    [...data.lotti]
      .filter(l=>!cerca||l.codice.toLowerCase().includes(cerca.toLowerCase()))
      .sort((a,b)=>b.data_parto.localeCompare(a.data_parto))
  ,[data,cerca]);

  const totVivi     = data.suini.filter(s=>s.vivo&&s.stato==="attivo").length;
  const totMacellati= data.suini.filter(s=>s.stato==="macellato").length;

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.suini},#8B2252)`,borderRadius:"0 0 28px 28px",padding:"28px 20px 24px",marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>🐷 Lotti Suini</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginTop:4}}>
          {data.lotti.length} lotti · {data.suini.filter(s=>s.vivo).length} capi vivi
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:14}}>
          {[
            {l:"Lotti totali",  v:data.lotti.length,   c:"#FFF"},
            {l:"Attivi",        v:totVivi,              c:"#ADFFB5"},
            {l:"Macellati",     v:totMacellati,         c:"#FFD700"},
          ].map(k=>(
            <div key={k.l} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600}}>{k.l}</div>
              <div style={{fontSize:18,fontWeight:800,color:k.c}}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"0 16px"}}>
        <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
          <input placeholder="🔍  Cerca lotto..." value={cerca} onChange={e=>setCerca(e.target.value)} style={{...inputStyle,flex:1,marginBottom:0}}/>
          <Btn label="+ Parto" onClick={onNuovo} small icon="🐣 "/>
        </div>

        {lotti.map(l=>{
          const stats = statsLotto(l.id, data.suini);
          const madre = data.riproduttori.find(r=>r.id===l.madreId);
          const padre = data.riproduttori.find(r=>r.id===l.padreId);
          return (
            <div key={l.id} onClick={()=>onSeleziona(l)} style={{background:C.card,borderRadius:16,padding:16,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.07)",border:`1px solid ${C.border}`,cursor:"pointer",borderLeft:`5px solid ${C.suini}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:20,fontWeight:900,color:C.suini}}>{l.codice}</div>
                  <div style={{fontSize:13,color:C.muted}}>Parto {l.data_parto}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:24,fontWeight:900,color:C.primary}}>{stats.vivi}</div>
                  <div style={{fontSize:11,color:C.muted}}>vivi / {l.nati_totali} nati</div>
                </div>
              </div>

              {/* Barra vivi/morti */}
              <div style={{background:C.morto+"30",borderRadius:99,height:8,overflow:"hidden",marginBottom:8}}>
                <div style={{background:C.green,width:`${l.nati_totali>0?stats.vivi/l.nati_totali*100:0}%`,height:"100%",borderRadius:99}}/>
              </div>

              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Badge label={`${stats.vivi} vivi`} color={C.green}/>
                {stats.morti>0&&<Badge label={`${stats.morti} morti`} color={C.morto}/>}
                {stats.macellati>0&&<Badge label={`${stats.macellati} macellati`} color={C.muted}/>}
                <Badge label={`${stats.conBdn} BDN reg.`} color={C.blue}/>
              </div>
              {(madre||padre)&&(
                <div style={{fontSize:12,color:C.muted,marginTop:6}}>
                  {madre&&`♀ ${madre.nome}`}{padre&&` · ♂ ${padre.nome}`}
                </div>
              )}
              {stats.pesoMedioSvez&&(
                <div style={{fontSize:12,color:C.yellow,marginTop:2,fontWeight:600}}>⚖ Peso medio svezz.: {stats.pesoMedioSvez} kg</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function LottiSuini() {
  const [data, setData]   = useState({ riproduttori:[], lotti:[], suini:[] });
  const [loading, setLoading] = useState(true);
  const [view, setView]   = useState("lista");
  const [selLotto, setSelLotto] = useState(null);

  const carica = async () => {
    setLoading(true);
    const [{ data: anim }, { data: lotti }, { data: suini }] = await Promise.all([
      supabase.from("animali").select("*").eq("specie","suino").order("nome"),
      supabase.from("lotti_suini").select("*").order("data_parto", { ascending:false }),
      supabase.from("suini_lotto").select("*").order("lotto_id").order("nr"),
    ]);
    // Mappa snake_case → camelCase per compatibilità con i componenti UI
    const lottiMapped = (lotti||[]).map(l=>({
      ...l, madreId:l.madre_id, padreId:l.padre_id,
    }));
    const suiniMapped = (suini||[]).map(s=>({
      ...s, lottoId:s.lotto_id,
    }));
    setData({
      riproduttori: anim||[],
      lotti: lottiMapped,
      suini: suiniMapped,
    });
    setLoading(false);
  };

  useEffect(()=>{ carica(); },[]);

  const addLotto = async ({ parto, suini }) => {
    // Salva lotto
    const { data: nuovoLotto, error: errLotto } = await supabase
      .from("lotti_suini")
      .insert([{
        codice:     parto.codice,
        anno:       parto.anno,
        madre_id:   parto.madreId || null,
        padre_id:   parto.padreId || null,
        data_parto: parto.data_parto,
        nati_totali:parto.nati_totali,
        nati_vivi:  parto.nati_vivi,
        nati_morti: parto.nati_morti,
        note:       parto.note || null,
      }])
      .select().single();
    if (errLotto || !nuovoLotto) return;

    // Salva suini del lotto
    if (suini.length > 0) {
      await supabase.from("suini_lotto").insert(
        suini.map(s => ({
          lotto_id:         nuovoLotto.id,
          nr:               s.nr,
          bdn:              s.bdn || null,
          sesso:            s.sesso,
          vivo:             s.vivo,
          stato:            s.stato || "attivo",
          peso_nascita:     s.peso_nascita || null,
          note:             s.note || null,
        }))
      );
    }
    await carica();
    setView("lista");
  };

  const updateSuino = async (suino) => {
    await supabase.from("suini_lotto").update({
      bdn:               suino.bdn || null,
      sesso:             suino.sesso,
      stato:             suino.stato,
      vivo:              suino.vivo,
      peso_nascita:      suino.peso_nascita || null,
      peso_svezzamento:  suino.peso_svezzamento || null,
      peso_attuale:      suino.peso_attuale || null,
      data_svezzamento:  suino.data_svezzamento || null,
      note:              suino.note || null,
    }).eq("id", suino.id);
    await carica();
  };

  const addSuiniLotto = async (nuovi) => {
    await supabase.from("suini_lotto").insert(
      nuovi.map(s => ({
        lotto_id:     s.lottoId,
        nr:           s.nr,
        bdn:          s.bdn || null,
        sesso:        s.sesso,
        vivo:         s.vivo,
        stato:        s.stato || "attivo",
        peso_nascita: s.peso_nascita || null,
        note:         s.note || null,
      }))
    );
    await carica();
    setView("scheda");
  };

  const wrap = ch => (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      {loading
        ? <div style={{textAlign:"center",padding:80,color:C.muted}}><div style={{fontSize:40,marginBottom:12}}>⏳</div><div>Caricamento lotti...</div></div>
        : ch}
    </div>
  );

  if (view==="nuovo")  return wrap(<FormNuovoLotto data={data} onSave={addLotto} onCancel={()=>setView("lista")}/>);
  if (view==="add_suini"&&selLotto) return wrap(<FormAggiungiSuini lotto={selLotto} data={data} onSave={addSuiniLotto} onCancel={()=>setView("scheda")}/>);
  if (view==="scheda"&&selLotto) return wrap(
    <SchedaLotto lotto={selLotto} data={data} onBack={()=>setView("lista")} onUpdateSuino={updateSuino} onAddSuini={()=>setView("add_suini")}/>
  );
  return wrap(<ListaLotti data={data} onSeleziona={l=>{setSelLotto(l);setView("scheda");}} onNuovo={()=>setView("nuovo")}/>);
}
