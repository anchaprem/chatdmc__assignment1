import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for API routes to work
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove assetPrefix and basePath for normal deployment
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/chatdmc_assignment1' : '',
  // basePath: process.env.NODE_ENV === 'production' ? '/chatdmc_assignment1' : '',
};

export default nextConfig;
