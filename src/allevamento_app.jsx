import { useState, useEffect, useReducer, useCallback } from "react";
import { supabase } from "./supabase";

const C = {
  bg: "#F5F0E8", card: "#FFFFFF", primary: "#5C3D1E", accent: "#A0522D",
  green: "#4A7C59", red: "#C0392B", yellow: "#D4A017", blue: "#2C6E9B",
  text: "#2D1B0E", muted: "#8B7355", border: "#D4C4A8",
  bovini: "#8B6914", suini: "#B5547A", ovini: "#4A7C59",
};

const specieColor = s => ({ bovino: C.bovini, suino: C.suini, ovino: C.ovini }[s] || C.muted);
const specieLabel = s => ({ bovino: "Bovino", suino: "Suino", ovino: "Ovino" }[s] || s);
const specieIcon = s => ({ bovino: "🐄", suino: "🐷", ovino: "🐑" }[s] || "🐾");
const today = () => new Date().toISOString().split("T")[0];

// ─── UI BASE ──────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: `1px solid ${C.border}`, ...style }}>
    {children}
  </div>
);
const Badge = ({ label, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
    {label}
  </span>
);
const Btn = ({ label, icon, onClick, variant = "primary", small = false }) => {
  const bg = { primary: C.primary, danger: C.red, success: C.green, ghost: "transparent" }[variant] || C.primary;
  const fg = variant === "ghost" ? C.text : "#FFF";
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, background: bg, color: fg, border: "none", borderRadius: 10, padding: small ? "6px 12px" : "10px 18px", fontSize: small ? 13 : 15, fontWeight: 600, cursor: "pointer", boxShadow: variant !== "ghost" ? "0 2px 6px rgba(0,0,0,0.15)" : "none" }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
};
const inputStyle = { width: "100%", boxSizing: "border-box", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, background: "#FAFAF8", color: C.text, outline: "none" };
const Field = ({ label, value, onChange, type = "text", options, required }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{label}{required && " *"}</div>
    {options
      ? <select value={value ?? ""} onChange={e => onChange(e.target.value)} style={inputStyle}>
          <option value="">— seleziona —</option>
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      : <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} style={inputStyle} />
    }
  </div>
);
const Spinner = () => (
  <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
    <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
    <div>Caricamento...</div>
  </div>
);

// ─── HOOK DATI SUPABASE ───────────────────────────────────────────────────────
function useAnimali() {
  const [animali, setAnimali] = useState([]);
  const [loading, setLoading] = useState(true);

  const carica = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("animali").select("*").order("created_at", { ascending: false });
    if (!error) setAnimali(data || []);
    setLoading(false);
  };

  useEffect(() => { carica(); }, []);

  const aggiungi = async (animale) => {
    const { data, error } = await supabase.from("animali").insert([animale]).select().single();
    if (!error && data) setAnimali(prev => [data, ...prev]);
    return { data, error };
  };

  const aggiorna = async (id, modifiche) => {
    const { data, error } = await supabase.from("animali").update(modifiche).eq("id", id).select().single();
    if (!error && data) setAnimali(prev => prev.map(a => a.id === id ? data : a));
    return { data, error };
  };

  const elimina = async (id) => {
    const { error } = await supabase.from("animali").delete().eq("id", id);
    if (!error) setAnimali(prev => prev.filter(a => a.id !== id));
    return { error };
  };

  return { animali, loading, carica, aggiungi, aggiorna, elimina };
}

function useEventiSanitari() {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);

  const carica = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("eventi_sanitari").select("*").order("data", { ascending: false });
    if (!error) setEventi(data || []);
    setLoading(false);
  };

  useEffect(() => { carica(); }, []);

  const aggiungi = async (evento) => {
    const { data, error } = await supabase.from("eventi_sanitari").insert([evento]).select().single();
    if (!error && data) setEventi(prev => [data, ...prev]);
    return { data, error };
  };

  return { eventi, loading, aggiungi };
}

function useAlimentazione() {
  const [voci, setVoci] = useState([]);
  const [loading, setLoading] = useState(true);

  const carica = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("alimentazione").select("*").order("data", { ascending: false });
    if (!error) setVoci(data || []);
    setLoading(false);
  };

  useEffect(() => { carica(); }, []);

  const aggiungi = async (voce) => {
    const { data, error } = await supabase.from("alimentazione").insert([voce]).select().single();
    if (!error && data) setVoci(prev => [data, ...prev]);
    return { data, error };
  };

  return { voci, loading, aggiungi };
}

