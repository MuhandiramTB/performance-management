'use client'

import { 
  LayoutDashboard, 
  Target, 
  Star, 
  MessageSquare, 
  BarChart2,
  LogOut,
  X,
  Award
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface EmployeeSidebarProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export function EmployeeSidebar({
  selectedTab,
  setSelectedTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: EmployeeSidebarProps) {
  const { signOut } = useAuth()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      id: 'goal-setting',
      label: 'Goal Setting',
      icon: Target,
      bgColor: 'bg-[#6c47ff]/10',
      textColor: 'text-[#6c47ff]'
    },
    {
      id: 'self-rating',
      label: 'Self Rating',
      icon: Star,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    {
      id: 'performance-review',
      label: 'Performance Review',
      icon: Award,
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400'
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart2,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    }
  ]

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId)
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <div className={`
        fixed inset-y-16 left-0 z-30 w-64 backdrop-blur-xl border-r border-white/10 bg-[#1a1a2e]
        transform transition-transform duration-300 ease-in-out shadow-[0_0_15px_rgba(0,0,0,0.1)]
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:sticky lg:top-16
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-[#1a1a2e] backdrop-blur-xl lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
} 