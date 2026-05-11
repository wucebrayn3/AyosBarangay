import React, { useState } from "react";

const STORAGE_KEY = "ayosbarangay_settings";

const defaultProfile = {
  barangayName: "Barangay San Isidro",
  captain: "Hon. Roberto Dela Cruz",
  hotline: "0917-555-0001",
  totalPuroks: 7,
};

const defaultWorkflow = {
  requireVerification: true,
  allowAnonymous: true,
  sendSmsAlerts: true,
  autoCloseReports: false,
  enableUpvoteSorting: true,
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { ...defaultProfile, ...defaultWorkflow };
};

const Settings = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const updateProfile = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Settings</h1>
      </div>

      {/* Barangay Profile Card */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] mb-6">Barangay Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Barangay Name</label>
            <input
              type="text"
              value={settings.barangayName}
              onChange={(e) => updateProfile("barangayName", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Captain</label>
            <input
              type="text"
              value={settings.captain}
              onChange={(e) => updateProfile("captain", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hotline</label>
            <input
              type="tel"
              value={settings.hotline}
              onChange={(e) => updateProfile("hotline", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Puroks</label>
            <input
              type="number"
              value={settings.totalPuroks}
              onChange={(e) => updateProfile("totalPuroks", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Notifications & Workflow Card */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] mb-6">Notifications & Workflow</h2>

        <div className="space-y-6">
          {[
            { key: "requireVerification", label: "Require admin verification before public posting" },
            { key: "allowAnonymous", label: "Allow anonymous reporting" },
            { key: "sendSmsAlerts", label: "Send SMS alerts for emergencies" },
            { key: "autoCloseReports", label: "Auto-close resolved reports after 14 days" },
            { key: "enableUpvoteSorting", label: "Enable upvote priority sorting" },
          ].map(({ key, label }, idx) => (
            <div key={key} className={`flex items-center justify-between ${idx < 4 ? "pb-4 border-b" : ""}`}>
              <div>
                <p className="text-sm font-medium text-[#1e3a5f]">{label}</p>
              </div>
              <button
                onClick={() => toggleSetting(key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings[key] ? 'bg-[#f97316]' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[key] ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end items-center gap-4">
        {saved && <span className="text-sm text-green-600 font-medium">Settings saved!</span>}
        <button
          onClick={handleSave}
          className="bg-[#1e3a5f] hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
