/**
 * Skills & Capabilities Bento Grid Module
 * Features 3D perspective tilt, cursor spotlight, staggered scroll reveal & infinite tool marquee
 * Pure Vanilla JavaScript · Zero Dependencies · Respects prefers-reduced-motion
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initSkillsSection() {
    if (isInitialized) return;
    isInitialized = true;

    const section = document.querySelector(".skills-section");
    if (!section) return;

    const cards = Array.from(section.querySelectorAll(".bento-card"));
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    // 1. Staggered Scroll Reveal
    if (prefersReduced) {
      cards.forEach(function (card) {
        card.classList.add("is-visible");
      });
    } else if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -8% 0px",
        }
      );

      cards.forEach(function (card) {
        revealObserver.observe(card);
      });
    } else {
      cards.forEach(function (card) {
        card.classList.add("is-visible");
      });
    }

    // 2. 3D Tilt & Cursor Spotlight Tracking
    if (!prefersReduced && !isTouch) {
      cards.forEach(function (card) {
        card.addEventListener(
          "mousemove",
          function (e) {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
            const y = (e.clientY - r.top) / r.height - 0.5;

            // Maximum tilt +-6deg
            card.style.setProperty("--rx", `${-y * 6}deg`);
            card.style.setProperty("--ry", `${x * 6}deg`);

            // Spotlight pixel coordinate offsets
            card.style.setProperty("--mx", `${e.clientX - r.left}px`);
            card.style.setProperty("--my", `${e.clientY - r.top}px`);
          },
          { passive: true }
        );

        card.addEventListener(
          "mouseleave",
          function () {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
          },
          { passive: true }
        );
      });
    }
  }

  window.initSkillsSection = initSkillsSection;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSkillsSection);
  } else {
    initSkillsSection();
  }
})();
