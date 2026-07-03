import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { supabase } from "./supabase";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  bovini:"#8B6914", suini:"#B5547A", ovini:"#4A7C59",
};

const today = () => new Date().toISOString().split("T")[0];
const specieIcon = s=>({bovino:"🐄",suino:"🐷",ovino:"🐑"}[s]||"🐾");
const specieColor = s=>({bovino:C.bovini,suino:C.suini,ovino:C.ovini}[s]||C.muted);

// ─── COEFFICIENTI UBA AZIENDALI ───────────────────────────────────────────────
// Fonte: Reg. CE 1974/2006 + Eurostat
const UBA_FASCE = {
  bovino: [
    { fino: 210,      coeff: 0.40,  label: "Vitella (<7 mesi)" },
    { fino: 730,      coeff: 0.70,  label: "Vitellone (7m-2a)" },
    { fino: Infinity, coeff: 1.00,  label: "Bovino adulto (≥2a)" },
  ],
  suino: [
    { fino: 90,       coeff: 0.027, label: "Lattonzolo (<3 mesi)" },
    { fino: 365,      coeff: 0.30,  label: "Magrone (3m-1a)" },
    { fino: Infinity, coeff: 0.50,  label: "Suino adulto (≥1a)" },
  ],
  ovino: [
    { fino: 120,      coeff: 0.027, label: "Agnello (<4 mesi)" },
    { fino: 365,      coeff: 0.10,  label: "Agnellone (4m-1a)" },
    { fino: Infinity, coeff: 0.15,  label: "Ovino adulto (≥1a)" },
  ],
};

// ─── CALCOLO UBA MEDIO ────────────────────────────────────────────────────────
function calcolaUBAMedio(dataNascita, dataFine, specie) {
  if (!dataNascita || !specie || !UBA_FASCE[specie]) return null;
  const nascita = new Date(dataNascita);
  const fine    = new Date(dataFine);
  const totGiorni = Math.round((fine - nascita) / 86400000);
  if (totGiorni <= 0) return null;

  let ubaPesata = 0;
  let ggPrec = 0;
  for (const { fino, coeff } of UBA_FASCE[specie]) {
    const ggFascia = Math.max(0, Math.min(fino, totGiorni) - ggPrec);
    ubaPesata += ggFascia * coeff;
    ggPrec = Math.min(fino, totGiorni);
    if (ggPrec >= totGiorni) break;
  }
  return Math.round(ubaPesata / totGiorni * 1000) / 1000;
}

// Categoria attuale in base all'età alla data di riferimento
function categoriaAttuale(dataNascita, dataRif, specie) {
  if (!dataNascita || !UBA_FASCE[specie]) return "—";
  const eta = Math.round((new Date(dataRif) - new Date(dataNascita)) / 86400000);
  for (const { fino, label } of UBA_FASCE[specie]) {
    if (eta < fino) return label;
  }
  return UBA_FASCE[specie].at(-1).label;
}

// ─── UI BASE ──────────────────────────────────────────────────────────────────
const Card = ({children,style={}}) => (
  <div style={{background:C.card,borderRadius:16,padding:14,marginBottom:12,
    boxShadow:"0 2px 8px rgba(0,0,0,0.07)",border:`1px solid ${C.border}`,...style}}>
    {children}
  </div>
);
const Badge = ({label,color}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,
    borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:700}}>{label}</span>
);
const Spinner = () => (
  <div style={{textAlign:"center",padding:60,color:C.muted}}>
    <div style={{fontSize:36,marginBottom:12}}>⏳</div>
    <div>Calcolo UBA in corso...</div>
  </div>
);

