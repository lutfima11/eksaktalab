// ─────────────────────────────────────────────────────────────
// import-pk-sections.mjs
//
// Parser bank soal LaTeX format "soal_pg_section_X.tex" EksaktaLab
// (Persamaan Kuadrat Section A–F) → JSON terstruktur
//
// Format sumber:
//   • Level section: \textbf{\underline{A. Beginner}} / B. Intermediate / C. Expert
//   • Metadata komentar: % [LEVEL: ..] [SUB-MATERI: ..] [JENIS: ..] [KESALAHAN UMUM: ..]
//   • Soal: \item di enumerate level-1
//   • Opsi: \item di enumerate[(a)] level-2
//   • Kunci: tabular \begin{tabular} → baris "1&c&5&a&..."
//   • Pembahasan: \textbf{N.}\quad teks pembahasan
//
// Pakai:
//   node tools/import-pk-sections.mjs "path/section_A.tex" [path/section_B.tex ...]
//   Output: content/raw/persamaan-kuadrat.json
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

if (process.argv.length < 3) {
  console.error('Usage: node tools/import-pk-sections.mjs [--out=filename.json] file1.tex [file2.tex ...]');
  process.exit(1);
}

// ── Opsi --out=filename.json ──
let outFileName = null;
const filteredArgs = process.argv.slice(2).filter(a => {
  if (a.startsWith('--out=')) { outFileName = a.slice(6); return false; }
  return true;
});
process.argv = [...process.argv.slice(0, 2), ...filteredArgs];

// ── konversi teks LaTeX → HTML (non-math), tanpa trim ─────────
// JANGAN tambahkan .trim() di sini — spasi tepi dibutuhkan saat join segmen math
function latexToHtml(s) {
  return s
    .replace(/\\textbf\{([^}]*)\}/g, '<b>$1</b>')
    .replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>')
    .replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>')
    .replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>')
    .replace(/\\ldots/g, '…')
    .replace(/\\checkmark/g, '✓')
    .replace(/\\%/g, '%')
    .replace(/\\ /g, ' ')
    .replace(/\\quad/g, ' ')
    .replace(/\s+/g, ' ');
  // biarkan spasi leading/trailing — cleanText akan trim di akhir
}

// ── bersihkan teks tapi pertahankan blok math $...$ dan \[...\] ──
function cleanText(s) {
  let rest = s;
  // Normalise display math
  rest = rest.replace(/\\\[([\s\S]*?)\\\]/g, (_, m) => `\\[${m.trim()}\\]`);
  // Tambahkan spasi di sekitar $ dan \[..\] agar "dalam$x$adalah" → "dalam $x$ adalah"
  rest = rest
    .replace(/([^\s])(\$)/g, '$1 $2')
    .replace(/(\$)([^\s$])/g, '$1 $2')
    .replace(/([^\s])(\\\[)/g, '$1 $2')
    .replace(/(\\\])([^\s])/g, '$1 $2');
  // Split pada blok math, konversi teks biasa → HTML (tanpa trim per segmen)
  const segments = rest.split(/(\$[^$]+\$|\\\[[\s\S]*?\\\])/g);
  const parts = [];
  for (const seg of segments) {
    if (seg.startsWith('$') || seg.startsWith('\\[')) {
      parts.push(seg);
    } else {
      parts.push(latexToHtml(seg));
    }
  }
  // Trim hanya di akhir, bukan per segmen
  return parts.join('').replace(/\s+/g, ' ').trim();
}

// ── pecah baris yang mengandung banyak \item menjadi array ──
function splitItems(line) {
  // "  \item foo \item bar" → ['foo', 'bar']
  return line.split(/\\item/).map(s => s.trim()).filter(Boolean);
}

