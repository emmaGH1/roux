"use client";

import { useEffect, useState } from "react";
import type { DatasetReason, DatasetSource } from "@/lib/discovery";

type Status = { source: DatasetSource; reason: DatasetReason };

/**
 * The honesty chip. Screens must never claim live Flynet data they aren't
 * serving, and a statically prerendered screen can freeze the wrong claim at
 * build time — so the truth comes from /api/status at runtime.
 *
 * `initial` lets a dynamic server component hand over the answer it already
 * knows, so the landing has no flash; static screens start neutral instead of
 * asserting something they can't know.
 */
export function DataBadge({
  initial,
  className = "",
}: {
  initial?: Status | null;
  className?: string;
}) {
  const [status, setStatus] = useState<Status | null>(initial ?? null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json?.source) setStatus(json as Status);
      })
      .catch(() => {
        /* keep whatever we were told */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Make the documented data-source contract true, even on static screens. */
  useEffect(() => {
    if (!status) return;
    document.documentElement.dataset.source = status.source;
  }, [status]);

  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.14em]";

  if (!status) {
    return (
      <span
        className={`${base} border-[var(--hairline)] text-[var(--gray-light)] ${className}`}
      >
        Checking data source
      </span>
    );
  }

  if (status.source === "flynet") {
    return (
      <span
        className={`${base} border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D] ${className}`}
      >
        <span className="live-dot text-[#22C55E]" />
        Live Flynet data
      </span>
    );
  }

  if (status.reason === "key-rejected") {
    return (
      <span
        className={`${base} border-[#FDE68A] bg-[#FFFBEB] text-[#B45309] ${className}`}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
        Flynet key rejected — showing sample data
      </span>
    );
  }

  return (
    <span
      className={`${base} border-[var(--hairline)] text-[var(--gray)] ${className}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--gray-light)]" />
      Sample data. Live Flynet when keys are in.
    </span>
  );
}
