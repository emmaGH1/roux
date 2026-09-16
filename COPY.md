# Copy (lock)

Do not rewrite. Do not add slogans. If you need a string not listed, use a short literal label in IBM Plex Mono, sentence case.

## Product

- Name: **Roux**
- One-liner: Two points. One table.
- Job: Find the Blackbird restaurant in the middle of two people, that’s open now.

## Landing `/`

Eyebrow: `BLACKBIRD · FLYNET`

H1:

```
Two kitchens apart.
One table.
```

Lede:

```
Roux sits the table in the geographic middle. Open Blackbird rooms only. No ratings. No waitlist theater.
```

Primary CTA: `Find the middle` → `/meet`
Secondary: none on first screen.

How it works (three lines, not three cards):

```
1. Drop two places.
2. Roux marks the middle.
3. You get rooms that are actually open.
```

Honesty line (footer of landing, small):

```
Roux reads Blackbird locations and hours. It does not book tables or rate restaurants.
```

Footer: `Roux` + `Runtime Agent Week 2026` only. No fake links.

## Meet `/meet`

Title: `Who’s coming`

Label A: `First place`
Label B: `Second place`
Placeholder: `ZIP or neighborhood`
Helper: `Try 11211 and 11215`

Preset chips (exact): `Williamsburg 11211` · `Park Slope 11215` · `Greenpoint 11222` · `East Village 10003` · `DUMBO 11201`

Submit: `Mark the Roux`

Error empty: `Need two places.`
Error unknown zip: `Unknown ZIP. Use a chip or a 5-digit NYC ZIP.`

## Results `/meet/results`

Kicker: `OPEN NOW · AMERICA/NEW_YORK`

Title: `The middle`

Meta line (fill numbers): `{n} rooms · {km} km apart · Roux at {lat}, {lng}`

Empty: `Nothing open near the middle right now. Try two closer ZIPs.`

Row, left to right: name · neighborhood · `{km} km` · `OPEN` · optional `FLY`

FLY means a Flynet special exists. Tooltip/title: `FLY special on`

Back: `Change places`

## Spot `/spot/[id]`

Kicker: neighborhood
Title: restaurant name
Facts: cuisine joined with em dash · price as `$` repeated (1–4) or omit if null
Hours: `Today {open}–{close}` or `Closed today`
Special block title: `FLY` then special label + description
No special: omit the block (do not write “No specials”)
CTA: `This is the table` (sets a local pick; no payment)
Back: `All open rooms`

## Honesty banner (app layout, fixtures)

```
Fixture data. Live Flynet when keys are in.
```

Live:

```
Live Flynet · staging
```

## Demo `/demo`

No extra marketing. Same UI as product. Beats only change inputs/results via query.

## Alt text

Map: `Paper map. Two people marked. Roux at the midpoint.`
Button: visible label is enough.
