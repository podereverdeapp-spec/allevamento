// v148 — scanner dei documenti per «Spese pagate».
// Riprende il prototipo approvato (public/prova-scanner-app.html del Tenente Fatture, 11–12/11/2026):
// - bordi trovati con OpenCV (file public/opencv-4.10.0.js, già pubblicato con la v146);
// - pagina raddrizzata con un calcolo proprio (omografia), senza OpenCV;
// - bianco e nero con soglia locale (regge ombre e luce storta);
// - PDF scritto a mano con le pagine in JPEG, nessuna libreria;
// - lettura del totale con Tesseract (file in public/ocr, niente internet).
// Niente qui scrive nel database.
import { cercaTotale } from "./spese_lettura";

export const LATO_LAVORO = 2400;   // la foto si riduce a questo lato lungo prima di raddrizzarla
const LATO_RICERCA = 700;          // lato lungo usato per trovare i bordi
export const DPI = 200;            // pagina PDF: 200 pixel = 1 pollice

// ---------------------------------------------------------------- caricamento di file dalla cartella public
function caricaScript(src) {
  return new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = ok;
    s.onerror = () => ko(new Error("file " + src + " non caricato"));
    document.head.appendChild(s);
  });
}

// ATTENZIONE: il modulo OpenCV ha un suo metodo «then». Se lo si passa così com'è a una Promise,
// la Promise prova a «seguirlo» all'infinito e la pagina si blocca. Per questo la Promise
// restituisce una scatola { cv } e non il modulo.
let promessaCv = null;
function scatolaCv() {
  if (promessaCv) return promessaCv;
  promessaCv = new Promise((ok, ko) => {
    let finito = false;
    const fine = (m) => { if (finito) return; finito = true; window.cv = m; ok({ cv: m }); };
    const prova = () => {
      const c = window.cv;
      if (!c) return ko(new Error("riconoscimento dei bordi non disponibile"));
      if (c.Mat && c.getBuildInformation) return fine(c);
      if (c instanceof Promise) return c.then((m) => fine(m), () => ko(new Error("avvio non riuscito")));
      c.onRuntimeInitialized = () => fine(window.cv);
    };
    if (window.cv) prova();
    else caricaScript("/opencv-4.10.0.js").then(prova, ko);
    setTimeout(() => { if (!finito) ko(new Error("riconoscimento dei bordi troppo lento")); }, 60000);
  });
  promessaCv.catch(() => { promessaCv = null; });
  return promessaCv;
}
// restituisce una Promise di { cv } (mai il modulo da solo: vedi sopra)
export const caricaOpenCV = scatolaCv;

// ---------------------------------------------------------------- foto → canvas ridotto
export async function apriFoto(file, lato = LATO_LAVORO) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();                 // il browser gira la foto secondo l'orientamento della fotocamera
    const w0 = img.naturalWidth, h0 = img.naturalHeight;
    const k = Math.min(1, lato / Math.max(w0, h0));
    const c = document.createElement("canvas");
    c.width = Math.round(w0 * k); c.height = Math.round(h0 * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally { URL.revokeObjectURL(url); }
}

export function angoliTuttaFoto(foto) {
  const w = foto.width, h = foto.height, m = Math.round(Math.min(w, h) * 0.04);
  return [[m, m], [w - m, m], [w - m, h - m], [m, h - m]];
}

function ordina(p) {                    // alto-sinistra, alto-destra, basso-destra, basso-sinistra
  const s = p.map(([x, y]) => x + y), d = p.map(([x, y]) => y - x);
  return [p[s.indexOf(Math.min(...s))], p[d.indexOf(Math.min(...d))], p[s.indexOf(Math.max(...s))], p[d.indexOf(Math.max(...d))]];
}
function areaQuad(q) { let a = 0; for (let i = 0; i < 4; i++) { const [x1, y1] = q[i], [x2, y2] = q[(i + 1) % 4]; a += x1 * y2 - x2 * y1; } return Math.abs(a) / 2; }

