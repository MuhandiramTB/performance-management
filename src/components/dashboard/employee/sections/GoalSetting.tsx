'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  Target, 
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
  Plus
} from 'lucide-react'
import { Goal, GoalStatus } from '@/models/performance'

interface GoalFormData {
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
}

// Sample data for demonstration
const sampleGoals: Goal[] = [
  {
    goalId: '1',
    employeeId: '101',
    description: "Improve Team Productivity\nIncrease team output by 25% through process optimization and better resource allocation",
    status: GoalStatus.PENDING,
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
    status: GoalStatus.REJECTED,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  }
]

export function GoalSetting() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<GoalFormData>({
    description: '',
    dueDate: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize goals with sample data
  const [goals, setGoals] = useState<Goal[]>(sampleGoals)

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400'
      case 'low':
        return 'bg-green-500/10 text-green-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description.trim() || !formData.dueDate) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create new goal
      const newGoal: Goal = {
        goalId: Date.now().toString(),
        employeeId: '101', // This would come from the authenticated user
        description: formData.description,
        status: GoalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Update goals
      setGoals(prev => [...prev, newGoal])
      setShowForm(false)
      setFormData({ description: '', dueDate: '', priority: 'medium' })
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

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
              <Target className="w-5 h-5 text-[#6c47ff]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Set New Goal</h1>
              <p className="text-gray-400 mt-1">Define your performance goal</p>
            </div>
          </div>
        </div>

        <div className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <MessageSquare className="w-4 h-4" />
                Goal Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal and its objectives..."
                className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] min-h-[200px] text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-lg"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                  <BarChart3 className="w-4 h-4" />
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] text-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 text-base font-medium text-gray-400 hover:text-white bg-[#1E293B] rounded-lg hover:bg-[#2d3748] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.description.trim() || !formData.dueDate}
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
                    Submit Goal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <Target className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Goal Setting</h1>
            <p className="text-gray-400 mt-1">Define and manage your performance goals</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3dd8] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
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
            className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200"
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