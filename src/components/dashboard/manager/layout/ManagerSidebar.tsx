'use client'

import { 
  LayoutDashboard, 
  Users, 
  Target,
  Star,
  MessageSquare,
  ClipboardCheck,
  BarChart2,
  Award,
  LogOut,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ManagerSidebarProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export function ManagerSidebar({
  selectedTab,
  setSelectedTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: ManagerSidebarProps) {
  const { signOut } = useAuth()

  const menuItems = [
    {
      id: 'goal-approvals',
      label: 'Goal Approvals',
      icon: Target,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      id: 'manager-ratings',
      label: 'Manager Ratings',
      icon: Star,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    {
      id: 'performance-reviews',
      label: 'Performance Reviews',
      icon: BarChart2,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      id: 'feedback',
      label: ' Feedback',
      icon: MessageSquare,
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400'
    },
    
  ]

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId)
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200
              ${selectedTab === item.id
                ? 'text-white bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-4 h-4 ${item.textColor}`} />
            </div>
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <div className="p-2 rounded-lg bg-red-500/10">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          Logout
        </button>
      </div>
    </div>
  )
} 