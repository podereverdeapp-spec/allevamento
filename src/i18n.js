// ============================================================================
// LINGUE DELL'APP — v119
// ----------------------------------------------------------------------------
// Ogni testo visibile passa da t("testo in italiano"). La chiave e' il testo
// italiano stesso: se la lingua scelta e' l'italiano, o se manca la traduzione,
// compare l'italiano. Le traduzioni stanno in src/lingue/en.js (inglese) e
// src/lingue/pa.js (punjabi, scrittura gurmukhi): il telefono scarica solo quella della lingua scelta.
// Valori variabili: t("Salvati {n} animali",{n:5}).
// ATTENZIONE: t() serve solo per quello che si LEGGE. I valori che si salvano
// nel database o si confrontano nel codice restano sempre in italiano.
// La lingua di ogni utente sta in profili.lingua (it / en / pa); prima
// dell'accesso vale quella salvata nel telefono.
// ============================================================================
let DIZ = {};
let LINGUA = "it";

export const LINGUE = [
  { id:"it", nome:"Italiano" },
  { id:"en", nome:"English"  },
  { id:"pa", nome:"ਪੰਜਾਬੀ"   },
];

export function t(testo, valori){
  if (testo === null || testo === undefined || testo === "") return testo;
  let s = (LINGUA !== "it" && DIZ[testo]) || testo;
  if (valori) s = String(s).replace(/\{(\w+)\}/g, (m,k) => (valori[k] !== undefined && valori[k] !== null) ? valori[k] : m);
  return s;
}

export const linguaCorrente = () => LINGUA;

export async function impostaLingua(l){
  const lingua = LINGUE.some(x => x.id === l) ? l : "it";
  if (lingua === "en")      DIZ = (await import("./lingue/en")).default;
  else if (lingua === "pa") DIZ = (await import("./lingue/pa")).default;
  else                      DIZ = {};
  LINGUA = lingua;
  try { localStorage.setItem("lingua", lingua); } catch (e) {}
  try { document.documentElement.lang = lingua; } catch (e) {}
  return lingua;
}

export function linguaSalvata(){
  try { return localStorage.getItem("lingua") || "it"; } catch (e) { return "it"; }
}

// Bandiere disegnate (le bandiere emoji su Windows non si vedono: compaiono
// solo due lettere), cosi' sono uguali su ogni telefono e computer.
export function Bandiera({ id, h=18 }){
  const w = Math.round(h*1.5);
  const st = {display:"block",borderRadius:3,boxShadow:"0 0 0 1px rgba(0,0,0,0.15)"};
  if (id === "it") return (
    <svg width={w} height={h} viewBox="0 0 3 2" style={st}>
      <rect width="1" height="2" x="0" fill="#009246"/><rect width="1" height="2" x="1" fill="#FFF"/><rect width="1" height="2" x="2" fill="#CE2B37"/>
    </svg>);
  if (id === "en") return (
    <svg width={w} height={h} viewBox="0 0 60 40" style={st}>
      <rect width="60" height="40" fill="#012169"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFF" strokeWidth="8"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#FFF" strokeWidth="12"/>
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7"/>
    </svg>);
  if (id === "pa") return (
    <svg width={w} height={h} viewBox="0 0 30 20" style={st}>
      <rect width="30" height="20" fill="#FFF"/><rect width="30" height="6.67" fill="#FF9933"/><rect width="30" height="6.67" y="13.33" fill="#138808"/>
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.6"/><circle cx="15" cy="10" r="0.6" fill="#000080"/>
    </svg>);
  return null;
}

// Pulsantiera per scegliere la lingua (menu utente e pagina di accesso)
export function SceltaLingua({ lingua, onScegli, compatta=false }){
  return (
    <div style={{display:"flex",gap:compatta?6:10,justifyContent:"center",flexWrap:"wrap"}}>
      {LINGUE.map(l => (
        <button key={l.id} onClick={()=>onScegli(l.id)} title={l.nome}
          style={{display:"flex",flexDirection:compatta?"row":"column",alignItems:"center",gap:compatta?6:4,
            border:`2px solid ${lingua===l.id?"#5C3D1E":"#D4C4A8"}`,
            background:lingua===l.id?"#5C3D1E14":"#FFF",color:"#2D1B0E",
            borderRadius:12,padding:compatta?"5px 8px":"8px 12px",fontSize:compatta?12:13,
            fontWeight:lingua===l.id?800:600,cursor:"pointer",minWidth:compatta?0:78}}>
          <Bandiera id={l.id} h={compatta?14:28}/>
          <span>{l.nome}</span>
        </button>
      ))}
    </div>
  );
}
