import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
};

module.exports = {
  images: {
    domains: ["via.placeholder.com"], // Add your external image domain here
  },
};

export default nextConfig;
