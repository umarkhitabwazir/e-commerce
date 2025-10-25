/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload/**`,
      },
    ],
  },
};

console.log('Cloudinary path:', process.env.NEXT_PUBLIC_CLOUD_NAME);

module.exports = nextConfig;
