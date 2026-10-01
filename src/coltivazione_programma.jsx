// v117 — Programma di semina e concimazione della campagna, da consultare.
// Legge il piano (colture_campo della campagna) e le dosi di coltivazione_programma:
// per ogni campo cosa si semina e si concima, la dose per ettaro e la quantità totale,
// con le istruzioni della scheda campi; in più l'elenco di cosa comprare.
// È un PIANO: le operazioni eseguite si registrano come sempre nella scheda del campo.
import { useState, useEffect } from "react";
import { t } from "./i18n";   // v119 — lingue
import { supabase } from "./supabase";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
};
const card = {background:C.card,borderRadius:16,padding:14,marginBottom:12,
  boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:`1px solid ${C.border}`};
const num = (v,d=0) => Number(v).toLocaleString("it-IT",{minimumFractionDigits:d,maximumFractionDigits:d});
const numVar = v => Number(v).toLocaleString("it-IT",{maximumFractionDigits:2});
const eur = v => num(v,2)+" €";
const COL_COLTURA = {"Erba medica":"#C6E0B4","Erbaio misto":"#E2EFDA","Orzo":"#F8CBAD","Avena":"#FFE699",
  "Trifoglio alessandrino":"#F4B6C2","Trifoglio sotterraneo":"#F4B6C2","Sulla":"#D9C3E9","Favino":"#D6B99A",
  "Pascolo erbaio":"#DDEBF7","Sorgo":"#EDEDED","Incolto":"#EEEEEE"};
const nomeColtura = c => { const s = c.coltura==="Altro" ? (c.coltura_altro||"Altro") : c.coltura;
  return s ? s.charAt(0).toUpperCase()+s.slice(1).toLowerCase() : ""; };
const unitaHa = u => t(u==="confezione" ? "confezioni per ettaro" : "kg per ettaro");
const unitaTot = (q,u) => u==="confezione" ? t("{0} confezioni",{0:num(Math.ceil(q-1e-9))}) : `${numVar(q)} kg`;
// dalla nota del piano tolgo l'intestazione e le righe SEMI/CONCIMI, che qui sono già in tabella
const istruzioni = nota => (nota||"")
  .replace(/^Piano 20\d\d\/\d\d \([^)]*\)\.\s*/,"")
  .replace(/SEMI:[^]*?\.(?= [A-ZÈ]|$)\s*/,"")
  .replace(/CONCIMI:[^]*?\.(?= [A-ZÈ]|$)\s*/,"")
  .trim();

