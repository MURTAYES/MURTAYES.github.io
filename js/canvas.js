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

    const inner = canvasSection.querySelector(".home-hero__inner") || canvasSection;

    // ------------------------------------------------------------------------
    // 1. Mouse-Driven Multi-Layer Lerp Parallax
    // ------------------------------------------------------------------------
    const floatElements = canvasSection.querySelectorAll(".js-home-hero-float");
    let mouseNormX = 0, mouseNormY = 0;
    let lerpX = 0, lerpY = 0;
    let userX = -9999, userY = -9999;
    let isMouseInside = false;

    // Reveal floating items
    floatElements.forEach(function (el) {
      el.classList.add("is-visible");
    });

    window.addEventListener("pointermove", function (e) {
      const rect = canvasSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        isMouseInside = true;
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;
        mouseNormX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.5)));
        mouseNormY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.5)));
        userX = e.clientX - rect.left;
        userY = e.clientY - rect.top;
      } else {
        isMouseInside = false;
        userX = -9999;
        userY = -9999;
      }
    }, { passive: true });

    // Cache element properties to prevent reflows in rAF
    const floatItems = Array.prototype.map.call(floatElements, function (el) {
      return {
        el: el,
        factor: parseFloat(el.getAttribute("data-float-parallax") || "0.1") * 55,
        rotate: parseFloat(el.getAttribute("data-base-rotate") || "0"),
        isCenter: el.getAttribute("data-float-center") === "1"
      };
    });

    // ------------------------------------------------------------------------
    // 2. Autonomous Multiplayer Role Cursors (Anchored Micro-Sways + Repulsion)
    // ------------------------------------------------------------------------
    const cursorEls = canvasSection.querySelectorAll(".js-home-hero-cursor");
    const cursorData = Array.prototype.map.call(cursorEls, function (el, idx) {
      return {
        el: el,
        offsetX: parseFloat(el.getAttribute("data-offset-x") || "0"),
        offsetY: parseFloat(el.getAttribute("data-offset-y") || "0"),
        delay: parseFloat(el.getAttribute("data-cursor-delay") || (idx * 300)),
        phase: idx * 0.85,
        pushX: 0,
        pushY: 0
      };
    });

    // ------------------------------------------------------------------------
    // 3. Main 60fps Animation Loop
    // ------------------------------------------------------------------------
    let lastTime = 0;

    function renderLoop(now) {
      // Lerp mouse damping factor
      lerpX += (mouseNormX - lerpX) * 0.065;
      lerpY += (mouseNormY - lerpY) * 0.065;

      // Update Parallax Floats
      for (let i = 0; i < floatItems.length; i++) {
        const item = floatItems[i];
        const tx = lerpX * item.factor;
        const ty = lerpY * item.factor;

        if (item.isCenter) {
          item.el.style.transform = "translateX(-50%) translate3d(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px, 0) rotate(" + item.rotate + "deg)";
        } else {
          item.el.style.transform = "translate3d(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px, 0) rotate(" + item.rotate + "deg)";
        }
      }

      // Update Cursors
      const rect = canvasSection.getBoundingClientRect();
      const cx = rect.width * 0.5;
      const cy = rect.height * 0.5;

      for (let j = 0; j < cursorData.length; j++) {
        const cur = cursorData[j];
        const t = now + cur.delay;

        // Micro-sway around designated anchor
        const swayX = Math.sin(t * 0.0011 + cur.phase) * 16 + Math.cos(t * 0.0006 + cur.phase * 1.5) * 7;
        const swayY = Math.cos(t * 0.0009 + cur.phase) * 14 + Math.sin(t * 0.0007 + cur.phase * 2.0) * 6;

        let posX = cx + cur.offsetX + swayX;
        let posY = cy + cur.offsetY + swayY;

        // Gentle interactive magnetic repulsion when user cursor is near
        let targetPushX = 0;
        let targetPushY = 0;

        if (isMouseInside && userX > -9000) {
          const dx = posX - userX;
          const dy = posY - userY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            targetPushX = (dx / dist) * force * 35;
            targetPushY = (dy / dist) * force * 35;
          }
        }

        cur.pushX += (targetPushX - cur.pushX) * 0.1;
        cur.pushY += (targetPushY - cur.pushY) * 0.1;

        const finalX = posX + cur.pushX;
        const finalY = posY + cur.pushY;

        cur.el.style.transform = "translate3d(" + finalX.toFixed(2) + "px, " + finalY.toFixed(2) + "px, 0)";
      }

      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    // ------------------------------------------------------------------------
    // 4. Draggable Centerpiece & Figma Selection Box
    // ------------------------------------------------------------------------
    const title = canvasSection.querySelector(".home-hero__titulo.is-draggable");
    const selectionBox = canvasSection.querySelector(".js-home-hero-seleccion");

    function syncSelectionBox() {
      if (!title || !selectionBox) return;
      const titleRect = title.getBoundingClientRect();
      const parentRect = title.parentElement.getBoundingClientRect();
      const left = titleRect.left - parentRect.left;
      const top = titleRect.top - parentRect.top;

      selectionBox.style.width = titleRect.width + "px";
      selectionBox.style.height = titleRect.height + "px";
      selectionBox.style.left = left + "px";
      selectionBox.style.top = top + "px";
    }

    if (title && selectionBox) {
      syncSelectionBox();
      window.addEventListener("resize", syncSelectionBox, { passive: true });

      let isDragging = false;
      let startX = 0, startY = 0;
      let dragOffsetX = 0, dragOffsetY = 0;

      title.addEventListener("pointerdown", function (e) {
        isDragging = true;
        startX = e.clientX - dragOffsetX;
        startY = e.clientY - dragOffsetY;
        title.setPointerCapture(e.pointerId);
        title.classList.add("is-dragging");
      });

      title.addEventListener("pointermove", function (e) {
        if (!isDragging) return;
        dragOffsetX = e.clientX - startX;
        dragOffsetY = e.clientY - startY;

        const transformStr = "translate3d(" + dragOffsetX.toFixed(1) + "px, " + dragOffsetY.toFixed(1) + "px, 0)";
        title.style.transform = transformStr;
        selectionBox.style.transform = transformStr;
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
    // 5. Coordinate Grid Trail Illumination
    // ------------------------------------------------------------------------
    const litContainer = canvasSection.querySelector(".js-grilla-lit");
    if (litContainer) {
      const cellW = 60.2727;
      const cellH = 60.5;
      let lastCellKey = "";

      canvasSection.addEventListener("pointermove", function (e) {
        const rect = canvasSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

        const col = Math.floor(x / cellW);
        const row = Math.floor(y / cellH);
        const key = col + "_" + row;

        if (key !== lastCellKey) {
          lastCellKey = key;
          const cell = document.createElement("div");
          cell.className = "grilla-celda-activa";
          cell.style.left = (col * cellW) + "px";
          cell.style.top = (row * cellH) + "px";
          litContainer.appendChild(cell);

          setTimeout(function () {
            cell.style.opacity = "0";
            setTimeout(function () {
              if (cell.parentNode) {
                cell.parentNode.removeChild(cell);
              }
            }, 650);
          }, 300);
        }
      }, { passive: true });
    }

    // ------------------------------------------------------------------------
    // 6. "Modo IA" Pill Switch
    // ------------------------------------------------------------------------
    const aiSwitch = canvasSection.querySelector(".js-home-hero-switch");
    if (aiSwitch) {
      let isAiActive = false;
      let intervalMs = parseInt(aiSwitch.getAttribute("data-switch-interval") || "4000", 10);
      let switchTimer = null;

      function setAiState(active) {
        isAiActive = active;
        aiSwitch.classList.toggle("is-active", isAiActive);
      }

      function toggleAi() {
        setAiState(!isAiActive);
      }

      function startAutoSwitch() {
        if (switchTimer) clearInterval(switchTimer);
        switchTimer = setInterval(toggleAi, intervalMs);
      }

      aiSwitch.addEventListener("click", function () {
        toggleAi();
        startAutoSwitch();
      });

      aiSwitch.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleAi();
          startAutoSwitch();
        }
      });

      startAutoSwitch();
    }

    // ------------------------------------------------------------------------
    // 7. Live Code Block Typing
    // ------------------------------------------------------------------------
    const typingTextEl = canvasSection.querySelector(".js-typing-text");
    if (typingTextEl) {
      const codeLines = [
        "<h1>Fluid & Kinetic</h1>",
        "<p>60fps zero dependencies.</p>",
        "<script src=\"canvas.js\"></script>"
      ];
      const fullText = codeLines.join("\n");
      let charIndex = 0;
      let isDeleting = false;

      function stepType() {
        if (!isDeleting) {
          charIndex++;
          typingTextEl.textContent = fullText.slice(0, charIndex);
          if (charIndex >= fullText.length) {
            isDeleting = true;
            setTimeout(stepType, 3000);
            return;
          }
          setTimeout(stepType, 40 + Math.random() * 25);
        } else {
          charIndex--;
          typingTextEl.textContent = fullText.slice(0, charIndex);
          if (charIndex <= 0) {
            isDeleting = false;
            setTimeout(stepType, 600);
            return;
          }
          setTimeout(stepType, 18);
        }
      }

      stepType();
    }
  }

  window.initMultiplayerCanvas = initMultiplayerCanvas;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMultiplayerCanvas);
  } else {
    initMultiplayerCanvas();
  }
})();
