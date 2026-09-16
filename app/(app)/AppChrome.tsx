"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function AppChrome({
  source,
  bannerText,
  children,
}: {
  source: string;
  bannerText: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const beat = searchParams.get("beat") || undefined;

  useEffect(() => {
    if (beat) {
      document.body.setAttribute("data-beat", beat);
    } else {
      document.body.removeAttribute("data-beat");
    }
  }, [beat]);

  return (
    <div
      data-demo="roux"
      data-source={source}
      data-beat={beat}
      className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]"
    >
      <header className="w-full border-b border-[var(--rule)]">
        <div className="max-w-[var(--page-max-app)] mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <Link
            href="/"
            className="text-[28px] leading-[1.1] font-[family-name:var(--font-display)] text-[var(--ink)] tracking-tight hover:opacity-90 transition-opacity"
          >
            Roux
          </Link>
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)]">
            {bannerText}
          </span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[var(--page-max-app)] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
