/**
 * Discovery proxy dataset (build-revise ADR 0001 + 0004).
 * Fetches all Flynet /locations + /restaurants once, caches in server memory.
 * Falls back to fixtures until FLYNET_API_KEY exists — labeled honestly in UI.
 *
 * Field names follow the live API reference. Where the reference and an older
 * assumption disagreed (address is an object, pagination is authoritative),
 * the live shape wins.
 */

import restaurantsJson from "../fixtures/restaurants.json";
import type { OpenHour, RouxSpot } from "./types";
import { isOpenAt } from "./openNow";

export type DiscoveryLocation = {
  location_id: string;
  restaurant_id: string;
  restaurant_name: string;
  /** The location's own name, e.g. "West Village". Falls back to the brand. */
  venue_name: string;
  neighborhood: string;
  region: string;
  /** Joined from `{ city, state }` — the API sends an object here. */
  address: string;
  coordinate: { lat: number; lng: number };
  is_club: boolean;
  /** Factual brand detail from /restaurants — never a rating. */
  cuisine: string[];
  price: number | null;
  /** Brand artwork from the restaurant's asset set, when it has one. */
  image_url: string | null;
  /** IANA zone for this location's open hours; hours are local to it. */
  time_zone: string | null;
};

export type DatasetSource = "fixture" | "flynet";

/**
 * Why the dataset looks the way it does. The UI must never claim live data it
 * isn't serving, so every screen can ask for this instead of guessing from env.
 */
export type DatasetReason =
  | "ok"
  | "no-key"
  | "fixtures-forced"
  | "key-rejected";

export type Dataset = {
  locations: DiscoveryLocation[];
  source: DatasetSource;
  reason: DatasetReason;
};

const STAGING = "https://api.staging.blackbird.xyz/flynet/v1";
const PRODUCTION = "https://api.blackbird.xyz/flynet/v1";

const PAGE_SIZE = 50;
/** Safety valve: a pagination bug upstream must not spin forever. */
const MAX_PAGES = 40;

const globalForCache = globalThis as unknown as {
  __rouxDataset?: Dataset;
  __rouxHours?: Map<string, { hours: OpenHour[] | null; at: number }>;
};

/** Hours barely change; a short TTL keeps them fresh without a fetch per render. */
const HOURS_TTL_MS = 10 * 60 * 1000;

/** Keys are environment-bound and not interchangeable, so the key picks the host. */
function baseUrl(key: string | undefined): string {
  if (process.env.FLYNET_BASE_URL) return process.env.FLYNET_BASE_URL.replace(/\/$/, "");
  if (key?.startsWith("fly_live_")) return PRODUCTION;
  return STAGING;
}

class FlynetError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** The 401 envelope carries the only useful diagnosis; keep it. */
async function describeFailure(res: Response): Promise<string> {
  try {
    const body = await res.json();
    const code = body?.error?.code;
    if (code) return `${code}: ${body.error.message ?? ""}`.trim();
  } catch {
    /* missing credential returns an empty body; reason is in WWW-Authenticate */
  }
  const www = res.headers.get("www-authenticate");
  return www ? `no credential accepted (${www})` : `HTTP ${res.status}`;
}

type Page<T> = { items: T[]; totalPages: number | null };

async function fetchPage<T>(
  key: string,
  base: string,
  path: string,
  page: number,
  itemKey: string
): Promise<Page<T>> {
  const res = await fetch(`${base}${path}?page=${page}&page_size=${PAGE_SIZE}`, {
    headers: { "X-API-Key": key },
  });
  if (!res.ok) {
    throw new FlynetError(res.status, `${path} → ${await describeFailure(res)}`);
  }
  const json = await res.json();
  const pagination = json?.pagination ?? {};
  return {
    items: (json?.[itemKey] ?? []) as T[],
    totalPages: typeof pagination.total_pages === "number" ? pagination.total_pages : null,
  };
}

/**
 * Page 0 first, then the remainder in parallel — the dataset is cached for the
 * life of the process, so this cost is paid once on a cold start.
 */
