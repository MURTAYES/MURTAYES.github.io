/**
 * Cinematic Scroll-Scrubbed Stats Controller (Nivara Danish Architectural Style)
 * Hardware-accelerated clip-path interpolation, scrim darkening, and tabular number engine
 * Pure Vanilla JavaScript · 60fps · Zero external dependencies
 */
(function () {
  "use strict";

  function initStatsTrack() {
    const track = document.getElementById("stats") || document.querySelector('[aria-labelledby="stats-title"]');
    if (!track) return;

    // Elements
    const frame = track.querySelector('[style*="clip-path"]') || track.querySelector('.stats-frame');
    const image = track.querySelector('[style*="scale"]') || track.querySelector('.stats-image');
    const scrim = track.querySelector('.bg-ink:not([style*="clip-path"])') || track.querySelector('.stats-scrim');
    const content = track.querySelector('[style*="translateY"]') || track.querySelector('.stats-content');
    const hairlines = Array.from(track.querySelectorAll('.bg-paper\\/30, .js-stat-hairline'));
    const statNums = Array.from(track.querySelectorAll('.tabular-nums'));

    const isReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cache targets from text or data-target attribute
    const numData = statNums.map(function (el) {
      const rawText = el.textContent.trim();
      const hasK = rawText.includes("k");
      const hasPlus = rawText.includes("+");
      const hasPct = rawText.includes("%");
      const hasLt = rawText.includes("<") || rawText.includes("&lt;");
      const parsedNum = parseInt(rawText.replace(/[^0-9]/g, ""), 10) || 0;

      const target = el.getAttribute("data-target") ? parseInt(el.getAttribute("data-target"), 10) : parsedNum;
      let suffix = el.getAttribute("data-suffix") || "";
      let prefix = el.getAttribute("data-prefix") || "";

      if (!suffix) {
        if (hasK) suffix = "k";
        else if (hasPlus) suffix = "+";
        else if (hasPct) suffix = "%";
        else if (rawText.endsWith("ms")) suffix = "ms";
      }
      if (!prefix && hasLt) prefix = "<";

      return {
        el: el,
        target: target,
        prefix: prefix,
        suffix: suffix
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

      // Phase 1: Frame Clip-Path Expansion (30% 35% -> 0% 0%) & Image Settle (1.25 -> 1.0)
      if (frame && image) {
        const p1 = Math.min(1, Math.max(0, progress / 0.42));
        const easedP1 = p1 * (2 - p1); // easeOutQuad
        const isMobile = window.innerWidth < 768;
        const startY = isMobile ? 18 : 30;
        const startX = isMobile ? 15 : 35;
        const insetY = (startY * (1 - easedP1)).toFixed(2);
        const insetX = (startX * (1 - easedP1)).toFixed(2);
        const scale = (1.25 - 0.25 * easedP1).toFixed(3);

        frame.style.clipPath = "inset(" + insetY + "% " + insetX + "%)";
        image.style.transform = "scale(" + scale + ")";
      }

      // Phase 2: Scrim Darkening (0.24 -> 0.54)
      if (scrim) {
        const p2 = Math.min(1, Math.max(0, (progress - 0.24) / 0.30));
        scrim.style.opacity = (p2 * 0.65).toFixed(3);
      }

      // Phase 3: Content Container Fade & Glide (0.28 -> 0.56)
      if (content) {
        const p3 = Math.min(1, Math.max(0, (progress - 0.28) / 0.28));
        content.style.opacity = p3.toFixed(3);
        const translateY = ((1 - p3) * 40).toFixed(1);
        content.style.transform = "translate3d(0, " + translateY + "px, 0)";
      }

      // Phase 4: Staggered Hairline Rules Draw (0.34 -> 0.66)
      hairlines.forEach(function (line, idx) {
        const start = 0.34 + idx * 0.05;
        const dur = 0.18;
        const pLine = Math.min(1, Math.max(0, (progress - start) / dur));
        line.style.transform = "scaleX(" + pLine.toFixed(3) + ")";
      });

      // Phase 5: Tabular Numbers Roll-up (0.38 -> 0.85)
      const pNum = Math.min(1, Math.max(0, (progress - 0.38) / 0.47));
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
