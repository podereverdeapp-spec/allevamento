// ============================================================================
// 🥣 RAZIONI BOVINI — v141
// ----------------------------------------------------------------------------
// Le stesse tre pagine del programma di Contabilità Industriale (versione 244),
// cartella Alimentaria → Razioni Bovini:
//  1. Razioni di riferimento (RazioniRiferimento.jsx)
//  2. Report fabbisogni (ReportFabbisogniBovini.jsx)
//  3. Costruisci razione (CostruisciRazione.jsx)
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

const PAGINE = [
  { id:"riferimento", icona:"📋", nome:"Razioni di riferimento" },
  { id:"report",      icona:"📊", nome:"Report fabbisogni" },
  { id:"costruisci",  icona:"🥣", nome:"Costruisci razione" },
];

export default function RazioniBovini() {
  const [pagina, setPagina] = useState("riferimento");
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
      {pagina === "riferimento" && <RazioniRiferimento/>}
      {pagina === "report" && <ReportFabbisogniBovini/>}
      {pagina === "costruisci" && <CostruisciRazione/>}
    </div>
  );
}
