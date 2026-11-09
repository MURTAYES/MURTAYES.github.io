/**
 * Multiplayer Collaborative Canvas Engine
 * Pure Vanilla JavaScript · 60fps GPU Hardware-Accelerated Transforms
 * Zero External Dependencies
 */
(function () {
  "use strict";

  function initMultiplayerCanvas() {
    const canvasSection = document.getElementById("canvas") || document.querySelector(".home-hero-canvas");
    if (!canvasSection) return;

    // ------------------------------------------------------------------------
    // 1. Mouse-Driven Multi-Layer Lerp Parallax
    // ------------------------------------------------------------------------
    const floatElements = canvasSection.querySelectorAll(".js-home-hero-float");
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let isMouseOverSection = false;

    window.addEventListener("mousemove", (e) => {
      const rect = canvasSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        isMouseOverSection = true;
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      } else {
        isMouseOverSection = false;
      }
    }, { passive: true });

    function animateParallax() {
      // Smooth lerp damping towards target mouse coordinates
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      floatElements.forEach((el) => {
        const factor = parseFloat(el.getAttribute("data-float-parallax") || "0.1") * 90;
        const rotate = parseFloat(el.getAttribute("data-base-rotate") || "0");
        const tx = (currentX * factor).toFixed(2);
        const ty = (currentY * factor).toFixed(2);
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rotate}deg)`;
      });

      requestAnimationFrame(animateParallax);
    }
    requestAnimationFrame(animateParallax);

    // ------------------------------------------------------------------------
    // 2. Draggable Centerpiece & Figma Selection Box
    // ------------------------------------------------------------------------
    const title = canvasSection.querySelector(".home-hero__titulo.is-draggable");
    const selectionBox = canvasSection.querySelector(".js-home-hero-seleccion");
    const dimBadge = selectionBox ? selectionBox.querySelector(".seleccion-dimension") : null;

    if (title && selectionBox) {
      let isDragging = false;
      let startX = 0, startY = 0;
      let dragOffsetX = 0, dragOffsetY = 0;

      title.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startX = e.clientX - dragOffsetX;
        startY = e.clientY - dragOffsetY;
        title.setPointerCapture(e.pointerId);
        title.classList.add("is-dragging");
      });

      title.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        dragOffsetX = e.clientX - startX;
        dragOffsetY = e.clientY - startY;

        const transformStr = `translate3d(${dragOffsetX.toFixed(1)}px, ${dragOffsetY.toFixed(1)}px, 0)`;
        title.style.transform = transformStr;
        selectionBox.style.transform = transformStr;

        if (dimBadge) {
          const rect = title.getBoundingClientRect();
          dimBadge.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)} · X:${Math.round(dragOffsetX)} Y:${Math.round(dragOffsetY)}`;
        }
      });

      function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        title.classList.remove("is-dragging");
        try {
          title.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }

      title.addEventListener("pointerup", endDrag);
      title.addEventListener("pointercancel", endDrag);
    }

    // ------------------------------------------------------------------------
    // 3. Coordinate Grid Trail Illumination
    // ------------------------------------------------------------------------
    const litContainer = canvasSection.querySelector(".js-grilla-lit");
    if (litContainer) {
      const cellW = 60.27;
      const cellH = 60.5;
      const activeCells = new Map();

      canvasSection.addEventListener("mousemove", (e) => {
        const rect = canvasSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

        const col = Math.floor(x / cellW);
        const row = Math.floor(y / cellH);
        const key = `${col}_${row}`;

        if (!activeCells.has(key)) {
          const cellEl = document.createElement("div");
          cellEl.className = "grilla-celda-activa";
          cellEl.style.left = `${col * cellW}px`;
          cellEl.style.top = `${row * cellH}px`;
          litContainer.appendChild(cellEl);
          activeCells.set(key, cellEl);

          setTimeout(() => {
            cellEl.style.opacity = "0";
            setTimeout(() => {
              if (cellEl.parentNode) cellEl.parentNode.removeChild(cellEl);
              activeCells.delete(key);
            }, 850);
          }, 350);
        }
      }, { passive: true });
    }

    // ------------------------------------------------------------------------
    // 4. Autonomous Role Cursors (7 Collaborative Personas)
    // ------------------------------------------------------------------------
    const cursors = canvasSection.querySelectorAll(".js-home-hero-cursor");
    const cursorConfigs = [
      { fx: 0.00065, fy: 0.00078, rx: 0.38, ry: 0.32, px: 0.2, py: 0.8 },
      { fx: 0.00085, fy: 0.00060, rx: 0.34, ry: 0.36, px: 1.5, py: 2.1 },
      { fx: 0.00072, fy: 0.00092, rx: 0.40, ry: 0.28, px: 3.1, py: 0.5 },
      { fx: 0.00090, fy: 0.00074, rx: 0.32, ry: 0.35, px: 4.2, py: 1.8 },
      { fx: 0.00060, fy: 0.00082, rx: 0.36, ry: 0.30, px: 2.4, py: 3.4 },
      { fx: 0.00078, fy: 0.00068, rx: 0.30, ry: 0.34, px: 0.9, py: 2.7 },
      { fx: 0.00082, fy: 0.00088, rx: 0.35, ry: 0.33, px: 5.0, py: 1.2 }
    ];

    function animateCursors(time) {
      const rect = canvasSection.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      cursors.forEach((cur, i) => {
        const cfg = cursorConfigs[i % cursorConfigs.length];
        const cx = w * 0.5;
        const cy = h * 0.5;

        // Smooth continuous Lissajous curve
        const x = cx + (w * cfg.rx) * Math.sin(time * cfg.fx + cfg.px) + Math.cos(time * 0.0003) * 20;
        const y = cy + (h * cfg.ry) * Math.cos(time * cfg.fy + cfg.py) + Math.sin(time * 0.0004) * 15;

        cur.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });

      requestAnimationFrame(animateCursors);
    }
    requestAnimationFrame(animateCursors);

    // ------------------------------------------------------------------------
    // 5. "Modo IA" Pill Switch
    // ------------------------------------------------------------------------
    const aiSwitch = canvasSection.querySelector(".js-home-hero-switch");
    if (aiSwitch) {
      let isAiActive = false;
      let intervalMs = parseInt(aiSwitch.getAttribute("data-switch-interval") || "4000", 10);
      let switchTimer = null;

      function setAiState(active) {
        isAiActive = active;
        aiSwitch.classList.toggle("is-active", isAiActive);
        aiSwitch.setAttribute("aria-pressed", String(isAiActive));
      }

      function toggleAi() {
        setAiState(!isAiActive);
      }

      function startAutoSwitch() {
        if (switchTimer) clearInterval(switchTimer);
        switchTimer = setInterval(toggleAi, intervalMs);
      }

      aiSwitch.addEventListener("click", () => {
        toggleAi();
        startAutoSwitch(); // Reset interval on user interaction
      });

      startAutoSwitch();
    }

    // ------------------------------------------------------------------------
    // 6. Live macOS Code Typing Block
    // ------------------------------------------------------------------------
    const codeEl = canvasSection.querySelector(".js-live-type-code");
    if (codeEl) {
      const codeSnippet = `import { studio } from "@samnun/core";

const canvas = studio.mount({
  fps: 60,
  latency: "0ms",
  motion: "fluid"
});

export default canvas;`;

      let charIdx = 0;
      let isDeleting = false;
      let pauseTimer = null;

      function typeLoop() {
        if (!isDeleting) {
          charIdx++;
          codeEl.textContent = codeSnippet.substring(0, charIdx);
          if (charIdx >= codeSnippet.length) {
            isDeleting = true;
            pauseTimer = setTimeout(typeLoop, 3200);
            return;
          }
          setTimeout(typeLoop, 35);
        } else {
          charIdx--;
          codeEl.textContent = codeSnippet.substring(0, charIdx);
          if (charIdx <= 0) {
            isDeleting = false;
            pauseTimer = setTimeout(typeLoop, 800);
            return;
          }
          setTimeout(typeLoop, 15);
        }
      }

      typeLoop();
    }
  }

  window.initMultiplayerCanvas = initMultiplayerCanvas;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMultiplayerCanvas);
  } else {
    initMultiplayerCanvas();
  }
})();
