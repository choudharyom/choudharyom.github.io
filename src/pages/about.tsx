import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';

interface AboutPageData {
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
}

interface AboutPageProps extends PageProps {
  data: AboutPageData;
}

const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;

  return (
    <Layout
      title="About Me"
      description={frontmatter.bio}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
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
            
            <div className="flex space-x-4 mb-8">
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

        <div 
          className="prose dark:prose-invert max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query AboutPage {
    markdownRemark(fileAbsolutePath: { regex: "/content/profiles/om.md/" }) {
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
      html
    }
  }
`;

export default AboutPage;