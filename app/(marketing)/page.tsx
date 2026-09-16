import Link from "next/link";
import { PaperMap } from "@/components/PaperMap";
import { midpoint } from "@/lib/geo";

const PERSON_A = { lat: 40.7128, lng: -73.9562, kind: "person" as const, label: "11211" };
const PERSON_B = { lat: 40.6626, lng: -73.985, kind: "person" as const, label: "11215" };
const ROUX_MID = { ...midpoint(PERSON_A, PERSON_B), kind: "roux" as const };
const SAMPLE_MARKS = [PERSON_A, PERSON_B, ROUX_MID];

export default function MarketingPage() {
  return (
    <div className="flex flex-col">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left column: Type */}
        <div className="lg:col-span-7 flex flex-col items-start w-full">
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)]">
            BLACKBIRD · FLYNET
          </span>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,5.5vw,68px)] leading-[1.05] tracking-[-0.02em] text-[var(--ink)] mt-4 mb-5">
            Two kitchens apart.
            <br />
            One table.
          </h1>

          <p className="font-[family-name:var(--font-body)] text-[18px] leading-[1.5] text-[var(--ink)] max-w-[520px] mb-8">
            Roux sits the table in the geographic middle. Open Blackbird rooms only. No ratings. No waitlist theater.
          </p>

          <Link
            id="cta-meet"
            href="/meet"
            className="block w-full sm:inline-block sm:w-auto bg-[var(--wine)] hover:bg-[var(--wine-deep)] text-[var(--paper)] font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.08em] px-5 py-4 text-center transition-colors"
            style={{ borderRadius: "var(--radius)" }}
          >
            Find the middle
          </Link>
        </div>

        {/* Right column: PaperMap */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none border border-[var(--rule)]">
          <PaperMap marks={SAMPLE_MARKS} />
        </div>
      </section>

      {/* How it works: three numbered lines in a vertical stack */}
      <section className="mt-16 pt-10 border-t border-[var(--rule)] max-w-[520px]">
        <ol className="flex flex-col gap-3 font-[family-name:var(--font-body)] text-[18px] leading-[1.5] text-[var(--ink)]">
          <li className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)]">
              1.
            </span>
            <span>Drop two places.</span>
          </li>
          <li className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)]">
              2.
            </span>
            <span>Roux marks the middle.</span>
          </li>
          <li className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--ink-mute)]">
              3.
            </span>
            <span>You get rooms that are actually open.</span>
          </li>
        </ol>
      </section>

      {/* Honesty line */}
      <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.08em] text-[var(--ink-mute)] mt-12 mb-6 max-w-[520px]">
        Roux reads Blackbird locations and hours. It does not book tables or rate restaurants.
      </p>
    </div>
  );
}
