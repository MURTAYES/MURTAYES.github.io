/**
 * Selected Works Architecture Module (Pure Vanilla JavaScript)
 * Apple macOS Genie Effect Window Animation
 * Mathematical Funnel Decomposition & Sliced Strip Rendering
 * Zero Frameworks · Zero CDNs · 60fps Hardware Accelerated
 */
(function () {
  "use strict";

  let isInitialized = false;

  function initSelectedWorks() {
    if (isInitialized) return;
    isInitialized = true;

    const $$ = (s) => Array.from(document.querySelectorAll(s));
    const folders = $$(".folder");
    const wins = $$(".win");
    const sheets = $$(".sheet");
    const backdrop = document.getElementById("dossier-backdrop");
    const reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

    if (wins.length === 0) return;

    const SH = 4;      // strip height in px: smaller = smoother funnel, more DOM
    const OV = 1;      // strips overlap by 1px so no seams show
    const LAG = 0.45;  // how long the top of the window trails the bottom (0..1)
    const NECK = 100;  // width of the funnel where it meets the folder
    let current = -1;
    let busy = false;

    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // Size the window and park it above the folder or centered in viewport.
    // Whole pixels only, so the hand-off between animated strips and the real window is seamless.
    const place = (win, folder) => {
      const f = folder || document.querySelector(".folder");
      const fRect = f ? f.getBoundingClientRect() : { top: window.innerHeight * 0.7 };
      const limit = fRect.top - 24;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Responsive macOS window width
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

    // Where the window enters or leaves the folder: the page's x, just inside the flap's lip
    const target = (sheet, folder) => {
      const f = folder || (sheet ? sheet.closest(".folder") : null) || document.querySelector(".folder");
      const flap = f ? (f.querySelector(".flap") || f) : null;
      const r = sheet ? sheet.getBoundingClientRect() : (flap ? flap.getBoundingClientRect() : { left: window.innerWidth / 2, width: 0 });
      const flapTop = flap ? flap.getBoundingClientRect().top : window.innerHeight * 0.7;
      return [r.left + r.width / 2, flapTop + 12];
    };

    /* Genie. The window is cloned into horizontal strips; every frame each strip is
       moved and squeezed along a funnel that ends at (tx, ty).
       p = 0: window fully open. p = 1: collapsed into the folder.
       Each strip boundary j has its own progress q: the bottom leads, the top trails by LAG.
         horizontal squeeze/shift  g = smoothstep(q)  -> S-shaped funnel
         vertical travel           q * q              -> tail compresses, top stays almost rigid */
    const genie = (win, tx, ty, from, to, ms, ease) =>
      new Promise((done) => {
        if (reduce.matches) return done();
        const r = win.getBoundingClientRect();
        const x0 = r.left, y0 = r.top, w = r.width, h = r.height, n = Math.round(h / SH);

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

        const cx0 = x0 + w / 2, ns = NECK / w;
        const Y = new Float32Array(n + 1), L = new Float32Array(n + 1), R = new Float32Array(n + 1);

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
            const l = (L[i] + L[i + 1]) / 2, rr = (R[i] + R[i + 1]) / 2;
            const sy = Math.max((Y[i + 1] - Y[i]) / SH, 1e-4);
            strips[i].style.transform = `translate(${l}px,${Y[i]}px) scale(${(rr - l) / w},${sy})`;
          }
        };

        draw(from); // first painted frame is already correct
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
      if (!win) return;
      const folder = folders[k] || document.querySelector(".folder");
      const sheet = (folder ? folder.querySelector(".sheet") : null) || sheets[k];

      if (backdrop) backdrop.classList.add("is-active");
      document.body.style.overflow = "hidden";

      place(win, folder);
      win.hidden = false;
      win.style.visibility = "hidden"; // real window waits while the strips play
      if (sheet) sheet.classList.add("is-away"); // the page "becomes" the window
      if (folder) folder.classList.add("is-fanned");

      await genie(win, ...target(sheet, folder), 1, 0, 650, easeOut);

      win.style.visibility = "";
      win.classList.add("settled");
      current = k;

      // Trigger inner typographic rules and reveals
      const rules = win.querySelectorAll(".cs-rule");
      rules.forEach((r) => r.classList.add("is-drawn"));
      const reveals = win.querySelectorAll(".reveal");
      reveals.forEach((rv) => rv.classList.add("is-visible"));

      const closeDot = win.querySelector(".dot.r, .close-dot, .cs-nav-close-btn");
      if (closeDot) closeDot.focus({ preventScroll: true });
    };

    // Window -> page (minimize)
    const hide = async () => {
      if (current < 0) return;
      const k = current;
      const win = wins[k];
      if (!win) return;
      const folder = folders[k] || document.querySelector(".folder");
      const sheet = (folder ? folder.querySelector(".sheet") : null) || sheets[k];

      win.classList.remove("settled");
      if (backdrop) backdrop.classList.remove("is-active");

      const playing = genie(win, ...target(sheet, folder), 0, 1, 560, easeInOut); // clones the window right now
      win.style.visibility = "hidden";
      await playing;
      win.hidden = true;
      win.style.visibility = "";
      if (sheet) sheet.classList.remove("is-away");
      if (folder) folder.classList.remove("is-fanned");
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
        const sheet = folder ? folder.querySelector(".sheet") : null;
        await hide();
        if (sheet) sheet.focus({ preventScroll: true });
        else if (folder) folder.focus({ preventScroll: true });
      });

    // 1. Sheet Click
    sheets.forEach((s) => {
      s.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const folder = s.closest(".folder");
        const idx = folder && folder.getAttribute("data-dossier-index") !== null
          ? parseInt(folder.getAttribute("data-dossier-index"), 10)
          : (s.getAttribute("data-dossier-index") !== null ? parseInt(s.getAttribute("data-dossier-index"), 10) : 0);

        run(async () => {
          if (current === idx) return;
          if (current > -1) await hide();
          await show(idx);
        });
      });
    });

    // 2. Folder Click
    folders.forEach((f, idx) => {
      f.addEventListener("click", (e) => {
        if (e.target.closest(".sheet")) return; // sheet click handles itself
        e.preventDefault();
        const clickedIdx = f.getAttribute("data-dossier-index") !== null
          ? parseInt(f.getAttribute("data-dossier-index"), 10)
          : idx;

        run(async () => {
          if (current === clickedIdx) return;
          if (current > -1) await hide();
          await show(clickedIdx);
        });
      });

      f.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const clickedIdx = f.getAttribute("data-dossier-index") !== null
            ? parseInt(f.getAttribute("data-dossier-index"), 10)
            : idx;
          run(async () => {
            if (current === clickedIdx) return;
            if (current > -1) await hide();
            await show(clickedIdx);
          });
        }
      });
    });

    // 3. Inspect Button in Text Side
    document.querySelectorAll(".js-open-dossier").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute("data-dossier-index"), 10);
        const targetIdx = isNaN(idx) ? 0 : idx;
        run(async () => {
          if (current === targetIdx) return;
          if (current > -1) await hide();
          await show(targetIdx);
        });
      });
    });

    // 4. Close on dot or button click or backdrop click
    document.addEventListener("click", (e) => {
      if (current > -1 && !busy) {
        if (e.target.closest(".dot.r, .dot.y, .close-dot, .cs-nav-close-btn, .win-close-btn, [data-close-win]")) {
          e.preventDefault();
          close();
          return;
        }

        // Next project link inside active case study
        const nextLink = e.target.closest(".js-cs-next");
        if (nextLink) {
          e.preventDefault();
          const nextIdx = parseInt(nextLink.getAttribute("data-next-index"), 10);
          if (!isNaN(nextIdx)) {
            run(async () => {
              await hide();
              await show(nextIdx);
            });
          }
          return;
        }

        // Click outside on backdrop
        if (e.target.id === "dossier-backdrop" || (!e.target.closest(".win, .sheet, .folder, .js-dossier-jump, .js-open-dossier") && !e.target.closest(".cs-nav-bar"))) {
          close();
        }
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && current > -1) {
        close();
      }
    });

    window.addEventListener("resize", () => {
      if (current > -1) place(wins[current], folders[current]);
    });

    // Keyboard: focusing a folder fans it
    folders.forEach((f) => {
      f.addEventListener("focusin", (e) => {
        if (e.target.matches(":focus-visible")) f.classList.add("is-fanned");
      });
      f.addEventListener("focusout", () => {
        if (current < 0 && !busy) f.classList.remove("is-fanned");
      });
      f.addEventListener("click", (e) => {
        if (window.matchMedia && window.matchMedia("(hover: none)").matches && !e.target.closest(".sheet") && current < 0) {
          f.classList.toggle("is-fanned");
        }
      });
    });

    // Section 3 Jump Links
    document.querySelectorAll(".js-dossier-jump").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetFolder = link.getAttribute("data-target-folder");
        const folderMap = { applykit: 0, pharmaerp: 1, eduhub: 2, edu52: 2 };
        const index = folderMap[targetFolder] !== undefined ? folderMap[targetFolder] : 0;
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

    // Expose Global API
    window.openWorksDossier = (index) => {
      run(async () => {
        if (current === index) return;
        if (current > -1) await hide();
        await show(index);
      });
    };
    window.closeWorksDossier = close;
  }

  window.initSelectedWorks = initSelectedWorks;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSelectedWorks);
  } else {
    initSelectedWorks();
  }
})();
