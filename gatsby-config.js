/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  pathPrefix: "/", // No prefix needed for username.github.io repos
  siteMetadata: {
    title: "Om Choudhary's Blog",
    siteUrl: "https://choudharyom.com",
    description: "Personal blog and portfolio",
    author: "Om Choudhary"
  },
  plugins: [
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-mathjax`,
          `gatsby-remark-prismjs`,
        ],
      },
    },
  ]
}
