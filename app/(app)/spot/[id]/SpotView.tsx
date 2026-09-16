"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RouxSpot } from "@/lib/types";

type SpotViewProps = {
  spot: RouxSpot;
  source: "fixture" | "flynet";
  hoursText: string;
  factsText: string;
  a?: string;
  b?: string;
};

export function SpotView({ spot, source, hoursText, factsText, a, b }: SpotViewProps) {
  const [picked, setPicked] = useState(false);
  const router = useRouter();

  const backHref =
    a && b
      ? `/meet/results?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`
      : "/meet";

  function handleBack(e: React.MouseEvent) {
    if (!a && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  }

  return (
    <div
      data-source={source}
      data-pick={picked ? "true" : undefined}
      className="w-full"
    >
      {/* Back link */}
      <div className="mb-6">
        <Link
          href={backHref}
          onClick={handleBack}
          className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)] hover:text-[var(--ink)] inline-block transition-colors"
        >
          ← All open rooms
        </Link>
      </div>

      {/* Spot details card */}
      <div className="border border-[var(--rule)] p-6 sm:p-8 bg-[var(--paper)]">
        {/* Kicker */}
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)] block mb-1">
          {spot.neighborhood}
        </span>

        {/* Title */}
        <h1
          id="spot-title"
          className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl leading-tight tracking-[-0.02em] text-[var(--ink)] mb-3"
        >
          {spot.name}
        </h1>

        {/* Facts */}
        {factsText && (
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)] mb-4">
            {factsText}
          </p>
        )}

        {/* Hours */}
        <p
          id="spot-hours"
          className="font-[family-name:var(--font-mono)] text-sm text-[var(--ink)] mb-6"
        >
          {hoursText}
        </p>

        {/* FLY special block (only if specials exist) */}
        {spot.specials && spot.specials.length > 0 && (
          <div className="border border-[var(--rule)] bg-[var(--paper-dark)] p-4 mb-8">
            <span className="border border-[var(--wine)] text-[var(--wine)] font-[family-name:var(--font-mono)] text-[10px] font-semibold px-1.5 py-0.5 uppercase tracking-[0.08em] inline-block mb-2">
              FLY
            </span>
            {spot.specials.map((s) => (
              <div key={s.id} className="mt-1">
                <h3 className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[var(--ink)] uppercase tracking-[0.08em] mb-1">
                  {s.label}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--ink)] leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pick table CTA button */}
        <button
          id="pick-table"
          type="button"
          onClick={() => setPicked(true)}
          className={`w-full font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.08em] px-5 py-4 text-center rounded-none transition-colors cursor-pointer ${
            picked
              ? "bg-[var(--wine-deep)] text-[var(--paper)]"
              : "bg-[var(--wine)] hover:bg-[var(--wine-deep)] text-[var(--paper)]"
          }`}
        >
          {picked ? "Picked" : "This is the table"}
        </button>
      </div>
    </div>
  );
}
