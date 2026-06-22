// ─────────────────────────────────────────────────────────────
// extract-materi.mjs  —  Ambil sub-materi + contoh soal dari halaman materi
//
// Tiap halaman materi punya:
//   <h2 class="section-title"><span class="section-badge">A</span>Judul</h2>  → sub-materi
//   <div class="box box-contoh">…pertanyaan…</div>
//   <div class="penyelesaian">…pembahasan…</div>                              → contoh soal
//
// Output: content/materi/<slug>.json  → dipakai build-pelajari.mjs untuk
// membuat halaman latihan mode "Pelajari" (baca soal → buka pembahasan).
//
//   node tools/extract-materi.mjs            # semua materi di topics.json
//   node tools/extract-materi.mjs <slug>     # satu materi
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const topics = JSON.parse(readFileSync(join(ROOT, 'tools', 'topics.json'), 'utf8')).topics;

// indeks tepat setelah </div> penutup yang cocok untuk <div...> di openIdx
function divEnd(html, openIdx) {
  const tagRe = /<\/?div\b[^>]*>/g;
  tagRe.lastIndex = openIdx;
  let depth = 0, m;
  while ((m = tagRe.exec(html)) !== null) {
    depth += m[0][1] === '/' ? -1 : 1;
    if (depth === 0) return tagRe.lastIndex;
  }
  return html.length;
}

function tidy(s) {
  return s.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
}

function extract(slug) {
  const file = join(ROOT, 'materi', slug, 'index.html');
  if (!existsSync(file)) return null;
  const html = readFileSync(file, 'utf8');

  // posisi semua section-title
  const secs = [...html.matchAll(/<h2 class="section-title">(?:<span class="section-badge">([^<]*)<\/span>)?([\s\S]*?)<\/h2>/g)]
    .map(m => ({ idx: m.index, badge: (m[1] || '').trim(), title: tidy(m[2].replace(/<[^>]+>/g, '')) }));

  const sectionOf = (pos) => { let cur = null; for (const s of secs) { if (s.idx < pos) cur = s; else break; } return cur; };

  // contoh soal
  const boxRe = /<div class="box box-contoh">/g;
  let bm; const items = [];
  while ((bm = boxRe.exec(html)) !== null) {
    const bStart = bm.index;
    const bEnd = divEnd(html, bStart);
    let box = html.slice(bStart, bEnd);
    const label = (box.match(/<div class="box-label">([\s\S]*?)<\/div>/) || [, ''])[1].replace(/<[^>]+>/g, '').trim();
    const q = box.replace(/^<div class="box box-contoh">/, '').replace(/<\/div>\s*$/, '').replace(/<div class="box-label">[\s\S]*?<\/div>/, '').trim();

    // penyelesaian setelah box (lewati whitespace)
    let p = null;
    const after = html.slice(bEnd).match(/^\s*<div class="penyelesaian">/);
    if (after) { const pStart = bEnd + after[0].indexOf('<div'); const pEnd = divEnd(html, pStart); p = html.slice(pStart, pEnd).replace(/^<div class="penyelesaian">/, '').replace(/<\/div>\s*$/, '').trim(); }

    const sec = sectionOf(bStart);
    items.push({ section: sec ? sec.badge : '?', label, q: tidy(q), p: p ? tidy(p) : null });
  }

  // susun per sub-materi
  const sections = secs.map(s => ({ id: s.badge, title: s.title, contoh: items.filter(it => it.section === s.badge) }))
    .filter(s => s.contoh.length > 0);

  return { materi: slug, sections, totalContoh: items.length };
}

const list = process.argv[2] ? topics.filter(t => t.slug === process.argv[2]) : topics;
mkdirSync(join(ROOT, 'content', 'materi'), { recursive: true });
console.log('Materi'.padEnd(28), 'Sub-materi', ' Contoh');
for (const t of list) {
  const data = extract(t.slug);
  if (!data) { console.log(t.slug.padEnd(28), 'TIDAK ADA materi/' + t.slug); continue; }
  data.title = t.title; data.prefix = t.prefix;
  writeFileSync(join(ROOT, 'content', 'materi', `${t.slug}.json`), JSON.stringify(data, null, 2) + '\n');
  console.log(t.slug.padEnd(28), String(data.sections.length).padStart(6), String(data.totalContoh).padStart(7));
}
