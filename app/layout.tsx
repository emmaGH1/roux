import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roux",
  description: "Two kitchens apart. One table.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif4.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
