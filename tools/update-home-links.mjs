// ─────────────────────────────────────────────────────────────
// update-home-links.mjs  —  Aktifkan kartu latihan di homepage
//
// Mengubah kartu "SEGERA" (toast) → "TERSEDIA" (link) di view #latihan-view
// index.html, untuk materi yang sudah punya latihan-soal. Idempoten.
//
//   node tools/update-home-links.mjs
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(ROOT, 'index.html');

// judul kartu di homepage (persis) → slug folder latihan-soal
const MAP = {
  'Eksponen': 'eksponen',
  'Logaritma': 'logaritma',
  'Barisan &amp; Deret': 'barisan-deret',
  'Fungsi, Komposisi &amp; Invers': 'fungsi-komposisi-invers',
  'Sistem Persamaan Linier': 'persamaan-linear',
  'Sistem Pertidaksamaan Linier': 'pertidaksamaan-linear',
  'Persamaan Kuadrat': 'persamaan-kuadrat',
  'Fungsi Kuadrat': 'fungsi-kuadrat',
  'Matriks': 'matriks',
  'Trigonometri Dasar': 'trigonometri',
  'Grafik Fungsi Trigonometri': 'grafik-fungsi-trigonometri',
  'Transformasi Geometri': 'transformasi_geometri',
  'Limit Fungsi': 'limit-fungsi',
  'Turunan Fungsi': 'turunan-fungsi',
  'Kombinatorika': 'kombinatorika',
};

let html = readFileSync(file, 'utf8');

// batasi ke section #latihan-view saja
const start = html.indexOf('id="latihan-view"');
const end = html.indexOf('<div class="view"', start + 1);
if (start < 0 || end < 0) { console.error('latihan-view tidak ditemukan'); process.exit(1); }
let section = html.slice(start, end);

let changed = 0, already = 0, missing = [];
for (const [title, slug] of Object.entries(MAP)) {
  const lineRe = new RegExp(`(<div class="paket-card">.*?<div class="card-title">${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</div>.*?</div>)`);
  const m = section.match(lineRe);
  if (!m) { missing.push(title); continue; }
  if (m[1].includes('badge-avail')) { already++; continue; }
  const fixed = m[1]
    .replace('badge-soon">SEGERA</span>', 'badge-avail">TERSEDIA</span>')
    .replace(`<button class="card-btn soon" onclick="toast('Segera tersedia')"><span>Segera</span>`,
             `<button class="card-btn" onclick="location.href='latihan-soal/${slug}/'"><span>Mulai</span>`);
  if (fixed === m[1]) { console.warn(`  ⚠ pola tombol tak cocok: ${title}`); continue; }
  section = section.replace(m[1], fixed);
  changed++;
}

html = html.slice(0, start) + section + html.slice(end);
writeFileSync(file, html);
console.log(`✅ ${changed} kartu diaktifkan, ${already} sudah aktif sebelumnya.`);
if (missing.length) console.warn('⚠ judul tak ketemu di homepage:', missing.join(', '));
