# Roux

Everyone meets in the middle. Friends each tap once to share their location; Roux picks one fair Blackbird restaurant near the middle of everyone — with a live perk.

Runtime Agent Week — Flynet track. Recorded demo.

## Run

```bash
cp .env.example .env.local   # add MAPBOX_TOKEN + NEXT_PUBLIC_MAPBOX_TOKEN
npm install
npm run dev                  # http://localhost:3000
```

Then `/` → **Start a meetup** → open the share link on two phones → **Find our spot**.

Production build for recording:

```bash
npm run build && npm start   # http://localhost:3000
```

`next dev` and `next start` keep **separate build directories** (`.next-dev` and `.next`),
so you can edit while a production build serves the demo. Never rebuild one while the
other is running — that is what produces the generic "Application error: a client-side
exception has occurred" screen.

## Data (live vs sample)

The app never claims more than it has. `/api/status` reports the dataset actually loaded,
and the footer badge plus `data-source` follow it. Prefer the truth over a green light:

```bash
npm run check:flynet   # read-only: key format, base URL, counts, one pick's specials
```

Exit codes: `0` live, `1` rejected, `2` not configured. It never prints the key. A
`FLYNET_API_KEY` starting `flyotk_` is a *setup token*, not a key — API keys are 40 chars
and start `fly_test_` (staging) or `fly_live_` (production). `USE_FIXTURES=false` plus a
rejected key falls back to fixtures **and says so** rather than pretending to be live.

## Deploy

Vercel, zero config — import the repo, set the env vars, done:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | public token, styles + static images |
| `MAPBOX_TOKEN` | server-side static-map URL signing |
| `FLYNET_API_KEY` | 40-char `fly_test_…` / `fly_live_…` — **required** for live data |
| `USE_FIXTURES` | `false` once the key works; leave unset to keep sample data |

The meetup store is in-memory by design, so codes do not survive a redeploy or a second
serverless instance. Fine for a recorded demo; never claim persistence on camera.

## Spec (do not ignore)

- `AGENTS.md` — agent contract
- `SCOPE.md` — in/out
- `DESIGN.md` — anti-slop
- `COPY.md` — strings
- `ROUTES.md` — pages
- `demo/BRIEF.md` — HyperFrames

## Honesty

See `HONESTY.md`. Fixtures until Flynet keys are in. The app labels its own data source.
