'use client'

import { LayoutGrid, Users, Target, Star, FileText, MessageSquare, BarChart, Calendar, Trophy, FolderKanban, Award } from 'lucide-react'

interface ManagerNavigationItemsProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export function ManagerNavigationItems({ selectedTab, setSelectedTab, setIsMobileMenuOpen }: ManagerNavigationItemsProps) {
  const navigationItems = [
    { id: 'goal-approvals', label: 'Goal Approvals', icon: Star },
    { id: 'performance-reviews', label: 'Performance Reviews', icon: FileText },
    { id: 'manager-rating', label: 'Manager Rating', icon: Award },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ]

  return (
    <div className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => {
              setSelectedTab(item.id)
              setIsMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedTab === item.id
                ? 'text-white bg-[#6c47ff]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
} 