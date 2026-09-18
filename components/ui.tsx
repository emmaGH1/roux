import Link from "next/link";

/**
 * Shared premium primitives. Kept deliberately small: a nested-tray card
 * (Bezel), a microscopic eyebrow label, and pill buttons whose trailing
 * arrow lives in its own circle (button-in-button).
 */

export function Bezel({
  children,
  className = "",
  coreClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  coreClassName?: string;
}) {
  return (
    <div className={`bezel ${className}`}>
      <div className={`bezel-core overflow-hidden ${coreClassName}`}>{children}</div>
    </div>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-white/70 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--gray)] ${className}`}
    >
      {children}
    </span>
  );
}

function ArrowGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PillTone = "violet" | "ink" | "ghost" | "white";

const TONES: Record<PillTone, { shell: string; icon: string }> = {
  violet: {
    shell:
      "bg-[var(--violet)] text-white hover:bg-[var(--violet-deep)] shadow-[var(--shadow-violet)]",
    icon: "bg-white/18 group-hover:bg-white/28 text-white",
  },
  ink: {
    shell: "bg-[var(--ink)] text-white hover:bg-black",
    icon: "bg-white/12 group-hover:bg-white/22 text-white",
  },
  ghost: {
    shell:
      "bg-white text-[var(--ink)] border border-[var(--hairline-strong)] hover:border-[var(--ink)]/25",
    icon: "bg-[var(--canvas-soft)] group-hover:bg-[var(--violet-soft)] text-[var(--ink)]",
  },
  white: {
    shell: "bg-white text-[var(--ink)] hover:bg-white",
    icon: "bg-[var(--violet)] text-white",
  },
};

export function Pill({
  href,
  children,
  tone = "violet",
  id,
  className = "",
  size = "md",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  tone?: PillTone;
  id?: string;
  className?: string;
  size?: "md" | "lg";
  external?: boolean;
}) {
  const t = TONES[tone];
  const dims =
    size === "lg"
      ? { pad: "pl-7 pr-2 py-2", text: "text-[16px]", circle: "h-11 w-11" }
      : { pad: "pl-6 pr-1.5 py-1.5", text: "text-[15px]", circle: "h-9 w-9" };

  const inner = (
    <>
      <span className={`font-medium ${dims.text}`}>{children}</span>
      <span
        className={`grid place-items-center rounded-full transition-colors ${dims.circle} ${t.icon}`}
      >
        <ArrowGlyph />
      </span>
    </>
  );

  const cls = `btn-life group inline-flex items-center gap-3 rounded-full ${dims.pad} ${t.shell} ${className}`;

  if (external) {
    return (
      <a id={id} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }

  return (
    <Link id={id} href={href} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * Factual brand detail only — cuisine and a price band, never a rating.
 * Renders nothing when a location carries neither, so cards stay clean.
 */
export function MetaChips({
  cuisine,
  price,
  className = "",
}: {
  cuisine: string[];
  price: number | null;
  className?: string;
}) {
  const band = price && price > 0 ? "$".repeat(Math.min(4, Math.round(price))) : null;
  if (cuisine.length === 0 && !band) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {cuisine.map((c) => (
        <span
          key={c}
          className="rounded-full border border-[var(--hairline)] bg-[var(--canvas-soft)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--ink-soft)]"
        >
          {c}
        </span>
      ))}
      {band && (
        <span className="rounded-full border border-[var(--hairline)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-[var(--gray)]">
          {band}
        </span>
      )}
    </div>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path
        d="M3.5 9.5l3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
