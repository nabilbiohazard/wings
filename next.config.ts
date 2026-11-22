import type { NextConfig } from "next";

const wooApiUrl = process.env.WC_API_URL;
const wooOrigin = wooApiUrl && URL.canParse(wooApiUrl) ? new URL(wooApiUrl) : undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'" },
        ...(process.env.NODE_ENV === "production"
          ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
          : []),
      ],
    }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.testvedad.ir",
      },
      ...(wooOrigin?.protocol === "https:"
        ? [{ protocol: "https" as const, hostname: wooOrigin.hostname, port: wooOrigin.port }]
        : []),
    ],
  },
};

export default nextConfig;