// Restituisce { angoli, sicuro } oppure null se non trova niente.
export function trovaAngoli(cv, foto) {
  const k = Math.min(1, LATO_RICERCA / Math.max(foto.width, foto.height));
  const c = document.createElement("canvas");
  c.width = Math.round(foto.width * k); c.height = Math.round(foto.height * k);
  c.getContext("2d").drawImage(foto, 0, 0, c.width, c.height);
  const areaFoto = c.width * c.height;
  const da = [];
  const nuova = () => { const m = new cv.Mat(); da.push(m); return m; };
  let migliore = null, sicuro = false;
  try {
    const src = cv.imread(c); da.push(src);
    const grigio = nuova(); cv.cvtColor(src, grigio, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(grigio, grigio, new cv.Size(5, 5), 0);
    const nucleo = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5)); da.push(nucleo);
    const prove = [];
    for (const [lo, hi] of [[40, 120], [15, 45], [80, 200]]) { const b = nuova(); cv.Canny(grigio, b, lo, hi); cv.dilate(b, b, nucleo); prove.push([b, "contorni"]); }
    const chiaro = nuova(); cv.threshold(grigio, chiaro, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.morphologyEx(chiaro, chiaro, cv.MORPH_CLOSE, nucleo); prove.push([chiaro, "zona chiara"]);
    let riserva = null;
    for (const [img, nome] of prove) {
      const contorni = new cv.MatVector(), gerarchia = nuova();
      cv.findContours(img, contorni, gerarchia, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      for (let i = 0; i < contorni.size(); i++) {
        const cnt = contorni.get(i);
        const a = cv.contourArea(cnt);
        if (a < areaFoto * 0.08 || a > areaFoto * 0.985) { cnt.delete(); continue; }
        const peri = cv.arcLength(cnt, true);
        let q = null;
        for (const eps of [0.02, 0.035, 0.05]) {
          const appr = new cv.Mat(); cv.approxPolyDP(cnt, appr, eps * peri, true);
          if (appr.rows === 4 && cv.isContourConvex(appr)) { q = []; for (let j = 0; j < 4; j++) q.push([appr.data32S[j * 2], appr.data32S[j * 2 + 1]]); }
          appr.delete(); if (q) break;
        }
        if (q) {
          const aq = areaQuad(q);
          if (!migliore || aq > migliore.area) { migliore = { q, area: aq }; sicuro = true; }
        } else if (nome === "contorni" && (!riserva || a > riserva.area)) {
          const r = cv.minAreaRect(cnt); riserva = { q: cv.RotatedRect.points(r).map((p) => [p.x, p.y]), area: a };
        }
        cnt.delete();
      }
      contorni.delete();
    }
    if (!migliore && riserva) { migliore = riserva; sicuro = false; }
  } catch (e) {
    migliore = null;
  } finally { da.forEach((m) => m.delete()); }
  if (!migliore) return null;
  const angoli = ordina(migliore.q.map(([x, y]) => [Math.max(0, Math.min(foto.width, x / k)), Math.max(0, Math.min(foto.height, y / k))]));
  return { angoli, sicuro };
}

// ---------------------------------------------------------------- raddrizzare
function risolvi(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-12) throw new Error("angoli non validi (tre sulla stessa linea)");
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function omografia(da, a) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = da[i], [u, v] = a[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  return [...risolvi(A, b), 1];
}
export function raddrizza(foto, angoli) {
  const [tl, tr, br, bl] = angoli;
  const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  let W = Math.max(d(tl, tr), d(bl, br)), H = Math.max(d(tl, bl), d(tr, br));
  if (W < 20 || H < 20) throw new Error("angoli troppo vicini");
  // v149: le pagine piccole (meno di 1.800 pixel sul lato lungo) si ingrandiscono, così il bianco e nero
  // e la lettura del testo restano nitidi; le grandi si riducono a 2.400 pixel come nella 148
  const lato = Math.max(W, H);
  const k = lato > LATO_LAVORO ? LATO_LAVORO / lato : lato < 1800 ? Math.min(2.5, 1800 / lato) : 1;
  W = Math.round(W * k); H = Math.round(H * k);
  const m = omografia([[0, 0], [W, 0], [W, H], [0, H]], angoli);
  const fw = foto.width, fh = foto.height;
  const sorg = foto.getContext("2d").getImageData(0, 0, fw, fh).data;
  const out = new ImageData(W, H), o = out.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const z = m[6] * x + m[7] * y + 1, sx = (m[0] * x + m[1] * y + m[2]) / z, sy = (m[3] * x + m[4] * y + m[5]) / z;
    const x0 = Math.max(0, Math.min(fw - 2, Math.floor(sx))), y0 = Math.max(0, Math.min(fh - 2, Math.floor(sy)));
    const ax = Math.max(0, Math.min(1, sx - x0)), ay = Math.max(0, Math.min(1, sy - y0));
    const i00 = (y0 * fw + x0) * 4, i10 = i00 + 4, i01 = i00 + fw * 4, i11 = i01 + 4, j = (y * W + x) * 4;
    for (let c = 0; c < 3; c++) o[j + c] = (sorg[i00 + c] * (1 - ax) + sorg[i10 + c] * ax) * (1 - ay) + (sorg[i01 + c] * (1 - ax) + sorg[i11 + c] * ax) * ay;
    o[j + 3] = 255;
  }
  return out;
}

