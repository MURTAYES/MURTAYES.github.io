# Requirements: Samnun Murtayes Portfolio

**Defined:** 2026-11-09  
**Core Value:** Demonstrate world-class frontend engineering, creative design systems, and tactile digital craftsmanship through pure vanilla web technologies (HTML, CSS, JavaScript) with zero runtime dependencies.

## v1 Requirements

Requirements for initial release. Each section maps directly to an execution phase.

### Section 1: Hero & Kinetic Preloader (Phase 1)

- [x] **HERO-01**: Kinetic Willem preloader animation plays on initial load and smoothly transitions to the hero section.
- [x] **HERO-02**: Background utilizes the reference silhouette image (`assets/images/hero-bg.jpg`) positioned and framed cleanly.
- [x] **HERO-03**: Prominent typography displays "Samnun Murtayes" (replacing Dor Sharaby) with subtitle "Brands, products & the art in between. I take the fun seriously."
- [x] **HERO-04**: Interactive skill tags displayed: "Brand Design", "Product Design", "UX | UI", "Art Direction", "Motion & 3D".
- [x] **HERO-05**: Brand logo smoothly animates from the Willem preloader card into the fixed top navigation bar (replacing Pamidor Studio).

### Section 2: Sticky Scroll-Scrubbed Manifesto (Phase 2)

- [ ] **MANI-01**: Section pins in the viewport using a tall scroll track (`260vh`) while sticky container remains pinned at `100vh`.
- [ ] **MANI-02**: Radial dot matrix background layer (`.patron-puntos`) with circular radial mask performs subtle parallax shift across scroll.
- [ ] **MANI-03**: Text is split into two sequential groups: `titulo` (H1) and `subtitulo` (P), with every word wrapped in `.js-quote-word`.
- [ ] **MANI-04**: Scroll progress scrubbing sequentially transitions words from low opacity (`0.12`), `translateY(10px)`, and `blur(2px)` to full opacity (`1`), `translateY(0)`, and `blur(0px)`.
- [ ] **MANI-05**: Group 1 reveals across `0.05` to `0.60` scroll progress; Group 2 reveals across `0.62` to `0.95` scroll progress.

### Section 3: Multiplayer Design Canvas Stage (Phase 3)

- [ ] **CANV-01**: Full-width interactive workspace with crisp coordinate grid background (`60px x 60px` snapping grid).
- [ ] **CANV-02**: Centerpiece featuring lowercase typography `internet.` framed inside a vector selection box with 6 resize handles.
- [ ] **CANV-03**: Centerpiece and selection bounding box are draggable across the canvas via pointer events (`is-draggable`) with synced handles.
- [ ] **CANV-04**: Top floating "Modo IA" pill switch auto-toggles state every 4,000ms and responds to user click.
- [ ] **CANV-05**: 6 peripheral floating visual cards tilted between -5° and +6° (UI wireframe, laptop mockup, chat card, editorial card, live typing code card, smartphone mockup).
- [ ] **CANV-06**: Live macOS code card continuously loops typing an HTML boilerplate snippet with blinking cursor.
- [ ] **CANV-07**: Mouse-driven multi-layer parallax with linear interpolation (lerp, damping `0.08`) on all floating cards, comment bubbles, and tech badges.
- [ ] **CANV-08**: 7 autonomous multiplayer SVG cursors with colored role pills continuously wandering along smooth Lissajous/trigonometric paths.
- [ ] **CANV-09**: Snapping grid trail overlay divs lighting up cells as cursor moves across the grid.

### Section 4: Tactile Architectural Folders (Phase 4)

- [ ] **WORK-01**: Retain existing tactile 3D folder showcase for ApplyKit, PharmaERP, and EduHub.
- [ ] **WORK-02**: Retain project architectural dossier overlay panels and project inspection modals.
- [ ] **WORK-03**: Purge unmentioned legacy code: remove `#process` integrations section and `#global-physics-stage` Matter.js container.
- [ ] **WORK-04**: Clean up scripts and stylesheets corresponding to removed legacy elements (`process.js`, `physics.js`, `process.css`).

### Section 5: Cinematic Scroll-Scrubbed Stats (Phase 5)

- [ ] **STAT-01**: Section occupies `260svh` scroll track with `100svh` pinned sticky viewport.
- [ ] **STAT-02**: Architectural background image with `clip-path` expanding from `inset(18% 20%)` to `inset(0%)` and image scaling from `1.16` to `1.0` between `0.0` and `0.42` progress.
- [ ] **STAT-03**: Black scrim overlay darkens from `opacity: 0` to `0.58` between `0.28` and `0.58` progress.
- [ ] **STAT-04**: 12-column foreground Swiss grid container smoothly fades in and glides up between `0.34` and `0.60` progress.
- [ ] **STAT-05**: 4 stat items with top hairline rules scaling horizontally from `scaleX(0)` to `scaleX(1)` with staggered delay.
- [ ] **STAT-06**: Tabular numbers count up smoothly from `0` to target metrics (Lines of code written, Projects completed, Technologies mastered, Studio awards/milestones).
- [ ] **STAT-07**: Supports `prefers-reduced-motion` accessibility by immediately displaying unclipped state and static numbers.

