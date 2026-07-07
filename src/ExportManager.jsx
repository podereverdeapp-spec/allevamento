import { useState } from "react";
import * as XLSX from "xlsx-js-style";
import { supabase } from "./supabase";

const C = {
  bg:"#F5F0E8", card:"#FFFFFF", primary:"#5C3D1E", accent:"#A0522D",
  green:"#4A7C59", red:"#C0392B", yellow:"#D4A017", blue:"#2C6E9B",
  text:"#2D1B0E", muted:"#8B7355", border:"#D4C4A8",
  bovini:"#8B6914", suini:"#B5547A", ovini:"#4A7C59",
};

const today = () => new Date().toISOString().split("T")[0];

// ─── Helpers foglio Excel ──────────────────────────────────────────────────────
function creaFoglio(dati, colonne) {
  if(!dati||dati.length===0) return XLSX.utils.json_to_sheet([{"Nessun dato":""}]);
  const righe = dati.map(d => {
    const r = {};
    colonne.forEach(c => { r[c.label] = d[c.key] ?? ""; });
    return r;
  });
  return XLSX.utils.json_to_sheet(righe);
}

function scarica(wb, nomeFile) {
  XLSX.writeFile(wb, `${nomeFile}_${today()}.xlsx`);
}

// ─── GENERATORI FOGLI ─────────────────────────────────────────────────────────
function foglio_anagrafica(animali) {
  // Arricchisco con colonna qualifica + IPG calcolati
  const dati = animali.map(a => {
    const gg = a.data_uscita&&a.data_ingresso
      ? Math.round((new Date(a.data_uscita)-new Date(a.data_ingresso))/86400000) : 0;
    return {
      ...a,
      qualifica: a.riproduttore
        ? (a.sesso==="M" ? "Riproduttore" : "Riproduttrice")
        : "",
      giorni_permanenza: gg>0 ? gg : "",
      ipg_peso_vivo: gg>0&&a.peso_vivo_uscita ? Math.round(a.peso_vivo_uscita/gg*1000)/1000 : "",
      ipg_carcassa:  gg>0&&a.peso_carcassa    ? Math.round(a.peso_carcassa/gg*1000)/1000 : "",
    };
  });
  return creaFoglio(dati, [
    {key:"bdn",                    label:"BDN / Matricola"},
    {key:"nome",                   label:"Nome"},
    {key:"specie",                 label:"Specie"},
    {key:"razza",                  label:"Razza"},
    {key:"razza_calcolata",        label:"Razza calcolata"},
    {key:"sesso",                  label:"Sesso"},
    {key:"qualifica",              label:"Qualifica riproduzione"},
    {key:"categoria",              label:"Categoria"},
    {key:"nascita",                label:"Data nascita"},
    {key:"data_registrazione_bdn", label:"Data registrazione BDN"},
    {key:"peso_nascita",           label:"Peso nascita (kg)"},
    {key:"peso_attuale",           label:"Peso attuale (kg)"},
    {key:"provenienza",            label:"Provenienza"},
    {key:"origine",                label:"Azienda origine"},
    {key:"prezzo_acquisto",        label:"Prezzo acquisto (€)"},
    {key:"data_ingresso",          label:"Data ingresso"},
    {key:"lotto_box",              label:"Lotto / Box"},
    {key:"destinazione",           label:"Destinazione"},
    {key:"stato",                  label:"Stato"},
    {key:"data_uscita",            label:"Data uscita"},
    {key:"motivo_uscita",          label:"Motivo uscita"},
    {key:"peso_vivo_uscita",       label:"Peso vivo uscita (kg)"},
    {key:"peso_carcassa",          label:"Peso carcassa (kg)"},
    {key:"resa_percent",           label:"Resa %"},
    {key:"giorni_permanenza",      label:"Giorni permanenza"},
    {key:"ipg_peso_vivo",          label:"IPG peso vivo (kg/gg)"},
    {key:"ipg_carcassa",           label:"IPG carcassa (kg/gg)"},
    {key:"note_sanitarie",         label:"Note sanitarie"},
    {key:"note",                   label:"Note"},
  ]);
}

function foglio_sanitario(eventi, animali, suiniLotto, lotti) {
  const dati = eventi.map(e => {
    const a = e.animale_id ? animali.find(x=>x.id===e.animale_id) : null;
    const u = e.suini_lotto_id ? suiniLotto.find(x=>x.id===e.suini_lotto_id) : null;
    const l = u ? lotti.find(x=>x.id===u.lotto_id) : null;
    return {
      data:        e.data,
      specie:      a?.specie || (u?"suino (lotto)":""),
      animale:     a ? (a.nome||a.bdn||"") : (u ? `${l?.codice_lotto||l?.codice||""}${String(u.nr).padStart(2,"0")}` : ""),
      bdn:         a?.bdn || "",
      tipo:        e.tipo,
      descrizione: e.descrizione,
      prodotto:    e.prodotto||"",
      veterinario: e.veterinario||"",
      scadenza:    e.scadenza||"",
      costo:       e.costo||"",
      note:        e.note||"",
    };
  });
  return creaFoglio(dati, [
    {key:"data",        label:"Data"},
    {key:"specie",      label:"Specie"},
    {key:"animale",     label:"Animale / Tatuaggio"},
    {key:"bdn",         label:"BDN"},
    {key:"tipo",        label:"Tipo"},
    {key:"descrizione", label:"Descrizione"},
    {key:"prodotto",    label:"Prodotto / Farmaco"},
    {key:"veterinario", label:"Veterinario"},
    {key:"scadenza",    label:"Scadenza richiamo"},
    {key:"costo",       label:"Costo (€)"},
  ]);
}

function foglio_alimentazione(voci) {
  return creaFoglio(voci, [
    {key:"data",     label:"Data"},
    {key:"specie",   label:"Specie"},
    {key:"tipo",     label:"Tipo mangime / foraggio"},
    {key:"quantita", label:"Quantità"},
    {key:"unita",    label:"Unità"},
    {key:"costo",    label:"Costo (€)"},
    {key:"note",     label:"Note"},
  ]);
}