// v149 — ricevute del POS e documenti rifotografati: bordi trovati da soli, pagina raddrizzata a colori
// (canvas). Se OpenCV non c'è o non trova i bordi, restituisce la foto così com'è.
export async function raddrizzaDaSolo(foto) {
  let ang = null;
  try { const x = await caricaOpenCV(); const r = trovaAngoli(x.cv, foto); ang = r && r.sicuro ? r.angoli : null; } catch (e) { ang = null; }
  if (!ang) return foto;
  const d = raddrizza(foto, ang);
  const c = document.createElement("canvas"); c.width = d.width; c.height = d.height; c.getContext("2d").putImageData(d, 0, 0);
  return c;
}

// bianco e nero: confronto con la media dei punti vicini. Restituisce un canvas.
export function biancoNero(src) {
  const W = src.width, H = src.height, s = src.data;
  const out = new ImageData(W, H), o = out.data;
  const g = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) g[i] = 0.299 * s[i * 4] + 0.587 * s[i * 4 + 1] + 0.114 * s[i * 4 + 2];
  const I = new Float64Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) { let r = 0; for (let x = 0; x < W; x++) { r += g[y * W + x]; I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + r; } }
  const R = Math.max(7, Math.round(Math.min(W, H) / 40));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const x1 = Math.max(0, x - R), x2 = Math.min(W, x + R + 1), y1 = Math.max(0, y - R), y2 = Math.min(H, y + R + 1);
    const media = (I[y2 * (W + 1) + x2] - I[y1 * (W + 1) + x2] - I[y2 * (W + 1) + x1] + I[y1 * (W + 1) + x1]) / ((x2 - x1) * (y2 - y1));
    const v = g[y * W + x] < media - 12 ? 0 : 255;
    const j = (y * W + x) * 4; o[j] = o[j + 1] = o[j + 2] = v; o[j + 3] = 255;
  }
  const c = document.createElement("canvas"); c.width = W; c.height = H; c.getContext("2d").putImageData(out, 0, 0);
  return c;
}

// ---------------------------------------------------------------- JPEG e PDF
export const jpegDa = (canvas, q) => new Promise((ok, ko) => canvas.toBlob(async (b) => b ? ok(new Uint8Array(await b.arrayBuffer())) : ko(new Error("JPEG non creato")), "image/jpeg", q));

