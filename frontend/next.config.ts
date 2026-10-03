import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.TOOLBOXES_BACKEND_URL ?? "http://localhost:4237";
    return [
      { source: "/auth/:path*", destination: `${backendUrl}/auth/:path*` },
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
    ];
  },
};
export default nextConfig;
