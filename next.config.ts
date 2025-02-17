import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cdn.sanity.io"], // Add the Sanity CDN domain here
    deviceSizes: [320, 420, 768, 1024, 1200], // Default device sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96], // Default image sizes for srcset
    formats: ["image/webp"], // Enable WebP format for modern browsers
  },
};

export default nextConfig;
