---
task: building-scroll-dark-theme
date: 2026-11-09
status: complete
---

# Plan: Section 3 Reordering and White -> Black -> White Scroll Theme Transition

1. **Reorder Section & Rename**:
   - Reorder `#building` directly after Section 2 (`#about`) and before `#canvas` (`ThePeople'sRepublic.bd`).
   - Title set to: "What I'm building currently." (in screen reader and line-reveal text).
   - Add class `home-bloque-dark-mode` and attribute `data-theme-dark="true"`.

2. **Global CSS Variables & Transitions**:
   - Define `--page-bg: #ffffff`, `--page-text: #060606`, `--page-muted: #525866`, and `--border-subtle: rgba(6,6,6,0.08)` on `:root`.
   - Override on `body.is-dark` to `--page-bg: #05070b`, `--page-text: #ffffff`, `--page-muted: #94a3b8`, and `--border-subtle: rgba(255,255,255,0.12)`.
   - Apply `background-color: var(--page-bg)`, `color: var(--page-text)`, and `transition: background-color 0.65s cubic-bezier(0.16, 1, 0.3, 1), color 0.65s cubic-bezier(0.16, 1, 0.3, 1)` to `html` and `body`.
   - Bind fixed header wordmark, hamburger lines, and action buttons to global CSS variables with automatic dark mode inversion.

3. **Viewport-Center IntersectionObserver**:
   - Observe `#building` (`.home-bloque-dark-mode`) using `rootMargin: "-40% 0px -40% 0px"` and `threshold: 0`.
   - When intersecting the viewport center 20% band, add `.is-dark` to `document.body` (transitions White -> Black).
   - When scrolling past into `#canvas` or back up into `#about`, remove `.is-dark` (transitions Black -> White).
