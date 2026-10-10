/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
// v105 — Vercel compila con CI=true, che trasforma gli avvisi ESLint in ERRORI
// e faceva fallire il deploy. Gli avvisi sono vecchi e innocui (variabili
// dichiarate e mai usate, dipendenze di useEffect volutamente omesse per non
// cambiare il comportamento). Qui vengono ZITTITI, non corretti: nessuna riga
// di logica e' stata toccata. Una pulizia vera si puo' fare con calma, un file
// alla volta, verificando ogni rimozione.
import { useState, useEffect, useMemo } from "react";
import { t } from "./i18n";   // v119 — lingue
import * as XLSX from "xlsx";
import { supabase } from "./supabase";
import { ProposteModello4, salvaAbbinamento, MOTIVI_CON_MODELLO4 } from "./modelli4_abbina";   // v123
import { AvvisoPesoVivo, confermaPesoVivo } from "./avviso_peso";   // v124

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8", suini:"#B5547A",
};
const today = () => new Date().toISOString().split("T")[0];

const RAZZA_LETTERA = {
  "Nero Apucalabro":"A","Cinta Senese":"C","Duroc":"D","Mora Romagnola":"G",
  "Large White":"L","Meticcia":"M","Meticcio":"M","Nero Casertano":"N","Landrace":"R","Altra":"0",
};
const getRazzaLettera = r => {
  if(!r) return "0";
  const match = Object.keys(RAZZA_LETTERA).find(k=>k.toLowerCase()===r.trim().toLowerCase());
  return match ? RAZZA_LETTERA[match] : "0";
};
export const generaCodLotto = (dataParto, razzaMadre, razzaPadre, bdnMadre) => {
  if(!dataParto) return "";
  const d = new Date(dataParto);
  const aa = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const lM = getRazzaLettera(razzaMadre);
  const lP = getRazzaLettera(razzaPadre);
  const ultime2 = (bdnMadre||"").replace(/[^0-9]/g,"").slice(-2).padStart(2,"0");
  return `${aa}${mm}${lM}${lP}${ultime2}`;
};
const codiceUnita = (codLotto, nr) => `${codLotto}${String(nr).padStart(2,"0")}`;

// v136 — cause di morte del suinetto (decisione del Dott. Bizzarri, 10/10/2026)
export const CAUSE_MORTE = ["Schiacciato dalla madre","Ucciso dalla madre","Diarrea","Debole e sottopeso","Altra malattia"];
export const CAUSE_DELLA_MADRE = ["Schiacciato dalla madre","Ucciso dalla madre"];
// regola: la madre va al macello con 1 suinetto ucciso, oppure 2 o piu' schiacciati (sommando tutti i parti)
export const madreDaMacello = (uccisi, schiacciati) => uccisi >= 1 || schiacciati >= 2;
// conteggio per madre dai lotti nati in azienda
export const contaMortiPerMadre = (lotti, suini) => {
  const out = {};
  (lotti||[]).filter(l=>l.tipo_provenienza==="nato"&&l.madre_id).forEach(l=>{
    (suini||[]).filter(u=>u.lotto_id===l.id&&u.stato==="morto").forEach(u=>{
      const c = (u.causa_morte||"").trim();
      if(!CAUSE_DELLA_MADRE.includes(c)) return;
      const m = out[l.madre_id] = out[l.madre_id] || {schiacciati:0, uccisi:0, lotti:{}};
      if(c==="Schiacciato dalla madre") m.schiacciati++; else m.uccisi++;
      const k = l.codice_lotto||l.codice;
      m.lotti[k] = m.lotti[k] || {schiacciati:0, uccisi:0, data:l.data_parto};
      if(c==="Schiacciato dalla madre") m.lotti[k].schiacciati++; else m.lotti[k].uccisi++;
    });
  });
  return out;
};
// v136 — castrazione: evento sanitario sul singolo suinetto (tipo «intervento»)
const DESCR_CASTRAZIONE = "Castrazione";
async function registraCastrazioni(ids, data) {
  if(!ids.length) return { error:null };
  const r1 = await supabase.from("suini_lotto").update({ sesso:"Castrato" }).in("id", ids);
  if(r1.error) return r1;
  return await supabase.from("eventi_sanitari").insert(ids.map(id=>({
    suini_lotto_id:id, animale_id:null, tipo:"intervento", descrizione:DESCR_CASTRAZIONE, data,
    collettivo: ids.length>1, n_capi_coinvolti: ids.length,
  })));
}

// ─── UI BASE ──────────────────────────────────────────────────────────────────
const inputStyle = {width:"100%",boxSizing:"border-box",border:`1.5px solid ${C.border}`,
  borderRadius:10,padding:"10px 12px",fontSize:15,background:"#FAFAF8",color:C.text,outline:"none"};
const Card = ({children,style={}}) => (
  <div style={{background:C.card,borderRadius:16,padding:14,marginBottom:10,
    boxShadow:"0 2px 6px rgba(0,0,0,0.07)",border:`1px solid ${C.border}`,...style}}>
    {children}
  </div>
);
const Badge = ({label,color}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,
    borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:700}}>{t(label)}</span>
);
const Btn = ({label,onClick,variant="primary",small=false,icon,disabled=false,full=false}) => {
  const bg={primary:C.primary,danger:C.red,success:C.green,ghost:"transparent",
    outline:"transparent",blue:C.blue}[variant]||C.primary;
  const fg=variant==="ghost"||variant==="outline"?C.text:"#FFF";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,
        background:bg,color:fg,border:variant==="outline"?`1.5px solid ${C.primary}`:"none",
        borderRadius:10,padding:small?"6px 12px":"10px 18px",
        fontSize:small?13:15,fontWeight:600,cursor:disabled?"default":"pointer",
        width:full?"100%":"auto",opacity:disabled?0.5:1}}>
      {icon&&<span>{icon}</span>}{t(label)}
    </button>
  );
};
const Field = ({label,value,onChange,type="text",options,required,placeholder}) => (
  <div style={{marginBottom:12}}>
    <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:4}}>
      {t(label)}{required&&<span style={{color:C.red}}> *</span>}
    </div>
    {options
      ?<select value={value??""} onChange={e=>onChange(e.target.value)} style={inputStyle}>
         <option value="">{t("— seleziona —")}</option>
         {options.map(o=><option key={o.value??o} value={o.value??o}>{t(o.label??o)}</option>)}
       </select>
      :<input type={type} value={value??""} placeholder={t(placeholder)||""}
         onChange={e=>onChange(e.target.value)} style={inputStyle}/>}
  </div>
);
const Spinner = () => (
  <div style={{textAlign:"center",padding:60,color:C.muted}}>
    <div style={{fontSize:36,marginBottom:12}}>⏳</div><div>{t("Caricamento lotti...")}</div>
  </div>
);

