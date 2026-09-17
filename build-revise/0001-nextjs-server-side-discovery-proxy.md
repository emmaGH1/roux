# 0001 — Next.js full-stack app; API key stays server-side behind a Discovery proxy

- **Status:** Accepted
- **Context:** The app needs to read Blackbird restaurants and locations from Flynet's
  Discovery routes. Flynet requires an **API key** for those routes, and that key is a
  server-side secret: the docs are explicit that it must never ship to a browser or phone.
  The app is also a phone-first web app that friends open from a shared link. We want one
  thing to build and deploy in a few hours.
- **Decision:** Build a single **Next.js (App Router) + TypeScript** app deployable to
  Vercel. All Flynet Discovery calls happen in **server route handlers** that hold the API
  key. The browser only ever calls the app's own endpoints (a "Discovery proxy"); it never
  sees the key or calls Flynet directly. This mirrors Flynet's own recommended "ship with
  Claude / deploy to Vercel" path.
- **Consequences:**
  - The key stays safe and the client bundle carries no secret.
  - One codebase, one deploy — good for a 4–5 hour build and a live demo.
  - Every Flynet read is one hop behind our own endpoint, so we can cache and shape data.
  - If a different single-deployable full-stack stack is used, two rules still hold: the key
    stays server-side, and the app's endpoints keep the shapes in the PRD.
