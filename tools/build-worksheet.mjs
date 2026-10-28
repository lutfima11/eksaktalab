// ─────────────────────────────────────────────────────────────
// build-worksheet.mjs  —  Kompilasi worksheet LaTeX → PDF ber-identitas EksaktaLab
//
// Sumber : file .tex di database EksaktaLab (path "src" di worksheets.json).
//          Sumber TIDAK disimpan di repo publik, agar worksheet tidak bisa
//          dikompilasi ulang tanpa merek.
// Gaya   : tools/worksheet/eksaktalab-brand.tex (warna, header/footer, watermark,
//          logo di kotak, kode soal, metadata)
// Daftar : tools/worksheet/worksheets.json  [{ slug, topik, kode, src, tataLetakOtomatis? }]
//          tataLetakOtomatis: true → aktifkan aturan anti-terpotong di brand (untuk
//          worksheet yang tata letaknya belum diatur manual)
// Hasil  : assets/worksheet/worksheet-<slug>.pdf (izin edit/salin dikunci, cetak boleh)
//
// Jika sumber sudah berisi blok "IDENTITAS EKSAKTALAB" (versi mandiri untuk TeXmaker),
// blok itu dibuang lalu diganti brand terbaru, jadi hasil web selalu memakai gaya terkini.
//
//   node tools/build-worksheet.mjs                          # semua worksheet
//   node tools/build-worksheet.mjs eksponen                 # satu worksheet
//   node tools/build-worksheet.mjs eksponen --perbarui-database
//        # sekaligus tulis ulang blok brand di file database dengan versi terbaru
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, copyFileSync, mkdtempSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND_FILE = join(ROOT, 'tools', 'worksheet', 'eksaktalab-brand.tex');
const LOCK = join(ROOT, 'tools', 'worksheet', 'lock-pdf.py');
const OUT = join(ROOT, 'assets', 'worksheet');
const list = JSON.parse(readFileSync(join(ROOT, 'tools', 'worksheet', 'worksheets.json'), 'utf8'));
const args = process.argv.slice(2);
const only = args.find(a => !a.startsWith('--'));
const syncDb = args.includes('--perbarui-database');
const todo = only ? list.filter(w => w.slug === only) : list;
if (!todo.length) { console.error(`❌ slug "${only}" tidak ada di worksheets.json`); process.exit(1); }

const BEGIN = '\\begin{document}';
const MARK = '% IDENTITAS EKSAKTALAB';

// Buang blok brand lama (dari baris "% ====" di atas MARK sampai sebelum \begin{document})
function stripBrand(tex) {
  const lines = tex.split(/\r?\n/);
  const m = lines.findIndex(l => l.startsWith(MARK));
  if (m < 0) return tex;
  const b = lines.findIndex(l => l.trim() === BEGIN);
  return [...lines.slice(0, m - 1), ...lines.slice(b)].join('\n');
}
function brandBlock(topik, kode, tataLetakOtomatis) {
  return ['% =============================================',
    `${MARK} (warna, logo, header & footer, watermark, kode soal)`,
    '% =============================================',
    `\\newcommand{\\WsTopik}{${topik}}`,
    `\\newcommand{\\WsKode}{${kode}}`,
    ...(tataLetakOtomatis ? ['\\newcommand{\\WsTataLetakOtomatis}{}'] : []),
    readFileSync(BRAND_FILE, 'utf8')].join('\n') + '\n';
}

mkdirSync(OUT, { recursive: true });
for (const { slug, topik, kode, src: srcPath, tataLetakOtomatis } of todo) {
  if (!existsSync(srcPath)) { console.error(`❌ ${slug}: sumber tidak ditemukan di ${srcPath}`); process.exitCode = 1; continue; }
  const raw = readFileSync(srcPath, 'utf8');
  const body = stripBrand(raw);
  if (!body.includes(BEGIN)) throw new Error(`${slug}: ${BEGIN} tidak ditemukan`);
  const branded = body.replace(BEGIN, brandBlock(topik, kode, tataLetakOtomatis) + BEGIN);
  if (syncDb && branded !== raw) { writeFileSync(srcPath, branded); console.log(`↻ blok brand di database diperbarui: ${srcPath}`); }

  const work = mkdtempSync(join(tmpdir(), `ws-${slug}-`));
  writeFileSync(join(work, 'ws.tex'), branded);
  const run = () => execFileSync('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', 'ws.tex'],
    { cwd: work, stdio: ['ignore', 'ignore', 'inherit'] });
  try { run(); run(); }
  catch {
    console.error(`❌ ${slug}: kompilasi gagal — lihat log di ${join(work, 'ws.log')}`);
    process.exitCode = 1; continue;
  }
  const pdf = join(OUT, `worksheet-${slug}.pdf`);
  // Kunci izin: cetak boleh, edit/salin teks/ubah anotasi tidak
  execFileSync('python', [LOCK, join(work, 'ws.pdf'), pdf], { stdio: 'inherit' });
  rmSync(work, { recursive: true, force: true });

  // Cache-busting: link di beranda diberi ?v=<hash PDF> agar browser tidak memakai PDF lama
  const ver = createHash('sha1').update(readFileSync(pdf)).digest('hex').slice(0, 8);
  const home = join(ROOT, 'index.html');
  const html = readFileSync(home, 'utf8');
  const linked = html.replace(new RegExp(`assets/worksheet/worksheet-${slug}\\.pdf(\\?v=[0-9a-f]+)?"`, 'g'),
    `assets/worksheet/worksheet-${slug}.pdf?v=${ver}"`);
  if (linked !== html) writeFileSync(home, linked);
  console.log(`✅ assets/worksheet/worksheet-${slug}.pdf (v=${ver})`);
}
