// ── Quiz Engine — EksaktaLab ─────────────────────────────
// Dibaca oleh semua halaman latihan soal.
// Konfigurasi per-halaman dimuat via window.QUIZ_CFG (set di template).
// Data soal dimuat via window.quizDB (set di quiz-data-{id}.js).
// ────────────────────────────────────────────────────────

const PAKET_ID = window.QUIZ_CFG.paketId;
const TIPS = {
  pg:  'Pilih satu jawaban yang paling tepat.',
  bs:  'Baca setiap pernyataan dengan teliti. Pilih Benar atau Salah.',
  mma: 'Bisa lebih dari satu jawaban benar. Pilih semua, lalu klik Konfirmasi.',
};
const KEYS = ['A','B','C','D','E'];

// State
const S = {
  bsTemp:{},
  soal:[],cur:0,
  answers:[],correct:[],marked:[],
  mmaTemp:{},done:false,
};

function init(){
  const data = window.quizDB && window.quizDB[PAKET_ID];
  if(!data){
    document.getElementById('q-content').innerHTML =
      '<div style="padding:2rem;text-align:center;color:var(--text-3)">Soal sedang disiapkan. Kembali lagi segera!</div>';
    return;
  }
  S.soal=data.soal;
  S.answers=Array(data.soal.length).fill(null);
  S.correct=Array(data.soal.length).fill(null);
  S.marked=loadMarks(data.soal.length);
  document.getElementById('q-tot').textContent=data.soal.length;
  buildGrid();buildMobStrip();renderQ(0);updateProg();
}
const MARK_KEY='eksakta-mark-'+PAKET_ID;
function loadMarks(n){
  try{const a=JSON.parse(localStorage.getItem(MARK_KEY));if(Array.isArray(a)&&a.length===n)return a.map(Boolean);}catch(e){}
  return Array(n).fill(false);
}
function saveMarks(){try{localStorage.setItem(MARK_KEY,JSON.stringify(S.marked));}catch(e){}}

function buildGrid(){
  const g=document.getElementById('q-grid');
  g.innerHTML=S.soal.map((_,i)=>
    `<button class="q-num-btn${i===0?' cur':''}${S.marked[i]?' mk':''}" id="nb${i}" onclick="goTo(${i})">${i+1}</button>`
  ).join('');
}

function updateBtn(i){updateMobNum(i);
  const b=document.getElementById('nb'+i);if(!b)return;
  b.className='q-num-btn';
  if(i===S.cur)b.classList.add('cur');
  if(S.correct[i]===true)b.classList.add('ok');
  if(S.correct[i]===false)b.classList.add('ng');
  if(S.marked[i])b.classList.add('mk');
}

function updateProg(){
  const tot=S.soal.length;
  const done=S.answers.filter(a=>a!==null).length;
  const benar=S.correct.filter(c=>c===true).length;
  const salah=S.correct.filter(c=>c===false).length;
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set('qp-done',done);set('qp-tot',tot);set('qp-benar',benar);set('qp-salah',salah);set('qp-sisa',tot-done);
  const f=document.getElementById('qp-fill');if(f)f.style.width=(done/tot*100)+'%';
}

function goTo(i){if(S.done&&!S.review)return;S.cur=i;S.soal.forEach((_,j)=>{updateBtn(j);updateMobNum(j);});updateMobNav(i);renderQ(i);closeSb();}
function go(d){const n=S.cur+d;if(n<0||n>=S.soal.length)return;S.cur=n;S.soal.forEach((_,j)=>{updateBtn(j);updateMobNum(j);});updateMobNav(n);renderQ(n);}

