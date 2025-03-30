'use client'

import { useState } from 'react'
import { ChevronDown, ArrowLeft } from 'lucide-react'

interface Goal {
  id: number
  title: string
  description: string
  status: 'In Progress' | 'Completed' | 'Overdue'
  dueDate: string
  rating?: number
  comments?: string
}

export function SelfRating() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: 'Improve Code Quality',
      description: 'Implement better testing practices and increase code coverage to 80%',
      status: 'In Progress',
      dueDate: 'Due in 5 days'
    },
    {
      id: 2,
      title: 'Team Training Program',
      description: 'Develop and conduct monthly training sessions on emerging technologies',
      status: 'Completed',
      dueDate: 'Due in 2 days'
    }
  ])

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedRatings, setSelectedRatings] = useState<Record<number, number>>({})
  const [comments, setComments] = useState<Record<number, string>>({})

  const ratingOptions = [
    { value: 1, label: '1 - Needs Improvement' },
    { value: 2, label: '2 - Meeting Some Expectations' },
    { value: 3, label: '3 - Meeting Expectations' },
    { value: 4, label: '4 - Exceeding Expectations' },
    { value: 5, label: '5 - Outstanding Performance' }
  ]

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'Completed':
        return 'bg-green-500/20 text-green-400'
      case 'Overdue':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const handleSubmitRating = (goalId: number) => {
    const rating = selectedRatings[goalId]
    const comment = comments[goalId]
    if (!rating) return

    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, rating, comments: comment }
        : goal
    ))
    setSelectedGoal(null)
  }

  if (selectedGoal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedGoal(null)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Rate Goal</h1>
        </div>

        <div className="bg-[#151524] rounded-lg overflow-hidden">
          {/* Goal Details */}
          <div className="p-8 border-b border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-3">{selectedGoal.title}</h2>
            <p className="text-gray-400 text-lg mb-6">{selectedGoal.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{selectedGoal.dueDate}</span>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedGoal.status)}`}>
                {selectedGoal.status}
              </span>
            </div>
          </div>

          {/* Rating Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Rating
              </label>
              <div className="relative max-w-md">
                <select
                  value={selectedRatings[selectedGoal.id] || ''}
                  onChange={(e) => setSelectedRatings({
                    ...selectedRatings,
                    [selectedGoal.id]: Number(e.target.value)
                  })}
                  className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-lg"
                >
                  <option value="">Select rating</option>
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Comments
              </label>
              <textarea
                value={comments[selectedGoal.id] || ''}
                onChange={(e) => setComments({
                  ...comments,
                  [selectedGoal.id]: e.target.value
                })}
                placeholder="Add your self-assessment..."
                className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] min-h-[200px] text-lg"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => handleSubmitRating(selectedGoal.id)}
                disabled={!selectedRatings[selectedGoal.id]}
                className="px-6 py-3 text-base font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Self Rating</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-[#151524] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#6c47ff] transition-all cursor-pointer"
            onClick={() => setSelectedGoal(goal)}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">{goal.title}</h2>
              <p className="text-gray-400 mb-4 line-clamp-2">{goal.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{goal.dueDate}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                  {goal.status}
                </span>
              </div>
              {goal.rating && (
                <div className="mt-4 px-3 py-2 bg-[#1E293B] rounded-lg inline-block">
                  <span className="text-sm text-white">Rating: {goal.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 