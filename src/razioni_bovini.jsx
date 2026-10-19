// ============================================================================
// 🥣 RAZIONI (bovini, suini e ovini) — v142 (v141: razioni bovini)
// ----------------------------------------------------------------------------
// Le stesse pagine del programma di Contabilità Industriale (versione 247),
// cartella Alimentaria; in ogni pagina razioni si sceglie la specie in alto:
//  1. Razioni di riferimento (RazioniRiferimento.jsx)
//  2. Report fabbisogni (ReportFabbisogniBovini.jsx)
//  3. Costruisci razione (CostruisciRazione.jsx)
//  4. Controlla prezzi, in sola lettura (PrezziAlimentaria.jsx, ControllaPrezzi)
//  5. Preventivi ricevuti, che l'app può scrivere (PrezziAlimentaria.jsx, PreventiviRicevuti)
// Calcolo: calcoloRazione.js, identico a quello del programma. Dati: tabelle
// ci_alimenti_nutrizione, ci_fabbisogni_classi, ci_ambienti_allevamento,
// ci_razioni_bovini_riferimento, ci_razioni_salvate e vista ci_v_prezzi_alimenti_anno.
// Le razioni salvate qui si vedono anche nel programma, e viceversa.
// (La pagina unica della v139 è sostituita da queste tre.)
// ============================================================================
import { useState } from "react";
import { t } from "./i18n";
import RazioniRiferimento from "./RazioniRiferimento";
import ReportFabbisogniBovini from "./ReportFabbisogniBovini";
import CostruisciRazione from "./CostruisciRazione";
import { ControllaPrezzi, PreventiviRicevuti } from "./PrezziAlimentaria";

const PAGINE = [
  { id:"riferimento", icona:"📋", nome:"Razioni di riferimento" },
  { id:"report",      icona:"📊", nome:"Report fabbisogni" },
  { id:"costruisci",  icona:"🥣", nome:"Costruisci razione" },
  { id:"prezzi",      icona:"💶", nome:"Prezzi" },
  { id:"preventivi",  icona:"📨", nome:"Preventivi" },
];

export default function RazioniBovini() {
  const [pagina, setPagina] = useState("riferimento");
  // pulsanti dell'avviso «Prezzi non certi»: scheda prezzi e preventivi
  const vai = dove => { setPagina(dove === "controlla-prezzi" ? "prezzi" : "preventivi"); window.scrollTo && window.scrollTo(0, 0); };
  return (
    <div style={{ background:"#F7F5F0", minHeight:"100%" }}>
      <div style={{ display:"flex", gap:6, padding:"12px 12px 0", overflowX:"auto" }}>
        {PAGINE.map(p => (
          <button key={p.id} onClick={() => setPagina(p.id)}
            style={{ flexShrink:0, whiteSpace:"nowrap", border:`1.5px solid ${pagina === p.id ? "#3A5A40" : "#E3DFD4"}`,
              background: pagina === p.id ? "#3A5A40" : "#FFFFFF", color: pagina === p.id ? "#FFFFFF" : "#2B2B26",
              borderRadius:20, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            {p.icona} {t(p.nome)}
          </button>
        ))}
      </div>
      {pagina === "riferimento" && <RazioniRiferimento onNavigate={vai}/>}
      {pagina === "report" && <ReportFabbisogniBovini onNavigate={vai}/>}
      {pagina === "costruisci" && <CostruisciRazione onNavigate={vai}/>}
      {pagina === "prezzi" && <ControllaPrezzi solaLettura onNavigate={vai}/>}
      {pagina === "preventivi" && <PreventiviRicevuti/>}
    </div>
  );
}
