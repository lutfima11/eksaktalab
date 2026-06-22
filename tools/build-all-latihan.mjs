// ─────────────────────────────────────────────────────────────
// build-all-latihan.mjs  —  Generate latihan soal SEMUA materi
//                           dengan FORMAT IDENTIK fungsi-linear.
//
// Per materi menghasilkan (sama persis seperti fungsi-linear):
//   • index.html               — hero + 3 tab (Paket Berlatih / Per Sub-Materi / Sesi Ujian)
//   • <pre>-01..12/            — paket berlatih (kuis, soal inline)
//   • <pre>-a1, -b1, …/        — paket per sub-materi (judul diambil dari section materi)
//   • ujian-akhir/, kuis-kilat/ — sesi ujian (engine timer)
//
// Sumber:
//   tools/topics.json          — daftar materi + prefix + jumlah paket
//   content/materi/<slug>.json — sub-materi (section) dari halaman materi  (extract-materi.mjs)
//   tools/templates/latihan.html + ujian-akhir/kuis-kilat fungsi-linear — cangkang kuis
//   tools/lib-random.mjs       — SOAL PLACEHOLDER (random, berkunci benar) — ganti via import-latex nanti
//
//   node tools/build-all-latihan.mjs           # semua materi
//   node tools/build-all-latihan.mjs <slug>    # satu materi
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { genSoal } from './lib-random.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://lutfima11.github.io/eksaktalab';
const cfg = JSON.parse(readFileSync(join(ROOT, 'tools', 'topics.json'), 'utf8'));
const { paket: N_BERLATIH, soalPerPaket, ujianSoal, kilatSoal } = cfg.perTopic;

const latihanTpl = readFileSync(join(ROOT, 'tools', 'templates', 'latihan.html'), 'utf8');
const ujianTpl = readFileSync(join(ROOT, 'latihan-soal', 'fungsi-linear', 'ujian-akhir', 'index.html'), 'utf8');
const kilatTpl = readFileSync(join(ROOT, 'latihan-soal', 'fungsi-linear', 'kuis-kilat', 'index.html'), 'utf8');

const SCRIPT_SRC = '<script src="../../../assets/js/quiz-data.js"></script>';
const pad2 = n => String(n).padStart(2, '0');
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const plain = s => s.replace(/<[^>]+>/g, '').replace(/\$/g, '').replace(/\s+/g, ' ').trim();
const ARROW = '<span class="card-btn-arrow"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3,2 7,5 3,8"/></svg></span>';

const LV = {
  Beginner: { color: '#059669', badge: 'beginner', LABEL: 'BEGINNER' },
  Intermediate: { color: '#D97706', badge: 'intermediate', LABEL: 'INTERMEDIATE' },
  Expert: { color: '#EF4444', badge: 'expert', LABEL: 'EXPERT' },
};
const LEVELS = ['Beginner', 'Intermediate', 'Expert'];

