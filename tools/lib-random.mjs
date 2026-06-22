// ─────────────────────────────────────────────────────────────
// lib-random.mjs  —  Generator SOAL PLACEHOLDER (random tapi BEKERJA)
//
// Menghasilkan soal pilihan ganda dengan kunci jawaban benar + pembahasan,
// agar setiap halaman latihan langsung berfungsi sebelum diisi soal asli
// dari bank LaTeX. Deterministik (seeded) → regenerate tidak mengubah git
// selama parameter sama.
//
// CATATAN: ini SOAL SEMENTARA. Ganti dengan soal asli via pipeline
// import-latex.mjs bila sudah siap.
// ─────────────────────────────────────────────────────────────

function seed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return (h ^ (h >>> 16)) >>> 0;
}
function mulberry32(a) {
  return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function makeOne(rng, level) {
  const r = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  let q, val, p;
  const pools = {
    Beginner: ['add', 'sub', 'mul'],
    Intermediate: ['solve', 'evalf', 'mul2'],
    Expert: ['solve2', 'quad', 'evalf2'],
  };
  const pool = pools[level] || pools.Beginner;
  const kind = pool[r(0, pool.length - 1)];

  if (kind === 'add') { const a = r(11, 89), b = r(11, 89); q = `Hasil dari $${a} + ${b}$ adalah …`; val = a + b; p = `$${a}+${b}=${val}$.`; }
  else if (kind === 'sub') { const a = r(40, 99), b = r(10, 39); q = `Hasil dari $${a} - ${b}$ adalah …`; val = a - b; p = `$${a}-${b}=${val}$.`; }
  else if (kind === 'mul') { const a = r(3, 12), b = r(3, 12); q = `Hasil dari $${a} \\times ${b}$ adalah …`; val = a * b; p = `$${a}\\times${b}=${val}$.`; }
  else if (kind === 'solve') { const a = r(2, 6), x = r(2, 12), b = r(1, 20); const c = a * x + b; q = `Nilai $x$ yang memenuhi $${a}x + ${b} = ${c}$ adalah …`; val = x; p = `$${a}x=${c}-${b}=${a * x}$, maka $x=${x}$.`; }
  else if (kind === 'evalf') { const a = r(2, 7), b = r(1, 9), k = r(2, 8); q = `Diketahui $f(x)=${a}x+${b}$. Nilai $f(${k})$ adalah …`; val = a * k + b; p = `$f(${k})=${a}\\cdot${k}+${b}=${val}$.`; }
  else if (kind === 'mul2') { const a = r(11, 25), b = r(3, 9); q = `Hasil dari $${a} \\times ${b}$ adalah …`; val = a * b; p = `$${a}\\times${b}=${val}$.`; }
  else if (kind === 'solve2') { const a = r(2, 8), x = r(-9, 9), b = r(-15, 15); const c = a * x + b; const bs = b < 0 ? `- ${-b}` : `+ ${b}`; q = `Nilai $x$ dari $${a}x ${bs} = ${c}$ adalah …`; val = x; p = `$${a}x=${c}-(${b})=${a * x}$, maka $x=${x}$.`; }
  else if (kind === 'quad') { const x = r(2, 9); q = `Nilai dari $${x}^2$ adalah …`; val = x * x; p = `$${x}^2=${val}$.`; }
  else { const a = r(2, 6), b = r(-8, 8), k = r(2, 9); q = `Diketahui $g(x)=${a}x^2 ${b < 0 ? '- ' + (-b) : '+ ' + b}$. Nilai $g(${k})$ adalah …`; val = a * k * k + b; p = `$g(${k})=${a}\\cdot${k}^2+(${b})=${val}$.`; }

  // opsi: kunci + 3 pengecoh unik
  const set = new Set([val]);
  let guard = 0;
  while (set.size < 4 && guard++ < 50) { const d = val + r(-9, 9); if (d !== val) set.add(d); }
  const arr = [...set];
  for (let i = arr.length - 1; i > 0; i--) { const j = r(0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return { type: 'pg', q, opts: arr.map(v => `$${v}$`), jawab: arr.indexOf(val), p };
}

// genSoal(seedStr, n, level) → array soal
export function genSoal(seedStr, n, level) {
  const rng = mulberry32(seed(seedStr));
  const out = [];
  for (let i = 0; i < n; i++) {
    // variasikan level untuk ujian/kilat (campuran)
    const lv = level === 'Campuran'
      ? ['Beginner', 'Intermediate', 'Expert'][i % 3]
      : level;
    out.push(makeOne(rng, lv));
  }
  return out;
}
