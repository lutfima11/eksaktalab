// Aktifkan tombol CTA "Kerjakan Latihan Soal" di tiap halaman materi:
// href="#" + <span class="coming-soon">Segera</span>  →  link ke latihan-soal/<slug>/
// Idempoten.  node tools/update-materi-links.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const topics = JSON.parse(readFileSync(join(ROOT, 'tools', 'topics.json'), 'utf8')).topics;

const re = /<a class="nav-btn primary" href="#">([\s\S]*?)<span class="coming-soon">Segera<\/span>\s*<\/a>/;
let done = 0, skip = 0;
for (const { slug } of topics) {
  const file = join(ROOT, 'materi', slug, 'index.html');
  if (!existsSync(file)) { console.warn('  ⚠ tidak ada materi/' + slug); continue; }
  let html = readFileSync(file, 'utf8');
  if (!re.test(html)) { skip++; continue; }
  html = html.replace(re, `<a class="nav-btn primary" href="../../latihan-soal/${slug}/">$1</a>`);
  writeFileSync(file, html);
  console.log(`  ✓ ${slug}`);
  done++;
}
console.log(`\n✅ ${done} materi diaktifkan tombol latihannya, ${skip} dilewati (sudah aktif / pola beda).`);
