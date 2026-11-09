/**
 * Section 07 — Finale Architectural CTA Module
 * Viewport Entrance Reveal & Contact Modal Drawer Trigger
 * Pure Vanilla JavaScript · Zero Dependencies
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initContactSection() {
    if (isInitialized) return;
    isInitialized = true;

    const ctaSection = document.getElementById("contact") || document.querySelector(".cta-section");
    if (!ctaSection) return;

    // 1. Open Contact Drawer Modal
    const openBtns = ctaSection.querySelectorAll("[data-open-contact], .iphone-swipe-btn");
    openBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const modal = document.getElementById("contact-modal");
        if (modal) {
          modal.classList.add("is-open");
          modal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          const firstInput = modal.querySelector("input, button");
          if (firstInput) firstInput.focus();
        }
      });
    });

    // 2. Viewport Intersection Entrance Trigger
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              ctaSection.classList.add("is-ready");
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(ctaSection);
    } else {
      ctaSection.classList.add("is-ready");
    }
  }

  window.initContactSection = initContactSection;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactSection);
  } else {
    initContactSection();
  }
})();
