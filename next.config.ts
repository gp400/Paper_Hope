import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows builds even with TypeScript errors
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/catalog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
