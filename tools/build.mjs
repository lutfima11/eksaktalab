// ─────────────────────────────────────────────────────────────
// build.mjs  —  MASTER BUILD: semua materi latihan soal
//
// Cara pakai:
//   node tools/build.mjs            # build semua materi
//   node tools/build.mjs --check    # dry-run (CI-friendly)
// ─────────────────────────────────────────────────────────────

console.log('\n── Fungsi Linear ──');
await import('./build-latihan.mjs');

// Tambah baris berikut saat materi baru ditambahkan:
// console.log('\n── Barisan Deret ──');
// await import('./build-barisan-deret.mjs');
