#!/usr/bin/env node
/**
 * check:flynet — is live Flynet working?
 *
 * Read-only. Answers the question in one command, with the real error envelope
 * spelled out, so "sample data" never ships mislabeled as live data.
 *
 *   npm run check:flynet
 *
 * Exit codes: 0 live · 1 configured but rejected · 2 not configured (fixtures)
 *
 * Never prints the key: only its prefix, length, and last four characters.
 */

import fs from "node:fs";

const STAGING = "https://api.staging.blackbird.xyz/flynet/v1";
const PRODUCTION = "https://api.blackbird.xyz/flynet/v1";

const bold = (s) => `\u001b[1m${s}\u001b[0m`;
const dim = (s) => `\u001b[2m${s}\u001b[0m`;
const green = (s) => `\u001b[32m${s}\u001b[0m`;
const red = (s) => `\u001b[31m${s}\u001b[0m`;
const yellow = (s) => `\u001b[33m${s}\u001b[0m`;

const say = (s = "") => console.log(s);

/** Read .env.local without a dependency; process.env still wins. */
function readEnvLocal() {
  const out = {};
  try {
    for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      out[t.slice(0, i).trim()] = t
        .slice(i + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  } catch {
    // no .env.local — process.env only
  }
  return out;
}

const env = { ...readEnvLocal(), ...process.env };
const key = (env.FLYNET_API_KEY ?? "").trim();
const fixturesForced = env.USE_FIXTURES === "true";

function keyReport() {
  if (!key) return { state: "missing" };
  if (key.startsWith("flyotk_")) {
    return {
      state: "setup-token",
      note: "This is a setup token, not an API key. API keys are 40 chars and start fly_test_ or fly_live_.",
    };
  }
  if (key.startsWith("fly_live_")) return { state: "ok", env: "production" };
  if (key.startsWith("fly_test_")) return { state: "ok", env: "staging" };
  return {
    state: "unrecognized",
    note: "No fly_test_/fly_live_ prefix. API keys are 40-character strings with that prefix.",
  };
}

/** Base URL: explicit override wins, else the key's environment decides. */
function resolveBase(report) {
  if (env.FLYNET_BASE_URL) return { base: env.FLYNET_BASE_URL.replace(/\/$/, ""), how: "FLYNET_BASE_URL" };
  if (report.env === "production") return { base: PRODUCTION, how: "fly_live_ key" };
  return { base: STAGING, how: report.env === "staging" ? "fly_test_ key" : "default (staging)" };
}

/** Human meaning for every 401/404 shape the API documents. */
function explain(status, body, wwwAuthenticate) {
  if (status === 401 && !body) {
    return "missing credential — the X-API-Key header was not seen at all";
  }
  if (status === 401 && body) {
    try {
      const j = JSON.parse(body);
      if (j?.error?.code === "invalid_api_key") {
        return "invalid_api_key — the key is expired or revoked, or minted for another environment";
      }
      if (j?.error?.code) return `${j.error.code} — ${j.error.message ?? ""}`.trim();
    } catch {
      /* not JSON */
    }
    return "401 with an unparsed body";
  }
  if (status === 404) return "routing 404 — path does not match a known route";
  if (status === 429) return "rate_limit_exceeded — too many requests in a row; the app fetches pages in small batches and honors Retry-After";
  if (status === 403) {
    return "403 — the key lacks the scope this route needs" + (wwwAuthenticate ? ` (${wwwAuthenticate})` : "");
  }
  if (status >= 500) return "server error upstream";
  return "unexpected";
}

async function get(base, path) {
  const res = await fetch(`${base}${path}`, { headers: { "X-API-Key": key } });
  const body = await res.text();
  return { res, body };
}

function shape(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  if (typeof value === "object") return `object { ${Object.keys(value).join(", ")} }`;
  return typeof value;
}

say();
say(bold("Flynet live-data check"));
say(dim("─".repeat(52)));

/* ── Credential ── */
const report = keyReport();
say(`key          ${key ? `${key.slice(0, 9)}…${key.slice(-4)} (${key.length} chars)` : red("not set")}`);
if (report.note) say(`             ${yellow(report.note)}`);

const { base, how } = resolveBase(report);
say(`base url     ${base}  ${dim(`via ${how}`)}`);
say(`USE_FIXTURES ${fixturesForced ? "true " + yellow("(app is pinned to fixtures)") : "false"}`);
say();

/* A labeled block instead of process.exit(): exiting while fetch handles are
   still closing trips a libuv assertion on Windows. Set exitCode and break. */
exit: {
if (!key) {
  say(`${yellow("VERDICT: fixtures")} — no FLYNET_API_KEY. The app serves sample data and says so.`);
  process.exitCode = 2;
  break exit;
}

/* ── Discovery round-trip ── */
say(bold("Discovery"));

async function probe(label, path) {
  const started = Date.now();
  let out;
  try {
    out = await get(base, path);
  } catch (err) {
    say(`  ${label.padEnd(12)} ${red("request failed")} — ${err.message}`);
    return null;
  }
  const ms = Date.now() - started;
  const ok = out.res.status >= 200 && out.res.status < 300;
  say(`  ${label.padEnd(12)} ${ok ? green(String(out.res.status)) : red(String(out.res.status))}  ${dim(`${ms}ms`)}`);
  if (!ok) {
    say(`               ${explain(out.res.status, out.body, out.res.headers.get("www-authenticate"))}`);
    return null;
  }
  try {
    return JSON.parse(out.body);
  } catch {
    say(`               ${red("response was not JSON")}`);
    return null;
  }
}

const locations = await probe("locations", "/locations?page=0&page_size=25");
if (!locations) {
  say();
  say(`${red("VERDICT: rejected")} — the key did not authenticate. Fix the key before trusting any live claim.`);
  process.exitCode = 1;
  break exit;
}

const restaurants = await probe("restaurants", "/restaurants?page=0&page_size=25");

const locRows = locations.locations ?? [];
const pag = locations.pagination ?? {};
say();
say(`  ${bold("locations    ")} ${pag.total_count ?? locRows.length} total · ${pag.total_pages ?? "?"} pages of ${pag.page_size ?? "?"}`);  if (restaurants) {
    const rpag = restaurants.pagination ?? {};
    say(`  ${bold("restaurants  ")} ${rpag.total_count ?? (restaurants.restaurants ?? []).length} total · ${rpag.total_pages ?? "?"} pages`);
  }

/* ── Pagination pattern: the same load path the app uses ──
   A lone page-0 request can be honest while a full dataset load rate-limits.
   lib/discovery.ts fetches pages in batches of 4 with page_size=50 and
   retries a 429 up to 3×; mirror that here so the verdict means something. */
const CONC = 4;
const burstPages = Math.min(8, Math.max(1, (pag.total_pages ?? 1) - 1));
if (burstPages > 0) {
  const fetchWithRetry = async (p) => {
    for (let attempt = 0; ; attempt++) {
      const { res } = await get(base, `/locations?page=${p}&page_size=50`);
      if (res.status === 429 && attempt < 3) {
        const ra = Number(res.headers.get("retry-after"));
        await new Promise((r) => setTimeout(r, Number.isFinite(ra) && ra > 0 ? ra * 1000 : 1100));
        continue;
      }
      return res.status;
    }
  };
  const statuses = [];
  for (let start = 1; start <= burstPages; start += CONC) {
    const batch = Array.from({ length: Math.min(CONC, burstPages - start + 1) }, (_, i) => start + i);
    statuses.push(...(await Promise.all(batch.map(fetchWithRetry))));
  }
  const ok429retried = statuses.filter((s) => s === 200).length;
  const limited = statuses.filter((s) => s === 429).length;
  const other = statuses.filter((s) => s !== 200 && s !== 429).length;
  say();
  say(bold("Pagination burst") + dim(` (${burstPages} pages of 50 at concurrency ${CONC}, as the app loads)`));
  say(`  ${green("200")} ×${ok429retried}  ${limited ? yellow("429 ×" + limited) : ""} ${other ? red("other ×" + other) : ""}`.trimEnd());
  if (limited || other) {
    say(`  ${yellow("Note")}: failures here mean the app fell back to sample data on that load —`);
    say(`  check the footer badge after a cold start.`);
  }
}

/* ── Shape audit: what our mapper actually relies on ── */
const first = locRows[0];
if (first) {
  say();
  say(bold("Payload shapes") + dim(" (what lib/discovery.ts maps)"));
  for (const field of ["id", "name", "restaurant", "neighborhood", "address", "coordinate", "is_club"]) {
    say(`  ${field.padEnd(14)} ${shape(first[field])}`);
  }
  const addressIsObject = first.address !== null && typeof first.address === "object";
  say(
    `  ${"address".padEnd(14)} ${
      addressIsObject
        ? first.address.city
          ? green("object with city/state — must be joined, not stored raw")
          : yellow("object without city/state")
        : "plain string"
    }`
  );
  const coord = first.coordinate ?? {};
  const usable = locRows.filter(
    (l) => Number.isFinite(l.coordinate?.latitude) && Number.isFinite(l.coordinate?.longitude)
  ).length;
  say(`  ${"coordinates".padEnd(14)} ${usable}/${locRows.length} rows have finite lat/lng`);
}

/* ── Fair point + nearest, mirroring lib/result.ts ── */
const pts = locRows
  .filter((l) => Number.isFinite(l.coordinate?.latitude) && Number.isFinite(l.coordinate?.longitude))
  .slice(0, 3)
  .map((l) => ({ lat: l.coordinate.latitude, lng: l.coordinate.longitude, row: l }));

if (pts.length >= 2) {
  const mid = {
    lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length,
    lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length,
  };
  const toRad = (d) => (d * Math.PI) / 180;
  const km = (a, b) => {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const s =
      Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return Math.round(6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 10) / 10;
  };
  const ranked = [...locRows]
    .filter((l) => Number.isFinite(l.coordinate?.latitude))
    .sort((a, b) => {
      if (Boolean(a.is_club) !== Boolean(b.is_club)) return a.is_club ? 1 : -1;
      return km(mid, { lat: a.coordinate.latitude, lng: a.coordinate.longitude }) -
        km(mid, { lat: b.coordinate.latitude, lng: b.coordinate.longitude });
    });
  const pick = ranked[0];

  say();
  say(bold("First live pick") + dim(" (first 3 locations as the meetup)"));
  say(`  fair point   ${mid.lat.toFixed(4)}, ${mid.lng.toFixed(4)}`);
  if (pick) {
    say(`  pick         ${pick.name ?? "(unnamed)"} ${pick.neighborhood?.name ? `· ${pick.neighborhood.name}` : ""} ${pick.neighborhood?.region ? `· ${pick.neighborhood.region}` : ""} ${dim(`${km(mid, { lat: pick.coordinate.latitude, lng: pick.coordinate.longitude })} km`)}`);
  }

  /* ── Optionally-scoped routes: failure here is not a blocker (ADR 0005) ── */
  if (pick?.restaurant?.id) {
    const specials = await probe("specials", `/specials?restaurant=${pick.restaurant.id}&page=0&page_size=5`);
    if (specials) {
      const first_special = (specials.specials ?? [])[0];
      say(
        `               ${first_special ? `ok — "${first_special.label}" ${first_special.fly_reward ? "with a FLY reward" : ""}` : "ok — no specials for this restaurant (fine; the perk block is hidden)"}`
      );
    } else {
      say(`               ${dim("not fatal — Roux omits the perk when a special isn't available")}`);
    }
  }
  if (pick?.id) {
    const hours = await probe("open_hours", `/locations/${pick.id}/open_hours`);
    if (hours) {
      const rows = hours.open_hours ?? [];
      say(`               ${rows.length ? `ok — ${rows.length} day(s), e.g. ${rows[0].day_of_week} ${rows[0].open_time}–${rows[0].close_time}` : "ok — no hours listed (OPEN NOW stays hidden)"}`);
    }
  }
}

say();
say(dim("─".repeat(52)));
if (fixturesForced) {
  say(`${yellow("VERDICT: live-ok, app pinned")} — the key works, but USE_FIXTURES=true keeps the app on sample data.`);
} else {
  say(`${green("VERDICT: live")} — the key authenticates and Discovery responds.`);
}
say();
}
