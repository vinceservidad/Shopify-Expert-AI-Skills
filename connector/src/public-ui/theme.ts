/** Same behaviour as https://mktskills.com/brand/theme.js: the "mkt-theme" choice is shared with the
 *  parent MKT Skills site on the same domain. Loaded in <head> without defer, so a saved dark
 *  choice never flashes light. Served from 'self' to satisfy the public page CSP. */
export const THEME_SCRIPT = `(function () {
  var KEY = 'mkt-theme';
  var root = document.documentElement;
  function saved() { try { var t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch (e) { return null; } }
  function system() { try { return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch (e) { return 'light'; } }
  function apply(t) { root.classList.toggle('dark-mode', t === 'dark'); root.classList.toggle('light-mode', t === 'light'); }
  function label(button, t) { var text = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'; button.setAttribute('aria-label', text); button.setAttribute('title', text); }
  function relabel() { Array.prototype.forEach.call(document.querySelectorAll('[data-mkt-theme-toggle]'), function (b) { label(b, current); }); }
  var current = saved() || system();
  apply(current);
  // Until someone chooses, keep following the device setting while the page is open.
  try {
    var media = matchMedia('(prefers-color-scheme: dark)');
    var follow = function () { if (!saved()) { current = system(); apply(current); relabel(); } };
    if (media.addEventListener) media.addEventListener('change', follow); else if (media.addListener) media.addListener(follow);
  } catch (e) {}
  function wire() {
    var buttons = document.querySelectorAll('[data-mkt-theme-toggle]');
    Array.prototype.forEach.call(buttons, function (button) {
      label(button, current);
      button.hidden = false;
      button.addEventListener('click', function () {
        current = current === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(KEY, current); } catch (e) {}
        apply(current);
        Array.prototype.forEach.call(buttons, function (b) { label(b, current); });
      });
    });
    var copyButtons = document.querySelectorAll('[data-copy]');
    Array.prototype.forEach.call(copyButtons, function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';
        if (!text || !navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(function () {
          var prev = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = prev; }, 1500);
        }).catch(function () {});
      });
    });
    var filterInput = document.querySelector('[data-skill-filter]');
    if (filterInput) {
      var filterWrap = filterInput.closest('[data-skill-filter-wrap]');
      if (filterWrap) filterWrap.hidden = false;
      var status = document.querySelector('[data-skill-status]');
      var groups = document.querySelectorAll('.skill-group');
      filterInput.addEventListener('input', function () {
        var q = (filterInput.value || '').trim().toLowerCase();
        var shown = 0;
        Array.prototype.forEach.call(groups, function (group) {
          var items = group.querySelectorAll('li');
          var groupShown = 0;
          Array.prototype.forEach.call(items, function (li) {
            var match = !q || (li.textContent || '').toLowerCase().indexOf(q) !== -1;
            li.hidden = !match;
            if (match) { groupShown++; shown++; }
          });
          group.hidden = groupShown === 0;
        });
        if (status) status.textContent = q ? (shown + ' matching') : (shown + ' skills');
      });
    }
    var reduced = false;
    try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var reveals = document.querySelectorAll('[data-reveal]');
    if (!reduced && 'IntersectionObserver' in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
      Array.prototype.forEach.call(reveals, function (el) {
        el.classList.add('will-reveal');
        io.observe(el);
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
`;
