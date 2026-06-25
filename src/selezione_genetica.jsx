
import { useState, useMemo } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  bg: "#F5F0E8", card: "#FFFFFF", primary: "#5C3D1E", accent: "#A0522D",
  green: "#4A7C59", red: "#C0392B", yellow: "#D4A017", blue: "#2C6E9B",
  text: "#2D1B0E", muted: "#8B7355", border: "#D4C4A8",
  gold: "#C9920A", silver: "#7A8A99", bronze: "#9E6B3A",
  bovini: "#8B6914", suini: "#B5547A", ovini: "#4A7C59",
};

const specieColor = s => ({ bovino: C.bovini, suino: C.suini, ovino: C.ovini }[s] || C.muted);
const specieIcon = s => ({ bovino: "🐄", suino: "🐷", ovino: "🐑" }[s] || "🐾");
const today = () => new Date().toISOString().split("T")[0];
const daysBetween = (d1, d2) => Math.max(1, Math.round((new Date(d2) - new Date(d1)) / 86400000));

// ─── DATI INIZIALI ──────────────────────────────────────────────────────────
const initialData = {
  riproduttori: [
    { id: 1, bdn: "IT034BN001", nome: "Ercole", specie: "bovino", sesso: "M", razza: "Limousine", nascita: "2019-04-10", stato: "attivo", note: "" },
    { id: 2, bdn: "IT034BN002", nome: "Bella", specie: "bovino", sesso: "F", razza: "Limousine", nascita: "2020-02-15", stato: "attivo", note: "" },
    { id: 3, bdn: "IT034BN003", nome: "Rosa", specie: "bovino", sesso: "F", razza: "Limousine", nascita: "2020-06-01", stato: "attivo", note: "" },
    { id: 4, bdn: "IT034SU001", nome: "Arturo", specie: "suino", sesso: "M", razza: "Large White", nascita: "2021-03-20", stato: "attivo", note: "" },
    { id: 5, bdn: "IT034SU002", nome: "Peppa", specie: "suino", sesso: "F", razza: "Large White", nascita: "2021-07-10", stato: "attivo", note: "" },
    { id: 6, bdn: "IT034OV001", nome: "Nuvola", specie: "ovino", sesso: "F", razza: "Sarda", nascita: "2021-01-05", stato: "attivo", note: "" },
  ],
  parti: [
    { id: 1, madreId: 2, padreId: 1, data: "2023-03-10", nati_vivi: 1, nati_morti: 0, note: "" },
    { id: 2, madreId: 2, padreId: 1, data: "2024-04-05", nati_vivi: 1, nati_morti: 0, note: "" },
    { id: 3, madreId: 3, padreId: 1, data: "2023-05-20", nati_vivi: 1, nati_morti: 1, note: "gemelli" },
    { id: 4, madreId: 5, padreId: 4, data: "2023-08-15", nati_vivi: 10, nati_morti: 1, note: "" },
    { id: 5, madreId: 5, padreId: 4, data: "2024-09-02", nati_vivi: 11, nati_morti: 0, note: "" },
    { id: 6, madreId: 6, padreId: null, data: "2023-02-14", nati_vivi: 2, nati_morti: 0, note: "" },
  ],
  figli: [
    { id: 1, partoId: 1, bdn: "IT034BN010", nome: "F01", sesso: "M", peso_nascita: 42, peso_svezzamento: 280, data_nascita: "2023-03-10", data_svezzamento: "2023-09-10", vivo: true },
    { id: 2, partoId: 2, bdn: "IT034BN011", nome: "F02", sesso: "F", peso_nascita: 40, peso_svezzamento: 265, data_nascita: "2024-04-05", data_svezzamento: "2024-10-05", vivo: true },
    { id: 3, partoId: 3, bdn: "IT034BN012", nome: "F03", sesso: "M", peso_nascita: 38, peso_svezzamento: 220, data_nascita: "2023-05-20", data_svezzamento: "2023-11-01", vivo: true },
    { id: 4, partoId: 3, bdn: "IT034BN013", nome: "F04", sesso: "F", peso_nascita: 35, peso_svezzamento: null, data_nascita: "2023-05-20", data_svezzamento: null, vivo: false },
    { id: 5, partoId: 4, bdn: "IT034SU010", nome: "S01", sesso: "M", peso_nascita: 1.4, peso_svezzamento: 28, data_nascita: "2023-08-15", data_svezzamento: "2023-10-15", vivo: true },
    { id: 6, partoId: 5, bdn: "IT034SU020", nome: "S02", sesso: "F", peso_nascita: 1.5, peso_svezzamento: 30, data_nascita: "2024-09-02", data_svezzamento: "2024-11-02", vivo: true },
    { id: 7, partoId: 6, bdn: "IT034OV010", nome: "O01", sesso: "M", peso_nascita: 4.2, peso_svezzamento: 28, data_nascita: "2023-02-14", data_svezzamento: "2023-05-14", vivo: true },
    { id: 8, partoId: 6, bdn: "IT034OV011", nome: "O02", sesso: "F", peso_nascita: 4.0, peso_svezzamento: 26, data_nascita: "2023-02-14", data_svezzamento: "2023-05-14", vivo: true },
  ],
  nextId: { riproduttori: 7, parti: 7, figli: 9 },
};

