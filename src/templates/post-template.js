import React from "react"
import { graphql, Link } from "gatsby"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import Layout from "../components/layout"
import LikeButton from "../components/like-button"
import BookmarkButton from "../components/bookmark-button"
import CodeBlock from "../components/code-block"

const PostTemplate = ({ data }) => {
  const post = data?.markdownRemark
  if (!post) return <div>Post not found</div>

  // Calculate reading time
  const wordsPerMinute = 200
  const wordCount = post.wordCount.words
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return (
    <Layout>
      <article className="post-container">
        <header className="article-header">
          <h1 className="text-4xl font-bold mb-4">{post.frontmatter.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <time className="text-sm">{post.frontmatter.date}</time>
            <span>·</span>
            <span className="text-sm">{readingTime} min read</span>
          </div>
          {post.frontmatter.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.frontmatter.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
          <div className="interaction-bar">
            <LikeButton postId={post.id} />
            <BookmarkButton postId={post.id} title={post.frontmatter.title} />
          </div>
        </header>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown 
            rehypePlugins={[rehypeRaw]}
            components={{
              code: CodeBlock
            }}
          >
            {post.rawMarkdownBody}
          </ReactMarkdown>
        </div>
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

export const query = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      id
      rawMarkdownBody
      wordCount {
        words
      }
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
