import React from 'react';
import { Link } from 'gatsby';

interface TagListProps {
  tags: string[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Link
          key={tag}
          to={`/tags/${tag.toLowerCase()}`}
          className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
};

export default TagList;