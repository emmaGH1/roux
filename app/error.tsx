"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--canvas)] text-[var(--ink)]">
      <div className="max-w-[420px] text-center">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
          SOMETHING BROKE
        </span>
        <h1 className="text-[26px] font-semibold tracking-tight mt-3 mb-2">
          That step didn&rsquo;t load.
        </h1>
        <p className="text-[15px] text-[var(--gray)] leading-[1.6] mb-7">
          {error.message || "An unexpected error stopped the page."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="h-12 px-7 bg-[var(--violet)] hover:bg-[var(--violet-deep)] transition-colors text-white text-[15px] font-medium rounded-full cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="h-12 leading-[3rem] px-7 bg-[#F3F4F6] hover:bg-[#E9EAEC] transition-colors text-[var(--ink)] text-[15px] font-medium rounded-full"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
