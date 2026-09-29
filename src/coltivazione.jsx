// ============================================================================
// SEZIONE COLTIVAZIONE — podereverdeapp.it
// ----------------------------------------------------------------------------
// Tre schermate: lista campi, scheda campo, riepilogo per coltura.
// Il registro gasolio (v111) e' qui dentro ma dalla v112 ha una scheda propria
// nella barra in basso: export "Gasolio".
// Tutto e' filtrato dalla CAMPAGNA agraria selezionata in alto (es. 2025/2026).
//
// Tre scelte di struttura che si discostano dal foglio Excel di partenza, e
// il perche' (dettagli in SPEC_COLTIVAZIONE.md):
//  1. Le lavorazioni sono ESECUZIONI ripetibili, non spunte singole: la medica
//     si sfalcia 3-4 volte l'anno e l'irrigazione idem. Una data sola perderebbe
//     giornate lavoro.
//  2. La raccolta registra un PRODOTTO, non una coltura: la paglia esce dagli
//     stessi ettari del grano. Trattarla da coltura raddoppierebbe gli ettari.
//  3. Le poliennali (medica, sulla) non richiedono la semina ogni campagna.
// ============================================================================
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import ReportColtivazione from "./coltivazione_report"; // v115
import StoricoColtivazione from "./coltivazione_storico"; // v116
import ProgrammaColtivazione from "./coltivazione_programma"; // v117

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
};
const today = () => new Date().toISOString().split("T")[0];

// --- Campagna agraria -------------------------------------------------------
// Il confine e' il 1 settembre: cosi' il grano seminato a novembre e trebbiato
// a giugno-luglio resta tutto dentro la stessa campagna.
const campagnaDiData = (d) => {
  const x = d ? new Date(d) : new Date();
  const a = x.getFullYear();
  return x.getMonth() >= 8 ? `${a}/${a + 1}` : `${a - 1}/${a}`;
};
const annoInizioDi = (campagna) => parseInt(String(campagna).split("/")[0], 10);

const COLTURE = ["Avena","Erba Medica","Erbaio Misto","Grano","Orzo",
  "Pisello Proteico","Produzione Seme","Sulla","Altro"];

// Colture poliennali: si seminano una volta e si raccolgono per piu' campagne
const POLIENNALI = ["Erba Medica","Sulla"];

// Solo grano e orzo ammettono le "dosi" come alternativa ai quintali
const AMMETTE_DOSI = ["Grano","Orzo"];

// Erbaio misto e produzione seme: il seme si compone di tre essenze,
// e puo' riguardarne anche una sola
const SEMENTI_COMPOSTE = ["Erbaio Misto","Produzione Seme"];
const ESSENZE = ["Trifoglio","Avena","Loietto"];

const LAVORAZIONI = [
  {nome:"Aratura",         icona:"🚜"},
  {nome:"Estirpatura",     icona:"🔧"},
  {nome:"Erpicatura",      icona:"🪝"},
  {nome:"Morganatura",     icona:"⚙️"},
  {nome:"Rippatura",       icona:"🔩"},
  {nome:"Spietratura",     icona:"🪨"},
  {nome:"Concimazione",    icona:"🧪"},
  {nome:"Semina",          icona:"🌱"},
  {nome:"Disserbo",        icona:"🧴"},
  {nome:"Sfalcio",         icona:"✂️"},
  {nome:"Ranghinatura",    icona:"🌾"},
  {nome:"Pressatura BALLE",icona:"📦"},
  {nome:"Raccolta Balle",  icona:"🚛"},
  {nome:"Trebbiatura",     icona:"🌽"},
  {nome:"Irrigazione",     icona:"💧"},
];

const CONCIMI = ["Binario","Ternario","Stallatico","Letame","Altro"];

// Prodotti della raccolta. sotto:true = sottoprodotto, esce dagli stessi ettari
// della coltura madre e nel riepilogo non ne raddoppia superficie e giornate.
const PRODOTTI = [
  {nome:"Avena",            unita:"quintali", sotto:false},
  {nome:"Erba medica",      unita:"balloni",  sotto:false},
  {nome:"Erbaio misto",     unita:"balloni",  sotto:false},
  {nome:"Grano",            unita:"quintali", sotto:false},
  {nome:"Orzo",             unita:"quintali", sotto:false},
  {nome:"Paglia",           unita:"balloni",  sotto:true},
  {nome:"Pisello proteico", unita:"quintali", sotto:false},
  {nome:"Sulla",            unita:"balloni",  sotto:false},
  {nome:"Seme Misto",       unita:"quintali", sotto:false},
  {nome:"Seme di Medica",   unita:"quintali", sotto:true},
  {nome:"Seme di sulla",    unita:"quintali", sotto:true},
  {nome:"Altro",            unita:"quintali", sotto:false},
];

const TIPI_CAMPO = {
  seminativo:{label:"Seminativo", colore:C.green},
  pascolo:   {label:"Pascolo",    colore:C.yellow},
  arboreo:   {label:"Arboreo",    colore:C.accent},
  altro:     {label:"Altro",      colore:C.muted},
};

// --- helper di formato ------------------------------------------------------
const num = (v, d = 2) => (v === null || v === undefined || v === "" || isNaN(v))
  ? "—" : Number(v).toLocaleString("it-IT",{minimumFractionDigits:d,maximumFractionDigits:d});
const dataIt = (d) => d ? new Date(d).toLocaleDateString("it-IT") : "—";

// --- componenti condivisi (stessa libreria degli altri moduli) ---------------
const inputStyle = {width:"100%",boxSizing:"border-box",border:`1.5px solid ${C.border}`,
  borderRadius:10,padding:"10px 12px",fontSize:15,background:"#FAFAF8",color:C.text,outline:"none"};
const Card = ({children,style={},onClick}) => (
  <div onClick={onClick} style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,
    boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:`1px solid ${C.border}`,
    cursor:onClick?"pointer":"default",...style}}>{children}</div>
);
const Badge = ({label,color}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,
    borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>
);
const Btn = ({label,icon,onClick,variant="primary",small=false,disabled=false,style={}}) => {
  const bg = {primary:C.primary,danger:C.red,success:C.green,ghost:"transparent"}[variant]||C.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
        background:bg,color:variant==="ghost"?C.text:"#FFF",
        border:variant==="ghost"?`1.5px solid ${C.border}`:"none",
        borderRadius:10,padding:small?"7px 12px":"11px 18px",fontSize:small?13:15,
        fontWeight:600,cursor:disabled?"default":"pointer",opacity:disabled?0.5:1,...style}}>
      {icon&&<span>{icon}</span>}{label}
    </button>
  );
};
const Field = ({label,value,onChange,type="text",options,required,placeholder,inputMode}) => (
  <div style={{marginBottom:12}}>
    <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>
      {label}{required&&<span style={{color:C.red}}> *</span>}
    </div>
    {options
      ? <select value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}>
          <option value="">— seleziona —</option>
          {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
        </select>
      : <input type={type} inputMode={inputMode} placeholder={placeholder} value={value??""}
          onChange={e=>onChange(e.target.value)} style={inputStyle}/>}
  </div>
);
const Spinner = () => (
  <div style={{textAlign:"center",padding:60,color:C.muted}}>
    <div style={{fontSize:36,marginBottom:12}}>⏳</div><div>Caricamento...</div>
  </div>
);
const Vuoto = ({icona,testo}) => (
  <div style={{textAlign:"center",padding:"32px 16px",color:C.muted}}>
    <div style={{fontSize:32,marginBottom:8}}>{icona}</div>
    <div style={{fontSize:13}}>{testo}</div>
  </div>
);

// --- correzioni (v114) ------------------------------------------------------
// Chi sta usando l'app e che cosa puo' correggere: le proprie righe entro 48 ore
// dall'inserimento, l'amministratore sempre. La regola vera sta nelle policy del
// database: qui serve solo a mostrare o nascondere matita e cestino.
const ORE_CORREZIONE = 48;
function useUtente(){
  const [utente,setUtente] = useState({id:null,admin:false});
  useEffect(()=>{ (async()=>{
    const {data:{user}} = await supabase.auth.getUser();
    if(!user){ return; }
    const {data:pr} = await supabase.from("profili").select("ruolo").eq("id",user.id).maybeSingle();
    setUtente({id:user.id,admin:pr?.ruolo==="admin"});
  })(); },[]);
  return utente;
}
const puoCorreggere = (riga,utente) => utente.admin ||
  (!!utente.id && riga.created_by===utente.id &&
   (Date.now()-new Date(riga.created_at).getTime()) < ORE_CORREZIONE*3600*1000);
const oreRimaste = (riga) => Math.max(0,Math.ceil(
  ORE_CORREZIONE-(Date.now()-new Date(riga.created_at).getTime())/3600000));
const ERR_CORREZIONE = "Non puoi piu' correggere questa riga: sono passate piu' di 48 ore "+
  "dall'inserimento, oppure non l'hai inserita tu. Chiedi all'amministratore.";
const Corretto = ({riga}) => riga.modificato_at ? (
  <div style={{fontSize:11,color:C.accent,marginTop:2}}>✏️ Corretto il {dataIt(riga.modificato_at)}</div>
) : null;

