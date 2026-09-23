import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
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
