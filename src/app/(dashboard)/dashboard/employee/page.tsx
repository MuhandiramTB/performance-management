'use client'

import { useState } from 'react'
import { EmployeeSidebar } from '@/components/dashboard/employee/layout/EmployeeSidebar'
import { EmployeeOverview } from '@/components/dashboard/employee/sections/EmployeeOverview'
import { GoalSetting } from '@/components/dashboard/employee/sections/GoalSetting'
import { GoalApproval } from '@/components/dashboard/employee/sections/GoalApproval'
import { SelfRating } from '@/components/dashboard/employee/sections/SelfRating'
import { Feedback } from '@/components/dashboard/employee/sections/Feedback'
import { Reports } from '@/components/dashboard/employee/sections/Reports'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EmployeeDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <EmployeeOverview />
      case 'goal-setting':
        return <GoalSetting />
      case 'goal-approval':
        return <GoalApproval />
      case 'self-rating':
        return <SelfRating />
      case 'feedback':
        return <Feedback />
      case 'reports':
        return <Reports />
      default:
        return <EmployeeOverview />
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#151524] border-b border-gray-800">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold text-white">Employee Portal</span>
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
        <EmployeeSidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

