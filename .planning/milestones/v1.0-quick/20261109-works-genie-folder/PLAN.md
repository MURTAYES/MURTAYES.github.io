# Quick Task: Selected Works Genie Folder Redesign

## Goal
Implement the user's tactile folder and Apple-style genie squeeze window animation system into the Selected Works section (`#works`), styled with the site's light architectural canvas theme and Section 2 fonts (`Plus Jakarta Sans`).

## Tasks
1. **CSS System (`css/works.css`)**:
   - Implement `.folder`, `.back`, `.sheets`, `.sheet`, `.flap`, `.tag` with kraft folder tones and Section 2 typography.
   - Implement `.win`, `.bar`, `.dots`, `.dot`, `.ttl`, `.doc` window dialogs with macOS window controls and Section 2 typography.
   - Implement `.genie` and `.strip` styling for horizontal slice funnel animation.
   - Responsive adjustments for tablet and mobile viewports.
   - Reduced-motion accessibility fallbacks.

2. **DOM Architecture (`index.html`)**:
   - Update `#works` container to host `.works__stage` with `.folder`, 3 interactive project sheets (ApplyKit, PharmaERP, EduHub), and `.flap`.
   - Add 3 `.win` modal dialogs containing rich technical specifications, metrics, and actions for each project.

3. **Genie Animation & Event Handler (`js/works.js`)**:
   - Implement the mathematical S-shaped funnel progress curve (`smoothstep` horizontal shift/squeeze, quadratic vertical travel, trailing top progress).
   - Dynamic strip generation (`SH = 4px`) and GPU-accelerated transforms.
   - Support click/focus on sheets, close/minimize dots, ESC key, and outside clicks.
   - Wire `.js-dossier-jump` links from Section 6 to trigger smooth scroll and window genie opening.

4. **Verification**:
   - Verify folder hover and fan out.
   - Verify genie window open and close animation.
   - Verify zero JS console errors.

