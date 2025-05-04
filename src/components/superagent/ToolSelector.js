import React, { useState } from 'react';
import styles from '@/styles/SuperAgent.module.css';

const tools = [
  { id: 'web_search', name: 'Web Search', description: 'Search the web for information' },
  { id: 'calculator', name: 'Calculator', description: 'Perform mathematical calculations' },
  { id: 'weather', name: 'Weather', description: 'Get current weather and forecasts' },
  { id: 'maps', name: 'Maps', description: 'Find locations and get directions' },
  { id: 'news', name: 'News', description: 'Get the latest news on topics' },
  { id: 'finance', name: 'Finance', description: 'Get stock prices and financial data' },
  { id: 'travel', name: 'Travel', description: 'Plan trips and find destinations' },
  { id: 'shopping', name: 'Shopping', description: 'Find products and compare prices' },
];

const ToolSelector = () => {
  const [enabledTools, setEnabledTools] = useState(
    tools.reduce((acc, tool) => ({ ...acc, [tool.id]: true }), {})
  );

  const toggleTool = (id) => {
    setEnabledTools((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={styles.toolSelector}>
      <h4>Enable/Disable Tools</h4>
      <div className={styles.toolGrid}>
        {tools.map((tool) => (
          <div key={tool.id} className={styles.toolItem}>
            <label className={styles.toolSwitch}>
              <input
                type="checkbox"
                checked={enabledTools[tool.id]}
                onChange={() => toggleTool(tool.id)}
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

export default ToolSelector;