// ─── FORM ASSEGNA BDN ────────────────────────────────────────────────────────
function FormAssegnaBDN({unita, lotto, animali, onSave, onCancel}) {
  const [bdn,setBdn] = useState("");
  const [nome,setNome] = useState("");
  const [saving,setSaving] = useState(false);
  const codice = unita.codice_completo||codiceUnita(lotto.codice_lotto||lotto.codice, unita.nr);
  const madre = animali.find(a=>a.id===lotto.madre_id);
  const padre = animali.find(a=>a.id===lotto.padre_id);

  const salva = async () => {
    if(!bdn.trim()) return;
    if(!unita.sesso){
      alert(t("⚠️ Questa unità non ha ancora un sesso registrato.\n\nChiudi questo modulo, usa prima il pulsante ⚖️ per impostarlo, poi torna qui ad assegnare il BDN."));
      return;
    }
    setSaving(true);
    // 1. Crea scheda animale individuale con dati ereditati
    const acquistato = lotto.tipo_provenienza==="acquistato";
    const {data: nuovoAnimale, error: errInsert} = await supabase.from("animali").insert([{
      bdn: bdn.trim(),
      nome: nome||null,
      specie: "suino",
      sesso: unita.sesso||null,
      nascita: lotto.data_parto||null,
      razza: lotto.razza_madre||madre?.razza||null,
      razza_calcolata: lotto.razza_madre||madre?.razza||null,
      madre_id: acquistato?null:(lotto.madre_id||null),
      padre_id: acquistato?null:(lotto.padre_id||null),
      peso_nascita: unita.peso_nascita||null,
      provenienza: acquistato?"Acquistato":"Nato in azienda",
      origine: acquistato?(lotto.fornitore||null):null,
      data_ingresso: lotto.data_parto||null,
      stato: "attivo", vivo: true,
      note: `Da lotto ${lotto.codice_lotto||lotto.codice} unità ${codice}`,
    }]).select("id").single();
    if(errInsert){
      setSaving(false);
      alert(t("⚠️ Errore nella creazione della scheda animale:\n\n{0}",{0:(errInsert.message)}));
      return;
    }
    // 2. Aggiorna unità lotto: segna come "uscita con BDN"
    const {error: errUpdate} = await supabase.from("suini_lotto").update({
      bdn: bdn.trim(),
      matricola: bdn.trim(),
      stato: "registrato_individuale",
      vivo: false,
      destinazione: "riproduzione",
      motivo_uscita: "Registrato come animale individuale — BDN: "+bdn.trim(),
      data_uscita: today(),
    }).eq("id", unita.id);
    if(errUpdate){
      setSaving(false);
      alert(t("⚠️ La scheda animale è stata creata, ma l'aggiornamento del lotto ha dato errore:\n\n{0}",{0:(errUpdate.message)}));
      return;
    }
    // 3. Traghetta i costi già calcolati dalla Contabilità Industriale (ci_costo_animale_annuale)
    // dalla chiave lotto_id+unita_nr alla nuova chiave animale_id — senza questo passaggio la
    // storia costo del suinetto (mantenimento, nascita ereditata) andrebbe persa/azzerata.
    // Nota: questa è l'unica eccezione al principio "solo la Contabilità Industriale scrive in
    // questa tabella" — qui si spostano righe già calcolate, non se ne calcolano di nuove.
    try {
      const {data: righeLotto} = await supabase.from("ci_costo_animale_annuale").select("*")
        .eq("lotto_id", lotto.id).eq("unita_nr", unita.nr);
      for (const riga of (righeLotto||[])) {
        const {data: rigaEsistente} = await supabase.from("ci_costo_animale_annuale").select("*")
          .eq("animale_id", nuovoAnimale.id).eq("anno", riga.anno).maybeSingle();
        if (rigaEsistente) {
          await supabase.from("ci_costo_animale_annuale").update({
            uba_giorni: Math.round(((parseFloat(rigaEsistente.uba_giorni)||0)+(parseFloat(riga.uba_giorni)||0))*10000)/10000,
            costo_mantenimento: Math.round(((parseFloat(rigaEsistente.costo_mantenimento)||0)+(parseFloat(riga.costo_mantenimento)||0))*100)/100,
            costo_nascita_ereditato: Math.round(((parseFloat(rigaEsistente.costo_nascita_ereditato)||0)+(parseFloat(riga.costo_nascita_ereditato)||0))*100)/100,
            quota_scaricata_su_figli: Math.round(((parseFloat(rigaEsistente.quota_scaricata_su_figli)||0)+(parseFloat(riga.quota_scaricata_su_figli)||0))*100)/100,
            costo_totale_anno: Math.round(((parseFloat(rigaEsistente.costo_totale_anno)||0)+(parseFloat(riga.costo_totale_anno)||0))*100)/100,
          }).eq("id", rigaEsistente.id);
          await supabase.from("ci_costo_animale_annuale").delete().eq("id", riga.id);
        } else {
          await supabase.from("ci_costo_animale_annuale").update({
            animale_id: nuovoAnimale.id, lotto_id: null, unita_nr: null,
          }).eq("id", riga.id);
        }
      }
    } catch (errTraghetto) {
      console.error("Traghettamento costi non riuscito (la scheda animale resta comunque creata):", errTraghetto);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div style={{background:"#E3F2FD",border:`2px solid ${C.blue}`,
      borderRadius:14,padding:14,marginBottom:10}}>
      <div style={{fontWeight:700,color:C.blue,marginBottom:10,fontSize:14}}>
        {t("🏷️ Assegna BDN/ID a")} {codice}
      </div>
      <div style={{fontSize:12,color:C.muted,marginBottom:10}}>
        {t("L'unità uscirà dal lotto ed entrerà nel Registro Suini con i dati ereditati: nascita")} {lotto.data_parto} {t("· madre")} {madre?.nome||madre?.bdn||"—"} {t("· padre")} {padre?.nome||padre?.bdn||"—"}
        {unita.peso_nascita&&t(" · peso nascita {0}kg",{0:(unita.peso_nascita)})}
      </div>
      <Field label={t("BDN / Matricola *")} value={bdn} onChange={setBdn}
        placeholder={t("Es. IT058990123456 o 334966")} required/>
      <Field label={t("Nome (facoltativo)")} value={nome} onChange={setNome}
        placeholder={t("Es. NERO, BELINDA...")}/>
      <div style={{display:"flex",gap:8}}>
        <Btn label={saving?"...":t("✓ Registra e trasferisci")} onClick={salva}
          variant="blue" disabled={saving||!bdn.trim()} small/>
        <Btn label={t("Annulla")} onClick={onCancel} variant="ghost" small/>
      </div>
    </div>
  );
}

// ─── FORM USCITA UNITÀ ────────────────────────────────────────────────────────
function FormUscitaUnita({unita, lotto, onSave, onCancel}) {
  const giaUscita = unita.vivo===false || (unita.stato&&unita.stato!=="attivo");
  // v136 — elenco: Macellato · Morto · Venduto vivo · Altro (da specificare)
  const MOTIVI = [
    {label:"Macellato",stato:"macellato"},
    {label:"Morto",stato:"morto"},
    {label:"Venduto vivo",stato:"venduto"},
    {label:"Altro",stato:"uscito"},
  ];
  // un'uscita vecchia con un motivo non piu' in elenco resta visibile cosi' com'e'
  const motivoVecchio = unita.motivo_uscita && !MOTIVI.some(m=>m.label===unita.motivo_uscita) ? unita.motivo_uscita : null;
  const causaIniz = (()=>{
    const c=(unita.causa_morte||"").trim();
    if(c.startsWith("Altra malattia: ")) return {causa:"Altra malattia", testo:c.slice(16)};
    if(CAUSE_MORTE.includes(c)) return {causa:c, testo:""};
    return {causa:"", testo:c};
  })();
  const notaAltro = (unita.note||"").startsWith("Altro: ") ? unita.note.slice(7) : "";
  const [form,setForm] = useState({
    motivo: unita.motivo_uscita || "",            // v136 — nessun motivo gia' scelto: va scelto
    stato: giaUscita ? unita.stato : "",
    data_uscita: unita.data_uscita || today(),
    causa: causaIniz.causa,
    causa_testo: causaIniz.testo,
    altro_testo: notaAltro,
    peso_vivo_uscita: unita.peso_vivo_uscita ?? "",
    peso_carcassa: unita.peso_carcassa ?? "",
  });
  const [saving,setSaving] = useState(false);
  const [m4,setM4] = useState(undefined);   // v123 — modello 4 abbinato
  const codice = unita.codice_completo||codiceUnita(lotto.codice_lotto||lotto.codice, unita.nr);
  const morto = form.motivo==="Morto";

  // Accrescimento giornaliero
  const giorni = lotto.data_parto&&form.data_uscita
    ? Math.round((new Date(form.data_uscita)-new Date(lotto.data_parto))/86400000) : null;
  const pesoNascita = unita.peso_nascita||0;
  const accrescimento = giorni&&giorni>0&&form.peso_vivo_uscita
    ? Math.round((parseFloat(form.peso_vivo_uscita)-pesoNascita)/giorni*1000)/1000 : null;
  const resa = form.peso_carcassa&&form.peso_vivo_uscita
    ? Math.round(parseFloat(form.peso_carcassa)/parseFloat(form.peso_vivo_uscita)*1000)/10 : null;

  const salva = async () => {
    if(!form.motivo){ alert(t("⚠️ Scegliere il motivo dell'uscita.")); return; }
    if(!form.data_uscita){ alert(t("⚠️ Inserire la data.")); return; }
    if(morto&&!form.causa){ alert(t("⚠️ Scegliere la causa della morte.")); return; }
    if(morto&&form.causa==="Altra malattia"&&!form.causa_testo.trim()){ alert(t("⚠️ Scrivere quale malattia nella casella «Causa».")); return; }
    if(form.motivo==="Altro"&&!form.altro_testo.trim()){ alert(t("⚠️ Con «Altro» va specificato il motivo dell'uscita.")); return; }
    if(!confermaPesoVivo(form.motivo, form.peso_vivo_uscita)) return;   // v124
    const statoNuovo = MOTIVI.find(m=>m.label===form.motivo)?.stato || form.stato || "uscito";
    const causaMorte = morto
      ? (form.causa==="Altra malattia" ? "Altra malattia: "+form.causa_testo.trim() : form.causa)
      : (form.motivo===motivoVecchio ? (unita.causa_morte||null) : null);
    let note = unita.note||null;
    if(form.motivo==="Altro") note = "Altro: "+form.altro_testo.trim();
    else if((note||"").startsWith("Altro: ")) note = null;
    setSaving(true);
    const {error} = await supabase.from("suini_lotto").update({
      stato: statoNuovo,
      vivo: false,
      motivo_uscita: form.motivo,
      causa_morte: causaMorte,
      data_uscita: form.data_uscita||null,
      note,
      peso_vivo_uscita: !morto&&form.peso_vivo_uscita?parseFloat(form.peso_vivo_uscita):null,
      peso_carcassa: form.motivo==="Macellato"&&form.peso_carcassa?parseFloat(form.peso_carcassa):null,
      resa_percent: form.motivo==="Macellato"?resa:null,
    }).eq("id", unita.id);
    if(!error&&m4!==undefined){
      const {error:e2} = await salvaAbbinamento({documentoId:MOTIVI_CON_MODELLO4.includes(form.motivo)?m4:null, suinoLottoId:unita.id});
      if(e2) alert(t("⚠️ Uscita salvata, ma abbinamento al modello 4 non riuscito:\n\n{0}",{0:e2.message}));
    }
    setSaving(false);
    if(error){
      alert(t("⚠️ Errore nel salvataggio dell'uscita:\n\n{0}",{0:(error.message)}));
      return;
    }
    onSave();
  };

  return (
    <div style={{background:"#FFEBEE",border:`2px solid ${C.red}`,
      borderRadius:14,padding:14,marginBottom:10}}>
      <div style={{fontWeight:700,color:C.red,marginBottom:10,fontSize:14}}>
        📤 {giaUscita?t("Modifica"):t("Registra")} {t("uscita —")} {codice}
      </div>
      {!morto&&<AvvisoPesoVivo motivo={form.motivo} peso={form.peso_vivo_uscita}/>}
      <Field label={t("Motivo uscita")} required value={form.motivo}
        onChange={v=>setForm(f=>({...f,motivo:v}))}
        options={[...MOTIVI.map(m=>m.label), ...(motivoVecchio?[motivoVecchio]:[])]}/>
      {morto&&(<>
        <Field label={t("Data della morte")} required value={form.data_uscita}
          onChange={v=>setForm(f=>({...f,data_uscita:v}))} type="date"/>
        <Field label={t("Causa della morte")} required value={form.causa}
          onChange={v=>setForm(f=>({...f,causa:v}))} options={CAUSE_MORTE}/>
        {form.causa==="Altra malattia"&&
          <Field label={t("Causa")} required value={form.causa_testo}
            onChange={v=>setForm(f=>({...f,causa_testo:v}))} placeholder={t("Es. Polmonite, PRRS, setticemia...")}/>}
        {CAUSE_DELLA_MADRE.includes(form.causa)&&(
          <div style={{background:C.red+"15",border:`1px solid ${C.red}55`,borderRadius:8,padding:"6px 10px",
            fontSize:12,color:C.red,fontWeight:700,marginBottom:10}}>
            {t("⚠️ Questa causa viene registrata anche nella scheda della madre, per la selezione.")}
          </div>
        )}
      </>)}
      {!morto&&form.motivo&&
        <Field label={t("Data uscita")} required value={form.data_uscita}
          onChange={v=>setForm(f=>({...f,data_uscita:v}))} type="date"/>}
      {form.motivo==="Altro"&&
        <Field label={t("Specificare il motivo")} required value={form.altro_testo}
          onChange={v=>setForm(f=>({...f,altro_testo:v}))} placeholder={t("Es. trasferito in altra azienda")}/>}
      {MOTIVI_CON_MODELLO4.includes(form.motivo)&&
        <ProposteModello4 specie="suino" dataUscita={form.data_uscita}
          suinoLottoId={unita.id} valore={m4} onChange={setM4}/>}
      {giorni>0&&form.motivo&&<div style={{fontSize:12,color:C.blue,marginBottom:8}}>
        📅 {giorni} {morto?t("giorni di vita"):t("giorni di permanenza")}
      </div>}
      {!morto&&form.motivo&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label={t("Peso vivo (kg)")} value={form.peso_vivo_uscita}
            onChange={v=>setForm(f=>({...f,peso_vivo_uscita:v}))} type="number"/>
          {form.motivo==="Macellato"&&
            <Field label={t("Peso carcassa (kg)")} value={form.peso_carcassa}
              onChange={v=>setForm(f=>({...f,peso_carcassa:v}))} type="number"/>}
        </div>
      )}
      {resa&&form.motivo==="Macellato"&&<div style={{fontSize:12,color:C.green,marginBottom:8}}>
        {t("⚖️ Resa:")} <strong>{resa}%</strong>
      </div>}
      {accrescimento&&!morto&&<div style={{fontSize:12,color:C.primary,marginBottom:8}}>
        {t("📈 Accrescimento:")} <strong>{accrescimento} {t("kg/giorno")}</strong>
        {pesoNascita>0&&t(" (da {0}kg)",{0:(pesoNascita)})}
      </div>}
      <div style={{display:"flex",gap:8}}>
        <Btn label={saving?"...":t("✓ Conferma")} onClick={salva}
          variant="danger" disabled={saving} small/>
        <Btn label={t("Annulla")} onClick={onCancel} variant="ghost" small/>
      </div>
    </div>
  );
}

