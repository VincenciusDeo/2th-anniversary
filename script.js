/* ============================================
   Anniversary Website JS
   - Section flow control
   - Audio crossfade
   - Animations
   ============================================ */

// ====== KONFIGURASI MUDAH DIUBAH ======
const TYPING_TEXT = "Aku punya sesuatu untuk kamu...";

// Pesan cinta panjang (BAGIAN 4) — ganti sesuai keinginan
const LOVE_LETTER = `Halo sayangku,

Dua tahun. Rasanya baru kemarin kita pertama bertemu, tapi rasanya juga sudah selamanya kita bersama.

Terima kasih sudah menjadi rumah saat aku lelah, menjadi pelangi saat hariku mendung, dan menjadi alasan untukku tersenyum setiap pagi.

Kamu tahu? Mencintaimu itu seperti hal paling mudah yang pernah aku lakukan. Semua yang kamu lakukan, sekecil apapun, selalu berhasil membuat hatiku hangat.

Aku tahu, perjalanan kita tidak selalu mulus. Ada tawa, ada tangis, ada salah paham — tapi kita selalu memilih untuk kembali, untuk saling memeluk, untuk tetap bertahan.

Di anniversary kedua ini, aku cuma ingin bilang: terima kasih sudah memilih aku, terus dan terus. Aku janji, akan terus berusaha jadi versi terbaikku — untukmu, untuk kita.

I love you, lebih dari kata-kata yang bisa aku tulis di sini.

Selamanya milikmu,
💖`;

// ====== TYPING ANIMATION (Bagian 0) ======
const typingEl = document.getElementById('typingText');
let typeIdx = 0;
function typeChar() {
  if (typeIdx <= TYPING_TEXT.length) {
    typingEl.textContent = TYPING_TEXT.slice(0, typeIdx++);
    setTimeout(typeChar, 80);
  } else {
    typingEl.style.borderRight = 'none';
  }
}
typeChar();

// ====== BG DECOR (floating hearts/sparkles) ======
const decor = document.getElementById('bgDecor');
const symbols = ['💖','✨','💕','⭐','🌸','💗'];
for (let i = 0; i < 18; i++) {
  const s = document.createElement('span');
  s.textContent = symbols[Math.floor(Math.random()*symbols.length)];
  s.style.left = Math.random()*100 + 'vw';
  s.style.animationDuration = (8 + Math.random()*10) + 's';
  s.style.animationDelay = (Math.random()*10) + 's';
  s.style.fontSize = (0.8 + Math.random()*1.4) + 'rem';
  decor.appendChild(s);
}

// ====== AUDIO CONTROL ======
const audios = [0,1,2,3,4,5].map(i => document.getElementById('audio-' + i));
audios.forEach(a => { a.volume = 0; });
let muted = false;
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.textContent = muted ? '🔇' : '🔊';
  audios.forEach(a => a.muted = muted);
});

let currentAudio = null;
function playAudio(idx) {
  const target = audios[idx];
  // Fade out current
  if (currentAudio && currentAudio !== target) {
    fadeAudio(currentAudio, 0, 600, () => currentAudio.pause());
  }
  // Fade in target
  try {
    target.currentTime = target.currentTime || 0;
    const p = target.play();
    if (p && p.catch) p.catch(()=>{});
  } catch(e) {}
  fadeAudio(target, 0.5, 800);
  currentAudio = target;
}
function fadeAudio(audio, to, ms, cb) {
  const from = audio.volume;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / ms, 1);
    audio.volume = from + (to - from) * t;
    if (t < 1) requestAnimationFrame(step);
    else if (cb) cb();
  }
  requestAnimationFrame(step);
}

// ====== SECTION NAVIGATION ======
const sections = document.querySelectorAll('.section');
function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const idx = parseInt(id.split('-')[1], 10);
  playAudio(idx);

  // trigger section-specific animations
  if (id === 'section-1') triggerStory();
  if (id === 'section-3') triggerUniverse();
  if (id === 'section-4') triggerLetter();
  if (id === 'section-5') triggerConfetti();
}

document.getElementById('startBtn').addEventListener('click', () => {
  // unlock audio (user gesture)
  audios.forEach(a => { a.muted = false; });
  showSection('section-1');
});

document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.dataset.next;
    if (next) showSection(next);
  });
});

document.getElementById('surpriseBtn').addEventListener('click', () => {
  showSection('section-5');
});

// ====== BAGIAN 1: STORY REVEAL ======
function triggerStory() {
  const blocks = document.querySelectorAll('#section-1 .story-block');
  blocks.forEach((b, i) => {
    setTimeout(() => b.classList.add('show'), 400 + i * 700);
  });
}

// ====== BAGIAN 3: UNIVERSE ======
function triggerUniverse() {
  const sec = document.getElementById('section-3');
  // generate stars bg once
  const bg = document.getElementById('starsBg');
  if (!bg.children.length) {
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random()*100 + '%';
      s.style.top = Math.random()*100 + '%';
      s.style.animationDelay = (Math.random()*3) + 's';
      bg.appendChild(s);
    }
  }
  sec.classList.remove('merged','show-text-1','show-text-2');
  setTimeout(() => sec.classList.add('show-text-1'), 800);
  setTimeout(() => sec.classList.add('merged'), 2000);
  setTimeout(() => sec.classList.add('show-text-2'), 6500);
}

// ====== BAGIAN 4: LETTER (word by word) ======
function triggerLetter() {
  const el = document.getElementById('letterText');
  el.innerHTML = '';
  const words = LOVE_LETTER.split(/(\s+)/); // keep spaces/newlines
  words.forEach(w => {
    if (/\n/.test(w)) {
      el.appendChild(document.createElement('br'));
      return;
    }
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = w;
    el.appendChild(span);
  });
  const wordEls = el.querySelectorAll('.word');
  wordEls.forEach((w, i) => {
    setTimeout(() => w.classList.add('show'), i * 90);
  });
}

// ====== BAGIAN 5: CONFETTI ======
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#ff6fa3','#ffafcc','#ffc8dd','#e0c3fc','#ffd6c0','#fff'];
  const shapes = ['❤','💖','✨','●'];
  const parts = [];
  for (let i = 0; i < 140; i++) {
    parts.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      vy: 1 + Math.random() * 3,
      vx: -1 + Math.random() * 2,
      size: 10 + Math.random() * 18,
      color: colors[Math.floor(Math.random()*colors.length)],
      shape: shapes[Math.floor(Math.random()*shapes.length)],
      rot: Math.random() * 360,
      vr: -3 + Math.random() * 6
    });
  }
  let running = true;
  function tick() {
    if (!running) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random()*canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.font = p.size + 'px serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.shape, 0, 0);
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  tick();
  // stop after a while to save battery
  setTimeout(() => { running = false; ctx.clearRect(0,0,canvas.width,canvas.height); }, 12000);
}
