import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    viewTransition: true,
    authInterrupts: true,
  },
};

export default nextConfig;
