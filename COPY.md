# Copy (lock)

Do not rewrite. Do not add slogans. If you need a string not listed, use a short literal label.

## Product

- Name: **Roux**
- One-liner: Everyone meets in the middle.
- Job: Friends each tap once to share their location. Roux picks one fair Blackbird restaurant near the middle of everyone — with a live perk to get them out the door.

## Landing `/`

Navbar: wordmark `Roux` · link `How it works` · CTA `Start a meetup`

### Hero

Eyebrow: `FOR FRIENDS WHO CAN'T DECIDE`

H1:

```
Everyone meets
in the middle.
```

Subtext:

```
One tap. Everyone's location. One fair Blackbird restaurant, decided.
```

Primary CTA: `Start a meetup`
Secondary CTA: `How it works`
Microcopy: `No accounts. No apps. Just a link.`

### Gradient band + floating app card

Card kicker: `MEET-HERE PICK`
Card title: `{restaurant name}` (fixture sample)
Card meta: `{neighborhood} · {km} km from the middle`
Perk chip: `TODAY'S PERK`
Perk text: `{special label}`
Directions button: `Get directions`
Under-card caption: `Live sample. The real pick computes from everyone's location.`

### Map section

Eyebrow: `THE FAIR MIDDLE`

H2:

```
One tap from everyone.
One point that's fair.
```

Body:

```
Roux averages everyone's location, ranks every Blackbird room by
straight-line distance, and calls it. No arguments. No scrolling maps.
```

Checklist rows:

```
Fair-point average of all locations
Straight-line distance ranking
Pick plus two backups, decided instantly
```

### How it works

Eyebrow: `HOW IT WORKS`

H2: `Three taps to a table.`

```
1. Start a meetup. Share the link.
2. Friends each tap once to drop their spot.
3. Roux picks the fair middle. You walk there.
```

### Why restaurants love it

Eyebrow: `WHY RESTAURANTS LOVE IT`

H2: `A stalled group chat becomes a booked table.`

Body:

```
Every undecided thread is a table that never gets booked. Roux converts
indecision into a group visit at a real Blackbird restaurant — and
surfaces a current special to turn intent into covers and spend.
```

### Hero app frame

Live pill: `3 of us are in`
Card kicker: `MEET-HERE PICK`
Caption under frame: `Three shares in · one fair point out`

### Ticker

```
No accounts
No app install
Works on any phone
Fair-point centroid
Straight-line distance ranking
One link, one pick
Flynet Discovery
```

### Deciding second (above the gradient card)

Kicker: `THE DECIDING SECOND`
H2: `The moment the arguing stops.`

### Fair middle metrics

```
{rooms} rooms considered
1 fair point
{backups} backups ready
```

### What Roux won't do

Eyebrow: `WHAT ROUX WON'T DO`
H2: `Honest by default.`

```
No star ratings.
Roux ranks by distance from the fair point. Nothing else is invented, averaged, or scored.

No fake reservations.
Flynet has no booking action at launch, so Roux never pretends to hold a table.

No accounts, no history.
Meetups live in server memory and disappear when the process restarts. Nothing to log into.
```

CTA band: `Ready to end the thread? A meetup takes one tap to start and one link to fill.`

### Built on Flynet panel

Chip label: `BUILT ON FLYNET`
Chip body: `The browser never talks to Flynet directly. It talks to these four routes.`
Chips: `POST /api/meetups` · `GET /api/meetups/{code}` ·
`POST /api/meetups/{code}/locations` · `POST /api/meetups/{code}/result`
Honesty chips: `{n} locations cached in server memory` · `API key stays server-side` ·
`Specials fetched only for the pick`

### Footer

Closing kicker: `READY WHEN THEY ARE`
Closing H2: `Stop the group chat.`
Closing body: `One link. Everyone taps once. Roux calls one fair Blackbird restaurant and
hands out directions.`
Primary: `Start a meetup` · Secondary: `See how it decides`

Partners & sponsors (name + mono note, each links out):

```
Flynet — Discovery API
Blackbird — restaurant network
Mapbox — maps
Next.js — framework
Vercel — hosting
```

Columns: `PRODUCT` · `UNDER THE HOOD` · `HONESTY`
Honesty column: `Sample data. Live Flynet when keys are in. Meetups live in server memory and
vanish on restart.`
Bottom bar:

```
Roux — Everyone meets in the middle.
Built on Flynet · Runtime Agent Week 2026 · © 2026
```

## Start `/start`

Eyebrow: `NEW MEETUP`
Title: `Start a meetup`
Body: `One button. You'll get a link to share.`
Button: `Start a meetup`
Micro row: `No account` · `One tap each` · `Free forever for friends`

What happens next:

```
01 Create the room — You get a five-character code and a link to share.
02 Drop it in the chat — Everyone opens it on their own phone and taps once.
03 Roux calls the spot — One pick, two backups, directions for the whole group.
```

Memory note: `Rooms live in server memory for the demo: restart the app and the meetup is gone.
Nothing is stored about you after the pick.`

After-create: eyebrow `ROOM IS OPEN`, title `Share this link`, label `MEETUP CODE`,
copy button (copied state `Copied`), `Share invite`, `Open this meetup yourself`,
footer line `Rooms live in server memory · gone on restart`

## Meetup `/m/[code]`

Eyebrow: `WAITING ROOM`
Label: `WHO'S IN`
Title: `Meetup {code}`
Body: `Everyone who opens this link drops their spot on the map.`
Button: `Share my location`
Shared state: `Location shared` (green check)
Count label: `{n} of us are in` — singular: `1 of us is in`
Waiting hint: `Waiting for at least 2 people.`
Error denied: `Location permission denied. You can't be counted without it.`
Button: `Find our spot` (enabled at count ≥ 2)

## Result `/m/[code]/result`

Kicker: `THE PICK`
Title: restaurant name
Meta: `{neighborhood} · {address} · {km} km from the middle`
Meta chips (factual brand detail, never a rating): `{cuisine}` · price band `$`–`$$$$`
Venue art: restaurant `asset` image, square, only when the brand has one
Perk block: chip `TODAY'S PERK` + `{special label}` + `{special description}`
Directions button: `Get directions`
Backups heading: `If that doesn't work`
Backup row: `{name} · {neighborhood} · {km} km` + `Directions`
Reset link: `Start over`

## Map tier labels

```
Static map                     (this map opted out of WebGL on purpose)
Static view · WebGL off        (WebGL unavailable or never finished loading)
Static view · tiles unavailable (no token or no tiles reachable)
```

## Data-source badge (rendered by `DataBadge` from `/api/status`)

```
Checking data source            (neutral, before the truth is known)
Live Flynet data                (green, source = flynet)
Sample data. Live Flynet when keys are in.   (no key / fixtures forced)
Flynet key rejected — showing sample data    (key present but rejected)
```

These strings come from the dataset actually loaded, never from env vars: a
statically prerendered screen would otherwise freeze a claim that is wrong.

## Alt text

Map: `Map of the group's locations and the fair middle pick.`
