function switchView(name, el, isMobile) {
  const views = ['materi','worksheet','latihan','kapita','video'];

  // Sync desktop tabs
  document.querySelectorAll('#desktopNav .tab').forEach((t, i) => {
    t.classList.toggle('active', views[i] === name);
  });
  // Sync bottom nav
  document.querySelectorAll('#bottomNav .bottom-nav-item').forEach((t, i) => {
    t.classList.toggle('active', views[i] === name);
  });
  // Sync dropdown select
  const sel = document.getElementById('navSelect');
  if (sel) sel.value = name;

  // Toggle views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(name + '-view');
  if (target) target.classList.add('active');

  // Hide/show hero & stats
  const hero = document.getElementById('heroSection');
  const statsBar = document.querySelector('.stats-bar');
  if (hero) hero.style.display = name === 'materi' ? '' : 'none';
  if (statsBar) statsBar.style.display = name === 'materi' ? '' : 'none';
}

function switchViewSelect(name) {
  switchView(name, null, false);
}

// Buka view sesuai hash URL (misal: index.html#worksheet)
(function () {
  const valid = ['materi','worksheet','latihan','kapita','video'];
  function openFromHash() {
    const hash = window.location.hash.replace('#','');
    if (valid.includes(hash)) switchView(hash, null, false);
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show';
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = 'none'; }, 2200);
}