// ─── FORM PESO E SESSO UNITÀ (nascita o entrata) ──────────────────────────────
function FormPesoUnita({unita, lotto, onSave, onCancel}) {
  const [peso,setPeso] = useState(unita.peso_nascita ?? "");
  const [sesso,setSesso] = useState(unita.sesso ?? "");
  const [dataCastr,setDataCastr] = useState(today());   // v136 — data della castrazione
  const [saving,setSaving] = useState(false);
  const nuovaCastrazione = sesso==="Castrato" && unita.sesso!=="Castrato";
  const codice = unita.codice_completo||codiceUnita(lotto.codice_lotto||lotto.codice, unita.nr);
  const acquistato = lotto.tipo_provenienza==="acquistato";

  const salva = async () => {
    if(!sesso){ alert(t("⚠️ Scegliere il sesso del suinetto.")); return; }
    if(nuovaCastrazione&&!dataCastr){ alert(t("⚠️ Inserire la data della castrazione.")); return; }
    setSaving(true);
    let {error} = await supabase.from("suini_lotto").update({
      peso_nascita: peso!==""?parseFloat(peso):null,
      sesso: nuovaCastrazione ? (unita.sesso||null) : (sesso||null),
    }).eq("id", unita.id);
    if(!error&&nuovaCastrazione) ({error} = await registraCastrazioni([unita.id], dataCastr));
    setSaving(false);
    if(error){
      alert(t("⚠️ Errore nel salvataggio:\n\n{0}",{0:(error.message)}));
      return;
    }
    onSave();
  };

  return (
    <div style={{background:"#FFF3E0",border:`2px solid ${C.yellow}`,
      borderRadius:14,padding:14,marginBottom:10}}>
      <div style={{fontWeight:700,color:C.yellow,marginBottom:10,fontSize:14}}>
        {t("⚖️ Peso e sesso —")} {codice}
      </div>
      <Field label={t("Sesso")} required value={sesso} onChange={setSesso}
        options={[{value:"M",label:"♂ Maschio"},
                  {value:"F",label:"♀ Femmina"},{value:"Castrato",label:"✂ Castrato"}]}/>
      {nuovaCastrazione&&
        <Field label={t("Data della castrazione")} required value={dataCastr} onChange={setDataCastr} type="date"/>}
      <Field label={t("Peso {0} (kg)",{0:(acquistato?"in entrata":"alla nascita")})} value={peso}
        onChange={setPeso} type="number" placeholder={t("Es. 1.4")}/>
      <div style={{display:"flex",gap:8}}>
        <Btn label={saving?"...":t("✓ Salva")} onClick={salva}
          variant="success" disabled={saving} small/>
        <Btn label={t("Annulla")} onClick={onCancel} variant="ghost" small/>
      </div>
    </div>
  );
}

