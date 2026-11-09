/**
 * Section 07 — Collaborative Studio & Contact Module
 * Interactive Tactile Parallax Float Physics & Modal Drawer Trigger
 * Pure Vanilla JavaScript · Zero Dependencies
 */
(function () {
  "use strict";

  function initContactSection() {
    const stage = document.getElementById("contactoStage") || document.querySelector(".js-contacto-stage");
    const contactBtn = document.querySelector(".home-contacto__btn-talk");

    // 1. Open Contact Drawer Modal
    if (contactBtn) {
      contactBtn.addEventListener("click", function (e) {
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
    }

    // 2. Interactive Tactile Parallax on Stage
    if (stage) {
      const items = stage.querySelectorAll('[data-float="true"]');
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReducedMotion && items.length > 0) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovered = false;
        let rafId = null;

        // Multipliers for staggered depth perception
        const depths = [
          { x: 12, y: 10 },   // Card 1 (chart)
          { x: -16, y: -14 }, // Card 2 (desk)
          { x: 15, y: -12 },  // Card 3 (laptop)
          { x: -10, y: 12 },  // Card 4 (wireframe)
          { x: 20, y: 18 },   // VS Code
          { x: -22, y: 16 },  // Figma
          { x: 18, y: -20 },  // GDocs
          { x: -18, y: -16 }  // Cube
        ];

        function onMouseMove(e) {
          const rect = stage.getBoundingClientRect();
          mouseX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          mouseY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

          // Clamp
          mouseX = Math.max(-1, Math.min(1, mouseX));
          mouseY = Math.max(-1, Math.min(1, mouseY));
        }

        function onMouseEnter() {
          isHovered = true;
          if (!rafId) {
            rafId = requestAnimationFrame(animateLoop);
          }
        }

        function onMouseLeave() {
          isHovered = false;
          mouseX = 0;
          mouseY = 0;
        }

        function animateLoop() {
          currentX += (mouseX - currentX) * 0.08;
          currentY += (mouseY - currentY) * 0.08;

          items.forEach(function (item, idx) {
            const depth = depths[idx % depths.length];
            const transX = (currentX * depth.x).toFixed(2);
            const transY = (currentY * depth.y).toFixed(2);
            item.style.transform = "translate3d(" + transX + "px, " + transY + "px, 0)";
          });

          // Stop loop if resting near 0 and mouse is gone
          if (!isHovered && Math.abs(currentX) < 0.002 && Math.abs(currentY) < 0.002) {
            items.forEach(function (item) {
              item.style.transform = "";
            });
            rafId = null;
            return;
          }

          rafId = requestAnimationFrame(animateLoop);
        }

        stage.addEventListener("mouseenter", onMouseEnter);
        stage.addEventListener("mousemove", onMouseMove);
        stage.addEventListener("mouseleave", onMouseLeave);
      }
    }
  }

  window.initContactSection = initContactSection;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactSection);
  } else {
    initContactSection();
  }
})();
