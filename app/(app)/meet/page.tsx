"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaperMap } from "@/components/PaperMap";
import { midpoint } from "@/lib/geo";
import { lookupZip, PRESETS, type ZipRow } from "@/lib/zips";
import zips from "@/fixtures/nyc-zips.json";

function extractZip(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "").slice(0, 5);
  if (digits.length === 5 && lookupZip(digits)) {
    return digits;
  }
  const row = lookupZip(raw);
  if (!row) return null;
  for (const [code, r] of Object.entries(zips as Record<string, ZipRow>)) {
    if (r.lat === row.lat && r.lng === row.lng) {
      return code;
    }
  }
  return null;
}

function MeetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialA = searchParams.get("a") ?? "";
  const initialB = searchParams.get("b") ?? "";

  const [placeA, setPlaceA] = useState(initialA);
  const [placeB, setPlaceB] = useState(initialB);
  const [error, setError] = useState<string | null>(null);

  const marks = useMemo(() => {
    const rowA = lookupZip(placeA);
    const rowB = lookupZip(placeB);
    if (!rowA || !rowB) return [];

    const personA = { lat: rowA.lat, lng: rowA.lng, kind: "person" as const, label: rowA.name };
    const personB = { lat: rowB.lat, lng: rowB.lng, kind: "person" as const, label: rowB.name };
    const rouxMid = { ...midpoint(personA, personB), kind: "roux" as const };
    return [personA, personB, rouxMid];
  }, [placeA, placeB]);

  function handleChipClick(chipLabel: string) {
    setError(null);
    if (!placeA.trim()) {
      setPlaceA(chipLabel);
    } else if (!placeB.trim()) {
      setPlaceB(chipLabel);
    } else {
      setPlaceB(chipLabel);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!placeA.trim() || !placeB.trim()) {
      setError("Need two places.");
      return;
    }

    const zipA = extractZip(placeA);
    const zipB = extractZip(placeB);

    if (!zipA || !zipB) {
      setError("Unknown ZIP. Use a chip or a 5-digit NYC ZIP.");
      return;
    }

    router.push(`/meet/results?a=${encodeURIComponent(zipA)}&b=${encodeURIComponent(zipB)}`);
  }

  return (
    <div className="w-full">
      <h1 className="font-[family-name:var(--font-display)] text-[28px] leading-tight tracking-[-0.02em] text-[var(--ink)] mb-6">
        Who’s coming
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="place-a"
            className="block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)] mb-1.5"
          >
            First place
          </label>
          <input
            id="place-a"
            type="text"
            value={placeA}
            onChange={(e) => {
              setPlaceA(e.target.value);
              setError(null);
            }}
            placeholder="ZIP or neighborhood"
            className="w-full h-12 px-4 bg-[var(--paper-dark)] border border-[var(--rule)] rounded-none text-[var(--ink)] font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-[var(--ink)] placeholder:text-[var(--ink-mute)]"
          />
        </div>

        <div>
          <label
            htmlFor="place-b"
            className="block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)] mb-1.5"
          >
            Second place
          </label>
          <input
            id="place-b"
            type="text"
            value={placeB}
            onChange={(e) => {
              setPlaceB(e.target.value);
              setError(null);
            }}
            placeholder="ZIP or neighborhood"
            className="w-full h-12 px-4 bg-[var(--paper-dark)] border border-[var(--rule)] rounded-none text-[var(--ink)] font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-[var(--ink)] placeholder:text-[var(--ink-mute)]"
          />
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-mute)] mt-1.5">
            Try 11211 and 11215
          </p>
        </div>

        <div className="pt-2">
          <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--ink-mute)] mb-2">
            Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.zip}
                onClick={() => handleChipClick(preset.label)}
                className="font-[family-name:var(--font-mono)] text-xs border border-[var(--rule)] px-3 py-1.5 rounded-none text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper-dark)] transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--wine)] mt-2">
            {error}
          </p>
        )}

        <div className="pt-2">
          <button
            id="submit-roux"
            type="submit"
            className="w-full bg-[var(--wine)] hover:bg-[var(--wine-deep)] text-[var(--paper)] font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.08em] px-5 py-4 text-center rounded-none transition-colors cursor-pointer"
          >
            Mark the Roux
          </button>
        </div>
      </form>

      <div className="border border-[var(--rule)] mt-8">
        <PaperMap marks={marks} />
      </div>
    </div>
  );
}

export default function MeetPage() {
  return (
    <Suspense fallback={<div className="font-[family-name:var(--font-mono)] text-xs text-[var(--ink-mute)]">Loading...</div>}>
      <MeetForm />
    </Suspense>
  );
}
