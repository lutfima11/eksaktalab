/* ── DATA KUNCI JAWABAN ───────────────────────── */
const KUNCI = {
  1:'A', 2:'C', 3:'B', 4:'A', 5:'A',
  6:'C', 7:'A', 8:'C', 9:'A', 10:'B',
  11:'C', 12:'B', 13:'B', 14:'A', 15:'B',
  16:'A', 17:'A', 18:'A', 19:'B', 20:'D'
};

/* Peta soal ke bagian (untuk breakdown per bagian) */
const BAGIAN = {
  'A (Bilangan)':              [1,2,3,4],
  'B (Aljabar)':               [5,6,7,8,9],
  'C (Geometri)':              [10,11,12,13],
  'D (Garis Bil. & Pertidaks.)':[14,15,16],
  'E (Data & Peluang)':        [17,18,19,20]
};

const jawaban = {};
let sudahSubmit = false;

/* ── PILIH JAWABAN ───────────────────────────── */
function pilih(no, opsi) {
  if (sudahSubmit) return;
  jawaban[no] = opsi;

  const opts = document.querySelectorAll(`#opts${no} .opt`);
  opts.forEach(o => o.classList.remove('selected'));
  const keys = ['A','B','C','D'];
  const idx = keys.indexOf(opsi);
  if (opts[idx]) opts[idx].classList.add('selected');

  document.getElementById('qc'+no).classList.add('answered');
  updateProgress();
}

/* ── UPDATE PROGRES ──────────────────────────── */
function updateProgress() {
  const count = Object.keys(jawaban).length;
  document.getElementById('progressNum').textContent = count;
  document.getElementById('progressFill').style.width = (count / 20 * 100) + '%';

  const btn = document.getElementById('btnSubmit');
  const hint = document.getElementById('submitHint');
  if (count === 20) {
    btn.disabled = false;
    hint.textContent = 'Semua soal sudah dijawab. Klik tombol untuk melihat hasil!';
    hint.style.color = 'var(--teal)';
  } else {
    btn.disabled = true;
    hint.textContent = `Jawab semua 20 soal untuk melihat hasil. (${20-count} soal lagi)`;
    hint.style.color = 'var(--text-3)';
  }

  const sisa = 20 - count;
  const stickyBtn = document.getElementById('stickyNext');
  if (sisa === 0 || sudahSubmit) {
    stickyBtn.classList.add('hidden');
  } else {
    stickyBtn.classList.remove('hidden');
  }
}

/* ── GULIR KE SOAL BELUM DIJAWAB ─────────────── */
function gulirKeSoalBerikutnya() {
  for (let no = 1; no <= 20; no++) {
    if (!jawaban[no]) {
      const el = document.getElementById('qc' + no);
      if (el) {
        const offset = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        el.style.transition = 'box-shadow .2s';
        el.style.boxShadow = '0 0 0 3px var(--teal)';
        setTimeout(() => { el.style.boxShadow = ''; }, 1200);
      }
      return;
    }
  }
}

