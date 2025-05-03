// src/lib/elhclf/generateConfig.js

/**
 * Takes the configuration object, adds metadata, stringifies it,
 * and triggers a browser download of the JSON file.
 *
 * @param {object} config - The configuration state object.
 * @param {string} [toolVersion='dev'] - Optional version of the tool generating the config.
 */
export const generateConfig = (config, toolVersion = 'dev') => {
  if (!config) {
    console.error("generateConfig called with invalid config object");
    return;
  }

  console.log("Generating config file from state:", config);

  // Create a deep copy to avoid modifying the original state if needed later,
  // and add/update metadata.
  const finalConfig = {
    ...JSON.parse(JSON.stringify(config)), // Deep copy
    metadata: {
      ...(config.metadata || {}), // Preserve existing metadata
      schemaVersion: config.metadata?.schemaVersion || "1.0.0", // Ensure schemaVersion exists
      createdAt: new Date().toISOString(),
      toolVersion: toolVersion,
    }
  };

  // Ensure required top-level keys exist even if empty, based on schema
  // (This might be better handled by initializing state from schema defaults)
  const requiredKeys = ['target', 'toolchain', 'kernel', 'bootloader', 'filesystem', 'packages', 'network'];
  requiredKeys.forEach(key => {
      if (!(key in finalConfig)) {
          finalConfig[key] = {}; // Or appropriate default like [] for packages
      }
  });
   if (!('packages' in finalConfig)) finalConfig.packages = [];


  // Convert the final configuration object to a pretty-printed JSON string
  const configString = JSON.stringify(finalConfig, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([configString], { type: 'application/json;charset=utf-8' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;

  // Suggest a filename based on project name or target architecture
  const projectName = finalConfig.metadata?.projectName?.replace(/\s+/g, '_');
  const arch = finalConfig.target?.architecture;
  const filename = projectName
    ? `${projectName}_elhclf_config.json`
    : arch
      ? `elhclf_config_${arch}.json`
      : 'elhclf_config.json';
  a.download = filename;

  // Append the anchor to the body, click it, and then remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke the Blob URL to free up resources
  URL.revokeObjectURL(url);

  console.log(`Configuration file download initiated as ${filename}.`);
};
