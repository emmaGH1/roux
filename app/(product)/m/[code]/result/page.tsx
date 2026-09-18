import { notFound, redirect } from "next/navigation";
import { getMeetup } from "@/lib/meetups";
import { getDataset, getSpecial, getOpenState, type DiscoveryLocation } from "@/lib/discovery";
import { fairPoint, km, rankLocations, directionsUrl, type Point } from "@/lib/result";
import { ResultClient } from "./ResultClient";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const meetup = await getMeetup(code);
  if (!meetup) notFound();
  if (meetup.locations.length < 2) {
    redirect(`/m/${code}`);
  }

  const dataset = await getDataset();
  const mid: Point = fairPoint(meetup.locations);
  const ranked: DiscoveryLocation[] = rankLocations(mid, dataset.locations);
  const top = ranked.slice(0, 3);

  if (top.length === 0) notFound();

  const pick = top[0];
  const special = await getSpecial(pick.restaurant_id);
  // Hours are a per-location route; fetched for the pick only, never for backups.
  const open = await getOpenState(pick);

  const payload = {
    source: dataset.source,
    mid,
    people: meetup.locations,
    pick: {
      restaurant_name: pick.restaurant_name,
      neighborhood: pick.neighborhood,
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
      restaurant_name: b.restaurant_name,
      neighborhood: b.neighborhood,
      coordinate: b.coordinate,
      distance_km: km(mid, b.coordinate),
      directions_url: directionsUrl(b.coordinate),
    })),
  };

  return <ResultClient payload={payload} />;
}
