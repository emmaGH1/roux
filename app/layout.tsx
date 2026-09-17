import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roux.vercel.app"),
  title: "Roux — Everyone meets in the middle.",
  description:
    "Friends each tap once to share their location. Roux picks one fair Blackbird restaurant near the middle of everyone — with a live perk.",
  openGraph: {
    title: "Roux — Everyone meets in the middle.",
    description:
      "One tap. Everyone's location. One fair Blackbird restaurant, decided.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body
        style={
          {
            "--font-sans": "var(--font-inter)",
            "--font-mono": "var(--font-plex-mono)",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
