'use client'

import { useState, useEffect } from 'react'
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
  Filter,
  Save,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  FileText,
  TrendingUp
} from 'lucide-react'
import { Goal, Rating, GoalStatus } from '@/models/performance'
import { cn } from '@/lib/utils'

interface RatingFormData {
  rating: number
  feedback: string
  isDraft: boolean
}

interface RatingProgress {
  total: number
  completed: number
  inProgress: number
  notStarted: number
}

export function SelfRating() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [drafts, setDrafts] = useState<Record<string, RatingFormData>>({})
  const [formData, setFormData] = useState<RatingFormData>({
    rating: 0,
    feedback: '',
    isDraft: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'comparison'>('list')
  const [showDrafts, setShowDrafts] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize empty goals array
  const [goals, setGoals] = useState<Goal[]>([])
  const [managerRatings, setManagerRatings] = useState<Record<string, Rating>>({})

  const ratingOptions = [
    { value: 1, label: '1 - Needs Improvement', description: 'Performance below expectations', color: 'bg-red-500' },
    { value: 2, label: '2 - Meeting Some Expectations', description: 'Partially meeting goals', color: 'bg-yellow-500' },
    { value: 3, label: '3 - Meeting Expectations', description: 'Consistently meeting goals', color: 'bg-blue-500' },
    { value: 4, label: '4 - Exceeding Expectations', description: 'Going above and beyond', color: 'bg-green-500' },
    { value: 5, label: '5 - Outstanding Performance', description: 'Exceptional achievement', color: 'bg-purple-500' }
  ]

  // Fetch goals and ratings on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real application, these would be API calls
        // For now, we'll just simulate loading with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Initialize with empty arrays
        setGoals([])
        setManagerRatings({})
        setRatings({})
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate rating progress
  const ratingProgress: RatingProgress = {
    total: goals.length,
    completed: Object.keys(ratings).length,
    inProgress: Object.keys(drafts).length,
    notStarted: goals.length - Object.keys(ratings).length - Object.keys(drafts).length
  }

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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
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

      // Remove from drafts if it was a draft
      if (formData.isDraft) {
        const newDrafts = { ...drafts }
        delete newDrafts[selectedGoal.goalId]
        setDrafts(newDrafts)
      }

      setSelectedGoal(null)
      setFormData({ rating: 0, feedback: '', isDraft: false })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    if (!selectedGoal) return

    // Save current form data as draft
    setDrafts(prev => ({
      ...prev,
      [selectedGoal.goalId]: { ...formData, isDraft: true }
    }))

    setSelectedGoal(null)
    setFormData({ rating: 0, feedback: '', isDraft: false })
  }

  const loadDraft = (goalId: string) => {
    const draft = drafts[goalId]
    if (draft) {
      setFormData(draft)
      setSelectedGoal(goals.find(g => g.goalId === goalId) || null)
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

  // Header component
  const Header = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
          <Star className="w-5 h-5 text-[#6c47ff]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Self Assessment</h1>
          <p className="text-gray-400 mt-1">Rate your performance for each goal</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'comparison' : 'list')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1E293B] rounded-lg hover:bg-[#2d3748] transition-colors"
        >
          {viewMode === 'list' ? (
            <>
              <TrendingUp className="w-4 h-4" />
              Comparison View
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              List View
            </>
          )}
        </button>
      </div>
    </div>
  )

  // Progress tracker component
  const ProgressTracker = () => (
    <div className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50 p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Rating Progress</h3>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1E293B] rounded-lg p-4 border border-gray-800">
          <div className="text-3xl font-bold text-white">{ratingProgress.total}</div>
          <div className="text-sm text-gray-400">Total Goals</div>
        </div>
        <div className="bg-[#1E293B] rounded-lg p-4 border border-gray-800">
          <div className="text-3xl font-bold text-green-400">{ratingProgress.completed}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="bg-[#1E293B] rounded-lg p-4 border border-gray-800">
          <div className="text-3xl font-bold text-yellow-400">{ratingProgress.inProgress}</div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
        <div className="bg-[#1E293B] rounded-lg p-4 border border-gray-800">
          <div className="text-3xl font-bold text-red-400">{ratingProgress.notStarted}</div>
          <div className="text-sm text-gray-400">Not Started</div>
        </div>
      </div>
      <div className="mt-4 h-2 bg-[#1E293B] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
          style={{ 
            width: `${ratingProgress.total > 0 ? (ratingProgress.completed / ratingProgress.total) * 100 : 0}%`,
            transition: 'width 0.5s ease-in-out'
          }}
        />
      </div>
    </div>
  )

  // Filters component
  const Filters = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search goals..."
          className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
        />
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          >
            <option value="all">All Statuses</option>
            <option value={GoalStatus.PENDING}>Pending</option>
            <option value={GoalStatus.APPROVED}>Approved</option>
            <option value={GoalStatus.REJECTED}>Rejected</option>
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <button
          onClick={() => setShowDrafts(!showDrafts)}
          className={cn(
            "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
            showDrafts 
              ? "bg-[#6c47ff] text-white" 
              : "bg-[#1E293B] text-gray-400 hover:text-white"
          )}
        >
          <Save className="w-4 h-4" />
          Drafts
        </button>
      </div>
    </div>
  )

  // Visual rating scale component
  const RatingScale = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Rating Scale</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {ratingOptions.map((option) => (
          <div 
            key={option.value}
            className={cn(
              "p-4 rounded-lg border border-gray-800",
              formData.rating === option.value ? "bg-[#6c47ff]/10 border-[#6c47ff]" : "bg-[#1E293B]"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-3 h-3 rounded-full", option.color)} />
              <div className="font-medium text-white">{option.value}</div>
            </div>
            <div className="text-sm font-medium text-white mb-1">{option.label.split(' - ')[1]}</div>
            <div className="text-xs text-gray-400">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  )

  // Goal card component
  const GoalCard = ({ goal }: { goal: Goal }) => {
    const rating = ratings[goal.goalId]
    const draft = drafts[goal.goalId]
    const managerRating = managerRatings[goal.goalId]
    
    return (
      <div className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                {goal.description.split('\n')[0]}
              </h3>
              <p className="text-gray-400 mb-4">
                {goal.description.split('\n').slice(1).join('\n')}
              </p>
              
              {/* Goal progress indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-white">{goal.progress || 0}%</span>
                </div>
                <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full", getProgressColor(goal.progress || 0))}
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Due {goal.dueDate ? goal.dueDate.toLocaleDateString() : 'Not set'}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(goal.status)} flex items-center gap-1`}>
                  {getStatusIcon(goal.status)}
                  {goal.status}
                </span>
                {goal.category && (
                  <span className="px-3 py-1 text-sm rounded-full bg-[#1E293B] text-white">
                    {goal.category}
                  </span>
                )}
                {goal.priority && (
                  <span className={cn(
                    "px-3 py-1 text-sm rounded-full",
                    goal.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                    goal.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-green-500/10 text-green-400'
                  )}>
                    {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                  </span>
                )}
              </div>
              
              {/* Rating status */}
              <div className="flex items-center gap-4">
                {rating ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Rated: {rating.employeeRating}/5</span>
                  </div>
                ) : draft ? (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Save className="w-4 h-4" />
                    <span>Draft saved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Not rated</span>
                  </div>
                )}
                
                {managerRating && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Star className="w-4 h-4" />
                    <span>Manager: {managerRating.managerRating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800/50 p-4 bg-[#1E293B]">
          <div className="flex justify-end gap-3">
            {draft && (
              <button
                onClick={() => loadDraft(goal.goalId)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Continue Draft
              </button>
            )}
            {!rating && !draft && (
              <button
                onClick={() => setSelectedGoal(goal)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
              >
                <Star className="w-4 h-4" />
                Rate Goal
              </button>
            )}
            {rating && (
              <button
                onClick={() => setSelectedGoal(goal)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1E293B] rounded-lg hover:bg-[#2d3748] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Update Rating
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Comparison view component
  const ComparisonView = () => (
    <div className="space-y-6">
      {sortedGoals.map(goal => {
        const rating = ratings[goal.goalId]
        const managerRating = managerRatings[goal.goalId]
        
        if (!rating && !managerRating) return null
        
        return (
          <div key={goal.goalId} className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {goal.description.split('\n')[0]}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Self Rating */}
                <div className="bg-[#1E293B] rounded-lg p-4 border border-gray-800">
                  <h4 className="text-lg font-medium text-white mb-3">Your Rating</h4>
                  {rating ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-3xl font-bold text-white">{rating.employeeRating}</div>
                        <div className="text-gray-400">/ 5</div>
                      </div>
                      <div className="text-sm text-gray-400 mb-4">
                        {ratingOptions.find(opt => opt.value === rating.employeeRating)?.description}
                      </div>
                      <div className="text-sm text-white">
                        {rating.feedback}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">You haven't rated this goal yet.</div>
                  )}
                </div>
                
                {/* Manager Rating */}
                <div className="bg-[#1E293B] rounded-lg p-4 border border-gray-800">
                  <h4 className="text-lg font-medium text-white mb-3">Manager's Rating</h4>
                  {managerRating ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-3xl font-bold text-white">{managerRating.managerRating}</div>
                        <div className="text-gray-400">/ 5</div>
                      </div>
                      <div className="text-sm text-gray-400 mb-4">
                        {ratingOptions.find(opt => opt.value === managerRating.managerRating)?.description}
                      </div>
                      <div className="text-sm text-white">
                        {managerRating.feedback}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">Manager hasn't rated this goal yet.</div>
                  )}
                </div>
              </div>
              
              {/* Rating difference visualization */}
              {rating && managerRating && (
                <div className="mt-6 p-4 bg-[#1E293B] rounded-lg border border-gray-800">
                  <h4 className="text-lg font-medium text-white mb-3">Rating Comparison</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Your Rating</span>
                        <span className="text-sm font-medium text-white">{rating.employeeRating}/5</span>
                      </div>
                      <div className="h-2 bg-[#151524] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#6c47ff]"
                          style={{ width: `${(rating.employeeRating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Manager's Rating</span>
                        <span className="text-sm font-medium text-white">{managerRating.managerRating || 0}/5</span>
                      </div>
                      <div className="h-2 bg-[#151524] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${((managerRating.managerRating || 0) / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-400">
                    {rating.employeeRating > (managerRating.managerRating || 0)
                      ? "You rated yourself higher than your manager."
                      : rating.employeeRating < (managerRating.managerRating || 0)
                        ? "Your manager rated you higher than your self-rating."
                        : "Your self-rating matches your manager's rating."}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  // Drafts view component
  const DraftsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Saved Drafts</h3>
        <button
          onClick={() => setShowDrafts(false)}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {Object.keys(drafts).length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No saved drafts
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(drafts).map(([goalId, draft]) => {
            const goal = goals.find(g => g.goalId === goalId)
            if (!goal) return null
            
            return (
              <div key={goalId} className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {goal.description.split('\n')[0]}
                  </h3>
                  <div className="flex items-center gap-2 text-yellow-400 mb-4">
                    <Save className="w-4 h-4" />
                    <span>Draft saved</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#6c47ff]" />
                      <span className="text-white">Rating: {draft.rating}/5</span>
                    </div>
                    <div className="text-gray-400">
                      {draft.feedback.length > 100 
                        ? `${draft.feedback.substring(0, 100)}...` 
                        : draft.feedback}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setDrafts(prev => {
                          const newDrafts = { ...prev }
                          delete newDrafts[goalId]
                          return newDrafts
                        })
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-[#1E293B] rounded-lg hover:bg-[#2d3748] transition-colors"
                    >
                      Delete Draft
                    </button>
                    <button
                      onClick={() => loadDraft(goalId)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Continue Draft
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#6c47ff]/20 border-t-[#6c47ff] rounded-full animate-spin" />
          <p className="text-gray-400">Loading goals and ratings...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (goals.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1E293B] mb-6">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No goals available</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            There are no goals assigned to you at this time. Check back later or contact your manager.
          </p>
        </div>
      </div>
    )
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
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {selectedGoal.description.split('\n')[0]}
                </h3>
                <p className="text-gray-400 text-lg mb-6">
                  {selectedGoal.description.split('\n').slice(1).join('\n')}
                </p>
                
                {/* Goal progress indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-white">{selectedGoal.progress || 0}%</span>
                  </div>
                  <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", getProgressColor(selectedGoal.progress || 0))}
                      style={{ width: `${selectedGoal.progress || 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Due {selectedGoal.dueDate ? selectedGoal.dueDate.toLocaleDateString() : 'Not set'}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedGoal.status)} flex items-center gap-1`}>
                    {getStatusIcon(selectedGoal.status)}
                    {selectedGoal.status}
                  </span>
                  {selectedGoal.category && (
                    <span className="px-3 py-1 text-sm rounded-full bg-[#1E293B] text-white">
                      {selectedGoal.category}
                    </span>
                  )}
                  {selectedGoal.priority && (
                    <span className={cn(
                      "px-3 py-1 text-sm rounded-full",
                      selectedGoal.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                      selectedGoal.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-green-500/10 text-green-400'
                    )}>
                      {selectedGoal.priority.charAt(0).toUpperCase() + selectedGoal.priority.slice(1)} Priority
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Form */}
          <div className="p-8 space-y-6">
            <RatingScale />
            
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
                  setFormData({ rating: 0, feedback: '', isDraft: false })
                }}
                className="px-6 py-3 text-base font-medium text-gray-400 hover:text-white bg-[#1E293B] rounded-lg hover:bg-[#2d3748] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting || formData.rating === 0}
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#1E293B] rounded-lg hover:bg-[#2d3748] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || formData.rating === 0}
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
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
      <Header />
      <ProgressTracker />
      <Filters />
      
      {showDrafts ? (
        <DraftsView />
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 gap-6">
          {sortedGoals.map(goal => (
            <GoalCard key={`goal-${goal.goalId}`} goal={goal} />
          ))}
        </div>
      ) : (
        <ComparisonView />
      )}
    </div>
  )
}