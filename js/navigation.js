/**
 * Primary Navigation Controllers & Fullscreen Pamidor-Style Slide-down Menu
 * Pure Vanilla JavaScript · 60fps GPU Hardware Accelerated
 * Handles 2-line morphing hamburger, curtain slide, staggered reveal, and anchor navigation.
 */
(function () {
  "use strict";

  let isInitialized = false;

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
    if (isInitialized) return;
    isInitialized = true;

    const header = document.querySelector(".site-header") || document.querySelector(".header");
    const menuToggle = document.getElementById("menuToggle") || document.getElementById("menu-btn");
    const siteMenu = document.getElementById("site-menu") || document.getElementById("mainNav");
    const menuWrap = document.querySelector(".site-menu-wrap");
    const scrim = document.getElementById("menu-scrim");
    const navLinks = document.querySelectorAll(".site-menu-link, .nav-link, .menu-link");
    const wordmarkLink = document.querySelector(".wordmark-link");

    // Safety fallback: Ensure header is visible and interactive if preloader was delayed
    setTimeout(function () {
      if (header && !header.classList.contains("is-visible")) {
        header.classList.add("is-visible");
      }
    }, 3200);

    function openMenu() {
      document.body.classList.add("menu-open");
      if (header) {
        header.classList.add("menu-open");
        header.classList.remove("is-dark");
      }
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
      if (header) {
        header.classList.remove("menu-open");
      }
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

    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
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

    if (wordmarkLink) {
      wordmarkLink.addEventListener("click", function () {
        if (document.body.classList.contains("menu-open")) {
          closeMenu();
        }
      });
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

  window.updateNavTheme = updateNavTheme;
  window.initNavigationControllers = initNavigationControllers;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigationControllers);
  } else {
    initNavigationControllers();
  }
})();