function renderQ(i){
  const q=S.soal[i],ans=S.answers[i],answered=ans!==null;
  document.getElementById('q-cur').textContent=i+1;updateMobNav(i);
  document.getElementById('btn-prev').disabled=i===0;

  const isLast=i===S.soal.length-1;
  const nb=document.getElementById('btn-next');
  if(isLast){
    nb.innerHTML='Selesai<svg viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2,7 5,10 12,3"/></svg>';
    nb.onclick=showScore;
  }else{
    nb.innerHTML='Selanjutnya<svg viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="5,2 10,6.5 5,11"/></svg>';
    nb.onclick=()=>go(1);
  }

  let html='';
  // meta row
  html+=`<div class="q-soal-meta">
    <span class="q-soal-pos">Soal ${i+1} dari ${S.soal.length}</span>
    <button class="q-tandai${S.marked[i]?' on':''}" id="tm${i}" onclick="mark(${i})">
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 2h6v9l-3-2.2L4 11V2z"/></svg>
      ${S.marked[i]?'Ditandai':'Tandai Soal'}
    </button>
  </div>`;

  // type badge
  const typeLabel={pg:'Pilihan Ganda',bs:'Benar / Salah',mma:'Multiple Answer'};
  const typeCls={pg:'qt-pg',bs:'qt-bs',mma:'qt-mma'};
  html+=`<span class="q-type ${typeCls[q.type]||'qt-pg'}">${typeLabel[q.type]||'Pilihan Ganda'}</span>`;

  // soal text
  html+=`<div class="q-text">${q.q}</div>`;

  // options
  if(q.type==='bs') html+=renderBS(q,i,answered);
  else if(q.type==='mma') html+=renderMMA(q,i,answered);
  else html+=renderPG(q,i,answered);

  // pembahasan
  if(answered){
    const ok=S.correct[i];
    const vc=ok?'ok':'ng';
    const vt=ok?'Jawaban Benar!':'Jawaban Salah';
    const icoSvg=ok
      ?'<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><polyline points="2,6 5,9 10,3"/></svg>'
      :'<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>';
    html+=`<div class="q-pem show open pem-${vc}" id="pem${i}">
      <div class="q-pem-hd" onclick="togglePem(${i})">
        <span class="q-pem-ico">${icoSvg}</span>
        <span class="q-pem-badge">${vt}</span>
        <span class="q-pem-chevron"><svg viewBox="0 0 12 12" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,4 6,8 10,4"/></svg></span>
      </div>
      <div class="q-pem-body">
        <div class="q-pem-solve-hd"><span class="q-pem-solve-dot"></span><span class="q-pem-solve-title">Pembahasan</span></div>
        <div class="q-pem-body-inner">${q.p}</div>
      </div>
    </div>`;
  }

  const wrap=document.getElementById('q-content');
  wrap.innerHTML=html;wrap.scrollTop=0;const qc=document.getElementById('q-content');if(qc)qc.scrollTop=0;
  if(window.MathJax && typeof MathJax.typeset === 'function')try{MathJax.typeset([wrap]);}catch(e){}
}

/* PG */
function renderPG(q,i,answered){
  let h='<div class="q-opts">';
  q.opts.forEach((opt,oi)=>{
    let cls='q-opt';
    if(answered){
      if(oi===q.jawab)cls+=' correct';
      else if(S.answers[i]===oi&&oi!==q.jawab)cls+=' wrong';
    }
    h+=`<button class="${cls}" onclick="pickPG(${i},${oi})"${answered?' disabled':''}>
      <span class="q-opt-key">${KEYS[oi]}</span>
      <span class="q-opt-text">${opt}</span>
    </button>`;
  });
  return h+'</div>';
}
function pickPG(qi,oi){
  if(S.answers[qi]!==null||S.done)return;
  S.answers[qi]=oi;S.correct[qi]=oi===S.soal[qi].jawab;
  updateBtn(qi);updateProg();renderQ(qi);
}

