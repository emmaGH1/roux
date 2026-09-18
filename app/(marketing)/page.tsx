import Link from "next/link";
import { MapView, type MapMarker } from "@/components/MapView";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { ParallaxCard } from "@/components/ParallaxCard";
import { Bezel, Check, Eyebrow, MetaChips, Pill } from "@/components/ui";
import { SiteFooter } from "@/components/SiteFooter";
import { getDataset, getSpecial, getOpenState } from "@/lib/discovery";
import { fairPoint, km, rankLocations, directionsUrl, type Point } from "@/lib/result";
import { LandingChrome } from "./LandingChrome";

export const dynamic = "force-dynamic";

/** Hero sample: three friends spread across Brooklyn and lower Manhattan. */
const HERO_PEOPLE: Point[] = [
  { lat: 40.7043, lng: -73.9213 }, // Bushwick
  { lat: 40.6700, lng: -73.9800 }, // Park Slope
  { lat: 40.7130, lng: -73.9900 }, // Lower East Side
];

/** The floating-card sample: Williamsburg ↔ Park Slope. */
const SAMPLE_PEOPLE: Point[] = [
  { lat: 40.7146, lng: -73.9572 },
  { lat: 40.6700, lng: -73.9800 },
];

const TICKER = [
  "No accounts",
  "No app install",
  "Works on any phone",
  "Fair-point centroid",
  "Straight-line ranking",
  "One link, one pick",
  "Flynet Discovery",
];

const ENDPOINTS = [
  { verb: "POST", path: "/api/meetups", note: "creates the meetup, returns a code" },
  { verb: "GET", path: "/api/meetups/{code}", note: "live headcount for the waiting room" },
  { verb: "POST", path: "/api/meetups/{code}/locations", note: "one location snapshot per person" },
  { verb: "POST", path: "/api/meetups/{code}/result", note: "fair point, ranking, pick and backups" },
];

const WONT_DO = [
  {
    title: "No star ratings.",
    body: "Roux ranks by distance from the fair point. Nothing else is invented, averaged, or scored.",
  },
  {
    title: "No fake reservations.",
    body: "Flynet has no booking action at launch, so Roux never pretends to hold a table.",
  },
  {
    title: "No accounts, no history.",
    body: "Meetups live in server memory and disappear when the process restarts. Nothing to log into.",
  },
];

