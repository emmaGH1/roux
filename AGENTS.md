# Roux — agent contract

You are implementing **Roux**, a Blackbird/Flynet app for Runtime Agent Week.
You are not a designer. You are not a product manager. Spec files are law.

Before any edit, read: `SCOPE.md`, `DESIGN.md`, `COPY.md`, `ROUTES.md`.
If a request conflicts with those files, **obey the files** and say so in one line.

## Product (one sentence)

Two people enter where they are. Roux finds Blackbird restaurants near the geographic middle that are **open now**, ranked by distance, then by whether a $FLY special exists.

## Stack (do not substitute)

- Next.js 15 App Router + TypeScript + Tailwind v4
- `app/` directory only (no `pages/`)
- MapLibre GL **or** the SVG paper map in `components/PaperMap.tsx` (prefer PaperMap for the demo; MapLibre is optional later)
- Flynet via `lib/flynet/` only
- Deploy target: Vercel

## Files you must not rewrite

- `design/tokens.css` — import globally, do not change values
- `COPY.md` — render these strings; do not invent marketing copy
- `fixtures/*` — shape stays; you may add rows, not rename fields
- `lib/geo.ts` — use as-is for midpoint + distance

## Hallucination rules

- If Flynet keys are missing, use fixtures. Set `data-source="fixture"` on the page.
- Never invent star ratings, reviews, menus, wait times, or user identities on check-ins.
- Never call localhost a submission URL.
- Never claim a live Flynet call when `USE_FIXTURES=true`.
- If an API field is unknown, omit it. Do not fake it.

## UI rules

- Follow `DESIGN.md`. The banned list is a hard fail.
- Marketing chrome (`app/(marketing)/`) and product chrome (`app/(app)/`) are **different layouts**.
- Every route in `ROUTES.md` is its own page file. No “one long page.”
- Add `data-demo`, `data-beat`, and stable `id`s listed in `ROUTES.md` for HyperFrames.

## Definition of done for each prompt

1. Typecheck passes: `npx tsc --noEmit`
2. The route in that prompt exists and matches COPY.md
3. You list files created/changed
4. You stop. You do not start the next prompt.

## If you are stuck

Write `BLOCKED.md` with: what you tried, the error, the file. Do not improvise a new feature.