/* MMA */
function renderMMA(q,i,answered){
  const jawab = Array.isArray(q.jawabArr) ? q.jawabArr : [q.jawab];
  const temp = S.mmaTemp[i] || [];
  const selected = answered ? (S.answers[i] || []) : temp;

  let h = `<div class="q-mma-note">
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="6" r="4.5"/><line x1="6" y1="4" x2="6" y2="6.5"/><circle cx="6" cy="8.5" r=".5" fill="currentColor"/></svg>
    Bisa lebih dari satu jawaban benar. Pilih semua, lalu klik Konfirmasi.
  </div><div class="q-mma-opts">`;

  q.opts.forEach((opt, oi) => {
    const isSel = selected.includes(oi);
    const isCorrect = jawab.includes(oi);
    let cls = 'q-mma-opt';
    if(answered){
      if(isSel && isCorrect) cls += ' correct';
      else if(isSel && !isCorrect) cls += ' wrong';
      else if(!isSel && isCorrect) cls += ' missed';
    } else {
      if(isSel) cls += ' sel';
    }
    const dis = answered ? ' disabled' : '';
    h += `<button class="${cls}" onclick="pickMMA(${i},${oi})"${dis}>
      <span class="q-checkbox"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><polyline points="2,5 4,8 8,2"/></svg></span>
      <span>${opt}</span>
    </button>`;
  });

  h += '</div>';
  if(!answered){
    const canConfirm = temp.length > 0;
    h += `<button class="q-confirm-btn" onclick="confirmMMA(${i})"${canConfirm ? '' : ' disabled'} id="mma-confirm-${i}">Konfirmasi Jawaban</button>`;
  }
  return h;
}
function pickMMA(qi, oi){
  if(S.done || S.answers[qi] !== null) return;
  if(!S.mmaTemp[qi]) S.mmaTemp[qi] = [];
  const idx = S.mmaTemp[qi].indexOf(oi);
  if(idx === -1) S.mmaTemp[qi].push(oi);
  else S.mmaTemp[qi].splice(idx, 1);
  const isSel=S.mmaTemp[qi].includes(oi);
  const mbtn=document.querySelector(`[onclick="pickMMA(${qi},${oi})"]`);
  if(mbtn)mbtn.classList.toggle('sel',isSel);
  const mc=document.getElementById(`mma-confirm-${qi}`);
  if(mc)mc.disabled=S.mmaTemp[qi].length===0;
}
function confirmMMA(qi){
  if(S.done) return;
  const temp = S.mmaTemp[qi] || [];
  if(temp.length === 0) return;
  const jawab = Array.isArray(S.soal[qi].jawabArr) ? S.soal[qi].jawabArr : [S.soal[qi].jawab];
  S.answers[qi] = [...temp];
  S.correct[qi] = temp.length === jawab.length && jawab.every(j => temp.includes(j));
  updateBtn(qi); updateProg(); renderQ(qi);
}

/* BS */
function renderBS(q,i,answered){
  const ps=Array.isArray(q.pernyataan)?q.pernyataan:[q.q];
  const js=Array.isArray(q.jawabArr)?q.jawabArr:[q.jawab];
  const ua=S.answers[i];
  const temp=S.bsTemp&&S.bsTemp[i]?S.bsTemp[i]:Array(ps.length).fill(null);

  let h='';
  h+='<div class="q-bs-list">';
  ps.forEach((p,pi)=>{
    const cur=answered?(ua?ua[pi]:null):(temp[pi]);
    const cor=js[pi];
    let itemCls='q-bs-item';
    let bCls='q-bs-btn', sCls='q-bs-btn';
    if(answered){
      if(cor==='BENAR'){bCls+=' cor';}else{bCls+=(cur==='BENAR'?' wrg':'')}
      if(cor==='SALAH'){sCls+=' cor';}else{sCls+=(cur==='SALAH'?' wrg':'')}
      if(cur===cor)itemCls+=' item-ok'; else if(cur!==null)itemCls+=' item-ng';
    }else{
      if(cur==='BENAR')bCls+=' sel-b';
      if(cur==='SALAH')sCls+=' sel-s';
    }
    const dis=answered?' disabled':'';
    h+=`<div class="${itemCls}">
      <div class="q-bs-item-text"><span class="q-bs-item-label">${String.fromCharCode(65+pi)}.</span>${p}</div>
      <div class="q-bs-btns">
        <button class="${bCls}" id="bs-b-${i}-${pi}" onclick="pickBS(${i},${pi},'BENAR')"${dis}>Benar</button>
        <button class="${sCls}" id="bs-s-${i}-${pi}" onclick="pickBS(${i},${pi},'SALAH')"${dis}>Salah</button>
      </div>
    </div>`;
  });
  h+='</div>';
  if(!answered){
    const allFilled=temp.every(a=>a!==null);
    h+=`<button class="q-bs-confirm" onclick="confirmBS(${i})"${allFilled?'':' disabled'} id="bs-confirm-${i}">Konfirmasi Jawaban</button>`;
  }
  return h;
}
function pickBS(qi,pi,val){
  if(S.done||S.answers[qi]!==null)return;
  if(!S.bsTemp)S.bsTemp={};
  if(!S.bsTemp[qi]){
    const ps=Array.isArray(S.soal[qi].pernyataan)?S.soal[qi].pernyataan:[S.soal[qi].q];
    S.bsTemp[qi]=Array(ps.length).fill(null);
  }
  if(S.bsTemp[qi][pi]===val){S.bsTemp[qi][pi]=null;}
  else{S.bsTemp[qi][pi]=val;}
  const cur=S.bsTemp[qi][pi];
  const bb=document.getElementById(`bs-b-${qi}-${pi}`);
  const sb=document.getElementById(`bs-s-${qi}-${pi}`);
  if(bb)bb.className='q-bs-btn'+(cur==='BENAR'?' sel-b':'');
  if(sb)sb.className='q-bs-btn'+(cur==='SALAH'?' sel-s':'');
  const bc=document.getElementById(`bs-confirm-${qi}`);
  if(bc)bc.disabled=!S.bsTemp[qi].every(a=>a!==null);
}
function confirmBS(qi){
  const q=S.soal[qi];
  const ps=Array.isArray(q.pernyataan)?q.pernyataan:[q.q];
  const js=Array.isArray(q.jawabArr)?q.jawabArr:[q.jawab];
  const temp=S.bsTemp&&S.bsTemp[qi]?S.bsTemp[qi]:[];
  if(!temp.every(a=>a!==null))return;
  S.answers[qi]=[...temp];
  S.correct[qi]=temp.every((a,idx)=>a===js[idx]);
  updateBtn(qi);updateProg();renderQ(qi);
}

