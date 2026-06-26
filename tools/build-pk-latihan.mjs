// ─────────────────────────────────────────────────────────────
// build-pk-latihan.mjs
//
// Generator halaman latihan sub-materi Persamaan Kuadrat (pk-xN)
// dari content/raw/persamaan-kuadrat.json
//
// Output per section (A-F):
//   latihan-soal/persamaan-kuadrat/pk-x1/index.html  (soal ganjil → campuran)
//   latihan-soal/persamaan-kuadrat/pk-x2/index.html  (soal genap  → campuran)
//
// Setiap halaman:
//   • Soal di-bake sebagai quizDB (static → SEO)
//   • Level badge per soal (Beginner / Intermediate / Expert)
//   • Schema.org Quiz markup
//   • Template clone dari pk-a1 (CSS/engine tetap)
//
// Pakai:
//   node tools/build-pk-latihan.mjs
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://lutfima11.github.io/eksaktalab';

// ── Baca template & data ──
const templatePath = join(ROOT, 'latihan-soal', 'persamaan-kuadrat', 'pk-a1', 'index.html');
const dataPath = join(ROOT, 'content', 'raw', 'persamaan-kuadrat.json');

const template = readFileSync(templatePath, 'utf8');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

// ── Konversi jawab huruf → index ──
const LETTER_TO_IDX = { a: 0, b: 1, c: 2, d: 3, e: 4 };

// ── Label level & CSS class ──
const LEVEL_LABEL = {
  'Beginner':     'Beginner',
  'Intermediate': 'Intermediate',
  'Expert':       'Expert',
};
// Untuk section F yang pakai label jenis ujian
const LEVEL_SECTION_F = {
  'UTBK': 'UTBK',
  'SIMAK UI': 'SIMAK UI',
  'UTUL UGM': 'UTUL UGM',
  'Olimpiade': 'Olimpiade',
};

// ── Judul section → teks lengkap ──
const SECTION_JUDUL = {
  A: 'Pengertian Persamaan Kuadrat',
  B: 'Menyelesaikan Persamaan Kuadrat',
  C: 'Diskriminan dan Jenis-Jenis Akar',
  D: 'Hubungan Akar-Akar (Rumus Vieta)',
  E: 'Menyusun Persamaan Kuadrat Baru',
  F: 'Kapita Selekta Persamaan Kuadrat',
};

// ── CSS level badge (inject ke <style> template) ──
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
.qlb-utbk,.qlb-simak,.qlb-utul,.qlb-olimpiade{background:var(--blue);color:var(--blue-b);}
`;

// ── Patch renderQ untuk tambah level badge ──
// Inject setelah baris: html+=`<div class="q-soal-meta">`
const RENDER_PATCH_FROM = `html+=\`<div class="q-soal-meta">
    <span class="q-type \${typeCls[q.type]||'qt-pg'}">\${typeLabel[q.type]||'Pilihan Ganda'}</span>
    <button class="q-tandai\${S.marked[i]?' on':''}" id="tm\${i}" onclick="mark(\${i})">
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 2h6v9l-3-2.2L4 11V2z"/></svg>
      \${S.marked[i]?'Ditandai':'Tandai Soal'}
    </button>
  </div>\`;`;

const RENDER_PATCH_TO = `// level badge class
  const lvlCls={Beginner:'qlb-beginner',Intermediate:'qlb-intermediate',Expert:'qlb-expert',
    'UTBK':'qlb-utbk','SIMAK UI':'qlb-simak','UTUL UGM':'qlb-utul','Olimpiade':'qlb-olimpiade'};
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

// ── Generate satu halaman ──
function buildPage(sectionId, sectionTitle, soalList, paketNum) {
  const kode = `PK-${sectionId}${paketNum}`;
  const paketId = kode.toLowerCase();
  const judulSection = SECTION_JUDUL[sectionId] || sectionTitle;
  const judulPaket = `${judulSection} · Paket ${paketNum}`;
  const pageUrl = `${BASE_URL}/latihan-soal/persamaan-kuadrat/${paketId}/`;

  // Konversi soal ke format quizDB
  const soalDB = soalList.map(s => ({
    type: 'pg',
    level: s.level,
    q: s.q,
    opts: s.opts,
    jawab: LETTER_TO_IDX[s.jawab] ?? 0,
    p: s.p || '',
    subMateri: s.subMateri || '',
    kesalahanUmum: s.kesalahanUmum || '',
  }));

  const quizDB = { [paketId]: { title: judulPaket, kode, soal: soalDB } };

  // ── Schema.org Quiz ──
  const schemaQuestions = soalList.map((s, i) => ({
    '@type': 'Question',
    'name': s.q.replace(/<[^>]+>/g, '').substring(0, 120),
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': s.opts[LETTER_TO_IDX[s.jawab] ?? 0]?.replace(/<[^>]+>/g, '') || '',
    },
  }));
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    'name': `Latihan Soal ${judulPaket} — EksaktaLab`,
    'url': pageUrl,
    'educationalLevel': 'high school',
    'about': { '@type': 'Thing', 'name': 'Persamaan Kuadrat' },
    'hasPart': schemaQuestions,
  });

  // ── Patch template ──
  let html = template;

  // PAKET_ID constant
  html = html.replace(
    /const PAKET_ID = 'pk-a1';/,
    `const PAKET_ID = '${paketId}';`
  );

  // quizDB data
  html = html.replace(
    /window\.quizDB=\{.*?\};(?=<\/script>)/s,
    `window.quizDB=${JSON.stringify(quizDB)};`
  );

  // Breadcrumb kode (PK-A1 → kode baru)
  html = html.replace(/PK-A1/g, kode);

  // Breadcrumb judul — hanya di dalam elemen teks breadcrumb (bukan di title)
  html = html.replace(
    /(<span[^>]*q-bc-mode[^>]*>)[^<]*/g,
    `$1Per Sub-Materi`
  );

  // Title — ganti terakhir supaya tidak kena double-replace
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>Latihan Soal ${kode} — ${judulPaket} | EksaktaLab</title>`
  );

  // Level badge CSS → inject sebelum </style> pertama setelah baris terakhir CSS
  html = html.replace(/(<\/style>)/, LEVEL_BADGE_CSS + '$1');

  // Patch renderQ untuk level badge
  html = html.replace(RENDER_PATCH_FROM, RENDER_PATCH_TO);

  // Schema.org → sebelum </head>
  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${schema}</script>\n</head>`
  );

  // Canonical URL
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${pageUrl}$2`
  );

  return html;
}

// ── Main ──
let totalPages = 0;

for (const section of data.sections) {
  const sid = section.sectionId;
  const soalAll = section.soal;

  // Ganjil = paket 1 (index 0,2,4,...), Genap = paket 2 (index 1,3,5,...)
  const paket1 = soalAll.filter((_, i) => i % 2 === 0); // soal ke-1,3,5,...
  const paket2 = soalAll.filter((_, i) => i % 2 === 1); // soal ke-2,4,6,...

  for (const [num, soalList] of [[1, paket1], [2, paket2]]) {
    const kode = `pk-${sid.toLowerCase()}${num}`;
    const outDir = join(ROOT, 'latihan-soal', 'persamaan-kuadrat', kode);
    mkdirSync(outDir, { recursive: true });

    const html = buildPage(sid, section.sectionTitle, soalList, num);
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');

    console.log(`✓ ${kode.toUpperCase()} — ${soalList.length} soal (${soalList.map(s=>s.level[0]).join('')})`);
    totalPages++;
  }
}

console.log(`\nSelesai: ${totalPages} halaman di-generate.`);
