'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Goal } from '@/models/performance'
import { GoalApproval } from './goal-approval/GoalApproval'
import { toast } from 'react-hot-toast'

export function GoalApprovals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'manager') {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals/pending', {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please sign in to view goals')
          return
        }
        if (response.status === 403) {
          toast.error('You do not have permission to view goals')
          return
        }
        throw new Error('Failed to fetch goals')
      }

      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const handleGoalUpdate = (updatedGoal: Goal) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.goalId === updatedGoal.goalId ? updatedGoal : goal
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-lg text-gray-500">No pending goals to review</p>
        <p className="text-sm text-gray-400">Goals submitted by your team members will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <GoalApproval goals={goals} onGoalUpdate={handleGoalUpdate} />
    </div>
  )
} 