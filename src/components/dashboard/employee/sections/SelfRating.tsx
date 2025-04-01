'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  ArrowLeft, 
  Target, 
  Star, 
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Send,
  ThumbsUp
} from 'lucide-react'

interface Goal {
  id: number
  title: string
  description: string
  status: 'In Progress' | 'Completed' | 'Overdue'
  dueDate: string
  rating?: number
  comments?: string
  progress: number
  category: string
  approvedBy: string
  approvedAt: string
}

export function SelfRating() {
  const [goals, setGoals] = useState<Goal[]>([])

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedRatings, setSelectedRatings] = useState<Record<number, number>>({})
  const [comments, setComments] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ratingOptions = [
    { value: 1, label: '1 - Needs Improvement', description: 'Performance below expectations' },
    { value: 2, label: '2 - Meeting Some Expectations', description: 'Partially meeting goals' },
    { value: 3, label: '3 - Meeting Expectations', description: 'Consistently meeting goals' },
    { value: 4, label: '4 - Exceeding Expectations', description: 'Going above and beyond' },
    { value: 5, label: '5 - Outstanding Performance', description: 'Exceptional achievement' }
  ]

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-500/10 text-yellow-400'
      case 'Completed':
        return 'bg-green-500/10 text-green-400'
      case 'Overdue':
        return 'bg-red-500/10 text-red-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'In Progress':
        return <Clock className="w-4 h-4" />
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />
      case 'Overdue':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleSubmitRating = async (goalId: number) => {
    const rating = selectedRatings[goalId]
    const comment = comments[goalId]
    if (!rating) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, rating, comments: comment }
          : goal
      ))
      setSelectedGoal(null)
    } finally {
      setIsSubmitting(false)
    }
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
              <Star className="w-5 h-5 text-[#6c47ff]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Self Assessment</h1>
              <p className="text-gray-400 mt-1">Rate your performance for this goal</p>
            </div>
          </div>
        </div>

        <div className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50">
          {/* Goal Details */}
          <div className="p-8 border-b border-gray-800/50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">{selectedGoal.title}</h2>
                <p className="text-gray-400 text-lg mb-6">{selectedGoal.description}</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {selectedGoal.dueDate}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedGoal.status)} flex items-center gap-1`}>
                    {getStatusIcon(selectedGoal.status)}
                    {selectedGoal.status}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-[#6c47ff]/10 text-[#6c47ff]">
                    {selectedGoal.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Approved by</p>
                <p className="text-white font-medium">{selectedGoal.approvedBy}</p>
                <p className="text-xs text-gray-500">
                  {new Date(selectedGoal.approvedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{selectedGoal.progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    selectedGoal.status === 'Completed' ? 'bg-green-500' :
                    selectedGoal.status === 'In Progress' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${selectedGoal.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rating Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <BarChart3 className="w-4 h-4" />
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
              {selectedRatings[selectedGoal.id] && (
                <p className="mt-2 text-sm text-gray-400">
                  {ratingOptions.find(opt => opt.value === selectedRatings[selectedGoal.id])?.description}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <MessageSquare className="w-4 h-4" />
                Self Assessment Comments
              </label>
              <textarea
                value={comments[selectedGoal.id] || ''}
                onChange={(e) => setComments({
                  ...comments,
                  [selectedGoal.id]: e.target.value
                })}
                placeholder="Provide detailed self-assessment of your performance..."
                className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] min-h-[200px] text-lg"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => handleSubmitRating(selectedGoal.id)}
                disabled={isSubmitting || !selectedRatings[selectedGoal.id]}
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Rating
                  </>
                )}
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <Star className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Self Rating</h1>
            <p className="text-gray-400 mt-1">Evaluate your performance against approved goals</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedGoal(goal)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">{goal.title}</h2>
                  <p className="text-gray-400 mb-4 line-clamp-2">{goal.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)} flex items-center gap-1`}>
                  {getStatusIcon(goal.status)}
                  {goal.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {goal.dueDate}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[#6c47ff]/10 text-[#6c47ff] text-xs">
                    {goal.category}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        goal.status === 'Completed' ? 'bg-green-500' :
                        goal.status === 'In Progress' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {goal.rating && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">Rating: {goal.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}