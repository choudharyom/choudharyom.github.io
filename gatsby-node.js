const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

// Define custom schema to ensure proper data structure
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  // Define the schema for our markdown frontmatter
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter!
      fields: Fields!
      html: String!
      excerpt: String!
    }

    type Frontmatter @dontInfer {
      title: String!
      date: Date! @dateformat
      tags: [String!]!
      excerpt: String!
      author: Author!
      name: String
      role: String
      bio: String
      avatar: String
      social: Social
    }

    type Author @dontInfer {
      name: String!
      avatar: String!
      bio: String
      role: String
      social: Social
    }

    type Social @dontInfer {
      github: String
      twitter: String
      linkedin: String
    }

    type Fields {
      slug: String!
    }
  `;

  createTypes(typeDefs);
};

// Create slugs for files
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'content' });
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

// Create pages from markdown files
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Get templates
  const blogPost = path.resolve('./src/templates/post.tsx');
  const tagTemplate = path.resolve('./src/templates/tag.tsx');
  const profileTemplate = path.resolve('./src/templates/profile.tsx');

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      posts: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/posts/" } }
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            tags
            author {
              name
            }
          }
        }
      }
      profiles: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/profiles/" } }
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            name
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      'There was an error loading your blog posts or profiles',
      result.errors
    );
    return;
  }

  const posts = result.data.posts.nodes;
  const profiles = result.data.profiles.nodes;

  // Create blog post pages
  posts.forEach((post, index) => {
    const previousPostId = index === 0 ? null : posts[index - 1].id;
    const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id;

    createPage({
      path: post.fields.slug,
      component: blogPost,
      context: {
        id: post.id,
        slug: post.fields.slug,
        previousPostId,
        nextPostId,
      },
    });
  });

  // Create profile pages
  profiles.forEach(profile => {
    createPage({
      path: `/author${profile.fields.slug}`,
      component: profileTemplate,
      context: {
        id: profile.id,
        slug: profile.fields.slug,
        author: profile.frontmatter.name,
      },
    });
  });

  // Extract tag data from query
  const tags = new Set();
  posts.forEach(post => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach(tag => tags.add(tag));
    }
  });

  // Create tag pages
  Array.from(tags).forEach(tag => {
    createPage({
      path: `/tags/${tag.toLowerCase()}/`,
      component: tagTemplate,
      context: {
        tag,
      },
    });
  });
};