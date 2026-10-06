import path from "node:path";
import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.TOOLBOXES_BACKEND_URL ??
  "http://localhost:4237";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, ".."),
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: `${backendUrl}/auth/:path*` },
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
    ];
  },
};
export default nextConfig;
