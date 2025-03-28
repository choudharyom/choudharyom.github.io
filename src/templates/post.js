import React from "react"
import { graphql } from "gatsby"

export default function BlogPost({ data }) {
  const post = data.markdownRemark

  return (
    <article className="blog-post">
      <h1>{post.frontmatter.title}</h1>
      <div className="post-date">{post.frontmatter.date}</div>
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {/* Disqus comments will be added later */}
    </article>
  )
}

export const query = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        slug
      }
    }
  }
`
