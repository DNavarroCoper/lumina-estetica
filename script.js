/* =========================================================
   LUMINA ESTÉTICA PREMIUM — script.js
   JavaScript puro · Sem dependências externas
   ========================================================= */

   (function () {
    'use strict';
  
    /* =========================================================
       1. NAVBAR — scroll state + highlight
       ========================================================= */
    const navbar  = document.getElementById('navbar');
    const burger  = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
  
    function handleNavScroll() {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // run on load
  
    /* =========================================================
       2. BURGER MENU (mobile)
       ========================================================= */
    if (burger && navLinks) {
      burger.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
  
        // Prevent body scroll when menu open
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
  
      // Close when a link is clicked
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
  
      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  
    /* =========================================================
       3. SMOOTH SCROLL — internal anchor links
       ========================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
  
        const navH = navbar ? navbar.offsetHeight : 76;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 10;
  
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  
    /* =========================================================
       4. INTERSECTION OBSERVER — scroll-triggered animations
       ========================================================= */
    const animateEls = document.querySelectorAll('[data-animate]');
  
    if ('IntersectionObserver' in window && animateEls.length) {
      const observerOpts = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      };
  
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
  
          const el    = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
  
          setTimeout(function () {
            el.classList.add('animated');
          }, delay);
  
          observer.unobserve(el);
        });
      }, observerOpts);
  
      animateEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: reveal all immediately (older browsers / reduced-motion)
      animateEls.forEach(function (el) {
        el.classList.add('animated');
      });
    }
  
    /* =========================================================
       5. FAQ ACCORDION
       ========================================================= */
    const faqItems = document.querySelectorAll('.faq-item');
  
    faqItems.forEach(function (item) {
      const btn    = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
  
      if (!btn || !answer) return;
  
      // Wrap content for CSS grid trick
      const inner = document.createElement('div');
      while (answer.firstChild) inner.appendChild(answer.firstChild);
      answer.appendChild(inner);
  
      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
  
        // Close all others
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
  
        // Toggle current
        item.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });
  
    /* =========================================================
       6. WHATSAPP FLOAT — show after scroll
       ========================================================= */
    const waFloat = document.getElementById('whatsapp-float');
  
    if (waFloat) {
      waFloat.style.opacity    = '0';
      waFloat.style.transform  = 'translateY(20px)';
      waFloat.style.transition = 'opacity .4s ease, transform .4s ease';
  
      function handleWaFloat() {
        if (window.scrollY > 200) {
          waFloat.style.opacity   = '1';
          waFloat.style.transform = 'translateY(0)';
        } else {
          waFloat.style.opacity   = '0';
          waFloat.style.transform = 'translateY(20px)';
        }
      }
  
      window.addEventListener('scroll', handleWaFloat, { passive: true });
      handleWaFloat();
    }
  
    /* =========================================================
       7. GALERIA — simple lightbox placeholder
       ========================================================= */
    document.querySelectorAll('.galeria-item').forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Ver imagem');
  
      function openItem() {
        // Placeholder: when real images are added, swap for a real lightbox
        const overlay = item.querySelector('.galeria-overlay span');
        const label   = overlay ? overlay.textContent : 'Imagem';
  
        console.log('[Lumina Galeria] Item clicado:', label);
        // TODO: implementar lightbox com imagens reais
      }
  
      item.addEventListener('click', openItem);
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openItem();
        }
      });
    });
  
    /* =========================================================
       8. CONTADORES animados (trust numbers)
       ========================================================= */
    function animateCounter(el, target, suffix, duration) {
      const start     = 0;
      const startTime = performance.now();
  
      function step(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease     = 1 - Math.pow(1 - progress, 3);
        const value    = Math.round(start + (target - start) * ease);
  
        el.textContent = value.toLocaleString('pt-BR') + suffix;
  
        if (progress < 1) requestAnimationFrame(step);
      }
  
      requestAnimationFrame(step);
    }
  
    const counterEls = document.querySelectorAll('.trust-num, .stat-num');
  
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
  
          const el   = entry.target;
          const text = el.textContent.trim();
  
          // Parse number + suffix from text like "+2.000" or "98%"
          const match = text.match(/^([+]?)(\d[\d.]*)\s*(%|anos?)?/);
          if (!match) return;
  
          const prefix   = match[1] || '';
          const numStr   = match[2].replace(/\./g, '');
          const num      = parseInt(numStr, 10);
          const suffix   = prefix + (match[3] || '');
  
          if (!isNaN(num)) {
            animateCounter(el, num, (match[3] ? match[3] : ''), 1800);
          }
  
          counterObserver.unobserve(el);
        });
      }, { threshold: 0.5 });
  
      counterEls.forEach(function (el) {
        counterObserver.observe(el);
      });
    }
  
    /* =========================================================
       9. ACTIVE NAV LINKS on scroll (section spy)
       ========================================================= */
    const sections   = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  
    if (sections.length && navAnchors.length) {
      function updateActiveNav() {
        const scrollMid = window.scrollY + window.innerHeight / 2;
  
        let activeId = '';
        sections.forEach(function (sec) {
          if (sec.offsetTop <= scrollMid) activeId = sec.id;
        });
  
        navAnchors.forEach(function (a) {
          const href = a.getAttribute('href').slice(1);
          a.classList.toggle('nav-active', href === activeId);
        });
      }
  
      window.addEventListener('scroll', updateActiveNav, { passive: true });
      updateActiveNav();
    }
  
    /* =========================================================
       10. PERFORMANCE — lazy load placeholder BG images
           (Future: replace placeholders with <img> tags)
       ========================================================= */
    if ('IntersectionObserver' in window) {
      const lazyBgs = document.querySelectorAll('[data-bg]');
  
      const bgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el  = entry.target;
          const src = el.getAttribute('data-bg');
          if (src) {
            el.style.backgroundImage = 'url(' + src + ')';
            el.removeAttribute('data-bg');
          }
          bgObserver.unobserve(el);
        });
      }, { rootMargin: '200px' });
  
      lazyBgs.forEach(function (el) { bgObserver.observe(el); });
    }
  
    /* =========================================================
       11. REDUCED MOTION — respect user preference
       ========================================================= */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    if (prefersReduced) {
      // Immediately reveal all animated elements
      document.querySelectorAll('[data-animate]').forEach(function (el) {
        el.style.transition = 'none';
        el.classList.add('animated');
      });
  
      // Stop orb animations
      document.querySelectorAll('.hero-orb, .urgencia-dot').forEach(function (el) {
        el.style.animation = 'none';
      });
    }
  
    /* =========================================================
       Console brand
       ========================================================= */
    console.log(
      '%c✦ Lumina Estética Premium %c— Site by Lumina © 2025',
      'color:#C9A84C;font-family:Georgia,serif;font-size:14px;font-weight:bold;',
      'color:#8A7568;font-size:12px;'
    );
  
  })();