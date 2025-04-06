import React from 'react';
import { graphql, PageProps, Link } from 'gatsby';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';

interface IndexPageProps extends PageProps {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: {
          fields: {
            slug: string;
          };
          frontmatter: {
            title: string;
            date: string;
            excerpt: string;
            tags: string[];
            author: {
              name: string;
              avatar: string;
            };
          };
        };
      }>;
    };
  };
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout
      title="Home"
      description="Welcome to my blog where I share my thoughts and experiences about software development and technology."
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to My Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Exploring software development, technology, and everything in between.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map(({ node }) => (
            <PostCard
              key={node.fields.slug}
              post={{
                slug: node.fields.slug,
                title: node.frontmatter.title,
                date: node.frontmatter.date,
                excerpt: node.frontmatter.excerpt,
                tags: node.frontmatter.tags,
                author: node.frontmatter.author,
              }}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/tags"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse by Tags
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query IndexPageQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/posts/" } }
      sort: { frontmatter: { date: DESC } }
      limit: 6
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            excerpt
            tags
            author {
              name
              avatar
            }
          }
        }
      }
    }
  }
`;

export const Head = () => <title>Home Page</title>;

export default IndexPage;
