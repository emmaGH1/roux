# Roux — start here

The app is **built**. This is no longer a scaffold-from-prompts repo; it's a working
Next.js 15 codebase with a design law. Do not rebuild from scratch and do not paste
build-sequence prompts (see `harness/PROMPTS.md` — retired).

## You (5 minutes)

1. Copy `.env.example` → `.env.local`
2. Leave `USE_FIXTURES=true` until your Flynet key arrives
3. When the key arrives: paste the 40-char `FLYNET_API_KEY` (`fly_test_`/`fly_live_`),
   set `USE_FIXTURES=false`, then run `npm run check:flynet` to confirm live data
4. Run `npm run dev` and walk the flow: `/` → **Start a meetup** → share link →
   **Find our spot**

## Law (read-only for the agent)

| File | What it freezes |
| --- | --- |
| `AGENTS.md` | Behavior. Agent must follow every time. |
| `SCOPE.md` | What exists. What is banned. |
| `DESIGN.md` | v2 visual system. Anti-slop list. |
| `COPY.md` | Every user-facing sentence. |
| `ROUTES.md` | The seven pages. One job per URL. |
| `demo/BRIEF.md` + `demo/SHOTLIST.md` | The recorded video. Capture via `/demo?beat=` |
| `HONESTY.md` | What the app may claim about its data. |
| `HACKATHON.md` | Runtime rules, tracks, deadline |

## Do not

- Do not let the agent pick colors, fonts, or taglines
- Do not install shadcn, aceternity, magic-ui, or three.js
- Do not add a chat box, auth, Stripe, or ratings
- Do not resurrect v1 files: `PaperMap.tsx`, `lib/geo.ts`, `lib/flynet/*` are deleted
  on purpose and stay deleted
