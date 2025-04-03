'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Check, X, MessageSquare } from 'lucide-react'
import { Goal } from '@/lib/db/schema'

interface GoalWithUser extends Goal {
  userName: string
}

interface UpdateGoalStatusParams {
  goalId: string
  status: 'approved' | 'rejected'
  feedback?: string
}

async function fetchPendingGoals(): Promise<GoalWithUser[]> {
  const response = await fetch('/api/goals?status=pending')
  if (!response.ok) {
    throw new Error('Failed to fetch pending goals')
  }
  return response.json()
}

async function updateGoalStatus({ goalId, status, feedback }: UpdateGoalStatusParams): Promise<Goal> {
  const response = await fetch('/api/goals', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ goalId, status, feedback }),
  })
  if (!response.ok) {
    throw new Error('Failed to update goal status')
  }
  return response.json()
}

export function GoalApproval() {
  const queryClient = useQueryClient()
  const [selectedGoal, setSelectedGoal] = useState<GoalWithUser | null>(null)
  const [feedback, setFeedback] = useState('')

  const { data: goals = [], isLoading } = useQuery<GoalWithUser[]>({
    queryKey: ['pending-goals'],
    queryFn: fetchPendingGoals,
  })

  const updateStatusMutation = useMutation({
    mutationFn: updateGoalStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      setSelectedGoal(null)
      setFeedback('')
      toast.success('Goal status updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleApprove = (goal: GoalWithUser) => {
    updateStatusMutation.mutate({ goalId: goal.id, status: 'approved' })
  }

  const handleReject = (goal: GoalWithUser) => {
    if (!feedback.trim()) {
      toast.error('Please provide feedback for rejection')
      return
    }
    updateStatusMutation.mutate({ goalId: goal.id, status: 'rejected', feedback })
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pending Goals</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No pending goals to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal: GoalWithUser) => (
              <div
                key={goal.id}
                className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">{goal.title}</h4>
                    <p className="text-sm text-gray-400">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Submitted by: {goal.userName}</span>
                      <span>Due: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(goal)}
                      className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedGoal(goal)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Feedback Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Provide Feedback</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Goal: {selectedGoal.title}</p>
              <p className="text-sm text-gray-400">Submitted by: {selectedGoal.userName}</p>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback for rejection..."
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedGoal(null)
                  setFeedback('')
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedGoal)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                disabled={!feedback.trim()}
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