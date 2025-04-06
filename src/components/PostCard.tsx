import React from 'react';
import { Link } from 'gatsby';
import TagList from './TagList';

interface Author {
  name: string;
  avatar: string;
}

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    author: Author;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={post.slug} className="block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h2>
          
          <div className="flex items-center mb-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <Link
                to={`/author/${post.author.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {post.author.name}
              </Link>
              <time className="block text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {post.excerpt}
          </p>

          <TagList tags={post.tags} />
        </div>
      </Link>
    </article>
  );
};

export default PostCard;