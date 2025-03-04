import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
};

module.exports = {
  images: {
    domains: [
      "via.placeholder.com",
      "lh3.googleusercontent.com",
      "static-00.iconduck.com",
      "i.sstatic.net",
      "localhost",
      "raw.githubusercontent.com",
    ], // Add your external image domain here
  },
};

export default nextConfig;
