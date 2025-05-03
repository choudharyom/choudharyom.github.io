// src/components/elhclf/PackageSelector.js
import React, { useState } from 'react';

/**
 * Component for selecting packages to include in the root filesystem.
 *
 * @param {object} props - Component props.
 * @param {string[]} props.packagesList - The current array of package names (e.g., config.packages).
 * @param {function} props.onChange - Callback function to update the parent state.
 *                                    Should accept the updated array of packages.
 */
const PackageSelector = ({ packagesList, onChange }) => {
  const [newPackageName, setNewPackageName] = useState('');

  // Handle input change for the new package name
  const handleInputChange = (e) => {
    setNewPackageName(e.target.value);
  };

  // Handle adding a new package
  const handleAddPackage = (e) => {
    e.preventDefault(); // Prevent form submission if wrapped in a form
    const trimmedName = newPackageName.trim();
    if (trimmedName && !(packagesList || []).includes(trimmedName)) {
      const updatedList = [...(packagesList || []), trimmedName];
      onChange(updatedList); // Pass the entire updated array up
      setNewPackageName(''); // Clear the input field
    } else if ((packagesList || []).includes(trimmedName)) {
      // Optional: Add feedback if package already exists
      console.warn(`Package "${trimmedName}" is already in the list.`);
      setNewPackageName(''); // Still clear input
    }
  };

  // Handle removing a package
  const handleRemovePackage = (packageNameToRemove) => {
    const updatedList = (packagesList || []).filter(pkg => pkg !== packageNameToRemove);
    onChange(updatedList); // Pass the entire updated array up
  };

  return (
    <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Package Selection</h3>

      {/* Input for adding new packages */}
      <form onSubmit={handleAddPackage} className="flex items-center space-x-2">
        <input
          type="text"
          value={newPackageName}
          onChange={handleInputChange}
          placeholder="Enter package name (e.g., openssh-server)"
          className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          disabled={!newPackageName.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>
       <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Specify packages to install in the root filesystem (e.g., busybox, dropbear, python3).</p>

      {/* List of selected packages */}
      {(packagesList && packagesList.length > 0) ? (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Packages:</h4>
          <ul className="space-y-1 max-h-60 overflow-y-auto pr-2">
            {packagesList.map((pkgName) => (
              <li key={pkgName} className="flex justify-between items-center text-sm text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <span>{pkgName}</span>
                <button
                  onClick={() => handleRemovePackage(pkgName)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium"
                  aria-label={`Remove ${pkgName}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No packages selected yet.</p>
      )}
    </div>
  );
};

export default PackageSelector;
