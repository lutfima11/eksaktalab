// ─────────────────────────────────────────────────────────────
// build-worksheet.mjs  —  Kompilasi worksheet LaTeX → PDF ber-identitas EksaktaLab
//
// Sumber : content/worksheet/<slug>.tex   (salinan asli dari database worksheet)
// Gaya   : tools/worksheet/eksaktalab-brand.tex (warna + header/footer EksaktaLab)
// Daftar : tools/worksheet/worksheets.json  [{ slug, topik }]
// Hasil  : assets/worksheet/worksheet-<slug>.pdf
//
// File .tex sumber tidak diubah: brand disisipkan tepat sebelum \begin{document}
// pada salinan sementara, lalu dikompilasi 2x (agar "hal X / Y" benar).
//
//   node tools/build-worksheet.mjs            # semua worksheet di daftar
//   node tools/build-worksheet.mjs eksponen   # satu worksheet
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, copyFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = join(ROOT, 'tools', 'worksheet', 'eksaktalab-brand.tex').split('\\').join('/');
const OUT = join(ROOT, 'assets', 'worksheet');
const list = JSON.parse(readFileSync(join(ROOT, 'tools', 'worksheet', 'worksheets.json'), 'utf8'));
const only = process.argv[2];
const todo = only ? list.filter(w => w.slug === only) : list;
if (!todo.length) { console.error(`❌ slug "${only}" tidak ada di worksheets.json`); process.exit(1); }

mkdirSync(OUT, { recursive: true });
for (const { slug, topik } of todo) {
  const src = readFileSync(join(ROOT, 'content', 'worksheet', `${slug}.tex`), 'utf8');
  if (!src.includes('\\begin{document}')) throw new Error(`${slug}.tex: \\begin{document} tidak ditemukan`);
  const branded = src.replace('\\begin{document}',
    `\\newcommand{\\WsTopik}{${topik}}\n\\input{${BRAND}}\n\\begin{document}`);

  const work = mkdtempSync(join(tmpdir(), `ws-${slug}-`));
  writeFileSync(join(work, 'ws.tex'), branded);
  const run = () => execFileSync('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', 'ws.tex'],
    { cwd: work, stdio: ['ignore', 'ignore', 'inherit'] });
  try { run(); run(); }
  catch {
    console.error(`❌ ${slug}: kompilasi gagal — lihat log di ${join(work, 'ws.log')}`);
    process.exitCode = 1; continue;
  }
  copyFileSync(join(work, 'ws.pdf'), join(OUT, `worksheet-${slug}.pdf`));
  rmSync(work, { recursive: true, force: true });
  console.log(`✅ assets/worksheet/worksheet-${slug}.pdf`);
}
