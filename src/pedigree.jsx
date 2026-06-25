import { useState, useMemo } from "react";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  bovini:"#8B6914", suini:"#B5547A", ovini:"#4A7C59",
  maschio:"#2C6E9B", femmina:"#B5547A", morto:"#999",
};

const specieColor = s => ({ bovino:C.bovini, suino:C.suini, ovino:C.ovini }[s]||C.muted);
const specieIcon  = s => ({ bovino:"🐄", suino:"🐷", ovino:"🐑" }[s]||"🐾");
const today = () => new Date().toISOString().split("T")[0];

// ─── DATI INIZIALI ────────────────────────────────────────────────────────────
const initialData = {
  animali: [
    // Gen 0 — fondatori acquistati
    { id:1,  bdn:"IT034BN001", nome:"Ercole",  specie:"bovino", sesso:"M", razza:"Limousine",   nascita:"2018-03-10", madreId:null, padreId:null, stato:"attivo",    vivo:true },
    { id:2,  bdn:"IT034BN002", nome:"Bella",   specie:"bovino", sesso:"F", razza:"Limousine",   nascita:"2019-07-20", madreId:null, padreId:null, stato:"attivo",    vivo:true },
    { id:3,  bdn:"IT034BN003", nome:"Rosa",    specie:"bovino", sesso:"F", razza:"Limousine",   nascita:"2019-11-05", madreId:null, padreId:null, stato:"attivo",    vivo:true },
    { id:4,  bdn:"IT034SU001", nome:"Arturo",  specie:"suino",  sesso:"M", razza:"Large White", nascita:"2021-01-15", madreId:null, padreId:null, stato:"attivo",    vivo:true },
    { id:5,  bdn:"IT034SU002", nome:"Peppa",   specie:"suino",  sesso:"F", razza:"Large White", nascita:"2021-06-10", madreId:null, padreId:null, stato:"attivo",    vivo:true },
    // Gen 1 — nati in azienda
    { id:6,  bdn:"IT034BN010", nome:"Figlio1", specie:"bovino", sesso:"M", razza:"Limousine",   nascita:"2022-03-10", madreId:2, padreId:1, stato:"attivo", vivo:true },
    { id:7,  bdn:"IT034BN011", nome:"Figlia1", specie:"bovino", sesso:"F", razza:"Limousine",   nascita:"2022-03-10", madreId:2, padreId:1, stato:"attivo", vivo:true },
    { id:8,  bdn:"IT034BN012", nome:"Figlio2", specie:"bovino", sesso:"M", razza:"Limousine",   nascita:"2023-05-20", madreId:3, padreId:1, stato:"attivo", vivo:true },
    // Gen 2 — nati da gen 1
    { id:9,  bdn:"IT034BN020", nome:"Nipote1", specie:"bovino", sesso:"F", razza:"Limousine",   nascita:"2024-04-01", madreId:7, padreId:6, stato:"attivo", vivo:true },
  ],
  // Parti registrati
  parti: [
    { id:1, madreId:2, padreId:1, data:"2022-03-10", note:"Parto gemellare regolare" },
    { id:2, madreId:3, padreId:1, data:"2023-05-20", note:"" },
    { id:3, madreId:7, padreId:6, data:"2024-04-01", note:"Prima figliatura" },
  ],
  nextId:{ animali:10, parti:4 },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getAntenati(id, animali, livelli=3) {
  const a = animali.find(x=>x.id===id);
  if (!a || livelli===0) return null;
  return {
    ...a,
    madre: a.madreId ? getAntenati(a.madreId, animali, livelli-1) : null,
    padre: a.padreId ? getAntenati(a.padreId, animali, livelli-1) : null,
  };
}

function getDiscendenti(id, animali) {
  return animali.filter(a => a.madreId===id || a.padreId===id);
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
  return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:5,background:s.bg,color:s.fg,border:variant==="outline"?`1.5px solid ${C.primary}`:"none",borderRadius:10,padding:small?"6px 12px":"10px 18px",fontSize:small?13:15,fontWeight:600,cursor:"pointer",boxShadow:["primary","success","danger"].includes(variant)?"0 2px 6px rgba(0,0,0,0.15)":"none"}}>{icon}{label}</button>;
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

