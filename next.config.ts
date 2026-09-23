import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.testvedad.ir",
      },
    ],
  },
};

export default nextConfig;
