import React from 'react';
import { graphql, PageProps, Link } from 'gatsby';
import Layout from '../components/Layout';

interface ProfileTemplateProps extends PageProps {
  data: {
    markdownRemark: {
      frontmatter: {
        name: string;
        role: string;
        bio: string;
        avatar: string;
        social: {
          github: string;
          twitter: string;
          linkedin: string;
        };
      };
      html: string;
    };
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
          };
        };
      }>;
    };
  };
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout
      title={`${frontmatter.name} - Profile`}
      description={frontmatter.bio}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <img
            src={frontmatter.avatar}
            alt={frontmatter.name}
            className="w-48 h-48 rounded-full object-cover"
          />
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {frontmatter.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {frontmatter.role}
            </p>
            
            <div className="flex space-x-4">
              <a
                href={`https://github.com/${frontmatter.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                GitHub
              </a>
              <a
                href={`https://twitter.com/${frontmatter.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Twitter
              </a>
              <a
                href={`https://linkedin.com/in/${frontmatter.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Posts by {frontmatter.name}
          </h2>

          <div className="grid gap-6">
            {posts.map(({ node }) => (
              <Link
                key={node.fields.slug}
                to={node.fields.slug}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {node.frontmatter.title}
                </h3>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(node.frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {node.frontmatter.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query ProfileBySlug($slug: String!, $author: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        name
        role
        bio
        avatar
        social {
          github
          twitter
          linkedin
        }
      }
    }
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/posts/" }
        frontmatter: { author: { name: { eq: $author } } }
      }
      sort: { frontmatter: { date: DESC } }
      limit: 5
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

export default ProfileTemplate;