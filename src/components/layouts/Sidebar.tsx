'use client'

import { ReactNode } from 'react'
import { LogOut, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  textColor: string
}

interface SidebarProps {
  menuItems: MenuItem[]
  selectedTab: string
  setSelectedTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  role: 'employee' | 'manager' | 'admin'
}

export function Sidebar({
  menuItems,
  selectedTab,
  setSelectedTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  role
}: SidebarProps) {
  const { signOut } = useAuth()

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId)
    setIsMobileMenuOpen(false)
  }

  const handleSignOut = () => {
    signOut()
  }

  // Get role-specific color
  const getRoleColor = () => {
    switch (role) {
      case 'employee':
        return 'bg-[#6c47ff]/20 text-[#6c47ff]'
      case 'manager':
        return 'bg-blue-500/20 text-blue-400'
      case 'admin':
        return 'bg-purple-500/20 text-purple-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 fixed inset-y-16 left-0 bg-[#151524] border-r border-gray-800/50 overflow-y-auto">
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-white">
              {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </h2>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isSelected = selectedTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isSelected 
                      ? `${item.bgColor} ${item.textColor}` 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
          
          <div className="px-4 pt-4 mt-auto border-t border-gray-800/50">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-y-16 left-0 z-50 w-64 bg-[#151524] border-r border-gray-800/50
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isSelected = selectedTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isSelected 
                      ? `${item.bgColor} ${item.textColor}` 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
          
          <div className="px-4 pt-4 mt-auto border-t border-gray-800/50">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
} 