// ─── CALCOLO INDICE GENETICO ─────────────────────────────────────────────────
function calcolaIndice(ripId, data) {
  const mieiParti = data.parti.filter(p => p.madreId === ripId || p.padreId === ripId);
  if (mieiParti.length === 0) return null;

  const mieiFigli = mieiParti.flatMap(p => data.figli.filter(f => f.partoId === p.id));
  const figliVivi = mieiFigli.filter(f => f.vivo);

  // 1. Fertilità: parti/anno (calcolato su carriera)
  const rip = data.riproduttori.find(r => r.id === ripId);
  const anni = Math.max(1, daysBetween(rip.nascita, today()) / 365);
  const fertilita = mieiParti.length / anni; // parti per anno

  // 2. Mortalità neonatale prole
  const totNati = mieiParti.reduce((s, p) => s + p.nati_vivi + p.nati_morti, 0);
  const totMorti = mieiParti.reduce((s, p) => s + p.nati_morti, 0);
  const mortalita = totNati > 0 ? totMorti / totNati : 0; // più bassa = meglio

  // 3. Nati vivi per parto
  const natiPerParto = mieiParti.reduce((s, p) => s + p.nati_vivi, 0) / mieiParti.length;

  // 4. IPG medio figli (g/giorno)
  const ipgValues = figliVivi
    .filter(f => f.peso_nascita && f.peso_svezzamento && f.data_nascita && f.data_svezzamento)
    .map(f => (f.peso_svezzamento - f.peso_nascita) / daysBetween(f.data_nascita, f.data_svezzamento) * 1000);
  const ipgMedio = ipgValues.length > 0 ? ipgValues.reduce((a, b) => a + b, 0) / ipgValues.length : null;

  // 5. Peso svezzamento medio
  const pesoSvez = figliVivi.filter(f => f.peso_svezzamento).map(f => f.peso_svezzamento);
  const pesoSvezMedio = pesoSvez.length > 0 ? pesoSvez.reduce((a, b) => a + b, 0) / pesoSvez.length : null;

  // 6. Longevità (anni in carriera)
  const longevita = anni;

  return {
    nParti: mieiParti.length,
    fertilita: +fertilita.toFixed(2),
    mortalita: +(mortalita * 100).toFixed(1),
    natiPerParto: +natiPerParto.toFixed(1),
    ipgMedio: ipgMedio ? +ipgMedio.toFixed(0) : null,
    pesoSvezMedio: pesoSvezMedio ? +pesoSvezMedio.toFixed(1) : null,
    longevita: +longevita.toFixed(1),
    nFigli: mieiFigli.length,
    nFigliVivi: figliVivi.length,
  };
}

