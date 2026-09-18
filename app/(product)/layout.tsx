import Link from "next/link";

const isLive =
  process.env.USE_FIXTURES === "false" && Boolean(process.env.FLYNET_API_KEY);

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-demo="roux"
      data-source={isLive ? "flynet" : "fixture"}
      className="relative min-h-screen bg-[var(--canvas)] text-[var(--ink)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden"
      >
        <div
          className="h-[340px] w-[720px] -translate-y-1/2 rounded-full opacity-50 blur-[100px]"
          style={{ background: "radial-gradient(closest-side, #e2dcff, transparent)" }}
        />
      </div>

      <header className="relative w-full">
        <div className="mx-auto flex max-w-[520px] items-center justify-between px-6 pt-8 pb-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-[19px] font-semibold tracking-[-0.03em]"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-[var(--violet)]" />
            Roux
          </Link>
          {!isLive && (
            <span className="max-w-[190px] text-right font-[family-name:var(--font-mono)] text-[9px] uppercase leading-[1.5] tracking-[0.14em] text-[var(--gray)]">
              Sample data. Live Flynet when keys are in.
            </span>
          )}
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[520px] px-6 pb-20">{children}</main>
    </div>
  );
}
