'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { NewGoalModal } from '../modals/NewGoalModal'

interface Goal {
  id: number
  title: string
  description: string
  dueDate: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue'
}

export function GoalSetting() {
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: 'Improve Code Quality',
      description: 'Implement better testing practices and increase code coverage to 80%',
      dueDate: 'Due in 5 days',
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Complete Project Documentation',
      description: 'Update all technical documentation and create user guides',
      dueDate: 'Due in 2 days',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Team Training Session',
      description: 'Conduct training session on new development tools',
      dueDate: 'Due yesterday',
      status: 'Overdue'
    }
  ])

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Set New Goal</h1>
        <button
          onClick={() => setIsNewGoalModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      <div className="bg-[#151524] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Current Goals</h2>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 bg-[#1E293B] rounded-lg border border-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-white">{goal.title}</h3>
                  <p className="text-sm text-gray-400">{goal.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">{goal.dueDate}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 bg-[#1E293B] rounded-lg border border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gray-500/20">
              <div className="w-6 h-6 text-gray-400">⏳</div>
            </div>
            <h3 className="text-lg font-medium text-white">Not Started</h3>
            <p className="text-3xl font-semibold text-white mt-2">
              {goals.filter(g => g.status === 'Not Started').length}
            </p>
          </div>

          <div className="p-4 bg-[#1E293B] rounded-lg border border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-yellow-500/20">
              <div className="w-6 h-6 text-yellow-400">🔄</div>
            </div>
            <h3 className="text-lg font-medium text-white">In Progress</h3>
            <p className="text-3xl font-semibold text-white mt-2">
              {goals.filter(g => g.status === 'In Progress').length}
            </p>
          </div>

          <div className="p-4 bg-[#1E293B] rounded-lg border border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-green-500/20">
              <div className="w-6 h-6 text-green-400">✅</div>
            </div>
            <h3 className="text-lg font-medium text-white">Completed</h3>
            <p className="text-3xl font-semibold text-white mt-2">
              {goals.filter(g => g.status === 'Completed').length}
            </p>
          </div>

          <div className="p-4 bg-[#1E293B] rounded-lg border border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-red-500/20">
              <div className="w-6 h-6 text-red-400">⚠️</div>
            </div>
            <h3 className="text-lg font-medium text-white">Overdue</h3>
            <p className="text-3xl font-semibold text-white mt-2">
              {goals.filter(g => g.status === 'Overdue').length}
            </p>
          </div>
        </div>
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