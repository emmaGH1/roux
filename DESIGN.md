# Design — “Service Gazette”

Print menu meets neighborhood newspaper. Ink on warm paper. Not a tech product. Not a nightclub. Not crypto.

**Memorable anchor (logo off, still recognizable):** a cream paper map of the city with two small ink dots (the people) and a wine-red **R** at the midpoint. Hairline rules. Fraunces headlines that look like a Sunday food section.

**Tone:** editorial. One secondary: utilitarian (forms, numbers).
Do not add a third (no playful, no luxury-gold, no brutalist-concrete).

## Tokens

Live in `design/tokens.css`. Import in `app/globals.css`. **Do not change the hex values.**

| Role | Value | Use |
| --- | --- | --- |
| Paper | `#F3EBE0` | page background |
| Paper-dark | `#E7DCCB` | bands, map fill |
| Ink | `#1C1612` | text |
| Ink-mute | `#6B5E52` | secondary text |
| Rule | `#1C1612` at 12–20% | hairlines |
| Wine | `#7A1F2B` | the only accent (R mark, primary button, “open”) |
| Wine-deep | `#4E1219` | button pressed |
| Closed | `#8A8178` | never on results list |

## Type

Google fonts (next/font):

- Display: **Fraunces** (opsz 144, soft, optical) — headlines, Roux wordmark
- Body: **Source Serif 4** — landing paragraphs
- UI / zips / hours: **IBM Plex Mono** — never for headlines

Scale (mobile-first):

- Wordmark: 28px / 1.1
- H1: clamp(40px, 8vw, 72px) / 1.05, tracking -0.02em
- H2: 28px
- Body: 18px / 1.5
- Meta: 12px mono, uppercase tracking 0.08em for labels only

## Layout

- Marketing: max width 1120px, left-heavy type, map on the right on desktop; map **under** headline on mobile (not a 3-column feature grid)
- App: max width 720px centered, like filling a reservation card
- Hairline 1px rules instead of cards-with-shadows
- Results are a **list**, not a card grid. Each row: name / neighborhood / km / OPEN + optional FLY
- Primary button: wine fill, paper text, 0 radius, full width on mobile, padding 16px 20px
- Inputs: paper-dark fill, 1px ink/20% border, 0 radius, 48px height

## Motion (sparse)

- 180ms ink fade on results rows (stagger 40ms, max 6)
- Map dots draw in 300ms
- `prefers-reduced-motion: reduce` → no motion
- No scroll-hijack, no parallax, no bounce, no gradient text animation

## Map

Default: `PaperMap` SVG. Brooklyn-ish blob, no Google-blue tiles.
Two dots = people. Wine **R** = midpoint. Small ticks = result restaurants.
Do not use Mapbox default streets style.

## Banned (instant fail — revert)

- Dark navy/purple/black full-bleed background
- Blue-purple gradients, aurora blobs, mesh gradients behind type
- Inter, Roboto, Arial, system-ui as the display face
- Glassmorphism, `backdrop-filter`, neon glow, inner-glow on buttons
- 3 identical feature cards with lucide icons
- Rounded-2xl everywhere, giant shadows
- Emoji as UI
- “Reimagine”, “seamless”, “next-gen”, “unlock”, “supercharge”
- Hero video of people laughing at pasta (unless we shoot it)
- Floating 3D, isometric boards, GSAP scroll theater
- shadcn default zinc theme

## Differentiation

Instead of a SaaS dashboard: a **printed service card**.
Instead of a Google map: an **ink map**.
Instead of star ratings: **open + km + FLY special**.
