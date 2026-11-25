/** Client interactivity served from 'self' to satisfy the strict CSP:
 *  - Copy buttons (with fallback when clipboard is restricted)
 *  - Search + category filter for the 19-playbook catalog
 *  - Subtle scroll reveal respecting prefers-reduced-motion */
export const THEME_SCRIPT = `(function () {
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
        resolve();
      } catch (e) { reject(e); }
    });
  }

  function wire() {
    var copyButtons = document.querySelectorAll('[data-copy]');
    Array.prototype.forEach.call(copyButtons, function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';
        if (!text) return;
        copyText(text).then(function () {
          var prev = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = prev; }, 1500);
        }).catch(function () {});
      });
    });

    var filterInput = document.querySelector('[data-skill-filter]');
    var catButtons = document.querySelectorAll('[data-skill-cat]');
    var cards = document.querySelectorAll('[data-skill-card]');
    var status = document.querySelector('[data-skill-status]');
    var activeCat = 'All';

    function applyFilter() {
      var q = filterInput ? (filterInput.value || '').trim().toLowerCase() : '';
      var shown = 0;
      Array.prototype.forEach.call(cards, function (card) {
        var cat = card.getAttribute('data-cat') || '';
        var text = (card.textContent || '').toLowerCase();
        var catOk = activeCat === 'All' || cat === activeCat;
        var qOk = !q || text.indexOf(q) !== -1;
        var visible = catOk && qOk;
        card.hidden = !visible;
        if (visible) shown++;
      });
      if (status) {
        status.textContent = shown === 1 ? '1 playbook' : (shown + ' playbooks');
      }
    }

    if (filterInput || catButtons.length) {
      var filterWrap = document.querySelector('[data-skill-filter-wrap]');
      if (filterWrap) filterWrap.hidden = false;
      if (filterInput) filterInput.addEventListener('input', applyFilter);
      Array.prototype.forEach.call(catButtons, function (btn) {
        btn.addEventListener('click', function () {
          activeCat = btn.getAttribute('data-skill-cat') || 'All';
          Array.prototype.forEach.call(catButtons, function (other) {
            other.setAttribute('aria-pressed', other === btn ? 'true' : 'false');
          });
          applyFilter();
        });
      });
      applyFilter();
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
      }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
      Array.prototype.forEach.call(reveals, function (el) {
        el.classList.add('will-reveal');
        io.observe(el);
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
`;
