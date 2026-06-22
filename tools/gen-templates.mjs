// ─────────────────────────────────────────────────────────────
// gen-templates.mjs
// Buat file template dari halaman kanonik yang SUDAH bekerja,
// dengan mengganti token yang bervariasi → placeholder {{...}}.
// Dipakai sekali untuk men-seed tools/templates/. Aman dijalankan
// ulang (idempotent). Setiap penggantian WAJIB ketemu tepat 1×,
// kalau tidak → error (mencegah template rusak diam-diam).
//
//   node tools/gen-templates.mjs
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOPIC = join(ROOT, 'latihan-soal', 'fungsi-linear');
const OUT = join(ROOT, 'tools', 'templates');
mkdirSync(OUT, { recursive: true });

function tokenize(srcFile, outName, pairs) {
  let s = readFileSync(srcFile, 'utf8');
  for (const [from, to] of pairs) {
    const n = s.split(from).length - 1;
    if (n !== 1) throw new Error(`[${outName}] string harus muncul TEPAT 1×, tapi ${n}×:\n  ${from}`);
    s = s.replace(from, to);
  }
  writeFileSync(join(OUT, outName), s);
  console.log(`OK — ${outName} dibuat (${pairs.length} token)`);
}

// ── Template LATIHAN (dari fl-01) ──
tokenize(join(TOPIC, 'fl-01', 'index.html'), 'latihan.html', [
  ['<title>Latihan Soal FL-01 — EksaktaLab</title>', '<title>Latihan Soal {{KODE}} — EksaktaLab</title>'],
  ['<span class="q-bc-kode">FL-01</span>', '<span class="q-bc-kode">{{KODE}}</span>'],
  ['<span class="q-bc-mode">Paket Berlatih</span>', '<span class="q-bc-mode">{{MODE}}</span>'],
  ['<span class="q-bc-level" style="color:#059669">Beginner</span>', '<span class="q-bc-level" style="color:{{LEVEL_COLOR}}">{{LEVEL_LABEL}}</span>'],
  ["const PAKET_ID = '1';", "const PAKET_ID = '{{PAKET}}';"],
]);
