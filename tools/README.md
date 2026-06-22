# tools/ — Generator Latihan Soal

Sebelumnya: 30+ halaman latihan soal masing-masing **1240 baris HTML duplikat**,
hanya beda 4 token. Ubah tampilan = edit puluhan file satu per satu (`_apply_kuis.py`
adalah usaha menambal duplikasi ini secara manual — kini **tidak diperlukan lagi**).

Sekarang: **1 template + 1 manifest → semua halaman digenerate otomatis.**

## Sumber kebenaran (cukup edit ini)

| File | Isi |
|------|-----|
| `assets/js/quiz-data.js` | **Soal** — pertanyaan, opsi, jawaban, pembahasan (per `PAKET_ID`) |
| `tools/latihan-manifest.json` | **Presentasi** — daftar paket: slug, kode, mode, level, warna |
| `tools/templates/latihan.html` | **Tampilan** — layout/CSS/JS halaman latihan (1 file untuk semua) |

## Perintah

```bash
node tools/build-latihan.mjs          # generate ulang semua halaman latihan
node tools/build-latihan.mjs --check  # cek sinkron (untuk CI / sebelum commit), tidak menulis
```

## Skenario umum

**Ubah tampilan/CSS/JS semua halaman latihan**
1. Edit `tools/templates/latihan.html`
2. `node tools/build-latihan.mjs`
→ ke-30 halaman ter-update sekaligus. Selesai.

**Tambah paket latihan baru (mis. FL-21)**
1. Tambah soal di `assets/js/quiz-data.js` dengan key baru (mis. `21: {...}`)
2. Tambah 1 objek di `tools/latihan-manifest.json` (`slug:"fl-21", paket:"21", ...`)
3. `node tools/build-latihan.mjs`
→ folder `latihan-soal/fungsi-linear/fl-21/index.html` dibuat otomatis.

## Catatan

- Token template: `{{KODE}}`, `{{MODE}}`, `{{LEVEL_COLOR}}`, `{{LEVEL_LABEL}}`, `{{PAKET}}`.
- `ujian-akhir` dan `kuis-kilat` (tipe `ujian`/`kilat`) **belum** digenerate — keduanya
  punya engine timer/mode-ujian terpisah. Penyatuan ke satu engine = **Tahap 2**
  (lihat di bawah).
- `extract-manifest.mjs` & `gen-templates.mjs` adalah skrip seeding sekali-jalan;
  disimpan untuk audit / regenerasi manifest+template dari halaman yang ada.

## Pipeline impor bank soal LaTeX (skala 10rb+ soal)

Untuk mengubah file `.tex` (format Mathcyber/EksaktaLab bertag metadata) jadi soal situs:

```bash
node tools/import-latex.mjs "D:\path\Latihan_Soal_Fungsi_Kuadrat.tex"
#   → content/raw/<materi>.json  (soal + level + jenis + prasyarat, tikz mentah)
node tools/tikz-to-svg.mjs content/raw/<materi>.json
#   → isi figures[].svg (grafik fungsi jadi SVG bertema) + <materi>.figures.html (preview)
```

Format `.tex` yang dikenali: section `\textbf{\underline{A. Level Beginner}}` (A/B/C = PG,
D = Uraian), soal `\item`, opsi PG = enumerate level-2, metadata di komentar
`[LEVEL] [JENIS] [PRASYARAT: a > b > c] [GAMBAR]`, opsional `[TIPE: PG|URAIAN|MCMA|BS]`.

Yang TIDAK ada di file sumber & harus diisi terpisah (slot sudah disiapkan `null`):
`jawab` (kunci), `p` (pembahasan). Lihat Track 1 di roadmap.

`tikz-to-svg.mjs` menangani grafik fungsi (`plot(\x,{...})` + domain + titik + sumbu);
pangkat dikonversi ke `Math.pow` agar aman (mis. `-(x-3)^2`). Diagram non-fungsi belum didukung.

## Generate latihan SEMUA materi (format identik fungsi-linear)

```bash
node tools/extract-materi.mjs      # materi/<slug>/index.html → content/materi/<slug>.json (sub-materi)
node tools/build-all-latihan.mjs   # → latihan-soal/<slug>/ untuk 15 materi (topics.json)
node tools/build-all-latihan.mjs <slug>   # satu materi saja
```

Tiap materi dapat struktur sama persis fungsi-linear:
- `index.html` (hero + 3 tab: Paket Berlatih / Per Sub-Materi / Sesi Ujian)
- `<pre>-01..12/` paket berlatih (kuis, soal inline per halaman — tanpa quiz-data.js global)
- `<pre>-a1,-b1,…/` paket per sub-materi; **judulnya diambil dari section halaman materi**
- `ujian-akhir/`, `kuis-kilat/` (engine timer)

Konfigurasi materi + prefix kode di `tools/topics.json`. fungsi-linear TIDAK ikut digenerate
(punya soal asli sendiri).

⚠️ **Soal saat ini PLACEHOLDER random** (`tools/lib-random.mjs`) — berkunci benar & berfungsi,
tapi generik. Ganti dengan soal asli via pipeline `import-latex.mjs` per materi bila siap.
Soal di-inline ke tiap halaman (≈ sesuai rencana skala 10rb+ soal: tiap halaman muat soalnya sendiri).

## Roadmap Tahap 2 (belum dikerjakan)

1. Satukan 3 engine (latihan/ujian/kilat) jadi **satu** `assets/js/quiz-engine.js`
   ber-mode (`UJIAN_MODE` flag) — engine ujian sudah backward-compatible.
2. Ekstrak `<style>` inline (±700 baris) → `assets/css/latihan-soal.css` (1 file, cacheable).
3. Setelah itu tiap halaman tinggal ±50 baris shell. Template-kan juga ujian & kilat.
4. (Opsional) Generalisasi generator untuk topik lain (eksponen, logaritma, dst).
