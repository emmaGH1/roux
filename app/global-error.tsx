"use client";

/**
 * Last line of defence. Replaces the root layout, so it ships its own
 * <html>/<body> and inline styles rather than relying on globals.css.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#111113",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6b7280",
              margin: 0,
            }}
          >
            Something broke
          </p>
          <h1 style={{ fontSize: 26, margin: "12px 0 8px", letterSpacing: "-0.02em" }}>
            Roux hit an error.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6b7280", margin: "0 0 28px" }}>
            {error.message || "An unexpected error stopped the page."}
          </p>
          <button
            onClick={reset}
            style={{
              height: 48,
              padding: "0 28px",
              background: "#7c6cf6",
              color: "#ffffff",
              border: "none",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
