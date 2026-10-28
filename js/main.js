// OW Publishing House, global site scripts

// Mobile nav toggle
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  if (!nav || !toggle) return;
  toggle.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Close the menu after tapping a link
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Current year in footer
(function () {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Consultation booking, availability-restricted time picker
// -------------------------------------------------------------
// EDIT AVAILABILITY HERE. Hours in 24h; 24 = midnight. slotMinutes = gap between times.
// weekday = Mon–Fri, weekend = Sat & Sun.
(function () {
  const dateEl = document.getElementById('bkDate');
  const timeEl = document.getElementById('bkTime');
  if (!dateEl || !timeEl || timeEl.tagName !== 'SELECT') return;

  const BOOKING = {
    slotMinutes: 30,
    weekday: [[13, 16], [20, 24]],   // 1–4 PM and 8 PM–12 AM
    weekend: [[0, 24]]               // Sat & Sun: any time
  };

  // Don't allow past dates.
  const now = new Date();
  dateEl.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  function fmt(mins) {
    let h = Math.floor(mins / 60), m = mins % 60, ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + ap;
  }
  function slotsFor(windows) {
    const out = [];
    windows.forEach(function (w) { for (let t = w[0] * 60; t < w[1] * 60; t += BOOKING.slotMinutes) out.push(t); });
    return out;
  }
  function populate() {
    if (!dateEl.value) {
      timeEl.innerHTML = '<option value="" selected disabled>Pick a day first…</option>';
      timeEl.disabled = true;
      return;
    }
    const d = new Date(dateEl.value + 'T00:00:00');
    const day = d.getDay(); // 0 Sun … 6 Sat
    const isWeekend = (day === 0 || day === 6);
    const slots = slotsFor(isWeekend ? BOOKING.weekend : BOOKING.weekday);
    timeEl.disabled = false;
    timeEl.innerHTML = '<option value="" selected disabled>Choose a time…</option>' +
      slots.map(function (t) { return '<option value="' + fmt(t) + (isWeekend ? '' : '') + '">' + fmt(t) + '</option>'; }).join('');
    const hint = document.getElementById('bkTimeHint');
    if (hint) hint.textContent = isWeekend
      ? 'Weekend, any time works. We’ll confirm the exact slot with you.'
      : 'Weekday availability: 1–4 PM and 8 PM–12 AM. We’ll confirm the exact slot.';
  }
  dateEl.addEventListener('change', populate);
  populate();
})();

// Resources / Blog, post listing with category tabs + pagination
(function () {
  const app = document.getElementById('blogApp');
  if (!app) return;

  // Live posts link to a real article page; url:null renders a "Coming soon" card.
  const AUTHOR = 'Olamilekan Waliu';
  const POSTS = [
    { t: 'Self-publishing vs traditional publishing: the two roads', cat: 'Publishing paths', thumb: 'th-navy', date: 'Jul 20, 2026', url: 'article-two-roads.html', featured: true,
      e: 'Every author faces one fork: do it yourself and keep more per book, or let a publisher take the risk and keep less. Here is how each road really works, and the one golden rule that separates a real publisher from a scam.' },
    { t: 'What a literary agent really does, and how they get paid', cat: 'Agents', thumb: 'th-gold', date: 'Jun 5, 2026', url: 'article-literary-agents.html',
      e: 'An agent only earns when you earn, 15% of what you make, and nothing upfront, ever. Here is what they actually do, and why "pay to be represented" is the industry’s biggest red flag.' },
    { t: 'A real publisher never asks you for money', cat: 'Avoiding scams', thumb: 'th-plum', date: 'Apr 28, 2026', url: 'article-never-pay-to-publish.html',
      e: 'Vanity presses dressed up as "hybrid publishers" target writers who feel unworthy. Learn the bait-and-switch, the pre-sign checklist, and the one direction money should always flow.' },
    { t: 'What’s really inside a traditional publishing house', cat: 'Publishing paths', thumb: 'th-teal', date: 'Mar 15, 2026', url: 'article-inside-a-publisher.html',
      e: 'A publisher isn’t one person, it’s a whole team, each with a specific job, all salaried. Here is who does what, and why that means you never pay them a fee to be published.' },
    { t: 'Perfectionism is just fear in a nice outfit', cat: 'Writing & finishing', thumb: 'th-rust', date: 'Jan 30, 2026', url: 'article-finish-your-book.html',
      e: 'Most books die in the drafting, not the market. The label "aspiring", perfectionism, and waiting for motivation are the real killers. Here is the honest way to actually finish.' },
    { t: 'Standing out as an author in the AI era', cat: 'Writing & AI', thumb: 'th-navy', date: 'Nov 18, 2025', url: 'article-ai-era.html',
      e: 'AI-generated books are flooding submission piles and store shelves. Here is how to use AI for the mechanical work while doubling down on the one thing it can’t fake, your voice.' },

    // Queued from the owner’s guides, write next.
    { t: 'How much does it cost to self-publish a book?', cat: 'Costs & money', thumb: 'th-gold', date: 'Sep 24, 2025', url: null,
      e: 'A plain breakdown of what you actually pay for, editing, cover, formatting, publishing setup and growth, and where authors overspend or get overcharged.' },
    { t: 'How to publish your book on Amazon KDP, step by step', cat: 'Self-publishing', thumb: 'th-teal', date: 'Aug 8, 2025', url: null,
      e: 'From manuscript file to a live listing: account setup, formats, metadata, pricing and the print-on-demand basics that trip most first-timers up.' },
    { t: 'KDP vs IngramSpark: which should you use?', cat: 'Distribution', thumb: 'th-plum', date: 'May 27, 2025', url: null,
      e: 'The honest comparison, reach, print quality, bookstore access and cost, and why many books belong on both rather than one or the other.' },
    { t: 'How book royalties actually work', cat: 'Costs & money', thumb: 'th-navy', date: 'Mar 14, 2025', url: null,
      e: 'Advances, earn-out, royalty percentages and what "net vs list" really means, so the numbers in a contract or a KDP dashboard finally make sense.' },
    { t: 'Do you really need an ISBN?', cat: 'Self-publishing', thumb: 'th-rust', date: 'Dec 5, 2024', url: null,
      e: 'What an ISBN is, when a free one is fine, when you should own yours, and how it affects where and how your book can be sold.' },
    { t: 'Ebook, paperback or hardcover, what should you publish?', cat: 'Self-publishing', thumb: 'th-teal', date: 'Oct 21, 2024', url: null,
      e: 'Each format suits a different book and budget. A simple way to decide what to launch with, and what to add later.' },
    { t: 'How to price your self-published book', cat: 'Costs & money', thumb: 'th-gold', date: 'Aug 19, 2024', url: null,
      e: 'Pricing psychology, platform royalty tiers, and how to test your way to the number that actually sells, without leaving money on the table.' },
    { t: 'Self-publishing in Nigeria: a practical guide', cat: 'Publishing in Africa', thumb: 'th-navy', date: 'Jun 10, 2024', url: null,
      e: 'Local print vs global platforms, payment and delivery realities, and how Nigerian authors can reach both home and international readers.' },
    { t: 'Marketing your book after launch, the honest version', cat: 'Marketing', thumb: 'th-plum', date: 'Apr 15, 2024', url: null,
      e: 'No virality gimmicks. The grounded, repeatable work that turns a live listing into steady sales: reviews, keywords, ads and a small real audience.' }
  ];

  const PER_PAGE = 9;
  const tabsEl = document.getElementById('catTabs');
  const featEl = document.getElementById('featuredSlot');
  const gridEl = document.getElementById('postGrid');
  const pagerEl = document.getElementById('pager');
  let cat = 'All Posts', page = 1;

  const cats = ['All Posts'];
  POSTS.forEach(function (p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });

  function esc(s) { return s; }
  function thumb(p, big) {
    return '<span class="p-cat">' + p.cat + '</span>' +
           '<span class="th-title">' + (big ? p.t : p.t) + '</span>' +
           (p.url ? '' : '<span class="post-soon">Coming soon</span>');
  }
  function byline(p) {
    return '<div class="post-byline">' + AUTHOR + ' <span class="dot">·</span> ' + p.date + '</div>';
  }
  function cardHTML(p) {
    const inner =
      '<div class="post-thumb ' + p.thumb + '">' + thumb(p) + '</div>' +
      '<div class="post-body"><p class="post-meta">' + p.cat + '</p>' +
      '<h3>' + p.t + '</h3><p>' + p.e + '</p>' + byline(p) + '</div>';
    return p.url
      ? '<a class="post-card" href="' + p.url + '">' + inner + '</a>'
      : '<div class="post-card is-soon">' + inner + '</div>';
  }
  function featuredHTML(p) {
    const btn = p.url ? '<a class="btn btn-gold" style="margin-top:16px;align-self:flex-start;" href="' + p.url + '">Read the guide <span class="arrow">→</span></a>' : '';
    return '<article class="feature-post">' +
      (p.url ? '<a class="fp-thumb ' + p.thumb + '" href="' + p.url + '">' + thumb(p, true) + '</a>' : '<div class="fp-thumb ' + p.thumb + '">' + thumb(p, true) + '</div>') +
      '<div class="fp-body"><p class="fp-badge">★ Start here</p><h2>' + p.t + '</h2><p>' + p.e + '</p>' + byline(p) + btn + '</div></article>';
  }

  function render() {
    // tabs
    tabsEl.innerHTML = cats.map(function (c) {
      return '<button class="filter-tab' + (c === cat ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
    }).join('');

    const list = POSTS.filter(function (p) { return cat === 'All Posts' || p.cat === cat; });
    const showFeatured = (cat === 'All Posts' && page === 1);
    const featured = showFeatured ? list.find(function (p) { return p.featured; }) || list[0] : null;
    const gridList = list.filter(function (p) { return p !== featured; });

    const pages = Math.max(1, Math.ceil(gridList.length / PER_PAGE));
    if (page > pages) page = pages;
    const start = (page - 1) * PER_PAGE;
    const pageItems = gridList.slice(start, start + PER_PAGE);

    featEl.innerHTML = featured ? featuredHTML(featured) : '';
    gridEl.innerHTML = pageItems.map(cardHTML).join('');

    pagerEl.innerHTML =
      '<button id="prevBtn"' + (page <= 1 ? ' disabled' : '') + '>Previous</button>' +
      '<span class="page-info">Page ' + page + ' of ' + pages + '</span>' +
      '<button id="nextBtn"' + (page >= pages ? ' disabled' : '') + '>Next page</button>';

    tabsEl.querySelectorAll('.filter-tab').forEach(function (b) {
      b.addEventListener('click', function () { cat = b.getAttribute('data-cat'); page = 1; render(); window.scrollTo({ top: app.offsetTop - 70, behavior: 'smooth' }); });
    });
    const prev = document.getElementById('prevBtn'), next = document.getElementById('nextBtn');
    if (prev) prev.addEventListener('click', function () { if (page > 1) { page--; render(); window.scrollTo({ top: app.offsetTop - 70, behavior: 'smooth' }); } });
    if (next) next.addEventListener('click', function () { if (page < pages) { page++; render(); window.scrollTo({ top: app.offsetTop - 70, behavior: 'smooth' }); } });
  }
  render();
})();

// Published Books, category filter + search
(function () {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.book-card');
  const search = document.getElementById('bookSearch');
  const noRes = document.querySelector('.no-results');
  if (!cards.length) return;
  let cat = 'all';

  function apply() {
    const q = search ? search.value.trim().toLowerCase() : '';
    let shown = 0;
    cards.forEach(function (card) {
      const inCat = cat === 'all' || (card.getAttribute('data-cat') || '').split(' ').indexOf(cat) !== -1;
      const matches = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
      const show = inCat && matches;
      card.hidden = !show;
      if (show) shown++;
    });
    if (noRes) noRes.hidden = shown !== 0;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      cat = tab.getAttribute('data-filter');
      apply();
    });
  });
  if (search) search.addEventListener('input', apply);
})();

