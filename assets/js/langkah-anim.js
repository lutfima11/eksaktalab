/* Animasi pembahasan langkah demi langkah (MathJax)
   Pemakaian:
   <div class="langkah-anim">
     <script type="application/json">[{"tex":"...","note":"..."}, ...]</script>
   </div>
*/
(function () {
  const CSS = `
.la-toggle{display:inline-flex;align-items:center;gap:.5rem;margin:.65rem 0 .2rem;padding:.42rem .8rem;border-radius:var(--radius-sm,8px);
  border:1px solid rgba(0,191,165,.35);background:var(--navy,#0A0F1E);color:var(--teal,#00BFA5);
  font-family:var(--mono,monospace);font-size:.66rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.la-toggle:hover{border-color:var(--teal,#00BFA5);box-shadow:0 0 0 3px rgba(0,191,165,.15)}
.la-toggle svg{width:11px;height:11px;fill:currentColor}
[data-theme="dark"] .la-toggle{background:rgba(0,191,165,.12)}
.la-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s ease}
.la-panel.open{grid-template-rows:1fr}
.la-panel>.la-inner{overflow:hidden}
.la-box{margin:.5rem 0 .8rem;border:1.5px solid var(--border,#e2e8f0);border-radius:var(--radius,12px);background:var(--surface-2,#F0F4FF);padding:.7rem .8rem .8rem}
.la-head{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.4rem}
.la-reset{display:inline-flex;align-items:center;gap:.35rem;height:28px;padding:0 .65rem;border-radius:var(--radius-sm,8px);border:1px solid var(--border,#e2e8f0);
  background:var(--surface,#fff);color:var(--text-2,#475569);font-family:var(--mono,monospace);font-size:.62rem;font-weight:700;letter-spacing:.06em;
  text-transform:uppercase;cursor:pointer;transition:all .2s}
.la-reset:hover{border-color:var(--teal,#00BFA5);color:var(--teal,#00BFA5)}
.la-reset svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.la-count{font-family:var(--mono,monospace);font-size:.62rem;font-weight:700;letter-spacing:.06em;padding:.22rem .6rem;border-radius:5px;
  background:var(--navy,#0A0F1E);color:var(--teal,#00BFA5);border:1px solid rgba(0,191,165,.25)}
[data-theme="dark"] .la-count{background:rgba(0,191,165,.12)}
.la-stage{position:relative;overflow-x:auto;overflow-y:hidden;transition:height .45s ease;min-height:70px}
.la-step{position:absolute;inset:0 0 auto 0;display:flex;justify-content:center;opacity:0;transform:translateY(14px) scale(.98);
  transition:opacity .5s ease,transform .5s ease;pointer-events:none}
.la-step.on{opacity:1;transform:none;pointer-events:auto}
.la-step.out{opacity:0;transform:translateY(-14px) scale(.98)}
.la-step mjx-container{margin:.2em 0!important;font-size:118%!important}
.la-note{min-height:2.6em;margin:.5rem 0 .6rem;text-align:center;font-size:.88rem;color:var(--text-2,#475569);transition:opacity .35s ease}
.la-bar{display:flex;align-items:center;justify-content:center;gap:.45rem}
.la-btn{width:44px;height:34px;padding:0;border-radius:var(--radius-sm,8px);border:1px solid var(--border,#e2e8f0);background:var(--surface,#fff);
  color:var(--text-2,#475569);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .2s}
.la-btn svg{width:14px;height:14px;fill:currentColor;display:block}
.la-btn:hover{border-color:var(--teal,#00BFA5);color:var(--teal,#00BFA5)}
.la-btn:active{transform:translateY(1px)}
.la-btn.main{width:56px;background:var(--teal,#00BFA5);border-color:var(--teal,#00BFA5);color:#fff}
.la-btn.main:hover{background:var(--teal-dim,#009E87);color:#fff}
.la-btn:disabled{opacity:.35;cursor:default;border-color:var(--border,#e2e8f0);color:var(--text-2,#475569)}
.la-prog{display:flex;gap:4px;margin-top:.65rem}
.la-seg{flex:1;height:4px;border-radius:2px;background:var(--surface-3,#E8EEFF);cursor:pointer;transition:background .3s}
.la-seg.done{background:rgba(0,191,165,.45)}
.la-seg.on{background:var(--teal,#00BFA5)}
@media (prefers-reduced-motion:reduce){.la-step,.la-panel,.la-stage{transition:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  const DELAY = 2600;
  const ICON = {
    play: '<svg viewBox="0 0 14 14"><path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z"/></svg>',
    pause: '<svg viewBox="0 0 14 14"><rect x="3" y="2" width="3" height="10" rx="1"/><rect x="8" y="2" width="3" height="10" rx="1"/></svg>',
    prev: '<svg viewBox="0 0 14 14"><rect x="2" y="2" width="2" height="10" rx="1"/><path d="M12 2.6v8.8a.6.6 0 0 1-.9.5L5.1 7.5a.6.6 0 0 1 0-1l6-4.4a.6.6 0 0 1 .9.5z"/></svg>',
    next: '<svg viewBox="0 0 14 14"><rect x="10" y="2" width="2" height="10" rx="1"/><path d="M2 2.6v8.8a.6.6 0 0 0 .9.5l6-4.4a.6.6 0 0 0 0-1l-6-4.4a.6.6 0 0 0-.9.5z"/></svg>',
    reset: '<svg viewBox="0 0 14 14"><path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2"/><polyline points="2.2,1.8 2.2,4.6 5,4.6"/></svg>',
  };
  const TOG_OPEN = '<svg viewBox="0 0 14 14"><path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z"/></svg>Animasi langkah';
  const TOG_CLOSE = '<svg viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Tutup animasi';
  function build(root) {
    const steps = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
    root.innerHTML = `
      <button class="la-toggle" type="button" aria-expanded="false">${TOG_OPEN}</button>
      <div class="la-panel"><div class="la-inner"><div class="la-box">
        <div class="la-head">
          <button class="la-reset" type="button" data-a="first" title="Ulang dari awal">${ICON.reset}Ulang</button>
          <span class="la-count"></span>
        </div>
        <div class="la-stage"></div>
        <div class="la-note"></div>
        <div class="la-bar">
          <button class="la-btn" type="button" data-a="prev" title="Langkah sebelumnya">${ICON.prev}</button>
          <button class="la-btn main" type="button" data-a="play" title="Putar / jeda">${ICON.pause}</button>
          <button class="la-btn" type="button" data-a="next" title="Langkah berikutnya">${ICON.next}</button>
        </div>
        <div class="la-prog"></div>
      </div></div></div>`;
    const tog = root.querySelector('.la-toggle'), panel = root.querySelector('.la-panel'), stage = root.querySelector('.la-stage'),
          note = root.querySelector('.la-note'), dots = root.querySelector('.la-prog'), playB = root.querySelector('[data-a="play"]'),
          count = root.querySelector('.la-count');
    steps.forEach((s, i) => {
      const d = document.createElement('div'); d.className = 'la-step'; d.textContent = '$$' + s.tex + '$$'; stage.appendChild(d);
      const t = document.createElement('span'); t.className = 'la-seg'; t.title = 'Langkah ' + (i + 1); t.onclick = () => { stop(); show(i); }; dots.appendChild(t);
    });
    const els = [...stage.children];
    let cur = -1, timer = null, ready = null;
    function fit() { if (cur >= 0) stage.style.height = els[cur].offsetHeight + 'px'; }
    function show(i) {
      if (i < 0 || i >= els.length) return;
      els.forEach((e, k) => { e.classList.toggle('on', k === i); e.classList.toggle('out', k === cur && k !== i); });
      setTimeout(() => els.forEach(e => e.classList.remove('out')), 500);
      cur = i; fit();
      note.style.opacity = 0;
      setTimeout(() => {
        note.innerHTML = steps[i].note;
        const done = () => { note.style.opacity = 1; };
        window.MathJax && MathJax.typesetPromise ? MathJax.typesetPromise([note]).then(done, done) : done();
      }, 180);
      count.textContent = `LANGKAH ${i + 1}/${els.length}`;
      [...dots.children].forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('done', k < i); });
      root.querySelector('[data-a="prev"]').disabled = i === 0;
      root.querySelector('[data-a="next"]').disabled = i === els.length - 1;
      if (i === els.length - 1) stop();
    }
    function play() {
      if (cur >= els.length - 1) show(0);
      playB.innerHTML = ICON.pause; clearInterval(timer);
      timer = setInterval(() => show(cur + 1), DELAY);
    }
    function stop() { clearInterval(timer); timer = null; playB.innerHTML = ICON.play; }
    function prepare() {
      if (!ready) ready = (window.MathJax && MathJax.typesetPromise ? MathJax.typesetPromise([stage]) : Promise.resolve());
      return ready;
    }
    tog.onclick = () => {
      const open = !panel.classList.contains('open');
      panel.classList.toggle('open', open); tog.setAttribute('aria-expanded', open);
      tog.innerHTML = open ? TOG_CLOSE : TOG_OPEN;
      if (open) prepare().then(() => { show(0); play(); }); else stop();
    };
    root.querySelector('.la-box').onclick = e => {
      const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return;
      if (a === 'play') { timer ? stop() : play(); }
      else { stop(); show(a === 'first' ? 0 : a === 'prev' ? cur - 1 : cur + 1); }
    };
    window.addEventListener('resize', fit);
  }
  // dibangun setelah skrip halaman selesai memindahkan penyelesaian ke kartu contoh
  function init() { document.querySelectorAll('.langkah-anim:not([data-la])').forEach(r => { r.dataset.la = 1; build(r); }); }
  document.readyState === 'complete' ? init() : window.addEventListener('load', init);
})();
