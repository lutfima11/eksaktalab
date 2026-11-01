/* Animasi pembahasan langkah demi langkah (MathJax)
   Pemakaian:
   <div class="langkah-anim">
     <script type="application/json">[{"tex":"...","note":"..."}, ...]</script>
   </div>
*/
(function () {
  const CSS = `
.la-toggle{display:inline-flex;align-items:center;gap:.45rem;margin:.6rem 0 .2rem;padding:.45rem .9rem;border-radius:999px;border:1.5px solid var(--accent,#0d9488);
  background:transparent;color:var(--accent,#0d9488);font:600 .82rem/1 inherit;cursor:pointer;transition:background .2s,color .2s}
.la-toggle:hover,.la-toggle[aria-expanded="true"]{background:var(--accent,#0d9488);color:#fff}
.la-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s ease}
.la-panel.open{grid-template-rows:1fr}
.la-panel>.la-inner{overflow:hidden}
.la-box{margin:.5rem 0 .8rem;border:1px solid var(--border,#e2e8f0);border-radius:14px;background:var(--surface-2,#f8fafc);padding:.9rem .8rem .7rem}
.la-stage{position:relative;overflow-x:auto;overflow-y:hidden;transition:height .45s ease;min-height:70px}
.la-step{position:absolute;inset:0 0 auto 0;display:flex;justify-content:center;opacity:0;transform:translateY(14px) scale(.98);
  transition:opacity .5s ease,transform .5s ease;pointer-events:none}
.la-step.on{opacity:1;transform:none;pointer-events:auto}
.la-step.out{opacity:0;transform:translateY(-14px) scale(.98)}
.la-step mjx-container{margin:.2em 0!important;font-size:118%!important}
.la-note{min-height:2.6em;margin:.45rem 0 .5rem;text-align:center;font-size:.88rem;color:var(--text-2,#475569);transition:opacity .35s ease}
.la-note b{color:var(--text-1,#1e293b)}
.la-bar{display:flex;align-items:center;justify-content:center;gap:.4rem;flex-wrap:wrap}
.la-btn{width:2.3rem;height:2.3rem;border-radius:50%;border:1px solid var(--border,#e2e8f0);background:var(--surface,#fff);color:var(--text-1,#1e293b);
  cursor:pointer;font-size:.95rem;display:inline-flex;align-items:center;justify-content:center;transition:background .2s,transform .1s}
.la-btn:hover{background:var(--accent-soft,rgba(13,148,136,.12))}
.la-btn:active{transform:scale(.94)}
.la-btn.main{width:2.7rem;height:2.7rem;background:var(--accent,#0d9488);color:#fff;border-color:transparent}
.la-btn:disabled{opacity:.35;cursor:default}
.la-dots{display:flex;gap:.3rem;justify-content:center;margin-top:.55rem}
.la-dot{width:7px;height:7px;border-radius:50%;background:var(--border,#cbd5e1);transition:background .3s,transform .3s;cursor:pointer}
.la-dot.on{background:var(--accent,#0d9488);transform:scale(1.35)}
[data-theme="dark"] .la-box{background:#151c30;border-color:#2a3550}
[data-theme="dark"] .la-btn{background:#1e2640;border-color:#334155;color:#e2e8f0}
@media (prefers-reduced-motion:reduce){.la-step,.la-panel,.la-stage{transition:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  const DELAY = 2600;
  function build(root) {
    const steps = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
    root.innerHTML = `
      <button class="la-toggle" type="button" aria-expanded="false">▶ Putar animasi langkah</button>
      <div class="la-panel"><div class="la-inner"><div class="la-box">
        <div class="la-stage"></div>
        <div class="la-note"></div>
        <div class="la-bar">
          <button class="la-btn" data-a="first" title="Ulang dari awal">↺</button>
          <button class="la-btn" data-a="prev" title="Langkah sebelumnya">◀</button>
          <button class="la-btn main" data-a="play" title="Putar / jeda">❚❚</button>
          <button class="la-btn" data-a="next" title="Langkah berikutnya">▶</button>
        </div>
        <div class="la-dots"></div>
      </div></div></div>`;
    const tog = root.querySelector('.la-toggle'), panel = root.querySelector('.la-panel'), stage = root.querySelector('.la-stage'),
          note = root.querySelector('.la-note'), dots = root.querySelector('.la-dots'), playB = root.querySelector('[data-a="play"]');
    steps.forEach((s, i) => {
      const d = document.createElement('div'); d.className = 'la-step'; d.textContent = '$$' + s.tex + '$$'; stage.appendChild(d);
      const t = document.createElement('span'); t.className = 'la-dot'; t.title = 'Langkah ' + (i + 1); t.onclick = () => { stop(); show(i); }; dots.appendChild(t);
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
        note.innerHTML = `<b>Langkah ${i + 1}/${els.length}.</b> ${steps[i].note}`;
        const done = () => { note.style.opacity = 1; };
        window.MathJax && MathJax.typesetPromise ? MathJax.typesetPromise([note]).then(done, done) : done();
      }, 180);
      [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
      root.querySelector('[data-a="prev"]').disabled = i === 0;
      root.querySelector('[data-a="next"]').disabled = i === els.length - 1;
      if (i === els.length - 1) stop();
    }
    function play() {
      if (cur >= els.length - 1) show(0);
      playB.textContent = '❚❚'; clearInterval(timer);
      timer = setInterval(() => show(cur + 1), DELAY);
    }
    function stop() { clearInterval(timer); timer = null; playB.textContent = '▶'; }
    function prepare() {
      if (!ready) ready = (window.MathJax && MathJax.typesetPromise ? MathJax.typesetPromise([stage]) : Promise.resolve());
      return ready;
    }
    tog.onclick = () => {
      const open = !panel.classList.contains('open');
      panel.classList.toggle('open', open); tog.setAttribute('aria-expanded', open);
      tog.textContent = open ? '✕ Tutup animasi' : '▶ Putar animasi langkah';
      if (open) prepare().then(() => { show(0); play(); }); else stop();
    };
    root.querySelector('.la-bar').onclick = e => {
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
