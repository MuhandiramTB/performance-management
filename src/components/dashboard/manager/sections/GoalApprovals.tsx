'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Search, 
  MessageSquare,
  ThumbsUp,
  Edit2,
  Send,
  Filter,
  Calendar,
  User,
  Target,
  BarChart3
} from 'lucide-react'

interface Goal {
  id: number
  title: string
  description: string
  submittedBy: {
    name: string
    avatar: string
    role: string
  }
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision'
  priority: 'high' | 'medium' | 'low'
  progress: number
  dueDate: string
  comments: Comment[]
}

interface Comment {
  id: number
  text: string
  author: string
  timestamp: string
}

export function GoalApprovals() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'needs_revision':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
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

  const handleApprove = async (goalId: number) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'approved' }
          : goal
      ))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestRevision = async (goalId: number) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'needs_revision' }
          : goal
      ))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async (goalId: number) => {
    if (!commentText.trim()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newComment: Comment = {
        id: Date.now(),
        text: commentText,
        author: 'Manager',
        timestamp: new Date().toISOString()
      }
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, comments: [...goal.comments, newComment] }
          : goal
      ))
      setCommentText('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || goal.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
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
            <p className="text-gray-400 mt-1">Review and approve employee performance goals</p>
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
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="needs_revision">Needs Revision</option>
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid gap-4">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="bg-[#151524] rounded-lg border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={goal.submittedBy.avatar}
                      alt={goal.submittedBy.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{goal.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <User className="w-4 h-4" />
                        {goal.submittedBy.name} • {goal.submittedBy.role}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        Due {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(goal.status)}
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedGoal === goal.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedGoal === goal.id && (
              <div className="px-4 pb-4 border-t border-gray-800/50">
                <div className="space-y-4">
                  {/* Progress Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-medium">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          goal.status === 'approved' ? 'bg-green-500' :
                          goal.status === 'needs_revision' ? 'bg-yellow-500' :
                          goal.status === 'rejected' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>Comments</span>
                    </div>
                    <div className="space-y-2">
                      {goal.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-[#1E293B] rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white font-medium">{comment.author}</span>
                            <span className="text-gray-400">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-400 mt-1">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                      />
                      <button
                        onClick={() => handleAddComment(goal.id)}
                        disabled={isSubmitting || !commentText.trim()}
                        className="p-2 text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {goal.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleApprove(goal.id)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestRevision(goal.id)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 className="w-4 h-4" />
                        Request Revision
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
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