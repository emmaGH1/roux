# If the agent ships slop

Paste this, nothing else:

```
Stop. Diff the last commit against DESIGN.md banned list.

Delete: Inter, dark AI-SaaS backgrounds, glassmorphism, gradient orbs, harsh shadows
(shadow-md or darker with real alpha), generic 1px gray borders on premium surfaces,
edge-to-edge sticky navbars, Bootstrap-style equal 3-column grids.

Restore: design/tokens.css (v2), Plus Jakarta Sans + Instrument Serif accents + IBM Plex
Mono via next/font, white canvas #ffffff, violet #7c6cf6, double-bezel cards
(components/ui.tsx primitives), nested-arrow pill CTAs.

Do not add new components to "make it nicer." Do not resurrect PaperMap.tsx, Fraunces,
or lib/geo.ts — they were removed deliberately.
```