export default async function MarketingPage() {
  const dataset = await getDataset();

  const mid = fairPoint(SAMPLE_PEOPLE);
  const ranked = rankLocations(mid, dataset.locations);
  const pick = ranked[0];
  const backups = ranked.slice(1, 3);
  const special = pick ? await getSpecial(pick.restaurant_id) : null;
  const pickOpen = pick ? await getOpenState(pick) : null;

  const heroMid = fairPoint(HERO_PEOPLE);
  const heroRanked = rankLocations(heroMid, dataset.locations);
  const heroPick = heroRanked[0];
  const heroBackups = heroRanked.slice(1, 3);
  const heroOpen = heroPick ? await getOpenState(heroPick) : null;

  const sampleMarkers: MapMarker[] = [
    ...SAMPLE_PEOPLE.map((p) => ({ ...p, kind: "person" as const })),
    ...(pick
      ? [
          { ...pick.coordinate, kind: "pick" as const, label: pick.restaurant_name },
          ...backups.map((b) => ({ ...b.coordinate, kind: "backup" as const })),
        ]
      : []),
  ];

  const heroMarkers: MapMarker[] = [
    ...HERO_PEOPLE.map((p) => ({ ...p, kind: "person" as const })),
    ...(heroPick
      ? [
          { ...heroPick.coordinate, kind: "pick" as const, label: heroPick.restaurant_name },
          ...heroBackups.map((b) => ({ ...b.coordinate, kind: "backup" as const })),
        ]
      : []),
  ];

  return (
    <LandingChrome>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden"
        >
          <div
            className="float-slow absolute -top-40 h-[560px] w-[880px] rounded-full opacity-[0.55] blur-[110px]"
            style={{ background: "radial-gradient(closest-side, #d5cdff, transparent)" }}
          />
          <div
            className="absolute top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-40 blur-[120px]"
            style={{ background: "radial-gradient(closest-side, #efeaff, transparent)" }}
          />
        </div>

        <div className="relative mx-auto max-w-[880px] text-center">
          <Reveal>
            <Eyebrow>FOR FRIENDS WHO CAN&rsquo;T DECIDE</Eyebrow>
          </Reveal>
          <Reveal delayMs={70}>
            <h1 className="mt-6 text-[clamp(40px,7vw,92px)] font-semibold leading-[0.98] tracking-[-0.038em]">
              Everyone meets
              <br />
              in the{" "}
              <span className="accent-serif text-[var(--violet)]">middle.</span>
            </h1>
          </Reveal>
          <Reveal delayMs={140}>
            <p className="mx-auto mt-7 max-w-[540px] text-[18px] leading-[1.65] text-[var(--gray)]">
              One tap. Everyone&rsquo;s location. One fair Blackbird restaurant,
              decided.
            </p>
          </Reveal>
          <Reveal delayMs={210}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Pill href="/start" id="cta-start" tone="violet" size="lg">
                Start a meetup
              </Pill>
              <Pill href="#how-it-works" tone="ghost" size="lg">
                How it works
              </Pill>
            </div>
          </Reveal>
          <Reveal delayMs={270}>
            <p className="mt-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--gray-light)]">
              No accounts. No apps. Just a link.
            </p>
          </Reveal>
        </div>

        {/* Live app frame — the product, not a screenshot of the product */}
        <div className="relative mx-auto mt-16 max-w-[1120px]">
          <Reveal delayMs={120}>
            <Bezel className="shadow-[var(--shadow-lg)]" coreClassName="bg-[var(--canvas-soft)]">
              <div className="relative">
                <MapView
                  markers={heroMarkers}
                  bare
                  height={540}
                  showCoordsChip
                  className="h-full w-full"
                />

                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-white/95 px-3 py-1.5 shadow-[var(--shadow-xs)]">
                  <span className="live-dot text-[var(--green)]" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--ink)]">
                    3 of us are in
                  </span>
                </div>

                {heroPick && (
                  <div className="absolute bottom-4 left-4 w-[300px] max-w-[calc(100%-2rem)] rounded-[20px] border border-[var(--hairline)] bg-white/97 p-5 shadow-[var(--shadow-md)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--violet)]">
                        Meet-here pick
                      </span>
                      {heroOpen !== null && <OpenNowBadge open={heroOpen} />}
                    </div>
                    <p className="mt-2 text-[20px] font-semibold tracking-[-0.02em]">
                      {heroPick.restaurant_name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--gray)]">
                      {heroPick.neighborhood} ·{" "}
                      <CountUp value={km(heroMid, heroPick.coordinate)} decimals={1} suffix=" km" />{" "}
                      from the middle
                    </p>
                    <MetaChips
                      cuisine={heroPick.cuisine ?? []}
                      price={heroPick.price ?? null}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </Bezel>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="mt-5 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--gray-light)]">
              Three shares in · one fair point out
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Ticker ── */}
      <section className="border-y border-[var(--hairline)] py-5">
        <div className="ticker-mask overflow-hidden">
          <div className="ticker gap-10">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-10">
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--gray)]">
                  {item}
                </span>
                <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--violet)]" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gradient band + floating card (the money shot) ── */}
      <section
        id="money-shot"
        data-money-shot
        className="grain relative overflow-hidden px-6 py-28"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(120deg, #cfc6ff 0%, #7c6cf6 45%, #4f3fc9 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-40 blur-[90px]"
          style={{ background: "radial-gradient(closest-side, #ffffff, transparent)" }}
        />

        <div className="relative mx-auto max-w-[760px]">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">
                The deciding second
              </span>
              <h2 className="mx-auto mt-6 max-w-[560px] text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
                The moment the arguing stops.
              </h2>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="mt-12">
              <ParallaxCard>
                <div className="bg-white rounded-[24px] p-7 shadow-[0_50px_90px_-40px_rgba(20,16,50,0.55)]" data-pick="true">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--violet)]">
                      MEET-HERE PICK
                    </span>
                    {pickOpen !== null && <OpenNowBadge open={pickOpen} />}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[30px] font-semibold tracking-[-0.03em]">
                        {pick?.restaurant_name ?? "The fair middle"}
                      </h3>
                      <p className="mt-1 text-[14px] text-[var(--gray)]">
                        {pick?.neighborhood}
                        {pick ? " · " : ""}
                        {pick && (
                          <CountUp value={km(mid, pick.coordinate)} decimals={1} suffix=" km" />
                        )}
                        {pick ? " from the middle" : ""}
                      </p>
                    </div>
                    {pick?.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pick.image_url}
                        alt=""
                        aria-hidden
                        className="h-14 w-14 shrink-0 rounded-[14px] border border-[var(--hairline)] object-cover"
                      />
                    )}
                  </div>

                  <MetaChips
                    cuisine={pick?.cuisine ?? []}
                    price={pick?.price ?? null}
                    className="mt-3"
                  />

                  {special && (
                    <div className="mt-5 rounded-[16px] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-4">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--gray)]">
                        TODAY&rsquo;S PERK
                      </span>
                      <p className="mt-1.5 text-[15px] font-medium">{special.label}</p>
                      <p className="text-[14px] text-[var(--gray)]">{special.description}</p>
                    </div>
                  )}

                  {backups.length > 0 && (
                    <div className="mt-5 border-t border-[var(--hairline)] pt-2">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--gray-light)]">
                        If that doesn&rsquo;t work
                      </span>
                      {backups.map((b) => (
                        <div
                          key={b.location_id}
                          className="flex items-center justify-between gap-4 border-b border-[var(--hairline)] py-3 last:border-b-0"
                        >
                          <span className="text-[15px] font-medium">{b.restaurant_name}</span>
                          <span className="shrink-0 font-[family-name:var(--font-mono)] text-[12px] text-[var(--gray)]">
                            {b.neighborhood} · {km(mid, b.coordinate)} km
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    href={pick ? directionsUrl(pick.coordinate) : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-life mt-6 flex h-[52px] items-center justify-center rounded-full bg-[var(--violet)] text-[15px] font-medium text-white hover:bg-[var(--violet-deep)]"
                  >
                    Get directions
                  </a>
                </div>
              </ParallaxCard>
            </div>
          </Reveal>

          <Reveal delayMs={200}>
            <p className="mt-6 text-center text-[13px] text-white/85">
              Live sample. The real pick computes from everyone&rsquo;s location.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The fair middle ── */}
      <section id="fair-middle" className="px-6 py-28">
        <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-1 items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
          <Reveal>
            {/* One live map per page: the hero owns the WebGL context, this one
                is a still of the same treatment. */}
            <Bezel className="shadow-[var(--shadow-lg)]" coreClassName="bg-[var(--canvas-soft)]">
              <MapView markers={sampleMarkers} bare height={460} showCoordsChip preferStatic />
            </Bezel>
          </Reveal>

          <Reveal delayMs={110}>
            <Eyebrow>THE FAIR MIDDLE</Eyebrow>
            <h2 className="mt-6 text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.06] tracking-[-0.03em]">
              One tap from everyone.
              <br />
              One point that&rsquo;s{" "}
              <span className="accent-serif text-[var(--violet)]">fair.</span>
            </h2>
            <p className="mt-6 max-w-[460px] text-[16px] leading-[1.65] text-[var(--gray)]">
              Roux averages everyone&rsquo;s location, ranks every Blackbird room
              by straight-line distance, and calls it. No arguments. No scrolling
              maps.
            </p>

            <ul className="mt-9 border-t border-[var(--hairline)]">
              {[
                "Fair-point average of all locations",
                "Straight-line distance ranking",
                "Pick plus two backups, decided instantly",
              ].map((row) => (
                <li
                  key={row}
                  className="flex items-center gap-3 border-b border-[var(--hairline)] py-4 text-[15px]"
                >
                  <Check className="text-[var(--violet)]" />
                  {row}
                </li>
              ))}
            </ul>

            {/* Two columns on a phone: three mono labels don't fit at 375px. */}
            <div className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {[
                { n: <CountUp value={dataset.locations.length} />, label: "rooms considered" },
                { n: <CountUp value={1} />, label: "fair point" },
                { n: <CountUp value={backups.length} />, label: "backups ready" },
              ].map((m, i) => (
                <div key={i}>
                  <span className="block text-[28px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
                    {m.n}
                  </span>
                  <span className="mt-1 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 pb-28">
        <div className="mx-auto max-w-[var(--page-max)]">
          <Reveal>
            <div className="max-w-[560px]">
              <Eyebrow>HOW IT WORKS</Eyebrow>
              <h2 className="mt-6 text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.06] tracking-[-0.03em]">
                Three taps to a table.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* 01 — start */}
            <Reveal className="md:col-span-5" delayMs={0}>
              <Bezel className="lift h-full" coreClassName="p-7">
                <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium text-[var(--violet)]">
                  01
                </span>
                <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em]">
                  Start a meetup. Share the link.
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-[var(--gray)]">
                  One button creates the room. You get a short link to drop in the
                  chat.
                </p>
                <div className="mt-7 flex items-center gap-3 rounded-full border border-[var(--hairline)] bg-[var(--canvas-soft)] py-1.5 pl-4 pr-1.5">
                  <span className="truncate font-[family-name:var(--font-mono)] text-[12px] text-[var(--gray)]">
                    roux.app/m/7QK2P
                  </span>
                  <span className="ml-auto shrink-0 rounded-full bg-white px-3 py-1 text-[12px] font-medium shadow-[var(--shadow-xs)]">
                    Copy
                  </span>
                </div>
              </Bezel>
            </Reveal>

            {/* 02 — tap */}
            <Reveal className="md:col-span-7" delayMs={90}>
              <Bezel className="lift h-full" coreClassName="p-7">
                <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium text-[var(--violet)]">
                  02
                </span>
                <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em]">
                  Friends each tap once to drop their spot.
                </h3>
                <p className="mt-3 max-w-[420px] text-[15px] leading-[1.6] text-[var(--gray)]">
                  One location snapshot per phone, taken once. No accounts, no
                  address typing, no live tracking afterwards.
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {["#0c0c10", "#7c6cf6", "#c7c0f9"].map((c, i) => (
                      <span
                        key={c}
                        className="grid h-10 w-10 place-items-center rounded-full border-[3px] border-white text-[12px] font-semibold text-white shadow-[var(--shadow-sm)]"
                        style={{ background: c }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-2 rounded-full border border-[var(--hairline)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
                    <span className="live-dot text-[var(--green)]" />
                    3 of us are in
                  </span>
                </div>
              </Bezel>
            </Reveal>

            {/* 03 — pick */}
            <Reveal className="md:col-span-12" delayMs={160}>
              <Bezel className="lift" coreClassName="p-7">
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.1fr]">
                  <div>
                    <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium text-[var(--violet)]">
                      03
                    </span>
                    <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em]">
                      Roux picks the fair middle. You walk there.
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-[var(--gray)]">
                      One pick, two backups, and a directions link. The group
                      stops deliberating and starts moving.
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--violet)]">
                        THE PICK
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--gray)]">
                        {pick ? `${km(mid, pick.coordinate)} km from the middle` : ""}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[18px] font-semibold tracking-[-0.02em]">
                          {pick?.restaurant_name ?? "The fair middle"}
                        </p>
                        <p className="text-[13px] text-[var(--gray)]">{pick?.neighborhood}</p>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--violet)] text-white shadow-[var(--shadow-violet)]">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path
                            d="M3.5 8h9M8.5 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Bezel>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Built on Flynet ── */}
      <section id="flynet" className="border-y border-[var(--hairline)] bg-[var(--canvas-soft)] px-6 py-28">
        <div className="mx-auto grid max-w-[var(--page-max)] grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <Eyebrow>WHY RESTAURANTS LOVE IT</Eyebrow>
            <h2 className="mt-6 max-w-[520px] text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.06] tracking-[-0.03em]">
              A stalled group chat becomes a booked table.
            </h2>
            <p className="mt-6 max-w-[500px] text-[16px] leading-[1.65] text-[var(--gray)]">
              Every undecided thread is a table that never gets booked. Roux
              converts indecision into a group visit at a real Blackbird
              restaurant — and surfaces a current special to turn intent into
              covers and spend.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {[
                dataset.source === "flynet"
                  ? `Live Discovery: ${dataset.locations.length} locations cached in server memory`
                  : `Sample data: ${dataset.locations.length} fixture locations`,
                "API key stays server-side",
                "Specials fetched only for the pick",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[var(--hairline)] bg-white px-3.5 py-2 text-[13px] text-[var(--ink-soft)]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delayMs={110}>
            <Bezel coreClassName="p-2">
              <div className="px-5 pt-5 pb-2">
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
                  BUILT ON FLYNET
                </span>
                <p className="mt-2 text-[14px] text-[var(--gray)]">
                  The browser never talks to Flynet directly. It talks to these
                  four routes.
                </p>
              </div>
              <ul className="px-2 pb-2">
                {ENDPOINTS.map((e) => (
                  <li
                    key={e.path}
                    className="flex items-center gap-3 rounded-[14px] px-3 py-3.5 transition-colors hover:bg-[var(--canvas-soft)]"
                  >
                    <span
                      className={`shrink-0 rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.08em] ${
                        e.verb === "POST"
                          ? "bg-[var(--violet-soft)] text-[var(--violet-deep)]"
                          : "bg-[var(--canvas-soft)] text-[var(--gray)]"
                      }`}
                    >
                      {e.verb}
                    </span>
                    <span className="truncate font-[family-name:var(--font-mono)] text-[12px] text-[var(--ink)]">
                      {e.path}
                    </span>
                    <span className="ml-auto hidden shrink-0 text-[12px] text-[var(--gray-light)] xl:block">
                      {e.note}
                    </span>
                  </li>
                ))}
              </ul>
            </Bezel>
          </Reveal>
        </div>
      </section>

      {/* ── Honesty ── */}
      <section id="honesty" className="px-6 py-28">
        <div className="mx-auto max-w-[var(--page-max)]">
          <Reveal>
            <div className="max-w-[560px]">
              <Eyebrow>WHAT ROUX WON&rsquo;T DO</Eyebrow>
              <h2 className="mt-6 text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.06] tracking-[-0.03em]">
                Honest by default.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
            {WONT_DO.map((item, i) => (
              <Reveal key={item.title} delayMs={i * 90}>
                <div className="border-t border-[var(--hairline-strong)] pt-6">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--gray-light)]">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-[19px] font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-[var(--gray)]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={200}>
            <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-[24px] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-7 py-6 sm:flex-row sm:items-center">
              <p className="max-w-[520px] text-[15px] leading-[1.6] text-[var(--ink-soft)]">
                Ready to end the thread? A meetup takes one tap to start and one
                link to fill.
              </p>
              <Link
                href="/start"
                className="btn-life inline-flex h-11 items-center rounded-full bg-[var(--ink)] px-6 text-[15px] font-medium text-white hover:bg-black"
              >
                Start a meetup
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter status={{ source: dataset.source, reason: dataset.reason }} />
    </LandingChrome>
  );
}