### Section 6: Where We Build / Current Progress Timeline (Phase 6)

- [ ] **BUIL-01**: Minimalist dark theme container (`#161616` background, `#ffffff` ink, `#a3a3a3` graphite).
- [ ] **BUIL-02**: 12-column header with masked line reveals for "What I'm Building" title and description.
- [ ] **BUIL-03**: Desktop (`>= 1200px`) SVG sine-wave path (`viewBox="0 0 1000 160"`) with normalized `pathLength="1"` drawing from left to right as scrolled into view.
- [ ] **BUIL-04**: Synchronized station markers (`<circle>`) popping in at precise coordinates as the path passes their horizontal position.
- [ ] **BUIL-05**: Alternating collision-free callout cards (odd nodes above the curve, even nodes below) showing active project names, progress status, and live dossier links.
- [ ] **BUIL-06**: Signature hover underline redraw animation on project links.
- [ ] **BUIL-07**: Clean Swiss-style responsive bordered index list for tablet and mobile viewports (`< 1200px`).

### Section 7: Collaborative Workspace Contact (Phase 7)

- [ ] **CONT-01**: Two-column asymmetric grid (`1.15fr 0.85fr` on desktop, stacked on mobile).
- [ ] **CONT-02**: Left interactive workspace stage (height `480px-500px`) with dual-layer spotlight dot grid tracking CSS custom properties `--dot-lit-x` and `--dot-lit-y`.
- [ ] **CONT-03**: Floating "Aa" typography specimen badge tilted at -8° with soft shadow.
- [ ] **CONT-04**: 3 staggered visual cards (metrics panel, dual-layer offset wireframe laptop photo, desk workspace photo) popping in on scroll.
- [ ] **CONT-05**: Floating chat window card and 5 floating tool app bubbles (Google Docs, Notion, VS Code, Figma, Cursor AI) cascading in.
- [ ] **CONT-06**: Autonomous "Cliente" SVG cursor gliding along organic Lissajous paths; spotlight locks to cursor or user mouse on hover.
- [ ] **CONT-07**: Right column featuring bold headline with expanding dotted baseline leaders (`.home-contacto__titulo-puntos`), description, primary "Hablemos" CTA pill button, and social buttons.

### Section 8: Minimalist Colophon Footer (Phase 8)

- [ ] **FOOT-01**: Full-width container with subtle `1px dashed` architectural blueprint divider (`rgba(18, 18, 19, 0.1)`) on `#fbfbfb` background.
- [ ] **FOOT-02**: Single-line typographic editorial colophon in `'Plus Jakarta Sans'` (`0.875rem`).
- [ ] **FOOT-03**: Dynamic current year updated automatically via JavaScript.
- [ ] **FOOT-04**: Clean address and navigation/service links with subtle hover transitions matching the portfolio aesthetic.

## Out of Scope

| Feature | Reason |
|---------|--------|
| React/Next.js/Vue frameworks | Strict user constraint: pure HTML, CSS, and JavaScript only |
| Matter.js floating physics stage | Unmentioned legacy section; purged to streamline codebase |
| Old #process integrations section | Unmentioned legacy section; purged to eliminate bloat |
| Heavy external CSS/JS libraries | Native web standards provide superior 60fps performance without bundle weight |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01, HERO-02, HERO-03, HERO-04, HERO-05 | Phase 1 | Completed |
| MANI-01, MANI-02, MANI-03, MANI-04, MANI-05 | Phase 2 | Pending |
| CANV-01, CANV-02, CANV-03, CANV-04, CANV-05, CANV-06, CANV-07, CANV-08, CANV-09 | Phase 3 | Pending |
| WORK-01, WORK-02, WORK-03, WORK-04 | Phase 4 | Pending |
| STAT-01, STAT-02, STAT-03, STAT-04, STAT-05, STAT-06, STAT-07 | Phase 5 | Pending |
| BUIL-01, BUIL-02, BUIL-03, BUIL-04, BUIL-05, BUIL-06, BUIL-07 | Phase 6 | Pending |
| CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07 | Phase 7 | Pending |
| FOOT-01, FOOT-02, FOOT-03, FOOT-04 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0 ✓

---
*Requirements defined: 2026-11-09*
*Last updated: 2026-11-09 after project initialization*

