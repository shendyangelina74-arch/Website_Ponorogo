/* =========================================================
   PONOROGO HEBAT — script.js
   Menu hamburger, header scroll, reveal, counter, filter, playlist
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Hamburger menu ---------- */
  const header = $('#header');
  const burger = $('#burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  addEventListener('resize', () => innerWidth > 900 && setMenu(false));

  /* ---------- Header saat scroll ---------- */
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 20);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  $$('.reveal').forEach((el) => io.observe(el));

  /* ---------- Counter angka ---------- */
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const t0 = performance.now();
      const dur = 1600;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased).toLocaleString('id-ID') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counter.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => counter.observe(el));

  /* ---------- Filter wisata ---------- */
  const fbtns = $$('.fbtn');
  if (fbtns.length) {
    fbtns.forEach((btn) => btn.addEventListener('click', () => {
      fbtns.forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.filter;
      $$('.place').forEach((p) => {
        p.classList.toggle('hide', f !== 'all' && !p.dataset.cat.split(' ').includes(f));
      });
    }));
  }

  /* ---------- Playlist lagu (demo) ----------
     Isi atribut data-audio="assets/audio/nama.mp3" pada .track
     untuk memutar audio asli. Jika kosong, hanya animasi demo. */
  const tracks = $$('.track');
  let currentAudio = null;
  const stopAll = () => {
    tracks.forEach((t) => t.classList.remove('playing'));
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  };
  tracks.forEach((t) => {
    const btn = $('.play', t);
    const bar = $('.bar', t);
    btn.addEventListener('click', () => {
      const was = t.classList.contains('playing');
      stopAll();
      if (was) return;
      // restart animasi progress
      bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      t.classList.add('playing');
      const src = t.dataset.audio;
      if (src) {
        currentAudio = new Audio(src);
        currentAudio.play().catch(() => {});
        currentAudio.addEventListener('ended', stopAll);
      }
    });
    bar.addEventListener('animationend', () => { if (!t.dataset.audio) t.classList.remove('playing'); });
  });
})();
