// build-fk-latihan.mjs
// Generator halaman latihan sub-materi Fungsi Kuadrat (fk-xN)
// node tools/build-fk-latihan.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://lutfima11.github.io/eksaktalab';

const templatePath = join(ROOT, 'latihan-soal', 'fungsi-kuadrat', 'fk-a1', 'index.html');
const dataPath = join(ROOT, 'content', 'raw', 'fungsi-kuadrat.json');

const template = readFileSync(templatePath, 'utf8');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const LETTER_TO_IDX = { a: 0, b: 1, c: 2, d: 3, e: 4 };

const SECTION_JUDUL = {
  A: 'Pengertian',
  B: 'Titik-Titik Penting Grafik',
  C: 'Menggambar Grafik',
  D: 'Sifat Grafik Berdasarkan a dan D',
  E: 'Bentuk Vertex',
  F: 'Menyusun Persamaan',
  G: 'Nilai Ekstrem pada Interval',
  H: 'Aplikasi dalam Kehidupan',
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

function buildPage(sectionId, sectionTitle, soalList, paketNum) {
  const kode = `FK-${sectionId}${paketNum}`;
  const paketId = kode.toLowerCase();
  const judulSection = SECTION_JUDUL[sectionId] || sectionTitle;
  const judulPaket = `${judulSection} · Paket ${paketNum}`;
  const pageUrl = `${BASE_URL}/latihan-soal/fungsi-kuadrat/${paketId}/`;

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
    'name': `Latihan Soal ${judulPaket} — EksaktaLab`,
    'url': pageUrl, 'educationalLevel': 'high school',
    'about': { '@type': 'Thing', 'name': 'Fungsi Kuadrat' },
    'hasPart': schemaQuestions,
  });

  let html = template;
  html = html.replace(/const PAKET_ID = 'fk-a1';/, `const PAKET_ID = '${paketId}';`);
  html = html.replace(/window\.quizDB=\{.*?\};(?=<\/script>)/s, `window.quizDB=${JSON.stringify(quizDB)};`);
  html = html.replace(/FK-A1/g, kode);
  html = html.replace(/(<span[^>]*q-bc-mode[^>]*>)[^<]*/g, `$1Per Sub-Materi`);
  // Hapus level di breadcrumb
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
  return html;
}

let totalPages = 0;
for (const section of data.sections) {
  const sid = section.sectionId;
  const paket1 = section.soal.filter((_, i) => i % 2 === 0);
  const paket2 = section.soal.filter((_, i) => i % 2 === 1);
  for (const [num, soalList] of [[1, paket1], [2, paket2]]) {
    const kode = `fk-${sid.toLowerCase()}${num}`;
    const outDir = join(ROOT, 'latihan-soal', 'fungsi-kuadrat', kode);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), buildPage(sid, section.sectionTitle, soalList, num), 'utf8');
    console.log(`✓ ${kode.toUpperCase()} — ${soalList.length} soal (${soalList.map(s => s.level[0]).join('')})`);
    totalPages++;
  }
}
console.log(`\nSelesai: ${totalPages} halaman di-generate.`);
