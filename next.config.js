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
  // Disable all caching mechanisms
  experimental: {
    workerThreads: false,
    cpus: 1,
    disableOptimizedLoading: true,
    optimizeCss: false,
  },
  // Force clean builds
  cleanDistDir: true,
  swcMinify: false,
  generateEtags: false,
  compress: false,
  poweredByHeader: false,
  reactStrictMode: false,
};

module.exports = nextConfig;
