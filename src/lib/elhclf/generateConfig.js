/**
 * Takes the configuration object, adds metadata, stringifies it,
 * and triggers a browser download of the JSON file.
 *
 * @param {object} config - The configuration state object.
 * @param {string} [format='json'] - The desired output format ('json' or 'yaml'). Currently only 'json' is implemented.
 * @param {string} [filenameBase='elhclf_config'] - The base filename for the downloaded file.
 * @param {string} [toolVersion='dev'] - Optional version of the tool generating the config.
 */
export const generateConfig = (config, format = 'json', filenameBase = 'elhclf_config', toolVersion = 'dev') => {
  if (!config) {
    console.error("generateConfig called with invalid config object");
    return;
  }

  console.log("Generating config file from state:", config);

  // Create a deep copy and add/update metadata
  const finalConfig = {
    ...JSON.parse(JSON.stringify(config)), // Deep copy
    metadata: {
      ...(config.metadata || {}),
      schemaVersion: config.metadata?.schemaVersion || "1.0.0",
      createdAt: new Date().toISOString(),
      toolVersion: toolVersion,
    }
  };

  // --- File Generation Logic ---
  let outputString = '';
  let fileExtension = '';
  let mimeType = '';

  // Currently only supports JSON
  outputString = JSON.stringify(finalConfig, null, 2); // Pretty-print JSON
  fileExtension = 'json';
  mimeType = 'application/json;charset=utf-8';

  // Create a Blob from the string
  const blob = new Blob([outputString], { type: mimeType });

  // Create a link element
  const link = document.createElement('a');

  // Set the download attribute with a filename
  const filename = `${filenameBase}.${fileExtension}`;
  link.download = filename;

  // Create a URL for the Blob and set it as the href
  link.href = URL.createObjectURL(blob);

  // Append the link to the body (required for Firefox)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);

  // Revoke the object URL to free up memory
  URL.revokeObjectURL(link.href);

  console.log(`Configuration file (${filename}) generated and download initiated.`);
};