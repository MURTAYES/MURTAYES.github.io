---
status: complete
date: 2026-11-09
task: works-genie-folder
description: Replace Selected Works with tactile Manila architectural folder and Apple Mac genie window animation
---

# Quick Task Summary: Selected Works Genie Folder Redesign

## Completed Implementation
- **Tactile Manila Folder System (`css/works.css`, `index.html`)**:
  - Engineered architectural manila kraft folder (`.folder`, `.back`, `.sheets`, `.flap`, `.tag`) with pure CSS gradients, box-shadows, and tab morphology.
  - Applied Section 2 typography system (`Plus Jakarta Sans` / `Inter`) across all headings, badges, labels, and copy.
  - Aligned colors with the portfolio's light architectural canvas (`#fbfbfa` / `#f7f6f2`) and distinct project accent tokens (`#eb381c` for ApplyKit, `#10b981` for PharmaERP, `#2f5fd0` for EduHub).
- **Apple Mac Genie Squeeze Window Animation (`js/works.js`)**:
  - Implemented the mathematical S-shaped funnel progress curve (`smoothstep` horizontal squeeze, quadratic vertical travel, and trailing top progression).
  - Dynamic GPU strip slicing (`SH = 4px`, `OV = 1px`) creating smooth window expansion from behind the folder flap.
  - Full keyboard accessibility (`Escape` key, `:focus-visible` fanning), click-outside closing, and traffic light controls (`.dot.r`, `.dot.y`).
  - Integrated `.js-dossier-jump` links from Section 6 to smooth-scroll and trigger genie window opening.
