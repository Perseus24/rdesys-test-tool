import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore: ESLint property is not in NextConfig types yet
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
