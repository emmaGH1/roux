# Routes

Each URL is a separate `page.tsx`. Do not combine.

| URL | Layout | Job | Demo ids |
| --- | --- | --- | --- |
| `/` | `(marketing)` | Convince, then go to `/meet` | `id="cta-meet"` |
| `/meet` | `(app)` | Two places | `id="place-a"` `id="place-b"` `id="submit-roux"` `id="paper-map"` |
| `/meet/results` | `(app)` | Open rooms | `id="results-list"` `data-count` on list |
| `/spot/[id]` | `(app)` | One room | `id="spot-title"` `id="spot-hours"` `id="pick-table"` |
| `/demo` | `(app)` | Puppet for video | `data-beat` on `<body>` or wrapper |

## Layouts

`app/(marketing)/layout.tsx`
- Paper background
- Wordmark top-left “Roux” → `/`
- No nav links

`app/(app)/layout.tsx`
- Paper background
- Wordmark + honesty banner
- Back is in-page, not a global nav

## Query contracts

`/meet/results?a=11211&b=11215`
- `a` and `b` are ZIP codes
- Server computes midpoint, loads locations, filters open, sorts

`/demo?beat=1` … `beat=6`

| beat | Screen | State |
| --- | --- | --- |
| 1 | `/` | landing, no scroll needed (hero in view) |
| 2 | `/meet` | empty form |
| 3 | `/meet` | A=`11211` B=`11215` filled, not submitted |
| 4 | `/meet` | map shows two dots + R (same page after “preview”) |
| 5 | `/meet/results?a=11211&b=11215` | list, first row highlighted |
| 6 | `/spot/{first-fixture-id}` | hours + optional FLY block |

`/demo?beat=` **redirects** to the URL above so HyperFrames can also hit the real routes. Implement `app/demo/page.tsx` as a redirector plus `?embed=1` if you need a single origin.

Prefer HyperFrames capturing:

1. `/`
2. `/meet?a=11211&b=11215`
3. `/meet/results?a=11211&b=11215`
4. `/spot/flybar`

Pre-fill `/meet` from searchParams so the video never types.

## data-* for video

- `data-demo="roux"` on both layouts
- `data-source="fixture" | "flynet"`
- `data-open="true"` on result rows that are open
- `data-fly="true"` if special exists
- `data-pick="true"` on the chosen spot

## 16:9 capture

Hero, form, results, spot must be complete at 1280×720 without scrolling for the first screenful. Landing H1 may wrap. Do not hide the CTA below the fold at 720px height.
