'use client'

import { TargetIcon, UsersIcon, StarIcon, MessageSquareIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface StatCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ElementType
  iconColor: string
  changeType: 'increase' | 'decrease'
}

function StatCard({ title, value, change, icon: Icon, iconColor, changeType }: StatCardProps) {
  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-semibold text-white">{value}</div>
        <div className={`mt-1 text-sm ${
          changeType === 'increase' ? 'text-green-400' : 'text-red-400'
        }`}>
          {changeType === 'increase' ? '↑' : '↓'} {change} from last month
        </div>
      </div>
    </div>
  )
}

interface Goal {
  id: number
  title: string
  dueDate: string
  status: 'In Progress' | 'Completed' | 'Overdue'
}

interface Review {
  id: number
  title: string
  date: string
}

export function EmployeeOverview() {
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Supabase here
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    {
      title: 'Goals Completed',
      value: '85%',
      change: '12%',
      icon: TargetIcon,
      iconColor: 'bg-emerald-500/20',
      changeType: 'increase' as const
    },
    {
      title: 'Team Members',
      value: '24',
      change: '4%',
      icon: UsersIcon,
      iconColor: 'bg-blue-500/20',
      changeType: 'increase' as const
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '2%',
      icon: StarIcon,
      iconColor: 'bg-yellow-500/20',
      changeType: 'decrease' as const
    },
    {
      title: 'Feedback Given',
      value: '156',
      change: '8%',
      icon: MessageSquareIcon,
      iconColor: 'bg-purple-500/20',
      changeType: 'increase' as const
    }
  ]

  const recentGoals: Goal[] = [
    {
      id: 1,
      title: 'Improve Code Quality',
      dueDate: 'Due in 5 days',
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Complete Project Documentation',
      dueDate: 'Due in 2 days',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Team Training Session',
      dueDate: 'Due tomorrow',
      status: 'Overdue'
    }
  ]

  const upcomingReviews: Review[] = [
    {
      id: 1,
      title: 'Q1 Performance Review',
      date: 'March 15, 2025'
    },
    {
      id: 2,
      title: 'Project Milestone Review',
      date: 'March 20, 2025'
    },
    {
      id: 3,
      title: 'Team Performance Review',
      date: 'March 25, 2025'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Goals and Upcoming Reviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Goals */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Goals</h2>
            <button className="text-sm text-gray-400 hover:text-white">View All →</button>
          </div>
          <div className="space-y-4">
            {recentGoals.map((goal) => (
              <div key={goal.id} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{goal.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    goal.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    goal.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{goal.dueDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reviews */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Upcoming Reviews</h2>
            <button className="text-sm text-gray-400 hover:text-white">View All →</button>
          </div>
          <div className="space-y-4">
            {upcomingReviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{review.title}</h3>
                  <button className="p-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-400">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 