// Book Spec Collector / contact forms (Formspree, no live price)
// -------------------------------------------------------------
// SETUP: replace FORMSPREE_ID in the form's `action` with the real
// endpoint (https://formspree.io/f/xxxxxxx). Optional: also POST to a
// Google Apps Script Web App URL for Sheet logging, set data-sheet-hook
// on the <form> to that URL. Until the endpoint is set, the form runs in
// demo mode and just shows the confirmation without sending.
(function () {
  const forms = document.querySelectorAll('form[data-ow-form]');
  forms.forEach(function (form) {
    const success = document.querySelector(form.getAttribute('data-success') || '#formSuccess');
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const action = form.getAttribute('action') || '';
      const isPlaceholder = action.indexOf('FORMSPREE_ID') !== -1 || action === '';
      const data = new FormData(form);

      // Optional Google Sheet logging hook (fire-and-forget)
      const sheetHook = form.getAttribute('data-sheet-hook');
      if (sheetHook && sheetHook.indexOf('SHEET_HOOK') === -1) {
        try { fetch(sheetHook, { method: 'POST', body: data, mode: 'no-cors' }); } catch (err) { /* noop */ }
      }

      const done = function () {
        if (success) {
          form.style.display = 'none';
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          form.reset();
        }
      };

      if (isPlaceholder) { done(); return; } // demo mode

      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'Sending…'; }
      try {
        const res = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (res.ok) { done(); }
        else { throw new Error('Submit failed'); }
      } catch (err) {
        alert('Sorry, something went wrong sending your specs. Please try again, or reach us on WhatsApp.');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'Send'; }
      }
    });
  });
})();

