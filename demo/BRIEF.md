# Roux demo — HyperFrames

workflow: product-launch-video
flow: capture the live app at deterministic URLs, then dress in HyperFrames. Do not rebuild the product inside the composition as a fake UI.

## Length
75–90 seconds. 16:9. No voiceover required (on-screen type + product). If VO is added later: one speaker, under 90s.

## Story (do not change)

1. Two people, two neighborhoods, one dinner.
2. They mark two places.
3. Roux sits the table in the middle — open Blackbird rooms only.
4. One room. Hours. FLY special if it exists.

## Capture URLs (app must be running)

Use fixtures so the video is identical every take.

| t (s) | URL | Hold | On screen |
| --- | --- | --- | --- |
| 0–8 | `/` | hero, no scroll | H1 + CTA |
| 8–20 | `/meet?a=11211&b=11215` | form filled, map R visible | two zips + paper map |
| 20–48 | `/meet/results?a=11211&b=11215` | list + map | OPEN rows, FLY on Flybar/Slope if open |
| 48–70 | `/spot/flybar?a=11211&b=11215` | hours + FLY block | “This is the table” |
| 70–90 | `/` or end card | wordmark | “Two points. One table.” |

If a beat needs a cursor: click `#cta-meet`, `#submit-roux`, first `#results-list a`, `#pick-table`.

## Visual overlay (HyperFrames, not the app)

- Same paper `#F3EBE0` and wine `#7A1F2B`
- Fraunces for titles
- Do not introduce navy, glass, or Inter in the video either
- Lower-third: `ROUX` · `Open Blackbird rooms in the middle`
- End card: roux.vercel.app (replace with real URL)

## Completeness checks

- No typing typos in the capture (use query prefill)
- Honesty: if fixtures, do not say “live mainnet”
- Show OPEN as a real filter (a closed club should not appear Saturday afternoon)

## Out of video

Auth, payments, ratings, chat, architecture diagrams.
