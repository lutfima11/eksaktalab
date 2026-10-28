// ─────────────────────────────────────────────────────────────
// build-seo-meta.mjs  —  Lengkapi <meta name="description"> & <link rel="canonical">
//
// Halaman kuis (latihan-soal/<topik>/<paket>/) digenerate tanpa meta SEO.
// Skrip ini menyisipkannya berdasarkan judul topik + breadcrumb halaman.
// Aman dijalankan berulang: tag yang sudah ada tidak diubah.
// Jalankan setelah generator latihan, sebelum build-sitemap:
//
//   node tools/build-seo-meta.mjs
// ─────────────────────────────────────────────────────────────
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://lutfima11.github.io/eksaktalab';
const TAIL = 'Kerjakan langsung di browser, dapat nilai dan pembahasan instan. Gratis di EksaktaLab.';

const attr = s => s.replace(/"/g, '&quot;');
const urlFor = file => {
  const rel = relative(ROOT, file).split(sep).join('/');
  return `${BASE}/${rel.replace(/index\.html$/, '')}`;
};

function quizDescription(html, topic) {
  const bc = (html.match(/class="q-breadcrumb">([\s\S]*?)<\/div>/) || [])[1] || '';
  const parts = bc.replace(/<[^>]+>/g, '|').split('|').map(s => s.trim()).filter(s => s && s !== '/' && s !== '·');
  const [, kode = '', jenis = '', level = ''] = parts;
  if (kode === 'KILAT') return `Kuis kilat ${topic}: uji pemahaman cepat dengan soal campuran berwaktu. ${TAIL}`;
  if (kode === 'UJIAN') return `Ujian akhir ${topic}: soal komprehensif berwaktu untuk mengukur penguasaan seluruh materi. ${TAIL}`;
  if (jenis === 'Per Sub-Materi') {
    const sub = (html.match(/<title>[^<]*?—\s*([^<|]+?)\s*\|/) || [])[1];
    return sub
      ? `Latihan soal ${topic} ${kode}: ${sub}. ${TAIL}`
      : `Latihan soal ${topic} per sub-materi (${kode}). ${TAIL}`;
  }
  return `Latihan soal ${topic} ${kode}${level ? ` level ${level}` : ''}: paket soal pilihan ganda. ${TAIL}`;
}

function addMeta(file, description) {
  let html = readFileSync(file, 'utf8');
  const before = html;
  const tags = [];
  if (description && !/<meta name="description"/.test(html)) tags.push(`<meta name="description" content="${attr(description)}">`);
  if (!/<link rel="canonical"/.test(html)) tags.push(`<link rel="canonical" href="${urlFor(file)}">`);
  if (tags.length) html = html.replace(/(<\/title>\r?\n?)/, `$1${tags.join('\n')}\n`);
  if (html !== before) { writeFileSync(file, html); return 1; }
  return 0;
}

let changed = 0;
const LAT = join(ROOT, 'latihan-soal');
for (const topik of readdirSync(LAT, { withFileTypes: true }).filter(d => d.isDirectory())) {
  const idx = join(LAT, topik.name, 'index.html');
  if (!existsSync(idx)) continue;
  const topic = (readFileSync(idx, 'utf8').match(/<title>Latihan Soal (.+?) — EksaktaLab<\/title>/) || [])[1];
  if (!topic) { console.warn(`⚠️  judul topik tidak terbaca: ${topik.name}`); continue; }
  for (const paket of readdirSync(join(LAT, topik.name), { withFileTypes: true }).filter(d => d.isDirectory())) {
    const file = join(LAT, topik.name, paket.name, 'index.html');
    if (existsSync(file)) changed += addMeta(file, quizDescription(readFileSync(file, 'utf8'), topic));
  }
}
// Halaman statis lain yang belum punya canonical (deskripsi sudah ada)
for (const p of ['kontak/index.html', 'laporkan/index.html', 'tentang/index.html', 'latihan-prasyarat.html']) {
  changed += addMeta(join(ROOT, p), null);
}
console.log(`✅ meta SEO: ${changed} halaman diperbarui`);
