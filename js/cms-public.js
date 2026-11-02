/* ==================================================================
   OW Publishing House — public CMS reader
   Renders Books / Reviews / Team live from Supabase into the existing
   page sections, matching the site's markup. Read-only, lightweight
   (no library). If the CMS is unreachable or empty, the page keeps
   its built-in content, so nothing ever disappears.
================================================================== */
(function () {
  'use strict';
  var cfg = window.OW_CMS || {};
  var key = cfg.SUPABASE_KEY || cfg.SUPABASE_ANON_KEY;
  if (!cfg.SUPABASE_URL || !key || /YOUR-/.test(cfg.SUPABASE_URL) || /YOUR-/.test(key)) return;
  var base = cfg.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/';

  function get(path) {
    return fetch(base + path, { headers: { apikey: key } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }
  function esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
  var CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

  /* ---------------- BOOKS ---------------- */
  function catSlug(c) {
    c = (c || '').toLowerCase();
    if (c.indexOf('child') > -1) return 'children';
    if (c.indexOf('memoir') > -1) return 'memoir';
    if (c.indexOf('non') > -1) return 'nonfiction';
    if (c.indexOf('fiction') > -1) return 'fiction';
    if (c.indexOf('poet') > -1) return 'poetry';
    return 'other';
  }
  function renderBooks(grid, rows) {
    grid.innerHTML = rows.map(function (b) {
      var cover = b.cover_url ? '<img src="' + esc(b.cover_url) + '" alt="' + esc(b.title) + (b.author ? ' by ' + esc(b.author) : '') + ', cover">' : '';
      var badge, hover = '';
      if (b.status === 'coming_soon') {
        badge = '<span class="book-badge soon">' + CLOCK + 'Coming soon</span>';
        hover = '<div class="book-hover"><span class="bh-label">Publishing soon</span><p class="bh-soon">' + esc(b.title) + ' releases soon.</p></div>';
      } else {
        var label = b.buy_amazon ? 'Amazon' : (b.buy_bookshop ? 'Bookshop' : (b.buy_ingram ? 'IngramSpark' : 'Available'));
        badge = '<span class="book-badge' + (b.buy_amazon ? '' : ' store') + '">' + BAG + label + '</span>';
        var links = '';
        if (b.buy_amazon) links += '<a class="bh-btn amazon" href="' + esc(b.buy_amazon) + '" target="_blank" rel="noopener">Amazon <span class="arrow">&rarr;</span></a>';
        if (b.buy_bookshop) links += '<a class="bh-btn" href="' + esc(b.buy_bookshop) + '" target="_blank" rel="noopener">Bookshop <span class="arrow">&rarr;</span></a>';
        if (b.buy_ingram) links += '<a class="bh-btn" href="' + esc(b.buy_ingram) + '" target="_blank" rel="noopener">IngramSpark <span class="arrow">&rarr;</span></a>';
        if (links) hover = '<div class="book-hover"><span class="bh-label">Buy it on</span>' + links + '</div>';
      }
      return '<article class="book-card" data-cat="' + catSlug(b.category) + '">' +
        '<div class="book-cover">' + cover + badge + hover + '</div>' +
        '<div class="book-info"><div class="book-title-txt">' + esc(b.title) + '</div>' +
        '<div class="book-author-txt">' + esc(b.author || '') + (b.category ? ' &middot; ' + esc(b.category) : '') + '</div></div></article>';
    }).join('');
    // update counts
    var pc = document.querySelector('.pb-count span'); if (pc) pc.textContent = rows.length;
    document.querySelectorAll('.filter-tab').forEach(function (tab) {
      var f = tab.getAttribute('data-filter'), c = tab.querySelector('.count'); if (!c) return;
      c.textContent = (!f || f === 'all') ? rows.length : rows.filter(function (b) { return catSlug(b.category) === f; }).length;
    });
  }

  /* ---------------- REVIEWS ---------------- */
  function renderReviews(grid, rows) {
    grid.innerHTML = rows.map(function (r) {
      var rating = (r.rating == null ? 5 : r.rating);
      var srcLabel = r.source === 'google' ? 'Read on Google' : 'Verified Fiverr review';
      var sub = r.book_title ? '<span>Author of <i>' + esc(r.book_title) + '</i></span>' : '';
      var link = r.link ? '<a href="' + esc(r.link) + '" target="_blank" rel="noopener">' + srcLabel + ' <span class="arrow">&rarr;</span></a>' : '';
      return '<figure class="testi-card">' +
        '<span class="stars" style="--rating:' + rating + '" aria-label="Rated ' + rating + ' out of 5"></span>' +
        '<blockquote>' + esc(r.quote) + '</blockquote>' +
        '<figcaption><b>' + esc(r.name) + '</b>' + sub + link + '</figcaption></figure>';
    }).join('');
  }

  /* ---------------- TEAM ---------------- */
  var TONES = ['gold', 'teal', 'plum', 'navy', 'rust'];
  function initials(n) { return (n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase(); }
  function renderTeam(grid, rows) {
    grid.innerHTML = rows.map(function (m, i) {
      var photo = m.photo_url
        ? '<span class="tm-photo"><img src="' + esc(m.photo_url) + '" alt="' + esc(m.name) + '"></span>'
        : '<span class="tm-photo tm-initials" data-tone="' + TONES[i % TONES.length] + '" aria-hidden="true">' + esc(initials(m.name)) + '</span>';
      var inner = photo + '<span class="tm-name">' + esc(m.name) + '</span><span class="tm-role">' + esc(m.role || '') + '</span>';
      return m.linkedin
        ? '<a class="tm-card" href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">' + inner + '</a>'
        : '<div class="tm-card">' + inner + '</div>';
    }).join('');
  }

  /* ---------------- run ---------------- */
  var bookGrid = document.querySelector('.book-grid');
  if (bookGrid) get('books?select=*&order=sort_order.asc,created_at.desc').then(function (rows) {
    if (rows && rows.length) { renderBooks(bookGrid, rows); document.dispatchEvent(new Event('cms:books-rendered')); }
  });

  var testiGrids = document.querySelectorAll('.testi-grid');
  if (testiGrids.length) get('reviews?select=*&order=sort_order.asc,created_at.desc').then(function (rows) { if (rows && rows.length) testiGrids.forEach(function (g) { renderReviews(g, rows); }); });

  var teamGrid = document.querySelector('.team-grid');
  if (teamGrid) get('team?select=*&order=sort_order.asc,created_at.desc').then(function (rows) { if (rows && rows.length) renderTeam(teamGrid, rows); });
})();
