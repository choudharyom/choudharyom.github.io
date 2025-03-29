import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import SearchBar from '../components/search-bar'

const SearchPage = ({ data, location }) => {
  const allPosts = data.allMarkdownRemark.nodes
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase()

  const searchResults = query
    ? allPosts.filter(post => {
        const searchContent = `
          ${post.frontmatter.title}
          ${post.frontmatter.description}
          ${post.frontmatter.tags?.join(' ')}
        `.toLowerCase()
        return searchContent.includes(query)
      })
    : []

  return (
    <Layout hideSearch>
      <div className="max-w-4xl mx-auto">
        <SearchBar />
        
        {query && (
          <h1 className="text-2xl mb-6">
            Search Results for "{query}" ({searchResults.length})
          </h1>
        )}

        <div className="grid gap-6">
          {searchResults.map(post => (
            <article key={post.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link to={`/${post.frontmatter.slug}`} className="text-primary hover:underline">
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.frontmatter.description}</p>
              <div className="text-sm text-gray-500">
                {post.frontmatter.date}
              </div>
            </article>
          ))}

          {query && searchResults.length === 0 && (
            <p className="text-center text-gray-600">
              No posts found matching your search.
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { status: { ne: "draft" } } }
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

export default SearchPage
