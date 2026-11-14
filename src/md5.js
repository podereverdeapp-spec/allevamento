// v148 — impronta MD5 di un file (32 caratteri minuscoli), calcolata nel telefono.
// Il browser non ha l'MD5 tra le sue funzioni crittografiche (ha SHA-256): qui c'è
// il calcolo standard (RFC 1321), senza librerie esterne. Serve al programma di
// contabilità per riconoscere lo stesso PDF salvato due volte.
const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
const K = new Int32Array(64);
for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;

export function md5(dati) {
  const byte = dati instanceof Uint8Array ? dati : new Uint8Array(dati);
  const n = byte.length;
  const totale = (((n + 8) >> 6) + 1) << 6;          // multiplo di 64 byte
  const buf = new Uint8Array(totale);
  buf.set(byte);
  buf[n] = 0x80;
  const bit = n * 8;
  const dv = new DataView(buf.buffer);
  dv.setUint32(totale - 8, bit >>> 0, true);
  dv.setUint32(totale - 4, Math.floor(bit / 4294967296), true);
  let a0 = 0x67452301 | 0, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476 | 0;
  const M = new Int32Array(16);
  for (let off = 0; off < totale; off += 64) {
    for (let j = 0; j < 16; j++) M[j] = dv.getInt32(off + j * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) | 0;
      A = D; D = C; C = B;
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) | 0;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }
  let hex = "";
  for (const v of [a0, b0, c0, d0]) for (let k = 0; k < 4; k++) hex += ((v >>> (k * 8)) & 255).toString(16).padStart(2, "0");
  return hex;
}