// ─── CARD ANIMALE MINI (per albero) ──────────────────────────────────────────
function MiniCard({a, onClick, generazione=0}) {
  if (!a) return (
    <div style={{background:C.border+"40",borderRadius:10,padding:"8px 12px",textAlign:"center",border:`1.5px dashed ${C.border}`}}>
      <div style={{fontSize:12,color:C.muted}}>sconosciuto</div>
    </div>
  );
  const col = !a.vivo ? C.morto : a.sesso==="M" ? C.maschio : C.femmina;
  const size = generazione===0 ? 16 : generazione===1 ? 14 : 12;
  return (
    <div onClick={onClick} style={{background:col+"12",borderRadius:10,padding:"8px 10px",border:`1.5px solid ${col}33`,cursor:onClick?"pointer":"default",position:"relative"}}>
      {!a.vivo && <span style={{position:"absolute",top:4,right:6,fontSize:10}}>✝</span>}
      <div style={{fontWeight:700,fontSize:size,color:a.vivo?C.text:C.morto,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nome||a.bdn}</div>
      <div style={{fontSize:10,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.bdn}</div>
      <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
        <Badge label={a.sesso==="M"?"♂":"♀"} color={col}/>
        {!a.vivo && <Badge label="deceduto" color={C.morto}/>}
      </div>
    </div>
  );
}

// ─── ALBERO GENEALOGICO SVG ───────────────────────────────────────────────────
function AlberoGenealogicoView({animale, animali, onSeleziona}) {
  const tree = getAntenati(animale.id, animali, 3);

  // Rettangolo cliccabile con testo
  const Rettangolo = ({a, x, y, w=130, h=52, gen=0}) => {
    if (!a) return (
      <g>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={C.border+"30"} stroke={C.border} strokeWidth={1} strokeDasharray="4"/>
        <text x={x+w/2} y={y+h/2+4} textAnchor="middle" fontSize={10} fill={C.muted}>sconosciuto</text>
      </g>
    );
    const col = !a.vivo ? C.morto : a.sesso==="M" ? C.maschio : C.femmina;
    const isSelected = a.id===animale.id;
    return (
      <g onClick={()=>a.id!==animale.id&&onSeleziona(a)} style={{cursor:a.id!==animale.id?"pointer":"default"}}>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={col+"18"} stroke={isSelected?C.primary:col+"55"} strokeWidth={isSelected?2.5:1.5}/>
        <text x={x+8} y={y+16} fontSize={11} fontWeight="700" fill={a.vivo?C.text:C.morto}>{(a.nome||a.bdn).substring(0,14)}</text>
        <text x={x+8} y={y+30} fontSize={9}  fill={C.muted}>{a.bdn.substring(0,18)}</text>
        <text x={x+8} y={y+44} fontSize={9}  fill={col} fontWeight="600">{a.sesso==="M"?"♂ Maschio":"♀ Femmina"}{!a.vivo?" · ✝":""}</text>
      </g>
    );
  };

  // Linea di collegamento
  const Linea = ({x1,y1,x2,y2}) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.border} strokeWidth={1.5} strokeDasharray="0"/>
  );

  const W=150, H=56, GAP_X=20, GAP_Y=20;
  const svgW = W*4 + GAP_X*3 + 40;
  const svgH = H*8 + GAP_Y*7 + 40;

  // Posizioni: generazione 0 = soggetto (centro sx), 1 = genitori, 2 = nonni
  const posX = gen => 20 + gen*(W+GAP_X);
  const gen0Y = svgH/2 - H/2;
  // Genitori: madre in alto, padre in basso rispetto al centro
  const madreY = gen0Y - H - GAP_Y*2;
  const padreY = gen0Y + H + GAP_Y*2;

  const mm = tree?.madre?.madre;
  const mp = tree?.madre?.padre;
  const pm = tree?.padre?.madre;
  const pp = tree?.padre?.padre;

  const mmY = madreY - H - GAP_Y;
  const mpY = madreY + GAP_Y;
  const pmY = padreY - GAP_Y;
  const ppY = padreY + H + GAP_Y;

  return (
    <div style={{overflowX:"auto",overflowY:"auto",maxHeight:500,borderRadius:12,border:`1px solid ${C.border}`,background:"#FAFAF8"}}>
      <svg width={svgW} height={Math.max(400, svgH)} style={{display:"block"}}>
        {/* Soggetto — gen 0 */}
        <Rettangolo a={tree} x={posX(0)} y={gen0Y} w={W} h={H} gen={0}/>

        {/* Madre — gen 1 */}
        {tree?.madre && <>
          <Linea x1={posX(0)+W} y1={gen0Y+H/2} x2={posX(1)} y2={madreY+H/2}/>
          <Rettangolo a={tree.madre} x={posX(1)} y={madreY} w={W} h={H} gen={1}/>
        </>}
        {/* Padre — gen 1 */}
        {tree?.padre && <>
          <Linea x1={posX(0)+W} y1={gen0Y+H/2} x2={posX(1)} y2={padreY+H/2}/>
          <Rettangolo a={tree.padre} x={posX(1)} y={padreY} w={W} h={H} gen={1}/>
        </>}

        {/* Nonni materni — gen 2 */}
        {mm && <><Linea x1={posX(1)+W} y1={madreY+H/2} x2={posX(2)} y2={mmY+H/2}/><Rettangolo a={mm} x={posX(2)} y={mmY} w={W} h={H} gen={2}/></>}
        {mp && <><Linea x1={posX(1)+W} y1={madreY+H/2} x2={posX(2)} y2={mpY+H/2}/><Rettangolo a={mp} x={posX(2)} y={mpY} w={W} h={H} gen={2}/></>}
        {/* Nonni paterni — gen 2 */}
        {pm && <><Linea x1={posX(1)+W} y1={padreY+H/2} x2={posX(2)} y2={pmY+H/2}/><Rettangolo a={pm} x={posX(2)} y={pmY} w={W} h={H} gen={2}/></>}
        {pp && <><Linea x1={posX(1)+W} y1={padreY+H/2} x2={posX(2)} y2={ppY+H/2}/><Rettangolo a={pp} x={posX(2)} y={ppY} w={W} h={H} gen={2}/></>}

        {/* Label generazioni */}
        {["Soggetto","Genitori","Nonni"].map((l,i)=>(
          <text key={l} x={posX(i)+W/2} y={16} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.muted}>{l}</text>
        ))}
      </svg>
    </div>
  );
}

