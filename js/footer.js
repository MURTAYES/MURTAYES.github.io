/**
 * Cinematic Curtain Reveal Footer & Magnetic Interaction Engine
 * Pure Vanilla JavaScript · 60fps GPU Hardware-Accelerated Transforms
 * Zero External Dependencies
 */
(function () {
  "use strict";

  function initCinematicFooter() {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wrapper = document.getElementById("footer-wrapper");
    const giantText = document.getElementById("giant-text");
    const centerContent = document.getElementById("footer-center");

    if (prefersReduced) {
      if (giantText) {
        giantText.style.transform = "translate(-50%, 0) scale(1)";
        giantText.style.opacity = "1";
      }
      if (centerContent) {
        centerContent.style.transform = "translateY(0)";
        centerContent.style.opacity = "1";
      }
      return;
    }

    // =========================================
    // 1. MAGNETIC BUTTONS (Mouse Tracking & Tilt)
    // =========================================
    const magneticButtons = document.querySelectorAll(".magnetic-btn");

    magneticButtons.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        
        // Calculate distance from center of button
        const x = e.clientX - rect.left - (rect.width * 0.5);
        const y = e.clientY - rect.top - (rect.height * 0.5);

        // Translate (pull) and Rotate (tilt)
        btn.style.transform = "translate(" + (x * 0.4).toFixed(1) + "px, " + (y * 0.4).toFixed(1) + "px) " +
                              "rotateX(" + (-y * 0.15).toFixed(1) + "deg) " +
                              "rotateY(" + (x * 0.15).toFixed(1) + "deg) " +
                              "scale(1.05)";
        btn.style.transition = "none";
      });

      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "translate(0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)";
        btn.style.transition = "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s ease, border-color 0.4s ease";
      });
    });

    // =========================================
    // 2. SCROLL PARALLAX & STAGGERED REVEAL
    // =========================================
    function onScrollParallax() {
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Calculate how far we are into revealing the footer (0 to 1)
      let progress = (viewHeight - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));

      // Parallax Giant Text
      const textY = 10 - (progress * 10);
      const textScale = 0.8 + (progress * 0.2);
      const textOpacity = progress;

      if (giantText) {
        giantText.style.transform = "translate(-50%, " + textY.toFixed(2) + "vh) scale(" + textScale.toFixed(3) + ")";
        giantText.style.opacity = textOpacity.toFixed(2);
      }

      // Staggered Fade Up for Center Content (starts at 0.25, full at 0.8)
      let contentProgress = (progress - 0.25) / 0.55;
      contentProgress = Math.max(0, Math.min(1, contentProgress));

      const contentY = 50 - (contentProgress * 50);
      if (centerContent) {
        centerContent.style.transform = "translateY(" + contentY.toFixed(1) + "px)";
        centerContent.style.opacity = contentProgress.toFixed(2);
      }
    }

    window.addEventListener("scroll", onScrollParallax, { passive: true });
    window.addEventListener("resize", onScrollParallax, { passive: true });
    onScrollParallax();
  }

  window.initCinematicFooter = initCinematicFooter;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCinematicFooter);
  } else {
    initCinematicFooter();
  }
})();
