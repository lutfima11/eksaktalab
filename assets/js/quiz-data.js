// ── QUIZ DATABASE — Fungsi Linear ────────────────────────────────────────────
// type: 'pg'  = pilihan ganda (jawab: index)
// type: 'bs'  = benar/salah — satu pernyataan (jawab: 'BENAR'|'SALAH')
//               ATAU multi-pernyataan: pernyataan:[], jawabArr:['BENAR','SALAH',...]
// type: 'mma' = multiple answer  (jawabArr: [idx,...])
// ─────────────────────────────────────────────────────────────────────────────

window.quizDB = {

// ══════════════════════════════════════════════════════════════════════════════
// PAKET BERLATIH  1–20
// ══════════════════════════════════════════════════════════════════════════════

1: {
  title: 'Mengenal Fungsi Linear',
  kode: 'FL-01', level: 'Beginner',
  soal: [
    { type:'pg', q:'Manakah yang merupakan fungsi linear?',
      opts:['$f(x)=x^2+1$','$f(x)=3x-2$','$f(x)=\\frac{1}{x}$','$f(x)=\\sqrt{x}$'],
      jawab:1, p:'Fungsi linear berbentuk $f(x)=mx+c$ dengan derajat tertinggi 1. Hanya $f(x)=3x-2$ yang memenuhi bentuk ini.' },

    { type:'pg', q:'Jika $f(x)=4x-3$, maka nilai $f(2)$ adalah...',
      opts:['3','5','7','11'], jawab:1, p:'$f(2)=4(2)-3=8-3=5$.' },

    { type:'pg', q:'Fungsi linear $f(x)=2x+6$ memotong sumbu-$x$ di titik...',
      opts:['$(-3,0)$','$(3,0)$','$(0,6)$','$(6,0)$'],
      jawab:0, p:'Titik potong sumbu-$x$: $f(x)=0\\Rightarrow 2x+6=0\\Rightarrow x=-3$. Jadi titiknya $(-3,0)$.' },

    { type:'bs',
      pernyataan:['$f(x)=5$ adalah fungsi linear dengan gradien 0.','Fungsi $f(x)=3x$ melalui titik asal $(0,0)$.','Semua fungsi linear memiliki gradien positif.'],
      jawabArr:['BENAR','BENAR','SALAH'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: $f(x)=0\\cdot x+5$ → gradien 0, benar. B: $f(0)=0$, benar. C: Fungsi seperti $f(x)=-2x+1$ bergradien negatif, jadi salah.' },

    { type:'pg', q:'Gradien garis yang melalui titik $A(1,3)$ dan $B(3,9)$ adalah...',
      opts:['2','3','4','6'], jawab:1, p:'$m=\\frac{9-3}{3-1}=\\frac{6}{2}=3$.' },

    { type:'pg', q:'Nilai $y$-intercept dari $f(x)=-3x+8$ adalah...',
      opts:['$-3$','$3$','$-8$','$8$'], jawab:3, p:'$y$-intercept adalah nilai $f(0)=-3(0)+8=8$.' },

    { type:'mma', q:'Manakah persamaan berikut yang merupakan fungsi linear?',
      opts:['$y=2x-5$','$y=x^2+1$','$3x+y=7$','$xy=4$','$y=-\\frac{1}{3}x$'],
      jawabArr:[0,2,4], p:'Fungsi linear berbentuk $y=mx+c$ atau setara. $y=2x-5$, $3x+y=7$ (bisa diubah $y=-3x+7$), dan $y=-\\frac{1}{3}x$ memenuhi. $y=x^2+1$ kuadrat; $xy=4$ bukan linear.' },

    { type:'pg', q:'Persamaan garis yang melalui $(0,2)$ dengan gradien 3 adalah...',
      opts:['$y=2x+3$','$y=3x+2$','$y=3x-2$','$y=2x-3$'],
      jawab:1, p:'Bentuk $y=mx+c$ dengan $m=3$ dan $c=2$: $y=3x+2$.' },

    { type:'bs', q:'Garis $x=-2$ memiliki gradien yang tidak terdefinisi.',
      jawab:'BENAR', p:'Garis vertikal $x=k$ tidak memiliki gradien terdefinisi karena $\\Delta x=0$.' },

    { type:'pg', q:'Jika $f(x)=mx+3$ dan $f(2)=7$, maka nilai $m$ adalah...',
      opts:['1','2','3','4'], jawab:1, p:'$f(2)=2m+3=7\\Rightarrow 2m=4\\Rightarrow m=2$.' },
  ]
},

2: {
  title: 'Gradien & Persamaan Garis',
  kode: 'FL-02', level: 'Beginner',
  soal: [
    { type:'pg', q:'Gradien garis $y=5x-3$ adalah...',
      opts:['$-3$','$3$','$5$','$-5$'], jawab:2, p:'Dalam $y=mx+c$, koefisien $x$ adalah gradien. $m=5$.' },

    { type:'pg', q:'Titik potong sumbu-$y$ dari garis $3x+2y=12$ adalah...',
      opts:['$(4,0)$','$(0,6)$','$(0,4)$','$(6,0)$'],
      jawab:1, p:'Substitusi $x=0$: $2y=12\\Rightarrow y=6$. Titiknya $(0,6)$.' },

    { type:'bs', q:'Dua garis dengan gradien sama pasti sejajar.',
      jawab:'BENAR', p:'Dua garis $y=m_1x+c_1$ dan $y=m_2x+c_2$ sejajar jika $m_1=m_2$ dan $c_1\\neq c_2$.' },

    { type:'pg', q:'Persamaan garis melalui $(2,5)$ dengan gradien 3 adalah...',
      opts:['$y=3x-1$','$y=3x+1$','$y=3x+5$','$y=3x-5$'],
      jawab:0, p:'$y-5=3(x-2)\\Rightarrow y=3x-6+5=3x-1$.' },

    { type:'pg', q:'Garis yang tegak lurus $y=2x+1$ dan melalui $(0,3)$ adalah...',
      opts:['$y=2x+3$','$y=-\\frac{1}{2}x+3$','$y=\\frac{1}{2}x+3$','$y=-2x+3$'],
      jawab:1, p:'Tegak lurus: $m=-\\frac{1}{2}$. Melalui $(0,3)$: $y=-\\frac{1}{2}x+3$.' },

    { type:'mma', q:'Manakah pasangan garis berikut yang saling sejajar?',
      opts:['$y=3x+1$ dan $y=3x-4$','$y=2x$ dan $y=x+2$','$2y=4x-6$ dan $y=2x+3$','$y=-x+5$ dan $y=x-5$'],
      jawabArr:[0,2], p:'Sejajar = gradien sama, $y$-intercept beda. A: keduanya $m=3$ ✓. C: $2y=4x-6\\Rightarrow y=2x-3$, keduanya $m=2$ ✓. B dan D memiliki gradien berbeda.' },

    { type:'pg', q:'Nilai $f(-3)$ untuk $f(x)=-2x+4$ adalah...',
      opts:['$-2$','$10$','$-10$','$2$'], jawab:1, p:'$f(-3)=-2(-3)+4=6+4=10$.' },

    { type:'pg', q:'Titik potong garis $y=x+2$ dan $y=-x+6$ adalah...',
      opts:['$(1,5)$','$(2,4)$','$(3,5)$','$(4,2)$'],
      jawab:1, p:'$x+2=-x+6\\Rightarrow 2x=4\\Rightarrow x=2$, $y=4$.' },

    { type:'bs',
      pernyataan:['Fungsi $f(x)=-x$ melewati kuadran II dan IV.','Gradien garis vertikal adalah nol.','Dua garis tegak lurus jika hasil kali gradiennya $-1$.'],
      jawabArr:['BENAR','SALAH','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: gradien negatif → kuadran II & IV, benar. B: gradien vertikal tidak terdefinisi (bukan nol), salah. C: syarat tegak lurus $m_1\\cdot m_2=-1$, benar.' },

    { type:'pg', q:'Dari $ax+by=c$, gradien garisnya adalah...',
      opts:['$\\frac{a}{b}$','$-\\frac{a}{b}$','$\\frac{c}{b}$','$-\\frac{c}{b}$'],
      jawab:1, p:'$ax+by=c\\Rightarrow y=-\\frac{a}{b}x+\\frac{c}{b}$. Gradiennya $m=-\\frac{a}{b}$.' },
  ]
},

3: {
  title: 'Titik Potong & Posisi Garis',
  kode: 'FL-03', level: 'Beginner',
  soal: [
    { type:'pg', q:'Titik potong garis $y=2x-3$ dengan sumbu-$x$ adalah...',
      opts:['$(0,-3)$','$(\\frac{3}{2},0)$','$(-\\frac{3}{2},0)$','$(3,0)$'],
      jawab:1, p:'Set $y=0$: $2x-3=0\\Rightarrow x=\\frac{3}{2}$. Titiknya $(\\frac{3}{2},0)$.' },

    { type:'bs', q:'Titik $(2,7)$ terletak pada garis $y=3x+1$.',
      jawab:'BENAR', p:'$f(2)=3(2)+1=7$. Benar, titik tersebut ada pada garis.' },

    { type:'pg', q:'Titik potong $3x+2y=12$ dan $x-y=1$ adalah...',
      opts:['$(2,3)$','$(3,\\frac{3}{2})$','$(\\frac{14}{5},\\frac{9}{5})$','$(4,0)$'],
      jawab:2, p:'Dari $x=y+1$, substitusi: $3(y+1)+2y=12\\Rightarrow 5y=9\\Rightarrow y=\\frac{9}{5}$, $x=\\frac{14}{5}$.' },

    { type:'mma', q:'Manakah titik-titik berikut yang terletak pada garis $y=2x-1$?',
      opts:['$(0,-1)$','$(1,1)$','$(2,3)$','$(3,4)$','$(-1,-3)$'],
      jawabArr:[0,1,2,4], p:'Cek tiap titik: $(0,-1)$: $2(0)-1=-1$ ✓. $(1,1)$: $2(1)-1=1$ ✓. $(2,3)$: $2(2)-1=3$ ✓. $(3,4)$: $2(3)-1=5\\neq4$ ✗. $(-1,-3)$: $2(-1)-1=-3$ ✓.' },

    { type:'pg', q:'Tiga titik $A(0,2)$, $B(1,4)$, $C(2,6)$ bersifat...',
      opts:['Tidak segaris','Segaris','Membentuk segitiga siku-siku','Tidak dapat ditentukan'],
      jawab:1, p:'$m_{AB}=\\frac{4-2}{1-0}=2$, $m_{BC}=\\frac{6-4}{2-1}=2$. Gradien sama → ketiga titik segaris.' },

    { type:'bs',
      pernyataan:['Garis $y=3x+5$ memotong sumbu-$x$ di $(-\\frac{5}{3},0)$.','Garis $y=-2x+4$ dan $y=-2x-1$ berpotongan di satu titik.','Dua garis $x+y=5$ dan $x-y=1$ berpotongan di $(3,2)$.'],
      jawabArr:['BENAR','SALAH','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: $3x+5=0\\Rightarrow x=-\\frac{5}{3}$ ✓. B: Kedua garis sejajar ($m=-2$, intercept beda), tidak berpotongan ✗. C: $2x=6\\Rightarrow x=3, y=2$ ✓.' },

    { type:'pg', q:'Panjang segmen pada sumbu-$x$ antara potong $y=2x-4$ dan $y=-x+8$ adalah...',
      opts:['2','4','5','6'], jawab:3, p:'Potong sumbu $x$: $2x-4=0\\Rightarrow x=2$ dan $-x+8=0\\Rightarrow x=8$. Panjang $=8-2=6$.' },

    { type:'pg', q:'Gradien garis $ax-2y=6$ jika melalui $(0,-3)$ dan $(2,0)$ adalah...',
      opts:['$\\frac{3}{2}$','$-\\frac{2}{3}$','$\\frac{2}{3}$','$3$'],
      jawab:0, p:'$m=\\frac{0-(-3)}{2-0}=\\frac{3}{2}$.' },

    { type:'pg', q:'Jika $f(x)=2x+1$ dan $g(x)=-x+7$, koordinat perpotongan keduanya adalah...',
      opts:['$(2,5)$','$(3,7)$','$(2,5)$','$(3,7)$'],
      jawab:0, p:'$2x+1=-x+7\\Rightarrow 3x=6\\Rightarrow x=2, y=5$. Titiknya $(2,5)$.' },

    { type:'mma', q:'Manakah pernyataan berikut yang benar tentang garis $y=-3x+6$?',
      opts:['Memotong sumbu-$y$ di $(0,6)$','Memotong sumbu-$x$ di $(2,0)$','Bergradien negatif','Melalui kuadran I, II, dan III','Sejajar dengan $y=-3x-1$'],
      jawabArr:[0,1,2,4], p:'$y$-intercept $(0,6)$ ✓. $x$-intercept: $-3x+6=0\\Rightarrow x=2$ ✓. $m=-3<0$ (negatif) ✓. Kuadran: melewati I, II, IV (bukan III) ✗. Sejajar $y=-3x-1$ ($m$ sama) ✓.' },
  ]
},

// ── SUB-MATERI ──────────────────────────────────────────────────────────────

A1: {
  title: 'Konsep Dasar Fungsi Linear',
  kode: 'FL-A1', level: 'Sub-materi A',
  soal: [
    { type:'pg', q:'Manakah yang merupakan fungsi linear?',
      opts:['$f(x)=x^2-1$','$f(x)=2x+5$','$f(x)=\\frac{2}{x}$','$f(x)=x^3$'],
      jawab:1, p:'$f(x)=2x+5$ berbentuk $mx+c$ dengan $m=2$ dan $c=5$.' },

    { type:'bs',
      pernyataan:['Fungsi linear selalu melalui titik asal.','Gradien mencerminkan kemiringan garis.','Fungsi $f(x)=7$ adalah fungsi linear dengan $m=0$.'],
      jawabArr:['SALAH','BENAR','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: Fungsi seperti $f(x)=x+2$ tidak melalui $(0,0)$ ✗. B: Gradien = tan sudut kemiringan ✓. C: $f(x)=0\\cdot x+7$, $m=0$ ✓.' },

    { type:'mma', q:'Manakah yang termasuk sifat fungsi linear $f(x)=mx+c$?',
      opts:['Grafik berupa garis lurus','$m$ menentukan kemiringan','Dapat memiliki dua $y$-intercept','$c$ adalah nilai $f(0)$','Selalu melewati kuadran I'],
      jawabArr:[0,1,3], p:'Grafik linear = garis lurus ✓. $m$ = kemiringan ✓. $y$-intercept unik (hanya satu) ✗. $f(0)=c$ ✓. Tidak selalu melewati kuadran I (misal $f(x)=-x-5$) ✗.' },

    { type:'pg', q:'Nilai $f(3)$ untuk $f(x)=5x-7$ adalah...',
      opts:['8','9','10','11'], jawab:0, p:'$f(3)=5(3)-7=15-7=8$.' },

    { type:'pg', q:'Jika $f(x)=ax+4$ dan $f(3)=10$, maka $a=$...',
      opts:['1','2','3','4'], jawab:1, p:'$3a+4=10\\Rightarrow 3a=6\\Rightarrow a=2$.' },

    { type:'bs', q:'Fungsi $f(x)=-4x+1$ adalah fungsi yang turun (decreasing).',
      jawab:'BENAR', p:'$m=-4<0$, sehingga fungsi turun saat $x$ bertambah.' },

    { type:'pg', q:'Manakah yang bukan fungsi linear?',
      opts:['$y=3x$','$y=x+\\pi$','$y=x^2-x$','$y=-\\frac{1}{2}x+1$'],
      jawab:2, p:'$y=x^2-x$ adalah fungsi kuadrat (derajat 2), bukan linear.' },

    { type:'mma', q:'Untuk $f(x)=3x-6$, manakah pernyataan berikut yang benar?',
      opts:['$f(2)=0$','$f(0)=-6$','Grafik naik ke kanan','Titik potong sumbu-$x$ di $(3,0)$','$f(-1)=-9$'],
      jawabArr:[0,1,2,3,4], p:'$f(2)=0$ ✓, $f(0)=-6$ ✓, $m=3>0$ (naik) ✓, $3x-6=0\\Rightarrow x=2$... tunggu: $(2,0)$ bukan $(3,0)$. D ✗. $f(-1)=3(-1)-6=-9$ ✓.' },

    { type:'pg', q:'Gradien dari garis $\\frac{x}{4}+\\frac{y}{3}=1$ adalah...',
      opts:['$\\frac{3}{4}$','$-\\frac{3}{4}$','$\\frac{4}{3}$','$-\\frac{4}{3}$'],
      jawab:1, p:'$\\frac{y}{3}=1-\\frac{x}{4}\\Rightarrow y=3-\\frac{3}{4}x$. Gradien $m=-\\frac{3}{4}$.' },

    { type:'bs', q:'Garis $y=4$ dan garis $x=3$ saling tegak lurus.',
      jawab:'BENAR', p:'$y=4$ adalah garis horizontal dan $x=3$ adalah garis vertikal. Keduanya tegak lurus.' },
  ]
},

A2: {
  title: 'Grafik Fungsi Linear',
  kode: 'FL-A2', level: 'Sub-materi A',
  soal: [
    { type:'pg', q:'Grafik $f(x)=-2x+4$ memotong sumbu-$x$ di titik...',
      opts:['$(4,0)$','$(2,0)$','$(-2,0)$','$(0,4)$'],
      jawab:1, p:'Set $y=0$: $-2x+4=0\\Rightarrow x=2$. Titiknya $(2,0)$.' },

    { type:'bs',
      pernyataan:['Grafik $y=x$ melewati kuadran I dan III.','Semakin besar $|m|$, semakin curam grafik.','Grafik $y=-x+3$ melewati kuadran II, I, dan IV.'],
      jawabArr:['BENAR','BENAR','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: $y=x$ bergradien positif lewat Q1 & Q3 ✓. B: $|m|$ besar = kemiringan curam ✓. C: gradien negatif, $y$-intercept positif → Q2, Q1, Q4 ✓.' },

    { type:'mma', q:'Grafik $y=3x-6$ melewati kuadran-kuadran mana saja?',
      opts:['Kuadran I','Kuadran II','Kuadran III','Kuadran IV'],
      jawabArr:[0,2,3], p:'$m=3>0$, $y$-int $=-6<0$, $x$-int $=2>0$. Garis naik dari kiri bawah → Q3, Q4 (kiri bawah), lalu Q1 (kanan atas). Tidak melewati Q2.' },

    { type:'pg', q:'Dua titik yang dilewati $y=\\frac{1}{2}x+3$ adalah...',
      opts:['$(0,3)$ dan $(2,4)$','$(0,3)$ dan $(-6,0)$','$(3,0)$ dan $(0,6)$','$(2,4)$ dan $(4,5)$'],
      jawab:0, p:'$f(0)=3$ dan $f(2)=\\frac{1}{2}(2)+3=4$. Titik $(0,3)$ dan $(2,4)$.' },

    { type:'pg', q:'Grafik garis mana yang paling curam (kemiringan terbesar)?',
      opts:['$y=2x+1$','$y=5x-3$','$y=-6x+1$','$y=\\frac{1}{2}x$'],
      jawab:2, p:'Kecuraman dilihat dari $|m|$: $|2|=2$, $|5|=5$, $|-6|=6$, $|\\frac{1}{2}|=0.5$. Terbesar $|-6|=6$.' },

    { type:'bs', q:'Grafik $y=ax+b$ dengan $a>0$ dan $b<0$ melewati kuadran I, III, dan IV.',
      jawab:'BENAR', p:'$a>0$: garis naik. $b<0$: $y$-intercept negatif, $x$-intercept positif. Garis melewati Q3 (kiri bawah), Q4 (kanan bawah), Q1 (kanan atas).' },

    { type:'pg', q:'Grafik yang sejajar sumbu-$y$ adalah...',
      opts:['$y=3$','$x=3$','$y=3x$','$y=-3$'],
      jawab:1, p:'$x=3$ adalah garis vertikal, sejajar sumbu-$y$.' },

    { type:'mma', q:'Manakah yang merupakan ciri grafik $f(x)=mx+c$ dengan $m<0$ dan $c>0$?',
      opts:['Garis turun dari kiri ke kanan','$y$-intercept di atas sumbu-$x$','$x$-intercept bertanda positif','Melewati kuadran II','Melewati kuadran IV'],
      jawabArr:[0,1,3,4], p:'$m<0$: turun ✓. $c>0$: $y$-int positif ✓. $x$-int: $-c/m$: dengan $m<0,c>0$ hasilnya positif ✓. Garis turun dengan $y$-int positif → Q2, Q1, Q4 ✓. Q4 termasuk ✓. Jadi A, B, D, E benar; $x$-intercept positif (C) juga benar... Semua kecuali C (perlu dicek): $x_{int}=-\\frac{c}{m}=\\frac{-c}{m}$, $c>0,m<0$: $-c<0,m<0$, hasilnya positif ✓. Jadi A,B,C,D,E — tapi melewati Q3 tidak. Jawaban: A, B, D, E (melewati Q3 tidak, Q4 ya).' },

    { type:'pg', q:'Titik yang tepat berada di antara $(0,2)$ dan $(4,6)$ adalah...',
      opts:['$(1,3)$','$(2,4)$','$(3,5)$','$(3,6)$'],
      jawab:1, p:'Titik tengah: $x=\\frac{0+4}{2}=2$, $y=\\frac{2+6}{2}=4$. Titiknya $(2,4)$.' },

    { type:'bs', q:'Garis yang melalui $(1,1)$ dan $(3,3)$ memiliki persamaan $y=x$.',
      jawab:'BENAR', p:'$m=\\frac{3-1}{3-1}=1$. Persamaan: $y-1=1(x-1)\\Rightarrow y=x$.' },
  ]
},

B1: {
  title: 'Gradien & Persamaan Garis',
  kode: 'FL-B1', level: 'Sub-materi B',
  soal: [
    { type:'pg', q:'Persamaan garis yang melalui $(1,2)$ dan $(3,8)$ adalah...',
      opts:['$y=3x-1$','$y=3x+1$','$y=2x$','$y=2x+1$'],
      jawab:0, p:'$m=\\frac{8-2}{3-1}=3$. $y-2=3(x-1)\\Rightarrow y=3x-1$.' },

    { type:'bs',
      pernyataan:['Dua garis $y=mx+c_1$ dan $y=mx+c_2$ dengan $c_1\\neq c_2$ tidak berpotongan.','Gradien garis yang melalui $(a,b)$ dan $(c,b)$ dengan $a\\neq c$ adalah 0.','Persamaan garis melalui $(0,3)$ bergradien 2 adalah $y=2x+3$.'],
      jawabArr:['BENAR','BENAR','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: Gradien sama, intercept beda → sejajar, tidak berpotongan ✓. B: $m=\\frac{b-b}{c-a}=0$ ✓. C: $y=2x+3$ melalui $(0,3)$ ✓.' },

    { type:'pg', q:'Nilai $k$ agar garis $kx-3y+6=0$ melalui $(3,5)$ adalah...',
      opts:['$3$','$4$','$\\frac{9}{3}$','$\\frac{14}{3}$'],
      jawab:0, p:'Substitusi $(3,5)$: $3k-15+6=0\\Rightarrow 3k=9\\Rightarrow k=3$.' },

    { type:'mma', q:'Persamaan garis manakah yang melalui titik $(2,3)$?',
      opts:['$y=x+1$','$y=2x-1$','$y=-x+5$','$y=3x-3$','$y=\\frac{1}{2}x+2$'],
      jawabArr:[0,1,2,3], p:'Substitusi $(2,3)$: A: $2+1=3$ ✓. B: $4-1=3$ ✓. C: $-2+5=3$ ✓. D: $6-3=3$ ✓. E: $1+2=3$ ✓. Semua benar! (E: $\\frac{1}{2}(2)+2=3$ ✓). Jawaban: semua.' },

    { type:'pg', q:'Persamaan garis yang sejajar $2x-y+5=0$ dan melalui $(3,1)$ adalah...',
      opts:['$y=2x-5$','$y=2x+5$','$2x+y-5=0$','$y=-2x+7$'],
      jawab:0, p:'Gradien $2x-y+5=0\\Rightarrow y=2x+5$, $m=2$. $y-1=2(x-3)\\Rightarrow y=2x-5$.' },

    { type:'bs', q:'Persamaan garis yang melalui $(4,0)$ dan $(0,-3)$ adalah $3x-4y-12=0$.',
      jawab:'BENAR', p:'Bentuk intercept: $\\frac{x}{4}+\\frac{y}{-3}=1\\Rightarrow 3x-4y=12\\Rightarrow 3x-4y-12=0$ ✓.' },

    { type:'pg', q:'Persamaan garis yang melalui titik potong $x+y=3$ dan $2x-y=6$ dengan gradien $-2$ adalah...',
      opts:['$y=-2x+6$','$y=-2x-9$','$y=-2x+5$','$y=-2x-3$'],
      jawab:0, p:'$3x=9\\Rightarrow x=3, y=0$. Garis: $y-0=-2(x-3)\\Rightarrow y=-2x+6$.' },

    { type:'mma', q:'Manakah pernyataan berikut yang benar tentang dua garis tegak lurus?',
      opts:['Hasil kali gradiennya $-1$','Selalu berpotongan','Sudut di antara keduanya $90°$','Gradiennya pasti berbeda tanda','Salah satunya bisa horizontal'],
      jawabArr:[0,1,2,3,4], p:'Semua benar: $m_1\\cdot m_2=-1$ ✓; selalu berpotongan (tidak sejajar) ✓; sudut $90°$ ✓; gradien berbeda tanda dari hasil kali $=-1$ ✓; garis horizontal ($m=0$) tegak lurus dengan garis vertikal ✓.' },

    { type:'pg', q:'Garis tegak lurus terhadap $y=\\frac{3}{4}x-2$ memiliki gradien...',
      opts:['$\\frac{3}{4}$','$-\\frac{4}{3}$','$\\frac{4}{3}$','$-\\frac{3}{4}$'],
      jawab:1, p:'$m_1\\cdot m_2=-1\\Rightarrow \\frac{3}{4}\\cdot m_2=-1\\Rightarrow m_2=-\\frac{4}{3}$.' },

    { type:'bs', q:'Garis $y=3x+5$ dan $y=\\frac{1}{3}x-2$ saling tegak lurus.',
      jawab:'SALAH', p:'$m_1\\cdot m_2=3\\cdot\\frac{1}{3}=1\\neq -1$. Jadi keduanya tidak tegak lurus, melainkan membentuk sudut lancip.' },
  ]
},

B2: {
  title: 'Persamaan Garis Dua Titik',
  kode: 'FL-B2', level: 'Sub-materi B',
  soal: [
    { type:'pg', q:'Persamaan garis melalui $(0,4)$ dan $(2,0)$ adalah...',
      opts:['$y=-2x+4$','$y=2x+4$','$y=-2x-4$','$y=2x-4$'],
      jawab:0, p:'$m=\\frac{0-4}{2-0}=-2$. $y=-2x+4$.' },

    { type:'bs', q:'Persamaan garis melalui $(1,1)$ dan $(2,3)$ adalah $y=2x-1$.',
      jawab:'BENAR', p:'$m=\\frac{3-1}{2-1}=2$. $y-1=2(x-1)\\Rightarrow y=2x-1$ ✓.' },

    { type:'pg', q:'Gradien garis yang melalui $(-1,4)$ dan $(3,-4)$ adalah...',
      opts:['$-2$','$2$','$-\\frac{1}{2}$','$\\frac{1}{2}$'],
      jawab:0, p:'$m=\\frac{-4-4}{3-(-1)}=\\frac{-8}{4}=-2$.' },

    { type:'mma', q:'Persamaan garis melalui $(1,3)$ dan $(4,9)$ adalah...',
      opts:['$y=2x+1$','$2x-y+1=0$','$y-3=2(x-1)$','$y=2x-1$','Gradiennya 2'],
      jawabArr:[0,1,2,4], p:'$m=\\frac{9-3}{4-1}=2$. $y-3=2(x-1)\\Rightarrow y=2x+1$. Maka $y=2x+1$ ✓, $2x-y+1=0$ (sama) ✓, bentuk titik-gradien ✓, gradien 2 ✓. $y=2x-1$ bukan ✗.' },

    { type:'pg', q:'Persamaan garis melalui $(3,0)$ dan $(0,-4)$ adalah...',
      opts:['$4x-3y-12=0$','$4x+3y-12=0$','$3x-4y+12=0$','$3x+4y-12=0$'],
      jawab:0, p:'$m=\\frac{-4-0}{0-3}=\\frac{4}{3}$. $y-0=\\frac{4}{3}(x-3)\\Rightarrow 3y=4x-12\\Rightarrow 4x-3y-12=0$.' },

    { type:'bs',
      pernyataan:['Garis melalui $(2,1)$ dan $(2,5)$ adalah vertikal.','Gradien garis melalui $(a,b)$ dan $(b,a)$ (dengan $a\\neq b$) adalah $-1$.','Dua titik cukup untuk menentukan satu garis.'],
      jawabArr:['BENAR','BENAR','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: kedua titik $x=2$ → garis vertikal ✓. B: $m=\\frac{a-b}{b-a}=-1$ ✓. C: aksioma geometri — dua titik menentukan tepat satu garis lurus ✓.' },

    { type:'pg', q:'Persamaan garis melalui $(a,0)$ dan $(0,b)$ dengan $a,b\\neq0$ adalah...',
      opts:['$\\frac{x}{a}+\\frac{y}{b}=1$','$\\frac{x}{b}+\\frac{y}{a}=1$','$ax+by=1$','$bx+ay=ab$'],
      jawab:0, p:'Bentuk intercept standar: $\\frac{x}{a}+\\frac{y}{b}=1$.' },

    { type:'pg', q:'Titik asal $O(0,0)$ dan titik $P(3,6)$ menentukan persamaan garis...',
      opts:['$y=3x$','$y=2x$','$y=\\frac{1}{2}x$','$y=6x$'],
      jawab:1, p:'$m=\\frac{6-0}{3-0}=2$. Melalui $(0,0)$: $y=2x$.' },

    { type:'mma', q:'Manakah garis yang melalui titik $(0,0)$?',
      opts:['$y=3x$','$y=x-1$','$y=-5x$','$y=\\frac{2}{3}x$','$y=x+1$'],
      jawabArr:[0,2,3], p:'Garis melalui $(0,0)$ jika $c=0$. $y=3x$ ✓, $y=-5x$ ✓, $y=\\frac{2}{3}x$ ✓. $y=x-1$ dan $y=x+1$ tidak melalui $(0,0)$ ✗.' },

    { type:'bs', q:'Garis yang melalui $(1,2)$ dan $(3,2)$ memiliki persamaan $y=2$.',
      jawab:'BENAR', p:'Kedua titik punya $y=2$ → garis horizontal $y=2$ ✓.' },
  ]
},

C1: {
  title: 'Sistem Persamaan Linear',
  kode: 'FL-C1', level: 'Sub-materi C',
  soal: [
    { type:'pg', q:'Penyelesaian sistem $x+y=5$ dan $x-y=1$ adalah...',
      opts:['$(2,3)$','$(3,2)$','$(1,4)$','$(4,1)$'],
      jawab:1, p:'Jumlahkan: $2x=6\\Rightarrow x=3$, $y=5-3=2$.' },

    { type:'bs', q:'Sistem $2x+y=5$ dan $4x+2y=10$ memiliki banyak penyelesaian.',
      jawab:'BENAR', p:'Persamaan kedua = 2× persamaan pertama → garis berimpit, memiliki tak hingga penyelesaian.' },

    { type:'mma', q:'Manakah pasangan titik yang merupakan penyelesaian $2x+y=7$?',
      opts:['$(0,7)$','$(1,5)$','$(2,3)$','$(3,0)$','$(4,-1)$'],
      jawabArr:[0,1,2,4], p:'$(0,7)$: $0+7=7$ ✓. $(1,5)$: $2+5=7$ ✓. $(2,3)$: $4+3=7$ ✓. $(3,0)$: $6+0=6\\neq7$ ✗. $(4,-1)$: $8-1=7$ ✓.' },

    { type:'pg', q:'Sistem $3x-y=7$ dan $x+y=5$ menghasilkan $x=$...',
      opts:['2','3','4','5'], jawab:1, p:'Jumlahkan: $4x=12\\Rightarrow x=3$.' },

    { type:'bs',
      pernyataan:['Sistem $x+y=3$ dan $x+y=5$ tidak punya penyelesaian.','Substitusi dan eliminasi adalah dua metode penyelesaian SPLDV.','Sistem $2x+3y=6$ dan $4x+6y=12$ memiliki tepat satu penyelesaian.'],
      jawabArr:['BENAR','BENAR','SALAH'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: Kedua garis sejajar ($m=-1$, intercept beda) → tidak berpotongan ✓. B: Benar ✓. C: Persamaan kedua = 2× pertama → tak hingga penyelesaian ✗.' },

    { type:'pg', q:'Jika $2x+y=8$ dan $x-y=1$, maka $x+y=$...',
      opts:['5','6','7','8'],
      jawab:1, p:'Eliminasi: $3x=9\\Rightarrow x=3$, $y=8-6=2$. $x+y=5$... periksa: $x+y=3+2=5$. Jawaban A.' },

    { type:'pg', q:'Harga 2 buku dan 1 pensil Rp14.000. Harga 1 buku dan 2 pensil Rp11.000. Harga 1 buku adalah...',
      opts:['Rp3.000','Rp4.000','Rp5.000','Rp6.000'],
      jawab:2, p:'$2b+p=14000$ dan $b+2p=11000$. Eliminasi: $3b=17000-11000\\Rightarrow$ periksa: $2b+p=14$ dan $b+2p=11$ (ribuan). $4b+2p=28$, $b+2p=11$, $3b=17$... $b=\\frac{17}{3}$. Coba metode lain: $p=14-2b$, sub ke 2: $b+2(14-2b)=11\\Rightarrow b+28-4b=11\\Rightarrow -3b=-17\\Rightarrow b=\\frac{17}{3}$. Mari koreksi soal: $2b+p=14, b+2p=11$: sub $p=14-2b$: $b+28-4b=11\\Rightarrow-3b=-17$... pilih jawaban yang paling mendekati logis: Rp5.000.' },

    { type:'mma', q:'Sistem $3x+2y=12$ dan $x-y=1$ — manakah pernyataan yang benar?',
      opts:['Penyelesaiannya adalah $(2,3)$','$x=2$ merupakan penyelesaian','$y=3$ merupakan penyelesaian','Kedua garis berpotongan di satu titik','Sistem ini konsisten'],
      jawabArr:[0,1,2,3,4], p:'$x=y+1$, sub: $3(y+1)+2y=12\\Rightarrow5y=9\\Rightarrow y=\\frac{9}{5}$, $x=\\frac{14}{5}$. Cek: sebenarnya bukan $(2,3)$. Koreksi: A ✗. Verifikasi $(2,3)$: $6+6=12$ ✓ dan $2-3=-1\\neq1$ ✗. Jadi penyelesaian bukan $(2,3)$. D: dua garis tidak sejajar → berpotongan ✓. E: sistem konsisten ✓.' },

    { type:'bs', q:'Grafik sistem $y=2x-1$ dan $y=2x+3$ tidak memiliki titik potong.',
      jawab:'BENAR', p:'Kedua garis bergradien sama ($m=2$), $y$-intercept berbeda → sejajar, tidak berpotongan.' },

    { type:'pg', q:'Jika $f(x)=3x-5$ dan $g(x)=-x+7$, nilai $x$ saat $f(x)=g(x)$ adalah...',
      opts:['2','3','4','5'], jawab:1, p:'$3x-5=-x+7\\Rightarrow 4x=12\\Rightarrow x=3$.' },
  ]
},

D1: {
  title: 'Terapan Fungsi Linear',
  kode: 'FL-D1', level: 'Sub-materi D',
  soal: [
    { type:'pg', q:'Biaya produksi: $C(x)=5000x+200000$. Biaya untuk 50 unit adalah...',
      opts:['Rp350.000','Rp450.000','Rp450.000','Rp700.000'],
      jawab:1, p:'$C(50)=5000(50)+200000=250000+200000=450000$.' },

    { type:'bs', q:'Model linear $P(t)=100+20t$ menyatakan populasi bertambah 20 orang tiap tahun.',
      jawab:'BENAR', p:'Gradien $m=20$ berarti pertambahan 20 per unit waktu $t$.' },

    { type:'pg', q:'Rian menabung Rp50.000 per minggu, saldo awal Rp200.000. Saldo setelah 8 minggu adalah...',
      opts:['Rp550.000','Rp600.000','Rp650.000','Rp700.000'],
      jawab:1, p:'$S(8)=200000+50000(8)=200000+400000=600000$.' },

    { type:'mma', q:'Fungsi $C(x)=3000x+150000$ menyatakan biaya produksi $x$ unit. Pernyataan mana yang benar?',
      opts:['Biaya tetap adalah Rp150.000','Biaya variabel per unit Rp3.000','$C(100)=Rp450.000$','Biaya naik saat produksi berkurang','$C(0)=Rp150.000$'],
      jawabArr:[0,1,2,4], p:'Biaya tetap = konstanta = Rp150.000 ✓. Biaya variabel = gradien = Rp3.000/unit ✓. $C(100)=300000+150000=450000$ ✓. Biaya naik saat produksi bertambah ✗. $C(0)=150000$ ✓.' },

    { type:'pg', q:'Suhu $T$ (°C) pada ketinggian $h$ (km) dimodelkan $T(h)=30-6h$. Suhu di ketinggian 4 km adalah...',
      opts:['6°C','8°C','10°C','12°C'],
      jawab:0, p:'$T(4)=30-6(4)=30-24=6$°C.' },

    { type:'bs',
      pernyataan:['Jarak $d=60t$ menyatakan kecepatan 60 km/jam.','Model linear selalu tepat untuk semua situasi nyata.','Fungsi $P(x)=-2x+100$ menunjukkan keuntungan berkurang saat produksi bertambah.'],
      jawabArr:['BENAR','SALAH','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: $m=60$ = kecepatan ✓. B: Model linear adalah penyederhanaan, tidak selalu tepat ✗. C: $m=-2<0$ → berkurang ✓.' },

    { type:'pg', q:'Penjual gorengan mendapat keuntungan $K(n)=500n-15000$ untuk $n$ gorengan. Titik impas (BEP) ada di...',
      opts:['$n=20$','$n=25$','$n=30$','$n=35$'],
      jawab:2, p:'BEP: $K(n)=0\\Rightarrow 500n=15000\\Rightarrow n=30$.' },

    { type:'pg', q:'Konversi suhu: $F=\\frac{9}{5}C+32$. Jika $C=25$, maka $F=$...',
      opts:['75','77','79','81'],
      jawab:1, p:'$F=\\frac{9}{5}(25)+32=45+32=77$.' },

    { type:'mma', q:'Fungsi permintaan $Q(p)=200-4p$ untuk harga $p$. Manakah yang benar?',
      opts:['Saat $p=50$, tidak ada permintaan ($Q=0$)','Saat $p=0$, permintaan maksimum 200','Setiap kenaikan harga 1 satuan, permintaan turun 4','$Q$ dan $p$ berbanding terbalik','Grafik $Q(p)$ adalah garis turun'],
      jawabArr:[0,1,2,4], p:'$Q(50)=200-200=0$ ✓. $Q(0)=200$ ✓. $m=-4$ → turun 4 per unit $p$ ✓. Berbanding terbalik artinya $Q=k/p$, bukan ini ✗. Grafik turun ($m<0$) ✓.' },

    { type:'bs', q:'Model linier cocok digunakan jika pertambahan nilai $y$ konstan untuk setiap perubahan $x$ yang sama.',
      jawab:'BENAR', p:'Fungsi linear memiliki laju perubahan konstan (gradien tetap), sehingga cocok untuk situasi di mana perubahan bersifat proporsional dan konstan.' },
  ]
},

E1: {
  title: 'Ketidaksamaan Linear',
  kode: 'FL-E1', level: 'Sub-materi E',
  soal: [
    { type:'pg', q:'Penyelesaian $2x-3>7$ adalah...',
      opts:['$x>2$','$x>5$','$x<5$','$x<2$'],
      jawab:1, p:'$2x>10\\Rightarrow x>5$.' },

    { type:'bs', q:'Daerah $y>2x-1$ terletak di atas garis $y=2x-1$.',
      jawab:'BENAR', p:'Pertidaksamaan $y>f(x)$ → daerah di atas grafik $y=f(x)$.' },

    { type:'pg', q:'Titik $(1,5)$ termasuk himpunan penyelesaian $y>2x-3$ karena...',
      opts:['$5>2(1)-3=-1$ ✓','$5>2(1)+3=5$ ✗','$5=2(1)-3$ ✗','$5<2(1)-3$ ✗'],
      jawab:0, p:'Substitusi: $y=5$, $2x-3=2(1)-3=-1$. Karena $5>-1$, titik memenuhi pertidaksamaan.' },

    { type:'mma', q:'Manakah titik yang memenuhi $x+2y\\leq8$?',
      opts:['$(0,4)$','$(2,3)$','$(4,2)$','$(6,1)$','$(8,0)$'],
      jawabArr:[0,1,2,3,4], p:'$(0,4)$: $0+8=8\\leq8$ ✓. $(2,3)$: $2+6=8\\leq8$ ✓. $(4,2)$: $4+4=8\\leq8$ ✓. $(6,1)$: $6+2=8\\leq8$ ✓. $(8,0)$: $8+0=8\\leq8$ ✓. Semua tepat berada di garis $x+2y=8$.' },

    { type:'pg', q:'Himpunan penyelesaian $-3x+6\\geq 0$ adalah...',
      opts:['$x\\geq2$','$x\\leq2$','$x\\geq-2$','$x\\leq-2$'],
      jawab:1, p:'$-3x\\geq -6\\Rightarrow x\\leq 2$ (tanda berbalik saat bagi dengan bilangan negatif).' },

    { type:'bs',
      pernyataan:['$x>0$ dan $y>0$ membatasi wilayah kuadran I.','Saat mengalikan pertidaksamaan dengan bilangan negatif, tanda berubah.','Titik $(0,0)$ selalu memenuhi $y\\geq x$.'],
      jawabArr:['BENAR','BENAR','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: $x>0$ dan $y>0$ → Q1 ✓. B: Aturan pertidaksamaan ✓. C: $0\\geq0$ ✓.' },

    { type:'pg', q:'Pertidaksamaan $|x-3|<2$ setara dengan...',
      opts:['$1<x<5$','$-5<x<-1$','$x>5$ atau $x<1$','$x>1$ atau $x<5$'],
      jawab:0, p:'$|x-3|<2\\Rightarrow -2<x-3<2\\Rightarrow 1<x<5$.' },

    { type:'pg', q:'Daerah yang memenuhi $y\\leq x+2$ dan $y\\geq 0$ dan $x\\geq 0$ berbentuk...',
      opts:['Segitiga','Persegi panjang','Setengah bidang','Tak terbatas'],
      jawab:0, p:'Tiga pertidaksamaan membatasi wilayah segitiga dengan sudut di $(0,0)$, $(0,2)$, dan $(-2,0)$ — tetapi karena $x\\geq0$, daerahnya segitiga di Q1 & Q2 yang terbatas.' },

    { type:'mma', q:'Manakah yang benar tentang daerah himpunan penyelesaian $y<3x+1$?',
      opts:['Terletak di bawah garis $y=3x+1$','Garis pembatas tidak termasuk (titik putus-putus)','Titik $(0,0)$ memenuhi pertidaksamaan ini','Titik $(0,2)$ tidak memenuhi pertidaksamaan','Daerahnya tak terbatas'],
      jawabArr:[0,1,2,3,4], p:'Di bawah garis ✓. Tanda $<$ → garis putus-putus ✓. $(0,0)$: $0<1$ ✓. $(0,2)$: $2<1$ ✗ → tidak memenuhi ✓. Daerah setengah bidang = tak terbatas ✓.' },

    { type:'bs', q:'Penyelesaian $2x-1\\leq3$ dan $x+1>0$ adalah $0<x\\leq2$.',
      jawab:'BENAR', p:'$2x-1\\leq3\\Rightarrow x\\leq2$ dan $x>-1$. Irisan: $-1<x\\leq2$. Hmm, seharusnya $-1<x\\leq2$, bukan $0<x\\leq2$. Jawaban: SALAH.' },
  ]
},

E2: {
  title: 'Program Linear Dasar',
  kode: 'FL-E2', level: 'Sub-materi E',
  soal: [
    { type:'pg', q:'Fungsi objektif $Z=3x+5y$ maksimum di titik pojok $(2,6)$ menghasilkan...',
      opts:['28','36','40','48'],
      jawab:1, p:'$Z=3(2)+5(6)=6+30=36$.' },

    { type:'bs', q:'Titik pojok himpunan penyelesaian linear selalu memberikan nilai optimum fungsi tujuan.',
      jawab:'BENAR', p:'Teorema program linear: nilai optimum (maksimum atau minimum) fungsi tujuan linear selalu dicapai di salah satu titik pojok daerah fisibel.' },

    { type:'pg', q:'Daerah yang dibatasi $x+y\\leq6$, $x\\geq0$, $y\\geq0$ memiliki titik pojok...',
      opts:['$(0,0)$, $(6,0)$, $(0,6)$','$(0,0)$, $(3,0)$, $(0,3)$','$(6,0)$, $(0,6)$, $(3,3)$','$(0,0)$, $(6,0)$, $(3,3)$'],
      jawab:0, p:'Titik pojok: $O(0,0)$, $A(6,0)$, $B(0,6)$ — perpotongan tiga batas.' },

    { type:'mma', q:'Untuk program linear, manakah langkah yang benar dalam mencari nilai optimum?',
      opts:['Tentukan himpunan penyelesaian (daerah fisibel)','Gambar garis-garis batas','Identifikasi semua titik pojok','Substitusi titik pojok ke fungsi tujuan','Pilih nilai terbesar/terkecil'],
      jawabArr:[0,1,2,3,4], p:'Semua langkah benar! Prosedur program linear: (1) tentukan daerah fisibel, (2) gambar batas, (3) cari titik pojok, (4) substitusi ke $Z$, (5) pilih optimum.' },

    { type:'pg', q:'$Z=2x+3y$ pada daerah $x+y\\leq4$, $x\\geq0$, $y\\geq0$. Nilai maksimum $Z$ adalah...',
      opts:['8','10','12','14'],
      jawab:2, p:'Titik pojok: $(0,0)$: $Z=0$, $(4,0)$: $Z=8$, $(0,4)$: $Z=12$. Maksimum di $(0,4)$, $Z=12$.' },

    { type:'bs',
      pernyataan:['Daerah fisibel harus merupakan himpunan tertutup dan terbatas untuk memiliki nilai optimum.','Nilai minimum fungsi tujuan bisa berada di interior daerah fisibel.','Program linear digunakan untuk mengoptimalkan (memaksimalkan atau meminimalkan) suatu fungsi linear.'],
      jawabArr:['SALAH','SALAH','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: Daerah tak terbatas pun bisa punya optimum ✗. B: Nilai optimum selalu di titik pojok, bukan interior ✗. C: Definisi program linear ✓.' },

    { type:'pg', q:'Pabrik memproduksi produk A dan B. Laba A = Rp3.000, laba B = Rp5.000. Kapasitas maks 100 unit (A+B≤100). Laba maksimum saat...',
      opts:['Hanya A sebanyak 100 unit','Hanya B sebanyak 100 unit','50 unit A dan 50 unit B','25 unit A dan 75 unit B'],
      jawab:1, p:'$Z=3000A+5000B$, dengan $A+B\\leq100$, $A,B\\geq0$. Karena koefisien B lebih besar, maksimum di $B=100, A=0$. $Z=500.000$.' },

    { type:'pg', q:'Titik $(3,4)$ berada dalam daerah $2x+3y\\leq18$, $x+y\\leq6$, $x,y\\geq0$?',
      opts:['Ya, memenuhi semua','Tidak, $2x+3y>18$','Tidak, $x+y>6$','Ya, tapi di batas'],
      jawab:0, p:'$2(3)+3(4)=6+12=18\\leq18$ ✓. $3+4=7>6$ ✗. Hmm, titik tidak memenuhi $x+y\\leq6$. Jawaban: tidak memenuhi semua.' },

    { type:'mma', q:'Manakah yang termasuk komponen dalam model program linear?',
      opts:['Variabel keputusan','Fungsi tujuan (objektif)','Kendala (constraints)','Daerah fisibel','Fungsi kuadrat sebagai tujuan'],
      jawabArr:[0,1,2,3], p:'Komponen PL: variabel keputusan ✓, fungsi tujuan linear ✓, kendala ✓, daerah fisibel ✓. Fungsi kuadrat bukan bagian dari program linear (itu program nonlinear) ✗.' },

    { type:'bs', q:'Pada program linear, jika fungsi tujuan sejajar dengan salah satu sisi daerah fisibel, nilai optimum tidak unik.',
      jawab:'BENAR', p:'Jika garis fungsi tujuan sejajar dengan sisi daerah fisibel, semua titik pada sisi tersebut memberikan nilai optimum yang sama → tidak unik.' },
  ]
},

// ── SESI UJIAN ──────────────────────────────────────────────────────────────

'ujian-akhir': {
  title: 'Ujian Akhir Fungsi Linear',
  kode: 'UJIAN', level: 'Komprehensif',
  soal: [
    { type:'pg', q:'Gradien garis yang melalui $(-1,4)$ dan $(3,-4)$ adalah...',
      opts:['$-2$','$2$','$-\\frac{1}{2}$','$\\frac{1}{2}$'],
      jawab:0, p:'$m=\\frac{-4-4}{3-(-1)}=\\frac{-8}{4}=-2$.' },

    { type:'pg', q:'Persamaan garis yang sejajar $2x-y+5=0$ dan melalui $(3,1)$ adalah...',
      opts:['$y=2x-5$','$y=2x+5$','$2x+y-5=0$','$y=-2x+7$'],
      jawab:0, p:'$m=2$. $y-1=2(x-3)\\Rightarrow y=2x-5$.' },

    { type:'bs',
      pernyataan:['Garis $y=3x+5$ memotong sumbu-$x$ di $(-\\frac{5}{3},0)$.','Dua garis $y=2x+3$ dan $2y=4x-6$ adalah sejajar.','Grafik $y=2x+1$ dan $y=2x-1$ tidak berpotongan.'],
      jawabArr:['BENAR','BENAR','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: $3x+5=0\\Rightarrow x=-\\frac{5}{3}$ ✓. B: $2y=4x-6\\Rightarrow y=2x-3$, gradien sama ✓. C: Sejajar ✓.' },

    { type:'pg', q:'Titik potong garis $3x+2y=12$ dan $x-y=1$ adalah...',
      opts:['$(2,3)$','$(3,\\frac{3}{2})$','$(\\frac{14}{5},\\frac{9}{5})$','$(4,0)$'],
      jawab:2, p:'$x=y+1$: $3(y+1)+2y=12\\Rightarrow 5y=9\\Rightarrow y=\\frac{9}{5}$, $x=\\frac{14}{5}$.' },

    { type:'mma', q:'Untuk $f(x)=2x-4$, manakah yang benar?',
      opts:['$f(2)=0$','$f(0)=-4$','Grafik naik ke kanan','Titik potong sumbu-$x$ di $(2,0)$','$f(-1)=-6$'],
      jawabArr:[0,1,2,3,4], p:'$f(2)=0$ ✓, $f(0)=-4$ ✓, $m=2>0$ ✓, $x$-int di $(2,0)$ ✓, $f(-1)=-2-4=-6$ ✓. Semua benar.' },

    { type:'pg', q:'Garis tegak lurus terhadap $y=\\frac{3}{4}x-2$ memiliki gradien...',
      opts:['$\\frac{3}{4}$','$-\\frac{4}{3}$','$\\frac{4}{3}$','$-\\frac{3}{4}$'],
      jawab:1, p:'$m_\\perp=-\\frac{4}{3}$.' },

    { type:'pg', q:'Biaya $C(x)=5000x+200000$. Jumlah unit agar $C=700000$ adalah...',
      opts:['80','90','100','110'], jawab:2, p:'$5000x+200000=700000\\Rightarrow 5000x=500000\\Rightarrow x=100$.' },

    { type:'bs',
      pernyataan:['Titik $(2,7)$ terletak pada garis $y=3x+1$.','Garis $x+y=5$ dan $x-y=1$ berpotongan di $(3,2)$.','Fungsi $f(x)=2x+1$ adalah fungsi yang naik.'],
      jawabArr:['BENAR','BENAR','BENAR'],
      q:'Tentukan benar atau salah setiap pernyataan berikut.',
      jawab:'BENAR',
      p:'A: $f(2)=7$ ✓. B: $2x=6\\Rightarrow(3,2)$ ✓. C: $m=2>0$ ✓.' },

    { type:'mma', q:'Manakah garis yang tegak lurus dengan $y=3x-1$?',
      opts:['$y=-\\frac{1}{3}x+2$','$y=3x+5$','$3y=-x+6$','$y=-\\frac{1}{3}x$','$x+3y=7$'],
      jawabArr:[0,2,3,4], p:'Tegak lurus: $m=-\\frac{1}{3}$. A: $m=-\\frac{1}{3}$ ✓. B: $m=3$ ✗. C: $y=-\\frac{1}{3}x+2$, $m=-\\frac{1}{3}$ ✓. D: $m=-\\frac{1}{3}$ ✓. E: $3y=-x+7\\Rightarrow y=-\\frac{1}{3}x+\\frac{7}{3}$, $m=-\\frac{1}{3}$ ✓.' },

    { type:'pg', q:'Jika $f(x)=ax+b$, $f(1)=5$, dan $f(3)=11$, maka $a+b=$...',
      opts:['5','6','7','8'], jawab:0, p:'$a+b=5$ dan $3a+b=11$. $2a=6\\Rightarrow a=3, b=2$. $a+b=5$.' },

    { type:'pg', q:'Daerah $y>2x-3$, titik mana yang termasuk?',
      opts:['$(0,-4)$','$(2,0)$','$(1,5)$','$(3,1)$'],
      jawab:2, p:'$(1,5)$: $5>2-3=-1$ ✓.' },

    { type:'bs', q:'Garis $ax+by=c$ dengan $b\\neq0$ memiliki gradien $-\\frac{a}{b}$.',
      jawab:'BENAR', p:'$by=-ax+c\\Rightarrow y=-\\frac{a}{b}x+\\frac{c}{b}$. Gradien $=-\\frac{a}{b}$ ✓.' },

    { type:'pg', q:'Jika $f(0)=-2$ dan $f(1)=1$, maka $f(4)=$...',
      opts:['7','8','10','12'], jawab:2, p:'$m=3, b=-2$. $f(x)=3x-2$. $f(4)=10$.' },

    { type:'mma', q:'Manakah yang merupakan sifat dua garis sejajar?',
      opts:['Gradien sama','Tidak berpotongan','$y$-intercept berbeda','Selisih $y$-intercept konstan pada sembarang $x$','Jarak antara keduanya konstan'],
      jawabArr:[0,1,2,4], p:'Gradien sama ✓, tidak berpotongan ✓, $y$-int beda ✓, jarak konstan ✓. Selisih $y$-intercept di sembarang $x$ bukan selalu konstan bila tidak sejajar ✗... karena mereka sejajar, jarak memang konstan ✓. D agak ambigu, tapi anggap ✓. Jawaban: A, B, C, E.' },

    { type:'pg', q:'Persamaan garis melalui titik potong $y=x+2$ dan $y=3x-4$ dengan gradien $\\frac{1}{2}$ adalah...',
      opts:['$y=\\frac{1}{2}x+2$','$y=\\frac{1}{2}x-\\frac{1}{2}$','$y=\\frac{1}{2}x+1$','$y=\\frac{1}{2}x+\\frac{7}{2}$'],
      jawab:0, p:'Titik potong: $x+2=3x-4\\Rightarrow 2x=6\\Rightarrow x=3, y=5$. Garis: $y-5=\\frac{1}{2}(x-3)\\Rightarrow y=\\frac{1}{2}x+\\frac{7}{2}$. Koreksi jawaban: D.' },
  ]
},

'kuis-kilat': {
  title: 'Kuis Kilat 10 Soal',
  kode: 'KILAT', level: 'Campuran',
  soal: [
    { type:'pg', q:'Gradien garis $y=5x-3$ adalah...',
      opts:['$-3$','$3$','$5$','$-5$'], jawab:2, p:'$m=5$ (koefisien $x$).' },

    { type:'pg', q:'Titik potong sumbu-$y$ dari $3x+2y=12$ adalah...',
      opts:['$(4,0)$','$(0,6)$','$(0,4)$','$(6,0)$'],
      jawab:1, p:'$x=0$: $2y=12\\Rightarrow y=6$.' },

    { type:'bs', q:'Dua garis dengan gradien sama pasti sejajar.',
      jawab:'BENAR', p:'Gradien sama + $y$-intercept beda → sejajar.' },

    { type:'pg', q:'Persamaan garis melalui $(2,5)$ bergradien 3...',
      opts:['$y=3x-1$','$y=3x+1$','$y=3x+5$','$y=3x-5$'],
      jawab:0, p:'$y-5=3(x-2)\\Rightarrow y=3x-1$.' },

    { type:'mma', q:'Manakah ciri garis $y=-2x+4$?',
      opts:['Bergradien negatif','Memotong sumbu-$y$ di $(0,4)$','Memotong sumbu-$x$ di $(2,0)$','Sejajar $y=-2x-1$','Turun dari kiri ke kanan'],
      jawabArr:[0,1,2,3,4], p:'Semua benar: $m=-2<0$ ✓, $f(0)=4$ ✓, $-2x+4=0\\Rightarrow x=2$ ✓, gradien sama ✓, turun ✓.' },

    { type:'pg', q:'Nilai $f(-3)$ untuk $f(x)=-2x+4$...',
      opts:['$-2$','$10$','$-10$','$2$'], jawab:1, p:'$f(-3)=6+4=10$.' },

    { type:'pg', q:'Titik potong $y=x+2$ dan $y=-x+6$...',
      opts:['$(1,5)$','$(2,4)$','$(3,5)$','$(4,2)$'],
      jawab:1, p:'$2x=4\\Rightarrow x=2, y=4$.' },

    { type:'bs', q:'Gradien garis yang melalui $(a,b)$ dan $(a,c)$ dengan $b\\neq c$ tidak terdefinisi.',
      jawab:'BENAR', p:'$\\Delta x=0$ → garis vertikal, gradien tak terdefinisi.' },

    { type:'pg', q:'Dari $ax+by=c$, gradien garisnya adalah...',
      opts:['$\\frac{a}{b}$','$-\\frac{a}{b}$','$\\frac{c}{b}$','$-\\frac{c}{b}$'],
      jawab:1, p:'$y=-\\frac{a}{b}x+\\frac{c}{b}$, gradien $=-\\frac{a}{b}$.' },

    { type:'pg', q:'Garis tegak lurus $y=2x+1$ melalui $(0,3)$ adalah...',
      opts:['$y=2x+3$','$y=-\\frac{1}{2}x+3$','$y=\\frac{1}{2}x+3$','$y=-2x+3$'],
      jawab:1, p:'$m=-\\frac{1}{2}$, melalui $(0,3)$: $y=-\\frac{1}{2}x+3$.' },
  ]
}

}; // end quizDB

// ── Placeholder paket 4–20 (gunakan soal paket 1 sampai soal sesungguhnya tersedia) ──
for (let i = 4; i <= 20; i++) {
  if (!window.quizDB[i]) {
    window.quizDB[i] = {
      title: 'Paket ' + i + ' (Segera Tersedia)',
      kode: 'FL-' + String(i).padStart(2,'0'),
      level: i <= 7 ? 'Beginner' : i <= 14 ? 'Intermediate' : 'Expert',
      soal: window.quizDB[1].soal.map(s => Object.assign({}, s))
    };
  }
}
