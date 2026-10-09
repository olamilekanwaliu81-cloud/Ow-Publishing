/* ============================================================
   OW Publishing House, Author Toolkit calculators
   ------------------------------------------------------------
   ONE config block for every constant (edit here, nowhere else).
   Spec modelled on Amazon KDP, the anchor platform. IngramSpark
   and other printers differ slightly; OW always checks final
   files before upload.
   ============================================================ */
const OW_TOOLKIT = {
  printerName: 'Amazon KDP',

  // Paper thickness, inches PER PAGE (drives spine width).
  paperThicknessIn: {
    white: 0.002252,
    cream: 0.0025,
    groundwood: 0.0038
  },
  // Premium colour interior overrides paper thickness:
  premiumColorThicknessIn: 0.002347,

  // Bleed on any edge that carries art to the trim (inches).
  bleedIn: 0.125,

  // Hardcover case-wrap extras (KDP fixed values, inches). OW verifies final files.
  hardcoverWrapIn: 0.591,   // amount that wraps around the board on every side
  hardcoverHingeIn: 0.394,  // gap between spine and each cover
  // Barcode block on the back cover (inches).
  barcodeIn: { w: 2.0, h: 1.2 },
  // Keep content this far inside the trim (safe margin, inches).
  coverSafeIn: 0.125,

  // A spine can carry text only once the book is thick enough (KDP ≈ 100 pages).
  spineTextMinPages: 100,

  // Interior INSIDE margin (gutter) grows with page count, KDP recommended (inches).
  gutterBands: [
    { max: 150, inside: 0.375 },
    { max: 300, inside: 0.5 },
    { max: 500, inside: 0.625 },
    { max: 700, inside: 0.75 },
    { max: 100000, inside: 0.875 }
  ],
  // Recommended outside / top / bottom margins (inches).
  outsideMarginIn: 0.5,

  // Trim-size presets (inches).
  presets: [
    { name: '5 × 8 in', w: 5, h: 8 },
    { name: '5.06 × 7.81 in', w: 5.06, h: 7.81 },
    { name: '5.25 × 8 in', w: 5.25, h: 8 },
    { name: '5.5 × 8.5 in', w: 5.5, h: 8.5 },
    { name: '6 × 9 in', w: 6, h: 9 },
    { name: '7 × 10 in', w: 7, h: 10 },
    { name: '8 × 10 in', w: 8, h: 10 },
    { name: '8.5 × 11 in', w: 8.5, h: 11 }
  ]
};

// ---- helpers ----
function owNum(v) { const n = parseFloat(v); return isFinite(n) && n > 0 ? n : 0; }
function owRound(n, u) { return u === 'mm' ? (n * 25.4).toFixed(1) : n.toFixed(3); }
function owUnit(u) { return u === 'mm' ? 'mm' : 'in'; }

/* ============================================================
   12b, COVER TEMPLATE CALCULATOR
   ============================================================ */