export default function ProgrammaColtivazione({campagna}){
  const [dati,setDati] = useState(null);
  const [err,setErr]   = useState("");
  const [vista,setVista] = useState("campi");
  const [aperti,setAperti] = useState({});

  useEffect(()=>{ let vivo=true; setDati(null); setErr("");
    (async()=>{
      const cc = await supabase.from("colture_campo")
        .select("id,campo_id,ordine,porzione,coltura,coltura_altro,ettari,note,campi(numero,nome,ettari)")
        .eq("campagna",campagna);
      if(cc.error){ if(vivo) setErr(t("Errore nel caricamento del piano: ")+cc.error.message); return; }
      const ids = (cc.data||[]).map(x=>x.id);
      let pr = {data:[]};
      if(ids.length){
        pr = await supabase.from("coltivazione_programma").select("*").in("coltura_campo_id",ids).order("ordine");
        if(pr.error){ if(vivo) setErr(t("Errore nel caricamento del programma: ")+pr.error.message); return; }
      }
      if(vivo) setDati(costruisci(cc.data||[], pr.data||[]));
    })();
    return ()=>{ vivo=false; };
  },[campagna]);

  if(err) return <div style={{...card,color:C.red,fontWeight:600}}>⚠️ {err}</div>;
  if(!dati) return <div style={{...card,textAlign:"center",color:C.muted}}>{t("Caricamento del programma…")}</div>;
  if(!dati.righe) return <div style={{...card,textAlign:"center",color:C.muted}}>
    {t("Per la campagna")} {campagna} {t("non c'è ancora un programma di semina e concimazione.")}</div>;

  const VISTE=[{id:"campi",l:"🗺️ Per campo"},{id:"acquisti",l:"🛒 Da acquistare"}];
  return (<>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
      {VISTE.map(v=>(
        <button key={v.id} onClick={()=>setVista(v.id)}
          style={{background:vista===v.id?C.accent:"#FFF",color:vista===v.id?"#FFF":C.text,
            border:`1.5px solid ${vista===v.id?C.accent:C.border}`,borderRadius:10,padding:"9px 6px",
            fontSize:13,fontWeight:600,cursor:"pointer"}}>{v.l}</button>))}
    </div>
    <div style={{...card,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#FAF7F2"}}>
      <div style={{fontSize:13,color:C.muted}}>{t("Semi e concimi")} {campagna}<br/>
        <span style={{fontSize:12}}>{dati.campi.length} {t("campi ·")} {num(dati.ettari,2)} {t("ettari")}</span></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:800,color:C.primary}}>{eur(dati.totale)}</div>
        <div style={{fontSize:11,color:C.muted}}>{t("semi")} {eur(dati.semi)} {t("· concimi")} {eur(dati.concimi)}</div></div>
    </div>
    {vista==="campi" && dati.campi.map(k=>(
      <div key={k.numero} style={{...card,padding:0,overflow:"hidden"}}>
        <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontWeight:800,fontSize:15,color:C.primary}}>{k.numero} — {k.nome}</div>
          <div style={{fontSize:12,color:C.muted}}>{num(k.ettari,2)} {t("ettari")}</div>
        </div>
        {k.colture.map(c=>{
          const ist = istruzioni(c.note); const ap = aperti[c.id];
          return (
          <div key={c.id} style={{borderBottom:`1px solid ${C.border}66`}}>
            <div style={{padding:"8px 12px",background:COL_COLTURA[c.nome]||"#F3F3F3",display:"flex",justifyContent:"space-between",gap:8}}>
              <b style={{fontSize:14}}>{c.nome}{c.porzione?t(" · porzione {0}",{0:(c.porzione)}):""}{c.ordine>1?t(" · seconda coltura"):""}</b>
              <span style={{fontSize:12,whiteSpace:"nowrap"}}>{num(c.ha,2)} {t("ha")}</span>
            </div>
            <div style={{padding:"4px 12px 8px"}}>
              {c.righe.length===0 && <div style={{fontSize:13,color:C.muted,padding:"6px 0"}}>{t("Niente da seminare né da concimare.")}</div>}
              {c.righe.map(r=>(
                <div key={r.id} style={{display:"flex",gap:8,padding:"6px 0",borderTop:`1px solid ${C.border}44`,alignItems:"flex-start"}}>
                  <span style={{fontSize:16,lineHeight:"18px"}}>{r.tipo==="Seme"?"🌱":"🧪"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600}}>{t(r.prodotto)}</div>
                    <div style={{fontSize:12,color:C.muted}}>{numVar(r.dose_ha)} {unitaHa(r.unita)}{r.nota?` · ${r.nota}`:""}</div>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,whiteSpace:"nowrap",color:C.primary}}>{unitaTot(r.q,r.unita)}</div>
                </div>))}
              {ist && <>
                <button onClick={()=>setAperti({...aperti,[c.id]:!ap})}
                  style={{marginTop:6,background:"none",border:"none",color:C.blue,fontSize:13,fontWeight:600,padding:0,cursor:"pointer"}}>
                  {ap?t("▾ Nascondi le istruzioni"):t("▸ Istruzioni per semina e concimazione")}</button>
                {ap && <div style={{fontSize:12.5,lineHeight:1.45,marginTop:6,padding:"8px 10px",background:C.blue+"10",borderRadius:8,whiteSpace:"pre-wrap"}}>
                  {ist.replace(/ (SEMINA|CONCIMAZIONE): /g,"\n\n$1: ")}</div>}
              </>}
            </div>
          </div>);})}
      </div>))}
    {vista==="acquisti" && ["Seme","Concime"].map(tx=>{
      const xs = dati.prodotti.filter(p=>p.tipo===tx); if(!xs.length) return null;
      return (<div key={tx} style={card}>
        <div style={{fontWeight:800,color:C.primary,marginBottom:6}}>{tx==="Seme"?t("🌱 Semi"):t("🧪 Concimi")}</div>
        {xs.map(p=>(
          <div key={p.prodotto} style={{padding:"7px 0",borderTop:`1px solid ${C.border}66`}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
              <b style={{fontSize:13}}>{t(p.prodotto)}</b>
              <b style={{fontSize:13,whiteSpace:"nowrap",color:C.primary}}>{unitaTot(p.q,p.unita)}</b>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",gap:8,fontSize:12,color:C.muted}}>
              <span>{t("campi")} {p.campi.join(", ")}</span>
              <span style={{whiteSpace:"nowrap"}}>{p.prezzo!=null?`${eur(p.prezzo)} · ${eur(p.costo)}`:t("prezzo non indicato")}</span>
            </div>
          </div>))}
        <div style={{display:"flex",justifyContent:"space-between",borderTop:`2px solid ${C.border}`,paddingTop:6,marginTop:4,fontWeight:800}}>
          <span>{t("Totale")} {tx==="Seme"?t("semi"):t("concimi")}</span><span>{eur(tx==="Seme"?dati.semi:dati.concimi)}</span></div>
      </div>);})}
    <div style={{fontSize:11.5,color:C.muted,lineHeight:1.4,marginTop:6}}>
      {t("È il programma della campagna: le quantità sono dose per ettaro × ettari della coltura. Le confezioni sono arrotondate per eccesso. Semine, concimazioni e lavorazioni eseguite si registrano nella scheda del campo, linguetta 🗺️ Campi.")}
    </div>
  </>);
}