// ─── CARD UNITÀ ───────────────────────────────────────────────────────────────
function CardUnita({u, lotto, animali, onUpdate}) {
  const [modal,setModal] = useState(null); // null | "bdn" | "uscita" | "peso"
  const codice = u.codice_completo||codiceUnita(lotto.codice_lotto||lotto.codice, u.nr);
  const vivo = u.vivo!==false&&u.stato==="attivo";
  const sessoColor = s=>({M:C.blue,F:C.suini,Castrato:C.muted}[s]||C.muted);

  if(modal==="bdn") return (
    <FormAssegnaBDN unita={u} lotto={lotto} animali={animali}
      onSave={()=>{setModal(null);onUpdate();}}
      onCancel={()=>setModal(null)}/>
  );
  if(modal==="uscita") return (
    <FormUscitaUnita unita={u} lotto={lotto}
      onSave={()=>{setModal(null);onUpdate();}}
      onCancel={()=>setModal(null)}/>
  );
  if(modal==="peso") return (
    <FormPesoUnita unita={u} lotto={lotto}
      onSave={()=>{setModal(null);onUpdate();}}
      onCancel={()=>setModal(null)}/>
  );

  return (
    <div style={{background:vivo?C.card:"#F5F5F5",borderRadius:12,padding:12,
      marginBottom:8,border:`1.5px solid ${vivo?C.border:"#DDD"}`,
      borderLeft:`4px solid ${vivo?C.suini:C.muted}`,opacity:vivo?1:0.65}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"monospace",fontSize:16,fontWeight:800,
            color:vivo?C.primary:C.muted,letterSpacing:1}}>{codice}</div>
          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
            {u.sesso&&<Badge label={u.sesso==="M"?t("♂ M"):u.sesso==="F"?t("♀ F"):t("✂ Castrato")}
              color={sessoColor(u.sesso)}/>}
            {u.peso_nascita&&<Badge label={u.peso_nascita+t("kg")} color={C.muted}/>}
            {!vivo&&<Badge label={u.motivo_uscita||u.stato} color={C.muted}/>}
            {u.bdn&&u.stato==="registrato_individuale"&&
              <Badge label={t("→ BDN: ")+u.bdn} color={C.green}/>}
          </div>
          {u.data_uscita&&(
            <div style={{fontSize:11,color:C.muted,marginTop:3}}>
              {t("Uscito:")} {u.data_uscita}
              {u.peso_vivo_uscita&&t(" · {0}kg vivo",{0:(u.peso_vivo_uscita)})}
              {u.peso_carcassa&&t(" · {0}kg carcassa",{0:(u.peso_carcassa)})}
              {u.resa_percent&&<strong style={{color:C.green}}> {t("· resa")} {u.resa_percent}%</strong>}
            </div>
          )}
        </div>
      </div>
      {/* v136 — pulsanti con la scritta sotto, in una riga a tutta larghezza */}
      <div style={{display:"grid",gridTemplateColumns:`repeat(${vivo?4:(u.stato!=="registrato_individuale"?3:2)},1fr)`,gap:6,marginTop:10}}>
        {vivo&&(<>
          <PulsanteUnita icona="⚖️" scritta={u.sesso?t("Sesso e peso"):t("MANCA IL SESSO")}
            colore={u.sesso?C.yellow:C.red} pieno={!u.sesso} onClick={()=>setModal("peso")}/>
          <PulsanteUnita icona="🏷️" scritta={t("Assegna matricola razza o riproduttore")} colore={C.blue} onClick={()=>setModal("bdn")}/>
        </>)}
        <PulsanteUnita icona={vivo?"📤":"📤✏️"} scritta={vivo?t("Morto o uscito"):t("Correggi uscita")}
          colore={C.red} onClick={()=>setModal("uscita")}/>
        {!vivo&&u.stato!=="registrato_individuale"&&(
          <PulsanteUnita icona="↩️" scritta={t("Annulla uscita")} colore={C.green} onClick={async()=>{
              if(!window.confirm(t("Annullare l'uscita di {0} e riportarla ad \"attivo\"?\nI dati di uscita (data, motivo, pesi) verranno cancellati.",{0:(codice)}))) return;
              const {error} = await supabase.from("suini_lotto").update({
                stato:"attivo", vivo:true,
                motivo_uscita:null, causa_morte:null, data_uscita:null,
                peso_vivo_uscita:null, peso_carcassa:null, resa_percent:null,
              }).eq("id", u.id);
              if(error){ alert(t("⚠️ Errore nell'annullamento:\n\n{0}",{0:(error.message)})); return; }
              await salvaAbbinamento({documentoId:null, suinoLottoId:u.id});   // v123
              onUpdate();
            }}/>
        )}
        <PulsanteUnita icona="🗑️" scritta={t("Elimina se errato")} colore={C.muted} onClick={async()=>{
            if(!window.confirm(t("Eliminare definitivamente l'unità {0}?\nQuesta operazione NON è reversibile.",{0:(codice)}))) return;
            await supabase.from("eventi_sanitari").delete().eq("suini_lotto_id", u.id);   // v136
            const {error} = await supabase.from("suini_lotto").delete().eq("id", u.id);
            if(error){ alert(t("⚠️ Errore nell'eliminazione:\n\n{0}",{0:(error.message)})); return; }
            onUpdate();
          }}/>
      </div>
    </div>
  );
}

