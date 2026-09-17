# 0004 — One-time browser geolocation snapshot per phone; cache the Flynet dataset in memory

- **Status:** Accepted
- **Context:** The Maker specifically wants **everyone's real phone location**, gathered
  across separate phones. Continuous, live tracking of many phones needs permissions
  plumbing, real-time syncing, and battery/privacy handling — far too much for a v0. Ranking
  restaurants also needs the Blackbird location set, which Flynet serves as paginated lists
  with no "near me" filter.
- **Decision:** Each participant shares a **single, one-time location snapshot** via the
  browser's Geolocation API when they tap "Share my location" — no continuous tracking, no
  typed-address fallback. Separately, the backend fetches the **full `/locations` and
  `/restaurants` lists once**, paginating through them, and **caches them in server memory**
  for the process lifetime rather than re-fetching per request.
- **Consequences:**
  - "Everyone's real phone location" is delivered with minimal plumbing: a tap, a browser
    prompt, one coordinate posted to the backend.
  - No live map of friends moving; a snapshot is a point in time (re-tapping just replaces
    intent by adding a fresh point). Good enough for choosing a place to meet.
  - Distance ranking is fast because the dataset is in memory; the trade-off is the cache can
    go stale within a process, which is irrelevant for a demo.
  - A participant who denies the location permission simply can't contribute a point; the UI
    should say so plainly and let others continue.
