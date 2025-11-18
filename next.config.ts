import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prgdglyxhwyfndafjhto.supabase.co',
        port: '',
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during build
  }
};

export default nextConfig;
