'use client'

import { useState } from 'react'
import { 
  Target, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  MessageSquare,
  ChevronDown
} from 'lucide-react'
import { Goal, GoalStatus, User } from '@/models/performance'

interface Comment {
  id: string
  text: string
  createdAt: Date
  userId: string
  userName: string
}

export function GoalApprovals() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [newComment, setNewComment] = useState('')

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

  const handleApprove = async (goalId: string) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGoals(goals.map(goal => 
        goal.goalId === goalId 
          ? { ...goal, status: GoalStatus.APPROVED, updatedAt: new Date() }
          : goal
      ))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (goalId: string) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGoals(goals.map(goal => 
        goal.goalId === goalId 
          ? { ...goal, status: GoalStatus.REJECTED, updatedAt: new Date() }
          : goal
      ))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async (goalId: string) => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        createdAt: new Date(),
        userId: 'current-manager-id', // Replace with actual manager ID
        userName: 'Manager Name' // Replace with actual manager name
      }

      setComments(prev => ({
        ...prev,
        [goalId]: [...(prev[goalId] || []), comment]
      }))
      setNewComment('')
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
            <h1 className="text-2xl font-semibold text-white">Goal Approvals</h1>
            <p className="text-gray-400 mt-1">Review and approve employee goals</p>
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
        </div>
      </div>

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
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(goal.status)}
                  {goal.status === GoalStatus.PENDING && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(goal.goalId)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(goal.goalId)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-400">Comments</h4>
                </div>
                <div className="space-y-3">
                  {comments[goal.goalId]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                  />
                  <button
                    onClick={() => handleAddComment(goal.goalId)}
                    disabled={isSubmitting || !newComment.trim()}
                    className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ad9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}