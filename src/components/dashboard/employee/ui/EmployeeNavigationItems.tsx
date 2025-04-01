'use client'

import { Home, Target, Star, MessageSquare, BarChart, Clock } from 'lucide-react'

interface NavigationItemsProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'goals', label: 'Goals', icon: Target, description: 'Set and track performance goals' },
  { id: 'ratings', label: 'Ratings', icon: Star, description: 'Submit self-ratings and view manager feedback' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, description: 'View and respond to performance feedback' },
  { id: 'reports', label: 'Reports', icon: BarChart, description: 'View performance reports and analytics' },
  { id: 'schedule', label: 'Schedule', icon: Clock, description: 'View rating periods and deadlines' }
]

export function EmployeeNavigationItems({
  selectedTab,
  setSelectedTab,
  setIsMobileMenuOpen
}: NavigationItemsProps) {
  const handleClick = (tabId: string) => {
    setSelectedTab(tabId)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isSelected = selectedTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isSelected
                ? 'text-white bg-[#6c47ff]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : ''}`} />
            <div className="flex flex-col items-start">
              <span>{item.label}</span>
              {item.description && (
                <span className="text-xs text-gray-500">{item.description}</span>
              )}
            </div>
          </button>
        )
      })}
    </nav>
  )
} 