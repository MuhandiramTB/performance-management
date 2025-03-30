'use client'

import { Home, Users, Settings, BarChart2, FileText, Shield, Bell, Database } from 'lucide-react'

interface AdminNavigationItemsProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export function AdminNavigationItems({ selectedTab, setSelectedTab, setIsMobileMenuOpen }: AdminNavigationItemsProps) {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings }
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