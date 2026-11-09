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
    // 2. Autonomous Multiplayer Working Engine (UI Designer, Backend & CD)
    // ------------------------------------------------------------------------
    const isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Workbench Elements
    const wb = canvasSection.querySelector(".js-home-hero-workbench");
    const guideX = wb ? wb.querySelector(".js-wb-guide-x") : null;
    const guideY = wb ? wb.querySelector(".js-wb-guide-y") : null;
    const cableBg = wb ? wb.querySelector(".js-wb-cable-bg") : null;
    const cableFg = wb ? wb.querySelector(".js-wb-cable-fg") : null;
    const packet1 = wb ? wb.querySelector(".js-wb-pulse-1") : null;
    const packet2 = wb ? wb.querySelector(".js-wb-pulse-2") : null;
    const caliperBase = wb ? wb.querySelector(".js-wb-caliper-base") : null;
    const caliperCap = wb ? wb.querySelector(".js-wb-caliper-cap") : null;
    const bracketL = wb ? wb.querySelector(".js-wb-bracket-l") : null;
    const bracketR = wb ? wb.querySelector(".js-wb-bracket-r") : null;

    const frameEl = wb ? wb.querySelector(".js-wb-frame") : null;
    const dimVal = wb ? wb.querySelector(".js-wb-dim-val") : null;
    const skelEl = wb ? wb.querySelector(".js-wb-frame-skeleton") : null;
    const skelBtn = wb ? wb.querySelector(".js-wb-skel-btn") : null;
    const spacingBadge = wb ? wb.querySelector(".js-wb-spacing-badge") : null;

    const socketEl = wb ? wb.querySelector(".js-wb-socket") : null;
    const typoSpec = wb ? wb.querySelector(".js-wb-typo-spec") : null;
    const stampEl = wb ? wb.querySelector(".js-wb-approval-stamp") : null;
    const pingsLayer = wb ? wb.querySelector(".js-wb-pings") : null;

    const codeBlockEl = canvasSection.querySelector(".home-hero__codigo");
    const titleEl = canvasSection.querySelector(".home-hero__titulo");

    // Click Ripple / Ping Spawner
    function triggerPing(x, y, color) {
      if (!pingsLayer || isReducedMotion) return;
      const ping = document.createElement("div");
      ping.className = "wb-click-ping";
      ping.style.left = x.toFixed(1) + "px";
      ping.style.top = y.toFixed(1) + "px";
      ping.style.setProperty("--ping-color", color || "#ffffff");
      pingsLayer.appendChild(ping);
      setTimeout(function () {
        if (ping.parentNode) ping.parentNode.removeChild(ping);
      }, 700);
    }

    // Bezier curve point helper
    function getBezierPoint(x0, y0, cx1, cy1, cx2, cy2, x1, y1, t) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;
      return {
        x: uuu * x0 + 3 * uu * t * cx1 + 3 * u * tt * cx2 + ttt * x1,
        y: uuu * y0 + 3 * uu * t * cy1 + 3 * u * tt * cy2 + ttt * y1
      };
    }

    // Smooth Interpolation helper
    function interpolate(x0, y0, x1, y1, t) {
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      return {
        x: x0 + (x1 - x0) * ease,
        y: y0 + (y1 - y0) * ease
      };
    }

    // Role Cursors Initialization
    const cursorEls = canvasSection.querySelectorAll(".js-home-hero-cursor");
    const cursorData = Array.prototype.map.call(cursorEls, function (el, idx) {
      const role = el.getAttribute("data-role") || (
        idx === 0 ? "backend" :
        idx === 1 ? "frontend" :
        idx === 2 ? "director" :
        idx === 3 ? "ui-designer" :
        idx === 4 ? "ux-designer" :
        idx === 5 ? "pm" : "qa"
      );
      const actionTextEl = el.querySelector(".action-text");
      const color = el.style.getPropertyValue("--cursor-color") || "#00d2b4";

      return {
        el: el,
        role: role,
        color: color.trim(),
        actionTextEl: actionTextEl,
        currentAction: "",
        offsetX: parseFloat(el.getAttribute("data-offset-x") || "0"),
        offsetY: parseFloat(el.getAttribute("data-offset-y") || "0"),
        delay: parseFloat(el.getAttribute("data-cursor-delay") || (idx * 400)),
        phase: idx * 0.85,
        pushX: 0,
        pushY: 0,
        currentX: 0,
        currentY: 0,
        hasClicked: {}
      };
    });

    function setCursorAction(cur, text) {
      if (!cur.actionTextEl || cur.currentAction === text) return;
      cur.currentAction = text;
      cur.actionTextEl.textContent = text;
    }

    // ------------------------------------------------------------------------
    // 3. Main 60fps Animation Loop
    // ------------------------------------------------------------------------
    const LOOP_DURATION = 12000; // 12-second rich coordinated cycle

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

      // Canvas boundary cache
      const rect = canvasSection.getBoundingClientRect();
      const cx = rect.width * 0.5;
      const cy = rect.height * 0.5;

      // Code Block position
      let codeOutletX = cx + 220;
      let codeOutletY = cy - 130;
      let codeCenterTextX = cx + 240;
      let codeCenterTextY = cy - 170;
      if (codeBlockEl) {
        const cRect = codeBlockEl.getBoundingClientRect();
        codeOutletX = cRect.left - rect.left + 35;
        codeOutletY = cRect.bottom - rect.top - 20;
        codeCenterTextX = cRect.left - rect.left + 75;
        codeCenterTextY = cRect.top - rect.top + 55;
      }

      // Title position
      let tLeft = cx - 180;
      let tRight = cx + 180;
      let tTop = cy - 35;
      let tH = 65;
      let tW = 360;
      if (titleEl) {
        const tRect = titleEl.getBoundingClientRect();
        tLeft = tRect.left - rect.left;
        tRight = tRect.right - rect.left;
        tTop = tRect.top - rect.top;
        tH = tRect.height;
        tW = tRect.width;
      }

      // UI Designer Frame coordinates
      const frameOriginX = Math.max(30, cx - 390);
      const frameOriginY = cy - 75;
      const targetW = Math.min(270, cx - 80);
      const targetH = 148;

      // Update Active Multiplayer Cursors
      for (let j = 0; j < cursorData.length; j++) {
        const cur = cursorData[j];
        const t = (now + cur.delay) % LOOP_DURATION;

        let targetX = cx + cur.offsetX;
        let targetY = cy + cur.offsetY;

        if (isReducedMotion || rect.width < 768) {
          // Static calm resting state on mobile or prefers-reduced-motion
          setCursorAction(cur, "Online");
          const swayX = Math.sin((now + cur.delay) * 0.0011 + cur.phase) * 10;
          const swayY = Math.cos((now + cur.delay) * 0.0009 + cur.phase) * 8;
          targetX = cx + cur.offsetX * (rect.width < 768 ? 0.45 : 1) + swayX;
          targetY = cy + cur.offsetY * (rect.width < 768 ? 0.45 : 1) + swayY;
        } else if (cur.role === "ui-designer") {
          // ==================================================================
          // UI DESIGNER: Autonomous UI Frame Drawing & Token Styling
          // ==================================================================
          if (t < 1400) {
            // Phase 1: Move to start point
            setCursorAction(cur, "✏️ Navigating to grid...");
            if (cur.hasClicked.uiDraw) {
              cur.hasClicked.uiDraw = false;
              cur.hasClicked.uiRelease = false;
              cur.hasClicked.uiBtn = false;
              if (frameEl) {
                frameEl.classList.remove("is-active", "is-solid");
                frameEl.style.width = "0px";
                frameEl.style.height = "0px";
              }
              if (skelEl) skelEl.classList.remove("is-visible");
              if (spacingBadge) spacingBadge.classList.remove("is-visible");
              if (guideX) guideX.classList.remove("is-active");
              if (guideY) guideY.classList.remove("is-active");
            }
            const p = t / 1400;
            const pt = interpolate(cx - 430, cy - 130, frameOriginX, frameOriginY, p);
            targetX = pt.x;
            targetY = pt.y;
          } else if (t < 4200) {
            // Phase 2: Click and drag out bounding frame
            setCursorAction(cur, "📐 Drawing UI Frame...");
            if (!cur.hasClicked.uiDraw) {
              triggerPing(frameOriginX, frameOriginY, cur.color);
              cur.hasClicked.uiDraw = true;
              if (frameEl) {
                frameEl.classList.add("is-active");
                frameEl.classList.remove("is-solid");
                frameEl.style.left = frameOriginX.toFixed(1) + "px";
                frameEl.style.top = frameOriginY.toFixed(1) + "px";
              }
              if (guideX) guideX.classList.add("is-active");
              if (guideY) guideY.classList.add("is-active");
            }
            const p = (t - 1400) / 2800;
            const easeP = p * (2 - p);
            const curW = Math.max(24, Math.round(targetW * easeP));
            const curH = Math.max(24, Math.round(targetH * easeP));
            targetX = frameOriginX + curW;
            targetY = frameOriginY + curH;

            if (frameEl) {
              frameEl.style.width = curW + "px";
              frameEl.style.height = curH + "px";
            }
            if (dimVal) dimVal.textContent = curW + " × " + curH;

            if (guideX && guideY) {
              guideX.setAttribute("x1", "0");
              guideX.setAttribute("y1", targetY.toFixed(1));
              guideX.setAttribute("x2", rect.width.toFixed(1));
              guideX.setAttribute("y2", targetY.toFixed(1));

              guideY.setAttribute("x1", targetX.toFixed(1));
              guideY.setAttribute("y1", "0");
              guideY.setAttribute("x2", targetX.toFixed(1));
              guideY.setAttribute("y2", rect.height.toFixed(1));
            }
          } else if (t < 6800) {
            // Phase 3: Release drag, snap wireframe and glide to button
            setCursorAction(cur, "🎨 Snapping 16px tokens...");
            if (!cur.hasClicked.uiRelease) {
              triggerPing(frameOriginX + targetW, frameOriginY + targetH, cur.color);
              cur.hasClicked.uiRelease = true;
              if (guideX) guideX.classList.remove("is-active");
              if (guideY) guideY.classList.remove("is-active");
              if (frameEl) frameEl.classList.add("is-solid");
              if (skelEl) skelEl.classList.add("is-visible");
            }
            const btnTargetX = frameOriginX + 68;
            const btnTargetY = frameOriginY + 112;
            const p = (t - 4200) / 2600;
            const pt = interpolate(frameOriginX + targetW, frameOriginY + targetH, btnTargetX, btnTargetY, p);
            targetX = pt.x;
            targetY = pt.y;
          } else if (t < 9400) {
            // Phase 4: Click CTA button, fine-tune spacing
            setCursorAction(cur, "🎨 Adjusting spacing (16px)...");
            const btnTargetX = frameOriginX + 68;
            const btnTargetY = frameOriginY + 112;
            if (!cur.hasClicked.uiBtn) {
              triggerPing(btnTargetX, btnTargetY, cur.color);
              cur.hasClicked.uiBtn = true;
              if (skelBtn) skelBtn.classList.add("is-clicked");
              if (spacingBadge) spacingBadge.classList.add("is-visible");
              setTimeout(function () {
                if (skelBtn) skelBtn.classList.remove("is-clicked");
              }, 400);
            }
            targetX = btnTargetX + Math.sin(t * 0.003) * 3;
            targetY = btnTargetY + Math.cos(t * 0.003) * 3;
          } else {
            // Phase 5: Frame complete! Admiring layout
            setCursorAction(cur, "✨ Frame ready for prod");
            if (spacingBadge) spacingBadge.classList.remove("is-visible");
            targetX = frameOriginX + targetW + 10 + Math.sin(t * 0.001) * 5;
            targetY = frameOriginY + targetH - 10 + Math.cos(t * 0.001) * 4;
          }
        } else if (cur.role === "backend") {
          // ==================================================================
          // BACKEND ENGINEER: Code Block Typing & Live Data Cable Wiring
          // ==================================================================
          const socketDestX = cx + 80;
          const socketDestY = cy + 30;

          if (t < 2400) {
            // Phase 1: Typing API code in index.html block
            setCursorAction(cur, "⌨️ Coding WebSocket API...");
            if (cur.hasClicked.beOut) {
              cur.hasClicked.beOut = false;
              cur.hasClicked.beDest = false;
              if (cableBg) cableBg.classList.remove("is-active");
              if (cableFg) cableFg.classList.remove("is-active");
              if (packet1) packet1.classList.remove("is-active");
              if (packet2) packet2.classList.remove("is-active");
              if (socketEl) socketEl.classList.remove("is-active");
            }
            const jitterX = Math.sin(t * 0.02) * 2;
            const jitterY = Math.cos(t * 0.03) * 1.5;
            targetX = codeCenterTextX + jitterX;
            targetY = codeCenterTextY + jitterY;
          } else if (t < 5200) {
            // Phase 2: Click outlet socket, drag live SVG stream cable
            setCursorAction(cur, "⚡ Wiring real-time stream...");
            if (!cur.hasClicked.beOut) {
              triggerPing(codeOutletX, codeOutletY, cur.color);
              cur.hasClicked.beOut = true;
              if (cableBg) cableBg.classList.add("is-active");
              if (cableFg) cableFg.classList.add("is-active");
            }
            const p = (t - 2400) / 2800;
            const easeP = p * (2 - p);
            const wireX = codeOutletX + (socketDestX - codeOutletX) * easeP;
            const wireY = codeOutletY + (socketDestY - codeOutletY) * easeP;
            targetX = wireX;
            targetY = wireY;

            // Draw dynamic bezier cable
            const c1x = codeOutletX - 60;
            const c1y = codeOutletY + 50;
            const c2x = wireX + 40;
            const c2y = wireY - 40;
            const dStr = "M " + codeOutletX.toFixed(1) + " " + codeOutletY.toFixed(1) +
                         " C " + c1x.toFixed(1) + " " + c1y.toFixed(1) +
                         ", " + c2x.toFixed(1) + " " + c2y.toFixed(1) +
                         ", " + wireX.toFixed(1) + " " + wireY.toFixed(1);
            if (cableBg) cableBg.setAttribute("d", dStr);
            if (cableFg) cableFg.setAttribute("d", dStr);
          } else if (t < 8200) {
            // Phase 3: Lock socket connection & stream data packets
            setCursorAction(cur, "✓ 200 OK · 18ms latency");
            if (!cur.hasClicked.beDest) {
              triggerPing(socketDestX, socketDestY, cur.color);
              cur.hasClicked.beDest = true;
              if (socketEl) {
                socketEl.classList.add("is-active");
                socketEl.style.left = (socketDestX - 5).toFixed(1) + "px";
                socketEl.style.top = (socketDestY - 12).toFixed(1) + "px";
              }
              if (packet1) packet1.classList.add("is-active");
              if (packet2) packet2.classList.add("is-active");
            }
            targetX = socketDestX + 16 + Math.sin(t * 0.002) * 4;
            targetY = socketDestY + 12 + Math.cos(t * 0.002) * 3;

            // Stream packets along cable
            const pk1 = (t * 0.00075) % 1;
            const pk2 = ((t * 0.00075) + 0.5) % 1;
            const pt1 = getBezierPoint(codeOutletX, codeOutletY, codeOutletX - 60, codeOutletY + 50, socketDestX + 40, socketDestY - 40, socketDestX, socketDestY, pk1);
            const pt2 = getBezierPoint(codeOutletX, codeOutletY, codeOutletX - 60, codeOutletY + 50, socketDestX + 40, socketDestY - 40, socketDestX, socketDestY, pk2);
            if (packet1) {
              packet1.setAttribute("cx", pt1.x.toFixed(1));
              packet1.setAttribute("cy", pt1.y.toFixed(1));
            }
            if (packet2) {
              packet2.setAttribute("cx", pt2.x.toFixed(1));
              packet2.setAttribute("cy", pt2.y.toFixed(1));
            }
          } else {
            // Phase 4: Schema active and healthy
            setCursorAction(cur, "🚀 Schema synced · 60fps");
            targetX = socketDestX + 38 + Math.sin(t * 0.001) * 6;
            targetY = socketDestY + 18 + Math.cos(t * 0.001) * 5;
          }
        } else if (cur.role === "director") {
          // ==================================================================
          // CREATIVE DIRECTOR: Typography Calipers & Approval Stamp
          // ==================================================================
          const stampDestX = tLeft + tW * 0.46;
          const stampDestY = tTop + tH + 55;

          if (t < 1800) {
            // Phase 1: Approach title
            setCursorAction(cur, "🔍 Inspecting typography...");
            if (cur.hasClicked.cdScan) {
              cur.hasClicked.cdScan = false;
              cur.hasClicked.cdStamp = false;
              if (caliperBase) caliperBase.classList.remove("is-active");
              if (caliperCap) caliperCap.classList.remove("is-active");
              if (bracketL) bracketL.classList.remove("is-active");
              if (bracketR) bracketR.classList.remove("is-active");
              if (typoSpec) typoSpec.classList.remove("is-active");
              if (stampEl) stampEl.classList.remove("is-stamped");
            }
            const p = t / 1800;
            const pt = interpolate(cx - 190, cy - 180, tLeft + 25, tTop + tH * 0.5, p);
            targetX = pt.x;
            targetY = pt.y;
          } else if (t < 5400) {
            // Phase 2: Scan typography calipers across title
            setCursorAction(cur, "📐 Checking optical kerning...");
            if (!cur.hasClicked.cdScan) {
              triggerPing(tLeft + 25, tTop + tH * 0.5, cur.color);
              cur.hasClicked.cdScan = true;
              if (caliperBase) caliperBase.classList.add("is-active");
              if (caliperCap) caliperCap.classList.add("is-active");
              if (bracketL) bracketL.classList.add("is-active");
              if (bracketR) bracketR.classList.add("is-active");
              if (typoSpec) {
                typoSpec.classList.add("is-active");
                typoSpec.style.left = (tLeft + tW * 0.5 - 85).toFixed(1) + "px";
                typoSpec.style.top = (tTop - 30).toFixed(1) + "px";
              }
              if (caliperBase) {
                caliperBase.setAttribute("x1", (tLeft - 15).toFixed(1));
                caliperBase.setAttribute("y1", (tTop + tH * 0.82).toFixed(1));
                caliperBase.setAttribute("x2", (tRight + 15).toFixed(1));
                caliperBase.setAttribute("y2", (tTop + tH * 0.82).toFixed(1));
              }
              if (caliperCap) {
                caliperCap.setAttribute("x1", (tLeft - 15).toFixed(1));
                caliperCap.setAttribute("y1", (tTop + tH * 0.18).toFixed(1));
                caliperCap.setAttribute("x2", (tRight + 15).toFixed(1));
                caliperCap.setAttribute("y2", (tTop + tH * 0.18).toFixed(1));
              }
            }
            const p = (t - 1800) / 3600;
            const scanX = tLeft + 30 + (tW - 60) * p;
            const scanY = tTop + tH * 0.5;
            targetX = scanX;
            targetY = scanY;

            // Draw caliper bracket calipers around cursor
            const bTop = tTop + tH * 0.15;
            const bBot = tTop + tH * 0.85;
            const bW = 12;
            if (bracketL) {
              bracketL.setAttribute("d", "M " + (scanX - bW).toFixed(1) + " " + bTop.toFixed(1) +
                                         " L " + (scanX - bW * 0.4).toFixed(1) + " " + bTop.toFixed(1) +
                                         " L " + (scanX - bW * 0.4).toFixed(1) + " " + bBot.toFixed(1) +
                                         " L " + (scanX - bW).toFixed(1) + " " + bBot.toFixed(1));
            }
            if (bracketR) {
              bracketR.setAttribute("d", "M " + (scanX + bW).toFixed(1) + " " + bTop.toFixed(1) +
                                         " L " + (scanX + bW * 0.4).toFixed(1) + " " + bTop.toFixed(1) +
                                         " L " + (scanX + bW * 0.4).toFixed(1) + " " + bBot.toFixed(1) +
                                         " L " + (scanX + bW).toFixed(1) + " " + bBot.toFixed(1));
            }
          } else if (t < 7200) {
            // Phase 3: Glide down to stamp location
            setCursorAction(cur, "💬 Reviewing visual balance...");
            if (caliperBase) caliperBase.classList.remove("is-active");
            if (caliperCap) caliperCap.classList.remove("is-active");
            if (bracketL) bracketL.classList.remove("is-active");
            if (bracketR) bracketR.classList.remove("is-active");
            const p = (t - 5400) / 1800;
            const pt = interpolate(tRight - 35, tTop + tH * 0.5, stampDestX, stampDestY, p);
            targetX = pt.x;
            targetY = pt.y;
          } else if (t < 9800) {
            // Phase 4: Stamp approval
            setCursorAction(cur, "✅ Approved for deploy");
            if (!cur.hasClicked.cdStamp) {
              triggerPing(stampDestX, stampDestY, cur.color);
              cur.hasClicked.cdStamp = true;
              if (stampEl) {
                stampEl.classList.add("is-stamped");
                stampEl.style.left = (stampDestX - 80).toFixed(1) + "px";
                stampEl.style.top = (stampDestY - 16).toFixed(1) + "px";
              }
            }
            targetX = stampDestX + 42 + Math.sin(t * 0.002) * 5;
            targetY = stampDestY + 6 + Math.cos(t * 0.002) * 4;
          } else {
            // Phase 5: Sign-off complete
            setCursorAction(cur, "✨ Art direction locked");
            targetX = stampDestX + 68 + Math.sin(t * 0.001) * 7;
            targetY = stampDestY + 12 + Math.cos(t * 0.001) * 5;
          }
        } else if (cur.role === "frontend") {
          // Frontend Developer: testing interactive switch & kinetic sync
          if (t < 6000) {
            setCursorAction(cur, "⚡ Testing kinetic sync...");
            targetX = cx + 50 + Math.sin(t * 0.0012) * 20;
            targetY = cy + 130 + Math.cos(t * 0.001) * 15;
          } else {
            setCursorAction(cur, "🎯 60fps hardware sync");
            targetX = cx + 80 + Math.sin(t * 0.001) * 15;
            targetY = cy + 145 + Math.cos(t * 0.0014) * 12;
          }
        } else if (cur.role === "qa") {
          // QA Engineer: automated test suite verification
          if (t < 6000) {
            setCursorAction(cur, "🧪 Running E2E test suite...");
            targetX = cx + 170 + Math.sin(t * 0.0015) * 25;
            targetY = cy + 110 + Math.cos(t * 0.0011) * 20;
          } else {
            setCursorAction(cur, "✓ All 42 tests passed");
            targetX = cx + 190 + Math.sin(t * 0.001) * 14;
            targetY = cy + 120 + Math.cos(t * 0.001) * 10;
          }
        } else if (cur.role === "ux-designer") {
          // UX Designer: touch targets & accessibility
          if (t < 6000) {
            setCursorAction(cur, "📱 Checking 48px hitboxes...");
            targetX = cx - 270 + Math.sin(t * 0.0012) * 18;
            targetY = cy + 70 + Math.cos(t * 0.0014) * 16;
          } else {
            setCursorAction(cur, "✓ WCAG AA compliant");
            targetX = cx - 250 + Math.sin(t * 0.001) * 12;
            targetY = cy + 85 + Math.cos(t * 0.001) * 10;
          }
        } else if (cur.role === "pm") {
          // Project Manager: tracking deliverables & velocity
          if (t < 6000) {
            setCursorAction(cur, "📋 Reviewing sprint velocity...");
            targetX = cx + 250 + Math.sin(t * 0.0011) * 16;
            targetY = cy - 50 + Math.cos(t * 0.0013) * 18;
          } else {
            setCursorAction(cur, "🚀 Release ready");
            targetX = cx + 270 + Math.sin(t * 0.001) * 12;
            targetY = cy - 40 + Math.cos(t * 0.001) * 10;
          }
        }

        // Magnetic repulsion from user mouse cursor
        let targetPushX = 0;
        let targetPushY = 0;

        if (isMouseInside && userX > -9000) {
          const dx = targetX - userX;
          const dy = targetY - userY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0) {
            const force = (130 - dist) / 130;
            targetPushX = (dx / dist) * force * 40;
            targetPushY = (dy / dist) * force * 40;
          }
        }

        cur.pushX += (targetPushX - cur.pushX) * 0.12;
        cur.pushY += (targetPushY - cur.pushY) * 0.12;

        const finalX = targetX + cur.pushX;
        const finalY = targetY + cur.pushY;

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
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncSelectionBox);
      }

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
        "<!-- Bangladesh Cartography (index.html) -->",
        "<svg viewBox=\"0 0 1024 1024\" class=\"bd-geo\">",
        "  <path fill=\"#05562B\" d=\"M2023 10175 c-27...\"/>",
        "  <circle cx=\"520\" cy=\"520\" r=\"14\" fill=\"#F42A41\"/>",
        "  <text x=\"545\" y=\"525\">Dhaka · 23.8°N 90.4°E</text>",
        "</svg>"
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
