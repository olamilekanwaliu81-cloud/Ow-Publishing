/* ==================================================================
   OW Publishing House — Admin DASHBOARD
   Auth-guarded. Sidebar nav + overview + full CRUD (Books, Reviews,
   Blog, Team) with image upload, on Supabase.
================================================================== */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var LOGIN = 'admin.html';  /* Vercel clean-URLs redirects this to /admin automatically */

  var cfg = window.OW_CMS || {};
  var key = cfg.SUPABASE_KEY || cfg.SUPABASE_ANON_KEY;
  if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf('YOUR-PROJECT') !== -1 || !key || key.indexOf('YOUR-') !== -1) {
    window.location.replace(LOGIN); return;
  }
  var sb = supabase.createClient(cfg.SUPABASE_URL, key, {
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
  });

  /* ---------- icons ---------- */
  var ICON = {
    overview: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
    books: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19"/></svg>',
    reviews: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z"/></svg>',
    posts: '<svg viewBox="0 0 24 24"><path d="M6 3h8l6 6v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
    team: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/><path d="M17.6 14.4A5.6 5.6 0 0 1 20.5 19.5"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17z"/><path d="M13.5 6.5l3 3"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>',
    box: '<svg viewBox="0 0 24 24"><path d="M5 7h14v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>'
  };

  /* ---------- collections ---------- */
  var COLLECTIONS = {
    books: {
      label: 'Published Books', table: 'books',
      note: 'These appear on your Published Books page and homepage. Lower "sort order" shows first. Use "Coming soon" status for unreleased titles.',
      title: 'title', sub: 'author', thumb: 'cover_url', pill: 'status',
      order: [['sort_order', true], ['created_at', false]],
      fields: [
        { k: 'title', label: 'Title', type: 'text', req: true },
        { k: 'author', label: 'Author', type: 'text' },
        { k: 'cover_url', label: 'Cover image', type: 'image' },
        { k: 'category', label: 'Category', type: 'select', opts: ["Children's", 'Memoir', 'Non-fiction', 'Fiction', 'Poetry', 'Other'] },
        { k: 'description', label: 'Short description', type: 'textarea' },
        { k: 'status', label: 'Status', type: 'select', opts: [['published', 'Published'], ['coming_soon', 'Coming soon']] },
        { k: 'buy_amazon', label: 'Amazon link', type: 'text' },
        { k: 'buy_ingram', label: 'IngramSpark link', type: 'text' },
        { k: 'buy_bookshop', label: 'Bookshop link', type: 'text' },
        { k: 'sort_order', label: 'Sort order', type: 'number', hint: 'Lower numbers appear first.' }
      ]
    },
    reviews: {
      label: 'Reviews', table: 'reviews',
      note: 'Shown in your "What authors say" section. Only publish reviews that are genuinely yours.',
      title: 'name', sub: 'book_title', thumb: null, pill: 'source',
      order: [['sort_order', true], ['created_at', false]],
      fields: [
        { k: 'name', label: 'Reviewer name', type: 'text', req: true },
        { k: 'book_title', label: 'Book', type: 'text' },
        { k: 'quote', label: 'Review quote', type: 'textarea', req: true },
        { k: 'rating', label: 'Rating (0–5)', type: 'number', step: '0.1', min: '0', max: '5' },
        { k: 'source', label: 'Source', type: 'select', opts: [['fiverr', 'Fiverr'], ['google', 'Google']] },
        { k: 'link', label: 'Link to the review', type: 'text' },
        { k: 'sort_order', label: 'Sort order', type: 'number', hint: 'Lower numbers appear first.' }
      ]
    },
    posts: {
      label: 'Blog', table: 'posts',
      note: 'Blog posts for your Resources/Blog page. Untick "Published" to keep a draft hidden.',
      title: 'title', sub: 'published_date', thumb: 'cover_url', pill: 'published',
      order: [['published_date', false], ['created_at', false]],
      fields: [
        { k: 'title', label: 'Title', type: 'text', req: true },
        { k: 'category', label: 'Category', type: 'select', opts: ['Insights', 'Self-publishing', 'Marketing', 'Costs & money', 'Writing & finishing', 'Publishing paths', 'Distribution', 'Agents', 'Avoiding scams', 'Publishing in Africa', 'Writing & AI'] },
        { k: 'cover_url', label: 'Cover image', type: 'image' },
        { k: 'excerpt', label: 'Short summary', type: 'textarea', hint: 'One or two sentences, shown on the blog list.' },
        { k: 'body', label: 'Full post', type: 'textarea', hint: 'Plain text. Leave a blank line between paragraphs.' },
        { k: 'slug', label: 'URL slug (optional)', type: 'text', hint: 'e.g. how-to-publish-your-book' },
        { k: 'published', label: 'Published', type: 'bool' },
        { k: 'published_date', label: 'Date', type: 'date' },
        { k: 'sort_order', label: 'Sort order', type: 'number' }
      ]
    },
    team: {
      label: 'Team', table: 'team',
      note: 'Team members shown on your About page.',
      title: 'name', sub: 'role', thumb: 'photo_url', pill: null,
      order: [['sort_order', true], ['created_at', false]],
      fields: [
        { k: 'name', label: 'Name', type: 'text', req: true },
        { k: 'role', label: 'Role', type: 'text' },
        { k: 'photo_url', label: 'Photo', type: 'image' },
        { k: 'bio', label: 'Short bio', type: 'textarea' },
        { k: 'linkedin', label: 'LinkedIn URL', type: 'text' },
        { k: 'sort_order', label: 'Sort order', type: 'number', hint: 'Lower numbers appear first.' }
      ]
    }
  };

  var counts = {}, current = 'overview', editing = null;

  function esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function toast(m, err) { var t = $('toast'); t.textContent = m; t.className = 'toast show' + (err ? ' err' : ''); clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = 'toast'; }, 2600); }

  /* ---------- auth guard ---------- */
  (async function init() {
    var sess = (await sb.auth.getSession()).data.session;
    if (!sess) { window.location.replace(LOGIN); return; }
    $('sideUser').textContent = sess.user.email;
    $('app').style.visibility = 'visible';
    sb.auth.onAuthStateChange(function (e) { if (e === 'SIGNED_OUT') window.location.replace(LOGIN); });
    buildNav();
    await loadCounts();
    select('overview');
  })();

  $('logoutBtn').onclick = async function () { await sb.auth.signOut(); window.location.replace(LOGIN); };

  /* ---------- sidebar ---------- */
  function buildNav() {
    var nav = $('sideNav');
    var html = '<button class="side-link" data-view="overview">' + ICON.overview + '<span>Overview</span></button>';
    Object.keys(COLLECTIONS).forEach(function (k) {
      html += '<button class="side-link" data-view="' + k + '">' + ICON[k] + '<span>' + COLLECTIONS[k].label + '</span><span class="count" data-count="' + k + '">0</span></button>';
    });
    nav.innerHTML = html;
    nav.querySelectorAll('[data-view]').forEach(function (b) { b.onclick = function () { select(b.dataset.view); closeSide(); }; });
  }
  function updateNavCounts() {
    Object.keys(COLLECTIONS).forEach(function (k) { var el = document.querySelector('[data-count="' + k + '"]'); if (el) el.textContent = counts[k] || 0; });
  }
  async function loadCounts() {
    await Promise.all(Object.keys(COLLECTIONS).map(async function (k) {
      var r = await sb.from(COLLECTIONS[k].table).select('id', { count: 'exact', head: true });
      counts[k] = r.error ? 0 : (r.count || 0);
    }));
    updateNavCounts();
  }

  /* ---------- view switching ---------- */
  function select(view) {
    current = view;
    document.querySelectorAll('.side-link').forEach(function (b) { b.classList.toggle('active', b.dataset.view === view); });
    if (view === 'overview') { renderOverview(); return; }
    var c = COLLECTIONS[view];
    $('pageTitle').textContent = c.label;
    $('addBtn').style.display = '';
    $('panelNote').style.display = ''; $('panelNote').textContent = c.note;
    load();
  }

  function renderOverview() {
    $('pageTitle').textContent = 'Overview';
    $('countLine').textContent = 'Everything on your website, in one place.';
    $('addBtn').style.display = 'none';
    $('panelNote').style.display = 'none';
    var html = '<div class="stat-grid">';
    Object.keys(COLLECTIONS).forEach(function (k) {
      html += '<div class="stat-card" data-go="' + k + '"><div class="ic">' + ICON[k] + '</div><div class="n">' + (counts[k] || 0) + '</div><div class="l">' + COLLECTIONS[k].label + '</div></div>';
    });
    html += '</div>';
    $('content').innerHTML = html;
    $('content').querySelectorAll('[data-go]').forEach(function (el) { el.onclick = function () { select(el.dataset.go); }; });
  }

  /* ---------- list ---------- */
  async function load() {
    var c = COLLECTIONS[current];
    $('content').innerHTML = '<div class="empty">Loading…</div>';
    var q = sb.from(c.table).select('*');
    c.order.forEach(function (o) { q = q.order(o[0], { ascending: o[1] }); });
    var r = await q;
    if (r.error) { $('content').innerHTML = '<div class="empty">Could not load: ' + esc(r.error.message) + '</div>'; return; }
    render(r.data || []);
  }
  function render(rows) {
    var c = COLLECTIONS[current];
    counts[current] = rows.length; updateNavCounts();
    $('countLine').textContent = rows.length + ' item' + (rows.length === 1 ? '' : 's');
    if (!rows.length) {
      $('content').innerHTML = '<div class="empty">' + ICON.box + '<div>Nothing here yet. Click <b>“+ Add new”</b> to create your first ' + esc(c.label.toLowerCase().replace(/s$/, '')) + '.</div></div>';
      return;
    }
    $('content').innerHTML = '<div class="items">' + rows.map(function (row) {
      var thumb = c.thumb && row[c.thumb]
        ? '<img class="thumb" src="' + esc(row[c.thumb]) + '" alt="">'
        : '<div class="thumb none">' + esc((row[c.title] || '?').slice(0, 1).toUpperCase()) + '</div>';
      var pill = '';
      if (c.pill === 'status') pill = '<span class="pill ' + (row.status === 'coming_soon' ? 'soon' : '') + '">' + (row.status === 'coming_soon' ? 'Coming soon' : 'Published') + '</span>';
      else if (c.pill === 'published') pill = '<span class="pill ' + (row.published ? '' : 'draft') + '">' + (row.published ? 'Published' : 'Draft') + '</span>';
      else if (c.pill) pill = '<span class="pill gray">' + esc(row[c.pill]) + '</span>';
      return '<div class="item">' + thumb +
        '<div class="meta"><b>' + esc(row[c.title] || '(untitled)') + '</b>' + (c.sub && row[c.sub] ? '<small>' + esc(row[c.sub]) + '</small>' : '') + '</div>' +
        pill +
        '<div class="acts"><button class="icon-btn" title="Edit" data-edit="' + row.id + '">' + ICON.edit + '</button>' +
        '<button class="icon-btn danger" title="Delete" data-del="' + row.id + '">' + ICON.trash + '</button></div></div>';
    }).join('') + '</div>';
    $('content').querySelectorAll('[data-edit]').forEach(function (b) { b.onclick = function () { openDrawer(rows.find(function (r) { return r.id === b.dataset.edit; })); }; });
    $('content').querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { del(rows.find(function (r) { return r.id === b.dataset.del; })); }; });
  }

  /* ---------- drawer (add / edit) ---------- */
  function openDrawer(row) {
    editing = row || null;
    var c = COLLECTIONS[current];
    $('drawerTitle').textContent = (row ? 'Edit ' : 'Add ') + c.label.toLowerCase().replace(/s$/, '');
    var f = $('drawerForm'); f.innerHTML = '';
    c.fields.forEach(function (fld) {
      var val = row ? row[fld.k] : (fld.type === 'bool' ? true : '');
      var id = 'fld_' + fld.k, input = '';
      if (fld.type === 'textarea') input = '<textarea id="' + id + '">' + esc(val) + '</textarea>';
      else if (fld.type === 'select') input = '<select id="' + id + '">' + fld.opts.map(function (o) { var ov = Array.isArray(o) ? o[0] : o, ol = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(ov) + '"' + (String(val) === String(ov) ? ' selected' : '') + '>' + esc(ol) + '</option>'; }).join('') + '</select>';
      else if (fld.type === 'bool') input = '<label class="show-pw"><input type="checkbox" id="' + id + '"' + (val ? ' checked' : '') + '> Visible on the website</label>';
      else if (fld.type === 'date') input = '<input type="date" id="' + id + '" value="' + esc(val || '') + '">';
      else if (fld.type === 'number') input = '<input type="number" id="' + id + '" value="' + esc(val === '' || val == null ? '' : val) + '"' + (fld.step ? ' step="' + fld.step + '"' : '') + (fld.min ? ' min="' + fld.min + '"' : '') + (fld.max ? ' max="' + fld.max + '"' : '') + '>';
      else if (fld.type === 'image') input = '<div class="img-row"><img class="prev" id="prev_' + fld.k + '" src="' + esc(val || '') + '"' + (val ? '' : ' style="visibility:hidden"') + ' alt=""><div style="flex:1"><input type="file" accept="image/*" id="file_' + fld.k + '"><input type="hidden" id="' + id + '" value="' + esc(val || '') + '"><div class="hint" id="up_' + fld.k + '"></div></div></div>';
      else input = '<input type="text" id="' + id + '" value="' + esc(val || '') + '">';
      f.insertAdjacentHTML('beforeend', '<div class="fld"><label>' + esc(fld.label) + (fld.req ? ' <span style="color:#b23b3b">*</span>' : '') + '</label>' + input + (fld.hint ? '<div class="hint">' + esc(fld.hint) + '</div>' : '') + '</div>');
    });
    c.fields.filter(function (x) { return x.type === 'image'; }).forEach(function (fld) { $('file_' + fld.k).onchange = function (e) { uploadImage(e.target.files[0], fld.k); }; });
    openPanel(true);
  }
  function openPanel(on) { $('drawer').classList.toggle('open', on); $('overlay').classList.toggle('open', on); }
  $('drawerClose').onclick = $('drawerCancel').onclick = $('overlay').onclick = function () { openPanel(false); };

  async function uploadImage(file, k) {
    if (!file) return;
    var note = $('up_' + k); note.textContent = 'Uploading…';
    var path = current + '/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    var up = await sb.storage.from('media').upload(path, file, { upsert: true, cacheControl: '3600' });
    if (up.error) { note.textContent = 'Upload failed: ' + up.error.message; return; }
    var url = sb.storage.from('media').getPublicUrl(path).data.publicUrl;
    $('fld_' + k).value = url;
    var p = $('prev_' + k); p.src = url; p.style.visibility = 'visible';
    note.textContent = 'Uploaded ✓';
  }

  $('drawerSave').onclick = async function () {
    var c = COLLECTIONS[current], rec = {};
    for (var i = 0; i < c.fields.length; i++) {
      var fld = c.fields[i], node = $('fld_' + fld.k), v;
      if (fld.type === 'bool') v = node.checked;
      else { v = node.value; if (typeof v === 'string') v = v.trim(); }
      if (fld.req && !v) { toast('“' + fld.label + '” is required', true); return; }
      if (fld.type === 'number') v = v === '' ? (fld.k === 'sort_order' ? 0 : null) : Number(v);
      if (v === '') v = null;
      rec[fld.k] = v;
    }
    var btn = $('drawerSave'); btn.classList.add('busy');
    var r = editing ? await sb.from(c.table).update(rec).eq('id', editing.id) : await sb.from(c.table).insert([rec]);
    btn.classList.remove('busy');
    if (r.error) { toast(r.error.message, true); return; }
    openPanel(false); toast(editing ? 'Saved' : 'Added'); load();
  };

  async function del(row) {
    var c = COLLECTIONS[current];
    if (!confirm('Delete “' + (row[c.title] || 'this item') + '”? This cannot be undone.')) return;
    var r = await sb.from(c.table).delete().eq('id', row.id);
    if (r.error) { toast(r.error.message, true); return; }
    toast('Deleted'); load();
  }

  $('addBtn').onclick = function () { openDrawer(null); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') openPanel(false); });

  /* ---------- mobile sidebar ---------- */
  function closeSide() { $('side').classList.remove('open'); }
  $('sideToggle').onclick = function () { $('side').classList.toggle('open'); };
})();
