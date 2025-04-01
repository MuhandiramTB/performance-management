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
  ThumbsUp,
  Search,
  Filter
} from 'lucide-react'
import { Goal, GoalStatus, Rating } from '@/models/performance'

interface RatingFormData {
  rating: number
  feedback: string
}

export function SelfRating() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [formData, setFormData] = useState<RatingFormData>({
    rating: 0,
    feedback: ''
  })

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.APPROVED:
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case GoalStatus.REJECTED:
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoal) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create new rating
      const newRating: Rating = {
        ratingId: Date.now().toString(),
        goalId: selectedGoal.goalId,
        employeeRating: formData.rating,
        feedback: formData.feedback,
        submittedAt: new Date(),
        updatedAt: new Date()
      }

      // Update ratings
      setRatings(prev => ({
        ...prev,
        [selectedGoal.goalId]: newRating
      }))

      setSelectedGoal(null)
      setFormData({ rating: 0, feedback: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <Star className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Self Rating</h1>
            <p className="text-gray-400 mt-1">Rate your performance against your goals</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] w-full sm:w-64"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          >
            <option value="all">All Status</option>
            <option value={GoalStatus.PENDING}>Pending</option>
            <option value={GoalStatus.APPROVED}>Approved</option>
            <option value={GoalStatus.REJECTED}>Rejected</option>
          </select>
        </div>
      </div>

      {/* Rating Form */}
      {selectedGoal && (
        <div className="bg-[#151524] rounded-lg border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Rate Your Performance</h2>
            <button
              onClick={() => {
                setSelectedGoal(null)
                setFormData({ rating: 0, feedback: '' })
              }}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">{selectedGoal.description}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due {new Date(selectedGoal.createdAt).toLocaleDateString()}
              </span>
              {getStatusIcon(selectedGoal.status)}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Rating (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: value })}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.rating === value
                        ? 'bg-[#6c47ff] text-white'
                        : 'bg-[#1E293B] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Feedback
              </label>
              <textarea
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] h-32"
                placeholder="Provide feedback on your performance..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedGoal(null)
                  setFormData({ rating: 0, feedback: '' })
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || formData.rating === 0}
                className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ad9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="grid gap-4">
        {filteredGoals.map((goal) => (
          <div
            key={goal.goalId}
            className="bg-[#151524] rounded-lg border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">
                    {goal.description.split('\n')[0]}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {goal.description.split('\n').slice(1).join('\n')}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Due {new Date(goal.createdAt).toLocaleDateString()}
                    </span>
                    {ratings[goal.goalId] && (
                      <span className="flex items-center gap-1 text-sm text-[#6c47ff]">
                        <Star className="w-4 h-4" />
                        Your Rating: {ratings[goal.goalId].employeeRating}/5
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(goal.status)}
                  {goal.status === GoalStatus.APPROVED && !ratings[goal.goalId] && (
                    <button
                      onClick={() => setSelectedGoal(goal)}
                      className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ad9] transition-colors"
                    >
                      Rate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}