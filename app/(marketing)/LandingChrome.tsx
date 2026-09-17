import Link from "next/link";

export function LandingChrome({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="roux" className="bg-[var(--canvas)] text-[var(--ink)] min-h-screen">
      <div className="sticky top-4 z-50 flex justify-center px-4">
        <nav className="flex items-center gap-6 bg-[var(--ink)] text-white rounded-full pl-5 pr-2 py-2 shadow-lg">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[15px]">
            <span className="inline-block w-4 h-4 rounded-full bg-[var(--violet)] border-2 border-white/30" />
            Roux
          </Link>
          <a href="#how-it-works" className="text-[14px] text-white/80 hover:text-white transition-colors">
            How it works
          </a>
          <Link
            href="/start"
            className="btn-life bg-white/10 hover:bg-white/20 text-[14px] font-medium px-4 py-2 rounded-full"
          >
            Start a meetup →
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
