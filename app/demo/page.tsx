import { redirect } from "next/navigation";
import { ensureDemoMeetup } from "@/lib/meetups";

type DemoPageProps = {
  searchParams: Promise<{ beat?: string; people?: string }>;
};

const DEMO_CODE = "DEMO1";
const DEMO_POINTS = [
  { lat: 40.7146, lng: -73.9572 }, // Williamsburg
  { lat: 40.67, lng: -73.98 }, // Park Slope-ish
];
const EXTRA_POINTS = [
  { lat: 40.7226, lng: -73.9893 }, // East Village
  { lat: 40.7005, lng: -73.9897 }, // DUMBO
];

export default async function DemoPage(props: DemoPageProps) {
  const searchParams = await props.searchParams;
  const beat = searchParams.beat ? parseInt(searchParams.beat, 10) : 1;

  // Seed the demo meetup so beats 3/4 always work. `people=N` seeds a bigger
  // group for the video (e.g. /demo?beat=4&people=4).
  const people = searchParams.people ? parseInt(searchParams.people, 10) : 2;
  const points =
    people > 2 ? [...DEMO_POINTS, ...EXTRA_POINTS].slice(0, Math.min(4, people)) : DEMO_POINTS;
  ensureDemoMeetup(DEMO_CODE, points);

  const targets: Record<number, string> = {
    1: "/",
    2: "/start",
    3: `/m/${DEMO_CODE}`,
    4: `/m/${DEMO_CODE}/result`,
    5: "/meet?a=11211&b=11215",
  };

  redirect(targets[beat] ?? "/");
}