/* ============================================================
   Image protection (deterrent): block right-click, drag and
   long-press-save on images site-wide. Not foolproof, a
   determined visitor can still use dev tools or screenshots.
   ============================================================ */
(function () {
  var onImg = function (e) {
    var t = e.target;
    if (t && (t.tagName === 'IMG' || (t.closest && t.closest('img')))) {
      e.preventDefault();
      return false;
    }
  };
  document.addEventListener('contextmenu', onImg);
  document.addEventListener('dragstart', onImg);
})();

/* ============================================================
   Pricing currency switcher (USD base -> NGN / CAD / EUR / GBP)
   Rates are approximate and editable here in one place.
   ============================================================ */
(function () {
  var grid = document.getElementById('pricingPkgs');
  if (!grid) return;
  var RATES = {
    USD: { sym: '$',  rate: 1 },
    NGN: { sym: '₦', rate: 1650 },
    CAD: { sym: 'C$', rate: 1.38 },
    EUR: { sym: '€', rate: 0.92 },
    GBP: { sym: '£', rate: 0.79 }
  };
  var sw = document.getElementById('curSwitch');
  var note = document.getElementById('curNote');
  var cur = 'USD';
  function fmt(usd) {
    var r = RATES[cur];
    return r.sym + Math.round(usd * r.rate).toLocaleString('en-US');
  }
  function render() {
    document.querySelectorAll('.amt[data-usd]').forEach(function (el) {
      var usd = parseFloat(el.getAttribute('data-usd')) || 0;
      el.textContent = usd ? fmt(usd) : '•••';
    });
    if (note) {
      note.textContent = cur === 'USD'
        ? 'Prices shown in US dollars.'
        : 'Approximate ' + cur + ' — you’re billed in USD; OW covers the currency-difference charge.';
    }
  }
  if (sw) {
    sw.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      cur = b.getAttribute('data-cur');
      sw.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      render();
    });
  }
  render();
})();

/* ============================================================
   Dropdown navigation (Publishing / Services / Resources)
   Desktop: hover (CSS) + click toggle. Mobile: accordion.
   ============================================================ */
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var tops = nav.querySelectorAll('.nav-top');
  tops.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var li = btn.parentElement;
      var isOpen = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      nav.querySelectorAll('.has-sub').forEach(function (o) {
        if (o !== li) {
          o.classList.remove('open');
          var b = o.querySelector('.nav-top');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      nav.querySelectorAll('.has-sub.open').forEach(function (o) {
        o.classList.remove('open');
        var b = o.querySelector('.nav-top');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      nav.querySelectorAll('.has-sub.open').forEach(function (o) { o.classList.remove('open'); });
    }
  });
})();

/* Highlight the current page in the nav */
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  nav.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) {
      a.classList.add('is-current');
      var sub = a.closest('.has-sub');
      if (sub) { var t = sub.querySelector('.nav-top'); if (t) t.classList.add('is-current'); }
    }
  });
})();
