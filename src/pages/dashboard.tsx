import React from 'react';
import { graphql, PageProps, Link } from 'gatsby';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from '../components/Layout';

interface Post {
  node: {
    frontmatter: {
      title: string;
      date: string;
      excerpt: string;
    };
    fields: {
      slug: string;
    };
  };
}

interface DashboardPageProps extends PageProps {
  data: {
    allMarkdownRemark: {
      edges: Post[];
    };
  };
}

const DashboardPage: React.FC<DashboardPageProps> = ({ data }) => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  if (!isAuthenticated) {
    return (
      <Layout
        title="Dashboard - Sign In Required"
        description="Sign in to access your dashboard"
      >
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to access your dashboard
          </h1>
          <button
            onClick={() => loginWithRedirect()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout
      title="Dashboard"
      description="Manage your blog posts"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <Link
            to="/write"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Write New Post
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Your Posts
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map(({ node }) => (
                <li key={node.fields.slug} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {node.frontmatter.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(node.frontmatter.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <Link
                        to={node.fields.slug}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit${node.fields.slug}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          // TODO: Implement delete functionality
                          console.log('Delete post:', node.fields.slug);
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query DashboardPosts {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/posts/" } }
      sort: { frontmatter: { date: DESC } }
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
          }
        }
      }
    }
  }
`;

export default DashboardPage;