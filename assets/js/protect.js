(function () {
  // Disable klik kanan
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // Disable copy, cut, paste
  document.addEventListener('copy', function (e) { e.preventDefault(); });
  document.addEventListener('cut',  function (e) { e.preventDefault(); });
  document.addEventListener('paste',function (e) { e.preventDefault(); });

  // Disable seleksi teks via keyboard (Ctrl+A, Ctrl+C, dll)
  document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();
    if (e.ctrlKey && (key === 'a' || key === 'c' || key === 'x' || key === 'u' || key === 's' || key === 'p')) {
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
    input, textarea {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      user-select: text !important;
    }
  `;
  document.head.appendChild(style);
})();
