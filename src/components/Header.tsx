import React from 'react';
import { Link } from 'gatsby';
import DarkModeToggle from './DarkModeToggle';
import AuthButton from './AuthButton';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Om's Blog
            </Link>
          </div>

          <nav className="flex items-center space-x-8">
            <Link
              to="/about"
              className="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              to="/tags"
              className="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Tags
            </Link>
            <Link
              to="/dashboard"
              className="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;