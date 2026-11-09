/**
 * Selected Works Architecture Module
 * Handles kinetic title entrance, 3D tactile folder interactions,
 * bottom slide-up archival drawer inspection, and EduHub 76% WIP progress animation.
 */
(function () {
  "use strict";

  function initSelectedWorks() {
    const worksSection = document.getElementById("works");
    if (!worksSection) return;

    const titleLine = worksSection.querySelector(".lline");
    const folders = Array.from(worksSection.querySelectorAll(".folder-card"));
    const overlay = document.getElementById("works-dossier-overlay");
    const slidePanel = document.getElementById("dossier-slide-panel");
    const backdrop = document.getElementById("dossier-overlay-backdrop");
    const dismissBtn = document.getElementById("dossier-dismiss-btn");
    const panels = Array.from(worksSection.querySelectorAll(".works-dossier-panel"));
    const progressBar = document.getElementById("eduhub-progress-bar");
    const progressNum = document.getElementById("eduhub-progress-num");

    let activeFolderId = null;
    let progressAnimTimeout = null;
    let numberAnimInterval = null;

    // 1. Kinetic Section Title Reveal on Scroll
    function onScroll() {
      const rect = worksSection.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.top <= vh * 0.88 && rect.bottom >= 0) {
        if (titleLine) titleLine.classList.add("is-visible");
        worksSection.classList.add("is-visible");
      }
    }

    // 2. Animate EduHub 76% Progress Counter
    function animateEduhubProgress() {
      if (!progressBar) return;

      // Clear any ongoing animations
      if (progressAnimTimeout) clearTimeout(progressAnimTimeout);
      if (numberAnimInterval) clearInterval(numberAnimInterval);

      // Start from 0% and animate to 76%
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      if (progressNum) progressNum.textContent = "0%";

      // Force reflow
      progressBar.offsetHeight;

      progressBar.style.transition = "width 1.25s cubic-bezier(0.16, 1, 0.3, 1)";
      progressBar.style.width = "76%";

      // Number count up to 76%
      let currentVal = 0;
      const targetVal = 76;
      const durationMs = 1100;
      const stepMs = 20;
      const totalSteps = durationMs / stepMs;
      const increment = targetVal / totalSteps;

      numberAnimInterval = setInterval(() => {
        currentVal += increment;
        if (currentVal >= targetVal) {
          currentVal = targetVal;
          clearInterval(numberAnimInterval);
        }
        if (progressNum) {
          progressNum.textContent = Math.round(currentVal) + "%";
        }
      }, stepMs);
    }

    // 3. Open Slide-Up Archival Dossier
    function openDossier(folderId) {
      activeFolderId = folderId;

      // Update folder states
      folders.forEach((card) => {
        const isMatch = card.getAttribute("data-folder") === folderId;
        card.classList.toggle("is-active", isMatch);
        card.setAttribute("aria-selected", isMatch ? "true" : "false");

        // If locked folder clicked, trigger tactile padlock shake
        if (isMatch && card.classList.contains("folder--locked")) {
          card.classList.remove("is-shaking");
          // Force reflow for re-triggering keyframes
          void card.offsetWidth;
          card.classList.add("is-shaking");
          setTimeout(() => {
            card.classList.remove("is-shaking");
          }, 500);
        }
      });

      // Show matching dossier article inside drawer
      panels.forEach((panel) => {
        const isMatch = panel.getAttribute("data-dossier") === folderId;
        if (isMatch) {
          panel.classList.add("is-active");
          // If EduHub was chosen, trigger progress bar animation
          if (folderId === "eduhub") {
            animateEduhubProgress();
          }
        } else {
          panel.classList.remove("is-active");
        }
      });

      // Slide up the overlay
      if (overlay) {
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent background body scroll
      }

      // Reset scroll position inside slide content
      const slideContent = document.getElementById("works-dossier-viewer");
      if (slideContent) {
        slideContent.scrollTop = 0;
      }
    }

    // 4. Close Slide-Up Archival Dossier
    function closeDossier() {
      activeFolderId = null;

      // Reset folder active states
      folders.forEach((card) => {
        card.classList.remove("is-active");
        card.setAttribute("aria-selected", "false");
      });

      // Slide drawer down
      if (overlay) {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      // Clear any pending timer
      if (progressAnimTimeout) clearTimeout(progressAnimTimeout);
      if (numberAnimInterval) clearInterval(numberAnimInterval);

      // Deactivate panels after slide-down completes
      setTimeout(() => {
        if (!overlay || !overlay.classList.contains("is-open")) {
          panels.forEach((panel) => panel.classList.remove("is-active"));
        }
      }, 400);
    }

    // 5. Attach Event Handlers to Folder Cards
    folders.forEach((folder) => {
      const folderId = folder.getAttribute("data-folder");

      folder.addEventListener("click", (e) => {
        e.preventDefault();
        openDossier(folderId);
      });

      folder.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDossier(folderId);
        }
      });
    });

    // 6. Dismiss Handlers (Close button, Backdrop click, Escape key)
    if (dismissBtn) {
      dismissBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeDossier();
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        e.preventDefault();
        closeDossier();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) {
        e.preventDefault();
        closeDossier();
      }
    });

    // 7. Touch Swipe Down Gesture to Dismiss on Mobile
    if (slidePanel) {
      let touchStartY = 0;
      let touchCurrentY = 0;

      slidePanel.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches && e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
          }
        },
        { passive: true }
      );

      slidePanel.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches && e.touches.length === 1) {
            touchCurrentY = e.touches[0].clientY;
          }
        },
        { passive: true }
      );

      slidePanel.addEventListener("touchend", () => {
        const slideContent = document.getElementById("works-dossier-viewer");
        const isAtTop = !slideContent || slideContent.scrollTop <= 5;
        if (isAtTop && touchCurrentY - touchStartY > 90) {
          closeDossier();
        }
        touchStartY = 0;
        touchCurrentY = 0;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  window.initSelectedWorks = initSelectedWorks;
})();