// v136 — pulsante della riga del suinetto: simbolo sopra, scritta sotto
function PulsanteUnita({icona, scritta, colore, pieno=false, onClick}) {
  return (
    <button onClick={onClick}
      style={{background:pieno?colore:colore+"20",border:pieno?`2px solid ${colore}`:"none",borderRadius:10,
        padding:"6px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:0}}>
      <span style={{fontSize:18,lineHeight:1}}>{icona}</span>
      <span style={{fontSize:11,fontWeight:800,lineHeight:1.15,color:pieno?"#FFF":colore,textAlign:"center"}}>{scritta}</span>
    </button>
  );
}

// ─── SCHEDA LOTTO ─────────────────────────────────────────────────────────────
function SchedaLotto({lotto, suini, animali, onBack, onUpdate, onDelete}) {
  const [cerca,setCerca] = useState("");
  const [form,setForm] = useState(null);
  const [saving,setSaving] = useState(false);
  const [eliminando,setEliminando] = useState(false);
  const [castraTutti,setCastraTutti] = useState(null);   // v136 — null | data della castrazione

  const unita = useMemo(()=>
    suini.filter(s=>s.lotto_id===lotto.id).sort((a,b)=>a.nr-b.nr)
  ,[suini,lotto.id]);

  const eliminaLotto = async () => {
    const nUnita = unita.length;
    if(!window.confirm(
      t("Eliminare definitivamente il lotto {0}?\n\n",{0:(lotto.codice_lotto||lotto.codice)})+
      t("Verranno cancellate anche tutte le {0} unità al suo interno.\n",{0:(nUnita)})+
      t("Questa operazione NON è reversibile.")
    )) return;
    if(!window.confirm(t("Confermi? Non si può tornare indietro."))) return;
    setEliminando(true);
    if(unita.length) await supabase.from("eventi_sanitari").delete().in("suini_lotto_id", unita.map(u=>u.id));   // v136
    const {error: errUnita} = await supabase.from("suini_lotto").delete().eq("lotto_id", lotto.id);
    if(errUnita){
      setEliminando(false);
      alert(t("⚠️ Errore nell'eliminazione delle unità del lotto:\n\n{0}",{0:(errUnita.message)}));
      return;
    }
    const {error: errLotto} = await supabase.from("lotti_suini").delete().eq("id", lotto.id);
    setEliminando(false);
    if(errLotto){
      alert(t("⚠️ Le unità sono state eliminate, ma il lotto stesso ha dato errore:\n\n{0}",{0:(errLotto.message)}));
      return;
    }
    onDelete();
  };

  const unitaFiltrate = useMemo(()=>{
    if(!cerca.trim()) return unita;
    const q=cerca.trim().toLowerCase();
    return unita.filter(u=>{
      const cod=(u.codice_completo||"").toLowerCase();
      return cod.includes(q)||String(u.nr).padStart(2,"0")===q.padStart(2,"0");
    });
  },[unita,cerca]);

  const madre = animali.find(a=>a.id===lotto.madre_id);
  const padre = animali.find(a=>a.id===lotto.padre_id);
  const vivi = unita.filter(u=>u.vivo!==false&&u.stato==="attivo").length;
  const macellati = unita.filter(u=>u.stato==="macellato").length;
  const deceduti = unita.filter(u=>["morto","disperso"].includes(u.stato)).length;
  const conBDN = unita.filter(u=>u.stato==="registrato_individuale").length;
  const maschi = unita.filter(u=>u.sesso==="M").length;
  const femmine = unita.filter(u=>u.sesso==="F").length;
  const castrati = unita.filter(u=>u.sesso==="Castrato").length;

  const salvaLotto = async () => {
    setSaving(true);
    const codice = (form.codice_lotto||form.codice||"").trim()||null;
    const payload = {
      codice, codice_lotto: codice,
      tipo_provenienza: form.tipo_provenienza||null,
      data_parto: form.data_parto||null,
      madre_id: form.madre_id?parseInt(form.madre_id):null,
      padre_id: form.padre_id?parseInt(form.padre_id):null,
      razza_madre: form.razza_madre||null,
      razza_padre: form.razza_padre||null,
      nati_totali: form.nati_totali!==""&&form.nati_totali!=null?parseInt(form.nati_totali):null,
      nati_vivi: form.nati_vivi!==""&&form.nati_vivi!=null?parseInt(form.nati_vivi):null,
      nati_morti: form.nati_morti!==""&&form.nati_morti!=null?parseInt(form.nati_morti):null,
      fornitore: form.fornitore||null,
      data_fattura: form.data_fattura||null,
      numero_fattura: form.numero_fattura||null,
      prezzo_acquisto: form.prezzo_acquisto?parseFloat(form.prezzo_acquisto):null,
      note: form.note||null,
    };
    const {error} = await supabase.from("lotti_suini").update(payload).eq("id", lotto.id);
    setSaving(false);
    if(!error){ setForm(null); onUpdate(); }
  };

  // ── Vista FORM (modifica lotto) ─────────────────────────────────────────────
  if(form){
    const madri = animali.filter(a=>a.sesso==="F");
    const padri = animali.filter(a=>a.sesso==="M");
    return (
      <div style={{padding:"16px 16px 100px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={()=>setForm(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
          <span style={{fontSize:18,fontWeight:800}}>{t("✏️ Modifica lotto")} {lotto.codice_lotto||lotto.codice}</span>
        </div>

        <Field label={t("Codice lotto")} value={form.codice_lotto??form.codice}
          onChange={v=>setForm(f=>({...f,codice_lotto:v.toUpperCase()}))}/>
        <Field label={t("Tipo provenienza")} value={form.tipo_provenienza}
          onChange={v=>setForm(f=>({...f,tipo_provenienza:v}))}
          options={[{value:"nato",label:"🐣 Nato in azienda"},{value:"acquistato",label:"📦 Acquistato"}]}/>
        <Field label={t("Data parto / acquisto")} value={form.data_parto}
          onChange={v=>setForm(f=>({...f,data_parto:v}))} type="date"/>

        <Field label={t("Madre (in azienda)")} value={form.madre_id}
          onChange={v=>setForm(f=>({...f,madre_id:v}))}
          options={madri.map(a=>({value:a.id,label:`${a.nome||a.bdn} (${a.razza||"—"})`}))}/>
        <Field label={t("Padre (in azienda)")} value={form.padre_id}
          onChange={v=>setForm(f=>({...f,padre_id:v}))}
          options={padri.map(a=>({value:a.id,label:`${a.nome||a.bdn} (${a.razza||"—"})`}))}/>
        <Field label={t("Razza madre")} value={form.razza_madre} onChange={v=>setForm(f=>({...f,razza_madre:v}))}/>
        <Field label={t("Razza padre")} value={form.razza_padre} onChange={v=>setForm(f=>({...f,razza_padre:v}))}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <Field label={t("Nati totali")} value={form.nati_totali} onChange={v=>setForm(f=>({...f,nati_totali:v}))} type="number"/>
          <Field label={t("Nati vivi")} value={form.nati_vivi} onChange={v=>setForm(f=>({...f,nati_vivi:v}))} type="number"/>
          <Field label={t("Nati morti")} value={form.nati_morti} onChange={v=>setForm(f=>({...f,nati_morti:v}))} type="number"/>
        </div>

        <Field label={t("Fornitore")} value={form.fornitore} onChange={v=>setForm(f=>({...f,fornitore:v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Field label={t("Data fattura")} value={form.data_fattura}
            onChange={v=>setForm(f=>({...f,data_fattura:v}))} type="date"/>
          <Field label={t("Numero fattura")} value={form.numero_fattura}
            onChange={v=>setForm(f=>({...f,numero_fattura:v}))} placeholder={t("Es. FT-2026-0042")}/>
        </div>
        <Field label={t("Prezzo acquisto (€)")} value={form.prezzo_acquisto}
          onChange={v=>setForm(f=>({...f,prezzo_acquisto:v}))} type="number"/>
        <Field label={t("Note")} value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>

        <div style={{display:"flex",gap:10,marginTop:16}}>
          <Btn label={saving?t("Salvataggio..."):t("Salva")} icon="✓" onClick={salvaLotto} variant="success" disabled={saving}/>
          <Btn label={t("Annulla")} onClick={()=>setForm(null)} variant="ghost"/>
        </div>
      </div>
    );
  }

  return (
    <div style={{paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.suini},${C.primary})`,
        padding:"20px 16px 24px",borderRadius:"0 0 24px 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",
              border:"none",borderRadius:10,padding:"6px 10px",color:"#FFF",
              cursor:"pointer",fontSize:18}}>←</button>
            <div>
              <div style={{fontSize:22,fontWeight:900,color:"#FFF",
                fontFamily:"monospace",letterSpacing:2}}>{lotto.codice_lotto||lotto.codice}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>
                {lotto.tipo_provenienza==="acquistato"?t("📦 Acquistato"):t("🐣 Parto")} {lotto.data_parto}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>setForm({...lotto})} style={{background:"rgba(255,255,255,0.2)",
              border:"none",borderRadius:10,padding:"6px 10px",color:"#FFF",
              cursor:"pointer",fontSize:16}}>{t("✏️ Modifica")}</button>
            <button onClick={eliminaLotto} disabled={eliminando} style={{background:"rgba(0,0,0,0.25)",
              border:"none",borderRadius:10,padding:"6px 10px",color:"#FFF",
              cursor:"pointer",fontSize:16}}>{eliminando?"...":"🗑️"}</button>
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

      <div style={{padding:"14px"}}>
        {/* Statistiche */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
          {[
            {l:"Vivi nel lotto",v:vivi,c:C.green},
            {l:"Macellati",v:macellati,c:C.muted},
            {l:"Deceduti/Dispersi",v:deceduti,c:C.red},
            {l:"Trasferiti a registro",v:conBDN,c:C.blue},
            {l:"Maschi",v:maschi,c:C.blue},
            {l:"Femmine",v:femmine,c:C.suini},
          ].map(s=>(
            <div key={s.l} style={{background:C.card,borderRadius:12,padding:"10px 6px",
              textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
              <div style={{fontSize:9,color:C.muted,fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Ricerca */}
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
            fontSize:16,color:C.muted}}>🔍</span>
          <input type="text" value={cerca} onChange={e=>setCerca(e.target.value)}
            placeholder={t("Cerca per tatuaggio (es. 2304CC1905) o numero...")}
            style={{...inputStyle,border:`2px solid ${cerca?C.primary:C.border}`,
              borderRadius:12,padding:"10px 38px"}}/>
          {cerca&&<button onClick={()=>setCerca("")}
            style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>

        {/* v136 — castrazione di tutti i maschi vivi del lotto */}
        {(()=>{
          const maschiVivi = unita.filter(u=>u.sesso==="M"&&u.vivo!==false&&u.stato==="attivo");
          if(!maschiVivi.length) return null;
          return castraTutti===null ? (
            <div style={{marginBottom:12}}>
              <Btn label={t("✂ Castra tutti i maschi ({0})",{0:maschiVivi.length})} onClick={()=>setCastraTutti(today())} variant="blue" full/>
            </div>
          ) : (
            <div style={{background:C.blue+"12",border:`2px solid ${C.blue}`,borderRadius:14,padding:14,marginBottom:12}}>
              <div style={{fontWeight:800,color:C.blue,marginBottom:8,fontSize:14}}>
                {t("✂ Castrazione di {0} maschi:",{0:maschiVivi.length})} {maschiVivi.map(u=>String(u.nr).padStart(2,"0")).join(", ")}
              </div>
              <Field label={t("Data della castrazione")} required value={castraTutti} onChange={setCastraTutti} type="date"/>
              <div style={{display:"flex",gap:8}}>
                <Btn label={saving?"...":t("✓ Conferma")} small variant="blue" disabled={saving} onClick={async()=>{
                  if(!castraTutti){ alert(t("⚠️ Inserire la data della castrazione.")); return; }
                  setSaving(true);
                  const {error} = await registraCastrazioni(maschiVivi.map(u=>u.id), castraTutti);
                  setSaving(false);
                  if(error){ alert(t("⚠️ Errore nel salvataggio:\n\n{0}",{0:error.message})); return; }
                  setCastraTutti(null); onUpdate();
                }}/>
                <Btn label={t("Annulla")} small variant="ghost" onClick={()=>setCastraTutti(null)}/>
              </div>
            </div>
          );
        })()}

        <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:8}}>
          {t("UNITÀ DEL LOTTO —")} {unitaFiltrate.length} / {unita.length}
          {castrati>0&&t(" · {0} castrati",{0:(castrati)})}
        </div>

        {unitaFiltrate.map(u=>(
          <CardUnita key={u.id} u={u} lotto={lotto} animali={animali} onUpdate={onUpdate}/>
        ))}

        {vivi===0&&unita.length>0&&(
          <div style={{textAlign:"center",padding:20,background:C.green+"15",
            borderRadius:12,marginTop:8,fontSize:13,color:C.green,fontWeight:600}}>
            {t("✓ Tutte le unità sono uscite dal lotto")}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── v136 — SCHEDA DELLA MADRE: suinetti morti per causa sua ──────────────────
export function MortiCausaMadre({ madreId }) {
  const [dati,setDati] = useState(null);
  useEffect(()=>{
    let vivo = true;
    (async()=>{
      const {data:lot} = await supabase.from("lotti_suini").select("id,codice,codice_lotto,data_parto,tipo_provenienza,madre_id,nati_vivi").eq("madre_id", madreId);
      const ids = (lot||[]).map(l=>l.id);
      const {data:sui} = ids.length ? await supabase.from("suini_lotto").select("id,lotto_id,stato,causa_morte").in("lotto_id", ids) : {data:[]};
      if(vivo) setDati(contaMortiPerMadre(lot||[], sui||[])[madreId] || null);
    })();
    return ()=>{ vivo=false; };
  },[madreId]);
  if(!dati) return null;
  const macello = madreDaMacello(dati.uccisi, dati.schiacciati);
  return (
    <div style={{background:macello?C.red:C.red+"12",color:macello?"#FFF":C.red,border:`2px solid ${C.red}`,
      borderRadius:12,padding:"10px 14px",marginBottom:12,fontSize:13,fontWeight:700}}>
      {macello&&<div style={{fontSize:16,fontWeight:900,marginBottom:6}}>🔴 {t("DA MANDARE AL MACELLO")}</div>}
      <div style={{marginBottom:4}}>{t("Suinetti morti per causa della madre: {0} schiacciati, {1} uccisi",{0:dati.schiacciati,1:dati.uccisi})}</div>
      {Object.entries(dati.lotti).sort((x,y)=>(y[1].data||"").localeCompare(x[1].data||"")).map(([cod,v])=>(
        <div key={cod} style={{fontWeight:600,fontSize:12}}>
          {t("Lotto")} {cod} ({v.data}): {t("{0} schiacciati, {1} uccisi",{0:v.schiacciati,1:v.uccisi})}
        </div>
      ))}
    </div>
  );
}

// ─── LISTA LOTTI ──────────────────────────────────────────────────────────────
function ListaLotti({lotti, suini, animali, onSeleziona, onAcquisto}) {
  const [cerca,setCerca] = useState("");

  const lottiFiltrati = useMemo(()=>{
    if(!cerca.trim()) return lotti;
    const q=cerca.trim().toLowerCase();
    return lotti.filter(l=>{
      const cod=(l.codice_lotto||l.codice||"").toLowerCase();
      if(cod.includes(q)) return true;
      const madre=animali.find(a=>a.id===l.madre_id);
      if((madre?.bdn||"").toLowerCase().includes(q)) return true;
      // Cerca per tatuaggio unità
      return suini.some(u=>u.lotto_id===l.id&&
        (u.codice_completo||"").toLowerCase().includes(q));
    });
  },[lotti,suini,animali,cerca]);

  const totVivi = suini.filter(u=>u.vivo!==false&&u.stato==="attivo").length;

  return (
    <div style={{paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.suini},${C.primary})`,
        borderRadius:"0 0 28px 28px",padding:"24px 16px 20px"}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>{t("🐷 Lotti Suini")}</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",marginTop:4}}>
          {lotti.length} {t("lotti ·")} <strong style={{color:"#FFF"}}>{totVivi} {t("suinetti vivi nei lotti")}</strong>
        </div>
      </div>

      <div style={{padding:"14px"}}>
        {/* Ricerca */}
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:12,top:"50%",
            transform:"translateY(-50%)",fontSize:16,color:C.muted}}>🔍</span>
          <input type="text" value={cerca} onChange={e=>setCerca(e.target.value)}
            placeholder={t("Cerca per codice lotto, tatuaggio unità o BDN madre...")}
            style={{...inputStyle,border:`2px solid ${cerca?C.suini:C.border}`,
              borderRadius:12,padding:"10px 38px"}}/>
          {cerca&&<button onClick={()=>setCerca("")}
            style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",fontSize:16}}>✕</button>}
        </div>

        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <Btn label={t("📦 Lotto acquistato")} onClick={onAcquisto} variant="outline" small/>
          <Btn label={t("📊 Excel")} onClick={()=>esportaExcel(lotti,suini,animali)} variant="outline" small/>
        </div>

        {lottiFiltrati.length===0?(
          <div style={{textAlign:"center",padding:48,color:C.muted}}>
            <div style={{fontSize:48,marginBottom:12}}>🐷</div>
            <div style={{fontWeight:700,fontSize:16}}>
              {cerca?t("Nessun lotto trovato"):t("Nessun lotto registrato")}
            </div>
            <div style={{fontSize:13,marginTop:8}}>
              {cerca?t("Prova con un codice diverso"):t("I lotti si creano automaticamente registrando un parto suino dalla scheda della madre")}
            </div>
          </div>
        ):lottiFiltrati.map(l=>{
          const us = suini.filter(s=>s.lotto_id===l.id);
          const vivi = us.filter(u=>u.vivo!==false&&u.stato==="attivo").length;
          const tot = us.length;
          const pct = tot>0?Math.round(vivi/tot*100):0;
          const madre = animali.find(a=>a.id===l.madre_id);
          const padre = animali.find(a=>a.id===l.padre_id);
          const chiuso = tot>0&&vivi===0;
          return (
            <div key={l.id} onClick={()=>onSeleziona(l)}
              style={{background:chiuso?"#F5F5F5":C.card,borderRadius:16,padding:14,
                marginBottom:10,boxShadow:"0 2px 6px rgba(0,0,0,0.07)",
                border:`1px solid ${chiuso?"#DDD":C.border}`,
                borderLeft:`5px solid ${chiuso?C.muted:C.suini}`,cursor:"pointer",
                opacity:chiuso?0.75:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:20,fontWeight:900,
                    color:chiuso?C.muted:C.suini,fontFamily:"monospace",letterSpacing:2}}>
                    {l.codice_lotto||l.codice}
                  </div>
                  <div style={{fontSize:12,color:C.muted}}>
                    {l.tipo_provenienza==="acquistato"?"📦":"🐣"} {l.data_parto}
                    {l.fornitore&&` · ${l.fornitore}`}
                  </div>
                  {(madre||padre)&&(
                    <div style={{fontSize:12,color:C.muted,marginTop:2}}>
                      {madre&&`♀ ${madre.nome||madre.bdn}`}
                      {madre&&padre&&" · "}
                      {padre&&`♂ ${padre.nome||padre.bdn}`}
                    </div>
                  )}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:26,fontWeight:900,color:chiuso?C.muted:C.green}}>{vivi}</div>
                  <div style={{fontSize:11,color:C.muted}}>{t("vivi /")} {tot}</div>
                  {chiuso&&<div style={{fontSize:10,color:C.muted,fontWeight:600}}>{t("✓ CHIUSO")}</div>}
                </div>
              </div>
              {tot>0&&(
                <div style={{background:C.border,borderRadius:6,height:5,overflow:"hidden",marginBottom:8}}>
                  <div style={{background:chiuso?C.muted:C.green,width:`${pct}%`,height:"100%"}}/>
                </div>
              )}
              <div style={{fontSize:12,color:C.blue,fontWeight:600}}>
                {t("👆 Tocca per aprire la scheda completa")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FORM LOTTO ACQUISTATO ────────────────────────────────────────────────────
function FormLottoAcquistato({onSave, onCancel}) {
  const [form,setForm] = useState({
    data_acquisto:today(),fornitore:"",n_capi:"",
    data_fattura:"",numero_fattura:"",
    razza:"Cinta Senese",prezzo_acquisto:"",note:"",codice_manuale:"",
  });
  const [saving,setSaving] = useState(false);
  const codiceAuto = form.data_acquisto?(()=>{
    const d=new Date(form.data_acquisto);
    return `${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,"0")}AQ`;
  })():"";
  const codice = form.codice_manuale||codiceAuto;
  const nCapi = parseInt(form.n_capi)||0;

  const salva = async () => {
    if(!form.data_acquisto||!nCapi) return;
    setSaving(true);
    const{data:nuovoLotto, error:errLotto}=await supabase.from("lotti_suini").insert([{
      codice,codice_lotto:codice,
      anno:new Date(form.data_acquisto).getFullYear(),
      data_parto:form.data_acquisto,
      tipo_provenienza:"acquistato",
      fornitore:form.fornitore||null,
      data_fattura:form.data_fattura||null,
      numero_fattura:form.numero_fattura||null,
      prezzo_acquisto:form.prezzo_acquisto?parseFloat(form.prezzo_acquisto):null,
      nati_totali:nCapi,nati_vivi:nCapi,nati_morti:0,
      razza_madre:form.razza||null,note:form.note||null,specie:"suino",
    }]).select("id").single();
    if(errLotto){
      setSaving(false);
      alert(t("⚠️ Errore nella creazione del lotto:\n\n{0}",{0:(errLotto.message)}));
      return;
    }
    if(nuovoLotto){
      const{error:errUnita}=await supabase.from("suini_lotto").insert(
        Array.from({length:nCapi},(_,i)=>({
          lotto_id:nuovoLotto.id,nr:i+1,
          codice_completo:codiceUnita(codice,i+1),
          vivo:true,stato:"attivo",destinazione:"ingrasso",
        }))
      );
      if(errUnita){
        setSaving(false);
        alert(t("⚠️ Il lotto è stato creato, ma il salvataggio delle unità è fallito:\n\n{0}",{0:(errUnita.message)}));
        return;
      }
    }
    setSaving(false);onSave();
  };

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto",padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <button onClick={onCancel} style={{background:"none",border:"none",cursor:"pointer",fontSize:22}}>←</button>
        <span style={{fontSize:18,fontWeight:800}}>{t("📦 Lotto acquistato")}</span>
      </div>
      {codice&&(
        <div style={{background:"#E3F2FD",border:`2px solid ${C.blue}`,borderRadius:14,
          padding:"12px 16px",marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:C.blue,marginBottom:4}}>{t("🏷️ CODICE LOTTO")}</div>
          <div style={{fontSize:30,fontWeight:900,color:C.blue,fontFamily:"monospace",letterSpacing:3}}>{codice}</div>
          {nCapi>0&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>
            {t("Unità:")} {codice}01 … {codice}{String(nCapi).padStart(2,"0")}
          </div>}
        </div>
      )}
      <Field label={t("Data acquisto *")} value={form.data_acquisto}
        onChange={v=>setForm(f=>({...f,data_acquisto:v}))} type="date" required/>
      <Field label={t("Fornitore / Azienda")} value={form.fornitore}
        onChange={v=>setForm(f=>({...f,fornitore:v}))} placeholder={t("Es. Az. Agr. Rossi")}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label={t("Data fattura")} value={form.data_fattura}
          onChange={v=>setForm(f=>({...f,data_fattura:v}))} type="date"/>
        <Field label={t("Numero fattura")} value={form.numero_fattura}
          onChange={v=>setForm(f=>({...f,numero_fattura:v}))} placeholder={t("Es. FT-2026-0042")}/>
      </div>
      <Field label={t("N° capi acquistati *")} value={form.n_capi}
        onChange={v=>setForm(f=>({...f,n_capi:v}))} type="number" required/>
      <Field label={t("Razza")} value={form.razza} onChange={v=>setForm(f=>({...f,razza:v}))}
        options={["Cinta Senese","Nero Apucalabro","Nero Casertano","Mora Romagnola",
          "Duroc","Large White","Landrace","Meticcia","Altra"]}/>
      <Field label={t("Prezzo totale (€)")} value={form.prezzo_acquisto}
        onChange={v=>setForm(f=>({...f,prezzo_acquisto:v}))} type="number"/>
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:12,marginBottom:12}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>
          {t("Codice tatuaggio (lascia vuoto per generazione automatica:")} {codiceAuto})
        </div>
        <input type="text" value={form.codice_manuale}
          onChange={e=>setForm(f=>({...f,codice_manuale:e.target.value.toUpperCase()}))}
          placeholder={codiceAuto}
          style={{...inputStyle,fontFamily:"monospace"}}/>
      </div>
      <Field label={t("Note")} value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/>
      <Btn label={saving?"...":nCapi>0?t("📦 Crea lotto con {0} unità",{0:(nCapi)}):t("Inserisci il numero di capi")}
        onClick={salva} disabled={saving||!form.data_acquisto||!nCapi} full variant="primary"/>
    </div>
  );
}

// ─── EXPORT EXCEL ─────────────────────────────────────────────────────────────
function esportaExcel(lotti, suini, animali) {
  const wb = require("xlsx").utils.book_new();
  const XLSX = require("xlsx");
  const righeL = lotti.map(l=>{
    const us=suini.filter(s=>s.lotto_id===l.id);
    const madre=animali.find(a=>a.id===l.madre_id);
    return {"Codice Lotto":l.codice_lotto||l.codice,"Data":l.data_parto,
      "Tipo":l.tipo_provenienza==="acquistato"?"Acquistato":"Parto",
      "Fornitore":l.fornitore||"","Madre BDN":madre?.bdn||"","Madre Nome":madre?.nome||"",
      "Nati Totali":l.nati_totali||us.length,"Nati Vivi":l.nati_vivi||0,"Nati Morti":l.nati_morti||0,
      "Vivi Attuali":us.filter(u=>u.vivo!==false&&u.stato==="attivo").length,
      "Macellati":us.filter(u=>u.stato==="macellato").length};
  });
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(righeL),"Lotti");
  const righeU = suini.map(u=>{
    const l=lotti.find(x=>x.id===u.lotto_id);
    return {"Tatuaggio":u.codice_completo||"","Lotto":l?.codice_lotto||"","Nr":u.nr,
      "Sesso":u.sesso||"","Stato":u.stato||"","BDN individuale":u.bdn||u.matricola||"",
      "Peso nascita":u.peso_nascita||"","Data uscita":u.data_uscita||"",
      "Motivo":u.motivo_uscita||"","Peso vivo":u.peso_vivo_uscita||"",
      "Peso carcassa":u.peso_carcassa||"","Resa %":u.resa_percent||""};
  });
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(righeU),"Unità");
  XLSX.writeFile(wb,`Lotti_Suini_${new Date().toISOString().split("T")[0]}.xlsx`);
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function LottiSuini() {
  const [animali,setAnimali] = useState([]);
  const [lotti,setLotti]     = useState([]);
  const [suini,setSuini]     = useState([]);
  const [loading,setLoading] = useState(true);
  const [view,setView]       = useState("lista");
  const [selLottoId,setSelLottoId] = useState(null);
  const [avvisoChiuso,setAvvisoChiuso] = useState(false);   // v136 — avviso a ogni apertura della sezione
  const selLotto = lotti.find(l=>l.id===selLottoId)||null;

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

  // v136 — all'apertura della sezione Lotti: avviso a tutto schermo
  const viviSenzaSesso = suini.filter(u=>u.vivo!==false&&u.stato==="attivo"&&!u.sesso);
  const lottiSenzaSesso = new Set(viviSenzaSesso.map(u=>u.lotto_id)).size;
  const perMadre = contaMortiPerMadre(lotti, suini);
  const madriMacello = Object.entries(perMadre)
    .filter(([id,m])=>madreDaMacello(m.uccisi,m.schiacciati))
    .map(([id,m])=>({m, a:animali.find(x=>x.id===parseInt(id))}))
    .filter(x=>x.a&&x.a.stato==="attivo");
  const avviso = !avvisoChiuso&&(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:500,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#FFF",borderRadius:18,padding:20,maxWidth:420,width:"100%",
        border:`3px solid ${C.red}`,boxShadow:"0 8px 30px rgba(0,0,0,0.3)"}}>
        <div style={{fontSize:20,fontWeight:900,color:C.red,textAlign:"center",marginBottom:12,lineHeight:1.3}}>
          ⚠️ {t("REGISTRARE IL SESSO E LE MORTI DEI SUINETTI")}
        </div>
        <div style={{fontSize:14,color:C.text,lineHeight:1.5,marginBottom:10}}>
          {t("Per ogni suinetto del lotto: il sesso con il pulsante ⚖️ e, se è morto, la morte con il pulsante 📤 (motivo «Morto»).")}
        </div>
        <div style={{fontSize:14,fontWeight:700,color:viviSenzaSesso.length?C.red:C.green,marginBottom:16}}>
          {viviSenzaSesso.length
            ?t("Suinetti vivi senza sesso: {0} in {1} lotti.",{0:viviSenzaSesso.length,1:lottiSenzaSesso})
            :t("✅ Tutti i suinetti vivi hanno il sesso.")}
        </div>
        {madriMacello.length>0&&(
          <div style={{background:C.red,color:"#FFF",borderRadius:12,padding:"10px 12px",marginBottom:16,fontSize:13,fontWeight:700}}>
            🔴 {t("DA MANDARE AL MACELLO")}:
            {madriMacello.map(({m,a})=>(
              <div key={a.id} style={{marginTop:4}}>
                {a.bdn||a.nome} — {t("{0} schiacciati, {1} uccisi",{0:m.schiacciati,1:m.uccisi})}
              </div>
            ))}
          </div>
        )}
        <Btn label={t("Ho capito")} onClick={()=>setAvvisoChiuso(true)} variant="danger" full/>
      </div>
    </div>
  );

  const wrap = ch => (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>{avviso}{ch}</div>
  );

  if(view==="acquisto") return wrap(
    <FormLottoAcquistato
      onSave={()=>{carica();setView("lista");}}
      onCancel={()=>setView("lista")}/>
  );
  if(view==="lotto"&&selLotto) return wrap(
    <SchedaLotto lotto={selLotto} suini={suini} animali={animali}
      onBack={()=>{setView("lista");setSelLottoId(null);}}
      onUpdate={async()=>{await carica();}}
      onDelete={async()=>{setView("lista");setSelLottoId(null);await carica();}}/>
  );
  return wrap(
    <ListaLotti lotti={lotti} suini={suini} animali={animali}
      onSeleziona={l=>{setSelLottoId(l.id);setView("lotto");}}
      onAcquisto={()=>setView("acquisto")}/>
  );
}
