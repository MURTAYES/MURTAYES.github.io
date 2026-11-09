---
task: building-scroll-dark-theme
date: 2026-11-09
status: complete
description: Reordered "What I'm building currently" as Section 3 with smooth White-to-Black-to-White full-page scroll theme transition
---

# Summary: Section 3 Reordering and White -> Black -> White Scroll Theme Transition

- **Reordered Hierarchy**:
  - Moved `#building` directly between Section 2 (`#about`) and Section 4 (`#canvas`).
  - Section heading updated to `What I'm building currently.`.
- **Global CSS Theme Engine (`css/variables.css`)**:
  - Defined `--page-bg`, `--page-text`, `--page-muted`, and `--border-subtle` on `:root` and overridden inside `body.is-dark`.
  - Configured 0.65s smooth cubic-bezier transitions on background and text colors.
- **Fixed Header Auto-Inversion (`css/header.css`)**:
  - Bound header elements to `--page-text` and `--page-bg`.
  - Wordmark automatically inverts to white when `body.is-dark` is active.
- **Viewport-Center IntersectionObserver (`js/building.js`)**:
  - Configured `rootMargin: "-40% 0px -40% 0px"` on `.home-bloque-dark-mode` so `.is-dark` activates when the section enters the center of the viewport and deactivates smoothly when scrolling out.
- **Zero Runtime Dependencies**:
  - Pure HTML5, CSS3, and native vanilla JavaScript with zero external libraries.
