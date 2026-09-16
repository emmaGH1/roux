import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-demo="roux"
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
      }}
    >
      <header
        className="w-full mx-auto px-6 py-5 sm:py-6 border-b"
        style={{
          maxWidth: "var(--page-max-marketing)",
          borderColor: "var(--rule)",
        }}
      >
        <Link
          href="/"
          className="inline-block no-underline select-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            lineHeight: "1.1",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          Roux
        </Link>
      </header>

      <main
        className="flex-1 w-full mx-auto px-6 py-8 sm:py-10"
        style={{
          maxWidth: "var(--page-max-marketing)",
        }}
      >
        {children}
      </main>

      <footer
        className="w-full mx-auto px-6 py-6 border-t flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4"
        style={{
          maxWidth: "var(--page-max-marketing)",
          borderColor: "var(--rule)",
        }}
      >
        <p
          className="text-xs"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink-mute)",
          }}
        >
          Roux reads Blackbird locations and hours. It does not book tables or rate restaurants.
        </p>
        <div
          className="flex items-center gap-3 text-xs shrink-0 select-none"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink-mute)",
          }}
        >
          <span>Roux</span>
          <span>·</span>
          <span>Runtime Agent Week 2026</span>
        </div>
      </footer>
    </div>
  );
}