// ============================================================================
export default function Coltivazione() {
  const [campagna,setCampagna]   = useState(campagnaDiData());
  const [subTab,setSubTab]       = useState("campi");
  const [campi,setCampi]         = useState([]);
  const [colture,setColture]     = useState([]);
  const [semine,setSemine]       = useState([]);
  const [lavori,setLavori]       = useState([]);
  const [concimi,setConcimi]     = useState([]);
  const [diserbi,setDiserbi]     = useState([]);
  const [raccolte,setRaccolte]   = useState([]);
  const [loading,setLoading]     = useState(true);
  const [dettaglio,setDettaglio] = useState(null); // campo aperto
  const [errore,setErrore]       = useState("");

  // --- caricamento ----------------------------------------------------------
  const caricaCampi = useCallback(async()=>{
    const {data,error} = await supabase.from("campi").select("*")
      .eq("attivo",true).order("numero");
    if(error){ setErrore("Errore nel caricamento dei campi: "+error.message); return; }
    setCampi(data||[]);
  },[]);

  const caricaCampagna = useCallback(async()=>{
    setLoading(true); setErrore("");
    const {data:col,error} = await supabase.from("colture_campo").select("*")
      .eq("campagna",campagna).order("campo_id").order("ordine");
    if(error){ setErrore("Errore nel caricamento delle colture: "+error.message); setLoading(false); return; }
    const colture = col||[];
    setColture(colture);
    const ids = colture.map(c=>c.id);
    if(ids.length===0){
      setSemine([]); setLavori([]); setConcimi([]); setDiserbi([]); setRaccolte([]);
      setLoading(false); return;
    }
    const [{data:sem},{data:lav},{data:rac}] = await Promise.all([
      supabase.from("semine").select("*").in("coltura_campo_id",ids),
      supabase.from("lavorazioni_campo").select("*").in("coltura_campo_id",ids).order("data_esecuzione"),
      supabase.from("raccolte").select("*").in("coltura_campo_id",ids).order("data_raccolta"),
    ]);
    setSemine(sem||[]); setLavori(lav||[]); setRaccolte(rac||[]);
    const idsLav = (lav||[]).map(l=>l.id);
    if(idsLav.length>0){
      const [{data:con},{data:dis}] = await Promise.all([
        supabase.from("concimazioni").select("*").in("lavorazione_id",idsLav),
        supabase.from("diserbi").select("*").in("lavorazione_id",idsLav),
      ]);
      setConcimi(con||[]); setDiserbi(dis||[]);
    } else { setConcimi([]); setDiserbi([]); }
    setLoading(false);
  },[campagna]);

  useEffect(()=>{ caricaCampi(); },[caricaCampi]);
  useEffect(()=>{ caricaCampagna(); },[caricaCampagna]);

  // --- elenco campagne selezionabili ---------------------------------------
  const corrente = campagnaDiData();
  const annoOra  = annoInizioDi(corrente);
  const campagne = [];
  // v115 — si arriva fino al 2019/2020, prima campagna caricata nello storico
  for(let a=annoOra+1; a>=Math.min(annoOra-5,2019); a--) campagne.push(`${a}/${a+1}`);

  const coltureDelCampo = (campoId) => colture.filter(c=>c.campo_id===campoId);
  const nomeColtura = (c) => c.coltura==="Altro" ? (c.coltura_altro||"Altro") : c.coltura;

  if(dettaglio) return (
    <SchedaCampo
      campo={dettaglio} campagna={campagna}
      colture={coltureDelCampo(dettaglio.id)}
      semine={semine} lavori={lavori} concimi={concimi} diserbi={diserbi} raccolte={raccolte}
      onIndietro={()=>setDettaglio(null)} onRicarica={caricaCampagna}
    />
  );

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"16px 16px 24px"}}>

        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:24}}>🌾</span>
          <h2 style={{margin:0,fontSize:20,color:C.primary}}>Coltivazione</h2>
        </div>

        {/* selettore campagna — governa tutta la sezione */}
        <Card style={{padding:12,marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>Campagna agraria</div>
          <select value={campagna} onChange={e=>setCampagna(e.target.value)} style={inputStyle}>
            {campagne.map(c=>(
              <option key={c} value={c}>{c}{c===corrente?"  (in corso)":""}</option>
            ))}
          </select>
          <div style={{marginTop:8,padding:"8px 10px",borderRadius:8,
            background:C.yellow+"22",borderLeft:`4px solid ${C.yellow}`,
            fontSize:12,lineHeight:1.4,color:C.text}}>
            <b>📅 La campagna va dal 1° settembre al 31 agosto.</b><br/>
            La semina d'autunno e la trebbiatura dell'estate dopo stanno nella stessa campagna.
            Anche le semine di primavera-estate (pascoli, erbai in irriguo) appartengono alla
            campagna iniziata il settembre precedente. Vale sia per le schede sia per i costi.
          </div>
        </Card>

        {errore && (
          <Card style={{background:C.red+"12",border:`1.5px solid ${C.red}`}}>
            <div style={{color:C.red,fontSize:13,fontWeight:600}}>⚠️ {errore}</div>
          </Card>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {[{id:"campi",label:"🗺️ Campi"},{id:"riepilogo",label:"📊 Riepilogo"},{id:"programma",label:"🗓️ Programma"},{id:"report",label:"📈 Report"},{id:"storico",label:"📚 Storico"}].map(t=>(
            <button key={t.id} onClick={()=>setSubTab(t.id)}
              style={{gridColumn:t.id==="storico"?"1 / span 2":"auto",background:subTab===t.id?C.primary:"#FFF",
                color:subTab===t.id?"#FFF":C.text,border:`1.5px solid ${subTab===t.id?C.primary:C.border}`,
                borderRadius:12,padding:"10px 8px",fontSize:14,fontWeight:600,cursor:"pointer"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* v115 — istruzioni della linguetta aperta */}
        <div style={{margin:"-4px 0 12px",padding:"8px 10px",borderRadius:8,background:C.blue+"14",
          borderLeft:`4px solid ${C.blue}`,fontSize:12.5,lineHeight:1.4,color:C.text}}>
          {subTab==="campi" && <><b style={{color:C.blue}}>🗺️ Campi</b> · L'elenco dei campi. Tocca un campo per aprire la sua scheda e registrare semina, lavorazioni, concimazioni e raccolta della campagna scelta sopra.</>}
          {subTab==="riepilogo" && <><b style={{color:C.blue}}>📊 Riepilogo</b> · I totali della campagna per coltura: ettari, giornate di lavoro e quantità raccolte. Si compila da solo con i dati inseriti nei campi.</>}
          {subTab==="programma" && <><b style={{color:C.blue}}>🗓️ Programma</b> · Il programma di semina e concimazione della campagna scelta sopra: per ogni campo cosa si semina e si concima, la dose per ettaro e la quantità totale, con le istruzioni. In «Da acquistare» la lista dei semi e dei concimi da comprare. È un piano: quando si esegue un lavoro si registra nella scheda del campo.</>}
          {subTab==="report" && <><b style={{color:C.blue}}>📈 Report</b> · Quanto è costato ogni prodotto della campagna, il confronto con il prezzo di mercato e con le rese di riferimento, e dove si perde o si guadagna. Tocca una coltura per vedere i suoi campi.</>}
          {subTab==="storico" && <><b style={{color:C.blue}}>📚 Storico</b> · Tutte le stagioni insieme: costi e rese per coltura, la storia di ogni campo con la concimazione, la classifica dei campi per stagione e per resa. Non dipende dalla campagna scelta sopra e si aggiorna da solo con le nuove stagioni.</>}
        </div>

        {subTab==="programma" ? (
          <ProgrammaColtivazione campagna={campagna}/>
        ) : subTab==="storico" ? (
          <StoricoColtivazione/>
        ) : subTab==="report" ? (
          <ReportColtivazione campagna={campagna}/>
        ) : loading ? <Spinner/> : subTab==="campi" ? (
          <ListaCampi campi={campi} coltureDelCampo={coltureDelCampo}
            nomeColtura={nomeColtura} onApri={setDettaglio}/>
        ) : (
          <Riepilogo campi={campi} colture={colture} lavori={lavori}
            raccolte={raccolte} nomeColtura={nomeColtura} campagna={campagna}/>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LISTA CAMPI
// ============================================================================
function ListaCampi({campi,coltureDelCampo,nomeColtura,onApri}){
  const totale     = campi.reduce((s,c)=>s+Number(c.ettari||0),0);
  const seminativi = campi.filter(c=>c.tipo==="seminativo")
    .reduce((s,c)=>s+Number(c.ettari||0),0);

  return (<>
    <Card style={{background:C.primary,color:"#FFF",border:"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",textAlign:"center"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:22,fontWeight:800}}>{campi.length}</div>
          <div style={{fontSize:11,opacity:0.85}}>campi</div>
        </div>
        <div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.25)"}}>
          <div style={{fontSize:22,fontWeight:800}}>{num(totale,2)}</div>
          <div style={{fontSize:11,opacity:0.85}}>ettari totali</div>
        </div>
        <div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.25)"}}>
          <div style={{fontSize:22,fontWeight:800}}>{num(seminativi,2)}</div>
          <div style={{fontSize:11,opacity:0.85}}>ha seminativi</div>
        </div>
      </div>
    </Card>

    {campi.length===0 && <Vuoto icona="🗺️" testo="Nessun campo in anagrafica."/>}

    {campi.map(campo=>{
      const cols = coltureDelCampo(campo.id);
      const tipo = TIPI_CAMPO[campo.tipo]||TIPI_CAMPO.altro;
      return (
        <Card key={campo.id} onClick={()=>onApri(campo)} style={{padding:0,overflow:"hidden"}}>
          {campo.foto_url && (
            <div style={{height:120,overflow:"hidden",background:C.border}}>
              <img src={campo.foto_url} alt={campo.nome} loading="lazy"
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            </div>
          )}
          <div style={{padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700,color:C.primary}}>
                  {campo.numero}. {campo.nome}
                </div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>
                  {num(campo.ettari,2)} ha · {num(campo.metri_quadri,0)} m²
                </div>
              </div>
              <Badge label={tipo.label} color={tipo.colore}/>
            </div>
            <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
              {cols.length===0
                ? <span style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>
                    Nessuna coltura in questa campagna
                  </span>
                : cols.map(c=>(
                    <Badge key={c.id} color={C.green}
                      label={`🌱 ${nomeColtura(c)}${c.poliennale?" (poliennale)":""}`}/>
                  ))}
            </div>
          </div>
        </Card>
      );
    })}
  </>);
}

// ============================================================================
// SCHEDA CAMPO
// ============================================================================
function SchedaCampo({campo,campagna,colture,semine,lavori,concimi,diserbi,raccolte,onIndietro,onRicarica}){
  const [nuovaColtura,setNuovaColtura] = useState(null);
  const [errore,setErrore] = useState("");
  const tipo = TIPI_CAMPO[campo.tipo]||TIPI_CAMPO.altro;
  const ettari = Number(campo.ettari||0);

  const salvaColtura = async()=>{
    if(!nuovaColtura.coltura){ setErrore("Scegli la coltura"); return; }
    if(nuovaColtura.coltura==="Altro" && !(nuovaColtura.coltura_altro||"").trim()){
      setErrore("Scrivi il nome della coltura"); return;
    }
    const ordine = (colture.reduce((m,c)=>Math.max(m,c.ordine||1),0))+1;
    const poli = POLIENNALI.includes(nuovaColtura.coltura);
    const {error} = await supabase.from("colture_campo").insert([{
      campo_id: campo.id,
      campagna, anno_inizio: annoInizioDi(campagna),
      ordine,
      coltura: nuovaColtura.coltura,
      coltura_altro: nuovaColtura.coltura==="Altro" ? nuovaColtura.coltura_altro.trim() : null,
      poliennale: poli,
      campagna_semina: poli ? (nuovaColtura.campagna_semina||campagna) : null,
    }]);
    if(error){ setErrore("Errore nel salvataggio: "+error.message); return; }
    setNuovaColtura(null); setErrore(""); onRicarica();
  };

  const eliminaColtura = async(c)=>{
    if(!window.confirm(`Eliminare "${c.coltura}" da questo campo per la campagna ${campagna}?\n\nSi perdono semina, lavorazioni e raccolte collegate.`)) return;
    const {error} = await supabase.from("colture_campo").delete().eq("id",c.id);
    if(error){
      setErrore("Non e' stato possibile eliminare la coltura. La cancellazione di una coltura e' riservata all'amministratore — chiedi a Filippo.");
      return;
    }
    onRicarica();
  };

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"16px 16px 24px"}}>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <button onClick={onIndietro} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
          <div style={{minWidth:0}}>
            <div style={{fontSize:17,fontWeight:700,color:C.primary}}>{campo.numero}. {campo.nome}</div>
            <div style={{fontSize:12,color:C.muted}}>Campagna {campagna}</div>
          </div>
        </div>

        {errore && (
          <Card style={{background:C.red+"12",border:`1.5px solid ${C.red}`}}>
            <div style={{color:C.red,fontSize:13,fontWeight:600}}>⚠️ {errore}</div>
          </Card>
        )}

        {/* anagrafica del campo */}
        <Card style={{padding:0,overflow:"hidden"}}>
          {campo.foto_url && (
            <img src={campo.foto_url} alt={campo.nome}
              style={{width:"100%",display:"block",background:C.border}}/>
          )}
          <div style={{padding:14}}>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Badge label={tipo.label} color={tipo.colore}/>
              <Badge label={`${num(ettari,2)} ha`} color={C.blue}/>
              <Badge label={`${num(campo.metri_quadri,0)} m²`} color={C.muted}/>
            </div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>
              <div><b style={{color:C.text}}>Comune</b> {campo.comune||"—"}</div>
              <div><b style={{color:C.text}}>Foglio</b> {campo.foglio||"—"}</div>
              <div><b style={{color:C.text}}>Particelle</b>{" "}
                {(campo.particelle&&campo.particelle.length>0)
                  ? campo.particelle.join(", ")
                  : <span style={{color:C.red}}>da inserire</span>}</div>
            </div>
            {campo.note && (
              <div style={{marginTop:8,fontSize:11,color:C.red,fontStyle:"italic"}}>{campo.note}</div>
            )}
          </div>
        </Card>

        {/* colture della campagna */}
        {colture.length===0 && !nuovaColtura && (
          <Card><Vuoto icona="🌱" testo={`Nessuna coltura registrata per la campagna ${campagna}.`}/></Card>
        )}

        {colture.map(col=>(
          <BloccoColtura key={col.id} coltura={col} ettari={ettari} campagna={campagna}
            semine={semine.filter(s=>s.coltura_campo_id===col.id)}
            lavori={lavori.filter(l=>l.coltura_campo_id===col.id)}
            concimi={concimi} diserbi={diserbi}
            raccolte={raccolte.filter(r=>r.coltura_campo_id===col.id)}
            onRicarica={onRicarica} onElimina={()=>eliminaColtura(col)}/>
        ))}

        {/* aggiunta coltura */}
        {nuovaColtura ? (
          <Card style={{border:`2px solid ${C.green}`}}>
            <div style={{fontSize:15,fontWeight:700,color:C.primary,marginBottom:12}}>
              🌱 Nuova coltura su questo campo
            </div>
            <Field label="Coltura" required value={nuovaColtura.coltura} options={COLTURE}
              onChange={v=>setNuovaColtura(f=>({...f,coltura:v}))}/>
            {nuovaColtura.coltura==="Altro" && (
              <Field label="Nome della coltura" required value={nuovaColtura.coltura_altro}
                placeholder="es. Favino"
                onChange={v=>setNuovaColtura(f=>({...f,coltura_altro:v}))}/>
            )}
            {POLIENNALI.includes(nuovaColtura.coltura) && (
              <div style={{background:C.yellow+"15",border:`1px solid ${C.yellow}55`,
                borderRadius:10,padding:12,marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:6}}>
                  Coltura poliennale
                </div>
                <div style={{fontSize:11,color:C.muted,marginBottom:8}}>
                  Si semina una volta e si raccoglie per piu' campagne. Se e' stata seminata
                  in una campagna precedente, indicala qui: il programma non ti chiedera'
                  il seme in questa.
                </div>
                <Field label="Campagna di semina" value={nuovaColtura.campagna_semina??campagna}
                  onChange={v=>setNuovaColtura(f=>({...f,campagna_semina:v}))}
                  placeholder="es. 2024/2025"/>
              </div>
            )}
            <div style={{display:"flex",gap:8}}>
              <Btn label="Salva" icon="✓" variant="success" onClick={salvaColtura} style={{flex:1}}/>
              <Btn label="Annulla" variant="ghost" onClick={()=>{setNuovaColtura(null);setErrore("");}}/>
            </div>
          </Card>
        ) : (
          <Btn label="Aggiungi coltura" icon="+" onClick={()=>setNuovaColtura({coltura:""})}
            style={{width:"100%",marginTop:4}}/>
        )}

        {colture.length>1 && (
          <div style={{fontSize:11,color:C.muted,marginTop:10,textAlign:"center"}}>
            Piu' colture nella stessa campagna = successione sullo stesso terreno.
            Nel riepilogo gli ettari vengono contati per ciascuna.
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// BLOCCO COLTURA — semina + lavorazioni + raccolta
// ============================================================================
function BloccoColtura({coltura,ettari,campagna,semine,lavori,concimi,diserbi,raccolte,onRicarica,onElimina}){
  const [sezione,setSezione] = useState("lavorazioni");
  const nome = coltura.coltura==="Altro" ? (coltura.coltura_altro||"Altro") : coltura.coltura;
  // Poliennale gia' seminata in una campagna precedente: il seme non si richiede
  const seminaAltrove = coltura.poliennale && coltura.campagna_semina && coltura.campagna_semina!==campagna;

  return (
    <Card style={{padding:0,overflow:"hidden",border:`1.5px solid ${C.green}55`}}>
      <div style={{background:C.green+"12",padding:"12px 14px",
        display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:15,fontWeight:700,color:C.primary}}>🌱 {nome}</div>
          {coltura.poliennale && (
            <div style={{fontSize:11,color:C.muted}}>
              Poliennale · seminata nella campagna {coltura.campagna_semina||campagna}
            </div>
          )}
        </div>
        <button onClick={onElimina} title="Elimina coltura"
          style={{background:"none",border:"none",cursor:"pointer",fontSize:16,opacity:0.55}}>🗑️</button>
      </div>

      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        {[{id:"semina",label:"Semina"},{id:"lavorazioni",label:"Lavorazioni"},{id:"raccolta",label:"Raccolta"}].map(s=>(
          <button key={s.id} onClick={()=>setSezione(s.id)}
            style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:"10px 4px",
              fontSize:13,fontWeight:sezione===s.id?700:500,
              color:sezione===s.id?C.primary:C.muted,
              borderBottom:sezione===s.id?`2.5px solid ${C.primary}`:"2.5px solid transparent"}}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{padding:14}}>
        {sezione==="semina" && (
          seminaAltrove
            ? <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>
                Coltura poliennale seminata nella campagna <b>{coltura.campagna_semina}</b>.
                In questa campagna non si semina: registra solo lavorazioni e raccolta.
              </div>
            : <Semina coltura={coltura} ettari={ettari} semine={semine} onRicarica={onRicarica}/>
        )}
        {sezione==="lavorazioni" && (
          <Lavorazioni coltura={coltura} ettari={ettari} lavori={lavori}
            concimi={concimi} diserbi={diserbi} onRicarica={onRicarica}/>
        )}
        {sezione==="raccolta" && (
          <Raccolta coltura={coltura} ettari={ettari} raccolte={raccolte} onRicarica={onRicarica}/>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// SEMINA
// ============================================================================
function Semina({coltura,ettari,semine,onRicarica}){
  const [form,setForm] = useState(null);
  const [errore,setErrore] = useState("");
  const composta = SEMENTI_COMPOSTE.includes(coltura.coltura);
  const nome = coltura.coltura==="Altro" ? (coltura.coltura_altro||"Altro") : coltura.coltura;
  const semiPossibili = composta ? ESSENZE : [nome];
  const puoDosi = AMMETTE_DOSI.includes(coltura.coltura);

  const salva = async()=>{
    const q = parseFloat(String(form.quantita).replace(",","."));
    if(!form.seme){ setErrore("Scegli il seme"); return; }
    if(!q || q<=0){ setErrore("Inserisci una quantita' maggiore di zero"); return; }
    const {error} = await supabase.from("semine").insert([{
      coltura_campo_id: coltura.id,
      seme: form.seme,
      unita: form.unita||"quintali",
      quantita: q,
      data_semina: form.data_semina||null,
    }]);
    if(error){ setErrore("Errore nel salvataggio: "+error.message); return; }
    setForm(null); setErrore(""); onRicarica();
  };

  const elimina = async(id)=>{
    if(!window.confirm("Eliminare questa riga di semina?")) return;
    await supabase.from("semine").delete().eq("id",id);
    onRicarica();
  };

  return (<>
    {semine.length===0 && !form && <Vuoto icona="🌾" testo="Nessuna semina registrata."/>}

    {semine.map(s=>{
      const perHa = ettari>0 ? Number(s.quantita)/ettari : null;
      return (
        <div key={s.id} style={{borderBottom:`1px solid ${C.border}`,padding:"10px 0",
          display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{s.seme}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>
              {num(s.quantita,2)} {s.unita}
              {s.unita==="quintali" && <> · {num(Number(s.quantita)*100,0)} kg</>}
              {s.data_semina && <> · {dataIt(s.data_semina)}</>}
            </div>
            <div style={{fontSize:12,color:C.green,fontWeight:700,marginTop:2}}>
              {perHa!==null ? `${num(perHa,3)} ${s.unita}/ha` : "—"}
              {s.unita==="quintali" && perHa!==null && <> · {num(perHa*100,1)} kg/ha</>}
            </div>
          </div>
          <button onClick={()=>elimina(s.id)}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:0.5}}>🗑️</button>
        </div>
      );
    })}

    {errore && <div style={{color:C.red,fontSize:12,fontWeight:600,marginTop:8}}>⚠️ {errore}</div>}

    {form ? (
      <div style={{marginTop:12,padding:12,background:C.bg,borderRadius:12,
        border:`1.5px solid ${C.border}`}}>
        <Field label="Seme" required value={form.seme} options={semiPossibili}
          onChange={v=>setForm(f=>({...f,seme:v}))}/>
        {puoDosi && (
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>Unita' di misura</div>
            <div style={{display:"flex",gap:8}}>
              {["quintali","dosi"].map(u=>(
                <button key={u} onClick={()=>setForm(f=>({...f,unita:u}))}
                  style={{flex:1,background:(form.unita||"quintali")===u?C.primary:"#FFF",
                    color:(form.unita||"quintali")===u?"#FFF":C.text,
                    border:`1.5px solid ${(form.unita||"quintali")===u?C.primary:C.border}`,
                    borderRadius:10,padding:"9px 8px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                  {u}
                </button>
              ))}
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:5}}>
              Per grano e orzo puoi usare le dosi al posto dei quintali. Le dosi non
              si convertono in kg: il programma calcola dosi/ha.
            </div>
          </div>
        )}
        <Field label={`Quantita' in ${form.unita||"quintali"}`} required type="text" inputMode="decimal"
          value={form.quantita} placeholder="es. 3,5"
          onChange={v=>setForm(f=>({...f,quantita:v}))}/>
        <Field label="Data di semina" type="date" value={form.data_semina}
          onChange={v=>setForm(f=>({...f,data_semina:v}))}/>
        <div style={{display:"flex",gap:8}}>
          <Btn label="Salva" icon="✓" variant="success" small onClick={salva} style={{flex:1}}/>
          <Btn label="Annulla" variant="ghost" small onClick={()=>{setForm(null);setErrore("");}}/>
        </div>
      </div>
    ) : (
      <Btn label={composta?"Aggiungi seme":"Registra semina"} icon="+" small
        onClick={()=>setForm({seme:composta?"":semiPossibili[0],unita:"quintali",data_semina:today()})}
        style={{width:"100%",marginTop:10}}/>
    )}

    {composta && (
      <div style={{fontSize:11,color:C.muted,marginTop:10,lineHeight:1.5}}>
        {coltura.coltura} si compone di trifoglio, avena e loietto. Registra una riga
        per ciascuna essenza impiegata — anche una sola, se hai usato solo quella.
      </div>
    )}
  </>);
}

// ============================================================================
// LAVORAZIONI — ogni esecuzione e' una riga
// ============================================================================
function Lavorazioni({coltura,ettari,lavori,concimi,diserbi,onRicarica}){
  const [aperta,setAperta] = useState(null);  // nome lavorazione espansa
  const [form,setForm]     = useState(null);
  const [errore,setErrore] = useState("");
  const utente = useUtente();

  // correzione di un'esecuzione gia' registrata
  const apriCorrezione = (r)=>{
    setForm({id:r.id, tipo:r.tipo, created_at:r.created_at,
      data_esecuzione:r.data_esecuzione||"",
      giornate_lavoro:r.giornate_lavoro===null||r.giornate_lavoro===undefined?"":String(r.giornate_lavoro).replace(".",","),
      note:r.note||"", concimi:[], diserbo:{prodotto:"",quantita:"",unita:"litri"}});
    setErrore("");
  };

  const perTipo = (tipo) => lavori.filter(l=>l.tipo===tipo);
  const giornateTot = lavori.reduce((s,l)=>s+Number(l.giornate_lavoro||0),0);

  const apriForm = (tipo)=>{
    setForm({tipo,data_esecuzione:today(),giornate_lavoro:"",note:"",
      concimi:[], diserbo:{prodotto:"",quantita:"",unita:"litri"}});
    setErrore("");
  };

  const salva = async()=>{
    const g = form.giornate_lavoro==="" ? null : parseFloat(String(form.giornate_lavoro).replace(",","."));
    if(!form.data_esecuzione){ setErrore("Metti la data"); return; }
    if(g!==null && (isNaN(g)||g<0)){ setErrore("Le giornate lavoro non sono valide"); return; }

    if(form.id){   // correzione: il database accetta solo entro 48 ore (o admin)
      const {data:agg,error:eu} = await supabase.from("lavorazioni_campo").update({
        data_esecuzione: form.data_esecuzione,
        giornate_lavoro: g,
        note: form.note||null,
      }).eq("id",form.id).select("id");
      if(eu){ setErrore("Errore nella correzione: "+eu.message); return; }
      if(!agg || agg.length===0){ setErrore(ERR_CORREZIONE); return; }
      setForm(null); setErrore(""); onRicarica(); return;
    }

    const {data,error} = await supabase.from("lavorazioni_campo").insert([{
      coltura_campo_id: coltura.id,
      tipo: form.tipo,
      data_esecuzione: form.data_esecuzione,
      giornate_lavoro: g,
      note: form.note||null,
    }]).select("id").single();
    if(error||!data){ setErrore("Errore nel salvataggio: "+(error?error.message:"nessuna riga creata")); return; }

    if(form.tipo==="Concimazione"){
      const righe = form.concimi
        .filter(c=>c.tipo && parseFloat(String(c.quintali).replace(",","."))>0)
        .map(c=>({
          lavorazione_id: data.id,
          tipo_concime: c.tipo,
          tipo_concime_altro: c.tipo==="Altro" ? (c.altro||null) : null,
          quintali: parseFloat(String(c.quintali).replace(",",".")),
        }));
      if(righe.length>0){
        const {error:e2} = await supabase.from("concimazioni").insert(righe);
        if(e2){ setErrore("Lavorazione salvata, ma i concimi no: "+e2.message); onRicarica(); return; }
      }
    }
    if(form.tipo==="Disserbo"){
      const q = parseFloat(String(form.diserbo.quantita).replace(",","."));
      if(form.diserbo.prodotto && q>0){
        const {error:e3} = await supabase.from("diserbi").insert([{
          lavorazione_id: data.id,
          prodotto: form.diserbo.prodotto,
          quantita: q,
          unita: form.diserbo.unita||"litri",
        }]);
        if(e3){ setErrore("Lavorazione salvata, ma il diserbo no: "+e3.message); onRicarica(); return; }
      }
    }
    setForm(null); setErrore(""); onRicarica();
  };

  const elimina = async(id)=>{
    if(!window.confirm("Eliminare questa esecuzione?")) return;
    const {error,count} = await supabase.from("lavorazioni_campo").delete({count:"exact"}).eq("id",id);
    if(error || count===0){ setErrore(ERR_CORREZIONE); return; }
    onRicarica();
  };

  return (<>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      marginBottom:10,fontSize:12,color:C.muted}}>
      <span>{lavori.length} esecuzion{lavori.length===1?"e":"i"}</span>
      <span style={{fontWeight:700,color:C.primary}}>{num(giornateTot,1)} giornate lavoro</span>
    </div>

    <div style={{border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      {LAVORAZIONI.map((L,i)=>{
        const righe   = perTipo(L.nome);
        const fatta   = righe.length>0;
        const ultima  = fatta ? righe[righe.length-1] : null;
        const giorni  = righe.reduce((s,r)=>s+Number(r.giornate_lavoro||0),0);
        const espansa = aperta===L.nome;
        return (
          <div key={L.nome} style={{borderBottom:i<LAVORAZIONI.length-1?`1px solid ${C.border}`:"none"}}>
            <div onClick={()=>setAperta(espansa?null:L.nome)}
              style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",
                cursor:"pointer",background:fatta?C.green+"0D":"transparent"}}>
              <div style={{width:22,height:22,borderRadius:6,flexShrink:0,
                background:fatta?C.green:"#FFF",border:`1.5px solid ${fatta?C.green:C.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#FFF",fontSize:13,fontWeight:800}}>
                {fatta?"✓":""}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:fatta?700:500,color:fatta?C.text:C.muted}}>
                  {L.icona} {L.nome}
                  {righe.length>1 && (
                    <span style={{marginLeft:6,background:C.blue,color:"#FFF",borderRadius:10,
                      padding:"1px 7px",fontSize:10,fontWeight:800}}>×{righe.length}</span>
                  )}
                </div>
                {fatta && (
                  <div style={{fontSize:11,color:C.muted,marginTop:1}}>
                    {righe.length>1?"ultima ":""}{dataIt(ultima.data_esecuzione)}
                    {giorni>0 && <> · {num(giorni,1)} gg</>}
                  </div>
                )}
              </div>
              <span style={{fontSize:12,color:C.muted}}>{espansa?"▲":"▼"}</span>
            </div>

            {espansa && (
              <div style={{padding:"4px 12px 12px",background:C.bg}}>
                {righe.length===0 && (
                  <div style={{fontSize:12,color:C.muted,padding:"6px 0"}}>
                    Non ancora eseguita.
                  </div>
                )}
                {righe.map(r=>(
                  <DettaglioEsecuzione key={r.id} riga={r} ettari={ettari}
                    concimi={concimi.filter(c=>c.lavorazione_id===r.id)}
                    diserbi={diserbi.filter(d=>d.lavorazione_id===r.id)}
                    correggibile={puoCorreggere(r,utente)}
                    onCorreggi={()=>apriCorrezione(r)}
                    onElimina={()=>elimina(r.id)}/>
                ))}
                <Btn label={righe.length>0?"Aggiungi un'altra esecuzione":"Registra esecuzione"}
                  icon="+" small variant="ghost" onClick={()=>apriForm(L.nome)}
                  style={{width:"100%",marginTop:8}}/>
              </div>
            )}
          </div>
        );
      })}
    </div>

    <div style={{fontSize:11,color:C.muted,marginTop:10,lineHeight:1.5}}>
      Ogni lavorazione puo' essere registrata piu' volte: irrigazione e sfalcio si
      ripetono nella stessa campagna, e ogni volta ha la sua data e le sue giornate.
    </div>

    {form && (
      <div style={{marginTop:12,padding:14,background:"#FFF",borderRadius:12,
        border:`2px solid ${C.primary}`}}>
        <div style={{fontSize:14,fontWeight:700,color:form.id?C.accent:C.primary,marginBottom:form.id?4:12}}>
          {form.id ? "✏️ Correggi — "+form.tipo : form.tipo}
        </div>
        {form.id && (
          <div style={{fontSize:11,color:C.muted,marginBottom:12}}>
            Cambia solo il dato sbagliato e salva. La correzione resta segnata sulla riga.
            {!utente.admin && <> Puoi correggere ancora per circa <b>{oreRimaste(form)} ore</b>.</>}
            {(form.tipo==="Concimazione"||form.tipo==="Disserbo") && <> I prodotti usati non si correggono da qui: per ora si cancella la riga e si rifà.</>}
          </div>
        )}
        <Field label="Data di esecuzione" required type="date" value={form.data_esecuzione}
          onChange={v=>setForm(f=>({...f,data_esecuzione:v}))}/>
        <Field label="Giornate lavoro impiegate" type="text" inputMode="decimal"
          value={form.giornate_lavoro} placeholder="es. 1,5"
          onChange={v=>setForm(f=>({...f,giornate_lavoro:v}))}/>

        {form.tipo==="Concimazione" && !form.id && (
          <FormConcimi form={form} setForm={setForm} ettari={ettari}/>
        )}
        {form.tipo==="Disserbo" && !form.id && (
          <div style={{background:C.bg,borderRadius:10,padding:12,marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>Prodotto usato</div>
            <Field label="Tipo di disserbo" value={form.diserbo.prodotto}
              placeholder="scrivi il nome del prodotto"
              onChange={v=>setForm(f=>({...f,diserbo:{...f.diserbo,prodotto:v}}))}/>
            <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
              <div style={{flex:1}}>
                <Field label="Quantita'" type="text" inputMode="decimal" value={form.diserbo.quantita}
                  onChange={v=>setForm(f=>({...f,diserbo:{...f.diserbo,quantita:v}}))}/>
              </div>
              <div style={{width:110}}>
                <Field label="Unita'" value={form.diserbo.unita} options={["litri","kg"]}
                  onChange={v=>setForm(f=>({...f,diserbo:{...f.diserbo,unita:v}}))}/>
              </div>
            </div>
            {parseFloat(String(form.diserbo.quantita).replace(",","."))>0 && ettari>0 && (
              <div style={{fontSize:12,color:C.green,fontWeight:700}}>
                {num(parseFloat(String(form.diserbo.quantita).replace(",","."))/ettari,3)} {form.diserbo.unita}/ha
              </div>
            )}
          </div>
        )}

        <Field label="Note" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>
        {errore && <div style={{color:C.red,fontSize:12,fontWeight:600,marginBottom:8}}>⚠️ {errore}</div>}
        <div style={{display:"flex",gap:8}}>
          <Btn label={form.id?"Salva correzione":"Salva"} icon="✓" variant="success" onClick={salva} style={{flex:1}}/>
          <Btn label="Annulla" variant="ghost" onClick={()=>{setForm(null);setErrore("");}}/>
        </div>
      </div>
    )}
  </>);
}

function DettaglioEsecuzione({riga,ettari,concimi,diserbi,correggibile,onCorreggi,onElimina}){
  return (
    <div style={{background:"#FFF",borderRadius:10,padding:10,marginTop:8,
      border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>{dataIt(riga.data_esecuzione)}</div>
          <div style={{fontSize:11,color:C.muted}}>
            {riga.giornate_lavoro ? `${num(riga.giornate_lavoro,1)} giornate lavoro` : "giornate non indicate"}
          </div>
          {riga.note && <div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginTop:2}}>{riga.note}</div>}
          <Corretto riga={riga}/>
        </div>
        {correggibile && (
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button onClick={onCorreggi} title="Correggi"
              style={{background:"none",border:"none",cursor:"pointer",fontSize:13,opacity:0.7}}>✏️</button>
            <button onClick={onElimina} title="Cancella"
              style={{background:"none",border:"none",cursor:"pointer",fontSize:13,opacity:0.5}}>🗑️</button>
          </div>
        )}
      </div>

      {concimi.length>0 && (
        <div style={{marginTop:8,paddingTop:8,borderTop:`1px dashed ${C.border}`}}>
          {concimi.map(c=>(
            <div key={c.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:2}}>
              <span style={{color:C.text}}>🧪 {c.tipo_concime==="Altro"?(c.tipo_concime_altro||"Altro"):c.tipo_concime}</span>
              <span style={{color:C.muted}}>
                {num(c.quintali,2)} q
                {ettari>0 && <b style={{color:C.green}}>{"  "}({num(Number(c.quintali)/ettari,2)} q/ha)</b>}
              </span>
            </div>
          ))}
        </div>
      )}
      {diserbi.length>0 && (
        <div style={{marginTop:8,paddingTop:8,borderTop:`1px dashed ${C.border}`}}>
          {diserbi.map(d=>(
            <div key={d.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:2}}>
              <span style={{color:C.text}}>🧴 {d.prodotto}</span>
              <span style={{color:C.muted}}>
                {num(d.quantita,2)} {d.unita}
                {ettari>0 && <b style={{color:C.green}}>{"  "}({num(Number(d.quantita)/ettari,3)}/ha)</b>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormConcimi({form,setForm,ettari}){
  const toggle = (tipo)=>{
    setForm(f=>{
      const c = f.concimi||[];
      return c.find(x=>x.tipo===tipo)
        ? {...f,concimi:c.filter(x=>x.tipo!==tipo)}
        : {...f,concimi:[...c,{tipo,quintali:"",altro:""}]};
    });
  };
  const setQ = (tipo,campo,v)=>setForm(f=>({...f,
    concimi:f.concimi.map(x=>x.tipo===tipo?{...x,[campo]:v}:x)}));

  return (
    <div style={{background:C.bg,borderRadius:10,padding:12,marginBottom:12}}>
      <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:2}}>Concimi impiegati</div>
      <div style={{fontSize:11,color:C.muted,marginBottom:8}}>
        Puoi sceglierne piu' di uno: non sono alternativi.
      </div>
      {CONCIMI.map(tipo=>{
        const sel = (form.concimi||[]).find(x=>x.tipo===tipo);
        const q = sel ? parseFloat(String(sel.quintali).replace(",",".")) : 0;
        return (
          <div key={tipo} style={{marginBottom:6}}>
            <div onClick={()=>toggle(tipo)}
              style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"6px 0"}}>
              <div style={{width:20,height:20,borderRadius:6,flexShrink:0,
                background:sel?C.green:"#FFF",border:`1.5px solid ${sel?C.green:C.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#FFF",fontSize:12,fontWeight:800}}>{sel?"✓":""}</div>
              <span style={{fontSize:13,fontWeight:sel?700:500,color:sel?C.text:C.muted}}>{tipo}</span>
            </div>
            {sel && (
              <div style={{paddingLeft:28}}>
                {tipo==="Altro" && (
                  <input value={sel.altro||""} onChange={e=>setQ(tipo,"altro",e.target.value)}
                    placeholder="nome del concime"
                    style={{...inputStyle,padding:"7px 10px",fontSize:13,marginBottom:6}}/>
                )}
                <input value={sel.quintali} onChange={e=>setQ(tipo,"quintali",e.target.value)}
                  inputMode="decimal" placeholder="quintali"
                  style={{...inputStyle,padding:"7px 10px",fontSize:13}}/>
                {q>0 && ettari>0 && (
                  <div style={{fontSize:11,color:C.green,fontWeight:700,marginTop:3}}>
                    {num(q/ettari,2)} q/ha
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// RACCOLTA
// ============================================================================
function Raccolta({coltura,ettari,raccolte,onRicarica}){
  const [form,setForm] = useState(null);
  const [errore,setErrore] = useState("");
  const utente = useUtente();

  const apriCorrezione = (r)=>{
    const inCatalogo = PRODOTTI.some(p=>p.nome===r.prodotto);
    setForm({id:r.id, created_at:r.created_at,
      prodotto: inCatalogo ? r.prodotto : "Altro",
      prodotto_altro: inCatalogo ? "" : r.prodotto,
      unita:r.unita, quantita:String(r.quantita).replace(".",","),
      data_raccolta:r.data_raccolta||""});
    setErrore("");
  };

  const salva = async()=>{
    const q = parseFloat(String(form.quantita).replace(",","."));
    if(!form.prodotto){ setErrore("Scegli il prodotto"); return; }
    if(form.prodotto==="Altro" && !(form.prodotto_altro||"").trim()){
      setErrore("Scrivi il nome del prodotto"); return;
    }
    if(!q || q<=0){ setErrore("Inserisci una quantita' maggiore di zero"); return; }
    const def = PRODOTTI.find(p=>p.nome===form.prodotto);
    const campi = {
      prodotto: form.prodotto==="Altro" ? form.prodotto_altro.trim() : form.prodotto,
      sottoprodotto: def ? def.sotto : false,
      unita: form.unita || (def?def.unita:"quintali"),
      quantita: q,
      data_raccolta: form.data_raccolta||null,
    };
    if(form.id){   // correzione
      const {data:agg,error:eu} = await supabase.from("raccolte").update(campi).eq("id",form.id).select("id");
      if(eu){ setErrore("Errore nella correzione: "+eu.message); return; }
      if(!agg || agg.length===0){ setErrore(ERR_CORREZIONE); return; }
      setForm(null); setErrore(""); onRicarica(); return;
    }
    const {error} = await supabase.from("raccolte").insert([{coltura_campo_id: coltura.id, ...campi}]);
    if(error){ setErrore("Errore nel salvataggio: "+error.message); return; }
    setForm(null); setErrore(""); onRicarica();
  };

  const elimina = async(id)=>{
    if(!window.confirm("Eliminare questa riga di raccolta?")) return;
    const {error,count} = await supabase.from("raccolte").delete({count:"exact"}).eq("id",id);
    if(error || count===0){ setErrore(ERR_CORREZIONE); return; }
    onRicarica();
  };

  return (<>
    {raccolte.length===0 && !form && <Vuoto icona="🚜" testo="Nessuna raccolta registrata."/>}

    {raccolte.map(r=>{
      const resa = ettari>0 ? Number(r.quantita)/ettari : null;
      return (
        <div key={r.id} style={{borderBottom:`1px solid ${C.border}`,padding:"10px 0",
          display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>
              {r.prodotto}
              {r.sottoprodotto && (
                <span style={{marginLeft:6}}><Badge label="sottoprodotto" color={C.yellow}/></span>
              )}
            </div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>
              {num(r.quantita,2)} {r.unita}{r.data_raccolta && <> · {dataIt(r.data_raccolta)}</>}
            </div>
            <div style={{fontSize:12,color:C.green,fontWeight:700,marginTop:2}}>
              {resa!==null ? `${num(resa,2)} ${r.unita}/ha` : "—"}
            </div>
            <Corretto riga={r}/>
          </div>
          {puoCorreggere(r,utente) && (
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button onClick={()=>apriCorrezione(r)} title="Correggi"
                style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:0.7}}>✏️</button>
              <button onClick={()=>elimina(r.id)} title="Cancella"
                style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:0.5}}>🗑️</button>
            </div>
          )}
        </div>
      );
    })}

    {errore && <div style={{color:C.red,fontSize:12,fontWeight:600,marginTop:8}}>⚠️ {errore}</div>}

    {form ? (
      <div style={{marginTop:12,padding:12,background:C.bg,borderRadius:12,
        border:`1.5px solid ${form.id?C.accent:C.border}`}}>
        {form.id && (
          <div style={{fontSize:13,fontWeight:700,color:C.accent,marginBottom:8}}>
            ✏️ Correggi la raccolta
            {!utente.admin && <span style={{fontSize:11,fontWeight:400,color:C.muted}}> — ancora per circa {oreRimaste(form)} ore</span>}
          </div>
        )}
        <Field label="Prodotto raccolto" required value={form.prodotto}
          options={PRODOTTI.map(p=>p.nome)}
          onChange={v=>{
            const d = PRODOTTI.find(p=>p.nome===v);
            setForm(f=>({...f,prodotto:v,unita:d?d.unita:"quintali"}));
          }}/>
        {form.prodotto==="Altro" && (
          <Field label="Nome del prodotto" required value={form.prodotto_altro}
            onChange={v=>setForm(f=>({...f,prodotto_altro:v}))}/>
        )}
        {form.prodotto && PRODOTTI.find(p=>p.nome===form.prodotto)?.sotto && (
          <div style={{background:C.yellow+"15",border:`1px solid ${C.yellow}55`,borderRadius:10,
            padding:10,marginBottom:12,fontSize:11,color:C.text,lineHeight:1.5}}>
            <b>Sottoprodotto.</b> Esce dagli stessi ettari della coltura principale.
            Nel riepilogo la quantita' e la resa/ha si vedono, ma ettari e giornate
            restano contati una volta sola sulla coltura madre.
          </div>
        )}
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <div style={{flex:1}}>
            <Field label="Quantita'" required type="text" inputMode="decimal" value={form.quantita}
              onChange={v=>setForm(f=>({...f,quantita:v}))}/>
          </div>
          <div style={{width:130}}>
            <Field label="Unita'" value={form.unita}
              options={["quintali","balloni","rotoballe","kg"]}
              onChange={v=>setForm(f=>({...f,unita:v}))}/>
          </div>
        </div>
        <Field label="Data di raccolta" type="date" value={form.data_raccolta}
          onChange={v=>setForm(f=>({...f,data_raccolta:v}))}/>
        {parseFloat(String(form.quantita).replace(",","."))>0 && ettari>0 && (
          <div style={{fontSize:13,color:C.green,fontWeight:700,marginBottom:10}}>
            Resa: {num(parseFloat(String(form.quantita).replace(",","."))/ettari,2)} {form.unita}/ha
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <Btn label={form.id?"Salva correzione":"Salva"} icon="✓" variant="success" small onClick={salva} style={{flex:1}}/>
          <Btn label="Annulla" variant="ghost" small onClick={()=>{setForm(null);setErrore("");}}/>
        </div>
      </div>
    ) : (
      <Btn label="Registra raccolta" icon="+" small
        onClick={()=>setForm({prodotto:"",unita:"quintali",quantita:"",data_raccolta:today()})}
        style={{width:"100%",marginTop:10}}/>
    )}
  </>);
}

// ============================================================================
// RIEPILOGO PER COLTURA
// ============================================================================
function Riepilogo({campi,colture,lavori,raccolte,nomeColtura,campagna}){
  const ettariDi = (campoId)=>{
    const c = campi.find(x=>x.id===campoId);
    return c ? Number(c.ettari||0) : 0;
  };

  // Aggrega per nome coltura
  const mappa = {};
  colture.forEach(col=>{
    const nome = nomeColtura(col);
    if(!mappa[nome]) mappa[nome] = {ettari:0, giornate:0, campi:0, prodotti:{}};
    const g = mappa[nome];
    g.ettari += ettariDi(col.campo_id);
    g.campi  += 1;
    g.giornate += lavori.filter(l=>l.coltura_campo_id===col.id)
      .reduce((s,l)=>s+Number(l.giornate_lavoro||0),0);
    raccolte.filter(r=>r.coltura_campo_id===col.id).forEach(r=>{
      const k = `${r.prodotto}|${r.unita}`;
      if(!g.prodotti[k]) g.prodotti[k] = {prodotto:r.prodotto,unita:r.unita,
        sottoprodotto:r.sottoprodotto,quantita:0};
      g.prodotti[k].quantita += Number(r.quantita||0);
    });
  });

  const righe = Object.entries(mappa)
    .map(([nome,v])=>({nome,...v,prodotti:Object.values(v.prodotti)}))
    .sort((a,b)=>b.ettari-a.ettari);

  const totEttari   = righe.reduce((s,r)=>s+r.ettari,0);
  const totGiornate = righe.reduce((s,r)=>s+r.giornate,0);

  if(righe.length===0) return (
    <Card><Vuoto icona="📊" testo={`Nessuna coltura registrata nella campagna ${campagna}. Il riepilogo si compila da solo man mano che inserite i dati nei campi.`}/></Card>
  );

  return (<>
    <Card style={{background:C.primary,color:"#FFF",border:"none"}}>
      <div style={{fontSize:12,opacity:0.85,marginBottom:8}}>Campagna {campagna}</div>
      <div style={{display:"flex",justifyContent:"space-between",textAlign:"center"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:20,fontWeight:800}}>{righe.length}</div>
          <div style={{fontSize:11,opacity:0.85}}>colture</div>
        </div>
        <div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.25)"}}>
          <div style={{fontSize:20,fontWeight:800}}>{num(totEttari,2)}</div>
          <div style={{fontSize:11,opacity:0.85}}>ettari coltivati</div>
        </div>
        <div style={{flex:1,borderLeft:"1px solid rgba(255,255,255,0.25)"}}>
          <div style={{fontSize:20,fontWeight:800}}>{num(totGiornate,1)}</div>
          <div style={{fontSize:11,opacity:0.85}}>giornate lavoro</div>
        </div>
      </div>
    </Card>

    {righe.map(r=>(
      <Card key={r.nome}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
          gap:8,marginBottom:10}}>
          <div style={{fontSize:16,fontWeight:700,color:C.primary}}>🌱 {r.nome}</div>
          <Badge label={`${r.campi} camp${r.campi===1?"o":"i"}`} color={C.muted}/>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <div style={{flex:1,background:C.bg,borderRadius:10,padding:"8px 10px"}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:600}}>ETTARI DEDICATI</div>
            <div style={{fontSize:16,fontWeight:800,color:C.text}}>{num(r.ettari,2)}</div>
          </div>
          <div style={{flex:1,background:C.bg,borderRadius:10,padding:"8px 10px"}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:600}}>GIORNATE LAVORO</div>
            <div style={{fontSize:16,fontWeight:800,color:C.text}}>{num(r.giornate,1)}</div>
          </div>
        </div>

        {r.prodotti.length===0 ? (
          <div style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>
            Nessuna raccolta registrata: rese non calcolabili.
          </div>
        ) : (
          <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            {r.prodotti.map((p,i)=>{
              const resaHa = r.ettari>0   ? p.quantita/r.ettari   : null;
              const resaGg = r.giornate>0 ? p.quantita/r.giornate : null;
              return (
                <div key={p.prodotto+p.unita}
                  style={{padding:"10px 12px",background:p.sottoprodotto?C.yellow+"0D":"#FFF",
                    borderBottom:i<r.prodotti.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.text}}>
                      {p.prodotto}
                      {p.sottoprodotto && (
                        <span style={{marginLeft:6,fontSize:10,color:C.yellow,fontWeight:700}}>
                          sottoprodotto
                        </span>
                      )}
                    </div>
                    <div style={{fontSize:14,fontWeight:800,color:C.primary,whiteSpace:"nowrap"}}>
                      {num(p.quantita,2)} <span style={{fontSize:11,fontWeight:600,color:C.muted}}>{p.unita}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:14,marginTop:5,fontSize:11}}>
                    <span style={{color:C.muted}}>
                      resa/ha <b style={{color:C.green}}>{resaHa!==null?num(resaHa,2):"—"}</b>
                    </span>
                    <span style={{color:C.muted}}>
                      resa/giornata <b style={{color:C.green}}>{resaGg!==null?num(resaGg,2):"—"}</b>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    ))}

    <div style={{fontSize:11,color:C.muted,lineHeight:1.6,padding:"4px 4px 16px"}}>
      Gli ettari di un sottoprodotto (paglia, seme di medica, seme di sulla) non si
      sommano: escono dagli stessi ettari della coltura che li ha prodotti, e contarli
      due volte gonfierebbe la superficie aziendale. Le loro rese sono comunque
      calcolate su quegli ettari.
    </div>
  </>);
}

// ============================================================================
// REGISTRO GASOLIO — prelievi dalla cisterna aziendale (con contalitri)
// ----------------------------------------------------------------------------
// Ogni riga: data e ora, operatore, mezzo, litri, lettura del contalitri.
// Data e ora: di norma le mette il SERVER al momento del salvataggio (non si
// possono cambiare). Con "Registrazione tardiva" l'operatore indica quando e'
// avvenuto il prelievo (mai nel futuro); la riga resta segnata come tardiva e
// created_at conserva quando e' stata scritta.
// Operatori e mezzi vengono da coltivazione_catalogo (ambiti "operatore" e
// "mezzo"). Un nome scritto in "Altro" si memorizza come voce da verificare,
// cosi' la volta dopo e' gia' in lista e non nascono doppioni.
// Le righe sono filtrate dalla campagna selezionata (1 settembre - 31 agosto).
// ============================================================================
const ALTRO = "__altro__";
const numIn = (v) => parseFloat(String(v??"").replace(",","."));
const MOTIVI = [{v:"coltivazione",l:"🌾 Coltivazione"},{v:"allevamento",l:"🐄 Allevamento"},{v:"altro",l:"Altro"}];
const nomeMotivo = (r) => r.motivo==="altro" ? (r.motivo_altro||"Altro")
  : (MOTIVI.find(m=>m.v===r.motivo)?.l.replace(/^\S+\s/,"")||r.motivo);
const oraIt = (d) => d ? new Date(d).toLocaleString("it-IT",{day:"2-digit",month:"2-digit",
  year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—";
// "YYYY-MM-DDTHH:MM" nell'ora locale del telefono, per <input type="datetime-local">
const adessoLocale = () => { const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset());
  return d.toISOString().slice(0,16); };


// --- Menu a tendina in cui si puo' anche scrivere --------------------------
// Si tocca il campo: si apre l'elenco. Si scrive: l'elenco si restringe alle
// voci che contengono il testo. Se il testo scritto coincide con una voce
// (maiuscole e spazi a parte) si usa quella; se non c'e', diventa "Altro"
// con quel nome, che al salvataggio viene memorizzato come da verificare.
// onChange(value, testo): value = id della voce, ALTRO, oppure "".
const normVoce = (t) => (t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .trim().replace(/\s+/g," ").toLowerCase();

function SceltaScrivi({label,voci,value,testo,onChange}){
  const [aperto,setAperto] = useState(false);
  const scelta = value && value!==ALTRO ? voci.find(v=>String(v.id)===String(value)) : null;
  const [scritto,setScritto] = useState(scelta ? scelta.voce : (testo||""));

  const q = normVoce(scritto);
  const esatta = q ? voci.find(v=>normVoce(v.voce)===q) : null;
  const filtrate = q && !scelta ? voci.filter(v=>normVoce(v.voce).includes(q)) : voci;

  const scrivi = (t)=>{
    setScritto(t); setAperto(true);
    const n = normVoce(t);
    const e = n ? voci.find(v=>normVoce(v.voce)===n) : null;
    if(e) onChange(String(e.id),"");
    else if(n) onChange(ALTRO,t.trim().replace(/\s+/g," "));
    else onChange("","");
  };
  const scegli = (v)=>{ setScritto(v.voce); onChange(String(v.id),""); setAperto(false); };
  const nuovo = value===ALTRO;

  const riga = {padding:"10px 12px",fontSize:14,cursor:"pointer",borderBottom:`1px solid ${C.border}`};
  return (
    <div style={{marginBottom:12,position:"relative"}}>
      <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>
        {label}<span style={{color:C.red}}> *</span>
      </div>
      <div style={{position:"relative"}}>
        <input value={scritto} placeholder="Scegli dall'elenco o scrivi…"
          onFocus={()=>setAperto(true)} onBlur={()=>setTimeout(()=>setAperto(false),150)}
          onChange={e=>scrivi(e.target.value)}
          style={{...inputStyle,paddingRight:36,
            borderColor:nuovo?C.yellow:(scelta?C.green:C.border)}}/>
        <span onMouseDown={e=>{e.preventDefault();setAperto(a=>!a);}}
          style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
            cursor:"pointer",color:C.muted,fontSize:14}}>▾</span>
      </div>
      {aperto && (
        <div style={{position:"absolute",left:0,right:0,zIndex:20,background:"#FFF",
          border:`1.5px solid ${C.border}`,borderRadius:10,marginTop:4,maxHeight:260,overflowY:"auto",
          boxShadow:"0 6px 16px rgba(0,0,0,0.12)"}}>
          {(scelta ? voci : filtrate).map(v=>(
            <div key={v.id} onMouseDown={e=>{e.preventDefault();scegli(v);}}
              style={{...riga,background:String(v.id)===String(value)?C.green+"15":"#FFF"}}>
              {v.voce}{v.da_verificare && <span style={{fontSize:11,color:C.muted}}> (da verificare)</span>}
            </div>
          ))}
          {q && !esatta ? (
            <div onMouseDown={e=>{e.preventDefault();setAperto(false);}}
              style={{...riga,color:C.accent,fontWeight:600}}>
              ➕ Altro: «{scritto.trim()}» <span style={{fontWeight:400,fontSize:11}}>(nome nuovo)</span>
            </div>
          ) : !q && (
            <div style={{...riga,color:C.muted,fontSize:12,cursor:"default"}}>
              Altro: scrivi il nome qui sopra
            </div>
          )}
        </div>
      )}
      {nuovo && !aperto && (
        <div style={{fontSize:11,color:C.accent,marginTop:4}}>
          ➕ Nome nuovo: verrà memorizzato come «da verificare».
        </div>
      )}
    </div>
  );
}


// --- Istruzioni per l'operatore (riquadro apribile) -------------------------
// etichette e valori leggibili per lo storico delle correzioni
const ETICHETTE_CAMPI = {litri:"Litri",contalitri:"Contalitri",cisterna_id:"Cisterna",operatore_id:"Operatore",
  mezzo_id:"Mezzo",motivo:"Motivo",motivo_altro:"Motivo (altro)",note:"Note",data_ora:"Data e ora"};
const valoreCampo = (k,v,nomeVoce) => {
  if(v===null || v===undefined || v==="") return "—";
  if(k.endsWith("_id")) return nomeVoce(Number(v));
  if(k==="data_ora") return oraIt(v);
  if(k==="motivo") return nomeMotivo({motivo:v});
  if(k==="litri"||k==="contalitri") return num(v,v%1?1:0);
  return String(v);
};

function IstruzioniGasolio(){
  const [aperto,setAperto] = useState(false);
  const passi = [
    ["Tocca «Registra rifornimento»","si apre il modulo."],
    ["Data e ora","si registrano da sole al momento del salvataggio. Se stai scrivendo un prelievo fatto prima (per esempio ieri sera), spunta «Registrazione tardiva» e indica giorno e ora in cui hai preso il gasolio."],
    ["Cisterna","scegli la cisterna da cui hai preso il gasolio. Se non è in elenco, scrivi il suo nome."],
    ["Operatore e mezzo","tocca il campo e scegli dall'elenco, oppure inizia a scrivere: l'elenco si restringe. Se il nome non c'è, scrivilo per intero e scegli «➕ Altro»: resterà in elenco per la volta dopo."],
    ["Motivo","tocca Coltivazione, Allevamento oppure Altro. Con Altro scrivi per cosa serve il gasolio."],
    ["Litri","scrivi i litri presi (si può usare la virgola)."],
    ["Contalitri","se puoi, scrivi il numero che segna il contalitri della cisterna DOPO il prelievo. Se non torna con l'ultima lettura, l'app te lo segnala: ricontrolla il numero, può capitare di leggerlo male o che manchi un prelievo precedente."],
    ["Salva","il rifornimento compare nell'elenco in basso."],
  ];
  return (
    <Card style={{padding:12,background:C.blue+"0D",border:`1px solid ${C.blue}40`}}>
      <div onClick={()=>setAperto(a=>!a)} style={{display:"flex",justifyContent:"space-between",
        alignItems:"center",cursor:"pointer"}}>
        <b style={{fontSize:14,color:C.blue}}>ℹ️ Come si registra un rifornimento</b>
        <span style={{color:C.blue,fontSize:13}}>{aperto?"chiudi ▲":"apri ▼"}</span>
      </div>
      {aperto && (<>
        <div style={{margin:"10px 0",padding:"10px 12px",background:"#FFF",borderRadius:10,
          border:`1px solid ${C.green}40`,fontSize:12,lineHeight:1.55,color:C.text}}>
          <div style={{fontSize:13,fontWeight:700,color:C.green,marginBottom:4}}>🌱 Perché è importante</div>
          Il gasolio è una delle spese più grandi dell'azienda. Ogni litro che registri serve a
          <b> sapere quanto ci costa davvero</b> produrre il nostro fieno e il nostro orzo e allevare
          i nostri animali.
          <ul style={{margin:"6px 0",paddingLeft:18}}>
            <li>capiamo <b>cosa conviene coltivare</b> e cosa conviene comprare;</li>
            <li>scegliamo <b>la macchina giusta per ogni attività</b>;</li>
            <li><b>ottimizziamo la nostra azienda</b>.</li>
          </ul>
          Dati giusti = decisioni giuste = un'azienda più forte, per tutti noi.
          <div style={{marginTop:6,fontWeight:700}}>
            Bastano 30 secondi: registra <u>ogni</u> prelievo, subito dopo averlo fatto.
          </div>
        </div>
        <ol style={{margin:0,paddingLeft:20,fontSize:12,lineHeight:1.5,color:C.text}}>
          {passi.map(([t,d])=>(
            <li key={t} style={{marginBottom:6}}><b>{t}</b>: {d}</li>
          ))}
        </ol>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>
          I campi con <span style={{color:C.red}}>*</span> sono obbligatori: senza, il rifornimento non si salva.
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.blue,margin:"12px 0 4px"}}>Se hai sbagliato</div>
        <ul style={{margin:0,paddingLeft:20,fontSize:12,lineHeight:1.5,color:C.text}}>
          <li style={{marginBottom:6}}><b>Un dato sbagliato</b> (mezzo, litri, motivo…): tocca la matita ✏️
            sulla riga, correggi solo quel dato e tocca «Salva correzione». Data e ora restano quelle
            del prelievo.</li>
          <li style={{marginBottom:6}}><b>Rifornimento inserito due volte</b>, o che non andava inserito:
            cancellalo col cestino 🗑️.</li>
          <li style={{marginBottom:6}}><b>Hai 48 ore</b> dall'inserimento per correggere o cancellare i
            rifornimenti inseriti da te. Dopo, la matita e il cestino spariscono: avvisa l'amministratore,
            che può correggere sempre.</li>
          <li><b>Ogni correzione resta scritta</b> sulla riga («✏️ Corretto il… da…»): toccando
            «cosa è cambiato» si vede il valore di prima e quello nuovo.</li>
        </ul>
      </>)}
    </Card>
  );
}

function RegistroGasolio({campagna}){
  const [voci,setVoci]         = useState([]);   // operatori + mezzi
  const [righe,setRighe]       = useState([]);
  const [letture,setLetture]   = useState({});   // ultima lettura contalitri per cisterna
  const [loading,setLoading]   = useState(true);
  const [form,setForm]         = useState(null);
  const [errore,setErrore]     = useState("");
  const [salvando,setSalvando] = useState(false);
  const [utente,setUtente]     = useState({id:null,admin:false});
  const [modifiche,setModifiche] = useState([]); // storico correzioni delle righe mostrate
  const [persone,setPersone]   = useState({});   // uuid -> nome (per "modificato da")
  const [storicoAperto,setStoricoAperto] = useState(null);

  const anno = annoInizioDi(campagna);
  const dal = `${anno}-09-01`, al = `${anno+1}-08-31`;

  const carica = useCallback(async()=>{
    setLoading(true); setErrore("");
    const [{data:v,error:e1},{data:r,error:e2},{data:u}] = await Promise.all([
      supabase.from("coltivazione_catalogo").select("id,ambito,voce,ordine,da_verificare,attiva")
        .in("ambito",["cisterna","operatore","mezzo"]).order("ordine",{nullsFirst:false}).order("voce"),
      supabase.from("gasolio_rifornimenti").select("*")
        .gte("data",dal).lte("data",al)
        .order("data_ora",{ascending:false}),
      supabase.from("gasolio_rifornimenti").select("cisterna_id,data_ora,contalitri")
        .not("contalitri","is",null)
        .order("data_ora",{ascending:false}).limit(500),
    ]);
    if(e1||e2) setErrore("Errore nel caricamento: "+(e1||e2).message);
    setVoci(v||[]); setRighe(r||[]); const ult = {};   // la prima riga per cisterna e' la piu' recente
    (u||[]).forEach(x=>{ if(!ult[x.cisterna_id]) ult[x.cisterna_id]=x; });
    setLetture(ult);
    // chi sono (per sapere cosa posso correggere) e storico delle correzioni
    const {data:{user}} = await supabase.auth.getUser();
    let admin = false;
    if(user){
      const {data:pr} = await supabase.from("profili").select("ruolo").eq("id",user.id).maybeSingle();
      admin = pr?.ruolo==="admin";
    }
    setUtente({id:user?.id||null,admin});
    const ids = (r||[]).filter(x=>x.modificato_at).map(x=>x.id);
    const {data:mod} = ids.length ? await supabase.from("gasolio_rifornimenti_modifiche")
      .select("*").in("rifornimento_id",ids).eq("azione","modifica").order("fatta_at") : {data:[]};
    setModifiche(mod||[]);
    const uuids = [...new Set([...(r||[]).map(x=>x.modificato_da),...(mod||[]).map(x=>x.fatta_da)].filter(Boolean))];
    if(uuids.length){
      const {data:pp} = await supabase.from("profili").select("id,nome,cognome").in("id",uuids);
      const m = {}; (pp||[]).forEach(x=>{ m[x.id]=[x.nome,x.cognome].filter(Boolean).join(" ")||"utente"; });
      setPersone(m);
    }
    setLoading(false);
  },[dal,al]);
  useEffect(()=>{ carica(); },[carica]);

  const operatori = voci.filter(v=>v.ambito==="operatore" && v.attiva!==false);
  const mezzi     = voci.filter(v=>v.ambito==="mezzo" && v.attiva!==false);
  const cisterne  = voci.filter(v=>v.ambito==="cisterna" && v.attiva!==false);
  const nomeVoce  = (id) => voci.find(v=>v.id===id)?.voce || "?";
  const daVerif   = (id) => voci.find(v=>v.id===id)?.da_verificare;

  // voce scelta dall'elenco, oppure nome nuovo scritto in "Altro":
  // se esiste gia' (maiuscole/spazi a parte) si usa quella, altrimenti si memorizza
  const risolviVoce = async(ambito, scelta, testo, userId)=>{
    if(scelta!==ALTRO) return parseInt(scelta,10);
    const nome = (testo||"").trim().replace(/\s+/g," ");
    const esiste = voci.find(v=>v.ambito===ambito && v.voce.trim().toLowerCase()===nome.toLowerCase());
    if(esiste) return esiste.id;
    const {data,error} = await supabase.from("coltivazione_catalogo")
      .insert([{ambito, voce:nome, da_verificare:true, inserita_da:userId}]).select("id").single();
    if(error) throw new Error("Non riesco a memorizzare «"+nome+"»: "+error.message);
    return data.id;
  };

  // l'operatore corregge le proprie righe entro 48 ore dall'inserimento; l'admin sempre
  const ORE_CORREZIONE = 48;
  const puoCorreggere = (r) => utente.admin || (!!utente.id && r.created_by===utente.id &&
    (Date.now()-new Date(r.created_at).getTime()) < ORE_CORREZIONE*3600*1000);
  const oreRimaste = (r) => Math.max(0,Math.ceil(ORE_CORREZIONE-(Date.now()-new Date(r.created_at).getTime())/3600000));
  const locale = (iso) => { const d=new Date(iso); d.setMinutes(d.getMinutes()-d.getTimezoneOffset());
    return d.toISOString().slice(0,16); };

  const apriCorrezione = (r)=>{
    setErrore("");
    setForm({id:r.id, tardiva:r.tardiva, data_ora:locale(r.data_ora), data_ora_orig:r.data_ora,
      created_at:r.created_at, created_by:r.created_by,
      cisterna:String(r.cisterna_id), operatore:String(r.operatore_id), mezzo:String(r.mezzo_id),
      motivo:r.motivo||"", motivo_altro:r.motivo_altro||"",
      litri:String(r.litri).replace(".",","),
      contalitri:r.contalitri===null?"":String(r.contalitri).replace(".",","),
      note:r.note||""});
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const salva = async()=>{
    const litri = numIn(form.litri);
    const lettura = form.contalitri==="" ? null : numIn(form.contalitri);
    if(form.tardiva){
      if(!form.data_ora){ setErrore("Indica data e ora del prelievo"); return; }
      if(new Date(form.data_ora) > new Date()){ setErrore("Data e ora non possono essere nel futuro"); return; }
    }
    if(!form.cisterna){ setErrore("Scegli la cisterna"); return; }
    if(form.cisterna===ALTRO && !(form.cisterna_altro||"").trim()){ setErrore("Scrivi il nome della cisterna"); return; }
    if(!form.operatore){ setErrore("Scegli l'operatore"); return; }
    if(form.operatore===ALTRO && !(form.operatore_altro||"").trim()){ setErrore("Scrivi il nome dell'operatore"); return; }
    if(!form.mezzo){ setErrore("Scegli il mezzo"); return; }
    if(form.mezzo===ALTRO && !(form.mezzo_altro||"").trim()){ setErrore("Scrivi il nome del mezzo"); return; }
    if(!form.motivo){ setErrore("Scegli il motivo del prelievo"); return; }
    if(form.motivo==="altro" && !(form.motivo_altro||"").trim()){ setErrore("Scrivi il motivo"); return; }
    if(!litri || litri<=0){ setErrore("Inserisci i litri (maggiori di zero)"); return; }
    if(lettura!==null && (isNaN(lettura) || lettura<0)){ setErrore("La lettura del contalitri non e' valida"); return; }
    setSalvando(true); setErrore("");
    try{
      const {data:{user}} = await supabase.auth.getUser();
      const cisterna_id  = await risolviVoce("cisterna",form.cisterna,form.cisterna_altro,user?.id);
      const operatore_id = await risolviVoce("operatore",form.operatore,form.operatore_altro,user?.id);
      const mezzo_id     = await risolviVoce("mezzo",form.mezzo,form.mezzo_altro,user?.id);
      const campi = {
        // registrazione normale: data e ora le mette il server e non si cambiano
        ...(form.tardiva ? {data_ora: new Date(form.data_ora).toISOString()} : {}),
        cisterna_id, operatore_id, mezzo_id, litri, contalitri:lettura,
        motivo:form.motivo, motivo_altro:form.motivo==="altro" ? form.motivo_altro.trim() : null,
        note:(form.note||"").trim()||null,
      };
      if(form.id){
        // correzione: il database accetta solo entro 48 ore (o admin) e ne tiene lo storico
        const {data,error} = await supabase.from("gasolio_rifornimenti")
          .update(campi).eq("id",form.id).select("id");
        if(error) throw new Error("Errore nella correzione: "+error.message);
        if(!data || data.length===0) throw new Error(
          "Non puoi più correggere questo rifornimento: sono passate più di 48 ore dall'inserimento, "+
          "oppure non l'hai inserito tu. Chiedi all'amministratore.");
      } else {
        const {error} = await supabase.from("gasolio_rifornimenti")
          .insert([{tardiva: !!form.tardiva, ...campi}]);
        if(error) throw new Error("Errore nel salvataggio: "+error.message);
      }
      setForm(null); await carica();
    }catch(e){ setErrore(e.message); }
    setSalvando(false);
  };

  const elimina = async(id)=>{
    if(!window.confirm("Eliminare questo rifornimento?")) return;
    const {error,count} = await supabase.from("gasolio_rifornimenti").delete({count:"exact"}).eq("id",id);
    if(error || count===0){ setErrore("Puoi cancellare solo i rifornimenti inseriti da te, entro 48 ore. Altrimenti chiedi all'amministratore."); return; }
    carica();
  };

  // controllo contalitri: la nuova lettura dovrebbe essere ultima lettura
  // DI QUELLA CISTERNA + litri (ogni cisterna ha il suo contalitri)
  // (in correzione il controllo non si fa: l'ultima lettura potrebbe essere proprio questa riga)
  const ultima = form && !form.id && form.cisterna && form.cisterna!==ALTRO ? letture[form.cisterna]||null : null;
  const litriForm   = form ? numIn(form.litri) : NaN;
  const letturaForm = form && form.contalitri!=="" ? numIn(form.contalitri) : NaN;
  const attesa = ultima && !isNaN(litriForm) ? Number(ultima.contalitri)+litriForm : null;
  const scarto = attesa!==null && !isNaN(letturaForm) ? letturaForm-attesa : null;

  const totale = righe.reduce((s,r)=>s+Number(r.litri),0);
  const perMezzo = {};
  righe.forEach(r=>{ perMezzo[r.mezzo_id]=(perMezzo[r.mezzo_id]||0)+Number(r.litri); });

  if(loading) return <Spinner/>;

  return (<>
    <IstruzioniGasolio/>
    {/* totali della campagna */}
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
        <div style={{fontSize:13,fontWeight:700,color:C.muted}}>⛽ Gasolio prelevato {campagna}</div>
        <div style={{fontSize:20,fontWeight:800,color:C.primary}}>{num(totale,0)} L</div>
      </div>
      {Object.keys(perMezzo).length>0 && (
        <div style={{marginTop:8}}>
          {Object.entries(perMezzo).sort((a,b)=>b[1]-a[1]).map(([id,l])=>(
            <div key={id} style={{display:"flex",justifyContent:"space-between",fontSize:13,
              padding:"4px 0",borderTop:`1px solid ${C.border}`}}>
              <span>{nomeVoce(Number(id))}</span><b>{num(l,0)} L</b>
            </div>
          ))}
        </div>
      )}
      <div style={{fontSize:11,color:C.muted,marginTop:8}}>
        {Object.keys(letture).length===0
          ? "Nessuna lettura del contalitri ancora registrata."
          : Object.entries(letture).map(([id,l])=>(
              <div key={id}>Contalitri {nomeVoce(Number(id))}: <b>{num(l.contalitri,0)}</b> ({oraIt(l.data_ora)})</div>
            ))}
      </div>
    </Card>

    {errore && <div style={{color:C.red,fontSize:13,fontWeight:600,marginBottom:10}}>⚠️ {errore}</div>}

    {/* nuovo rifornimento */}
    {form ? (
      <Card key={form.id||"nuovo"} style={{border:`1.5px solid ${form.id?C.accent:C.primary}`}}>
        <div style={{fontSize:15,fontWeight:700,color:form.id?C.accent:C.primary,marginBottom:form.id?4:12}}>
          {form.id ? "✏️ Correggi rifornimento" : "Nuovo rifornimento"}
        </div>
        {form.id && (
          <div style={{fontSize:11,color:C.muted,marginBottom:12}}>
            Cambia solo il dato sbagliato e salva. La correzione resta segnata sulla riga.
            {!utente.admin && <> Puoi correggere ancora per circa <b>{oreRimaste(form)} ore</b>.</>}
          </div>
        )}
        {/* data e ora: automatiche, oppure registrazione tardiva */}
        <div style={{marginBottom:12,padding:10,borderRadius:10,background:C.bg,border:`1px solid ${C.border}`}}>
          {form.id && !form.tardiva ? (
            <div style={{fontSize:13}}>
              📅 <b>Data e ora: {oraIt(form.data_ora_orig)}</b>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>
                Registrate automaticamente: non si possono cambiare.
              </div>
            </div>
          ) : !form.tardiva ? (
            <div style={{fontSize:13}}>
              📅 <b>Data e ora: adesso</b>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>
                Registrate automaticamente al momento del salvataggio.
              </div>
            </div>
          ) : (
            <div>
              <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>
                Quando è avvenuto il prelievo<span style={{color:C.red}}> *</span>
              </div>
              <input type="datetime-local" value={form.data_ora} max={adessoLocale()}
                onChange={e=>setForm(f=>({...f,data_ora:e.target.value}))} style={inputStyle}/>
            </div>
          )}
          {!form.id && (
            <label style={{display:"flex",alignItems:"center",gap:8,marginTop:8,fontSize:13,cursor:"pointer"}}>
              <input type="checkbox" checked={!!form.tardiva}
                onChange={e=>setForm(f=>({...f,tardiva:e.target.checked,data_ora:f.data_ora||adessoLocale()}))}/>
              Registrazione tardiva (il prelievo è avvenuto prima)
            </label>
          )}
        </div>
        <SceltaScrivi label="Cisterna" voci={cisterne}
          value={form.cisterna} testo={form.cisterna_altro}
          onChange={(v,t)=>setForm(f=>({...f,cisterna:v,cisterna_altro:t}))}/>
        <SceltaScrivi label="Operatore" voci={operatori}
          value={form.operatore} testo={form.operatore_altro}
          onChange={(v,t)=>setForm(f=>({...f,operatore:v,operatore_altro:t}))}/>
        <SceltaScrivi label="Mezzo" voci={mezzi}
          value={form.mezzo} testo={form.mezzo_altro}
          onChange={(v,t)=>setForm(f=>({...f,mezzo:v,mezzo_altro:t}))}/>
        {/* motivo: tre pulsanti, un tocco */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>
            Motivo<span style={{color:C.red}}> *</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            {MOTIVI.map(m=>(
              <button key={m.v} type="button" onClick={()=>setForm(f=>({...f,motivo:m.v}))}
                style={{flex:1,padding:"10px 4px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",
                  background:form.motivo===m.v?C.primary:"#FFF",color:form.motivo===m.v?"#FFF":C.text,
                  border:`1.5px solid ${form.motivo===m.v?C.primary:C.border}`}}>
                {m.l}
              </button>
            ))}
          </div>
        </div>
        {form.motivo==="altro" && (
          <Field label="Specifica il motivo" required value={form.motivo_altro}
            placeholder="es. generatore, trasporto merci…"
            onChange={v=>setForm(f=>({...f,motivo_altro:v}))}/>
        )}
        <Field label="Litri prelevati" required inputMode="decimal" value={form.litri}
          onChange={v=>setForm(f=>({...f,litri:v}))}/>
        <Field label="Lettura contalitri dopo il prelievo (facoltativa)" inputMode="decimal"
          value={form.contalitri} onChange={v=>setForm(f=>({...f,contalitri:v}))}/>
        {scarto!==null && Math.abs(scarto)>1 && (
          <div style={{background:C.yellow+"15",border:`1px solid ${C.yellow}55`,borderRadius:10,
            padding:10,marginBottom:12,fontSize:12,lineHeight:1.5}}>
            ⚠️ Con l'ultima lettura ({num(ultima.contalitri,0)}) + {num(litriForm,0)} L
            mi aspettavo <b>{num(attesa,0)}</b>: differenza di {num(scarto,0)} L.
            Ricontrolla il numero: può capitare di leggerlo male o che manchi un prelievo precedente.
          </div>
        )}
        <Field label="Note" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>
        <div style={{display:"flex",gap:8}}>
          <Btn label={salvando?"Salvo…":(form.id?"Salva correzione":"Salva")} icon="✓" variant="success" disabled={salvando}
            onClick={salva} style={{flex:1}}/>
          <Btn label="Annulla" variant="ghost" onClick={()=>{setForm(null);setErrore("");}}/>
        </div>
      </Card>
    ) : (
      <Btn label="Registra rifornimento" icon="+" style={{width:"100%",marginBottom:12}}
        onClick={()=>setForm({tardiva:false,data_ora:"",
          cisterna:"",operatore:"",mezzo:"",motivo:"",motivo_altro:"",litri:"",contalitri:"",note:""})}/>
    )}

    {/* elenco */}
    <Card>
      <div style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:6}}>
        Rifornimenti ({righe.length})
      </div>
      {righe.length===0 && <Vuoto icona="⛽" testo="Nessun rifornimento registrato in questa campagna."/>}
      {righe.map(r=>(
        <div key={r.id} style={{borderTop:`1px solid ${C.border}`,padding:"10px 0",
          display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700}}>
              {nomeVoce(r.mezzo_id)}
              {daVerif(r.mezzo_id) && <span style={{marginLeft:6}}><Badge label="da verificare" color={C.yellow}/></span>}
            </div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>
              {oraIt(r.data_ora)} · {nomeVoce(r.cisterna_id)} · {nomeVoce(r.operatore_id)}
              {r.motivo && <> · <b>{nomeMotivo(r)}</b></>}
              {daVerif(r.operatore_id) && " (da verificare)"}
              {r.contalitri!==null && <> · contalitri {num(r.contalitri,0)}</>}
            </div>
            {r.tardiva && (
              <div style={{fontSize:11,color:C.accent,marginTop:2}}>
                ⏱ Registrazione tardiva — scritta il {oraIt(r.created_at)}
              </div>
            )}
            {r.note && <div style={{fontSize:12,color:C.text,marginTop:2}}>{r.note}</div>}
            {r.modificato_at && (
              <div style={{fontSize:11,color:C.accent,marginTop:2}}>
                ✏️ Corretto il {oraIt(r.modificato_at)}{persone[r.modificato_da] && <> da {persone[r.modificato_da]}</>}
                {" · "}
                <span onClick={()=>setStoricoAperto(a=>a===r.id?null:r.id)}
                  style={{textDecoration:"underline",cursor:"pointer"}}>
                  {storicoAperto===r.id?"nascondi":"cosa è cambiato"}
                </span>
              </div>
            )}
            {storicoAperto===r.id && (
              <div style={{marginTop:4,padding:"6px 8px",background:C.bg,borderRadius:8,fontSize:11,lineHeight:1.5}}>
                {modifiche.filter(m=>m.rifornimento_id===r.id).map(m=>(
                  <div key={m.id} style={{marginBottom:4}}>
                    <b>{oraIt(m.fatta_at)}{persone[m.fatta_da] && <> — {persone[m.fatta_da]}</>}</b>
                    {Object.keys(m.dopo||{}).map(k=>(
                      <div key={k}>{ETICHETTE_CAMPI[k]||k}: {valoreCampo(k,m.prima[k],nomeVoce)} → <b>{valoreCampo(k,m.dopo[k],nomeVoce)}</b></div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            <b style={{fontSize:15,color:C.primary}}>{num(r.litri,0)} L</b>
            {puoCorreggere(r) && (<>
              <button onClick={()=>apriCorrezione(r)} title="Correggi"
                style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:0.7}}>✏️</button>
              <button onClick={()=>elimina(r.id)} title="Cancella"
                style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:0.5}}>🗑️</button>
            </>)}
          </div>
        </div>
      ))}
    </Card>
  </>);
}


// ============================================================================
// SEZIONE GASOLIO — scheda propria nella barra in basso (v112)
// Stessa campagna agraria di Coltivazione (1 settembre - 31 agosto).
// ============================================================================
export function Gasolio(){
  const [campagna,setCampagna] = useState(campagnaDiData());
  const corrente = campagnaDiData();
  const annoOra  = annoInizioDi(corrente);
  const campagne = [];
  for(let a=annoOra+1; a>=annoOra-5; a--) campagne.push(`${a}/${a+1}`);
  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"16px 16px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:24}}>⛽</span>
          <h2 style={{margin:0,fontSize:20,color:C.primary}}>Rifornimento gasolio</h2>
        </div>
        <Card style={{padding:12,marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>Campagna agraria (1 settembre – 31 agosto)</div>
          <select value={campagna} onChange={e=>setCampagna(e.target.value)} style={inputStyle}>
            {campagne.map(c=>(
              <option key={c} value={c}>{c}{c===corrente?"  (in corso)":""}</option>
            ))}
          </select>
        </Card>
        <RegistroGasolio campagna={campagna}/>
      </div>
    </div>
  );
}
