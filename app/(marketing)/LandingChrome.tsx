import Link from "next/link";
import { Pill } from "@/components/ui";

export function LandingChrome({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-demo="roux"
      className="relative min-h-screen overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]"
    >
      <div className="sticky top-4 z-50 flex justify-center px-4">
        <nav className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--ink)] p-1.5 pl-5 text-white shadow-[0_20px_44px_-20px_rgba(12,12,16,0.6)]">
          <Link
            href="/"
            className="mr-2 flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em]"
          >
            <span className="relative inline-flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-4 w-4 rounded-full bg-[var(--violet)] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--violet)]" />
            </span>
            Roux
          </Link>
          <a
            href="#fair-middle"
            className="hidden rounded-full px-3 py-2 text-[14px] text-white/70 transition-colors hover:text-white sm:inline-block"
          >
            The fair middle
          </a>
          <a
            href="#how-it-works"
            className="hidden rounded-full px-3 py-2 text-[14px] text-white/70 transition-colors hover:text-white sm:inline-block"
          >
            How it works
          </a>
          <a
            href="#flynet"
            className="hidden rounded-full px-3 py-2 text-[14px] text-white/70 transition-colors hover:text-white md:inline-block"
          >
            Built on Flynet
          </a>
          <span className="ml-1.5">
            <Pill href="/start" tone="white">
              Start a meetup
            </Pill>
          </span>
        </nav>
      </div>
      {children}
    </div>
  );
}
