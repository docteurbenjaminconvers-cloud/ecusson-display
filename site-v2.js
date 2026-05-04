// site-v2.js — Centre Esthétique Écusson v2 — bleu nuit + or, photos réelles

const e = React.createElement;
const F = React.Fragment;
const { useState, useEffect, useRef } = React;

/* ─────────────────────────── DATA ─────────────────────────── */

const TICKER_NEEDS = [
  "Épilation", "Rides du visage", "Regard fatigué", "Relâchement cutané",
  "Bouche pulpeuse", "Cernes & poches", "Rajeunissement", "Taches cutanées",
  "Rougeurs & vaisseaux", "Détatouage", "Vergetures", "Chute des cheveux"
];

const CENTRES = [
  {
    id: "montpellier",
    pill: "Montpellier",
    eyebrow: "Centre Esthétique Écusson",
    name: "Montpellier",
    img: "https://centreesthetiqueecusson.com/wp-content/uploads/2022/01/2-Arc-de-triomphe-OT-Montpellier-M.jpeg",
    desc: "Implanté en plein cœur du centre historique de Montpellier à deux pas de l'Arc de Triomphe, le Centre Esthétique Écusson Montpellier vous accueille dans un bel appartement haussmannien équipé des derniers appareils de médecine esthétique.",
    meta: "Une écoute attentive, des soins naturels, dans le respect de votre corps."
  },
  {
    id: "uzes",
    pill: "Uzès",
    eyebrow: "Centre Esthétique Écusson",
    name: "d'Uzès",
    img: "https://centreesthetiqueecusson.com/wp-content/uploads/2022/03/photo-centre-Uzes.jpg",
    desc: "Situé dans le centre historique d'Uzès, à deux pas du Duché et donnant directement sur la magnifique place aux Herbes, le Centre Esthétique Écusson d'Uzès vous accueille dans un petit écrin chaleureux et décoré avec goût.",
    meta: "Une équipe à l'écoute, des protocoles personnalisés, une expérience confidentielle."
  }
];

const SOINS_BENTO = [
  {
    title: "Pilosité & cheveux",
    icon: "sparkle",
    img: "https://centreesthetiqueecusson.com/wp-content/uploads/2021/12/istockphoto-939514608-612x612-1.jpg",
    items: ["Épilation", "Chute des cheveux"],
    span: 1
  },
  {
    title: "Visage",
    icon: "face",
    img: "https://centreesthetiqueecusson.com/wp-content/uploads/2021/12/istockphoto-1068356114-612x612-1.jpg",
    items: ["Relâchement cutané", "Bouche pulpeuse", "Rides du visage", "Rougeur ou vaisseaux", "Regard fatigué ou triste", "Rajeunissement du visage"],
    span: 2,
    pillFoot: true
  },
  {
    title: "Silhouette",
    icon: "body",
    img: "https://centreesthetiqueecusson.com/wp-content/uploads/2021/12/shape.jpg",
    items: ["Perdre la graisse — ventre, hanches, cuisses", "Se muscler", "Relâchement cutané", "Poitrine ou fesses qui tombent"],
    span: 1
  },
  {
    title: "Peau",
    icon: "drop",
    items: ["Rougeurs & vaisseaux", "Relâchement cutané", "Vergetures", "Taches cutanées", "Détatouage"],
    featured: true,
    span: 1
  },
  {
    title: "Intime",
    icon: "leaf",
    img: "https://centreesthetiqueecusson.com/wp-content/uploads/2021/12/intime.jpg",
    items: ["Atrophie & sécheresse intime"],
    span: 1
  }
];

const PARTNERS = [
  { name: "Lutronic", bold: true },
  { name: "Hydrafacial", bold: false },
  { name: "Candela", bold: true },
  { name: "BTL", bold: false },
  { name: "Cynosure", bold: true },
  { name: "Zimmer", bold: false },
  { name: "Aquapure", bold: true },
  { name: "Vital Injector", bold: false }
];

const GALLERY = [
  { soin: "Acide hyaluronique", zone: "Sillons nasogéniens", sessions: "1 séance" },
  { soin: "Lutronic Clarity 2", zone: "Aisselles", sessions: "6 séances" },
  { soin: "Peeling TCA", zone: "Visage complet", sessions: "3 séances" },
  { soin: "Toxine botulique", zone: "Front & glabelle", sessions: "1 séance" },
  { soin: "Laser pigmentaire", zone: "Mains — taches", sessions: "2 séances" },
  { soin: "Cryolipolyse", zone: "Flancs", sessions: "2 séances" }
];

/* ─────────────────────────── HOOK reveal ─────────────────────────── */

