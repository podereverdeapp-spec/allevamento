// ============================================================================
// REPORT STORICO COLTIVAZIONE — v116
// ----------------------------------------------------------------------------
// Linguetta "📚 Storico" della sezione Coltivazione. Quattro report su tutte le
// stagioni caricate, pensati per il telefono (schede una sotto l'altra, niente
// tabelle larghe):
//   🌱 Per coltura   — ettari, rese, costi, costo per unità contro il mercato
//   🗺️ Per campo     — coltura, produzione, costi, concimazione, risultato
//   🏅 Per stagione  — campi dal migliore al peggiore per costo unitario
//   🏆 Per resa      — campi su tutte le stagioni, indice di resa (100 = media)
// Fonti: vista v_coltivazione_report_prodotti (colture, prodotti, costi),
// coltivazione_riparti + coltivazione_voci_costo (concimi per campo),
// coltivazione_parametri (peso del ballone).
// Regole, uguali a quelle dei report Excel approvati:
//  - il costo di ogni coltura si divide fra i suoi prodotti in proporzione al
//    valore di mercato; balloni e rotoballe pesano peso_ballone_kg;
//  - non contano le colture senza costi e i prodotti senza prezzo di mercato;
//  - il sorgo dopo il pascolo e' seconda coltura: i suoi ettari non si sommano.
// ============================================================================
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
const n0 = v => Math.round(v).toLocaleString("it-IT");
const n1 = v => Number(v).toLocaleString("it-IT",{minimumFractionDigits:1,maximumFractionDigits:1});
const n2 = v => Number(v).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2});
const eur = v => n0(v)+" €";
const eur2 = v => n2(v)+" €";
const sg = v => (v>=0?"+":"−")+n0(Math.abs(v))+" €";
const perUnita = u => t(u==="balloni"?"a ballone":u==="rotoballe"?"a rotoballa":"al quintale");
const unitaHa = u => t(u==="balloni"?"balloni per ettaro":u==="rotoballe"?"rotoballe per ettaro":"quintali per ettaro");

// colore per coltura (come nel report Excel)
const COL_COLTURA = {"Erba medica":"#C6E0B4","Erbaio misto":"#E2EFDA","Orzo":"#F8CBAD","Avena":"#FFE699",
  "Trifoglio":"#F4B6C2","Sulla":"#D9C3E9","Favino":"#D6B99A","Pascolo erbaio":"#DDEBF7","Sorgo":"#EDEDED"};
// prodotto principale di ogni coltura
const PRINCIPALE = {"Orzo":["Granella di orzo"],"Erba medica":["Fieno di erba medica"],"Erbaio misto":["Fieno misto"],
  "Avena":["Semente di avena","Granella di avena"],"Trifoglio":["Fieno di trifoglio"],"Sulla":["Fieno di sulla","Semente di sulla"],
  "Favino":["Granella di favino"]};
const COLTURE_ORDINE = ["Erba medica","Erbaio misto","Orzo","Trifoglio","Avena","Favino","Sulla"];

const normColtura = s => {
  if(!s) return s; const tx = s.trim().toLowerCase();
  if(tx.startsWith("sorgo")) return "Sorgo";
  return tx.charAt(0).toUpperCase()+tx.slice(1);
};
const nomeCampo = s => (s||"").split(" — ")[0];
const normConcime = d => {
  const x=(d||"").toUpperCase();
  if(x.includes("COMPLEX")) return "Complex 12-12-17";
  if(x.includes("BIAMM")) return "Fosfato biammonico 18-46";
  if(x.includes("ORGANFERTIL")) return "Organfertil";
  if(x.includes("AZOSTAR")) return "Azostar 54";
  if(x.includes("AGRISPRINT")) return "Agrisprint 10-44";
  if(x.includes("N--GOOO")||x.includes("N-GOOO")) return "N-Gooo N30";
  if(x.includes("NPK 20")) return "NPK 20-10-10";
  if(x.includes("ORTO")) return "Orto-frutta NPK 12-12-12";
  if(x.includes("OLIVETO")) return "Oliveto 14-10-12";
  if(x.includes("EKOPHOS")) return "Ekophos 36";
  if(x.includes("YARAMILA")) return "YaraMila Blustar";
  if(x.includes("AGRISTALL")) return "Agristall";
  if(x.includes("MICROSED")) return "Microsed Zn Super";
  if(x.includes("LETAME")) return "Letame aziendale";
  return d;
};

