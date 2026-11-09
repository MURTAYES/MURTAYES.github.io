/**
 * Section 07 — Finale Architectural CTA Module
 * Interactive "Slide to Let's Talk" Controller & Contact Modal Trigger
 * Pure Vanilla JavaScript · Zero Dependencies
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initContactSection() {
    if (isInitialized) return;
    isInitialized = true;

    const ctaSection = document.getElementById("contact") || document.querySelector(".cta-section");
    const modal = document.getElementById("contact-modal");

    // ------------------------------------------------------------------------
    // 1. Modal Helper
    // ------------------------------------------------------------------------
    function openModal() {
      if (!modal) return;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("is--modal-open");
      document.body.classList.add("is--modal-open");
      document.body.style.overflow = "hidden";

      setTimeout(function () {
        const firstInput = modal.querySelector('input[name="name"]') || modal.querySelector("input, textarea, button");
        if (firstInput) firstInput.focus();
      }, 120);
    }

    // Direct click triggers (if any explicit button exists outside the slider)
    const directTriggers = document.querySelectorAll("[data-open-contact]");
    directTriggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    });

    // ------------------------------------------------------------------------
    // 2. Interactive "Slide to Let's Talk" Slider
    // ------------------------------------------------------------------------
    const slider = ctaSection ? ctaSection.querySelector(".js-slide-to-talk") : document.querySelector(".js-slide-to-talk");

    if (slider) {
      const thumb = slider.querySelector(".js-slide-thumb");
      const fill = slider.querySelector(".js-slide-fill");
      const label = slider.querySelector(".js-slide-label");

      let isDragging = false;
      let hasMoved = false;
      let startX = 0;
      let currentX = 0;
      let maxTravel = 0;
      let nudgeTimeout = null;

      function calcMax() {
        const sliderWidth = slider.clientWidth;
        const thumbWidth = thumb ? thumb.offsetWidth : 46;
        // 5px padding on each side
        maxTravel = Math.max(0, sliderWidth - thumbWidth - 10);
        return maxTravel;
      }

      function resetSlider() {
        isDragging = false;
        hasMoved = false;
        currentX = 0;
        slider.classList.remove("is-dragging", "is-unlocked");

        if (thumb) {
          thumb.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
          thumb.style.transform = "translate3d(0, 0, 0)";
        }
        if (fill) {
          fill.style.transition = "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
          fill.style.width = "0px";
        }
        if (label) {
          label.style.transition = "opacity 0.3s ease";
          label.style.opacity = "1";
        }
        slider.setAttribute("aria-valuenow", "0");
      }

      function triggerUnlock() {
        if (slider.classList.contains("is-unlocked")) return;
        slider.classList.add("is-unlocked");
        calcMax();

        if (thumb) {
          thumb.style.transition = "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)";
          thumb.style.transform = "translate3d(" + maxTravel.toFixed(1) + "px, 0, 0)";
        }
        if (fill) {
          fill.style.transition = "width 0.22s cubic-bezier(0.16, 1, 0.3, 1)";
          fill.style.width = "100%";
        }
        if (label) {
          label.style.transition = "opacity 0.2s ease";
          label.style.opacity = "0";
        }
        slider.setAttribute("aria-valuenow", "100");

        setTimeout(function () {
          openModal();
        }, 180);
      }

      function triggerNudge() {
        if (slider.classList.contains("is-unlocked")) return;
        clearTimeout(nudgeTimeout);
        slider.classList.remove("is-nudging");
        // Force reflow
        void slider.offsetWidth;
        slider.classList.add("is-nudging");
        nudgeTimeout = setTimeout(function () {
          slider.classList.remove("is-nudging");
        }, 450);
      }

      function onPointerDown(e) {
        if (slider.classList.contains("is-unlocked")) return;
        if (e.button !== undefined && e.button !== 0) return; // Primary pointer only

        calcMax();
        if (maxTravel <= 0) return;

        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        currentX = 0;

        slider.classList.add("is-dragging");
        slider.classList.remove("is-nudging");

        try {
          slider.setPointerCapture(e.pointerId);
        } catch (_) {}

        if (thumb) thumb.style.transition = "none";
        if (fill) fill.style.transition = "none";
        if (label) label.style.transition = "none";

        if (e.cancelable) e.preventDefault();
      }

      function onPointerMove(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 4) {
          hasMoved = true;
        }

        currentX = Math.max(0, Math.min(maxTravel, deltaX));
        const progress = maxTravel > 0 ? currentX / maxTravel : 0;

        if (thumb) {
          thumb.style.transform = "translate3d(" + currentX.toFixed(1) + "px, 0, 0)";
        }
        if (fill) {
          fill.style.width = (currentX + 24).toFixed(1) + "px";
        }
        if (label) {
          label.style.opacity = Math.max(0, 1 - progress * 1.45).toFixed(2);
        }
        slider.setAttribute("aria-valuenow", Math.round(progress * 100));

        // Auto unlock when dragged all the way to the end
        if (progress >= 0.95) {
          isDragging = false;
          slider.classList.remove("is-dragging");
          try {
            slider.releasePointerCapture(e.pointerId);
          } catch (_) {}
          triggerUnlock();
        }
      }

      function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        slider.classList.remove("is-dragging");

        try {
          slider.releasePointerCapture(e.pointerId);
        } catch (_) {}

        const progress = maxTravel > 0 ? currentX / maxTravel : 0;

        // ONLY when slid left to right (>= 70%) does the form appear
        if (progress >= 0.70) {
          triggerUnlock();
        } else {
          resetSlider();
          // If clicked or tapped without sliding, gently nudge to guide the user
          if (!hasMoved) {
            triggerNudge();
          }
        }
      }

      slider.addEventListener("pointerdown", onPointerDown);
      slider.addEventListener("pointermove", onPointerMove);
      slider.addEventListener("pointerup", onPointerUp);
      slider.addEventListener("pointercancel", onPointerUp);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);

      // Prevent native browser dragging of SVGs / text
      slider.addEventListener("dragstart", function (e) {
        e.preventDefault();
      });

      // Keyboard Accessibility: ArrowRight slides left-to-right to unlock
      slider.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          triggerUnlock();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          // Visual nudge showing user should slide
          triggerNudge();
        }
      });

      // Reset slider when modal closes
      if (modal) {
        const closeTriggers = modal.querySelectorAll("[data-close-contact]");
        closeTriggers.forEach(function (trigger) {
          trigger.addEventListener("click", function () {
            setTimeout(resetSlider, 350);
          });
        });

        window.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && modal.classList.contains("is-open")) {
            setTimeout(resetSlider, 350);
          }
        });

        if ("MutationObserver" in window) {
          const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.attributeName === "class") {
                if (!modal.classList.contains("is-open")) {
                  setTimeout(resetSlider, 250);
                }
              }
            });
          });
          observer.observe(modal, { attributes: true });
        }
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
