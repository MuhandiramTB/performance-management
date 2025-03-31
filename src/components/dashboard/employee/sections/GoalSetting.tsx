'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Calendar, Target, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
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

  const handleDeleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const handleEditGoal = (goalId: number) => {
    // Implement edit functionality
    console.log('Edit goal:', goalId)
  }

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    setGoals([...goals, { ...newGoal, id: goals.length + 1 }])
    setIsNewGoalModalOpen(false)
  }

  const handleUpdateProgress = (goalId: number, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress, status: progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started' }
        : goal
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Performance Goals</h1>
          <p className="text-gray-400 mt-1">Set and track your performance objectives</p>
        </div>
        <button
          onClick={() => setIsNewGoalModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-all duration-200 hover:shadow-lg hover:shadow-[#6c47ff]/20"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-500/20">
              <Target className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Total Goals</h3>
              <p className="text-3xl font-semibold text-white mt-1">{goals.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-yellow-500/30 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/20">
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

        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-green-500/30 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/20">
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

        <div className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-red-500/30 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/20">
              <AlertCircle className="w-6 h-6 text-red-400" />
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
      <div className="bg-[#151524] rounded-xl p-6 border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Current Goals</h2>
            {goals.length === 0 && (
              <button
                onClick={() => {
                  // Simulate fetching goals
                  console.log('Fetching all goals...')
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6c47ff] bg-[#6c47ff]/10 rounded-lg hover:bg-[#6c47ff]/20 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                View All
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Due Date</span>
          </div>
        </div>
        
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#6c47ff]/10 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-[#6c47ff]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Goals Found</h3>
            <p className="text-gray-400 mb-6">You haven't set any performance goals yet.</p>
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-all duration-200 hover:shadow-lg hover:shadow-[#6c47ff]/20"
            >
              <Plus className="w-5 h-5" />
              Create New Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="p-6 bg-[#1E293B] rounded-lg border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{goal.title}</h3>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{goal.description}</p>
                    
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
                            goal.status === 'Overdue' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{goal.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                      title="Edit Goal"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isNewGoalModalOpen && (
        <NewGoalModal
          onClose={() => setIsNewGoalModalOpen(false)}
          onSubmit={handleAddGoal}
        />
      )}
    </div>
  )
}