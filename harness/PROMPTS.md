# Retired — v1 build prompts

These prompts built the **original v1** (InkMap/paper/wine, ZIP-pair flow, `/spot/[id]`,
`PaperMap.tsx`, `lib/geo.ts`, Fraunces). That app no longer exists in this repo — the
build they describe was replaced by the v2 system described in `DESIGN.md` and built
through `build-revise/`.

**Do not paste these into an agent.** They reference files and routes that were deleted
on purpose and will resurrect them.

For current work, the working contract is:

- `AGENTS.md` — behavior contract, file map, build rules
- `DESIGN.md` — v2 visual law (Plus Jakarta Sans / Instrument Serif / Plex Mono, white
  canvas, violet, double bezels, banned list)
- `COPY.md` — every user-facing string
- `ROUTES.md` — the seven routes that actually exist
- `harness/KILL_SLOP.md` — the one-liner revert prompt (updated for v2)

If you want a historical record of the v1 prompts, see git history
(`git log --follow harness/PROMPTS.md`).
