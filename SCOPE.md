# Scope

## In (ship this)

1. Marketing landing at `/` — light SaaS system (DESIGN.md), CTA to `/start`
2. Meetup flow (build-revise PRD): `/start` → `/m/[code]` share-location screen → `/m/[code]/result` pick + backups + directions
3. In-memory code-keyed meetup store (ADR 0003); one-time geolocation snapshots (ADR 0004)
4. Discovery proxy API routes holding the Flynet key server-side (ADR 0001); cached dataset (ADR 0004)
5. Special as conversion nudge on the pick only; silent omission on failure (ADR 0005)
6. Two-ZIP fallback flow at `/meet` + `/meet/results` for the recorded demo (no phones on camera)
7. Mapbox GL light map on landing + result; static fallback when token missing
8. Honesty banner when data is fixtures
9. Demo puppet at `/demo?beat=1..5`

## Out (ban — deleting if the agent adds them)

- Chat / agent prompt box
- User accounts, OAuth, Blackbird login (v2 only)
- Stripe, card pay, $FLY Payment Intents (v1 display of specials only)
- Menus, ordering, QR POS
- Star ratings, Yelp, Google reviews
- Reverse reservations / texting restaurants
- Dating, matchmaking, social feed
- Tokenized stocks, Dynamic wallets, Flash orders
- Dark “AI SaaS” dashboard
- shadcn/ui default kit, Aceternity, Magic UI, DaisyUI
- Three.js, R3F, isometric CSS, glassmorphism, gradient orbs
- A single-page site that stacks landing + form + results
- Navbar with 7 links
- Footer with fake company columns
- “Powered by AI” badge

## v1 ranking (exact, result endpoint)

```
prefer is_club: false
then straight-line km from the fair point ascending
pick = nearest; backups = next two
```

## Completeness bar (hackathon)

- Two people can finish the job without instructions
- Demo beats 1–6 work with no network (`USE_FIXTURES=true`)
- README honesty table: fixture vs live
- Recorded demo ≤ 90s using `/demo?beat=`
- Public HTTPS deploy (not localhost)

## Time box

If a prompt would take more than 45 minutes of agent looping, stop and ship the fixture path.
