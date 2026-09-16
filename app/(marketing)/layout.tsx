import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-demo="roux"
      className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]"
    >
      <header className="w-full border-b border-[var(--rule)]">
        <div className="max-w-[var(--page-max-marketing)] mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-[28px] leading-[1.1] font-[family-name:var(--font-display)] text-[var(--ink)] tracking-tight hover:opacity-90 transition-opacity"
          >
            Roux
          </Link>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[var(--page-max-marketing)] mx-auto px-6 py-8 sm:py-10">
        {children}
      </main>
      <footer className="w-full border-t border-[var(--rule)] mt-auto">
        <div className="max-w-[var(--page-max-marketing)] mx-auto px-6 py-6 flex flex-row items-center justify-between text-xs font-[family-name:var(--font-mono)] tracking-[0.08em] uppercase text-[var(--ink-mute)]">
          <span>Roux</span>
          <span>Runtime Agent Week 2026</span>
        </div>
      </footer>
    </div>
  );
}
