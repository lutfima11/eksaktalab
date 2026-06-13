/* ═══════════════════════════════════════════════════════
   EksaktaLab — Footer Component
   Cara pakai di setiap halaman:

   1. Di <head>:
      <link rel="stylesheet" href="/assets/css/footer.css">

   2. Di akhir <body>, sebelum </body>:
      <div id="eksaktalab-footer"></div>
      <script src="/assets/js/footer.js"></script>

   Script otomatis menyesuaikan href relatif
   berdasarkan kedalaman folder halaman.
   ═══════════════════════════════════════════════════════ */

(function () {

  /* ── Hitung path root relatif ────────────────────────
     Misal halaman ada di /materi/fungsi-linear/index.html
     maka root = "../../"
     Halaman di root (index.html) → root = "./"           */
  function getRootPath() {
    const depth = window.location.pathname
      .replace(/\/$/, '/index.html')
      .split('/')
      .filter(Boolean).length - 1;
    return depth > 0 ? '../'.repeat(depth) : './';
  }

  const root = getRootPath();

  /* ── Struktur navigasi footer ────────────────────────
     Tambah atau ubah link di sini.
     href: path relatif dari root.                        */
  const nav = [
    {
      title: 'Belajar',
      links: [
        { label: 'Belajar Mandiri',  href: 'index.html#materi' },
        { label: 'Worksheet',        href: 'index.html#worksheet' },
        { label: 'Latihan Soal',     href: 'index.html#latihan' },
        { label: 'Kapita Selekta',   href: 'index.html#kapita' },
        { label: 'TKA dan UTBK',     href: 'index.html#video' },
      ],
    },
    {
      title: 'Tentang',
      links: [
        { label: 'Tentang Kami',        href: '#' },
        { label: 'Kontak',              href: '#' },
        { label: 'Laporkan Kesalahan',  href: '#' },
        { label: 'Blog',                href: '#' },
      ],
    },
  ];

  /* ── Render HTML ─────────────────────────────────────  */
  function renderFooter() {
    const target = document.getElementById('eksaktalab-footer');
    if (!target) return;

    /* Logo SVG (sama persis dengan navbar) */
    const logoSVG = `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 8h8M4 12h16M4 16h8"
              stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M16 6l4 6-4 6"
              stroke="#fff" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    /* Kolom navigasi */
    const navCols = nav.map(col => `
      <div>
        <div class="footer-col-title">${col.title}</div>
        <ul class="footer-links">
          ${col.links.map(l => {
            const href = l.href === '#' ? '#' : root + l.href;
            return `<li><a href="${href}">${l.label}</a></li>`;
          }).join('\n          ')}
        </ul>
      </div>`).join('\n    ');

    target.innerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="footer-grid">

    <div>
      <a class="footer-logo" href="${root}">
        <div class="footer-logo-icon">${logoSVG}</div>
        <div class="footer-logo-name">Eksakta<em>Lab</em></div>
      </a>
      <p class="footer-desc">
        Platform belajar matematika yang lengkap dan gratis
        untuk semua siswa Indonesia.
      </p>
      <span class="footer-badge">Laboratorium Belajar Matematika</span>

    </div>

    ${navCols}

  </div>

  <hr class="footer-divider" />

  <div class="footer-bottom">
    <div class="footer-copy">
      &copy; ${new Date().getFullYear()} <strong>EksaktaLab</strong>
      &mdash; Gratis untuk semua siswa Indonesia
    </div>
  </div>
</footer>`;
  }

  /* ── Jalankan saat DOM siap ──────────────────────────  */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
  } else {
    renderFooter();
  }

})();