function foglio_parti(eventi, animali) {
  const dati = eventi.filter(e=>e.tipo_evento==="parto").map(e => {
    const madre = animali.find(a=>a.id===e.animale_id);
    const padre = e.padre_id ? animali.find(a=>a.id===e.padre_id) : null;
    return {
      data_parto:         e.data_evento,
      madre_bdn:          madre?.bdn||"",
      madre_nome:         madre?.nome||"",
      specie:             madre?.specie||"",
      razza_madre:        madre?.razza||"",
      padre_bdn:          padre?.bdn||"",
      padre_nome:         padre?.nome||"",
      tipo_parto:         e.tipo_parto||"",
      nati_vivi:          e.nati_vivi||0,
      nati_morti:         e.nati_morti||0,
      nati_totali:        (e.nati_vivi||0)+(e.nati_morti||0),
      data_accoppiamento: e.data_accoppiamento||"",
      note:               e.note||"",
    };
  });
  return creaFoglio(dati, [
    {key:"data_parto",         label:"Data parto"},
    {key:"specie",             label:"Specie"},
    {key:"madre_bdn",          label:"BDN Madre"},
    {key:"madre_nome",         label:"Nome Madre"},
    {key:"razza_madre",        label:"Razza Madre"},
    {key:"padre_bdn",          label:"BDN Padre"},
    {key:"padre_nome",         label:"Nome Padre"},
    {key:"tipo_parto",         label:"Tipo parto"},
    {key:"nati_totali",        label:"Nati totali"},
    {key:"nati_vivi",          label:"Nati vivi"},
    {key:"nati_morti",         label:"Nati morti"},
    {key:"data_accoppiamento", label:"Data accoppiamento"},
    {key:"note",               label:"Note"},
  ]);
}

function foglio_uscite(animali) {
  const usciti = animali.filter(a=>a.stato!=="attivo");
  const dati = usciti.map(a => ({
    bdn:              a.bdn||"",
    nome:             a.nome||"",
    specie:           a.specie||"",
    razza:            a.razza_calcolata||a.razza||"",
    sesso:            a.sesso||"",
    nascita:          a.nascita||"",
    data_ingresso:    a.data_ingresso||"",
    data_uscita:      a.data_uscita||"",
    giorni_permanenza:a.data_uscita&&a.data_ingresso
      ?Math.round((new Date(a.data_uscita)-new Date(a.data_ingresso))/86400000):"",
    stato:            a.stato||"",
    motivo_uscita:    a.motivo_uscita||"",
    peso_vivo_uscita: a.peso_vivo_uscita||"",
    peso_carcassa:    a.peso_carcassa||"",
    resa_percent:     a.resa_percent||"",
    ipg_peso_vivo:    (()=>{
      const gg = a.data_uscita&&a.data_ingresso
        ? Math.round((new Date(a.data_uscita)-new Date(a.data_ingresso))/86400000) : 0;
      return gg>0&&a.peso_vivo_uscita ? Math.round(a.peso_vivo_uscita/gg*1000)/1000 : "";
    })(),
    ipg_carcassa:     (()=>{
      const gg = a.data_uscita&&a.data_ingresso
        ? Math.round((new Date(a.data_uscita)-new Date(a.data_ingresso))/86400000) : 0;
      return gg>0&&a.peso_carcassa ? Math.round(a.peso_carcassa/gg*1000)/1000 : "";
    })(),
    note:             a.note||"",
  }));
  return creaFoglio(dati, [
    {key:"bdn",              label:"BDN / Matricola"},
    {key:"nome",             label:"Nome"},
    {key:"specie",           label:"Specie"},
    {key:"razza",            label:"Razza"},
    {key:"sesso",            label:"Sesso"},
    {key:"nascita",          label:"Data nascita"},
    {key:"data_ingresso",    label:"Data ingresso"},
    {key:"data_uscita",      label:"Data uscita"},
    {key:"giorni_permanenza",label:"Giorni permanenza"},
    {key:"stato",            label:"Stato"},
    {key:"motivo_uscita",    label:"Motivo uscita"},
    {key:"peso_vivo_uscita", label:"Peso vivo (kg)"},
    {key:"peso_carcassa",    label:"Peso carcassa (kg)"},
    {key:"resa_percent",     label:"Resa %"},
    {key:"ipg_peso_vivo",    label:"IPG peso vivo (kg/gg)"},
    {key:"ipg_carcassa",     label:"IPG carcassa (kg/gg)"},
    {key:"note",             label:"Note"},
  ]);
}

function foglio_lotti_riepilogo(lotti, suiniLotto, animali) {
  const dati = lotti.map(l => {
    const us = suiniLotto.filter(s=>s.lotto_id===l.id);
    const madre = animali.find(a=>a.id===l.madre_id);
    const padre = animali.find(a=>a.id===l.padre_id);
    return {
      codice:      l.codice_lotto||l.codice||"",
      data_parto:  l.data_parto||"",
      madre_bdn:   madre?.bdn||"",
      madre_nome:  madre?.nome||"",
      razza_madre: l.razza_madre||madre?.razza||"",
      padre_bdn:   padre?.bdn||"",
      razza_padre: l.razza_padre||padre?.razza||"",
      nati_totali: l.nati_totali||us.length,
      nati_vivi:   l.nati_vivi||us.filter(u=>u.vivo!==false).length,
      nati_morti:  l.nati_morti||0,
      vivi_attuali:us.filter(u=>u.vivo!==false&&u.stato==="attivo").length,
      macellati:   us.filter(u=>u.stato==="macellato").length,
      deceduti:    us.filter(u=>u.stato==="deceduto").length,
      venduti:     us.filter(u=>u.stato==="venduto").length,
      riproduttori:us.filter(u=>u.destinazione==="riproduzione").length,
      maschi:      us.filter(u=>u.sesso==="M").length,
      femmine:     us.filter(u=>u.sesso==="F").length,
      note:        l.note||"",
    };
  });
  return creaFoglio(dati, [
    {key:"codice",      label:"Codice lotto"},
    {key:"data_parto",  label:"Data parto"},
    {key:"madre_bdn",   label:"BDN Madre"},
    {key:"madre_nome",  label:"Nome Madre"},
    {key:"razza_madre", label:"Razza Madre"},
    {key:"padre_bdn",   label:"BDN Padre"},
    {key:"razza_padre", label:"Razza Padre"},
    {key:"nati_totali", label:"Nati totali"},
    {key:"nati_vivi",   label:"Nati vivi"},
    {key:"nati_morti",  label:"Nati morti"},
    {key:"vivi_attuali",label:"Vivi attuali"},
    {key:"macellati",   label:"Macellati"},
    {key:"deceduti",    label:"Deceduti"},
    {key:"venduti",     label:"Venduti"},
    {key:"riproduttori",label:"Riproduttori"},
    {key:"maschi",      label:"Maschi"},
    {key:"femmine",     label:"Femmine"},
    {key:"note",        label:"Note"},
  ]);
}

