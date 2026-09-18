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

### 1. Meetup storage (one-time, free, ~2 minutes)

Meetup codes must survive across serverless instances, so they live in Upstash Redis:

1. Sign up at `console.upstash.com` (no credit card) → **Create Database** →
   Global, any region, free tier
2. Open the database → **REST API** section → copy the `UPSTASH_REDIS_REST_URL`
   and `UPSTASH_REDIS_REST_TOKEN`
3. Put both in `.env.local` locally, and in Vercel's env vars in step 2

Without these vars the app falls back to the in-memory store — fine for a
single-process dev server, useless deployed (codes vanish between requests).

### 2. Vercel

Push the repo to GitHub → vercel.com → **Add New Project** → import → set env vars:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | public token, styles + static images |
| `MAPBOX_TOKEN` | server-side static-map URL signing |
| `FLYNET_API_KEY` | 40-char `fly_test_…` / `fly_live_…` — **required** for live data |
| `UPSTASH_REDIS_REST_URL` | from step 1 — required for codes to work |
| `UPSTASH_REDIS_REST_TOKEN` | from step 1 — required for codes to work |
| `USE_FIXTURES` | `false` once the key works; leave unset to keep sample data |

Deploy → open the URL → `/api/status` should say `flynet/ok`. Then the real test:
start a meetup on your laptop, copy the invite link, open it on your phone (same
Wi-Fi or cellular), tap **Share my location**, and join from a second device with
just the code via **Have a code?** on `/start`.

## Spec (do not ignore)

- `AGENTS.md` — agent contract
- `SCOPE.md` — in/out
- `DESIGN.md` — anti-slop
- `COPY.md` — strings
- `ROUTES.md` — pages
- `demo/BRIEF.md` — HyperFrames

## Honesty

See `HONESTY.md`. Fixtures until Flynet keys are in. The app labels its own data source.
