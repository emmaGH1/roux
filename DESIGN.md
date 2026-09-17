# Design — "Clean Signal"

Light, premium SaaS. White canvas, confident violet, one glowing map. Not a print gazette. Not a crypto dashboard. Not dark-mode tech-bro.

**Memorable anchor (logo off, still recognizable):** a full-width violet gradient band with a floating white app card, and a minimal light map where glowing violet dots converge on one pick with a soft pulsing ring.

**Tone:** modern product. Confident, plain-spoken. One accent only.

## Tokens

Live in `design/tokens.css`. Import in `app/globals.css`. **Do not change the hex values.**

| Role | Value | Use |
| --- | --- | --- |
| Canvas | `#FFFFFF` | page background |
| Canvas-soft | `#FAFAFA` | alternating section bands |
| Ink | `#111113` | headings, primary text |
| Gray | `#6B7280` | secondary text, captions |
| Border | `#E5E7EB` | hairlines, card borders |
| Violet | `#7C6CF6` | the only accent: primary buttons, gradient band, marker glow |
| Violet-deep | `#5B4BD4` | button hover, pressed |
| Green | `#22C55E` | success/live indicators only |

## Type

- Display + body: **Inter** (next/font) — headlines, UI, everything
- Mono: **IBM Plex Mono** — coordinate readouts, map chips only

Scale:

- Wordmark: 20px / 600
- H1: clamp(44px, 6vw, 76px) / 1.05, tracking -0.03em, weight 600
- H2: clamp(28px, 3.4vw, 40px) / 1.15, tracking -0.02em
- Body: 18px / 1.6
- Small: 14px
- Mono chip: 11–12px, uppercase, tracking 0.08em

## Layout

- Landing: centered column, max width 1120px; hero centered; sections alternate white / canvas-soft
- Pill navbar: floating, centered, white pill with soft shadow; wordmark left, links + CTA right
- Product screens (start / meetup / result): max width 480px, mobile-first card layout
- Cards: white, 16px radius, `0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08)`
- Primary button: violet fill, white text, pill (999px radius), 48px height, hover violet-deep
- Secondary button: `#F3F4F6` fill, ink text, pill, 48px height
- App result card: pick card large with violet ring; backups smaller, gray border

## Motion (restrained)

- Sections fade-up 500ms on scroll into view (once)
- Map markers: violet dot + pulsing ring (~2s, 2 loops)
- Gradient band: static; no animation
- `prefers-reduced-motion: reduce` → everything static-visible
- No parallax, no scroll-hijack, no 3D theater

## Map (Mapbox GL)

- Token from `MAPBOX_TOKEN`, never in client bundle — map style must be a **public custom style** or light standard style; token is public (`pk.`) and safe client-side by design
- Minimal light treatment: light-gray land, near-white water, no POI clutter
- Markers: violet dot, white border, soft glow, pulsing ring on the pick
- Mono LAT/LNG chip overlay top-left of map
- If token missing: render a neutral static panel, never a crash

## Banned (instant fail — revert)

- Dark navy/black full-page hero
- Wine/paper gazette remnant (Fraunces, `#7A1F2B`, `#F3EBE0`)
- Gradients behind body text
- Glassmorphism, `backdrop-filter` panels
- Emoji as UI
- "Reimagine", "seamless", "next-gen", "unlock", "supercharge"
- Star ratings, reviews
- More than one accent color
- Motion libraries (framer-motion, GSAP)

## Differentiation

Instead of a group-chat argument: **one decisive pick**.
Instead of a generic map: **glowing convergence** on the fair middle.
Instead of ratings: **open + closest + a live perk**.
