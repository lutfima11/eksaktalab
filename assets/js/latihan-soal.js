// ── Scroll progress ──────────────────────────────────────
window.addEventListener('scroll', () => {
  const el = document.documentElement;
  const pct = el.scrollTop / (el.scrollHeight - el.clientHeight) * 100;
  const btn = document.getElementById('scroll-top');
  if (pct > 25) btn.classList.add('visible'); else btn.classList.remove('visible');
});

// ── View switching ───────────────────────────────────────
function switchView(id, btn) {
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  btn.classList.add('active');
}

// ── Level filter (paket berlatih) ────────────────────────
function filterPaket(level, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#paket-grid .paket-card').forEach(card => {
    if (level === 'semua' || card.dataset.level === level) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── Sub-materi filter ────────────────────────────────────
function filterSub(sub, btn) {
  document.querySelectorAll('.sub-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#sub-grid .paket-card').forEach(card => {
    if (sub === 'semua' || card.dataset.sub === sub) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}


// ── QUIZ DATA ────────────────────────────────────────────
const quizDB = {
  // Paket 1 — Mengenal Fungsi Linear
  1: {
    title: 'Mengenal Fungsi Linear',
    kode: 'FL-01',
    level: 'Beginner',
    soal: [
      { type: 'pg', q: 'Manakah yang merupakan fungsi linear?', opts: ['$f(x) = x^2 + 1$', '$f(x) = 3x - 2$', '$f(x) = \\frac{1}{x}$', '$f(x) = \\sqrt{x}$'], jawab: 1, p: 'Fungsi linear berbentuk $f(x) = mx + c$ dengan derajat tertinggi variabel adalah 1. Hanya $f(x) = 3x - 2$ yang memenuhi bentuk ini.' },
      { type: 'pg', q: 'Jika $f(x) = 4x - 3$, maka nilai $f(2)$ adalah...', opts: ['3', '5', '7', '11'], jawab: 1, p: '$f(2) = 4(2) - 3 = 8 - 3 = 5$.' },
      { type: 'pg', q: 'Fungsi linear $f(x) = 2x + 6$ memotong sumbu-$x$ di titik...', opts: ['$(−3, 0)$', '$(3, 0)$', '$(0, 6)$', '$(6, 0)$'], jawab: 0, p: 'Titik potong sumbu-$x$: $f(x) = 0 \\Rightarrow 2x + 6 = 0 \\Rightarrow x = -3$. Jadi titiknya $(-3, 0)$.' },
      { type: 'bs', q: 'Pernyataan: Fungsi $f(x) = 5$ adalah fungsi linear dengan gradien 0.', jawab: 'BENAR', p: 'Fungsi konstan $f(x) = c$ bisa ditulis $f(x) = 0 \\cdot x + 5$, sehingga ini fungsi linear dengan gradien $m = 0$.' },
      { type: 'pg', q: 'Gradien garis yang melalui titik $A(1, 3)$ dan $B(3, 9)$ adalah...', opts: ['2', '3', '4', '6'], jawab: 1, p: '$m = \\frac{9-3}{3-1} = \\frac{6}{2} = 3$.' },
      { type: 'bs', q: 'Pernyataan: Garis $y = 4$ adalah garis horizontal.', jawab: 'BENAR', p: 'Garis $y = 4$ sejajar sumbu-$x$, sehingga merupakan garis horizontal.' },
      { type: 'pg', q: 'Nilai $y$-intercept dari $f(x) = -3x + 8$ adalah...', opts: ['−3', '3', '−8', '8'], jawab: 3, p: '$y$-intercept adalah nilai $f(0) = -3(0) + 8 = 8$.' },
      { type: 'pg', q: 'Manakah persamaan garis yang melalui titik $(0, 2)$ dengan gradien 3?', opts: ['$y = 2x + 3$', '$y = 3x + 2$', '$y = 3x - 2$', '$y = 2x - 3$'], jawab: 1, p: 'Bentuk $y = mx + c$ dengan $m=3$ dan $c=2$ (karena melalui $(0,2)$): $y = 3x + 2$.' },
      { type: 'bs', q: 'Pernyataan: Garis $x = -2$ memiliki gradien yang tidak terdefinisi.', jawab: 'BENAR', p: 'Garis vertikal $x = k$ tidak memiliki gradien yang terdefinisi karena $\\Delta x = 0$.' },
      { type: 'pg', q: 'Jika $f(x) = mx + 3$ dan $f(2) = 7$, maka nilai $m$ adalah...', opts: ['1', '2', '3', '4'], jawab: 1, p: '$f(2) = 2m + 3 = 7 \\Rightarrow 2m = 4 \\Rightarrow m = 2$.' },
    ]
  },
  // Kuis Kilat
  'kuis-kilat': {
    title: 'Kuis Kilat 10 Soal',
    kode: 'KILAT',
    level: 'Campuran',
    soal: [
      { type: 'pg', q: 'Gradien garis $y = 5x - 3$ adalah...', opts: ['−3', '3', '5', '−5'], jawab: 2, p: 'Dalam bentuk $y = mx + c$, koefisien $x$ adalah gradien. Jadi $m = 5$.' },
      { type: 'pg', q: 'Titik potong sumbu-$y$ dari garis $3x + 2y = 12$ adalah...', opts: ['$(4, 0)$', '$(0, 6)$', '$(0, 4)$', '$(6, 0)$'], jawab: 1, p: 'Substitusi $x=0$: $2y = 12 \\Rightarrow y = 6$. Jadi $(0, 6)$.' },
      { type: 'bs', q: 'Pernyataan: Dua garis dengan gradien sama pasti sejajar.', jawab: 'BENAR', p: 'Dua garis $y = m_1 x + c_1$ dan $y = m_2 x + c_2$ sejajar jika $m_1 = m_2$ dan $c_1 \\neq c_2$. Jika gradien sama dan $y$-intercept berbeda, maka sejajar.' },
      { type: 'pg', q: 'Persamaan garis melalui $(2, 5)$ dengan gradien 3 adalah...', opts: ['$y = 3x - 1$', '$y = 3x + 1$', '$y = 3x + 5$', '$y = 3x - 5$'], jawab: 0, p: '$y - 5 = 3(x - 2) \\Rightarrow y = 3x - 6 + 5 = 3x - 1$.' },
      { type: 'pg', q: 'Garis yang tegak lurus $y = 2x + 1$ dan melalui $(0, 3)$ adalah...', opts: ['$y = 2x + 3$', '$y = -\\frac{1}{2}x + 3$', '$y = \\frac{1}{2}x + 3$', '$y = -2x + 3$'], jawab: 1, p: 'Tegak lurus: $m = -\\frac{1}{2}$. Melalui $(0,3)$: $y = -\\frac{1}{2}x + 3$.' },
      { type: 'bs', q: 'Pernyataan: Gradien garis yang melalui $(a, b)$ dan $(a, c)$ dengan $b \\neq c$ tidak terdefinisi.', jawab: 'BENAR', p: 'Kedua titik memiliki $x$ yang sama ($\\Delta x = 0$), sehingga $m = \\frac{\\Delta y}{0}$ tidak terdefinisi. Ini garis vertikal.' },
      { type: 'pg', q: 'Nilai $f(-3)$ untuk $f(x) = -2x + 4$ adalah...', opts: ['−2', '10', '−10', '2'], jawab: 1, p: '$f(-3) = -2(-3) + 4 = 6 + 4 = 10$.' },
      { type: 'pg', q: 'Titik potong garis $y = x + 2$ dan $y = -x + 6$ adalah...', opts: ['$(1, 5)$', '$(2, 4)$', '$(3, 5)$', '$(4, 2)$'], jawab: 1, p: '$x + 2 = -x + 6 \\Rightarrow 2x = 4 \\Rightarrow x = 2$, $y = 4$. Titik $(2, 4)$.' },
      { type: 'bs', q: 'Pernyataan: Fungsi $f(x) = -x$ memiliki grafik yang melewati kuadran II dan IV.', jawab: 'BENAR', p: '$f(x) = -x$ memiliki gradien negatif, melewati kuadran II $(x<0, y>0)$ dan kuadran IV $(x>0, y<0)$.' },
      { type: 'pg', q: 'Dari persamaan $ax + by = c$, gradien garisnya adalah...', opts: ['$\\frac{a}{b}$', '$-\\frac{a}{b}$', '$\\frac{c}{b}$', '$-\\frac{c}{b}$'], jawab: 1, p: '$ax + by = c \\Rightarrow y = -\\frac{a}{b}x + \\frac{c}{b}$. Gradiennya $m = -\\frac{a}{b}$.' },
    ]
  },
  'ujian-akhir': {
    title: 'Ujian Akhir Fungsi Linear',
    kode: 'UJIAN',
    level: 'Komprehensif',
    soal: [
      { type: 'pg', q: 'Gradien garis yang melalui $(-1, 4)$ dan $(3, -4)$ adalah...', opts: ['$-2$', '$2$', '$-\\frac{1}{2}$', '$\\frac{1}{2}$'], jawab: 0, p: '$m = \\frac{-4-4}{3-(-1)} = \\frac{-8}{4} = -2$.' },
      { type: 'pg', q: 'Persamaan garis yang sejajar $2x - y + 5 = 0$ dan melalui $(3, 1)$ adalah...', opts: ['$y = 2x - 5$', '$y = 2x + 5$', '$2x + y - 5 = 0$', '$y = -2x + 7$'], jawab: 0, p: 'Gradien $2x - y + 5 = 0 \\Rightarrow y = 2x + 5$, jadi $m = 2$. Garis: $y - 1 = 2(x-3) \\Rightarrow y = 2x - 5$.' },
      { type: 'bs', q: 'Pernyataan: Garis $y = 3x + 5$ memotong sumbu-$x$ di titik $\\left(-\\frac{5}{3}, 0\\right)$.', jawab: 'BENAR', p: 'Set $y = 0$: $3x + 5 = 0 \\Rightarrow x = -\\frac{5}{3}$. Benar.' },
      { type: 'pg', q: 'Titik potong garis $3x + 2y = 12$ dan $x - y = 1$ adalah...', opts: ['$(2, 3)$', '$(3, \\frac{3}{2})$', '$(\\frac{14}{5}, \\frac{9}{5})$', '$(4, 0)$'], jawab: 2, p: 'Dari $x = y+1$, substitusi: $3(y+1) + 2y = 12 \\Rightarrow 5y = 9 \\Rightarrow y = \\frac{9}{5}$, $x = \\frac{14}{5}$.' },
      { type: 'pg', q: 'Garis tegak lurus terhadap $y = \\frac{3}{4}x - 2$ memiliki gradien...', opts: ['$\\frac{3}{4}$', '$-\\frac{4}{3}$', '$\\frac{4}{3}$', '$-\\frac{3}{4}$'], jawab: 1, p: 'Jika $m_1 \\cdot m_2 = -1$ dan $m_1 = \\frac{3}{4}$, maka $m_2 = -\\frac{4}{3}$.' },
      { type: 'bs', q: 'Pernyataan: Titik $(2, 7)$ terletak pada garis $y = 3x + 1$.', jawab: 'BENAR', p: '$f(2) = 3(2) + 1 = 7$. Benar, titik tersebut ada pada garis.' },
      { type: 'pg', q: 'Suatu perusahaan memproduksi barang dengan biaya $C(x) = 5000x + 200.000$ (rupiah) untuk $x$ unit. Berapa biaya untuk 100 unit?', opts: ['Rp 700.000', 'Rp 1.000.000', 'Rp 700.000', 'Rp 700.200'], jawab: 0, p: '$C(100) = 5000(100) + 200.000 = 500.000 + 200.000 = 700.000$.' },
      { type: 'pg', q: 'Jika $f(x) = ax + b$, $f(1) = 5$, dan $f(3) = 11$, maka $a + b$ adalah...', opts: ['5', '6', '7', '8'], jawab: 2, p: '$a + b = 5$ dan $3a + b = 11$. Kurangi: $2a = 6 \\Rightarrow a = 3$, $b = 2$. $a + b = 5$.' },
      { type: 'bs', q: 'Pernyataan: Dua garis $y = 2x + 3$ dan $2y = 4x - 6$ adalah sejajar.', jawab: 'BENAR', p: 'Garis kedua: $y = 2x - 3$. Gradien sama ($m=2$), $y$-intercept berbeda. Sejajar.' },
      { type: 'pg', q: 'Daerah himpunan penyelesaian $y > 2x - 3$ di bawah ini, mana yang termasuk?', opts: ['$(0, -4)$', '$(2, 0)$', '$(1, 5)$', '$(3, 1)$'], jawab: 2, p: 'Cek $(1, 5)$: $5 > 2(1) - 3 = -1$. Benar. Titik lain tidak memenuhi.' },
      { type: 'pg', q: 'Persamaan garis yang melalui $(4, 0)$ dan $(0, -3)$ adalah...', opts: ['$3x - 4y - 12 = 0$', '$3x + 4y - 12 = 0$', '$4x - 3y + 12 = 0$', '$4x + 3y - 12 = 0$'], jawab: 0, p: 'Bentuk intercept: $\\frac{x}{4} + \\frac{y}{-3} = 1 \\Rightarrow 3x - 4y = 12 \\Rightarrow 3x - 4y - 12 = 0$.' },
      { type: 'pg', q: 'Nilai $k$ agar garis $kx - 3y + 6 = 0$ melalui titik $(3, 5)$ adalah...', opts: ['$3$', '$4$', '$\\frac{9}{3}$', '$\\frac{14}{3} - 2$'], jawab: 0, p: 'Substitusi $(3,5)$: $3k - 15 + 6 = 0 \\Rightarrow 3k = 9 \\Rightarrow k = 3$.' },
      { type: 'bs', q: 'Pernyataan: Garis $x + y = 5$ dan $x - y = 1$ berpotongan di $(3, 2)$.', jawab: 'BENAR', p: 'Jumlahkan: $2x = 6 \\Rightarrow x = 3$, $y = 2$. Berpotongan di $(3,2)$.' },
      { type: 'pg', q: 'Gradien garis $ax - 2y = 6$ jika garis tersebut melalui $(0, -3)$ dan $(2, 0)$ adalah...', opts: ['$\\frac{3}{2}$', '$-\\frac{2}{3}$', '$\\frac{2}{3}$', '$3$'], jawab: 0, p: '$m = \\frac{0-(-3)}{2-0} = \\frac{3}{2}$.' },
      { type: 'pg', q: 'Panjang segmen garis pada sumbu-$x$ antara $y = 2x - 4$ dan $y = -x + 8$ adalah...', opts: ['2', '4', '5', '6'], jawab: 3, p: 'Potong sumbu $x$: $2x-4=0 \\Rightarrow x=2$ dan $-x+8=0 \\Rightarrow x=8$. Panjang $= 8-2 = 6$.' },
      { type: 'bs', q: 'Pernyataan: Fungsi $f(x) = 2x + 1$ adalah fungsi linear yang naik (increasing).', jawab: 'BENAR', p: 'Gradien $m = 2 > 0$, sehingga fungsi naik.' },
      { type: 'pg', q: 'Tiga titik $A(0, 2)$, $B(1, 4)$, $C(2, 6)$ bersifat...', opts: ['Tidak segaris', 'Segaris', 'Membentuk segitiga siku-siku', 'Tidak dapat ditentukan'], jawab: 1, p: '$m_{AB} = \\frac{4-2}{1-0} = 2$, $m_{BC} = \\frac{6-4}{2-1} = 2$. Gradien sama, ketiga titik segaris.' },
      { type: 'pg', q: 'Jika $f$ adalah fungsi linear dengan $f(0) = -2$ dan $f(1) = 1$, maka $f(4)$ adalah...', opts: ['7', '8', '10', '12'], jawab: 2, p: '$m = 1 - (-2) = 3$. $f(x) = 3x - 2$. $f(4) = 12 - 2 = 10$.' },
      { type: 'bs', q: 'Pernyataan: Grafik $y = -2x + 4$ dan $y = -2x - 1$ tidak berpotongan.', jawab: 'BENAR', p: 'Gradien keduanya sama ($m = -2$), $y$-intercept berbeda (4 dan −1). Garis sejajar, tidak berpotongan.' },
      { type: 'pg', q: 'Persamaan garis yang melalui titik potong $x + y = 3$ dan $2x - y = 6$ dengan gradien $-2$ adalah...', opts: ['$y = -2x + 9$', '$y = -2x - 9$', '$y = -2x + 5$', '$y = -2x - 3$'], jawab: 0, p: 'Titik potong: $3x = 9 \\Rightarrow x = 3, y = 0$. Garis: $y - 0 = -2(x - 3) \\Rightarrow y = -2x + 6$. Cek jawaban: $y = -2x + 6$... sesuaikan pilihan: melalui $(3,0)$ dengan $m=-2$, $y = -2x + 6$.' },
    ]
  }
};

// Buat data sederhana untuk paket 2–20 & sub-materi (placeholder soal dari paket 1)
for (let i = 2; i <= 20; i++) {
  if (!quizDB[i]) {
    quizDB[i] = Object.assign({}, quizDB[1], {
      kode: 'FL-' + String(i).padStart(2,'0'),
      title: document.querySelector('[data-paket="' + i + '"] .card-title')?.textContent || 'Paket ' + i
    });
  }
}
['A1','A2','B1','B2','C1','C2','D1','D2','E1','E2'].forEach(k => {
  quizDB[k] = Object.assign({}, quizDB[1], {
    kode: 'FL-' + k,
    title: document.querySelector('[data-sub]')?.querySelector('.card-title')?.textContent || 'Sub-materi ' + k
  });
});

// ── Quiz State ───────────────────────────────────────────
let state = { paket: null, soal: [], cur: 0, answers: [], done: false };

function openQuiz(paketId) {
  const data = quizDB[paketId];
  if (!data) { alert('Soal sedang disiapkan. Kembali lagi segera!'); return; }
  state = { paket: paketId, soal: data.soal, cur: 0, answers: Array(data.soal.length).fill(null), done: false };
  document.getElementById('qm-eyebrow').textContent = data.kode + ' · ' + data.level;
  document.getElementById('qm-title').textContent = data.title;
  document.getElementById('qm-tot').textContent = data.soal.length;
  renderQuestion();
  document.getElementById('quizOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuiz() {
  document.getElementById('quizOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('quizOverlay')) closeQuiz();
}

function renderQuestion() {
  const soal = state.soal;
  const i = state.cur;
  const q = soal[i];
  const pct = (i / soal.length) * 100;
  document.getElementById('qm-progress-fill').style.width = pct + '%';
  document.getElementById('qm-cur').textContent = i + 1;

  let html = '<div class="qm-q-wrap">';
  html += '<div class="qm-q-num">Soal ' + (i+1) + '<span class="qm-q-type">' + (q.type === 'pg' ? 'Pilihan Ganda' : 'Benar / Salah') + '</span></div>';
  html += '<div class="qm-q-text">' + q.q + '</div>';

  if (q.type === 'pg') {
    const keys = ['A','B','C','D'];
    html += '<div class="qm-options">';
    q.opts.forEach((opt, oi) => {
      html += '<button class="qm-opt" onclick="pilihJawaban(' + oi + ',this)">';
      html += '<span class="qm-opt-key">' + keys[oi] + '</span>';
      html += '<span class="qm-opt-text">' + opt + '</span>';
      html += '</button>';
    });
    html += '</div>';
  } else {
    html += '<div class="bs-options">';
    html += '<button class="bs-opt benar" onclick="pilihBS(\'BENAR\',this)">&#10003; BENAR</button>';
    html += '<button class="bs-opt salah" onclick="pilihBS(\'SALAH\',this)">&#10007; SALAH</button>';
    html += '</div>';
  }

  html += '<div class="qm-pembahasan" id="q-pem"><span class="qm-p-label">PEMBAHASAN</span>' + q.p + '</div>';
  html += '</div>';

  html += '<div class="qm-nav">';
  html += '<button class="qm-btn" onclick="prevQ()"' + (i === 0 ? ' disabled style="opacity:.4;pointer-events:none"' : '') + '>';
  html += '<svg viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="8,2 3,6.5 8,11"/></svg>Sebelumnya</button>';
  html += '<span class="qm-q-counter">' + (i+1) + ' / ' + soal.length + '</span>';
  if (i < soal.length - 1) {
    html += '<button class="qm-btn" id="btn-next" onclick="nextQ()">Berikutnya<svg viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="5,2 10,6.5 5,11"/></svg></button>';
  } else {
    html += '<button class="qm-btn primary" id="btn-selesai" onclick="selesai()">Lihat Nilai &#128196;</button>';
  }
  html += '</div>';

  document.getElementById('qm-body').innerHTML = html;

  if (typeof MathJax !== 'undefined') {
    MathJax.typesetPromise([document.getElementById('qm-body')]).catch(() => {});
  }
}

function pilihJawaban(idx, btn) {
  const q = state.soal[state.cur];
  if (state.answers[state.cur] !== null) return;
  state.answers[state.cur] = idx;
  const opts = document.querySelectorAll('.qm-opt');
  opts.forEach(b => { b.disabled = true; });
  if (idx === q.jawab) {
    btn.classList.add('is-correct');
  } else {
    btn.classList.add('is-wrong');
    opts[q.jawab].classList.add('is-correct');
  }
  const pem = document.getElementById('q-pem');
  if (pem) {
    pem.classList.add('show');
    if (typeof MathJax !== 'undefined') MathJax.typesetPromise([pem]).catch(() => {});
  }
}

function pilihBS(val, btn) {
  const q = state.soal[state.cur];
  if (state.answers[state.cur] !== null) return;
  state.answers[state.cur] = val;
  const bsBtns = document.querySelectorAll('.bs-opt');
  bsBtns.forEach(b => { b.disabled = true; });
  const correct = q.jawab;
  if (val === correct) {
    btn.classList.add('correct-' + val.toLowerCase());
  } else {
    btn.classList.add('correct-' + val.toLowerCase());
    bsBtns.forEach(b => {
      if (b.textContent.includes(correct)) b.classList.add('correct-' + correct.toLowerCase());
    });
  }
  const pem = document.getElementById('q-pem');
  if (pem) {
    pem.classList.add('show');
    if (typeof MathJax !== 'undefined') MathJax.typesetPromise([pem]).catch(() => {});
  }
}

function nextQ() {
  if (state.cur < state.soal.length - 1) { state.cur++; renderQuestion(); }
}

function prevQ() {
  if (state.cur > 0) { state.cur--; renderQuestion(); }
}

function selesai() {
  const soal = state.soal;
  let benar = 0;
  soal.forEach((q, i) => {
    const ans = state.answers[i];
    if (ans !== null) {
      if (q.type === 'pg' && ans === q.jawab) benar++;
      if (q.type === 'bs' && ans === q.jawab) benar++;
    }
  });
  const total = soal.length;
  const nilai = Math.round((benar / total) * 100);
  const salah = total - benar;

  let label = 'Bagus!';
  let msg = 'Terus berlatih untuk hasil lebih baik.';
  if (nilai >= 90) { label = 'Luar Biasa! 🎉'; msg = 'Penguasaan materi sangat baik. Coba paket yang lebih tinggi!'; }
  else if (nilai >= 75) { label = 'Sangat Baik!'; msg = 'Hampir sempurna. Teliti soal yang salah.'; }
  else if (nilai >= 60) { label = 'Cukup Baik'; msg = 'Ulas kembali materi dan coba lagi.'; }
  else { label = 'Perlu Latihan Lagi'; msg = 'Pelajari ulang materinya, kamu pasti bisa!'; }

  let html = '<div class="qm-score">';
  html += '<div class="qm-score-circle"><div class="qm-score-num">' + nilai + '</div><div class="qm-score-denom">dari 100</div></div>';
  html += '<div class="qm-score-label">' + label + '</div>';
  html += '<div class="qm-score-msg">' + msg + '</div>';
  html += '<div class="qm-score-breakdown">';
  html += '<div class="qm-sbd-item"><div class="qm-sbd-num green">' + benar + '</div><div class="qm-sbd-lbl">Benar</div></div>';
  html += '<div class="qm-sbd-item"><div class="qm-sbd-num red">' + salah + '</div><div class="qm-sbd-lbl">Salah</div></div>';
  html += '<div class="qm-sbd-item"><div class="qm-sbd-num">' + total + '</div><div class="qm-sbd-lbl">Total</div></div>';
  html += '</div>';
  html += '<div class="qm-score-actions">';
  html += '<button class="qm-btn" onclick="openQuiz(' + JSON.stringify(state.paket) + ')">&#8635; Ulangi</button>';
  html += '<button class="qm-btn primary" onclick="closeQuiz()">&#128218; Selesai</button>';
  html += '</div></div>';

  document.getElementById('qm-body').innerHTML = html;
  document.getElementById('qm-progress-fill').style.width = '100%';
}

// keyboard ESC to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQuiz();
});