/* Mark */
function mark(i){
  S.marked[i]=!S.marked[i];
  saveMarks();
  const nb=document.getElementById('nb'+i);if(nb)nb.classList.toggle('mk',S.marked[i]);
  const b=document.getElementById('tm'+i);if(!b)return;
  b.classList.toggle('on',S.marked[i]);
  b.innerHTML=`<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 2h6v9l-3-2.2L4 11V2z"/></svg>${S.marked[i]?'Ditandai':'Tandai Soal'}`;
}

/* Toggle pembahasan */
function togglePem(i){document.getElementById('pem'+i)?.classList.toggle('open');}

/* Score */
function showScore(){
  S.done=true;
  const tot=S.soal.length;
  const ok=S.correct.filter(c=>c===true).length;
  const ng=tot-ok;
  const nilai=Math.round(ok/tot*100);
  let label='Perlu Latihan Lagi',msg='Masih banyak soal yang perlu diulangi. Baca kembali materinya, lalu coba lagi!';
  if(nilai>=90){label='Luar Biasa! 🎉';msg='Penguasaan soal sangat baik. Kamu siap ke paket berikutnya!';}
  else if(nilai>=75){label='Sangat Baik!';msg='Hampir sempurna — teliti lagi soal yang salah, pasti bisa 100!';}
  else if(nilai>=60){label='Cukup Baik';msg='Sudah melewati batas tuntas. Ulas soal yang salah untuk memperkuat pemahamanmu.';}
  else if(nilai>=40){label='Perlu Penguatan';msg='Beberapa konsep perlu diperkuat. Pelajari kembali materinya sebelum mencoba lagi.';}
  const firstWrong=S.correct.findIndex(c=>c===false);
  const reviewBtn=firstWrong>=0?`<button class="q-done-btn" onclick="reviewWrong()"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4z"/><circle cx="7" cy="7" r="1.6"/></svg>Tinjau soal salah</button>`:'';
  const ov=document.createElement('div');
  ov.className='q-done-ov';ov.id='q-done-ov';
  ov.innerHTML=`
    <div class="q-done-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="5,13 10,18 19,7"/></svg></div>
    <div class="q-done-title">${label}</div>
    <div class="q-done-msg">${msg}</div>
    <div class="q-done-stats">
      <div class="q-done-stat"><span class="q-done-n g">${ok}</span><span class="q-done-l">Benar</span></div>
      <div class="q-done-stat"><span class="q-done-n r">${ng}</span><span class="q-done-l">Salah</span></div>
      <div class="q-done-stat"><span class="q-done-n">${nilai}</span><span class="q-done-l">Nilai</span></div>
    </div>
    <div class="q-done-acts">
      ${reviewBtn}
      <button class="q-done-btn" onclick="location.reload()"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7a5 5 0 1 1-1.6-3.7M12 2v2.6H9.4"/></svg>Ulangi</button>
      <button class="q-done-btn p" onclick="window.location.href='../'"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3 4.5 7l4 4"/></svg>Kembali</button>
    </div>`;
  document.getElementById('q-layout').appendChild(ov);
  document.getElementById('q-nav').style.display='none';const mn2=document.getElementById('q-mob-nav');if(mn2)mn2.style.display='none';const ms2=document.getElementById('q-mob-strip');if(ms2)ms2.style.display='none';
}
function reviewWrong(){
  S.review=true;
  const ov=document.getElementById('q-done-ov');if(ov)ov.remove();
  document.getElementById('q-nav').style.display='';
  const mn=document.getElementById('q-mob-nav');if(mn)mn.style.display='';
  const ms=document.getElementById('q-mob-strip');if(ms)ms.style.display='';
  const fw=S.correct.findIndex(c=>c===false);
  goTo(fw>=0?fw:0);
}

