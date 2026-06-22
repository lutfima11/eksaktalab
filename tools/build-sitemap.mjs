// ─────────────────────────────────────────────────────────────
// build-sitemap.mjs  —  Generate sitemap.xml mencakup SEMUA halaman
//
// Memindai seluruh index.html / *.html (kecuali template, 404, folder kerja),
// menghasilkan sitemap.xml dengan prioritas & changefreq sesuai jenis halaman.
//
//   node tools/build-sitemap.mjs
// ─────────────────────────────────────────────────────────────
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://lutfima11.github.io/eksaktalab';
const SKIP_DIRS = new Set(['.git', '.claude', 'assets', 'tools', 'content', 'node_modules']);

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name) || name === '_template') continue;
      walk(full);
    } else if (name.endsWith('.html') && name !== '404.html') {
      pages.push(full);
    }
  }
})(ROOT);

function urlFor(file) {
  let rel = relative(ROOT, file).split(sep).join('/');
  if (rel === 'index.html') return BASE + '/';
  if (rel.endsWith('/index.html')) return `${BASE}/${rel.slice(0, -'index.html'.length)}`;
  return `${BASE}/${rel}`;
}
function metaFor(url) {
  const p = url.replace(BASE, '');
  if (p === '/') return { pr: '1.0', cf: 'weekly' };
  if (p.startsWith('/materi/')) return { pr: '0.9', cf: 'monthly' };
  if (/^\/latihan-soal\/[^/]+\/$/.test(p)) return { pr: '0.8', cf: 'monthly' };  // index latihan
  if (p.startsWith('/latihan-soal/')) return { pr: '0.6', cf: 'monthly' };       // paket/ujian
  if (p.startsWith('/blog/')) return { pr: '0.7', cf: 'monthly' };
  return { pr: '0.5', cf: 'monthly' };
}

const today = new Date().toISOString().slice(0, 10);
const urls = [...new Set(pages.map(urlFor))].sort();
const body = urls.map(u => {
  const { pr, cf } = metaFor(u);
  return `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`;
}).join('\n');

writeFileSync(join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`✅ sitemap.xml: ${urls.length} URL`);
