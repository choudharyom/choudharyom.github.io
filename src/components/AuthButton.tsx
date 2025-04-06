import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButton: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => loginWithRedirect()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative group">
      <button className="inline-flex items-center space-x-2">
        <img
          src={user?.picture}
          alt={user?.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-700 dark:text-gray-300">{user?.name}</span>
      </button>
      
      <div className="absolute right-0 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AuthButton;