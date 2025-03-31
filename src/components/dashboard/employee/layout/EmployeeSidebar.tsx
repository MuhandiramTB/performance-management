'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmployeeNavigationItems } from '../ui/EmployeeNavigationItems'
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
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="flex h-full flex-col">
      

      <nav className="mt-4 flex-1">
        <EmployeeNavigationItems
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg p-2 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
} 