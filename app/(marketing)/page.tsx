import Link from "next/link";
import { PaperMap } from "@/components/PaperMap";
import { lookupZip } from "@/lib/zips";
import { midpoint } from "@/lib/geo";

export default function MarketingPage() {
  const zipA = lookupZip("11211");
  const zipB = lookupZip("11215");

  const sampleMarks =
    zipA && zipB
      ? [
          { lat: zipA.lat, lng: zipA.lng, kind: "person" as const, label: "Williamsburg 11211" },
          { lat: zipB.lat, lng: zipB.lng, kind: "person" as const, label: "Park Slope 11215" },
          { ...midpoint(zipA, zipB), kind: "roux" as const },
        ]
      : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-7 flex flex-col justify-start">
        <p
          className="text-xs tracking-[0.08em] uppercase mb-4"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink-mute)",
          }}
        >
          BLACKBIRD · FLYNET
        </p>

        <h1
          className="tracking-[-0.02em] font-normal mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(38px, 5.5vw, 64px)",
            lineHeight: "1.05",
            color: "var(--ink)",
          }}
        >
          Two kitchens apart.
          <br />
          One table.
        </h1>

        <p
          className="text-lg leading-[1.5] max-w-xl mb-7"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--ink)",
          }}
        >
          Roux sits the table in the geographic middle. Open Blackbird rooms only. No ratings. No waitlist theater.
        </p>

        <div className="mb-10">
          <Link
            id="cta-meet"
            href="/meet"
            className="inline-block text-center select-none cursor-pointer transition-colors"
            style={{
              backgroundColor: "var(--wine)",
              color: "var(--paper)",
              borderRadius: "var(--radius)",
              padding: "var(--btn-pad)",
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textDecoration: "none",
            }}
          >
            Find the middle
          </Link>
        </div>

        <div
          className="pt-7 border-t max-w-lg"
          style={{
            borderColor: "var(--rule)",
          }}
        >
          <ol
            className="space-y-2.5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              lineHeight: "1.5",
              color: "var(--ink)",
            }}
          >
            <li className="flex items-baseline gap-3">
              <span
                className="select-none text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-mute)",
                }}
              >
                1.
              </span>
              <span>Drop two places.</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span
                className="select-none text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-mute)",
                }}
              >
                2.
              </span>
              <span>Roux marks the middle.</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span
                className="select-none text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-mute)",
                }}
              >
                3.
              </span>
              <span>You get rooms that are actually open.</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="lg:col-span-5 w-full">
        <div
          className="border overflow-hidden"
          style={{
            borderColor: "var(--rule)",
            backgroundColor: "var(--paper-dark)",
          }}
        >
          <PaperMap marks={sampleMarks} />
        </div>
      </div>
    </div>
  );
}
