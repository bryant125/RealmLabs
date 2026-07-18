// footer.js — shared site footer for MamaBee legal/sub pages.
// Injects the same footer used on the landing page, with correct links,
// plus sticky-nav shadow and table-of-contents scroll-spy.
(function () {
  var BEE = 'assets/bee.png';
  var footerHTML = [
    '<footer class="footer">',
    '  <div class="footer-comb" aria-hidden="true">',
    '    <span></span><span></span><span></span><span></span><span></span><span></span>',
    '    <span></span><span></span><span></span><span></span><span></span><span></span>',
    '  </div>',
    '  <div class="footer-glow" aria-hidden="true"></div>',
    '  <div class="wrap footer-inner">',
    '    <div class="footer-brandcol">',
    '      <span class="brand footer-brand"><img class="bee-logo" src="' + BEE + '" alt="" width="52" height="52" /> MamaBee</span>',
    '      <p class="footer-tag">Track every little moment, gently. The honey-warm baby tracker — made with \uD83C\uDF6F by Realm Labs Studio.</p>',
    '      <div class="footer-social">',
    '        <a class="soc" href="https://instagram.com/mamabee.babytracker" target="_blank" rel="noopener" aria-label="MamaBee on Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>',
    '        <a class="soc" href="https://tiktok.com/@mamabee.app" target="_blank" rel="noopener" aria-label="MamaBee on TikTok"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.1 1.6 3.7 3.5 4v2.7c-1.3 0-2.6-.4-3.6-1.1v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.8 2.8 0 1 0 2 2.7V3h2.8Z"/></svg></a>',
    '      </div>',
    '      <a class="appstore" href="#" aria-label="Download on the App Store"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.23 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.03 2.28-1.27 3.13-2.53.99-1.45 1.4-2.85 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13M14.62 4.7c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.98-1.08 3.15 1.14.09 2.3-.58 3.01-1.44"/></svg><span><span class="as-top">Download on the</span><span class="as-big">App Store</span></span></a>',
    '    </div>',
    '    <nav class="footer-links" aria-label="Footer">',
    '      <div class="footer-col"><h4>Product</h4><a href="index.html#how">How it works</a><a href="index.html#features">Features</a><a href="index.html#ai">AI</a><a href="index.html#download">Download</a></div>',
    '      <div class="footer-col"><h4>Company</h4><a href="#">About</a><a href="contact.html">Contact</a></div>',
    '      <div class="footer-col"><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="support.html">Support</a></div>',
    '      <div class="footer-col"><h4>Language</h4>',
    '        <select class="lang-select" id="lang-select" aria-label="Choose language">',
    '          <option value="en">English</option><option value="zh-Hans">\u7b80\u4f53\u4e2d\u6587</option><option value="zh-Hant">\u7e41\u9ad4\u4e2d\u6587</option><option value="ja">\u65e5\u672c\u8a9e</option><option value="ko">\ud55c\uad6d\uc5b4</option><option value="de">Deutsch</option><option value="es">Espa\u00f1ol</option><option value="fr">Fran\u00e7ais</option><option value="it">Italiano</option><option value="ru">\u0420\u0443\u0441\u0441\u043a\u0438\u0439</option><option value="th">\u0e44\u0e17\u0e22</option><option value="vi">Ti\u1ebfng Vi\u1ec7t</option>',
    '        </select>',
    '      </div>',
    '    </nav>',
    '  </div>',
    '  <div class="wrap footer-bottom">',
    '    <span>\u00a9 2026 Realm Labs Studio \u00b7 Made with \uD83C\uDF6F for tired parents everywhere</span>',
    '    <span class="fb-links"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="mailto:support@realmlabs.app">Support</a></span>',
    '  </div>',
    '</footer>'
  ].join('\n');

  var slot = document.getElementById('site-footer');
  if (slot) slot.outerHTML = footerHTML;

  // sticky nav shadow
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // TOC scroll-spy
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.legal-toc a'));
  if (tocLinks.length) {
    var targets = tocLinks.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      return { link: a, el: document.getElementById(id) };
    }).filter(function (t) { return t.el; });

    var spy = function () {
      var top = window.scrollY + 120;
      var current = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.offsetTop <= top) current = targets[i];
      }
      tocLinks.forEach(function (a) { a.classList.remove('active'); });
      if (current) current.link.classList.add('active');
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
})();
