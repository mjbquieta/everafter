import { resolve } from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@everafter/ui'],
  outputFileTracingRoot: resolve(__dirname, '../../'),
};

export default nextConfig;
