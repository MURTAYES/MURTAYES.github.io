/**
 * Section: Multiplayer Collaborative Canvas Engine
 * Pure Vanilla JavaScript · 60fps GPU Hardware Accelerated
 * Zero Dependencies
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  function initCanvas() {
    const hero = document.getElementById("canvas") || document.querySelector(".canvas-stage");
    if (!hero) return;

    const wrap = hero.querySelector(".title-wrap");
    const grid = hero.querySelector(".grid");
    const $ = (s) => [...hero.querySelectorAll(s)];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    let live = true, W = 1, H = 1, T0 = Infinity;

    /* ---- Grid: architectural ~56px cells; a pool of 32 cells is reused for the light trail ---- */
    let cw = 56, ch = 56, cols = 1, rows = 1, next = 0;
    const pool = Array.from({ length: 32 }, () => {
      const el = document.createElement("div");
      el.className = "lit";
      return grid ? grid.appendChild(el) : el;
    });

    const fit = () => {
      const r = hero.getBoundingClientRect();
      W = r.width || 1;
      H = r.height || 1;
      cols = Math.max(6, Math.round(W / 56));
      rows = Math.max(4, Math.round(H / 56));
      cw = W / cols;
      ch = H / rows;
      hero.style.setProperty("--cw", cw + "px");
      hero.style.setProperty("--ch", ch + "px");
    };

    const light = (x, y) => {
      if (x < 0 || y < 0 || x >= cols || y >= rows || pool.length === 0) return;
      const el = pool[next++ % pool.length];
      el.style.transform = `translate(${x * cw}px,${y * ch}px)`;
      if (el.getAnimations) {
        el.getAnimations().forEach((a) => a.cancel());
      }
      el.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 0 }],
        { duration: 1500, easing: "ease-out" }
      );
    };

    // User cursor moves trigger illuminated cell trail
    let lastCell = "";
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      m.tx = (e.clientX - r.left) / r.width - 0.5;
      m.ty = (e.clientY - r.top) / r.height - 0.5;
      const x = Math.floor((e.clientX - r.left) / cw);
      const y = Math.floor((e.clientY - r.top) / ch);
      const k = x + "," + y;
      if (k !== lastCell) {
        lastCell = k;
        if (!reduce) light(x, y);
      }
    });

    hero.addEventListener("pointerleave", () => {
      m.tx = m.ty = 0;
    });

    /* ---- Title: select, drag inside the hero, double-click to reset ---- */
    let tx = 0, ty = 0, drag = null, lim = null;
    if (wrap) {
      wrap.addEventListener("pointerdown", (e) => {
        const h = hero.getBoundingClientRect();
        const b = wrap.getBoundingClientRect();
        lim = {
          x0: h.left - b.left + tx,
          x1: h.right - b.right + tx,
          y0: h.top - b.top + ty,
          y1: h.bottom - b.bottom + ty
        };
        drag = { x: e.clientX - tx, y: e.clientY - ty };
        if (wrap.setPointerCapture) {
          try { wrap.setPointerCapture(e.pointerId); } catch (err) {}
        }
        wrap.classList.add("is-selected", "is-dragging");
      });

      wrap.addEventListener("pointermove", (e) => {
        if (!drag || !lim) return;
        tx = clamp(e.clientX - drag.x, lim.x0, lim.x1);
        ty = clamp(e.clientY - drag.y, lim.y0, lim.y1);
        wrap.style.translate = `${tx}px ${ty}px`;
      });

      const drop = () => {
        drag = null;
        wrap.classList.remove("is-dragging");
      };

      wrap.addEventListener("pointerup", drop);
      wrap.addEventListener("pointercancel", drop);
      wrap.addEventListener("dblclick", () => {
        tx = ty = 0;
        wrap.style.translate = "";
      });

      hero.addEventListener("pointerdown", (e) => {
        if (!wrap.contains(e.target)) {
          wrap.classList.remove("is-selected");
        }
      });
    }

    /* ---- Code window: live typewriter loop ---- */
    const textEl = hero.querySelector(".js-typing-text");
    const src = '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>The People\'s Republic</title>\n</head>\n<body>\n    <h1>Bangladesh · 23.81° N</h1>';
    const paint = (n) => {
      if (textEl) textEl.textContent = src.slice(0, n);
    };
    const type = (n = 0, dir = 1) => {
      paint(n);
      if (dir > 0 && n >= src.length) return setTimeout(() => type(n, -1), 3200);
      if (dir < 0 && n <= 0) return setTimeout(() => type(0, 1), 800);
      setTimeout(
        () => type(clamp(n + (dir > 0 ? 1 : -3), 0, src.length), dir),
        dir > 0 ? rand(40, 95) : 12
      );
    };
    if (reduce) {
      paint(src.length);
    } else {
      setTimeout(type, 1800);
    }

    /* ---- AI Mode toggle interval ---- */
    const sw = hero.querySelector(".home-hero__switch-pill, .switch");
    if (sw && !reduce) {
      setInterval(() => sw.classList.toggle("is-active"), 4000);
    }

    /* ---- Interactive Actions: 18ms Latency Counter, Bangladesh Map Outline/Green ---- */
    let counterAnimationId = null;
    const animateApiCounter = () => {
      const speedEl = hero.querySelector(".api-speed");
      if (!speedEl) return;
      if (counterAnimationId) cancelAnimationFrame(counterAnimationId);

      const duration = 900;
      const target = 18;
      const startTime = performance.now();
      speedEl.classList.add("is-counting");

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeVal = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easeVal * target);
        speedEl.textContent = `${current} ms`;

        if (progress < 1) {
          counterAnimationId = requestAnimationFrame(update);
        } else {
          speedEl.textContent = `${target} ms`;
          speedEl.classList.remove("is-counting");
          counterAnimationId = null;

          // Glow effect on card when 18ms completes
          const apiCard = hero.querySelector(".home-hero__api");
          if (apiCard) {
            apiCard.classList.remove("is-glowing");
            void apiCard.offsetWidth;
            apiCard.classList.add("is-glowing");
            setTimeout(() => apiCard.classList.remove("is-glowing"), 1300);
          }
        }
      };

      counterAnimationId = requestAnimationFrame(update);
    };

    const mapSvg = hero.querySelector(".bd-map-vector");
    const drawMapOutline = () => {
      if (!mapSvg) return;
      mapSvg.classList.remove("is-green");
      mapSvg.classList.add("is-outline");

      const paths = hero.querySelectorAll(".bd-map-shapes path");
      paths.forEach((p) => {
        try {
          const len = Math.ceil(p.getTotalLength() || 3000);
          p.style.transition = "none";
          p.style.strokeDasharray = `${len} ${len}`;
          p.style.strokeDashoffset = len;
          p.style.fill = "transparent";
          p.style.stroke = "#05562B";
          p.style.strokeWidth = "24px";
          void p.getBoundingClientRect();
          p.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.35, 0, 0.25, 1), fill 0.6s ease";
          p.style.strokeDashoffset = "0";
          setTimeout(() => {
            if (mapSvg.classList.contains("is-outline")) {
              p.style.fill = "rgba(5, 86, 43, 0.12)";
            }
          }, 1400);
        } catch (e) {
          p.style.fill = "transparent";
          p.style.stroke = "#05562B";
        }
      });
    };

    const fillMapGreen = () => {
      if (!mapSvg) return;
      mapSvg.classList.remove("is-outline");
      mapSvg.classList.add("is-green");

      const paths = hero.querySelectorAll(".bd-map-shapes path");
      paths.forEach((p) => {
        p.style.transition = "fill 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), stroke 0.6s ease";
        p.style.fill = "#05562B";
        p.style.stroke = "#05562B";
        p.style.strokeWidth = "4px";
        p.style.strokeDasharray = "none";
        p.style.strokeDashoffset = "0";
      });

      const card = hero.querySelector(".home-hero__bd-card");
      if (card) {
        card.classList.add("is-active-pulse");
        setTimeout(() => card.classList.remove("is-active-pulse"), 700);
      }
    };

    /* ---- Model Loss Graph Smooth Path Draw & Counters ---- */
    let graphAnimationId = null;
    const animateGraphCard = () => {
      const graphCard = hero.querySelector(".home-hero__graph");
      if (!graphCard) return;

      const linePath = graphCard.querySelector(".graph-line-path");
      const areaPath = graphCard.querySelector(".graph-area-path");
      const endpoint = graphCard.querySelector(".graph-endpoint-dot");
      const valLossEl = graphCard.querySelector(".graph-val-loss");
      const latencyEl = graphCard.querySelector(".graph-latency-val");
      const accEl = graphCard.querySelector(".graph-acc-val");

      if (graphAnimationId) cancelAnimationFrame(graphAnimationId);

      const duration = 1200;
      const startTime = performance.now();

      let pathLen = 270;
      if (linePath) {
        try {
          pathLen = Math.ceil(linePath.getTotalLength() || 270);
        } catch (e) {
          pathLen = 270;
        }
        linePath.style.transition = "none";
        linePath.style.strokeDasharray = `${pathLen} ${pathLen}`;
        linePath.style.strokeDashoffset = pathLen;
      }
      if (areaPath) {
        areaPath.style.transition = "none";
        areaPath.style.opacity = "0";
      }
      if (endpoint) {
        endpoint.style.transition = "none";
        endpoint.style.opacity = "0";
      }

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeVal = 1 - Math.pow(1 - progress, 3); // cubic ease-out

        // 1. Draw line path smoothly
        if (linePath) {
          linePath.style.strokeDashoffset = pathLen * (1 - easeVal);
        }

        // 2. Smoothly fade in gradient fill
        if (areaPath) {
          areaPath.style.opacity = easeVal;
        }

        // 3. Counter for val_loss: 0.084 -> 0.018 (descending model loss)
        if (valLossEl) {
          const startVal = 0.084;
          const targetVal = 0.018;
          const currentLoss = (startVal - (startVal - targetVal) * easeVal).toFixed(3);
          valLossEl.textContent = currentLoss;
        }

        // 4. Counter for latency: 0 -> 18 ms
        if (latencyEl) {
          const currentLatency = Math.round(easeVal * 18);
          latencyEl.textContent = currentLatency;
        }

        // 5. Counter for accuracy rate: 91.2 -> 99.4 %
        if (accEl) {
          const startAcc = 91.2;
          const targetAcc = 99.4;
          const currentAcc = (startAcc + (targetAcc - startAcc) * easeVal).toFixed(1);
          accEl.textContent = currentAcc;
        }

        if (progress < 1) {
          graphAnimationId = requestAnimationFrame(update);
        } else {
          if (linePath) linePath.style.strokeDashoffset = "0";
          if (areaPath) areaPath.style.opacity = "1";
          if (valLossEl) valLossEl.textContent = "0.018";
          if (latencyEl) latencyEl.textContent = "18";
          if (accEl) accEl.textContent = "99.4";

          if (endpoint) {
            endpoint.style.transition = "opacity 0.4s ease";
            endpoint.style.opacity = "1";
          }

          // Card glow effect on completion
          graphCard.classList.remove("is-glowing");
          void graphCard.offsetWidth;
          graphCard.classList.add("is-glowing");
          setTimeout(() => graphCard.classList.remove("is-glowing"), 1300);

          graphAnimationId = null;
        }
      };

      graphAnimationId = requestAnimationFrame(update);
    };

    const graphCardEl = hero.querySelector(".home-hero__graph");
    if (graphCardEl) {
      graphCardEl.addEventListener("pointerenter", () => {
        if (!reduce) animateGraphCard();
      });
    }

    /* ---- Floating pieces: idle bob + pointer parallax ---- */
    const floats = $(".fl").map((el) => ({
      el,
      k: +el.dataset.p || 0.1,
      r: +el.dataset.r || 0,
      ph: rand(0, 6.28)
    }));

    /* ---- Interactive Elements: 6 Cards & 5 Stack Logos ---- */
    const getTargetPool = () => {
      const cards = [
        { el: hero.querySelector(".home-hero__bd-card"), type: "map" },
        { el: hero.querySelector(".home-hero__codigo"), type: "code" },
        { el: hero.querySelector(".home-hero__skel-app"), type: "skel-app" },
        { el: hero.querySelector(".home-hero__skel-dash"), type: "skel-dash" },
        { el: hero.querySelector(".home-hero__graph"), type: "graph" },
        { el: hero.querySelector(".home-hero__api"), type: "api" }
      ].filter((t) => t.el);

      const logos = [
        { el: hero.querySelector(".a1"), type: "logo" },
        { el: hero.querySelector(".a2"), type: "logo" },
        { el: hero.querySelector(".a3"), type: "logo" },
        { el: hero.querySelector(".a4"), type: "logo" },
        { el: hero.querySelector(".a5"), type: "logo" }
      ].filter((t) => t.el);

      return { cards, logos, all: [...cards, ...logos] };
    };

    const getCursorRole = (el) => {
      return (
        el.dataset.role ||
        (el.classList.contains("c1")
          ? "backend"
          : el.classList.contains("c2")
          ? "frontend"
          : el.classList.contains("c3")
          ? "ml"
          : el.classList.contains("c4")
          ? "ui"
          : el.classList.contains("c5")
          ? "ux"
          : el.classList.contains("c6")
          ? "pm"
          : el.classList.contains("c7")
          ? "qa"
          : "general")
      );
    };

    /* ---- Cursors: enter from start offset, roam between cards & logos ---- */
    const curs = $(".cur").map((el) => ({
      el,
      role: getCursorRole(el),
      d: +el.dataset.d || 0,
      x: +el.dataset.ox || 0,
      y: +el.dataset.oy || 0,
      fx: 0,
      fy: 0,
      tx: 0,
      ty: 0,
      t0: 0,
      dur: 1,
      bx: 0,
      by: 0,
      targetEl: null,
      targetType: null,
      arrived: false
    }));

    const measure = () =>
      curs.forEach((c) => {
        c.bx = c.el.offsetLeft;
        c.by = c.el.offsetTop;
      });

    const aim = (c, startAt) => {
      c.fx = c.x;
      c.fy = c.y;

      const { cards, logos, all } = getTargetPool();
      if (!all.length) return;

      let nextTarget = null;

      // Role-specific affinities to guarantee storytelling actions occur regularly
      if (c.role === "backend" && c.targetType !== "api" && Math.random() < 0.45) {
        nextTarget = cards.find((x) => x.type === "api");
      } else if (c.role === "frontend" && c.targetType !== "map" && Math.random() < 0.45) {
        nextTarget = cards.find((x) => x.type === "map");
      } else if (c.role === "ux" && c.targetType !== "map" && Math.random() < 0.45) {
        nextTarget = cards.find((x) => x.type === "map");
      } else if (c.role === "qa" && c.targetType !== "graph" && Math.random() < 0.5) {
        nextTarget = cards.find((x) => x.type === "graph");
      }

      if (!nextTarget) {
        // Choose randomly between cards and logos (avoiding current element)
        const candidates = all.filter((t) => t.el !== c.targetEl);
        nextTarget =
          candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : all[0];
      }

      if (!nextTarget || !nextTarget.el) return;

      c.targetEl = nextTarget.el;
      c.targetType = nextTarget.type;

      // Calculate target element coordinates relative to hero and cursor baseline
      const hRect = hero.getBoundingClientRect();
      const tRect = nextTarget.el.getBoundingClientRect();

      const offsetX = tRect.width * (0.35 + Math.random() * 0.3);
      const offsetY = tRect.height * (0.35 + Math.random() * 0.3);

      c.tx = clamp((tRect.left - hRect.left + offsetX) - c.bx, -c.bx, W - c.bx - 60);
      c.ty = clamp((tRect.top - hRect.top + offsetY) - c.by, -c.by, H - c.by - 30);

      const dist = Math.hypot(c.tx - c.fx, c.ty - c.fy);
      c.dur = clamp(dist / 0.28, 1200, 3600);
      c.t0 = startAt;
      c.arrived = false;
    };

    const tick = (now) => {
      requestAnimationFrame(tick);
      if (!live) return;
      const t = now / 1000;
      m.x += (m.tx - m.x) * 0.07;
      m.y += (m.ty - m.y) * 0.07;

      for (const f of floats) {
        const amp = 14 + 40 * f.k;
        const x = Math.sin(t * 0.6 + f.ph * 1.3) * 2.5 - m.x * f.k * 90;
        const y = -amp * (0.5 + 0.5 * Math.sin(t * 0.9 + f.ph)) - m.y * f.k * 90;
        const wob = Math.abs(f.r) < 1 ? 0.6 : 0.9;
        f.el.style.transform = `translate(${x}px,${y}px) rotate(${
          f.r + Math.sin(t * 0.5 + f.ph * 0.7) * wob
        }deg)`;
      }

      for (const c of curs) {
        if (now >= T0 + c.d) {
          if (!c.t0) aim(c, now);

          if (now >= c.t0) {
            const p = clamp((now - c.t0) / c.dur, 0, 1);
            const k = ease(p);
            c.x = c.fx + (c.tx - c.fx) * k;
            c.y = c.fy + (c.ty - c.fy) * k;

            if (p >= 1 && !c.arrived) {
              c.arrived = true;
              // Trigger arrival actions
              if (c.role === "backend" && c.targetType === "api") {
                animateApiCounter();
              } else if (c.role === "frontend" && c.targetType === "map") {
                fillMapGreen();
              } else if (c.role === "ux" && c.targetType === "map") {
                drawMapOutline();
              } else if (c.role === "qa" && c.targetType === "graph") {
                animateGraphCard();
              }
              // Dwell for 1000 - 2400ms before roaming to next card/logo
              aim(c, now + rand(1000, 2400));
            }
          }
        }
        c.el.style.transform = `translate(${c.x}px,${c.y}px)`;
      }
    };

    /* ---- Start ---- */
    const start = () => {
      hero.classList.add("is-started");
      T0 = performance.now();
      $("[data-d]").forEach((el) =>
        setTimeout(
          () => el.classList.add("is-visible"),
          reduce ? 0 : +el.dataset.d
        )
      );
      setTimeout(
        () => wrap && wrap.classList.add("is-selected"),
        reduce ? 0 : 900
      );
      // Initial counter run
      setTimeout(() => {
        if (!reduce) {
          animateApiCounter();
          animateGraphCard();
        }
      }, 1000);
    };

    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        fit();
        measure();
      }).observe(hero);
    } else {
      fit();
      measure();
      window.addEventListener("resize", () => {
        fit();
        measure();
      });
    }

    if (window.IntersectionObserver) {
      new IntersectionObserver(([e]) => {
        live = e.isIntersecting;
      }).observe(hero);
    }

    if (reduce) {
      floats.forEach((f) => {
        f.el.style.transform = `rotate(${f.r}deg)`;
      });
      curs.forEach((c) => {
        c.el.style.transform = "none";
      });
    } else {
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(() => requestAnimationFrame(start));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCanvas);
  } else {
    initCanvas();
  }
})();