(function () {
  const root = document.getElementById('coverCalc');
  if (!root) return;
  const C = OW_TOOLKIT;
  let unit = 'in';

  const el = function (id) { return document.getElementById(id); };
  const trimSel = el('cvTrim'), cwIn = el('cvW'), chIn = el('cvH'), customWrap = el('cvCustom'), customWrapH = el('cvCustomH');
  const binding = el('cvBinding'), interior = el('cvInterior'), paper = el('cvPaper'), pages = el('cvPages');

  // populate presets
  trimSel.innerHTML = C.presets.map(function (p, i) { return '<option value="' + i + '">' + p.name + '</option>'; }).join('') + '<option value="custom">Custom size…</option>';

  function getTrim() {
    if (trimSel.value === 'custom') return { w: owNum(cwIn.value), h: owNum(chIn.value) };
    const p = C.presets[parseInt(trimSel.value, 10)] || C.presets[4];
    return { w: p.w, h: p.h };
  }

  function calc() {
    const showCustom = trimSel.value === 'custom' ? '' : 'none';
    customWrap.style.display = showCustom;
    if (customWrapH) customWrapH.style.display = showCustom;
    const t = getTrim(), pg = owNum(pages.value);
    let thick = C.paperThicknessIn[paper.value] || C.paperThicknessIn.white;
    if (interior.value === 'premium') thick = C.premiumColorThicknessIn;

    const spine = pg * thick;
    const hc = binding.value === 'hardcover';
    const wrap = hc ? C.hardcoverWrapIn : 0;
    const hinge = hc ? C.hardcoverHingeIn : 0;
    const outer = hc ? wrap : C.bleedIn;           // outer band = wrap (hardcover) or bleed (paperback)
    const safe = C.coverSafeIn;
    const fullW = (2 * t.w) + spine + (2 * hinge) + (2 * outer);
    const fullH = t.h + (2 * outer);
    const canSpineText = pg >= C.spineTextMinPages;

    // Numbered dimensions table (matches the diagram callouts)
    const dims = el('cvDims');
    if (dims) {
      if (t.w && t.h && pg) {
        const D = function (u, v) { return owRound(u, unit) + ' × ' + owRound(v, unit) + ' ' + owUnit(unit); };
        const rows = [
          [1, 'Full cover', fullW, fullH],
          [2, 'Spine', spine, t.h],
          [3, 'Front cover', t.w, t.h],
          [4, 'Safe area', t.w - 2 * safe, t.h - 2 * safe],
          [5, 'Barcode area', C.barcodeIn.w, C.barcodeIn.h]
        ];
        if (hc) { rows.push([6, 'Wrap', wrap, wrap]); rows.push([7, 'Hinge', hinge, fullH]); }
        dims.innerHTML = rows.map(function (r) {
          return '<tr><td class="dn">' + r[0] + '</td><td class="dd">' + r[1] + '</td><td class="dv">' + D(r[2], r[3]) + '</td></tr>';
        }).join('');
      } else {
        dims.innerHTML = '<tr><td class="dd" colspan="3" style="color:var(--on-navy-dim)">Enter your trim size and page count to see every dimension.</td></tr>';
      }
    }

    const sum = el('cvSummary');
    if (t.w && t.h && pg) {
      sum.innerHTML = 'Design your full-wrap cover on a canvas of <b>' + owRound(fullW, unit) + ' × ' + owRound(fullH, unit) + ' ' + owUnit(unit) +
        '</b> (that already includes bleed). The spine is <b>' + owRound(spine, unit) + ' ' + owUnit(unit) + '</b> wide.';
    } else {
      sum.innerHTML = 'Enter your trim size and page count to see your exact canvas size.';
    }

    const flag = el('cvFlag');
    if (!pg) { flag.className = 'calc-flag'; flag.textContent = ''; }
    else if (canSpineText) { flag.className = 'calc-flag ok'; flag.textContent = '✓ At ' + pg + ' pages, your spine is thick enough to carry text.'; }
    else { flag.className = 'calc-flag no'; flag.textContent = '! At ' + pg + ' pages, the spine is likely too thin for text (KDP needs ~' + C.spineTextMinPages + '+). Keep the spine clean.'; }

    // hidden fields for the send-to-OW form
    const hid = document.getElementById('cvHidden');
    if (hid) hid.value = 'Trim ' + t.w + '×' + t.h + 'in · ' + pg + ' pages · ' + binding.value + ' · ' + interior.value + ' · ' + paper.value +
      ' → Spine ' + spine.toFixed(3) + 'in · Full cover ' + fullW.toFixed(3) + '×' + fullH.toFixed(3) + 'in (KDP spec)';

    // visible recap in the send form
    const setR = function (id, v) { const e = el(id); if (e) e.textContent = v; };
    const optText = function (sel) { return sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ''; };
    setR('rcTrim', t.w && t.h ? owRound(t.w, unit) + ' × ' + owRound(t.h, unit) + ' ' + owUnit(unit) : '—');
    setR('rcPages', pg || '—');
    setR('rcBinding', optText(binding));
    setR('rcPaper', optText(interior) + ' · ' + optText(paper));
    setR('rcSpine', t.w && pg ? owRound(spine, unit) + ' ' + owUnit(unit) : '—');
    setR('rcFull', t.w && pg ? owRound(fullW, unit) + ' × ' + owRound(fullH, unit) + ' ' + owUnit(unit) : '—');

    // Compact to-scale full-wrap preview (with hinges for hardcover)
    const wrapEl = el('cvWrap'), trimBox = el('cvTrimBox'), back = el('cvBack'), spineBox = el('cvSpineBox'), front = el('cvFront'), cvCap = el('cvCaption');
    const hingeL = el('cvHingeL'), hingeR = el('cvHingeR'), badge6 = el('cvBadge6'), badge7 = el('cvBadge7');
    if (wrapEl && cvCap) {
      if (t.w && t.h && pg) {
        const S = 26; // px per inch, portable scale
        const o = outer * S;
        wrapEl.style.display = 'block';
        wrapEl.style.width = (fullW * S) + 'px';
        wrapEl.style.height = (fullH * S) + 'px';
        trimBox.style.top = o + 'px'; trimBox.style.left = o + 'px'; trimBox.style.right = o + 'px'; trimBox.style.bottom = o + 'px';
        back.style.width = (t.w * S) + 'px';
        spineBox.style.width = (spine * S) + 'px';
        front.style.width = (t.w * S) + 'px';
        if (hingeL) hingeL.style.width = (hinge * S) + 'px';
        if (hingeR) hingeR.style.width = (hinge * S) + 'px';
        if (badge6) badge6.style.display = hc ? 'grid' : 'none';
        if (badge7) badge7.style.display = hc ? 'grid' : 'none';
        cvCap.innerHTML = 'Full cover ' + owRound(fullW, unit) + ' × ' + owRound(fullH, unit) + ' ' + owUnit(unit) +
          '<small>' + (hc ? 'Back + hinge + spine + hinge + front + wrap' : 'Back + spine + front + bleed') +
          ' · spine ' + owRound(spine, unit) + ' ' + owUnit(unit) + '</small>';
      } else {
        wrapEl.style.display = 'none';
        cvCap.textContent = 'Enter trim size and page count to preview the cover.';
      }
    }
  }

  root.addEventListener('input', calc);
  root.addEventListener('change', calc);
  root.querySelectorAll('.unit-toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      unit = b.getAttribute('data-unit');
      root.querySelectorAll('.unit-toggle button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      calc();
    });
  });
  calc();
})();

