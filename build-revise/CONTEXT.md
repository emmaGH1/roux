# CONTEXT — Glossary

Plain, shared definitions for **Meet in the Middle**. This is a dictionary, not a design
doc — it fixes the words so the PRD, the ADRs, and the build all mean the same thing.

## The product

- **Meet in the Middle** — the app. Finds one fair Blackbird restaurant near the middle
  of a group of friends.
- **Meetup** — a single group session: the set of people meeting and the locations they've
  shared. Ephemeral; it exists only for the demo and isn't meant to persist long-term.
- **Meetup code** — the short, human-shareable identifier for a meetup (e.g. a few letters
  or digits). Anyone with the code (or the link that contains it) can join.
- **Meetup link** — a URL that carries the meetup code, so friends can join by tapping it.
- **Organizer** — the person who starts the meetup and shares the link. Has no special
  powers in v0 beyond starting it.
- **Participant / Friend** — anyone who has joined a meetup and shared their location.
- **Location snapshot** — a single, one-time reading of a participant's position (latitude
  and longitude), taken from their phone when they tap "share my location." Not continuous
  tracking.
- **Fair point (midpoint)** — the computed central point among all shared location
  snapshots. The rough "middle" the meeting spot is chosen around.
- **Meet-here pick** — the single Blackbird restaurant location closest to the fair point.
  The app's decisive recommendation.
- **Backups** — the next couple of closest restaurant locations, shown under the pick as
  alternatives.
- **Perk / Special** — a current offer or highlight at the picked restaurant, shown to
  nudge the group into actually going. May include a FLY reward.
- **Directions link** — a plain map link to the picked location's address, so the group can
  navigate there.

## Flynet & Blackbird terms

- **Blackbird** — the membership network of restaurants this app is built on.
- **Flynet** — the API for building on Blackbird's restaurant network.
- **Discovery** — the read-only side of Flynet that lists restaurants and their locations.
  This app lives mostly here.
- **Restaurant** — a brand-level restaurant in Flynet (e.g. the name, cuisine, price band,
  images). One restaurant can have many locations.
- **Location** — a single physical venue belonging to a restaurant. Carries a map
  coordinate (latitude/longitude), a neighborhood, and an address. This is what the app
  measures distance to.
- **Neighborhood** — a named area a location sits in (e.g. "West Village"). Shown for
  context.
- **Special** — a Flynet offer or menu highlight attached to a restaurant; the source of
  the app's Perk. Can optionally carry a FLY reward.
- **FLY** — the token used across Flynet for rewards and payments. Only referenced in v0 if
  a special happens to carry a FLY reward; the app doesn't move money.
- **API key** — the server-side credential that lets the app read Discovery data. It is a
  secret and never leaves the app's backend.
- **Discovery proxy** — the app's own backend that holds the API key and makes the Flynet
  Discovery calls on the browser's behalf, so the key is never exposed to phones.

## Boundaries (so words don't drift)

- **Not a reservation system.** The app recommends and links to directions; it does not
  book tables. Flynet has no table-booking action at launch.
- **Not a payments app.** v0 shows a perk but does not take payment or move FLY.
- **Not a login/account app.** Joining is by meetup link only; there are no user accounts
  in v0.
