/**
 * What I'm Building — Danish Architectural Sine-Wave Progression
 * Scroll-Driven Liquid Dasharray & Station Coordinates Scrub Engine
 * Pure Vanilla JavaScript · 60fps GPU Hardware Accelerated
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initBuildingTimeline() {
    if (isInitialized) return;
    isInitialized = true;

    const section = document.getElementById("building");
    if (!section) return;

    const path = section.querySelector(".js-building-path");
    const nodes = Array.from(section.querySelectorAll(".js-building-node"));
    const stations = Array.from(section.querySelectorAll(".js-building-station"));

    const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const STATION_METRICS = [
      { threshold: 0.02, isAbove: true },
      { threshold: 0.398, isAbove: false },
      { threshold: 0.514, isAbove: true },
      { threshold: 0.602, isAbove: false },
      { threshold: 0.660, isAbove: true },
      { threshold: 0.980, isAbove: false }
    ];

    if (isReduced) {
      if (path) path.setAttribute("stroke-dasharray", "1 1");
      nodes.forEach(function (n) {
        n.classList.add("is-active");
      });
      stations.forEach(function (s) {
        const inner = s.querySelector(".station-inner");
        if (inner) {
          inner.style.opacity = "1";
          inner.style.transform = "none";
        }
      });
      return;
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let isTicking = false;

    function calculateProgress() {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const start = viewportHeight * 0.80;
      const distance = rect.height * 0.75 + viewportHeight * 0.35;

      if (distance <= 0) return 0;
      const raw = (start - rect.top) / distance;
      return Math.max(0, Math.min(1, raw));
    }

    function render() {
      // Lerp for 60fps fluid scrubbing
      currentProgress += (targetProgress - currentProgress) * 0.14;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      // 1. Scrub SVG sine wave path stroke-dasharray
      if (path) {
        path.setAttribute("stroke-dasharray", currentProgress.toFixed(4) + " 1");
      }

      // 2. Scrub station nodes & callout cards
      STATION_METRICS.forEach(function (metric, idx) {
        const node = nodes[idx];
        const station = stations[idx];
        const t = metric.threshold;

        // Circle Node trigger
        if (node) {
          if (currentProgress >= t - 0.015) {
            node.classList.add("is-active");
          } else {
            node.classList.remove("is-active");
          }
        }

        // Station Card opacity & translateY transition
        if (station) {
          const inner = station.querySelector(".station-inner");
          if (inner) {
            const windowSpan = 0.055;
            const cardProgress = Math.max(0, Math.min(1, (currentProgress - (t - 0.015)) / windowSpan));
            inner.style.opacity = cardProgress.toFixed(4);
            const yOffset = (1 - cardProgress) * (metric.isAbove ? 8 : -8);
            inner.style.transform = "translateY(" + yOffset.toFixed(2) + "px)";
          }
        }
      });

      // Continue animation loop if still lerping
      if (Math.abs(targetProgress - currentProgress) > 0.0005) {
        requestAnimationFrame(render);
      } else {
        isTicking = false;
      }
    }

    function onScrollOrResize() {
      targetProgress = calculateProgress();
      updateThemeOnScroll();
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(render);
      }
    }

    // Attach passive listeners
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // Initial calculation
    targetProgress = calculateProgress();
    currentProgress = targetProgress;
    render();

    // --------------------------------------------------------------------------
    // White -> Black -> White Hysteresis Viewport Scrub Engine
    // Ensures seamless 0.8s cubic-bezier cross-fades without premature cutoffs
    // --------------------------------------------------------------------------
    var BODY_DARK_CLASS = "is-dark";
    var SWITCHING_CLASS = "theme-switching";
    var SWITCHING_DURATION = 850;

    var switchingTimeout = null;

    function setDarkMode(activar) {
      var body = document.body;

      if (activar === body.classList.contains(BODY_DARK_CLASS)) {
        return;
      }

      body.classList.add(SWITCHING_CLASS);

      if (activar) {
        body.classList.add(BODY_DARK_CLASS);
      } else {
        body.classList.remove(BODY_DARK_CLASS);
      }

      if (switchingTimeout) {
        clearTimeout(switchingTimeout);
      }

      switchingTimeout = setTimeout(function () {
        body.classList.remove(SWITCHING_CLASS);
        switchingTimeout = null;
      }, SWITCHING_DURATION);
    }

    function updateThemeOnScroll() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var isDarkCurrent = document.body.classList.contains(BODY_DARK_CLASS);

      var shouldBeDark = false;
      if (isDarkCurrent) {
        // Hysteresis exit: stay dark until top scrolls down past 75% or bottom scrolls up past 20%
        shouldBeDark = rect.top < vh * 0.75 && rect.bottom > vh * 0.20;
      } else {
        // Hysteresis enter: turn dark when top reaches 60% and bottom is still below 35%
        shouldBeDark = rect.top <= vh * 0.60 && rect.bottom >= vh * 0.35;
      }

      setDarkMode(shouldBeDark);
    }

    // Initial theme check
    updateThemeOnScroll();

    if ("IntersectionObserver" in window) {
      var darkThemeObserver = new IntersectionObserver(
        function () {
          updateThemeOnScroll();
        },
        {
          root: null,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
        }
      );

      darkThemeObserver.observe(section);
    }

    // Connect Dossier Quick Jump Links to Selected Works Folders
    const dossierLinks = section.querySelectorAll(".js-dossier-jump");
    dossierLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        const folderTarget = link.getAttribute("data-target-folder");
        if (!folderTarget) return;

        const targetFolderEl = document.querySelector('.folder-card[data-folder="' + folderTarget + '"]');
        if (targetFolderEl) {
          setTimeout(function () {
            targetFolderEl.click();
          }, 400);
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
