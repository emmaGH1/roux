import { notFound } from "next/navigation";
import { todayHours } from "@/lib/openNow";
import { SpotView } from "./SpotView";
import type { RouxSpot } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ a?: string; b?: string; now?: string }>;
};

async function getSpot(id: string): Promise<{ spot: RouxSpot | undefined; source: "fixture" | "flynet" }> {
  const useFixtures = process.env.USE_FIXTURES !== "false";
  if (useFixtures || !process.env.FLYNET_API_KEY) {
    const { fixtureSpot } = await import("@/lib/flynet/fixture");
    return { spot: fixtureSpot(id), source: "fixture" };
  }
  const { liveSpots } = await import("@/lib/flynet/live");
  const spots = await liveSpots();
  return { spot: spots.find((s) => s.id === id), source: "flynet" };
}

export default async function SpotPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { spot, source } = await getSpot(params.id);
  if (!spot) {
    notFound();
  }

  const now = typeof searchParams.now === "string" ? new Date(searchParams.now) : new Date();
  const th = todayHours(spot.hours, now);
  const hoursText = th ? `Today ${th.open_time}–${th.close_time}` : "Closed today";

  const priceText = spot.price ? "$".repeat(Math.min(4, Math.max(1, spot.price))) : null;
  const factsParts: string[] = [];
  if (spot.cuisine && spot.cuisine.length > 0) {
    factsParts.push(spot.cuisine.join(" — "));
  }
  if (priceText) {
    factsParts.push(priceText);
  }
  const factsText = factsParts.join(" · ");

  return (
    <SpotView
      spot={spot}
      source={source}
      hoursText={hoursText}
      factsText={factsText}
      a={searchParams.a}
      b={searchParams.b}
    />
  );
}