function useReveal() {
  useEffect(() => {
    let io;
    const SEL = '.reveal, .reveal-stagger, .clip-img';

    const setup = () => {
      // Tag all targets as pending (hidden) before observing
      const els = document.querySelectorAll(SEL);
      els.forEach(el => {
        if (!el.classList.contains('in')) el.classList.add('pending');
      });
      // Force layout, then observe on next frame so transitions/animations register cleanly
      requestAnimationFrame(() => {
        io = new IntersectionObserver((ents) => {
          ents.forEach(en => {
            if (en.isIntersecting) {
              en.target.classList.remove('pending');
              en.target.classList.add('in');
              io.unobserve(en.target);
            }
          });
        }, { threshold: 0.05, rootMargin: '0px 0px -3% 0px' });
        document.querySelectorAll(SEL).forEach(el => {
          if (!el.classList.contains('in')) io.observe(el);
        });
      });
    };

    // Run after React has mounted everything
    const t1 = setTimeout(setup, 50);

    // Watch for new nodes added later (centres/bento/gallery on first paint)
    const mo = new MutationObserver(() => {
      document.querySelectorAll(SEL).forEach(el => {
        if (!el.classList.contains('in') && !el.classList.contains('pending')) {
          el.classList.add('pending');
          if (io) io.observe(el);
        }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: anything still hidden after 1.5s gets revealed if in/near viewport
    const t2 = setTimeout(() => {
      document.querySelectorAll('.pending').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight + 200) {
          el.classList.remove('pending');
          el.classList.add('in');
        }
      });
    }, 1500);

    return () => { clearTimeout(t1); clearTimeout(t2); mo.disconnect(); if (io) io.disconnect(); };
  }, []);
}

/* ─────────────────────────── CURSOR ─────────────────────────── */

function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my, raf;
    const move = (ev) => {
      mx = ev.clientX; my = ev.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    const over = (ev) => {
      const t = ev.target;
      const hover = t.closest && t.closest('a, button, .bento-card, .gallery-card, .play-btn, input, select, textarea, .partner');
      if (ring.current) ring.current.classList.toggle('hover', !!hover);
      if (dot.current) dot.current.classList.toggle('hover', !!hover);
    };
    addEventListener('mousemove', move);
    addEventListener('mouseover', over);
    tick();
    return () => { removeEventListener('mousemove', move); removeEventListener('mouseover', over); cancelAnimationFrame(raf); };
  }, []);
  return e(F, null,
    e('div', { ref: ring, className: 'cursor-ring' }),
    e('div', { ref: dot, className: 'cursor-dot' })
  );
}

/* ─────────────────────────── HERO BG ─────────────────────────── */

