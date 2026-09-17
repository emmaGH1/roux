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
      className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col"
    >
      <header className="w-full">
        <div className="max-w-[480px] mx-auto px-6 pt-8 pb-2 flex items-center justify-between">
          <a href="/" className="text-[20px] font-semibold tracking-tight">
            Roux
          </a>
          {!isLive && (
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--gray)]">
              Sample data. Live Flynet when keys are in.
            </span>
          )}
        </div>
      </header>
      <main className="flex-1 w-full max-w-[480px] mx-auto px-6 pb-16 w-full">{children}</main>
    </div>
  );
}
