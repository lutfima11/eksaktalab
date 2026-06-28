// render-tikz-fk.mjs
// Ekstrak blok TikZ dari .tex Fungsi Kuadrat, render ke SVG,
// update fungsi-kuadrat.json, rebuild quiz pages.
//
// Jalankan: node tools/render-tikz-fk.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(ROOT, 'assets', 'img', 'fk');
const JSON_PATH = join(ROOT, 'content', 'raw', 'fungsi-kuadrat.json');
const TEX_DIR = 'D:/14_Database EksaktaLab/Bank Soal/Sub-Materi/Fungsi Kuadrat';
const WORK_DIR = join(tmpdir(), 'eksaktalab-fk-tikz');

mkdirSync(SVG_DIR, { recursive: true });
mkdirSync(WORK_DIR, { recursive: true });

// ── Preamble definitions per section (dari preamble asli .tex) ──
function getPreambleExtras(sectionId) {
  const base = `\\usetikzlibrary{arrows.meta,calc}`;
  if (['D', 'G', 'H'].includes(sectionId)) {
    return base + `
\\definecolor{MatnPrimary}{HTML}{1A3C5E}
\\definecolor{MatnAccent}{HTML}{E8521A}
\\definecolor{MatnGray}{HTML}{9E9E9E}
\\newcommand{\\minipara}[6]{%
  \\begin{scope}[xshift=#1,yshift=#2]
    \\draw[->,thin,MatnGray](-1.1,0)--(1.4,0)node[right,font=\\tiny]{$x$};
    \\draw[->,thin,MatnGray](0,-1.3)--(0,1.8)node[above,font=\\tiny]{$y$};
    \\draw[#3,thick,domain=#4,samples=60] plot(\\x,{#5});
    \\node[font=\\scriptsize] at (0.2,-2.1){#6};
  \\end{scope}%
}`;
  }
  return base;
}

// ── Buat standalone .tex untuk satu blok TikZ ──
function makeStandalone(tikzContent, sectionId) {
  return `\\documentclass[tikz,border=6pt]{standalone}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
${getPreambleExtras(sectionId)}
\\begin{document}
${tikzContent}
\\end{document}
`;
}

// ── Compile .tex → SVG via pdflatex + dvisvgm ──
function renderToSvg(texContent, svgPath, label) {
  const baseName = `tikz-${label}`;
  const texFile = join(WORK_DIR, baseName + '.tex');
  const pdfFile = join(WORK_DIR, baseName + '.pdf');
  const svgFile = join(WORK_DIR, baseName + '.svg');

  writeFileSync(texFile, texContent, 'utf8');

  // pdflatex: ignore exit code, cek keberadaan PDF
  try {
    execSync(
      `pdflatex -interaction=nonstopmode -output-directory="${WORK_DIR}" "${texFile}"`,
      { stdio: 'pipe', timeout: 30000 }
    );
  } catch (_) { /* pdflatex bisa return non-zero meski sukses */ }

  if (!existsSync(pdfFile)) {
    console.error(`  ✗ GAGAL render ${label}: pdflatex tidak menghasilkan PDF`);
    return false;
  }

  // dvisvgm: output ke stderr adalah normal, ignore exit code, cek SVG
  try {
    execSync(
      `dvisvgm --pdf "${pdfFile}" -o "${svgFile}" --no-fonts`,
      { stdio: 'pipe', timeout: 15000 }
    );
  } catch (_) { /* dvisvgm output ke stderr, dianggap error oleh Node */ }

  if (!existsSync(svgFile)) {
    console.error(`  ✗ GAGAL render ${label}: dvisvgm tidak menghasilkan SVG`);
    return false;
  }

  const svg = readFileSync(svgFile, 'utf8');
  const cleaned = svg
    .replace(/<\?xml[^?]*\?>\s*/g, '')
    .replace(/<!DOCTYPE[^>]*>\s*/g, '')
    .replace(/width='[^']*'/, `width='100%'`)
    .replace(/height='[^']*'/, `height='auto'`);
  writeFileSync(svgPath, cleaned, 'utf8');
  return true;
}

// ── Ekstrak semua blok TikZ dari satu file .tex ──
// Return: [{ soalNum, tikzBlock }]
function extractTikzBlocks(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const body = raw.split('\\begin{document}')[1]?.split('\\end{document}')[0] || '';
  const lines = body.split('\n');

  const results = [];
  let soalCounter = 0;
  let enumDepth = 0;
  let inTikz = false;
  let tikzLines = [];
  let tikzSoalNum = null;

  for (const line of lines) {
    const t = line.trim();
    if (t.includes('KUNCI JAWABAN')) break;

    // setcounter
    const sm = t.match(/\\setcounter\{enumi\}\{(\d+)\}/);
    if (sm) { soalCounter = parseInt(sm[1]); continue; }

    // enumerate depth — track semua, bukan hanya non-(a)
    if (t.startsWith('\\begin{enumerate}')) enumDepth++;
    if (t.startsWith('\\end{enumerate}')) { if (enumDepth > 0) enumDepth--; }

    // track soal counter: hanya item di depth=1
    if (t.includes('\\item') && enumDepth === 1 && !inTikz) {
      soalCounter++;
    }

    // TikZ tracking
    if (t.startsWith('\\begin{tikzpicture}')) {
      inTikz = true;
      tikzLines = [line];
      tikzSoalNum = soalCounter;
      continue;
    }
    if (inTikz) {
      tikzLines.push(line);
      if (t.startsWith('\\end{tikzpicture}')) {
        inTikz = false;
        results.push({ soalNum: tikzSoalNum, tikzBlock: tikzLines.join('\n') });
        tikzLines = [];
      }
    }
  }
  return results;
}

// ── Main ──
const data = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
let totalRendered = 0;
let totalFailed = 0;

for (const section of data.sections) {
  const sid = section.sectionId;
  const texFile = join(TEX_DIR, `soal_pg_section_${sid}_fungsi_kuadrat.tex`);

  if (!existsSync(texFile)) {
    console.log(`Skip Section ${sid}: file tidak ditemukan`);
    continue;
  }

  const tikzBlocks = extractTikzBlocks(texFile);
  if (tikzBlocks.length === 0) continue;

  console.log(`\nSection ${sid}: ${tikzBlocks.length} blok TikZ ditemukan`);

  for (const { soalNum, tikzBlock } of tikzBlocks) {
    const label = `fk-${sid.toLowerCase()}${soalNum}`;
    const svgPath = join(SVG_DIR, label + '.svg');

    process.stdout.write(`  Render ${label}... `);

    const standalone = makeStandalone(tikzBlock, sid);
    const ok = renderToSvg(standalone, svgPath, label);

    if (ok) {
      console.log('✓');
      totalRendered++;

      // Update JSON: ganti [GAMBAR] di soal yang sesuai
      const soal = section.soal.find(s => s.num === soalNum);
      if (soal && soal.q.includes('[GAMBAR]')) {
        const relPath = `../../../assets/img/fk/${label}.svg`;
        soal.q = soal.q.replace(
          '[GAMBAR]',
          `<img src="${relPath}" alt="Grafik ${label}" class="soal-gambar" style="display:block;max-width:100%;margin:.5rem auto;">`
        );
      }
    } else {
      totalFailed++;
    }
  }
}

// Simpan JSON yang sudah diupdate
writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`\nSelesai: ${totalRendered} SVG berhasil, ${totalFailed} gagal`);
console.log('JSON diupdate. Jalankan: node tools/build-fk-latihan.mjs untuk rebuild quiz pages.');
