import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};
module.exports = {
  async rewrites() {
      return [
          {
              source: "/api/:path*",
              destination: "/api/v2/:path*"
          }
      ];
  }
};


export default nextConfig;
