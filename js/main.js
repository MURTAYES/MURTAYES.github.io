/**
 * Master Application Coordinator
 * Boots all modular components in priority sequence upon DOM readiness
 */
(function () {
  "use strict";

  function initApp() {
    // 01. Preloader & Hero Kinetic entrance
    if (typeof window.initHeroPreloader === "function") {
      window.initHeroPreloader();
    }

    // 02. Halftone Dot Matrix Canvas background
    if (typeof window.initHeroDotCanvas === "function") {
      window.initHeroDotCanvas();
    }

    // 03. Scroll Gauge indicator
    if (typeof window.initScrollGauge === "function") {
      window.initScrollGauge();
    }

    // 05. Selected Works Choreography (Title & Folders)
    if (typeof window.initSelectedWorks === "function") {
      window.initSelectedWorks();
    }

    // 05B. Skills & Capabilities Bento Grid
    if (typeof window.initSkillsSection === "function") {
      window.initSkillsSection();
    }

    // 05C. Kind Words / Testimonials Dual Kinetic Marquee
    if (typeof window.initTestimonialsSection === "function") {
      window.initTestimonialsSection();
    }

    // 06. Navigation Controllers, Scroll Hide/Show & Theme Synchronization
    if (typeof window.initNavigationControllers === "function") {
      window.initNavigationControllers();
    }

    // 06. Fluid Liquid Cursor Tail & Hover Pill Badges
    if (typeof window.initCustomCursor === "function") {
      window.initCustomCursor();
    }

    // 07. Value Proposition Text Wave
    if (typeof window.initGradientWaveText === "function") {
      window.initGradientWaveText();
    }

    // 07. Specification Docket Modals (ApplyKit, PharmaERP, Edu52)
    if (typeof window.initSpecificationModals === "function") {
      window.initSpecificationModals();
    }

    // 10. Contact Drawer Modal & Validation
    if (typeof window.initContactModal === "function") {
      window.initContactModal();
    }

    // 11. Footer Utilities (Live Dhaka Clock & Back-to-Top)
    if (typeof window.initFooterUtilities === "function") {
      window.initFooterUtilities();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