function useEventiRiproduttivi() {
  const [eventi, setEventi] = useState([]);
  const [loading, setLoading] = useState(true);

  const carica = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("eventi_riproduttivi").select("*").order("data", { ascending: false });
    if (!error) setEventi(data || []);
    setLoading(false);
  };

  useEffect(() => { carica(); }, []);

  const aggiungi = async (evento) => {
    const { data, error } = await supabase.from("eventi_riproduttivi").insert([evento]).select().single();
    if (!error && data) setEventi(prev => [data, ...prev]);
    return { data, error };
  };

  return { eventi, loading, aggiungi };
}

function useMagazzino() {
  const [scorte, setScorte] = useState([]);
  const [loading, setLoading] = useState(true);

  const carica = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("magazzino").select("*").order("nome");
    if (!error) setScorte(data || []);
    setLoading(false);
  };

  useEffect(() => { carica(); }, []);

  const aggiungi = async (scorta) => {
    const { data, error } = await supabase.from("magazzino").insert([scorta]).select().single();
    if (!error && data) setScorte(prev => [...prev, data]);
    return { data, error };
  };

  const aggiorna = async (id, modifiche) => {
    const { data, error } = await supabase.from("magazzino").update(modifiche).eq("id", id).select().single();
    if (!error && data) setScorte(prev => prev.map(s => s.id === id ? data : s));
    return { data, error };
  };

  return { scorte, loading, aggiungi, aggiorna };
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ animali, eventi_sanitari, magazzino, onNav }) {
  const attivi = animali.filter(a => a.stato === "attivo");
  const bovini = attivi.filter(a => a.specie === "bovino").length;
  const suini  = attivi.filter(a => a.specie === "suino").length;
  const ovini  = attivi.filter(a => a.specie === "ovino").length;

  const oggi = today();
  const fra30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
  const scadenze = eventi_sanitari.filter(e => e.scadenza && e.scadenza >= oggi && e.scadenza <= fra30);
  const sottoscorta = magazzino.filter(m => m.quantita <= m.minimo);

  const StatCard = ({ label, value, icon, color, onClick }) => (
    <div onClick={onClick} style={{ background: color + "15", border: `1.5px solid ${color}33`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
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
          <StatCard label="Bovini" value={bovini} icon="🐄" color={C.bovini} onClick={() => onNav("anagrafica")} />
          <StatCard label="Suini"  value={suini}  icon="🐷" color={C.suini}  onClick={() => onNav("anagrafica")} />
          <StatCard label="Ovini"  value={ovini}  icon="🐑" color={C.ovini}  onClick={() => onNav("anagrafica")} />
        </div>

        {scadenze.length > 0 && (
          <Card style={{ borderLeft: `4px solid ${C.yellow}` }}>
            <div style={{ fontWeight: 700, color: C.yellow, marginBottom: 8 }}>⚠ Scadenze entro 30 giorni</div>
            {scadenze.map(e => {
              const a = animali.find(x => x.id === e.animale_id);
              return <div key={e.id} style={{ fontSize: 13, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>{a?.nome || "?"} — {e.descrizione} <span style={{ color: C.yellow, fontWeight: 600 }}>entro {e.scadenza}</span></div>;
            })}
          </Card>
        )}

        {sottoscorta.length > 0 && (
          <Card style={{ borderLeft: `4px solid ${C.red}` }}>
            <div style={{ fontWeight: 700, color: C.red, marginBottom: 8 }}>⚠ Scorte sotto il minimo</div>
            {sottoscorta.map(m => (
              <div key={m.id} style={{ fontSize: 13, padding: "4px 0" }}>{m.nome}: <span style={{ color: C.red, fontWeight: 700 }}>{m.quantita} {m.unita}</span> (min. {m.minimo})</div>
            ))}
          </Card>
        )}

        <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, margin: "20px 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Accesso rapido</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Anagrafica", icon: "🏷️", tab: "anagrafica" },
            { label: "Sanità",     icon: "💉", tab: "sanitario" },
            { label: "Alimenti",   icon: "🌾", tab: "alimentazione" },
            { label: "Riprod.",    icon: "🐣", tab: "riproduzione" },
            { label: "Magazzino",  icon: "🏠", tab: "magazzino" },
            { label: "Report",     icon: "📊", tab: "report" },
          ].map(item => (
            <div key={item.tab} onClick={() => onNav(item.tab)} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px 10px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 26 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 6 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ANAGRAFICA ───────────────────────────────────────────────────────────────
function Anagrafica({ animali, loading, aggiungi, aggiorna, elimina }) {
  const [filtro, setFiltro] = useState("tutti");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState("");

  const lista = animali.filter(a => filtro === "tutti" || a.specie === filtro || (filtro === "attivo" && a.stato === "attivo"));

  const empty = { bdn: "", nome: "", specie: "bovino", razza: "", sesso: "F", nascita: "", peso: "", stato: "attivo", note: "" };

  const salva = async () => {
    if (!form.bdn && !form.nome) { setErrore("Inserisci almeno BDN o nome"); return; }
    setSaving(true); setErrore("");
    const payload = { bdn: form.bdn || null, nome: form.nome || null, specie: form.specie, razza: form.razza || null, sesso: form.sesso, nascita: form.nascita || null, stato: form.stato, note: form.note || null };
    if (form.id) {
      const { error } = await aggiorna(form.id, payload);
      if (error) setErrore("Errore nel salvataggio");
    } else {
      const { error } = await aggiungi(payload);
      if (error) setErrore("Errore nel salvataggio");
    }
    setSaving(false);
    if (!errore) setForm(null);
  };

  const cancella = async (id) => {
    if (!window.confirm("Eliminare questo animale?")) return;
    await elimina(id);
  };

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 800 }}>{form.id ? "Modifica" : "Nuovo"} animale</span>
      </div>
      {errore && <div style={{ background: C.red + "15", color: C.red, borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>{errore}</div>}
      <Field label="BDN / Matricola" value={form.bdn} onChange={v => setForm(f => ({ ...f, bdn: v }))} />
      <Field label="Nome" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} />
      <Field label="Specie" value={form.specie} onChange={v => setForm(f => ({ ...f, specie: v }))} options={["bovino", "suino", "ovino"]} required />
      <Field label="Razza" value={form.razza} onChange={v => setForm(f => ({ ...f, razza: v }))} />
      <Field label="Sesso" value={form.sesso} onChange={v => setForm(f => ({ ...f, sesso: v }))} options={[{ value: "M", label: "♂ Maschio" }, { value: "F", label: "♀ Femmina" }]} />
      <Field label="Data di nascita" value={form.nascita} onChange={v => setForm(f => ({ ...f, nascita: v }))} type="date" />
      <Field label="Stato" value={form.stato} onChange={v => setForm(f => ({ ...f, stato: v }))} options={["attivo", "venduto", "macellato", "deceduto"]} />
      <Field label="Note" value={form.note} onChange={v => setForm(f => ({ ...f, note: v }))} />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label={saving ? "Salvataggio..." : "Salva"} icon="✓" onClick={salva} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>Anagrafica</span>
        <Btn label="Aggiungi" icon="+" onClick={() => setForm({ ...empty })} small />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        {["tutti", "bovino", "suino", "ovino", "attivo"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{ background: filtro === f ? C.primary : C.card, color: filtro === f ? "#FFF" : C.muted, border: `1.5px solid ${filtro === f ? C.primary : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            {f === "tutti" ? "Tutti" : f === "attivo" ? "Solo attivi" : specieLabel(f)}
          </button>
        ))}
      </div>
      {loading ? <Spinner /> : lista.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐄</div>
          <div>Nessun animale registrato.</div>
          <div style={{ marginTop: 8 }}>Tocca "Aggiungi" per iniziare!</div>
        </div>
      ) : lista.map(a => (
        <Card key={a.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ background: specieColor(a.specie) + "20", borderRadius: 10, padding: 8, fontSize: 24 }}>
                {specieIcon(a.specie)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{a.nome || a.bdn || "—"}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{a.bdn} · {a.razza}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  <Badge label={specieLabel(a.specie)} color={specieColor(a.specie)} />
                  <Badge label={a.sesso === "M" ? "♂ Maschio" : "♀ Femmina"} color={a.sesso === "M" ? C.blue : "#B5547A"} />
                  {a.stato !== "attivo" && <Badge label={a.stato} color={C.red} />}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setForm({ ...a })} style={{ background: C.blue + "20", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>✏️</button>
              <button onClick={() => cancella(a.id)} style={{ background: C.red + "20", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>🗑️</button>
            </div>
          </div>
          {a.nascita && <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>📅 Nato il {a.nascita}</div>}
          {a.note && <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontStyle: "italic" }}>{a.note}</div>}
        </Card>
      ))}
    </div>
  );
}

// ─── SANITARIO ────────────────────────────────────────────────────────────────
function Sanitario({ animali, eventi, loading, aggiungi }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const salva = async () => {
    if (!form.animale_id || !form.descrizione) return;
    setSaving(true);
    const payload = { animale_id: parseInt(form.animale_id), tipo: form.tipo, descrizione: form.descrizione, data: form.data, veterinario: form.veterinario || null, prodotto: form.prodotto || null, scadenza: form.scadenza || null, costo: form.costo ? parseFloat(form.costo) : null };
    await aggiungi(payload);
    setSaving(false);
    setForm(null);
  };

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 800 }}>Nuovo evento sanitario</span>
      </div>
      <Field label="Animale" value={form.animale_id} onChange={v => setForm(f => ({ ...f, animale_id: v }))} options={animali.filter(a => a.stato === "attivo").map(a => ({ value: a.id, label: `${a.nome || a.bdn} (${specieLabel(a.specie)})` }))} required />
      <Field label="Tipo" value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))} options={["vaccino", "farmaco", "visita", "intervento", "altro"]} />
      <Field label="Descrizione" value={form.descrizione} onChange={v => setForm(f => ({ ...f, descrizione: v }))} required />
      <Field label="Data" value={form.data} onChange={v => setForm(f => ({ ...f, data: v }))} type="date" />
      <Field label="Veterinario" value={form.veterinario} onChange={v => setForm(f => ({ ...f, veterinario: v }))} />
      <Field label="Prodotto / Farmaco" value={form.prodotto} onChange={v => setForm(f => ({ ...f, prodotto: v }))} />
      <Field label="Data scadenza richiamo" value={form.scadenza} onChange={v => setForm(f => ({ ...f, scadenza: v }))} type="date" />
      <Field label="Costo (€)" value={form.costo} onChange={v => setForm(f => ({ ...f, costo: v }))} type="number" />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label={saving ? "..." : "Salva"} icon="✓" onClick={salva} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  const tipoColor = { vaccino: C.green, farmaco: C.blue, visita: C.yellow, intervento: C.red, altro: C.muted };

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>Registro Sanitario</span>
        <Btn label="Aggiungi" icon="+" onClick={() => setForm({ animale_id: "", tipo: "vaccino", descrizione: "", data: today(), veterinario: "", prodotto: "", scadenza: "", costo: "" })} small />
      </div>
      {loading ? <Spinner /> : eventi.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Nessun evento registrato.</div>
      ) : eventi.map(e => {
        const a = animali.find(x => x.id === e.animale_id);
        const col = tipoColor[e.tipo] || C.muted;
        return (
          <Card key={e.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <Badge label={e.tipo?.toUpperCase()} color={col} />
                  {a && <span style={{ fontSize: 13, color: specieColor(a.specie), fontWeight: 600 }}>{a.nome || a.bdn}</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{e.descrizione}</div>
                {e.prodotto && <div style={{ fontSize: 13, color: C.muted }}>💊 {e.prodotto}</div>}
                {e.veterinario && <div style={{ fontSize: 13, color: C.muted }}>👨‍⚕️ {e.veterinario}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: C.muted }}>{e.data}</div>
                {e.costo > 0 && <div style={{ fontWeight: 700, color: C.accent }}>€{e.costo}</div>}
                {e.scadenza && <div style={{ fontSize: 12, background: C.yellow + "22", color: C.yellow, borderRadius: 8, padding: "2px 8px", marginTop: 4 }}>⏰ {e.scadenza}</div>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── ALIMENTAZIONE ────────────────────────────────────────────────────────────
function Alimentazione({ voci, loading, aggiungi }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const salva = async () => {
    if (!form.tipo || !form.quantita) return;
    setSaving(true);
    await aggiungi({ specie: form.specie || null, tipo: form.tipo, quantita: parseFloat(form.quantita), unita: form.unita, costo: form.costo ? parseFloat(form.costo) : null, data: form.data, note: form.note || null });
    setSaving(false);
    setForm(null);
  };

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 800 }}>Nuova somministrazione</span>
      </div>
      <Field label="Data" value={form.data} onChange={v => setForm(f => ({ ...f, data: v }))} type="date" />
      <Field label="Specie" value={form.specie} onChange={v => setForm(f => ({ ...f, specie: v }))} options={[{ value: "", label: "Tutte" }, "bovino", "suino", "ovino"]} />
      <Field label="Tipo mangime / foraggio" value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))} required />
      <Field label="Quantità" value={form.quantita} onChange={v => setForm(f => ({ ...f, quantita: v }))} type="number" required />
      <Field label="Unità" value={form.unita} onChange={v => setForm(f => ({ ...f, unita: v }))} options={["kg", "litri", "balle", "sacchi"]} />
      <Field label="Costo (€)" value={form.costo} onChange={v => setForm(f => ({ ...f, costo: v }))} type="number" />
      <Field label="Note" value={form.note} onChange={v => setForm(f => ({ ...f, note: v }))} />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label={saving ? "..." : "Salva"} icon="✓" onClick={salva} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  const costoTotale = voci.reduce((s, e) => s + (e.costo || 0), 0);
  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>Alimentazione</span>
        <Btn label="Aggiungi" icon="+" onClick={() => setForm({ data: today(), specie: "", tipo: "", quantita: "", unita: "kg", costo: "", note: "" })} small />
      </div>
      <Card style={{ background: `linear-gradient(135deg, ${C.primary}15, ${C.accent}10)` }}>
        <div style={{ fontSize: 13, color: C.muted }}>Costo totale registrato</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.primary }}>€{costoTotale.toFixed(2)}</div>
      </Card>
      {loading ? <Spinner /> : voci.map(e => (
        <Card key={e.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{e.specie ? specieIcon(e.specie) : "🐾"} {e.tipo}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{e.data}{e.specie ? " · " + e.specie : ""}</div>
              {e.note && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>{e.note}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{e.quantita} {e.unita}</div>
              {e.costo > 0 && <div style={{ color: C.accent, fontWeight: 600 }}>€{e.costo}</div>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── MAGAZZINO ────────────────────────────────────────────────────────────────
function Magazzino({ scorte, loading, aggiungi, aggiorna }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const salva = async () => {
    if (!form.nome) return;
    setSaving(true);
    const payload = { nome: form.nome, categoria: form.categoria, quantita: parseFloat(form.quantita) || 0, unita: form.unita, minimo: parseFloat(form.minimo) || 0, costo: parseFloat(form.costo) || 0, fornitore: form.fornitore || null };
    if (form.id) await aggiorna(form.id, payload);
    else await aggiungi(payload);
    setSaving(false);
    setForm(null);
  };

  const aggiornaQta = async (scorta, delta) => {
    await aggiorna(scorta.id, { quantita: Math.max(0, scorta.quantita + delta) });
  };

  if (form) return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setForm(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 800 }}>{form.id ? "Modifica" : "Nuova"} scorta</span>
      </div>
      <Field label="Nome prodotto" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} required />
      <Field label="Categoria" value={form.categoria} onChange={v => setForm(f => ({ ...f, categoria: v }))} options={["mangime", "farmaco", "igiene", "attrezzatura", "altro"]} />
      <Field label="Quantità attuale" value={form.quantita} onChange={v => setForm(f => ({ ...f, quantita: v }))} type="number" />
      <Field label="Unità" value={form.unita} onChange={v => setForm(f => ({ ...f, unita: v }))} options={["kg", "litri", "sacchi", "balle", "flaconi", "pezzi"]} />
      <Field label="Scorta minima" value={form.minimo} onChange={v => setForm(f => ({ ...f, minimo: v }))} type="number" />
      <Field label="Costo unitario (€)" value={form.costo} onChange={v => setForm(f => ({ ...f, costo: v }))} type="number" />
      <Field label="Fornitore" value={form.fornitore} onChange={v => setForm(f => ({ ...f, fornitore: v }))} />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label={saving ? "..." : "Salva"} icon="✓" onClick={salva} variant="success" />
        <Btn label="Annulla" onClick={() => setForm(null)} variant="ghost" />
      </div>
    </div>
  );

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>Magazzino</span>
        <Btn label="Aggiungi" icon="+" onClick={() => setForm({ nome: "", categoria: "mangime", quantita: "", unita: "kg", minimo: "", costo: "", fornitore: "" })} small />
      </div>
      {loading ? <Spinner /> : scorte.map(m => {
        const alert = m.quantita <= m.minimo;
        return (
          <Card key={m.id} style={{ borderLeft: alert ? `4px solid ${C.red}` : `4px solid ${C.green}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.nome}</div>
                <Badge label={m.categoria} color={alert ? C.red : C.green} />
                {alert && <Badge label="⚠ SCORTA BASSA" color={C.red} />}
                {m.fornitore && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>📦 {m.fornitore}</div>}
              </div>
              <button onClick={() => setForm({ ...m })} style={{ background: C.blue + "20", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>✏️</button>
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

// ─── REPORT ──────────────────────────────────────────────────────────────────
function Report({ animali, eventi_sanitari, voci_alimentazione }) {
  const attivi = animali.filter(a => a.stato === "attivo");
  const costoSan = eventi_sanitari.reduce((s, e) => s + (e.costo || 0), 0);
  const costoAli = voci_alimentazione.reduce((s, e) => s + (e.costo || 0), 0);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <span style={{ fontSize: 20, fontWeight: 800, display: "block", marginBottom: 16 }}>Report</span>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, marginBottom: 12 }}>CONSISTENZA</div>
        {["bovino", "suino", "ovino"].map(s => {
          const n = attivi.filter(a => a.specie === s).length;
          return (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <span>{specieIcon(s)} {specieLabel(s)}</span>
              <span style={{ fontWeight: 700, color: specieColor(s) }}>{n} capi</span>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700 }}>
          <span>Totale attivi</span>
          <span style={{ color: C.primary }}>{attivi.length} capi</span>
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, marginBottom: 12 }}>COSTI REGISTRATI</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: C.red + "15", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>Sanitari</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>€{costoSan.toFixed(0)}</div>
          </div>
          <div style={{ flex: 1, background: C.bovini + "15", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: C.bovini, fontWeight: 600 }}>Alimentari</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.bovini }}>€{costoAli.toFixed(0)}</div>
          </div>
          <div style={{ flex: 1, background: C.primary + "15", borderRadius: 12, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>Totale</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>€{(costoSan + costoAli).toFixed(0)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const { animali, loading: loadA, aggiungi: addA, aggiorna: updA, elimina: delA } = useAnimali();
  const { eventi: sanitari, loading: loadS, aggiungi: addS } = useEventiSanitari();
  const { voci: alimentazione, loading: loadAl, aggiungi: addAl } = useAlimentazione();
  const { eventi: riproduttivi, loading: loadR, aggiungi: addR } = useEventiRiproduttivi();
  const { scorte: magazzino, loading: loadM, aggiungi: addM, aggiorna: updM } = useMagazzino();

  const TABS = [
    { id: "dashboard",    label: "Home",    icon: "🏠" },
    { id: "anagrafica",   label: "Animali", icon: "🏷️" },
    { id: "sanitario",    label: "Salute",  icon: "💉" },
    { id: "alimentazione",label: "Dieta",   icon: "🌾" },
    { id: "magazzino",    label: "Magazz.", icon: "🏠" },
    { id: "report",       label: "Report",  icon: "📊" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ paddingBottom: 70 }}>
        {tab === "dashboard"     && <Dashboard animali={animali} eventi_sanitari={sanitari} magazzino={magazzino} onNav={setTab} />}
        {tab === "anagrafica"    && <Anagrafica animali={animali} loading={loadA} aggiungi={addA} aggiorna={updA} elimina={delA} />}
        {tab === "sanitario"     && <Sanitario animali={animali} eventi={sanitari} loading={loadS} aggiungi={addS} />}
        {tab === "alimentazione" && <Alimentazione voci={alimentazione} loading={loadAl} aggiungi={addAl} />}
        {tab === "magazzino"     && <Magazzino scorte={magazzino} loading={loadM} aggiungi={addM} aggiorna={updM} />}
        {tab === "report"        && <Report animali={animali} eventi_sanitari={sanitari} voci_alimentazione={alimentazione} />}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#FFF", borderTop: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0 10px", zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", minWidth: 50 }}>
            <div style={{ background: tab === t.id ? C.primary + "18" : "transparent", borderRadius: 10, padding: "6px 8px" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.primary : C.muted }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
