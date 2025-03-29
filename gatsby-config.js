/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: "My Blog",
    siteUrl: "https://choudharyom.github.io",
    description: "Personal blog and portfolio",
    author: "Om Choudhary"
  },
  flags: {
    DEV_SSR: true,
    FAST_DEV: true,
  },
  plugins: [
    // File system
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/posts`,
      },
    },
    
    // Markdown processing
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
              throwOnError: false,
              trust: true,
              macros: {
                "\\f": "\\mathbf{f}"
              }
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              showLineNumbers: true, // Enable line numbers via Prism.js
              noInlineHighlight: true,
            },
          }
        ],
      },
    },

    // Core plugins
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",

    // Remove or comment out this section
    // Auth0 plugin
    /*{
      resolve: 'gatsby-plugin-auth0',
      options: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        callback: '/callback',
        afterCallback: '/dashboard'
      }
    }*/
  ]
}
