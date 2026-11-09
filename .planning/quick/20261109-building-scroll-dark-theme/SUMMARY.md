---
task: building-scroll-dark-theme
date: 2026-11-09
status: complete
description: Refined White->Black->White scroll theme transition to exact Onlines 60fps cubic-bezier(0.4, 0, 0.2, 1) timing and description trigger
---

# Summary: Section 3 Reordering and Exact Onlines White -> Black -> White Scroll Theme Transition

- **Exact Onlines View Script Engine (`js/building.js`)**:
  - Implemented `TRIGGER_SELECTOR = ".home-bloque-dark-mode__descripcion"` with `TRIGGER_ROOT_MARGIN = "0px"` and `threshold: 0`.
  - Added `SWITCHING_CLASS = "theme-switching"` with `SWITCHING_DURATION = 850` to `document.body` during transitions.
- **Cinematic Easing Curve (`0.8s cubic-bezier(0.4, 0, 0.2, 1)`)**:
  - Replaced abrupt `0.65s` ease-out with Onlines's exact `0.8s cubic-bezier(0.4, 0, 0.2, 1)` across `html`, `body`, `#building`, `#about`, `#canvas`, and fixed header.
  - Deep dark background aligned to `#010101`.
- **Harmonized Neighboring Boundaries**:
  - Added `transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)` and `var(--page-bg)` to `#about` (`.home-quote-block`) and `#canvas` (`.home-hero-canvas`), eliminating jarring cutoffs when scrolling across boundaries.
- **Paint Cost Suppression**:
  - Suppressed heavy backdrop-filters during `.theme-switching` for 60fps fluidity.
