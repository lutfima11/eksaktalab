// ─────────────────────────────────────────────────────────────
// build-latihan.mjs  —  GENERATOR HALAMAN LATIHAN SOAL
//
// Sumber kebenaran:
//   • Soal     → assets/js/quiz-data.js   (window.quizDB)
//   • Presentasi → tools/latihan-manifest.json
//   • Tampilan → tools/templates/latihan.html
//
// Cara pakai:
//   node tools/build-latihan.mjs            # generate semua paket latihan
//   node tools/build-latihan.mjs --check    # cek saja, jangan tulis (CI-friendly)
//
// Setelah ini: untuk ubah tampilan SEMUA halaman latihan, edit
// tools/templates/latihan.html sekali lalu jalankan script ini.
// Untuk tambah paket baru: tambah soal di quiz-data.js + 1 baris di manifest.
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const manifest = JSON.parse(readFileSync(join(ROOT, 'tools', 'latihan-manifest.json'), 'utf8'));
const tplLatihan = readFileSync(join(ROOT, 'tools', 'templates', 'latihan.html'), 'utf8');

// load quiz-data untuk validasi paket
const g = {}; global.window = g;
await import('../assets/js/quiz-data.js');
const quizDB = g.quizDB || {};

function render(tpl, vars) {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{{${k}}}`).join(v);
  }
  const leftover = out.match(/\{\{[A-Z_]+\}\}/g);
  if (leftover) throw new Error(`Token belum terisi: ${[...new Set(leftover)].join(', ')}`);
  return out;
}

let written = 0, drift = 0, warn = 0;
for (const item of manifest.items) {
  if (item.type !== 'latihan') continue; // ujian/kilat dikelola terpisah (Tahap 2)

  if (!quizDB[item.paket]) {
    console.warn(`  ⚠  ${item.slug}: PAKET '${item.paket}' tidak ada di quiz-data.js (halaman akan tampil "Soal sedang disiapkan")`);
    warn++;
  }

  const html = render(tplLatihan, {
    KODE: item.kode,
    MODE: item.mode,
    LEVEL_COLOR: item.levelColor,
    LEVEL_LABEL: item.levelLabel,
    PAKET: item.paket,
  });

  const dir = join(ROOT, 'latihan-soal', manifest.topic, item.slug);
  const file = join(dir, 'index.html');
  const prev = existsSync(file) ? readFileSync(file, 'utf8') : null;

  if (prev !== html) {
    drift++;
    if (CHECK) {
      console.log(`  ✗ ${item.slug}: BERBEDA dari output generator`);
    } else {
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, html);
      console.log(`  ✓ ${item.slug} ditulis`);
      written++;
    }
  }
}

const total = manifest.items.filter(i => i.type === 'latihan').length;
if (CHECK) {
  console.log(`\n${drift === 0 ? '✅ Semua' : '⚠  ' + drift + ' dari ' + total} halaman latihan sinkron dengan template.`);
  process.exit(drift === 0 ? 0 : 1);
} else {
  console.log(`\n✅ Selesai — ${written} ditulis, ${total - written} sudah identik, ${warn} peringatan. (${total} paket latihan total)`);
}
