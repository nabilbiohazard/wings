# Wings design direction

## Sources and scope

Project-specific guidance prepared from UI-Skills-Pack.zip: UI/UX Pro Max,
Taste redesign-existing-projects, and Emil Kowalski design engineering.
Local source copies are under `.tools/ui-skills/skills/`.
These references inform design decisions; user requests and AGENTS.md take precedence.
Android, Material native implementation, and SwiftUI instructions do not apply to this Next.js storefront.
The frontend-design skill itself was not included in the archive.

The Python search tool could not run because python, python3, and py are unavailable.
The direction below is an editorial synthesis of the skill guidance and existing
Wings interface, not a generated or verified database recommendation.

## Visual direction

Wings is a Persian accessories boutique with a personal charm design experience.
Use a spacious editorial layout, product photography, warm surfaces, restrained
rose accents, and dark plum text. Preserve the brand's existing identity.
Use Vazirmatn for Persian interface copy, Amiri selectively for Persian display
headings, and Cormorant Garamond for English editorial headlines.
Keep Persian text RTL and English phrases explicitly LTR. Avoid letter-spacing
on connected Persian text. Balance headings and keep body paragraphs readable.

## Interaction and layout

- Make the custom charm builder the homepage's primary action; collection browsing is secondary.
- Use consistent semantic color and spacing tokens as components are updated.
- Prefer whitespace and photographic hierarchy over repeated decorative cards.
- Keep mobile layouts free of horizontal overflow; allow content to grow vertically.
- Use at least 44 by 44 CSS pixels for touch controls and visible keyboard focus.
- Check normal text contrast against a 4.5:1 target and meaningful UI boundaries against 3:1.
- Give icon-only controls accessible names. Keep decorative icons hidden from assistive technology.
- Show loading, empty, success, and actionable error states in shopping flows.

## Motion

Use brief, purposeful feedback, generally 150–250ms for occasional interactions.
Prefer explicit transform and opacity transitions over transition-all.
Gate hover movement behind hover-capable pointer queries. Respect reduced-motion
preferences, including automatically rotating text and decorative video.
Avoid perpetual spinning borders, pulsing glows, and scroll effects that compete
with products or delay navigation. Preserve native scrolling.

## Implementation and verification

Improve existing components in focused changes using Next.js, Tailwind 4, and
installed libraries. Read the relevant installed Next.js guide before code edits.
Preserve existing shopping and custom design behavior and unrelated working changes.
Verify changed screens on mobile and desktop, keyboard navigation, and reduced
motion; run checks appropriate to each implementation change.

This document records the design baseline. It does not claim a completed visual
redesign or a browser accessibility audit.