function foglio_lotti_unita(suiniLotto, lotti) {
  const dati = suiniLotto.map(u => {
    const l = lotti.find(x=>x.id===u.lotto_id);
    const cod = u.codice_completo || `${l?.codice_lotto||l?.codice||""}${String(u.nr).padStart(2,"0")}`;
    return {
      tatuaggio:       cod,
      codice_lotto:    l?.codice_lotto||l?.codice||"",
      nr:              u.nr,
      sesso:           u.sesso||"",
      destinazione:    u.destinazione||"ingrasso",
      stato:           u.stato||"",
      matricola:       u.matricola||u.bdn||"",
      peso_nascita:    u.peso_nascita||"",
      data_uscita:     u.data_uscita||"",
      motivo_uscita:   u.motivo_uscita||"",
      peso_vivo_uscita:u.peso_vivo_uscita||"",
      peso_carcassa:   u.peso_carcassa||"",
      resa_percent:    u.resa_percent||"",
    };
  });
  return creaFoglio(dati, [
    {key:"tatuaggio",       label:"Tatuaggio (cod. lotto + nr.)"},
    {key:"codice_lotto",    label:"Codice lotto"},
    {key:"nr",              label:"Nr. unità"},
    {key:"sesso",           label:"Sesso"},
    {key:"destinazione",    label:"Destinazione"},
    {key:"stato",           label:"Stato"},
    {key:"matricola",       label:"Matricola individuale"},
    {key:"peso_nascita",    label:"Peso nascita (kg)"},
    {key:"data_uscita",     label:"Data uscita"},
    {key:"motivo_uscita",   label:"Motivo uscita"},
    {key:"peso_vivo_uscita",label:"Peso vivo uscita (kg)"},
    {key:"peso_carcassa",   label:"Peso carcassa (kg)"},
    {key:"resa_percent",    label:"Resa %"},
  ]);
}

function foglio_kpi(animali, eventiRiprod) {
  const daysBetween = (d1,d2) => Math.round((new Date(d2)-new Date(d1))/86400000);
  const fattrici = animali.filter(a=>a.sesso==="F");
  const dati = fattrici.map(a => {
    const mieiParti = eventiRiprod
      .filter(e=>e.animale_id===a.id&&e.tipo_evento==="parto")
      .sort((x,y)=>x.data_evento?.localeCompare(y.data_evento));
    if(mieiParti.length===0) return null;
    const iipVals = [];
    for(let i=1;i<mieiParti.length;i++) {
      if(mieiParti[i-1].data_evento&&mieiParti[i].data_evento)
        iipVals.push(daysBetween(mieiParti[i-1].data_evento,mieiParti[i].data_evento));
    }
    const totVivi  = mieiParti.reduce((s,p)=>s+(p.nati_vivi||0),0);
    const totMorti = mieiParti.reduce((s,p)=>s+(p.nati_morti||0),0);
    const totNati  = totVivi+totMorti;
    return {
      bdn:          a.bdn||"",
      nome:         a.nome||"",
      specie:       a.specie||"",
      razza:        a.razza_calcolata||a.razza||"",
      n_parti:      mieiParti.length,
      nati_vivi:    totVivi,
      nati_morti:   totMorti,
      pct_vivi:     totNati>0?Math.round(totVivi/totNati*1000)/10:"",
      prolificita:  mieiParti.length>0?Math.round(totVivi/mieiParti.length*10)/10:"",
      iip_medio_gg: iipVals.length>0?Math.round(iipVals.reduce((a,b)=>a+b,0)/iipVals.length):"",
      iip_medio_mesi:iipVals.length>0?Math.round(iipVals.reduce((a,b)=>a+b,0)/iipVals.length/30.4*10)/10:"",
      primo_parto:  mieiParti[0]?.data_evento||"",
      ultimo_parto: mieiParti[mieiParti.length-1]?.data_evento||"",
    };
  }).filter(Boolean);
  return creaFoglio(dati, [
    {key:"bdn",             label:"BDN"},
    {key:"nome",            label:"Nome"},
    {key:"specie",          label:"Specie"},
    {key:"razza",           label:"Razza"},
    {key:"n_parti",         label:"N. parti"},
    {key:"nati_vivi",       label:"Tot. nati vivi"},
    {key:"nati_morti",      label:"Tot. nati morti"},
    {key:"pct_vivi",        label:"% nati vivi"},
    {key:"prolificita",     label:"Prolificità media (vivi/parto)"},
    {key:"iip_medio_gg",    label:"IIP medio (giorni)"},
    {key:"iip_medio_mesi",  label:"IIP medio (mesi)"},
    {key:"primo_parto",     label:"Primo parto"},
    {key:"ultimo_parto",    label:"Ultimo parto"},
  ]);
}

function foglio_costi_animale(costi, animali) {
  const dati = costi.map(c => {
    const a = animali.find(x=>x.id===c.animale_id);
    return { ...c, animale: a?.nome||a?.bdn||"", specie: a?.specie||"", bdn: a?.bdn||"" };
  });
  return creaFoglio(dati, [
    {key:"data",        label:"Data"},
    {key:"specie",      label:"Specie"},
    {key:"animale",     label:"Animale"},
    {key:"bdn",         label:"BDN"},
    {key:"voce",        label:"Voce"},
    {key:"importo",     label:"Importo (€)"},
    {key:"descrizione", label:"Descrizione"},
  ]);
}

function foglio_costi_generali(costi) {
  return creaFoglio(costi, [
    {key:"voce",        label:"Voce"},
    {key:"importo",     label:"Importo (€)"},
    {key:"specie",      label:"Specie"},
    {key:"data_inizio", label:"Dal"},
    {key:"data_fine",   label:"Al"},
    {key:"descrizione", label:"Descrizione"},
    {key:"fornitore",   label:"Fornitore"},
  ]);
}

function foglio_macchinari(macchinari) {
  const anno = new Date().getFullYear();
  const dati = macchinari.map(m => {
    const quotaAnnua = m.costo_storico&&m.anni_ammortamento ? m.costo_storico/m.anni_ammortamento : 0;
    const anniTrasc  = anno - (m.anno_acquisto||anno);
    const ammTot     = Math.min(m.costo_storico||0, quotaAnnua*anniTrasc);
    const residuo    = Math.max(0, (m.costo_storico||0)-ammTot);
    return { ...m, quota_annua: Math.round(quotaAnnua), ammortizzato: Math.round(ammTot), valore_residuo: Math.round(residuo) };
  });
  return creaFoglio(dati, [
    {key:"nome",              label:"Macchinario"},
    {key:"categoria",         label:"Categoria"},
    {key:"costo_storico",     label:"Costo storico (€)"},
    {key:"anno_acquisto",     label:"Anno acquisto"},
    {key:"anni_ammortamento", label:"Anni ammortamento"},
    {key:"quota_annua",       label:"Quota annua (€)"},
    {key:"ammortizzato",      label:"Tot. ammortizzato (€)"},
    {key:"valore_residuo",    label:"Valore residuo (€)"},
    {key:"note",              label:"Note"},
  ]);
}

// ─── STILI EXCEL ─────────────────────────────────────────────────────────────
const STYLE = {
  // Palette Podere Verde
  primary: "5C3D1E",       // marrone scuro
  primaryLight: "A0522D",  // marrone chiaro
  bg: "F5F0E8",            // beige sfondo
  bovini: "F5EDD8",        // beige bovini
  ovini:  "E4F0DC",        // verde chiaro ovini
  suini:  "F5DDE6",        // rosa chiaro suini
  totale: "5C3D1E",        // marrone totale
  totaleTxt: "FFFFFF",
  zebra: "FAF7F1",         // riga zebrata
};

