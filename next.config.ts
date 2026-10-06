import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos uploaded through the admin live in Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
