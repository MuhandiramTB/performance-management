'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard, Users, History, Settings, Shield } from 'lucide-react'
import { AdminNavigationItems } from '../ui/AdminNavigationItems'

interface SidebarProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

const navigationItems = [
  {
    id: 'admin',
    label: 'Admin Management',
    icon: Shield,
    href: '/dashboard/admin'
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: History,
    href: '/dashboard/admin/audit'
  }
]

export function Sidebar({ selectedTab, setSelectedTab, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    // Implement your logout logic here
    router.push('/login')
  }

  return (
    <>
      <div className={`
        fixed lg:sticky lg:top-0 inset-0 z-20  bg-[#151524]/40 w-64 h-screen transform transition-transform duration-200 ease-in-out border-r border-gray-800
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mt-15 flex flex-col h-50">
          <div className="p-4">
            <AdminNavigationItems
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>

          <div className="mt-auto p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
} 