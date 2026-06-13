// Terapkan tema tersimpan sebelum render (hindari flash)
(function () {
  const saved = localStorage.getItem('eksaktalab-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('themeBtn');
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('eksaktalab-theme', next);
  if (btn) btn.textContent = isDark ? '🌙 Gelap' : '☀️ Terang';
}

// Sinkronkan label tombol saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('themeBtn');
  if (btn) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️ Terang' : '🌙 Gelap';
  }
});
