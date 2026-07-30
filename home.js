/**
 * AI Rice Doctor — home.js
 * ควบคุมพฤติกรรม: navbar เปลี่ยนสไตล์ตอนเลื่อน, เมนูมือถือ,
 * reveal-on-scroll, และตัวนับสถิติแบบ animate
 */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     1) Navbar: เปลี่ยนสไตล์เมื่อ scroll ผ่านจุดที่กำหนด
  ----------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 40;

  function updateNavbarOnScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  updateNavbarOnScroll();
  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });

  /* -----------------------------------------------------------
     2) เมนูมือถือ: เปิด/ปิดด้วยปุ่ม burger
  ----------------------------------------------------------- */
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    navLinks.classList.remove('is-open');
    navBurger.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const isOpen = navLinks.classList.toggle('is-open');
    navBurger.setAttribute('aria-expanded', String(isOpen));
  }

  navBurger.addEventListener('click', toggleMobileMenu);

  // ปิดเมนูอัตโนมัติเมื่อคลิกลิงก์ใดๆ ในเมนู (ใช้งานบนมือถือ)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ปิดเมนูเมื่อขยายจอกลับมาเป็นขนาด desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMobileMenu();
  });

  /* -----------------------------------------------------------
     3) Reveal on scroll: การ์ด/สเต็ปต่างๆ ค่อยๆ ปรากฏเมื่อเลื่อนถึง
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // stagger เล็กน้อยตามลำดับ element ที่ปรากฏพร้อมกัน
          const delay = Array.prototype.indexOf.call(revealEls, entry.target) % 6 * 70;
          entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* -----------------------------------------------------------
     4) ตัวนับสถิติ: นับขึ้นจาก 0 ถึงค่าจริงเมื่อ section เข้า viewport
  ----------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat__number');
  const COUNT_DURATION = 1400; // ms

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      // ease-out cubic เพื่อให้ตัวเลขชะลอความเร็วช่วงท้าย
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString('th-TH') + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('th-TH') + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (el) { statsObserver.observe(el); });

})();
