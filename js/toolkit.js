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
   12b, COVER TEMPLATE CALCULATOR (v2, platform + paper aware)
   ============================================================ */
(function () {
  const root = document.getElementById('coverCalc');
  if (!root) return;
  const el = function (id) { return document.getElementById(id); };

  // ---- cover-calculator config ----
  const CC = {
    bleedIn: 0.125,            // each side
    safeFromTrimIn: 0.25,      // keep text inside this from the trim edge
    safeFromSpineIn: 0.0625,   // keep text this far off the spine fold
    hardcoverWrapIn: 0.591,    // KDP case-wrap, each side
    hardcoverHingeIn: 0.394,   // gap between spine and each cover
    dpi: 300,
    spineTextMinPages: 100,
    paper: {
      white:  { label: 'White',           t: 0.002252 },
      cream:  { label: 'Cream',           t: 0.0025 },
      scolor: { label: 'Standard colour', t: 0.0032 },
      pcolor: { label: 'Premium colour',  t: 0.002347 }
    },
    platforms: {
      kdp:    { label: 'Amazon KDP',  min: 24, max: 828,
        sizes: [ [5,8],[5.06,7.81],[5.25,8],[5.5,8.5],[6,9],[6.14,9.21],[6.69,9.61],[7,10],[7.44,9.69],[7.5,9.25],[8,10],[8.25,8.25],[8.5,11] ] },
      ingram: { label: 'IngramSpark', min: 18, max: 1200,
        sizes: [ [5,8],[5.25,8],[5.5,8.5],[6,9],[6.14,9.21],[6.69,9.61],[7,10],[7.44,9.69],[8,10],[8.25,11],[8.5,11] ] },
      lulu:   { label: 'Lulu',        min: 32, max: 800,
        sizes: [ [4.25,6.87],[5,8],[5.5,8.5],[6,9],[6.14,9.21],[6.69,9.61],[7.44,9.69],[8,10],[8.25,10.75],[8.5,11] ] }
    }
  };

  // ---- state ----
  let unit = 'in', mode = 'preset', platform = 'kdp', paperKey = 'white', coverKey = 'paperback';

  // ---- formatting helpers ----
  const inStr = function (n) { return n.toFixed(4) + '"'; };
  const mmStr = function (n) { return (n * 25.4).toFixed(2) + ' mm'; };
  const both  = function (n) { return inStr(n) + ' / ' + mmStr(n); };
  const dimU  = function (n) { return unit === 'mm' ? (n * 25.4).toFixed(1) + ' mm' : n.toFixed(3) + '"'; };
  const trimLabel = function (w, h) { return (Number.isInteger(w) ? w : w) + ' × ' + h + ' in'; };

  // ---- populate trim dropdown for the active platform ----
  function fillTrims() {
    const list = CC.platforms[platform].sizes;
    el('ccTrim').innerHTML = list.map(function (s, i) {
      return '<option value="' + i + '">' + s[0] + '" × ' + s[1] + '"</option>';
    }).join('');
    // default to 6×9 if present
    const idx = list.findIndex(function (s) { return s[0] === 6 && s[1] === 9; });
    el('ccTrim').value = idx >= 0 ? idx : 0;
    el('ccTrimHint').textContent = list.length + ' standard sizes for ' + CC.platforms[platform].label;
  }

  function getTrim() {
    if (mode === 'custom') return { w: owNum(el('ccW').value), h: owNum(el('ccH').value) };
    const s = CC.platforms[platform].sizes[parseInt(el('ccTrim').value, 10)] || [6, 9];
    return { w: s[0], h: s[1] };
  }

  // segmented / card button groups
  function wireGroup(id, attr, onPick) {
    const grp = el(id); if (!grp) return;
    grp.addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b || !grp.contains(b)) return;
      grp.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      onPick(b.getAttribute(attr));
    });
  }

  function copyRow(text, btn) {
    const done = function () { btn.classList.add('copied'); setTimeout(function () { btn.classList.remove('copied'); }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); done();
    }
  }
  const copySvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const tickSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  // ---- print-template SVG diagram ----
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function coverLabel() { return ({ paperback: 'Paperback', hardcover: 'Hardcover case', dustjacket: 'Dust jacket', frenchflaps: 'French flaps' })[coverKey] || 'Paperback'; }

  function buildSvg(t, spine, hc, outer, hinge, fullW, fullH, pg, isbn) {
    const red = '#b23a48', redLine = '#c45b63', bleedFill = '#f7dde0', ink = '#8a2b33', crop = '#1b2a4a';
    const safeCol = '#cf9fa6';
    const M = 0.32, labelH = 1.3;
    const vbW = fullW + 2 * M, vbH = fullH + 2 * M + labelH;
    const ox = M, oy = M;
    const innerW = (2 * t.w) + spine + (2 * hinge);
    const trimX = ox + outer, trimY = oy + outer, trimH = t.h;
    const backX = trimX, backW = t.w;
    const spineX = trimX + t.w, spineW = spine + (2 * hinge);
    const frontX = spineX + spineW, frontW = t.w;
    const trimBottom = trimY + trimH;
    const st = CC.safeFromTrimIn, ss = CC.safeFromSpineIn;
    const sw = 0.012, tick = 0.2, gap = 0.04;
    let s = '<svg viewBox="0 0 ' + vbW.toFixed(3) + ' ' + vbH.toFixed(3) + '" xmlns="http://www.w3.org/2000/svg" font-family="Outfit, system-ui, sans-serif">';
    // bleed + trim
    s += '<rect x="' + ox + '" y="' + oy + '" width="' + fullW + '" height="' + fullH + '" fill="' + bleedFill + '"/>';
    s += '<rect x="' + trimX + '" y="' + trimY + '" width="' + innerW + '" height="' + trimH + '" fill="#fff" stroke="' + redLine + '" stroke-width="' + sw + '"/>';
    // safe areas
    s += '<rect x="' + (backX + st) + '" y="' + (trimY + st) + '" width="' + (backW - st - ss) + '" height="' + (trimH - 2 * st) + '" fill="none" stroke="' + safeCol + '" stroke-width="' + (sw * 0.8) + '" stroke-dasharray="0.09 0.06"/>';
    s += '<rect x="' + (frontX + ss) + '" y="' + (trimY + st) + '" width="' + (frontW - st - ss) + '" height="' + (trimH - 2 * st) + '" fill="none" stroke="' + safeCol + '" stroke-width="' + (sw * 0.8) + '" stroke-dasharray="0.09 0.06"/>';
    // spine fold lines (dashed red, full height)
    s += '<line x1="' + spineX + '" y1="' + oy + '" x2="' + spineX + '" y2="' + (oy + fullH) + '" stroke="' + red + '" stroke-width="' + sw + '" stroke-dasharray="0.11 0.07"/>';
    s += '<line x1="' + (spineX + spineW) + '" y1="' + oy + '" x2="' + (spineX + spineW) + '" y2="' + (oy + fullH) + '" stroke="' + red + '" stroke-width="' + sw + '" stroke-dasharray="0.11 0.07"/>';
    // crop marks (top & bottom) at the four vertical guides
    [trimX, spineX, spineX + spineW, trimX + innerW].forEach(function (x) {
      s += '<line x1="' + x + '" y1="' + (oy - tick) + '" x2="' + x + '" y2="' + (oy - gap) + '" stroke="' + crop + '" stroke-width="' + sw + '"/>';
      s += '<line x1="' + x + '" y1="' + (oy + fullH + gap) + '" x2="' + x + '" y2="' + (oy + fullH + tick) + '" stroke="' + crop + '" stroke-width="' + sw + '"/>';
    });
    // horizontal crop ticks at outer trim corners
    [[trimX, trimY], [trimX + innerW, trimY], [trimX, trimBottom], [trimX + innerW, trimBottom]].forEach(function (p) {
      const dir = (p[0] === trimX) ? -1 : 1;
      s += '<line x1="' + (p[0] + dir * gap) + '" y1="' + p[1] + '" x2="' + (p[0] + dir * tick) + '" y2="' + p[1] + '" stroke="' + crop + '" stroke-width="' + sw + '"/>';
    });
    // face labels
    const txt = function (str, x, y, size, fill, extra) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" text-anchor="middle" ' + (extra || '') + '>' + esc(str) + '</text>'; };
    s += txt('Back cover', backX + backW / 2, trimY + trimH / 2 + 0.06, 0.24, ink, 'font-weight="600"');
    s += txt('Front cover', frontX + frontW / 2, trimY + trimH / 2 + 0.06, 0.24, ink, 'font-weight="600"');
    const scx = spineX + spineW / 2, scy = trimY + trimH / 2;
    s += '<text x="' + scx + '" y="' + scy + '" font-size="0.12" fill="' + ink + '" text-anchor="middle" font-weight="700" transform="rotate(90 ' + scx + ' ' + scy + ')">Spine</text>';
    // barcode (paperback-style covers only), bottom-right of back cover
    if (!hc) {
      const bw = 2.0, bh = 1.2, bm = 0.25;
      const bX = spineX - bm - bw, bY = trimBottom - bm - bh;
      s += '<rect x="' + bX + '" y="' + bY + '" width="' + bw + '" height="' + bh + '" fill="#fff" stroke="#c9ccd4" stroke-width="' + sw + '"/>';
      const innerX = bX + 0.16, innerY = bY + 0.16, maxX = bX + bw - 0.16, barH = bh - 0.52;
      const pat = [0.03, 0.016, 0.026, 0.016, 0.034, 0.016]; let bxp = innerX, i = 0;
      while (bxp < maxX - 0.02) { const w = pat[i % pat.length]; s += '<rect x="' + bxp.toFixed(3) + '" y="' + innerY.toFixed(3) + '" width="' + w + '" height="' + barH.toFixed(3) + '" fill="#1b2a4a"/>'; bxp += w + 0.018; i++; }
      s += '<text x="' + (bX + bw / 2) + '" y="' + (bY + bh - 0.14) + '" font-size="0.12" fill="#5b5b5b" text-anchor="middle">' + esc(isbn || 'ISBN barcode') + '</text>';
    }
    // bottom meta + dimension labels
    const baseY = oy + fullH + tick + 0.34;
    s += '<text x="' + ox + '" y="' + baseY + '" font-size="0.14" fill="' + ink + '" font-weight="700">' + esc(CC.platforms[platform].label + ' · ' + coverLabel()) + '</text>';
    s += '<text x="' + ox + '" y="' + (baseY + 0.28) + '" font-size="0.13" fill="#8a8a8a">' + esc(t.w + '×' + t.h + ' · ' + pg + ' pp · spine ' + inStr(spine)) + '</text>';
    s += '<text x="' + ox + '" y="' + (baseY + 0.52) + '" font-size="0.13" fill="#8a8a8a">' + esc('Document ' + inStr(fullW) + ' × ' + inStr(fullH)) + '</text>';
    s += txt(t.w + '" × ' + t.h + '"', backX + backW / 2, baseY, 0.15, '#6a6a6a');
    s += txt(dimU(spine), spineX + spineW / 2, baseY, 0.13, '#6a6a6a');
    s += txt(t.w + '" × ' + t.h + '"', frontX + frontW / 2, baseY, 0.15, '#6a6a6a');
    s += '</svg>';
    return s;
  }

  function calc() {
    const t = getTrim(), pg = owNum(el('ccPages').value);
    const thick = CC.paper[paperKey].t;
    const spine = pg * thick;
    const hc = coverKey === 'hardcover';
    const wrap = hc ? CC.hardcoverWrapIn : 0;
    const hinge = hc ? CC.hardcoverHingeIn : 0;
    const outer = hc ? wrap : CC.bleedIn;
    const fullW = (2 * t.w) + spine + (2 * hinge) + (2 * outer);
    const fullH = t.h + (2 * outer);
    const ready = t.w > 0 && t.h > 0 && pg > 0;

    // page-count hint + validity
    const plat = CC.platforms[platform];
    const pagesHint = el('ccPagesHint');
    if (pagesHint) {
      if (pg && (pg < plat.min || pg > plat.max)) {
        pagesHint.innerHTML = '<span style="color:#b23b3b">' + plat.label + ' allows ' + plat.min + '–' + plat.max + ' pages.</span>';
      } else {
        pagesHint.textContent = 'Total pages including front and back matter — ' + plat.label + ' allows ' + plat.min + '–' + plat.max + '.';
      }
    }

    // SPINE HERO
    const sm = el('ccSpineMain'), su = el('ccSpineUnit'), sa = el('ccSpineAlt');
    if (sm) {
      if (ready) {
        if (unit === 'mm') { sm.textContent = (spine * 25.4).toFixed(2); su.textContent = 'mm'; sa.textContent = spine.toFixed(4) + ' inches'; }
        else { sm.textContent = spine.toFixed(4); su.textContent = 'inches'; sa.textContent = (spine * 25.4).toFixed(2) + ' mm'; }
      } else { sm.textContent = '—'; su.textContent = unit === 'mm' ? 'mm' : 'inches'; sa.textContent = 'Enter trim size and page count.'; }
    }

    // DIAGRAM (precise print-template SVG)
    const stage = el('ccStage');
    if (stage) {
      if (ready) {
        const isbn = (el('ccIsbn').value || '').trim();
        stage.innerHTML = buildSvg(t, spine, hc, outer, hinge, fullW, fullH, pg, isbn);
      } else {
        stage.innerHTML = '<div class="ccd-empty">Enter your trim size and page count to preview the full-wrap template.</div>';
      }
    }

    // FULL COVER DIMENSIONS (always dual units, each copyable)
    const dims = el('ccDims');
    if (dims) {
      if (ready) {
        const rows = [
          { label: 'Full cover width', sub: 'Back + Spine + Front + Bleed', val: both(fullW) },
          { label: 'Full cover height', sub: 'Trim height + ' + (2 * outer).toFixed(3) + '" ' + (hc ? 'wrap' : 'bleed'), val: both(fullH) },
          { label: 'Pixel width (' + CC.dpi + ' DPI)', sub: '', val: Math.round(fullW * CC.dpi) + ' px' },
          { label: 'Pixel height (' + CC.dpi + ' DPI)', sub: '', val: Math.round(fullH * CC.dpi) + ' px', gap: true },
          { label: 'Bleed (each side)', sub: '', val: both(CC.bleedIn) },
          { label: 'Safe zone (from trim)', sub: '', val: both(CC.safeFromTrimIn) },
          { label: 'Safe zone (from spine)', sub: '', val: both(CC.safeFromSpineIn) }
        ];
        if (hc) {
          rows.push({ label: 'Case wrap (each side)', sub: '', val: both(wrap) });
          rows.push({ label: 'Hinge (each side)', sub: '', val: both(hinge) });
        }
        dims.innerHTML = rows.map(function (r) {
          return '<div class="cc-dimrow' + (r.gap ? ' gap' : '') + '">' +
            '<span class="cc-dim-label">' + r.label + (r.sub ? '<small>' + r.sub + '</small>' : '') + '</span>' +
            '<span class="cc-dim-right"><span class="cc-dim-val">' + r.val + '</span>' +
            '<button type="button" class="cc-copy" data-copy="' + r.val.replace(/"/g, '&quot;') + '" aria-label="Copy ' + r.label + '">' + copySvg + '</button></span></div>';
        }).join('');
      } else {
        dims.innerHTML = '<p style="color:var(--ink-soft);font-size:.9rem;margin:4px 0;">Enter your trim size and page count to see every dimension.</p>';
      }
    }

    // QUICK REFERENCE
    const qref = el('ccQref');
    if (qref) {
      const rowsPg = [100, 150, 200, 250, 300, 350, 400, 500];
      // nearest row to current page count
      let near = -1, best = 1e9;
      rowsPg.forEach(function (p, i) { const d = Math.abs(p - pg); if (pg && d < best) { best = d; near = i; } });
      qref.innerHTML = rowsPg.map(function (p, i) {
        const w = p * CC.paper.white.t, c = p * CC.paper.cream.t;
        return '<tr' + (i === near ? ' class="cur"' : '') + '><td>' + p + '</td><td>' + both(w) + '</td><td>' + both(c) + '</td></tr>';
      }).join('');
    }

    // SEND-TO-OW recap + hidden field
    const setR = function (id, v) { const e = el(id); if (e) e.textContent = v; };
    setR('rcTrim', ready ? dimU(t.w) + ' × ' + dimU(t.h) : '—');
    setR('rcPages', pg || '—');
    setR('rcBinding', CC.platforms[platform].label + ' · ' + coverKey);
    setR('rcPaper', CC.paper[paperKey].label);
    setR('rcSpine', ready ? inStr(spine) + ' / ' + mmStr(spine) : '—');
    setR('rcFull', ready ? inStr(fullW) + ' × ' + inStr(fullH) : '—');
    const hid = el('cvHidden');
    if (hid) hid.value = CC.platforms[platform].label + ' · ' + coverKey + ' · trim ' + t.w + '×' + t.h + 'in · ' + pg + ' pages · ' + CC.paper[paperKey].label +
      ' → spine ' + inStr(spine) + ' · full cover ' + inStr(fullW) + ' × ' + inStr(fullH) + ' (' + Math.round(fullW * CC.dpi) + '×' + Math.round(fullH * CC.dpi) + 'px @' + CC.dpi + 'DPI)';
  }

  // ---- wire controls ----
  wireGroup('ccMode', 'data-mode', function (v) {
    mode = v;
    el('ccTrimField').hidden = (v === 'custom');
    el('ccCustom').hidden = (v !== 'custom');
    calc();
  });
  wireGroup('ccPlatform', 'data-plat', function (v) { platform = v; fillTrims(); calc(); });
  wireGroup('ccPaper', 'data-paper', function (v) { paperKey = v; calc(); });
  wireGroup('ccCover', 'data-cover', function (v) { coverKey = v; calc(); });
  wireGroup('ccUnit', 'data-unit', function (v) { unit = v; calc(); });

  root.addEventListener('input', function (e) { if (e.target.matches('input, select')) calc(); });
  root.addEventListener('change', function (e) { if (e.target.matches('input, select')) calc(); });

  // copy buttons (delegated)
  root.addEventListener('click', function (e) {
    const b = e.target.closest('.cc-copy'); if (!b) return;
    copyRow(b.getAttribute('data-copy'), b);
  });
  const copyAll = el('ccCopyAll');
  if (copyAll) copyAll.addEventListener('click', function () {
    const lines = [];
    el('ccDims').querySelectorAll('.cc-dimrow').forEach(function (r) {
      const lab = r.querySelector('.cc-dim-label').childNodes[0].textContent.trim();
      const val = r.querySelector('.cc-dim-val').textContent.trim();
      lines.push(lab + ': ' + val);
    });
    copyRow('OW Cover Specs\n' + lines.join('\n'), copyAll);
    const orig = copyAll.innerHTML;
    copyAll.innerHTML = tickSvg + 'Copied'; setTimeout(function () { copyAll.innerHTML = orig; }, 1200);
  });

  fillTrims();
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
  const chat = document.getElementById('ideaChat');
  if (!chat) return;
  const log = document.getElementById('chatLog');
  const inputArea = document.getElementById('chatInput');
  const state = { stage: '', description: '', goal: '', name: '', email: '', whatsapp: '' };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function analyse(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    let best = null, bestScore = 0;
    OW_IDEA.genres.forEach(function (g) {
      let n = 0; g.kw.forEach(function (k) { if (t.indexOf(k) !== -1) n++; });
      if (n > bestScore) { bestScore = n; best = g; }
    });
    return { genre: best ? best.label : 'hard to place from a short description', path: best ? best.path : 'grow', matched: bestScore > 0 };
  }

  function addMsg(who, html) {
    const av = who === 'bot' ? 'OW' : (state.name ? state.name.trim().charAt(0).toUpperCase() : 'Y');
    const m = document.createElement('div');
    m.className = 'msg ' + who;
    m.innerHTML = '<span class="msg-av" aria-hidden="true">' + av + '</span><div class="bubble">' + html + '</div>';
    log.appendChild(m); scrollDown(); return m;
  }
  function bot(html, cb, delay) {
    const t = document.createElement('div');
    t.className = 'msg bot';
    t.innerHTML = '<span class="msg-av" aria-hidden="true">OW</span><div class="bubble typing"><i></i><i></i><i></i></div>';
    log.appendChild(t); scrollDown();
    setTimeout(function () { t.remove(); addMsg('bot', html); if (cb) cb(); }, delay || 850);
  }
  function clearInput() { inputArea.innerHTML = ''; }

  function quickReplies(options) {
    clearInput();
    const wrap = document.createElement('div'); wrap.className = 'quick';
    options.forEach(function (o) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = o.label;
      b.addEventListener('click', function () { addMsg('me', esc(o.label)); clearInput(); o.go(o.value); });
      wrap.appendChild(b);
    });
    inputArea.appendChild(wrap);
  }

  function textInput(placeholder, minChars, onSubmit) {
    clearInput();
    const row = document.createElement('div'); row.className = 'chat-textrow';
    const ta = document.createElement('textarea'); ta.rows = 2; ta.placeholder = placeholder;
    const send = document.createElement('button'); send.type = 'button'; send.className = 'chat-send'; send.setAttribute('aria-label', 'Send'); send.textContent = '→';
    const err = document.createElement('div'); err.className = 'chat-err'; err.style.display = 'none';
    function submit() {
      const v = ta.value.trim();
      if (v.length < (minChars || 1)) { err.textContent = 'A little more detail helps — aim for a sentence or two.'; err.style.display = 'block'; return; }
      addMsg('me', esc(v)); clearInput(); onSubmit(v);
    }
    send.addEventListener('click', submit);
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });
    row.appendChild(ta); row.appendChild(send);
    inputArea.appendChild(row); inputArea.appendChild(err); ta.focus();
  }

  function contactForm(onSubmit) {
    clearInput();
    const f = document.createElement('div'); f.className = 'chat-form';
    f.innerHTML =
      '<div class="chat-field"><label>Your name</label><input id="cfName" type="text" placeholder="Full name"></div>' +
      '<div class="chat-field"><label>Email</label><input id="cfEmail" type="email" placeholder="you@email.com"></div>' +
      '<div class="chat-field"><label>WhatsApp (optional)</label><input id="cfWhats" type="tel" placeholder="+234 …"></div>' +
      '<div class="chat-err" id="cfErr" style="display:none"></div>' +
      '<button type="button" class="btn btn-gold btn-lg" id="cfSend">Get my Book Idea Report →</button>';
    inputArea.appendChild(f);
    document.getElementById('cfSend').addEventListener('click', function () {
      const n = document.getElementById('cfName').value.trim();
      const em = document.getElementById('cfEmail').value.trim();
      const wa = document.getElementById('cfWhats').value.trim();
      const err = document.getElementById('cfErr');
      if (!n || em.indexOf('@') < 1) { err.textContent = 'Please add your name and a valid email so we can send your report.'; err.style.display = 'block'; return; }
      state.name = n; state.email = em; state.whatsapp = wa;
      addMsg('me', esc(n + ' · ' + em)); clearInput(); onSubmit();
    });
  }

  function buildReport() {
    const a = analyse(state.description);
    const goalPath = { sell: 'grow', agent: 'agent', print: 'print', unsure: a.path };
    const path = goalPath[state.goal] || a.path;
    const p = OW_IDEA.paths[path];
    const stageLine = {
      idea: 'You’re at the idea stage — the perfect time to shape it before a word is wasted.',
      writing: 'You’re actively writing — momentum is everything from here.',
      ready: 'Your manuscript is ready — that’s the hardest part done.'
    }[state.stage] || '';
    const genreLine = a.matched
      ? 'From what you shared, this reads like <b>' + a.genre + '</b>.'
      : 'Your idea is <b>' + a.genre + '</b> — which just means it’s worth a proper conversation to place it.';
    const marketLine = a.matched
      ? 'That’s a category with a real, reachable readership. The key is producing it to a professional standard and getting it in front of the right readers.'
      : 'The best next step is a quick chat so we can place it and map the right path.';
    const links = p.links.map(function (l) { return '<a class="btn btn-outline-ink" href="' + l[1] + '">' + l[0] + ' →</a>'; }).join('');
    const report =
      '<div class="ir">' +
        '<span class="ir-tag">Your Book Idea Report</span>' +
        '<h4>Here’s my honest first look</h4>' +
        (stageLine ? '<p>' + stageLine + '</p>' : '') +
        '<p>' + genreLine + '</p>' +
        '<p>' + marketLine + '</p>' +
        '<p class="ir-rec">' + p.rec + '</p>' +
        '<div class="ir-links">' + links + '<a class="btn btn-gold" href="consultation.html">Book a consultation →</a></div>' +
      '</div>';
    bot('Thanks, ' + esc(state.name.split(' ')[0] || 'there') + '! I’ve put together your report 👇', function () {
      bot(report, function () {
        bot('This is a helpful first look, not a verdict — every book deserves a real conversation. I’ve sent a copy to the OW team and they’ll follow up on your email. 💛', function () {
          clearInput();
          const wrap = document.createElement('div'); wrap.className = 'quick';
          const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Check another idea';
          b.addEventListener('click', function () { location.reload(); });
          wrap.appendChild(b); inputArea.appendChild(wrap);
        });
      }, 1100);
    });
    try {
      const data = new FormData();
      data.append('_subject', 'AI Book Assistant — new idea submitted');
      data.append('Name', state.name);
      data.append('Email', state.email);
      data.append('WhatsApp', state.whatsapp);
      data.append('Stage', state.stage);
      data.append('Goal', state.goal);
      data.append('Book idea', state.description);
      data.append('Detected', a.genre + ' · recommended path: ' + path);
      fetch(OW_IDEA.formspree, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    } catch (e) { /* noop */ }
  }

  // ---- conversation flow ----
  function afterGoal(v) { state.goal = v; bot('Perfect. Where should I send your free Book Idea Report?', function () { contactForm(buildReport); }); }
  function q3() {
    bot('Last question before your report: what matters most to you right now?', function () {
      quickReplies([
        { label: 'Publish & sell online', value: 'sell', go: afterGoal },
        { label: 'Reach a literary agent', value: 'agent', go: afterGoal },
        { label: 'Printed copies in hand', value: 'print', go: afterGoal },
        { label: 'Not sure yet', value: 'unsure', go: afterGoal }
      ]);
    });
  }
  function q2() {
    bot('Got it. In a sentence or two, what’s your book about — and who’s it for?', function () {
      textInput('e.g. A memoir about rebuilding after loss, for women starting over in midlife…', 25, function (v) { state.description = v; q3(); });
    });
  }
  function afterStage(v) { state.stage = v; q2(); }
  function start() {
    bot('Hi, I’m Ola — OW’s book assistant. 👋', function () {
      bot('I’ll ask a few quick questions, then give you an honest first look at your idea and the path to publishing it.', function () {
        bot('First up — where are you with your book?', function () {
          quickReplies([
            { label: 'Just an idea', value: 'idea', go: afterStage },
            { label: "I'm writing it", value: 'writing', go: afterStage },
            { label: 'Manuscript ready', value: 'ready', go: afterStage }
          ]);
        });
      });
    });
  }

  start();
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
