// src/pages/elhclf-configurator/index.js

import React, { useState } from 'react';
// Import the Layout component
import Layout from '../../components/layout/Layout'; // Adjust path as needed
// Import the defined schema
import elhclfSchema from '../../lib/elhclf/ElhclfConfiguratorschema.js'; // Import the schema

// Placeholder components - you will create these later based on the plan
// import TargetSelector from '../../components/elhclf/TargetSelector';
// import KernelOptions from '../../components/elhclf/KernelOptions';
// import PackageSelector from '../../components/elhclf/PackageSelector';
// import FilesystemConfig from '../../components/elhclf/FilesystemConfig';
// import SummaryView from '../../components/elhclf/SummaryView';
// import { generateConfig } from '../../lib/elhclf/generateConfig'; // You'll create this function

/**
 * Main page component for the Embedded Linux High-Level Configuration Framework (ELHLCF).
 * This component will host the user interface for specifying embedded Linux configurations.
 */
const ElhclfConfiguratorPage = () => {
  // --- State Management ---
  // Initialize state using the structure imported from the schema file.
  // We create a deep copy to avoid potential direct mutation of the imported schema object,
  // although direct use `useState(elhclfSchema)` is often sufficient if the schema isn't modified elsewhere.
  const [config, setConfig] = useState(JSON.parse(JSON.stringify(elhclfSchema)));

  // --- Event Handlers ---
  // NOTE: This basic handler only works for top-level fields or direct nested fields
  // like config.toolchain.type. It needs to be enhanced for deeper nesting or arrays.
  // You'll likely create more specific handlers within child components.
  const handleInputChange = (section, field, value) => {
    setConfig(prevConfig => {
      // Basic handling for direct properties or first-level nesting
      if (prevConfig.hasOwnProperty(section) && typeof prevConfig[section] === 'object' && prevConfig[section] !== null) {
        return {
          ...prevConfig,
          [section]: {
            ...prevConfig[section],
            [field]: value,
          },
        };
      } else if (prevConfig.hasOwnProperty(field)) {
         // Handle top-level fields (though schema doesn't have many)
         return {
            ...prevConfig,
            [field]: value,
         }
      }
      // Add more complex logic here later for deeper nesting or arrays
      console.warn(`Unhandled input change for section: ${section}, field: ${field}`);
      return prevConfig; // Return previous state if path is not handled
    });
  };

  // Handler for generating and downloading the configuration file
  const handleGenerateConfig = () => {
    console.log("Current Config State:", config);
    // Add timestamps or tool versions before generating
    const finalConfig = {
        ...config,
        metadata: {
            ...config.metadata,
            createdAt: new Date().toISOString(),
            // toolVersion: 'x.y.z' // Add your tool version here if available
        }
    };

    const configString = JSON.stringify(finalConfig, null, 2); // Basic JSON generation

    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Suggest a filename based on project name or target
    const filename = finalConfig.metadata.projectName
        ? `${finalConfig.metadata.projectName.replace(/\s+/g, '_')}_elhclf_config.json`
        : 'elhclf_config.json';
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Configuration file download initiated.");
  };


  // --- Render Logic ---
  return (
      <div className="container mx-auto px-4 py-8"> {/* Basic Tailwind container */}
        <h1 className="text-3xl font-bold mb-6">Embedded Linux Configuration</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Use this tool to specify the requirements for your embedded Linux system.
          A generalized configuration file will be generated.
        </p>

        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">Configuration Options</h2>

          {/* Example Section: Target Architecture (Uses correct path from schema) */}
          <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700">
             <label htmlFor="targetArch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Architecture</label>
             <select
               id="targetArch"
               name="targetArchitecture" // HTML name attribute
               value={config.target.architecture} // Correct state path from schema
               // Specific handler for nested state update
               onChange={(e) => setConfig(prev => ({
                   ...prev,
                   target: { ...prev.target, architecture: e.target.value }
               }))}
               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
             >
               <option value="">Select Architecture...</option>
               <option value="armv7">ARMv7</option>
               <option value="aarch64">AArch64 (ARM64)</option>
               <option value="x86_64">x86_64</option>
               <option value="riscv64">RISC-V 64</option>
               <option value="mips">MIPS</option>
               {/* Add more architectures as needed */}
             </select>
          </div>

          {/* --- Add other configuration sections/components here --- */}
          {/* <TargetSelector config={config.target} onChange={handleTargetChange} /> */}
          {/* <KernelOptions config={config.kernel} onChange={handleKernelChange} /> */}
          {/* ... etc ... */}

          <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 italic border-gray-200 dark:border-gray-600">
            (Target Details, Toolchain, Kernel, Bootloader, Filesystem, Packages, Network sections will go here...)
          </div>

          {/* --- Summary View (Optional) --- */}
          <div className="p-4 border rounded-md mt-4 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Current Configuration (Preview)</h3>
            <pre className="text-xs overflow-auto max-h-96 bg-gray-800 dark:bg-gray-950 text-white p-3 rounded">
                {JSON.stringify(config, null, 2)}
            </pre>
          </div>


          {/* --- Action Button --- */}
          <div className="mt-8 text-right">
            <button
              onClick={handleGenerateConfig}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              // Optional: Disable button if essential fields are missing
              // disabled={!config.target.architecture}
            >
              Generate & Download Config
            </button>
          </div>
        </div>
      </div>
  );
};

export default ElhclfConfiguratorPage;
