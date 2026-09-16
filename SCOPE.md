# Scope

## In (ship this)

1. Marketing landing at `/` (own layout, own copy from COPY.md)
2. Meet form at `/meet` — two locations (zip or neighborhood preset chips)
3. Results at `/meet/results` — open Blackbird spots near midpoint
4. Spot at `/spot/[id]` — one restaurant: hours, cuisine, price, neighborhood, special if any
5. Demo puppet at `/demo?beat=1..6` — canned states for the video
6. Honesty banner when data is fixtures
7. Flynet adapter: fixtures now, live `GET /restaurants` + `/locations` + `/locations/{id}/open_hours` + `/specials` when `USE_FIXTURES=false`

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

## v1 ranking (exact)

```
open now (America/New_York) first
then has_fly_special
then distance_km from midpoint ascending
```

Closed places: hidden on results, not greyed.

## Completeness bar (hackathon)

- Two people can finish the job without instructions
- Demo beats 1–6 work with no network (`USE_FIXTURES=true`)
- README honesty table: fixture vs live
- Recorded demo ≤ 90s using `/demo?beat=`
- Public HTTPS deploy (not localhost)

## Time box

If a prompt would take more than 45 minutes of agent looping, stop and ship the fixture path.
