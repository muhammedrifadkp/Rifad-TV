import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Styled 404 for URLs that match no route (the root layout sits under [locale]).
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Derivatives are generated ahead of time by `npm run media`; the loader
    // maps each requested width to the nearest generated file.
    loader: "custom",
    loaderFile: "./lib/media/image-loader.ts",
    deviceSizes: [480, 800, 1200, 1600, 2000],
    imageSizes: [240, 360],
    qualities: [78],
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
