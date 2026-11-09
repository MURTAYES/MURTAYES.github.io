/**
 * Fluid Interactive Cursor Module
 * Custom cursor with liquid spring tail and interactive hover pill badges
 */
(function () {
  "use strict";

  function initCustomCursor() {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;

    const canvas = document.getElementById("cursor-trail-canvas");
    const dot = document.querySelector(".cursor-dot");
    const badge = document.querySelector(".cursor-badge");
    const badgeLabel = badge ? badge.querySelector(".cursor-label") : null;

    if (!canvas || !dot) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize, { passive: true });

    const mouse = { x: -100, y: -100, active: false };
    const NUM_POINTS = 20;
    const points = Array.from({ length: NUM_POINTS }, () => ({ x: -100, y: -100 }));

    let badgeText = "";

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0px) translate(-50%, -50%)`;

      if (badge && badgeText) {
        badge.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0px) translate(16px, 16px) scale(1)`;
      }
    });

    document.addEventListener("mouseleave", () => {
      mouse.active = false;
      if (badge) badge.classList.remove("is-visible");
      dot.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      mouse.active = true;
      dot.style.opacity = "1";
    });

    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest(
        "[data-cursor], [data-cursor-pill], a, button, .c-button, .case-content_link, .footer__big, .tool, .work-github-btn, .applykit-docket-btn, .pharmaerp-spec-btn, .edu52-spec-btn, .float-physics-item"
      );
      if (!target) {
        badgeText = "";
        if (badge) {
          badge.classList.remove("is-visible");
          badge.style.transform = "translate3d(-200px, -200px, 0) scale(0)";
        }
        dot.style.opacity = "1";
        return;
      }

      let cursorText = target.dataset.cursorPill || target.dataset.cursor || "";
      if (cursorText) {
        cursorText = cursorText.replace(/\s*—\s*Drag\s*&\s*Fli(ng|ck)/gi, "").replace(/Drag\s*&\s*Fli(ng|ck)/gi, "").trim();
      }

      if (cursorText && badge) {
        badgeText = cursorText;
        if (badgeLabel) badgeLabel.textContent = cursorText;
        badge.classList.add("is-visible");
        dot.style.opacity = "0";
      } else {
        badgeText = "";
        if (badge) badge.classList.remove("is-visible");
        dot.style.opacity = "1";
      }
    });

    function renderTail() {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active) {
        points[0].x += (mouse.x - points[0].x) * 0.65;
        points[0].y += (mouse.y - points[0].y) * 0.65;

        for (let i = 1; i < NUM_POINTS; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const spring = 0.52 - (i / NUM_POINTS) * 0.22;
          curr.x += (prev.x - curr.x) * spring;
          curr.y += (prev.y - curr.y) * spring;
        }

        const head = points[0];
        const tail = points[points.length - 1];
        const strokeLength = Math.hypot(head.x - tail.x, head.y - tail.y);

        if (strokeLength > 1.5) {
          // Dynamic head width responding fluidly to velocity
          const maxHeadWidth = Math.min(13, Math.max(7.5, 6 + strokeLength / 16));
          const minTailWidth = 0.8;

          // Render tapered calligraphy ink brush (thick head -> narrow tail) in rich black
          for (let i = 0; i < NUM_POINTS - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const t = i / (NUM_POINTS - 1); // 0 at head, 1 at tail

            // Taper profile: wide top head tapering gracefully to narrow tail
            const currentWidth = maxHeadWidth * Math.pow(1 - t, 1.35) + minTailWidth;
            const currentAlpha = Math.min(0.92, Math.max(0.12, 0.88 * Math.pow(1 - t, 0.45)));

            ctx.beginPath();
            ctx.strokeStyle = `rgba(10, 10, 10, ${currentAlpha.toFixed(3)})`;
            ctx.lineWidth = currentWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(renderTail);
    }
    requestAnimationFrame(renderTail);
  }

  window.initCustomCursor = initCustomCursor;
})();
