"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { lookupZip, PRESETS } from "@/lib/zips";

export default function MeetPage() {
  return (
    <Suspense fallback={null}>
      <Form />
    </Suspense>
  );
}

function Form() {
  const router = useRouter();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!a.trim() || !b.trim()) {
      setError("Need two places.");
      return;
    }
    const za = lookupZip(a);
    const zb = lookupZip(b);
    if (!za || !zb) {
      setError("Unknown ZIP. Use a chip or a 5-digit NYC ZIP.");
      return;
    }
    router.push(
      `/meet/results?a=${encodeURIComponent(za.zip)}&b=${encodeURIComponent(zb.zip)}`
    );
  }

  return (
    <div className="pt-12">
      <h1 className="text-[28px] font-semibold tracking-tight mb-2">Two places</h1>
      <p className="text-[15px] text-[var(--gray)] mb-8">
        Demo fallback: type two places instead of sharing phones.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <input
          id="place-a"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="ZIP or neighborhood"
          className="w-full h-12 px-4 border border-[var(--border)] rounded-full bg-[var(--canvas-soft)] text-[15px] focus:outline-none focus:border-[var(--violet)]"
        />
        <input
          id="place-b"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="ZIP or neighborhood"
          className="w-full h-12 px-4 border border-[var(--border)] rounded-full bg-[var(--canvas-soft)] text-[15px] focus:outline-none focus:border-[var(--violet)]"
        />
        <p className="text-xs text-[var(--gray)]">Try 11211 and 11215</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {PRESETS.map((p) => (
            <button
              key={p.zip}
              type="button"
              onClick={() => {
                if (!a.trim()) setA(p.zip);
                else setB(p.zip);
              }}
              className="text-xs border border-[var(--border)] px-3 py-1.5 rounded-full hover:bg-[var(--canvas-soft)] transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          id="submit-roux"
          type="submit"
          className="!mt-8 w-full h-12 bg-[var(--violet)] hover:bg-[var(--violet-deep)] transition-colors text-white text-[15px] font-medium rounded-full cursor-pointer"
        >
          Find the middle
        </button>
      </form>
    </div>
  );
}
