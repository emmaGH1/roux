# Antigravity prompts — paste in order

Rules for you (human): one prompt per chat turn. Wait until it stops. If it invents a page or a color, say “revert to DESIGN.md” and re-paste the same prompt.

Each prompt already tells the agent to read the law files.

---

## Prompt 01 — scaffold only

```
You are building Roux. This repo already has specs and lib code. You will not invent product or design.

Read first, in this order, and obey:
- AGENTS.md
- SCOPE.md
- DESIGN.md
- COPY.md
- ROUTES.md
- START_HERE.md

Task: Scaffold Next.js 15 App Router + TypeScript + Tailwind v4 in THIS repo (do not create a nested extra project). Keep existing folders: lib/, fixtures/, design/, components/, harness/, demo/.

Do:
1. Create package.json scripts: "dev", "build", "start", "typecheck": "tsc --noEmit"
2. app/globals.css imports ../design/tokens.css then sets html,body { background: var(--paper); color: var(--ink); }
3. Load Fraunces, Source Serif 4, IBM Plex Mono via next/font in app/layout.tsx and assign them to --font-display, --font-body, --font-mono
4. tsconfig: resolveJsonModule true, paths @/* → .
5. .gitignore: node_modules, .next, .env.local
6. Copy .env.example to nothing — do not commit secrets
7. Create empty route files that only render the route path as text:
   app/(marketing)/page.tsx → /
   app/(marketing)/layout.tsx
   app/(app)/layout.tsx
   app/(app)/meet/page.tsx
   app/(app)/meet/results/page.tsx
   app/(app)/spot/[id]/page.tsx
   app/demo/page.tsx
8. Enable JSON imports for fixtures

Do not:
- Install shadcn, three, gsap, framer-motion, mapbox
- Write landing copy
- Change design/tokens.css
- Combine routes onto one page

Stop when `npx tsc --noEmit` is clean. List files changed. Do not start Prompt 02.
```

---

## Prompt 02 — landing `/` only

```
Read AGENTS.md, DESIGN.md, COPY.md, ROUTES.md.

Implement ONLY the marketing landing: app/(marketing)/page.tsx and its layout.

Requirements:
- Background var(--paper). No dark theme. No gradients.
- Wordmark “Roux” top left, Fraunces, wine is used only for the CTA button
- COPY.md landing strings verbatim (H1 line breaks preserved)
- CTA button id="cta-meet" links to /meet, wine fill, 0 radius, paper-colored text
- How-it-works is THREE NUMBERED LINES in a vertical stack, not a 3-column icon card grid
- First screenful complete at 1280×720: headline + lede + CTA visible without scroll
- Desktop: type left, PaperMap on the right with two sample people (11211, 11215) and a Roux R. Import components/PaperMap.tsx — do not rewrite it
- Mobile: map below type
- Footer: only “Roux” and “Runtime Agent Week 2026”
- data-demo="roux" on the marketing layout

Banned: Inter, glass, blobs, feature cards with lucide, “Reimagine”, navy background.

Stop. Show a screenshot description of the page. Do not build /meet.
```

---

## Prompt 03 — `/meet` form

```
Read AGENTS.md, COPY.md, ROUTES.md, DESIGN.md. Use lib/zips.ts PRESETS.

Implement app/(app)/meet/page.tsx and app layout only.

- Title and labels from COPY.md
- Two inputs id="place-a" and id="place-b"
- Preset chips from COPY.md; clicking a chip fills the next empty input
- Submit id="submit-roux" → GET /meet/results?a={zip}&b={zip} (resolve to 5-digit ZIP via lib/zips.ts lookupZip). If lookup fails, show COPY.md error strings
- PaperMap on the same page: when both ZIPs resolve, show two person marks + roux midpoint using lib/geo.ts midpoint
- Pre-fill from searchParams a and b so /meet?a=11211&b=11215 works for the video
- App layout: wordmark, honesty banner text from COPY.md based on process.env.USE_FIXTURES
- Max width 720px. Hairline rules. No card shadows.

Do not implement results ranking in this prompt. Stop after the form works.
```

---

## Prompt 04 — results

```
Read AGENTS.md, COPY.md, ROUTES.md. Use lib/flynet/adapter.ts searchRoux and lib/zips.ts.

Implement app/(app)/meet/results/page.tsx as a server component.

- Parse a,b query. Lookup ZIPs. If missing, redirect to /meet
- Call searchRoux. Render COPY.md kicker, title, meta line with real numbers
- ol#results-list: each row is a link to /spot/[id]
  name · neighborhood · {km} km · OPEN · optional FLY (only if hasFlySpecial)
  data-open="true" data-fly="true|false"
- Sort is already in searchRoux — do not re-sort in the UI
- Empty state from COPY.md
- Back link “Change places” to /meet?a=&b=
- Show PaperMap with people, roux, and spot marks
- data-source={source} on the wrapper
- First six rows must fit 1280×720 with the map; list may continue below

No star ratings. No map tiles. Stop.
```

---

## Prompt 05 — spot page

```
Read COPY.md and ROUTES.md.

Implement app/(app)/spot/[id]/page.tsx.

- Load fixtureSpot or live list; 404 if missing
- Render kicker, title, cuisine, price as $ repeated, today hours via lib/openNow.ts todayHours
- FLY special block only if specials.length > 0 — title “FLY”, label, description
- Button id="pick-table" “This is the table” — client: set data-pick="true" on wrapper, change button text to “Picked”. No payment.
- Back “All open rooms” to history.back or /meet/results with preserved query if you stored it in searchParams (accept ?a=&b=)

Stop.
```

---

## Prompt 06 — demo puppet

```
Read ROUTES.md demo table.

Implement app/demo/page.tsx:
- Read beat (default 1)
- redirect() to:
  1 → /
  2 → /meet
  3 → /meet?a=11211&b=11215
  4 → /meet?a=11211&b=11215 (same; map already shows R)
  5 → /meet/results?a=11211&b=11215
  6 → /spot/flybar?a=11211&b=11215
- Also set a cookie or header is unnecessary. Redirect is enough.

Add data-beat={beat} on app layouts by reading searchParams.beat if present (results and meet already have a,b).

Stop. Print the six URLs to visit by hand.
```

---

## Prompt 07 — freeze + honesty

```
Read SCOPE.md and HACKATHON.md.

Do:
1. README.md: what Roux is, how to run, env vars, honesty table (fixture vs live Flynet fields)
2. Do not add features
3. Run typecheck and production build
4. Fix build errors only
5. Confirm banned UI is absent (no shadcn, no dark hero, no three icon cards)
6. Write a 6-line TEST.md: the clicks for a human QA of / /meet /meet/results /spot/flybar

Stop. Roux is frozen for video.
```

---

## Prompt 08 — only when Flynet keys arrive

```
Keys are in .env.local. Set USE_FIXTURES=false.

Read lib/flynet/live.ts.

Task: run the app, hit /meet/results?a=11211&b=11215, confirm data-source="flynet" and at least one row OR a valid empty state (not a crash).

If Flynet 401/403: revert USE_FIXTURES=true, write BLOCKED.md with the status code, do not mock a fake live response.

If locations lack coordinates: skip them (already in live.ts).

Do not add OAuth. Stop.
```

---

## Kill-slop prompt (use anytime it goes off-rails)

```
Revert the last UI change. Open DESIGN.md banned list. Remove anything that matches. Restore tokens from design/tokens.css. Do not replace Fraunces. Do not add a gradient.
```
