# Honesty table

| Surface | Fixture (`USE_FIXTURES=true` or no key) | Live Flynet |
| --- | --- | --- |
| Restaurant locations | `fixtures/restaurants.json` | `GET /locations` + `GET /restaurants` (cached in memory) |
| Names / cuisine / price | fixture rows | cached restaurants map |
| Fair point | `lib/geo.ts` centroid | same |
| Ranking | haversine on fixture coords | same on live coords |
| Specials | fixture specials | `GET /specials?restaurant={id}` (pick only; failure = omitted silently) |
| Open hours | fixture `hours` | `GET /locations/{id}/open_hours` (pick only, cached 10 min, evaluated in the location's `time_zone`) |
| Cuisine + price band | fixture rows | `GET /restaurants` (`cuisine`, `price`) |
| Venue art | none | restaurant `asset` (`web_2x`, else `preview_1x`); absent → no image, never a placeholder |
| Ratings | none | none |
| Payments / booking | none | none |
| Data-source badge | `GET /api/status` reads the dataset actually loaded, so a rejected key reads "showing sample data" | same |
| Map rendering | WebGL map → Mapbox Static Images → drawn SVG diagram, each labeled on the map itself | same |
| Map tiles | Mapbox (public token) | same |

Banner copy: COPY.md. Specials 403/401 → treat as "no special", never a blocker (ADR 0005).

Reason values behind the badge: `ok` (live), `no-key`, `fixtures-forced` (deliberate),
`key-rejected` (key present but the API refused it — say so, never claim live).
A rejected key still serves fixtures, and the chip says which it is.

Never derive a data claim from env vars alone: `/start` is statically prerendered, so an
env-derived label is frozen at build time and can flatly contradict what the server serves.
