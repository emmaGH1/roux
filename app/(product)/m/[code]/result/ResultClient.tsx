"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapView, type MapMarker } from "@/components/MapView";
import { CountUp } from "@/components/CountUp";
import { OpenNowBadge } from "@/components/OpenNowBadge";

type ResultPayload = {
  source: "fixture" | "flynet";
  mid: { lat: number; lng: number };
  people: Array<{ lat: number; lng: number }>;
  pick: {
    restaurant_name: string;
    neighborhood: string;
    address: string;
    coordinate: { lat: number; lng: number };
    distance_km: number;
    open: boolean | null;
    special: { label: string; description: string } | null;
    directions_url: string;
  };
  backups: Array<{
    restaurant_name: string;
    neighborhood: string;
    coordinate: { lat: number; lng: number };
    distance_km: number;
    directions_url: string;
  }>;
};

const STAGES = ["Reading the group…", "Scanning every Blackbird room…"] as const;

export function ResultClient({ payload }: { payload: ResultPayload }) {
  const [stage, setStage] = useState(0);
  const cinematic = payload.people.length > 0;

  /* The deciding sequence: status line ticks through stages while the map's
     radar sweeps; the pick card slides up as the pin lands. Any tap skips.
     Starts only once the page is visible — hidden tabs throttle timers, and
     the sequence must not sit half-finished when the user switches back. */
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setStage(3);
      return;
    }

    let timers: ReturnType<typeof setTimeout>[] = [];
    const begin = () => {
      timers = [
        setTimeout(() => setStage(1), 1200),
        setTimeout(() => setStage(2), 2750),
        setTimeout(() => setStage(3), 3350),
      ];
    };

    if (document.visibilityState === "visible") {
      begin();
    } else {
      document.addEventListener("visibilitychange", begin, { once: true });
    }
    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener("visibilitychange", begin);
    };
  }, []);

  const markers: MapMarker[] = [
    ...payload.people.map((p) => ({ ...p, kind: "person" as const })),
    ...payload.backups.map((b) => ({ ...b.coordinate, kind: "backup" as const })),
    {
      ...payload.pick.coordinate,
      kind: "pick" as const,
      label: payload.pick.restaurant_name,
    },
  ];

  const decided = stage >= 2;
  const scanning = cinematic && stage < 2;

  return (
    <div className="pt-8" onClick={() => setStage(3)}>
      {/* Map first — the moment */}
      <div className="relative">
        <MapView markers={markers} showCoordsChip height={300} cinematic sweepCenter={payload.mid} />
        {scanning && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 rounded-full px-4 py-2 shadow-sm">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--violet)] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--violet)]" />
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink)] whitespace-nowrap">
              {STAGES[stage]}
            </span>
          </div>
        )}
      </div>

      {/* Pick card — slides up as the pin lands */}
      <div
        id="pick-card"
        data-pick="true"
        data-fly={payload.pick.special ? "true" : "false"}
        className={`mt-6 border-2 border-[var(--violet)] rounded-2xl bg-[var(--canvas)] shadow-[var(--card-shadow)] p-6 transition-all duration-500 ease-out ${
          decided ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--violet)] font-medium">
            THE PICK
          </span>
          {payload.pick.open !== null && <OpenNowBadge open={payload.pick.open} />}
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight mt-1">
          {payload.pick.restaurant_name}
        </h1>
        <p className="text-[14px] text-[var(--gray)] mt-1">
          {payload.pick.neighborhood}
          {payload.pick.address ? ` · ${payload.pick.address}` : ""} ·{" "}
          <CountUp value={payload.pick.distance_km} decimals={1} suffix=" km" /> from the
          middle
        </p>

        {payload.pick.special && (
          <div className="mt-4 bg-[var(--canvas-soft)] border border-[var(--border)] rounded-xl p-4">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--gray)]">
              TODAY&rsquo;S PERK
            </span>
            <p className="text-[15px] font-medium mt-1">{payload.pick.special.label}</p>
            <p className="text-[14px] text-[var(--gray)] mt-0.5">
              {payload.pick.special.description}
            </p>
          </div>
        )}

        <a
          id="btn-directions"
          href={payload.pick.directions_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-life mt-5 block text-center h-12 leading-[3rem] bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-[15px] font-medium rounded-full"
        >
          Get directions
        </a>
      </div>

      {/* Backups — after the pick settles */}
      {payload.backups.length > 0 && (
        <div
          className={`mt-8 transition-all duration-500 ease-out ${
            stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <h2 className="text-[13px] font-medium text-[var(--gray)] uppercase tracking-[0.06em] mb-3">
            If that doesn&rsquo;t work
          </h2>
          <div className="border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] overflow-hidden">
            {payload.backups.map((b) => (
              <a
                key={b.restaurant_name}
                href={b.directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3.5 hover:bg-[var(--canvas-soft)] transition-colors"
              >
                <div>
                  <span className="text-[15px] font-medium">{b.restaurant_name}</span>
                  <span className="text-[13px] text-[var(--gray)] ml-2">
                    {b.neighborhood}
                  </span>
                </div>
                <span className="text-[13px] text-[var(--gray)]">
                  <CountUp value={b.distance_km} decimals={1} suffix=" km" /> · Directions →
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div
        className={`mt-8 text-center transition-opacity duration-500 ${
          stage >= 3 ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link
          href="/start"
          className="text-sm text-[var(--gray)] hover:text-[var(--ink)] transition-colors"
        >
          Start over
        </Link>
      </div>
    </div>
  );
}