// gradazione verde → giallo → rosso secondo la posizione
const gradazione = (i,n) => {
  const tx = n<=1 ? 0 : i/(n-1);
  const S=[[0,[0x57,0xBB,0x8A]],[0.5,[0xFF,0xD6,0x66]],[1,[0xE6,0x7C,0x73]]];
  for(let k=0;k<S.length-1;k++){ const [t0,c0]=S[k],[t1,c1]=S[k+1];
    if(tx<=t1){ const f=(tx-t0)/(t1-t0||1); return "rgb("+c0.map((c,m)=>Math.round(c+(c1[m]-c)*f)).join(",")+")"; } }
  return "rgb(230,124,115)";
};
const coloreIndice = v => v>=100 ? C.green : C.red;


// ---------------------------------------------------------------------------
// Costruzione del modello a partire dai dati dell'app
// ---------------------------------------------------------------------------
function costruisci(righe, riparti, parametri){
  const peso = {}; (parametri||[]).forEach(p=>{ peso[p.campagna]=Number(p.peso_ballone_kg||340); });
  const cc = {};
  righe.forEach(r=>{
    if(!cc[r.coltura_campo_id]) cc[r.coltura_campo_id] = {
      id:r.coltura_campo_id, campagna:r.campagna, n:r.campo_numero, campo:nomeCampo(r.campo), ordine:r.ordine,
      coltura:normColtura(r.coltura), ettari:Number(r.ettari||0),
      semi:Number(r.costo_seme||0), concimi:Number(r.costo_concime||0)+Number(r.costo_fitosanitario||0),
      lavorazioni:Number(r.costo_lavorazioni||0)+Number(r.costo_altro||0), totale:Number(r.costo_totale||0),
      prodotti:[], concimazioni:[] };
    if(r.prodotto && Number(r.quantita)>0 && r.prezzo_q!=null && Number(r.prezzo_q)>0){
      const kg = peso[r.campagna]||340;
      const pu = (r.unita==="balloni"||r.unita==="rotoballe") ? Number(r.prezzo_q)*kg/100 : Number(r.prezzo_q);
      const qq = (r.unita==="balloni"||r.unita==="rotoballe") ? Number(r.quantita)*kg/100 : Number(r.quantita);
      cc[r.coltura_campo_id].prodotti.push({prodotto:r.prodotto,unita:r.unita,q:Number(r.quantita),qq,pu,valore:Number(r.quantita)*pu});
    }
  });
  (riparti||[]).forEach(x=>{ const c=cc[x.coltura_campo_id]; if(c && Number(x.quantita)>0)
    c.concimazioni.push({nome:normConcime(x.coltivazione_voci_costo?.descrizione),q:Number(x.quantita),costo:Number(x.importo||0)}); });
  let colture = Object.values(cc).filter(c=>c.totale>0);
  colture.forEach(c=>{
    const v = c.prodotti.reduce((s,p)=>s+p.valore,0);
    c.prodotti.forEach(p=>{ p.costo = v ? c.totale*p.valore/v : 0; p.cu = p.costo/p.q; p.saldo=p.valore-p.costo; });
    c.valore=v; c.saldo = c.prodotti.length ? v-c.totale : null;
    // concimi aggregati per nome
    const ag={}; c.concimazioni.forEach(k=>{ const a=ag[k.nome]||(ag[k.nome]={nome:k.nome,q:0,costo:0}); a.q+=k.q; a.costo+=k.costo; });
    c.concimi_lista = Object.values(ag).sort((a,b)=>b.costo-a.costo);
    c.costo_concimazione = c.concimi_lista.reduce((s,k)=>s+k.costo,0);
  });
  // seconda coltura: sorgo sullo stesso campo del pascolo
  colture.forEach(c=>{ c.seconda = c.coltura==="Sorgo" && colture.some(o=>o.campagna===c.campagna&&o.n===c.n&&o.coltura==="Pascolo erbaio"); });
  // stagioni dalla prima caricata all'ultima, comprese quelle mancanti in mezzo (dalla piu' recente)
  const caricate = [...new Set(colture.map(c=>c.campagna))].sort();
  const tutte = [];
  if(caricate.length){ const a0=Number(caricate[0].slice(0,4)), a1=Number(caricate[caricate.length-1].slice(0,4));
    for(let a=a1; a>=a0; a--) tutte.push(`${a}/${a+1}`); }
  // campi: nome piu' recente
  const campi = {};
  [...colture].sort((a,b)=>a.campagna<b.campagna?-1:1).forEach(c=>{ campi[c.n]=c.campo; });
  const ultima = caricate[caricate.length-1];
  const attivi = Object.keys(campi).map(Number).filter(n=>colture.some(c=>c.n===n && c.campagna>=campagnaMenoTre(ultima))).sort((a,b)=>a-b);
  return {colture, stagioni:tutte, caricate, campi, attivi};
}
const campagnaMenoTre = cp => { const a=Number((cp||"2023/2024").slice(0,4))-2; return `${a}/${a+1}`; };

