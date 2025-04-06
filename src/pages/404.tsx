import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';

const NotFoundPage: React.FC = () => {
  return (
    <Layout
      title="404: Page Not Found"
      description="Sorry, we couldn't find the page you were looking for."
    >
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 text-center">
          Oops! The page you're looking for has gone missing.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;