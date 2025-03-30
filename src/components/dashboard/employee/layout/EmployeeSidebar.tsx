'use client'

import { useRouter } from 'next/navigation'
import { EmployeeNavigationItems } from '../ui/EmployeeNavigationItems'
import { supabase } from '@/lib/supabase'
import { LogOut, Menu } from 'lucide-react'

interface SidebarProps {
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
}: SidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <>
      <div className={`
        fixed lg:sticky lg:top-0 inset-0 z-20 bg-[#151524] w-64 h-screen transform transition-transform duration-200 ease-in-out border-r border-gray-800
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center gap-2 px-2 mb-8">
              <div className="bg-[#6c47ff] rounded-lg p-2">
                <Menu className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Employee Portal</span>
            </div>

            <EmployeeNavigationItems
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