import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Roux — Everyone meets in the middle.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          color: "#111113",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: 4,
            color: "#6B7280",
            marginBottom: 28,
          }}
        >
          FOR FRIENDS WHO CAN'T DECIDE
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "sans-serif",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            marginBottom: 36,
          }}
        >
          <span>Everyone meets</span>
          <span>in the middle.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "#7C6CF6",
            }}
          />
          <div style={{ display: "flex", fontFamily: "monospace", fontSize: 22, color: "#6B7280" }}>
            One tap. One fair Blackbird restaurant. · Runtime Agent Week 2026
          </div>
        </div>
      </div>
    ),
    size
  );
}
