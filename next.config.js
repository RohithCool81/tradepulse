/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Disable caching in production
    workerThreads: false,
    cpus: 1
  },
  // Force full page reload
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  generateEtags: false,
};

module.exports = nextConfig;
