import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/reference/stuntdouble-mcp', destination: '/mcp', permanent: true }];
  },
};

export default withMDX(nextConfig);
