// ============================================================================
// MODELLI 4 — ABBINAMENTO DELLE USCITE — v123
// ----------------------------------------------------------------------------
// Quando un operatore registra l'uscita di un animale (o di un'unita' di un
// lotto suini), l'app cerca i modelli 4 gia' arrivati per quella specie con
// data di uscita vicina e chiede: "abbiniamo questa uscita a questo modello 4?".
// Per i capi con matricola (bovini, ovini con marca) se la matricola e' scritta
// nel modello 4 il documento viene proposto gia' selezionato.
// Gli abbinamenti stanno nella tabella modelli4_abbinamenti.
// ============================================================================
import { useState, useEffect } from "react";
import { t } from "./i18n";
import { supabase } from "./supabase";

const fData = d => d ? d.split("-").reverse().join("/") : "—";
export const SPECIE_MODELLI4 = { bovino:["Bovini"], suino:["Suini"], ovino:["Ovini","Ovicaprini","Caprini"] };
export const MOTIVI_CON_MODELLO4 = ["Macellato","Macellazione","Venduto vivo","Trasferito","Altro"];
const GIORNI = 10;   // finestra di ricerca intorno alla data di uscita

const spostaGiorni = (iso, n) => {
  const d = new Date((iso || new Date().toISOString().slice(0, 10)) + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

// Salva (o toglie) l'abbinamento di un animale / unita' di lotto
export async function salvaAbbinamento({ documentoId, animaleId = null, suinoLottoId = null }) {
  if (!animaleId && !suinoLottoId) return { error: null };
  const campo = animaleId ? "animale_id" : "suino_lotto_id";
  const id = animaleId || suinoLottoId;
  const { error: e1 } = await supabase.from("modelli4_abbinamenti").delete().eq(campo, id);
  if (e1) return { error: e1 };
  if (!documentoId) return { error: null };
  const { error } = await supabase.from("modelli4_abbinamenti").insert({ documento_id: documentoId, [campo]: id, numero_capi: 1 });
  return { error };
}

// Riquadro con i modelli 4 pronti per l'uscita che si sta registrando.
// valore: id del documento scelto (null = nessuno); onChange(id|null)
export function ProposteModello4({ specie, dataUscita, bdn, animaleId, suinoLottoId, valore, onChange }) {
  const [docs, setDocs] = useState(null);
  const [attuale, setAttuale] = useState(undefined);   // abbinamento gia' salvato
  const matricola = bdn ? String(bdn).replace(/\s/g, "").toUpperCase() : null;

  // abbinamento gia' esistente per questo capo
  useEffect(() => {
    let vivo = true;
    const campo = animaleId ? "animale_id" : suinoLottoId ? "suino_lotto_id" : null;
    if (!campo) { setAttuale(null); return; }
    supabase.from("modelli4_abbinamenti").select("documento_id").eq(campo, animaleId || suinoLottoId).maybeSingle()
      .then(({ data }) => { if (vivo) setAttuale(data?.documento_id ?? null); });
    return () => { vivo = false; };
  }, [animaleId, suinoLottoId]);

  // modelli 4 della specie con data di uscita vicina
  useEffect(() => {
    let vivo = true;
    const elenco = SPECIE_MODELLI4[specie];
    if (!elenco || attuale === undefined) return;
    setDocs(null);
    supabase.from("modelli4_documenti")
      .select("id,numero_documento,data_uscita,numero_capi,specie,destinazione_tipo,destinatario,tipo_movimento,modelli4_capi(matricola,categoria,numero_capi),modelli4_abbinamenti(id,animale_id,suino_lotto_id)")
      .in("specie", elenco)
      .gte("data_uscita", spostaGiorni(dataUscita, -GIORNI))
      .lte("data_uscita", spostaGiorni(dataUscita, GIORNI))
      .order("data_uscita", { ascending: false })
      .then(({ data }) => {
        if (!vivo) return;
        const mio = a => (animaleId && a.animale_id === animaleId) || (suinoLottoId && a.suino_lotto_id === suinoLottoId);
        const lista = (data || [])
          .filter(d => !String(d.tipo_movimento || "").startsWith("Ingresso"))
          .map(d => {
            const ab = d.modelli4_abbinamenti || [];
            const altri = ab.filter(a => !mio(a)).length;
            const contiene = !!matricola && (d.modelli4_capi || []).some(c => c.matricola === matricola);
            return { ...d, abbinati: altri, liberi: (d.numero_capi || 0) - altri, contiene };
          })
          .filter(d => d.liberi > 0 || d.contiene || d.id === attuale)
          .sort((a, b) => (b.contiene - a.contiene)
            || Math.abs(new Date(a.data_uscita) - new Date(dataUscita || Date.now())) - Math.abs(new Date(b.data_uscita) - new Date(dataUscita || Date.now())));
        setDocs(lista);
        // proposta iniziale: quello gia' abbinato, altrimenti quello che contiene la matricola
        if (valore === undefined) {
          if (attuale) onChange(attuale);
          else { const c = lista.find(d => d.contiene); onChange(c ? c.id : null); }
        }
      });
    return () => { vivo = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specie, dataUscita, matricola, attuale]);

  if (!SPECIE_MODELLI4[specie]) return null;
  if (docs === null) return null;
  if (docs.length === 0) return (
    <div style={{ fontSize: 12, color: "#8B7355", marginBottom: 12 }}>
      📄 {t("Nessun modello 4 arrivato per questa specie intorno al {0}", { 0: fData(dataUscita) })}
    </div>
  );

  const voce = (sel, onClick, testa, sotto, colore = "#5C3D1E") => (
    <button onClick={onClick} type="button"
      style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 6, cursor: "pointer",
        border: `2px solid ${sel ? colore : "#D4C4A8"}`, background: sel ? colore + "14" : "#FFF",
        borderRadius: 10, padding: "8px 10px", fontSize: 13, color: "#2D1B0E" }}>
      <div style={{ fontWeight: 700 }}>{sel ? "◉ " : "○ "}{testa}</div>
      {sotto && <div style={{ fontSize: 12, color: "#8B7355", marginTop: 2 }}>{sotto}</div>}
    </button>
  );

  return (
    <div style={{ background: "#FFF8E1", border: "1.5px solid #D4A017", borderRadius: 12, padding: 12, marginBottom: 12 }}>
      <div style={{ fontWeight: 800, color: "#5C3D1E", fontSize: 14, marginBottom: 4 }}>📄 {t("Modello 4 pronto per questa uscita")}</div>
      <div style={{ fontSize: 12, color: "#8B7355", marginBottom: 8 }}>{t("Abbiniamo questa uscita a uno di questi modelli 4?")}</div>
      {docs.map(d => {
        const cat = [...new Set((d.modelli4_capi || []).filter(c => c.categoria).map(c => `${c.categoria} ${c.numero_capi}`))].join(", ");
        return voce(valore === d.id, () => onChange(d.id),
          `${fData(d.data_uscita)} · ${d.numero_capi} ${t("capi")}${cat ? " (" + cat + ")" : ""} → ${d.destinatario || "—"}`,
          [d.numero_documento,
           t("abbinati {0} di {1}", { 0: d.abbinati, 1: d.numero_capi }),
           d.contiene ? "✅ " + t("questa matricola è nel modello 4") : null].filter(Boolean).join(" · "),
          d.contiene ? "#4A7C59" : "#5C3D1E");
      })}
      {voce(valore === null, () => onChange(null), t("Nessun modello 4"), null, "#8B7355")}
    </div>
  );
}
