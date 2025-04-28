import React, { useState } from "react";

const SyncApps = () => {
  const [selectedApp, setSelectedApp] = useState("");

  const handleSync = () => {
    if (!selectedApp) {
      alert("Please select a platform to sync with.");
      return;
    }

    // Placeholder logic for syncing
    alert(`Syncing with ${selectedApp}... (integration coming soon!)`);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-center">Sync External Applications</h2>

      <select
        value={selectedApp}
        onChange={(e) => setSelectedApp(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select a platform</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Handshake">Handshake</option>
        <option value="Indeed">Indeed</option>
        <option value="Glassdoor">Glassdoor</option>
      </select>

      <button
        onClick={handleSync}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Connect
      </button>
    </div>
  );
};

export default SyncApps;
