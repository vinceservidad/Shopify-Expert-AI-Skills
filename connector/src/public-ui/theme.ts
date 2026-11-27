/** Client interactivity served from 'self' to satisfy the strict CSP:
 *  - Copy buttons with visible and announced feedback (clipboard API, then a legacy fallback)
 *  - Tab groups: the markup works without JavaScript as radio inputs; this adds tab roles,
 *    roving tabindex and arrow, Home and End keys
 *  - Search + category filter for the 19-playbook catalog, with an empty state
 *  Nothing here animates: sections and rows do not fade or rise in. Only the hero and sequence canvases move. */
export const THEME_SCRIPT = `(function () {
  var live = null;
  function announce(message) {
    if (!live) {
      live = document.createElement('div');
      live.className = 'sr-only';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      document.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(function () { live.textContent = message; }, 30);
  }

  function legacyCopy(text) {
    var previous = document.activeElement;
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var done = false;
    try { done = document.execCommand('copy'); } finally { document.body.removeChild(area); }
    if (previous && previous.focus) previous.focus();
    if (!done) throw new Error('copy failed');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { legacyCopy(text); });
    }
    return new Promise(function (resolve) { legacyCopy(text); resolve(); });
  }

  function flash(btn, label, ok) {
    if (btn._copyTimer) {
      clearTimeout(btn._copyTimer);
    } else {
      btn._copyOriginal = btn.innerHTML;
      btn.style.minWidth = btn.offsetWidth + 'px';
    }
    btn.textContent = label;
    btn.classList.toggle('is-copied', ok);
    btn._copyTimer = setTimeout(function () {
      btn.innerHTML = btn._copyOriginal;
      btn.classList.remove('is-copied');
      btn.style.minWidth = '';
      btn._copyTimer = 0;
    }, 1600);
  }

  function wireCopy() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';
        if (!text) return;
        var done;
        try { done = copyText(text); } catch (e) { done = Promise.reject(e); }
        done.then(function () {
          flash(btn, 'Copied', true);
          announce('Copied to clipboard');
        }, function () {
          flash(btn, 'Copy failed', false);
          announce('Copy failed. Select the text and copy it by hand.');
        });
      });
    });
  }

  function wireTabs() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (group, gi) {
      var list = group.querySelector('[data-tablist]');
      var radios = group.querySelectorAll('input[type=radio]');
      var labels = list ? list.querySelectorAll('label') : [];
      var panels = group.querySelectorAll('[data-tabpanel]');
      if (!list || !radios.length || labels.length !== radios.length || panels.length !== radios.length) return;
      var prefix = 'tabs-' + (group.getAttribute('data-tabs') || gi);
      list.setAttribute('role', 'tablist');
      Array.prototype.forEach.call(labels, function (label, i) {
        label.id = prefix + '-tab-' + i;
        label.setAttribute('role', 'tab');
        label.setAttribute('aria-controls', prefix + '-panel-' + i);
        panels[i].id = prefix + '-panel-' + i;
        panels[i].setAttribute('role', 'tabpanel');
        panels[i].setAttribute('aria-labelledby', label.id);
        radios[i].tabIndex = -1;
        radios[i].setAttribute('aria-hidden', 'true');
        radios[i].addEventListener('change', sync);
        label.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i + 1) % labels.length;
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i + labels.length - 1) % labels.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = labels.length - 1;
          else if (event.key === 'Enter' || event.key === ' ') next = i;
          if (next < 0) return;
          event.preventDefault();
          radios[next].checked = true;
          sync();
          labels[next].focus();
        });
      });
      function sync() {
        Array.prototype.forEach.call(labels, function (label, i) {
          var on = radios[i].checked;
          label.setAttribute('aria-selected', on ? 'true' : 'false');
          label.tabIndex = on ? 0 : -1;
        });
      }
      sync();
    });
  }

  function wireFilter() {
    var filterInput = document.querySelector('[data-skill-filter]');
    var catButtons = document.querySelectorAll('[data-skill-cat]');
    var cards = document.querySelectorAll('[data-skill-card]');
    var status = document.querySelector('[data-skill-status]');
    var empty = document.querySelector('[data-skill-empty]');
    var emptyQuery = document.querySelector('[data-skill-empty-query]');
    var reset = document.querySelector('[data-skill-reset]');
    var activeCat = 'All';
    Array.prototype.forEach.call(catButtons, function (btn) {
      if (btn.getAttribute('aria-pressed') === 'true') activeCat = btn.getAttribute('data-skill-cat') || 'All';
    });
    /* Search reads the name, summary, category and starter prompt, never the button labels. */
    var index = Array.prototype.map.call(cards, function (card) {
      var heading = card.querySelector('h3');
      var summary = card.querySelector('p');
      var copy = card.querySelector('[data-copy]');
      return [heading && heading.textContent, summary && summary.textContent, card.getAttribute('data-cat'), copy && copy.getAttribute('data-copy')].join(' ').toLowerCase();
    });

    function setCategory(cat) {
      activeCat = cat;
      Array.prototype.forEach.call(catButtons, function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-skill-cat') === cat ? 'true' : 'false');
      });
    }

    function applyFilter() {
      var q = filterInput ? (filterInput.value || '').trim().toLowerCase() : '';
      var shown = 0;
      Array.prototype.forEach.call(cards, function (card, i) {
        var visible = q ? index[i].indexOf(q) !== -1 : (activeCat === 'All' || card.getAttribute('data-cat') === activeCat);
        card.hidden = !visible;
        if (visible) shown++;
      });
      if (status) status.textContent = shown === cards.length ? (cards.length + ' skills') : (shown + ' of ' + cards.length + ' skills');
      if (empty) {
        empty.hidden = shown !== 0;
        if (emptyQuery) emptyQuery.textContent = q ? '"' + (filterInput.value || '').trim() + '"' : activeCat;
      }
    }

    if (!filterInput && !catButtons.length) return;
    var filterWrap = document.querySelector('[data-skill-filter-wrap]');
    if (filterWrap) filterWrap.hidden = false;
    if (filterInput) {
      /* A search covers every category, so the category buttons step back to All while you type. */
      filterInput.addEventListener('input', function () {
        if ((filterInput.value || '').trim() && activeCat !== 'All') setCategory('All');
        applyFilter();
      });
      filterInput.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && filterInput.value) { filterInput.value = ''; applyFilter(); }
      });
    }
    Array.prototype.forEach.call(catButtons, function (btn) {
      btn.addEventListener('click', function () {
        if (filterInput) filterInput.value = '';
        setCategory(btn.getAttribute('data-skill-cat') || 'All');
        applyFilter();
      });
    });
    if (reset) reset.addEventListener('click', function () {
      if (filterInput) { filterInput.value = ''; filterInput.focus(); }
      setCategory('All');
      applyFilter();
    });
    applyFilter();
  }

  function wire() { wireCopy(); wireTabs(); wireFilter(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
`;
