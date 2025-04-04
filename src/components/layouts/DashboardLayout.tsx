'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { Menu, X, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  menuItems: {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    bgColor: string
    textColor: string
  }[]
  role: 'employee' | 'manager' | 'admin'
  selectedTab: string
  setSelectedTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export default function DashboardLayout({
  children,
  title,
  menuItems,
  role,
  selectedTab,
  setSelectedTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: DashboardLayoutProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, signOut } = useAuth()

  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: role === 'employee' 
        ? 'Your goal submission is pending approval' 
        : role === 'manager' 
          ? 'Team goals need review' 
          : 'System maintenance required',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      message: role === 'employee' 
        ? 'New feedback received from your manager' 
        : role === 'manager' 
          ? 'New performance review requests' 
          : 'New user registration requests',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'success',
      message: role === 'employee' 
        ? 'Self-assessment completed successfully' 
        : role === 'manager' 
          ? 'Team meeting scheduled' 
          : 'System backup completed',
      time: '1 day ago',
    },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] to-[#1a1a2e]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-[#151524]/40 border-b border-gray-800/50">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">{title}</span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors relative"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#151524] rounded-xl shadow-xl border border-gray-800/50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-[#1a1a2e] hover:bg-[#1E293B] transition-colors cursor-pointer"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'info' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${getRoleColor()} flex items-center justify-center`}>
                  <User className="w-5 h-5" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.email}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isUserMenuOpen ? 'transform rotate-180' : ''
                }`} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#151524] rounded-xl shadow-xl border border-gray-800/50 p-4">
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-800/50">
                    <div className={`w-10 h-10 rounded-full ${getRoleColor()} flex items-center justify-center`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{user?.email}</h3>
                      <p className="text-xs text-gray-400">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        router.push('/dashboard/settings')
                      }}
                      className="w-full flex items-center space-x-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        signOut()
                      }}
                      className="w-full flex items-center space-x-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <Sidebar
          menuItems={menuItems}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          role={role}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-lg bg-[#151524]/40 rounded-2xl p-4 lg:p-8 border border-gray-800/50 shadow-xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 