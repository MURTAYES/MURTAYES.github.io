/**
 * Collaborative Workspace Contact Section Module (Pure Vanilla JavaScript)
 * Handles autonomous Lissajous "Cliente" cursor drift, mouse override,
 * dual-layer spotlight dot grid tracking, and floating element parallax.
 */
(function () {
  "use strict";

  function initContactSection() {
    const stage = document.querySelector(".js-contacto-stage");
    const cursor = document.querySelector(".js-cliente-cursor");
    if (!stage || !cursor) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      cursor.style.transform = `translate3d(${w * 0.65}px, ${h * 0.45}px, 0)`;
      stage.style.setProperty("--dot-lit-x", `${w * 0.65}px`);
      stage.style.setProperty("--dot-lit-y", `${h * 0.45}px`);
      return;
    }

    let isHovered = false;
    let isVisible = false;
    let targetX = stage.clientWidth * 0.5;
    let targetY = stage.clientHeight * 0.5;
    let currX = targetX;
    let currY = targetY;
    let animationFrameId = null;

    // Floating cards for subtle mouse parallax
    const floatItems = stage.querySelectorAll('[data-float="true"]');

    function updateAnimation(timestamp) {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(updateAnimation);
        return;
      }

      const rect = stage.getBoundingClientRect();
      const stageW = rect.width || 600;
      const stageH = rect.height || 500;

      if (isHovered) {
        // Smooth lerp toward mouse pointer
        currX += (targetX - currX) * 0.14;
        currY += (targetY - currY) * 0.14;
      } else {
        // Autonomous organic Lissajous curve
        const t = timestamp || performance.now();
        const lissajousX = stageW * (0.5 + 0.34 * Math.sin(t * 0.0011 + 0.8));
        const lissajousY = stageH * (0.5 + 0.28 * Math.sin(t * 0.0016));
        currX += (lissajousX - currX) * 0.06;
        currY += (lissajousY - currY) * 0.06;
      }

      // Update cursor coordinates
      cursor.style.transform = `translate3d(${currX}px, ${currY}px, 0)`;

      // Update dual-layer spotlight dot grid CSS variables
      stage.style.setProperty("--dot-lit-x", `${currX}px`);
      stage.style.setProperty("--dot-lit-y", `${currY}px`);

      animationFrameId = requestAnimationFrame(updateAnimation);
    }

    // Pointer events on stage
    stage.addEventListener("mouseenter", (e) => {
      isHovered = true;
      const rect = stage.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    stage.addEventListener("mousemove", (e) => {
      const rect = stage.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      // Parallax effect on floating items
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offX = (targetX - centerX) / centerX;
      const offY = (targetY - centerY) / centerY;

      floatItems.forEach((item, index) => {
        const factor = 4 + (index % 3) * 3;
        const rotate = item.classList.contains("contacto-badge-aa") ? -8 : 0;
        item.style.transform = `translate3d(${offX * factor}px, ${offY * factor}px, 0) rotate(${rotate}deg)`;
      });
    });

    stage.addEventListener("mouseleave", () => {
      isHovered = false;
      // Reset floating items
      floatItems.forEach((item) => {
        const rotate = item.classList.contains("contacto-badge-aa") ? -8 : 0;
        item.style.transform = `translate3d(0, 0, 0) rotate(${rotate}deg)`;
      });
    });

    // IntersectionObserver to conserve animation frames when offscreen
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

    // Email copy-to-clipboard feedback
    const emailBtn = document.querySelector(".home-contacto__btn-email");
    if (emailBtn) {
      emailBtn.addEventListener("click", (e) => {
        const email = "samnun@murtayes.com";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => {
            const span = emailBtn.querySelector("span");
            if (span) {
              const original = span.textContent;
              span.textContent = "Copied to clipboard!";
              setTimeout(() => {
                span.textContent = original;
              }, 2000);
            }
          }).catch(() => {});
        }
      });
    }

    // Kick off animation loop
    animationFrameId = requestAnimationFrame(updateAnimation);
  }

  // Export & auto-init
  window.initContactSection = initContactSection;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactSection);
  } else {
    initContactSection();
  }
})();