/* Sidebar mobile */
function toggleSb(){
  document.getElementById('q-sb').classList.toggle('open');
  document.getElementById('q-sb-ov').classList.toggle('open');
}
function closeSb(){
  document.getElementById('q-sb').classList.remove('open');
  document.getElementById('q-sb-ov').classList.remove('open');
}

/* Theme */
function toggleTheme(){
  const h=document.documentElement,btn=document.getElementById('themeBtn');
  const dark=h.getAttribute('data-theme')==='dark';
  h.setAttribute('data-theme',dark?'light':'dark');
  localStorage.setItem('eksaktalab-theme',dark?'light':'dark');
  btn.textContent=dark?'🌙 Gelap':'☀️ Terang';
}

/* Keyboard */
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowDown')go(1);
  if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(-1);
  if(['1','2','3','4'].includes(e.key)&&!S.done){
    const q=S.soal[S.cur];
    if(q&&q.type==='pg'&&S.answers[S.cur]===null)pickPG(S.cur,parseInt(e.key)-1);
  }
});

/* Mobile strip */
function buildMobStrip(){
  const inner = document.getElementById('q-mob-strip-inner');
  if(!inner) return;
  const tot = document.getElementById('mob-q-tot');
  if(tot) tot.textContent = S.soal.length;
  inner.innerHTML = S.soal.map((_,i) =>
    `<button class="q-mob-num${i===0?' cur':''}" id="mn${i}" onclick="goTo(${i})">${i+1}</button>`
  ).join('');
}

function updateMobNum(i){
  const b = document.getElementById('mn'+i);
  if(!b) return;
  b.className = 'q-mob-num';
  if(i === S.cur) b.classList.add('cur');
  if(S.correct[i] === true)  b.classList.add('ok');
  if(S.correct[i] === false) b.classList.add('ng');
}

function updateMobNav(i){
  const prev = document.getElementById('mob-btn-prev');
  const cur  = document.getElementById('mob-q-cur');
  const next = document.getElementById('mob-btn-next');
  const isLast = i === S.soal.length - 1;
  if(prev) prev.disabled = (i === 0);
  if(cur)  cur.textContent = i + 1;
  if(next){
    if(isLast){
      next.innerHTML = 'Selesai<span class="q-mob-arrow"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="2,7 5,9.5 8,4"/></svg></span>';
      next.onclick = showScore;
    } else {
      next.innerHTML = 'Selanjutnya<span class="q-mob-arrow"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3,2 7,5 3,8"/></svg></span>';
      next.onclick = () => go(1);
    }
  }
  const mn = document.getElementById('mn'+i);
  if(mn) mn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}

init();
