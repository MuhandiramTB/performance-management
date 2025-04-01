'use client'

import { Target, Users, Star, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatCardProps {
  title: string
  value: number
  icon: React.ElementType
  color: string
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export function EmployeeOverview() {
  const [stats, setStats] = useState({
    goals: 0,
    teamMembers: 0,
    ratings: 0,
    feedback: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/employee/stats')
        
        if (!response.ok) {
          const errorData = await response.json()
          if (response.status === 401) {
            // Redirect to login page if unauthorized
            window.location.href = '/login'
            return
          }
          throw new Error(errorData.error || 'Failed to fetch stats')
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch stats')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-600 mt-1">Your performance metrics and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Goals"
          value={stats.goals}
          icon={Target}
          color="bg-blue-500"
        />
        <StatCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Self Ratings"
          value={stats.ratings}
          icon={Star}
          color="bg-yellow-500"
        />
        <StatCard
          title="Feedback"
          value={stats.feedback}
          icon={MessageSquare}
          color="bg-purple-500"
        />
      </div>
    </div>
  )
} 