// Stili predefiniti
const S_HEADER = {
  fill:{fgColor:{rgb:STYLE.primary}},
  font:{color:{rgb:"FFFFFF"},bold:true,sz:11,name:"Segoe UI"},
  alignment:{horizontal:"center",vertical:"center",wrapText:true},
  border:{top:{style:"thin",color:{rgb:"888888"}},bottom:{style:"thin",color:{rgb:"888888"}},
    left:{style:"thin",color:{rgb:"888888"}},right:{style:"thin",color:{rgb:"888888"}}},
};
const S_TOTALE = {
  fill:{fgColor:{rgb:STYLE.totale}},
  font:{color:{rgb:STYLE.totaleTxt},bold:true,sz:11,name:"Segoe UI"},
  alignment:{horizontal:"center",vertical:"center"},
  border:{top:{style:"medium",color:{rgb:"000000"}},bottom:{style:"medium",color:{rgb:"000000"}},
    left:{style:"thin",color:{rgb:"888888"}},right:{style:"thin",color:{rgb:"888888"}}},
};
const bordo = {top:{style:"thin",color:{rgb:"DDDDDD"}},bottom:{style:"thin",color:{rgb:"DDDDDD"}},
  left:{style:"thin",color:{rgb:"DDDDDD"}},right:{style:"thin",color:{rgb:"DDDDDD"}}};

function styleCella(v, opts={}) {
  const {isTotale, colBg, num, center, bold} = opts;
  if (isTotale) return {v, s:{...S_TOTALE, numFmt: num?"#,##0.000":undefined}};
  const font = {sz:10, name:"Segoe UI", bold:bold||false};
  const fill = colBg ? {fgColor:{rgb:colBg}} : undefined;
  const alignment = center ? {horizontal:"center",vertical:"center"}
                     : num ? {horizontal:"right",vertical:"center"}
                     : {horizontal:"left",vertical:"center"};
  const s = {font,alignment,border:bordo};
  if (fill) s.fill = fill;
  if (num) s.numFmt = "#,##0.000";
  return {v:v??"",s};
}

// Sheet formattato con colori per specie e riga TOTALE evidenziata
function creaSheetFormattato(righe, colonne) {
  const ws = {};
  const range = {s:{c:0,r:0},e:{c:colonne.length-1,r:righe.length}};

  // Intestazione
  colonne.forEach((col,ci)=>{
    const addr = XLSX.utils.encode_cell({c:ci,r:0});
    ws[addr] = {v:col.label, s:S_HEADER};
  });

  // Righe dati
  righe.forEach((riga,ri)=>{
    const isTotale = (riga.BDN||"").toString().toUpperCase().startsWith("TOTALE");
    const specie = (riga.Specie||"").toLowerCase();
    let rowBg = ri%2===1 ? STYLE.zebra : undefined;
    // Colore per specie (solo se non totale)
    if (!isTotale) {
      if (specie==="bovino") rowBg = ri%2===1 ? STYLE.bovini : STYLE.bovini;
      else if (specie==="ovino") rowBg = ri%2===1 ? STYLE.ovini : STYLE.ovini;
      else if (specie==="suino") rowBg = ri%2===1 ? STYLE.suini : STYLE.suini;
    }
    colonne.forEach((col,ci)=>{
      const addr = XLSX.utils.encode_cell({c:ci,r:ri+1});
      const val = riga[col.key];
      const isNum = col.num;
      const bold = isTotale || col.bold;
      ws[addr] = styleCella(val, {isTotale, colBg:rowBg, num:isNum, center:col.center, bold});
    });
  });

  ws["!ref"] = XLSX.utils.encode_range(range);
  // Freeze prima riga (intestazione)
  ws["!freeze"] = {xSplit:0, ySplit:1};
  // Larghezza colonne
  ws["!cols"] = colonne.map(c=>({wch:c.width||14}));
  // Altezza righe (intestazione più alta)
  ws["!rows"] = [{hpx:32}];
  return ws;
}

// ─── CALCOLO UBA PER EXPORT ──────────────────────────────────────────────────
const UBA_FASCE_EXP = {
  bovino:[{fino:210,coeff:0.40,label:"Vitella (<7 mesi)"},{fino:730,coeff:0.70,label:"Vitellone (7m-2a)"},{fino:Infinity,coeff:1.00,label:"Bovino adulto (≥2a)"}],
  suino: [{fino:90,coeff:0.027,label:"Lattonzolo (<3 mesi)"},{fino:365,coeff:0.30,label:"Magrone (3m-1a)"},{fino:Infinity,coeff:0.50,label:"Suino adulto (≥1a)"}],
  ovino: [{fino:120,coeff:0.027,label:"Agnello (<4 mesi)"},{fino:365,coeff:0.10,label:"Agnellone (4m-1a)"},{fino:Infinity,coeff:0.15,label:"Ovino adulto (≥1a)"}],
};

function calcUBA(dataNascita, dataFine, specie) {
  if(!dataNascita||!specie||!UBA_FASCE_EXP[specie]) return null;
  const nascita=new Date(dataNascita);
  const fine=new Date(dataFine);
  const annoRif=fine.getFullYear();
  const inizioAnno=new Date(annoRif,0,1);
  const inizio=nascita>=inizioAnno?nascita:inizioAnno;
  if(inizio>=fine) return null;
  const totGiorni=Math.round((fine-inizio)/86400000);
  const etaAllInizio=Math.round((inizio-nascita)/86400000);
  const fasce=UBA_FASCE_EXP[specie];
  let ubaPesata=0;
  for(let i=0;i<fasce.length;i++){
    const prevSoglia=i>0?fasce[i-1].fino:0;
    const{fino,coeff}=fasce[i];
    const inizioFascia=Math.max(prevSoglia,etaAllInizio);
    const fineFascia=Math.min(fino===Infinity?etaAllInizio+totGiorni+1:fino,etaAllInizio+totGiorni);
    if(fineFascia>inizioFascia) ubaPesata+=(fineFascia-inizioFascia)*coeff;
  }
  return Math.round(ubaPesata/totGiorni*1000)/1000;
}

function categoriaUBA(dataNascita, dataRif, specie) {
  if(!dataNascita||!UBA_FASCE_EXP[specie]) return "—";
  const eta=Math.round((new Date(dataRif)-new Date(dataNascita))/86400000);
  for(const{fino,label} of UBA_FASCE_EXP[specie]) if(eta<fino) return label;
  return UBA_FASCE_EXP[specie].at(-1).label;
}

