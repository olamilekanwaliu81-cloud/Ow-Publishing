/* ==================================================================
   OW Publishing House — Admin dashboard logic
   Auth + generic CRUD (Books, Reviews, Blog, Team) on Supabase.
================================================================== */
(function () {
  'use strict';

  // ---------- config guard ----------
  var cfg = window.OW_CMS || {};
  var cmsKey = cfg.SUPABASE_KEY || cfg.SUPABASE_ANON_KEY; // support either name
  var configured = cfg.SUPABASE_URL && cfg.SUPABASE_URL.indexOf('YOUR-PROJECT') === -1 &&
                   cmsKey && cmsKey.indexOf('YOUR-') === -1;

  var $ = function (id) { return document.getElementById(id); };
  var loginErr = $('loginErr');

  if (!configured) {
    $('loginView').innerHTML =
      '<div class="adm-login-card">' +
      '<img class="logo" src="assets/ow-logo-monogram.png" alt="">' +
      '<h1>Finish setup</h1>' +
      '<p class="sub">Your CMS is not connected yet. Open <b>js/cms-config.js</b> and paste your Supabase <b>Project URL</b> and <b>anon key</b> (Supabase → Project Settings → API), then re-deploy. See <b>CMS-SETUP.md</b> for the full walkthrough.</p>' +
      '</div>';
    return;
  }

  var sb = supabase.createClient(cfg.SUPABASE_URL, cmsKey, {
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
  });

  // ---------- collection definitions ----------
  var COLLECTIONS = {
    books: {
      label: 'Published Books', table: 'books',
      note: 'These appear on your Published Books page and homepage. Lower “sort order” shows first. Set status to “Coming soon” for unreleased titles.',
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
      note: 'These appear in your “What authors say” section. Only publish reviews that are genuinely yours.',
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
      note: 'Blog posts appear on your Resources/Blog page. Untick “Published” to keep a draft hidden.',
      title: 'title', sub: 'published_date', thumb: 'cover_url', pill: 'published',
      order: [['published_date', false], ['created_at', false]],
      fields: [
        { k: 'title', label: 'Title', type: 'text', req: true },
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
      note: 'Team members appear on your About page.',
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

  var current = 'books';      // active collection key
  var editing = null;         // record being edited (null = new)

  // ---------- helpers ----------
  function toast(msg, isErr) {
    var t = $('toast'); t.textContent = msg; t.className = 'adm-toast show' + (isErr ? ' err' : '');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = 'adm-toast'; }, 2600);
  }
  function esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- auth ----------
  async function init() {
    // fires on magic-link return (SIGNED_IN) and on normal load
    sb.auth.onAuthStateChange(function (_event, session) { if (session) showDash(session); });
    var sess = (await sb.auth.getSession()).data.session;
    if (sess) showDash(sess); else showLogin();
  }
  function showLogin() { $('loginView').hidden = false; $('dashView').hidden = true; }
  function showDash(sess) {
    $('loginView').hidden = true; $('dashView').hidden = false;
    $('whoami').textContent = sess.user.email;
    buildTabs(); select('books');
  }

  $('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); loginErr.textContent = '';
    var btn = $('loginBtn'); btn.classList.add('adm-busy');
    var r = await sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
    btn.classList.remove('adm-busy');
    if (r.error) { loginErr.textContent = r.error.message; return; }
    showDash(r.data.session);
  });
  var showPw = $('showPw');
  if (showPw) showPw.addEventListener('change', function () {
    var p = $('password'); if (p) p.type = showPw.checked ? 'text' : 'password';
  });

  // ---- passwordless: email me a sign-in link ----
  var magicBtn = $('magicBtn');
  if (magicBtn) magicBtn.addEventListener('click', async function () {
    var email = $('email').value.trim(), msg = $('magicMsg');
    if (!email) { msg.style.color = '#b23b3b'; msg.textContent = 'Type your email above first.'; return; }
    magicBtn.classList.add('adm-busy'); msg.style.color = 'var(--ink-soft)'; msg.textContent = 'Sending your link…';
    var r = await sb.auth.signInWithOtp({
      email: email,
      options: { shouldCreateUser: false, emailRedirectTo: location.origin + '/admin' }
    });
    magicBtn.classList.remove('adm-busy');
    if (r.error) { msg.style.color = '#b23b3b'; msg.textContent = r.error.message; return; }
    msg.style.color = 'var(--gold-deep)';
    msg.textContent = 'Check your email for a sign-in link (look in spam too). It expires in 1 hour — open it on this device.';
  });

  $('logoutBtn').addEventListener('click', async function () { await sb.auth.signOut(); showLogin(); });

  // ---------- tabs ----------
  function buildTabs() {
    var nav = $('tabs'); nav.innerHTML = '';
    Object.keys(COLLECTIONS).forEach(function (key) {
      var b = document.createElement('button');
      b.className = 'adm-tab' + (key === current ? ' active' : '');
      b.textContent = COLLECTIONS[key].label;
      b.onclick = function () { select(key); };
      b.dataset.key = key;
      nav.appendChild(b);
    });
  }
  function select(key) {
    current = key;
    Array.prototype.forEach.call($('tabs').children, function (b) { b.classList.toggle('active', b.dataset.key === key); });
    $('panelTitle').textContent = COLLECTIONS[key].label;
    $('panelNote').textContent = COLLECTIONS[key].note;
    load();
  }

  // ---------- list ----------
  async function load() {
    var c = COLLECTIONS[current];
    $('list').innerHTML = '<div class="adm-empty">Loading…</div>';
    var q = sb.from(c.table).select('*');
    c.order.forEach(function (o) { q = q.order(o[0], { ascending: o[1] }); });
    var r = await q;
    if (r.error) { $('list').innerHTML = '<div class="adm-empty">Could not load: ' + esc(r.error.message) + '</div>'; return; }
    render(r.data || []);
  }
  function render(rows) {
    var c = COLLECTIONS[current];
    $('panelCount').textContent = rows.length + ' item' + (rows.length === 1 ? '' : 's');
    if (!rows.length) { $('list').innerHTML = '<div class="adm-empty">Nothing here yet. Click “Add new” to create your first ' + esc(c.label.toLowerCase()) + ' item.</div>'; return; }
    $('list').innerHTML = rows.map(function (row) {
      var thumb = c.thumb && row[c.thumb]
        ? '<img class="thumb" src="' + esc(row[c.thumb]) + '" alt="">'
        : '<div class="thumb none">' + esc((row[c.title] || '?').slice(0, 1).toUpperCase()) + '</div>';
      var pill = '';
      if (c.pill) {
        var v = row[c.pill];
        if (c.pill === 'status') pill = '<span class="pill ' + (v === 'coming_soon' ? 'soon' : '') + '">' + (v === 'coming_soon' ? 'Coming soon' : 'Published') + '</span>';
        else if (c.pill === 'published') pill = '<span class="pill ' + (v ? '' : 'soon') + '">' + (v ? 'Published' : 'Draft') + '</span>';
        else pill = '<span class="pill">' + esc(v) + '</span>';
      }
      return '<div class="adm-item">' + thumb +
        '<div class="meta"><b>' + esc(row[c.title] || '(untitled)') + '</b>' +
        (c.sub && row[c.sub] ? '<small>' + esc(row[c.sub]) + '</small>' : '') + '</div>' +
        pill +
        '<div class="actions">' +
        '<button class="adm-mini" data-edit="' + row.id + '">Edit</button>' +
        '<button class="adm-mini danger" data-del="' + row.id + '">Delete</button>' +
        '</div></div>';
    }).join('');
    Array.prototype.forEach.call($('list').querySelectorAll('[data-edit]'), function (b) {
      b.onclick = function () { openDrawer(rows.find(function (r) { return r.id === b.dataset.edit; })); };
    });
    Array.prototype.forEach.call($('list').querySelectorAll('[data-del]'), function (b) {
      b.onclick = function () { del(rows.find(function (r) { return r.id === b.dataset.del; })); };
    });
  }

  // ---------- drawer (add / edit) ----------
  function openDrawer(row) {
    editing = row || null;
    var c = COLLECTIONS[current];
    $('drawerTitle').textContent = (row ? 'Edit ' : 'Add ') + c.label.replace(/s$/, '').toLowerCase();
    var f = $('drawerForm'); f.innerHTML = '';
    c.fields.forEach(function (fld) {
      var val = row ? row[fld.k] : (fld.type === 'number' ? '' : (fld.type === 'bool' ? true : ''));
      var wrap = document.createElement('div'); wrap.className = 'adm-field';
      var lbl = '<label>' + esc(fld.label) + (fld.req ? ' <span class="req">*</span>' : '') + '</label>';
      var input = '';
      var id = 'fld_' + fld.k;
      if (fld.type === 'textarea') input = '<textarea id="' + id + '">' + esc(val) + '</textarea>';
      else if (fld.type === 'select') {
        input = '<select id="' + id + '">' + fld.opts.map(function (o) {
          var ov = Array.isArray(o) ? o[0] : o, ol = Array.isArray(o) ? o[1] : o;
          return '<option value="' + esc(ov) + '"' + (String(val) === String(ov) ? ' selected' : '') + '>' + esc(ol) + '</option>';
        }).join('') + '</select>';
      }
      else if (fld.type === 'bool') input = '<label style="font-weight:400"><input type="checkbox" id="' + id + '"' + (val ? ' checked' : '') + '> Visible on the site</label>';
      else if (fld.type === 'date') input = '<input type="date" id="' + id + '" value="' + esc(val || '') + '">';
      else if (fld.type === 'number') input = '<input type="number" id="' + id + '" value="' + esc(val === '' || val == null ? '' : val) + '"' + (fld.step ? ' step="' + fld.step + '"' : '') + (fld.min ? ' min="' + fld.min + '"' : '') + (fld.max ? ' max="' + fld.max + '"' : '') + '>';
      else if (fld.type === 'image') {
        input = '<div class="adm-img">' +
          '<img class="preview" id="prev_' + fld.k + '" src="' + esc(val || '') + '" alt="" ' + (val ? '' : 'style="visibility:hidden"') + '>' +
          '<div><input type="file" accept="image/*" id="file_' + fld.k + '"><input type="hidden" id="' + id + '" value="' + esc(val || '') + '"><div class="hint" id="up_' + fld.k + '"></div></div></div>';
      }
      else input = '<input type="text" id="' + id + '" value="' + esc(val || '') + '">';
      wrap.innerHTML = lbl + input + (fld.hint ? '<div class="hint">' + esc(fld.hint) + '</div>' : '');
      f.appendChild(wrap);
    });
    // wire image uploads
    c.fields.filter(function (x) { return x.type === 'image'; }).forEach(function (fld) {
      $('file_' + fld.k).onchange = function (e) { uploadImage(e.target.files[0], fld.k); };
    });
    openPanel(true);
  }
  function openPanel(on) {
    $('drawer').classList.toggle('open', on); $('overlay').classList.toggle('open', on);
    $('drawer').setAttribute('aria-hidden', on ? 'false' : 'true');
  }
  $('drawerClose').onclick = $('drawerCancel').onclick = function () { openPanel(false); };
  $('overlay').onclick = function () { openPanel(false); };

  async function uploadImage(file, key) {
    if (!file) return;
    var note = $('up_' + key); note.textContent = 'Uploading…';
    var path = current + '/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    var up = await sb.storage.from('media').upload(path, file, { upsert: true, cacheControl: '3600' });
    if (up.error) { note.textContent = 'Upload failed: ' + up.error.message; return; }
    var url = sb.storage.from('media').getPublicUrl(path).data.publicUrl;
    $('fld_' + key).value = url;
    var p = $('prev_' + key); p.src = url; p.style.visibility = 'visible';
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
    var btn = $('drawerSave'); btn.classList.add('adm-busy');
    var r = editing
      ? await sb.from(c.table).update(rec).eq('id', editing.id)
      : await sb.from(c.table).insert([rec]);
    btn.classList.remove('adm-busy');
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

  init();
})();
