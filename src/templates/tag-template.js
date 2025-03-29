import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

export default function TagTemplate({ data, pageContext }) {
  const { tag } = pageContext
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Posts tagged "{tag}"</h1>
        </header>
        <div className="grid gap-6">
          {posts.map(post => (
            <article key={post.id} className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-2">
                <Link to={`/${post.frontmatter.slug}`} className="hover:text-blue-600">
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.frontmatter.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags?.map(t => (
                  <Link
                    key={t}
                    to={`/tags/${t}`}
                    className={`text-sm ${t === tag ? 'text-blue-800 font-bold' : 'text-blue-600'} hover:text-blue-800`}
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($tag: String) {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          slug
          description
          tags
        }
      }
    }
  }
`
