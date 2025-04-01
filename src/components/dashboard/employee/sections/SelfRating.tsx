'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
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
import { Goal, Rating, GoalStatus } from '@/models/performance'

interface RatingFormData {
  rating: number
  feedback: string
}

// Sample data for demonstration
const sampleGoals: Goal[] = [
  {
    goalId: '1',
    employeeId: '101',
    description: "Improve Team Productivity\nIncrease team output by 25% through process optimization and better resource allocation",
    status: GoalStatus.APPROVED,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    goalId: '2',
    employeeId: '101',
    description: "Customer Satisfaction Enhancement\nAchieve 90% customer satisfaction rating through improved service delivery",
    status: GoalStatus.APPROVED,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    goalId: '3',
    employeeId: '101',
    description: "Project Delivery Timeline\nComplete project milestones within agreed timeline and budget constraints",
    status: GoalStatus.PENDING,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  }
]

export function SelfRating() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [formData, setFormData] = useState<RatingFormData>({
    rating: 0,
    feedback: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize goals with sample data
  const [goals, setGoals] = useState<Goal[]>(sampleGoals)

  const ratingOptions = [
    { value: 1, label: '1 - Needs Improvement', description: 'Performance below expectations' },
    { value: 2, label: '2 - Meeting Some Expectations', description: 'Partially meeting goals' },
    { value: 3, label: '3 - Meeting Expectations', description: 'Consistently meeting goals' },
    { value: 4, label: '4 - Exceeding Expectations', description: 'Going above and beyond' },
    { value: 5, label: '5 - Outstanding Performance', description: 'Exceptional achievement' }
  ]

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.PENDING:
        return 'bg-yellow-500/10 text-yellow-400'
      case GoalStatus.APPROVED:
        return 'bg-green-500/10 text-green-400'
      case GoalStatus.REJECTED:
        return 'bg-red-500/10 text-red-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.PENDING:
        return <Clock className="w-4 h-4" />
      case GoalStatus.APPROVED:
        return <CheckCircle className="w-4 h-4" />
      case GoalStatus.REJECTED:
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
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
        managerRating: 0, // This will be set by the manager
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

  // Add sorting functionality
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    // Sort by status (Rejected first, then Pending, then Approved)
    const statusOrder = { [GoalStatus.REJECTED]: 0, [GoalStatus.PENDING]: 1, [GoalStatus.APPROVED]: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  if (selectedGoal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedGoal(null)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
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
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {selectedGoal.description.split('\n')[0]}
                </h3>
                <p className="text-gray-400 text-lg mb-6">
                  {selectedGoal.description.split('\n').slice(1).join('\n')}
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Due {selectedGoal.createdAt.toLocaleDateString()}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedGoal.status)} flex items-center gap-1`}>
                    {getStatusIcon(selectedGoal.status)}
                    {selectedGoal.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <BarChart3 className="w-4 h-4" />
                Self Rating
              </label>
              <div className="relative max-w-md">
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
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
              {formData.rating && (
                <p className="mt-2 text-sm text-gray-400">
                  {ratingOptions.find(opt => opt.value === formData.rating)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <MessageSquare className="w-4 h-4" />
                Self Assessment Comments
              </label>
              <textarea
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                placeholder="Provide detailed feedback on your performance..."
                className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] min-h-[200px] text-lg"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedGoal(null)
                  setFormData({ rating: 0, feedback: '' })
                }}
                className="px-6 py-3 text-base font-medium text-gray-400 hover:text-white bg-[#1E293B] rounded-lg hover:bg-[#2d3748] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || formData.rating === 0}
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
            <p className="text-gray-400 mt-1">Rate your performance against your goals</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          />
        </div>
        <div className="flex gap-2">
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

      {/* Goals List */}
      <div className="grid gap-6">
        {sortedGoals.map((goal) => (
          <div
            key={goal.goalId}
            className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200 cursor-pointer group"
            onClick={() => setSelectedGoal(goal)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {goal.description.split('\n')[0]}
                  </h2>
                  <p className="text-gray-400 line-clamp-2">
                    {goal.description.split('\n').slice(1).join('\n')}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)} flex items-center gap-1`}>
                  {getStatusIcon(goal.status)}
                  {goal.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due {goal.createdAt.toLocaleDateString()}
                </span>
              </div>

              {/* Self Rating */}
              {ratings[goal.goalId] && (
                <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-[#1E293B] rounded-lg">
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Your Rating: {ratings[goal.goalId].employeeRating}/5</span>
                </div>
              )}
            </div>

            {/* Add a "Rate Now" button */}
            <div className="p-4 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedGoal(goal)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3dd8] transition-colors"
              >
                <Star className="w-4 h-4" />
                Rate Performance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedGoals.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1E293B] mb-4">
            <AlertTriangle className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No goals found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}