// resa del prodotto principale (in quintali per ettaro) per ogni coltura-stagione
function righeResa(colture){
  const R=[];
  colture.forEach(c=>{
    const pn = PRINCIPALE[c.coltura]; if(!pn) return;
    let mp = c.prodotti.filter(p=>pn.includes(p.prodotto));
    if(c.coltura==="Sulla") mp = mp.filter(p=>p.prodotto==="Fieno di sulla");
    if(!mp.length || !c.ettari) return;
    R.push({campagna:c.campagna,n:c.n,coltura:c.coltura,ha:c.ettari,resa:mp.reduce((s,p)=>s+p.qq,0)/c.ettari});
  });
  const M={};
  R.forEach(x=>{ const k=x.campagna+"|"+x.coltura; const m=M[k]||(M[k]={h:0,s:0,n:0}); m.h+=x.ha; m.s+=x.resa*x.ha; m.n++; });
  R.forEach(x=>{
    let m=M[x.campagna+"|"+x.coltura];
    x.solo = m.n===1; x.rif = null;
    if(x.coltura==="Sulla" && M[x.campagna+"|Erba medica"]){ m=M[x.campagna+"|Erba medica"]; x.solo=false; x.rif="medica"; }
    x.indice = 100*x.resa/(m.s/m.h);
  });
  return R;
}

// ---------------------------------------------------------------------------
export default function StoricoColtivazione(){
  const [dati,setDati] = useState(null);
  const [err,setErr]   = useState("");
  const [vista,setVista] = useState("coltura");

  useEffect(()=>{ (async()=>{
    const [r,k,p] = await Promise.all([
      supabase.from("v_coltivazione_report_prodotti").select("*").range(0,9999),
      supabase.from("coltivazione_riparti")
        .select("coltura_campo_id,quantita,importo,coltivazione_voci_costo!inner(tipo,descrizione)")
        .eq("coltivazione_voci_costo.tipo","Concime").range(0,9999),
      supabase.from("coltivazione_parametri").select("campagna,peso_ballone_kg"),
    ]);
    if(r.error){ setErr(t("Errore nel caricamento dello storico: ")+r.error.message); return; }
    setDati(costruisci(r.data||[], k.data||[], p.data||[]));
  })(); },[]);

  if(err) return <div style={{...card,color:C.red,fontWeight:600}}>⚠️ {err}</div>;
  if(!dati) return <div style={{...card,textAlign:"center",color:C.muted}}>{t("Caricamento dello storico…")}</div>;
  if(!dati.colture.length) return <div style={{...card,textAlign:"center",color:C.muted}}>{t("Nessuna stagione con i costi caricati.")}</div>;

  const VISTE=[{id:"coltura",l:"🌱 Per coltura"},{id:"campo",l:"🗺️ Per campo"},{id:"stagione",l:"🏅 Ranking stagione"},{id:"resa",l:"🏆 Ranking resa"},{id:"rcoltura",l:"🥇 Ranking per coltura"}];
  return (<>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
      {VISTE.map(v=>(
        <button key={v.id} onClick={()=>setVista(v.id)}
          style={{background:vista===v.id?C.accent:"#FFF",color:vista===v.id?"#FFF":C.text,
            border:`1.5px solid ${vista===v.id?C.accent:C.border}`,borderRadius:10,padding:"9px 6px",
            fontSize:13,fontWeight:600,cursor:"pointer",gridColumn:v.id==="rcoltura"?"1 / span 2":"auto"}}>{v.l}</button>
      ))}
    </div>
    <Nota>
      {vista==="coltura" && <><b>{t("🌱 Per coltura")}</b> {t("· Scegli una coltura: per ogni stagione ettari, resa, costo e quanto è costata ogni unità di prodotto contro il prezzo di mercato. In rosso i costi sopra il mercato.")}</>}
      {vista==="campo" && <><b>{t("🗺️ Per campo")}</b> {t("· Scegli un campo: stagione per stagione coltura, produzione, costi, concimi usati con la dose per ettaro, e il risultato contro il mercato.")}</>}
      {vista==="stagione" && <><b>{t("🏅 Ranking per stagione")}</b> {t("· I campi dal migliore al peggiore per costo unitario dei prodotti, rapportato al prezzo di mercato (i prodotti sono diversi). Il colore del campo è la coltura; la casella del costo va dal verde al rosso; numero rosso = sopra il mercato.")}</>}
      {vista==="resa" && <><b>{t("🏆 Ranking per resa")}</b> {t("· I campi su tutte le stagioni. Ogni campo è confrontato con gli altri della stessa coltura nella stessa stagione: 100 = media dell'azienda, 150 = una volta e mezza. La sulla, unica, è confrontata con la medica.")}</>}
      {vista==="rcoltura" && <><b>{t("🥇 Ranking per coltura")}</b> {t("· Scegli una coltura: i campi che l'hanno avuta, dal migliore al peggiore, sommando tutte le stagioni. Conta quanto è costato il prodotto rispetto al suo valore di mercato; costo e mercato sono al quintale del prodotto principale. Numero rosso = sopra il mercato.")}</>}
    </Nota>
    {vista==="coltura" && <PerColtura d={dati}/>}
    {vista==="campo" && <PerCampo d={dati}/>}
    {vista==="stagione" && <RankingStagione d={dati}/>}
    {vista==="resa" && <RankingResa d={dati}/>}
    {vista==="rcoltura" && <RankingColtura d={dati}/>}
  </>);
}

