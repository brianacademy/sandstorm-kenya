import type { NextConfig } from "next";

// Parse the backend hostname from the env var for image remotePatterns
function backendHostname(): string {
  try {
    const url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
    return new URL(url).hostname;
  } catch {
    return "localhost";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Flag CDN (currency selector)
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      // Railway backend (product images uploaded via Medusa Admin)
      {
        protocol: "https",
        hostname: "*.up.railway.app",
      },
      // Allow the specific backend hostname from env (covers both local + prod)
      {
        protocol: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.startsWith("https") ? "https" : "http",
        hostname: backendHostname(),
      },
      // Cloudflare R2 / S3 (for future media uploads)
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
