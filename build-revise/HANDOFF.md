# HANDOFF — Build this now

You are a local coding agent. **Build the app described in this repo's plan.** Everything you
need is already specified — this is a build task, not a planning task. Do not re-plan, do not
run any skills or planning commands; read the spec and implement it.

## Read first (in this order)
1. `PRD.md` — the product spec. Build exactly the slices in **§11**, in order.
2. `CONTEXT.md` — the glossary. Use these exact words for these exact things.
3. `docs/adr/0001`–`0005` — decisions already made. Follow them; don't relitigate.
4. `README.md` — the one-paragraph framing and the core loop.

## What you're building
**Meet in the Middle**: friends each tap once to share their phone location, and the app
recommends **one fair Blackbird restaurant** near the group's midpoint, plus a couple of
backups and a current special. A hackathon v0 — one core loop, one happy path.

## Ground rules
- **Stack:** Next.js (App Router) + TypeScript, Vercel-deployable, with server route handlers
  as the Discovery proxy (ADR 0001). Mobile-first UI.
- **Flynet is real — use the live API.** Auth is an **API key** in the `X-API-Key` header,
  **server-side only**, read from `FLYNET_API_KEY`. Base URL defaults to staging
  `https://api.staging.blackbird.xyz/flynet/v1`. Consider dropping in Flynet's `flynet.ts`
  client to skip auth/error plumbing. Routes you need: `GET /locations`, `GET /restaurants`,
  `GET /specials?restaurant={id}` — see **PRD §6** for shapes and scopes.
- **Never put the API key in client code.** The browser calls only the app's own endpoints
  (**PRD §5**); the backend calls Flynet. Add a `.env.example` with variable **names only**
  (`FLYNET_API_KEY`, optional `FLYNET_BASE_URL`) — no real secrets in the repo.
- **The midpoint + nearest logic** is the simple straight-line approach in **PRD §7 / ADR 0002**
  — no routing/traffic service.
- **The meetup store** is the in-memory, code-keyed map in **PRD §8 / ADR 0003** — no database,
  no accounts.
- **Location capture** is a one-time browser geolocation snapshot per phone (ADR 0004). Cache
  the Flynet location/restaurant lists in server memory (fetch once, paginate through, reuse).
- **The special** is an additive nudge (ADR 0005): show it if present, omit it silently if not.

## Build order (each slice should run before you start the next)
Follow **PRD §11**: Slice 0 (scaffold + Discovery proxy + cached dataset) → Slice 1 (create/join
meetup) → Slice 2 (share location) → Slice 3 (find our spot — the core) → Slice 4 (perk nudge).
Slices 0–3 are the demo; Slice 4 if time allows.

## Definition of done
Run the demo script in **PRD §12**: start a meetup on one phone, open the link on another, both
share location, tap "Find our spot," and see one fair Blackbird restaurant + two backups, each
with a working directions link (and a real special on the pick when one exists).

## Stay in scope
Honor **PRD §3** and **§13**: no accounts, no login, no filters, no database beyond the one map,
no payments, no reservation flow, no travel-time routing. When unsure, cut. Ship the core loop.
