import type { RouxResult, RouxSpot } from "../types";
import { km, midpoint, type LatLng } from "../geo";
import { isOpenAt } from "../openNow";

export type SearchInput = { a: LatLng; b: LatLng; now?: Date };

export async function searchRoux(input: SearchInput): Promise<{
  mid: LatLng;
  apartKm: number;
  spots: RouxResult[];
  source: "fixture" | "flynet";
}> {
  const mid = midpoint(input.a, input.b);
  const now = input.now ?? new Date();
  const { spots, source } = await loadSpots();
  const ranked = spots
    .map((s) => {
      const openNow = isOpenAt(s.hours, now);
      return {
        ...s,
        kmFromMid: km(mid, { lat: s.lat, lng: s.lng }),
        openNow,
        hasFlySpecial: s.specials.some((x) => x.fly_reward),
      };
    })
    .filter((s) => s.openNow)
    .sort((x, y) => {
      if (x.hasFlySpecial !== y.hasFlySpecial) return x.hasFlySpecial ? -1 : 1;
      return x.kmFromMid - y.kmFromMid;
    });

  return { mid, apartKm: km(input.a, input.b), spots: ranked, source };
}

async function loadSpots(): Promise<{ spots: RouxSpot[]; source: "fixture" | "flynet" }> {
  const useFixtures = process.env.USE_FIXTURES !== "false";
  if (useFixtures || !process.env.FLYNET_API_KEY) {
    const { fixtureSpots } = await import("./fixture");
    return { spots: fixtureSpots(), source: "fixture" };
  }
  const { liveSpots } = await import("./live");
  return { spots: await liveSpots(), source: "flynet" };
}
