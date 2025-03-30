'use client'

import { useState } from 'react'

interface SystemSettingsProps {
  onBack: () => void
}

interface Settings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  maxLoginAttempts: number
  sessionTimeout: number
  emailNotifications: boolean
  darkMode: boolean
}

export function SystemSettings({ onBack }: SystemSettingsProps) {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Performance Management System',
    siteDescription: 'Enterprise performance management solution',
    maintenanceMode: false,
    registrationEnabled: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    emailNotifications: true,
    darkMode: true
  })

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save settings
      console.log('Saving settings:', settings)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg bg-[#1a1b2e]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-white">System Settings</h2>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5538cc] transition-colors"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-[#1a1b2e] p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
              rows={3}
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#1a1b2e] p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Security Settings</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Max Login Attempts</label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-[#1a1b2e] p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Feature Toggles</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Maintenance Mode</span>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-[#6c47ff]' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Registration Enabled</span>
              <button
                onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.registrationEnabled ? 'bg-[#6c47ff]' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#1a1b2e] p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Email Notifications</span>
              <button
                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-[#6c47ff]' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Dark Mode</span>
              <button
                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.darkMode ? 'bg-[#6c47ff]' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 