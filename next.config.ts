import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: [
    "https://gflnll-3000.csb.app", // CodeSandbox
    "https://partspointdashboard.vercel.app/", // Local dev
  ],
} as NextConfig;

export default nextConfig;
