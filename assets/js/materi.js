// EksaktaLab — Shared JS untuk semua halaman materi

// ── Scroll progress bar tipis + scroll-to-top ──
window.addEventListener('scroll', () => {
  const el  = document.documentElement;
  const pct = el.scrollTop / (el.scrollHeight - el.clientHeight) * 100;
  document.getElementById('scroll-bar').style.width = pct + '%';
  // Tampilkan tombol scroll-to-top setelah 30%
  const btn = document.getElementById('scroll-top');
  if (pct > 30) btn.classList.add('visible');
  else btn.classList.remove('visible');
});

// ── Theme toggle ──────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('themeBtn');
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  btn.textContent = dark ? '🌙 Gelap' : '☀️ Terang';
}

// ── TOC Dropdown ──────────────────────────
function toggleTOC() {
  document.getElementById('tocDropdown').classList.toggle('open');
}
function closeTOC() {
  document.getElementById('tocDropdown').classList.remove('open');
}
// Tutup dropdown saat klik di luar
document.addEventListener('click', e => {
  const dd = document.getElementById('tocDropdown');
  if (dd && !dd.contains(e.target)) dd.classList.remove('open');
});

// ── Bookmark ──────────────────────────────
let bookmarked = false;
function toggleBookmark() {
  bookmarked = !bookmarked;
  const btn = document.getElementById('bookmarkBtn');
  btn.classList.toggle('bookmarked', bookmarked);
  btn.innerHTML = bookmarked
    ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2h8v11l-4-3-4 3V2z"/></svg> Tersimpan`
    : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2h8v11l-4-3-4 3V2z"/></svg> Simpan`;
}

// ── Share ─────────────────────────────────
function shareMateri() {
  if (navigator.share) {
    navigator.share({
      title: window.SHARE_TITLE || document.title,
      text:  window.SHARE_TEXT  || '',
      url:   window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = document.querySelector('[onclick="shareMateri()"]');
      const ori = btn.innerHTML;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2,7 5,10 12,3"/></svg> Link Disalin!`;
      btn.classList.add('active');
      setTimeout(() => { btn.innerHTML = ori; btn.classList.remove('active'); }, 2000);
    });
  }
}


// ── SHARED HELPERS ────────────────────────
const chevronSVG = () => `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" width="11" height="11">
  <polyline points="2,4 6,8 10,4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function makeToggle(wrap, header, statusEl, bodyEl, typesetEl) {
  const doToggle = () => {
    const open = wrap.classList.toggle('open');
    header.setAttribute('aria-expanded', open);
    if (statusEl) statusEl.textContent = open ? 'Sembunyikan' : 'Lihat rumus';
    if (open && window.MathJax && typesetEl) {
      MathJax.typesetPromise([typesetEl]).catch(() => {});
    }
  };
  header.addEventListener('click', doToggle);
  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doToggle(); }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. BOX RUMUS → accordion hijau ───────
  document.querySelectorAll('.box.box-rumus').forEach((box, i) => {
    const labelEl  = box.querySelector('.box-label');
    const titleTxt = labelEl ? labelEl.textContent.replace(/^[•\s]+/, '').trim() : 'Rumus';

    // Semua konten kecuali label
    let bodyHTML = '';
    box.childNodes.forEach(n => {
      if (n !== labelEl) bodyHTML += n.nodeType === 3 ? n.textContent : (n.outerHTML || '');
    });

    const wrap = document.createElement('div');
    wrap.className = 'rumus-wrap';
    wrap.innerHTML = `
      <div class="rumus-header" role="button" aria-expanded="false" tabindex="0">
        <span class="rumus-badge">Rumus</span>
        <span class="rumus-title">${titleTxt || 'Rumus Utama'}</span>
        <span class="rumus-status">Lihat rumus</span>
        <span class="rumus-chevron">${chevronSVG()}</span>
      </div>
      <div class="rumus-body">
        <div class="rumus-body-inner">${bodyHTML.trim()}</div>
      </div>`;

    const header   = wrap.querySelector('.rumus-header');
    const statusEl = wrap.querySelector('.rumus-status');
    const bodyInner = wrap.querySelector('.rumus-body-inner');
    makeToggle(wrap, header, statusEl, wrap.querySelector('.rumus-body'), bodyInner);

    box.replaceWith(wrap);
  });

  // ── 2. BOX CONTOH → accordion navy/teal ──
  let counter = 0;
  document.querySelectorAll('.box.box-contoh').forEach(box => {
    counter++;
    const labelEl  = box.querySelector('.box-label');
    const numMatch = labelEl?.textContent.match(/\d+/);
    const num      = numMatch ? numMatch[0] : String(counter);

    let qHTML = '';
    box.childNodes.forEach(n => {
      if (n !== labelEl) qHTML += n.nodeType === 3 ? n.textContent : (n.outerHTML || '');
    });

    const sib      = box.nextElementSibling;
    const hasSolve = sib?.classList.contains('penyelesaian');
    const solveHTML = hasSolve ? sib.innerHTML : '';

    const wrap = document.createElement('div');
    wrap.className = 'contoh-wrap';
    wrap.innerHTML = `
      <div class="contoh-header" role="button" aria-expanded="false" tabindex="0">
        <span class="contoh-badge">Contoh ${num}</span>
        <div class="contoh-question">${qHTML.trim()}</div>
        <span class="contoh-chevron">${chevronSVG()}</span>
      </div>
      <div class="contoh-body">
        <div class="contoh-body-inner">
          <div class="solve-header">
            <span class="solve-dot"></span>
            <span class="solve-title">Penyelesaian</span>
          </div>
          <div class="penyelesaian-inner">
            ${solveHTML || '<p style="color:rgba(0,191,165,.4);font-style:italic;margin:0">Penyelesaian belum tersedia.</p>'}
          </div>
        </div>
      </div>`;

    const header   = wrap.querySelector('.contoh-header');
    const statusEl = null;
    const pi       = wrap.querySelector('.penyelesaian-inner');

    const doToggle = () => {
      const open = wrap.classList.toggle('open');
      header.setAttribute('aria-expanded', open);
      if (statusEl) statusEl.textContent = '';
      if (open && window.MathJax) MathJax.typesetPromise([pi]).catch(() => {});
    };
    header.addEventListener('click', doToggle);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doToggle(); }
    });

    box.replaceWith(wrap);
    if (hasSolve) sib.remove();
  });

  // ── 3. Buka / Tutup Semua per section ────
  document.querySelectorAll('.section').forEach(sec => {
    const wraps = [...sec.querySelectorAll('.contoh-wrap')];
    if (!wraps.length) return;
    let allOpen = false;

    const tw  = document.createElement('div');
    tw.className = 'toggle-all-wrap';
    const btn = document.createElement('button');
    btn.className = 'btn-toggle-all';

    const updateBtn = () => {
      btn.innerHTML = `${chevronSVG()} ${allOpen ? 'Tutup Semua' : 'Buka Semua Contoh'}`;
    };
    updateBtn();

    btn.addEventListener('click', () => {
      allOpen = !allOpen;
      wraps.forEach(w => {
        const h = w.querySelector('.contoh-header');
        const p = w.querySelector('.penyelesaian-inner');
        w.classList.toggle('open', allOpen);
        h.setAttribute('aria-expanded', allOpen);

        if (allOpen && window.MathJax) MathJax.typesetPromise([p]).catch(() => {});
      });
      updateBtn();
    });

    tw.appendChild(btn);
    wraps[0].before(tw);
  });

  // ── 4. SOAL LATIHAN → accordion kunci jawaban ──
  // Data jawaban per bagian (urutan sesuai soal-list di HTML)