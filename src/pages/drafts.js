import React from 'react'
import { graphql, Link, navigate } from 'gatsby'
import Layout from '../components/layout'
import { useAuth } from '../components/auth-provider'

const DraftsPage = ({ data }) => {
  const { isAuthenticated, user, isWriter } = useAuth()

  React.useEffect(() => {
    if (!isAuthenticated || !isWriter) {
      navigate('/login')
    }
  }, [isAuthenticated, isWriter])

  const allPosts = data?.allMarkdownRemark?.nodes || []
  const userDrafts = allPosts.filter(post => 
    post.frontmatter.author === user?.name && 
    post.frontmatter.status === 'draft'
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Drafts</h1>
        
        <div className="grid gap-6">
          {userDrafts.map(post => (
            <article key={post.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link to={`/write?draft=${post.frontmatter.slug}`}>
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">
                Last modified: {post.frontmatter.date}
              </p>
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
      filter: { frontmatter: { status: { eq: "draft" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          slug
          status
          author
        }
      }
    }
  }
`

export default DraftsPage
