import React from 'react';
import { graphql, PageProps, Link } from 'gatsby';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';

interface TagTemplateProps extends PageProps {
  data: {
    allMarkdownRemark: {
      totalCount: number;
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
  pageContext: {
    tag: string;
  };
}

const TagTemplate: React.FC<TagTemplateProps> = ({ data, pageContext }) => {
  const { tag } = pageContext;
  const { totalCount } = data.allMarkdownRemark;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout
      title={`Posts tagged "${tag}"`}
      description={`All posts tagged with ${tag}`}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              #{tag}
            </h1>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              {totalCount} post{totalCount === 1 ? '' : 's'}
            </span>
          </div>
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

        <div className="mt-8 text-center">
          <Link
            to="/tags"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← View all tags
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query TagPage($tag: String!) {
    allMarkdownRemark(
      filter: { 
        fileAbsolutePath: { regex: "/content/posts/" }
        frontmatter: { tags: { in: [$tag] } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      totalCount
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

export default TagTemplate;