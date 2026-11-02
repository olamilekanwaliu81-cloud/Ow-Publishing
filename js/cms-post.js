/* ==================================================================
   OW Publishing House — blog post reader
   Fetches one CMS post by ?id= and renders it. Read-only.
================================================================== */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var cfg = window.OW_CMS || {}, key = cfg.SUPABASE_KEY || cfg.SUPABASE_ANON_KEY;
  var id = new URLSearchParams(location.search).get('id');

  function notFound(msg) {
    $('postTitle').textContent = msg || 'Post not found';
    $('postBody').innerHTML = '<p><a href="resources">&larr; Back to the blog</a></p>';
  }

  if (!cfg.SUPABASE_URL || !key || /YOUR-/.test(cfg.SUPABASE_URL) || /YOUR-/.test(key) || !id) { notFound(); return; }

  fetch(cfg.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/posts?select=*&published=eq.true&id=eq.' + encodeURIComponent(id), { headers: { apikey: key } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rows) {
      var p = rows && rows[0];
      if (!p) { notFound(); return; }
      document.title = p.title + ' · OW Publishing House';
      var md = document.querySelector('meta[name="description"]'); if (md && p.excerpt) md.setAttribute('content', p.excerpt);
      $('postTitle').textContent = p.title;
      var d = p.published_date ? new Date(p.published_date) : null;
      $('postDate').textContent = (d && !isNaN(d)) ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
      if (p.cover_url) { var img = $('postCover'); img.src = p.cover_url; img.alt = p.title; img.style.display = 'block'; }
      var body = (p.body || '').split(/\n\s*\n/).map(function (para) {
        return '<p>' + esc(para).replace(/\n/g, '<br>') + '</p>';
      }).join('');
      $('postBody').innerHTML = body || ('<p>' + esc(p.excerpt || '') + '</p>');
    })
    .catch(function () { notFound('Could not load this post.'); });
})();
