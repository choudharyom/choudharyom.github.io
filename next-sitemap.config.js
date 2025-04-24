// filepath: /workspaces/choudharyom.github.io/next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://choudharyom.com', // Replace if your site URL is different
  generateRobotsTxt: true, // Optional: Generates a robots.txt file as well
  // Optional: Add any pages to exclude if needed
  // exclude: ['/admin/*', '/private-page'],
  // Optional: Configure robots.txt rules
  // robotsTxtOptions: {
  //   policies: [
  //     { userAgent: '*', allow: '/' },
  //     // Add more specific rules if needed
  //     // { userAgent: 'Googlebot', disallow: ['/admin'] },
  //   ],
  //   additionalSitemaps: [
  //     // Add other sitemaps if you have them, e.g., for a server-side sitemap
  //     // 'https://choudharyom.github.io/server-sitemap.xml',
  //   ],
  // },
};