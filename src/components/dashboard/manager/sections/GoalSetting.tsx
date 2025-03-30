'use client'

import { useState } from 'react'
import { Plus, Calendar, Target, Clock, Users, ChevronDown, Edit2, Trash2 } from 'lucide-react'

interface Goal {
  id: number
  title: string
  description: string
  assignee: string
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Not Started' | 'In Progress' | 'Completed'
  progress: number
}

export function GoalSetting() {
  const [showActions, setShowActions] = useState<number | null>(null)

  const goals: Goal[] = [
    {
      id: 1,
      title: 'Improve Code Quality',
      description: 'Implement better testing practices and increase code coverage to 80%',
      assignee: 'John Doe',
      dueDate: '2024-04-15',
      priority: 'High',
      status: 'In Progress',
      progress: 65
    },
    {
      id: 2,
      title: 'Launch New Feature',
      description: 'Complete development and testing of the new authentication system',
      assignee: 'Jane Smith',
      dueDate: '2024-04-30',
      priority: 'Medium',
      status: 'Not Started',
      progress: 0
    }
  ]

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400'
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'Low':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-500/20 text-gray-400'
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400'
      case 'Completed':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Goal Setting</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors">
          <Plus className="w-4 h-4" />
          Create Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-[#151524] rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white">{goal.title}</h3>
                  <p className="text-sm text-gray-400">{goal.description}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowActions(showActions === goal.id ? null : goal.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  {showActions === goal.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] rounded-lg shadow-lg py-1 z-10">
                      <button className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 flex items-center gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit Goal
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Goal
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6c47ff] rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Assignee:</span>
                    <span className="text-white">{goal.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Due:</span>
                    <span className="text-white">{goal.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(goal.priority)}`}>
                      {goal.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 