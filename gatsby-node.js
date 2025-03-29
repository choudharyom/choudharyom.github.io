const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            slug
            tags
          }
          id
        }
      }
    }
  `)

  if (result.errors) {
    console.error(result.errors)
    return
  }

  // Create post pages
  const postTemplate = path.resolve(__dirname, 'src/templates/post-template.js')
  const tagTemplate = path.resolve(__dirname, 'src/templates/tag-template.js')

  // Create individual post pages
  result.data.allMarkdownRemark.nodes.forEach((node) => {
    if (!node.frontmatter.slug) {
      console.warn('Post missing slug:', node)
      return
    }
    
    // Normalize slug format
    const slug = node.frontmatter.slug.startsWith('/') 
      ? node.frontmatter.slug 
      : `/${node.frontmatter.slug}`
    
    createPage({
      path: slug,
      component: postTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })

  // Create tag pages
  const tags = new Set()
  result.data.allMarkdownRemark.nodes.forEach(node => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => tags.add(tag))
    }
  })

  tags.forEach(tag => {
    createPage({
      path: `/tags/${tag}`,
      component: tagTemplate,
      context: {
        tag,
      },
    })
  })
}

// Make frontmatter fields required
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter!
      wordCount: WordCount!
    }

    type WordCount {
      words: Int
    }

    type Frontmatter {
      title: String!
      date: Date! @dateformat
      slug: String!
      description: String
      tags: [String]
      status: String
      author: String
    }
  `
  createTypes(typeDefs)
}
