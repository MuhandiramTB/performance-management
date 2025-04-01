'use client'

import { useState } from 'react'
import { 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react'
import { Goal, GoalStatus } from '@/models/performance'

interface GoalFormData {
  title: string
  description: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

export function GoalSetting() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'low':
        return 'bg-green-500/10 text-green-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newGoal: Goal = {
        goalId: Date.now().toString(),
        employeeId: 'current-user-id', // Replace with actual user ID
        description: formData.description,
        status: GoalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      if (editingGoal) {
        setGoals(goals.map(goal => 
          goal.goalId === editingGoal.goalId ? newGoal : goal
        ))
      } else {
        setGoals([...goals, newGoal])
      }

      setShowGoalForm(false)
      setEditingGoal(null)
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.description.split('\n')[0] || '',
      description: goal.description,
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium'
    })
    setShowGoalForm(true)
  }

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGoals(goals.filter(goal => goal.goalId !== goalId))
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
            <Target className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Goal Setting</h1>
            <p className="text-gray-400 mt-1">Define and manage your performance goals</p>
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
          <button
            onClick={() => setShowGoalForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ad9] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </button>
        </div>
      </div>

      {/* Goal Form */}
      {showGoalForm && (
        <div className="bg-[#151524] rounded-lg border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <button
              onClick={() => {
                setShowGoalForm(false)
                setEditingGoal(null)
                setFormData({
                  title: '',
                  description: '',
                  dueDate: '',
                  priority: 'medium'
                })
              }}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                placeholder="Enter goal title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] h-32"
                placeholder="Enter goal description"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowGoalForm(false)
                  setEditingGoal(null)
                  setFormData({
                    title: '',
                    description: '',
                    dueDate: '',
                    priority: 'medium'
                  })
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ad9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : editingGoal ? 'Update Goal' : 'Create Goal'}
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor('medium')}`}>
                      Medium Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(goal.status)}
                  {goal.status === GoalStatus.PENDING && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.goalId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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