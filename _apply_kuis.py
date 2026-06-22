f = 'latihan-soal/fungsi-linear/kuis-kilat/index.html'
s = open(f, encoding='utf-8').read()

R = []

# 1. CSS timer + ld-ans
R.append(('css_timer',
'''.ld-cur{background:var(--teal);border-color:var(--teal);}
.ld-ok {background:var(--green);border-color:var(--green-b);}
.ld-ng {background:var(--red);border-color:var(--red-b);}
.ld-bl {background:var(--surface);border-color:var(--border);}''',
'''.ld-cur{background:var(--teal);border-color:var(--teal);}
.ld-ok {background:var(--green);border-color:var(--green-b);}
.ld-ng {background:var(--red);border-color:var(--red-b);}
.ld-bl {background:var(--surface);border-color:var(--border);}
.ld-ans{background:rgba(0,191,165,.12);border-color:rgba(0,191,165,.5);}
/* TIMER (ujian) */
.q-timer-box{text-align:center;transition:background .3s,border-color .3s;}
.q-timer-lbl{display:flex;align-items:center;justify-content:center;gap:.3rem;font-family:var(--mono);font-size:.58rem;font-weight:700;color:var(--teal);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.4rem;}
.q-timer-lbl svg{width:11px;height:11px;}
.q-timer{font-family:var(--mono);font-size:1.7rem;font-weight:700;color:var(--text);letter-spacing:.02em;line-height:1;}
.q-timer-box.warn{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.32);}
.q-timer-box.warn .q-timer,.q-timer-box.warn .q-timer-lbl{color:#D97706;}
.q-timer-box.danger{background:rgba(239,68,68,.09);border-color:rgba(239,68,68,.38);animation:timerPulse 1s ease-in-out infinite;}
.q-timer-box.danger .q-timer,.q-timer-box.danger .q-timer-lbl{color:var(--red-b);}
@keyframes timerPulse{0%,100%{opacity:1;}50%{opacity:.5;}}
.q-bc-timer{display:none;align-items:center;gap:.3rem;margin-left:auto;opacity:1;font-family:var(--mono);font-weight:700;color:var(--teal);background:rgba(0,191,165,.1);border:1px solid rgba(0,191,165,.28);border-radius:6px;padding:.18rem .55rem;font-size:.74rem;}
.q-bc-timer svg{width:12px;height:12px;}
.q-bc-timer b{font-weight:700;}
.q-bc-timer.warn{color:#D97706;background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.32);}
.q-bc-timer.danger{color:var(--red-b);background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.38);animation:timerPulse 1s ease-in-out infinite;}
@media(max-width:900px){.q-bc-timer{display:inline-flex;}}'''))

# 2. Breadcrumb timer chip (KILAT-specific)
R.append(('breadcrumb',
'''  <span class="q-bc-level" style="color:#7C3AED">Campuran</span>
</div>''',
'''  <span class="q-bc-level" style="color:#7C3AED">Campuran</span>
  <div class="q-bc-timer" id="timer-mobile"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7.5" r="5"/><path d="M7 4.7v2.8l1.8 1.1"/><path d="M5 1h4"/></svg><b class="t-val">--:--</b></div>
</div>'''))

# 3. Sidebar tip->timer + legend
R.append(('sidebar',
'''    <div class="q-sb-tip">
      <div class="q-sb-tip-lbl">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="7" cy="7" r="5.5"/><line x1="7" y1="5" x2="7" y2="7.5"/><circle cx="7" cy="9.5" r=".6" fill="currentColor"/></svg>
        Tips
      </div>
      <span id="q-tip">Pilih jawaban untuk melihat pembahasan instan.</span>
    </div>
    <div class="q-sb-legend">
      <div class="q-legend-row"><div class="q-legend-dot ld-cur"></div>Soal aktif</div>
      <div class="q-legend-row"><div class="q-legend-dot ld-ok"></div>Sudah dijawab</div>
      <div class="q-legend-row"><div class="q-legend-dot ld-ng"></div>Jawaban salah</div>
      <div class="q-legend-row"><div class="q-legend-dot ld-bl"></div>Belum dikunjungi</div>
    </div>''',
'''    <div class="q-sb-tip q-timer-box" id="timer-box">
      <div class="q-timer-lbl">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7.5" r="5"/><path d="M7 4.7v2.8l1.8 1.1"/><path d="M5 1h4"/></svg>
        Sisa Waktu
      </div>
      <div class="q-timer" id="timer-display">--:--</div>
    </div>
    <div class="q-sb-legend">
      <div class="q-legend-row"><div class="q-legend-dot ld-cur"></div>Soal aktif</div>
      <div class="q-legend-row"><div class="q-legend-dot ld-ans"></div>Sudah dijawab</div>
      <div class="q-legend-row"><div class="q-legend-dot ld-bl"></div>Belum dikunjungi</div>
    </div>'''))

