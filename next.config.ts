import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Device breakpoints used to generate srcset widths for <Image fill> and responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Fixed-size image steps (used for width= prop)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Prefer AVIF first (smallest), fallback to WebP — Next.js negotiates via Accept header
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 30 days on the server (Cloudinary CDN handles its own headers)
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/procurement', destination: '/services/procurement' },
      { source: '/project-coordination', destination: '/services/project-coordination' },
      { source: '/materials-project-supplies', destination: '/services/materials-project-supplies' },
      { source: '/for-architects-designers', destination: '/services/for-architects-designers' },
      { source: '/for-builders-contractors', destination: '/services/for-builders-contractors' },
      { source: '/how-we-work', destination: '/services/how-we-work' },
    ];
  },
};

export default nextConfig;
