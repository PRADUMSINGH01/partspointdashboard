import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: [
    "https://gflnll-3000.csb.app", // CodeSandbox
    "http://localhost:3000", // Local dev
  ],
} as NextConfig;

export default nextConfig;
