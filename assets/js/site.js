/* ==========================================================================
   Fast Action Property Group — shared site behaviour
   - Icon injection ([data-ic])
   - Header + footer chrome (consistent across pages)
   - Sticky-header scroll state, mobile menu
   - FAQ accordion, offer-form handling
   - Tweaks panel (host protocol + localStorage, applies across pages)
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------- icons */
  var ICONS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    shieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    handCoins: '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    calendar: '<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    hammer: '<path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h.86c.85 0 1.65.33 2.25.93l1.25 1.25"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.94 10.94 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.94 10.94 0 0 1-19.88 0Z"/><circle cx="12" cy="12" r="3"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    sparkles: '<path d="M9.94 14.34A1 1 0 0 0 9 13.5a1 1 0 0 0-.94.84l-.5 2.5-2.5.5a1 1 0 0 0 0 1.96l2.5.5.5 2.5a1 1 0 0 0 1.96 0l.5-2.5 2.5-.5a1 1 0 0 0 0-1.96l-2.5-.5zM18 2l1 4 4 1-4 1-1 4-1-4-4-1 4-1z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
  };
  function svg(name, cls) {
    var p = ICONS[name] || '';
    return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  function starSvg() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + ICONS.star + '</svg>';
  }
  function renderIcons(root) {
    (root || document).querySelectorAll('[data-ic]').forEach(function (el) {
      var name = el.getAttribute('data-ic');
      el.innerHTML = svg(name, el.getAttribute('data-ic-class') || 'ic');
      el.removeAttribute('data-ic');
    });
    (root || document).querySelectorAll('[data-stars]').forEach(function (el) {
      var n = parseInt(el.getAttribute('data-stars'), 10) || 5;
      el.classList.add('stars');
      el.innerHTML = Array(n).fill(starSvg()).join('');
      el.removeAttribute('data-stars');
    });
  }
  window.faIcon = svg;

  /* ----------------------------------------------------------- nav config */
  var NAV = [
    ['Home', 'index.html', 'home'],
    ['How it works', 'how-it-works.html', 'how'],
    ['About us', 'about.html', 'about'],
    ['Privacy', 'privacy-policy.html', 'privacy']
  ];
  var PHONE = '(786) 766-5922';
  var PHONE_HREF = 'tel:+17867665922';
  var EMAIL = 'info@fastactionpropertygroup.org';

  function buildHeader(active) {
    var navLinks = NAV.map(function (n) {
      return '<a href="' + n[1] + '"' + (n[2] === active ? ' class="active"' : '') + '>' + n[0] + '</a>';
    }).join('');
    return '' +
      '<div class="utilbar"><div class="wrap">' +
        '<div class="u-left">' + svg('mapPin') + '<span>Proudly buying houses across Florida — Miami to Jacksonville</span></div>' +
        '<div class="u-right">' +
          '<a href="' + PHONE_HREF + '">' + svg('phone') + PHONE + '</a>' +
          '<a href="mailto:' + EMAIL + '">' + svg('mail') + EMAIL + '</a>' +
        '</div>' +
      '</div></div>' +
      '<header class="site-header" id="siteHeader"><div class="wrap">' +
        '<a class="brand" href="index.html">' +
          '<img src="assets/brand/logo-mark.png" alt="Fast Action Property Group">' +
          '<span class="bt"><b>FAST ACTION</b><span>PROPERTY GROUP</span></span>' +
        '</a>' +
        '<nav class="nav">' + navLinks + '</nav>' +
        '<div class="header-cta">' +
          '<a class="header-phone" href="' + PHONE_HREF + '">' + svg('phone') + PHONE + '</a>' +
          '<a class="btn btn-primary" href="get-a-cash-offer.html">Get my cash offer</a>' +
          '<button class="menu-btn" id="menuBtn" aria-label="Menu">' + svg('home').replace(ICONS.home, ICONS.users && '') + '</button>' +
        '</div>' +
      '</div></header>' +
      '<div class="mobile-menu" id="mobileMenu">' + NAV.map(function (n) { return '<a href="' + n[1] + '">' + n[0] + '</a>'; }).join('') +
        '<a href="get-a-cash-offer.html">Get a cash offer</a></div>';
  }

  function buildFooter() {
    var cols = [
      ['Company', [['About us', 'about.html'], ['How it works', 'how-it-works.html'], ['Reviews', 'index.html#reviews'], ['Careers', '#']]],
      ['Sellers', [['Get a cash offer', 'get-a-cash-offer.html'], ['Inherited homes', '#'], ['Avoiding foreclosure', '#'], ['Sell as-is', '#']]],
      ['Areas', [['Miami', '#'], ['Orlando', '#'], ['Tampa', '#'], ['Jacksonville', '#']]],
      ['Legal', [['Privacy policy', 'privacy-policy.html'], ['Terms of use', '#'], ['Licenses', '#'], ['Accessibility', '#']]]
    ];
    var colHtml = cols.map(function (c) {
      return '<div class="footer-col"><h4>' + c[0] + '</h4>' +
        c[1].map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join('') + '</div>';
    }).join('');
    return '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<img src="assets/brand/logo-lockup-cream.png" alt="Fast Action Property Group">' +
          '<p>A fair cash offer for your Florida house — on your timeline, with no fees, no repairs, and no obligation.</p>' +
          '<div class="fcontact">' +
            '<a href="' + PHONE_HREF + '">' + svg('phone') + PHONE + '</a>' +
            '<a href="mailto:' + EMAIL + '">' + svg('mail') + EMAIL + '</a>' +
          '</div>' +
        '</div>' + colHtml +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© 2026 Fast Action Property Group, LLC. All rights reserved.</span>' +
        '<span class="fdisc">Fast Action Property Group is a real-estate investment company, not a licensed broker or agent. Offers are non-binding estimates. We buy houses in any condition.</span>' +
      '</div>' +
    '</div></footer>';
  }

  /* ----------------------------------------------------------- interactions */
  function initChrome() {
    var headerMount = document.getElementById('site-header');
    var footerMount = document.getElementById('site-footer');
    var active = document.body.getAttribute('data-page') || '';
    if (headerMount) headerMount.innerHTML = buildHeader(active);
    if (footerMount) footerMount.innerHTML = buildFooter();

    renderIcons(document);

    // proper menu icon (replace the placeholder hack above)
    var mb = document.getElementById('menuBtn');
    if (mb) mb.innerHTML = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M4 6h16M4 18h16"/></svg>';

    var header = document.getElementById('siteHeader');
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var menu = document.getElementById('mobileMenu');
    if (mb && menu) {
      mb.addEventListener('click', function () {
        menu.classList.toggle('open');
      });
    }
  }

  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        var ans = item.querySelector('.faq-a');
        var open = item.classList.toggle('open');
        ans.style.maxHeight = open ? (ans.querySelector('.inner').offsetHeight + 8) + 'px' : '0px';
      });
    });
  }

  function initForms() {
    document.querySelectorAll(‘form[data-offer-form]’).forEach(function (form) {
      form.addEventListener(‘submit’, function (e) {
        e.preventDefault();

        var data = {};
        new FormData(form).forEach(function (v, k) { data[k] = v; });
        var first = String(data.name || ‘there’).trim().split(‘ ‘)[0] || ‘there’;

        // Show success immediately so the user isn’t waiting on the network.
        var card = form.closest(‘[data-form-card]’) || form.parentNode;
        card.innerHTML =
          ‘<div class="form-success">’ +
            ‘<div class="badge">’ + svg(‘check’) + ‘</div>’ +
            ‘<h3>You’re all set, ‘ + first + ‘.</h3>’ +
            ‘<p>Thanks — a local Fast Action specialist will review the details and reach out with your no-obligation cash offer, usually within 24 hours.</p>’ +
          ‘</div>’;
        renderIcons(card);

        // Fire-and-forget POST to the serverless handler.
        fetch(‘/api/contact’, {
          method: ‘POST’,
          headers: { ‘Content-Type’: ‘application/json’ },
          body: JSON.stringify(data)
        }).catch(function (err) {
          console.warn(‘Lead submission error:’, err);
        });
      });
    });
  }

  /* ----------------------------------------------------------- tweaks */
  var TWEAKS = [
    { key: 'accent', label: 'Accent color', type: 'swatch',
      options: [['Signature gold', '#c8962a', '#a87a1e'], ['Forest', '#3f7d5a', '#33644795'.slice(0, 7)], ['Clay', '#bf6a4a', '#9c5238'], ['Slate blue', '#4a6b9c', '#3a5680']],
      def: 'Signature gold' },
    { key: 'heading', label: 'Headline feel', type: 'seg', options: ['Editorial', 'Modern'], def: 'Editorial' },
    { key: 'rhythm', label: 'Section spacing', type: 'seg', options: ['Cozy', 'Airy'], def: 'Airy' }
  ];
  var STORE = 'fa_tweaks_v1';

  function loadTweaks() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function saveTweaks(t) {
    try { localStorage.setItem(STORE, JSON.stringify(t)); } catch (e) {}
  }
  function applyTweaks(t) {
    var root = document.documentElement;
    // accent
    var acc = TWEAKS[0].options.filter(function (o) { return o[0] === (t.accent || TWEAKS[0].def); })[0] || TWEAKS[0].options[0];
    root.style.setProperty('--fa-accent', acc[1]);
    root.style.setProperty('--fa-accent-active', acc[2]);
    // heading
    if ((t.heading || TWEAKS[1].def) === 'Modern') {
      root.style.setProperty('--font-display', "'Hanken Grotesk', sans-serif");
    } else {
      root.style.removeProperty('--font-display');
    }
    // rhythm
    root.style.setProperty('--section-pad', (t.rhythm || TWEAKS[2].def) === 'Cozy' ? '72px' : '96px');
  }

  function buildPanel(t) {
    var panel = document.createElement('div');
    panel.id = 'tweak-panel';
    var html = '<div class="tp-head"><b>Tweaks</b><button id="tpClose" aria-label="Close">' + svg('x') + '</button></div>';
    TWEAKS.forEach(function (tw) {
      html += '<div class="tp-sec"><label>' + tw.label + '</label>';
      if (tw.type === 'swatch') {
        html += '<div class="swatches">' + tw.options.map(function (o) {
          var on = (t[tw.key] || tw.def) === o[0];
          return '<button class="swatch' + (on ? ' on' : '') + '" data-key="' + tw.key + '" data-val="' + o[0] + '" title="' + o[0] + '" style="background:' + o[1] + '"></button>';
        }).join('') + '</div>';
      } else {
        html += '<div class="segmented">' + tw.options.map(function (o) {
          var on = (t[tw.key] || tw.def) === o;
          return '<button class="' + (on ? 'on' : '') + '" data-key="' + tw.key + '" data-val="' + o + '">' + o + '</button>';
        }).join('') + '</div>';
      }
      html += '</div>';
    });
    panel.innerHTML = html;
    document.body.appendChild(panel);
    renderIcons(panel);

    panel.querySelectorAll('[data-key]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-key');
        var val = btn.getAttribute('data-val');
        t[key] = val;
        saveTweaks(t);
        applyTweaks(t);
        // refresh selected states within this group
        var group = btn.parentNode;
        group.querySelectorAll('[data-key="' + key + '"]').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: t }, '*');
      });
    });
    return panel;
  }

  function initTweaks() {
    var t = loadTweaks();
    applyTweaks(t);
    var panel = buildPanel(t);
    var close = document.getElementById('tpClose');
    if (close) close.addEventListener('click', function () {
      panel.classList.remove('show');
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    });
    window.addEventListener('message', function (e) {
      var ty = e && e.data && e.data.type;
      if (ty === '__activate_edit_mode') panel.classList.add('show');
      else if (ty === '__deactivate_edit_mode') panel.classList.remove('show');
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  }

  /* ----------------------------------------------------------- boot */
  function boot() {
    initChrome();
    initFAQ();
    initForms();
    initTweaks();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