/* ============================================================
   12d, AI BOOK-IDEA CHECKER (client-side first look)
   ------------------------------------------------------------
   A helpful, modest read, genre signal + recommended OW lane.
   Not a guarantee. Can later be upgraded to a live LLM call via
   a Netlify Function without changing this page's markup.
   ============================================================ */
const OW_IDEA = {
  minChars: 40,
  formspree: 'https://formspree.io/f/mlgqyada',
  genres: [
    { label: "a children's / picture book", kw: ['children', 'kids', 'picture book', 'bedtime', 'toddler', 'preschool', 'young reader', 'kid '], path: 'print' },
    { label: 'a memoir / personal story', kw: ['memoir', 'my life', 'my story', 'true story', 'my journey', 'autobiograph', 'growing up', 'i survived', 'looking back'], path: 'agent' },
    { label: 'a self-help / how-to book', kw: ['self-help', 'self help', 'how to', 'habit', 'productivity', 'mindset', 'improve your', 'better life', 'motivat'], path: 'grow' },
    { label: 'a business / leadership book', kw: ['business', 'leadership', 'entrepreneur', 'startup', 'money', 'finance', 'marketing', 'career', 'management'], path: 'grow' },
    { label: 'a faith / devotional book', kw: ['faith', 'god', 'christian', 'devotional', 'prayer', 'bible', 'spiritual', 'islam', 'muslim', 'gospel'], path: 'grow' },
    { label: 'a romance novel', kw: ['romance', 'love story', 'falling in love', 'heartbreak', 'her heart', 'his heart'], path: 'grow' },
    { label: 'a thriller / mystery', kw: ['thriller', 'murder', 'detective', 'crime', 'mystery', 'suspense', 'killer', 'investigat'], path: 'agent' },
    { label: 'a fantasy / sci-fi novel', kw: ['fantasy', 'magic', 'dragon', 'sci-fi', 'science fiction', 'space', 'dystopia', 'wizard', 'kingdom', 'galaxy'], path: 'agent' },
    { label: 'a poetry collection', kw: ['poetry', 'poems', 'poem', 'verse', 'anthology of poems'], path: 'grow' },
    { label: 'an academic / textbook', kw: ['textbook', 'academic', 'research', 'thesis', 'curriculum', 'students will'], path: 'print' }
  ],
  paths: {
    grow: { rec: 'This suits <b>self-publishing with a Book Growth retainer</b> — get it produced properly, then actively work on the sales.', links: [['See Self-Publishing', 'self-publishing.html']] },
    agent: { rec: 'This could be <b>strong enough to try the agent route first</b> — and if that doesn’t land, it’s ready to self-publish with us instead.', links: [['See The Agent Route', 'agent-route.html'], ['Or Self-Publishing', 'self-publishing.html']] },
    print: { rec: 'This is a <b>great candidate for self-publishing</b> — and for <b>local print</b> too if you want physical copies in hand.', links: [['See Self-Publishing', 'self-publishing.html'], ['Or Local Print', 'local-print.html']] }
  }
};

