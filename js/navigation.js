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
    const menuBtn = document.getElementById("menu-btn");
    const menuOverlay = document.getElementById("site-menu");
    const scrim = document.getElementById("menu-scrim");
    const menuLinks = document.querySelectorAll(".menu-link");

    function toggleMenu() {
      const isOpen = document.body.classList.toggle("menu-open");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      }
      if (menuOverlay) {
        menuOverlay.setAttribute("aria-hidden", String(!isOpen));
      }
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    function closeMenu() {
      document.body.classList.remove("menu-open");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
      if (menuOverlay) {
        menuOverlay.setAttribute("aria-hidden", "true");
      }
      document.body.style.overflow = "";
    }

    if (menuBtn) {
      menuBtn.addEventListener("click", toggleMenu);
    }

    if (scrim) {
      scrim.addEventListener("click", closeMenu);
    }

    // Close menu when clicking any navigation link
    menuLinks.forEach((link) => {
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
