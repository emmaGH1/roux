import Link from "next/link";
import { redirect } from "next/navigation";
import { PaperMap } from "@/components/PaperMap";
import { searchRoux } from "@/lib/flynet/adapter";
import { lookupZip } from "@/lib/zips";

type PageProps = {
  searchParams: Promise<{ a?: string; b?: string; now?: string; beat?: string }>;
};

export default async function MeetResultsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const a = typeof searchParams.a === "string" ? searchParams.a : "";
  const b = typeof searchParams.b === "string" ? searchParams.b : "";
  const beat = typeof searchParams.beat === "string" ? searchParams.beat : undefined;

  if (!a || !b) {
    redirect("/meet");
  }

  const zipA = lookupZip(a);
  const zipB = lookupZip(b);

  if (!zipA || !zipB) {
    redirect("/meet");
  }

  const now = typeof searchParams.now === "string" ? new Date(searchParams.now) : undefined;
  const { mid, apartKm, spots, source } = await searchRoux({
    a: { lat: zipA.lat, lng: zipA.lng },
    b: { lat: zipB.lat, lng: zipB.lng },
    now,
  });

  const marks = [
    { lat: zipA.lat, lng: zipA.lng, kind: "person" as const, label: zipA.name },
    { lat: zipB.lat, lng: zipB.lng, kind: "person" as const, label: zipB.name },
    { lat: mid.lat, lng: mid.lng, kind: "roux" as const },
    ...spots.map((s) => ({
      lat: s.lat,
      lng: s.lng,
      kind: "spot" as const,
      label: s.name,
    })),
  ];

  return (
    <div data-source={source} className="w-full">
      {/* Back link */}
      <div className="mb-4">
        <Link
          href={`/meet?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}${beat ? `&beat=${beat}` : ""}`}
          className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)] hover:text-[var(--ink)] inline-block transition-colors"
        >
          ← Change places
        </Link>
      </div>

      {/* Header and PaperMap */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
        <div className="flex-1">
          <span className="block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)] mb-1">
            OPEN NOW · AMERICA/NEW_YORK
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-[28px] leading-tight tracking-[-0.02em] text-[var(--ink)] mb-2">
            The middle
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.08em] text-[var(--ink-mute)]">
            {spots.length} rooms · {apartKm} km apart · Roux at {mid.lat.toFixed(4)}, {mid.lng.toFixed(4)}
          </p>
        </div>

        <div className="w-full sm:w-[220px] shrink-0 border border-[var(--rule)]">
          <PaperMap marks={marks} />
        </div>
      </div>

      {/* Results or Empty State */}
      {spots.length === 0 ? (
        <div className="py-12 border-t border-[var(--rule)]">
          <p className="font-[family-name:var(--font-body)] text-[18px] text-[var(--ink-mute)]">
            Nothing open near the middle right now. Try two closer ZIPs.
          </p>
        </div>
      ) : (
        <ol
          id="results-list"
          data-count={spots.length}
          className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]"
        >
          {spots.map((spot, index) => {
            const isHighlighted = beat === "5" && index === 0;
            return (
              <li key={spot.id}>
                <Link
                  href={`/spot/${spot.id}?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}${beat ? `&beat=${beat}` : ""}`}
                  data-open="true"
                  data-fly={spot.hasFlySpecial ? "true" : "false"}
                  className={`flex items-baseline justify-between py-3 px-2 -mx-2 transition-colors group ${
                    isHighlighted ? "bg-[var(--paper-dark)]" : "hover:bg-[var(--paper-dark)]"
                  }`}
                >
                <div className="flex items-baseline gap-2 min-w-0 pr-4">
                  <span className="font-[family-name:var(--font-display)] text-base sm:text-lg text-[var(--ink)] truncate group-hover:text-[var(--wine)] transition-colors">
                    {spot.name}
                  </span>
                  <span className="text-[var(--ink-mute)] text-xs font-[family-name:var(--font-mono)]">
                    ·
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-mute)] truncate">
                    {spot.neighborhood}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 shrink-0 font-[family-name:var(--font-mono)] text-xs">
                  <span className="text-[var(--ink-mute)]">{spot.kmFromMid} km</span>
                  <span className="text-[var(--wine)] font-semibold uppercase tracking-[0.08em]">
                    OPEN
                  </span>
                  {spot.hasFlySpecial && (
                    <span
                      title="FLY special on"
                      className="border border-[var(--wine)] text-[var(--wine)] px-1 py-0.2 text-[10px] font-semibold uppercase tracking-[0.08em]"
                    >
                      FLY
                    </span>
                  )}
                </div>
              </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