// ── parse satu file .tex ──
function parseFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');

  // Ambil section identifier dari footer: "Section X --- Judul"
  const footerMatch = raw.match(/\\cfoot\{[^}]*Section\s+([A-F])[^}]*---\s*([^}]+)\}/);
  const sectionId = footerMatch ? footerMatch[1] : '?';
  const sectionTitle = footerMatch ? footerMatch[2].trim() : 'Unknown';

  const body = raw.split('\\begin{document}')[1]?.split('\\end{document}')[0] || '';
  const lines = body.split('\n');

  // ── 1. Parse kunci jawaban dari tabular ──
  const kunci = {}; // { '1': 'e', '2': 'd', ... }
  let inKunci = false;
  for (const line of lines) {
    const t = line.trim();
    if (t.includes('KUNCI JAWABAN')) { inKunci = true; continue; }
    if (t.includes('Pembahasan')) { inKunci = false; continue; }
    if (inKunci && /^\d+&[a-e]/.test(t)) {
      // Format: "1&e&5&a&9&b&13&c&17&a\\"
      const entries = t.replace(/\\\\.*$/, '').split('&');
      for (let i = 0; i + 1 < entries.length; i += 2) {
        const num = entries[i].trim();
        const ans = entries[i + 1].trim().toLowerCase();
        if (/^\d+$/.test(num) && /^[a-e]$/.test(ans)) {
          kunci[num] = ans;
        }
      }
    }
  }

  // ── 2. Parse pembahasan ──
  const pembahasan = {}; // { '1': 'teks pembahasan', ... }
  let inPembahasan = false;
  let curPNum = null;
  let pBuf = [];

  function flushP() {
    if (curPNum && pBuf.length) {
      pembahasan[curPNum] = cleanText(pBuf.join(' ')
        .replace(/\\quad/g, ' ')
        .replace(/\\textbf\{\(?[a-e]\)?\}/g, '') // hapus semua answer hint: \textbf{(c)} / \textbf{c}
        .replace(/\.\s*\*\*\([a-e]\)\*\*/g, '.') // hapus bold letter jika sudah ke HTML
        .replace(/\\;\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      );
    }
    curPNum = null; pBuf = [];
  }

  for (const line of lines) {
    const t = line.trim();
    if (t.includes('Pembahasan') && t.includes('bfseries')) { inPembahasan = true; continue; }
    if (!inPembahasan) continue;
    if (t.includes('\\end{document}')) break;

    // Deteksi awal pembahasan nomor: \textbf{1.}\quad
    const pStart = t.match(/^\\textbf\{(\d+)\.\}\\quad\s*(.*)/);
    if (pStart) {
      flushP();
      curPNum = pStart[1];
      pBuf = [pStart[2]];
      continue;
    }
    if (curPNum) {
      // Lanjutan pembahasan (multi-line)
      if (t === '' || t.startsWith('\\end') || t.startsWith('\\begin{tabular')) {
        flushP(); continue;
      }
      pBuf.push(t);
    }
  }
  flushP();

  // ── 3. Parse soal ──
  const soal = [];
  let currentLevel = null;
  let enumDepth = 0;
  let commentBuf = [];
  let cur = null;
  let phase = null; // 'q' | 'opts'
  let globalCounter = 0; // nomor soal global (setcounter aware)

  function flushSoal() {
    if (!cur) return;
    if (cur._q.length) {
      cur.q = cleanText(cur._q.join(' '));
      cur.opts = cur._opts.map(cleanText);
      const num = String(cur.num);
      cur.jawab = kunci[num] || null;
      cur.p = pembahasan[num] || null;
      delete cur._q; delete cur._opts;
      soal.push(cur);
    }
    cur = null; phase = null;
  }

  for (const line of lines) {
    const t = line.trim();

    // Stop di KUNCI JAWABAN
    if (t.includes('KUNCI JAWABAN')) break;

    // Level section header: \textbf{\underline{A. Beginner}}
    const lvlMatch = t.match(/\\textbf\{\\underline\{[A-Z]\.\s*(Beginner|Intermediate|Expert|UTBK[^}]*|SIMAK[^}]*|UTUL[^}]*|Olimpiade[^}]*)\}\}/i);
    if (lvlMatch) {
      flushSoal();
      const raw = lvlMatch[1].trim();
      if (/beginner/i.test(raw)) currentLevel = 'Beginner';
      else if (/intermediate/i.test(raw)) currentLevel = 'Intermediate';
      else if (/expert/i.test(raw)) currentLevel = 'Expert';
      else currentLevel = raw; // UTBK, SIMAK UI, dll
      enumDepth = 0;
      continue;
    }

    // Komentar metadata
    if (t.startsWith('%')) {
      commentBuf.push(t.replace(/^%+\s?/, ''));
      continue;
    }

    // setcounter untuk nomor soal
    const setcounter = t.match(/\\setcounter\{enumi\}\{(\d+)\}/);
    if (setcounter) {
      globalCounter = parseInt(setcounter[1]);
      continue;
    }

    // Ignore non-soal
    if (t === '' || /^\\(vspace|onecolumn|twocolumn|rule|begin\{center\}|end\{center\}|newpage|par|lhead|rhead)\b/.test(t)) continue;

    // enumerate depth
    if (t.startsWith('\\begin{enumerate}')) {
      enumDepth++;
      if (enumDepth === 2 && cur) phase = 'opts';
      continue;
    }
    if (t.startsWith('\\end{enumerate}')) {
      if (enumDepth === 2) { phase = 'q-done'; }
      if (enumDepth === 1) { flushSoal(); }
      enumDepth--;
      continue;
    }

    // \item — bisa ada banyak \item dalam 1 baris (opsi)
    if (t.includes('\\item')) {
      const items = splitItems(t);

      if (enumDepth === 1) {
        // Soal baru (hanya 1 \item di level ini)
        flushSoal();
        globalCounter++;

        const blob = commentBuf.join('\n');
        const tags = {};
        for (const m of blob.matchAll(/\[([A-Z ]+):\s*([^\]]+)\]/g)) {
          tags[m[1].trim()] = m[2].trim();
        }
        const kesalahan = commentBuf.find(l => l.startsWith('[KESALAHAN'))
          ?.replace(/^\[KESALAHAN UMUM:\s*/, '').replace(/\]$/, '').trim() || null;

        cur = {
          id: `${sectionId}${globalCounter}`,
          section: sectionId,
          num: globalCounter,
          level: tags['LEVEL'] || currentLevel || 'Beginner',
          subMateri: tags['SUB-MATERI'] || null,
          jenis: tags['JENIS'] || null,
          kesalahanUmum: kesalahan,
          jawab: null,
          p: null,
          _q: items[0] ? [items[0]] : [],
          _opts: [],
        };
        phase = 'q';
        commentBuf = [];

      } else if (enumDepth === 2 && cur && phase === 'opts') {
        // Opsi: mungkin banyak \item per baris
        for (const item of items) {
          cur._opts.push(item);
        }
      }
      continue;
    }

    // Lanjutan teks soal / opsi
    if (cur && phase === 'q' && t) {
      cur._q.push(t);
    } else if (cur && phase === 'opts' && cur._opts.length > 0 && t) {
      cur._opts[cur._opts.length - 1] += ' ' + t;
    }
  }
  flushSoal();

  return { sectionId, sectionTitle, soal };
}

// ── Main: parse semua file, gabungkan ──
const allSections = [];
for (const filePath of process.argv.slice(2)) {
  console.log(`Parsing: ${filePath}`);
  const result = parseFile(filePath);
  console.log(`  Section ${result.sectionId} — "${result.sectionTitle}" → ${result.soal.length} soal`);
  allSections.push(result);
}

// ── Output JSON ──
const outDir = join(ROOT, 'content', 'raw');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, outFileName || 'persamaan-kuadrat.json');
const output = {
  materi: 'persamaan-kuadrat',
  judul: 'Persamaan Kuadrat',
  totalSoal: allSections.reduce((n, s) => n + s.soal.length, 0),
  sections: allSections,
};
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`\nOutput: ${outPath} (${output.totalSoal} soal total)`);