// pagine: [{ jpeg: Uint8Array, w, h }] → Uint8Array del PDF
export function creaPdf(pagine) {
  const enc = new TextEncoder(), parti = [], pos = [];
  let lung = 0;
  const metti = (x) => { const b = typeof x === "string" ? enc.encode(x) : x; parti.push(b); lung += b.length; };
  const ogg = (n, corpo) => { pos[n] = lung; metti(`${n} 0 obj\n`); corpo(); metti("\nendobj\n"); };
  metti("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const n = pagine.length, kids = pagine.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
  ogg(1, () => metti("<< /Type /Catalog /Pages 2 0 R >>"));
  ogg(2, () => metti(`<< /Type /Pages /Kids [${kids}] /Count ${n} >>`));
  pagine.forEach((p, i) => {
    const np = 3 + i * 3, nc = np + 1, ni = np + 2;
    const W = +(p.w * 72 / DPI).toFixed(2), H = +(p.h * 72 / DPI).toFixed(2);
    const cont = `q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`;
    ogg(np, () => metti(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${ni} 0 R >> >> /Contents ${nc} 0 R >>`));
    ogg(nc, () => { metti(`<< /Length ${cont.length} >>\nstream\n${cont}\nendstream`); });
    ogg(ni, () => { metti(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`); metti(p.jpeg); metti("\nendstream"); });
  });
  const tot = 3 + n * 3, xref = lung;
  let x = `xref\n0 ${tot}\n0000000000 65535 f \n`;
  for (let i = 1; i < tot; i++) x += String(pos[i]).padStart(10, "0") + " 00000 n \n";
  metti(x + `trailer\n<< /Size ${tot} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  const out = new Uint8Array(lung); let o = 0; for (const b of parti) { out.set(b, o); o += b.length; }
  return out;
}

// ---------------------------------------------------------------- importi
// «1.082,00» «438,70» «52.20» «12» → centesimi; null se non è un importo
export function centesimi(t) {
  const s = String(t || "").trim().replace(/€|eur/gi, "").replace(/\s/g, "");
  let m = s.match(/^(\d{1,3}(?:[.']\d{3})+|\d+)[,.](\d{1,2})$/);
  if (m) return parseInt(m[1].replace(/[.']/g, ""), 10) * 100 + parseInt(m[2].padEnd(2, "0"), 10);
  m = s.match(/^(\d{1,3}(?:[.']\d{3})+|\d+)$/);
  if (m) return parseInt(m[1].replace(/[.']/g, ""), 10) * 100;
  return null;
}
export const euro = (c) => (c / 100).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

// ---------------------------------------------------------------- lettura del testo (Tesseract)
let lettoreOcr = null;
async function lettore() {
  if (lettoreOcr) return lettoreOcr;
  if (!window.Tesseract) await caricaScript("/ocr/tesseract.min.js");
  const base = new URL("/ocr/", window.location.href).href;
  lettoreOcr = await window.Tesseract.createWorker("ita", 1, { workerPath: base + "worker.min.js", corePath: base, langPath: base, gzip: true, workerBlobURL: false });
  return lettoreOcr;
}
// v149 — testo di un'immagine (ImageData o canvas), ridotta a 2.000 pixel, grigi e contrasto 1,4.
// Le letture si fanno una dopo l'altra (un solo lettore).
let coda = Promise.resolve();
// modo «sparso»: testo sparso (Tesseract, modo 11), utile per le ultime 4 cifre della carta sulle ricevute del POS
// (con il modo normale la riga «CARTA ****1894» si perde o si legge male: prova del 20/11)
export function leggiTesto(sorgente, modo = "normale") {
  const lavoro = coda.then(async () => {
    let tela = sorgente;
    if (!(sorgente instanceof HTMLCanvasElement)) {
      tela = document.createElement("canvas"); tela.width = sorgente.width; tela.height = sorgente.height;
      tela.getContext("2d").putImageData(sorgente, 0, 0);
    }
    // tra 1.800 e 2.000 pixel sul lato lungo: le immagini grandi si riducono, le piccole (ricevute, schermate) si ingrandiscono
    const lato = Math.max(tela.width, tela.height);
    const k = lato > 2000 ? 2000 / lato : lato < 1800 ? Math.min(2.5, 1800 / lato) : 1;
    const c = document.createElement("canvas"); c.width = Math.round(tela.width * k); c.height = Math.round(tela.height * k);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.filter = "grayscale(1) contrast(1.4)"; g.drawImage(tela, 0, 0, c.width, c.height);
    const w = await lettore();
    await w.setParameters({ tessedit_pageseg_mode: modo === "sparso" ? "11" : "3" });
    const { data } = await w.recognize(c);
    return data.text || "";
  });
  coda = lavoro.catch(() => {});
  return lavoro;
}
// compatibilità con la 148
export async function leggiTotale(dritta) { return cercaTotale(await leggiTesto(dritta)); }

// ---------------------------------------------------------------- PDF caricato dal telefono (pdf.js, in public/pdfjs)
let promessaPdf = null;
function pdfjs() {
  if (!promessaPdf) {
    promessaPdf = (window.pdfjsLib ? Promise.resolve() : caricaScript("/pdfjs/pdf.min.js")).then(() => {
      const lib = window.pdfjsLib;
      if (!lib) throw new Error("lettore dei PDF non disponibile");
      lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
      return { lib };
    });
    promessaPdf.catch(() => { promessaPdf = null; });
  }
  return promessaPdf;
}
// Restituisce [{ testo, tela }] per pagina: testo dal PDF se c'è; tela = disegno della pagina (per vederla e,
// se il PDF non ha testo, per leggerla con Tesseract). Al massimo 10 pagine.
export async function leggiPdf(byte) {
  const { lib } = await pdfjs();
  const doc = await lib.getDocument({ data: byte.slice(0) }).promise;
  const pagine = [];
  for (let n = 1; n <= Math.min(doc.numPages, 10); n++) {
    const pag = await doc.getPage(n);
    const cont = await pag.getTextContent();
    // righe: si raggruppano i pezzi di testo con la stessa altezza nella pagina
    const perRiga = new Map();
    for (const it of cont.items) {
      if (!it.str || !it.transform) continue;
      const y = Math.round(it.transform[5]);
      const chiave = [...perRiga.keys()].find((k) => Math.abs(k - y) <= 2);
      const k = chiave !== undefined ? chiave : y;
      if (!perRiga.has(k)) perRiga.set(k, []);
      perRiga.get(k).push({ x: it.transform[4], s: it.str });
    }
    const testo = [...perRiga.entries()].sort((a, b) => b[0] - a[0])
      .map(([, pezzi]) => pezzi.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ").replace(/\s+/g, " ").trim())
      .filter(Boolean).join("\n");
    const vista = pag.getViewport({ scale: 1 });
    const scala = Math.min(2.5, 1600 / Math.max(vista.width, vista.height));
    const v = pag.getViewport({ scale: scala });
    const tela = document.createElement("canvas"); tela.width = Math.round(v.width); tela.height = Math.round(v.height);
    const g = tela.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, tela.width, tela.height);
    await pag.render({ canvasContext: g, viewport: v }).promise;
    pagine.push({ testo, tela });
  }
  return { pagine, totPagine: doc.numPages };
}

// ---------------------------------------------------------------- codice QR (qrcode-generator, in public/qr)
let promessaQr = null;
export function qrImmagine(testo) {
  if (!promessaQr) {
    promessaQr = window.qrcode ? Promise.resolve() : caricaScript("/qr/qrcode.js");
    promessaQr.catch(() => { promessaQr = null; });
  }
  return promessaQr.then(() => {
    const q = window.qrcode;
    if (!q) throw new Error("generatore del codice QR non disponibile");
    if (q.stringToBytesFuncs && q.stringToBytesFuncs["UTF-8"]) q.stringToBytes = q.stringToBytesFuncs["UTF-8"];
    const codice = q(0, "M");
    codice.addData(testo, "Byte");
    codice.make();
    return codice.createDataURL(6, 12);
  });
}
