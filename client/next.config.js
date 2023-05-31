/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "media.giphy.com",
      },
    ],
  },
};

module.exports = nextConfig;
