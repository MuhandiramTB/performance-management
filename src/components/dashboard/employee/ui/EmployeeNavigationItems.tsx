'use client'

import { Home, Target, Star, MessageSquare, BarChart } from 'lucide-react'

interface NavigationItemsProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'goal-setting', label: 'Goal Setting', icon: Target },
  { id: 'self-rating', label: 'Self Rating', icon: Star },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'reports', label: 'Reports', icon: BarChart }
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
            {item.label}
          </button>
        )
      })}
    </nav>
  )
} 