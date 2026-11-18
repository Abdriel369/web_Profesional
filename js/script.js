/* ==========================================================================
   Portafolio · Abdriel Mendiola Aragon
   Interacciones: tema, navegación activa, progreso, copiar correo, AOS
   ========================================================================== */
(function () {
  'use strict';

  var THEME_KEY = 'theme';
  var root = document.documentElement;
  var prefersReduced = typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------ Tema claro / oscuro ------------------------------ */
  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);

    var icon = document.getElementById('themeIcon');
    var text = document.getElementById('themeText');
    var btn = document.getElementById('themeBtn');

    if (icon) icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    if (text) text.textContent = theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro';
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#08080f' : '#f6f5fb');

    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignorar */ }
    }
  }

  // Expuesta globalmente porque el botón la invoca con onclick.
  window.toggleTheme = function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  };

  applyTheme(currentTheme(), false);

  /* ------------------------------ Navbar y navegación ------------------------------ */
  var navbar = document.getElementById('mainNav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  // Cierra el menú móvil al elegir un enlace.
  var collapseEl = document.getElementById('navMenu');
  if (collapseEl) {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.bootstrap) {
          var instance = window.bootstrap.Collapse.getInstance(collapseEl);
          if (instance && collapseEl.classList.contains('show')) instance.hide();
        } else {
          collapseEl.classList.remove('show');
        }
      });
    });
  }

  // Si Bootstrap no carga, el botón hamburguesa sigue funcionando.
  var toggler = document.querySelector('.navbar-toggler');
  if (toggler && collapseEl && !window.bootstrap) {
    toggler.addEventListener('click', function () {
      var isOpen = collapseEl.classList.toggle('show');
      toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ------------------------------ Progreso y barra ------------------------------ */
  var progress = document.getElementById('scrollProgress');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + '%';
    }
    if (navbar) {
      navbar.classList.toggle('is-scrolled', scrollTop > 24);
    }
    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollTop > 520);
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------ Copiar correo ------------------------------ */
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  var copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';
      var done = function () { showToast('Correo copiado: ' + email); };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          showToast('Correo: ' + email);
        });
        return;
      }

      // Alternativa para contextos sin permiso de portapapeles (por ejemplo file://).
      var temp = document.createElement('textarea');
      temp.value = email;
      temp.setAttribute('readonly', '');
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        done();
      } catch (e) {
        showToast('Correo: ' + email);
      }
      document.body.removeChild(temp);
    });
  }

  /* ------------------------------ Cifras animadas ------------------------------ */
  // Los números ya están escritos en el HTML: sin JavaScript (o sin
  // IntersectionObserver) la información se lee igual.
  var counters = document.querySelectorAll('.stat-value[data-count]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    if (prefersReduced) {
      el.textContent = String(target);
      return;
    }

    var duration = 900;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    }

    el.textContent = '0';
    window.requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ------------------------------ AOS ------------------------------ */
  // Los scripts son "defer": si AOS está disponible, ya se habrá cargado aquí.
  // Si el CDN falla, se muestra el contenido sin animación en lugar de ocultarlo.
  function initRevealAnimations() {
    if (typeof window.AOS === 'undefined') {
      root.classList.add('aos-fallback');
      return;
    }
    window.AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: function () { return prefersReduced; }
    });
    if (prefersReduced) {
      document.querySelectorAll('[data-aos]').forEach(function (el) {
        el.removeAttribute('data-aos');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRevealAnimations);
  } else {
    initRevealAnimations();
  }

  /* ------------------------------ Año actual ------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  onScroll();
})();