// Colonne UBA con metadati per formattazione
const COL_UBA = [
  {key:"BDN",                    label:"BDN",                       width:20, bold:true},
  {key:"NUMERO CAPI",            label:"NUMERO CAPI",               width:12, center:true, num:true},
  {key:"Nome",                   label:"Nome",                      width:16},
  {key:"Specie",                 label:"Specie",                    width:10, center:true},
  {key:"Categoria alla data",    label:"Categoria alla data",       width:22},
  {key:"Data nascita",           label:"Data nascita",              width:12, center:true},
  {key:"Inizio calcolo",         label:"Inizio calcolo",            width:12, center:true},
  {key:"Data riferimento",       label:"Data riferimento",          width:12, center:true},
  {key:"Giorni nel periodo",     label:"Giorni",                    width:8,  center:true, num:true},
  {key:"UBA medio",              label:"UBA medio",                 width:11, num:true},
  {key:"UBA-giorni",             label:"UBA-giorni",                width:12, num:true, bold:true},
  {key:"Stato",                  label:"Stato",                     width:9,  center:true},
  {key:"Qualifica riproduzione", label:"Qualifica riproduzione",    width:18},
  {key:"Data uscita",            label:"Data uscita",               width:12, center:true},
  {key:"Motivo uscita",          label:"Motivo uscita",             width:16},
  {key:"Lotto",                  label:"Lotto",                     width:10, center:true},
];

const COL_RIEP = [
  {key:"Specie",              label:"Specie",             width:22, bold:true},
  {key:"Categoria",           label:"Categoria",          width:24},
  {key:"N° Capi",             label:"N° Capi",            width:10, center:true, num:true},
  {key:"UBA medio unitario",  label:"UBA medio unitario", width:16, num:true},
  {key:"UBA totale",          label:"UBA totale",         width:14, num:true},
  {key:"UBA-giorni totali",   label:"UBA-giorni totali",  width:16, num:true, bold:true},
];

function fogli_uba(animali, lotti, suiniLotto) {
  const oggi = today();
  const anno = new Date().getFullYear();
  const inizioAnno = `${anno}-01-01`;

  // Costruisco righe
  const righe = [];
  for(const a of animali){
    if(!a.specie||!UBA_FASCE_EXP[a.specie]) continue;
    const nascita=a.nascita||a.data_ingresso;
    if(!nascita) continue;
    const attivo=a.stato==="attivo";
    const dataFine=attivo?oggi:(a.data_uscita||oggi);
    // Inizio periodo = MAX(nascita, 1° gennaio dell'anno della dataFine)
    const annoRifAnimale = new Date(dataFine).getFullYear();
    const inizioAnnoRif = `${annoRifAnimale}-01-01`;
    const inizio = new Date(nascita)>=new Date(inizioAnnoRif)?nascita:inizioAnnoRif;
    // Se l'animale è uscito prima dell'anno di riferimento, il periodo è invalido
    if(new Date(inizio)>=new Date(dataFine)) continue;
    const uba=calcUBA(nascita,dataFine,a.specie);
    if(!uba) continue;
    const gg=Math.round((new Date(dataFine)-new Date(inizio))/86400000);
    if(gg<=0) continue;
    const ubaGiorni=Math.round(uba*gg*1000)/1000;
    const qualifica=a.riproduttore?(a.sesso==="M"?"Riproduttore":"Riproduttrice"):"";
    righe.push({
      "BDN":a.bdn||"",
      "NUMERO CAPI":"",
      "Nome":a.nome||"",
      "Specie":a.specie,
      "Categoria alla data":categoriaUBA(nascita,dataFine,a.specie),
      "Data nascita":nascita,
      "Inizio calcolo":inizio,
      "Data riferimento":dataFine,
      "Giorni nel periodo":gg,
      "UBA medio":uba,
      "UBA-giorni":ubaGiorni,
      "Stato":a.stato==="attivo"?"Attivo":"Uscito",
      "Qualifica riproduzione":qualifica,
      "Data uscita":a.data_uscita||"",
      "Motivo uscita":a.motivo_uscita||"",
      "Lotto":"",
    });
  }
  // Suini da lotto
  for(const l of lotti){
    if(!l.data_parto) continue;
    const nascita=l.data_parto;
    const codLotto=l.codice_lotto||l.codice||"";
    for(const u of suiniLotto.filter(x=>x.lotto_id===l.id)){
      if(u.stato==="registrato_individuale") continue;
      const attivo=u.vivo!==false&&u.stato==="attivo";
      const dataFine=attivo?oggi:(u.data_uscita||oggi);
      const annoRifAnimale = new Date(dataFine).getFullYear();
      const inizioAnnoRif = `${annoRifAnimale}-01-01`;
      const inizio = new Date(nascita)>=new Date(inizioAnnoRif)?nascita:inizioAnnoRif;
      if(new Date(inizio)>=new Date(dataFine)) continue;
      const uba=calcUBA(nascita,dataFine,"suino");
      if(!uba) continue;
      const gg=Math.round((new Date(dataFine)-new Date(inizio))/86400000);
      if(gg<=0) continue;
      const ubaGiorni=Math.round(uba*gg*1000)/1000;
      const codice=u.codice_completo||`${codLotto}${String(u.nr).padStart(2,"0")}`;
      righe.push({
        "BDN":codice,
        "NUMERO CAPI":"",
        "Nome":"",
        "Specie":"suino",
        "Categoria alla data":categoriaUBA(nascita,dataFine,"suino"),
        "Data nascita":nascita,
        "Inizio calcolo":inizio,
        "Data riferimento":dataFine,
        "Giorni nel periodo":gg,
        "UBA medio":uba,
        "UBA-giorni":ubaGiorni,
        "Stato":attivo?"Attivo":"Uscito",
        "Qualifica riproduzione":"",
        "Data uscita":u.data_uscita||"",
        "Motivo uscita":u.motivo_uscita||"",
        "Lotto":codLotto,
      });
    }
  }

  // Funzione per creare riga TOTALE
  const rigaTotale = (label, arr) => ({
    "BDN":label,
    "NUMERO CAPI":arr.length,
    "Nome":"",
    "Specie":"",
    "Categoria alla data":"",
    "Data nascita":"",
    "Inizio calcolo":"",
    "Data riferimento":"",
    "Giorni nel periodo":"",
    "UBA medio":"",
    "UBA-giorni":Math.round(arr.reduce((s,r)=>s+r["UBA-giorni"],0)*1000)/1000,
    "Stato":"",
    "Qualifica riproduzione":"",
    "Data uscita":"",
    "Motivo uscita":"",
    "Lotto":"",
  });

  // Foglio riepilogo per specie
  const riepilogo=[];
  ["bovino","suino","ovino"].forEach(sp=>{
    const rSp=righe.filter(r=>r.Specie===sp);
    if(!rSp.length) return;
    const byCategoria={};
    for(const r of rSp){
      const cat=r["Categoria alla data"];
      if(!byCategoria[cat]) byCategoria[cat]={cat,n:0,uba:0,ubaGiorni:0};
      byCategoria[cat].n++;
      byCategoria[cat].uba+=r["UBA medio"];
      byCategoria[cat].ubaGiorni+=r["UBA-giorni"];
    }
    Object.values(byCategoria).forEach(x=>{
      riepilogo.push({
        "Specie":sp,
        "Categoria":x.cat,
        "N° Capi":x.n,
        "UBA medio unitario":Math.round(x.uba/x.n*1000)/1000,
        "UBA totale":Math.round(x.uba*1000)/1000,
        "UBA-giorni totali":Math.round(x.ubaGiorni*1000)/1000,
      });
    });
    riepilogo.push({
      "Specie":sp.toUpperCase()+" TOTALE",
      "Categoria":"",
      "N° Capi":rSp.length,
      "UBA medio unitario":"",
      "UBA totale":Math.round(rSp.reduce((s,r)=>s+r["UBA medio"],0)*1000)/1000,
      "UBA-giorni totali":Math.round(rSp.reduce((s,r)=>s+r["UBA-giorni"],0)*1000)/1000,
    });
  });
  const totUBA=Math.round(righe.reduce((s,r)=>s+r["UBA medio"],0)*1000)/1000;
  const totUBAGiorni=Math.round(righe.reduce((s,r)=>s+r["UBA-giorni"],0)*1000)/1000;
  riepilogo.push({
    "Specie":"TOTALE AZIENDALE",
    "Categoria":"",
    "N° Capi":righe.length,
    "UBA medio unitario":"",
    "UBA totale":totUBA,
    "UBA-giorni totali":totUBAGiorni,
  });

  // Fogli per specie
  const righeBovini = righe.filter(r=>r.Specie==="bovino");
  const righeOvini  = righe.filter(r=>r.Specie==="ovino");
  const righeSuini  = righe.filter(r=>r.Specie==="suino");

  const dettaglioBovini = [...righeBovini, rigaTotale("TOTALE BOVINI", righeBovini)];
  const dettaglioOvini  = [...righeOvini,  rigaTotale("TOTALE OVINI",  righeOvini)];
  const dettaglioSuini  = [...righeSuini,  rigaTotale("TOTALE SUINI E LOTTI", righeSuini)];
  const dettaglioTot    = [...righe,       rigaTotale("TOTALE AZIENDALE", righe)];

  return{
    riepilogo,
    dettaglio:dettaglioTot,
    bovini:dettaglioBovini,
    ovini:dettaglioOvini,
    suini:dettaglioSuini,
  };
}

