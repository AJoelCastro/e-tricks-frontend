import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bata.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'media.falabella.com'
      },
      {
        protocol: 'https',
        hostname: 'media.falabella.com.pe'
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
      }
    ],
  },
};

export default nextConfig;
