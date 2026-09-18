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
| 0–8 | `/` | hero, no scroll | H1 + CTAs + live app frame |
| 8–16 | `/start` | one button in frame | "One button. You'll get a link to share." |
| 16–32 | `/m/[code]` (from `/start`) | two shared locations | map fills in as friends tap |
| 32–58 | `/m/[code]/result` | the deciding sequence, then pick | radar sweep → pin drop → pick card |
| 58–75 | `/` scrolled to money-shot | sample pick card + OPEN NOW | "One point that's fair." |
| 75–90 | `/` or end card | wordmark + footer CTA | "Everyone meets in the middle." |

If a beat needs a cursor: click `Start a meetup` in the navbar, the hero CTA on `/start`,
`Find our spot` on the meetup screen (tap to skip the sequence only if needed).

## Visual overlay (HyperFrames, not the app)

- Same canvas `#ffffff` and violet `#7c6cf6`
- Instrument Serif italic for title accents (the app's own accent voice)
- Do not introduce navy, glass, or Inter in the video either
- Lower-third: `ROUX` · `Everyone meets in the middle`
- End card: your deployed URL (replace with real URL)

## Completeness checks

- No typing typos in the capture (use `/demo?beat=` prefills)
- Honesty: with fixtures on screen, keep the "sample data" chip visible in at least one shot
- Show OPEN NOW as real state — a closed room must not carry the badge

## Out of video

Auth, payments, ratings, chat, architecture diagrams.