// ─── CONSANGUINEITÀ ──────────────────────────────────────────────────────────
function analizzaAccoppiamentiRischio(animali) {
  const attivi = animali.filter(a=>a.stato==="attivo"&&a.vivo!==false);
  const maschi   = attivi.filter(a=>a.sesso==="M");
  const femmine  = attivi.filter(a=>a.sesso==="F");
  const rischi = [];

  for(const m of maschi){
    for(const f of femmine){
      if(m.specie!==f.specie) continue;
      let tipo=null;
      if(f.padre_id===m.id) tipo="Padre × Figlia";
      else if(m.madre_id===f.id) tipo="Madre × Figlio";
      else {
        const stessoPadre = m.padre_id&&f.padre_id&&m.padre_id===f.padre_id;
        const stessaMadre = m.madre_id&&f.madre_id&&m.madre_id===f.madre_id;
        if(stessoPadre&&stessaMadre) tipo="Fratelli pieni";
        else if(stessoPadre) tipo="Fratellastri (stesso padre)";
        else if(stessaMadre) tipo="Fratellastri (stessa madre)";
      }
      if(tipo) rischi.push({m,f,tipo});
    }
  }
  return rischi;
}

function analizzaCapiInconsanguinei(animali) {
  const result = [];
  for(const a of animali){
    if(a.stato!=="attivo"||a.vivo===false) continue;
    if(!a.padre_id||!a.madre_id) continue;
    const padre = animali.find(x=>x.id===a.padre_id);
    const madre = animali.find(x=>x.id===a.madre_id);
    if(!padre||!madre) continue;
    let tipo=null;
    if(madre.padre_id===padre.id) tipo="Padre × Figlia";
    else if(padre.madre_id===madre.id) tipo="Madre × Figlio";
    else {
      const stessoPadre = padre.padre_id&&madre.padre_id&&padre.padre_id===madre.padre_id;
      const stessaMadre = padre.madre_id&&madre.madre_id&&padre.madre_id===madre.madre_id;
      if(stessoPadre&&stessaMadre) tipo="Genitori fratelli pieni";
      else if(stessoPadre||stessaMadre) tipo="Genitori fratellastri";
    }
    if(tipo) result.push({a,padre,madre,tipo});
  }
  return result;
}

function foglio_consang_rischi(animali) {
  const rischi = analizzaAccoppiamentiRischio(animali);
  const righe = rischi.map(r=>({
    "Specie": r.m.specie,
    "Tipo rischio": r.tipo,
    "Maschio BDN": r.m.bdn||"",
    "Maschio Nome": r.m.nome||"",
    "Maschio Razza": r.m.razza_calcolata||r.m.razza||"",
    "Femmina BDN": r.f.bdn||"",
    "Femmina Nome": r.f.nome||"",
    "Femmina Razza": r.f.razza_calcolata||r.f.razza||"",
  }));
  if(righe.length===0) righe.push({"Info":"Nessun accoppiamento a rischio rilevato — bene!"});
  const ws = XLSX.utils.json_to_sheet(righe);
  ws["!cols"] = [{wch:10},{wch:24},{wch:20},{wch:18},{wch:18},{wch:20},{wch:18},{wch:18}];
  return ws;
}

function foglio_consang_capi(animali) {
  const capi = analizzaCapiInconsanguinei(animali);
  const righe = capi.map(x=>({
    "Specie": x.a.specie,
    "BDN": x.a.bdn||"",
    "Nome": x.a.nome||"",
    "Sesso": x.a.sesso,
    "Razza calcolata": x.a.razza_calcolata||x.a.razza||"",
    "Data nascita": x.a.nascita||"",
    "Tipo consanguineità": x.tipo,
    "Padre BDN": x.padre.bdn||"",
    "Padre Nome": x.padre.nome||"",
    "Madre BDN": x.madre.bdn||"",
    "Madre Nome": x.madre.nome||"",
  }));
  if(righe.length===0) righe.push({"Info":"Nessun capo con consanguineità nella genealogia — bene!"});
  const ws = XLSX.utils.json_to_sheet(righe);
  ws["!cols"] = [{wch:10},{wch:20},{wch:18},{wch:8},{wch:18},{wch:12},{wch:26},{wch:20},{wch:18},{wch:20},{wch:18}];
  return ws;
}

