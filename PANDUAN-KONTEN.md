# Panduan Konten EksaktaLab

Cara menambah materi, soal, latihan, ujian, dan menjaga SEO — semua lewat generator
di folder `tools/`. **Prinsip: jangan edit ratusan halaman manual; edit sumber lalu generate.**

---

## Peta sistem (file sumber kebenaran)

| Sumber | Isi |
|--------|-----|
| `materi/<slug>/index.html` | Halaman materi (ditulis manual dari `materi/_template/`) |
| `tools/topics.json` | Daftar materi untuk latihan: `slug`, `title`, `prefix`, + jumlah paket/soal |
| `content/materi/<slug>.json` | Sub-materi hasil ekstrak dari halaman materi (otomatis) |
| `assets/js/quiz-data.js` | Soal ASLI khusus **fungsi-linear** |
| `content/raw/<materi>.json` | Soal hasil impor LaTeX (untuk mengganti placeholder) |

Dua sistem latihan:
- **fungsi-linear** → soal asli (`quiz-data.js`), digenerate `build-latihan.mjs`.
- **15 materi lain** → soal **placeholder random** (`lib-random.mjs`), digenerate `build-all-latihan.mjs`.

---

## A. Tambah materi baru

1. **Buat halaman materi**: salin `materi/_template/` → `materi/<slug>/index.html`, isi kontennya.
   Pakai `<h2 class="section-title"><span class="section-badge">A</span>Judul</h2>` untuk tiap
   sub-materi, dan `<div class="box box-contoh">…</div>` + `<div class="penyelesaian">…</div>`
   untuk contoh soal. (Sub-materi latihan diambil dari section ini.)
2. **Daftarkan** di `tools/topics.json`:
   ```json
   { "slug": "nama-materi", "title": "Nama Materi", "prefix": "NM" }
   ```
3. **Generate** (lihat bagian E).
4. Tambahkan kartu materi baru di navigasi homepage bila perlu (`index.html`, view materi).

---

## B. Tambah / ganti soal

**Soal placeholder (sekarang)** dibuat otomatis oleh `tools/lib-random.mjs` — generik tapi
berfungsi (kunci benar). Untuk mengganti dengan **soal asli**:

1. **Impor dari LaTeX**:
   ```bash
   node tools/import-latex.mjs "D:\…\file.tex"      # → content/raw/<materi>.json
   node tools/tikz-to-svg.mjs content/raw/<materi>.json   # render grafik (bila ada)
   ```
2. **Lengkapi kunci & pembahasan** (file LaTeX belum punya): isi `jawab` & `p` di JSON
   (manual atau bantuan AI — *Track 1, belum diotomasi*).
3. **Wiring** soal asli ke generator (mengganti `lib-random`) — *belum dibangun*; ini langkah
   integrasi berikutnya.

**Edit soal fungsi-linear**: langsung di `assets/js/quiz-data.js`, lalu `node tools/build-latihan.mjs`.

---

## C. Tambah latihan soal / paket

Jumlah paket diatur per-topik di `tools/topics.json`:
```json
"perTopic": { "paket": 12, "soalPerPaket": 10, "ujianSoal": 20, "kilatSoal": 10 }
```
- `paket` — jumlah Paket Berlatih (dibagi Beginner/Intermediate/Expert).
- Paket **Per Sub-Materi** otomatis = jumlah section di halaman materi.
- Ubah angka → generate ulang (bagian E).

---

## D. Ujian akhir & kuis cepat

Otomatis dibuat untuk tiap materi oleh `build-all-latihan.mjs`:
- **Ujian Akhir** → `latihan-soal/<slug>/ujian-akhir/` — `ujianSoal` soal, timer 45 menit, berskor.
- **Kuis Kilat** → `latihan-soal/<slug>/kuis-kilat/` — `kilatSoal` soal, timer 15 menit.

Ubah jumlah soal di `topics.json` (`ujianSoal`, `kilatSoal`). Untuk ubah durasi timer, edit
`UJIAN_MINUTES` di template sumber (`latihan-soal/fungsi-linear/ujian-akhir|kuis-kilat/index.html`).

---

## E. Generate konten (urutan jalankan)

```bash
node tools/extract-materi.mjs        # 1. sub-materi dari halaman materi  → content/materi/*.json
node tools/build-all-latihan.mjs     # 2. generate latihan 15 materi (index, paket, sub, ujian, kilat)
node tools/build-latihan.mjs         # 3. (opsional) regenerate fungsi-linear dari template
node tools/update-home-links.mjs     # 4. nyalakan kartu latihan di homepage
node tools/update-materi-links.mjs   # 5. nyalakan tombol "Kerjakan Latihan" di halaman materi
node tools/build-sitemap.mjs         # 6. SEO: perbarui sitemap.xml (WAJIB tiap tambah halaman)
```

Satu materi saja: `node tools/build-all-latihan.mjs <slug>`.

---

## F. SEO — WAJIB tiap menambah halaman

- **Selalu** jalankan `node tools/build-sitemap.mjs` setelah menambah/menghapus halaman.
- `robots.txt` & `sitemap.xml` sudah benar (mencakup semua halaman).
- ⚠️ **Belum lengkap**: halaman paket kuis belum punya `canonical`/Open Graph/structured data.
  Lihat status di README & roadmap. Ini pekerjaan SEO berikutnya.

---

## Catatan

- Semua script **idempoten** — aman dijalankan ulang.
- Detail teknik tiap tool ada di `tools/README.md`.
- `fungsi-linear` tidak ikut `build-all-latihan.mjs` (punya soal asli sendiri).
