# 0005 — Surface one live special as the conversion nudge, and degrade gracefully

- **Status:** Accepted
- **Context:** The whole point for a restaurant is turning a group's "maybe" into people at a
  table (the PNL win). Flynet exposes **specials** per restaurant — limited offers and menu
  highlights, sometimes with a FLY reward. Showing one at the picked restaurant gives the
  group a concrete reason to go now. But the specials route needs a specific permission on the
  API key (`read:restaurant_specials`), and not every restaurant has a special, so it can't be
  a hard dependency of the core loop.
- **Decision:** After the meet-here pick is chosen, fetch the picked restaurant's current
  specials and, if one exists, show its label/description/emoji on the pick card as the
  **perk nudge**. If the specials call fails (missing scope, error) or returns nothing, **omit
  the perk silently** and still show the recommendation. The perk is additive, never a blocker.
- **Consequences:**
  - Clear restaurant-profit framing: a real, current reason to show up drives covers and spend.
  - The core recommendation still works even without specials access, so the demo can't be
    broken by a key that lacks the scope or a restaurant with no offers.
  - Only the pick (and optionally the backups) trigger a specials lookup, keeping calls small.
  - v0 only **displays** a special; it does not redeem FLY, apply rewards, or take payment.
