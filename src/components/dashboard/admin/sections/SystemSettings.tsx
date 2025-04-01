'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, AlertCircle, Clock, Globe, Bell, Shield, Zap, ChevronRight, ChevronDown, Search } from 'lucide-react'

interface SystemSetting {
  id: string
  name: string
  value: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'time'
  options?: string[]
  description: string
  category: 'general' | 'security' | 'performance' | 'notifications'
}

interface SystemSettingsProps {
  settings: SystemSetting[]
  onSave: (settings: SystemSetting[]) => void
}

export function SystemSettings({ settings, onSave }: SystemSettingsProps) {
  const [localSettings, setLocalSettings] = useState<SystemSetting[]>(settings)
  const [selectedCategory, setSelectedCategory] = useState<SystemSetting['category']>('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [expandedSettings, setExpandedSettings] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'general', label: 'General Settings', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  const handleSettingChange = (settingId: string, newValue: string) => {
    setLocalSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === settingId ? { ...setting, value: newValue } : setting
      )
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(localSettings)
      setSaveStatus('success')
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSetting = (settingId: string) => {
    setExpandedSettings(prev =>
      prev.includes(settingId)
        ? prev.filter(id => id !== settingId)
        : [...prev, settingId]
    )
  }

  const filteredSettings = localSettings.filter(setting => {
    const matchesCategory = setting.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={setting.value === 'true'}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked.toString())}
              className="w-4 h-4 text-blue-500 bg-[#1E293B] border-gray-800 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-400">
              {setting.value === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        )
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'time':
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <input
              type="time"
              value={setting.value}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )
      case 'number':
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      default:
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search settings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 border-b border-gray-800 overflow-x-auto pb-2 mb-6">
        {categories.map(category => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as SystemSetting['category'])}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          )
        })}
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto pr-4">
        <div className="space-y-2">
          {filteredSettings.map(setting => (
            <div
              key={setting.id}
              className="bg-[#1E293B] rounded-lg hover:bg-[#151524] transition-colors"
            >
              <button
                onClick={() => toggleSetting(setting.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {expandedSettings.includes(setting.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="text-left">
                    <h3 className="text-white font-medium">{setting.name}</h3>
                    <p className="text-sm text-gray-400">{setting.description}</p>
                  </div>
                </div>
              </button>
              
              {expandedSettings.includes(setting.id) && (
                <div className="px-4 pb-4">
                  <div className="w-full">
                    {renderSettingInput(setting)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-4 pt-4 mt-6 border-t border-gray-800">
        <button
          onClick={() => setLocalSettings(settings)}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Changes
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 text-green-400 text-sm mt-4">
          <AlertCircle className="w-4 h-4" />
          Settings saved successfully
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-4">
          <AlertCircle className="w-4 h-4" />
          Failed to save settings. Please try again.
        </div>
      )}
    </div>
  )
} 