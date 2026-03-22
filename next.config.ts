import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use 'export' for Capacitor/Mobile builds, but keep it standard for Vercel
  output: process.env.VERCEL ? undefined : 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
