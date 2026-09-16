import type { OpenHour, RouxSpot, Special } from "../types";

const BASE = "https://api.staging.blackbird.xyz/flynet/v1";

/**
 * Live Flynet. Only used when USE_FIXTURES=false and FLYNET_API_KEY is set.
 * Map only documented fields. Skip a location if it has no coordinates.
 */
export async function liveSpots(): Promise<RouxSpot[]> {
  const key = process.env.FLYNET_API_KEY;
  if (!key) throw new Error("FLYNET_API_KEY missing");

  const locations = await listAll("/locations", "locations", key);
  const spots: RouxSpot[] = [];

  for (const loc of locations) {
    const lat = loc.coordinate?.latitude;
    const lng = loc.coordinate?.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") continue;

    const hours = await getHours(loc.id, key);
    const specials = await getSpecials(loc.restaurant?.id, key);

    spots.push({
      id: loc.id,
      name: loc.restaurant?.name ?? loc.name ?? "Restaurant",
      neighborhood: loc.neighborhood?.name ?? "",
      cuisine: loc.restaurant?.cuisine ?? [],
      price: loc.restaurant?.price ?? null,
      lat,
      lng,
      hours,
      specials,
      payments_enabled: Boolean(loc.payments_enabled),
      is_club: Boolean(loc.is_club),
    });
  }
  return spots;
}

async function listAll(path: string, keyName: string, apiKey: string): Promise<any[]> {
  const out: any[] = [];
  let page = 0;
  for (;;) {
    const res = await fetch(`${BASE}${path}?page=${page}&page_size=50`, {
      headers: { "X-API-Key": apiKey },
      next: { revalidate: 120 },
    });
    if (!res.ok) throw new Error(`Flynet ${path} ${res.status}`);
    const json = await res.json();
    const rows = json[keyName] ?? [];
    out.push(...rows);
    if (!json.pagination?.next_page && json.pagination?.next_page !== 0) break;
    if (rows.length === 0) break;
    page += 1;
    if (page > 40) break;
  }
  return out;
}

async function getHours(id: string, apiKey: string): Promise<OpenHour[]> {
  const res = await fetch(`${BASE}/locations/${id}/open_hours`, {
    headers: { "X-API-Key": apiKey },
    next: { revalidate: 120 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.open_hours ?? []).map((h: any) => ({
    day_of_week: h.day_of_week,
    open_time: h.open_time,
    close_time: h.close_time,
  }));
}

async function getSpecials(restaurantId: string | undefined, apiKey: string): Promise<Special[]> {
  if (!restaurantId) return [];
  const res = await fetch(`${BASE}/specials?restaurant=${restaurantId}&page_size=20`, {
    headers: { "X-API-Key": apiKey },
    next: { revalidate: 120 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.specials ?? []).map((s: any) => ({
    id: s.id,
    label: s.label,
    description: s.description,
    fly_reward: Boolean(s.fly_reward),
  }));
}
