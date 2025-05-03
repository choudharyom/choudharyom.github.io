// src/pages/elhclf-configurator/index.js

import React, { useState } from 'react';
import styles from '@/styles/BlogPost.module.css'; // Keep styles for content elements
// Import the defined schema
import elhclfSchema from '../../lib/elhclf/ElhclfConfiguratorschema.js';

// Import components
import TargetSelector from '../../components/elhclf/TargetSelector';
import ToolchainConfig from '../../components/elhclf/ToolchainConfig';
import KernelOptions from '../../components/elhclf/KernelOptions';
import BootloaderConfig from '../../components/elhclf/BootloaderConfig';
import FilesystemConfig from '../../components/elhclf/FilesystemConfig';
import PackageSelector from '../../components/elhclf/PackageSelector';
import NetworkConfig from '../../components/elhclf/NetworkConfig';
import SummaryView from '../../components/elhclf/SummaryView';

// Import the generation function
import { generateConfig } from '../../lib/elhclf/generateConfig';


// --- Helper Icons ---
const CheckIcon = () => (
  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
// --- End Helper Icons ---

const steps = [
  { id: 1, title: 'Target', component: TargetSelector, configKey: 'target', handlerKey: 'handleTargetChange' },
  { id: 2, title: 'Toolchain', component: ToolchainConfig, configKey: 'toolchain', handlerKey: 'handleToolchainChange' },
  { id: 3, title: 'Kernel', component: KernelOptions, configKey: 'kernel', handlerKey: 'handleKernelChange' },
  { id: 4, title: 'Bootloader', component: BootloaderConfig, configKey: 'bootloader', handlerKey: 'handleBootloaderChange' },
  { id: 5, title: 'Filesystem', component: FilesystemConfig, configKey: 'filesystem', handlerKey: 'handleFilesystemChange' },
  { id: 6, title: 'Packages', component: PackageSelector, configKey: 'packages', handlerKey: 'handlePackageChange' },
  { id: 7, title: 'Network', component: NetworkConfig, configKey: 'network', handlerKey: 'handleNetworkChange' },
  { id: 8, title: 'Summary', component: SummaryView, configKey: 'config', handlerKey: null },
];

/**
 * Main page component for the Embedded Linux High-Level Configuration Framework (ELHLCF).
 * Implements a multi-step wizard UI with modern styling.
 */
const ElhclfConfiguratorPage = () => {
  const [config, setConfig] = useState(() => JSON.parse(JSON.stringify(elhclfSchema)));
  const [currentStep, setCurrentStep] = useState(0);

  const handlers = {
    handleTargetChange: (field, value) => {
      setConfig(prevConfig => ({ ...prevConfig, target: { ...prevConfig.target, [field]: value } }));
    },
    handleToolchainChange: (field, value) => {
      setConfig(prevConfig => ({ ...prevConfig, toolchain: { ...prevConfig.toolchain, [field]: value } }));
    },
    handleKernelChange: (field, value) => {
      setConfig(prevConfig => ({ ...prevConfig, kernel: { ...prevConfig.kernel, [field]: value } }));
    },
    handleBootloaderChange: (field, value) => {
      setConfig(prevConfig => ({ ...prevConfig, bootloader: { ...prevConfig.bootloader, [field]: value } }));
    },
    handleFilesystemChange: (field, value) => {
      setConfig(prevConfig => ({ ...prevConfig, filesystem: { ...prevConfig.filesystem, [field]: value } }));
    },
    handlePackageChange: (updatedPackagesList) => {
      setConfig(prevConfig => ({ ...prevConfig, packages: updatedPackagesList }));
    },
    handleNetworkChange: (field, value) => {
      setConfig(prevConfig => ({ ...prevConfig, network: { ...prevConfig.network, [field]: value } }));
    },
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const errors = [];
    const currentConfig = config;

    switch (step.id) {
      case 1: if (!currentConfig.target?.architecture) errors.push("Target Architecture"); break;
      case 2: if (!currentConfig.toolchain?.type) errors.push("Toolchain Type");
              if (currentConfig.toolchain?.type === 'external' && !currentConfig.toolchain?.path) errors.push("External Toolchain Path");
              if (currentConfig.toolchain?.type === 'local' && !currentConfig.toolchain?.path) errors.push("Local Toolchain Path"); break;
      case 3: if (!currentConfig.kernel?.source) errors.push("Kernel Source");
              if (currentConfig.kernel?.source === 'git' && (!currentConfig.kernel.gitUrl || !currentConfig.kernel.gitRef)) errors.push("Kernel Git URL/Ref");
              if (currentConfig.kernel?.source === 'tarball' && !currentConfig.kernel.tarballUrl) errors.push("Kernel Tarball URL");
              if (currentConfig.kernel?.source === 'local' && !currentConfig.kernel.path) errors.push("Kernel Local Path");
              if (!currentConfig.kernel?.defconfig) errors.push("Kernel Defconfig"); break;
      case 4: if (!currentConfig.bootloader?.type) errors.push("Bootloader Type");
              if (currentConfig.bootloader?.type && currentConfig.bootloader.type !== 'none' && currentConfig.bootloader.type !== 'other') {
                if (!currentConfig.bootloader.source) errors.push("Bootloader Source");
                if (currentConfig.bootloader.source === 'git' && (!currentConfig.bootloader.gitUrl || !currentConfig.bootloader.gitRef)) errors.push("Bootloader Git URL/Ref");
                if (currentConfig.bootloader.source === 'tarball' && !currentConfig.bootloader.tarballUrl) errors.push("Bootloader Tarball URL");
                if (currentConfig.bootloader.source === 'local' && !currentConfig.bootloader.path) errors.push("Bootloader Local Path");
                if (!currentConfig.bootloader.defconfig) errors.push("Bootloader Defconfig");
              } break;
      case 5: if (!currentConfig.filesystem?.type) errors.push("Filesystem Type"); break;
      case 6: break;
      case 7: if (!currentConfig.network?.hostname) errors.push("Network Hostname");
              (currentConfig.network?.interfaces || []).forEach((iface, index) => {
                if (!iface.name) errors.push(`Interface ${index+1} Name`);
                if (!iface.type) errors.push(`Interface ${index+1} Type`);
                if (iface.type === 'static') {
                  if (!iface.ipAddress) errors.push(`Interface ${index+1} IP Address`);
                  if (!iface.netmask) errors.push(`Interface ${index+1} Netmask`);
                }
              }); break;
      default: break;
    }

    if (errors.length > 0) {
      alert(`Please fix the following issues before proceeding:\n- ${errors.join('\n- ')}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleGenerateClick = () => {
    console.log("Attempting to generate config. Current State:", config);
    let allValid = true;
    for (let i = 0; i < steps.length - 1; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        window.scrollTo(0, 0);
        break;
      }
    }

    if (allValid) {
      generateConfig(config);
    } else {
      console.error("Final validation failed.");
    }
  };

  const ActiveStepComponent = steps[currentStep].component;
  const activeStepConfigKey = steps[currentStep].configKey;
  const activeStepHandlerKey = steps[currentStep].handlerKey;

  const componentProps = {};
  if (activeStepConfigKey === 'config') {
    componentProps.config = config;
  } else if (activeStepConfigKey === 'packages') {
    componentProps.packagesList = config[activeStepConfigKey];
  } else {
    componentProps[`${activeStepConfigKey}Config`] = config[activeStepConfigKey];
  }
  if (activeStepHandlerKey) {
    componentProps.onChange = handlers[activeStepHandlerKey];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
          Embedded Linux Configurator
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
          Create your custom embedded Linux configuration with an ultra-modern interface.
        </p>

        {/* Step Indicator */}
        <div className="mb-12 overflow-x-auto pb-4">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-6">
              {steps.map((step, index) => (
                <li key={step.id} className={`relative flex-1 ${index < steps.length - 1 ? 'pr-8' : ''}`}>
                  {index <= currentStep ? (
                    <div className="flex items-center space-x-3">
                      <span className={`flex items-center justify-center w-12 h-12 rounded-full ${index === currentStep ? 'bg-indigo-600 ring-4 ring-indigo-200' : 'bg-indigo-500'} transition-all duration-300`}>
                        {index < currentStep ? <CheckIcon /> : <span className="text-white font-bold">{step.id}</span>}
                      </span>
                      <span className={`text-sm font-medium ${index === currentStep ? 'text-indigo-700' : 'text-gray-500'} hidden md:inline`}>
                        {step.title}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-500 font-medium">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium text-gray-500 hidden md:inline">
                        {step.title}
                      </span>
                    </div>
                  )}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-12 right-0 h-1 bg-gray-200" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Active Step Content */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-8 mb-8 border border-gray-100 transition-all duration-300">
          <ActiveStepComponent {...componentProps} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon />
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
            >
              Next
              <ChevronRightIcon />
            </button>
          ) : (
            <button
              onClick={handleGenerateClick}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300"
            >
              <DownloadIcon />
              Generate & Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElhclfConfiguratorPage;