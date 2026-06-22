// ─────────────────────────────────────────────────────────────
// tikz-to-svg.mjs  —  Konversi grafik fungsi TikZ/pgfplots → SVG bertema
//
// Menangani pola umum bank soal: sumbu (\draw[->]), grid, kurva fungsi
// (plot(\x,{EKSPRESI}) + domain), dan titik bertanda (\filldraw .. node).
// Output SVG memakai CSS var (--teal/--text/--border) → otomatis ikut
// tema gelap/terang situs. Dipanggil saat build (statis, tajam, SEO-friendly).
//
// CLI:  node tools/tikz-to-svg.mjs content/raw/fungsi-kuadrat.json
//       → isi figures[].svg + tulis preview HTML untuk dicek mata.
//
// export: tikzToSvg(tikzCode) → string SVG
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from 'node:fs';

const num = /-?\d+(?:\.\d+)?/.source;

// konversi pangkat a^b → Math.pow(a,b) (hindari masalah presedensi unary minus
// pada operator ** di JS, mis. -(x-3)^2 yang ilegal sebagai -(x-3)**2)
function toPow(s) {
  let i;
  while ((i = s.indexOf('^')) !== -1) {
    // eksponen (kanan): bilangan atau (...)
    let r = i + 1, exp, rEnd;
    if (s[r] === '(') { let depth = 0, k = r; do { if (s[k] === '(') depth++; else if (s[k] === ')') depth--; k++; } while (depth > 0 && k < s.length); exp = s.slice(r, k); rEnd = k; }
    else { let k = r; while (k < s.length && /[\d.]/.test(s[k])) k++; exp = s.slice(r, k); rEnd = k; }
    // basis (kiri): grup (...) atau bilangan/x
    let l = i - 1, base, lStart;
    if (s[l] === ')') { let depth = 0, k = l; do { if (s[k] === ')') depth++; else if (s[k] === '(') depth--; k--; } while (depth > 0 && k >= 0); lStart = k + 1; base = s.slice(lStart, i); }
    else { let k = l; while (k >= 0 && /[\d.x]/.test(s[k])) k--; lStart = k + 1; base = s.slice(lStart, i); }
    s = s.slice(0, lStart) + `Math.pow(${base},${exp})` + s.slice(rEnd);
  }
  return s;
}

// ekspresi tikz → fungsi JS
function compileExpr(expr) {
  // validasi karakter mentah (sebelum transform)
  if (/[^-+*/^().\s\\x0-9e]/i.test(expr)) throw new Error('ekspresi tak dikenal: ' + expr);
  const js = toPow(expr.replace(/\\x/g, 'x').replace(/\\,/g, ''));
  // eslint-disable-next-line no-new-func
  return new Function('x', `return (${js});`);
}

function cleanLabel(s) {
  return (s || '')
    .replace(/\\small|\\footnotesize|\\tiny|\\large/g, '')
    .replace(/\$/g, '')
    .replace(/\\;/g, ' ')
    .trim();
}

export function tikzToSvg(tikz, opts = {}) {
  const W = opts.width || 320, H = opts.height || 240, pad = 26;

  // ── bounds: utamakan grid, lalu sumbu ──
  let xmin, xmax, ymin, ymax;
  const grid = tikz.match(new RegExp(`\\(\\s*(${num}),\\s*(${num})\\)\\s*grid\\s*\\(\\s*(${num}),\\s*(${num})\\)`));
  const axes = [...tikz.matchAll(new RegExp(`\\\\draw\\[->\\][^\\(]*\\(\\s*(${num}),\\s*(${num})\\)\\s*--\\s*\\(\\s*(${num}),\\s*(${num})\\)`, 'g'))];
  if (grid) {
    xmin = +grid[1]; ymin = +grid[2]; xmax = +grid[3]; ymax = +grid[4];
  } else {
    for (const a of axes) {
      const [x1, y1, x2, y2] = [+a[1], +a[2], +a[3], +a[4]];
      if (Math.abs(y1 - y2) < 1e-9) { xmin = Math.min(x1, x2); xmax = Math.max(x1, x2); }
      if (Math.abs(x1 - x2) < 1e-9) { ymin = Math.min(y1, y2); ymax = Math.max(y1, y2); }
    }
  }
  if (xmin === undefined) { xmin = -5; xmax = 5; ymin = -5; ymax = 5; }

  const sx = (W - 2 * pad) / (xmax - xmin);
  const sy = (H - 2 * pad) / (ymax - ymin);
  const X = x => pad + (x - xmin) * sx;
  const Y = y => H - pad - (y - ymin) * sy;

  // ── kurva fungsi ──
  const domains = [...tikz.matchAll(new RegExp(`domain=(${num}):(${num})`, 'g'))];
  // cari prefiks plot(\x,{ lalu baca manual sampai } (anti-rapuh thd isi ekspresi)
  const exprs = [];
  const prefix = /plot\s*\(\s*\\x\s*,\s*\{/g;
  let pm;
  while ((pm = prefix.exec(tikz)) !== null) {
    const start = pm.index + pm[0].length;
    let j = start;
    while (j < tikz.length && tikz[j] !== '}') j++;
    exprs.push(tikz.slice(start, j));
  }
  const curves = [];
  for (let i = 0; i < exprs.length; i++) {
    const a = domains[i] ? +domains[i][1] : xmin;
    const b = domains[i] ? +domains[i][2] : xmax;
    let f; try { f = compileExpr(exprs[i]); } catch { continue; }
    const pts = [];
    const N = 120;
    for (let k = 0; k <= N; k++) {
      const x = a + (b - a) * k / N;
      const y = f(x);
      if (!isFinite(y) || y < ymin - 2 || y > ymax + 2) { pts.push(null); continue; }
      pts.push(`${X(x).toFixed(1)},${Y(y).toFixed(1)}`);
    }
    // pecah polyline pada titik di luar layar
    let seg = [], paths = [];
    for (const p of pts) { if (p) seg.push(p); else { if (seg.length > 1) paths.push(seg.join(' ')); seg = []; } }
    if (seg.length > 1) paths.push(seg.join(' '));
    curves.push(paths);
  }

  // ── titik bertanda ──
  const points = [...tikz.matchAll(new RegExp(`\\\\filldraw[^\\(]*\\(\\s*(${num}),\\s*(${num})\\)\\s*circle[^;\\n]*?(?:node\\[[^\\]]*\\]\\s*\\{([^}]*)\\})?`, 'g'))]
    .map(m => ({ x: +m[1], y: +m[2], label: cleanLabel(m[3]) }));

  // ── susun SVG ──
  const parts = [];
  parts.push(`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="q-graph" role="img">`);
  parts.push(`<style>.q-graph .ax{stroke:var(--text-3,#9aa);stroke-width:1.2}.q-graph .gr{stroke:var(--border,#e5e7eb);stroke-width:.5}.q-graph .cv{fill:none;stroke:var(--teal,#00BFA5);stroke-width:2}.q-graph .pt{fill:var(--blue-b,#2563eb)}.q-graph text{fill:var(--text-2,#555);font:11px var(--mono,monospace)}</style>`);

  // grid garis bilangan bulat
  for (let gx = Math.ceil(xmin); gx <= xmax; gx++) parts.push(`<line class="gr" x1="${X(gx).toFixed(1)}" y1="${Y(ymin).toFixed(1)}" x2="${X(gx).toFixed(1)}" y2="${Y(ymax).toFixed(1)}"/>`);
  for (let gy = Math.ceil(ymin); gy <= ymax; gy++) parts.push(`<line class="gr" x1="${X(xmin).toFixed(1)}" y1="${Y(gy).toFixed(1)}" x2="${X(xmax).toFixed(1)}" y2="${Y(gy).toFixed(1)}"/>`);

  // sumbu (jika 0 dalam range)
  if (ymin <= 0 && ymax >= 0) parts.push(`<line class="ax" x1="${X(xmin).toFixed(1)}" y1="${Y(0).toFixed(1)}" x2="${X(xmax).toFixed(1)}" y2="${Y(0).toFixed(1)}"/><text x="${(W - pad + 4)}" y="${Y(0) + 4}">X</text>`);
  if (xmin <= 0 && xmax >= 0) parts.push(`<line class="ax" x1="${X(0).toFixed(1)}" y1="${Y(ymin).toFixed(1)}" x2="${X(0).toFixed(1)}" y2="${Y(ymax).toFixed(1)}"/><text x="${X(0) + 5}" y="${pad - 8}">Y</text>`);

  // kurva
  for (const paths of curves) for (const d of paths) parts.push(`<polyline class="cv" points="${d}"/>`);

  // titik + label
  for (const p of points) {
    parts.push(`<circle class="pt" cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3"/>`);
    if (p.label) parts.push(`<text x="${(X(p.x) + 6).toFixed(1)}" y="${(Y(p.y) - 6).toFixed(1)}">${p.label}</text>`);
  }

  parts.push('</svg>');
  return parts.join('');
}

// ── CLI ──
if (process.argv[1] && process.argv[1].endsWith('tikz-to-svg.mjs')) {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node tools/tikz-to-svg.mjs <content/raw/file.json>'); process.exit(1); }
  const data = JSON.parse(readFileSync(file, 'utf8'));
  let ok = 0, fail = 0;
  const previews = [];
  for (const s of data.soal) {
    for (const fig of (s.figures || [])) {
      try { fig.svg = tikzToSvg(fig.tikz); ok++; previews.push(`<div class="cell"><h3>${s.id}</h3>${fig.svg}<pre>${s.q.replace(/</g,'&lt;').slice(0,90)}…</pre></div>`); }
      catch (e) { fig.svg = null; fail++; console.warn(`  ✗ ${s.id}: ${e.message}`); }
    }
  }
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  const html = `<!doctype html><meta charset=utf8><body style="background:#0f172a;color:#e5e7eb;font-family:sans-serif">
<style>:root{--teal:#00BFA5;--text-2:#cbd5e1;--text-3:#94a3b8;--border:#334155;--blue-b:#60a5fa;--mono:monospace}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:16px}
.cell{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px}
.cell svg{width:100%;height:auto;background:#0f172a;border-radius:6px}
pre{white-space:pre-wrap;font-size:11px;color:#94a3b8}</style>
<h2 style="padding:0 16px">Preview ${ok} grafik — ${data.materi}</h2><div class="grid">${previews.join('')}</div>`;
  const previewPath = file.replace(/\.json$/, '.figures.html');
  writeFileSync(previewPath, html);
  console.log(`✅ ${ok} grafik di-render, ${fail} gagal. Preview: ${previewPath}`);
}
