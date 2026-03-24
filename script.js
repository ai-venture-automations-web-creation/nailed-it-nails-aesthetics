/**
 * Nailed It - Nails & Aesthetics Lounge
 * script.js - Vanilla JS interactions
 */

(function () {
  'use strict';

  /* ============================================================
     STICKY HEADER + SCROLL DETECTION
     ============================================================ */
  const header = document.getElementById('site-header');

  function handleScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load in case page is already scrolled


  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta a');

  function openMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on backdrop click (clicking outside menu content)
  mobileMenu.addEventListener('click', function (e) {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });


  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.getBoundingClientRect().height;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });


  /* ============================================================
     INTERSECTION OBSERVER — FADE-UP ANIMATIONS
     ============================================================ */
  const fadeElements = document.querySelectorAll('.fade-up:not(.hero .fade-up)');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -64px 0px',
      threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all elements for browsers without IntersectionObserver
    fadeElements.forEach(function (el) {
      el.classList.add('in-view');
    });
  }


  /* ============================================================
     STAT NUMBER COUNTER ANIMATION
     ============================================================ */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
    const isDecimal = el.textContent.includes('.');
    const suffix = el.textContent.replace(/[0-9.]/g, '');
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = isDecimal
        ? current.toFixed(1) + suffix
        : Math.round(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal
          ? target.toFixed(1) + suffix
          : Math.round(target) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }


  /* ============================================================
     GALLERY LIGHTBOX (Simple)
     ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.setAttribute('id', 'lightbox');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image viewer');
  lightbox.innerHTML = `
    <div class="lb-backdrop"></div>
    <button class="lb-close" aria-label="Close image viewer">&times;</button>
    <div class="lb-img-wrap">
      <img class="lb-img" src="" alt="" />
    </div>
  `;
  document.body.appendChild(lightbox);

  // Inject lightbox styles
  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }
    #lightbox.lb-open {
      opacity: 1;
      pointer-events: all;
    }
    .lb-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(63, 49, 48, 0.92);
      backdrop-filter: blur(8px);
    }
    .lb-close {
      position: absolute;
      top: 20px;
      right: 24px;
      font-size: 2.5rem;
      color: rgba(232, 207, 199, 0.85);
      background: none;
      border: none;
      cursor: pointer;
      z-index: 2;
      line-height: 1;
      transition: color 0.2s;
      font-family: sans-serif;
    }
    .lb-close:hover {
      color: #fff;
    }
    .lb-img-wrap {
      position: relative;
      z-index: 2;
      max-width: 90vw;
      max-height: 90vh;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 32px 80px rgba(0,0,0,0.5);
      transform: scale(0.92);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #lightbox.lb-open .lb-img-wrap {
      transform: scale(1);
    }
    .lb-img {
      display: block;
      max-width: 90vw;
      max-height: 88vh;
      object-fit: contain;
    }
  `;
  document.head.appendChild(lbStyle);

  const lbImg  = lightbox.querySelector('.lb-img');
  const lbClose = lightbox.querySelector('.lb-close');
  const lbBackdrop = lightbox.querySelector('.lb-backdrop');

  function openLightbox(src, alt) {
    lbImg.src  = src;
    lbImg.alt  = alt || '';
    lightbox.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(function (item) {
    const img = item.querySelector('img');
    if (!img) return;

    // Make focusable
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View image: ' + (img.alt || 'gallery image'));

    item.addEventListener('click', function () {
      // Use the original src, swap low-res param for high-res
      const hires = img.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
      openLightbox(hires, img.alt);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('lb-open')) {
      closeLightbox();
    }
  });


  /* ============================================================
     ACTIVE NAV LINK HIGHLIGHTING (Scroll Spy)
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + header.getBoundingClientRect().height + 60;

    let current = '';

    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active-nav');
      }
    });
  }

  // Inject active nav style
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    .nav-desktop a.active-nav {
      color: var(--dark);
    }
    .nav-desktop a.active-nav::after {
      width: 100%;
    }
  `;
  document.head.appendChild(navStyle);

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ============================================================
     LAZY IMAGE PROGRESSIVE LOAD EFFECT
     ============================================================ */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(function (img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', function () {
        img.style.opacity = '1';
      });
      img.addEventListener('error', function () {
        img.style.opacity = '0.4';
      });
    }
  });


  /* ============================================================
     SERVICE CARD HOVER TILT (subtle)
     ============================================================ */
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 3;
      const tiltY  = ((cx - x) / cx) * 3;

      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });


  /* ============================================================
     PHONE LINK TRACKING (analytics-ready stub)
     ============================================================ */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'phone_call', {
          event_category: 'engagement',
          event_label: 'Nailed It - Call Now'
        });
      }
    });
  });


  /* ============================================================
     BOOK NOW BUTTON TRACKING (analytics-ready stub)
     ============================================================ */
  document.querySelectorAll('a[href="#contact"].btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'book_now_click', {
          event_category: 'engagement',
          event_label: 'Nailed It - Book Now'
        });
      }
    });
  });

})();
