
import { useState, useReducer, useCallback } from "react";

// ─── PALETTE ───────────────────────────────────────────────────────────────
const C = {
  bg: "#F5F0E8",
  card: "#FFFFFF",
  primary: "#5C3D1E",
  accent: "#A0522D",
  green: "#4A7C59",
  red: "#C0392B",
  yellow: "#D4A017",
  blue: "#2C6E9B",
  text: "#2D1B0E",
  muted: "#8B7355",
  border: "#D4C4A8",
  bovini: "#8B6914",
  suini: "#B5547A",
  ovini: "#4A7C59",
};

// ─── ICONE SVG ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    cow: <path d="M12 2C8 2 5 4 4 7L2 8v3l2 1v2h2v-2h8v2h2v-2l2-1V8l-2-1C15 4 16 2 12 2zm-3 4a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2z"/>,
    pig: <path d="M18 8h-1a5 5 0 00-10 0H4a2 2 0 000 4h1v2a2 2 0 002 2h1v2h2v-2h4v2h2v-2h1a2 2 0 002-2v-2h1a2 2 0 000-4zM9 9a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2z"/>,
    sheep: <path d="M12 3C9 3 7 5 7 7c-2 0-3 1-3 3s1 3 3 3v4h10v-4c2 0 3-1 3-3s-1-3-3-3c0-2-2-4-5-4zm-2 5a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z"/>,
    health: <><path d="M12 21.7C5.5 17.5 2 13 2 9a5 5 0 0110 0 5 5 0 0110 0c0 4-3.5 8.5-10 12.7z" fill="none" stroke={color} strokeWidth="2"/><path d="M9 9h6M12 6v6" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    food: <path d="M3 3h18v4H3zm0 6h18v4H3zm0 6h18v4H3z"/>,
    repro: <path d="M12 2a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5zm0 12c-5 0-9 2-9 4v2h18v-2c0-2-4-4-9-4z"/>,
    warehouse: <path d="M2 20h20V8L12 2 2 8v12zm8 0v-6h4v6H10zm-4-8h2v2H6zm10 0h2v2h-2zM6 8h2v2H6zm10 0h2v2h-2zm-5-4a1 1 0 110 2 1 1 0 010-2z"/>,
    chart: <><path d="M3 3v18h18" stroke={color} strokeWidth="2"/><path d="M7 16l4-8 4 6 4-4" stroke={color} strokeWidth="2" fill="none"/></>,
    plus: <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>,
    back: <path d="M19 12H5M12 5l-7 7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round"/>,
    edit: <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="1.8" fill="none"/>,
    trash: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth="2" fill="none"/>,
    check: <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>,
    warning: <><path d="M12 2L2 20h20L12 2z" stroke={color} strokeWidth="2" fill="none"/><path d="M12 9v5M12 16v1" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    tag: <path d="M3 7l.5-4.5L7 2h7l7 9-8 9L3 7zm4-1a1 1 0 110 2 1 1 0 010-2z" stroke={color} strokeWidth="1.5" fill="none"/>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="2" fill="none"/><path d="M8 2v4M16 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {icons[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

