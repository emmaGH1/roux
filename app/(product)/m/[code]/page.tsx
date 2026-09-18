"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bezel, Eyebrow } from "@/components/ui";

const MAX_DOTS = 6;

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
  const [missing, setMissing] = useState(false);

  async function refreshCount() {
    try {
      const res = await fetch(`/api/meetups/${code}`);
      if (res.status === 404) {
        setMissing(true);
        return;
      }
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
    /* Near-real-time: a 1.5s poll is one cheap Redis GET, and coming back to
       the tab (phone unlock, app switch) refreshes instantly instead of
       waiting out the interval. */
    const t = setInterval(refreshCount, 1500);
    const wake = () => document.visibilityState === "visible" && refreshCount();
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("focus", wake);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("focus", wake);
    };
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
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/m/${code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the link is visible on screen anyway */
    }
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
  const dots = Math.min(count ?? 0, MAX_DOTS);

  /* A mistyped code should say so, not sit there pretending to wait. */
  if (missing) {
    return (
      <div className="pt-16 text-center">
        <Eyebrow>NO TABLE HERE</Eyebrow>
        <h1 className="mt-6 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
          That meetup doesn&rsquo;t exist.
        </h1>
        <p className="mx-auto mt-3 max-w-[380px] text-[15px] leading-[1.6] text-[var(--gray)]">
          The link may be mistyped, or the meetup already ended. Meetups expire
          24 hours after they&rsquo;re created.
        </p>
        <Link
          href="/start"
          className="btn-life mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--violet)] px-7 text-[15px] font-medium text-white hover:bg-[var(--violet-deep)]"
        >
          Start a meetup
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>WAITING ROOM</Eyebrow>
          <h1 className="mt-5 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">
            Meetup{" "}
            <span className="font-[family-name:var(--font-mono)] text-[var(--violet)]">
              {code.toUpperCase()}
            </span>
          </h1>
        </div>
        <button
          onClick={handleCopy}
          className="btn-life mt-1 shrink-0 rounded-full border border-[var(--hairline)] px-3.5 py-2 text-[12px] font-medium text-[var(--gray)] hover:border-[var(--ink)]/25 hover:text-[var(--ink)]"
        >
          {copied ? "Copied" : "Copy invite link"}
        </button>
      </div>

      <p className="mt-3 text-[15px] leading-[1.6] text-[var(--gray)]">
        Everyone who opens this link drops their spot on the map.
      </p>

      <Bezel className="mt-8" coreClassName="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
            WHO&rsquo;S IN
          </span>
          {shared && (
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--green)]">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                <path
                  d="M4.5 8.5L7 11L11.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Location shared
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end gap-4">
          {count === null ? (
            <span className="skeleton h-9 w-32" data-loading="count" />
          ) : (
            <span
              id="share-count"
              data-count={count}
              className="text-[34px] font-semibold leading-none tracking-[-0.04em]"
            >
              {count}
              <span className="ml-2 align-baseline text-[15px] font-medium tracking-normal text-[var(--gray)]">
                {count === 1 ? "of us is in" : "of us are in"}
              </span>
            </span>
          )}
        </div>

        {count !== null && (
          <div className="mt-5 flex items-center gap-2">
            {Array.from({ length: Math.max(MAX_DOTS, dots) }).map((_, i) => (
              <span
                key={i}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i < dots
                    ? "w-6 bg-[var(--violet)]"
                    : "w-2.5 bg-[var(--hairline-strong)]"
                }`}
              />
            ))}
          </div>
        )}

        <button
          id="btn-share-loc"
          onClick={handleShareLocation}
          disabled={locating || shared}
          className="btn-life group mt-7 flex h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[var(--violet)] text-[15px] font-medium text-white shadow-[var(--shadow-violet)] hover:bg-[var(--violet-deep)] disabled:opacity-50 disabled:shadow-none"
        >
          {locating ? "Locating…" : shared ? "Location shared" : "Share my location"}
          {!shared && !locating && (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3.5 8h9M8.5 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </button>

        {!enough && (
          <p className="mt-4 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
            Waiting for at least 2 people
          </p>
        )}

        {error && <p className="mt-4 text-center text-[13px] text-red-500">{error}</p>}
      </Bezel>

      <button
        id="btn-find"
        onClick={handleFind}
        disabled={!enough || finding}
        className="btn-life mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] text-[15px] font-medium text-white hover:bg-black disabled:opacity-35"
      >
        {finding ? "Finding…" : "Find our spot"}
        {!finding && <span aria-hidden>→</span>}
      </button>

      <div className="mt-9">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
          HOW THIS WORKS
        </span>
        <ul className="mt-4 border-t border-[var(--hairline)]">
          {[
            "Each phone shares one location snapshot — never a live trail.",
            "Roux averages them into one fair point.",
            "The closest Blackbird room to that point becomes the pick.",
          ].map((line) => (
            <li
              key={line}
              className="border-b border-[var(--hairline)] py-3.5 text-[13px] leading-[1.55] text-[var(--gray)]"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
