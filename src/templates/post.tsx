import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import TagList from '../components/TagList';
import ReadingProgress from '../components/ReadingProgress';

interface PostTemplateProps extends PageProps {
  data: {
    markdownRemark: {
      frontmatter: {
        title: string;
        date: string;
        tags: string[];
        excerpt: string;
        author: {
          name: string;
          avatar: string;
        };
      };
      html: string;
    };
  };
}

const PostTemplate: React.FC<PostTemplateProps> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;

  return (
    <Layout
      title={frontmatter.title}
      description={frontmatter.excerpt}
    >
      <ReadingProgress />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {frontmatter.title}
          </h1>
          
          <div className="flex items-center mb-4">
            <img
              src={frontmatter.author.avatar}
              alt={frontmatter.author.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="text-lg text-gray-900 dark:text-white">
                {frontmatter.author.name}
              </p>
              <time className="text-gray-600 dark:text-gray-400">
                {new Date(frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>

          <TagList tags={frontmatter.tags} />
        </header>

        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </Layout>
  );
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        tags
        excerpt
        author {
          name
          avatar
        }
      }
    }
  }
`;

export default PostTemplate;