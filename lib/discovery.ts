/**
 * Discovery proxy dataset (build-revise ADR 0001 + 0004).
 * Fetches all Flynet /locations + /restaurants once, caches in server memory.
 * Falls back to fixtures until FLYNET_API_KEY exists — labeled honestly in UI.
 */

import restaurantsJson from "../fixtures/restaurants.json";
import type { RouxSpot } from "./types";
import { isOpenAt } from "./openNow";

export type DiscoveryLocation = {
  location_id: string;
  restaurant_id: string;
  restaurant_name: string;
  neighborhood: string;
  region: string;
  address: string;
  coordinate: { lat: number; lng: number };
  is_club: boolean;
};

export type Dataset = {
  locations: DiscoveryLocation[];
  source: "fixture" | "flynet";
};

const BASE =
  process.env.FLYNET_BASE_URL ?? "https://api.staging.blackbird.xyz/flynet/v1";

const globalForCache = globalThis as unknown as { __rouxDataset?: Dataset };

function fixtureDataset(): Dataset {
  const spots = restaurantsJson as RouxSpot[];
  return {
    source: "fixture",
    locations: spots.map((s) => ({
      location_id: s.id,
      restaurant_id: s.id,
      restaurant_name: s.name,
      neighborhood: s.neighborhood,
      region: "New York, NY",
      address: `${s.neighborhood}, New York, NY`,
      coordinate: { lat: s.lat, lng: s.lng },
      is_club: s.is_club,
    })),
  };
}

export async function getDataset(): Promise<Dataset> {
  if (globalForCache.__rouxDataset) return globalForCache.__rouxDataset;

  const key = process.env.FLYNET_API_KEY;
  if (process.env.USE_FIXTURES === "true" || !key) {
    globalForCache.__rouxDataset = fixtureDataset();
    return globalForCache.__rouxDataset;
  }

  try {
    const locations = await listAllLocations(key);
    const restaurants = await listAllRestaurants(key);
    const rmap = new Map(restaurants.map((r) => [r.id, r]));

    const mapped: DiscoveryLocation[] = [];
    for (const loc of locations) {
      const lat = loc.coordinate?.latitude;
      const lng = loc.coordinate?.longitude;
      if (typeof lat !== "number" || typeof lng !== "number") continue;
      const r = rmap.get(loc.restaurant?.id);
      mapped.push({
        location_id: loc.id,
        restaurant_id: loc.restaurant?.id ?? loc.id,
        restaurant_name: r?.name ?? loc.name ?? "Restaurant",
        neighborhood: loc.neighborhood?.name ?? "",
        region: loc.neighborhood?.region ?? "",
        address: loc.address ?? "",
        coordinate: { lat, lng },
        is_club: Boolean(loc.is_club),
      });
    }

    globalForCache.__rouxDataset = { locations: mapped, source: "flynet" };
  } catch (err) {
    console.error("[discovery] Flynet load failed, using fixtures:", err);
    globalForCache.__rouxDataset = fixtureDataset();
  }

  return globalForCache.__rouxDataset;
}

/**
 * Whether a location is open right now, from fixture hours (America/New_York).
 * Live Flynet hours aren't in the Discovery payload yet — returns null there.
 */
export function openNowAt(locationId: string): boolean | null {
  if (globalForCache.__rouxDataset?.source === "flynet") return null;
  const spot = (restaurantsJson as RouxSpot[]).find((s) => s.id === locationId);
  return spot ? isOpenAt(spot.hours) : null;
}

/** Specials for one restaurant. Any failure = no special (ADR 0005). */
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
    const res = await fetch(`${BASE}/specials?restaurant=${restaurantId}&page_size=5`, {
      headers: { "X-API-Key": key },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const first = json.specials?.[0];
    return first ? { label: first.label, description: first.description } : null;
  } catch {
    return null;
  }
}

async function listAllLocations(key: string): Promise<any[]> {
  const out: any[] = [];
  let page = 0;
  for (;;) {
    const res = await fetch(`${BASE}/locations?page=${page}&page_size=50`, {
      headers: { "X-API-Key": key },
    });
    if (!res.ok) throw new Error(`Flynet /locations ${res.status}`);
    const json = await res.json();
    const rows = json.locations ?? [];
    out.push(...rows);
    if (rows.length === 0 || page > 40) break;
    page += 1;
  }
  return out;
}

async function listAllRestaurants(key: string): Promise<Array<{ id: string; name: string }>> {
  const out: Array<{ id: string; name: string }> = [];
  let page = 0;
  for (;;) {
    const res = await fetch(`${BASE}/restaurants?page=${page}&page_size=50`, {
      headers: { "X-API-Key": key },
    });
    if (!res.ok) throw new Error(`Flynet /restaurants ${res.status}`);
    const json = await res.json();
    const rows = json.restaurants ?? [];
    for (const r of rows) out.push({ id: r.id, name: r.name });
    if (rows.length === 0 || page > 40) break;
    page += 1;
  }
  return out;
}