// ─── STATO INIZIALE ────────────────────────────────────────────────────────
const initialState = {
  animali: [
    { id: 1, matricola: "BO001", nome: "Bella", specie: "bovino", razza: "Limousine", sesso: "F", nascita: "2021-03-15", peso: 520, stato: "attivo", note: "" },
    { id: 2, matricola: "SU001", nome: "Peppa", specie: "suino", razza: "Large White", sesso: "F", nascita: "2022-07-20", peso: 180, stato: "attivo", note: "" },
    { id: 3, matricola: "OV001", nome: "Lana", specie: "ovino", razza: "Sarda", sesso: "F", nascita: "2022-01-10", peso: 65, stato: "attivo", note: "" },
  ],
  eventi_sanitari: [
    { id: 1, animaleId: 1, tipo: "vaccino", descrizione: "Vaccinazione IBR", data: "2024-11-01", veterinario: "Dr. Rossi", prodotto: "Bovilis IBR", scadenza: "2025-11-01", costo: 25 },
    { id: 2, animaleId: 2, tipo: "visita", descrizione: "Controllo gravidanza", data: "2025-01-15", veterinario: "Dr. Bianchi", prodotto: "", scadenza: "", costo: 60 },
  ],
  alimentazione: [
    { id: 1, data: "2025-06-20", specie: "bovino", tipo: "Fieno", quantita: 50, unita: "kg", costo: 15, note: "Mattina" },
    { id: 2, data: "2025-06-20", specie: "suino", tipo: "Mangime completo", quantita: 30, unita: "kg", costo: 22, note: "" },
  ],
  eventi_riproduttivi: [
    { id: 1, animaleId: 1, tipo: "monta", data: "2025-01-10", partner: "BO-TORO-01", esito: "positivo", partoAtteso: "2025-10-10", note: "" },
  ],
  magazzino: [
    { id: 1, nome: "Fieno", categoria: "mangime", quantita: 800, unita: "kg", minimo: 200, costo: 0.3, fornitore: "Az. Verdi" },
    { id: 2, nome: "Farmaco Antibiotico X", categoria: "farmaco", quantita: 5, unita: "flaconi", minimo: 2, costo: 45, fornitore: "Vet Supply" },
    { id: 3, nome: "Disinfettante", categoria: "igiene", quantita: 10, unita: "litri", minimo: 5, costo: 8, fornitore: "AgroChem" },
  ],
  nextId: { animali: 4, sanitari: 3, alimentazione: 3, riproduttivi: 2, magazzino: 4 },
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ANIMALE":
      return { ...state, animali: [...state.animali, { ...action.payload, id: state.nextId.animali }], nextId: { ...state.nextId, animali: state.nextId.animali + 1 } };
    case "UPDATE_ANIMALE":
      return { ...state, animali: state.animali.map(a => a.id === action.payload.id ? action.payload : a) };
    case "DELETE_ANIMALE":
      return { ...state, animali: state.animali.filter(a => a.id !== action.id) };
    case "ADD_SANITARIO":
      return { ...state, eventi_sanitari: [...state.eventi_sanitari, { ...action.payload, id: state.nextId.sanitari }], nextId: { ...state.nextId, sanitari: state.nextId.sanitari + 1 } };
    case "ADD_ALIMENTAZIONE":
      return { ...state, alimentazione: [...state.alimentazione, { ...action.payload, id: state.nextId.alimentazione }], nextId: { ...state.nextId, alimentazione: state.nextId.alimentazione + 1 } };
    case "ADD_RIPRODUTTIVO":
      return { ...state, eventi_riproduttivi: [...state.eventi_riproduttivi, { ...action.payload, id: state.nextId.riproduttivi }], nextId: { ...state.nextId, riproduttivi: state.nextId.riproduttivi + 1 } };
    case "ADD_MAGAZZINO":
      return { ...state, magazzino: [...state.magazzino, { ...action.payload, id: state.nextId.magazzino }], nextId: { ...state.nextId, magazzino: state.nextId.magazzino + 1 } };
    case "UPDATE_MAGAZZINO":
      return { ...state, magazzino: state.magazzino.map(m => m.id === action.payload.id ? action.payload : m) };
    default:
      return state;
  }
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
const specieColor = s => ({ bovino: C.bovini, suino: C.suini, ovino: C.ovini }[s] || C.muted);
const specieLabel = s => ({ bovino: "Bovino", suino: "Suino", ovino: "Ovino" }[s] || s);
const specieIcon = s => ({ bovino: "cow", suino: "pig", ovino: "sheep" }[s] || "tag");
const today = () => new Date().toISOString().split("T")[0];

// ─── COMPONENTI UI BASE ────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: `1px solid ${C.border}`, ...style }}>
    {children}
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
    {label}
  </span>
);

const Btn = ({ label, icon, onClick, variant = "primary", small = false }) => {
  const bg = variant === "primary" ? C.primary : variant === "danger" ? C.red : variant === "success" ? C.green : "#EEE";
  const fg = variant === "ghost" ? C.text : "#FFF";
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, background: bg, color: fg, border: "none", borderRadius: 10, padding: small ? "6px 12px" : "10px 18px", fontSize: small ? 13 : 15, fontWeight: 600, cursor: "pointer", boxShadow: variant !== "ghost" ? "0 2px 6px rgba(0,0,0,0.15)" : "none" }}>
      {icon && <Icon name={icon} size={small ? 15 : 18} color={fg} />}
      {label}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", options, required }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{label}{required && " *"}</div>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        <option value="">— seleziona —</option>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
    )}
  </div>
);

