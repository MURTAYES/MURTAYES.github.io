---
phase: 01-section-1-editorial-photo-silhouette-hero-willem-preloader
plan: 01
status: completed
date: 2026-11-09
requirements_covered:
  - HERO-01
  - HERO-02
  - HERO-03
  - HERO-04
  - HERO-05
files_modified:
  - index.html
  - css/header.css
  - js/preloader.js
---

# Plan 01-01 Summary: Editorial Photo Silhouette Hero & Willem Preloader

## Implementation Summary

Section 1 of the portfolio has been completely transformed to match the reference photo-silhouette design while preserving the GPU-accelerated Willem kinetic preloader entrance:

1. **Header Navigation Restructuring (`index.html`)**:
   - Anchored `<a class="header__logo">` to the top-left, housing the brand logo where the preloader flight lands (replacing "Pamidor Studio").
   - Preserved centered editorial navigation links (`About Me`, `Contact`, `Works`).
   - Positioned the minimalist two-bar menu trigger on the top-right.

2. **Photo Silhouette Hero (`index.html` & `css/header.css`)**:
   - Replaced legacy Wilcock/halftone canvas with `.hero--silhouette`.
   - Connected `assets/images/hero-bg.jpg` as the background with responsive positioning (`right 12% center / cover`) and dynamic gradient masking for contrast.
   - Implemented ultra-bold display typography for "Samnun Murtayes" with tight letter-spacing (`-0.04em`) and fluid clamp sizing.
   - Added two-line editorial subtitle: *"Brands, products & the art in between. / I take the fun seriously."*
   - Engineered two rows of architectural skill pill tags (*Brand Design*, *Product Design*, *UX | UI*, *Art Direction*, *Motion & 3D*) with semi-translucent backdrop blur and tactile hover lift.

3. **Kinetic Preloader & Flight Choreography (`js/preloader.js`)**:
   - Refined `triggerBlossomAndFlight()` to calculate coordinates targeting the top-left navigation logo.
   - Orchestrated GPU FLIP animation that glides the brand logo seamlessly from the loader center cutout into the top-left navbar.
   - Staggered entry animations for the title lines, subtitle, and specialization tags once the blossom completes.
   - Clean scroll lock and release.

## Verification Evidence

- Automated HTML verification passed: `.hero--silhouette`, "Samnun", "Murtayes", "Brand Design" all present.
- Automated CSS verification passed: `.hero--silhouette`, `hero-bg.jpg`, `.hero-silhouette__tag` properly defined.
- Automated JS verification passed: `triggerBlossomAndFlight`, `.hero--silhouette` element targeting confirmed.

