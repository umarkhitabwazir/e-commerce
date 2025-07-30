/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
  remotePatterns:[
    {
      protocol: 'http',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/dl5t2l1sc/image/upload/**',
      search: '',
    },
  ]
  },
};

module.exports = {
  async rewrites() {
    return [
      {
        // source: "/api/:path*",
        // destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
