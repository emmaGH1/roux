# Honesty table

| Surface | Fixture (`USE_FIXTURES=true`) | Live Flynet |
| --- | --- | --- |
| ZIP → lat/lng | `fixtures/nyc-zips.json` | same file (NYC only) |
| Restaurants | `fixtures/restaurants.json` | `GET /locations` + hours + specials |
| Open now | `lib/openNow.ts` on fixture hours | same function on API hours |
| Midpoint | `lib/geo.ts` | `lib/geo.ts` |
| Ratings | none | none |
| Menus / book table | none | none |
| $FLY pay | none (badge only if special exists) | none in v1 |

Banner copy: COPY.md