// ─── SCHEDA PEDIGREE ──────────────────────────────────────────────────────────
function SchedaPedigree({animale, data, onBack, onAddParto, onSeleziona}) {
  const madre = animale.madreId ? data.animali.find(a=>a.id===animale.madreId) : null;
  const padre = animale.padreId ? data.animali.find(a=>a.id===animale.padreId) : null;
  const figli = getDiscendenti(animale.id, data.animali);
  const mieiParti = data.parti.filter(p=>p.madreId===animale.id||p.padreId===animale.id).sort((a,b)=>b.data.localeCompare(a.data));

  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:18,fontWeight:800,color:C.text}}>Pedigree</span>
      </div>

      {/* Header animale */}
      <Card style={{borderLeft:`5px solid ${specieColor(animale.specie)}`,background:`linear-gradient(135deg,${specieColor(animale.specie)}12,${C.card})`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:22,fontWeight:800}}>{specieIcon(animale.specie)} {animale.nome||animale.bdn}</div>
            <div style={{fontSize:13,color:C.muted}}>{animale.bdn} · {animale.razza}</div>
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              <Badge label={animale.sesso==="M"?"♂ Maschio":"♀ Femmina"} color={animale.sesso==="M"?C.maschio:C.femmina}/>
              <Badge label={`nato ${animale.nascita}`} color={C.muted}/>
              {!animale.vivo && <Badge label="✝ Deceduto" color={C.morto}/>}
            </div>
          </div>
          {animale.sesso==="F" && animale.vivo && (
            <Btn label="+ Parto" onClick={()=>onAddParto(animale)} variant="success" small icon="🐣 "/>
          )}
        </div>
      </Card>

      {/* Genitori diretti */}
      <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"12px 0 8px",textTransform:"uppercase",letterSpacing:1}}>Genitori</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.femmina,marginBottom:4}}>♀ MADRE</div>
          <MiniCard a={madre} onClick={madre?()=>onSeleziona(madre):null} generazione={1}/>
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.maschio,marginBottom:4}}>♂ PADRE</div>
          <MiniCard a={padre} onClick={padre?()=>onSeleziona(padre):null} generazione={1}/>
        </div>
      </div>

      {/* Albero genealogico */}
      <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"12px 0 8px",textTransform:"uppercase",letterSpacing:1}}>Albero genealogico (3 generazioni)</div>
      <AlberoGenealogicoView animale={animale} animali={data.animali} onSeleziona={onSeleziona}/>

      {/* Figli */}
      {figli.length > 0 && <>
        <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"16px 0 8px",textTransform:"uppercase",letterSpacing:1}}>
          Discendenti diretti ({figli.length})
        </div>
        {figli.map(f=>(
          <div key={f.id} onClick={()=>onSeleziona(f)} style={{background:C.card,borderRadius:12,padding:"10px 14px",marginBottom:8,border:`1.5px solid ${C.border}`,cursor:"pointer",borderLeft:`3px solid ${f.sesso==="M"?C.maschio:C.femmina}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{f.nome||f.bdn}</div>
                <div style={{fontSize:12,color:C.muted}}>{f.bdn} · {f.nascita}</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <Badge label={f.sesso==="M"?"♂":"♀"} color={f.sesso==="M"?C.maschio:C.femmina}/>
                {!f.vivo && <Badge label="✝" color={C.morto}/>}
                <span style={{color:C.muted,fontSize:16}}>›</span>
              </div>
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>
              {animale.sesso==="F" ? `♂ padre: ${data.animali.find(a=>a.id===f.padreId)?.nome||"—"}` : `♀ madre: ${data.animali.find(a=>a.id===f.madreId)?.nome||"—"}`}
            </div>
          </div>
        ))}
      </>}

      {/* Storico parti */}
      {mieiParti.length > 0 && <>
        <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"16px 0 8px",textTransform:"uppercase",letterSpacing:1}}>Storico parti ({mieiParti.length})</div>
        {mieiParti.map(p=>{
          const figliParto = data.animali.filter(a=>a.nascita===p.data&&(a.madreId===p.madreId&&a.padreId===p.padreId));
          const altroGenitore = animale.sesso==="F"
            ? data.animali.find(a=>a.id===p.padreId)
            : data.animali.find(a=>a.id===p.madreId);
          return (
            <Card key={p.id} style={{borderLeft:`3px solid ${C.green}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontWeight:700}}>📅 {p.data}</span>
                <Badge label={`${figliParto.length} registrati`} color={C.green}/>
              </div>
              {altroGenitore && (
                <div style={{fontSize:13,color:C.muted,marginBottom:6}}>
                  {animale.sesso==="F"?"♂ Padre":"♀ Madre"}: <b>{altroGenitore.nome||altroGenitore.bdn}</b>
                </div>
              )}
              {p.note && <div style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>{p.note}</div>}
              {figliParto.map(f=>(
                <div key={f.id} onClick={()=>onSeleziona(f)} style={{background:C.bg,borderRadius:8,padding:"6px 10px",marginTop:6,fontSize:13,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <span style={{fontWeight:700}}>{f.nome||f.bdn}</span>
                    <span style={{color:C.muted}}> · {f.bdn}</span>
                    <span style={{color:f.sesso==="M"?C.maschio:C.femmina,marginLeft:6}}>{f.sesso==="M"?"♂":"♀"}</span>
                    {!f.vivo && <span style={{color:C.morto,marginLeft:6}}>✝ nato morto</span>}
                  </div>
                  <span style={{color:C.muted}}>›</span>
                </div>
              ))}
              {figliParto.length===0 && <div style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>Nessun figlio registrato per questo parto</div>}
            </Card>
          );
        })}
      </>}
    </div>
  );
}

