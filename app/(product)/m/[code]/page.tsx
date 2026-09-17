"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MeetupPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();

  const [count, setCount] = useState<number | null>(null);
  const [shared, setShared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [finding, setFinding] = useState(false);
  const [copied, setCopied] = useState(false);

  async function refreshCount() {
    try {
      const res = await fetch(`/api/meetups/${code}`);
      if (res.ok) {
        const json = await res.json();
        setCount(json.count);
      }
    } catch {
      /* keep last count */
    }
  }

  useEffect(() => {
    refreshCount();
    const t = setInterval(refreshCount, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  function handleShareLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation isn't available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/meetups/${code}/locations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          setCount(json.count);
          setShared(true);
        } catch {
          setError("Couldn't share your location. Try again.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Location permission denied. You can't be counted without it.");
      },
      { timeout: 10000 }
    );
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}/m/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleFind() {
    setFinding(true);
    try {
      await fetch(`/api/meetups/${code}/result`, { method: "POST" });
      router.push(`/m/${code}/result`);
    } catch {
      setError("Couldn't compute the pick. Try again.");
      setFinding(false);
    }
  }

  const enough = (count ?? 0) >= 2;
  const countLabel =
    count === 1
      ? "1 of us is in"
      : `${count} of us are in`;

  return (
    <div className="pt-12">
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-[28px] font-semibold tracking-tight">
          Meetup{" "}
          <span className="font-[family-name:var(--font-mono)] text-[var(--violet)]">
            {code.toUpperCase()}
          </span>
        </h1>
        <button
          onClick={handleCopy}
          className="text-xs text-[var(--gray)] hover:text-[var(--ink)] transition-colors cursor-pointer"
        >
          {copied ? "Copied" : "Copy invite link"}
        </button>
      </div>
      <p className="text-[15px] text-[var(--gray)] mb-8">
        Everyone who opens this link drops their spot on the map.
      </p>

      <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--canvas)] shadow-sm mb-6">
        <div className="flex items-center justify-between mb-5">
          {count === null ? (
            <span className="skeleton h-5 w-28" data-loading="count" />
          ) : (
            <span
              id="share-count"
              data-count={count}
              className="text-[15px] font-medium"
            >
              {countLabel}
            </span>
          )}
          {shared && (
            <span className="flex items-center gap-1.5 text-sm text-[var(--green)] font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                <path d="M4.5 8.5L7 11L11.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Location shared
            </span>
          )}
        </div>

        <button
          id="btn-share-loc"
          onClick={handleShareLocation}
          disabled={locating || shared}
          className="btn-life w-full h-12 bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white text-[15px] font-medium rounded-full cursor-pointer disabled:opacity-50"
        >
          {locating ? "Locating…" : shared ? "Location shared" : "Share my location"}
        </button>

        {!enough && (
          <p className="mt-4 text-center text-xs text-[var(--gray)]">
            Waiting for at least 2 people.
          </p>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>

      <button
        id="btn-find"
        onClick={handleFind}
        disabled={!enough || finding}
        className="btn-life w-full h-12 bg-[var(--ink)] hover:bg-black text-white text-[15px] font-medium rounded-full cursor-pointer disabled:opacity-40"
      >
        {finding ? "Finding…" : "Find our spot"}
      </button>
    </div>
  );
}
