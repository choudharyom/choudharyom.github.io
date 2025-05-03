// src/components/elhclf/SummaryView.js
import React from 'react';

/**
 * Renders a single key-value pair, handling empty values.
 */
const SummaryItem = ({ label, value }) => {
  if (value === null || value === undefined || value === '') {
    return null; // Don't render if value is empty/null/undefined
  }
  // Simple check if value is an array for basic formatting
  const displayValue = Array.isArray(value)
    ? value.join(', ') || '-' // Join array items, show '-' if empty array after join
    : String(value); // Convert other types to string

  return (
    <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 col-span-1">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-gray-200 col-span-2 break-words">{displayValue}</dd>
    </div>
  );
};

/**
 * Renders a section title.
 */
const SectionTitle = ({ title }) => (
  <h4 className="text-md font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-1">
    {title}
  </h4>
);

/**
 * Component to display a summary of the configuration.
 *
 * @param {object} props - Component props.
 * @param {object} props.config - The complete configuration object.
 */
const SummaryView = ({ config }) => {
  if (!config) {
    return <p>Loading configuration...</p>;
  }

  return (
    <div className="p-4 border rounded-md mt-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Configuration Summary</h3>
      <dl className="space-y-1">

        {/* Metadata */}
        {config.metadata && (
          <>
            <SectionTitle title="Metadata" />
            <SummaryItem label="Schema Version" value={config.metadata.schemaVersion} />
            <SummaryItem label="Project Name" value={config.metadata.projectName} />
            <SummaryItem label="Description" value={config.metadata.description} />
            {/* Add other metadata fields if needed */}
          </>
        )}

        {/* Target */}
        {config.target && (
          <>
            <SectionTitle title="Target" />
            <SummaryItem label="Architecture" value={config.target.architecture} />
            <SummaryItem label="CPU Model" value={config.target.cpuModel} />
            <SummaryItem label="Board" value={config.target.board} />
            <SummaryItem label="SoC" value={config.target.soc} />
            <SummaryItem label="Features" value={config.target.features} />
          </>
        )}

        {/* Toolchain */}
        {config.toolchain && (
          <>
            <SectionTitle title="Toolchain" />
            <SummaryItem label="Type" value={config.toolchain.type} />
            <SummaryItem label="URL" value={config.toolchain.url} />
            <SummaryItem label="Path" value={config.toolchain.path} />
            <SummaryItem label="Prefix" value={config.toolchain.prefix} />
            <SummaryItem label="Version" value={config.toolchain.version} />
          </>
        )}

        {/* Kernel */}
        {config.kernel && (
          <>
            <SectionTitle title="Kernel" />
            <SummaryItem label="Source" value={config.kernel.source} />
            <SummaryItem label="Git URL" value={config.kernel.gitUrl} />
            <SummaryItem label="Git Ref" value={config.kernel.gitRef} />
            <SummaryItem label="Tarball URL" value={config.kernel.tarballUrl} />
            <SummaryItem label="Local Path" value={config.kernel.path} />
            <SummaryItem label="Version" value={config.kernel.version} />
            <SummaryItem label="Defconfig" value={config.kernel.defconfig} />
            <SummaryItem label="Patches" value={config.kernel.patches} />
            <SummaryItem label="Custom Config" value={config.kernel.customConfig} />
            <SummaryItem label="Modules" value={config.kernel.modules} />
            <SummaryItem label="Build Args" value={config.kernel.buildArgs} />
          </>
        )}

        {/* Bootloader */}
        {config.bootloader && (
          <>
            <SectionTitle title="Bootloader" />
            <SummaryItem label="Type" value={config.bootloader.type} />
             {/* Only show source details if type requires it */}
            {config.bootloader.type && config.bootloader.type !== 'none' && config.bootloader.type !== 'other' && (
                <>
                    <SummaryItem label="Source" value={config.bootloader.source} />
                    <SummaryItem label="Git URL" value={config.bootloader.gitUrl} />
                    <SummaryItem label="Git Ref" value={config.bootloader.gitRef} />
                    <SummaryItem label="Tarball URL" value={config.bootloader.tarballUrl} />
                    <SummaryItem label="Local Path" value={config.bootloader.path} />
                    <SummaryItem label="Defconfig" value={config.bootloader.defconfig} />
                    <SummaryItem label="Patches" value={config.bootloader.patches} />
                    <SummaryItem label="Custom Config" value={config.bootloader.customConfig} />
                    <SummaryItem label="Build Args" value={config.bootloader.buildArgs} />
                </>
            )}
          </>
        )}

        {/* Filesystem */}
        {config.filesystem && (
          <>
            <SectionTitle title="Filesystem" />
            <SummaryItem label="Type" value={config.filesystem.type} />
            <SummaryItem label="Size" value={config.filesystem.size} />
            <SummaryItem label="Compression" value={config.filesystem.compression} />
            <SummaryItem label="Root Password" value={config.filesystem.rootPassword ? '******' : 'Not Set'} /> {/* Obfuscate password */}
            <SummaryItem label="Overlay Files" value={config.filesystem.overlayFiles} />
            <SummaryItem label="Custom Scripts" value={config.filesystem.customScripts} />
          </>
        )}

        {/* Packages */}
        {config.packages && (
          <>
            <SectionTitle title="Packages" />
            <SummaryItem label="Selected" value={config.packages} />
          </>
        )}

        {/* Network */}
        {config.network && (
          <>
            <SectionTitle title="Network" />
            <SummaryItem label="Hostname" value={config.network.hostname} />
            {config.network.interfaces && config.network.interfaces.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interfaces:</h5>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {config.network.interfaces.map((iface, index) => (
                    <li key={index} className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">{iface.name || `Interface ${index + 1}`}</span> ({iface.type || 'N/A'})
                      {iface.type === 'static' && ` - IP: ${iface.ipAddress || '?'}/${iface.netmask || '?'}`}
                      {iface.macAddress && ` - MAC: ${iface.macAddress}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

      </dl>
    </div>
  );
};

export default SummaryView;
