import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    cacheComponents: true,
    viewTransition: true,
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  images: {
    remotePatterns: [{ hostname: "tpeehtrlgmfimvwrswif.supabase.co" }],
  },
};

export default nextConfig;
