# Hackathon record — Roux

## Event and clock
- Event: Runtime Agent Week — https://runtime.nyc/
- Deadline: Saturday 2026-09-19 16:00 EDT (portal locks)
- Internal cutoff: 15:30 EDT
- Demo: recorded only (Loom / YouTube / X) + HyperFrames motion piece
- Mode: short sprint
- Primary: Blackbird / Flynet “Best Use of Flynet” (top 5 × $500 $FLY)
- Secondary: Bankr Grand (auto, not the design target)

## Binding requirements
- Flynet API or SDK in a working flow (locations + hours + specials)
- Staging keys requested, waiting
- Until keys: fixtures labeled in UI
- Online: recorded demo required
- Submission: runtime.nyc/submit — no localhost, empty honeypot `website`

## Build decision
- User: two people who live apart and need one Blackbird table
- Job: geographic midpoint → nearest rooms ranked, pick + two backups
- Difference: no ratings; fairness + km + OPEN NOW + FLY special
- Distinctive action: the deciding second — radar sweep, pin drop, one fair room
- Risk: keys late / staging empty → keep fixtures, honesty never env-derived
- Rejected: trading desk, heat map, Dead Hour as the product, Sitting during-meal, reverse reservation, Stripe POS

## Evidence (fill at freeze)

| Criterion | Claim | Evidence | Judge path | Status |
| --- | --- | --- | --- | --- |
| Flynet use | Locations/hours/specials | `lib/discovery.ts` live path, verified against documented payloads | `/m/[code]/result` | mapper done; key pending |
| Product | Two taps → fair pick + backups | fixture path | `/demo?beat=1..5` | built |
| Honesty | Fixture vs live | `/api/status` + footer badge + `data-source` | footer badge, README | built |
| Diagnostic | One-command live check | `npm run check:flynet` | README | built |

## Submission
- Tracks: Blackbird (and Bankr auto)
- videoUrl: HyperFrames export + product capture, ≤ 90s
- projectUrl: Vercel
- repoUrl: this GitHub repo
