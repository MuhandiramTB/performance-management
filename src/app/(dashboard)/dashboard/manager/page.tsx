'use client'

import { useState } from 'react'
import { ManagerSidebar } from '@/components/dashboard/manager/layout/ManagerSidebar'
import { ManagerOverview } from '@/components/dashboard/manager/sections/ManagerOverview'
import { TeamManagement } from '@/components/dashboard/manager/sections/TeamManagement'
import { GoalSetting } from '@/components/dashboard/manager/sections/GoalSetting'
import { GoalApprovals } from '@/components/dashboard/manager/sections/GoalApprovals'
import { PerformanceReviews } from '@/components/dashboard/manager/sections/PerformanceReviews'
import { TeamFeedback } from '@/components/dashboard/manager/sections/TeamFeedback'
import { Reports } from '@/components/dashboard/manager/sections/Reports'
import { ReviewSchedule } from '@/components/dashboard/manager/sections/ReviewSchedule'
import { TeamAchievements } from '@/components/dashboard/manager/sections/TeamAchievements'
import { Projects } from '@/components/dashboard/manager/sections/Projects'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ManagerDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <ManagerOverview />
      case 'team-management':
        return <TeamManagement />
      case 'goal-setting':
        return <GoalSetting />
      case 'goal-approvals':
        return <GoalApprovals />
      case 'performance-reviews':
        return <PerformanceReviews />
      case 'team-feedback':
        return <TeamFeedback />
      case 'reports':
        return <Reports />
      case 'review-schedule':
        return <ReviewSchedule />
      case 'team-achievements':
        return <TeamAchievements />
      case 'projects':
        return <Projects />
      default:
        return <ManagerOverview />
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
        <span className="text-lg font-semibold text-white">Manager Portal</span>
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
        <ManagerSidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}