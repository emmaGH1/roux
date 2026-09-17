# Routes

Each URL is a separate `page.tsx`. Do not combine.

| URL | Layout | Job | Demo ids |
| --- | --- | --- | --- |
| `/` | `(marketing)` | Convince, then go to `/start` | `id="cta-start"` |
| `/start` | `(product)` | Create a meetup, show share link | `id="btn-create"` `id="share-link"` |
| `/m/[code]` | `(product)` | Join, share location, live count | `id="btn-share-loc"` `id="share-count"` `id="btn-find"` |
| `/m/[code]/result` | `(product)` | Pick + backups + directions | `id="pick-card"` `id="btn-directions"` |
| `/meet` | `(product)` | Two-ZIP fallback (demo-friendly) | `id="place-a"` `id="place-b"` |
| `/demo` | — | Puppet for video | redirects per beat |

## API (server route handlers — the Discovery proxy)

| Endpoint | Method | Returns |
| --- | --- | --- |
| `/api/meetups` | POST | `{ code }` |
| `/api/meetups/[code]` | GET | `{ count }` |
| `/api/meetups/[code]/locations` | POST | `{ count }` — body `{ lat, lng }` |
| `/api/meetups/[code]/result` | POST | `{ midpoint, pick, backups }` per PRD §5 shape |

## Query contracts

`/meet/results?a=11211&b=11215` — unchanged two-ZIP fallback.

`/demo?beat=1` … `beat=5`

| beat | Screen | State |
| --- | --- | --- |
| 1 | `/` | landing hero |
| 2 | `/start` | fresh start screen |
| 3 | `/m/DEMO1` | meetup with 2 pre-shared fixture points, count = 2 |
| 4 | `/m/DEMO1/result` | computed pick + backups + map |
| 5 | `/meet?a=11211&b=11215` → results | two-ZIP fallback flow |

`/demo` seeds the `DEMO1` meetup with two fixture points on first hit of beat 3.

## data-* for video

- `data-source="fixture" | "flynet"` on product screens
- `data-count` on the share count
- `data-pick="true"` on the pick card
- `data-fly="true"` when a special exists

## 16:9 capture

Hero complete at 1280×720 without scrolling. Result screen: pick card + map visible without scrolling at 1280×720.
