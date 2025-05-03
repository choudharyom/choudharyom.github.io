// src/components/elhclf/FilesystemConfig.js
import React from 'react';

/**
 * Component for configuring root filesystem options.
 *
 * @param {object} props - Component props.
 * @param {object} props.filesystemConfig - The current filesystem configuration object (e.g., config.filesystem).
 * @param {function} props.onChange - Callback function to update the parent state.
 *                                    Should accept (fieldName, value).
 */
const FilesystemConfig = ({ filesystemConfig, onChange }) => {

  // Handler for simple input changes (text, select, password)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value); // Pass field name and new value up
  };

  // Handler for textareas representing arrays of strings (one item per line)
  const handleTextareaArrayChange = (e) => {
    const { name, value } = e.target;
    // Split by newline, trim whitespace, and filter out empty lines
    const arrayValue = value.split('\n').map(item => item.trim()).filter(item => item !== '');
    onChange(name, arrayValue);
  };

  // Helper to convert array back to string for textarea display
  const arrayToTextareaString = (arr) => (arr || []).join('\n');

  // Common Filesystem Types
  const fsTypes = ['ext4', 'squashfs', 'jffs2', 'ubifs', 'btrfs', 'f2fs', 'initramfs'];
  // Common Compression Types (relevant for squashfs, initramfs etc.)
  const compressionTypes = ['gzip', 'xz', 'lz4', 'zstd', 'none'];


  return (
    <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Filesystem Configuration</h3>

      {/* Filesystem Type */}
      <div>
        <label htmlFor="fsType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filesystem Type *</label>
        <select
          id="fsType"
          name="type" // Corresponds to the key in filesystemConfig
          value={filesystemConfig.type || ''} // Controlled component
          onChange={handleInputChange}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select Type...</option>
          {fsTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select the primary root filesystem format.</p>
      </div>

      {/* Filesystem Size */}
      <div>
        <label htmlFor="fsSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filesystem Size (Optional)</label>
        <input
          type="text"
          id="fsSize"
          name="size" // Corresponds to the key in filesystemConfig
          value={filesystemConfig.size || ''} // Controlled component
          onChange={handleInputChange}
          placeholder="e.g., 512M, 1G, auto"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Specify a fixed size or leave blank/use 'auto' for automatic sizing.</p>
      </div>

      {/* Compression Type (Relevant for SquashFS, Initramfs, etc.) */}
      <div>
        <label htmlFor="fsCompression" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compression (Optional)</label>
        <select
          id="fsCompression"
          name="compression" // Corresponds to the key in filesystemConfig
          value={filesystemConfig.compression || ''} // Controlled component
          onChange={handleInputChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Default/None</option>
          {compressionTypes.map(comp => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select compression method (e.g., for SquashFS).</p>
      </div>

      {/* Root Password */}
      <div>
        <label htmlFor="fsRootPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Root Password (Optional)</label>
        <input
          type="password" // Use password type for basic obfuscation
          id="fsRootPassword"
          name="rootPassword" // Corresponds to the key in filesystemConfig
          value={filesystemConfig.rootPassword || ''} // Controlled component
          onChange={handleInputChange}
          placeholder="Enter desired root password"
          autoComplete="new-password" // Prevent browser autofill from existing passwords
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
           Warning: Storing plain-text passwords is insecure. Consider setting this during first boot or using pre-hashed passwords if your build system supports it. Leave blank to disable root login or use default.
         </p>
      </div>

      {/* Overlay Files */}
      <div>
        <label htmlFor="fsOverlayFiles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Overlay Files (Optional, one per line)</label>
        <textarea
          id="fsOverlayFiles"
          name="overlayFiles"
          rows={4}
          value={arrayToTextareaString(filesystemConfig.overlayFiles)}
          onChange={handleTextareaArrayChange}
          placeholder="Enter source:destination paths, one per line. e.g., ./my_config.txt:/etc/my_config.txt"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Files/directories to copy into the root filesystem image. Use ':' to separate source (local path) from destination (absolute path in image).</p>
      </div>

      {/* Custom Scripts */}
      <div>
        <label htmlFor="fsCustomScripts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customization Scripts (Optional, one per line)</label>
        <textarea
          id="fsCustomScripts"
          name="customScripts"
          rows={3}
          value={arrayToTextareaString(filesystemConfig.customScripts)}
          onChange={handleTextareaArrayChange}
          placeholder="Enter paths to scripts to run after populating the filesystem, one per line..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Scripts executed within the chroot environment of the target filesystem before finalization.</p>
      </div>

    </div>
  );
};

export default FilesystemConfig;
