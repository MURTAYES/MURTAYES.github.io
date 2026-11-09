/**
 * Selected Works Architecture Module (Pure Vanilla JavaScript)
 * Tactile Architectural Folders with Embedded Brand Logos & Fluid Docket Modals
 * Zero External Dependencies · 100% Robust
 */
(function () {
  "use strict";

  function initSelectedWorks() {
    const folders = Array.from(document.querySelectorAll(".folder, .js-folder-trigger"));
    const wins = Array.from(document.querySelectorAll(".win"));
    const backdrop = document.getElementById("dossier-backdrop");

    if (wins.length === 0) return;

    let activeIndex = -1;
    let isTransitioning = false;

    // Open a specific project dossier modal
    function openDossier(index) {
      if (isTransitioning) return;
      const targetWin = wins[index];
      if (!targetWin) return;

      isTransitioning = true;
      activeIndex = index;

      // 1. Tactile Folder animation
      const folder = folders[index];
      if (folder) {
        folder.classList.add("is-opening");
      }

      // 2. Backdrop activation
      if (backdrop) {
        backdrop.classList.add("is-active");
      }

      // 3. Docket Window activation
      targetWin.removeAttribute("hidden");
      // Force reflow
      void targetWin.offsetWidth;
      targetWin.classList.add("is-open");

      // 4. Lock page scrolling
      document.body.style.overflow = "hidden";

      // 5. Focus management
      const closeBtn = targetWin.querySelector(".win-close-btn, .dot.r, [data-close-win]");
      if (closeBtn) {
        setTimeout(function () {
          closeBtn.focus({ preventScroll: true });
        }, 100);
      }

      setTimeout(function () {
        isTransitioning = false;
      }, 380);
    }

    // Close the currently open dossier modal
    function closeDossier() {
      if (isTransitioning || activeIndex < 0) return;
      const currentWin = wins[activeIndex];
      if (!currentWin) return;

      isTransitioning = true;

      // 1. Remove active classes
      currentWin.classList.remove("is-open");
      if (backdrop) {
        backdrop.classList.remove("is-active");
      }

      // 2. Remove folder active state
      folders.forEach(function (f) {
        f.classList.remove("is-opening");
      });

      // 3. Restore scrolling
      document.body.style.overflow = "";

      // 4. Hide window after transition completes
      setTimeout(function () {
        currentWin.setAttribute("hidden", "");
        activeIndex = -1;
        isTransitioning = false;
      }, 350);
    }

    // Bind Folders and Sheets
    folders.forEach(function (folder, idx) {
      // Click on folder or any child
      folder.addEventListener("click", function (e) {
        e.preventDefault();
        const clickedIndex = folder.getAttribute("data-dossier-index") !== null
          ? parseInt(folder.getAttribute("data-dossier-index"), 10)
          : idx;
        openDossier(clickedIndex);
      });

      // Keyboard support on folder
      folder.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const clickedIndex = folder.getAttribute("data-dossier-index") !== null
            ? parseInt(folder.getAttribute("data-dossier-index"), 10)
            : idx;
          openDossier(clickedIndex);
        }
      });
    });

    // Bind Inspect Buttons in Text Side
    document.querySelectorAll(".js-open-dossier").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute("data-dossier-index"), 10);
        openDossier(isNaN(idx) ? 0 : idx);
      });
    });

    // Close on Backdrop Click
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        closeDossier();
      });
    }

    // Close on Dot, Close Button, or Escape Key
    document.addEventListener("click", function (e) {
      if (activeIndex > -1) {
        if (e.target.closest(".dot.r, .dot.y, .win-close-btn, [data-close-win]")) {
          e.preventDefault();
          closeDossier();
        }
      }
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && activeIndex > -1) {
        closeDossier();
      }
    });

    // Cross-Section Jump Links (e.g. from Section 6 "What I'm building")
    document.querySelectorAll(".js-dossier-jump").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = link.getAttribute("data-target-folder");
        const map = { applykit: 0, pharmaerp: 1, eduhub: 2, edu52: 2 };
        const index = map[target] !== undefined ? map[target] : 0;
        const targetSection = document.getElementById("works");

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(function () {
            openDossier(index);
          }, 550);
        }
      });
    });

    // Expose API
    window.openWorksDossier = openDossier;
    window.closeWorksDossier = closeDossier;
  }

  window.initSelectedWorks = initSelectedWorks;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSelectedWorks);
  } else {
    initSelectedWorks();
  }
})();
