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

## Spec (do not ignore)

- `AGENTS.md` — agent contract
- `SCOPE.md` — in/out
- `DESIGN.md` — anti-slop
- `COPY.md` — strings
- `ROUTES.md` — pages
- `demo/BRIEF.md` — HyperFrames

## Honesty

See `HONESTY.md`. Fixtures until Flynet keys are in. The app labels its own data source.