function calcolaScore(indice, specie) {
  if (!indice) return 0;
  // Benchmark per specie
  const bench = {
    bovino: { fertilita: [0.5, 1.2], natiPerParto: [1, 1.5], mortalita: [0, 15], ipg: [600, 1200], pesoSvez: [200, 350] },
    suino:  { fertilita: [1.5, 2.8], natiPerParto: [8, 14],  mortalita: [0, 12], ipg: [150, 350], pesoSvez: [20, 35]  },
    ovino:  { fertilita: [0.8, 1.8], natiPerParto: [1, 2.5], mortalita: [0, 10], ipg: [80, 200],  pesoSvez: [18, 32]  },
  };
  const b = bench[specie] || bench.bovino;

  const norm = (val, min, max, invert = false) => {
    const s = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
    return invert ? 100 - s : s;
  };

  const scores = [
    norm(indice.fertilita, b.fertilita[0], b.fertilita[1]) * 0.25,
    norm(indice.natiPerParto, b.natiPerParto[0], b.natiPerParto[1]) * 0.20,
    norm(indice.mortalita, b.mortalita[0], b.mortalita[1], true) * 0.20,
    indice.ipgMedio ? norm(indice.ipgMedio, b.ipg[0], b.ipg[1]) * 0.25 : 0,
    indice.pesoSvezMedio ? norm(indice.pesoSvezMedio, b.pesoSvez[0], b.pesoSvez[1]) * 0.10 : 0,
  ];

  return +scores.reduce((a, b) => a + b, 0).toFixed(1);
}

// ─── COMPONENTI UI ──────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: `1px solid ${C.border}`, ...style }}>
    {children}
  </div>
);

const Badge = ({ label, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
    {label}
  </span>
);

const Btn = ({ label, onClick, variant = "primary", small = false, icon }) => {
  const bg = { primary: C.primary, danger: C.red, success: C.green, ghost: "transparent", outline: "transparent" }[variant];
  const fg = variant === "ghost" || variant === "outline" ? C.text : "#FFF";
  const border = variant === "outline" ? `1.5px solid ${C.border}` : "none";
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, color: fg, border, borderRadius: 10, padding: small ? "6px 12px" : "10px 18px", fontSize: small ? 13 : 15, fontWeight: 600, cursor: "pointer", boxShadow: variant === "primary" || variant === "success" ? "0 2px 6px rgba(0,0,0,0.15)" : "none" }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
};

const inputStyle = { width: "100%", boxSizing: "border-box", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, background: "#FAFAF8", color: C.text, outline: "none" };

const Field = ({ label, value, onChange, type = "text", options, required }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{label}{required && " *"}</div>
    {options
      ? <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
          <option value="">— seleziona —</option>
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      : <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} style={inputStyle} />
    }
  </div>
);

// Barra punteggio
const ScoreBar = ({ score, size = "md" }) => {
  const color = score >= 70 ? C.green : score >= 45 ? C.yellow : C.red;
  const h = size === "sm" ? 6 : 10;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: C.border, borderRadius: 99, height: h, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: size === "sm" ? 13 : 16, fontWeight: 800, color, minWidth: 36 }}>{score}</span>
    </div>
  );
};

// Medaglia ranking
const Medal = ({ pos }) => {
  if (pos === 1) return <span style={{ fontSize: 22 }}>🥇</span>;
  if (pos === 2) return <span style={{ fontSize: 22 }}>🥈</span>;
  if (pos === 3) return <span style={{ fontSize: 22 }}>🥉</span>;
  return <span style={{ fontSize: 15, fontWeight: 700, color: C.muted }}>#{pos}</span>;
};

// Stat pill
const Stat = ({ label, value, unit, color }) => (
  <div style={{ background: (color || C.primary) + "12", borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 17, fontWeight: 800, color: color || C.primary }}>{value ?? "—"}<span style={{ fontSize: 11 }}> {unit}</span></div>
  </div>
);

