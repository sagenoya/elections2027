import type { NextConfig } from "next";

/**
 * The public site is a static export served by Cloudflare Pages.
 * Live data is NOT baked in at build time: the browser polls the CDN
 * (NEXT_PUBLIC_DATA_URL) for forecast/version.json and reloads latest.json on change.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
