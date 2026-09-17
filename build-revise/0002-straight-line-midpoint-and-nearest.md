# 0002 — Straight-line centroid midpoint + nearest-by-distance (no routing service)

- **Status:** Accepted
- **Context:** The core of the app is "find the fair middle and pick the closest Blackbird
  restaurant." A truly fair answer would weigh real travel time by car/transit/walking, which
  means a routing/traffic API — another dependency, another key, more latency, and more to
  build. Flynet's Discovery lists also have no built-in "near me" geo filter, so ranking
  happens in our own code either way.
- **Decision:** Compute the **fair point** as the simple arithmetic average of everyone's
  shared latitudes and longitudes, and rank Blackbird locations by **straight-line
  (haversine) distance** from that point. Pick the nearest; the next two are backups. Prefer
  non-club locations.
- **Consequences:**
  - Zero extra dependencies or credentials; fast and easy to reason about; fine at city scale.
  - It's an approximation: straight-line "fair" can differ from travel-time "fair," and a
    naive lat/lng average skews slightly for very spread-out groups. Acceptable for a v0 demo.
  - Swapping in real travel-time routing later is possible but is explicitly **out of scope**
    for v0.
  - Because ranking is ours, we must pull the location set and hold it in memory (see 0004).
