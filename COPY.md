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

### Footer

```
Roux — Everyone meets in the middle.
Built on Flynet · Runtime Agent Week 2026
```

## Start `/start`

Title: `Start a meetup`
Body: `One button. You'll get a link to share.`
Button: `Start a meetup`
After-create helper: `Share this link` (with copy button, copied state `Copied`)

## Meetup `/m/[code]`

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
Meta: `{neighborhood} · {km} km from the middle`
Perk block: chip `TODAY'S PERK` + `{special label}` + `{special description}`
Directions button: `Get directions`
Backups heading: `If that doesn't work`
Backup row: `{name} · {neighborhood} · {km} km` + `Directions`
Reset link: `Start over`

## Honesty banner (when fixtures active)

```
Sample data. Live Flynet when keys are in.
```

## Alt text

Map: `Map of the group's locations and the fair middle pick.`
