/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // For GitHub Pages deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '/choudharyom-blog' : '',
}

module.exports = nextConfig
