import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    viewTransition: true,
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "3mb"
    }
  },
};

export default nextConfig;
