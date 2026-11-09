/**
 * Section 07 — Finale Architectural CTA & Contact Popup Module
 * 5-Panel Curtain Slide Animation, Scroll Reveals & FAQ Accordion
 * Pure Vanilla JavaScript · Zero Dependencies · 60fps Hardware Accelerated
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initContactSection() {
    if (isInitialized) return;
    isInitialized = true;

    const ctaSection = document.getElementById("contact") || document.querySelector(".cta-section");
    const popup = document.getElementById("contact-modal");
    if (!popup) return;

    const curtain = popup.querySelector(".page-transition");
    const scrollContainer = document.getElementById("contact-popup-scroll") || popup.querySelector(".contact-popup-scroll");
    let isTransitioning = false;
    let scrollObserver = null;

    // 1. Initialize Scroll Animations inside Popup
    function initPopupScrollAnimations() {
      if (scrollObserver) {
        scrollObserver.disconnect();
      }

      if ("IntersectionObserver" in window) {
        scrollObserver = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
              }
            });
          },
          {
            root: scrollContainer,
            threshold: 0.15,
          }
        );

        popup.querySelectorAll(".reveal-text, .animate-line, .footer-wordmark").forEach(function (el) {
          scrollObserver.observe(el);
        });
      } else {
        popup.querySelectorAll(".reveal-text, .animate-line, .footer-wordmark").forEach(function (el) {
          el.classList.add("is-visible");
        });
      }
    }

    // 2. Open Contact Popup Modal with 5-Panel Curtain Slide
    function openContactPopup() {
      if (isTransitioning) return;
      isTransitioning = true;

      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Reset scroll position
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }

      // Prepare curtain in covering position (translateY: 0)
      if (curtain) {
        curtain.classList.remove("is-hidden");
      }

      // Reveal modal container
      popup.removeAttribute("hidden");
      popup.setAttribute("aria-hidden", "false");
      void popup.offsetWidth; // Force reflow
      popup.classList.add("is-open");

      // Slide curtain panels up with staggered delays (unveil hero)
      setTimeout(function () {
        if (curtain) {
          curtain.classList.add("is-hidden");
        }
        initPopupScrollAnimations();
        isTransitioning = false;

        const firstInput = popup.querySelector("input[name='firstName'], input, button");
        if (firstInput) {
          firstInput.focus({ preventScroll: true });
        }
      }, 70);
    }

    // 3. Close Contact Popup Modal
    function closeContactPopup() {
      if (isTransitioning || popup.hasAttribute("hidden")) return;
      isTransitioning = true;

      // Slide curtain panels back down or fade out
      if (curtain) {
        curtain.classList.remove("is-hidden");
      }
      popup.classList.remove("is-open");

      setTimeout(function () {
        popup.setAttribute("hidden", "");
        popup.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (scrollObserver) {
          scrollObserver.disconnect();
        }

        // Reset reveals for next open
        popup.querySelectorAll(".reveal-text, .animate-line, .footer-wordmark").forEach(function (el) {
          el.classList.remove("is-visible");
        });

        isTransitioning = false;
      }, 550);
    }

    // 4. Bind Open Triggers
    const openBtns = document.querySelectorAll("[data-open-contact], .iphone-swipe-btn");
    openBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openContactPopup();
      });
    });

    // 5. Bind Close Triggers
    popup.querySelectorAll("[data-close-contact], .cp-close-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        closeContactPopup();
      });
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !popup.hasAttribute("hidden")) {
        closeContactPopup();
      }
    });

    // 6. Custom Accordion Logic (FAQ)
    const faqItems = popup.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
      const trigger = item.querySelector(".faq-trigger");
      const content = item.querySelector(".faq-content");
      if (!trigger || !content) return;

      trigger.addEventListener("click", function () {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        // Optional: close other accordion items
        faqItems.forEach(function (otherItem) {
          const otherTrigger = otherItem.querySelector(".faq-trigger");
          const otherContent = otherItem.querySelector(".faq-content");
          if (otherTrigger && otherContent && otherItem !== item) {
            otherTrigger.setAttribute("aria-expanded", "false");
            otherContent.classList.remove("is-open");
          }
        });

        // Toggle clicked item
        if (!isOpen) {
          trigger.setAttribute("aria-expanded", "true");
          content.classList.add("is-open");
        } else {
          trigger.setAttribute("aria-expanded", "false");
          content.classList.remove("is-open");
        }
      });
    });

    // 7. Contact Form Submission
    const contactForm = document.getElementById("nivara-contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const feedback = popup.querySelector(".form-feedback");
        if (feedback) {
          feedback.style.display = "block";
          contactForm.reset();
          setTimeout(function () {
            feedback.style.display = "none";
          }, 6000);
        } else {
          alert("Message sent! A partner will review and reply within two working days.");
          contactForm.reset();
        }
      });
    }

    // 8. Viewport Intersection Entrance Trigger for Section 7 in Page
    if (ctaSection) {
      if ("IntersectionObserver" in window) {
        const ctaObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                ctaSection.classList.add("is-ready");
              }
            });
          },
          { threshold: 0.15 }
        );
        ctaObserver.observe(ctaSection);
      } else {
        ctaSection.classList.add("is-ready");
      }
    }

    // Expose Global API
    window.openContactPopup = openContactPopup;
    window.closeContactPopup = closeContactPopup;
  }

  window.initContactSection = initContactSection;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactSection);
  } else {
    initContactSection();
  }
})();
