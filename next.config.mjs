import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Silence workspace root inference warnings by pinning the tracing root
  outputFileTracingRoot: path.join(process.cwd()),
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
