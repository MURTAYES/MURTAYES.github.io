/**
 * What I'm Building Timeline Engine
 * Synchronized SVG Sine-Wave Draw & Station Pop-In Controller
 * Pure Vanilla JavaScript · 60fps GPU Hardware Accelerated
 */
(function () {
  "use strict";

  function initBuildingTimeline() {
    const section = document.getElementById("building") || document.querySelector(".js-building-section");
    if (!section) return;

    const drawPath = section.querySelector(".js-sine-draw-path");
    const nodes = Array.from(section.querySelectorAll(".js-sine-node"));
    const cards = Array.from(section.querySelectorAll(".js-building-card"));

    const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      if (drawPath) drawPath.style.strokeDashoffset = "0";
      nodes.forEach(function (n) { n.classList.add("is-active"); });
      cards.forEach(function (c) { c.classList.add("is-visible"); });
      return;
    }

    // Initialize draw state
    if (drawPath) {
      drawPath.style.strokeDasharray = "1";
      drawPath.style.strokeDashoffset = "1";
    }

    let hasTriggered = false;

    // Node & card trigger schedule (milliseconds after draw start)
    const schedule = [
      { delay: 280, nodeIndex: 0 },
      { delay: 720, nodeIndex: 1 },
      { delay: 1160, nodeIndex: 2 },
      { delay: 1600, nodeIndex: 3 }
    ];

    function activateTimeline() {
      if (hasTriggered) return;
      hasTriggered = true;

      // Draw curve path
      if (drawPath) {
        drawPath.style.strokeDashoffset = "0";
      }

      // Stagger station node and card activations
      schedule.forEach(function (item) {
        setTimeout(function () {
          if (nodes[item.nodeIndex]) {
            nodes[item.nodeIndex].classList.add("is-active");
          }
          if (cards[item.nodeIndex]) {
            cards[item.nodeIndex].classList.add("is-visible");
          }
        }, item.delay);
      });
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            activateTimeline();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(section);
    } else {
      activateTimeline();
    }

    // Connect Dossier Quick Jump Links to Selected Works Overlay
    const dossierLinks = section.querySelectorAll(".js-dossier-jump");
    dossierLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        const folderTarget = link.getAttribute("data-target-folder");
        if (!folderTarget) return;

        const targetFolderEl = document.querySelector('.folder-card[data-folder="' + folderTarget + '"]');
        if (targetFolderEl) {
          setTimeout(function () {
            targetFolderEl.click();
          }, 350);
        }
      });
    });
  }

  window.initBuildingTimeline = initBuildingTimeline;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBuildingTimeline);
  } else {
    initBuildingTimeline();
  }
})();
