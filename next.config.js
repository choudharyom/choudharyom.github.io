/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  // For GitHub Pages deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '/choudharyom-blog' : '',
}

module.exports = nextConfig
