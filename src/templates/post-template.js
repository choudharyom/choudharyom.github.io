import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const PostTemplate = ({ data }) => {
  const post = data?.markdownRemark
  if (!post) return <div>Post not found</div>

  return (
    <Layout>
      <article className="prose max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{post.frontmatter.title}</h1>
          <time className="text-gray-600">{post.frontmatter.date}</time>
        </header>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Layout>
  )
}

export default PostTemplate

export const Head = ({ data }) => {
  const post = data.markdownRemark
  return (
    <>
      <title>{post.frontmatter.title}</title>
      <meta name="description" content={post.frontmatter.description} />
    </>
  )
}

// Rename to query (not pageQuery) to match Gatsby v5 conventions
export const query = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        slug
        tags
      }
    }
  }
`