(function () {
  const root = document.getElementById('ideaChecker');
  if (!root) return;
  const form = document.getElementById('ideaForm');
  const desc = document.getElementById('ideaDesc');
  const errEl = document.getElementById('ideaError');
  const resEl = document.getElementById('ideaResult');

  function analyse(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    let best = null, bestScore = 0;
    OW_IDEA.genres.forEach(function (g) {
      let s = 0;
      g.kw.forEach(function (k) { if (t.indexOf(k) !== -1) s++; });
      if (s > bestScore) { bestScore = s; best = g; }
    });
    const words = text.trim().split(/\s+/).length;
    return { genre: best ? best.label : 'hard to place from a short description', path: best ? best.path : 'grow', matched: bestScore > 0, words: words };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = desc.value.trim();
    if (text.length < OW_IDEA.minChars) {
      errEl.textContent = 'Please add a little more, at least ' + OW_IDEA.minChars + ' characters so the read is meaningful.';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const a = analyse(text);
    const p = OW_IDEA.paths[a.path];
    const genreLine = a.matched
      ? 'From your description, this reads like <b>' + a.genre + '</b>.'
      : 'Your idea is <b>' + a.genre + '</b> — which just means it’s worth a proper conversation.';
    const marketLine = a.matched
      ? 'That’s a category with a real, reachable readership, the key is producing it to a professional standard and getting it in front of the right readers.'
      : 'The best next step is a quick chat so we can place it and map the right path.';
    const linksHTML = p.links.map(function (l) { return '<a class="btn btn-outline-ink" href="' + l[1] + '">' + l[0] + ' <span class="arrow">→</span></a>'; }).join(' ');

    resEl.innerHTML =
      '<p class="eyebrow">Your first look</p>' +
      '<h3>Here’s our honest read</h3>' +
      '<p>' + genreLine + '</p>' +
      '<p>' + marketLine + '</p>' +
      '<p class="idea-rec">' + p.rec + '</p>' +
      '<div class="idea-links">' + linksHTML + '</div>' +
      '<p class="idea-modest">This is a helpful first look, not a guarantee, every book deserves a real conversation. <a href="https://book.olamilekanwaliu.com">Book a consultation →</a></p>';
    resEl.classList.add('show');
    resEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Send the idea to OW as a lead (fire-and-forget)
    const data = new FormData(form);
    data.append('_subject', 'AI Book-Idea Checker, new idea submitted');
    data.append('Detected', a.genre + ' · suggested path: ' + a.path);
    try { fetch(OW_IDEA.formspree, { method: 'POST', body: data, headers: { Accept: 'application/json' } }); } catch (err) { /* noop */ }
  });
})();

/* ============================================================
   12c, INTERIOR LAYOUT CALCULATOR
   ============================================================ */