async function listAll<T>(
  key: string,
  base: string,
  path: string,
  itemKey: string
): Promise<T[]> {
  const first = await fetchPage<T>(key, base, path, 0, itemKey);
  const total = Math.min(first.totalPages ?? 1, MAX_PAGES);
  if (total <= 1) return first.items;

  const rest = await Promise.all(
    Array.from({ length: total - 1 }, (_, i) =>
      fetchPage<T>(key, base, path, i + 1, itemKey)
    )
  );
  return rest.reduce((all, page) => all.concat(page.items), first.items);
}

function fixtureDataset(reason: DatasetReason): Dataset {
  const spots = restaurantsJson as RouxSpot[];
  return {
    source: "fixture",
    reason,
    locations: spots.map((s) => ({
      location_id: s.id,
      restaurant_id: s.id,
      restaurant_name: s.name,
      // Fixtures have no separate venue name — the UI falls back to neighborhood.
      venue_name: s.neighborhood,
      neighborhood: s.neighborhood,
      region: "New York, NY",
      address: `${s.neighborhood}, New York, NY`,
      coordinate: { lat: s.lat, lng: s.lng },
      is_club: s.is_club,
      cuisine: s.cuisine ?? [],
      price: s.price ?? null,
      image_url: null,
      time_zone: "America/New_York",
    })),
  };
}

export async function getDataset(): Promise<Dataset> {
  if (globalForCache.__rouxDataset) return globalForCache.__rouxDataset;

  const key = process.env.FLYNET_API_KEY;
  if (!key) {
    globalForCache.__rouxDataset = fixtureDataset("no-key");
    return globalForCache.__rouxDataset;
  }
  if (process.env.USE_FIXTURES === "true") {
    globalForCache.__rouxDataset = fixtureDataset("fixtures-forced");
    return globalForCache.__rouxDataset;
  }

  const base = baseUrl(key);

  try {
    const locations = await listAll<any>(key, base, "/locations", "locations");

    /* Brand names are a nicety: if /restaurants fails, venues still work. */
    const rmap = new Map<string, any>();
    try {
      const restaurants = await listAll<any>(key, base, "/restaurants", "restaurants");
      for (const r of restaurants) if (r?.id) rmap.set(r.id, r);
    } catch (err) {
      console.warn("[discovery] /restaurants unavailable, using venue names:", err);
    }

    const mapped: DiscoveryLocation[] = [];
    for (const loc of locations) {
      const lat = loc.coordinate?.latitude;
      const lng = loc.coordinate?.longitude;
      if (typeof lat !== "number" || typeof lng !== "number") continue;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      /* The whole restaurant row, not just its name — cuisine, price and the
         asset set all live here. */
      const restaurant = loc.restaurant?.id ? rmap.get(loc.restaurant.id) : undefined;
      const brand = restaurant?.name;
      const city = loc.address?.city;
      const state = loc.address?.state;

      mapped.push({
        location_id: loc.id,
        restaurant_id: loc.restaurant?.id ?? loc.id,
        restaurant_name: brand ?? loc.name ?? "Restaurant",
        venue_name: loc.name ?? brand ?? "Restaurant",
        neighborhood: loc.neighborhood?.name ?? "",
        region: loc.neighborhood?.region ?? "",
        // address is `{ city, state }` live, a string in fixtures.
        address:
          typeof loc.address === "string"
            ? loc.address
            : [city, state].filter(Boolean).join(", "),
        coordinate: { lat, lng },
        is_club: Boolean(loc.is_club),
        cuisine: Array.isArray(restaurant?.cuisine) ? restaurant.cuisine : [],
        price: typeof restaurant?.price === "number" ? restaurant.price : null,
        image_url: restaurant?.asset?.web_2x ?? restaurant?.asset?.preview_1x ?? null,
        time_zone: loc.time_zone ?? null,
      });
    }

    globalForCache.__rouxDataset = {
      locations: mapped,
      source: "flynet",
      reason: "ok",
    };
  } catch (err) {
    console.error(
      `[discovery] Flynet load failed (${base}), using fixtures:`,
      err instanceof FlynetError ? err.message : err
    );
    globalForCache.__rouxDataset = fixtureDataset("key-rejected");
  }

  return globalForCache.__rouxDataset;
}

