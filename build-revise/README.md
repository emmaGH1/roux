# Meet in the Middle — a Flynet meetup finder

**The Idea:** When a group of friends wants to eat out, everyone taps once to share
their phone's location, and the app points the whole group to **one fair Blackbird
restaurant** near the middle of everyone — plus a live perk to get them out the door.

**Who it's for:** friends trying to pick a place to meet without the endless group-chat
back-and-forth. One person starts a meetup, shares a link, everyone drops their spot,
and the app makes the call.

**Why a restaurant loves it (the PNL angle):** it turns a stalled "where should we go?"
thread into a booked group visit at a real Blackbird restaurant, and surfaces a current
special to convert the plan into covers and spend. More group visits, less indecision,
a nudge that drives people through the door.

---

## What this repo is

This is the **Implementation Plan** for a hackathon proof-of-concept (v0), built to be
demoable by one person in a single ~4–5 hour sitting. It is a spec, not the app itself.

Read these in order:

1. **`PRD.md`** — the product spec. The build follows this end to end.
2. **`CONTEXT.md`** — the glossary. The words we use and exactly what they mean.
3. **`docs/adr/`** — the decisions we've already made, and why.
4. **`HANDOFF.md`** — the build prompt for your local coding agent. Start here when you're
   ready to build.

## The one core loop (v0)

1. **Start a meetup** → get a short code + a shareable link.
2. **Everyone opens the link and taps once to share their location.**
3. **The app finds the fair middle** and picks one Blackbird restaurant closest to it.
4. **The result screen** shows that "meet here" pick, a couple of backups, a current
   special, and a directions link.

That's the whole demo. Everything else is deliberately out of scope for v0.

## Built on Flynet

This app is built on [Flynet](https://docs.flynet.org), the API for Blackbird's restaurant
network. It uses Flynet's **Discovery** surface — the list of Blackbird restaurants and
their physical locations (with map coordinates) — plus **specials** for the perk nudge.
No payments or member sign-in are needed for v0.
