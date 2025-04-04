'use client'

import { useState } from 'react'
import { GoalApprovals } from '@/components/dashboard/manager/sections/GoalApprovals'
import { PerformanceReviews } from '@/components/dashboard/manager/sections/PerformanceReviews'
import { Feedback } from '@/components/dashboard/manager/sections/Feedback'
import { ManagerRating } from '@/components/dashboard/manager/sections/ManagerRating'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { 
  Target, 
  Star, 
  MessageSquare, 
  BarChart2,
  Users
} from 'lucide-react'

export default function ManagerDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      id: 'goal-approvals',
      label: 'Goal Approvals',
      icon: Target,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      id: 'manager-ratings',
      label: 'Manager Ratings',
      icon: Star,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    {
      id: 'performance-reviews',
      label: 'Performance Reviews',
      icon: BarChart2,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      id: 'team-management',
      label: 'Team Management',
      icon: Users,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400'
    }
  ]

  const renderContent = () => {
    switch (selectedTab) {
      case 'goal-approvals':
        return <GoalApprovals />
      case 'manager-ratings':
        return <ManagerRating />
      case 'performance-reviews':
        return <PerformanceReviews />
      case 'feedback':
        return <Feedback />
      case 'team-management':
        return <div className="p-4 text-white">Team Management Content</div>
      default:
        return <GoalApprovals />
    }
  }

  return (
    <DashboardLayout
      title="Manager Portal"
      menuItems={menuItems}
      role="manager"
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      {renderContent()}
    </DashboardLayout>
  )
}