# 4. renderQ q-tip removal
R.append(('qtip',
'''  document.getElementById('btn-prev').disabled=i===0;
  document.getElementById('q-tip').textContent=TIPS[q.type]||TIPS.pg;
''',
'''  document.getElementById('btn-prev').disabled=i===0;
'''))

# 5. init startTimer + timer funcs
R.append(('init',
'''  document.getElementById('q-tot').textContent=data.soal.length;
  buildGrid();buildMobStrip();renderQ(0);initReloadGuard();
}''',
'''  document.getElementById('q-tot').textContent=data.soal.length;
  buildGrid();buildMobStrip();renderQ(0);initReloadGuard();startTimer();
}

// ── Timer Ujian ──
let _timerInt=null;
function startTimer(){
  if(!IS_UJIAN) return;
  S.endTime=Date.now()+UJIAN_MINUTES*60*1000;
  updateTimer();
  _timerInt=setInterval(updateTimer,1000);
}
function updateTimer(){
  let rem=Math.round((S.endTime-Date.now())/1000);
  if(rem<0)rem=0;
  const m=Math.floor(rem/60),s=rem%60;
  const txt=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  const d=document.getElementById('timer-display');if(d)d.textContent=txt;
  const mv=document.querySelector('#timer-mobile .t-val');if(mv)mv.textContent=txt;
  let cls='';
  if(rem<=60)cls='danger';else if(rem<=300)cls='warn';
  [document.getElementById('timer-box'),document.getElementById('timer-mobile')].forEach(el=>{
    if(!el)return;el.classList.remove('warn','danger');if(cls)el.classList.add(cls);
  });
  if(rem<=0){clearInterval(_timerInt);_timerInt=null;if(!S.done)showScore();}
}
function stopTimer(){if(_timerInt){clearInterval(_timerInt);_timerInt=null;}}'''))

# 6. showUjianResult stopTimer
R.append(('stoptimer',
'''function showUjianResult() {
  S.done = true;
  if (IS_UJIAN) sessionStorage.setItem(SS_DONE, '1');''',
'''function showUjianResult() {
  S.done = true;
  stopTimer();
  if (IS_UJIAN) sessionStorage.setItem(SS_DONE, '1');'''))