(function () {
  const root = document.getElementById('interiorCalc');
  if (!root) return;
  const C = OW_TOOLKIT;
  let unit = 'in';

  const el = function (id) { return document.getElementById(id); };
  const trimSel = el('inTrim'), cwIn = el('inW'), chIn = el('inH'), customWrap = el('inCustom'), customWrapH = el('inCustomH');
  const pages = el('inPages'), fullbleed = el('inBleed');

  trimSel.innerHTML = C.presets.map(function (p, i) { return '<option value="' + i + '">' + p.name + '</option>'; }).join('') + '<option value="custom">Custom size…</option>';

  function getTrim() {
    if (trimSel.value === 'custom') return { w: owNum(cwIn.value), h: owNum(chIn.value) };
    const p = C.presets[parseInt(trimSel.value, 10)] || C.presets[4];
    return { w: p.w, h: p.h };
  }

  function calc() {
    const showCustom = trimSel.value === 'custom' ? '' : 'none';
    customWrap.style.display = showCustom;
    if (customWrapH) customWrapH.style.display = showCustom;
    const t = getTrim(), pg = owNum(pages.value);
    const band = C.gutterBands.find(function (b) { return pg <= b.max; }) || C.gutterBands[C.gutterBands.length - 1];
    const inside = band.inside;
    const outside = C.outsideMarginIn;
    const bleed = fullbleed.checked ? C.bleedIn : 0;

    el('inMargins').textContent = pg ? owRound(outside, unit) + ' ' + owUnit(unit) : '—';
    el('inGutter').textContent = pg ? owRound(inside, unit) + ' ' + owUnit(unit) : '—';
    el('inBleedOut').textContent = bleed ? owRound(bleed, unit) + ' ' + owUnit(unit) : 'None';
    el('inPageSize').textContent = t.w && t.h ? owRound(t.w, unit) + ' × ' + owRound(t.h, unit) + ' ' + owUnit(unit) : '—';

    const sum = el('inSummary');
    if (t.w && t.h && pg) {
      sum.innerHTML = 'Set your document to <b>' + owRound(t.w, unit) + ' × ' + owRound(t.h, unit) + ' ' + owUnit(unit) +
        '</b>, with a <b>' + owRound(inside, unit) + ' ' + owUnit(unit) + '</b> inside (gutter) margin, <b>' + owRound(outside, unit) + ' ' + owUnit(unit) +
        '</b> outside/top/bottom, and ' + (bleed ? '<b>' + owRound(bleed, unit) + ' ' + owUnit(unit) + '</b> bleed.' : '<b>no bleed</b> (text-only).');
    } else {
      sum.innerHTML = 'Enter your trim size and page count to see your interior setup.';
    }

    const flag = el('inFlag');
    if (!pg) { flag.className = 'calc-flag'; flag.textContent = ''; }
    else { flag.className = 'calc-flag ok'; flag.textContent = '✓ The gutter grows with page count, at ' + pg + ' pages we use ' + inside + ' in inside margin so text near the spine stays readable.'; }

    const hid = document.getElementById('inHidden');
    if (hid) hid.value = 'Trim ' + t.w + '×' + t.h + 'in · ' + pg + ' pages · ' + (fullbleed.checked ? 'full-bleed' : 'text-only') +
      ' → Inside/gutter ' + inside + 'in · Outside/top/bottom ' + outside + 'in · Bleed ' + (bleed || 0) + 'in (KDP spec)';

    const setR = function (id, v) { const e = el(id); if (e) e.textContent = v; };
    setR('rcInSize', t.w && t.h ? owRound(t.w, unit) + ' × ' + owRound(t.h, unit) + ' ' + owUnit(unit) : '—');
    setR('rcInPages', pg || '—');
    setR('rcInGutter', pg ? owRound(inside, unit) + ' ' + owUnit(unit) : '—');
    setR('rcInMargins', pg ? owRound(outside, unit) + ' ' + owUnit(unit) : '—');
    setR('rcInBleed', bleed ? owRound(bleed, unit) + ' ' + owUnit(unit) : 'None');
    setR('rcInType', fullbleed.checked ? 'Full-bleed (images to edge)' : 'Text-only');

    // Compact to-scale book preview (every trim drawn at the SAME scale so shapes/sizes compare)
    const book = el('spBook'), txt = el('spText'), cap = el('spCaption');
    if (book && cap) {
      if (t.w && t.h) {
        const S = 26; // px per inch, keeps even an 8.5×11 book small & portable
        book.style.display = 'block';
        book.style.width = (t.w * S) + 'px';
        book.style.height = (t.h * S) + 'px';
        txt.style.display = 'block';
        txt.style.top = (outside * S) + 'px';
        txt.style.bottom = (outside * S) + 'px';
        txt.style.left = (inside * S) + 'px';    // spine side = inside/gutter margin
        txt.style.right = (outside * S) + 'px';
        cap.innerHTML = t.w + ' × ' + t.h + ' in' +
          '<small>Shown to scale, every trim at the same scale to compare' +
          (bleed ? ' · plus ' + C.bleedIn + ' in bleed' : '') + '</small>';
      } else {
        book.style.display = 'none';
        cap.textContent = 'Choose a trim size to preview it.';
      }
    }
  }

  root.addEventListener('input', calc);
  root.addEventListener('change', calc);
  root.querySelectorAll('.unit-toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      unit = b.getAttribute('data-unit');
      root.querySelectorAll('.unit-toggle button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      calc();
    });
  });
  calc();
})();