/**
 * Whether a location is open right now, from fixture hours (America/New_York).
 * Live open hours are a separate route per location — fetched for the pick only
 * — so anything live returns null here and the badge stays hidden.
 */
/**
 * The truth about where the data came from — for server components and
 * /api/status alike. Calls getDataset(), which caches, so this is cheap.
 */
export async function getDatasetStatus(): Promise<{
  source: DatasetSource;
  reason: DatasetReason;
}> {
  const dataset = await getDataset();
  return { source: dataset.source, reason: dataset.reason };
}

/**
 * Weekly hours for one location. Fixtures carry hours in the file; live rows
 * need a separate, unpaginated route, so that fetch is cached per location and
 * only ever made for the pick.
 */
export async function getOpenHours(locationId: string): Promise<OpenHour[] | null> {
  const fixtureHours = (restaurantsJson as RouxSpot[]).find((s) => s.id === locationId)
    ?.hours;

  if (globalForCache.__rouxDataset?.source !== "flynet") return fixtureHours ?? null;

  const key = process.env.FLYNET_API_KEY;
  if (!key) return null;

  const cache = (globalForCache.__rouxHours ??= new Map());
  const hit = cache.get(locationId);
  if (hit && Date.now() - hit.at < HOURS_TTL_MS) return hit.hours;

  try {
    const res = await fetch(`${baseUrl(key)}/locations/${locationId}/open_hours`, {
      headers: { "X-API-Key": key },
    });
    if (!res.ok) {
      console.warn(
        `[discovery] open_hours ${res.status} for ${locationId} — ${await describeFailure(res)}`
      );
      cache.set(locationId, { hours: null, at: Date.now() });
      return null;
    }
    const json = await res.json();
    const hours = Array.isArray(json?.open_hours) ? (json.open_hours as OpenHour[]) : [];
    cache.set(locationId, { hours, at: Date.now() });
    return hours;
  } catch (err) {
    console.warn("[discovery] open_hours request failed:", err);
    return null;
  }
}

/**
 * Open right now? `null` when hours aren't known — the badge stays hidden and
 * the UI never guesses.
 */
export async function getOpenState(
  location: DiscoveryLocation
): Promise<boolean | null> {
  const hours = await getOpenHours(location.location_id);
  if (!hours || hours.length === 0) return null;
  return isOpenAt(hours, new Date(), location.time_zone ?? "America/New_York");
}

/**
 * Specials for one restaurant. The route needs `read:restaurant_specials`
 * minted on the key, so a 401/403 here means "no special", never a blocker
 * (ADR 0005) — logged so the scope gap is visible to us, invisible to users.
 */
export async function getSpecial(
  restaurantId: string
): Promise<{ label: string; description: string } | null> {
  const fixtureSpecials = (restaurantsJson as RouxSpot[]).find(
    (s) => s.id === restaurantId
  )?.specials;

  const key = process.env.FLYNET_API_KEY;
  if (process.env.USE_FIXTURES === "true" || !key) {
    const first = fixtureSpecials?.[0];
    return first ? { label: first.label, description: first.description } : null;
  }

  try {
    const res = await fetch(
      `${baseUrl(key)}/specials?restaurant=${restaurantId}&page_size=5`,
      { headers: { "X-API-Key": key }, next: { revalidate: 120 } }
    );
    if (!res.ok) {
      console.warn(
        `[discovery] specials ${res.status} for ${restaurantId} — ${await describeFailure(res)}`
      );
      return null;
    }
    const json = await res.json();
    const first = (json?.specials ?? [])[0];
    if (!first) return null;
    // Documented field is `label`; tolerate the neighbours rather than render a blank perk.
    const label = first.label ?? first.name ?? first.title;
    const description = first.description ?? first.detail ?? "";
    return label ? { label, description } : null;
  } catch (err) {
    console.warn("[discovery] specials request failed:", err);
    return null;
  }
}
