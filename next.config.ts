import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    viewTransition: true,
    clientSegmentCache: true,
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  images: {
    remotePatterns: [{ hostname: "tpeehtrlgmfimvwrswif.supabase.co" }],
  },
};

export default nextConfig;
