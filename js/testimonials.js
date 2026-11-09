/**
 * Kind Words / Testimonials Section Module
 * 21st.dev Dual Continuous Kinetic Marquee with Spotlight Hover Tracking
 * Pure Vanilla JavaScript · Zero Dependencies · Respects prefers-reduced-motion
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initTestimonialsSection() {
    if (isInitialized) return;
    isInitialized = true;

    const section = document.querySelector(".testimonials-section");
    if (!section) return;

    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    // 1. Duplicate Marquee Content for seamless loop
    const tracks = section.querySelectorAll(".testimonials-marquee-track");
    tracks.forEach(function (track) {
      const originalCards = Array.from(track.children);
      originalCards.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        track.appendChild(clone);
      });
    });

    // 2. Kinetic Text Reveal Observer
    const headline = section.querySelector(".kinetic-headline");
    if (headline) {
      if (prefersReduced) {
        headline.classList.add("is-revealed");
      } else if ("IntersectionObserver" in window) {
        const headlineObserver = new IntersectionObserver(
          function (entries, observer) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                headline.classList.add("is-revealed");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        headlineObserver.observe(headline);
      } else {
        headline.classList.add("is-revealed");
      }
    }

    // 3. Spotlight Tracking on Hover (21st.dev effect)
    if (!prefersReduced && !isTouch) {
      const cards = section.querySelectorAll(".testimonial-card");
      cards.forEach(function (card) {
        card.addEventListener(
          "mousemove",
          function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
          },
          { passive: true }
        );

        card.addEventListener(
          "mouseleave",
          function () {
            card.style.removeProperty("--mouse-x");
            card.style.removeProperty("--mouse-y");
          },
          { passive: true }
        );
      });
    }
  }

  window.initTestimonialsSection = initTestimonialsSection;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTestimonialsSection);
  } else {
    initTestimonialsSection();
  }
})();
