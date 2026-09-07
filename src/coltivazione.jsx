// ============================================================================
// SEZIONE COLTIVAZIONE — podereverdeapp.it
// ----------------------------------------------------------------------------
// Tre schermate: lista campi, scheda campo, riepilogo per coltura.
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
  for(let a=annoOra+1; a>=annoOra-5; a--) campagne.push(`${a}/${a+1}`);

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
          <div style={{fontSize:11,color:C.muted,marginTop:6}}>
            Va dal 1° settembre al 31 agosto: la semina d'autunno e la trebbiatura
            dell'estate dopo restano nella stessa campagna.
          </div>
        </Card>

        {errore && (
          <Card style={{background:C.red+"12",border:`1.5px solid ${C.red}`}}>
            <div style={{color:C.red,fontSize:13,fontWeight:600}}>⚠️ {errore}</div>
          </Card>
        )}

        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[{id:"campi",label:"🗺️ Campi"},{id:"riepilogo",label:"📊 Riepilogo"}].map(t=>(
            <button key={t.id} onClick={()=>setSubTab(t.id)}
              style={{flex:1,background:subTab===t.id?C.primary:"#FFF",
                color:subTab===t.id?"#FFF":C.text,border:`1.5px solid ${subTab===t.id?C.primary:C.border}`,
                borderRadius:12,padding:"10px 8px",fontSize:14,fontWeight:600,cursor:"pointer"}}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? <Spinner/> : subTab==="campi" ? (
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
    await supabase.from("lavorazioni_campo").delete().eq("id",id);
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
        <div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:12}}>
          {form.tipo}
        </div>
        <Field label="Data di esecuzione" required type="date" value={form.data_esecuzione}
          onChange={v=>setForm(f=>({...f,data_esecuzione:v}))}/>
        <Field label="Giornate lavoro impiegate" type="text" inputMode="decimal"
          value={form.giornate_lavoro} placeholder="es. 1,5"
          onChange={v=>setForm(f=>({...f,giornate_lavoro:v}))}/>

        {form.tipo==="Concimazione" && (
          <FormConcimi form={form} setForm={setForm} ettari={ettari}/>
        )}
        {form.tipo==="Disserbo" && (
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
          <Btn label="Salva" icon="✓" variant="success" onClick={salva} style={{flex:1}}/>
          <Btn label="Annulla" variant="ghost" onClick={()=>{setForm(null);setErrore("");}}/>
        </div>
      </div>
    )}
  </>);
}

function DettaglioEsecuzione({riga,ettari,concimi,diserbi,onElimina}){
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
        </div>
        <button onClick={onElimina}
          style={{background:"none",border:"none",cursor:"pointer",fontSize:13,opacity:0.5}}>🗑️</button>
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

  const salva = async()=>{
    const q = parseFloat(String(form.quantita).replace(",","."));
    if(!form.prodotto){ setErrore("Scegli il prodotto"); return; }
    if(form.prodotto==="Altro" && !(form.prodotto_altro||"").trim()){
      setErrore("Scrivi il nome del prodotto"); return;
    }
    if(!q || q<=0){ setErrore("Inserisci una quantita' maggiore di zero"); return; }
    const def = PRODOTTI.find(p=>p.nome===form.prodotto);
    const {error} = await supabase.from("raccolte").insert([{
      coltura_campo_id: coltura.id,
      prodotto: form.prodotto==="Altro" ? form.prodotto_altro.trim() : form.prodotto,
      sottoprodotto: def ? def.sotto : false,
      unita: form.unita || (def?def.unita:"quintali"),
      quantita: q,
      data_raccolta: form.data_raccolta||null,
    }]);
    if(error){ setErrore("Errore nel salvataggio: "+error.message); return; }
    setForm(null); setErrore(""); onRicarica();
  };

  const elimina = async(id)=>{
    if(!window.confirm("Eliminare questa riga di raccolta?")) return;
    await supabase.from("raccolte").delete().eq("id",id);
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
          </div>
          <button onClick={()=>elimina(r.id)}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:0.5}}>🗑️</button>
        </div>
      );
    })}

    {errore && <div style={{color:C.red,fontSize:12,fontWeight:600,marginTop:8}}>⚠️ {errore}</div>}

    {form ? (
      <div style={{marginTop:12,padding:12,background:C.bg,borderRadius:12,
        border:`1.5px solid ${C.border}`}}>
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
          <Btn label="Salva" icon="✓" variant="success" small onClick={salva} style={{flex:1}}/>
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
