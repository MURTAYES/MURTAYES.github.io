/**
 * Selected Works Architecture Module (Pure Vanilla JavaScript)
 * Interactive Tactile Architectural Manila Folder with Apple Mac Genie Window Animation.
 * Zero external libraries or bundlers.
 */
(function () {
  "use strict";

  function initSelectedWorks() {
    const $$ = (s) => [...document.querySelectorAll(s)];
    const folder = document.querySelector(".folder");
    const flap = document.querySelector(".flap");
    const sheets = $$(".sheet");
    const wins = $$(".win");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");

    if (!folder || !flap || sheets.length === 0 || wins.length === 0) return;
    if (folder.dataset.worksInitialized === "true") return;
    folder.dataset.worksInitialized = "true";

    const SH = 4;     // strip height in px: smaller = smoother funnel
    const OV = 1;     // strips overlap by 1px so no seams show
    const LAG = 0.45; // how long the top of the window trails the bottom (0..1)
    const NECK = 100; // width of the funnel where it meets the folder
    let current = -1;
    let busy = false;

    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // Size the window and position it above the folder or centered in viewport.
    const place = (win) => {
      const fRect = folder.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const w = Math.min(680, vw - 32) & ~1;

      let topSpace = fRect.top - 20;
      let h, wy;

      if (topSpace >= 280) {
        h = Math.round(Math.min(480, topSpace - 16) / SH) * SH;
        wy = Math.round(Math.max(16, (topSpace - h) / 2));
      } else {
        h = Math.round(Math.min(500, vh - 60) / SH) * SH;
        wy = Math.round(Math.max(16, (vh - h) / 2));
      }

      const wx = Math.round((vw - w) / 2);
      win.style.setProperty("--ww", w + "px");
      win.style.setProperty("--wh", h + "px");
      win.style.setProperty("--wx", wx + "px");
      win.style.setProperty("--wy", wy + "px");
    };

    // Where the window enters or leaves the folder: the page's x, just inside the flap's lip
    const target = (sheet) => {
      const r = sheet.getBoundingClientRect();
      return [r.left + r.width / 2, flap.getBoundingClientRect().top + 12];
    };

    /* Genie animation: The window is cloned into horizontal strips; every frame each strip is
       moved and squeezed along an S-shaped funnel ending at (tx, ty). */
    const genie = (win, tx, ty, from, to, ms, ease) =>
      new Promise((done) => {
        if (reduce.matches) return done();

        const r = win.getBoundingClientRect();
        const x0 = r.left;
        const y0 = r.top;
        const w = r.width;
        const h = r.height;
        const n = Math.round(h / SH);

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
          const docEl = c.querySelector(".doc");
          if (docEl) docEl.style.overflow = "hidden";

          Object.assign(c.style, {
            position: "absolute",
            left: "0px",
            top: -i * SH + "px",
            width: w + "px",
            height: h + "px",
            margin: "0px",
            visibility: "visible",
          });

          s.append(c);
          layer.append(s);
          strips.push(s);
        }

        const cx0 = x0 + w / 2;
        const ns = NECK / w;
        const Y = new Float32Array(n + 1);
        const L = new Float32Array(n + 1);
        const R = new Float32Array(n + 1);

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
            const l = (L[i] + L[i + 1]) / 2;
            const rr = (R[i] + R[i + 1]) / 2;
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

    // Page -> window (maximize)
    const show = async (k) => {
      const win = wins[k];
      place(win);
      win.hidden = false;
      win.style.visibility = "hidden";
      sheets[k].classList.add("is-away");
      folder.classList.add("is-fanned");
      await genie(win, ...target(sheets[k]), 1, 0, 650, easeOut);
      win.style.visibility = "";
      win.classList.add("settled");
      current = k;

      const closeDot = win.querySelector(".dot.r");
      if (closeDot) closeDot.focus({ preventScroll: true });
    };

    // Window -> page (minimize)
    const hide = async () => {
      if (current < 0) return;
      const k = current;
      const win = wins[k];
      win.classList.remove("settled");
      const playing = genie(win, ...target(sheets[k]), 0, 1, 560, easeInOut);
      win.style.visibility = "hidden";
      await playing;
      win.hidden = true;
      win.style.visibility = "";
      sheets[k].classList.remove("is-away");
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
        await hide();
        folder.classList.remove("is-fanned");
        if (sheets[k]) sheets[k].focus({ preventScroll: true });
      });

    // Sheet click triggers genie open
    sheets.forEach((s, k) =>
      s.addEventListener("click", () =>
        run(async () => {
          if (current === k) return;
          if (current > -1) await hide();
          await show(k);
        })
      )
    );

    // Close on dot or button click or click outside
    document.addEventListener("click", (e) => {
      if (current > -1 && !busy) {
        if (e.target.closest(".dot.r, .dot.y, [data-close-win]")) {
          close();
        } else if (!e.target.closest(".win, .sheet, .folder, .js-dossier-jump")) {
          close();
        }
      }
    });

    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && current > -1) close();
    });

    addEventListener("resize", () => {
      if (current > -1) place(wins[current]);
    });

    // Keyboard & touch accessibility
    folder.addEventListener("focusin", (e) => {
      if (e.target.matches(":focus-visible")) folder.classList.add("is-fanned");
    });

    folder.addEventListener("focusout", () => {
      if (current < 0 && !busy) folder.classList.remove("is-fanned");
    });

    folder.addEventListener("click", (e) => {
      if (
        matchMedia("(hover: none)").matches &&
        !e.target.closest(".sheet") &&
        current < 0
      ) {
        folder.classList.toggle("is-fanned");
      }
    });

    // Section 6 jump links trigger genie open
    document.querySelectorAll(".js-dossier-jump").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetFolder = link.getAttribute("data-target-folder");
        const folderMap = { applykit: 0, pharmaerp: 1, eduhub: 2 };
        const index = folderMap[targetFolder] ?? 0;
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

    // Expose for external access
    window.openWorksDossier = (index) => {
      run(async () => {
        if (current === index) return;
        if (current > -1) await hide();
        await show(index);
      });
    };
  }

  window.initSelectedWorks = initSelectedWorks;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSelectedWorks);
  } else {
    initSelectedWorks();
  }
})();
