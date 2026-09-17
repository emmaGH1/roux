# PRD — Meet in the Middle (v0)

A hackathon proof-of-concept for Blackbird's internal event. One person, one ~4–5 hour
sitting, one core loop. Build exactly what's here; when in doubt, cut, don't add.

---

## 1. One-liner & the win

**Meet in the Middle** lets a group of friends each tap once to share their phone location,
then recommends **one fair Blackbird restaurant** near the middle of the group — with a
live special to seal the visit.

**PNL impact (state this in the demo):** it converts a stalled "where should we go?" group
chat into a booked group visit at a real Blackbird restaurant, and surfaces a current
special to turn intent into covers and spend — more group visits, faster decisions, a nudge
through the door.

---

## 2. Users & the happy path

**Primary users:** friends coordinating a meal. No technical users, no admin.

**The one happy path (this is the whole demo):**

1. **Organizer** opens the app and starts a meetup → receives a **meetup code** and a
   **shareable link**.
2. Organizer shares the link. Each **friend** (organizer included) opens it and taps
   **"Share my location"** → the browser returns their **location snapshot** (lat/lng),
   which is stored against the meetup.
3. Once at least two people have shared, anyone taps **"Find our spot."**
4. The app computes the **fair point** (centroid of all snapshots), finds the closest
   Blackbird **location**, and shows the **meet-here pick**: restaurant name, neighborhood,
   address, a **special/perk** if one exists, a **directions link**, and **2 backups**.

That's it. No other flows in v0.

---

## 3. Scope

### In scope (build these)
- Create a meetup; join a meetup by code/link.
- One-time browser geolocation snapshot per participant.
- Server-side computation of the fair point and nearest Blackbird locations.
- Result screen: one decisive pick + 2 backups + a special + a directions link.
- Graceful behavior when a special isn't available (just omit the perk).

### Out of scope (do NOT build)
- Accounts, login, OAuth, member identity, friend lists.
- Continuous / live location tracking or a live-updating map of friends.
- Typed-address entry or address geocoding (locations come from phones only).
- Table reservations/bookings (Flynet has no booking action; don't fake one).
- Payments, moving FLY, redeeming rewards, wallets.
- Settings, preferences, cuisine/price filters, history, editing a meetup.
- Travel-time / traffic / transit routing.
- Multi-region scaling, rate-limit tuning, persistence guarantees.

---

## 4. Screens (keep them plain)

1. **Start screen** — a single "Start a meetup" button. On tap, creates a meetup and moves
   to the meetup screen.
2. **Meetup screen** (the shared link lands here) — shows:
   - a prominent **"Share my location"** button (triggers the browser location prompt),
   - a small live count of how many friends have shared,
   - the **shareable link / code** with a copy button,
   - a **"Find our spot"** button (enabled once ≥2 have shared).
3. **Result screen** — the **meet-here pick** card (restaurant name, neighborhood, address,
   distance-ish label, special/perk if present, **Get directions** link), then **2 backups**
   as smaller cards. A "start over" link is fine but optional.

Visual polish is secondary to the loop working end to end. Mobile-first layout (this is used
on phones).

---

## 5. App's own backend endpoints

The app is a small full-stack web app. The browser never talks to Flynet directly — it talks
to these endpoints, and the backend talks to Flynet (see §6 and ADR 0001).

- `POST /api/meetups` → creates a meetup. Returns `{ code }`.
- `POST /api/meetups/{code}/locations` → body `{ lat, lng }`. Records one participant's
  snapshot under the meetup. Returns `{ count }` (how many have shared).
- `GET /api/meetups/{code}` → returns `{ count }` for the meetup (used to show the live
  count on the meetup screen).
- `POST /api/meetups/{code}/result` → computes and returns the recommendation:
  ```json
  {
    "midpoint": { "lat": 40.73, "lng": -73.99 },
    "pick": {
      "location_id": "…",
      "restaurant_name": "Anton's",
      "neighborhood": "West Village",
      "region": "New York, NY",
      "address": "570 Hudson St, New York, NY",
      "coordinate": { "lat": 40.734, "lng": -74.002 },
      "distance_km": 1.2,
      "special": { "label": "Happy Hour", "description": "Half-price oysters, 5–7pm.", "emoji": "🦪" },
      "directions_url": "https://www.google.com/maps/search/?api=1&query=40.734,-74.002"
    },
    "backups": [ { "…": "same shape, minus special (special optional)" } ]
  }
  ```
  `special` is `null` when none is available — the UI simply omits the perk.

Endpoint shapes above are the contract; keep names/fields stable so the UI and backend agree.

---

## 6. Flynet integration (real routes — verified against live docs)

**Auth:** all Discovery calls use an **API key** in the `X-API-Key` header. The key is
**server-side only** — it must never reach the browser (ADR 0001). Read it from an
environment variable (see §9).

**Base URL:** staging `https://api.staging.blackbird.xyz/flynet/v1` (production
`https://api.blackbird.xyz/flynet/v1`). Default to staging.

**Recommended client:** drop in Flynet's `flynet.ts` TypeScript client (from the docs,
`@flynetdev/core` / the `flynet.ts` snippet). It handles the API-key auth scheme and
normalizes errors into a typed `FlynetError`. Not required, but it saves plumbing.