const Nota = ({children}) => (
  <div style={{margin:"0 0 12px",padding:"8px 10px",borderRadius:8,background:C.blue+"14",
    borderLeft:`4px solid ${C.blue}`,fontSize:12.5,lineHeight:1.4,color:C.text}}>{children}</div>
);
const Chips = ({voci,valore,onScegli,colori}) => (
  <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:10}}>
    {voci.map(v=>(
      <button key={v.id} onClick={()=>onScegli(v.id)}
        style={{flexShrink:0,background:valore===v.id?C.primary:(colori?.[v.id]||"#FFF"),color:valore===v.id?"#FFF":C.text,
          border:`1.5px solid ${valore===v.id?C.primary:C.border}`,borderRadius:20,padding:"6px 12px",fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
        {typeof v.l==="string"?t(v.l):v.l}</button>))}
  </div>
);
const Riga = ({l,v,forte,colore,piccolo}) => (
  <div style={{display:"flex",justifyContent:"space-between",gap:10,padding:"4px 0",borderTop:`1px solid ${C.border}44`,fontSize:piccolo?12:13}}>
    <span style={{color:C.muted}}>{typeof l==="string"?t(l):l}</span>
    <span style={{fontWeight:forte?700:500,color:colore||C.text,textAlign:"right"}}>{typeof v==="string"?t(v):v}</span>
  </div>
);
const NonCaricata = ({cp}) => (
  <div style={{...card,padding:10,background:"#EEE",color:C.muted,fontSize:13,textAlign:"center"}}>{cp} {t("· stagione non caricata")}</div>
);

// ---------------------------------------------------------------------------
function PerColtura({d}){
  const presenti = COLTURE_ORDINE.filter(k=>d.colture.some(c=>c.coltura===k));
  const [col,setCol] = useState(presenti[0]);
  return (<>
    <Chips voci={presenti.map(k=>({id:k,l:k}))} valore={col} onScegli={setCol} colori={COL_COLTURA}/>
    {d.stagioni.map(cp=>{
      if(!d.caricate.includes(cp)) return <NonCaricata key={cp} cp={cp}/>;
      const cs = d.colture.filter(c=>c.campagna===cp && c.coltura===col);
      if(!cs.length) return null;
      const ha = cs.reduce((s,c)=>s+c.ettari,0), tot = cs.reduce((s,c)=>s+c.totale,0);
      const pr={}; cs.forEach(c=>c.prodotti.forEach(p=>{ const k=p.prodotto+"|"+p.unita;
        const a=pr[k]||(pr[k]={prodotto:p.prodotto,unita:p.unita,q:0,costo:0,valore:0}); a.q+=p.q; a.costo+=p.costo; a.valore+=p.valore; }));
      const prodotti = Object.values(pr).sort((a,b)=>b.valore-a.valore);
      const saldo = prodotti.length ? prodotti.reduce((s,p)=>s+p.valore-p.costo,0) : null;
      return (
        <div key={cp} style={{...card,borderLeft:`6px solid ${COL_COLTURA[col]||C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <b style={{color:C.primary,fontSize:15}}>{cp}</b>
            <span style={{fontSize:12,color:C.muted}}>{n2(ha)} {t("ettari ·")} {cs.length} {cs.length===1?t("campo"):t("campi")}</span>
          </div>
          {prodotti.map(p=>(
            <div key={p.prodotto+p.unita} style={{marginTop:8,padding:"6px 8px",background:C.bg,borderRadius:8}}>
              <div style={{fontWeight:600,fontSize:13}}>{t(p.prodotto)}: {n1(p.q)} {t(p.unita)}</div>
              <div style={{fontSize:12,color:C.muted}}>{t("resa")} {n1(p.q/ha)} {unitaHa(p.unita)}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginTop:3}}>
                <span>{t("costo")} <b style={{color:p.costo/p.q>p.valore/p.q?C.red:C.green}}>{eur2(p.costo/p.q)}</b> {perUnita(p.unita)}</span>
                <span style={{color:C.muted}}>{t("mercato")} {eur2(p.valore/p.q)}</span>
              </div>
            </div>))}
          <div style={{marginTop:8}}>
            <Riga l="Costo complessivo di coltivazione" v={eur(tot)} forte/>
            <Riga l="Costo ad ettaro" v={eur(tot/ha)}/>
            <Riga l="Perdita o guadagno contro il mercato" v={saldo==null?"nessun prodotto valutabile":sg(saldo)} forte colore={saldo==null?C.muted:saldo<0?C.red:C.green}/>
          </div>
        </div>);
    })}
  </>);
}

// ---------------------------------------------------------------------------
function PerCampo({d}){
  const numeri = Object.keys(d.campi).map(Number).sort((a,b)=>a-b);
  const [n,setN] = useState(d.attivi[0] ?? numeri[0]);
  const vecchi = numeri.filter(x=>!d.attivi.includes(x));
  return (<>
    <select value={n} onChange={e=>setN(Number(e.target.value))}
      style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:15,marginBottom:12,background:"#FFF"}}>
      <optgroup label={t("Campi coltivati oggi")}>{d.attivi.map(x=><option key={x} value={x}>{x} — {d.campi[x]}</option>)}</optgroup>
      {vecchi.length>0 && <optgroup label={t("Campi coltivati solo fino al 2021/2022")}>{vecchi.map(x=><option key={x} value={x}>{x} — {d.campi[x]}</option>)}</optgroup>}
    </select>
    {d.stagioni.map(cp=>{
      if(!d.caricate.includes(cp)) return <NonCaricata key={cp} cp={cp}/>;
      const cs = d.colture.filter(c=>c.campagna===cp && c.n===n);
      if(!cs.length) return null;
      const ha = cs.filter(c=>!c.seconda).reduce((s,c)=>s+c.ettari,0);
      const tot = cs.reduce((s,c)=>s+c.totale,0), val = cs.reduce((s,c)=>s+c.valore,0);
      const prod = cs.flatMap(c=>c.prodotti.map(p=>({...p,coltura:c.coltura,ha:c.ettari})));
      const saldo = prod.length ? prod.reduce((s,p)=>s+p.saldo,0) : null;
      const qq = prod.reduce((s,p)=>s+p.qq,0);
      const coltureNomi = [...new Set(cs.map(c=>c.coltura))];
      return (
        <div key={cp} style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
            <b style={{color:C.primary,fontSize:15}}>{cp}</b>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>
              {coltureNomi.map(k=><span key={k} style={{background:COL_COLTURA[k]||"#EEE",borderRadius:10,padding:"2px 8px",fontSize:12,fontWeight:600}}>{t(k)}</span>)}
            </div>
          </div>
          <Riga l="Ettari coltivati" v={n2(ha)}/>
          {prod.length ? prod.sort((a,b)=>b.valore-a.valore).map(p=>(
            <Riga key={p.prodotto+p.coltura} l={t(p.prodotto)+(coltureNomi.length>1?" ("+t(p.coltura).toLowerCase()+")":"")}
              v={<>{n1(p.q)} {t(p.unita)} · {n1(p.q/p.ha)} {t("per ettaro")}<br/>
                <span style={{fontSize:12}}>{t("costo")} <b style={{color:p.cu>p.pu?C.red:C.green}}>{eur2(p.cu)}</b> {perUnita(p.unita)} {t("· mercato")} {eur2(p.pu)}</span></>} piccolo/>
          )) : <Riga l="Produzione" v="pascolato: nessuna resa misurata" colore={C.muted}/>}
          {prod.length>0 && <Riga l="Resa in quintali per ettaro" v={n1(qq/ha)} forte/>}
          <div style={{marginTop:6,fontSize:12,fontWeight:700,color:C.accent}}>{t("Concimazione")}</div>
          {cs.some(c=>c.concimi_lista.length) ? cs.flatMap(c=>c.concimi_lista.map(k=>(
            <Riga key={c.id+k.nome} l={k.nome+(coltureNomi.length>1?" ("+t("su {0}",{0:t(c.coltura).toLowerCase()})+")":"")} v={n2(k.q/c.ettari)+" "+t("quintali per ettaro")} piccolo/>
          ))) : <Riga l="Concimi" v="nessuna concimazione" colore={C.muted} piccolo/>}
          <Riga l="Costo della concimazione per ettaro" v={eur(cs.reduce((s,c)=>s+c.costo_concimazione,0)/(ha||1))} piccolo/>
          <div style={{marginTop:6,fontSize:12,fontWeight:700,color:C.accent}}>{t("Costi")}</div>
          <Riga l="Semi" v={eur(cs.reduce((s,c)=>s+c.semi,0))} piccolo/>
          <Riga l="Concimi e fitosanitari" v={eur(cs.reduce((s,c)=>s+c.concimi,0))} piccolo/>
          <Riga l="Lavorazioni (compresa la rete)" v={eur(cs.reduce((s,c)=>s+c.lavorazioni,0))} piccolo/>
          <Riga l="Costo complessivo" v={eur(tot)} forte/>
          <Riga l="Costo ad ettaro" v={eur(tot/(ha||1))}/>
          {prod.length>0 && <Riga l="Valore di mercato ad ettaro" v={eur(val/(ha||1))}/>}
          <Riga l="Perdita o guadagno contro il mercato" v={saldo==null?"—":sg(saldo)+" · "+sg(saldo/(ha||1))+" "+t("per ettaro")} forte colore={saldo==null?C.muted:saldo<0?C.red:C.green}/>
        </div>);
    })}
  </>);
}

// ---------------------------------------------------------------------------
function rankingStagione(d,cp){
  const out=[];
  [...new Set(d.colture.filter(c=>c.campagna===cp).map(c=>c.n))].forEach(n=>{
    const cs = d.colture.filter(c=>c.campagna===cp && c.n===n && PRINCIPALE[c.coltura]);
    const ps = cs.flatMap(c=>c.prodotti.map(p=>({...p,coltura:c.coltura})));
    const val = ps.reduce((s,p)=>s+p.valore,0); if(!cs.length || !val) return;
    const cl = [...new Set(cs.map(c=>c.coltura))];
    let mp = ps.filter(p=>p.coltura===cl[0] && PRINCIPALE[cl[0]].includes(p.prodotto));
    if(!mp.length) mp=[...ps].sort((a,b)=>b.valore-a.valore).slice(0,1);
    mp = mp.filter(p=>p.prodotto===mp[0].prodotto && p.unita===mp[0].unita);
    const q = mp.reduce((s,p)=>s+p.q,0);
    out.push({n,colture:cl,rapporto:ps.reduce((s,p)=>s+p.costo,0)/val,
      prodotto:mp[0].prodotto,unita:mp[0].unita,cu:mp.reduce((s,p)=>s+p.costo,0)/q,pm:mp.reduce((s,p)=>s+p.valore,0)/q});
  });
  return out.sort((a,b)=>a.rapporto-b.rapporto);
}
function RankingStagione({d}){
  const [cp,setCp] = useState(d.caricate[d.caricate.length-1]);
  const lista = rankingStagione(d,cp);
  return (<>
    <Chips voci={d.stagioni.filter(s=>d.caricate.includes(s)).map(s=>({id:s,l:s}))} valore={cp} onScegli={setCp}/>
    {lista.map((x,i)=>(
      <div key={x.n} style={{...card,padding:0,display:"flex",overflow:"hidden",marginBottom:8}}>
        <div style={{width:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:C.primary,background:"#FAF7F2"}}>{i+1}°</div>
        <div style={{flex:1,padding:"8px 10px",background:COL_COLTURA[x.colture[0]]||"#EEE"}}>
          <div style={{fontWeight:700,fontSize:14,color:d.attivi.includes(x.n)?C.text:"#666"}}>{x.n} — {d.campi[x.n]}</div>
          <div style={{fontSize:12,color:C.text}}>{x.colture.join(" + ").toLowerCase()}</div>
        </div>
        <div style={{width:92,padding:"6px 6px",background:gradazione(i,lista.length),textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:13,fontWeight:800,color:x.cu>x.pm?"#9C0006":"#10381F"}}>{eur2(x.cu)}</div>
          <div style={{fontSize:10}}>{perUnita(x.unita)}</div>
        </div>
        <div style={{width:80,padding:"6px 6px",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",borderLeft:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.muted}}>{t("mercato")}</div>
          <div style={{fontSize:12,fontWeight:600}}>{eur2(x.pm)}</div>
        </div>
      </div>))}
    <div style={{fontSize:11.5,color:C.muted,lineHeight:1.4,marginTop:6}}>
      {t("Costo e mercato sono del prodotto principale della coltura. La posizione tiene conto di tutti i prodotti del campo, paglia e seme compresi. Esclusi i pascoli.")}
    </div>
  </>);
}

// ---------------------------------------------------------------------------
function RankingResa({d}){
  const R = righeResa(d.colture).filter(x=>!x.solo);
  const lista = d.attivi.map(n=>{
    const xs = R.filter(x=>x.n===n); if(!xs.length) return null;
    const h = xs.reduce((s,x)=>s+x.ha,0);
    const per = {}; d.stagioni.forEach(cp=>{ const ys=xs.filter(x=>x.campagna===cp);
      if(ys.length) per[cp]={i:ys.reduce((s,x)=>s+x.indice*x.ha,0)/ys.reduce((s,x)=>s+x.ha,0),c:[...new Set(ys.map(y=>y.coltura))]}; });
    return {n,indice:xs.reduce((s,x)=>s+x.indice*x.ha,0)/h,per,na:Object.keys(per).length,sopra:Object.values(per).filter(v=>v.i>100).length};
  }).filter(Boolean).sort((a,b)=>b.indice-a.indice);
  const fuori = d.attivi.filter(n=>!lista.some(x=>x.n===n));
  return (<>
    {lista.map((x,i)=>(
      <div key={x.n} style={{...card,padding:10,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontWeight:800,fontSize:15,color:C.primary,width:30}}>{i+1}°</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>{x.n} — {d.campi[x.n]}</div>
            <div style={{fontSize:12,color:C.muted}}>{t("{0} stagioni sopra la media su {1}",{0:x.sopra,1:x.na})}</div>
          </div>
          <div style={{background:gradazione(i,lista.length),borderRadius:10,padding:"6px 10px",fontWeight:800,fontSize:16,minWidth:48,textAlign:"center"}}>{n0(x.indice)}</div>
        </div>
        <div style={{display:"flex",gap:4,overflowX:"auto",marginTop:8}}>
          {d.stagioni.slice().filter(cp=>x.per[cp]).map(cp=>(
            <div key={cp} style={{flexShrink:0,background:COL_COLTURA[x.per[cp].c[0]]||"#EEE",borderRadius:8,padding:"3px 7px",textAlign:"center"}}>
              <div style={{fontSize:10,color:C.text}}>{cp}</div>
              <div style={{fontSize:13,fontWeight:800,color:coloreIndice(x.per[cp].i)}}>{n0(x.per[cp].i)}</div>
              <div style={{fontSize:9.5,color:C.text}}>{x.per[cp].c.join(" + ").toLowerCase()}{x.per[cp].c.includes("Sulla")?t(" (contro la medica)"):""}</div>
            </div>))}
        </div>
      </div>))}
    <div style={{fontSize:11.5,color:C.muted,lineHeight:1.4,marginTop:6}}>
      {t("Non contano le stagioni in cui un campo era l'unico con la sua coltura.")}
      {fuori.length>0 && <> {t("Fuori classifica (pascoli o nessuna resa confrontabile):")} {fuori.map(n=>`${n} — ${d.campi[n]}`).join("; ")}.</>}
    </div>
  </>);
}

// ---------------------------------------------------------------------------
// v116 — ranking per coltura: per ogni coltura i campi dal migliore al peggiore
// su tutte le stagioni (costo attribuito ÷ valore di mercato di tutti i prodotti)
function rankingColtura(d,col){
  const cs = d.colture.filter(c=>c.coltura===col && c.prodotti.length);
  const out=[];
  [...new Set(cs.map(c=>c.n))].forEach(n=>{
    const xs = cs.filter(c=>c.n===n);
    const ps = xs.flatMap(c=>c.prodotti);
    const val = ps.reduce((s,p)=>s+p.valore,0); if(!val) return;
    const mp = ps.filter(p=>(PRINCIPALE[col]||[]).includes(p.prodotto));
    const qq = mp.reduce((s,p)=>s+p.qq,0);
    out.push({n, rapporto:ps.reduce((s,p)=>s+p.costo,0)/val,
      cu: qq ? mp.reduce((s,p)=>s+p.costo,0)/qq : null, pm: qq ? mp.reduce((s,p)=>s+p.valore,0)/qq : null,
      stagioni:[...new Set(xs.map(c=>c.campagna))].sort()});
  });
  return out.sort((a,b)=>a.rapporto-b.rapporto);
}
function RankingColtura({d}){
  const presenti = COLTURE_ORDINE.filter(k=>d.colture.some(c=>c.coltura===k && c.prodotti.length));
  const [col,setCol] = useState(presenti[0]);
  const lista = rankingColtura(d,col);
  const breve = cp => cp.slice(2,4)+"/"+cp.slice(7,9);
  return (<>
    <Chips voci={presenti.map(k=>({id:k,l:k}))} valore={col} onScegli={setCol} colori={COL_COLTURA}/>
    {lista.map((x,i)=>(
      <div key={x.n} style={{...card,padding:0,display:"flex",overflow:"hidden",marginBottom:8}}>
        <div style={{width:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:C.primary,background:"#FAF7F2"}}>{i+1}°</div>
        <div style={{flex:1,padding:"8px 10px",background:COL_COLTURA[col]||"#EEE"}}>
          <div style={{fontWeight:700,fontSize:14,color:d.attivi.includes(x.n)?C.text:"#666"}}>{x.n} — {d.campi[x.n]}</div>
          <div style={{fontSize:11.5,color:C.text}}>{x.stagioni.length===1?t("1 stagione"):x.stagioni.length+t(" stagioni")}: {x.stagioni.map(breve).join(" · ")}</div>
        </div>
        <div style={{width:92,padding:"6px 6px",background:gradazione(i,lista.length),textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:13,fontWeight:800,color:x.cu!=null&&x.cu>x.pm?"#9C0006":"#10381F"}}>{x.cu!=null?eur2(x.cu):"—"}</div>
          <div style={{fontSize:10}}>{t("al quintale")}</div>
        </div>
        <div style={{width:80,padding:"6px 6px",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",borderLeft:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.muted}}>{t("mercato")}</div>
          <div style={{fontSize:12,fontWeight:600}}>{x.pm!=null?eur2(x.pm):"—"}</div>
        </div>
      </div>))}
    {lista.length===1 && <div style={{fontSize:12,color:C.muted,marginBottom:6}}>{t("Un solo campo ha avuto questa coltura: non c'è confronto.")}</div>}
    <div style={{fontSize:11.5,color:C.muted,lineHeight:1.4,marginTop:6}}>
      {t("La posizione tiene conto di tutti i prodotti della coltura (paglia e seme compresi) in tutte le stagioni; i campi in grigio non sono più coltivati. Esclusi i pascoli.")}
    </div>
  </>);
}
