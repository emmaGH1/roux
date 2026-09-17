# 0003 — Ephemeral, code-keyed meetup store; no accounts, no database

- **Status:** Accepted
- **Context:** Friends need to land in the same "meetup" so their locations pool together,
  and they join by tapping a shared link — with no sign-up. A real app might persist meetups,
  add accounts, and reconcile identities across devices. All of that is heavy and unnecessary
  to prove the idea in a single demo.
- **Decision:** Store meetups in an **in-memory map keyed by a short meetup code**:
  `code → { locations: [{lat,lng}], createdAt }`. Joining is by code/link only; there are no
  user accounts and no login. A participant is just an anonymous location snapshot added to
  the meetup. No database, no persistence guarantees.
- **Consequences:**
  - Dead simple and instant to build; nothing to migrate or secure beyond the API key.
  - Meetups vanish on server restart and don't survive across multiple server instances — fine
    for a single-process demo, not for production.
  - No way to remove or de-duplicate a specific person's snapshot in v0 (a re-share just adds
    another point); acceptable for the happy path.
  - If the target host makes in-memory awkward, a tiny KV or a single SQLite table with the
    same shape is an allowed swap — but no accounts or broader schema.
