import Link from "next/link";
import { Bezel, Eyebrow, Pill } from "@/components/ui";
import { DataBadge } from "@/components/DataBadge";
import type { DatasetReason, DatasetSource } from "@/lib/discovery";

const PARTNERS = [
  { name: "Flynet", note: "Discovery API", href: "https://docs.flynet.org" },
  { name: "Blackbird", note: "restaurant network", href: "https://www.blackbird.xyz" },
  { name: "Mapbox", note: "maps", href: "https://www.mapbox.com" },
  { name: "Next.js", note: "framework", href: "https://nextjs.org" },
  { name: "Vercel", note: "hosting", href: "https://vercel.com" },
];

const PRODUCT_LINKS = [
  { label: "Start a meetup", href: "/start" },
  { label: "The fair middle", href: "#fair-middle" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Sample pick", href: "#money-shot" },
];

const UNDER_LINKS = [
  { label: "Flynet Discovery docs", href: "https://docs.flynet.org", external: true },
  { label: "Mapbox GL JS", href: "https://docs.mapbox.com/mapbox-gl-js/", external: true },
  { label: "What Roux won't do", href: "#honesty" },
];

export function SiteFooter({
  status,
}: {
  /** The source the server already knows, so the landing badge never flashes. */
  status?: { source: DatasetSource; reason: DatasetReason };
} = {}) {
  return (
    <footer className="px-6 pb-10 pt-6">
      <div className="mx-auto max-w-[var(--page-max)]">
        {/* ── Closing CTA ── */}
        <Bezel className="shadow-[var(--shadow-lg)]" coreClassName="relative overflow-hidden">
          <div
            className="grain relative overflow-hidden px-8 py-20 text-center sm:px-16"
            style={{
              background:
                "linear-gradient(135deg, #cfc6ff 0%, #7c6cf6 46%, #4f3fc9 100%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center"
            >
              <div
                className="float-slow h-[320px] w-[620px] rounded-full opacity-40 blur-[80px]"
                style={{ background: "radial-gradient(closest-side, #ffffff, transparent)" }}
              />
            </div>

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">
                <span className="live-dot text-white" />
                READY WHEN THEY ARE
              </span>

              <h2 className="mx-auto mt-7 max-w-[620px] text-[clamp(32px,4.6vw,56px)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
                Stop the group chat.
              </h2>
              <p className="mx-auto mt-5 max-w-[440px] text-[16px] leading-[1.6] text-white/85">
                One link. Everyone taps once. Roux calls one fair Blackbird
                restaurant and hands out directions.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Pill href="/start" id="cta-start-footer" tone="white" size="lg">
                  Start a meetup
                </Pill>
                <a
                  href="#fair-middle"
                  className="btn-life inline-flex h-[60px] items-center rounded-full border border-white/30 px-7 text-[16px] font-medium text-white hover:bg-white/10"
                >
                  See how it decides
                </a>
              </div>
            </div>
          </div>
        </Bezel>

        {/* ── Sponsors & partners ── */}
        <div className="mt-14 border-t border-[var(--hairline)] pt-10">
          <Eyebrow>PARTNERS &amp; SPONSORS</Eyebrow>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            {PARTNERS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <span className="block text-[17px] font-semibold tracking-[-0.02em] text-[var(--ink)] transition-colors group-hover:text-[var(--violet)]">
                  {p.name}
                </span>
                <span className="mt-1 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
                  {p.note}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Link columns ── */}
        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-[var(--hairline)] pt-10 sm:grid-cols-3">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
              PRODUCT
            </span>
            <ul className="mt-5 space-y-3">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-[var(--ink-soft)] transition-colors hover:text-[var(--violet)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
              UNDER THE HOOD
            </span>
            <ul className="mt-5 space-y-3">
              {UNDER_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-[15px] text-[var(--ink-soft)] transition-colors hover:text-[var(--violet)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--gray)]">
              HONESTY
            </span>
            <p className="mt-5 text-[15px] leading-[1.6] text-[var(--gray)]">
              Meetups live in server memory and vanish on restart. Nothing is
              stored about you after the pick.
            </p>
            <div className="mt-5">
              <DataBadge initial={status ?? null} className="text-left leading-[1.5]" />
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--hairline)] pt-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[var(--violet)]" />
              Roux
            </span>
            <span className="text-[13px] text-[var(--gray)]">
              Everyone meets in the middle.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
            <span className="rounded-full border border-[var(--hairline)] px-2.5 py-1">
              Built on Flynet
            </span>
            <span className="rounded-full border border-[var(--hairline)] px-2.5 py-1">
              Runtime Agent Week 2026
            </span>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
