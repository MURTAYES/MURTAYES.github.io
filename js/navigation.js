/**
 * Primary Navigation Controllers & Fullscreen Slide-out Menu
 * Matches Reference Architecture: Fixed transparent header, hamburger toggle, scrim backdrop,
 * and fullscreen slide-out menu with escape and link click handling.
 */
(function () {
  "use strict";

  function updateNavTheme() {
    const header = document.querySelector(".site-header") || document.querySelector(".header");
    if (!header) return;

    const worksSection = document.getElementById("works");
    if (worksSection) {
      const wRect = worksSection.getBoundingClientRect();
      if (wRect.top <= 80 && wRect.bottom >= 0) {
        header.classList.add("is-dark");
        return;
      }
    }

    header.classList.remove("is-dark");
  }

  function initNavigationControllers() {
    const menuToggle = document.getElementById("menuToggle") || document.getElementById("menu-btn");
    const mainNav = document.getElementById("mainNav") || document.getElementById("site-menu");
    const scrim = document.getElementById("menu-scrim");
    const navLinks = document.querySelectorAll(".nav-link, .menu-link");

    function toggleMenu() {
      const isOpen = document.body.classList.toggle("menu-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close Navigation Menu" : "Toggle Navigation Menu");
      }
      if (mainNav) {
        mainNav.setAttribute("aria-hidden", String(!isOpen));
      }
    }

    function closeMenu() {
      document.body.classList.remove("menu-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Toggle Navigation Menu");
      }
      if (mainNav) {
        mainNav.setAttribute("aria-hidden", "true");
      }
    }

    if (menuToggle) {
      menuToggle.addEventListener("click", toggleMenu);
    }

    if (scrim) {
      scrim.addEventListener("click", closeMenu);
    }

    // Close menu automatically when any navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape key press
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        closeMenu();
      }
    });

    // Scroll listener for dark section theme updates
    window.addEventListener("scroll", updateNavTheme, { passive: true });
    updateNavTheme();
  }

  function initScrollGauge() {
    const pctEl = document.getElementById("hero-scroll-pct");
    const fillEl = document.getElementById("hero-scroll-fill");
    if (!pctEl || !fillEl) return;

    function updateGauge() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0;
      pctEl.textContent = `${pct}%`;
      fillEl.style.height = `${pct}%`;
    }

    window.addEventListener("scroll", updateGauge, { passive: true });
    window.addEventListener("resize", updateGauge, { passive: true });
    updateGauge();
  }

  window.updateNavTheme = updateNavTheme;
  window.initNavigationControllers = initNavigationControllers;
  window.initScrollGauge = initScrollGauge;

  // Auto-init on DOMContentLoaded if not already invoked by preloader
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigationControllers);
  } else {
    initNavigationControllers();
  }
})();
