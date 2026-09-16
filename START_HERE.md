# Roux — Antigravity start

Open **this folder** in Antigravity. Do not start from a blank chat.

## You (5 minutes)

1. Copy `.env.example` → `.env.local`
2. Leave `USE_FIXTURES=true` until Flynet keys arrive
3. When keys arrive: paste `FLYNET_API_KEY`, set `USE_FIXTURES=false`
4. In Antigravity, paste **one prompt at a time** from `harness/PROMPTS.md` (Prompt 01, wait until it finishes, then 02…)

Never paste two prompts in one message. Never say “build the whole app.”

## Law (read-only for the agent)

| File | What it freezes |
| --- | --- |
| `AGENTS.md` | Behavior. Agent must follow every time. |
| `SCOPE.md` | What exists. What is banned. |
| `DESIGN.md` | Visual system. Anti-slop list. |
| `COPY.md` | Every user-facing sentence. |
| `ROUTES.md` | Pages. One job per URL. |
| `demo/BRIEF.md` | HyperFrames video. Capture `/demo?beat=` |
| `HACKATHON.md` | Runtime rules, tracks, deadline |

## Do not

- Do not let the agent pick colors, fonts, or taglines
- Do not install shadcn, aceternity, magic-ui, or three.js
- Do not add a chat box, auth, Stripe, or ratings
- Do not collapse the site into one page