// ─── SEZIONI DISPONIBILI ──────────────────────────────────────────────────────
const SEZIONI = [
  { id:"anagrafica_bovini",       label:"Bovini attivi",             icon:"🐄", gruppo:"ANIMALI ATTIVI" },
  { id:"anagrafica_suini",        label:"Suini attivi",              icon:"🐷", gruppo:"ANIMALI ATTIVI" },
  { id:"anagrafica_ovini",        label:"Ovini attivi",              icon:"🐑", gruppo:"ANIMALI ATTIVI" },
  { id:"anagrafica_bovini_usciti",label:"Bovini usciti",             icon:"🐄", gruppo:"ANIMALI USCITI" },
  { id:"anagrafica_suini_usciti", label:"Suini usciti",              icon:"🐷", gruppo:"ANIMALI USCITI" },
  { id:"anagrafica_ovini_usciti", label:"Ovini usciti",              icon:"🐑", gruppo:"ANIMALI USCITI" },
  { id:"uscite",             label:"Registro Uscite",           icon:"📤", gruppo:"MOVIMENTI" },
  { id:"parti",              label:"Registro Parti",            icon:"🐣", gruppo:"MOVIMENTI" },
  { id:"sanitario",          label:"Registro Sanitario",        icon:"💉", gruppo:"REGISTRI" },
  { id:"alimentazione",      label:"Alimentazione",             icon:"🌾", gruppo:"REGISTRI" },
  { id:"lotti_riepilogo",    label:"Lotti Suini — Riepilogo",   icon:"📋", gruppo:"LOTTI SUINI" },
  { id:"lotti_unita",        label:"Lotti Suini — Unità",       icon:"🏷️", gruppo:"LOTTI SUINI" },
  { id:"kpi_selezione",      label:"Selezione Genetica (KPI)",  icon:"🏆", gruppo:"GENETICA" },
  { id:"costi_animale",      label:"Costi per Animale",         icon:"🧾", gruppo:"COSTI" },
  { id:"costi_generali",     label:"Costi Generali",            icon:"📊", gruppo:"COSTI" },
  { id:"macchinari",         label:"Macchinari / Ammortamenti", icon:"🏭", gruppo:"COSTI" },
  { id:"uba_riepilogo",      label:"UBA — Riepilogo per specie",icon:"🐾", gruppo:"UBA" },
  { id:"uba_dettaglio",      label:"UBA — Dettaglio tutti",     icon:"📋", gruppo:"UBA" },
  { id:"uba_bovini",         label:"UBA — Bovini",              icon:"🐄", gruppo:"UBA" },
  { id:"uba_ovini",          label:"UBA — Ovini",               icon:"🐑", gruppo:"UBA" },
  { id:"uba_suini",          label:"UBA — Suini e Lotti",       icon:"🐷", gruppo:"UBA" },
  { id:"consang_rischi",     label:"Accoppiamenti a rischio",   icon:"⚠️", gruppo:"CONSANGUINEITÀ" },
  { id:"consang_capi",       label:"Capi con genealogia consanguinea", icon:"🧬", gruppo:"CONSANGUINEITÀ" },
];

