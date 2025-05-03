// src/components/elhclf/BootloaderConfig.js
import React from 'react';

/**
 * Component for configuring bootloader options.
 *
 * @param {object} props - Component props.
 * @param {object} props.bootloaderConfig - The current bootloader configuration object (e.g., config.bootloader).
 * @param {function} props.onChange - Callback function to update the parent state.
 *                                    Should accept (fieldName, value).
 */
const BootloaderConfig = ({ bootloaderConfig, onChange }) => {

  // Handler for simple input changes (text, select)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value); // Pass field name and new value up
  };

  // Handler for textareas representing arrays of strings (one item per line)
  const handleTextareaArrayChange = (e) => {
    const { name, value } = e.target;
    const arrayValue = value.split('\n').map(item => item.trim()).filter(item => item !== '');
    onChange(name, arrayValue);
  };

  // Helper to convert array back to string for textarea display
  const arrayToTextareaString = (arr) => (arr || []).join('\n');

  // Common Bootloader Types
  const bootloaderTypes = ['u-boot', 'grub', 'barebox', 'other', 'none'];

  return (
    <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Bootloader Configuration</h3>

      {/* Bootloader Type */}
      <div>
        <label htmlFor="bootloaderType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bootloader Type *</label>
        <select
          id="bootloaderType"
          name="type" // Corresponds to the key in bootloaderConfig
          value={bootloaderConfig.type || ''} // Controlled component
          onChange={handleInputChange}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select Type...</option>
          {bootloaderTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Conditional rendering for source options if a bootloader type is selected (and not 'none' or 'other' maybe) */}
      {bootloaderConfig.type && bootloaderConfig.type !== 'none' && bootloaderConfig.type !== 'other' && (
        <>
          {/* Bootloader Source Type */}
          <div>
            <label htmlFor="bootloaderSource" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source *</label>
            <select
              id="bootloaderSource"
              name="source"
              value={bootloaderConfig.source || ''}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>Select Source Type...</option>
              <option value="git">Git Repository</option>
              <option value="tarball">Tarball URL</option>
              <option value="local">Local Path</option>
              {/* Add 'build-system' if integrated with Yocto/Buildroot */}
            </select>
          </div>

          {/* Conditional Fields based on Source */}
          {bootloaderConfig.source === 'git' && (
            <>
              <div>
                <label htmlFor="bootloaderGitUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Git Repository URL *</label>
                <input
                  type="url"
                  id="bootloaderGitUrl"
                  name="gitUrl"
                  value={bootloaderConfig.gitUrl || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., https://source.denx.de/u-boot/u-boot.git"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="bootloaderGitRef" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Git Reference (Branch/Tag/Commit) *</label>
                <input
                  type="text"
                  id="bootloaderGitRef"
                  name="gitRef"
                  value={bootloaderConfig.gitRef || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., v2023.01, master"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}

          {bootloaderConfig.source === 'tarball' && (
            <div>
              <label htmlFor="bootloaderTarballUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarball URL *</label>
              <input
                type="url"
                id="bootloaderTarballUrl"
                name="tarballUrl"
                value={bootloaderConfig.tarballUrl || ''}
                onChange={handleInputChange}
                required
                placeholder="e.g., https://ftp.denx.de/pub/u-boot/u-boot-2023.01.tar.bz2"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}

          {bootloaderConfig.source === 'local' && (
            <div>
              <label htmlFor="bootloaderLocalPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local Path *</label>
              <input
                type="text"
                id="bootloaderLocalPath"
                name="path"
                value={bootloaderConfig.path || ''}
                onChange={handleInputChange}
                required
                placeholder="e.g., /path/to/your/u-boot/source"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}

          {/* Defconfig */}
          <div>
            <label htmlFor="bootloaderDefconfig" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Defconfig *</label>
            <input
              type="text"
              id="bootloaderDefconfig"
              name="defconfig"
              value={bootloaderConfig.defconfig || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g., rpi_4_defconfig, qemu-arm_defconfig"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">The default configuration file for the bootloader build.</p>
          </div>

          {/* Patches */}
          <div>
            <label htmlFor="bootloaderPatches" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patches (Optional, one per line)</label>
            <textarea
              id="bootloaderPatches"
              name="patches"
              rows={3}
              value={arrayToTextareaString(bootloaderConfig.patches)}
              onChange={handleTextareaArrayChange}
              placeholder="Enter paths or URLs to patch files, one per line..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Custom Config Fragments */}
          <div>
            <label htmlFor="bootloaderCustomConfig" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Config Fragments (Optional, one per line)</label>
            <textarea
              id="bootloaderCustomConfig"
              name="customConfig"
              rows={4}
              value={arrayToTextareaString(bootloaderConfig.customConfig)}
              onChange={handleTextareaArrayChange}
              placeholder="Enter config options (e.g., CONFIG_XYZ=y), one per line..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Additional config settings to merge after defconfig.</p>
          </div>

          {/* Build Arguments */}
          <div>
            <label htmlFor="bootloaderBuildArgs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extra Build Arguments (Optional, one per line)</label>
            <textarea
              id="bootloaderBuildArgs"
              name="buildArgs"
              rows={2}
              value={arrayToTextareaString(bootloaderConfig.buildArgs)}
              onChange={handleTextareaArrayChange}
              placeholder="e.g., DEVICE_TREE=myboard"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </>
      )}

      {/* Message for 'none' or 'other' */}
      {(bootloaderConfig.type === 'none' || bootloaderConfig.type === 'other') && (
         <div className="p-3 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {bootloaderConfig.type === 'none' ? 'No bootloader will be built or configured by this process.' : 'Configuration for \'other\' bootloader types must be handled externally.'}
            </p>
         </div>
       )}

    </div>
  );
};

export default BootloaderConfig;
