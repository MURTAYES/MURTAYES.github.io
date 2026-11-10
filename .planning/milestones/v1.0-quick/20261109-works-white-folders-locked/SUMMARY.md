---
status: complete
date: 2026-11-09
task: works-white-folders-locked
description: Selected Works white folders, logos, hover animation, and Edu52 locked docket
---

# Quick Task Summary: Selected Works Modernization & White Folder Design

## Overview
Replaced images with authentic logos, removed `FIG. 01/02/03` captions, converted folder styling from yellow to white matching Section 3, enhanced tactile hover fanning animations, and designated Edu52 as a locked archive with an NDA-protected detail docket.

## Key Changes
1. **Images & Logos**:
   - ApplyKit: replaced with `assets/images/icon-128.png`.
   - PharmaERP: replaced with `assets/images/pharmaerp-logo.png`.
   - Edu52: replaced with `assets/images/edu52.png`.
   - Framed each logo in a clean white stage card with subtle dot-matrix background and hover elevation.
2. **Removed Figure Captions**:
   - Removed `FIG. 01`, `FIG. 02`, and `FIG. 03` captions completely across all three articles.
3. **Folder Styling (White Minimalist Canvas)**:
   - Converted folder gradients to pure white card styling matching Section 3 design.
   - Folders feature subtle borders (`rgba(0, 0, 0, 0.08)`), soft elevation shadows, and clean tags.
4. **Hover Animation**:
   - Enhanced tactile fanning on `.folder:hover`:
     - Sheet 1: `-52px`, `-65px`, `-12deg`
     - Sheet 2: `0px`, `-82px`, `0deg`
     - Sheet 3: `52px`, `-65px`, `12deg`
     - Folder elevates `-8px` on hover with cubic-bezier smoothing.
5. **Detail Pages / Modal Windows on Click**:
   - ApplyKit & PharmaERP: Feature centered logo showcase, tech stack chips, and architectural highlights.
   - Edu52: Locked folder state with padlock badge (`03 · Edu52 · Locked`), and locked security docket page with NDA protection banner and confidential archive stamp.
6. **Markup Fix**:
   - Removed extra closing `</div>` in Section 3.
