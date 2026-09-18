import { redirect } from "next/navigation";
import { getDataset, getSpecial, getOpenState } from "@/lib/discovery";
import { fairPoint, km, rankLocations, directionsUrl, type Point } from "@/lib/result";
import { lookupZip } from "@/lib/zips";
import { ResultClient } from "@/app/(product)/m/[code]/result/ResultClient";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ a?: string; b?: string }>;
};

export default async function MeetResultsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const a = typeof searchParams.a === "string" ? searchParams.a : "";
  const b = typeof searchParams.b === "string" ? searchParams.b : "";

  if (!a || !b) redirect("/meet");

  const zipA = lookupZip(a);
  const zipB = lookupZip(b);
  if (!zipA || !zipB) redirect("/meet");

  const dataset = await getDataset();
  const people: Point[] = [
    { lat: zipA.lat, lng: zipA.lng },
    { lat: zipB.lat, lng: zipB.lng },
  ];
  const mid = fairPoint(people);
  const ranked = rankLocations(mid, dataset.locations);
  const top = ranked.slice(0, 3);
  if (top.length === 0) redirect("/meet");

  const pick = top[0];
  const special = await getSpecial(pick.restaurant_id);
  const open = await getOpenState(pick);

  const payload = {
    source: dataset.source,
    mid,
    people,
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
    backups: top.slice(1).map((bk) => ({
      restaurant_name: bk.restaurant_name,
      neighborhood: bk.neighborhood,
      coordinate: bk.coordinate,
      distance_km: km(mid, bk.coordinate),
      directions_url: directionsUrl(bk.coordinate),
    })),
  };

  return (
    <div className="pt-8" data-source={dataset.source}>
      <div className="mb-4">
        <a
          href="/meet"
          className="text-sm text-[var(--gray)] hover:text-[var(--ink)] transition-colors"
        >
          ← Change places
        </a>
      </div>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)] mb-2">
        {zipA.zip} + {zipB.zip} · {people.length} people
      </p>
      <ResultClient payload={payload} />
    </div>
  );
}
