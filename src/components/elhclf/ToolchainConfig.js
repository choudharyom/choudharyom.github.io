// src/components/elhclf/ToolchainConfig.js
import React from 'react';

/**
 * Component for configuring the toolchain.
 *
 * @param {object} props - Component props.
 * @param {object} props.toolchainConfig - The current toolchain configuration object (e.g., config.toolchain).
 * @param {function} props.onChange - Callback function to update the parent state.
 *                                    Should accept (fieldName, value).
 */
const ToolchainConfig = ({ toolchainConfig, onChange }) => {

  // Handler for simple input changes (text, select)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value); // Pass field name and new value up
  };

  const toolchainTypes = ['external', 'buildroot', 'yocto', 'local']; // Add more as needed

  return (
    <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Toolchain Configuration</h3>

      {/* Toolchain Type */}
      <div>
        <label htmlFor="toolchainType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toolchain Type *</label>
        <select
          id="toolchainType"
          name="type" // Corresponds to the key in toolchainConfig
          value={toolchainConfig.type || ''} // Controlled component
          onChange={handleInputChange}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select Type...</option>
          {toolchainTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select how the toolchain is provided or built.</p>
      </div>

      {/* Conditional Fields based on Type */}
      {toolchainConfig.type === 'external' && (
        <>
          <div>
            <label htmlFor="toolchainUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toolchain URL (Optional)</label>
            <input
              type="url"
              id="toolchainUrl"
              name="url"
              value={toolchainConfig.url || ''}
              onChange={handleInputChange}
              placeholder="e.g., URL to download pre-built toolchain tarball"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="toolchainPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toolchain Path *</label>
            <input
              type="text"
              id="toolchainPath"
              name="path"
              value={toolchainConfig.path || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g., /opt/toolchains/gcc-arm-linux-gnueabihf"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Path where the external toolchain is located/extracted.</p>
          </div>
        </>
      )}

      {toolchainConfig.type === 'local' && (
        <div>
          <label htmlFor="toolchainLocalPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local Toolchain Path *</label>
          <input
            type="text"
            id="toolchainLocalPath"
            name="path"
            value={toolchainConfig.path || ''}
            onChange={handleInputChange}
            required
            placeholder="e.g., /path/to/your/custom/toolchain"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {/* Fields relevant for multiple types */}
      {(toolchainConfig.type === 'external' || toolchainConfig.type === 'local') && (
         <div>
            <label htmlFor="toolchainPrefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toolchain Prefix (Optional)</label>
            <input
              type="text"
              id="toolchainPrefix"
              name="prefix"
              value={toolchainConfig.prefix || ''}
              onChange={handleInputChange}
              placeholder="e.g., arm-linux-gnueabihf-"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Specify if the toolchain binaries have a specific prefix (often auto-detected).</p>
          </div>
      )}

       {/* Toolchain Version (Optional, often inferred) */}
      <div>
        <label htmlFor="toolchainVersion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Toolchain Version (Optional)</label>
        <input
          type="text"
          id="toolchainVersion"
          name="version"
          value={toolchainConfig.version || ''}
          onChange={handleInputChange}
          placeholder="e.g., 11.2.0 (Often inferred)"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Specify if needed, otherwise it might be detected by the build system.</p>
      </div>

       {/* Placeholder for Buildroot/Yocto specific options */}
       {(toolchainConfig.type === 'buildroot' || toolchainConfig.type === 'yocto') && (
         <div className="p-3 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              For '{toolchainConfig.type}', toolchain configuration is typically managed within the build system's own configuration (e.g., defconfig, local.conf). Specific overrides might be added here in the future.
            </p>
         </div>
       )}

    </div>
  );
};

export default ToolchainConfig;
