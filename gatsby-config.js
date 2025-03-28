/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  pathPrefix: "/", // No prefix needed for username.github.io repos
  siteMetadata: {
    title: "My Blog",
    siteUrl: "https://choudharyom.github.io",
    description: "Personal blog and portfolio",
    author: "Om Choudhary"
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`
            }
          },
          "gatsby-remark-prismjs"
        ],
      },
    },
  ]
}
