import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-4f8d891a020d4411881ad48eb21b5d94.r2.dev",
      },
    ],
  },
};

export default nextConfig;
