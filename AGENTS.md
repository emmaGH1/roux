# Roux — agent contract

You are implementing **Roux**, a Blackbird/Flynet app for Runtime Agent Week.
You are not a designer. You are not a product manager. Spec files are law.

Before any edit, read: `SCOPE.md`, `DESIGN.md`, `COPY.md`, `ROUTES.md`.
If a request conflicts with those files, **obey the files** and say so in one line.

## Product (one sentence)

One person starts a meetup and shares the link; everyone else taps once to drop their location. Roux averages those points, ranks every Blackbird room by straight-line distance, and returns **one pick plus two backups** — with a current special as the nudge.

## Stack (do not substitute)

- Next.js 15 App Router + TypeScript + Tailwind v4
- `app/` directory only (no `pages/`)
- Mapbox GL via `components/MapView.tsx` (dynamically imported, never blocks first paint)
- Flynet via `lib/discovery.ts` only — server-side, key never reaches the browser
- Deploy target: Vercel

## Running locally

`next dev` and `next start` must never share a build directory — `next.config.ts`
sends dev to `.next-dev` and production to `.next`. If they collide, the running
server serves HTML pointing at chunks that no longer exist and every page dies
with the generic "Application error: a client-side exception has occurred".
Never delete or rebuild one dist dir while the other server is running.

## Files you must not rewrite

- `design/tokens.css` — import globally. Values were re-based for the v2 design; change them only together with a `DESIGN.md` edit, never ad hoc
- `COPY.md` — render these strings; do not invent marketing copy
- `fixtures/*` — shape stays; you may add rows, not rename fields
- `lib/result.ts` — use as-is for the fair point + distance ranking
- `components/ui.tsx` — the shared primitives (`Bezel`, `Eyebrow`, `Pill`, `Check`). Reuse them; do not hand-roll a second button or card style

## Hallucination rules

- If Flynet keys are missing, use fixtures. Set `data-source="fixture"` on the page.
- Never invent star ratings, reviews, menus, wait times, or user identities on check-ins.
- Never call localhost a submission URL.
- Never claim a live Flynet call when `USE_FIXTURES=true`.
- If an API field is unknown, omit it. Do not fake it.

## UI rules

- Follow `DESIGN.md`. The banned list is a hard fail (it now includes Inter — the type system is Plus Jakarta Sans + Instrument Serif accent + IBM Plex Mono).
- Every premium surface is a double bezel (`Bezel`), never a card floating flat on the canvas.
- The map must never render as an empty rectangle: it degrades WebGL → static image → drawn diagram, each labeled honestly.
- Marketing chrome (`app/(marketing)/`) and product chrome (`app/(product)/`) are **different layouts**.
- Every route in `ROUTES.md` is its own page file. No “one long page.”
- Add `data-demo`, `data-beat`, and stable `id`s listed in `ROUTES.md` for HyperFrames.

## Definition of done for each prompt

1. Typecheck passes: `npx tsc --noEmit`
2. The route in that prompt exists and matches COPY.md
3. You list files created/changed
4. You stop. You do not start the next prompt.

## If you are stuck

Write `BLOCKED.md` with: what you tried, the error, the file. Do not improvise a new feature.
