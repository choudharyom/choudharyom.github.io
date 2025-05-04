import React from 'react';
import styles from '@/styles/SuperAgent.module.css';

// Use the exported availableTools list directly
const ToolSelector = ({ enabledTools, onToggleTool }) => { // Accept props
  // Remove the local state declaration for enabledTools.
  // This component now relies solely on the props passed from SuperAgent.

  return (
    <div className={styles.toolSelector}>
      <h4>Enable/Disable Tools</h4>
      <div className={styles.toolGrid}>
        {/* Map over the availableTools list */}
        {availableTools.map((tool) => (
          <div key={tool.id} className={styles.toolItem}>
            <label className={styles.toolSwitch}>
              <input
                type="checkbox"
                checked={enabledTools[tool.id]}
                onChange={() => toggleTool(tool.id)}
                // Use the onToggleTool prop function passed from SuperAgent
                onChange={() => onToggleTool(tool.id)}
              />
              <span className={styles.slider}></span>
            </label>
            <div className={styles.toolInfo}>
              <div className={styles.toolName}>{tool.name}</div>
              <div className={styles.toolDescription}>{tool.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the list of tools so SuperAgent can initialize its state
export const availableTools = [
  { id: 'web_search', name: 'Web Search', description: 'Search the web for information' },
  { id: 'calculator', name: 'Calculator', description: 'Perform mathematical calculations' },
  { id: 'weather', name: 'Weather', description: 'Get current weather and forecasts' },
  { id: 'maps', name: 'Maps', description: 'Find locations and get directions' },
  { id: 'finance', name: 'Finance', description: 'Get stock prices and financial data' }, // Added Finance back here for consistency
  { id: 'news', name: 'News', description: 'Get the latest news on topics' },
  { id: 'travel', name: 'Travel', description: 'Plan trips and find destinations' },
  { id: 'shopping', name: 'Shopping', description: 'Find products and compare prices' },
];
export default ToolSelector;