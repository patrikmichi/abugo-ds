import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tokens': path.resolve(__dirname, './tokens'),
      '@tokens/scripts': path.resolve(__dirname, './tokens/scripts'),
      '@tokens/docs': path.resolve(__dirname, './tokens/docs'),
      '@tokens/output': path.resolve(__dirname, './tokens/output'),
      '@tokens/system': path.resolve(__dirname, './tokens/system'),
      '@tokens/types': path.resolve(__dirname, './tokens/types'),
    };
    return config;
  },
};

export default nextConfig;
