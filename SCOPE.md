# Scope

## In (ship this)

1. Marketing landing at `/` — v2 system (DESIGN.md): white canvas, violet single accent,
   double-bezel cards, live app frame, footer CTA + sponsor links. CTA to `/start`
2. Meetup flow (build-revise PRD): `/start` → `/m/[code]` share-location screen →
   `/m/[code]/result` deciding sequence → pick + backups + directions
3. In-memory code-keyed meetup store (ADR 0003); one-time geolocation snapshots (ADR 0004)
4. Discovery proxy API routes holding the Flynet key server-side (ADR 0001); cached dataset
   (ADR 0004); mapper against the real `/locations` + `/restaurants` payloads
5. Special as conversion nudge on the pick only; silent omission on failure (ADR 0005)
6. Two-ZIP fallback flow at `/meet` + `/meet/results` for the recorded demo (kept, not
   linked from the landing; still reachable via `/demo?beat=5`)
7. Map with three tiers: WebGL cinematic → Mapbox static image → drawn SVG diagram
   (`components/MapView.tsx`); honest label on every tier
8. Honesty: `/api/status` + footer badge + `data-source` derived from the dataset actually
   loaded — never from env vars at build time
9. Demo puppet at `/demo?beat=1..5`, plus `&people=N` multi-person seeding
10. `npm run check:flynet` — read-only live-data diagnostic

## Out (ban — deleting if the agent adds them)

- Chat / agent prompt box
- User accounts, OAuth, Blackbird login (v2 only)
- Stripe, card pay, $FLY Payment Intents (v1 display of specials only)
- Menus, ordering, QR POS
- Star ratings, Yelp, Google reviews
- Reverse reservations / texting restaurants
- Dating, matchmaking, social feed
- Tokenized stocks, Dynamic wallets, Flash orders
- Dark "AI SaaS" dashboard; glassmorphism; gradient orbs
- shadcn/ui default kit, Aceternity, Magic UI, DaisyUI
- Three.js, R3F, isometric CSS
- A single-page site that stacks landing + form + results
- Navbar with 7 links; footer with fake company columns
- "Powered by AI" badge
- Resurrected v1 artifacts: `PaperMap.tsx`, `lib/geo.ts`, `lib/flynet/*`, Fraunces,
  paper `#F3EBE0` / wine `#7A1F2B` palette

## v1 ranking (exact, result endpoint)

```
prefer is_club: false
then straight-line km from the fair point ascending
pick = nearest; backups = next two
```

## Completeness bar (hackathon)

- Two people can finish the job without instructions
- Demo beats 1–5 work with no network (`USE_FIXTURES=true`)
- README honesty table: fixture vs live
- Recorded demo ≤ 90s using `/demo?beat=`
- Public HTTPS deploy (not localhost)

## Time box

If a prompt would take more than 45 minutes of agent looping, stop and ship the fixture path.
