'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/admin/layout/Sidebar'
import { Overview } from '@/components/dashboard/admin/sections/Overview'
import { UserManagement } from '@/components/dashboard/admin/sections/UserManagement'
import { AuditLogs } from '@/components/dashboard/admin/sections/AuditLogs'
import { SystemSettings } from '@/components/dashboard/admin/sections/SystemSettings'

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return <Overview onBack={() => window.history.back()} />
      case 'users':
        return <UserManagement onBack={() => window.history.back()} />
      case 'audit':
        return <AuditLogs onBack={() => window.history.back()} />
      case 'settings':
        return <SystemSettings onBack={() => window.history.back()} />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a menu item to view content</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#151524] border-b border-gray-800">
        <button
          onClick={() => window.history.back()}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-white">Admin Portal</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex">
        <Sidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
} 