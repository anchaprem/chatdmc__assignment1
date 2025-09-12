import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/chatdmc_assignment1' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/chatdmc_assignment1' : '',
};

export default nextConfig;
