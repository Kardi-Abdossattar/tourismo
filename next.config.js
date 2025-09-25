/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable image optimization for static export
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  // Generate a sitemap on build
  generateBuildId: async () => 'build',
  // Ensure we don't try to use server-side features in static export
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
};

module.exports = nextConfig;
