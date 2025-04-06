import React from 'react';
import { graphql, PageProps, Link } from 'gatsby';
import Layout from '../components/Layout';

interface TagData {
  fieldValue: string;
  totalCount: number;
  nodes: {
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
      date: string;
      excerpt: string;
    };
  }[];
}

interface TagsPageProps extends PageProps {
  data: {
    allMarkdownRemark: {
      group: TagData[];
    };
  };
}

const TagsPage: React.FC<TagsPageProps> = ({ data }) => {
  const tags = data.allMarkdownRemark.group.sort((a, b) => b.totalCount - a.totalCount);

  return (
    <Layout
      title="Tags"
      description="Browse posts by tags"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Tags
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {tags.map(tag => (
            <div
              key={tag.fieldValue}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    #{tag.fieldValue}
                  </h2>
                  <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {tag.totalCount} posts
                  </span>
                </div>

                <ul className="space-y-3">
                  {tag.nodes.map(post => (
                    <li key={post.fields.slug}>
                      <Link
                        to={post.fields.slug}
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 -mx-6 px-6 py-3"
                      >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {post.frontmatter.title}
                        </h3>
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query TagsPage {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/posts/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            date
            excerpt
          }
        }
      }
    }
  }
`;

export default TagsPage;