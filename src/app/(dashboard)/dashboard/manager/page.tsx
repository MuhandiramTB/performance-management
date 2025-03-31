'use client'

import { useState, useRef, useEffect } from 'react'
import { ManagerSidebar } from '@/components/dashboard/manager/layout/ManagerSidebar'
import { ManagerOverview } from '@/components/dashboard/manager/sections/ManagerOverview'
import { TeamManagement } from '@/components/dashboard/manager/sections/TeamManagement'
import { GoalApprovals } from '@/components/dashboard/manager/sections/GoalApprovals'
import { PerformanceReviews } from '@/components/dashboard/manager/sections/PerformanceReviews'
import { Feedback } from '@/components/dashboard/manager/sections/TeamFeedback'
import { Reports } from '@/components/dashboard/manager/sections/Reports'
import { ReviewSchedule } from '@/components/dashboard/manager/sections/ReviewSchedule'
import { TeamAchievements } from '@/components/dashboard/manager/sections/TeamAchievements'
import { Projects } from '@/components/dashboard/manager/sections/Projects'
import { ManagerRating } from '@/components/dashboard/manager/sections/ManagerRating'
import { Menu, X, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ManagerDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      message: 'Team goals need review',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'New performance review requests',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'success',
      message: 'Team meeting scheduled',
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

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <ManagerOverview />
      case 'team-management':
        return <TeamManagement />
      
      case 'goal-approvals':
        return <GoalApprovals />
      case 'performance-reviews':
        return <PerformanceReviews />
      case 'team-feedback':
        return <Feedback />
      case 'reports':
        return <Reports />
      case 'review-schedule':
        return <ReviewSchedule />
      case 'team-achievements':
        return <TeamAchievements />
      case 'projects':
        return <Projects />
      case 'manager-rating':
        return <ManagerRating />
      default:
        return <ManagerOverview />
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0a0a14] to-[#1a1a2e]">
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
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-white">Manager Portal</span>
            
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
                        className="flex items-start space-x-3 p-3 rounded-lg bg-[#1a1a2e]"
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
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.email}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isUserMenuOpen ? 'transform rotate-180' : ''
                }`} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#151524] rounded-xl shadow-xl border border-gray-800/50 p-4">
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{user?.email}</h3>
                      <p className="text-xs text-gray-400">Manager</p>
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
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Desktop Sidebar */}
          <div className="h-full flex flex-col">
            <ManagerSidebar
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isMobileMenuOpen={false}
              setIsMobileMenuOpen={() => {}}
            />
          </div>

        {/* Mobile Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          bg-[#151524] border-r border-gray-800/50 rounded-r-2xl shadow-xl
          overflow-hidden backdrop-blur-lg
          lg:hidden
        `}>
          
          
          {/* Sidebar Content */}
          <div className="h-full flex flex-col">
            <ManagerSidebar
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Main Content Area */}
              <div className="backdrop-blur-lg bg-[#151524]/40 rounded-2xl p-8 border border-gray-800/50 shadow-xl">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}