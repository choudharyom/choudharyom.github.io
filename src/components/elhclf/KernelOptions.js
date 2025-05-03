// src/components/elhclf/KernelOptions.js
import React from 'react';

/**
 * Component for configuring Linux kernel options.
 *
 * @param {object} props - Component props.
 * @param {object} props.kernelConfig - The current kernel configuration object (e.g., config.kernel).
 * @param {function} props.onChange - Callback function to update the parent state.
 *                                    Should accept (fieldName, value).
 */
const KernelOptions = ({ kernelConfig, onChange }) => {

  // Handler for simple input changes (text, select)
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

  return (
    <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Kernel Configuration</h3>

      {/* Kernel Source Type */}
      <div>
        <label htmlFor="kernelSource" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kernel Source *</label>
        <select
          id="kernelSource"
          name="source" // Corresponds to the key in kernelConfig
          value={kernelConfig.source || ''} // Controlled component
          onChange={handleInputChange}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select Source Type...</option>
          <option value="git">Git Repository</option>
          <option value="tarball">Tarball URL</option>
          <option value="local">Local Path</option>
          {/* Add other source types like 'yocto', 'buildroot' if needed later */}
        </select>
      </div>

      {/* Conditional Fields based on Source */}
      {kernelConfig.source === 'git' && (
        <>
          <div>
            <label htmlFor="kernelGitUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Git Repository URL *</label>
            <input
              type="url"
              id="kernelGitUrl"
              name="gitUrl"
              value={kernelConfig.gitUrl || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g., https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="kernelGitRef" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Git Reference (Branch/Tag/Commit) *</label>
            <input
              type="text"
              id="kernelGitRef"
              name="gitRef"
              value={kernelConfig.gitRef || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g., v6.1.1, master, <commit-hash>"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </>
      )}

      {kernelConfig.source === 'tarball' && (
        <div>
          <label htmlFor="kernelTarballUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarball URL *</label>
          <input
            type="url"
            id="kernelTarballUrl"
            name="tarballUrl"
            value={kernelConfig.tarballUrl || ''}
            onChange={handleInputChange}
            required
            placeholder="e.g., https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.1.1.tar.xz"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {kernelConfig.source === 'local' && (
        <div>
          <label htmlFor="kernelLocalPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local Path *</label>
          <input
            type="text"
            id="kernelLocalPath"
            name="path"
            value={kernelConfig.path || ''}
            onChange={handleInputChange}
            required
            placeholder="e.g., /path/to/your/linux/source"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {/* Kernel Version (Optional, might be inferred from source) */}
      <div>
        <label htmlFor="kernelVersion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kernel Version (Optional)</label>
        <input
          type="text"
          id="kernelVersion"
          name="version"
          value={kernelConfig.version || ''}
          onChange={handleInputChange}
          placeholder="e.g., 6.1.1 (Often inferred from source ref/URL)"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Specify if not clear from the source (e.g., for local paths or ambiguous refs).</p>
      </div>

      {/* Defconfig */}
      <div>
        <label htmlFor="kernelDefconfig" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Defconfig *</label>
        <input
          type="text"
          id="kernelDefconfig"
          name="defconfig"
          value={kernelConfig.defconfig || ''}
          onChange={handleInputChange}
          required
          placeholder="e.g., multi_v7_defconfig, arch/arm64/configs/defconfig"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">The default configuration file to use for the build.</p>
      </div>

      {/* Patches */}
      <div>
        <label htmlFor="kernelPatches" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patches (Optional, one per line)</label>
        <textarea
          id="kernelPatches"
          name="patches"
          rows={3}
          value={arrayToTextareaString(kernelConfig.patches)}
          onChange={handleTextareaArrayChange}
          placeholder="Enter paths or URLs to patch files, one per line..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">List of patches to apply after checkout/extraction.</p>
      </div>

      {/* Custom Config Fragments */}
      <div>
        <label htmlFor="kernelCustomConfig" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Config Fragments (Optional, one per line)</label>
        <textarea
          id="kernelCustomConfig"
          name="customConfig"
          rows={4}
          value={arrayToTextareaString(kernelConfig.customConfig)}
          onChange={handleTextareaArrayChange}
          placeholder="Enter Kconfig options (e.g., CONFIG_XYZ=y, CONFIG_ABC=m), one per line..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Additional Kconfig settings to merge after defconfig.</p>
      </div>

       {/* Modules */}
      <div>
        <label htmlFor="kernelModules" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modules to Build (Optional, one per line)</label>
        <textarea
          id="kernelModules"
          name="modules"
          rows={3}
          value={arrayToTextareaString(kernelConfig.modules)}
          onChange={handleTextareaArrayChange}
          placeholder="Specify specific modules if not building all (e.g., drivers/net/ethernet/...). Leave empty to build modules based on config."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

       {/* Build Arguments */}
      <div>
        <label htmlFor="kernelBuildArgs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extra Build Arguments (Optional, one per line)</label>
        <textarea
          id="kernelBuildArgs"
          name="buildArgs"
          rows={2}
          value={arrayToTextareaString(kernelConfig.buildArgs)}
          onChange={handleTextareaArrayChange}
          placeholder="e.g., KCFLAGS=-O3, LLVM=1"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Additional arguments passed to the kernel build system (e.g., make).</p>
      </div>

    </div>
  );
};

export default KernelOptions;