function render(tpl, vars) {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{{${k}}}`).join(v);
  const left = out.match(/\{\{[A-Z_]+\}\}/g);
  if (left) throw new Error('Token belum terisi: ' + [...new Set(left)].join(', '));
  return out;
}
function inlineData(html, paketId, dataObj) {
  if (!html.includes(SCRIPT_SRC)) throw new Error('script quiz-data.js tidak ditemukan');
  const js = `<script>window.quizDB=${JSON.stringify({ [paketId]: dataObj })};</script>`;
  return html.replace(SCRIPT_SRC, js);
}

// ── halaman paket berlatih / sub-materi (template latihan.html) ──
function writePaket(slug, title, { folder, paketId, kode, level, mode, judul, soal }) {
  let html = render(latihanTpl, {
    KODE: kode, MODE: mode, LEVEL_COLOR: LV[level].color, LEVEL_LABEL: level, PAKET: paketId,
  });
  html = html.split('latihan-soal/fungsi-linear/').join(`latihan-soal/${slug}/`)
             .split('>Fungsi Linear</a>').join(`>${esc(plain(title))}</a>`);
  html = inlineData(html, paketId, { title: judul, kode, level, soal });
  const dir = join(ROOT, 'latihan-soal', slug, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// ── halaman ujian / kilat ──
function writeExam(slug, title, tpl, { folder, paketId, oldTitle, judul, level, soal }) {
  let html = tpl
    .split('latihan-soal/fungsi-linear/').join(`latihan-soal/${slug}/`)
    .split('Kembali ke Fungsi Linear').join(`Kembali ke ${plain(title)}`)
    .split('>Fungsi Linear</a>').join(`>${esc(plain(title))}</a>`)
    .replace(`<title>${oldTitle} — EksaktaLab</title>`, `<title>${esc(plain(judul))} — EksaktaLab</title>`)
    .replace(`const PAKET_ID = '${folder}';`, `const PAKET_ID = '${paketId}';`);
  html = inlineData(html, paketId, { title: judul, kode: folder === 'ujian-akhir' ? 'UJIAN' : 'KILAT', level, soal });
  const dir = join(ROOT, 'latihan-soal', slug, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// ── kartu & chip untuk index ──
const cardBerlatih = (kode, level, judul, folder, paket) =>
  `      <div class="paket-card" data-level="${LV[level].badge}" data-paket="${paket}" data-locked="false">
        <div class="card-top"><span class="card-kode">${kode}</span><span class="level-badge badge-${LV[level].badge}">${LV[level].LABEL}</span></div>
        <div class="card-title">${judul}</div>
<button class="card-btn" onclick="location.href='${folder}/'"><span>Mulai</span>${ARROW}</button>
      </div>`;
const cardSub = (kode, level, judul, folder, sub) =>
  `      <div class="paket-card" data-sub="${sub}"><div class="card-top"><span class="card-kode">${kode}</span><span class="level-badge badge-${LV[level].badge}">${LV[level].LABEL}</span></div><div class="card-title">${esc(plain(judul))}</div>
<button class="card-btn" onclick="location.href='${folder}/'"><span>Mulai</span>${ARROW}</button></div>`;

function buildIndex(topic, berlatih, subs) {
  const slug = topic.slug, title = topic.title;
  const url = `${BASE}/latihan-soal/${slug}/`;
  const desc = `Latihan soal ${title} SMA: ${berlatih.length} paket berlatih, ${subs.length} paket per sub-materi, dan sesi ujian. Pilihan ganda interaktif, tingkat Beginner hingga Expert.`;
  const chips = ['<button class="sub-chip active" onclick="filterSub(\'semua\',this)"><span class="sub-chip-dot"></span>Semua</button>']
    .concat(subs.map(s => `<button class="sub-chip" onclick="filterSub('${s.sub}',this)"><span class="sub-chip-dot"></span>${s.sub} · ${esc(plain(s.judul)).slice(0, 28)}</button>`)).join('\n      ');

  return `<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
<script src="../../assets/js/theme.js"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Latihan Soal ${esc(title)} — EksaktaLab</title>
<link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/css/materi.css">
<link rel="stylesheet" href="../../assets/css/footer.css">
<link rel="stylesheet" href="../../assets/css/latihan-soal.css">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="Latihan Soal ${esc(title)} — EksaktaLab">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${BASE}/assets/og-image.svg">
<meta property="og:site_name" content="EksaktaLab">
<meta property="og:locale" content="id_ID">
</head>
<body>

<nav class="navbar">
  <a class="nav-logo" href="../../">
    <div class="nav-logo-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M4 8h8M4 12h16M4 16h8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M16 6l4 6-4 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <div class="nav-logo-text"><div class="nav-logo-name">Eksakta<em>Lab</em></div><div class="nav-logo-tag">Lab Belajar Matematika</div></div>
  </a>
  <div class="nav-right">
    <a class="nav-btn" href="../../materi/${slug}/">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="8,2 3,6.5 8,11"/></svg>
      Materi
    </a>
    <button class="nav-btn" id="themeBtn" onclick="toggleTheme()">🌙 Gelap</button>
  </div>
</nav>

<div class="page-hero">
  <div class="hero-grid"></div>
  <div class="hero-content">
    <div class="hero-eyebrow">&#128218; Latihan Soal · ${esc(title)}</div>
    <h1 class="hero-title">Berlatih <em>${esc(title)}</em></h1>
    <p class="hero-desc">${berlatih.length} paket soal variatif plus latihan per sub-materi dan sesi ujian bertimer. Pilih mode sesuai kebutuhanmu.</p>
    <div class="hero-stats">
      <div class="hero-stat"><strong>${berlatih.length}</strong> Paket Soal</div>
      <div class="hero-stat"><strong>${subs.length}</strong> Sub-Materi</div>
      <div class="hero-stat"><strong>2</strong> Sesi Ujian</div>
      <div class="hero-stat"><strong>Beginner → Expert</strong></div>
    </div>
  </div>
</div>

<div class="main-wrap">

  <div class="mode-tabs">
    <button class="mode-tab active" data-view="berlatih" onclick="switchView('berlatih',this)">
      <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1.5" y="2" width="12" height="11" rx="2"/><line x1="5" y1="5" x2="10" y2="5"/><line x1="5" y1="7.5" x2="9" y2="7.5"/><line x1="5" y1="10" x2="7.5" y2="10"/></svg>
      Paket Berlatih
    </button>
    <button class="mode-tab" data-view="sub" onclick="switchView('sub',this)">
      <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7.5" cy="7.5" r="5.5"/><line x1="7.5" y1="5" x2="7.5" y2="8"/><circle cx="7.5" cy="9.5" r=".6" fill="currentColor"/></svg>
      Per Sub-Materi
    </button>
    <button class="mode-tab" data-view="ujian" onclick="switchView('ujian',this)">
      <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 2h9a1 1 0 0 1 1 1v10l-2-1.5L9 13l-1.5-1.5L6 13l-2-1.5L2 13V3a1 1 0 0 1 1-1z"/><line x1="5" y1="5.5" x2="10" y2="5.5"/><line x1="5" y1="8" x2="8" y2="8"/></svg>
      Sesi Ujian
    </button>
  </div>

  <div class="view-panel active" id="view-berlatih">
    <div class="sec-head">
      <div class="sec-label">&#128218; Paket Berlatih</div>
      <div class="sec-title">${berlatih.length} Paket Soal Variatif</div>
      <div class="sec-desc">Setiap paket berisi ${soalPerPaket} soal pilihan ganda dengan pembahasan instan.</div>
    </div>
    <div class="filter-row">
      <span class="filter-label">LEVEL:</span>
      <button class="filter-btn active" onclick="filterPaket('semua',this)">Semua</button>
      <button class="filter-btn" onclick="filterPaket('beginner',this)">Beginner</button>
      <button class="filter-btn" onclick="filterPaket('intermediate',this)">Intermediate</button>
      <button class="filter-btn" onclick="filterPaket('expert',this)">Expert</button>
    </div>
    <div class="paket-grid" id="paket-grid">
${berlatih.map(p => cardBerlatih(p.kode, p.level, p.judul, p.folder, p.paket)).join('\n')}
    </div>
  </div>

  <div class="view-panel" id="view-sub">
    <div class="sec-head">
      <div class="sec-label">&#128218; Per Sub-Materi</div>
      <div class="sec-title">Pilih Topik yang Ingin Didalami</div>
      <div class="sec-desc">Latihan terfokus berdasarkan sub-bab pada materi ${esc(title)}.</div>
    </div>
    <div class="sub-filter">
      ${chips}
    </div>
    <div class="paket-grid" id="sub-grid">
${subs.map(s => cardSub(s.kode, s.level, s.judul, s.folder, s.sub)).join('\n')}
    </div>
  </div>

  <div class="view-panel" id="view-ujian">
    <div class="sec-head">
      <div class="sec-label">&#128218; Sesi Ujian</div>
      <div class="sec-title">Uji Kemampuanmu Secara Komprehensif</div>
      <div class="sec-desc">Soal terseleksi dengan timer. Nilai dan umpan balik tersedia setelah selesai.</div>
    </div>
    <div class="ujian-grid">
      <div class="ujian-card featured">
        <div class="ujian-badge">POPULER</div>
        <div class="ujian-eyebrow">Ujian Standar</div>
        <div class="ujian-title">Ujian Akhir ${esc(title)}</div>
        <div class="ujian-desc">Mencakup seluruh sub-bab. Campuran tingkat kesulitan. Cocok untuk persiapan ujian sekolah.</div>
        <div class="ujian-meta">
          <div class="ujian-meta-item"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 1v5l3 3"/><circle cx="6" cy="6" r="5"/></svg>45 menit</div>
          <div class="ujian-meta-item"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="3" width="10" height="7" rx="1.5"/><line x1="3" y1="5.5" x2="9" y2="5.5"/><line x1="3" y1="7.5" x2="7" y2="7.5"/></svg>${ujianSoal} soal</div>
          <div class="ujian-meta-item"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="6" r="5"/><polyline points="3,6 5,8 9,4"/></svg>Ada Nilai</div>
        </div>
        <button class="ujian-start-btn" onclick="location.href='ujian-akhir/'"><span>Mulai Ujian</span>${ARROW}</button>
      </div>
      <div class="ujian-card">
        <div class="ujian-eyebrow">Ujian Cepat</div>
        <div class="ujian-title">Kuis Kilat ${kilatSoal} Soal</div>
        <div class="ujian-desc">Uji pemahaman dalam waktu singkat. Cocok untuk warm-up sebelum belajar mendalam.</div>
        <div class="ujian-meta">
          <div class="ujian-meta-item"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 1v5l3 3"/><circle cx="6" cy="6" r="5"/></svg>15 menit</div>
          <div class="ujian-meta-item"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="1" y="3" width="10" height="7" rx="1.5"/><line x1="3" y1="5.5" x2="9" y2="5.5"/><line x1="3" y1="7.5" x2="7" y2="7.5"/></svg>${kilatSoal} soal</div>
          <div class="ujian-meta-item"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="6" r="5"/><polyline points="3,6 5,8 9,4"/></svg>Ada Nilai</div>
        </div>
        <button class="ujian-start-btn" onclick="location.href='kuis-kilat/'"><span>Mulai Kuis</span>${ARROW}</button>
      </div>
    </div>
  </div>

</div>

<button id="scroll-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="Kembali ke atas">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3,10 8,5 13,10"/></svg>
</button>
<script>
window.addEventListener('scroll',()=>{const el=document.documentElement;const pct=el.scrollTop/(el.scrollHeight-el.clientHeight)*100;const b=document.getElementById('scroll-top');if(b){pct>25?b.classList.add('visible'):b.classList.remove('visible');}});
function switchView(id,btn){document.querySelectorAll('.view-panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.mode-tab').forEach(b=>b.classList.remove('active'));document.getElementById('view-'+id).classList.add('active');btn.classList.add('active');}
function filterPaket(level,btn){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('#paket-grid .paket-card').forEach(c=>{c.style.display=(level==='semua'||c.dataset.level===level)?'':'none';});}
function filterSub(sub,btn){document.querySelectorAll('.sub-chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('#sub-grid .paket-card').forEach(c=>{c.style.display=(sub==='semua'||c.dataset.sub===sub)?'':'none';});}
</script>

<div id="eksaktalab-footer"></div>
<script src="../../assets/js/footer.js"></script>
<script src="../../assets/js/protect.js"></script>
</body>
</html>`;
}

// ── orkestrasi ──
const targets = process.argv[2] ? cfg.topics.filter(t => t.slug === process.argv[2]) : cfg.topics;
let totalPages = 0;

for (const topic of targets) {
  const { slug, title, prefix } = topic;
  const pre = prefix.toLowerCase();

  // Paket Berlatih
  const berlatih = [];
  for (let i = 1; i <= N_BERLATIH; i++) {
    const level = i <= Math.ceil(N_BERLATIH / 3) ? 'Beginner' : i <= Math.ceil(2 * N_BERLATIH / 3) ? 'Intermediate' : 'Expert';
    const folder = `${pre}-${pad2(i)}`, kode = `${prefix}-${pad2(i)}`, judul = `${title} ${i}`;
    const soal = genSoal(`${slug}|berlatih|${i}`, soalPerPaket, level);
    writePaket(slug, title, { folder, paketId: folder, kode, level, mode: 'Paket Berlatih', judul, soal });
    berlatih.push({ kode, level, judul, folder, paket: i });
    totalPages++;
  }

  // Per Sub-Materi (dari section materi)
  const mFile = join(ROOT, 'content', 'materi', `${slug}.json`);
  const subs = [];
  if (existsSync(mFile)) {
    const sections = JSON.parse(readFileSync(mFile, 'utf8')).sections;
    sections.forEach((sec, idx) => {
      const id = sec.id || String.fromCharCode(65 + idx);
      const level = LEVELS[idx % 3];
      const folder = `${pre}-${id.toLowerCase()}1`, kode = `${prefix}-${id}1`, judul = sec.title;
      const soal = genSoal(`${slug}|sub|${id}`, soalPerPaket, level);
      writePaket(slug, title, { folder, paketId: folder, kode, level, mode: 'Per Sub-Materi', judul, soal });
      subs.push({ kode, level, judul, folder, sub: id });
      totalPages++;
    });
  }

  // Sesi Ujian
  writeExam(slug, title, ujianTpl, { folder: 'ujian-akhir', paketId: `${pre}-ujian`, oldTitle: 'Latihan Soal UJIAN', judul: `Ujian Akhir ${title}`, level: 'Komprehensif', soal: genSoal(`${slug}|ujian`, ujianSoal, 'Campuran') });
  writeExam(slug, title, kilatTpl, { folder: 'kuis-kilat', paketId: `${pre}-kilat`, oldTitle: 'Latihan Soal KILAT', judul: `Kuis Kilat ${title}`, level: 'Campuran', soal: genSoal(`${slug}|kilat`, kilatSoal, 'Campuran') });
  totalPages += 2;

  // Index
  writeFileSync(join(ROOT, 'latihan-soal', slug, 'index.html'), buildIndex(topic, berlatih, subs));
  totalPages++;

  console.log(`✓ ${slug.padEnd(26)} ${berlatih.length} berlatih + ${subs.length} sub + 2 ujian + index`);
}
console.log(`\n✅ ${targets.length} materi, ${totalPages} halaman digenerate.`);
