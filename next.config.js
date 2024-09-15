/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['b.zmtcdn.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'b.zmtcdn.com',
          pathname: '/data/pictures/**',
        },
      ],
    },
  }
  
  module.exports = nextConfig