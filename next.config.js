// /workspaces/choudharyom.github.io/next.config.js

/** @type {import('next').NextConfig} */

//const isProd = process.env.NODE_ENV === 'production';
// Define assetPrefix based on environment
//const assetPrefix = isProd ? '/choudharyom-blog' : '';

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    // Make sure image loader works with assetPrefix if needed,
    // but remotePatterns are usually fine.
    // loader: 'custom', // Example if you needed a custom loader
    // loaderFile: './src/lib/imageLoader.js', // Example
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  // Set the assetPrefix for Next.js internal use
  //assetPrefix: assetPrefix,
  //// Expose the assetPrefix to the client-side runtime
  //publicRuntimeConfig: {
  //  assetPrefix: assetPrefix,
  //},
  //env: { // Add this block
  //  NEXT_PUBLIC_ASSET_PREFIX: assetPrefix,
  //},
  trailingSlash: true,
  // If using `next export`, ensure trailing slashes match GitHub Pages expectations
  // trailingSlash: true, // Often needed for GH Pages subdirectories
}

module.exports = nextConfig;
