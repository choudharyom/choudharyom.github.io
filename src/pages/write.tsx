import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from '../components/Layout';
import MarkdownEditor from '../components/MarkdownEditor';

const WritePage: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  if (!isAuthenticated) {
    return (
      <Layout
        title="Write - Sign In Required"
        description="Sign in to create a new blog post"
      >
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to write a post
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const post = {
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      date: new Date().toISOString(),
    };

    // TODO: Implement post submission logic
    // For now, just redirect to home
    await navigate('/');
  };

  return (
    <Layout
      title="Write a New Post"
      description="Create a new blog post"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Write a New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="react, gatsby, web development"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Content
            </label>
            <MarkdownEditor
              initialValue={content}
              onChange={setContent}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default WritePage;