// src/components/elhclf/NetworkConfig.js
import React, { useState } from 'react';

/**
 * Component for configuring basic network settings.
 *
 * @param {object} props - Component props.
 * @param {object} props.networkConfig - The current network configuration object (e.g., config.network).
 * @param {function} props.onChange - Callback function to update the parent state.
 *                                    Should accept (fieldName, value) for top-level fields like hostname,
 *                                    or ('interfaces', updatedInterfacesArray) for interface changes.
 */
const NetworkConfig = ({ networkConfig, onChange }) => {
  // State for managing the currently edited/new interface (if implementing add/edit)
  // const [currentInterface, setCurrentInterface] = useState({ name: '', type: 'dhcp', ipAddress: '', netmask: '', gateway: '', dnsServers: [], macAddress: '' });

  // Handler for simple input changes (hostname)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value); // Pass field name and new value up
  };

  // --- Basic Interface Management (Example - can be expanded) ---

  // Function to add a new default interface object
  const handleAddInterface = () => {
    const newInterface = {
      name: `eth${(networkConfig.interfaces || []).length}`, // Basic default name
      type: 'dhcp', // Default to dhcp
      ipAddress: '',
      netmask: '',
      gateway: '',
      dnsServers: [],
      macAddress: ''
    };
    const updatedInterfaces = [...(networkConfig.interfaces || []), newInterface];
    onChange('interfaces', updatedInterfaces);
  };

  // Function to remove an interface by its index
  const handleRemoveInterface = (indexToRemove) => {
    const updatedInterfaces = (networkConfig.interfaces || []).filter((_, index) => index !== indexToRemove);
    onChange('interfaces', updatedInterfaces);
  };

  // Function to handle changes within a specific interface object
  const handleInterfaceChange = (index, field, value) => {
    const updatedInterfaces = (networkConfig.interfaces || []).map((iface, i) => {
      if (i === index) {
        // Handle DNS servers array specifically if needed (e.g., comma-separated string)
        if (field === 'dnsServers') {
            const dnsArray = value.split(',').map(s => s.trim()).filter(s => s);
            return { ...iface, [field]: dnsArray };
        }
        return { ...iface, [field]: value };
      }
      return iface;
    });
    onChange('interfaces', updatedInterfaces);
  };


  return (
    <div className="p-4 border rounded-md border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Network Configuration</h3>

      {/* Hostname */}
      <div>
        <label htmlFor="networkHostname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hostname *</label>
        <input
          type="text"
          id="networkHostname"
          name="hostname" // Corresponds to the key in networkConfig
          value={networkConfig.hostname || 'embedded-linux'} // Default hostname
          onChange={handleInputChange}
          required
          placeholder="e.g., my-device"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Interfaces Section */}
      <div className="space-y-3">
         <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 pt-2 border-t border-gray-200 dark:border-gray-600">Network Interfaces</h4>
         {(networkConfig.interfaces || []).map((iface, index) => (
            <div key={index} className="p-3 border rounded-md border-gray-300 dark:border-gray-600 space-y-2 bg-gray-50 dark:bg-gray-700/50 relative">
                 <button
                    onClick={() => handleRemoveInterface(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Remove Interface"
                    title="Remove Interface"
                 >
                    {/* Simple X icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>

                {/* Interface Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label htmlFor={`iface-name-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                    <input
                        type="text"
                        id={`iface-name-${index}`}
                        value={iface.name || ''}
                        onChange={(e) => handleInterfaceChange(index, 'name', e.target.value)}
                        required
                        placeholder="e.g., eth0, wlan0"
                        className="sm:col-span-2 mt-1 sm:mt-0 block w-full px-3 py-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                 {/* Interface Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label htmlFor={`iface-type-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                    <select
                        id={`iface-type-${index}`}
                        value={iface.type || 'dhcp'}
                        onChange={(e) => handleInterfaceChange(index, 'type', e.target.value)}
                        required
                        className="sm:col-span-2 mt-1 sm:mt-0 block w-full pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="dhcp">DHCP</option>
                        <option value="static">Static</option>
                        <option value="manual">Manual (No config)</option>
                        {/* Add loopback, etc. if needed */}
                    </select>
                </div>

                 {/* Conditional Static IP fields */}
                 {iface.type === 'static' && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <label htmlFor={`iface-ip-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">IP Address *</label>
                            <input
                                type="text"
                                id={`iface-ip-${index}`}
                                value={iface.ipAddress || ''}
                                onChange={(e) => handleInterfaceChange(index, 'ipAddress', e.target.value)}
                                required
                                placeholder="e.g., 192.168.1.100"
                                className="sm:col-span-2 mt-1 sm:mt-0 block w-full px-3 py-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <label htmlFor={`iface-netmask-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Netmask *</label>
                            <input
                                type="text"
                                id={`iface-netmask-${index}`}
                                value={iface.netmask || ''}
                                onChange={(e) => handleInterfaceChange(index, 'netmask', e.target.value)}
                                required
                                placeholder="e.g., 255.255.255.0"
                                className="sm:col-span-2 mt-1 sm:mt-0 block w-full px-3 py-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <label htmlFor={`iface-gateway-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Gateway</label>
                            <input
                                type="text"
                                id={`iface-gateway-${index}`}
                                value={iface.gateway || ''}
                                onChange={(e) => handleInterfaceChange(index, 'gateway', e.target.value)}
                                placeholder="e.g., 192.168.1.1"
                                className="sm:col-span-2 mt-1 sm:mt-0 block w-full px-3 py-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <label htmlFor={`iface-dns-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">DNS Servers</label>
                            <input
                                type="text"
                                id={`iface-dns-${index}`}
                                value={(iface.dnsServers || []).join(', ')}
                                onChange={(e) => handleInterfaceChange(index, 'dnsServers', e.target.value)}
                                placeholder="e.g., 8.8.8.8, 1.1.1.1 (comma-separated)"
                                className="sm:col-span-2 mt-1 sm:mt-0 block w-full px-3 py-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </>
                 )}
                 {/* MAC Address (Optional) */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label htmlFor={`iface-mac-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">MAC Address</label>
                    <input
                        type="text"
                        id={`iface-mac-${index}`}
                        value={iface.macAddress || ''}
                        onChange={(e) => handleInterfaceChange(index, 'macAddress', e.target.value)}
                        placeholder="e.g., 00:11:22:AA:BB:CC (Optional)"
                        className="sm:col-span-2 mt-1 sm:mt-0 block w-full px-3 py-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
         ))}
         <button
            onClick={handleAddInterface}
            type="button"
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
         >
            Add Interface
         </button>
      </div>

    </div>
  );
};

export default NetworkConfig;
