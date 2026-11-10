/**
 * Decrypt Text — Vanilla port of Motiq component (https://motiq.dev/components/decrypt-text)
 * MIT Licensed · Zero external dependencies
 */
(() => {
  "use strict";

  const POOL_DISPLAY = "#%&@$?!*+=/{}[]<>~^";
  const POOL_TERMINAL = "abcdef0123456789$#%&*+=/|_~";
  const HOVER_COOLDOWN = 1500; // ms before a hover can restart a run
  const CYCLE_SPREAD = 35;     // each glyph changes every `speed` to `speed + 35` ms
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const instances = new WeakMap();

  const DEFAULTS = {
    glyphs: "",               // scramble pool; empty = built-in pool for the variant
    speed: 45,                // glyph cycle floor, ms
    stagger: 55,              // per-character lock-in stagger, ms
    startDelay: 350,          // delay before the first character can lock, ms
    jitter: 120,              // random spread on every lock time, +/- ms
    trigger: "inview",        // "mount" | "inview" | "hover" (mount and inview both start once on screen)
    variant: "display",       // "display" | "terminal"
    loop: 7000,               // re-run this many ms after settling; false = run once (use false with trigger "hover")
    retriggerOnHover: true,   // re-scramble on pointer enter (1.5s cooldown)
    seed: 1,                  // seed for the per-character randomness
    reducedMotion: undefined, // true = static, false = always animate, undefined = follow the OS
    onDecrypted: null,        // callback each time the line finishes resolving
  };

  // mulberry32: small seeded RNG, so every run is repeatable
  const makeRng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const span = (cls, hidden) => {
    const n = document.createElement("span");
    n.className = cls;
    if (hidden) n.setAttribute("aria-hidden", "true");
    return n;
  };

  // Options from data-* attributes (only the ones that are set)
  const fromData = (ds) => {
    const o = {};
    for (const k of ["speed", "stagger", "startDelay", "jitter", "seed"]) if (ds[k] != null) o[k] = Number(ds[k]);
    for (const k of ["glyphs", "trigger", "variant"]) if (ds[k]) o[k] = ds[k];
    if (ds.loop != null) o.loop = ds.loop === "false" ? false : Number(ds.loop);
    if (ds.retriggerOnHover != null) o.retriggerOnHover = ds.retriggerOnHover !== "false";
    if (ds.reducedMotion != null) o.reducedMotion = ds.reducedMotion !== "false";
    return o;
  };

  function DecryptText(el, options) {
    if (instances.has(el)) return instances.get(el);

    const o = { ...DEFAULTS, ...fromData(el.dataset), ...options };
    const terminal = o.variant === "terminal";
    const hasBr = /<br\s*[\/]?>/i.test(el.innerHTML);
    const lineTexts = hasBr
      ? el.innerHTML.split(/<br\s*[\/]?>/i).map((chunk) => {
          const t = document.createElement("div");
          t.innerHTML = chunk;
          return t.textContent.replace(/\s+/g, " ").trim();
        }).filter(Boolean)
      : [el.textContent.replace(/\s+/g, " ").trim()];

    const text = lineTexts.join(" ");
    const pool = Array.from(o.glyphs || (terminal ? POOL_TERMINAL : POOL_DISPLAY));
    const chars = [];
    let raf = null, timer = null, lastStart = -Infinity, run = 0;
    let started = false, onScreen = true, tabVisible = true;

    /* Markup: the real string for assistive tech, animated glyphs hidden from it.
       Words stay together so the line wraps on word boundaries. */
    const sr = span("mk-dt__sr");
    sr.textContent = text;
    const glyphs = span("mk-dt__glyphs", true);

    lineTexts.forEach((lineStr, lineIdx) => {
      const words = lineStr.split(" ");
      words.forEach((word, w) => {
        const wordEl = span("mk-dt__word");
        for (const ch of word) {
          const c = document.createElement("span");
          c.dataset.mkChar = ch;
          c.dataset.state = "plain";
          c.textContent = ch;
          wordEl.append(c);
          chars.push(c);
        }
        glyphs.append(wordEl);
        if (w < words.length - 1) glyphs.append(" ");
      });
      if (lineIdx < lineTexts.length - 1) {
        glyphs.append(document.createElement("br"));
      }
    });
    el.textContent = "";
    el.classList.add("mk-dt");
    el.dataset.variant = terminal ? "terminal" : "display";
    el.dataset.chars = chars.length;
    el.append(sr);
    if (terminal) {
      const box = span("mk-dt__box");
      const prompt = span("mk-dt__prompt", true);
      prompt.textContent = "$";
      box.append(prompt, glyphs, span("mk-dt__caret", true));
      el.append(box);
    } else {
      el.append(glyphs);
    }

    /* Animation */
    const reduced = () => o.reducedMotion ?? reduceMQ.matches;
    const pick = (rng) => pool[(rng() * pool.length) | 0];
    const canLoop = () => o.loop !== false && o.loop > 0;
    const resolveAll = () => {
      for (const c of chars) { c.textContent = c.dataset.mkChar; c.dataset.state = "plain"; }
    };
    const stop = () => {
      if (raf != null) cancelAnimationFrame(raf);
      if (timer != null) clearTimeout(timer);
      raf = timer = null;
    };
    const after = (ms) => {
      timer = setTimeout(() => { timer = null; play(); }, ms);
    };

    // Every glyph is already scrambling at t=0; glyph i locks at startDelay + i*stagger +/- jitter
    const play = () => {
      if (!chars.length || reduced()) return;
      const rng = makeRng(o.seed + run * 7919);
      run += 1;
      stop();
      started = true;
      lastStart = performance.now();

      const n = chars.length;
      const lockAt = new Float64Array(n), nextAt = new Float64Array(n), locked = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        lockAt[i] = o.startDelay + i * o.stagger + (rng() * 2 - 1) * o.jitter;
        chars[i].dataset.state = "scramble";
        chars[i].textContent = pick(rng);
      }

      let remaining = n;
      const t0 = performance.now();
      const frame = () => {
        const now = performance.now() - t0;
        for (let i = 0; i < n; i++) {
          if (locked[i]) continue;
          const c = chars[i];
          if (now >= lockAt[i]) {
            c.textContent = c.dataset.mkChar;
            c.dataset.state = "lock";
            locked[i] = 1;
            remaining--;
          } else if (now >= nextAt[i]) {
            c.textContent = pick(rng);
            nextAt[i] = now + o.speed + rng() * CYCLE_SPREAD;
          }
        }
        if (remaining > 0) { raf = requestAnimationFrame(frame); return; }
        raf = null;
        o.onDecrypted?.();
        el.dispatchEvent(new CustomEvent("decrypted", { bubbles: true }));
        if (canLoop()) after(o.loop);
      };
      raf = requestAnimationFrame(frame);
    };

    /* Orchestration: reduced motion resolves and parks; otherwise runs are gated on
       the trigger and parked while offscreen or while the tab is hidden. */
    const sync = () => {
      const reduce = reduced();
      el.dataset.motion = reduce ? "static" : "animated";
      if (reduce) { stop(); resolveAll(); return; }

      if (!(onScreen && tabVisible)) {
        const midRun = raf != null;
        stop();
        if (midRun) { // never leave half-scrambled text behind
          resolveAll();
          if (o.trigger !== "hover") started = false; // run again from the top when visible
        }
        return;
      }
      if (o.trigger === "hover") { if (!started) resolveAll(); return; }
      if (!started) play();
      else if (raf == null && timer == null && canLoop()) after(Math.min(o.loop, 3000)); // back on screen: re-arm loop
    };

    const onPointerEnter = () => {
      if (reduced() || !o.retriggerOnHover || raf != null) return;
      if (performance.now() - lastStart < HOVER_COOLDOWN) return;
      play();
    };
    const onVis = () => {
      tabVisible = document.visibilityState !== "hidden";
      sync();
    };
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          onScreen = entries[entries.length - 1].isIntersecting;
          sync();
        }, { threshold: 0.12 })
      : null;

    const api = {
      play,
      destroy() {
        stop();
        io?.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        reduceMQ.removeEventListener("change", sync);
        el.removeEventListener("pointerenter", onPointerEnter);
        el.classList.remove("mk-dt");
        delete el.dataset.motion;
        delete el.dataset.chars;
        el.textContent = text;
        instances.delete(el);
      },
    };
    instances.set(el, api);

    io?.observe(el);
    document.addEventListener("visibilitychange", onVis);
    reduceMQ.addEventListener("change", sync);
    el.addEventListener("pointerenter", onPointerEnter);
    onVis();

    return api;
  }

  DecryptText.init = (root = document) =>
    Array.from(root.querySelectorAll("[data-decrypt]"), (el) => DecryptText(el));
  window.DecryptText = DecryptText;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => DecryptText.init());
  else DecryptText.init();
})();
