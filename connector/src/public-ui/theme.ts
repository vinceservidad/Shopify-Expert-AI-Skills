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
  var current = saved() || system();
  apply(current);
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
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
`;
