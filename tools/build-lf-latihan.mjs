// build-lf-latihan.mjs
// Generator halaman latihan Limit Fungsi (lim-xN dan lim-XN per sub-materi)
// node tools/build-lf-latihan.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://lutfima11.github.io/eksaktalab';

// Gunakan template dari fk-a1 (format quiz standar)
const templatePath = join(ROOT, 'latihan-soal', 'fungsi-kuadrat', 'fk-a1', 'index.html');
const dataPath = join(ROOT, 'content', 'raw', 'limit-fungsi.json');

const template = readFileSync(templatePath, 'utf8');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const LETTER_TO_IDX = { a: 0, b: 1, c: 2, d: 3, e: 4 };

const SECTION_JUDUL = {
  A: 'Definisi, Syarat & Sifat Limit',
  B: 'Limit Berhingga Aljabar',
  C: 'Limit di Tak Hingga',
  D: 'Limit Fungsi Trigonometri',
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
.soal-table{border-collapse:collapse;font-size:.88em;margin:.4rem 0;}
.soal-table td{border:1px solid var(--border);padding:.28rem .55rem;}
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

function buildPage(paketId, kode, judulPaket, soalList, bcMode) {
  const pageUrl = `${BASE_URL}/latihan-soal/limit-fungsi/${paketId}/`;

  const soalDB = soalList.map(s => ({
    type: 'pg', level: s.level, q: s.q, opts: s.opts,
    jawab: LETTER_TO_IDX[s.jawab] ?? 0,
    p: s.p || '', subMateri: s.subMateri || '', kesalahanUmum: s.kesalahanUmum || '',
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
    'about': { '@type': 'Thing', 'name': 'Limit Fungsi' },
    'hasPart': schemaQuestions,
  });

  let html = template;
  html = html.replace(/const PAKET_ID = 'fk-a1';/, `const PAKET_ID = '${paketId}';`);
  html = html.replace(/window\.quizDB=\{.*?\};(?=<\/script>)/s, `window.quizDB=${JSON.stringify(quizDB)};`);
  html = html.replace(/FK-A1/g, kode);
  html = html.replace(/(<span[^>]*q-bc-mode[^>]*>)[^<]*/g, `$1${bcMode}`);
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
  // Ganti semua referensi fungsi-kuadrat → limit-fungsi di link navigasi
  html = html.replace(/latihan-soal\/fungsi-kuadrat\//g, 'latihan-soal/limit-fungsi/');
  return html;
}

let totalPages = 0;
const outBase = join(ROOT, 'latihan-soal', 'limit-fungsi');

// ── A. Sub-Materi pages: lim-a1, lim-b1, lim-c1, lim-d1 (all 20 soal per section) ──
console.log('\n=== Sub-Materi Pages ===');
for (const section of data.sections) {
  const sid = section.sectionId;
  const paketId = `lim-${sid.toLowerCase()}1`;
  const kode = `LIM-${sid}1`;
  const judulSection = SECTION_JUDUL[sid] || section.sectionTitle;
  const judulPaket = judulSection;

  const outDir = join(outBase, paketId);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), buildPage(paketId, kode, judulPaket, section.soal, 'Per Sub-Materi'), 'utf8');
  console.log(`✓ ${kode} — ${section.soal.length} soal (${section.soal.map(s=>s.level[0]).join('')})`);
  totalPages++;
}

// ── B. Numbered Paket Berlatih: lim-01 to lim-12 ──
// Mapping: per level per section
// LIM-01..04: Beginner (1 per section A/B/C/D)
// LIM-05..08: Intermediate (1 per section)
// LIM-09..12: Expert (1 per section, C & D have 4 Expert soal each)
console.log('\n=== Paket Berlatih Numbered Pages ===');

const levelMap = [
  // [paketNum, sectionIdx, level filter]
  [1,  0, 'Beginner'],   // LIM-01: A Beginner
  [2,  1, 'Beginner'],   // LIM-02: B Beginner
  [3,  2, 'Beginner'],   // LIM-03: C Beginner
  [4,  3, 'Beginner'],   // LIM-04: D Beginner
  [5,  0, 'Intermediate'], // LIM-05: A Intermediate
  [6,  1, 'Intermediate'], // LIM-06: B Intermediate
  [7,  2, 'Intermediate'], // LIM-07: C Intermediate
  [8,  3, 'Intermediate'], // LIM-08: D Intermediate
  [9,  0, 'Expert'],     // LIM-09: A Expert
  [10, 1, 'Expert'],     // LIM-10: B Expert
  [11, 2, 'Expert'],     // LIM-11: C Expert
  [12, 3, 'Expert'],     // LIM-12: D Expert
];

const SECTION_LABELS = ['A', 'B', 'C', 'D'];

for (const [num, secIdx, level] of levelMap) {
  const section = data.sections[secIdx];
  const sid = SECTION_LABELS[secIdx];
  const soalList = section.soal.filter(s => s.level === level);
  const numStr = String(num).padStart(2, '0');
  const paketId = `lim-${numStr}`;
  const kode = `LIM-${numStr}`;
  const judulPaket = `${SECTION_JUDUL[sid]} · ${level}`;

  const outDir = join(outBase, paketId);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), buildPage(paketId, kode, judulPaket, soalList, 'Paket Berlatih'), 'utf8');
  console.log(`✓ ${kode} — ${soalList.length} soal [${sid} ${level}]`);
  totalPages++;
}

console.log(`\nSelesai: ${totalPages} halaman di-generate.`);
