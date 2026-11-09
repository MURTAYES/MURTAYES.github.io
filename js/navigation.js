/**
 * Primary Navigation Controllers & Fullscreen Pamidor-Style Slide-down Menu
 * Pure Vanilla JavaScript · 60fps GPU Hardware Accelerated
 * Handles 2-line morphing hamburger, curtain slide, staggered reveal, and anchor navigation.
 */
(function () {
  "use strict";

  function updateNavTheme() {
    const header = document.querySelector(".site-header") || document.querySelector(".header");
    if (!header) return;

    if (document.body.classList.contains("menu-open")) {
      header.classList.remove("is-dark");
      return;
    }

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
    const siteMenu = document.getElementById("site-menu") || document.getElementById("mainNav");
    const menuWrap = document.querySelector(".site-menu-wrap");
    const scrim = document.getElementById("menu-scrim");
    const navLinks = document.querySelectorAll(".site-menu-link, .nav-link, .menu-link");

    function openMenu() {
      document.body.classList.add("menu-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
      }
      if (siteMenu) {
        siteMenu.setAttribute("aria-hidden", "false");
        siteMenu.setAttribute("data-menu", "open");
      }
      if (menuWrap) {
        menuWrap.setAttribute("aria-hidden", "false");
      }
      if (scrim) {
        scrim.setAttribute("data-menu-scrim", "open");
      }
      updateNavTheme();
    }

    function closeMenu() {
      document.body.classList.remove("menu-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      }
      if (siteMenu) {
        siteMenu.setAttribute("aria-hidden", "true");
        siteMenu.setAttribute("data-menu", "closed");
      }
      if (menuWrap) {
        menuWrap.setAttribute("aria-hidden", "true");
      }
      if (scrim) {
        scrim.setAttribute("data-menu-scrim", "closed");
      }
      updateNavTheme();
    }

    function toggleMenu() {
      const isOpen = document.body.classList.contains("menu-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    if (menuToggle) {
      menuToggle.addEventListener("click", toggleMenu);
    }

    if (scrim) {
      scrim.addEventListener("click", closeMenu);
    }

    // Close menu and smooth-scroll on link click
    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        const href = link.getAttribute("href");
        closeMenu();

        if (href && href.startsWith("#")) {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            setTimeout(function () {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }, 120);
          }
        }
      });
    });

    // Close on Escape key
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        closeMenu();
        if (menuToggle) menuToggle.focus();
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigationControllers);
  } else {
    initNavigationControllers();
  }
})();
