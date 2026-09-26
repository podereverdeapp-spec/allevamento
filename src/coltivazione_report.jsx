// ============================================================================
// REPORT COLTIVAZIONE — v115
// ----------------------------------------------------------------------------
// Linguetta "📈 Report" della sezione Coltivazione.
// Legge la vista v_coltivazione_report_prodotti (una riga per prodotto di ogni
// coltura; i pascoli senza raccolta hanno prodotto = null).
// Metodo: il costo di ogni coltura si divide tra TUTTI i suoi prodotti (paglia e
// seme compresi) in proporzione al valore di mercato = quantita' x prezzo.
// Prezzi, peso del ballone, soglia del semaforo e rese di riferimento stanno in
// coltivazione_prezzi_mercato / coltivazione_parametri / coltivazione_benchmark_rese
// e si modificano da "⚙️ Prezzi e rese" (solo admin, lo impone anche la RLS).
// ============================================================================
import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx-js-style";
import { supabase } from "./supabase";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
};
const card = {background:C.card,borderRadius:16,padding:14,marginBottom:12,
  boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:`1px solid ${C.border}`};
const n0 = v => Math.round(v).toLocaleString("it-IT");
const n2 = v => Number(v).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2});
const n1 = v => Number(v).toLocaleString("it-IT",{maximumFractionDigits:1});
const sg = v => (v>=0?"+":"−")+n0(Math.abs(v))+" €";
const um = u => u==="balloni" ? "ballone" : u==="quintali" ? "q" : u;
const qt = v => Number(v).toLocaleString("it-IT",{maximumFractionDigits:2});

// Semaforo sul costo: verde sotto il mercato, giallo fino alla soglia, rosso oltre
const colCosto = (sc,soglia) => sc<=0 ? C.green : sc<=soglia ? C.yellow : C.red;
// Semaforo sulla resa: verde sopra il riferimento, giallo fino alla soglia sotto, rosso oltre
const colResa  = (sc,soglia) => sc>=0 ? C.green : sc>=-soglia ? C.yellow : C.red;

const Dot = ({c}) => <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:c,marginRight:6,verticalAlign:"middle",flexShrink:0}}/>;

const Titolo = ({children}) => (
  <div style={{fontSize:15,fontWeight:700,color:C.primary,margin:"18px 0 8px"}}>{children}</div>
);

