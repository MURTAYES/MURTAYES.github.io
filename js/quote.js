/**
 * Sticky Scroll-Scrubbed Manifesto Word Reveal Engine
 * Viewport locks in place across 260vh track while scroll wheel acts as a playbackhead,
 * lighting up words sequentially with opacity, translation, and unblurring.
 */
(function () {
  "use strict";

  function initQuoteScrollEngine() {
    const quoteSection = document.querySelector('.home-quote-block');
    if (!quoteSection) return;

    const dotsBg = quoteSection.querySelector('.js-quote-dots');
    const titleWords = quoteSection.querySelectorAll('[data-quote-group="titulo"] .js-quote-word');
    const subtitleWords = quoteSection.querySelectorAll('[data-quote-group="subtitulo"] .js-quote-word');

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function animateWordGroup(words, groupProgress) {
      const total = words.length;
      if (total === 0) return;
      words.forEach((word, index) => {
        // Calculate each word's individual start and end threshold inside the group
        const start = index / total;
        const end = start + (1 / total);
        const wordProgress = clamp((groupProgress - start) / (end - start), 0, 1);

        // Interpolate opacity (0.12 -> 1), Y offset (10px -> 0px), and blur (2px -> 0px)
        const opacity = 0.12 + wordProgress * 0.88;
        const translateY = (1 - wordProgress) * 10;
        const blur = (1 - wordProgress) * 2;

        word.style.opacity = opacity.toFixed(3);
        word.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
        word.style.filter = `blur(${blur.toFixed(2)}px)`;
      });
    }

    function updateQuoteOnScroll() {
      const rect = quoteSection.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      // Normalized progress from 0 (section hits top of screen) to 1 (section finishes pinning)
      const rawProgress = -rect.top / scrollableDistance;
      const progress = clamp(rawProgress, 0, 1);

      // Stage 1: Reveal Title words between 0.05 and 0.60 of scroll progress
      const titleProgress = clamp((progress - 0.05) / 0.55, 0, 1);
      animateWordGroup(titleWords, titleProgress);

      // Stage 2: Reveal Subtitle words between 0.62 and 0.95 of scroll progress
      const subtitleProgress = clamp((progress - 0.62) / 0.33, 0, 1);
      animateWordGroup(subtitleWords, subtitleProgress);

      // Subtle parallax shift on the radial dot background
      if (dotsBg) {
        const yShift = (progress - 0.5) * -45;
        dotsBg.style.transform = `translate3d(0, ${yShift.toFixed(2)}px, 0)`;
      }
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateQuoteOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateQuoteOnScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuoteScrollEngine);
  } else {
    initQuoteScrollEngine();
  }
})();
