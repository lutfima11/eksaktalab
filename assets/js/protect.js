(function () {
  // Kolom isian (form Laporkan/Kontak, dll.) tetap bisa copy/paste & klik kanan
  function isEditable(el) {
    return !!(el && el.closest && el.closest('input, textarea, select, [contenteditable="true"]'));
  }

  // Disable klik kanan (kecuali di kolom isian)
  document.addEventListener('contextmenu', function (e) {
    if (!isEditable(e.target)) e.preventDefault();
  });

  // Disable copy & cut di konten (paste tidak diblokir; kolom isian bebas)
  document.addEventListener('copy', function (e) { if (!isEditable(e.target)) e.preventDefault(); });
  document.addEventListener('cut',  function (e) { if (!isEditable(e.target)) e.preventDefault(); });

  // Disable seleksi teks via keyboard (Ctrl+A, Ctrl+C, dll). Ctrl+P (cetak) dibiarkan.
  document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();
    if (isEditable(e.target)) return;
    if (e.ctrlKey && (key === 'a' || key === 'c' || key === 'x' || key === 'u' || key === 's')) {
      e.preventDefault();
    }
    // Disable F12 (DevTools)
    if (e.key === 'F12') e.preventDefault();
    // Disable Ctrl+Shift+I/J/C (DevTools)
    if (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
      e.preventDefault();
    }
  });

  // Disable drag teks/gambar
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // Disable seleksi teks via CSS
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    input, textarea, select, [contenteditable="true"] {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      user-select: text !important;
    }
  `;
  document.head.appendChild(style);
})();