// ---------------------------------------------------------------------------
export default function ReportColtivazione({campagna}){
  const [righe,setRighe]     = useState([]);
  const [par,setPar]         = useState(null);
  const [prezzi,setPrezzi]   = useState([]);
  const [bench,setBench]     = useState([]);
  const [admin,setAdmin]     = useState(false);
  const [loading,setLoading] = useState(true);
  const [errore,setErrore]   = useState("");
  const [aperta,setAperta]   = useState(null);
  const [editor,setEditor]   = useState(false);
  const [confronto,setConfronto] = useState(false);

  const carica = useCallback(async()=>{
    setLoading(true); setErrore("");
    const [r,p,pm,b] = await Promise.all([
      supabase.from("v_coltivazione_report_prodotti").select("*").eq("campagna",campagna)
        .order("campo_numero").order("ordine"),
      supabase.from("coltivazione_parametri").select("*").eq("campagna",campagna).maybeSingle(),
      supabase.from("coltivazione_prezzi_mercato").select("*").eq("campagna",campagna).order("prodotto"),
      supabase.from("coltivazione_benchmark_rese").select("*").eq("campagna",campagna).order("coltura"),
    ]);
    if(r.error){ setErrore("Errore nel caricamento del report: "+r.error.message); setLoading(false); return; }
    setRighe(r.data||[]); setPar(p.data||null); setPrezzi(pm.data||[]); setBench(b.data||[]);
    const {data:{user}} = await supabase.auth.getUser();
    if(user){
      const {data:pr} = await supabase.from("profili").select("ruolo").eq("id",user.id).maybeSingle();
      setAdmin(pr?.ruolo==="admin");
    }
    setLoading(false);
  },[campagna]);
  useEffect(()=>{ carica(); },[carica]);

  if(loading) return <div style={{...card,textAlign:"center",color:C.muted}}>Caricamento report…</div>;
  if(errore)  return <div style={{...card,color:C.red,fontWeight:600}}>⚠️ {errore}</div>;
  if(confronto) return <ConfrontoStagioni onChiudi={()=>setConfronto(false)}/>;
  if(editor)  return <PrezziRese campagna={campagna} par={par} prezzi={prezzi} bench={bench} righe={righe}
                       admin={admin} onChiudi={()=>{setEditor(false);carica();}}/>;

  if(righe.length===0) return (
    <div style={{...card,textAlign:"center",color:C.muted,padding:30}}>
      Nessuna coltura registrata nella campagna {campagna}.
    </div>
  );

  const soglia = Number(par?.soglia_semaforo ?? 0.30);
  const peso   = Number(par?.peso_ballone_kg ?? 340);

  // --- colture (una volta sola ciascuna) ------------------------------------
  const coltureMap = {};
  righe.forEach(r=>{ coltureMap[r.coltura_campo_id] = r; });
  const coltureCampo = Object.values(coltureMap);
  const costoTot = coltureCampo.reduce((s,r)=>s+Number(r.costo_totale||0),0);
  // superficie reale: ogni campo contato una volta (le 2ª colture non raddoppiano)
  const haCampo = {};
  coltureCampo.forEach(r=>{ haCampo[r.campo_numero] = Math.max(haCampo[r.campo_numero]||0, Number(r.ettari||0)); });
  const superficie = Object.values(haCampo).reduce((s,v)=>s+v,0);

  // --- prodotti raccolti, aggregati per coltura+prodotto+unita' --------------
  const prodMap = {};
  righe.filter(r=>r.prodotto).forEach(r=>{
    const k = `${r.coltura}|${r.prodotto}|${r.unita}`;
    if(!prodMap[k]) prodMap[k] = {coltura:r.coltura,prodotto:r.prodotto,unita:r.unita,quantita:0,quantita_q:0,
      costo:0,ettari:0,prezzo_unita:r.prezzo_unita==null?null:Number(r.prezzo_unita),prezzo_q:r.prezzo_q==null?null:Number(r.prezzo_q),
      bench:r.benchmark_resa_q_ha==null?null:Number(r.benchmark_resa_q_ha)};
    const a = prodMap[k];
    a.quantita += Number(r.quantita||0); a.quantita_q += Number(r.quantita_q||0);
    a.costo += Number(r.costo_attribuito||0); a.ettari += Number(r.ettari||0);
  });
  const prodotti = Object.values(prodMap).map(a=>{
    const cu = a.quantita ? a.costo/a.quantita : null;
    const conPrezzo = a.prezzo_unita!=null && a.prezzo_unita>0;
    return {...a, cu,
      sc: conPrezzo ? (cu-a.prezzo_unita)/a.prezzo_unita : null,
      euro: conPrezzo ? (a.prezzo_unita-cu)*a.quantita : null,
      resa: a.ettari ? a.quantita_q/a.ettari : null};
  });
  const perdite  = prodotti.filter(a=>a.euro!=null && a.euro<0).sort((a,b)=>a.euro-b.euro);
  const guadagni = prodotti.filter(a=>a.euro!=null && a.euro>=0).sort((a,b)=>b.euro-a.euro);
  const senzaPrezzo = prodotti.filter(a=>a.euro==null);
  const saldo = prodotti.reduce((s,a)=>s+(a.euro||0),0);
  const totPerso = perdite.reduce((s,a)=>s+a.euro,0), totGuad = guadagni.reduce((s,a)=>s+a.euro,0);

  // --- rese contro il riferimento --------------------------------------------
  const rese = prodotti.filter(a=>a.bench!=null && a.resa!=null).map(a=>{
    const dq = (a.resa-a.bench)*a.ettari;
    return {...a, scR:(a.resa-a.bench)/a.bench, dq, val: a.prezzo_q!=null ? dq*a.prezzo_q : null,
      sospetto: a.resa < a.bench*0.05};
  }).sort((a,b)=>(a.val??0)-(b.val??0));
  const totRese = rese.filter(a=>!a.sospetto).reduce((s,a)=>s+(a.val||0),0);

  // --- pascoli (colture senza raccolta) -------------------------------------
  const pascMap = {};
  coltureCampo.filter(r=>r.pascolato).forEach(r=>{
    const k=r.coltura; if(!pascMap[k]) pascMap[k]={coltura:k,campi:0,ettari:0,costo:0};
    pascMap[k].campi++; pascMap[k].ettari+=Number(r.ettari||0); pascMap[k].costo+=Number(r.costo_totale||0);
  });
  const pascoli = Object.values(pascMap);

  // --- colture e campi -------------------------------------------------------
  const colMap = {};
  coltureCampo.forEach(r=>{
    const k=r.coltura; if(!colMap[k]) colMap[k]={coltura:k,ettari:0,costo:0,semi:0,concimi:0,lav:0,campi:[]};
    const g=colMap[k]; g.ettari+=Number(r.ettari||0); g.costo+=Number(r.costo_totale||0);
    g.semi+=Number(r.costo_seme||0); g.concimi+=Number(r.costo_concime||0);
    g.lav+=Number(r.costo_lavorazioni||0)+Number(r.costo_altro||0)+Number(r.costo_fitosanitario||0);
    g.campi.push({...r, prodotti: righe.filter(x=>x.coltura_campo_id===r.coltura_campo_id && x.prodotto)});
  });
  const colturePerCosto = Object.values(colMap).sort((a,b)=>b.costo-a.costo);

  const CardProdotto = ({a}) => {
    const c = colCosto(a.sc,soglia);
    return (
      <div style={{...card,borderLeft:`5px solid ${c}`,padding:12}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"baseline"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,display:"flex",alignItems:"baseline"}}>
            <Dot c={c}/><span>{a.coltura} · {a.prodotto.toLowerCase()}: {a.sc>0
              ? `costa ${n1(a.cu/a.prezzo_unita)} volte il mercato`
              : `costa il ${Math.round(-a.sc*100)}% in meno del mercato`}</span>
          </div>
          <div style={{fontWeight:800,fontSize:17,color:c,whiteSpace:"nowrap"}}>{sg(a.euro)}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
          <div style={{background:c+"1F",borderRadius:10,padding:"6px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:c,textTransform:"uppercase"}}>Tuo costo</div>
            <div style={{fontSize:20,fontWeight:800,color:c}}>{n2(a.cu)} €</div>
            <div style={{fontSize:11,color:C.muted}}>per {um(a.unita)}</div>
          </div>
          <div style={{background:C.bg,borderRadius:10,padding:"6px 10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Mercato</div>
            <div style={{fontSize:20,fontWeight:800,color:C.text}}>{n2(a.prezzo_unita)} €</div>
            <div style={{fontSize:11,color:C.muted}}>per {um(a.unita)}</div>
          </div>
        </div>
        <div style={{fontSize:12,color:C.muted,marginTop:6}}>
          {qt(a.quantita)} {a.unita} · resa {n1(a.quantita/a.ettari)} {a.unita}/ha
        </div>
      </div>
    );
  };

  return (<>
    {/* numeri chiave */}
    <div style={{...card,background:C.primary,color:"#FFF",border:"none"}}>
      <div style={{fontSize:12,opacity:0.85,marginBottom:8}}>Campagna {campagna}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px 0",textAlign:"center"}}>
        {[[`${n2(superficie)} ha`,"superficie"],[`${n0(costoTot)} €`,"costo totale"],
          [`${n0(costoTot/(superficie||1))} €/ha`,"costo per ettaro"],[sg(saldo),"saldo contro il mercato"]].map(([v,l],i)=>(
          <div key={l}>
            <div style={{fontSize:20,fontWeight:800,color:i===3?(saldo<0?"#FFB4A8":"#B8F0C0"):"#FFF"}}>{v}</div>
            <div style={{fontSize:11,opacity:0.85}}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{background:(saldo<0?C.red:C.green)+"14",borderLeft:`4px solid ${saldo<0?C.red:C.green}`,
      borderRadius:10,padding:"10px 12px",fontSize:13,fontWeight:600,color:saldo<0?C.red:C.green,marginBottom:4}}>
      {saldo<0
        ? `Produrre ti è costato ${n0(-saldo)} € più che comprare al mercato: ${n0(-totPerso)} € persi su ${perdite.length} prodotti, ${n0(totGuad)} € guadagnati su ${guadagni.length}.`
        : `Produrre ti è costato ${n0(saldo)} € meno che comprare al mercato.`}
      {perdite[0] && ` Danno maggiore: ${perdite[0].coltura.toLowerCase()} (${sg(perdite[0].euro)}).`}
    </div>

    {perdite.length>0 && <><Titolo>🔴 Dove perdi</Titolo>{perdite.map(a=><CardProdotto key={a.coltura+a.prodotto+a.unita} a={a}/>)}</>}
    {guadagni.length>0 && <><Titolo>🟢 Dove guadagni</Titolo>{guadagni.map(a=><CardProdotto key={a.coltura+a.prodotto+a.unita} a={a}/>)}</>}
    {senzaPrezzo.length>0 && (
      <div style={{...card,fontSize:12,color:C.muted}}>
        Senza prezzo di mercato (non entrano nel saldo): {senzaPrezzo.map(a=>`${a.prodotto} (${a.unita})`).join(", ")}.
        {admin && " Aggiungili da ⚙️ Prezzi e rese."}
      </div>
    )}

    {rese.length>0 && <>
      <Titolo>📏 Rese contro il benchmark</Titolo>
      <div style={{fontSize:12,color:C.muted,margin:"-4px 0 8px"}}>Valore del prodotto mancato (−) o in più (+) rispetto alla resa di riferimento.</div>
      <div style={{...card,padding:"4px 14px"}}>
        {rese.map(a=>{
          const c = a.sospetto ? C.muted : colResa(a.scR,soglia);
          return (
            <div key={a.coltura+a.prodotto} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"9px 0",borderTop:`1px solid ${C.border}55`,fontSize:13}}>
              <div style={{display:"flex",alignItems:"baseline"}}><Dot c={c}/>
                <div><div style={{fontWeight:600}}>{a.coltura} · {a.prodotto.toLowerCase()}</div>
                  <div style={{fontSize:12,color:C.muted}}>{n1(a.resa)} contro {n1(a.bench)} q/ha{a.sospetto?" — dato da verificare (unità?)":""}</div></div>
              </div>
              <div style={{fontWeight:800,color:c,whiteSpace:"nowrap"}}>{a.sospetto ? "⚠" : a.val!=null ? sg(a.val) : "—"}</div>
            </div>
          );
        })}
        <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderTop:`1.5px solid ${C.border}`,fontWeight:700,fontSize:13}}>
          <span>Totale{rese.some(a=>a.sospetto)?" (esclusi i dati da verificare)":""}</span><span style={{color:totRese<0?C.red:C.green}}>{sg(totRese)}</span>
        </div>
      </div>
    </>}

    {pascoli.length>0 && <>
      <Titolo>🐑 Pascoli</Titolo>
      <div style={{...card,padding:"4px 14px"}}>
        {pascoli.map(p=>(
          <div key={p.coltura} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderTop:`1px solid ${C.border}55`,fontSize:13}}>
            <span><b>{p.coltura}</b> · {p.campi} camp{p.campi===1?"o":"i"} · {n2(p.ettari)} ha</span>
            <span style={{fontWeight:700}}>{n0(p.costo/p.ettari)} €/ha</span>
          </div>
        ))}
      </div>
    </>}

    <Titolo>🌱 Colture e campi</Titolo>
    <div style={{fontSize:12,color:C.muted,margin:"-4px 0 8px"}}>Tocca una coltura per vedere i campi.</div>
    {colturePerCosto.map(g=>{
      const open = aperta===g.coltura;
      return (
        <div key={g.coltura} style={{...card,padding:12}}>
          <div onClick={()=>setAperta(open?null:g.coltura)} style={{display:"flex",justifyContent:"space-between",cursor:"pointer",fontWeight:700,color:C.primary,fontSize:14}}>
            <span>{open?"▾":"▸"} {g.coltura} · {n2(g.ettari)} ha</span><span>{n0(g.costo/g.ettari)} €/ha</span>
          </div>
          {open && <div style={{marginTop:8,fontSize:13}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:`1px solid ${C.border}55`}}><span>Costo totale</span><b>{n0(g.costo)} €</b></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:`1px solid ${C.border}55`}}><span>Semi · concimi · lavorazioni</span><b>{n0(g.semi/g.ettari)} · {n0(g.concimi/g.ettari)} · {n0(g.lav/g.ettari)} €/ha</b></div>
            {g.campi.map(k=>(
              <div key={k.coltura_campo_id} style={{padding:"8px 0",borderTop:`1px solid ${C.border}55`}}>
                <div style={{fontWeight:700}}>N. {k.campo_numero} · {k.campo}{k.ordine>1?" (2ª coltura)":""}</div>
                <div style={{fontSize:12,color:C.muted}}>{n2(k.ettari)} ha · {n0(k.costo_totale)} € · {n0(k.costo_totale/k.ettari)} €/ha</div>
                {k.prodotti.length===0 && <div style={{fontSize:12,marginTop:3}}>Pascolato, nessuna raccolta</div>}
                {k.prodotti.map(p=>{
                  const conP = p.prezzo_unita!=null && Number(p.prezzo_unita)>0;
                  const sc = conP ? (p.costo_unitario-p.prezzo_unita)/p.prezzo_unita : null;
                  const c = sc==null ? C.muted : colCosto(sc,soglia);
                  return (
                    <div key={p.prodotto+p.unita} style={{fontSize:12.5,marginTop:4,display:"flex",alignItems:"baseline"}}>
                      <Dot c={c}/>
                      <span>{p.prodotto}: {qt(p.quantita)} {p.unita} a <b style={{color:c}}>{n2(p.costo_unitario)} €/{um(p.unita)}</b>
                        {conP && <span style={{color:C.muted}}> (mercato {n2(p.prezzo_unita)})</span>}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>}
        </div>
      );
    })}

    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16}}>
      <button onClick={()=>esportaExcel({campagna,righe,prodotti,perdite,guadagni,rese,pascoli,colturePerCosto,superficie,costoTot,saldo,prezzi,bench,peso,soglia})}
        style={{background:C.green,color:"#FFF",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
        📥 Esporta Excel
      </button>
      <button onClick={()=>setEditor(true)}
        style={{background:"#FFF",color:C.primary,border:`1.5px solid ${C.primary}`,borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
        ⚙️ Prezzi e rese
      </button>
      <button onClick={()=>setConfronto(true)}
        style={{background:"#FFF",color:C.blue,border:`1.5px solid ${C.blue}`,borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
        📅 Confronto tra stagioni
      </button>
    </div>

    <details style={{...card,marginTop:12,fontSize:12,color:C.muted}}>
      <summary style={{cursor:"pointer",fontWeight:700,color:C.primary}}>Metodo e fonti</summary>
      <p>Costo di ogni coltura = semi + concimi + lavorazioni + altro, dalle schede campo.</p>
      <p>Il costo si divide tra tutti i prodotti raccolti (paglia e seme compresi) in proporzione al valore di mercato: quantità × prezzo. Ballone = {n0(peso)} kg.</p>
      <p>Semaforo: verde sotto il mercato, giallo fino al {Math.round(soglia*100)}% sopra, rosso oltre. I pascoli non hanno un prezzo di mercato e non entrano nel saldo.</p>
      {prezzi.map(p=><div key={p.id}>• {p.prodotto} ({p.unita_raccolta}): {n2(p.prezzo_q)} €/q — {p.fonte}</div>)}
    </details>
  </>);
}

// ============================================================================
// CONFRONTO TRA STAGIONI — tutte le campagne affiancate
// ============================================================================
const campagneDa2019 = () => {
  const d = new Date(); const a = d.getMonth()>=8 ? d.getFullYear() : d.getFullYear()-1;
  const out = []; for(let x=2019; x<=a; x++) out.push(`${x}/${x+1}`); return out;
};
function ConfrontoStagioni({onChiudi}){
  const [righe,setRighe] = useState(null); const [err,setErr] = useState("");
  useEffect(()=>{ (async()=>{
    const {data,error} = await supabase.from("v_coltivazione_report_prodotti").select("*");
    if(error) setErr(error.message); else setRighe(data||[]);
  })(); },[]);
  if(err) return <div style={{...card,color:C.red}}>⚠️ {err}</div>;
  if(!righe) return <div style={{...card,textAlign:"center",color:C.muted}}>Caricamento…</div>;

  const stag = campagneDa2019().map(cp=>{
    const rr = righe.filter(r=>r.campagna===cp);
    const col = {}; rr.forEach(r=>{ col[r.coltura_campo_id]=r; });
    const cc = Object.values(col);
    const haC = {}; cc.forEach(r=>{ haC[r.campo_numero]=Math.max(haC[r.campo_numero]||0,Number(r.ettari||0)); });
    const ha = Object.values(haC).reduce((s,v)=>s+v,0);
    const costo = cc.reduce((s,r)=>s+Number(r.costo_totale||0),0);
    const conPrezzo = rr.filter(r=>r.prodotto && r.prezzo_unita!=null && Number(r.prezzo_unita)>0);
    const saldo = conPrezzo.reduce((s,r)=>s+(Number(r.prezzo_unita)-Number(r.costo_unitario))*Number(r.quantita),0);
    return {cp, caricata:rr.length>0, ha, costo, eha: ha?costo/ha:null, saldo: (costo>0&&conPrezzo.length)?saldo:null};
  }).reverse();

  // produzione per prodotto e stagione
  const prodotti = {};
  righe.filter(r=>r.prodotto).forEach(r=>{
    const k=`${r.prodotto}|${r.unita}`; if(!prodotti[k]) prodotti[k]={prodotto:r.prodotto,unita:r.unita,per:{}};
    const p=prodotti[k].per[r.campagna] || (prodotti[k].per[r.campagna]={q:0,costo:0,ha:0});
    p.q+=Number(r.quantita||0); p.costo+=Number(r.costo_attribuito||0); p.ha+=Number(r.ettari||0);
  });
  const listaProd = Object.values(prodotti).sort((a,b)=>Object.keys(b.per).length-Object.keys(a.per).length);
  const th = {background:C.primary,color:"#FFF",padding:"6px 5px",fontSize:11,textAlign:"right"};
  const td = {padding:"7px 5px",borderTop:`1px solid ${C.border}55`,fontSize:12,textAlign:"right"};

  return (<>
    <button onClick={onChiudi} style={{background:"none",border:"none",color:C.primary,fontWeight:700,fontSize:14,cursor:"pointer",padding:"4px 0",marginBottom:8}}>← Torna al report</button>
    <div style={{fontSize:16,fontWeight:700,color:C.primary,marginBottom:8}}>📅 Confronto tra stagioni</div>
    <div style={{margin:"0 0 12px",padding:"8px 10px",borderRadius:8,background:C.blue+"14",borderLeft:`4px solid ${C.blue}`,fontSize:12.5,lineHeight:1.4}}>
      <b style={{color:C.blue}}>📅 Confronto</b> · Tutte le stagioni caricate, affiancate: superficie, costo per ettaro, saldo contro il mercato e produzione dei prodotti.
    </div>
    <div style={{...card,padding:8,overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr><th style={{...th,textAlign:"left"}}>Stagione</th><th style={th}>Ha</th><th style={th}>Costo</th><th style={th}>€/ha</th><th style={th}>Saldo</th></tr></thead>
        <tbody>{stag.map(s=>(
          <tr key={s.cp}>
            <td style={{...td,textAlign:"left",fontWeight:700}}>{s.cp}</td>
            {!s.caricata ? <td colSpan={4} style={{...td,color:C.muted}}>non caricata</td> : <>
              <td style={td}>{n2(s.ha)}</td>
              {s.costo>0 ? <><td style={td}>{n0(s.costo)} €</td><td style={{...td,fontWeight:700}}>{n0(s.eha)}</td></>
                         : <td colSpan={2} style={{...td,color:C.muted}}>costi non caricati</td>}
              <td style={{...td,fontWeight:700,color:s.saldo==null?C.muted:s.saldo<0?C.red:C.green}}>
                {s.saldo==null ? (s.costo>0?"prezzi da inserire":"—") : sg(s.saldo)}</td>
            </>}
          </tr>))}</tbody>
      </table>
    </div>
    {listaProd.map(p=>{
      const anni = campagneDa2019().filter(cp=>p.per[cp]);
      const max = Math.max(...anni.map(cp=>p.per[cp].q));
      return (
        <div key={p.prodotto+p.unita} style={{...card,padding:12}}>
          <div style={{fontWeight:700,color:C.primary,fontSize:13,marginBottom:6}}>{p.prodotto} · {p.unita} raccolti</div>
          {anni.map(cp=>{ const x=p.per[cp]; return (
            <div key={cp} style={{display:"grid",gridTemplateColumns:"70px 1fr 64px 86px",gap:6,alignItems:"center",fontSize:12,marginBottom:3}}>
              <span>{cp}</span>
              <div style={{height:7,borderRadius:3,background:C.accent,width:`${max?x.q/max*100:0}%`}}/>
              <b style={{textAlign:"right"}}>{qt(x.q)}</b>
              <span style={{textAlign:"right",color:C.muted}}>{x.costo>0?`${n2(x.costo/x.q)} €/${um(p.unita)}`:""}</span>
            </div>); })}
        </div>
      );
    })}
  </>);
}

// ============================================================================
// PREZZI E RESE — modifica dei parametri della campagna (solo admin)
// ============================================================================
function PrezziRese({campagna,par,prezzi,bench,righe,admin,onChiudi}){
  const [peso,setPeso]     = useState(par?.peso_ballone_kg ?? 340);
  const [soglia,setSoglia] = useState(Math.round((par?.soglia_semaforo ?? 0.30)*100));
  // una riga per ogni prodotto raccolto nella campagna, anche se non ha ancora un prezzo
  const prodotti = [];
  righe.filter(r=>r.prodotto).forEach(r=>{
    if(!prodotti.some(p=>p.prodotto===r.prodotto&&p.unita===r.unita)) prodotti.push({prodotto:r.prodotto,unita:r.unita});
  });
  const [pz,setPz] = useState(prodotti.map(p=>{
    const x = prezzi.find(q=>q.prodotto===p.prodotto&&q.unita_raccolta===p.unita);
    return {...p, prezzo:x?.prezzo_q ?? "", fonte:x?.fonte ?? ""};
  }));
  const coppie = [];
  righe.filter(r=>r.prodotto).forEach(r=>{
    if(!coppie.some(p=>p.coltura===r.coltura&&p.prodotto===r.prodotto)) coppie.push({coltura:r.coltura,prodotto:r.prodotto});
  });
  const [bm,setBm] = useState(coppie.map(p=>{
    const x = bench.find(q=>q.coltura===p.coltura&&q.prodotto===p.prodotto);
    return {...p, resa:x?.resa_q_ha ?? "", fonte:x?.fonte ?? ""};
  }));
  const [msg,setMsg] = useState(""); const [salvo,setSalvo] = useState(false);

  const salva = async()=>{
    setSalvo(true); setMsg("");
    const e1 = await supabase.from("coltivazione_parametri").upsert(
      {campagna,peso_ballone_kg:Number(peso),soglia_semaforo:Number(soglia)/100,updated_at:new Date().toISOString()},{onConflict:"campagna"});
    const rp = pz.filter(p=>p.prezzo!==""&&!isNaN(p.prezzo)).map(p=>({campagna,prodotto:p.prodotto,unita_raccolta:p.unita,
      prezzo_q:Number(p.prezzo),fonte:p.fonte||null,updated_at:new Date().toISOString()}));
    const e2 = rp.length ? await supabase.from("coltivazione_prezzi_mercato").upsert(rp,{onConflict:"campagna,prodotto,unita_raccolta"}) : {};
    const rb = bm.filter(p=>p.resa!==""&&!isNaN(p.resa)).map(p=>({campagna,coltura:p.coltura,prodotto:p.prodotto,
      resa_q_ha:Number(p.resa),fonte:p.fonte||null,updated_at:new Date().toISOString()}));
    const e3 = rb.length ? await supabase.from("coltivazione_benchmark_rese").upsert(rb,{onConflict:"campagna,coltura,prodotto"}) : {};
    const err = e1.error||e2.error||e3.error;
    setSalvo(false);
    if(err) setMsg("⚠️ Non salvato: "+err.message); else onChiudi();
  };

  const inp = {border:`1.5px solid ${C.border}`,borderRadius:8,padding:"6px 8px",fontSize:14,width:78,textAlign:"right",
    background:admin?"#FFF8D6":"#EEE",fontWeight:700,color:C.text};
  const riga = {display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"8px 0",borderTop:`1px solid ${C.border}55`,fontSize:13};

  return (<>
    <button onClick={onChiudi} style={{background:"none",border:"none",color:C.primary,fontWeight:700,fontSize:14,cursor:"pointer",padding:"4px 0",marginBottom:8}}>← Torna al report</button>
    <div style={card}>
      <div style={{fontSize:16,fontWeight:700,color:C.primary,marginBottom:4}}>⚙️ Prezzi e rese · {campagna}</div>
      {!admin && <div style={{fontSize:12,color:C.muted,marginBottom:6}}>Solo un utente admin può modificare questi valori.</div>}
      <div style={riga}><span>Peso di un ballone</span><span><input id="peso-ballone" style={inp} disabled={!admin} value={peso} onChange={e=>setPeso(e.target.value)}/> kg</span></div>
      <div style={riga}><span>Soglia del semaforo</span><span><input id="soglia" style={inp} disabled={!admin} value={soglia} onChange={e=>setSoglia(e.target.value)}/> %</span></div>
    </div>
    <div style={card}>
      <div style={{fontSize:14,fontWeight:700,color:C.primary}}>Prezzi di mercato (€/q)</div>
      <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Per i prodotti in balloni il report calcola il prezzo a ballone con il peso qui sopra.</div>
      {pz.map((p,i)=>(
        <div key={p.prodotto+p.unita} style={{...riga,flexDirection:"column",alignItems:"stretch"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{p.prodotto} <span style={{color:C.muted}}>({p.unita})</span></span>
            <span><input id={`prezzo-${i}`} style={inp} disabled={!admin} value={p.prezzo}
              onChange={e=>setPz(pz.map((x,j)=>j===i?{...x,prezzo:e.target.value.replace(",",".")}:x))}/> €/q</span>
          </div>
          <input id={`fonte-${i}`} disabled={!admin} placeholder="Fonte" value={p.fonte}
            onChange={e=>setPz(pz.map((x,j)=>j===i?{...x,fonte:e.target.value}:x))}
            style={{marginTop:4,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 6px",fontSize:11,color:C.muted}}/>
        </div>
      ))}
    </div>
    <div style={card}>
      <div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:4}}>Rese di riferimento (q/ha)</div>
      {bm.map((p,i)=>(
        <div key={p.coltura+p.prodotto} style={{...riga,flexDirection:"column",alignItems:"stretch"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{p.coltura} · {p.prodotto.toLowerCase()}</span>
            <span><input id={`resa-${i}`} style={inp} disabled={!admin} value={p.resa}
              onChange={e=>setBm(bm.map((x,j)=>j===i?{...x,resa:e.target.value.replace(",",".")}:x))}/> q/ha</span>
          </div>
          <input id={`fonte-resa-${i}`} disabled={!admin} placeholder="Fonte" value={p.fonte}
            onChange={e=>setBm(bm.map((x,j)=>j===i?{...x,fonte:e.target.value}:x))}
            style={{marginTop:4,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 6px",fontSize:11,color:C.muted}}/>
        </div>
      ))}
    </div>
    {msg && <div style={{...card,color:C.red,fontWeight:600}}>{msg}</div>}
    {admin && <button onClick={salva} disabled={salvo}
      style={{width:"100%",background:C.green,color:"#FFF",border:"none",borderRadius:12,padding:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>
      {salvo?"Salvataggio…":"💾 Salva e ricalcola"}</button>}
  </>);
}

// ============================================================================
// EXPORT EXCEL — Century Gothic, intestazione bloccata, filtro, colori Podere Verde
// ============================================================================
function esportaExcel(d){
  const F = "Century Gothic";
  const H = {font:{name:F,bold:true,color:{rgb:"FFFFFF"},sz:10},fill:{fgColor:{rgb:"2E5E2B"}},alignment:{wrapText:true,vertical:"center",horizontal:"center"}};
  const B = {font:{name:F,sz:10}};
  const T = {font:{name:F,sz:14,bold:true,color:{rgb:"2E5E2B"}}};
  const S = {font:{name:F,sz:12,bold:true,color:{rgb:"2E5E2B"}}};
  const col = hex => ({font:{name:F,sz:10,bold:true,color:{rgb:hex.replace("#","")}}});
  const EUR = '#,##0.00 "€"', EURS = '+#,##0.00 "€";-#,##0.00 "€"', PCT='0.0%', NUM='#,##0.00';
  const c  = (v,s=B,z) => ({v, t:typeof v==="number"?"n":"s", s, ...(z?{z}:{})});
  const semCosto = sc => sc<=0?"● sotto mercato":sc<=d.soglia?"● poco sopra":"● sopra mercato";
  const hexCosto = sc => sc<=0?"2E9E3A":sc<=d.soglia?"E6A100":"D32F2F";

  // --- REPORT
  const R = [];
  R.push([c(`PODERE VERDE — REPORT COLTIVAZIONI, CAMPAGNA ${d.campagna}`,T)]);
  R.push([c(`Ballone ${d.peso} kg · soglia semaforo ${Math.round(d.soglia*100)}% · costo diviso tra i prodotti in proporzione al valore di mercato`,{font:{name:F,sz:9,italic:true,color:{rgb:"555555"}}})]);
  R.push([]);
  R.push(["Superficie (ha)","Costo totale €","Costo per ettaro €","Saldo contro il mercato €"].map(x=>c(x,H)));
  R.push([c(d.superficie,{font:{name:F,sz:14,bold:true}},NUM),c(d.costoTot,{font:{name:F,sz:14,bold:true}},EUR),
    c(d.costoTot/(d.superficie||1),{font:{name:F,sz:14,bold:true}},EUR),c(d.saldo,{font:{name:F,sz:14,bold:true,color:{rgb:d.saldo<0?"D32F2F":"2E9E3A"}}},EURS)]);
  const intest = ["Coltura","Prodotto","Quantità","U.M.","Resa per ha","Costo per unità €","Mercato per unità €","Scostamento %","Euro guadagnati (+) o persi (−)","Esito"];
  const blocco = (titolo,lista)=>{
    R.push([]); R.push([c(titolo,S)]); R.push(intest.map(x=>c(x,H)));
    lista.forEach(a=>{ const s=col(hexCosto(a.sc));
      R.push([c(a.coltura),c(a.prodotto),c(a.quantita,B,NUM),c(a.unita),c(a.quantita/a.ettari,B,NUM),
        c(a.cu,{font:{name:F,sz:12,bold:true}},EUR),c(a.prezzo_unita,{font:{name:F,sz:12,bold:true},fill:{fgColor:{rgb:"E8EEE4"}}},EUR),
        c(a.sc,s,PCT),c(a.euro,s,EURS),c(semCosto(a.sc),s)]); });
    R.push([c("Totale",{font:{name:F,bold:true}}),"","","","","","","",c(lista.reduce((x,a)=>x+a.euro,0),{font:{name:F,bold:true}},EURS)]);
  };
  if(d.perdite.length) blocco("DOVE PERDI — prodotti che ti sono costati più del mercato",d.perdite);
  if(d.guadagni.length) blocco("DOVE GUADAGNI — prodotti che ti sono costati meno del mercato",d.guadagni);
  if(d.rese.length){
    R.push([]); R.push([c("RESE CONTRO IL BENCHMARK — valore del prodotto mancato (−) o in più (+)",S)]);
    R.push(["Coltura","Prodotto","Ettari","Tua resa q/ha","Benchmark q/ha","Scostamento %","Prezzo mercato €/q","Differenza q totali","Valore scostamento €","Esito"].map(x=>c(x,H)));
    d.rese.forEach(a=>{ const hx=a.sospetto?"8B7355":a.scR>=0?"2E9E3A":a.scR>=-d.soglia?"E6A100":"D32F2F"; const s=col(hx);
      R.push([c(a.coltura),c(a.prodotto),c(a.ettari,B,NUM),c(a.resa,{font:{name:F,bold:true}},"0.0"),c(a.bench,B,"0.0"),c(a.scR,s,PCT),
        c(a.prezzo_q??0,B,EUR),c(a.dq,B,"+0.0;-0.0"),c(a.val??0,s,EURS),
        c(a.sospetto?"● da verificare (unità?)":a.scR>=0?"● sopra benchmark":a.scR>=-d.soglia?"● poco sotto":"● sotto benchmark",s)]); });
  }
  if(d.pascoli.length){
    R.push([]); R.push([c("PASCOLI — nessuna raccolta",S)]);
    R.push(["Coltura","N. campi","Ettari","Costo €","€/ha"].map(x=>c(x,H)));
    d.pascoli.forEach(p=>R.push([c(p.coltura),c(p.campi),c(p.ettari,B,NUM),c(p.costo,B,EUR),c(p.costo/p.ettari,{font:{name:F,bold:true}},EUR)]));
  }
  R.push([]); R.push([c("COSTI PER COLTURA",S)]);
  R.push(["Coltura","N. campi","Ettari","Costo totale €","€/ha","Semi €/ha","Concimi €/ha","Lavorazioni €/ha"].map(x=>c(x,H)));
  d.colturePerCosto.forEach(g=>R.push([c(g.coltura),c(g.campi.length),c(g.ettari,B,NUM),c(g.costo,B,EUR),c(g.costo/g.ettari,{font:{name:F,bold:true}},EUR),
    c(g.semi/g.ettari,B,EUR),c(g.concimi/g.ettari,B,EUR),c(g.lav/g.ettari,B,EUR)]));
  const ws1 = XLSX.utils.aoa_to_sheet(R);
  ws1["!cols"] = [22,24,11,11,11,15,15,12,15,20].map(w=>({wch:w}));
  ws1["!freeze"] = {xSplit:0,ySplit:5};

  // --- DETTAGLIO CAMPI
  const D2 = [["N.","Campo","Coltura","Ettari","Semi €","Concimi €","Lavorazioni €","Costo coltura €","€/ha","Prodotto","Quantità","U.M.","Mercato per unità €","Valore di mercato €","Quota","Costo attribuito €","Costo per unità €","Scostamento %","Euro (+/−)","Esito"].map(x=>c(x,H))];
  d.righe.forEach(r=>{
    const conP = r.prezzo_unita!=null && Number(r.prezzo_unita)>0;
    const sc = conP && r.prodotto ? (r.costo_unitario-r.prezzo_unita)/r.prezzo_unita : null;
    const s = sc==null?B:col(hexCosto(sc));
    D2.push([c(r.campo_numero),c(r.campo+(r.ordine>1?" (2ª coltura)":"")),c(r.coltura),c(Number(r.ettari),B,NUM),c(Number(r.costo_seme),B,EUR),c(Number(r.costo_concime),B,EUR),
      c(Number(r.costo_lavorazioni)+Number(r.costo_altro||0)+Number(r.costo_fitosanitario||0),B,EUR),c(Number(r.costo_totale),B,EUR),c(Number(r.costo_per_ettaro),B,EUR),
      c(r.prodotto||"Pascolo"),c(r.prodotto?Number(r.quantita):Number(r.ettari),B,NUM),c(r.prodotto?r.unita:"ha"),
      conP?c(Number(r.prezzo_unita),B,EUR):c(""),conP?c(Number(r.valore_mercato),B,EUR):c(""),r.prodotto?c(Number(r.quota),B,PCT):c(""),
      c(Number(r.costo_attribuito),B,EUR),r.prodotto?c(Number(r.costo_unitario),{font:{name:F,bold:true}},EUR):c(Number(r.costo_per_ettaro),{font:{name:F,bold:true}},EUR),
      sc==null?c(""):c(sc,s,PCT),sc==null?c(""):c((r.prezzo_unita-r.costo_unitario)*r.quantita,s,EURS),c(sc==null?(r.prodotto?"— senza prezzo":"— pascolo (€/ha)"):semCosto(sc),s)]);
  });
  const ws2 = XLSX.utils.aoa_to_sheet(D2);
  ws2["!cols"] = [5,30,15,8,11,11,12,13,11,22,10,9,12,12,8,13,13,11,12,18].map(w=>({wch:w}));
  ws2["!freeze"] = {xSplit:0,ySplit:1};
  ws2["!autofilter"] = {ref:`A1:T${D2.length}`};

  // --- PREZZI E RESE
  const P = [[c(`Parametri campagna ${d.campagna}`,S)],[c("Peso ballone (kg)"),c(d.peso)],[c("Soglia semaforo"),c(d.soglia,B,PCT)],[],
    ["Prodotto","U.M. raccolta","Prezzo €/q","Fonte"].map(x=>c(x,H))];
  d.prezzi.forEach(p=>P.push([c(p.prodotto),c(p.unita_raccolta),c(Number(p.prezzo_q),B,EUR),c(p.fonte||"")]));
  P.push([]); P.push(["Coltura","Prodotto","Resa benchmark q/ha","Fonte"].map(x=>c(x,H)));
  d.bench.forEach(b=>P.push([c(b.coltura),c(b.prodotto),c(Number(b.resa_q_ha),B,"0.0"),c(b.fonte||"")]));
  const ws3 = XLSX.utils.aoa_to_sheet(P);
  ws3["!cols"] = [26,24,18,70].map(w=>({wch:w}));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws1,"REPORT");
  XLSX.utils.book_append_sheet(wb,ws2,"DETTAGLIO CAMPI");
  XLSX.utils.book_append_sheet(wb,ws3,"PREZZI E RESE");
  XLSX.writeFile(wb,`Report_Coltivazioni_${d.campagna.replace("/","_")}.xlsx`);
}
