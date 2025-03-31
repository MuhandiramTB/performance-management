'use client'

import { LayoutDashboard, Users, History, Settings, Shield } from 'lucide-react'

interface AdminNavigationItemsProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

const navigationItems = [
  {
    id: 'admin',
    label: 'Admin Management',
    icon: Shield,
    href: '/dashboard/admin/admin'
  },
  
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: History,
    href: '/dashboard/admin/audit'
  }
  
]

export function AdminNavigationItems({ selectedTab, setSelectedTab, setIsMobileMenuOpen }: AdminNavigationItemsProps) {
  const handleNavigation = (tab: string) => {
    setSelectedTab(tab)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedTab === item.id
                ? 'bg-[#6c47ff] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a2e]'
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
} 