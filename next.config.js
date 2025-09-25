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
    unoptimized: isProd, // Required for static export
    domains: ['*'], // Allow all domains for images
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
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
};

module.exports = nextConfig;
