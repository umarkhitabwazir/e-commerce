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
        destination: "https://e-commerce-backend-one-lyart.vercel.app/api/v2/:path*",
      },
    ];
  },
};

export default nextConfig;