/**
 * Vanilla JavaScript DecryptText Engine
 * Decrypts text dynamically through rapid glyph cycling, staggered lock-in,
 * jittered resolution sweeps, and accent glow flashes.
 * MIT Licensed · Clean-room Vanilla JS implementation for Samnun Murtayes Portfolio.
 */
(function () {
  "use strict";

  const POOL_TERMINAL = "abcdef0123456789$#%&*+=/|_~";
  const POOL_DISPLAY = "#%&@$?!*+=/{}[]<>~^";
  const HOVER_COOLDOWN = 1500;
  const CYCLE_SPREAD = 35;
  const FLASH_MS = 420;

  // PRNG (Mulberry32) for deterministic jitter
  function makeRng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function isReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  class DecryptInstance {
    constructor(element) {
      this.el = element;
      this.text = this.el.getAttribute("data-decrypt") || this.el.textContent.trim();
      this.speed = parseInt(this.el.getAttribute("data-speed") || "40", 10);
      this.stagger = parseInt(this.el.getAttribute("data-stagger") || "32", 10);
      this.startDelay = parseInt(this.el.getAttribute("data-start-delay") || "350", 10);
      this.jitter = parseInt(this.el.getAttribute("data-jitter") || "80", 10);
      this.loop = this.el.getAttribute("data-loop") === "false" ? false : parseInt(this.el.getAttribute("data-loop") || "6500", 10);
      this.variant = this.el.getAttribute("data-variant") || "terminal";
      this.seed = parseInt(this.el.getAttribute("data-seed") || "1", 10);
      this.retriggerOnHover = this.el.getAttribute("data-retrigger") !== "false";

      this.pool = this.variant === "terminal" ? POOL_TERMINAL : POOL_DISPLAY;
      this.rafId = null;
      this.loopTimer = null;
      this.lastStart = -Infinity;
      this.runCount = 0;
      this.cells = [];

      this.initDOM();
      this.bindEvents();

      if (isReducedMotion()) {
        this.resolveAll();
      } else {
        setTimeout(() => this.play(), this.startDelay);
      }
    }

    initDOM() {
      this.el.innerHTML = "";
      this.el.classList.add("decrypt-text-root");

      // Accessible screen-reader text
      const srSpan = document.createElement("span");
      srSpan.className = "sr-only";
      srSpan.textContent = this.text;
      this.el.appendChild(srSpan);

      // Visible glyph layer
      const glyphLayer = document.createElement("span");
      glyphLayer.className = "decrypt-glyph-layer";
      glyphLayer.setAttribute("aria-hidden", "true");

      const words = this.text.split(" ");
      this.cells = [];

      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "decrypt-word";

        Array.from(word).forEach((ch) => {
          const charSpan = document.createElement("span");
          charSpan.className = "decrypt-char";
          charSpan.setAttribute("data-mk-char", ch);
          charSpan.setAttribute("data-state", "plain");
          charSpan.textContent = ch;
          wordSpan.appendChild(charSpan);
          this.cells.push(charSpan);
        });

        glyphLayer.appendChild(wordSpan);

        if (wIdx < words.length - 1) {
          const spaceSpan = document.createElement("span");
          spaceSpan.className = "decrypt-space";
          spaceSpan.innerHTML = "&nbsp;";
          glyphLayer.appendChild(spaceSpan);
        }
      });

      this.el.appendChild(glyphLayer);
    }

    stop() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.loopTimer !== null) {
        clearTimeout(this.loopTimer);
        this.loopTimer = null;
      }
    }

    resolveAll() {
      this.cells.forEach((el) => {
        el.textContent = el.getAttribute("data-mk-char") || el.textContent;
        el.setAttribute("data-state", "plain");
      });
    }

    play() {
      if (this.cells.length === 0) return;
      this.stop();

      const rng = makeRng(this.seed + this.runCount * 7919);
      this.runCount += 1;
      this.lastStart = performance.now();

      const total = this.cells.length;
      const lockAt = new Float64Array(total);
      const nextAt = new Float64Array(total);
      const locked = new Uint8Array(total);

      this.cells.forEach((el, idx) => {
        lockAt[idx] = this.startDelay + idx * this.stagger + (rng() * 2 - 1) * this.jitter;
        nextAt[idx] = 0;
        el.setAttribute("data-state", "scramble");
        el.textContent = this.pool.charAt((rng() * this.pool.length) | 0);
      });

      let remaining = total;
      const t0 = performance.now();

      const frame = () => {
        const now = performance.now() - t0;
        for (let i = 0; i < total; i++) {
          if (locked[i]) continue;
          const el = this.cells[i];
          if (now >= lockAt[i]) {
            el.textContent = el.getAttribute("data-mk-char") || "";
            el.setAttribute("data-state", "lock");
            locked[i] = 1;
            remaining -= 1;
          } else if (now >= nextAt[i]) {
            el.textContent = this.pool.charAt((rng() * this.pool.length) | 0);
            nextAt[i] = now + this.speed + rng() * CYCLE_SPREAD;
          }
        }

        if (remaining <= 0) {
          this.rafId = null;
          if (this.loop !== false && this.loop > 0) {
            this.loopTimer = setTimeout(() => {
              this.loopTimer = null;
              this.play();
            }, this.loop);
          }
          return;
        }

        this.rafId = requestAnimationFrame(frame);
      };

      this.rafId = requestAnimationFrame(frame);
    }

    bindEvents() {
      if (!this.retriggerOnHover) return;

      const triggerEl = this.el.closest(".decrypt-terminal-card") || this.el;
      triggerEl.addEventListener("mouseenter", () => {
        if (isReducedMotion()) return;
        if (this.rafId !== null) return;
        if (performance.now() - this.lastStart < HOVER_COOLDOWN) return;
        this.play();
      });
    }
  }

  function initAllDecrypts() {
    const targets = document.querySelectorAll(".js-decrypt-text, [data-decrypt]");
    targets.forEach((el) => {
      if (!el._decryptInstance) {
        el._decryptInstance = new DecryptInstance(el);
      }
    });
  }

  window.initAllDecrypts = initAllDecrypts;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllDecrypts);
  } else {
    initAllDecrypts();
  }
})();