# 7. Result CSS restyle
R.append(('ur_css',
'''.ur-hero{
  background:var(--navy);
  padding:2.5rem 2rem 2rem;
  text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:.6rem;
  flex-shrink:0;position:relative;overflow:hidden;
}
.ur-hero::before{
  content:'';position:absolute;inset:0;
  background-image:linear-gradient(rgba(0,191,165,.06) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,191,165,.06) 1px,transparent 1px);
  background-size:32px 32px;pointer-events:none;
}
.ur-grade{
  width:72px;height:72px;border-radius:50%;
  border:3px solid;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--display);font-size:1.8rem;font-weight:700;
  position:relative;z-index:1;
}
.ur-nilai{
  font-family:var(--display);font-size:3rem;font-weight:700;
  color:#fff;letter-spacing:-.05em;line-height:1;
  position:relative;z-index:1;
}
.ur-nilai span{font-size:1.2rem;color:rgba(255,255,255,.4);}
.ur-label{
  font-size:.9rem;color:rgba(255,255,255,.7);
  position:relative;z-index:1;
}
.ur-msg{font-size:.78rem;color:rgba(255,255,255,.45);max-width:300px;text-align:center;line-height:1.55;margin-top:.25rem;position:relative;z-index:1;}
.ur-stats{
  display:flex;gap:1rem;margin-top:.5rem;
  position:relative;z-index:1;
}
.ur-stat{
  display:flex;flex-direction:column;align-items:center;gap:.15rem;
  min-width:56px;
}
.ur-stat span{font-family:var(--display);font-size:1.4rem;font-weight:700;color:#fff;line-height:1;}
.ur-stat{font-size:.65rem;font-family:var(--mono);color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em;}
.ur-stat.g span{color:var(--green-b);}
.ur-stat.r span{color:var(--red-b);}
.ur-stat.m span{color:rgba(255,255,255,.4);}
.ur-actions{
  display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;
  margin-top:.75rem;position:relative;z-index:1;
}
.ur-btn{
  display:inline-flex;align-items:center;gap:.45rem;
  height:38px;padding:0 1.1rem;border-radius:var(--radius-sm);
  background:var(--teal);color:var(--navy);
  font-family:var(--sans);font-size:.8rem;font-weight:700;
  border:none;cursor:pointer;text-decoration:none;
  transition:all .2s;white-space:nowrap;
}
.ur-btn:hover{background:var(--teal-dim);}
.ur-btn.secondary{
  background:rgba(255,255,255,.1);color:#fff;
  border:1px solid rgba(255,255,255,.2);
}
.ur-btn.secondary:hover{background:rgba(255,255,255,.18);}''',
'''.ur-hero{
  background:var(--surface);
  padding:2rem 1.5rem 1.75rem;
  text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:.55rem;
  flex-shrink:0;border-bottom:1px solid var(--border);
}
.ur-grade{
  width:62px;height:62px;border-radius:50%;
  border:2.5px solid;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--display);font-size:1.6rem;font-weight:700;
  margin-bottom:.15rem;
}
.ur-label{
  font-family:var(--display);font-size:1.25rem;font-weight:700;
  color:var(--text);letter-spacing:-.02em;
}
.ur-msg{font-size:.82rem;color:var(--text-3);max-width:330px;text-align:center;line-height:1.6;}
.ur-stats{
  display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;
  max-width:340px;width:100%;margin-top:.55rem;
}
.ur-stat{
  background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);
  padding:.55rem .3rem;display:flex;flex-direction:column;gap:.22rem;
  font-size:.58rem;font-family:var(--mono);color:var(--text-3);
  text-transform:uppercase;letter-spacing:.05em;
}
.ur-stat span{font-family:var(--display);font-size:1.3rem;font-weight:700;color:var(--text);line-height:1;}
.ur-stat.g span{color:var(--green-b);}
.ur-stat.r span{color:var(--red-b);}
.ur-stat.m span{color:var(--text-3);}
.ur-stat.n span{color:var(--teal);}
.ur-actions{
  display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-top:.7rem;
}
.ur-btn{
  display:inline-flex;align-items:center;gap:.4rem;
  height:36px;padding:0 1rem;border-radius:var(--radius-sm);
  background:var(--teal);color:var(--navy);
  font-family:var(--sans);font-size:.78rem;font-weight:700;
  border:none;cursor:pointer;text-decoration:none;
  transition:all .2s;white-space:nowrap;
}
.ur-btn:hover{background:var(--teal-dim);}
.ur-btn.secondary{
  background:var(--surface-2);color:var(--text-2);
  border:1.5px solid var(--border);
}
.ur-btn.secondary:hover{border-color:var(--teal);color:var(--teal);}'''))

# 8. Result hero HTML
R.append(('ur_html',
'''        <div class="ur-grade" style="border-color:${gradeColor};color:${gradeColor}">${grade}</div>
        <div class="ur-nilai">${nilai}<span>/100</span></div>
        <div class="ur-label">${label}</div>
        <div class="ur-msg">${msg}</div>
        <div class="ur-stats">
          <div class="ur-stat g"><span>${benar}</span>Benar</div>
          <div class="ur-stat r"><span>${salah}</span>Salah</div>
          <div class="ur-stat m"><span>${kosong}</span>Kosong</div>
          <div class="ur-stat"><span>${total}</span>Total</div>
        </div>''',
'''        <div class="ur-grade" style="border-color:${gradeColor};color:${gradeColor}">${grade}</div>
        <div class="ur-label">${label}</div>
        <div class="ur-msg">${msg}</div>
        <div class="ur-stats">
          <div class="ur-stat g"><span>${benar}</span>Benar</div>
          <div class="ur-stat r"><span>${salah}</span>Salah</div>
          <div class="ur-stat m"><span>${kosong}</span>Kosong</div>
          <div class="ur-stat n"><span>${nilai}</span>Nilai</div>
        </div>'''))

missing = [label for label, old, new in R if old not in s]
if missing:
    print('MISSING:', missing)
else:
    for label, old, new in R:
        s = s.replace(old, new)
    open(f, 'w', encoding='utf-8').write(s)
    print('OK - kuis-kilat updated, all', len(R), 'replacements applied')
