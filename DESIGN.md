# Design — "Soft Signal"

Light premium editorial. White canvas, one violet accent, huge grotesk headlines with a
serif-italic accent word, hairline structure, machined nested cards, softly diffused depth,
macro whitespace. Not a dark tech dashboard. Not a print gazette. Not a crypto landing.

**Vibe / texture archetype:** Soft Structuralism (silver-white, massive Grotesk, floating
components, unbelievably soft ambient shadows) with a whisper of editorial grain.
**Layout archetype:** Editorial Split hero, then Asymmetrical Bento for how-it-works.

**Memorable anchor (logo off, still recognizable):** a full-bleed violet gradient band with a
floating white result card, a serif-italic word inside an otherwise grotesk headline, and a
minimal light map where dark person dots and a glowing violet pick converge on one fair point.

## Tokens

Live in `design/tokens.css`. Import in `app/globals.css`. Values were re-based for this
direction — do not drift them by hand.

| Role | Value | Use |
| --- | --- | --- |
| Canvas | `#FFFFFF` | page background |
| Canvas-soft | `#F7F7FA` | alternating bands, inset panels |
| Ink | `#0C0C10` | headings, primary text |
| Ink-soft | `#3B3B45` | secondary paragraphs |
| Gray | `#6E6E7A` | captions, meta |
| Gray-light | `#9A9AA6` | micro labels |
| Hairline | `rgba(12,12,16,.07)` | every border in the design |
| Violet | `#7C6CF6` | the only accent: CTAs, pick, gradient band |
| Violet-deep | `#5B4BD4` | button hover |
| Violet-soft | `#F0EDFE` | perk chip, method chip |
| Green | `#22C55E` | live / open indicators only |

Depth: `--shadow-xs` … `--shadow-lg` are stacked, wide, low-opacity. Never a dark drop shadow,
never `shadow-md`'s default harshness. `--shadow-violet` is the glow under primary CTAs.

## Type

- Display + body + UI: **Plus Jakarta Sans** (`--font-sans`)
- Editorial accent: **Instrument Serif, italic** (`--font-serif`) — for one word per screen, max
- Data + chips: **IBM Plex Mono** (`--font-mono`)

Scale:

- Wordmark: 19–20px / 600, tracking -0.03em
- H1 hero: clamp(46px, 7vw, 92px) / 0.98, tracking -0.038em, weight 600
- H2: clamp(30px, 3.6vw, 46px) / 1.06, tracking -0.03em
- Card title: 20–30px / 600
- Body: 16–18px / 1.65
- Small: 13–15px
- Eyebrow / mono chip: 10–11px, uppercase, tracking 0.14–0.2em

## Layout

- Page max width **1200px** (`--page-max`), gutter 24px
- Landing sections: `py-28`; hero `pt-16`
- Product screens (start / meetup / result / fallback): single column, max **520px**
- Every premium surface is a **double bezel** (`components/ui.tsx` → `Bezel`): a 7px outer tray
  with a hairline border and a gradient fill, holding a core with a smaller concentric radius
- Cards lift 3px on hover (`.lift`), never scale past 1.0
- Mobile: every asymmetric grid collapses to one column below `md`; nothing overlaps on touch

## Buttons

- Fully rounded pills, generous padding
- Any trailing arrow lives in its own circle nested inside the button (`components/ui.tsx` → `Pill`)
- Tones: `violet` (primary), `ink` (secondary dark), `ghost` (light on white), `white` (on dark/gradient)
- Press: `.btn-life` scales to 0.965

## Landing sections (in order)

1. Floating pill navbar — dark, centered, sticky at `top-4` (never glued edge-to-edge)
2. Hero — eyebrow, H1 with the serif-italic accent, subtext, two pills, microcopy, then the
   **live app frame**: a bezel holding the real map with a live-count pill and a floating pick card
3. Ticker — hairline-ruled mono facts, slow marquee
4. Gradient band + floating result card (`data-money-shot`) — the money shot
5. The fair middle — map in a bezel beside copy, checklist, and three counted metrics
6. How it works — asymmetrical bento (5 / 7 / 12 columns)
7. Built on Flynet — PNL copy beside the four API route chips
8. Honesty — "What Roux won't do", three hairline cards
9. Footer (`components/SiteFooter.tsx`) — closing CTA panel, **partners & sponsors**, link
   columns, bottom bar

## Footer

- Closing CTA: violet gradient bezel, grain, glow orb, white H2, primary pill + ghost link
- Partners & sponsors row: name (17px semibold) + mono note, each linking out
- Three link columns: Product / Under the hood / Honesty
- Bottom bar: wordmark + one-liner, then `Built on Flynet`, `Runtime Agent Week 2026`, `© 2026`

## Motion (CSS only)

- Sections fade-up 700ms on scroll into view (once)
- Floating glow orbs drift on an 11s loop; buttons interpolate with `--ease-out` / `--ease-soft`
- Map markers: dark person dots, violet pick lands last with a bounce + pulsing ring; the result
  screen runs the deciding sequence (status ticks, radar sweep, pick drop, card slide-up)
- `prefers-reduced-motion: reduce` → everything static-visible, no marquee, no radar
- No motion libraries. No scroll-hijack. No 3D theater.

## Map (Mapbox GL) — three tiers

1. **WebGL map** — light treatment, no POI clutter, dark/violet markers, mono LAT/LNG chip
2. **Static Images API** (`mapbox/light-v11`) — a real map image when WebGL is unavailable;
   labeled `Static view · WebGL off`
3. **Drawn diagram** — real coordinates plotted as SVG when no tiles are reachable;
   labeled `Static view · tiles unavailable`

Token comes from `NEXT_PUBLIC_MAPBOX_TOKEN` (public `pk.` by design). A missing token, a slow
style load, or a thrown error must always downgrade a tier — never render an empty rectangle,
never crash the page.

## Banned (instant fail — revert)

- Inter, Roboto, Arial, Open Sans, Helvetica
- Generic 1px gray borders and harsh dark drop shadows
- Full-bleed sticky navbar glued to the viewport top
- Glassmorphism, `backdrop-filter` panels
- Dark navy/black full-page hero; wine/paper gazette remnant
- Emoji as UI; thick-stroked icon sets
- Gradients behind body text; more than one accent color
- "Reimagine", "seamless", "next-gen", "unlock", "supercharge"
- Star ratings, reviews, fake testimonials
- Motion libraries (framer-motion, GSAP)

## Differentiation

Instead of a group-chat argument: **one decisive pick.**
Instead of a generic map: **glowing convergence** on the fair middle.
Instead of ratings: **open + closest + a live perk.**
Instead of a marketing-only page: **the real ranking engine** rendering the sample pick.