// ─── EXPORT EXCEL ─────────────────────────────────────────────────────────────
function esportaUBA(righe, dataRif) {
  const wb = XLSX.utils.book_new();

  // Foglio 1: riepilogo per specie e categoria
  const riepilogo = [];
  ["bovino","suino","ovino"].forEach(sp => {
    const rSp = righe.filter(r=>r.specie===sp&&r.uba!==null);
    if (rSp.length===0) return;
    UBA_FASCE[sp].forEach(({label}) => {
      const rCat = rSp.filter(r=>r.categoria===label);
      if (rCat.length===0) return;
      riepilogo.push({
        "Specie": sp,
        "Categoria": label,
        "N° Capi": rCat.length,
        "UBA medio unitario": Math.round(rCat.reduce((s,r)=>s+r.uba,0)/rCat.length*1000)/1000,
        "UBA totale categoria": Math.round(rCat.reduce((s,r)=>s+r.uba,0)*1000)/1000,
      });
    });
    riepilogo.push({
      "Specie": sp.toUpperCase() + " — TOTALE",
      "Categoria": "",
      "N° Capi": rSp.length,
      "UBA medio unitario": "",
      "UBA totale categoria": Math.round(rSp.reduce((s,r)=>s+r.uba,0)*1000)/1000,
    });
  });
  riepilogo.push({
    "Specie": "TOTALE AZIENDALE",
    "Categoria": "",
    "N° Capi": righe.filter(r=>r.uba!==null).length,
    "UBA medio unitario": "",
    "UBA totale categoria": Math.round(righe.filter(r=>r.uba!==null).reduce((s,r)=>s+r.uba,0)*1000)/1000,
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(riepilogo), "Riepilogo UBA");

  // Foglio 2: dettaglio animali attivi
  const attivi = righe.filter(r=>r.stato==="attivo").map(r=>({
    "BDN / Tatuaggio": r.bdn||"",
    "Nome": r.nome||"",
    "Specie": r.specie||"",
    "Categoria attuale": r.categoria||"",
    "Data nascita": r.nascita||"",
    "Età (giorni)": r.etaGiorni||"",
    "UBA medio (nascita→oggi)": r.uba||"",
    "Lotto": r.lotto||"",
    "Note": r.note||"",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(attivi), "Animali attivi");

  // Foglio 3: animali usciti
  const usciti = righe.filter(r=>r.stato!=="attivo").map(r=>({
    "BDN / Tatuaggio": r.bdn||"",
    "Nome": r.nome||"",
    "Specie": r.specie||"",
    "Data nascita": r.nascita||"",
    "Data uscita": r.dataFine||"",
    "Giorni in azienda": r.etaGiorni||"",
    "Motivo uscita": r.motivoUscita||"",
    "UBA medio (nascita→uscita)": r.uba||"",
    "Categoria alla nascita": r.categoriaInizio||"",
    "Categoria all'uscita": r.categoria||"",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usciti), "Animali usciti");

  XLSX.writeFile(wb, `UBA_Podere_Verde_${dataRif}.xlsx`);
}

// ─── COMPONENTE LISTA ANIMALI ─────────────────────────────────────────────────
function ListaAnimaliUBA({righe, titolo, onBack}) {
  const [cerca,setCerca] = useState("");
  const filtrate = useMemo(()=>{
    if(!cerca.trim()) return righe;
    const q=cerca.trim().toLowerCase();
    return righe.filter(r=>
      (r.bdn||"").toLowerCase().includes(q)||
      (r.nome||"").toLowerCase().includes(q)||
      (r.lotto||"").toLowerCase().includes(q)
    );
  },[righe,cerca]);

  const totUBA = filtrate.filter(r=>r.uba).reduce((s,r)=>s+r.uba,0);

  return (
    <div style={{paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,
        borderRadius:"0 0 24px 24px",padding:"20px 16px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",
            border:"none",borderRadius:10,padding:"6px 10px",color:"#FFF",
            cursor:"pointer",fontSize:18}}>←</button>
          <div>
            <div style={{fontSize:17,fontWeight:800,color:"#FFF"}}>{titolo}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>
              {filtrate.length} capi · {totUBA.toFixed(3)} UBA totali
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"14px"}}>
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:12,top:"50%",
            transform:"translateY(-50%)",fontSize:16,color:C.muted}}>🔍</span>
          <input type="text" value={cerca} onChange={e=>setCerca(e.target.value)}
            placeholder="Cerca per BDN, nome o lotto..."
            style={{width:"100%",boxSizing:"border-box",
              border:`2px solid ${cerca?C.primary:C.border}`,
              borderRadius:12,padding:"10px 38px",fontSize:14,
              background:C.card,outline:"none"}}/>
          {cerca&&<button onClick={()=>setCerca("")}
            style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>

        {filtrate.map((r,i)=>(
          <div key={i} style={{background:C.card,borderRadius:12,padding:12,
            marginBottom:8,border:`1px solid ${C.border}`,
            borderLeft:`4px solid ${specieColor(r.specie)}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>
                  {r.nome||r.bdn||r.lotto||"—"}
                </div>
                <div style={{fontSize:12,color:C.muted}}>
                  {r.bdn&&r.bdn!==r.nome?r.bdn+" · ":""}{r.categoria}
                </div>
                <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                  <Badge label={specieIcon(r.specie)+" "+r.specie} color={specieColor(r.specie)}/>
                  {r.etaGiorni&&<Badge label={r.etaGiorni+"gg"} color={C.muted}/>}
                  {r.stato!=="attivo"&&<Badge label={"uscito "+r.dataFine} color={C.red}/>}
                  {r.lotto&&<Badge label={"Lotto "+r.lotto} color={C.suini}/>}
                </div>
                {r.stato!=="attivo"&&r.motivoUscita&&(
                  <div style={{fontSize:11,color:C.muted,marginTop:3}}>
                    Motivo: {r.motivoUscita}
                  </div>
                )}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:22,fontWeight:900,color:C.primary}}>
                  {r.uba?r.uba.toFixed(3):"—"}
                </div>
                <div style={{fontSize:10,color:C.muted,fontWeight:600}}>UBA medio</div>
                {r.nascita&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>
                  📅 {r.nascita}
                </div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function UBAReport() {
  const [animali,setAnimali]   = useState([]);
  const [lotti,setLotti]       = useState([]);
  const [suiniLotto,setSuini]  = useState([]);
  const [loading,setLoading]   = useState(true);
  const [dataRif,setDataRif]   = useState(today());
  const [filtroSpecie,setFiltro] = useState("tutti");
  const [filtroStato,setFiltroStato] = useState("attivi");
  const [dettaglioVista,setDettaglio] = useState(null); // null | {titolo, righe}

  const carica = async () => {
    setLoading(true);
    const [{data:anim},{data:lot},{data:sui}] = await Promise.all([
      supabase.from("animali").select("id,bdn,nome,specie,sesso,nascita,stato,data_uscita,motivo_uscita,data_ingresso,note").order("specie"),
      supabase.from("lotti_suini").select("id,codice_lotto,codice,data_parto,specie,tipo_provenienza,fornitore"),
      supabase.from("suini_lotto").select("id,lotto_id,nr,codice_completo,sesso,peso_nascita,vivo,stato,data_uscita,motivo_uscita"),
    ]);
    setAnimali(anim||[]);
    setLotti(lot||[]);
    setSuini(sui||[]);
    setLoading(false);
  };
  useEffect(()=>{carica();},[]);

  // ── Costruzione righe UBA ──────────────────────────────────────────────────
  const righeUBA = useMemo(()=>{
    const rif = dataRif||today();
    const out = [];

    // 1. Animali del registro
    for (const a of animali) {
      if (!a.specie || !UBA_FASCE[a.specie]) continue;
      const nascita = a.nascita||a.data_ingresso;
      if (!nascita) continue;
      const statoFine = a.stato==="attivo"?"attivo":"uscito";
      const dataFine = statoFine==="attivo" ? rif : (a.data_uscita||rif);
      const uba = calcolaUBAMedio(nascita, dataFine, a.specie);
      const eta = Math.round((new Date(dataFine)-new Date(nascita))/86400000);
      out.push({
        tipo:"animale",
        id:a.id,
        bdn:a.bdn,
        nome:a.nome,
        specie:a.specie,
        nascita,
        dataFine,
        etaGiorni:eta>0?eta:null,
        stato:statoFine,
        motivoUscita:a.motivo_uscita,
        categoria:categoriaAttuale(nascita,dataFine,a.specie),
        categoriaInizio:categoriaAttuale(nascita,nascita,a.specie),
        uba,
        lotto:null,
        note:a.note,
      });
    }

    // 2. Suini dei lotti
    for (const l of lotti) {
      if (!l.data_parto) continue;
      const nascita = l.data_parto;
      const unitaLotto = suiniLotto.filter(u=>u.lotto_id===l.id);
      const codLotto = l.codice_lotto||l.codice||"";
      for (const u of unitaLotto) {
        if (u.stato==="registrato_individuale") continue; // già nel registro animali
        const statoFine = u.vivo!==false&&u.stato==="attivo"?"attivo":"uscito";
        const dataFine = statoFine==="attivo" ? rif : (u.data_uscita||rif);
        const uba = calcolaUBAMedio(nascita, dataFine, "suino");
        const eta = Math.round((new Date(dataFine)-new Date(nascita))/86400000);
        const codice = u.codice_completo||`${codLotto}${String(u.nr).padStart(2,"0")}`;
        out.push({
          tipo:"lotto",
          id:`lotto_${u.id}`,
          bdn:codice,
          nome:null,
          specie:"suino",
          nascita,
          dataFine,
          etaGiorni:eta>0?eta:null,
          stato:statoFine,
          motivoUscita:u.motivo_uscita,
          categoria:categoriaAttuale(nascita,dataFine,"suino"),
          categoriaInizio:categoriaAttuale(nascita,nascita,"suino"),
          uba,
          lotto:codLotto,
          note:null,
        });
      }
    }
    return out;
  },[animali,lotti,suiniLotto,dataRif]);

  // ── Filtri applicati ───────────────────────────────────────────────────────
  const righeFiltrate = useMemo(()=>{
    return righeUBA.filter(r=>{
      if(filtroSpecie!=="tutti"&&r.specie!==filtroSpecie) return false;
      if(filtroStato==="attivi"&&r.stato!=="attivo") return false;
      if(filtroStato==="usciti"&&r.stato==="attivo") return false;
      return true;
    });
  },[righeUBA,filtroSpecie,filtroStato]);

  // ── Aggregati ──────────────────────────────────────────────────────────────
  const totaleUBA = righeFiltrate.filter(r=>r.uba).reduce((s,r)=>s+r.uba,0);
  const totCapi = righeFiltrate.filter(r=>r.uba).length;

  const perSpecie = ["bovino","suino","ovino"].map(sp=>{
    const r = righeFiltrate.filter(x=>x.specie===sp&&x.uba!=null);
    const uba = r.reduce((s,x)=>s+x.uba,0);
    return { specie:sp, n:r.length, uba, pct:totaleUBA>0?Math.round(uba/totaleUBA*1000)/10:0 };
  }).filter(x=>x.n>0);

  const perCategoria = useMemo(()=>{
    const map = {};
    for (const r of righeFiltrate) {
      if (!r.uba||!r.categoria) continue;
      const key = r.specie+"||"+r.categoria;
      if (!map[key]) map[key]={specie:r.specie,categoria:r.categoria,n:0,uba:0,righe:[]};
      map[key].n++;
      map[key].uba+=r.uba;
      map[key].righe.push(r);
    }
    return Object.values(map).sort((a,b)=>b.uba-a.uba);
  },[righeFiltrate]);

  // ── Lotti aggregati (solo suini da lotto) ─────────────────────────────────
  const perLotto = useMemo(()=>{
    const map = {};
    for (const r of righeFiltrate.filter(x=>x.tipo==="lotto"&&x.lotto)) {
      if (!map[r.lotto]) map[r.lotto]={lotto:r.lotto,n:0,uba:0,righe:[]};
      map[r.lotto].n++;
      if (r.uba) map[r.lotto].uba+=r.uba;
      map[r.lotto].righe.push(r);
    }
    return Object.values(map).sort((a,b)=>b.uba-a.uba);
  },[righeFiltrate]);

  // ── VISTA DETTAGLIO ────────────────────────────────────────────────────────
  if (dettaglioVista) return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <ListaAnimaliUBA righe={dettaglioVista.righe} titolo={dettaglioVista.titolo}
        onBack={()=>setDettaglio(null)}/>
    </div>
  );

  // ── VISTA PRINCIPALE ───────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:80}}>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,
        borderRadius:"0 0 28px 28px",padding:"24px 16px 20px"}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>🐾 Calcolo UBA</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:2}}>
          Unità di Bestiame Adulto — ripartizione costi aziendali
        </div>
        {/* Data di riferimento */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,
          background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 12px"}}>
          <span style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>📅 Data riferimento:</span>
          <input type="date" value={dataRif} onChange={e=>setDataRif(e.target.value)}
            style={{background:"transparent",border:"none",color:"#FFF",
              fontSize:13,fontWeight:700,outline:"none",cursor:"pointer"}}/>
        </div>
      </div>

      <div style={{padding:"14px"}}>
        {loading?<Spinner/>:(
          <>
            {/* Totale UBA */}
            <Card style={{background:`linear-gradient(135deg,${C.primary}18,${C.card})`}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:4}}>
                UBA TOTALE AZIENDALE
              </div>
              <div style={{fontSize:40,fontWeight:900,color:C.primary}}>
                {totaleUBA.toFixed(2)}
              </div>
              <div style={{fontSize:13,color:C.muted}}>
                su {totCapi} capi · data {dataRif}
              </div>
            </Card>

            {/* Filtri */}
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              {["tutti","bovino","suino","ovino"].map(s=>(
                <button key={s} onClick={()=>setFiltro(s)}
                  style={{background:filtroSpecie===s?specieColor(s)||C.primary:C.card,
                    color:filtroSpecie===s?"#FFF":C.muted,
                    border:`1.5px solid ${filtroSpecie===s?specieColor(s)||C.primary:C.border}`,
                    borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,
                    cursor:"pointer",whiteSpace:"nowrap"}}>
                  {s==="tutti"?"🐾 Tutti":specieIcon(s)+" "+s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[["attivi","In stalla"],["usciti","Usciti"],["tutti","Tutti"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFiltroStato(v)}
                  style={{background:filtroStato===v?C.primary:C.card,
                    color:filtroStato===v?"#FFF":C.muted,
                    border:`1.5px solid ${filtroStato===v?C.primary:C.border}`,
                    borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,
                    cursor:"pointer"}}>
                  {l}
                </button>
              ))}
              <button onClick={()=>esportaUBA(righeFiltrate,dataRif)}
                style={{background:C.green,color:"#FFF",border:"none",borderRadius:20,
                  padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer",marginLeft:"auto"}}>
                📊 Excel
              </button>
            </div>

            {/* UBA per specie */}
            <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:8}}>
              RIPARTIZIONE PER SPECIE
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {perSpecie.map(s=>(
                <div key={s.specie}
                  onClick={()=>setDettaglio({
                    titolo:`${specieIcon(s.specie)} ${s.specie} — UBA dettaglio`,
                    righe:righeFiltrate.filter(r=>r.specie===s.specie)
                  })}
                  style={{background:C.card,borderRadius:14,padding:12,
                    boxShadow:"0 2px 6px rgba(0,0,0,0.06)",cursor:"pointer",
                    borderTop:`4px solid ${specieColor(s.specie)}`}}>
                  <div style={{fontSize:22,textAlign:"center"}}>{specieIcon(s.specie)}</div>
                  <div style={{fontSize:20,fontWeight:900,color:specieColor(s.specie),
                    textAlign:"center"}}>{s.uba.toFixed(2)}</div>
                  <div style={{fontSize:10,color:C.muted,textAlign:"center",fontWeight:600}}>
                    UBA · {s.n} capi
                  </div>
                  <div style={{background:specieColor(s.specie)+"22",borderRadius:6,
                    padding:"2px 6px",textAlign:"center",marginTop:4,
                    fontSize:11,fontWeight:700,color:specieColor(s.specie)}}>
                    {s.pct}%
                  </div>
                </div>
              ))}
            </div>

            {/* Barra percentuale specie */}
            {perSpecie.length>0&&(
              <Card style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8}}>
                  DISTRIBUZIONE UBA
                </div>
                <div style={{display:"flex",height:20,borderRadius:10,overflow:"hidden",gap:1}}>
                  {perSpecie.map(s=>(
                    <div key={s.specie} style={{width:`${s.pct}%`,background:specieColor(s.specie),
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:10,color:"#FFF",fontWeight:700,minWidth:s.pct>8?undefined:0}}>
                      {s.pct>8?s.pct+"%":""}
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
                  {perSpecie.map(s=>(
                    <span key={s.specie} style={{fontSize:11,color:specieColor(s.specie),
                      fontWeight:600}}>
                      {specieIcon(s.specie)} {s.pct}%
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Dettaglio per categoria */}
            <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:8}}>
              DETTAGLIO PER CATEGORIA
            </div>
            {perCategoria.map((cat,i)=>(
              <div key={i}
                onClick={()=>setDettaglio({
                  titolo:`${specieIcon(cat.specie)} ${cat.categoria}`,
                  righe:cat.righe
                })}
                style={{background:C.card,borderRadius:12,padding:"10px 14px",
                  marginBottom:8,border:`1px solid ${C.border}`,
                  borderLeft:`4px solid ${specieColor(cat.specie)}`,cursor:"pointer",
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{cat.categoria}</div>
                  <div style={{fontSize:12,color:C.muted}}>
                    {specieIcon(cat.specie)} {cat.n} capi
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:900,color:C.primary}}>
                    {cat.uba.toFixed(3)}
                  </div>
                  <div style={{fontSize:10,color:C.muted}}>UBA totali</div>
                </div>
              </div>
            ))}

            {/* Sezione lotti suini */}
            {perLotto.length>0&&(
              <>
                <div style={{fontSize:12,fontWeight:700,color:C.muted,margin:"16px 0 8px"}}>
                  LOTTI SUINI — DETTAGLIO
                </div>
                {perLotto.map((l,i)=>(
                  <div key={i}
                    onClick={()=>setDettaglio({
                      titolo:`🐷 Lotto ${l.lotto}`,
                      righe:l.righe
                    })}
                    style={{background:C.card,borderRadius:12,padding:"10px 14px",
                      marginBottom:8,border:`1px solid ${C.border}`,
                      borderLeft:`4px solid ${C.suini}`,cursor:"pointer",
                      display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:14,fontFamily:"monospace",
                        color:C.suini}}>{l.lotto}</div>
                      <div style={{fontSize:12,color:C.muted}}>🐷 {l.n} unità</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:20,fontWeight:900,color:C.primary}}>
                        {l.uba.toFixed(3)}
                      </div>
                      <div style={{fontSize:10,color:C.muted}}>UBA totali</div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Animali senza data nascita */}
            {(()=>{
              const senza=righeFiltrate.filter(r=>!r.uba);
              if(senza.length===0) return null;
              return(
                <div style={{background:C.yellow+"15",border:`1px solid ${C.yellow}33`,
                  borderRadius:12,padding:"10px 14px",marginTop:8,fontSize:12,color:C.muted}}>
                  ⚠️ {senza.length} animali esclusi dal calcolo per mancanza di data di nascita
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
