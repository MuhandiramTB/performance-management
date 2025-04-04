'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

type Goal = {
  id: string
  title: string
  description: string
  deadline: string
  priority: number
  status: string
  feedback: string | null
  category: string
  tags: string[]
  progress: number
  created_at: string
  updated_at: string
  user_id: string
  profiles: {
    name: string
  }
}

export function GoalApproval() {
  const { user } = useAuth()
  const [pendingGoals, setPendingGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [feedback, setFeedback] = useState('')

  // Fetch pending goals
  useEffect(() => {
    const fetchPendingGoals = async () => {
      if (!user) return
      
      try {
        const response = await fetch('/api/goals/pending', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch pending goals')
        }
        
        const data = await response.json()
        setPendingGoals(data)
      } catch (error) {
        console.error('Error fetching pending goals:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to fetch pending goals')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingGoals()
  }, [user])

  // Approve goal
  const handleApprove = async (goalId: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/goals/${goalId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'approved' })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to approve goal')
      }
      
      // Update UI
      setPendingGoals(pendingGoals.filter(g => g.id !== goalId))
      setSelectedGoal(null)
      toast.success('Goal approved successfully')
    } catch (error) {
      console.error('Error approving goal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to approve goal')
    }
  }

  // Reject goal
  const handleReject = async (goalId: string) => {
    if (!user || !feedback.trim()) return
    
    try {
      const response = await fetch(`/api/goals/${goalId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          status: 'rejected',
          feedback: feedback
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reject goal')
      }
      
      // Update UI
      setPendingGoals(pendingGoals.filter(g => g.id !== goalId))
      setSelectedGoal(null)
      setFeedback('')
      toast.success('Goal rejected successfully')
    } catch (error) {
      console.error('Error rejecting goal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to reject goal')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Goal Approval</h2>
      
      {pendingGoals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending goals to approve.
        </div>
      ) : (
        <div className="space-y-4">
          {pendingGoals.map((goal) => (
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{goal.title}</h3>
                  <p className="text-gray-600 mt-1">{goal.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted by: {goal.profiles?.name || 'Unknown'}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium">{new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className="font-medium">
                    {goal.priority === 0 ? 'Low' :
                     goal.priority === 1 ? 'Medium' : 'High'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{goal.category || 'N/A'}</p>
                </div>
              </div>
              
              {goal.tags && goal.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleApprove(goal.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => setSelectedGoal(goal)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Reject Goal</h3>
            <p className="mb-4">Please provide feedback for rejecting this goal:</p>
            
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
            ></textarea>
            
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSelectedGoal(null)
                  setFeedback('')
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedGoal.id)}
                disabled={!feedback.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Reject Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 