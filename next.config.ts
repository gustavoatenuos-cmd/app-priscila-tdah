import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint is run separately in CI; don't block build for lint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript errors are surfaced during development; keep build unblocked on Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
