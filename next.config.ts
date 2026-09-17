import type { NextConfig } from "next";

/**
 * `next dev` and `next start` must never share a build directory.
 *
 * When they do, the running server keeps serving HTML that references chunk
 * files the other process has already deleted. The browser then fails to load
 * a chunk and every page dies with the generic "Application error: a
 * client-side exception has occurred" screen. Keeping dev on its own distDir
 * lets you edit in dev while a production build serves the demo video.
 */
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  distDir: isDev ? ".next-dev" : ".next",
  // The preview pane loads through 127.0.0.1 while the dev server reports
  // localhost; Next 15 warns (and will soon require) this allowlist.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
