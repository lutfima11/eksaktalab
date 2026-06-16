# Tutorial Membuat Materi Baru — EksaktaLab

Panduan lengkap mengisi template `materi/_template/index.html` dari nol.

---

## Daftar Isi

1. [Struktur Folder](#1-struktur-folder)
2. [Langkah Awal — Copy Template](#2-langkah-awal--copy-template)
3. [Bagian Head (Meta & SEO)](#3-bagian-head-meta--seo)
4. [Navbar & TOC Dropdown](#4-navbar--toc-dropdown)
5. [Hero & TOC Inline](#5-hero--toc-inline)
6. [Menulis Konten — Sections & Sub-bab](#6-menulis-konten--sections--sub-bab)
7. [Jenis Box](#7-jenis-box)
8. [Contoh Soal & Penyelesaian](#8-contoh-soal--penyelesaian)
9. [Tabel](#9-tabel)
10. [Koneksi & Action Footer](#10-koneksi--action-footer)
11. [LaTeX di HTML (MathJax)](#11-latex-di-html-mathjax)
12. [Checklist Sebelum Publish](#12-checklist-sebelum-publish)

---

## 1. Struktur Folder

```
eksaktalab/
├── assets/
│   ├── css/
│   │   ├── materi.css      ← semua style komponen (box, section, tabel, dll.)
│   │   └── footer.css
│   └── js/
│       └── theme.js        ← toggle dark/light mode
├── materi/
│   ├── _template/          ← TEMPLATE (jangan hapus)
│   │   └── index.html
│   ├── fungsi-linear/
│   │   └── index.html
│   ├── fungsi-kuadrat/
│   │   └── index.html
│   └── SLUG-MATERI-BARU/   ← buat folder baru di sini
│       └── index.html
└── index.html              ← halaman utama (daftar semua materi)
```

> **Konvensi penamaan folder:** pakai `kebab-case`, huruf kecil semua.
> Contoh: `limit-fungsi`, `turunan-aljabar`, `integral-tentu`.

---

## 2. Langkah Awal — Copy Template

1. Duplikat folder `materi/_template/` → rename sesuai slug materi.
2. Buka `index.html` di editor.
3. Cari semua teks `EDIT:` — itulah bagian yang wajib diganti.
4. Cari semua placeholder (`JUDUL MATERI`, `SLUG-MATERI`, `SUB-BAB`, dll.)
   dan ganti dengan konten nyata.

---

## 3. Bagian Head (Meta & SEO)

```html
<title>JUDUL MATERI – EksaktaLab</title>
<meta name="description" content="Materi lengkap ... Dilengkapi N contoh soal.">
```

| Placeholder | Contoh isi |
|---|---|
| `JUDUL MATERI` | `Limit Fungsi Aljabar` |
| `SLUG-MATERI` | `limit-fungsi` |
| `DESKRIPSI SINGKAT` | `Materi lengkap Limit Fungsi SMA: konsep limit, sifat-sifat, dan cara menghitung.` |
| `KATEGORI` | `Kalkulus` |
| `SMA Kelas X` | Sesuaikan: `SMA Kelas X / XI / XII` |

**Schema JSON-LD** — pastikan `breadcrumb` sesuai struktur navigasi di homepage.

---

## 4. Navbar & TOC Dropdown

Ganti header dan daftar item sesuai jumlah sub-bab:

```html
<div class="toc-menu-header">Limit Fungsi · 4 Sub-bab</div>
<a class="toc-menu-item" href="#bagian-a" onclick="closeTOC()">
  <span class="toc-menu-badge">A</span>Pengertian Limit
</a>
<a class="toc-menu-item" href="#bagian-b" onclick="closeTOC()">
  <span class="toc-menu-badge">B</span>Sifat-Sifat Limit
</a>
```

- Badge mengikuti urutan `A B C D E F G`.
- `href` harus sama persis dengan `id` di tag `<section>`.

---

## 5. Hero & TOC Inline

### Hero

```html
<div class="materi-eyebrow">BAB C · No.15</div>
<h1 class="materi-title">Limit Fungsi Aljabar</h1>
<p class="materi-desc">Pelajari konsep limit, cara menghitung, dan sifat-sifatnya
sebagai fondasi kalkulus diferensial.</p>
<div class="materi-tags">
  <span class="tag teal">Kelas XI</span>
  <span class="tag">Kalkulus</span>
  <span class="tag">4 Sub-bab</span>
  <span class="tag">20 Contoh Soal</span>
</div>
```

- `materi-eyebrow`: bab dan nomor urut materi di homepage.
- Tag `teal` selalu untuk tag kelas — tag lain tidak pakai `teal`.

### TOC Inline

```html
<ul class="toc-list">
  <li><a href="#bagian-a" data-num="A">Pengertian Limit</a></li>
  <li><a href="#bagian-b" data-num="B">Sifat-Sifat Limit</a></li>
  <li><a href="#bagian-c" data-num="C">Teknik Menghitung</a></li>
  <li><a href="#bagian-d" data-num="D">Tabel Ringkasan</a></li>
</ul>
```

- `data-num` harus sesuai huruf badge: `"A"`, `"B"`, dst.

---

## 6. Menulis Konten — Sections & Sub-bab

### Section (sub-bab utama)

```html
<section class="section" id="bagian-a">
  <h2 class="section-title">
    <span class="section-badge">A</span>Pengertian Limit
  </h2>

  <!-- konten sub-bab di sini -->

</section>
```

- `id="bagian-a"` harus cocok dengan `href="#bagian-a"` di TOC.
- Huruf badge (`A`, `B`, …) ikut urutan alfabet.

### Subseksi bernomor

```html
<h3 class="subsection-title">1. Definisi Formal Limit</h3>
<h3 class="subsection-title">2. Interpretasi Grafis</h3>
```

- Nomor subseksi di-reset untuk setiap section baru (tiap section mulai dari 1).

---

## 7. Jenis Box

Ada 5 jenis box — pilih sesuai konteks:

### `box-rumus` — Formula utama

```html
<div class="box box-rumus">
  <div class="box-label">Definisi Limit</div>
  <div class="math-block">
    $$\lim_{x \to a} f(x) = L$$
  </div>
</div>
```

> Gunakan `<div class="math-block">` untuk formula display (bukan inline).

---

### `box-definisi` — Definisi atau sifat-sifat formal

```html
<div class="box box-definisi">
  <div class="box-label">Sifat-Sifat Limit</div>
  <ul>
    <li>$\lim_{x\to a}[f(x)+g(x)] = \lim_{x\to a}f(x) + \lim_{x\to a}g(x)$</li>
    <li>$\lim_{x\to a}[c \cdot f(x)] = c \cdot \lim_{x\to a}f(x)$</li>
  </ul>
</div>
```

---

### `box-catatan` — Peringatan / hal yang sering salah

```html
<div class="box box-catatan">
  <div class="box-label">⚠ Catatan Penting</div>
  <p style="margin:0;font-size:.9rem;">
    Limit $\frac{0}{0}$ adalah bentuk <strong>tak tentu</strong>,
    bukan nol. Harus difaktorkan atau gunakan L'Hôpital.
  </p>
</div>
```

---

### `box-contoh` — Soal contoh

```html
<div class="box box-contoh">
  <div class="box-label">📘 Contoh 7</div>
  <p style="margin:0;font-size:.9rem;">
    Hitung $\displaystyle\lim_{x \to 2} \dfrac{x^2 - 4}{x - 2}$.
  </p>
</div>
```

- Penomoran contoh berlanjut sepanjang halaman (Contoh 1, 2, 3, …).
- Selalu diikuti `<div class="penyelesaian">` tepat di bawahnya.

---

### `box-latihan` — Soal latihan mandiri

```html
<div class="box box-latihan">
  <div class="box-label">Soal Latihan</div>
  <ol class="soal-list">
    <li>Hitung $\lim_{x \to 3} (2x^2 - 5)$.</li>
    <li>Hitung $\lim_{x \to 1} \dfrac{x^2 - 1}{x - 1}$.</li>
  </ol>
</div>
```

- Letakkan di akhir setiap section sebelum section berikutnya.

---

## 8. Contoh Soal & Penyelesaian

### Format dasar

```html
<div class="box box-contoh">
  <div class="box-label">📘 Contoh 3</div>
  <p style="margin:0;font-size:.9rem;">Hitung nilai dari $\lim_{x \to 0} \dfrac{\sin x}{x}$.</p>
</div>
<div class="penyelesaian">
  <br>
  <strong>Langkah 1 —</strong> Kenali bentuk tak tentu $\tfrac{0}{0}$.<br><br>
  <strong>Langkah 2 —</strong> Gunakan limit trigonometri standar:
  $$\lim_{x \to 0} \frac{\sin x}{x} = 1$$
  Jadi nilai limitnya adalah $\mathbf{1}$.
</div>
```

### Soal dengan sub-poin a. b.

```html
<div class="box box-contoh">
  <div class="box-label">📘 Contoh 5</div>
  <p style="margin:0;font-size:.9rem;">Hitung:<br>
  a. $\lim_{x \to 2} (3x - 1)$<br>
  b. $\lim_{x \to -1} (x^2 + 2x + 3)$</p>
</div>
<div class="penyelesaian">
  <br>
  <strong>a.</strong> Substitusi langsung: $3(2) - 1 = \mathbf{5}$<br><br>
  <strong>b.</strong> Substitusi langsung: $(-1)^2 + 2(-1) + 3 = 1 - 2 + 3 = \mathbf{2}$
</div>
```

### Tips penyelesaian multi-langkah

```html
<div class="penyelesaian">
  <br>
  <strong>Langkah 1 — Faktorkan pembilang:</strong>
  $$x^2 - 4 = (x-2)(x+2)$$

  <strong>Langkah 2 — Sederhanakan:</strong>
  $$\frac{(x-2)(x+2)}{x-2} = x+2 \quad (x \neq 2)$$

  <strong>Langkah 3 — Substitusi $x \to 2$:</strong>
  $$\lim_{x \to 2}(x+2) = 4$$

  Jadi $\displaystyle\lim_{x \to 2} \frac{x^2-4}{x-2} = \mathbf{4}$. ✓
</div>
```

---

## 9. Tabel

```html
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Bentuk</th>
        <th>Rumus</th>
        <th>Syarat</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Substitusi langsung</td>
        <td>$\lim_{x \to a} f(x) = f(a)$</td>
        <td>$f$ kontinu di $x = a$</td>
      </tr>
      <tr>
        <td>Bentuk $\frac{0}{0}$</td>
        <td>Faktorkan, lalu substitusi</td>
        <td>Penyebut bernilai nol</td>
      </tr>
    </tbody>
  </table>
</div>
```

- Selalu bungkus dengan `<div class="table-wrap">` agar bisa di-scroll horizontal di mobile.
- Formula di dalam `<th>` otomatis berwarna putih (sudah dihandle CSS di `<head>`).

---

## 11. LaTeX di HTML (MathJax)

Materi ini menggunakan **MathJax 3** — tulis LaTeX seperti biasa di dalam HTML.

### Inline vs Display

| Mode | Sintaks | Kapan dipakai |
|---|---|---|
| Inline | `$...$` | Di dalam kalimat: "gradiennya adalah $m = 2$" |
| Display | `$$...$$` | Formula berdiri sendiri, rata tengah |

### Konversi dari LaTeX ke HTML

#### Teks biasa
```
LaTeX:  Misalkan $f(x) = ax + b$ dengan $a \neq 0$.
HTML:   Misalkan $f(x) = ax + b$ dengan $a \neq 0$.
```
→ Tidak perlu diubah, langsung salin.

#### Formula display (dari `\[ ... \]` atau `equation`)
```latex
% LaTeX
\[ \lim_{x \to a} f(x) = L \]

% atau
\begin{equation}
  \lim_{x \to a} f(x) = L
\end{equation}
```
```html
<!-- HTML -->
$$\lim_{x \to a} f(x) = L$$
```

#### Multi-baris (`align`)
```latex
% LaTeX
\begin{align*}
  y &= x^2 - 4x + 4 \\
    &= (x-2)^2
\end{align*}
```
```html
<!-- HTML — align* didukung MathJax -->
$$\begin{align*}
  y &= x^2 - 4x + 4 \\
    &= (x-2)^2
\end{align*}$$
```

#### Sistem persamaan (`cases`)
```latex
% LaTeX
f(x) = \begin{cases} x+1 & x \geq 0 \\ -x & x < 0 \end{cases}
```
```html
<!-- HTML — identik -->
$f(x) = \begin{cases} x+1 & x \geq 0 \\ -x & x < 0 \end{cases}$
```

### Referensi perintah LaTeX yang sering dipakai

| Simbol | LaTeX | Hasil |
|---|---|---|
| Pecahan | `\dfrac{a}{b}` | $\dfrac{a}{b}$ (display, lebih besar) |
| Pecahan inline | `\tfrac{a}{b}` | $\tfrac{a}{b}$ (lebih kecil) |
| Akar | `\sqrt{x}`, `\sqrt[3]{x}` | $\sqrt{x}$, $\sqrt[3]{x}$ |
| Limit | `\lim_{x \to a}` | $\lim_{x \to a}$ |
| Sigma | `\sum_{i=1}^{n}` | $\sum_{i=1}^{n}$ |
| Integral | `\int_{a}^{b}` | $\int_{a}^{b}$ |
| Turunan | `f'(x)`, `\frac{d}{dx}` | $f'(x)$, $\frac{d}{dx}$ |
| Himpunan R | `\mathbb{R}` | $\mathbb{R}$ |
| Tak hingga | `\infty` | $\infty$ |
| Implisasi | `\Rightarrow`, `\implies` | $\Rightarrow$, $\implies$ |
| Ekuivalen | `\Leftrightarrow`, `\iff` | $\Leftrightarrow$, $\iff$ |
| Setminus | `\setminus` | $\setminus$ |
| Kali | `\times`, `\cdot` | $\times$, $\cdot$ |
| Plus-minus | `\pm` | $\pm$ |
| Lebih-kurang | `\leq`, `\geq`, `\neq` | $\leq$, $\geq$, $\neq$ |
| Aproksimasi | `\approx` | $\approx$ |
| Derajat | `30^\circ` | $30^\circ$ |
| Teks di formula | `\text{kata}` | $\text{kata}$ |
| Tebal di formula | `\mathbf{x}` | $\mathbf{x}$ |

### Hal yang berbeda dari LaTeX standar

| LaTeX | HTML/MathJax | Catatan |
|---|---|---|
| `\begin{equation}` | `$$...$$` | MathJax otomatis beri nomor jika pakai `tags: 'ams'` |
| `\left( \right)` | `\left( \right)` | Sama — kurung otomatis menyesuaikan ukuran |
| `\log_{2} x` | `{}^{2}\!\log x` atau `\log_2 x` | Gunakan sesuai konvensi soal |
| `\text{dan}` di dalam `$$` | `\text{dan}` | Sama |
| `&` di dalam teks HTML | `&amp;` | **Hanya di luar formula** — di dalam `$...$` tetap `&` |

---

## 10. Koneksi & Action Footer

### Koneksi ke materi berikutnya

```html
<div class="koneksi-wrap">
  ...
  <p class="koneksi-text">
    Limit Fungsi adalah <strong>fondasi</strong> Turunan. Definisi turunan
    $f'(a) = \lim_{h \to 0}\frac{f(a+h)-f(a)}{h}$ sepenuhnya bergantung
    pada konsep limit yang dipelajari di sini.
  </p>
  <div class="koneksi-comparison">
    <div class="koneksi-card current">
      <div class="koneksi-card-label">Sekarang</div>
      <div class="koneksi-card-formula">$\lim_{x \to a} f(x)$</div>
      <div class="koneksi-card-desc">Nilai pendekatan<br>fungsi di titik a</div>
    </div>
    <!-- panah -->
    <div class="koneksi-card next">
      <div class="koneksi-card-label">Berikutnya</div>
      <div class="koneksi-card-formula">$f'(x)$</div>
      <div class="koneksi-card-desc">Laju perubahan<br>sesaat fungsi</div>
    </div>
  </div>
</div>
```

### Action Footer — navigasi prev/next

```html
<div class="footer-nav">
  <a class="nav-btn" href="../fungsi-komposisi-invers/">
    ← Fungsi Komposisi & Invers   <!-- materi sebelumnya -->
  </a>
  <a class="nav-btn" href="../turunan-aljabar/">
    Turunan Aljabar →             <!-- materi berikutnya -->
  </a>
</div>
```

- Jika tidak ada materi sebelumnya: ganti dengan `href="../../"` (kembali ke beranda).

---

## 12. Checklist Sebelum Publish

- [ ] Semua placeholder (`JUDUL MATERI`, `SLUG-MATERI`, dll.) sudah diganti
- [ ] `<title>` dan `<meta name="description">` sudah diisi
- [ ] URL canonical, og:url, og:title, og:description sudah benar
- [ ] Schema JSON-LD: `name`, `url`, `educationalLevel`, `breadcrumb` sesuai
- [ ] Navbar TOC dropdown: jumlah sub-bab dan label sudah benar
- [ ] Hero: eyebrow, judul, deskripsi, tag kelas sudah benar
- [ ] TOC inline: semua `href` cocok dengan `id` section
- [ ] Penomoran contoh soal berurutan dari 1 sampai akhir
- [ ] Setiap `box-contoh` diikuti `div.penyelesaian` tepat di bawahnya
- [ ] Soal dengan a./b. tidak inline (setiap poin di baris terpisah)
- [ ] Subseksi bernomor mulai dari 1 di setiap section
- [ ] Action footer: href prev/next sudah benar
- [ ] Teks `shareMateri()` di script sudah diganti sesuai judul materi
- [ ] Folder materi baru sudah ditambahkan ke `index.html` (halaman beranda)
