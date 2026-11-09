---
status: complete
date: 2026-11-09
task: asymmetric-works-folders
description: Asymmetrical staggered architectural layout for Selected Works with 3 sharp-cornered folders and genie window inspection
---

# Quick Task Summary: Asymmetric Works Folders

## Completed Work
1. **Removed Eyebrow and Subtitle**: Stripped `[§ 04 · SELECTED ARCHITECTURAL WORKS]` and lead paragraph from the section header. Retained clean, bold `Selected Works` title in Section 2 typography.
2. **Section 2 Dotted Matrix**: Applied exact Section 2 radial dot matrix (`radial-gradient(rgba(6, 6, 6, 0.11) 1.5px, transparent 1.5px)` with 28px grid) to `#works.works`.
3. **3 Asymmetrical Staggered Project Folders**:
   - Replaced single folder with 3 distinct architectural Manila kraft folders, one per project (ApplyKit, PharmaERP, EduHub).
   - Created an organic, asymmetrical editorial cadence (Nivara Copenhagen aesthetic) pairing each folder with an architectural figure, caption, and prose block.
4. **Crisp Sharp Corners**:
   - Enforced `border-radius: 0` across all folder backs, flaps, sheets, tags, tabs, and skeleton lines.
5. **Sharp-Cornered Inspection Windows with In-Page Imagery**:
   - Configured all 3 `.win` inspection modals with sharp right angles, prominent hero image frames (`assets/images/appykit.jpg`, `assets/images/pharma.jpg`, `assets/images/edu52-banner.webp`), architectural captions, technical highlights, and action buttons.
6. **Multi-Folder Genie Animation**:
   - Updated `js/works.js` to animate each window directly from and back into its respective folder flap with GPU-accelerated horizontal strips and smoothstep funnel physics.
