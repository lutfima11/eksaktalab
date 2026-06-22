// ─────────────────────────────────────────────────────────────
// import-latex.mjs  —  PARSER BANK SOAL LaTeX → JSON terstruktur
//
// Format sumber (Mathcyber / EksaktaLab) yang didukung:
//   • Section:  \textbf{\underline{A. Level Beginner}} dst (A/B/C = PG, D = Uraian)
//   • Soal:     \item di dalam enumerate level-1
//   • Opsi PG:  enumerate level-2 di dalam soal (A/B/C)
//   • Sub-bagian uraian: enumerate level-2 (D)
//   • Metadata: komentar [LEVEL: ..] [JENIS: ..] [PRASYARAT: a > b > c] [GAMBAR: ..]
//               (opsional [TIPE: PG|URAIAN|MCMA|BS] untuk override tipe jawaban)
//   • Gambar:   blok \begin{tikzpicture}..\end{tikzpicture} diekstrak utuh
//
// Yang TIDAK ada di file (sengaja dikosongkan untuk diisi tahap berikut):
//   • jawab  (kunci jawaban)  → null
//   • p      (pembahasan)     → null
//   • figures[].svg           → null (tikz mentah disimпан di .tikz)
//
// Pakai:
//   node tools/import-latex.mjs "D:\\path\\file.tex" [materi-slug]
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const inPath = process.argv[2];
if (!inPath) { console.error('Usage: node tools/import-latex.mjs <file.tex> [materi-slug]'); process.exit(1); }
const raw = readFileSync(inPath, 'utf8');

// ── metadata file (dari blok komentar METADATA FILE) ──
const meta = {
  mataPelajaran: (raw.match(/Mata Pelajaran\s*:\s*(.+)/) || [])[1]?.trim() || null,
  topik:         (raw.match(/Topik\/Bab\s*:\s*(.+)/) || [])[1]?.trim() || null,
  jenjang:       (raw.match(/Jenjang\s*:\s*(.+)/) || [])[1]?.trim() || null,
  sumber:        (raw.match(/Sumber PDF\s*:\s*(.+)/) || [])[1]?.trim() || null,
};
const slug = process.argv[3] ||
  (meta.topik ? meta.topik.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : basename(inPath, '.tex'));

// ── ambil body antara \begin{document} dan \end{document} ──
const body = raw.split('\\begin{document}')[1].split('\\end{document}')[0];
const lines = body.split('\n');

// ── konversi teks LaTeX (non-matematika) → HTML/teks ──
function txt(s) {
  return s
    .replace(/\\ldots/g, '…')
    .replace(/\\textbf\{([^}]*)\}/g, '<b>$1</b>')
    .replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>')
    .replace(/\\%/g, '%')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── ambil semua tag [KEY: value] dari buffer komentar ──
function parseTags(commentLines) {
  const blob = commentLines.join('\n');
  const tags = {};
  for (const m of blob.matchAll(/\[([A-Z]+):\s*([^\]]+)\]/g)) {
    tags[m[1]] = m[2].trim();
  }
  return tags;
}

const LEVELS = { Beginner: 'Beginner', Intermediate: 'Intermediate', Expert: 'Expert' };

const soal = [];
let section = null;          // 'PG' | 'URAIAN'
let enumDepth = 0;
let commentBuf = [];
let cur = null;             // soal aktif
let inTikz = false, tikzBuf = [];
let phase = null;          // 'q' | 'opts' | 'parts'
let counter = { A: 0, B: 0, C: 0, D: 0 };
let sectionLetter = null;

function flush() { if (cur) { finalizeCur(); soal.push(cur); cur = null; } }

function finalizeCur() {
  cur.q = txt(cur._q.join(' '));
  if (cur.type === 'pg' || cur.type === 'mcma') cur.opts = cur._opts.map(txt);
  if (cur.type === 'uraian' && cur._parts.length) cur.parts = cur._parts.map(txt);
  delete cur._q; delete cur._opts; delete cur._parts;
}

