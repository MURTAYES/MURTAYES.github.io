/**
 * Vanilla JavaScript DecryptText Engine
 * Clean-room 1:1 Vanilla JS implementation matching Motiq DecryptText specification.
 * Zero external dependencies. Zero CDN.
 */
(function () {
  "use strict";

  const POOL_TERMINAL = "abcdef0123456789$#%&*+=/|_~";
  const POOL_DISPLAY = "#%&@$?!*+=/{}[]<>~^";
  const HOVER_COOLDOWN = 1500;
  const CYCLE_SPREAD = 35;

  // Mulberry32 deterministic PRNG (matching reference)
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
      this.root = element;
      this.contentEl = this.root.querySelector(".js-decrypt-content") || this.root;
      this.text = this.root.getAttribute("data-decrypt") || this.contentEl.textContent.trim();
      this.speed = parseInt(this.root.getAttribute("data-speed") || "45", 10);
      this.stagger = parseInt(this.root.getAttribute("data-stagger") || "55", 10);
      this.startDelay = parseInt(this.root.getAttribute("data-start-delay") || "600", 10);
      this.jitter = parseInt(this.root.getAttribute("data-jitter") || "120", 10);
      this.loop = this.root.getAttribute("data-loop") === "false" ? false : parseInt(this.root.getAttribute("data-loop") || "5200", 10);
      this.variant = this.root.getAttribute("data-variant") || "terminal";
      this.seed = parseInt(this.root.getAttribute("data-seed") || "1", 10);
      this.retriggerOnHover = this.root.getAttribute("data-retrigger") !== "false";

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
        this.play();
      }
    }

    initDOM() {
      this.contentEl.innerHTML = "";

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

        this.contentEl.appendChild(wordSpan);

        if (wIdx < words.length - 1) {
          const spaceSpan = document.createElement("span");
          spaceSpan.className = "decrypt-word";
          spaceSpan.innerHTML = "&nbsp;";
          this.contentEl.appendChild(spaceSpan);
        }
      });
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

      const triggerEl = this.root;
      triggerEl.addEventListener("mouseenter", () => {
        if (isReducedMotion()) return;
        if (this.rafId !== null) return;
        if (performance.now() - this.lastStart < HOVER_COOLDOWN) return;
        this.play();
      });
    }
  }

  function initAllDecrypts() {
    const targets = document.querySelectorAll(".js-decrypt-terminal, .js-decrypt-text, [data-decrypt]");
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
