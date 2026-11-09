/**
 * Cinematic Scroll-Scrubbed Stats Controller
 * Danish Architectural Aesthetic (Nivara style)
 * Hardware-accelerated clip-path interpolation and tabular number roll-up engine
 * Pure Vanilla JavaScript · 60fps · Zero external dependencies
 */
(function () {
  "use strict";

  function initStatsTrack() {
    const track = document.getElementById("stats") || document.querySelector(".js-stats-track");
    if (!track) return;

    const frame = track.querySelector(".js-stats-frame");
    const image = track.querySelector(".js-stats-image");
    const scrim = track.querySelector(".js-stats-scrim");
    const content = track.querySelector(".js-stats-content");
    const hairlines = Array.from(track.querySelectorAll(".js-stat-hairline"));
    const statNums = Array.from(track.querySelectorAll(".js-stat-num"));

    const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cache targets
    const numData = statNums.map(function (el) {
      return {
        el: el,
        target: parseInt(el.getAttribute("data-target") || "0", 10),
        prefix: el.getAttribute("data-prefix") || "",
        suffix: el.getAttribute("data-suffix") || ""
      };
    });

    if (isReduced) {
      numData.forEach(function (d) {
        d.el.textContent = d.prefix + d.target + d.suffix;
      });
      return;
    }

    let ticking = false;

    function update() {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = rect.height - vh;

      if (totalScroll <= 0) {
        ticking = false;
        return;
      }

      const progress = Math.max(0, Math.min(1, -rect.top / totalScroll));

      // Phase 1: Frame Clip-Path Expansion & Image Settle (0.00 -> 0.42)
      if (frame && image) {
        const p1 = Math.min(1, Math.max(0, progress / 0.42));
        const easedP1 = p1 * (2 - p1); // easeOutQuad
        const insetY = (18 * (1 - easedP1)).toFixed(2);
        const insetX = (20 * (1 - easedP1)).toFixed(2);
        const scale = (1.16 - 0.16 * easedP1).toFixed(3);

        frame.style.clipPath = "inset(" + insetY + "% " + insetX + "%)";
        image.style.transform = "scale(" + scale + ")";
      }

      // Phase 2: Scrim Darkening (0.26 -> 0.55)
      if (scrim) {
        const p2 = Math.min(1, Math.max(0, (progress - 0.26) / 0.29));
        scrim.style.opacity = (p2 * 0.58).toFixed(3);
      }

      // Phase 3: Content Container Fade & Glide (0.32 -> 0.58)
      if (content) {
        const p3 = Math.min(1, Math.max(0, (progress - 0.32) / 0.26));
        content.style.opacity = p3.toFixed(3);
        const translateY = ((1 - p3) * 40).toFixed(1);
        content.style.transform = "translate3d(0, " + translateY + "px, 0)";
      }

      // Phase 4: Staggered Hairline Rules Draw (0.36 -> 0.68)
      hairlines.forEach(function (line, idx) {
        const start = 0.36 + idx * 0.05;
        const dur = 0.18;
        const pLine = Math.min(1, Math.max(0, (progress - start) / dur));
        line.style.transform = "scaleX(" + pLine.toFixed(3) + ")";
      });

      // Phase 5: Tabular Numbers Roll-up (0.40 -> 0.85)
      const pNum = Math.min(1, Math.max(0, (progress - 0.40) / 0.45));
      const easedNum = pNum === 1 ? 1 : 1 - Math.pow(2, -10 * pNum); // easeOutExpo

      numData.forEach(function (d) {
        const val = Math.round(d.target * easedNum);
        d.el.textContent = d.prefix + val + d.suffix;
      });

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    requestTick();
  }

  window.initStatsTrack = initStatsTrack;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStatsTrack);
  } else {
    initStatsTrack();
  }
})();
