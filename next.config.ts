import type { NextConfig } from "next";

// For GitHub Pages deployment, we use static export.
// The repo name must be set as basePath so asset URLs resolve correctly.
const repoName = "chongoyape-bizcochuelos-lab";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  // GitHub Pages serves at https://<user>.github.io/<repo>/
  // basePath must be set for production builds; empty for dev
  ...(process.env.NODE_ENV === "production" && {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  }),
};

export default nextConfig;
