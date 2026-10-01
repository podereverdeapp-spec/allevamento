// ============================================================================
// AVVISO PESO VIVO — v124
// Quando si registra l'uscita di un animale (macellato, venduto, trasferito)
// ricorda di pesarlo vivo: riquadro ben visibile nel modulo e, al salvataggio
// senza peso vivo, una domanda di conferma.
// ============================================================================
import { t } from "./i18n";

export const MOTIVI_PESO_VIVO = ["Macellato","Macellazione","Venduto vivo","Trasferito","Altro"];

export function AvvisoPesoVivo({ motivo, peso }) {
  if (motivo && !MOTIVI_PESO_VIVO.includes(motivo)) return null;
  const fatto = peso !== undefined && peso !== null && String(peso).trim() !== "";
  return (
    <div style={{ background: fatto ? "#E8F5E9" : "#FFF3E0", border: `2px solid ${fatto ? "#4A7C59" : "#E67E22"}`,
      borderRadius: 12, padding: "10px 12px", marginBottom: 12, fontSize: 15, fontWeight: 800,
      color: fatto ? "#4A7C59" : "#B9560F", textAlign: "center" }}>
      ⚖️ {fatto ? t("Peso vivo inserito") : t("Ricordati di pesare l'animale vivo!")}
    </div>
  );
}

// true = si puo' salvare
export function confermaPesoVivo(motivo, peso) {
  if (!MOTIVI_PESO_VIVO.includes(motivo)) return true;
  if (peso !== undefined && peso !== null && String(peso).trim() !== "") return true;
  return window.confirm(t("⚖️ Ricordati di pesare l'animale vivo!\n\nIl peso vivo non è stato inserito. Salvare comunque l'uscita?"));
}