for (let line of lines) {
  const t = line.trim();

  // ── section header ──
  const sec = t.match(/\\textbf\{\\underline\{([A-D])\.\s*([^}]+)\}\}/);
  if (sec) {
    flush();
    sectionLetter = sec[1];
    section = /uraian/i.test(sec[2]) ? 'URAIAN' : 'PG';
    enumDepth = 0;
    continue;
  }

  // ── tikzpicture (gambar) ──
  if (t.includes('\\begin{tikzpicture}')) { inTikz = true; tikzBuf = [line]; continue; }
  if (inTikz) {
    tikzBuf.push(line);
    if (t.includes('\\end{tikzpicture}')) {
      inTikz = false;
      if (cur) {
        cur.figures.push({ tikz: tikzBuf.join('\n'), svg: null });
        cur.gambar = true;
        if (phase === 'q') cur._q.push(' [[GAMBAR]] ');
      }
    }
    continue;
  }

  // ── komentar → buffer metadata ──
  if (t.startsWith('%')) { commentBuf.push(t.replace(/^%+\s?/, '')); continue; }

  // ── wadah gambar / spasi — abaikan ──
  if (t === '\\begin{center}' || t === '\\end{center}' || t === '' || /^\\(vspace|onecolumn|twocolumn|newpage|par)\b/.test(t)) continue;

  // ── enumerate depth ──
  if (t.startsWith('\\begin{enumerate}')) {
    enumDepth++;
    if (enumDepth >= 2 && cur) phase = (section === 'URAIAN') ? 'parts' : 'opts';
    continue;
  }
  if (t.startsWith('\\end{enumerate}')) {
    if (enumDepth === 2 && cur) phase = 'q-done';
    enumDepth--;
    continue;
  }

  // ── \item ──
  if (t.startsWith('\\item')) {
    const content = t.replace(/^\\item\s?/, '');
    if (enumDepth === 1) {
      flush();
      const tags = parseTags(commentBuf); commentBuf = [];
      const letter = sectionLetter || 'A';
      counter[letter] = (counter[letter] || 0) + 1;
      let type = section === 'URAIAN' ? 'uraian' : 'pg';
      if (tags.TIPE) type = tags.TIPE.toLowerCase();
      cur = {
        id: `${letter}-${counter[letter]}`,
        type,
        level: LEVELS[tags.LEVEL] || tags.LEVEL || null,
        jenis: tags.JENIS ? tags.JENIS.split(',').map(s => s.trim()) : [],
        prasyarat: tags.PRASYARAT ? tags.PRASYARAT.split('>').map(s => s.trim()) : [],
        gambar: false,
        figures: [],
        q: '',
        _q: [content], _opts: [], _parts: [],
        jawab: null,   // ← belum ada, diisi tahap berikutnya
        p: null,       // ← belum ada
      };
      if (type === 'pg' || type === 'mcma') cur.opts = [];
      phase = 'q';
    } else if (enumDepth >= 2 && cur) {
      if (phase === 'parts') cur._parts.push(content);
      else cur._opts.push(content);
    }
    continue;
  }

  // ── baris lanjutan ──
  if (cur && enumDepth === 1 && phase === 'q') cur._q.push(t);
  else if (cur && enumDepth >= 2) {
    const arr = phase === 'parts' ? cur._parts : cur._opts;
    if (arr.length) arr[arr.length - 1] += ' ' + t;
  }
}
flush();

// ── output ──
const out = {
  materi: slug,
  ...meta,
  sourceFile: basename(inPath),
  importedAt: new Date().toISOString().slice(0, 10),
  totalSoal: soal.length,
  soal,
};
const outDir = join(ROOT, 'content', 'raw');
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `${slug}.json`);
writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');

// ── ringkasan ──
const by = (f) => soal.reduce((a, s) => (a[f(s)] = (a[f(s)] || 0) + 1, a), {});
console.log(`✅ ${soal.length} soal → content/raw/${slug}.json\n`);
console.log('Per level :', by(s => s.level));
console.log('Per tipe  :', by(s => s.type));
console.log('Pakai gambar (tikz):', soal.filter(s => s.gambar).length);
console.log('Tanpa kunci jawaban :', soal.filter(s => s.jawab === null).length, '(semua — perlu diisi)');
