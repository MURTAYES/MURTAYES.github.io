/**
 * "Worth Keeping" Architectural CTA Section Module
 * Layer 4 Magnetic Seal Physics + Light/Dark Theme Switcher + Replay Entrance
 * Pure Vanilla JavaScript · Zero External Dependencies
 */
(function () {
  "use strict";

  function initContactSection() {
    const ctaSection = document.getElementById("contact") || document.getElementById("ctaSection") || document.querySelector(".cta-section");
    if (!ctaSection) return;

    const sealButton = ctaSection.querySelector("#sealButton");
    const sealCore = ctaSection.querySelector("#sealCore");
    const themeBtn = ctaSection.querySelector("#themeBtn");
    const themeLabel = ctaSection.querySelector("#themeLabel");
    const replayBtn = ctaSection.querySelector("#replayBtn");

    // 1. Magnetic Hover Physics on the Seal Button
    if (sealButton && sealCore) {
      sealButton.addEventListener("pointermove", (e) => {
        const rect = sealButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        sealButton.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`;
        sealCore.style.transform = `translate3d(${(deltaX * 0.35).toFixed(2)}px, ${(deltaY * 0.35).toFixed(2)}px, 0) scale(1.12)`;
      });

      sealButton.addEventListener("pointerleave", () => {
        sealButton.style.transform = "translate3d(0, 0, 0)";
        sealCore.style.transform = "translate3d(0, 0, 0) scale(1)";
      });
    }

    // 2. Light / Dark Monochrome Theme Switcher
    if (themeBtn && themeLabel) {
      themeBtn.addEventListener("click", () => {
        const isDark = ctaSection.classList.contains("theme-dark");
        if (isDark) {
          ctaSection.classList.remove("theme-dark");
          themeLabel.textContent = "Dark Mode";
        } else {
          ctaSection.classList.add("theme-dark");
          themeLabel.textContent = "Light Mode";
        }
      });
    }

    // 3. Replay Staggered Entrance Animation
    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        ctaSection.classList.remove("is-ready");
        void ctaSection.offsetWidth; // Force reflow
        setTimeout(() => ctaSection.classList.add("is-ready"), 60);
      });
    }

    // 4. Viewport Intersection Entrance Trigger
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
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
