import React from "react"
import { graphql } from "gatsby"

export default function PostTemplate({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
        <div className="text-gray-600 mb-8">
          {frontmatter.date}
        </div>
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`
