import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
};

module.exports = {
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
