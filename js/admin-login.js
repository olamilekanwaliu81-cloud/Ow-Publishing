/* ==================================================================
   OW Publishing House — Admin LOGIN page
   On success (or existing session) -> redirect to the dashboard.
================================================================== */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var DASHBOARD = 'dashboard.html';  /* Vercel clean-URLs redirects this to /dashboard automatically */

  var cfg = window.OW_CMS || {};
  var key = cfg.SUPABASE_KEY || cfg.SUPABASE_ANON_KEY;
  var configured = cfg.SUPABASE_URL && cfg.SUPABASE_URL.indexOf('YOUR-PROJECT') === -1 && key && key.indexOf('YOUR-') === -1;

  if (!configured) {
    document.querySelector('.login-card').innerHTML =
      '<img class="login-logo" src="assets/ow-logo-monogram.png" alt=""><h1>Finish setup</h1>' +
      '<p class="sub">Add your Supabase URL and key in <b>js/cms-config.js</b>, then re-deploy. See CMS-SETUP.md.</p>';
    return;
  }

  var sb = supabase.createClient(cfg.SUPABASE_URL, key, {
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
  });

  function goDash() { window.location.replace(DASHBOARD); }

  // already signed in (or just arrived via magic-link)? -> dashboard
  sb.auth.onAuthStateChange(function (_e, session) { if (session) goDash(); });
  sb.auth.getSession().then(function (r) { if (r.data.session) goDash(); });

  // show / hide password
  var showPw = $('showPw');
  if (showPw) showPw.addEventListener('change', function () {
    $('password').type = showPw.checked ? 'text' : 'password';
  });

  // password sign-in
  $('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var err = $('loginErr'); err.textContent = '';
    var btn = $('loginBtn'); btn.classList.add('busy');
    var r = await sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
    btn.classList.remove('busy');
    if (r.error) { err.textContent = r.error.message; return; }
    goDash();
  });

  // passwordless magic link
  var magicBtn = $('magicBtn');
  if (magicBtn) magicBtn.addEventListener('click', async function () {
    var email = $('email').value.trim(), msg = $('magicMsg');
    if (!email) { msg.className = 'msg err'; msg.textContent = 'Type your email above first.'; return; }
    magicBtn.classList.add('busy'); msg.className = 'msg info'; msg.textContent = 'Sending your link…';
    var r = await sb.auth.signInWithOtp({ email: email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + '/dashboard.html' } });
    magicBtn.classList.remove('busy');
    if (r.error) { msg.className = 'msg err'; msg.textContent = r.error.message; return; }
    msg.className = 'msg ok'; msg.textContent = 'Check your email for a sign-in link (look in spam too). Open it on this device.';
  });
})();
