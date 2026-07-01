// render-tikz-lf.mjs
// Ekstrak blok TikZ dari .tex Limit Fungsi, render ke SVG,
// update limit-fungsi.json, siap untuk rebuild quiz pages.
//
// Jalankan: node tools/render-tikz-lf.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(ROOT, 'assets', 'img', 'lf');
const JSON_PATH = join(ROOT, 'content', 'raw', 'limit-fungsi.json');
const TEX_DIR = 'D:/14_Database EksaktaLab/Bank Soal/Sub-Materi/Limit Fungsi';
const WORK_DIR = join(tmpdir(), 'eksaktalab-lf-tikz');

mkdirSync(SVG_DIR, { recursive: true });
mkdirSync(WORK_DIR, { recursive: true });

function getPreambleExtras(sectionId) {
  const colors = `
\\definecolor{MatnPrimary}{HTML}{1A3C5E}
\\definecolor{MatnAccent}{HTML}{E8521A}
\\definecolor{MatnGray}{HTML}{9E9E9E}`;
  if (sectionId === 'D') {
    return `\\usetikzlibrary{arrows.meta,calc,angles,quotes}` + colors;
  }
  return `\\usetikzlibrary{arrows.meta,calc}` + colors;
}

function makeStandalone(tikzContent, sectionId) {
  return `\\documentclass[tikz,border=6pt]{standalone}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
${getPreambleExtras(sectionId)}
\\begin{document}
${tikzContent}
\\end{document}
`;
}

function renderToSvg(texContent, svgPath, label) {
  const baseName = `tikz-${label}`;
  const texFile = join(WORK_DIR, baseName + '.tex');
  const pdfFile = join(WORK_DIR, baseName + '.pdf');
  const svgFile = join(WORK_DIR, baseName + '.svg');

  writeFileSync(texFile, texContent, 'utf8');

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

  try {
    execSync(
      `dvisvgm --pdf "${pdfFile}" -o "${svgFile}" --no-fonts`,
      { stdio: 'pipe', timeout: 15000 }
    );
  } catch (_) { /* dvisvgm output ke stderr */ }

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

    const sm = t.match(/\\setcounter\{enumi\}\{(\d+)\}/);
    if (sm) { soalCounter = parseInt(sm[1]); continue; }

    if (t.startsWith('\\begin{enumerate}')) enumDepth++;
    if (t.startsWith('\\end{enumerate}')) { if (enumDepth > 0) enumDepth--; }

    if (t.includes('\\item') && enumDepth === 1 && !inTikz) {
      soalCounter++;
    }

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

const data = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
let totalRendered = 0;
let totalFailed = 0;

const TEX_FILES = {
  A: 'SoalPG_SectionA_LimitFungsi.tex',
  B: 'SoalPG_SectionB_LimitFungsi.tex',
  C: 'SoalPG_SectionC_LimitFungsi.tex',
  D: 'SoalPG_SectionD_LimitFungsi.tex',
};

for (const section of data.sections) {
  const sid = section.sectionId;
  const texFile = join(TEX_DIR, TEX_FILES[sid]);

  if (!existsSync(texFile)) {
    console.log(`Skip Section ${sid}: file tidak ditemukan`);
    continue;
  }

  const tikzBlocks = extractTikzBlocks(texFile);
  if (tikzBlocks.length === 0) { console.log(`Section ${sid}: tidak ada TikZ`); continue; }

  console.log(`\nSection ${sid}: ${tikzBlocks.length} blok TikZ ditemukan`);

  for (const { soalNum, tikzBlock } of tikzBlocks) {
    const label = `lf-${sid.toLowerCase()}${soalNum}`;
    const svgPath = join(SVG_DIR, label + '.svg');

    process.stdout.write(`  Render ${label}... `);

    const standalone = makeStandalone(tikzBlock, sid);
    const ok = renderToSvg(standalone, svgPath, label);

    if (ok) {
      console.log('✓');
      totalRendered++;

      const soal = section.soal.find(s => s.num === soalNum);
      if (soal && soal.q.includes('[GAMBAR]')) {
        const relPath = `../../../assets/img/lf/${label}.svg`;
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

writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log(`\nSelesai: ${totalRendered} SVG berhasil, ${totalFailed} gagal`);
console.log('JSON diupdate. Jalankan: node tools/build-lf-latihan.mjs untuk rebuild quiz pages.');
