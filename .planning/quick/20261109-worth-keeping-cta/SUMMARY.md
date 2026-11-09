# Quick Task Summary: "Worth Keeping" Architectural CTA

## Overview
Replaced Section 7 (`#contact`) with the "Worth Keeping" architectural CTA component built strictly with pure HTML, CSS, and vanilla JS (zero CDNs).

## Implementation Details
1. **Layer 1 — Architectural Hairline Frame**:
   - Full-viewport (100svh) container with CSS Grid layout.
   - 1px monochrome structural borders, subtle vertical architectural guide lines (`::before` / `::after`), top metadata strip (`07 / Finale · Samnun Murtayes®`), and bottom footnote bar (`Booking two new partners for the autumn cycle. · Autumn / Winter — 2026`).
2. **Layer 2 — Giant Monochrome Background Marquee**:
   - Seamless animated marquee (`Worth keeping`) with circular separators inside two identical flex groups animating `translate3d(-50%, 0, 0)`.
3. **Layer 3 — Centered Editorial Stack**:
   - "Last word" badge with pulsing dot.
   - High-contrast balance display headline: `Let's make something worth keeping.`
   - 38ch note: `No decks, no detours: one room, your problem, and a studio that ships.`
4. **Layer 4 — Magnetic "Seal" Button**:
   - Rotating SVG `<textPath>` ring (`START THE CONVERSATION • WORTH KEEPING •`).
   - Inner core with arrow icon.
   - Vanilla JS `pointermove` listener calculating magnetic pull towards the cursor.
   - Click opens the contact drawer (`data-open-contact`).
5. **Theme & Animation Controls**:
   - Light/Dark monochrome theme toggle.
   - Replay button for staggered entrance animation (`.is-ready`).
