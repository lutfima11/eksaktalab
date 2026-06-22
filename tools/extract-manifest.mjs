// ─────────────────────────────────────────────────────────────
// extract-manifest.mjs
// Sekali jalan: baca semua folder latihan-soal yang ADA sekarang,
// tarik metadata presentasi (title, kode, mode, level, warna, type),
// tulis ke tools/latihan-manifest.json.
//
// Manifest ini jadi "source of truth" presentasi. quiz-data.js tetap
// jadi source of truth soal. Setelah ini, build-latihan.mjs regenerate
// semua halaman dari template + manifest.
//
//   node tools/extract-manifest.mjs
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOPIC_DIR = join(ROOT, 'latihan-soal', 'fungsi-linear');

const grab = (re, s) => { const m = s.match(re); return m ? m[1].trim() : null; };

const entries = [];
for (const slug of readdirSync(TOPIC_DIR)) {
  const file = join(TOPIC_DIR, slug, 'index.html');
  let html;
  try { if (!statSync(file).isFile()) continue; html = readFileSync(file, 'utf8'); }
  catch { continue; }
  if (!/PAKET_ID/.test(html)) continue; // bukan halaman kuis

  const paket = grab(/const PAKET_ID\s*=\s*'([^']+)'/, html);
  const kode  = grab(/<span class="q-bc-kode">([^<]+)<\/span>/, html);
  const mode  = grab(/<span class="q-bc-mode">([^<]+)<\/span>/, html);
  const lvlM  = html.match(/<span class="q-bc-level" style="color:(#[0-9A-Fa-f]+)">([^<]+)<\/span>/);
  const title = grab(/<title>([^<]+)<\/title>/, html);

  const isUjian = /IS_UJIAN\s*=\s*true/.test(html) || /const\s+UJIAN_MINUTES/.test(html);
  let type = 'latihan';
  if (slug === 'ujian-akhir') type = 'ujian';
  else if (slug === 'kuis-kilat') type = 'kilat';

  entries.push({
    slug,
    paket,
    kode,
    title,
    mode,
    levelLabel: lvlM ? lvlM[2] : null,
    levelColor: lvlM ? lvlM[1] : null,
    type,
  });
}

// Urutkan: numerik dulu (1..20), lalu sub-materi (a1..), lalu khusus
const order = s => {
  if (/^fl-\d+$/.test(s)) return [0, parseInt(s.slice(3), 10)];
  if (/^fl-[a-z]\d+$/.test(s)) return [1, s];
  return [2, s];
};
entries.sort((a, b) => {
  const [ga, va] = order(a.slug), [gb, vb] = order(b.slug);
  if (ga !== gb) return ga - gb;
  return va < vb ? -1 : va > vb ? 1 : 0;
});

const manifest = { topic: 'fungsi-linear', topicTitle: 'Fungsi Linear', items: entries };
writeFileSync(join(ROOT, 'tools', 'latihan-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`OK — ${entries.length} paket diekstrak ke tools/latihan-manifest.json`);
for (const e of entries) console.log(`  ${e.slug.padEnd(12)} ${String(e.paket).padEnd(4)} ${e.kode.padEnd(7)} ${e.type.padEnd(8)} ${e.levelLabel}`);
