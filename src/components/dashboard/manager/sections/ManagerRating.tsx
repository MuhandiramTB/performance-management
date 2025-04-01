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
  User,
  Target,
  Search,
  Filter
} from 'lucide-react'

interface Employee {
  id: number
  name: string
  avatar: string
  role: string
  department: string
}

interface Goal {
  id: number
  title: string
  description: string
  status: 'In Progress' | 'Completed' | 'Overdue'
  dueDate: string
  progress: number
  category: string
  employee: Employee
  selfRating?: number
  selfComments?: string
  managerRating?: number
  managerComments?: string
  submittedAt: string
}

export function ManagerRating() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [comments, setComments] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize goals as empty array
  const [goals, setGoals] = useState<Goal[]>([])

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
    const rating = ratings[goalId]
    const comment = comments[goalId]
    if (!rating) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, managerRating: rating, managerComments: comment }
          : goal
      ))
      setSelectedGoal(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    const matchesEmployee = !selectedEmployee || goal.employee.id === selectedEmployee

    return matchesSearch && matchesStatus && matchesEmployee
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
              <h1 className="text-2xl font-semibold text-white">Performance Assessment</h1>
              <p className="text-gray-400 mt-1">Evaluate employee performance for this goal</p>
            </div>
          </div>
        </div>

        <div className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50">
          {/* Goal Details */}
          <div className="p-8 border-b border-gray-800/50">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedGoal.employee.avatar}
                    alt={selectedGoal.employee.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedGoal.employee.name}</h2>
                    <p className="text-gray-400">{selectedGoal.employee.role} • {selectedGoal.employee.department}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{selectedGoal.title}</h3>
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

            {/* Self Assessment */}
            {selectedGoal.selfRating && (
              <div className="mt-6 p-4 bg-[#1E293B] rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Self Assessment</h4>
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                  <span className="text-white">Rating: {selectedGoal.selfRating}/5</span>
                </div>
                <p className="text-gray-400 text-sm">{selectedGoal.selfComments}</p>
              </div>
            )}
          </div>

          {/* Rating Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <BarChart3 className="w-4 h-4" />
                Manager Rating
              </label>
              <div className="relative max-w-md">
                <select
                  value={ratings[selectedGoal.id] || ''}
                  onChange={(e) => setRatings({
                    ...ratings,
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
              {ratings[selectedGoal.id] && (
                <p className="mt-2 text-sm text-gray-400">
                  {ratingOptions.find(opt => opt.value === ratings[selectedGoal.id])?.description}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <MessageSquare className="w-4 h-4" />
                Manager Comments
              </label>
              <textarea
                value={comments[selectedGoal.id] || ''}
                onChange={(e) => setComments({
                  ...comments,
                  [selectedGoal.id]: e.target.value
                })}
                placeholder="Provide detailed feedback on employee performance..."
                className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] min-h-[200px] text-lg"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => handleSubmitRating(selectedGoal.id)}
                disabled={isSubmitting || !ratings[selectedGoal.id]}
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
            <h1 className="text-2xl font-semibold text-white">Manager Rating</h1>
            <p className="text-gray-400 mt-1">Evaluate employee performance against their goals</p>
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
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
          <select
            value={selectedEmployee || ''}
            onChange={(e) => setSelectedEmployee(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          >
            <option value="">All Employees</option>
            {[...new Set(goals.map(goal => goal.employee.id))].map(id => {
              const employee = goals.find(g => g.employee.id === id)?.employee
              return employee ? (
                <option key={id} value={id}>{employee.name}</option>
              ) : null
            })}
          </select>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid gap-6">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedGoal(goal)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={goal.employee.avatar}
                    alt={goal.employee.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">{goal.title}</h2>
                    <p className="text-gray-400 text-sm mb-2">{goal.employee.name} • {goal.employee.role}</p>
                    <p className="text-gray-400 line-clamp-2">{goal.description}</p>
                  </div>
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

                {/* Self Rating */}
                {goal.selfRating && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">Self Rating: {goal.selfRating}/5</span>
                  </div>
                )}

                {/* Manager Rating */}
                {goal.managerRating && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white">Manager Rating: {goal.managerRating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGoals.length === 0 && (
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