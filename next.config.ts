import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
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
