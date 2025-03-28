const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.nodes.forEach((node) => {
    createPage({
      path: node.frontmatter.slug,
      component: path.resolve(`./src/templates/post-template.js`),
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })
}