// ─── FORM REGISTRA PARTO ──────────────────────────────────────────────────────
function FormParto({madre, data, onSave, onCancel}) {
  const maschi = data.animali.filter(a=>a.sesso==="M"&&a.specie===madre.specie&&a.vivo).map(a=>({value:a.id,label:`${a.nome||a.bdn} — ${a.bdn}`}));

  const [parto, setParto] = useState({madreId:madre.id, padreId:"", data:today(), note:""});
  const [figli, setFigli] = useState([{bdn:"",nome:"",sesso:"M",vivo:true,peso_nascita:""}]);

  const aggiornaFiglio = (i,k,v) => setFigli(ff=>ff.map((f,idx)=>idx===i?{...f,[k]:v}:f));
  const addFiglio = () => setFigli(ff=>[...ff,{bdn:"",nome:"",sesso:"M",vivo:true,peso_nascita:""}]);
  const removeFiglio = i => setFigli(ff=>ff.filter((_,idx)=>idx!==i));

  const natiVivi  = figli.filter(f=>f.vivo).length;
  const natiMorti = figli.filter(f=>!f.vivo).length;

  const salva = () => {
    if (!parto.data) return;
    onSave({
      parto:{ ...parto, padreId:parto.padreId?parseInt(parto.padreId):null },
      figli: figli.map(f=>({
        ...f,
        madreId: madre.id,
        padreId: parto.padreId ? parseInt(parto.padreId) : null,
        specie:  madre.specie,
        razza:   madre.razza,
        nascita: parto.data,
        stato:   "attivo",
        peso_nascita: f.peso_nascita ? parseFloat(f.peso_nascita) : null,
      }))
    });
  };

  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:18,fontWeight:800}}>Registra parto — {madre.nome||madre.bdn}</span>
      </div>

      <Card>
        <div style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:10}}>DATI PARTO</div>
        <Field label="Data parto" value={parto.data} onChange={v=>setParto(p=>({...p,data:v}))} type="date" required/>
        <Field label="Padre" value={parto.padreId} onChange={v=>setParto(p=>({...p,padreId:v}))} options={maschi}/>
        <Field label="Note" value={parto.note} onChange={v=>setParto(p=>({...p,note:v}))}/>
      </Card>

      {/* Riepilogo nati */}
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <div style={{flex:1,background:C.green+"15",borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:11,color:C.green,fontWeight:700}}>NATI VIVI</div>
          <div style={{fontSize:28,fontWeight:900,color:C.green}}>{natiVivi}</div>
        </div>
        <div style={{flex:1,background:C.morto+"15",borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:11,color:C.morto,fontWeight:700}}>NATI MORTI</div>
          <div style={{fontSize:28,fontWeight:900,color:C.morto}}>{natiMorti}</div>
        </div>
        <div style={{flex:1,background:C.primary+"15",borderRadius:12,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:11,color:C.primary,fontWeight:700}}>TOTALE</div>
          <div style={{fontSize:28,fontWeight:900,color:C.primary}}>{figli.length}</div>
        </div>
      </div>

      <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"4px 0 10px",textTransform:"uppercase",letterSpacing:1}}>Registra ogni figlio/a</div>

      {figli.map((f,i)=>(
        <Card key={i} style={{borderLeft:`4px solid ${!f.vivo?C.morto:f.sesso==="M"?C.maschio:C.femmina}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontWeight:700,color:C.primary}}>
              {!f.vivo?"✝ Nato morto #"+(i+1):f.sesso==="M"?"♂ Maschio #"+(i+1):"♀ Femmina #"+(i+1)}
            </span>
            {figli.length>1 && (
              <button onClick={()=>removeFiglio(i)} style={{background:C.red+"20",border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:12,color:C.red}}>✕ rimuovi</button>
            )}
          </div>

          {/* Stato vitale — in evidenza */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[{v:true,label:"✓ Nato vivo",col:C.green},{v:false,label:"✝ Nato morto",col:C.morto}].map(opt=>(
              <button key={String(opt.v)} onClick={()=>aggiornaFiglio(i,"vivo",opt.v)}
                style={{flex:1,background:f.vivo===opt.v?opt.col:C.bg,color:f.vivo===opt.v?"#FFF":C.muted,border:`1.5px solid ${f.vivo===opt.v?opt.col:C.border}`,borderRadius:10,padding:"8px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                {opt.label}
              </button>
            ))}
          </div>

          {f.vivo && <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Field label="BDN / Matricola" value={f.bdn} onChange={v=>aggiornaFiglio(i,"bdn",v)}/>
              <Field label="Nome (opz.)" value={f.nome} onChange={v=>aggiornaFiglio(i,"nome",v)}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Field label="Sesso" value={f.sesso} onChange={v=>aggiornaFiglio(i,"sesso",v)}
                options={[{value:"M",label:"♂ Maschio"},{value:"F",label:"♀ Femmina"}]}/>
              <Field label="Peso nascita (kg)" value={f.peso_nascita} onChange={v=>aggiornaFiglio(i,"peso_nascita",v)} type="number"/>
            </div>
          </>}

          {!f.vivo && (
            <div style={{background:C.morto+"10",borderRadius:8,padding:"8px 12px",fontSize:13,color:C.morto}}>
              ✝ Nato morto — verrà registrato senza BDN nell'evento di parto
            </div>
          )}
        </Card>
      ))}

      <Btn label="+ Aggiungi figlio" onClick={addFiglio} variant="outline" small icon="➕ "/>

      <div style={{display:"flex",gap:10,marginTop:20}}>
        <Btn label="Salva parto" onClick={salva} variant="success" icon="✓ "/>
        <Btn label="Annulla" onClick={onCancel} variant="ghost"/>
      </div>
    </div>
  );
}

// ─── LISTA ANIMALI ────────────────────────────────────────────────────────────
function ListaAnimali({data, onSeleziona, onAddParto}) {
  const [filtroSpecie,  setFiltroSpecie]  = useState("tutti");
  const [filtroSesso,   setFiltroSesso]   = useState("tutti");
  const [cerca,         setCerca]         = useState("");

  const animali = useMemo(()=>
    data.animali.filter(a=>
      (filtroSpecie==="tutti"||a.specie===filtroSpecie)&&
      (filtroSesso==="tutti"||a.sesso===filtroSesso)&&
      (!cerca||(a.bdn+a.nome).toLowerCase().includes(cerca.toLowerCase()))
    ).sort((a,b)=>a.bdn.localeCompare(b.bdn))
  ,[data,filtroSpecie,filtroSesso,cerca]);

  return (
    <div style={{paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,borderRadius:"0 0 28px 28px",padding:"28px 20px 24px",marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>🧬 Registro Genealogico</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",marginTop:4}}>
          {data.animali.length} animali · {data.parti.length} parti registrati
        </div>
      </div>

      <div style={{padding:"0 16px"}}>
        {/* Cerca */}
        <input placeholder="🔍  Cerca per BDN o nome..." value={cerca} onChange={e=>setCerca(e.target.value)}
          style={{...inputStyle,marginBottom:12}}/>

        {/* Filtri */}
        <div style={{display:"flex",gap:8,marginBottom:8,overflowX:"auto",paddingBottom:4}}>
          {["tutti","bovino","suino","ovino"].map(s=>(
            <button key={s} onClick={()=>setFiltroSpecie(s)} style={{background:filtroSpecie===s?C.primary:C.card,color:filtroSpecie===s?"#FFF":C.muted,border:`1.5px solid ${filtroSpecie===s?C.primary:C.border}`,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
              {s==="tutti"?"Tutte":specieIcon(s)+" "+s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
          {["tutti","M","F"].map(s=>(
            <button key={s} onClick={()=>setFiltroSesso(s)} style={{background:filtroSesso===s?(s==="M"?C.maschio:s==="F"?C.femmina:C.blue):C.card,color:filtroSesso===s?"#FFF":C.muted,border:`1.5px solid ${filtroSesso===s?(s==="M"?C.maschio:s==="F"?C.femmina:C.blue):C.border}`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
              {s==="tutti"?"♂♀ Tutti":s==="M"?"♂ Maschi":"♀ Femmine"}
            </button>
          ))}
        </div>

        {animali.map(a=>{
          const madre = a.madreId ? data.animali.find(x=>x.id===a.madreId) : null;
          const padre = a.padreId ? data.animali.find(x=>x.id===a.padreId) : null;
          const nFigli = getDiscendenti(a.id, data.animali).length;
          const col = !a.vivo ? C.morto : a.sesso==="M" ? C.maschio : C.femmina;
          return (
            <div key={a.id} style={{background:C.card,borderRadius:16,padding:14,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.07)",border:`1px solid ${C.border}`,borderLeft:`4px solid ${col}`,opacity:a.vivo?1:0.7}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div onClick={()=>onSeleziona(a)} style={{cursor:"pointer",flex:1}}>
                  <div style={{fontWeight:700,fontSize:15}}>{specieIcon(a.specie)} {a.nome||a.bdn}</div>
                  <div style={{fontSize:12,color:C.muted}}>{a.bdn} · {a.razza} · {a.nascita}</div>
                  <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                    <Badge label={a.sesso==="M"?"♂ M":"♀ F"} color={col}/>
                    {!a.vivo&&<Badge label="✝" color={C.morto}/>}
                    {(madre||padre)&&<Badge label="pedigree ✓" color={C.green}/>}
                    {nFigli>0&&<Badge label={`${nFigli} figli`} color={C.primary}/>}
                  </div>
                  {(madre||padre)&&(
                    <div style={{fontSize:11,color:C.muted,marginTop:4}}>
                      {madre&&`♀ ${madre.nome||madre.bdn}`}
                      {madre&&padre&&" · "}
                      {padre&&`♂ ${padre.nome||padre.bdn}`}
                    </div>
                  )}
                </div>
                {a.sesso==="F"&&a.vivo&&(
                  <Btn label="Parto" onClick={()=>onAddParto(a)} variant="success" small icon="🐣 "/>
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
  const [data, setData]   = useState(initialData);
  const [view, setView]   = useState("lista");
  const [selected, setSelected] = useState(null);

  const addParto = ({parto, figli}) => {
    const partoId = data.nextId.parti;
    let nextAnimaleId = data.nextId.animali;
    const nuoviAnimali = figli.map(f => ({...f, id:nextAnimaleId++}));
    setData(d=>({
      ...d,
      animali: [...d.animali, ...nuoviAnimali],
      parti:   [...d.parti,   {...parto, id:partoId}],
      nextId:  {...d.nextId, animali:nextAnimaleId, parti:partoId+1},
    }));
    setView("scheda");
  };

  const wrap = ch => (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      {ch}
    </div>
  );

  if (view==="form_parto"&&selected) return wrap(
    <FormParto madre={selected} data={data} onSave={addParto} onCancel={()=>setView("scheda")}/>
  );
  if (view==="scheda"&&selected) return wrap(
    <SchedaPedigree
      animale={selected} data={data}
      onBack={()=>setView("lista")}
      onAddParto={a=>{setSelected(a);setView("form_parto");}}
      onSeleziona={a=>{setSelected(a);setView("scheda");}}
    />
  );
  return wrap(
    <ListaAnimali data={data} onSeleziona={a=>{setSelected(a);setView("scheda");}} onAddParto={a=>{setSelected(a);setView("form_parto");}}/>
  );
}
