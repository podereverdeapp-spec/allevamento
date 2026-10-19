// v141 — formattazione dei numeri usata dalle pagine «Razioni Bovini» copiate dal programma
// di Contabilità Industriale: stessa funzione del file parsingUtils.js del programma (versione 244).
export function formattaNumero(n, decimali = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString("it-IT", { minimumFractionDigits: decimali, maximumFractionDigits: decimali, useGrouping: true });
}
