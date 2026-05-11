import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    requireVerification: true,
    allowAnonymous: true,
    sendSmsAlerts: true,
    autoCloseReports: false,
    enableUpvoteSorting: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">
          Settings
        </h1>
      </div>

      {/* Barangay Profile Card */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] mb-6">
          Barangay Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Barangay Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Barangay Name
            </label>
            <input
              type="text"
              defaultValue="Barangay San Isidro"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>

          {/* Captain */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Captain
            </label>
            <input
              type="text"
              defaultValue="Hon. Roberto Dela Cruz"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>

          {/* Hotline */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Hotline
            </label>
            <input
              type="tel"
              defaultValue="0917-555-0001"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>

          {/* Total Puroks */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Total Puroks
            </label>
            <input
              type="number"
              defaultValue="7"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Notifications & Workflow Card */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#1e3a5f] mb-6">
          Notifications & Workflow
        </h2>

        <div className="space-y-6">
          {/* Toggle Item 1 */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm font-medium text-[#1e3a5f]">
                Require admin verification before public posting
              </p>
            </div>
            <button
              onClick={() => toggleSetting('requireVerification')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.requireVerification ? 'bg-[#f97316]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.requireVerification ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle Item 2 */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm font-medium text-[#1e3a5f]">
                Allow anonymous reporting
              </p>
            </div>
            <button
              onClick={() => toggleSetting('allowAnonymous')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.allowAnonymous ? 'bg-[#f97316]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.allowAnonymous ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle Item 3 */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm font-medium text-[#1e3a5f]">
                Send SMS alerts for emergencies
              </p>
            </div>
            <button
              onClick={() => toggleSetting('sendSmsAlerts')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.sendSmsAlerts ? 'bg-[#f97316]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.sendSmsAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle Item 4 */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm font-medium text-[#1e3a5f]">
                Auto-close resolved reports after 14 days
              </p>
            </div>
            <button
              onClick={() => toggleSetting('autoCloseReports')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.autoCloseReports ? 'bg-[#f97316]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.autoCloseReports ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle Item 5 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#1e3a5f]">
                Enable upvote priority sorting
              </p>
            </div>
            <button
              onClick={() => toggleSetting('enableUpvoteSorting')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.enableUpvoteSorting ? 'bg-[#f97316]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.enableUpvoteSorting ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-[#1e3a5f] hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg">
          Save changes
        </button>
      </div>
    </div>
  );
};

export default Settings;