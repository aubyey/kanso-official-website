(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pageUrl = () => location.href.split('#')[0];

  /* toast */
  const toast = $('#toast');
  let tt;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  /* bottom sheets */
  const scrim = $('#scrim');
  let openSheet = null;
  const showSheet = (id) => {
    if (openSheet) hideSheet(true);
    openSheet = $('#' + id);
    scrim.hidden = false;
    openSheet.hidden = false;
    openSheet.classList.remove('closing');
    document.body.style.overflow = 'hidden';
    if (id === 'sheet-qr') buildQR();
    const f = $('button, a', openSheet);
    f && f.focus({ preventScroll: true });
  };
  const hideSheet = (instant) => {
    if (!openSheet) return;
    const s = openSheet;
    openSheet = null;
    scrim.hidden = true;
    document.body.style.overflow = '';
    if (instant) { s.hidden = true; return; }
    s.classList.add('closing');
    setTimeout(() => { s.hidden = true; s.classList.remove('closing'); }, 260);
  };
  $$('[data-open]').forEach((b) => b.addEventListener('click', () => showSheet(b.dataset.open)));
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => hideSheet()));
  scrim.addEventListener('click', () => hideSheet());

  /* QR + copy */
  let qrBuilt = false;
  function buildQR() {
    if (qrBuilt) return;
    const box = $('#qr');
    if (window.QRCode) {
      new QRCode(box, { text: pageUrl(), width: 200, height: 200, colorDark: '#08090a', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
      qrBuilt = true;
    } else {
      box.innerHTML = '<p class="muted" style="color:#333;max-width:20ch">QR needs a connection to load. Use Copy link instead.</p>';
    }
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(pageUrl()); say('Link copied'); }
    catch {
      const t = document.createElement('textarea');
      t.value = pageUrl(); document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); say('Link copied'); } catch { say('Copy failed. Long-press the address bar.'); }
      t.remove();
    }
  }
  $('#copy').addEventListener('click', copyLink);

  /* share */
  $('#share').addEventListener('click', async () => {
    const data = { title: 'KANSO', text: 'One Tap. Instant Connect.', url: pageUrl() };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else copyLink();
  });

  /* sample cafe menu (Starbucks-style, browse-only with photos) */
  const MENU = {
    'Espresso': [
      [
        'Iced Caramel Macchiato',
        'Rich espresso, vanilla syrup, cold milk & caramel drizzle',
        '₱195',
        'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Iced White Chocolate Mocha',
        'Signature espresso with white chocolate sauce & whipped cream',
        '₱200',
        'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Caffè Americano',
        'Espresso shots topped with hot or cold water for a light crema',
        '₱160',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Cold Brew with Vanilla Cream',
        'Slow-steeped cold brew topped with house-made vanilla sweet cream',
        '₱190',
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=180&q=80'
      ]
    ],
    'Frappuccino®': [
      [
        'Java Chip Frappuccino®',
        'Mocha sauce, Frappuccino® chips, milk & whipped cream',
        '₱215',
        'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Caramel Frappuccino®',
        'Buttery caramel syrup blended with coffee, milk & ice',
        '₱205',
        'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Green Tea Cream Frappuccino®',
        'Sweetened matcha green tea blended with milk & whipped cream',
        '₱215',
        'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=180&q=80'
      ]
    ],
    'Tea & Refreshers': [
      [
        'Pure Matcha Latte',
        'Smooth and creamy matcha sweetened just right over milk',
        '₱190',
        'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Pink Drink',
        'Strawberry Açaí Refresher with coconut milk & real strawberries',
        '₱195',
        'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Iced Shaken Hibiscus Tea',
        'Bright hibiscus tea shaken with pomegranate pearls & ice',
        '₱175',
        'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=180&q=80'
      ]
    ],
    'Bakery & Food': [
      [
        'French Butter Croissant',
        'Flaky, golden pastry baked fresh with real butter',
        '₱135',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Blueberry Licious Cheesecake',
        'Creamy cheesecake topped with sweet-tart blueberries',
        '₱225',
        'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Classic Cinnamon Roll',
        'Warm swirled pastry finished with cream cheese icing',
        '₱155',
        'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=180&q=80'
      ],
      [
        'Belgian Waffle',
        'Crisp golden waffle lightly dusted with pearl sugar',
        '₱145',
        'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=180&q=80'
      ]
    ]
  };

  const tabs = $('#tabs'), items = $('#items');
  let current = Object.keys(MENU)[0];

  function renderMenu() {
    tabs.innerHTML = Object.keys(MENU)
      .map((k) => `<button role="tab" aria-selected="${k === current}" data-tab="${k}">${k}</button>`)
      .join('');

    items.innerHTML = MENU[current]
      .map(([name, desc, price, img]) => `
        <li>
          <img class="menu-thumb" src="${img}" alt="${name}" loading="lazy">
          <div class="name">
            <b>${name}</b>
            <span>${desc}</span>
          </div>
          <span class="price">${price}</span>
        </li>
      `)
      .join('');
  }

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (b) { current = b.dataset.tab; renderMenu(); }
  });
  renderMenu();

  /* lightbox: swipe only */
  const lb = $('#lightbox'), lbImg = $('#lb-img'), lbCount = $('#lb-count');
  const photos = $$('.thumb img').map((i) => ({ src: i.getAttribute('src'), alt: i.alt }));
  let idx = 0, opener = null;
  const paint = () => {
    lbImg.src = photos[idx].src;
    lbImg.alt = photos[idx].alt;
    lbCount.textContent = `${idx + 1} / ${photos.length}`;
  };
  function openLB(i, from) {
    idx = i; opener = from; paint();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lb-close').focus({ preventScroll: true });
  }
  function closeLB() {
    lb.hidden = true;
    document.body.style.overflow = '';
    opener && opener.focus({ preventScroll: true });
  }
  function go(dir) {
    const next = idx + dir;
    if (next < 0 || next >= photos.length) return;
    lbImg.classList.add(dir > 0 ? 'out-l' : 'out-r');
    setTimeout(() => {
      idx = next; paint();
      lbImg.classList.remove('out-l', 'out-r');
    }, 150);
  }
  $$('.thumb').forEach((t) => t.addEventListener('click', () => openLB(+t.dataset.index, t)));
  $('#lb-close').addEventListener('click', closeLB);
  $('#lb-stage').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeLB(); });

  let sx = 0, sy = 0;
  lb.addEventListener('touchstart', (e) => { sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* tap demo: card taps phone, profile appears; loops while on screen */
  {
    const stage = $('#demo-stage'), replay = $('#replay');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timers = [], visible = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const set = (c, on) => stage.classList.toggle(c, on);
    const stop = () => { timers.forEach(clearTimeout); timers = []; };
    function run() {
      stop();
      ['in', 'tap', 'show'].forEach((c) => set(c, false));
      at(500, () => set('in', true));
      at(1700, () => set('tap', true));
      at(2900, () => set('show', true));
      at(3300, () => { set('in', false); set('tap', false); });
      at(9500, () => set('show', false));
      at(10600, () => { if (visible) run(); });
    }
    if (reduce) { set('show', true); replay.hidden = true; }
    else {
      replay.addEventListener('click', run);
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) run(); else stop();
      }, { threshold: 0.4 }).observe(stage);
    }
  }

  /* keyboard (desktop): arrows swipe, Esc closes */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (!lb.hidden) closeLB(); else hideSheet(); }
    if (!lb.hidden) { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }
  });
})();