Routes used:

| Purpose | Route | Notes |
| --- | --- | --- |
| All Blackbird locations (with coordinates) | `GET /locations?page=&page_size=` | Zero-indexed pages; `page_size` default 50. Each item has `coordinate.{latitude,longitude}`, `restaurant.{id}`, `neighborhood.{name,region}`, `address`, `is_club`. Paginate through all pages once and cache. |
| Restaurant details for a pick | `GET /restaurants?page=&page_size=` | Fetch the full list once and cache a map of `id → { name, cuisine, price, asset }`. Locations only embed the restaurant `id`, so this is how you get the display name. |
| A restaurant's current specials | `GET /specials?restaurant={id}` | Requires the key to carry the `read:restaurant_specials` scope. Returns `specials[]` with `label`, `description`, `emoji`, optional `fly_reward`. Call only for the picked (and maybe backup) restaurants. |

**Coordinates:** `GET /locations` returns `coordinate: { latitude, longitude }`. This is the
field the whole app depends on. Skip any location missing a coordinate.

**Filtering:** Discovery lists don't offer a geo/"near me" filter — the app pulls the
location set and ranks it itself (ADR 0002). `is_club: true` marks private clubs; prefer
`is_club: false` for an open group meetup, and only fall back to clubs if nothing else is
near.

**Caching (important for a fast demo):** fetch the full `/locations` and `/restaurants`
lists **once** on first use and cache them in server memory for the process lifetime. Don't
re-paginate on every request. The dataset is small enough to hold in memory.

**Error/resilience (keep minimal):**
- Missing API key → `/restaurants*` and `/locations*` return an empty-body `401`. Fail the
  request with a clear server log; don't crash the meetup.
- Specials may `403`/`401` if the key lacks `read:restaurant_specials`. Treat any specials
  failure as "no special" and continue — the perk is a bonus, never a blocker.
- Unknown query params are silently ignored by the API; spell filter names exactly.

---

## 7. The fair-point + nearest algorithm (ADR 0002)

Keep it simple and dependency-free:

1. **Fair point** = the average of all participants' latitudes and longitudes (simple
   arithmetic centroid). Good enough for a city-scale group; no routing service.
2. **Distance** = straight-line (haversine) distance from the fair point to each Blackbird
   location's coordinate. (A flat equirectangular approximation is also fine at city scale.)
3. **Rank** locations by that distance ascending; prefer `is_club: false`.
4. **Pick** = the nearest; **backups** = the next two.
5. Attach the restaurant display name (from the cached restaurants map) and, for the pick,
   its special (if any).

No travel time, traffic, or transit. Straight-line is a deliberate, documented approximation
(ADR 0002).

---

## 8. The meetup store (ADR 0003)

- An **ephemeral, in-memory** store keyed by **meetup code**: `code → { locations: [{lat,lng}], createdAt }`.
- No database, no accounts, no persistence guarantees. Fine to lose on restart — it only
  needs to survive a single demo.
