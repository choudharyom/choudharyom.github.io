// src/components/elhclf/TargetSelector.js
import React from 'react';

/**
 * Component for selecting target-specific configuration options.
 *
 * @param {object} props - Component props.
 * @param {object} props.targetConfig - The current target configuration object (e.g., config.target).
 * @param {function} props.onChange - Callback function to update the parent state.
 *                                    Should accept (fieldName, value).
 */
const TargetSelector = ({ targetConfig, onChange }) => {

  // Handler for simple input changes (text, select)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value); // Pass field name and new value up
  };

  // Handler for feature checkboxes (updates the features array)
  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    const currentFeatures = targetConfig.features || []; // Ensure array exists
    let updatedFeatures;

    if (checked) {
      // Add feature if not already present
      updatedFeatures = [...new Set([...currentFeatures, value])];
    } else {
      // Remove feature
      updatedFeatures = currentFeatures.filter(feature => feature !== value);
    }
    onChange('features', updatedFeatures); // Pass 'features' field name and the new array
  };

  // Define potential features - could be moved to schema or config later
  const availableFeatures = ['fpu', 'neon', 'crypto', 'gpu', 'dsp'];

  return (
    <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Target Specification</h3>

      {/* Target Architecture */}
      <div>
        <label htmlFor="targetArchitecture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Architecture *</label>
        <select
          id="targetArchitecture"
          name="architecture" // Corresponds to the key in targetConfig
          value={targetConfig.architecture || ''} // Controlled component
          onChange={handleInputChange}
          required // Example: Make architecture mandatory
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select Architecture...</option>
          <option value="armv7">ARMv7</option>
          <option value="aarch64">AArch64 (ARM64)</option>
          <option value="x86_64">x86_64</option>
          <option value="riscv64">RISC-V 64</option>
          <option value="mips">MIPS</option>
          {/* Add more architectures as needed */}
        </select>
      </div>

      {/* CPU Model */}
      <div>
        <label htmlFor="cpuModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPU Model (Optional)</label>
        <input
          type="text"
          id="cpuModel"
          name="cpuModel" // Corresponds to the key in targetConfig
          value={targetConfig.cpuModel || ''} // Controlled component
          onChange={handleInputChange}
          placeholder="e.g., Cortex-A72, Intel Atom x5"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Board Name */}
      <div>
        <label htmlFor="board" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Board Name (Optional)</label>
        <input
          type="text"
          id="board"
          name="board" // Corresponds to the key in targetConfig
          value={targetConfig.board || ''} // Controlled component
          onChange={handleInputChange}
          placeholder="e.g., Raspberry Pi 4B, BeagleBone Black"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

       {/* SoC Name */}
      <div>
        <label htmlFor="soc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SoC Name (Optional)</label>
        <input
          type="text"
          id="soc"
          name="soc" // Corresponds to the key in targetConfig
          value={targetConfig.soc || ''} // Controlled component
          onChange={handleInputChange}
          placeholder="e.g., BCM2711, AM335x"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Target Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Features (Optional)</label>
        <div className="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
          {availableFeatures.map(feature => (
            <div key={feature} className="flex items-center">
              <input
                id={`feature-${feature}`}
                name="features" // Group checkboxes logically, but value matters most
                type="checkbox"
                value={feature} // The value to add/remove from the array
                checked={(targetConfig.features || []).includes(feature)} // Check if feature is in the array
                onChange={handleFeatureChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-500 rounded"
              />
              <label htmlFor={`feature-${feature}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                {feature.toUpperCase()} {/* Display feature name nicely */}
              </label>
            </div>
          ))}
        </div>
         <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Select hardware features like FPU, NEON, Crypto accelerators, etc.</p>
      </div>

    </div>
  );
};

export default TargetSelector;
