import { redirect } from "next/navigation";

type DemoPageProps = {
  searchParams: Promise<{ beat?: string }>;
};

const BEAT_ROUTES: Record<number, string> = {
  1: "/?beat=1",
  2: "/meet?beat=2",
  3: "/meet?a=11211&b=11215&beat=3",
  4: "/meet?a=11211&b=11215&beat=4",
  5: "/meet/results?a=11211&b=11215&beat=5",
  6: "/spot/flybar?a=11211&b=11215&beat=6",
};

export default async function DemoPage(props: DemoPageProps) {
  const searchParams = await props.searchParams;
  const beat = searchParams.beat ? parseInt(searchParams.beat, 10) : 1;
  const target = BEAT_ROUTES[beat] ?? "/?beat=1";
  redirect(target);
}
