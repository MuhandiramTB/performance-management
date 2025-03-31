'use client'

import { useState } from 'react'
import { Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react'
import Image from 'next/image'

interface Goal {
  id: number
  employeeName: string
  title: string
  description: string
  submittedAt: string
  status: 'Pending Review' | 'Approved' | 'Needs Revision'
}

export function GoalApproval() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [feedback, setFeedback] = useState('')
  const [stats, setStats] = useState<Array<{
    title: string
    value: number
    icon: React.ElementType
    color: string
    textColor: string
    iconColor: string
  }>>([])

  const handleApproveGoal = (goalId: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, status: 'Approved' } : goal
    ))
  }

  const handleRequestRevision = (goalId: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, status: 'Needs Revision' } : goal
    ))
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="p-6 bg-[#151524] rounded-lg border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
                  <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Goals for Review */}
      <div className="bg-[#151524] rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Goals for Review</h2>
          <div className="space-y-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="p-6 bg-[#1E293B] rounded-lg border border-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center">
                      <span className="text-white font-medium">
                        {goal.employeeName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{goal.employeeName}</h3>
                        <p className="text-sm text-gray-400">Submitted {goal.submittedAt}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        goal.status === 'Pending Review' ? 'bg-yellow-500/20 text-yellow-400' :
                        goal.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-white mt-4">{goal.title}</h4>
                    <p className="text-gray-400 mt-2">{goal.description}</p>
                    
                    <div className="mt-6">
                      <textarea
                        placeholder="Add your feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0A0A14] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                        rows={4}
                      />
                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          onClick={() => handleRequestRevision(goal.id)}
                          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Request Revision
                        </button>
                        <button
                          onClick={() => handleApproveGoal(goal.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
                        >
                          Approve Goal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 