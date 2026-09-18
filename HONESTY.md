# Honesty table

| Surface | Fixture (`USE_FIXTURES=true` or no key) | Live Flynet |
| --- | --- | --- |
| Restaurant locations | `fixtures/restaurants.json` | `GET /locations` + `GET /restaurants` (cached in memory) |
| Names / cuisine / price | fixture rows | cached restaurants map |
| Fair point | `lib/geo.ts` centroid | same |
| Ranking | haversine on fixture coords | same on live coords |
| Specials | fixture specials | `GET /specials?restaurant={id}` (pick only; failure = omitted silently) |
| Ratings | none | none |
| Payments / booking | none | none |
| Map rendering | WebGL map → Mapbox Static Images → drawn SVG diagram, each labeled on the map itself | same |
| Map tiles | Mapbox (public token) | same |

Banner copy: COPY.md. Specials 403/401 → treat as "no special", never a blocker (ADR 0005).
