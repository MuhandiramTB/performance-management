'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, Calendar, Target, CheckCircle2, AlertTriangle, RefreshCw, ArrowLeft, Search, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { NewGoalModal } from '../modals/NewGoalModal'

interface Goal {
  id: number
  title: string
  description: string
  dueDate: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue'
  progress: number
}

export function GoalSetting() {
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Goal['status'] | 'all'>('all')
  const router = useRouter()

  useEffect(() => {
    fetchGoals()
  }, [])

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      if (!response.ok) throw new Error('Failed to fetch goals')
      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals:', error)
      setError('Failed to load goals')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGoal = async (goalId: number) => {
    try {
      const response = await fetch(`/api/goals?id=${goalId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete goal')
      
      setGoals(goals.filter(goal => goal.id !== goalId))
    } catch (error) {
      console.error('Error deleting goal:', error)
      setError('Failed to delete goal')
    }
  }

  const handleEditGoal = async (goalId: number, updatedData: Partial<Goal>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: goalId, ...updatedData })
      })
      if (!response.ok) throw new Error('Failed to update goal')
      
      const updatedGoal = await response.json()
      setGoals(goals.map(goal => 
        goal.id === goalId ? updatedGoal : goal
      ))
    } catch (error) {
      console.error('Error updating goal:', error)
      setError('Failed to update goal')
    }
  }

  const handleAddGoal = async (newGoal: Omit<Goal, 'id'>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      })
      if (!response.ok) throw new Error('Failed to create goal')
      
      const createdGoal = await response.json()
      setGoals([...goals, createdGoal])
      setIsNewGoalModalOpen(false)
    } catch (error) {
      console.error('Error creating goal:', error)
      setError('Failed to create goal')
    }
  }

  const handleUpdateProgress = async (goalId: number, progress: number) => {
    const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'
    await handleEditGoal(goalId, { progress, status })
  }

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-500/20 text-gray-400'
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400">Loading your goals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchGoals}
            className="mt-4 px-4 py-2 text-sm text-white bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/employee')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white">Performance Goals</h1>
            <p className="text-gray-400 mt-1">Set and track your performance objectives</p>
          </div>
        </div>
        <button
          onClick={() => setIsNewGoalModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#6c47ff] rounded-xl hover:bg-[#5a3dd8] transition-all duration-200 hover:shadow-lg hover:shadow-[#6c47ff]/20"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a2e] border border-gray-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Goal['status'] | 'all')}
            className="px-4 py-2.5 bg-[#1a1a2e] border border-gray-800/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-500/20 group-hover:bg-[#6c47ff]/20 transition-colors">
              <Target className="w-6 h-6 text-gray-400 group-hover:text-[#6c47ff]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Total Goals</h3>
              <p className="text-3xl font-semibold text-white mt-1">{goals.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-yellow-500/30 transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors">
              <div className="w-6 h-6 text-yellow-400">🔄</div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">In Progress</h3>
              <p className="text-3xl font-semibold text-white mt-1">
                {goals.filter(g => g.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-green-500/30 transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Completed</h3>
              <p className="text-3xl font-semibold text-white mt-1">
                {goals.filter(g => g.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-red-500/30 transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Overdue</h3>
              <p className="text-3xl font-semibold text-white mt-1">
                {goals.filter(g => g.status === 'Overdue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map(goal => (
          <div
            key={goal.id}
            className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-white group-hover:text-[#6c47ff] transition-colors">
                    {goal.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>
                <p className="text-gray-400 mt-2">{goal.description}</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditGoal(goal.id, {})}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-white">{goal.progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6c47ff] transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleUpdateProgress(goal.id, Math.max(0, goal.progress - 10))}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  -10%
                </button>
                <button
                  onClick={() => handleUpdateProgress(goal.id, Math.min(100, goal.progress + 10))}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  +10%
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Goal Modal */}
      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        onSubmit={handleAddGoal}
      />
    </div>
  )
}