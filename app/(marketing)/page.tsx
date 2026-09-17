import Link from "next/link";
import { MapView, type MapMarker } from "@/components/MapView";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { ParallaxCard } from "@/components/ParallaxCard";
import { getDataset, getSpecial, openNowAt } from "@/lib/discovery";
import { fairPoint, km, rankLocations, directionsUrl, type Point } from "@/lib/result";
import { LandingChrome } from "./LandingChrome";

export const dynamic = "force-dynamic";

/** Demo people for the sample: two fixture points in Brooklyn. */
const SAMPLE_PEOPLE: Point[] = [
  { lat: 40.7146, lng: -73.9572 }, // Williamsburg
  { lat: 40.6700, lng: -73.9800 }, // Park Slope-ish
];

export default async function MarketingPage() {
  const dataset = await getDataset();
  const mid = fairPoint(SAMPLE_PEOPLE);
  const ranked = rankLocations(mid, dataset.locations);
  const pick = ranked[0];
  const backups = ranked.slice(1, 3);
  const special = pick ? await getSpecial(pick.restaurant_id) : null;

  const sampleMarkers: MapMarker[] = [
    ...SAMPLE_PEOPLE.map((p) => ({ ...p, kind: "person" as const })),
    ...(pick
      ? [
          { ...pick.coordinate, kind: "pick" as const, label: pick.restaurant_name },
          ...backups.map((b) => ({ ...b.coordinate, kind: "backup" as const })),
        ]
      : []),
  ];

  return (
    <LandingChrome>
      {/* ── Hero ── */}
      <section className="text-center px-6 pt-24 pb-20">
        <Reveal>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
            FOR FRIENDS WHO CAN&rsquo;T DECIDE
          </span>
        </Reveal>
        <Reveal delayMs={80}>
          <h1 className="text-[clamp(44px,6vw,76px)] leading-[1.05] tracking-[-0.03em] font-semibold mt-5 mb-6">
            Everyone meets
            <br />
            in the middle.
          </h1>
        </Reveal>
        <Reveal delayMs={160}>
          <p className="text-[18px] text-[var(--gray)] max-w-[520px] mx-auto leading-[1.6] mb-8">
            One tap. Everyone&rsquo;s location. One fair Blackbird restaurant, decided.
          </p>
        </Reveal>
        <Reveal delayMs={240}>
          <div className="flex items-center justify-center gap-3">
            <Link
              id="cta-start"
              href="/start"
              className="btn-life h-12 leading-[3rem] px-7 bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-[15px] font-medium rounded-full"
            >
              Start a meetup
            </Link>
            <a
              href="#how-it-works"
              className="btn-life h-12 leading-[3rem] px-7 bg-[#F3F4F6] hover:bg-[#E9EAEC] text-[var(--ink)] text-[15px] font-medium rounded-full"
            >
              How it works
            </a>
          </div>
        </Reveal>
        <Reveal delayMs={320}>
          <p className="text-[13px] text-[var(--gray)] mt-5">
            No accounts. No apps. Just a link.
          </p>
        </Reveal>
      </section>

      {/* ── Gradient band + floating app card (the money shot) ── */}
      <section className="relative overflow-hidden py-24 px-6" data-money-shot>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, #c7c0f9 0%, #7c6cf6 45%, #5b4bd4 100%)",
          }}
        />
        <div className="relative max-w-[720px] mx-auto">
          <Reveal>
            <ParallaxCard>
              <div className="bg-white rounded-2xl shadow-2xl p-7" data-pick="true">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--violet)] font-medium">
                    MEET-HERE PICK
                  </span>
                  {pick && <OpenNowBadge open={openNowAt(pick.location_id) ?? false} />}
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <h3 className="text-[26px] font-semibold tracking-tight">
                    {pick?.restaurant_name ?? "The fair middle"}
                  </h3>
                  <span className="text-[13px] text-[var(--gray)]">
                    {pick ? <CountUp value={km(mid, pick.coordinate)} decimals={1} suffix=" km" /> : ""}
                  </span>
                </div>
                <p className="text-[14px] text-[var(--gray)] mt-1">
                  {pick?.neighborhood}
                  {pick ? ` · ${km(mid, pick.coordinate)} km from the middle` : ""}
                </p>

              {special && (
                <div className="mt-4 bg-[var(--canvas-soft)] border border-[var(--border)] rounded-xl p-4">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--gray)]">
                    TODAY&rsquo;S PERK
                  </span>
                  <p className="text-[15px] font-medium mt-1">{special.label}</p>
                  <p className="text-[14px] text-[var(--gray)]">{special.description}</p>
                </div>
              )}

              <a
                href={pick ? directionsUrl(pick.coordinate) : "#"}
                className="btn-life mt-5 block text-center h-12 leading-[3rem] bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-[15px] font-medium rounded-full"
              >
                Get directions
              </a>
              </div>
            </ParallaxCard>
          </Reveal>
          <Reveal delayMs={150}>
            <p className="text-center text-[13px] text-white/85 mt-5">
              Live sample. The real pick computes from everyone&rsquo;s location.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Map section: the fair middle ── */}
      <section className="py-24 px-6 bg-[var(--canvas-soft)]">
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <MapView markers={sampleMarkers} showCoordsChip height={420} />
          </Reveal>
          <Reveal delayMs={120}>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
              THE FAIR MIDDLE
            </span>
            <h2 className="text-[clamp(28px,3.4vw,40px)] leading-[1.15] tracking-[-0.02em] font-semibold mt-4 mb-5">
              One tap from everyone.
              <br />
              One point that&rsquo;s fair.
            </h2>
            <p className="text-[16px] text-[var(--gray)] leading-[1.6] mb-8">
              Roux averages everyone&rsquo;s location, ranks every Blackbird room by
              straight-line distance, and calls it. No arguments. No scrolling maps.
            </p>
            <ul className="divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
              {[
                "Fair-point average of all locations",
                "Straight-line distance ranking",
                "Pick plus two backups, decided instantly",
              ].map((row) => (
                <li key={row} className="flex items-center gap-3 py-3.5 text-[15px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[var(--violet)]">
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {row}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-[720px] mx-auto text-center">
          <Reveal>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
              HOW IT WORKS
            </span>
            <h2 className="text-[clamp(28px,3.4vw,40px)] tracking-[-0.02em] font-semibold mt-4 mb-12">
              Three taps to a table.
            </h2>
          </Reveal>
          <div className="text-left divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
            {[
              "Start a meetup. Share the link.",
              "Friends each tap once to drop their spot.",
              "Roux picks the fair middle. You walk there.",
            ].map((line, i) => (
              <Reveal key={line} delayMs={i * 80}>
                <div className="flex items-baseline gap-6 py-6">
                  <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--violet)] font-medium">
                    0{i + 1}
                  </span>
                  <span className="text-[19px] font-medium">{line}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delayMs={240}>
            <Link
              href="/start"
              className="btn-life inline-block mt-12 h-12 leading-[3rem] px-8 bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-[15px] font-medium rounded-full"
            >
              Start a meetup
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Why restaurants love it (PNL) ── */}
      <section className="py-24 px-6 bg-[var(--canvas-soft)]">
        <div className="max-w-[720px] mx-auto text-center">
          <Reveal>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
              WHY RESTAURANTS LOVE IT
            </span>
            <h2 className="text-[clamp(28px,3.4vw,40px)] leading-[1.15] tracking-[-0.02em] font-semibold mt-4 mb-6">
              A stalled group chat becomes a booked table.
            </h2>
            <p className="text-[16px] text-[var(--gray)] leading-[1.6] max-w-[560px] mx-auto">
              Every undecided thread is a table that never gets booked. Roux converts
              indecision into a group visit at a real Blackbird restaurant — and
              surfaces a current special to turn intent into covers and spend.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[var(--gray)]">
          <span className="font-medium text-[var(--ink)]">Roux — Everyone meets in the middle.</span>
          <span>Built on Flynet · Runtime Agent Week 2026</span>
        </div>
      </footer>
    </LandingChrome>
  );
}