// ─── COMPONENTE PRINCIPALE ────────────────────────────────────────────────────
export default function ExportManager() {
  const [sel,setSel]       = useState(new Set(SEZIONI.map(s=>s.id)));
  const [loading,setLoading] = useState(false);
  const [dataDa,setDataDa] = useState("");
  const [dataA,setDataA]   = useState(today());

  const toggle = id => setSel(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const selAll  = () => setSel(new Set(SEZIONI.map(s=>s.id)));
  const deselAll= () => setSel(new Set());

  const gruppi = [...new Set(SEZIONI.map(s=>s.gruppo))];

  const genera = async () => {
    if(sel.size===0) return;
    setLoading(true);
    try {
      // Carico solo i dati necessari
      const [
        {data:animali},{data:sanitari},{data:alim},{data:evRiprod},
        {data:costiAnim},{data:costiGen},{data:macchinari},
        {data:lotti},{data:suiniLotto}
      ] = await Promise.all([
        supabase.from("animali").select("id,bdn,nome,specie,sesso,nascita,stato,data_uscita,motivo_uscita,data_ingresso,razza,razza_calcolata,categoria,peso_nascita,peso_attuale,provenienza,origine,prezzo_acquisto,lotto_box,destinazione,resa_percent,peso_carcassa,peso_vivo_uscita,note_sanitarie,note,riproduttore,data_registrazione_bdn,padre_id,madre_id").order("specie").order("nome"),
        supabase.from("eventi_sanitari").select("*").order("data",{ascending:false}),
        supabase.from("alimentazione").select("*").order("data",{ascending:false}),
        supabase.from("eventi_riproduttivi").select("*").order("data_evento",{ascending:false}),
        supabase.from("costi_animale").select("*").order("data",{ascending:false}),
        supabase.from("costi_generali").select("*").order("data_inizio",{ascending:false}),
        supabase.from("macchinari").select("*").order("nome"),
        supabase.from("lotti_suini").select("*").order("data_parto",{ascending:false}),
        supabase.from("suini_lotto").select("*").order("lotto_id").order("nr"),
      ]);

      const an = animali||[];
      // Filtra per data se specificata
      const filtraData = (arr, campo) => arr.filter(r => {
        if(dataDa&&r[campo]&&r[campo]<dataDa) return false;
        if(dataA&&r[campo]&&r[campo]>dataA)   return false;
        return true;
      });

      const wb = XLSX.utils.book_new();

      if(sel.has("anagrafica_bovini"))
        XLSX.utils.book_append_sheet(wb, foglio_anagrafica(an.filter(a=>a.specie==="bovino"&&a.stato==="attivo")), "Bovini attivi");
      if(sel.has("anagrafica_suini"))
        XLSX.utils.book_append_sheet(wb, foglio_anagrafica(an.filter(a=>a.specie==="suino"&&a.stato==="attivo")), "Suini attivi");
      if(sel.has("anagrafica_ovini"))
        XLSX.utils.book_append_sheet(wb, foglio_anagrafica(an.filter(a=>a.specie==="ovino"&&a.stato==="attivo")), "Ovini attivi");
      if(sel.has("anagrafica_bovini_usciti"))
        XLSX.utils.book_append_sheet(wb, foglio_anagrafica(an.filter(a=>a.specie==="bovino"&&a.stato!=="attivo")), "Bovini usciti");
      if(sel.has("anagrafica_suini_usciti"))
        XLSX.utils.book_append_sheet(wb, foglio_anagrafica(an.filter(a=>a.specie==="suino"&&a.stato!=="attivo")), "Suini usciti");
      if(sel.has("anagrafica_ovini_usciti"))
        XLSX.utils.book_append_sheet(wb, foglio_anagrafica(an.filter(a=>a.specie==="ovino"&&a.stato!=="attivo")), "Ovini usciti");
      if(sel.has("uscite"))
        XLSX.utils.book_append_sheet(wb, foglio_uscite(an), "Uscite");
      if(sel.has("parti"))
        XLSX.utils.book_append_sheet(wb, foglio_parti(filtraData(evRiprod||[],"data_evento"), an), "Parti");
      if(sel.has("sanitario"))
        XLSX.utils.book_append_sheet(wb, foglio_sanitario(filtraData(sanitari||[],"data"), an, suiniLotto||[], lotti||[]), "Sanitario");
      if(sel.has("alimentazione"))
        XLSX.utils.book_append_sheet(wb, foglio_alimentazione(filtraData(alim||[],"data")), "Alimentazione");
      if(sel.has("lotti_riepilogo"))
        XLSX.utils.book_append_sheet(wb, foglio_lotti_riepilogo(lotti||[], suiniLotto||[], an), "Lotti riepilogo");
      if(sel.has("lotti_unita"))
        XLSX.utils.book_append_sheet(wb, foglio_lotti_unita(suiniLotto||[], lotti||[]), "Lotti unità");
      if(sel.has("kpi_selezione"))
        XLSX.utils.book_append_sheet(wb, foglio_kpi(an, evRiprod||[]), "KPI Selezione genetica");
      if(sel.has("costi_animale"))
        XLSX.utils.book_append_sheet(wb, foglio_costi_animale(filtraData(costiAnim||[],"data"), an), "Costi animali");
      if(sel.has("costi_generali"))
        XLSX.utils.book_append_sheet(wb, foglio_costi_generali(costiGen||[]), "Costi generali");
      if(sel.has("macchinari"))
        XLSX.utils.book_append_sheet(wb, foglio_macchinari(macchinari||[]), "Macchinari");
      if(sel.has("uba_riepilogo")||sel.has("uba_dettaglio")||
         sel.has("uba_bovini")||sel.has("uba_ovini")||sel.has("uba_suini")){
        const ubaData=fogli_uba(an,lotti||[],suiniLotto||[]);
        if(sel.has("uba_riepilogo"))
          XLSX.utils.book_append_sheet(wb,creaSheetFormattato(ubaData.riepilogo,COL_RIEP),"UBA Riepilogo");
        if(sel.has("uba_dettaglio"))
          XLSX.utils.book_append_sheet(wb,creaSheetFormattato(ubaData.dettaglio,COL_UBA),"UBA Dettaglio");
        if(sel.has("uba_bovini"))
          XLSX.utils.book_append_sheet(wb,creaSheetFormattato(ubaData.bovini,COL_UBA),"UBA BOVINI");
        if(sel.has("uba_ovini"))
          XLSX.utils.book_append_sheet(wb,creaSheetFormattato(ubaData.ovini,COL_UBA),"UBA OVINI");
        if(sel.has("uba_suini"))
          XLSX.utils.book_append_sheet(wb,creaSheetFormattato(ubaData.suini,COL_UBA),"UBA SUINI e LOTTI");
      }
      if(sel.has("consang_rischi"))
        XLSX.utils.book_append_sheet(wb, foglio_consang_rischi(an), "Accoppiamenti a rischio");
      if(sel.has("consang_capi"))
        XLSX.utils.book_append_sheet(wb, foglio_consang_capi(an), "Capi consanguinei");

      scarica(wb, `Podere_Verde_Export_${dataDa||"tutto"}_${dataA}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,
      minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:80}}>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,
        borderRadius:"0 0 28px 28px",padding:"24px 20px 20px",marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF"}}>📥 Esporta Dati</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",marginTop:4}}>
          Seleziona le sezioni da includere nel file Excel
        </div>
      </div>

      <div style={{padding:"0 16px"}}>

        {/* Filtro date */}
        <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,
          border:`1px solid ${C.border}`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:10}}>
            📅 FILTRO DATA (opzionale)
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Da:",dataDa,setDataDa],["A:",dataA,setDataA]].map(([lbl,val,set])=>(
              <div key={lbl}>
                <div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:4}}>{lbl}</div>
                <input type="date" value={val} onChange={e=>set(e.target.value)}
                  style={{width:"100%",boxSizing:"border-box",border:`1.5px solid ${C.border}`,
                    borderRadius:10,padding:"8px 10px",fontSize:14,background:"#FAFAF8",
                    color:C.text,outline:"none"}}/>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:C.muted,marginTop:8}}>
            Si applica a: registro sanitario, alimentazione, parti, costi animali
          </div>
        </div>

        {/* Selezione sezioni */}
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <button onClick={selAll}
            style={{background:C.primary,color:"#FFF",border:"none",borderRadius:10,
              padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            ☑ Seleziona tutto
          </button>
          <button onClick={deselAll}
            style={{background:C.card,color:C.muted,border:`1.5px solid ${C.border}`,
              borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            ☐ Deseleziona tutto
          </button>
        </div>

        {gruppi.map(gruppo=>(
          <div key={gruppo} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:C.muted,letterSpacing:1.2,
              textTransform:"uppercase",marginBottom:8}}>{gruppo}</div>
            {SEZIONI.filter(s=>s.gruppo===gruppo).map(s=>(
              <div key={s.id} onClick={()=>toggle(s.id)}
                style={{display:"flex",alignItems:"center",gap:12,
                  background:sel.has(s.id)?C.primary+"10":C.card,
                  border:`1.5px solid ${sel.has(s.id)?C.primary:C.border}`,
                  borderRadius:12,padding:"10px 14px",marginBottom:8,cursor:"pointer"}}>
                <div style={{width:22,height:22,borderRadius:6,flexShrink:0,
                  background:sel.has(s.id)?C.primary:"transparent",
                  border:`2px solid ${sel.has(s.id)?C.primary:C.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {sel.has(s.id)&&<span style={{color:"#FFF",fontSize:14,fontWeight:800}}>✓</span>}
                </div>
                <span style={{fontSize:18}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,
                    color:sel.has(s.id)?C.primary:C.text}}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Pulsante genera */}
        <button onClick={genera} disabled={loading||sel.size===0}
          style={{width:"100%",background:sel.size>0?C.green:"#CCC",color:"#FFF",
            border:"none",borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,
            cursor:sel.size>0?"pointer":"default",marginTop:8,
            boxShadow:sel.size>0?"0 4px 16px rgba(74,124,89,0.35)":"none"}}>
          {loading
            ?"⏳ Generazione in corso..."
            :sel.size===0
              ?"Seleziona almeno una sezione"
              :`📥 Genera Excel (${sel.size} fogli)`}
        </button>
        <div style={{textAlign:"center",fontSize:12,color:C.muted,marginTop:10}}>
          Il file viene scaricato automaticamente sul tuo dispositivo
        </div>
      </div>
    </div>
  );
}
