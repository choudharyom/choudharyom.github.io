// src/pages/elhclf-configurator/index.js

import React, { useState } from 'react';
// Assuming you have a Layout component in your project for consistent site structure.
// Adjust the import path based on your project structure.
// If you don't have a Layout component, you can remove this import and the <Layout> wrapper.
import Layout from '../../components/layout/Layout'; // Adjust path as needed

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
  // Initialize state to hold the user's configuration choices.
  // The structure should mirror the schema defined in Phase 2, Step 4 of the plan.
  const [config, setConfig] = useState({
    targetArchitecture: '',
    toolchain: { type: '', version: '' },
    kernel: { version: '', customConfigPath: '' },
    bootloader: { type: '', version: '' },
    filesystem: { type: '', size: '' },
    packages: [],
    network: { hostname: '', dhcp: true },
    userspace: { init: 'systemd' },
    // Add other fields based on your defined schema
  });

  // --- Event Handlers ---
  // Example handler (you'll need more specific handlers for each input/component)
  const handleInputChange = (section, field, value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [section]: {
        ...prevConfig[section],
        [field]: value,
      },
    }));
  };

  // Handler for generating and downloading the configuration file
  const handleGenerateConfig = () => {
    console.log("Current Config State:", config);
    // 1. Call the generation function (to be created in lib/elhclf/generateConfig.js)
    // const configString = generateConfig(config); // Assuming JSON output for now
    const configString = JSON.stringify(config, null, 2); // Basic JSON generation

    // 2. Create a Blob
    const blob = new Blob([configString], { type: 'application/json' });

    // 3. Create a temporary download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elhclf_config.json'; // Set the desired filename

    // 4. Trigger the download
    document.body.appendChild(a);
    a.click();

    // 5. Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Configuration file download initiated.");
  };


  // --- Render Logic ---
  return (
    // Wrap the page content in your site's Layout component if you have one

      <div className="container mx-auto px-4 py-8"> {/* Basic Tailwind container */}
        <h1 className="text-3xl font-bold mb-6">Embedded Linux Configuration</h1>
        <p className="mb-8 text-gray-600">
          Use this tool to specify the requirements for your embedded Linux system.
          A generalized configuration file will be generated.
        </p>

        {/* --- Configuration Form/Wizard --- */}
        {/*
          This is where you will build the main UI.
          You can use a multi-step wizard or a single form with sections.
          Import and use the components you'll create (TargetSelector, KernelOptions, etc.)
          Pass down the 'config' state and 'handleInputChange' (or more specific handlers) as props.
        */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold border-b pb-2">Configuration Options</h2>

          {/* Example Section: Target Architecture (Replace with actual components later) */}
          <div className="p-4 border rounded-md">
             <label htmlFor="targetArch" className="block text-sm font-medium text-gray-700 mb-1">Target Architecture</label>
             <select
               id="targetArch"
               name="targetArchitecture"
               value={config.targetArchitecture}
               onChange={(e) => setConfig({...config, targetArchitecture: e.target.value})} // Simplified handler for demo
               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
             >
               <option value="">Select Architecture...</option>
               <option value="armv7">ARMv7</option>
               <option value="aarch64">AArch64 (ARM64)</option>
               <option value="x86_64">x86_64</option>
               <option value="riscv64">RISC-V 64</option>
               {/* Add more architectures as needed */}
             </select>
          </div>

          {/* --- Add other configuration sections/components here --- */}
          {/* <TargetSelector config={config} onChange={handleInputChange} /> */}
          {/* <KernelOptions config={config.kernel} onChange={handleInputChange} /> */}
          {/* ... etc ... */}

          {/* Placeholder for where other sections will go */}
          <div className="p-4 border rounded-md bg-gray-50 text-gray-500 italic">
            (Kernel, Bootloader, Filesystem, Packages, Network sections will go here...)
          </div>

          {/* --- Summary View (Optional) --- */}
          {/* <SummaryView config={config} /> */}
          <div className="p-4 border rounded-md mt-4 bg-gray-100">
            <h3 className="font-semibold mb-2">Current Configuration (Preview)</h3>
            <pre className="text-xs overflow-auto max-h-60 bg-gray-800 text-white p-3 rounded">
                {JSON.stringify(config, null, 2)}
            </pre>
          </div>


          {/* --- Action Button --- */}
          <div className="mt-8 text-right">
            <button
              onClick={handleGenerateConfig}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate & Download Config
            </button>
          </div>
        </div>
      </div>
  );
};

export default ElhclfConfiguratorPage;
