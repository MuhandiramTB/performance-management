'use client'

import { useState } from 'react'
import { EmployeeOverview } from '@/components/dashboard/employee/sections/EmployeeOverview'
import { GoalSetting } from '@/components/dashboard/employee/sections/GoalSetting'
import { SelfRating } from '@/components/dashboard/employee/sections/SelfRating'
import { Feedback } from '@/components/dashboard/employee/sections/Feedback'
import Reports from '@/components/dashboard/employee/sections/Reports'
import { PerformanceReview } from '@/components/dashboard/employee/sections/PerformanceReview'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { 
  LayoutDashboard, 
  Target, 
  Star, 
  MessageSquare, 
  BarChart2,
  Award
} from 'lucide-react'

export default function EmployeeDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      id: 'goal-setting',
      label: 'Goal Setting',
      icon: Target,
      bgColor: 'bg-[#6c47ff]/10',
      textColor: 'text-[#6c47ff]'
    },
    {
      id: 'self-rating',
      label: 'Self Rating',
      icon: Star,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart2,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      id: 'performance-review',
      label: 'Performance Review',
      icon: Award,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400'
    }
  ]

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <EmployeeOverview />
      case 'goal-setting':
        return <GoalSetting />
      case 'self-rating':
        return <SelfRating />
      case 'feedback':
        return <Feedback />
      case 'reports':
        return <Reports />
      case 'performance-review':
        return <PerformanceReview />
      default:
        return <EmployeeOverview />
    }
  }

  return (
    <DashboardLayout
      title="Employee Portal"
      menuItems={menuItems}
      role="employee"
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
                {renderContent()}
    </DashboardLayout>
  )
}

