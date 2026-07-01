// build-mat-latihan.mjs
// Generator halaman latihan Matriks (mat-xN per sub-materi)
// node tools/build-mat-latihan.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://lutfima11.github.io/eksaktalab';

const templatePath = join(ROOT, 'latihan-soal', 'fungsi-kuadrat', 'fk-a1', 'index.html');
const dataPath = join(ROOT, 'content', 'raw', 'matriks.json');

const template = readFileSync(templatePath, 'utf8');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const LETTER_TO_IDX = { a: 0, b: 1, c: 2, d: 3, e: 4 };

function tabularToHtml(text) {
  // Match: {\small \setlength{...}{...} \begin{tabular}{spec} ... \end{tabular}% }
  // atau   {\small \begin{tabular}{spec} ... \end{tabular} }
  return text.replace(
    /\{\\small\s*(?:\\setlength\{[^}]*\}\{[^}]*\}\s*)?\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}%?\s*\}/g,
    (_, body) => {
      // strip booktabs & hline commands
      const stripped = body
        .replace(/\\toprule|\\midrule|\\bottomrule|\\hline/g, '')
        .trim();
      // split rows by backslash+whitespace (LaTeX \\ row separator → \ after parser)
      const rows = stripped
        .split(/\\\s/)
        .map(r => r.trim())
        .filter(r => r && r !== '%');
      if (rows.length === 0) return '';
      // first row = header
      const thCells = rows[0].split('&').map(c => `<th>${c.trim()}</th>`).join('');
      const bodyRows = rows.slice(1).map(row => {
        const tds = row.split('&').map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      return `<div class="grafik-wrap"><table class="soal-table"><thead><tr>${thCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
    }
  );
}

function processLatex(text) {
  if (!text) return text;
  // strip LaTeX spacing like \[4pt]
  text = text.replace(/\\\[\d+pt\]/g, '');
  // tabular → HTML table (must run before center stripping)
  text = tabularToHtml(text);
  // strip \begin{center}...\end{center} wrapper
  text = text.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, '$1');
  // strip lone \begin{center} (no matching end)
  text = text.replace(/\\begin\{center\}/g, '');
  // wrap \begin{align*}...\end{align*}
  text = text.replace(/\\begin\{(align\*?)\}([\s\S]*?)\\end\{align\*?\}/g, (_, env, body) => {
    const fixed = body.replace(/\\ /g, '\\\\ ');
    return `\\[\\begin{${env}}${fixed}\\end{${env}}\\]`;
  });
  text = text.replace(/\\begin\{(align\*?)\}([\s\S]*)$/, (_, env, body) => {
    const fixed = body.replace(/\\ /g, '\\\\ ');
    return `\\[\\begin{${env}}${fixed}\\end{${env}}\\]`;
  });
  // wrap soal-gambar img dengan grafik-wrap
  text = text.replace(/<img([^>]+class="soal-gambar")[^>]*>/g, '<div class="grafik-wrap"><img$1></div>');
  return text;
}

const SECTION_JUDUL = {
  A: 'Mengenal Matriks',
  B: 'Operasi Aljabar Matriks',
  C: 'Determinan Matriks',
  D: 'Invers Matriks Ordo 2×2',
  E: 'Persamaan Matriks',
  F: 'Invers Matriks Ordo 3×3',
  G: 'SPL dengan Matriks',
};

const LEVEL_BADGE_CSS = `
/* ── LEVEL BADGE PER SOAL ── */
.q-level-badge{
  display:inline-flex;align-items:center;
  font-family:var(--mono);font-size:.56rem;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;
  padding:.13rem .45rem;border-radius:4px;
}
.qlb-beginner{background:var(--green);color:var(--green-b);}
[data-theme="dark"] .qlb-beginner{background:rgba(5,150,105,.15);color:#34D399;}
.qlb-intermediate{background:var(--yellow);color:var(--yellow-b);}
[data-theme="dark"] .qlb-intermediate{background:rgba(245,158,11,.1);color:#FBBF24;}
.qlb-expert{background:var(--red);color:var(--red-b);}
[data-theme="dark"] .qlb-expert{background:rgba(239,68,68,.1);color:#F87171;}
/* tabel soal */
.soal-table{border-collapse:collapse;font-size:.88em;margin:.4rem 0;width:100%;}
.soal-table th{border:1px solid var(--border);padding:.28rem .55rem;background:var(--surface-2,#f4f5f7);font-weight:700;}
.soal-table td{border:1px solid var(--border);padding:.28rem .55rem;text-align:center;}
.soal-table td:first-child{text-align:left;}
/* grafik wrapper */
.grafik-wrap{
  display:block;width:100%;max-width:340px;
  margin:.6rem auto;padding:.5rem;
  border-radius:8px;
  background:var(--surface-2,#f4f5f7);
  border:1px solid var(--border);
}
[data-theme="dark"] .grafik-wrap{
  background:rgba(255,255,255,.04);
  border-color:rgba(255,255,255,.1);
}
.grafik-wrap img,.grafik-wrap svg{display:block;width:100%;height:auto;}
`;

const RENDER_PATCH_FROM = `html+=\`<div class="q-soal-meta">
    <span class="q-type \${typeCls[q.type]||'qt-pg'}">\${typeLabel[q.type]||'Pilihan Ganda'}</span>
    <button class="q-tandai\${S.marked[i]?' on':''}" id="tm\${i}" onclick="mark(\${i})">
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 2h6v9l-3-2.2L4 11V2z"/></svg>
      \${S.marked[i]?'Ditandai':'Tandai Soal'}
    </button>
  </div>\`;`;

const RENDER_PATCH_TO = `const lvlCls={Beginner:'qlb-beginner',Intermediate:'qlb-intermediate',Expert:'qlb-expert'};
  const lvlHtml=q.level?\`<span class="q-level-badge \${lvlCls[q.level]||'qlb-beginner'}">\${q.level}</span>\`:'';
  html+=\`<div class="q-soal-meta">
    <div style="display:flex;align-items:center;gap:.45rem;">
      <span class="q-type \${typeCls[q.type]||'qt-pg'}">\${typeLabel[q.type]||'Pilihan Ganda'}</span>
      \${lvlHtml}
    </div>
    <button class="q-tandai\${S.marked[i]?' on':''}" id="tm\${i}" onclick="mark(\${i})">
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 2h6v9l-3-2.2L4 11V2z"/></svg>
      \${S.marked[i]?'Ditandai':'Tandai Soal'}
    </button>
  </div>\`;`;

function buildPage(paketId, kode, judulPaket, soalList) {
  const pageUrl = `${BASE_URL}/latihan-soal/matriks/${paketId}/`;

  const soalDB = soalList.map(s => ({
    type: 'pg', level: s.level,
    q: processLatex(s.q),
    opts: s.opts.map(processLatex),
    jawab: LETTER_TO_IDX[s.jawab] ?? 0,
    p: processLatex(s.p || ''),
    subMateri: s.subMateri || '', kesalahanUmum: s.kesalahanUmum || '',
  }));

  const quizDB = { [paketId]: { title: judulPaket, kode, soal: soalDB } };

  const schemaQuestions = soalList.map(s => ({
    '@type': 'Question',
    'name': s.q.replace(/<[^>]+>/g, '').substring(0, 120),
    'acceptedAnswer': { '@type': 'Answer', 'text': s.opts[LETTER_TO_IDX[s.jawab] ?? 0]?.replace(/<[^>]+>/g, '') || '' },
  }));
  const schema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Quiz',
    'name': `Latihan Soal ${kode} — ${judulPaket} | EksaktaLab`,
    'url': pageUrl, 'educationalLevel': 'high school',
    'about': { '@type': 'Thing', 'name': 'Matriks' },
    'hasPart': schemaQuestions,
  });

  let html = template;
  html = html.replace(/const PAKET_ID = 'fk-a1';/, `const PAKET_ID = '${paketId}';`);
  html = html.replace(/window\.quizDB=\{.*?\};(?=<\/script>)/s, `window.quizDB=${JSON.stringify(quizDB)};`);
  html = html.replace(/FK-A1/g, kode);
  html = html.replace(/(<span[^>]*q-bc-mode[^>]*>)[^<]*/g, '$1Per Sub-Materi');
  html = html.replace(/\s*<span[^>]*q-bc-sep[^>]*>[^<]*<\/span>\s*<span[^>]*q-bc-level[^>]*>[^<]*<\/span>/, '');
  html = html.replace(/<title>.*?<\/title>/, `<title>Latihan Soal ${kode} — ${judulPaket} | EksaktaLab</title>`);
  html = html.replace(/(<\/style>)/, LEVEL_BADGE_CSS + '$1');
  html = html.replace(RENDER_PATCH_FROM, RENDER_PATCH_TO);
  html = html.replace('</head>', `<script type="application/ld+json">${schema}</script>\n</head>`);
  if (html.includes('rel="canonical"')) {
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/,`$1${pageUrl}$2`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${pageUrl}">\n</head>`);
  }
  // Ganti path navigasi
  html = html.replace(/latihan-soal\/fungsi-kuadrat\//g, 'latihan-soal/matriks/');
  // Ganti teks breadcrumb
  html = html.replace(/>Fungsi Kuadrat</g, '>Matriks<');
  // Ganti nama materi di schema.org
  html = html.replace(/"name":"Fungsi Kuadrat"/g, '"name":"Matriks"');
  return html;
}

let totalPages = 0;
const outBase = join(ROOT, 'latihan-soal', 'matriks');

console.log('\n=== Sub-Materi Pages ===');
for (const section of data.sections) {
  const sid = section.sectionId;
  const judulSection = SECTION_JUDUL[sid] || section.sectionTitle;
  const paket1 = section.soal.filter((_, i) => i % 2 === 0);
  const paket2 = section.soal.filter((_, i) => i % 2 === 1);
  for (const [num, soalList] of [[1, paket1], [2, paket2]]) {
    const paketId = `mat-${sid.toLowerCase()}${num}`;
    const kode = `MAT-${sid}${num}`;
    const judulPaket = `${judulSection} · Paket ${num}`;
    const outDir = join(outBase, paketId);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), buildPage(paketId, kode, judulPaket, soalList), 'utf8');
    console.log(`✓ ${kode} — ${soalList.length} soal`);
    totalPages++;
  }
}

console.log(`\nSelesai: ${totalPages} halaman di-generate.`);
