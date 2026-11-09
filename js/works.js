/**
 * ==========================================================================
 * SELECTED WORK: EDITORIAL ASYMMETRICAL DESK & MACOS GENIE MODAL
 * Strip-Decomposition Genie Animation · 3D Folder Desk · Scroll Reveals
 * Zero Frameworks · Zero CDNs · 60fps Hardware Accelerated
 * ==========================================================================
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initEditorialDesk() {
    if (isInitialized) return;
    isInitialized = true;

    const $$ = (s) => Array.from(document.querySelectorAll(s));
    const folders = $$(".work-folder");
    const wins = $$(".win");
    const backdrop = document.getElementById("dossier-backdrop");
    const reduce = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };

    if (wins.length === 0 || folders.length === 0) return;

    const SH = 4; // strip height in px
    const OV = 1; // strips overlap by 1px so no seams
    const LAG = 0.45; // how long the top trails the bottom
    const NECK = 100; // width of the funnel at the folder
    let current = -1;
    let busy = false;

    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    /* -----------------------------------------------------------------------
       POSITIONING: Size the window and park it above the folder
       ----------------------------------------------------------------------- */
    const place = (win, folder) => {
      const fRect = folder
        ? folder.getBoundingClientRect()
        : { top: window.innerHeight * 0.7 };
      const limit = fRect.top - 24;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const w = Math.min(840, vw - 24) & ~1;

      let h, wy;
      if (limit >= 340) {
        h = Math.round(Math.min(540, limit - 16) / SH) * SH;
        wy = Math.round(Math.max(16, (limit - h) / 2));
      } else {
        h = Math.round(Math.min(580, vh - 48) / SH) * SH;
        wy = Math.round(Math.max(16, (vh - h) / 2));
      }

      const wx = Math.round((vw - w) / 2);
      win.style.setProperty("--ww", w + "px");
      win.style.setProperty("--wh", h + "px");
      win.style.setProperty("--wx", wx + "px");
      win.style.setProperty("--wy", wy + "px");
    };

    /* -----------------------------------------------------------------------
       TARGET: Where the window enters/leaves the folder
       ----------------------------------------------------------------------- */
    const target = (folder) => {
      const f = folder || document.querySelector(".work-folder");
      const r = f
        ? f.getBoundingClientRect()
        : { left: window.innerWidth / 2, width: 0, top: window.innerHeight * 0.7 };
      return [r.left + r.width / 2, r.top + r.height * 0.4];
    };

    /* -----------------------------------------------------------------------
       GENIE ANIMATION: Strip decomposition funnel
       p = 0 → window fully open. p = 1 → collapsed into folder.
       ----------------------------------------------------------------------- */
    const genie = (win, tx, ty, from, to, ms, ease) =>
      new Promise((done) => {
        if (reduce.matches) return done();
        const r = win.getBoundingClientRect();
        const x0 = r.left,
          y0 = r.top,
          w = r.width,
          h = r.height,
          n = Math.round(h / SH);

        const layer = document.createElement("div");
        layer.className = "genie";
        layer.inert = true;
        const strips = [];

        for (let i = 0; i < n; i++) {
          const s = document.createElement("div");
          s.className = "strip";
          s.style.width = w + "px";
          s.style.height = SH + OV + "px";

          const c = win.cloneNode(true);
          c.removeAttribute("id");
          c.removeAttribute("hidden");
          c.classList.remove("settled");
          c.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

          const docEl = c.querySelector(".doc") || c.querySelector(".cs-article");
          if (docEl) docEl.style.overflow = "hidden";

          Object.assign(c.style, {
            position: "absolute",
            left: "0px",
            top: -i * SH + "px",
            width: w + "px",
            height: h + "px",
            margin: "0px",
            visibility: "visible",
            opacity: "1",
          });

          s.append(c);
          layer.append(s);
          strips.push(s);
        }

        const cx0 = x0 + w / 2,
          ns = NECK / w;
        const Y = new Float32Array(n + 1),
          L = new Float32Array(n + 1),
          R = new Float32Array(n + 1);

        const draw = (p) => {
          for (let j = 0; j <= n; j++) {
            const q = clamp01((p - LAG * (1 - j / n)) / (1 - LAG));
            const g = q * q * (3 - 2 * q);
            const yo = y0 + j * SH;
            const half = (w * (1 + (ns - 1) * g)) / 2;
            const cx = cx0 + (tx - cx0) * g;
            Y[j] = yo + (ty - yo) * q * q;
            L[j] = cx - half;
            R[j] = cx + half;
          }
          for (let i = 0; i < n; i++) {
            const l = (L[i] + L[i + 1]) / 2,
              rr = (R[i] + R[i + 1]) / 2;
            const sy = Math.max((Y[i + 1] - Y[i]) / SH, 1e-4);
            strips[i].style.transform = `translate(${l}px,${Y[i]}px) scale(${
              (rr - l) / w
            },${sy})`;
          }
        };

        draw(from);
        document.body.append(layer);
        const t0 = performance.now();

        const tick = (now) => {
          const t = clamp01((now - t0) / ms);
          draw(from + (to - from) * ease(t));
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            layer.remove();
            done();
          }
        };

        requestAnimationFrame(tick);
      });

    /* -----------------------------------------------------------------------
       SHOW: Open the case study window with Genie effect
       ----------------------------------------------------------------------- */
    const show = async (k) => {
      const win = wins[k];
      if (!win) return;
      const folder = folders[k] || document.querySelector(".work-folder");

      // Calculate exact center coordinates and set --origin-x and --origin-y
      if (folder) {
        const rect = folder.getBoundingClientRect();
        const originX = rect.left + rect.width / 2 - window.innerWidth / 2;
        const originY = rect.top + rect.height / 2 - window.innerHeight / 2;
        win.style.setProperty("--origin-x", `${originX}px`);
        win.style.setProperty("--origin-y", `${originY}px`);
      }

      if (backdrop) backdrop.classList.add("is-active");
      document.body.style.overflow = "hidden";
      if (folder) folder.classList.add("is-active");

      place(win, folder);
      win.hidden = false;
      win.setAttribute("open", "");
      win.style.visibility = "hidden";

      await genie(win, ...target(folder), 1, 0, 650, easeOut);

      win.style.visibility = "";
      win.classList.add("settled");
      current = k;

      // Trigger inner reveals
      const rules = win.querySelectorAll(".cs-rule");
      rules.forEach((r) => r.classList.add("is-drawn"));
      const reveals = win.querySelectorAll(".reveal");
      reveals.forEach((rv) => rv.classList.add("is-visible"));

      const closeBtn = win.querySelector(
        ".dot.r, .close-dot, .cs-nav-close-btn, .win-close-btn"
      );
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    };

    /* -----------------------------------------------------------------------
       HIDE: Close back into the folder with Genie reverse
       ----------------------------------------------------------------------- */
    const hide = async () => {
      if (current < 0) return;
      const k = current;
      const win = wins[k];
      if (!win) return;
      const folder = folders[k] || document.querySelector(".work-folder");

      win.classList.remove("settled");
      win.removeAttribute("open");
      if (backdrop) backdrop.classList.remove("is-active");

      const playing = genie(win, ...target(folder), 0, 1, 560, easeInOut);
      win.style.visibility = "hidden";
      await playing;
      win.hidden = true;
      win.style.visibility = "";
      if (folder) folder.classList.remove("is-active");
      document.body.style.overflow = "";
      current = -1;
    };

    const run = async (fn) => {
      if (busy) return;
      busy = true;
      try {
        await fn();
      } finally {
        busy = false;
      }
    };

    const close = () =>
      run(async () => {
        if (current < 0) return;
        const k = current;
        const folder = folders[k];
        await hide();
        if (folder) folder.focus({ preventScroll: true });
      });

    /* -----------------------------------------------------------------------
       EVENT BINDINGS: Folder clicks, close, ESC, backdrop, next project
       ----------------------------------------------------------------------- */

    // Folder click
    folders.forEach((f, idx) => {
      const dossierIdx =
        f.getAttribute("data-dossier-index") !== null
          ? parseInt(f.getAttribute("data-dossier-index"), 10)
          : idx;

      f.addEventListener("click", (e) => {
        e.preventDefault();
        run(async () => {
          if (current === dossierIdx) return;
          if (current > -1) await hide();
          await show(dossierIdx);
        });
      });

      f.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          run(async () => {
            if (current === dossierIdx) return;
            if (current > -1) await hide();
            await show(dossierIdx);
          });
        }
      });
    });

    // Spotlight tracking on folder hover (update --mx, --my)
    folders.forEach((f) => {
      const body = f.querySelector(".folder-body") || f;

      f.addEventListener("mousemove", (e) => {
        const rect = f.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        body.style.setProperty("--mx", mx + "px");
        body.style.setProperty("--my", my + "px");
      });
    });

    // Close buttons
    document.addEventListener("click", (e) => {
      if (current > -1 && !busy) {
        if (
          e.target.closest(
            ".dot.r, .dot.y, .close-dot, .cs-nav-close-btn, .win-close-btn, [data-close-win]"
          )
        ) {
          e.preventDefault();
          close();
          return;
        }

        // Next project link inside case study
        const nextLink = e.target.closest(".js-cs-next");
        if (nextLink) {
          e.preventDefault();
          const nextIdx = parseInt(
            nextLink.getAttribute("data-next-index"),
            10
          );
          if (!isNaN(nextIdx)) {
            run(async () => {
              await hide();
              await show(nextIdx);
            });
          }
          return;
        }

        // Backdrop click
        if (
          e.target.id === "dossier-backdrop" ||
          (!e.target.closest(
            ".win, .work-folder, .js-dossier-jump, .js-open-dossier, .cs-nav-bar"
          ))
        ) {
          close();
        }
      }
    });

    // Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && current > -1) {
        close();
      }
    });

    // Resize reposition
    window.addEventListener("resize", () => {
      if (current > -1) place(wins[current], folders[current]);
    });

    /* -----------------------------------------------------------------------
       SCROLL REVEAL: Staggered folder entrance
       ----------------------------------------------------------------------- */
    if (!reduce.matches) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
      );

      folders.forEach((f) => revealObserver.observe(f));
    } else {
      folders.forEach((f) => f.classList.add("is-revealed"));
    }

    /* -----------------------------------------------------------------------
       SECTION 3 JUMP LINKS (from timeline/elsewhere in the page)
       ----------------------------------------------------------------------- */
    document.querySelectorAll(".js-dossier-jump").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetFolder = link.getAttribute("data-target-folder");
        const folderMap = { applykit: 0, pharmaerp: 1, eduhub: 2, edu52: 2 };
        const index =
          folderMap[targetFolder] !== undefined ? folderMap[targetFolder] : 0;
        const worksSection = document.getElementById("works");
        if (worksSection) {
          worksSection.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            run(async () => {
              if (current === index) return;
              if (current > -1) await hide();
              await show(index);
            });
          }, 600);
        }
      });
    });

    // Global API
    window.openWorksDossier = (index) => {
      run(async () => {
        if (current === index) return;
        if (current > -1) await hide();
        await show(index);
      });
    };
    window.closeWorksDossier = close;
  }

  window.initSelectedWorks = initEditorialDesk;
  window.initEditorialDesk = initEditorialDesk;
  window.initDigitalDesktop = initEditorialDesk;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEditorialDesk);
  } else {
    initEditorialDesk();
  }
})();