function costruisci(colture, programma){
  if(!programma.length) return {righe:0};
  const perCC = {}; programma.forEach(p=>{ (perCC[p.coltura_campo_id]=perCC[p.coltura_campo_id]||[]).push(p); });
  const campi = {}; let totale=0, semi=0, concimi=0; const prod = {};
  colture.forEach(c=>{
    const n=c.campi?.numero; if(n==null) return;
    const ha = Number(c.ettari ?? c.campi.ettari ?? 0);
    const k = campi[n] || (campi[n]={numero:n,nome:(c.campi.nome||"").split(" — ")[0],ettari:Number(c.campi.ettari||0),colture:[]});
    const righe = (perCC[c.id]||[]).map(p=>{
      const q = Number(p.dose_ha||0)*ha; const costo = p.prezzo_unitario!=null ? q*Number(p.prezzo_unitario) : 0;
      totale+=costo; if(p.tipo==="Seme") semi+=costo; else concimi+=costo;
      const a = prod[p.prodotto] || (prod[p.prodotto]={prodotto:p.prodotto,tipo:p.tipo,unita:p.unita,prezzo:p.prezzo_unitario,q:0,costo:0,campi:[]});
      a.q+=q; a.costo+=costo; const et=`${n}${c.porzione?" "+c.porzione:""}`; if(!a.campi.includes(et)) a.campi.push(et);
      return {...p,q};
    });
    k.colture.push({id:c.id,nome:nomeColtura(c),porzione:c.porzione,ordine:c.ordine,ha,note:c.note,righe});
  });
  const lista = Object.values(campi).sort((a,b)=>a.numero-b.numero);
  lista.forEach(k=>k.colture.sort((a,b)=>(a.porzione||"").localeCompare(b.porzione||"")||a.ordine-b.ordine));
  return {righe:programma.length,campi:lista,ettari:lista.reduce((s,k)=>s+k.ettari,0),totale,semi,concimi,
    prodotti:Object.values(prod).sort((a,b)=>b.costo-a.costo)};
}
