/**
 * Collaborative Workspace Contact Section Module (Pure Vanilla JavaScript)
 * Handles interactive mouse parallax on floating cards and smooth cursor dynamics.
 * Matches Onlines Architectural Studio Design.
 */
(function () {
  "use strict";

  function initContactSection() {
    const stage = document.querySelector(".js-contacto-stage");
    if (!stage) return;

    const cursor = stage.querySelector(".contacto-client-cursor, .js-cliente-cursor");
    const floatItems = stage.querySelectorAll('[data-float="true"], .contacto-app-tile');

    const getBaseRotation = (item) => {
      if (item.classList.contains("contacto-card--chart")) return -4;
      if (item.classList.contains("contacto-card--photo-desk")) return 6;
      if (item.classList.contains("contacto-card--photo-laptop")) return -6;
      if (item.classList.contains("contacto-card--wireframe")) return 4;
      return 0;
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;
    let isHovered = false;
    let isVisible = false;
    let animId = null;

    function update() {
      if (!isVisible) {
        animId = requestAnimationFrame(update);
        return;
      }

      if (isHovered) {
        currX += (targetX - currX) * 0.1;
        currY += (targetY - currY) * 0.1;
      } else {
        currX += (0 - currX) * 0.06;
        currY += (0 - currY) * 0.06;
      }

      floatItems.forEach((item, index) => {
        const factor = 4 + (index % 5) * 2.5;
        const r = getBaseRotation(item);
        item.style.transform = `translate3d(${currX * factor}px, ${currY * factor}px, 0) rotate(${r}deg)`;
      });

      animId = requestAnimationFrame(update);
    }

    stage.addEventListener("mousemove", (e) => {
      isHovered = true;
      const rect = stage.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      targetX = (e.clientX - rect.left - centerX) / centerX;
      targetY = (e.clientY - rect.top - centerY) / centerY;
    });

    stage.addEventListener("mouseleave", () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(stage);
    } else {
      isVisible = true;
    }

    animId = requestAnimationFrame(update);
  }

  window.initContactSection = initContactSection;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactSection);
  } else {
    initContactSection();
  }
})();