// ─── SCHEDA DETTAGLIO RIPRODUTTORE ────────────────────────────────────────────
function SchedaRiproduttore({ rip, data, onBack, onAddParto }) {
  const indice = calcolaIndice(rip.id, data);
  const score = calcolaScore(indice, rip.specie);
  const mieiParti = data.parti.filter(p => p.madreId === rip.id || p.padreId === rip.id).sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24 }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Scheda Riproduttore</span>
      </div>

      {/* Header */}
      <Card style={{ background: `linear-gradient(135deg, ${specieColor(rip.specie)}18, ${C.card})`, borderLeft: `5px solid ${specieColor(rip.specie)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{specieIcon(rip.specie)} {rip.nome}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{rip.bdn}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <Badge label={rip.razza} color={specieColor(rip.specie)} />
              <Badge label={rip.sesso === "M" ? "♂ Maschio" : "♀ Femmina"} color={rip.sesso === "M" ? C.blue : "#B5547A"} />
              <Badge label={`nato ${rip.nascita}`} color={C.muted} />
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>INDICE</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: score >= 70 ? C.green : score >= 45 ? C.yellow : C.red, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 11, color: C.muted }}>/100</div>
          </div>
        </div>
      </Card>

      {/* KPI */}
      {indice ? (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, margin: "16px 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>Indicatori di performance</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Stat label="Parti totali" value={indice.nParti} color={C.primary} />
            <Stat label="Fertilità" value={indice.fertilita} unit="parti/anno" color={C.blue} />
            <Stat label="Nati vivi/parto" value={indice.natiPerParto} color={C.green} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <Stat label="Mortalità neonat." value={indice.mortalita} unit="%" color={indice.mortalita > 10 ? C.red : C.green} />
            <Stat label="IPG medio figli" value={indice.ipgMedio} unit="g/d" color={C.yellow} />
            <Stat label="Peso svezz. medio" value={indice.pesoSvezMedio} unit="kg" color={C.accent} />
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <Stat label="Carriera" value={indice.longevita} unit="anni" color={C.muted} />
            <Stat label="Figli totali" value={indice.nFigli} color={C.primary} />
            <Stat label="Figli sopravvissuti" value={indice.nFigliVivi} color={C.green} />
          </div>

          {/* Radar KPI */}
          <Card style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 10 }}>Dettaglio punteggio</div>
            {[
              { label: "Fertilità / parti per anno", v: Math.min(100, indice.fertilita * 40) },
              { label: "Nati vivi per parto", v: Math.min(100, (indice.natiPerParto / 2) * 100) },
              { label: "Mortalità neonatale (inverso)", v: Math.max(0, 100 - indice.mortalita * 5) },
              { label: "Incremento ponderale figli", v: indice.ipgMedio ? Math.min(100, indice.ipgMedio / 12) : 0 },
              { label: "Peso svezzamento figli", v: indice.pesoSvezMedio ? Math.min(100, (indice.pesoSvezMedio / 350) * 100) : 0 },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 3 }}>{row.label}</div>
                <ScoreBar score={Math.round(row.v)} size="sm" />
              </div>
            ))}
          </Card>
        </>
      ) : (
        <Card><div style={{ color: C.muted, fontSize: 14, textAlign: "center" }}>Nessun dato produttivo registrato per questo riproduttore.</div></Card>
      )}

      {/* Storico parti */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 8px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Storico parti ({mieiParti.length})</div>
        <Btn label="+ Parto" onClick={() => onAddParto(rip)} small variant="success" />
      </div>
      {mieiParti.map(p => {
        const madre = data.riproduttori.find(r => r.id === p.madreId);
        const padre = data.riproduttori.find(r => r.id === p.padreId);
        const figliParto = data.figli.filter(f => f.partoId === p.id);
        const ipgs = figliParto.filter(f => f.peso_nascita && f.peso_svezzamento && f.data_nascita && f.data_svezzamento)
          .map(f => +((f.peso_svezzamento - f.peso_nascita) / daysBetween(f.data_nascita, f.data_svezzamento) * 1000).toFixed(0));
        return (
          <Card key={p.id} style={{ borderLeft: `3px solid ${p.nati_morti > 0 ? C.red : C.green}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>📅 {p.data}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <Badge label={`${p.nati_vivi} vivi`} color={C.green} />
                {p.nati_morti > 0 && <Badge label={`${p.nati_morti} morti`} color={C.red} />}
              </div>
            </div>
            {rip.sesso === "M" && madre && <div style={{ fontSize: 13, color: C.muted }}>♀ Madre: {madre.nome} ({madre.bdn})</div>}
            {rip.sesso === "F" && padre && <div style={{ fontSize: 13, color: C.muted }}>♂ Padre: {padre.nome} ({padre.bdn})</div>}
            {p.note && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>{p.note}</div>}
            {figliParto.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {figliParto.map(f => (
                  <div key={f.id} style={{ background: C.bg, borderRadius: 8, padding: "6px 10px", marginTop: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{f.nome}</span> ({f.bdn}) — Nasc: <b>{f.peso_nascita} kg</b>
                    {f.peso_svezzamento && <> → Svezz: <b>{f.peso_svezzamento} kg</b></>}
                    {f.peso_svezzamento && f.data_svezzamento && (
                      <span style={{ color: C.blue, fontWeight: 700 }}>  IPG: {((f.peso_svezzamento - f.peso_nascita) / daysBetween(f.data_nascita, f.data_svezzamento) * 1000).toFixed(0)} g/d</span>
                    )}
                    {!f.vivo && <Badge label="deceduto" color={C.red} />}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── FORM PARTO ──────────────────────────────────────────────────────────────
function FormParto({ riproduttore, data, onSave, onCancel }) {
  const isMadre = riproduttore.sesso === "F";
  const padriDisp = data.riproduttori.filter(r => r.specie === riproduttore.specie && r.sesso === "M").map(r => ({ value: r.id, label: `${r.nome} — ${r.bdn}` }));
  const madriDisp = data.riproduttori.filter(r => r.specie === riproduttore.specie && r.sesso === "F").map(r => ({ value: r.id, label: `${r.nome} — ${r.bdn}` }));

  const [parto, setParto] = useState({
    madreId: isMadre ? riproduttore.id : "",
    padreId: isMadre ? "" : riproduttore.id,
    data: today(), nati_vivi: 1, nati_morti: 0, note: ""
  });

  const [figli, setFigli] = useState([{ bdn: "", nome: "", sesso: "M", peso_nascita: "", peso_svezzamento: "", data_nascita: today(), data_svezzamento: "", vivo: true }]);

  const aggiornaFiglio = (i, k, v) => setFigli(ff => ff.map((f, idx) => idx === i ? { ...f, [k]: v } : f));
  const addFiglio = () => setFigli(ff => [...ff, { bdn: "", nome: "", sesso: "M", peso_nascita: "", peso_svezzamento: "", data_nascita: parto.data, data_svezzamento: "", vivo: true }]);

  const salva = () => {
    if (!parto.madreId) return;
    onSave({
      parto: { ...parto, madreId: parseInt(parto.madreId), padreId: parto.padreId ? parseInt(parto.padreId) : null, nati_vivi: parseInt(parto.nati_vivi), nati_morti: parseInt(parto.nati_morti) },
      figli: figli.map(f => ({ ...f, peso_nascita: parseFloat(f.peso_nascita) || null, peso_svezzamento: f.peso_svezzamento ? parseFloat(f.peso_svezzamento) : null }))
    });
  };

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 800 }}>Registra parto — {riproduttore.nome}</span>
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 10 }}>DATI PARTO</div>
        <Field label="Data parto" value={parto.data} onChange={v => setParto(p => ({ ...p, data: v }))} type="date" required />
        {isMadre
          ? <Field label="Padre (maschio)" value={parto.padreId} onChange={v => setParto(p => ({ ...p, padreId: v }))} options={padriDisp} />
          : <Field label="Madre (femmina)" value={parto.madreId} onChange={v => setParto(p => ({ ...p, madreId: v }))} options={madriDisp} required />
        }
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="Nati vivi" value={parto.nati_vivi} onChange={v => setParto(p => ({ ...p, nati_vivi: v }))} type="number" /></div>
          <div style={{ flex: 1 }}><Field label="Nati morti" value={parto.nati_morti} onChange={v => setParto(p => ({ ...p, nati_morti: v }))} type="number" /></div>
        </div>
        <Field label="Note" value={parto.note} onChange={v => setParto(p => ({ ...p, note: v }))} />
      </Card>

      <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, margin: "16px 0 8px", textTransform: "uppercase" }}>FIGLI ({figli.length})</div>
      {figli.map((f, i) => (
        <Card key={i} style={{ borderLeft: `3px solid ${specieColor(riproduttore.specie)}` }}>
          <div style={{ fontWeight: 700, color: C.primary, marginBottom: 8 }}>Figlio #{i + 1}</div>
          <Field label="BDN / Matricola" value={f.bdn} onChange={v => aggiornaFiglio(i, "bdn", v)} />
          <Field label="Nome" value={f.nome} onChange={v => aggiornaFiglio(i, "nome", v)} />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><Field label="Sesso" value={f.sesso} onChange={v => aggiornaFiglio(i, "sesso", v)} options={[{ value: "M", label: "♂ Maschio" }, { value: "F", label: "♀ Femmina" }]} /></div>
            <div style={{ flex: 1 }}><Field label="Vivo" value={f.vivo ? "si" : "no"} onChange={v => aggiornaFiglio(i, "vivo", v === "si")} options={[{ value: "si", label: "✓ Vivo" }, { value: "no", label: "✗ Deceduto" }]} /></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><Field label="Peso nascita (kg)" value={f.peso_nascita} onChange={v => aggiornaFiglio(i, "peso_nascita", v)} type="number" /></div>
            <div style={{ flex: 1 }}><Field label="Data nascita" value={f.data_nascita} onChange={v => aggiornaFiglio(i, "data_nascita", v)} type="date" /></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><Field label="Peso svezzamento (kg)" value={f.peso_svezzamento} onChange={v => aggiornaFiglio(i, "peso_svezzamento", v)} type="number" /></div>
            <div style={{ flex: 1 }}><Field label="Data svezzamento" value={f.data_svezzamento} onChange={v => aggiornaFiglio(i, "data_svezzamento", v)} type="date" /></div>
          </div>
          {f.peso_nascita && f.peso_svezzamento && f.data_nascita && f.data_svezzamento && (
            <div style={{ background: C.blue + "15", borderRadius: 8, padding: "6px 10px", fontSize: 13, fontWeight: 600, color: C.blue }}>
              📈 IPG stimato: {((parseFloat(f.peso_svezzamento) - parseFloat(f.peso_nascita)) / daysBetween(f.data_nascita, f.data_svezzamento) * 1000).toFixed(0)} g/giorno
            </div>
          )}
        </Card>
      ))}
      <Btn label="+ Aggiungi figlio" onClick={addFiglio} variant="outline" small icon="➕" />

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <Btn label="Salva parto" onClick={salva} variant="success" icon="✓" />
        <Btn label="Annulla" onClick={onCancel} variant="ghost" />
      </div>
    </div>
  );
}

// ─── RANKING RIPRODUTTORI ────────────────────────────────────────────────────
function Ranking({ data, onSeleziona }) {
  const [filtroSpecie, setFiltroSpecie] = useState("tutti");
  const [filtroSesso, setFiltroSesso] = useState("tutti");

  const ranked = useMemo(() => {
    return data.riproduttori
      .filter(r => r.stato === "attivo")
      .filter(r => filtroSpecie === "tutti" || r.specie === filtroSpecie)
      .filter(r => filtroSesso === "tutti" || r.sesso === filtroSesso)
      .map(r => {
        const indice = calcolaIndice(r.id, data);
        const score = calcolaScore(indice, r.specie);
        return { ...r, indice, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [data, filtroSpecie, filtroSesso]);

  return (
    <div style={{ padding: "16px 16px 80px" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>🏆 Ranking Genetico</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Classifica riproduttori per indice di selezione</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {["tutti", "bovino", "suino", "ovino"].map(s => (
          <button key={s} onClick={() => setFiltroSpecie(s)} style={{ background: filtroSpecie === s ? C.primary : C.card, color: filtroSpecie === s ? "#FFF" : C.muted, border: `1.5px solid ${filtroSpecie === s ? C.primary : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            {s === "tutti" ? "Tutti" : specieIcon(s) + " " + s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        {["tutti", "M", "F"].map(s => (
          <button key={s} onClick={() => setFiltroSesso(s)} style={{ background: filtroSesso === s ? C.blue : C.card, color: filtroSesso === s ? "#FFF" : C.muted, border: `1.5px solid ${filtroSesso === s ? C.blue : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {s === "tutti" ? "♂♀" : s === "M" ? "♂" : "♀"}
          </button>
        ))}
      </div>

      {ranked.map((r, idx) => (
        <Card key={r.id} onClick={() => onSeleziona(r)} style={{ cursor: "pointer", borderLeft: idx === 0 ? `4px solid ${C.gold}` : idx === 1 ? `4px solid ${C.silver}` : idx === 2 ? `4px solid ${C.bronze}` : `4px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Medal pos={idx + 1} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{specieIcon(r.specie)} {r.nome}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{r.bdn} · {r.razza}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                    <Badge label={r.sesso === "M" ? "♂ Maschio" : "♀ Femmina"} color={r.sesso === "M" ? C.blue : "#B5547A"} />
                    {r.indice && <Badge label={`${r.indice.nParti} parti`} color={C.primary} />}
                    {r.indice?.ipgMedio && <Badge label={`IPG ${r.indice.ipgMedio} g/d`} color={C.yellow} />}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <ScoreBar score={r.score} />
              </div>
              {r.indice && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: C.muted }}>🍼 {r.indice.natiPerParto}/parto</span>
                  <span style={{ fontSize: 12, color: r.indice.mortalita > 10 ? C.red : C.green }}>☠ {r.indice.mortalita}% mort.</span>
                  <span style={{ fontSize: 12, color: C.muted }}>📅 {r.indice.fertilita} parti/anno</span>
                </div>
              )}
              {!r.indice && <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontStyle: "italic" }}>Nessun dato produttivo ancora registrato</div>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── APP PRINCIPALE ──────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState("ranking"); // ranking | scheda | form_parto
  const [selectedRip, setSelectedRip] = useState(null);

  const addParto = ({ parto, figli }) => {
    const partoId = data.nextId.parti;
    const nuovoFigli = figli.map((f, i) => ({ ...f, id: data.nextId.figli + i, partoId }));
    setData(d => ({
      ...d,
      parti: [...d.parti, { ...parto, id: partoId }],
      figli: [...d.figli, ...nuovoFigli],
      nextId: { ...d.nextId, parti: partoId + 1, figli: d.nextId.figli + nuovoFigli.length },
    }));
    setView("scheda");
  };

  if (view === "form_parto" && selectedRip) {
    return <FormParto riproduttore={selectedRip} data={data} onSave={addParto} onCancel={() => setView("scheda")} />;
  }

  if (view === "scheda" && selectedRip) {
    return (
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
        <SchedaRiproduttore
          rip={selectedRip}
          data={data}
          onBack={() => setView("ranking")}
          onAddParto={rip => { setSelectedRip(rip); setView("form_parto"); }}
        />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      <Ranking data={data} onSeleziona={r => { setSelectedRip(r); setView("scheda"); }} />
    </div>
  );
}
