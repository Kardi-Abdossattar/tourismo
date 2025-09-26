/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    loader: 'custom',
    loaderFile: './lib/imageLoader.js'
  },
  // GitHub Pages deployment configuration
  basePath: process.env.NODE_ENV === 'production' ? '/tourismo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tourismo/' : '',
};

module.exports = nextConfig;