const inputStyle = { width: "100%", boxSizing: "border-box", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, background: "#FAFAF8", color: C.text, outline: "none" };

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function Dashboard({ state, onNav }) {
  const attivi = state.animali.filter(a => a.stato === "attivo");
  const bovini = attivi.filter(a => a.specie === "bovino").length;
  const suini = attivi.filter(a => a.specie === "suino").length;
  const ovini = attivi.filter(a => a.specie === "ovino").length;

  const oggi = today();
  const scadenzeImminenti = state.eventi_sanitari.filter(e => e.scadenza && e.scadenza >= oggi && e.scadenza <= new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
  const sottoscorta = state.magazzino.filter(m => m.quantita <= m.minimo);
  const partiProssimi = state.eventi_riproduttivi.filter(e => e.partoAtteso && e.partoAtteso >= oggi && e.partoAtteso <= new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0]);

  const StatCard = ({ label, value, icon, color, onClick }) => (
    <div onClick={onClick} style={{ background: color + "15", border: `1.5px solid ${color}33`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Icon name={icon} size={22} color={color} />
        <span style={{ fontSize: 13, color, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, borderRadius: "0 0 28px 28px", padding: "28px 20px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#FFF" }}>🐄 Il Mio Allevamento</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>{oggi} · {attivi.length} animali attivi</div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Capi per specie</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <StatCard label="Bovini" value={bovini} icon="cow" color={C.bovini} onClick={() => onNav("anagrafica", { filtro: "bovino" })} />
          <StatCard label="Suini" value={suini} icon="pig" color={C.suini} onClick={() => onNav("anagrafica", { filtro: "suino" })} />
          <StatCard label="Ovini" value={ovini} icon="sheep" color={C.ovini} onClick={() => onNav("anagrafica", { filtro: "ovino" })} />
        </div>

        {scadenzeImminenti.length > 0 && (
          <Card style={{ borderLeft: `4px solid ${C.yellow}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon name="warning" size={18} color={C.yellow} />
              <span style={{ fontWeight: 700, color: C.yellow }}>Scadenze entro 30 giorni</span>
            </div>
            {scadenzeImminenti.map(e => {
              const a = state.animali.find(x => x.id === e.animaleId);
              return <div key={e.id} style={{ fontSize: 13, color: C.text, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>{a?.nome || "?"} — {e.descrizione} <span style={{ color: C.yellow, fontWeight: 600 }}>entro {e.scadenza}</span></div>;
            })}
          </Card>
        )}

        {sottoscorta.length > 0 && (
          <Card style={{ borderLeft: `4px solid ${C.red}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon name="warning" size={18} color={C.red} />
              <span style={{ fontWeight: 700, color: C.red }}>Scorte sotto il minimo</span>
            </div>
            {sottoscorta.map(m => (
              <div key={m.id} style={{ fontSize: 13, color: C.text, padding: "4px 0" }}>{m.nome}: <span style={{ color: C.red, fontWeight: 700 }}>{m.quantita} {m.unita}</span> (min. {m.minimo})</div>
            ))}
          </Card>
        )}

        {partiProssimi.length > 0 && (
          <Card style={{ borderLeft: `4px solid ${C.green}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon name="repro" size={18} color={C.green} />
              <span style={{ fontWeight: 700, color: C.green }}>Parti attesi entro 60 giorni</span>
            </div>
            {partiProssimi.map(e => {
              const a = state.animali.find(x => x.id === e.animaleId);
              return <div key={e.id} style={{ fontSize: 13, color: C.text, padding: "4px 0" }}>{a?.nome || "?"} — previsto {e.partoAtteso}</div>;
            })}
          </Card>
        )}

        <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, margin: "20px 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Accesso rapido</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Anagrafica", icon: "tag", tab: "anagrafica" },
            { label: "Sanità", icon: "health", tab: "sanitario" },
            { label: "Alimenti", icon: "food", tab: "alimentazione" },
            { label: "Riprod.", icon: "repro", tab: "riproduzione" },
            { label: "Magazzino", icon: "warehouse", tab: "magazzino" },
            { label: "Report", icon: "chart", tab: "report" },
          ].map(item => (
            <div key={item.tab} onClick={() => onNav(item.tab)} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px 10px", textAlign: "center", cursor: "pointer" }}>
              <Icon name={item.icon} size={26} color={C.primary} />
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 6 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ANAGRAFICA ─────────────────────────────────────────────────────────────
function Anagrafica({ state, dispatch }) {
  const [filtroSpecie, setFiltroSpecie] = useState("tutti");
  const [filtroStato, setFiltroStato] = useState("attivo");
  const [form, setForm] = useState(null);

  const animali = state.animali.filter(a =>
    (filtroSpecie === "tutti" || a.specie === filtroSpecie) &&
    (filtroStato === "tutti" || a.stato === filtroStato)
  );

  const emptyForm = { matricola: "", nome: "", specie: "bovino", razza: "", sesso: "F", nascita: "", peso: "", stato: "attivo", note: "" };

  const save = () => {
    if (!form.matricola || !form.specie) return;
    if (form.id) dispatch({ type: "UPDATE_ANIMALE", payload: form });
    else dispatch({ type: "ADD_ANIMALE", payload: form });
    setForm(null);
  };

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Icon name="back" size={24} color={C.primary} /></button>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{form.id ? "Modifica animale" : "Nuovo animale"}</span>
      </div>
      <Input label="Matricola / Codice" value={form.matricola} onChange={v => setForm(f => ({ ...f, matricola: v }))} required />
      <Input label="Nome" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} />
      <Input label="Specie" value={form.specie} onChange={v => setForm(f => ({ ...f, specie: v }))} options={["bovino", "suino", "ovino"]} required />
      <Input label="Razza" value={form.razza} onChange={v => setForm(f => ({ ...f, razza: v }))} />
      <Input label="Sesso" value={form.sesso} onChange={v => setForm(f => ({ ...f, sesso: v }))} options={[{ value: "M", label: "Maschio" }, { value: "F", label: "Femmina" }]} />
      <Input label="Data di nascita" value={form.nascita} onChange={v => setForm(f => ({ ...f, nascita: v }))} type="date" />
      <Input label="Peso (kg)" value={form.peso} onChange={v => setForm(f => ({ ...f, peso: v }))} type="number" />
      <Input label="Stato" value={form.stato} onChange={v => setForm(f => ({ ...f, stato: v }))} options={["attivo", "venduto", "deceduto", "malato"]} />
      <Input label="Note" value={form.note} onChange={v => setForm(f => ({ ...f, note: v }))} />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label="Salva" icon="check" onClick={save} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Anagrafica</span>
        <Btn label="Aggiungi" icon="plus" onClick={() => setForm({ ...emptyForm })} small />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        {["tutti", "bovino", "suino", "ovino"].map(s => (
          <button key={s} onClick={() => setFiltroSpecie(s)} style={{ background: filtroSpecie === s ? C.primary : C.card, color: filtroSpecie === s ? "#FFF" : C.muted, border: `1.5px solid ${filtroSpecie === s ? C.primary : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            {s === "tutti" ? "Tutti" : specieLabel(s)}
          </button>
        ))}
        <button onClick={() => setFiltroStato(filtroStato === "attivo" ? "tutti" : "attivo")} style={{ background: filtroStato === "attivo" ? C.green : C.card, color: filtroStato === "attivo" ? "#FFF" : C.muted, border: `1.5px solid ${filtroStato === "attivo" ? C.green : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
          Solo attivi
        </button>
      </div>

      <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>{animali.length} animali</div>

      {animali.map(a => (
        <Card key={a.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ background: specieColor(a.specie) + "20", borderRadius: 10, padding: 8 }}>
                <Icon name={specieIcon(a.specie)} size={24} color={specieColor(a.specie)} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{a.nome || a.matricola}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{a.matricola} · {a.razza}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Badge label={specieLabel(a.specie)} color={specieColor(a.specie)} />
                  <Badge label={a.sesso === "M" ? "♂ Maschio" : "♀ Femmina"} color={a.sesso === "M" ? C.blue : "#B5547A"} />
                  {a.stato !== "attivo" && <Badge label={a.stato} color={C.red} />}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>{a.peso} <span style={{ fontSize: 12 }}>kg</span></div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button onClick={() => setForm({ ...a })} style={{ background: C.blue + "20", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><Icon name="edit" size={16} color={C.blue} /></button>
                <button onClick={() => dispatch({ type: "DELETE_ANIMALE", id: a.id })} style={{ background: C.red + "20", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><Icon name="trash" size={16} color={C.red} /></button>
              </div>
            </div>
          </div>
          {a.nascita && <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>📅 Nato il {a.nascita}</div>}
          {a.note && <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontStyle: "italic" }}>{a.note}</div>}
        </Card>
      ))}
    </div>
  );
}

// ─── SANITARIO ──────────────────────────────────────────────────────────────
function Sanitario({ state, dispatch }) {
  const [form, setForm] = useState(null);
  const emptyForm = { animaleId: "", tipo: "vaccino", descrizione: "", data: today(), veterinario: "", prodotto: "", scadenza: "", costo: "" };

  const save = () => {
    if (!form.animaleId || !form.descrizione) return;
    dispatch({ type: "ADD_SANITARIO", payload: { ...form, animaleId: parseInt(form.animaleId), costo: parseFloat(form.costo) || 0 } });
    setForm(null);
  };

  const animaliOptions = state.animali.filter(a => a.stato === "attivo").map(a => ({ value: a.id, label: `${a.nome || a.matricola} (${specieLabel(a.specie)})` }));

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="back" size={24} color={C.primary} /></button>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Nuovo evento sanitario</span>
      </div>
      <Input label="Animale" value={form.animaleId} onChange={v => setForm(f => ({ ...f, animaleId: v }))} options={animaliOptions} required />
      <Input label="Tipo" value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))} options={["vaccino", "farmaco", "visita", "intervento", "altro"]} />
      <Input label="Descrizione" value={form.descrizione} onChange={v => setForm(f => ({ ...f, descrizione: v }))} required />
      <Input label="Data" value={form.data} onChange={v => setForm(f => ({ ...f, data: v }))} type="date" />
      <Input label="Veterinario" value={form.veterinario} onChange={v => setForm(f => ({ ...f, veterinario: v }))} />
      <Input label="Prodotto / Farmaco" value={form.prodotto} onChange={v => setForm(f => ({ ...f, prodotto: v }))} />
      <Input label="Data scadenza richiamo" value={form.scadenza} onChange={v => setForm(f => ({ ...f, scadenza: v }))} type="date" />
      <Input label="Costo (€)" value={form.costo} onChange={v => setForm(f => ({ ...f, costo: v }))} type="number" />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label="Salva" icon="check" onClick={save} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  const tipoColor = { vaccino: C.green, farmaco: C.blue, visita: C.yellow, intervento: C.red, altro: C.muted };

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Registro Sanitario</span>
        <Btn label="Aggiungi" icon="plus" onClick={() => setForm({ ...emptyForm })} small />
      </div>
      {[...state.eventi_sanitari].sort((a, b) => b.data.localeCompare(a.data)).map(e => {
        const a = state.animali.find(x => x.id === e.animaleId);
        const col = tipoColor[e.tipo] || C.muted;
        return (
          <Card key={e.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <Badge label={e.tipo.toUpperCase()} color={col} />
                  {a && <span style={{ fontSize: 13, color: specieColor(a.specie), fontWeight: 600 }}>{a.nome || a.matricola}</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{e.descrizione}</div>
                {e.prodotto && <div style={{ fontSize: 13, color: C.muted }}>💊 {e.prodotto}</div>}
                {e.veterinario && <div style={{ fontSize: 13, color: C.muted }}>👨‍⚕️ {e.veterinario}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: C.muted }}>{e.data}</div>
                {e.costo > 0 && <div style={{ fontWeight: 700, color: C.accent, marginTop: 4 }}>€{e.costo}</div>}
                {e.scadenza && <div style={{ fontSize: 12, background: C.yellow + "22", color: C.yellow, borderRadius: 8, padding: "2px 8px", marginTop: 4 }}>⏰ {e.scadenza}</div>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── ALIMENTAZIONE ──────────────────────────────────────────────────────────
function Alimentazione({ state, dispatch }) {
  const [form, setForm] = useState(null);
  const emptyForm = { data: today(), specie: "bovino", tipo: "", quantita: "", unita: "kg", costo: "", note: "" };

  const save = () => {
    if (!form.tipo || !form.quantita) return;
    dispatch({ type: "ADD_ALIMENTAZIONE", payload: { ...form, quantita: parseFloat(form.quantita), costo: parseFloat(form.costo) || 0 } });
    setForm(null);
  };

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="back" size={24} color={C.primary} /></button>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Nuova somministrazione</span>
      </div>
      <Input label="Data" value={form.data} onChange={v => setForm(f => ({ ...f, data: v }))} type="date" />
      <Input label="Specie" value={form.specie} onChange={v => setForm(f => ({ ...f, specie: v }))} options={["bovino", "suino", "ovino", "tutti"]} required />
      <Input label="Tipo mangime / foraggio" value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))} required />
      <Input label="Quantità" value={form.quantita} onChange={v => setForm(f => ({ ...f, quantita: v }))} type="number" required />
      <Input label="Unità" value={form.unita} onChange={v => setForm(f => ({ ...f, unita: v }))} options={["kg", "litri", "balle", "sacchi"]} />
      <Input label="Costo (€)" value={form.costo} onChange={v => setForm(f => ({ ...f, costo: v }))} type="number" />
      <Input label="Note" value={form.note} onChange={v => setForm(f => ({ ...f, note: v }))} />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label="Salva" icon="check" onClick={save} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  const costoTotale = state.alimentazione.reduce((s, e) => s + (e.costo || 0), 0);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Alimentazione</span>
        <Btn label="Aggiungi" icon="plus" onClick={() => setForm({ ...emptyForm })} small />
      </div>
      <Card style={{ background: `linear-gradient(135deg, ${C.primary}15, ${C.accent}10)` }}>
        <div style={{ fontSize: 13, color: C.muted }}>Costo totale registrato</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.primary }}>€{costoTotale.toFixed(2)}</div>
      </Card>
      {[...state.alimentazione].sort((a, b) => b.data.localeCompare(a.data)).map(e => (
        <Card key={e.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <Icon name={specieIcon(e.specie)} size={18} color={specieColor(e.specie)} />
                <span style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{e.tipo}</span>
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>{e.data} · {e.specie}</div>
              {e.note && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>{e.note}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{e.quantita} {e.unita}</div>
              {e.costo > 0 && <div style={{ color: C.accent, fontWeight: 600, fontSize: 14 }}>€{e.costo}</div>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── RIPRODUZIONE ───────────────────────────────────────────────────────────
function Riproduzione({ state, dispatch }) {
  const [form, setForm] = useState(null);
  const emptyForm = { animaleId: "", tipo: "monta", data: today(), partner: "", esito: "in attesa", partoAtteso: "", note: "" };

  const save = () => {
    if (!form.animaleId) return;
    dispatch({ type: "ADD_RIPRODUTTIVO", payload: { ...form, animaleId: parseInt(form.animaleId) } });
    setForm(null);
  };

  const femmine = state.animali.filter(a => a.stato === "attivo" && a.sesso === "F").map(a => ({ value: a.id, label: `${a.nome || a.matricola} (${specieLabel(a.specie)})` }));

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="back" size={24} color={C.primary} /></button>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Nuovo evento riproduttivo</span>
      </div>
      <Input label="Femmina" value={form.animaleId} onChange={v => setForm(f => ({ ...f, animaleId: v }))} options={femmine} required />
      <Input label="Tipo evento" value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))} options={["monta", "inseminazione artificiale", "parto", "aborto", "svezzamento"]} />
      <Input label="Data" value={form.data} onChange={v => setForm(f => ({ ...f, data: v }))} type="date" />
      <Input label="Partner / Toro / Verro" value={form.partner} onChange={v => setForm(f => ({ ...f, partner: v }))} />
      <Input label="Esito" value={form.esito} onChange={v => setForm(f => ({ ...f, esito: v }))} options={["in attesa", "positivo", "negativo", "da confermare"]} />
      <Input label="Parto atteso" value={form.partoAtteso} onChange={v => setForm(f => ({ ...f, partoAtteso: v }))} type="date" />
      <Input label="Note" value={form.note} onChange={v => setForm(f => ({ ...f, note: v }))} />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label="Salva" icon="check" onClick={save} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  const esitoColor = { positivo: C.green, negativo: C.red, "in attesa": C.yellow, "da confermare": C.blue };

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Riproduzione</span>
        <Btn label="Aggiungi" icon="plus" onClick={() => setForm({ ...emptyForm })} small />
      </div>
      {[...state.eventi_riproduttivi].sort((a, b) => b.data.localeCompare(a.data)).map(e => {
        const a = state.animali.find(x => x.id === e.animaleId);
        const col = esitoColor[e.esito] || C.muted;
        return (
          <Card key={e.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <Badge label={e.tipo.toUpperCase()} color={C.primary} />
                  <Badge label={e.esito} color={col} />
                </div>
                {a && <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{a.nome || a.matricola}</div>}
                {e.partner && <div style={{ fontSize: 13, color: C.muted }}>♂ {e.partner}</div>}
                {e.note && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 4 }}>{e.note}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: C.muted }}>{e.data}</div>
                {e.partoAtteso && <div style={{ fontSize: 12, background: C.green + "22", color: C.green, borderRadius: 8, padding: "2px 8px", marginTop: 4 }}>🍼 {e.partoAtteso}</div>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── MAGAZZINO ──────────────────────────────────────────────────────────────
function Magazzino({ state, dispatch }) {
  const [form, setForm] = useState(null);
  const emptyForm = { nome: "", categoria: "mangime", quantita: "", unita: "kg", minimo: "", costo: "", fornitore: "" };

  const save = () => {
    if (!form.nome) return;
    const payload = { ...form, quantita: parseFloat(form.quantita) || 0, minimo: parseFloat(form.minimo) || 0, costo: parseFloat(form.costo) || 0 };
    if (form.id) dispatch({ type: "UPDATE_MAGAZZINO", payload });
    else dispatch({ type: "ADD_MAGAZZINO", payload });
    setForm(null);
  };

  const aggiornaQta = (item, delta) => {
    dispatch({ type: "UPDATE_MAGAZZINO", payload: { ...item, quantita: Math.max(0, item.quantita + delta) } });
  };

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="back" size={24} color={C.primary} /></button>
        <span style={{ fontSize: 18, fontWeight: 700 }}>{form.id ? "Modifica scorta" : "Nuova scorta"}</span>
      </div>
      <Input label="Nome prodotto" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} required />
      <Input label="Categoria" value={form.categoria} onChange={v => setForm(f => ({ ...f, categoria: v }))} options={["mangime", "farmaco", "igiene", "attrezzatura", "altro"]} />
      <Input label="Quantità attuale" value={form.quantita} onChange={v => setForm(f => ({ ...f, quantita: v }))} type="number" />
      <Input label="Unità" value={form.unita} onChange={v => setForm(f => ({ ...f, unita: v }))} options={["kg", "litri", "sacchi", "balle", "flaconi", "pezzi"]} />
      <Input label="Scorta minima" value={form.minimo} onChange={v => setForm(f => ({ ...f, minimo: v }))} type="number" />
      <Input label="Costo unitario (€)" value={form.costo} onChange={v => setForm(f => ({ ...f, costo: v }))} type="number" />
      <Input label="Fornitore" value={form.fornitore} onChange={v => setForm(f => ({ ...f, fornitore: v }))} />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label="Salva" icon="check" onClick={save} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  const catColor = { mangime: C.bovini, farmaco: C.red, igiene: C.blue, attrezzatura: C.muted, altro: C.muted };

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Magazzino</span>
        <Btn label="Aggiungi" icon="plus" onClick={() => setForm({ ...emptyForm })} small />
      </div>

      {state.magazzino.map(m => {
        const alert = m.quantita <= m.minimo;
        const col = catColor[m.categoria] || C.muted;
        return (
          <Card key={m.id} style={{ borderLeft: alert ? `4px solid ${C.red}` : `4px solid ${col}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{m.nome}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Badge label={m.categoria} color={col} />
                  {alert && <Badge label="⚠ SCORTA BASSA" color={C.red} />}
                </div>
                {m.fornitore && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>📦 {m.fornitore}</div>}
              </div>
              <button onClick={() => setForm({ ...m })} style={{ background: C.blue + "20", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><Icon name="edit" size={16} color={C.blue} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => aggiornaQta(m, -1)} style={{ background: C.red + "20", border: "none", borderRadius: 8, width: 34, height: 34, fontSize: 20, cursor: "pointer", color: C.red, fontWeight: 700 }}>−</button>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: alert ? C.red : C.text }}>{m.quantita}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{m.unita} · min {m.minimo}</div>
              </div>
              <button onClick={() => aggiornaQta(m, 1)} style={{ background: C.green + "20", border: "none", borderRadius: 8, width: 34, height: 34, fontSize: 20, cursor: "pointer", color: C.green, fontWeight: 700 }}>+</button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── REPORT ─────────────────────────────────────────────────────────────────
function Report({ state }) {
  const attivi = state.animali.filter(a => a.stato === "attivo");
  const perSpecie = ["bovino", "suini", "ovino"].map(s => ({ specie: s, count: attivi.filter(a => a.specie === s).length }));
  const costoSanitario = state.eventi_sanitari.reduce((s, e) => s + (e.costo || 0), 0);
  const costoAlimentare = state.alimentazione.reduce((s, e) => s + (e.costo || 0), 0);
  const costoTotale = costoSanitario + costoAlimentare;

  const BarChart = ({ data, max, color }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map(d => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
            <span style={{ color: C.text, fontWeight: 600 }}>{d.label}</span>
            <span style={{ color: C.muted }}>{d.value}</span>
          </div>
          <div style={{ background: C.border, borderRadius: 6, height: 10, overflow: "hidden" }}>
            <div style={{ background: color, width: `${max ? (d.value / max * 100) : 0}%`, height: "100%", borderRadius: 6, transition: "width 0.5s" }} />
          </div>
        </div>
      ))}
    </div>
  );

  const bovini = state.animali.filter(a => a.specie === "bovino" && a.stato === "attivo").length;
  const suini = state.animali.filter(a => a.specie === "suino" && a.stato === "attivo").length;
  const ovini = state.animali.filter(a => a.specie === "ovino" && a.stato === "attivo").length;
  const maxCapi = Math.max(bovini, suini, ovini, 1);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <span style={{ fontSize: 20, fontWeight: 800, color: C.text, display: "block", marginBottom: 16 }}>Report & Statistiche</span>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Consistenza allevamento</div>
        <BarChart data={[
          { label: "Bovini", value: bovini },
          { label: "Suini", value: suini },
          { label: "Ovini", value: ovini },
        ]} max={maxCapi} color={C.primary} />
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Costi registrati</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: C.red + "15", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>Sanitari</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>€{costoSanitario.toFixed(0)}</div>
          </div>
          <div style={{ flex: 1, background: C.bovini + "15", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: C.bovini, fontWeight: 600 }}>Alimentari</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.bovini }}>€{costoAlimentare.toFixed(0)}</div>
          </div>
          <div style={{ flex: 1, background: C.primary + "15", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>Totale</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>€{costoTotale.toFixed(0)}</div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Statistiche generali</div>
        {[
          { label: "Animali totali attivi", value: attivi.length, color: C.primary },
          { label: "Femmine", value: attivi.filter(a => a.sesso === "F").length, color: "#B5547A" },
          { label: "Maschi", value: attivi.filter(a => a.sesso === "M").length, color: C.blue },
          { label: "Eventi sanitari", value: state.eventi_sanitari.length, color: C.red },
          { label: "Registrazioni pasti", value: state.alimentazione.length, color: C.bovini },
          { label: "Prodotti in magazzino", value: state.magazzino.length, color: C.green },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14, color: C.text }}>{item.label}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tab, setTab] = useState("dashboard");
  const [navParams, setNavParams] = useState({});

  const onNav = useCallback((newTab, params = {}) => {
    setTab(newTab);
    setNavParams(params);
  }, []);

  const tabs = [
    { id: "dashboard", icon: "chart", label: "Home" },
    { id: "anagrafica", icon: "tag", label: "Animali" },
    { id: "sanitario", icon: "health", label: "Salute" },
    { id: "alimentazione", icon: "food", label: "Dieta" },
    { id: "riproduzione", icon: "repro", label: "Riprod." },
    { id: "magazzino", icon: "warehouse", label: "Magaz." },
  ];

  const renderTab = () => {
    switch (tab) {
      case "dashboard": return <Dashboard state={state} onNav={onNav} />;
      case "anagrafica": return <Anagrafica state={state} dispatch={dispatch} params={navParams} />;
      case "sanitario": return <Sanitario state={state} dispatch={dispatch} />;
      case "alimentazione": return <Alimentazione state={state} dispatch={dispatch} />;
      case "riproduzione": return <Riproduzione state={state} dispatch={dispatch} />;
      case "magazzino": return <Magazzino state={state} dispatch={dispatch} />;
      case "report": return <Report state={state} />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <div style={{ paddingBottom: 70 }}>
        {renderTab()}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#FFF", borderTop: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0 10px", zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", minWidth: 50 }}>
            <div style={{ background: tab === t.id ? C.primary + "18" : "transparent", borderRadius: 10, padding: "6px 8px", transition: "background 0.2s" }}>
              <Icon name={t.icon} size={22} color={tab === t.id ? C.primary : C.muted} />
            </div>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.primary : C.muted }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