/* ── SUBMIT ──────────────────────────────────── */
function submitKuis() {
  if (Object.keys(jawaban).length < 20) {
    toast('Jawab semua soal terlebih dahulu!');
    return;
  }
  sudahSubmit = true;
  document.getElementById('btnSubmit').style.display = 'none';
  document.getElementById('submitHint').style.display = 'none';
  document.getElementById('stickyNext').classList.add('hidden');

  let benar = 0;
  const keys = ['A','B','C','D'];

  for (let no = 1; no <= 20; no++) {
    const jawabanSiswa = jawaban[no];
    const kunci = KUNCI[no];
    const card = document.getElementById('qc'+no);
    const opts = document.querySelectorAll(`#opts${no} .opt`);

    opts.forEach(o => {
      o.disabled = true;
      o.classList.remove('selected');
    });

    const idxKunci = keys.indexOf(kunci);
    const idxJawab = keys.indexOf(jawabanSiswa);

    if (idxKunci >= 0 && opts[idxKunci]) opts[idxKunci].classList.add('is-correct');

    if (jawabanSiswa === kunci) {
      benar++;
      card.classList.add('correct');
    } else {
      if (idxJawab >= 0 && opts[idxJawab]) opts[idxJawab].classList.add('is-wrong');
      card.classList.add('wrong');
    }

    const pem = document.getElementById('pem'+no);
    if (pem) { pem.style.display='block'; pem.classList.add('show'); }
  }

  const salah = 20 - benar;
  const nilai = Math.round(benar / 20 * 100);

  const panel = document.getElementById('scorePanel');
  panel.classList.add('show');

  document.getElementById('scoreNilai').innerHTML = `<em>${nilai}</em>`;
  document.getElementById('sbdBenar').textContent = benar;
  document.getElementById('sbdSalah').textContent = salah;
  document.getElementById('sbdNilai').textContent = nilai;

  let label, msg;
  if (nilai >= 85) {
    label = '🏆 Sangat Siap — Fase E/F';
    msg = 'Luar biasa! Penguasaan prasyaratmu sangat kuat. Kamu siap masuk ke materi SMA dengan percaya diri.';
  } else if (nilai >= 70) {
    label = '✅ Siap dengan Catatan';
    msg = 'Bagus! Kamu sudah menguasai sebagian besar materi prasyarat. Review topik yang masih kurang sebelum melanjutkan.';
  } else if (nilai >= 55) {
    label = '⚠️ Perlu Penguatan';
    msg = 'Ada beberapa konsep prasyarat yang perlu diperkuat. Pelajari kembali bagian yang salah sebelum lanjut ke Fase E/F.';
  } else {
    label = '🔁 Perlu Review Menyeluruh';
    msg = 'Masih banyak materi prasyarat yang perlu diulang. Jangan khawatir — fokus perbaiki fondasi dulu agar lebih kuat di SMA!';
  }
  document.getElementById('scoreLabel').textContent = label;
  document.getElementById('scoreMsg').textContent = msg;

  const pbdEl = document.getElementById('pillarBreakdown');
  pbdEl.innerHTML = '';
  for (const [nama, soalList] of Object.entries(BAGIAN)) {
    let b = 0;
    soalList.forEach(n => { if (jawaban[n] === KUNCI[n]) b++; });
    const pct = Math.round(b / soalList.length * 100);
    pbdEl.innerHTML += `
      <div class="pbd-row">
        <div class="pbd-tag">${nama}</div>
        <div class="pbd-bar-wrap"><div class="pbd-bar" style="width:${pct}%"></div></div>
        <div class="pbd-score">${b}/${soalList.length}</div>
      </div>`;
  }

  setTimeout(() => panel.scrollIntoView({behavior:'smooth', block:'start'}), 200);

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}

/* ── RESET ───────────────────────────────────── */
function resetKuis() {
  sudahSubmit = false;
  for (const k in jawaban) delete jawaban[k];

  for (let no = 1; no <= 20; no++) {
    const card = document.getElementById('qc'+no);
    card.classList.remove('correct','wrong','answered');

    const opts = document.querySelectorAll(`#opts${no} .opt`);
    opts.forEach(o => {
      o.disabled = false;
      o.classList.remove('selected','is-correct','is-wrong');
    });

    const pem = document.getElementById('pem'+no);
    if (pem) { pem.style.display='none'; pem.classList.remove('show'); }
  }

  document.getElementById('scorePanel').classList.remove('show');
  document.getElementById('btnSubmit').style.display = '';
  document.getElementById('submitHint').style.display = '';
  updateProgress();

  window.scrollTo({top:0, behavior:'smooth'});
}

/* ── TOAST ───────────────────────────────────── */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show';
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = 'none'; }, 2200);
}

/* ── INIT ────────────────────────────────────── */
updateProgress();

/* ── SYNC PROGRESS-WRAP TOP ─────────────────── */
function syncProgressTop() {
  const navH = document.querySelector('.navbar').offsetHeight;
  document.querySelector('.progress-wrap').style.top = navH + 'px';
}
syncProgressTop();
window.addEventListener('resize', syncProgressTop);
