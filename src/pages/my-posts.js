import React from 'react'
import { graphql, Link, navigate } from 'gatsby'
import Layout from '../components/layout'
import { useAuth } from '../components/auth-provider'

const MyPostsPage = ({ data }) => {
  const { isAuthenticated, user, isWriter } = useAuth()
  const allPosts = data?.allMarkdownRemark?.nodes || []
  const userPosts = allPosts.filter(post => post.frontmatter.author === user?.name)

  React.useEffect(() => {
    if (!isAuthenticated || !isWriter) {
      navigate('/login')
    }
  }, [isAuthenticated, isWriter])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Posts</h1>
        
        <div className="grid gap-6">
          {userPosts.map(post => (
            <article key={post.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link 
                  to={`/${post.frontmatter.slug}`}
                  className="text-primary hover:text-opacity-80"
                >
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.frontmatter.description}</p>
              <div className="flex gap-4">
                <span className="text-sm text-gray-500">
                  {post.frontmatter.date}
                </span>
                <span className="text-sm text-gray-500">
                  Status: {post.frontmatter.status || 'Published'}
                </span>
              </div>
            </article>
          ))}
        </div>
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
          author
          status
        }
      }
    }
  }
`

export default MyPostsPage
