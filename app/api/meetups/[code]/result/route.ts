import { NextResponse } from "next/server";
import { getMeetup } from "@/lib/meetups";
import { getDataset, getSpecial, getOpenState } from "@/lib/discovery";
import { fairPoint, km, rankLocations, directionsUrl } from "@/lib/result";

/**
 * POST /api/meetups/[code]/result — the core loop (PRD §5, §7).
 * Centroid of all snapshots → haversine rank → pick + 2 backups.
 * Special fetched only for the pick; failure = omitted silently (ADR 0005).
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const meetup = await getMeetup(code);
  if (!meetup) {
    return NextResponse.json({ error: "Meetup not found" }, { status: 404 });
  }
  if (meetup.locations.length < 2) {
    return NextResponse.json(
      { error: "Need at least 2 shared locations" },
      { status: 400 }
    );
  }

  const dataset = await getDataset();
  const mid = fairPoint(meetup.locations);
  const ranked = rankLocations(mid, dataset.locations);
  const top = ranked.slice(0, 3);

  if (top.length === 0) {
    return NextResponse.json({ error: "No locations available" }, { status: 502 });
  }

  const pick = top[0];
  const special = await getSpecial(pick.restaurant_id);
  const open = await getOpenState(pick);

  return NextResponse.json({
    source: dataset.source,
    midpoint: mid,
    pick: {
      location_id: pick.location_id,
      restaurant_name: pick.restaurant_name,
      neighborhood: pick.neighborhood,
      region: pick.region,
      address: pick.address,
      coordinate: pick.coordinate,
      distance_km: km(mid, pick.coordinate),
      open,
      special,
      cuisine: pick.cuisine,
      price: pick.price,
      image_url: pick.image_url,
      directions_url: directionsUrl(pick.coordinate),
    },
    backups: top.slice(1).map((b) => ({
      location_id: b.location_id,
      restaurant_name: b.restaurant_name,
      neighborhood: b.neighborhood,
      coordinate: b.coordinate,
      distance_km: km(mid, b.coordinate),
      directions_url: directionsUrl(b.coordinate),
    })),
  });
}
