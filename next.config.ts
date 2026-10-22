import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/reference/stuntdouble-mcp', destination: '/mcp', permanent: true },
      { source: '/reference/stuntkit', destination: '/stuntkit', permanent: true },
      { source: '/api/mcp', destination: '/mcp', permanent: true },
      { source: '/stuntkit/spelling', destination: '/stuntkit/localeizer', permanent: true },
      { source: '/stuntkit/americanize', destination: '/stuntkit/localeizer', permanent: true },
    ];
  },
};

export default withMDX(nextConfig);
