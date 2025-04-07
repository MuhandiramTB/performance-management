'use client'

import { List, LayoutGrid } from 'lucide-react'

interface GoalSettingHeaderProps {
  viewMode: 'list' | 'timeline'
  setViewMode: (mode: 'list' | 'timeline') => void
  setShowForm: (show: boolean) => void
}

export function GoalSettingHeader({ viewMode, setViewMode, setShowForm }: GoalSettingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list'
              ? 'bg-[#6c47ff] text-white'
              : 'bg-[#1E293B] text-gray-400 hover:bg-gray-800'
          }`}
        >
          <List className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'timeline'
              ? 'bg-[#6c47ff] text-white'
              : 'bg-[#1E293B] text-gray-400 hover:bg-gray-800'
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
      </div>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#6c47ff] text-white hover:bg-[#5a3dd8] h-9 px-4 py-2"
      >
        New Goal
      </button>
    </div>
  )
} 