---
task: building-scroll-dark-theme
date: 2026-11-09
status: complete
---

# Plan: Section 3 Reordering and Exact Onlines White -> Black -> White Scroll Theme Transition

1. **Exact Trigger & Observer Timing**:
   - Extract and mirror `onlines.com.ar`'s `home-bloque-dark-mode-view.js` architecture.
   - Observe `.home-bloque-dark-mode__descripcion` with `TRIGGER_ROOT_MARGIN = '0px'` and `threshold: 0`.
   - Add class `.theme-switching` to `document.body` for 850ms during theme transitions.

2. **Transition Curves & Performance**:
   - Apply `transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1), color 0.8s cubic-bezier(0.4, 0, 0.2, 1)`.
   - Set deep dark mode background to `#010101` matching Onlines.
   - During `.theme-switching`, suppress heavy backdrop-filters and repaint bottlenecks to maintain 60fps.

3. **Adjacent Section Synchronization**:
   - Synchronize `#about` (`.home-quote-block` and `.home-quote-block__sticky`) and `#canvas` (`.home-hero-canvas`) to inherit `--page-bg` with matching 0.8s ease-in-out transitions, eliminating harsh boundary clipping.
