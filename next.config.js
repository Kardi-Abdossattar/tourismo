/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Enable static HTML export in production
  output: isProd ? 'export' : undefined,
  
  // Set the output directory for the static export
  distDir: isProd ? 'out' : '.next',
  
  // Add trailing slashes for better static export compatibility
  trailingSlash: true,
  
  // Configure image optimization
  images: {
    unoptimized: true, // Always unoptimized for static export
    domains: ['*'], // Allow all domains for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  
  // TypeScript and ESLint configurations
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable React strict mode in development to prevent double rendering
  reactStrictMode: false,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Disable server components external packages
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Disable static page generation for all pages by default
  // Pages will need to explicitly opt-in to static generation
  generateEtags: false,
};

// For production builds, ensure static export is enabled
if (isProd) {
  nextConfig.output = 'export';
  nextConfig.images.unoptimized = true;
}

module.exports = nextConfig;