function HeroBG() {
  const c = useRef(null);
  useEffect(() => {
    const canvas = c.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, w, h, parts = [];
    const DPR = Math.min(devicePixelRatio || 1, 2);
    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function init() {
      resize();
      const n = Math.floor((w*h)/24000);
      parts = Array.from({length:n}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.6+0.3,
        vx: (Math.random()-0.5)*0.1, vy: -(Math.random()*0.18+0.04),
        a: Math.random()*0.55+0.15, pa: Math.random()*Math.PI*2, ps: Math.random()*0.012+0.004
      }));
    }
    function draw() {
      ctx.clearRect(0,0,w,h);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pa += p.ps;
        if (p.y < -10) { p.y = h+10; p.x = Math.random()*w; }
        if (p.x < -10) p.x = w+10; if (p.x > w+10) p.x = -10;
        const a = p.a * (0.55 + Math.sin(p.pa)*0.45);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(232,199,122,${a})`; ctx.fill();
        if (p.r > 1) {
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
          ctx.fillStyle = `rgba(232,199,122,${a*0.08})`; ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    }
    init(); draw();
    const onR = () => init(); addEventListener('resize', onR);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onR); };
  }, []);
  return e('canvas', { ref: c });
}

/* ─────────────────────────── TICKER + NAV ─────────────────────────── */

function TopTicker() {
  const dup = [...TICKER_NEEDS, ...TICKER_NEEDS];
  return e('div', { className: 'top-ticker' },
    e('div', { className: 'tk-track' },
      [0, 1].map(k => e('span', { key: k },
        dup.map((t, i) => e(F, { key: i },
          e('a', { href: '#soins' }, t),
          e('span', { className: 'dot' })
        ))
      ))
    )
  );
}

function Nav({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 60);
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return e('div', { className: 'nav-wrap' },
    e('nav', { className: 'nav' + (scrolled ? ' scrolled' : '') },
      e('a', { href: '#top', className: 'logo' },
        e('div', { className: 'logo-mark-icon' }, 'É'),
        e('div', { className: 'logo-text' },
          e('span', { className: 'logo-name' }, 'Centre Esthétique'),
          e('span', { className: 'logo-sub' }, 'Écusson · Montpellier · Uzès')
        )
      ),
      e('ul', { className: 'nav-menu' },
        e('li', null, e('a', { href: '#centres' }, 'Centres')),
        e('li', null, e('a', { href: '#soins' }, 'Soins')),
        e('li', null, e('a', { href: '#tech' }, 'Technologies')),
        e('li', null, e('a', { href: '#dr' }, 'Dr Convers')),
        e('li', null, e('a', { href: '#gallery' }, 'Résultats'))
      ),
      e('button', { className: 'nav-cta', onClick: onBook },
        e('span', null, 'Prendre rendez-vous')
      )
    )
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero({ onBook }) {
  return e('section', { className: 'hero', id: 'top' },
    e('div', { className: 'hero-bg-canvas' }, e(HeroBG)),
    e('div', { className: 'hero-grid' }),
    e('div', { className: 'hero-content' },
      e('div', { className: 'eyebrow ico reveal' }, 'Centre de Médecine Esthétique & Laser'),
      e('h1', { className: 'h-display reveal', style: { marginTop: 32 } },
        e('span', { className: 'line' }, e('span', null, 'Centre Esthétique')),
        e('span', { className: 'line' }, e('span', { className: 'gold-grad' }, 'Écusson'))
      ),
      e('p', { className: 'lede hero-lede reveal' },
        "Les Centres Écusson, spécialisés dans la médecine esthétique et l'épilation laser, vous accueillent à Montpellier et à Uzès. Médecine esthétique, épilation laser médicalisée, remodelage corporel, soins d'embellissement du visage."
      ),
      e('div', { style: { display: 'flex', justifyContent: 'center' } },
        e('div', { className: 'hero-quote reveal' },
          "Retrouver l'harmonie pour se sentir bien dans son âge — telle est l'approche que nous vous proposons aux centres Écusson."
        )
      ),
      e('div', { className: 'hero-actions reveal' },
        e('button', { className: 'btn btn-gold', onClick: onBook },
          'Prendre rendez-vous ', e('span', { className: 'btn-arrow' })
        ),
        e('a', { className: 'btn btn-ghost', href: '#soins' },
          e('span', null, 'Découvrir les soins '),
          e('span', { className: 'btn-arrow' })
        )
      )
    ),
    e('div', { className: 'scroll-hint' }, 'Scroll')
  );
}

/* ─────────────────────────── CENTRES ─────────────────────────── */

function Centres() {
  return e('section', { className: 'section section-grid', id: 'centres' },
    e('div', { className: 'wrap', style: { position: 'relative', zIndex: 1 } },
      e('div', { className: 'reveal', style: { marginBottom: 80 } },
        e('div', { className: 'eyebrow', style: { marginBottom: 28 } }, '— Nos centres'),
        e('h2', { className: 'h-section' },
          'Nos centres de', e('br'),
          e('em', null, 'médecine esthétique')
        )
      ),
      e('div', { className: 'centres-grid' },
        CENTRES.map((c, i) => e('div', {
          key: c.id,
          className: 'centre-card' + (i === 0 ? ' shifted' : '')
        },
          e('div', { className: 'centre-img-wrap clip-img' },
            e('img', { src: c.img, alt: c.name, loading: 'lazy' }),
            e('div', { className: 'centre-img-overlay' }),
            e('div', { className: 'centre-pill' },
              e('span', { className: 'ping' }),
              e('span', null, c.pill)
            )
          ),
          e('div', { className: 'centre-body reveal' },
            e('div', { className: 'centre-eyebrow' }, c.eyebrow),
            e('h3', { className: 'centre-name' }, e('em', null, c.name)),
            e('p', { className: 'centre-desc' }, c.desc),
            e('p', { className: 'centre-meta' }, c.meta),
            e('a', { href: '#', className: 'centre-link' },
              'Prendre rendez-vous ', e('span', { className: 'btn-arrow' })
            )
          )
        ))
      )
    )
  );
}

/* ─────────────────────────── BENTO ─────────────────────────── */

function BentoIcon({ name }) {
  const icons = {
    sparkle: e('path', { d: 'M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z',
      fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
    face: e(F, null,
      e('circle', { cx: 12, cy: 12, r: 8, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
      e('circle', { cx: 9, cy: 10, r: 0.8, fill: 'currentColor' }),
      e('circle', { cx: 15, cy: 10, r: 0.8, fill: 'currentColor' }),
      e('path', { d: 'M9 14.5q3 2 6 0', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' })
    ),
    body: e('path', { d: 'M12 3a2 2 0 100 4 2 2 0 000-4zm-3 6h6l-1 7h-1v5h-2v-5h-1l-1-7z',
      fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }),
    drop: e('path', { d: 'M12 3c0 0-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z',
      fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }),
    leaf: e('path', { d: 'M5 19c10 0 14-4 14-14C9 5 5 9 5 19zm0 0L19 5',
      fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' })
  };
  return e('svg', { viewBox: '0 0 24 24', width: 24, height: 24 }, icons[name]);
}

function BentoCard({ soin }) {
  return e('div', {
    className: 'bento-card' + (soin.span === 2 ? ' span-2' : '') + (soin.featured ? ' featured' : ''),
  },
    soin.img && e('div', { className: 'bento-bg', style: { backgroundImage: `url(${soin.img})` } }),
    e('div', { className: 'bento-content' },
      !soin.featured && e('div', { className: 'bento-icon' }, e(BentoIcon, { name: soin.icon })),
      e('h3', null,
        soin.title,
        soin.featured && e(BentoIcon, { name: soin.icon })
      ),
      e('ul', { className: 'bento-list' },
        soin.items.map((it, i) => e('li', { key: i },
          e('a', { href: '#' },
            e('span', { className: 'caret' }, '›'),
            e('span', null, it)
          )
        ))
      ),
      e('a', { href: '#', className: 'bento-foot' + (soin.pillFoot ? ' pill' : '') },
        'Voir tous les soins ', e('span', { className: 'btn-arrow' })
      )
    )
  );
}

function Soins() {
  return e('section', { className: 'section section-grid', id: 'soins',
    style: { borderTop: '1px solid var(--line-soft)', background: 'var(--bg)' } },
    e('div', { className: 'wrap', style: { position: 'relative', zIndex: 1 } },
      e('div', { className: 'section-head-center reveal' },
        e('span', { className: 'eyebrow ico' }, '— Vos besoins'),
        e('h2', { className: 'h-section', style: { marginTop: 24 } },
          'Nos soins ', e('em', null, 'les plus pratiqués')
        )
      ),
      e('div', { className: 'bento reveal-stagger' },
        SOINS_BENTO.map((s, i) => e(BentoCard, { key: i, soin: s }))
      ),
      e('div', { style: { marginTop: 64, display: 'flex', justifyContent: 'center' }, className: 'reveal' },
        e('button', { className: 'btn btn-ghost' },
          e('span', null, 'Voir tous les besoins '),
          e('span', { className: 'btn-arrow' })
        )
      )
    )
  );
}

/* ─────────────────────────── TECH / CLARITY 2 ─────────────────────────── */

function Tech() {
  return e('section', { className: 'tech-section', id: 'tech' },
    e('div', { className: 'wrap' },
      e('div', { className: 'tech-grid' },
        e('div', { className: 'reveal' },
          e('div', { className: 'tech-pill' },
            e('span', { className: 'ping' }),
            'Les technologies'
          ),
          e('h2', { className: 'h-section' },
            'Lutronic Clarity 2', e('br'),
            e('em', null, 'épilation laser médicale')
          ),
          e('div', { className: 'tech-divider' }),
          e('p', { className: 'lede' },
            "Découvrez la nouvelle gamme de laser très puissant — taille de spot 25 mm, pulse 1 ms, le plus court du marché. Une épilation définitive ultra-rapide et très efficace, parfaite pour les grandes zones comme les jambes ou les forfaits multi-zones."
          ),
          e('div', { className: 'tech-warning' },
            "Attention : de nombreuses chaînes proposent l'épilation laser sous l'appellation \"médecine esthétique\" sans médecin dans la structure, ou avec un médecin inexpérimenté. Cela conduit à des séances mal pratiquées et un budget gaspillé en soins inefficaces."
          ),
          e('a', { href: '#', className: 'btn btn-ghost', style: { marginTop: 32 } },
            e('span', null, 'Découvrir nos technologies '),
            e('span', { className: 'btn-arrow' })
          )
        ),
        e('div', { className: 'video-mock clip-img' },
          e('div', { className: 'video-mock-bg', style: {
            backgroundImage: 'url(https://i.ytimg.com/vi/pXsIx73aLX8/maxresdefault.jpg)'
          } }),
          e('div', { className: 'video-mock-overlay' },
            e('button', { className: 'play-btn' }, e('span', { className: 'arr' }))
          ),
          e('div', { className: 'video-mock-bottom' },
            e('div', { className: 'video-mock-title' }, 'Introducing Lutronic Clarity II — IntelliTrak & temperature'),
            e('div', { className: 'video-progress' }, e('div')),
            e('div', { className: 'video-mock-meta' },
              e('div', null, e('span', null, 'Play / Pause'), e('span', null, '00:00 / 01:24')),
              e('div', null, e('span', null, 'Settings'), e('span', null, 'Fullscreen'))
            )
          )
        )
      )
    )
  );
}

/* ─────────────────────────── PARTNERS ─────────────────────────── */

function Partners() {
  const dup = [...PARTNERS, ...PARTNERS, ...PARTNERS];
  return e('section', { className: 'partners' },
    e('div', { className: 'partners-label' }, 'Nos partenaires technologiques'),
    e('div', { className: 'partners-track' },
      [0, 1].map(k => e('div', { key: k },
        dup.map((p, i) => e('span', {
          key: i,
          className: 'partner' + (p.bold ? ' bold' : '')
        }, p.name))
      ))
    )
  );
}

/* ─────────────────────────── DOCTOR ─────────────────────────── */

function Doctor() {
  return e('section', { className: 'dr-section', id: 'dr' },
    e('div', { className: 'wrap' },
      e('div', { className: 'dr-grid' },
        e('div', { className: 'reveal' },
          e('div', { className: 'eyebrow', style: { marginBottom: 32 } }, '— Direction médicale'),
          e('blockquote', { className: 'dr-quote' },
            "Mon objectif n'est pas de transformer, mais de ",
            e('em', null, 'révéler'),
            ". Chaque visage a sa cohérence — la médecine esthétique, bien menée, doit la respecter."
          ),
          e('div', { className: 'dr-attribution' },
            e('span', { className: 'dr-line' }),
            e('div', null,
              e('div', { className: 'dr-name' }, 'Dr Sophie Convers'),
              e('div', { className: 'dr-title' }, 'Médecin esthétique · Fondatrice')
            )
          )
        ),
        e('div', { className: 'dr-portrait reveal' },
          e('svg', { viewBox: '0 0 300 400', style: { width: '100%', height: '100%', position: 'absolute', zIndex: 0 } },
            e('rect', { width: 300, height: 400, fill: '#141E36' }),
            e('ellipse', { cx: 150, cy: 155, rx: 55, ry: 68, fill: 'rgba(244,239,230,0.06)' }),
            e('path', { d: 'M 80 280 Q 80 230 150 230 Q 220 230 220 280 L 220 400 L 80 400 Z',
              fill: 'rgba(244,239,230,0.04)' }),
            e('ellipse', { cx: 150, cy: 155, rx: 55, ry: 68, fill: 'none',
              stroke: 'rgba(199,160,55,0.18)', strokeWidth: 0.5 })
          ),
          e('div', { className: 'dr-portrait-tag' }, 'Portrait · Photographie à venir')
        )
      ),
      e('div', { className: 'dr-credentials reveal-stagger' },
        e('div', null,
          e('div', { className: 'cred-num' }, '14', e('em', null, '+')),
          e('div', { className: 'cred-label' }, 'Années en médecine esthétique')
        ),
        e('div', null,
          e('div', { className: 'cred-num' }, 'DU'),
          e('div', { className: 'cred-label' }, 'Diplôme universitaire de médecine morphologique & anti-âge — Paris VI')
        ),
        e('div', null,
          e('div', { className: 'cred-num' }, 'SoFMMAA'),
          e('div', { className: 'cred-label' }, 'Membre de la Société Française de Médecine Morphologique Anti-Âge')
        )
      )
    )
  );
}

/* ─────────────────────────── GALLERY ─────────────────────────── */

function BeforeAfter({ item }) {
  const ref = useRef(null);
  const [split, setSplit] = useState(50);
  const move = (ev) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * 100;
    setSplit(Math.max(8, Math.min(92, x)));
  };
  return e('div', { ref, className: 'gallery-card', onMouseMove: move, style: { '--split': split + '%' } },
    e('div', { className: 'gallery-slider' },
      e('div', { className: 'gallery-half before' }, e('span', null, 'Avant'))
    ),
    e('div', { className: 'gallery-after-mask' },
      e('div', { className: 'gallery-half after', style: { width: '100%', height: '100%' } },
        e('span', null, 'Après'))
    ),
    e('span', { className: 'gallery-label l' }, 'Avant'),
    e('span', { className: 'gallery-label r' }, 'Après'),
    e('div', { className: 'gallery-handle' }, '↔'),
    e('div', { className: 'gallery-divider' }),
    e('div', { className: 'gallery-caption' },
      e('span', null, item.soin, ' · ', item.zone),
      e('span', null, item.sessions)
    )
  );
}

function Gallery() {
  return e('section', { className: 'gallery-section', id: 'gallery' },
    e('div', { className: 'wrap' },
      e('div', { className: 'section-head-center reveal' },
        e('span', { className: 'eyebrow ico' }, '— Résultats'),
        e('h2', { className: 'h-section', style: { marginTop: 24 } },
          'Avant ', e('em', null, '·'), ' après —', e('br'),
          'des résultats ', e('em', null, 'discrets.')
        )
      ),
      e('div', { className: 'gallery-grid reveal-stagger' },
        GALLERY.map((g, i) => e(BeforeAfter, { key: i, item: g }))
      ),
      e('p', { className: 'reveal', style: { marginTop: 48, fontSize: 12, color: 'var(--ink-soft)', textAlign: 'center', fontStyle: 'italic', fontFamily: 'var(--serif)' } },
        'Photographies à des fins illustratives — résultats variables selon les patients et protocoles.')
    )
  );
}

/* ─────────────────────────── CTA + FOOTER ─────────────────────────── */

function CtaFinal({ onBook }) {
  return e('section', { className: 'cta-final' },
    e('div', { className: 'wrap' },
      e('span', { className: 'eyebrow ico reveal', style: { display: 'inline-block' } },
        '— Prendre soin de soi'),
      e('h2', { className: 'h-section reveal' },
        'Une consultation,', e('br'),
        e('em', null, 'un protocole.')
      ),
      e('p', { className: 'lede reveal' },
        "La première consultation permet d'établir un diagnostic personnalisé et de définir ensemble le protocole adapté — sans précipitation, sans engagement."),
      e('div', { className: 'cta-actions reveal' },
        e('button', { className: 'btn btn-gold', onClick: onBook },
          'Prendre rendez-vous ', e('span', { className: 'btn-arrow' })),
        e('a', { className: 'btn btn-ghost', href: 'tel:0467600000' },
          e('span', null, '04 67 60 00 00 '),
          e('span', { className: 'btn-arrow' }))
      )
    )
  );
}

function Footer() {
  return e('footer', { className: 'footer' },
    e('div', { className: 'wrap' },
      e('div', { className: 'footer-grid' },
        e('div', null,
          e('div', { className: 'logo', style: { marginBottom: 24 } },
            e('div', { className: 'logo-mark-icon' }, 'É'),
            e('div', { className: 'logo-text' },
              e('span', { className: 'logo-name' }, 'Centre Esthétique'),
              e('span', { className: 'logo-sub' }, 'Écusson')
            )
          ),
          e('p', { style: { color: 'var(--ink-mute)', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, maxWidth: 380, lineHeight: 1.5 } },
            'Médecine esthétique et laser, à Montpellier et Uzès. Direction médicale : Dr Sophie Convers.')
        ),
        e('div', null,
          e('h5', null, 'Soins'),
          e('ul', null,
            e('li', null, e('a', { href: '#soins' }, 'Lutronic Clarity 2')),
            e('li', null, e('a', { href: '#soins' }, 'Injections')),
            e('li', null, e('a', { href: '#soins' }, 'Lasers médicaux')),
            e('li', null, e('a', { href: '#soins' }, 'Soins du visage')),
            e('li', null, e('a', { href: '#soins' }, 'Remodelage corporel'))
          )
        ),
        e('div', null,
          e('h5', null, 'Centres'),
          e('ul', null,
            e('li', null, '12 rue Saint-Guilhem', e('br'), '34000 Montpellier'),
            e('li', null, '8 place aux Herbes', e('br'), '30700 Uzès')
          )
        ),
        e('div', null,
          e('h5', null, 'Légal'),
          e('ul', null,
            e('li', null, e('a', { href: '#' }, 'Mentions légales')),
            e('li', null, e('a', { href: '#' }, 'Confidentialité')),
            e('li', null, e('a', { href: '#' }, "Conseil de l'Ordre"))
          )
        )
      ),
      e('div', { className: 'footer-bottom' },
        e('span', null, '© 2026 Centre Esthétique Écusson'),
        e('span', null, 'Tous droits réservés')
      )
    )
  );
}

/* ─────────────────────────── MODAL ─────────────────────────── */

function Modal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ centre: 'montpellier', soin: '', date: '', slot: '', name: '', email: '', phone: '', notes: '' });
  useEffect(() => {
    if (!open) return;
    const onKey = (ev) => { if (ev.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  const slots = ["09:00","10:00","11:00","14:00","15:00","16:00","17:00","18:00"];
  const set = (k, v) => setData(d => ({...d, [k]: v}));

  const stepUI = step === 0 ? e(F, null,
    e('h3', null, 'Quel ', e('em', null, 'soin'), ' ?'),
    e('p', { className: 'modal-sub' }, 'Première consultation ou suivi — sélectionnez votre demande.'),
    e('div', { className: 'field' },
      e('label', null, 'Centre'),
      e('select', { value: data.centre, onChange: ev => set('centre', ev.target.value) },
        e('option', { value: 'montpellier' }, 'Montpellier — Écusson'),
        e('option', { value: 'uzes' }, 'Uzès — Duché')
      )
    ),
    e('div', { className: 'field' },
      e('label', null, 'Type de soin'),
      e('select', { value: data.soin, onChange: ev => set('soin', ev.target.value) },
        e('option', { value: '' }, '— Choisir —'),
        ['Première consultation','Lutronic Clarity 2 — Épilation','Injections esthétiques','Lasers médicaux','Soins du visage','Remodelage corporel']
          .map(s => e('option', { key: s }, s))
      )
    ),
    e('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 16 } },
      e('button', { className: 'btn btn-gold', onClick: () => setStep(1), disabled: !data.soin },
        'Continuer ', e('span', { className: 'btn-arrow' }))
    )
  ) : step === 1 ? e(F, null,
    e('h3', null, 'Quel ', e('em', null, 'créneau'), ' ?'),
    e('p', { className: 'modal-sub' }, 'Premières disponibilités — réajustables après confirmation.'),
    e('div', { className: 'field' },
      e('label', null, 'Date souhaitée'),
      e('input', { type: 'date', value: data.date, onChange: ev => set('date', ev.target.value) })
    ),
    e('div', { className: 'field' },
      e('label', null, 'Créneau'),
      e('div', { className: 'slot-grid' },
        slots.map(s => e('button', {
          key: s, className: 'slot' + (data.slot === s ? ' selected' : ''),
          onClick: () => set('slot', s)
        }, s))
      )
    ),
    e('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 16 } },
      e('button', { className: 'btn btn-ghost', onClick: () => setStep(0) }, e('span', null, '← Retour')),
      e('button', { className: 'btn btn-gold', onClick: () => setStep(2), disabled: !data.date || !data.slot },
        'Continuer ', e('span', { className: 'btn-arrow' }))
    )
  ) : e(F, null,
    e('h3', null, 'Vos ', e('em', null, 'coordonnées')),
    e('p', { className: 'modal-sub' }, 'Nous vous confirmerons sous 24 heures ouvrées.'),
    e('div', { className: 'field-row' },
      e('div', { className: 'field' },
        e('label', null, 'Prénom & nom'),
        e('input', { value: data.name, onChange: ev => set('name', ev.target.value) })
      ),
      e('div', { className: 'field' },
        e('label', null, 'Téléphone'),
        e('input', { type: 'tel', value: data.phone, onChange: ev => set('phone', ev.target.value) })
      )
    ),
    e('div', { className: 'field' },
      e('label', null, 'Email'),
      e('input', { type: 'email', value: data.email, onChange: ev => set('email', ev.target.value) })
    ),
    e('div', { className: 'field' },
      e('label', null, 'Précisions (optionnel)'),
      e('textarea', { rows: 3, value: data.notes, onChange: ev => set('notes', ev.target.value) })
    ),
    e('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 16 } },
      e('button', { className: 'btn btn-ghost', onClick: () => setStep(1) }, e('span', null, '← Retour')),
      e('button', { className: 'btn btn-gold',
        onClick: () => { alert('Demande envoyée — nous revenons vers vous sous 24h.'); onClose(); setStep(0); } },
        'Envoyer la demande ', e('span', { className: 'btn-arrow' }))
    )
  );

  return e('div', { className: 'modal-overlay' + (open ? ' open' : ''), onClick: onClose },
    e('div', { className: 'modal', onClick: ev => ev.stopPropagation() },
      e('button', { className: 'modal-close', onClick: onClose }, '✕'),
      e('div', { className: 'modal-step' },
        e('span', { className: step >= 0 ? 'active' : '' }, '01 Soin'),
        e('div', { className: 'bar' + (step >= 1 ? ' done' : '') }),
        e('span', { className: step >= 1 ? 'active' : '' }, '02 Créneau'),
        e('div', { className: 'bar' + (step >= 2 ? ' done' : '') }),
        e('span', { className: step >= 2 ? 'active' : '' }, '03 Coordonnées')
      ),
      stepUI
    )
  );
}

/* ─────────────────────────── TWEAKS ─────────────────────────── */

const GOLD_TONES = {
  warm:      { gold: "#C7A037", gold2: "#E8C77A", deep: "#8B7148" },
  champagne: { gold: "#D4B98A", gold2: "#F0DCAE", deep: "#9C8458" },
  cool:      { gold: "#B5A47E", gold2: "#D6C99B", deep: "#7A6E50" }
};
const BG_TONES = {
  navy:    { bg: "#0B1220", bg2: "#0F172A", bg3: "#141E36" },
  black:   { bg: "#0A0807", bg2: "#14100D", bg3: "#1C1714" },
  midnight:{ bg: "#0A0E1A", bg2: "#111626", bg3: "#1A2138" }
};

function TweaksPanel({ tweaks, setTweak, onBook }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onMsg(ev) {
      const d = ev.data; if (!d || !d.type) return;
      if (d.type === '__activate_edit_mode') setOpen(true);
      if (d.type === '__deactivate_edit_mode') setOpen(false);
    }
    addEventListener('message', onMsg);
    parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => removeEventListener('message', onMsg);
  }, []);
  if (!open) return null;
  const close = () => { setOpen(false); parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); };

  return e('div', { className: 'twk' },
    e('div', { className: 'twk-hd' },
      e('b', null, 'Tweaks'),
      e('button', { className: 'twk-x', onClick: close }, '✕')
    ),
    e('div', { className: 'twk-body' },
      e('div', { className: 'twk-section' }, 'Direction'),
      e('div', { className: 'twk-row' },
        e('label', null, 'Or'),
        e('div', { className: 'twk-seg' },
          [['warm','Chaud'],['champagne','Champ.'],['cool','Bronze']].map(([v,l]) =>
            e('button', { key: v, className: tweaks.goldTone === v ? 'on' : '',
              onClick: () => setTweak('goldTone', v) }, l)
          )
        )
      ),
      e('div', { className: 'twk-row' },
        e('label', null, 'Fond'),
        e('div', { className: 'twk-seg' },
          [['navy','Marine'],['black','Noir'],['midnight','Midnight']].map(([v,l]) =>
            e('button', { key: v, className: tweaks.bgTone === v ? 'on' : '',
              onClick: () => setTweak('bgTone', v) }, l)
          )
        )
      ),
      e('div', { className: 'twk-section' }, 'Interactions'),
      e('div', { className: 'twk-row twk-h' },
        e('label', null, 'Curseur custom'),
        e('button', { className: 'twk-toggle' + (tweaks.cursor ? ' on' : ''),
          onClick: () => setTweak('cursor', !tweaks.cursor) })
      ),
      e('div', { className: 'twk-row twk-h' },
        e('label', null, 'Bandeau besoins'),
        e('button', { className: 'twk-toggle' + (tweaks.ticker ? ' on' : ''),
          onClick: () => setTweak('ticker', !tweaks.ticker) })
      ),
      e('div', { className: 'twk-section' }, 'Actions'),
      e('button', { className: 'twk-btn', onClick: onBook }, 'Ouvrir le RDV')
    )
  );
}

/* ─────────────────────────── APP ─────────────────────────── */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "goldTone": "warm",
  "bgTone": "navy",
  "cursor": true,
  "ticker": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [open, setOpen] = useState(false);
  useReveal();

  useEffect(() => {
    const tone = GOLD_TONES[tweaks.goldTone] || GOLD_TONES.warm;
    const bg = BG_TONES[tweaks.bgTone] || BG_TONES.navy;
    const r = document.documentElement.style;
    r.setProperty('--gold', tone.gold);
    r.setProperty('--gold-2', tone.gold2);
    r.setProperty('--gold-deep', tone.deep);
    r.setProperty('--bg', bg.bg);
    r.setProperty('--bg-2', bg.bg2);
    r.setProperty('--bg-3', bg.bg3);
    r.setProperty('--line', `rgba(${parseInt(tone.gold.slice(1,3),16)}, ${parseInt(tone.gold.slice(3,5),16)}, ${parseInt(tone.gold.slice(5,7),16)}, 0.22)`);
    document.body.style.cursor = tweaks.cursor ? 'none' : 'auto';
  }, [tweaks.goldTone, tweaks.bgTone, tweaks.cursor]);

  const setTweak = (k, v) => {
    setTweaks(t => ({...t, [k]: v}));
    parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  const openModal = () => setOpen(true);

  return e(F, null,
    tweaks.cursor && e(Cursor),
    tweaks.ticker && e(TopTicker),
    e(Nav, { onBook: openModal }),
    e(Hero, { onBook: openModal }),
    e(Centres),
    e(Soins),
    e(Tech),
    e(Partners),
    e(Doctor),
    e(Gallery),
    e(CtaFinal, { onBook: openModal }),
    e(Footer),
    e(Modal, { open, onClose: () => setOpen(false) }),
    e(TweaksPanel, { tweaks, setTweak, onBook: openModal })
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(e(App));