- Generate a short, unambiguous code (e.g. 4–6 characters, avoid easily-confused
  characters). Collisions are astronomically unlikely at demo scale; a simple retry on
  collision is enough.
- If a single-process, single-region deploy makes in-memory awkward on the target host, a
  tiny key-value store (e.g. a lightweight KV or a single SQLite table with the same shape)
  is an acceptable swap — but do not build accounts or schemas beyond this one map.

---

## 9. Environment & config

Environment variables (names only — never commit real values):

- `FLYNET_API_KEY` — the server-side Discovery API key (staging `fly_test_…`).
- `FLYNET_BASE_URL` — optional; defaults to the staging base URL above.

Credentials live only in the server environment. Nothing secret ships to the browser. There
is no `.env` with real values in the repo; provide a `.env.example` with the variable names.

---

## 10. Tech stack (ADR 0001)

- **Next.js (App Router) + TypeScript**, deployable to Vercel — a single full-stack app
  where **route handlers** act as the Discovery proxy that holds the API key. This mirrors
  Flynet's own "ship with Claude / deploy to Vercel" path.
- **Browser Geolocation API** (`navigator.geolocation.getCurrentPosition`) for the one-time
  location snapshot. No native app, no map SDK required (a map is optional polish).
- No database in v0 (see ADR 0003). No auth library.
- If the builder strongly prefers a different single-deployable full-stack setup, the only
  hard requirements are: (a) the API key stays server-side, and (b) the endpoints in §5 exist
  with the shapes shown.

---

## 11. Build slices (each independently demoable — build in order)

**Slice 0 — Scaffold + Discovery proxy.**
- New Next.js + TypeScript app. Add `flynet.ts` (or an equivalent tiny API-key client).
- Add a server module that fetches **all** `/locations` and **all** `/restaurants` (paginating)
  and caches them in memory.
- Prove it: a temporary server log or debug route shows N locations loaded with coordinates.
- *Done when:* the app can list Blackbird locations server-side using the API key, and the key
  is never referenced in client code.

**Slice 1 — Create & join a meetup.**
- `POST /api/meetups` creates a meetup + code; start screen button navigates to the meetup
  screen; meetup screen shows the shareable link/code with copy.
- `GET /api/meetups/{code}` returns the current shared-count.
- *Done when:* one browser can create a meetup and another can open the link and land on the
  meetup screen.

**Slice 2 — Share location.**
- Meetup screen "Share my location" triggers the browser geolocation prompt and
  `POST /api/meetups/{code}/locations` with `{lat,lng}`; the store records it; the live count
  updates.
- *Done when:* two phones/tabs on the same meetup each share once and the count reads 2.

**Slice 3 — Find our spot (the core).**
- `POST /api/meetups/{code}/result` computes the fair point, ranks Blackbird locations, and
  returns the pick + 2 backups with restaurant names and a directions link (§5, §7).
- Result screen renders the pick card and backups.
- *Done when:* with ≥2 shared locations, the app shows one fair Blackbird restaurant and two
  backups, each with a working directions link.

**Slice 4 — The perk nudge.**
- For the picked restaurant, call `GET /specials?restaurant={id}`; if a special exists, show
  its label/description/emoji on the pick card. If not, omit it silently.
- *Done when:* the pick card shows a real special when one exists, and looks clean when none
  does.

Slices 0–3 are the demo. Slice 4 is the profit nudge — do it if time allows; it's designed
to be safely skippable.

---

## 12. Acceptance (the demo script)

1. Start a meetup on phone A; copy the link.
2. Open the link on phone B; both tap "Share my location."
3. Tap "Find our spot."
4. See one clearly-highlighted Blackbird restaurant near the middle of A and B, with a
   neighborhood, an address, a working **Get directions** link, and (if available) a special —
   plus two backups.

If that runs, the v0 is done.

---

## 13. Non-goals restated (guardrails)

Don't add accounts, don't add filters, don't add a database beyond the one in-memory map,
don't add payments, don't build a reservation flow, and don't reach for a travel-time routing
service. The straight-line middle + nearest Blackbird restaurant + a perk is the entire
product. Ship that.
