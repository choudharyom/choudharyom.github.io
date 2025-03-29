import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"

const IndexPage = ({ data }) => {
  console.log('Index page data:', data) // Add this debug line
  const posts = data?.allMarkdownRemark?.nodes || []

  return (
    <Layout>
      <div className="prose prose-lg mx-auto">
        <h1>Welcome to My Blog</h1>
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map(post => (
              <article key={post.id} className="border rounded-lg p-6">
                <h2>
                  <Link to={post.frontmatter.slug.startsWith('/') ? post.frontmatter.slug : `/${post.frontmatter.slug}`}>
                    {post.frontmatter.title}
                  </Link>
                </h2>
                <p>{post.frontmatter.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mb-8">
            <h2>Getting Started</h2>
            <p>No posts yet. Create your first post using the Write Post button.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          slug
          description
        }
      }
    }
  }
`

export default IndexPage
