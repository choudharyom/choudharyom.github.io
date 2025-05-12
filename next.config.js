// /workspaces/choudharyom.github.io/next.config.js

/** @type {import('next').NextConfig} */

const nextConfig = {
  // Remove or comment out the output: 'export' line since it's incompatible with API routes
  // output: 'export', 
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  trailingSlash: true,
}

module.exports = nextConfig;
