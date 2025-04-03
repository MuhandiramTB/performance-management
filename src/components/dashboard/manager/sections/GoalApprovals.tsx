'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  Target, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  MessageSquare,
  ChevronDown,
  Bell,
  X,
  Check,
  FileText,
  Users,
  History,
  MoreVertical,
  Eye,
  Download,
  Settings,
  Minus
} from 'lucide-react'
import { Goal, GoalStatus, User } from '@/models/performance'

interface Comment {
  id: string
  text: string
  createdAt: Date
  userId: string
  userName: string
  replies?: Comment[]
}

interface Notification {
  id: string
  type: 'new_goal' | 'comment' | 'approval' | 'rejection'
  message: string
  createdAt: Date
  isRead: boolean
  goalId?: string
}

interface ApprovalHistory {
  id: string
  goalId: string
  action: 'approve' | 'reject'
  comment?: string
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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject'>('approve')
  const [bulkComment, setBulkComment] = useState('')
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [view, setView] = useState<'list' | 'comparison' | 'history'>('list')
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([])
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'metrics'>('side-by-side')

  // Fetch notifications
  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'new_goal',
        message: 'New goal submitted by John Doe',
        createdAt: new Date(),
        isRead: false,
        goalId: '1'
      },
      {
        id: '2',
        type: 'comment',
        message: 'Jane Smith commented on your goal',
        createdAt: new Date(),
        isRead: false,
        goalId: '2'
      }
    ]
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
  }, [])

  // Fetch approval history
  useEffect(() => {
    // Simulate fetching approval history
    const mockHistory: ApprovalHistory[] = [
      {
        id: '1',
        goalId: '1',
        action: 'approve',
        comment: 'Great progress!',
        createdAt: new Date(),
        userId: '1',
        userName: 'Manager Name'
      }
    ]
    setApprovalHistory(mockHistory)
  }, [])

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

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGoals(goals.map(goal => 
        selectedGoals.includes(goal.goalId)
          ? { 
              ...goal, 
              status: action === 'approve' ? GoalStatus.APPROVED : GoalStatus.REJECTED,
              updatedAt: new Date()
            }
          : goal
      ))

      // Add to approval history
      const newHistory: ApprovalHistory = {
        id: Date.now().toString(),
        goalId: selectedGoals[0], // Using first goal ID for simplicity
        action,
        comment: bulkComment,
        createdAt: new Date(),
        userId: 'current-manager-id',
        userName: 'Manager Name'
      }
      setApprovalHistory(prev => [...prev, newHistory])

      // Clear selections
      setSelectedGoals([])
      setBulkComment('')
      setShowBulkActions(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleAddComment = async (goalId: string, parentId?: string) => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        createdAt: new Date(),
        userId: 'current-manager-id',
        userName: 'Manager Name'
      }

      if (parentId) {
        // Add as reply
        setComments(prev => ({
          ...prev,
          [goalId]: prev[goalId].map(c => 
            c.id === parentId
              ? { ...c, replies: [...(c.replies || []), comment] }
              : c
          )
        }))
      } else {
        // Add as new comment
        setComments(prev => ({
          ...prev,
          [goalId]: [...(prev[goalId] || []), comment]
        }))
      }

      // Add notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'comment',
        message: `New comment on goal ${goalId}`,
        createdAt: new Date(),
        isRead: false,
        goalId
      }
      setNotifications(prev => [...prev, newNotification])
      setUnreadCount(prev => prev + 1)

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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-none flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-[#151524] border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <Target className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Goal Approvals</h1>
            <p className="text-gray-400 mt-1">Review and approve employee goals</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'list'
                  ? 'bg-[#6c47ff] text-white'
                  : 'bg-[#1E293B] text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              List View
            </button>
            <button
              onClick={() => setView('comparison')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'comparison'
                  ? 'bg-[#6c47ff] text-white'
                  : 'bg-[#1E293B] text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              Comparison
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'history'
                  ? 'bg-[#6c47ff] text-white'
                  : 'bg-[#1E293B] text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-5 h-5" />
              History
            </button>
          </div>
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            className="relative p-2 text-gray-400 hover:text-white"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotificationPanel && (
        <div className="bg-[#151524] border-b border-gray-800/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#6c47ff]" />
              <h3 className="text-lg font-medium text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUnreadCount(0)
                  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
                }}
                className="text-gray-400 hover:text-white text-sm"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setShowNotificationPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead 
                      ? 'bg-[#1E293B] border-gray-800/50' 
                      : 'bg-[#6c47ff]/10 border-[#6c47ff]/30'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.isRead 
                          ? 'bg-[#1E293B]' 
                          : 'bg-[#6c47ff]/20'
                      }`}>
                        {notification.type === 'new_goal' && <Target className="w-4 h-4 text-[#6c47ff]" />}
                        {notification.type === 'comment' && <MessageSquare className="w-4 h-4 text-[#6c47ff]" />}
                        {notification.type === 'approval' && <CheckCircle className="w-4 h-4 text-[#6c47ff]" />}
                        {notification.type === 'rejection' && <AlertTriangle className="w-4 h-4 text-[#6c47ff]" />}
                      </div>
                      <p className="text-sm text-white">{notification.message}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                      {!notification.isRead && (
                        <button
                          onClick={() => {
                            setNotifications(prev => 
                              prev.map(n => 
                                n.id === notification.id ? { ...n, isRead: true } : n
                              )
                            )
                            setUnreadCount(prev => Math.max(0, prev - 1))
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] w-full"
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

          {/* Enhanced Bulk Actions */}
          {selectedGoals.length > 0 && (
            <div className="bg-[#1E293B] rounded-lg p-4 mb-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{selectedGoals.length} goals selected</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value as 'approve' | 'reject')}
                      className="px-3 py-2 bg-[#151524] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                    >
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                    </select>
                    <button
                      onClick={() => handleBulkAction(bulkAction)}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bulkAction === 'approve' ? 'Approve All' : 'Reject All'}
                    </button>
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={bulkComment}
                    onChange={(e) => setBulkComment(e.target.value)}
                    placeholder="Add a comment for all selected goals..."
                    className="w-full px-3 py-2 bg-[#151524] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {view === 'list' && (
              <div className="grid gap-4">
                {filteredGoals.map((goal) => (
                  <div
                    key={goal.goalId}
                    className="bg-[#151524] rounded-lg border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200"
                  >
                    <div className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedGoals.includes(goal.goalId)}
                                onChange={() => toggleGoalSelection(goal.goalId)}
                                className="rounded border-gray-600 text-[#6c47ff] focus:ring-[#6c47ff]"
                              />
                              <h3 className="text-lg font-medium text-white">
                                {goal.description.split('\n')[0]}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {goal.description.split('\n').slice(1).join('\n')}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-sm text-gray-400">
                                <Calendar className="w-4 h-4" />
                                Due {format(new Date(goal.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {getStatusIcon(goal.status)}
                            {goal.status === GoalStatus.PENDING && (
                              <>
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
                              </>
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
                              <div key={comment.id} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-white">{comment.userName}</span>
                                  <span className="text-xs text-gray-500">
                                    {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400">{comment.text}</p>
                                {comment.replies?.map((reply) => (
                                  <div key={reply.id} className="ml-4 mt-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-white">{reply.userName}</span>
                                      <span className="text-xs text-gray-500">
                                        {format(new Date(reply.createdAt), 'MMM dd, yyyy HH:mm')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{reply.text}</p>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleAddComment(goal.goalId, comment.id)}
                                  className="text-xs text-gray-400 hover:text-white mt-1"
                                >
                                  Reply
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-col gap-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                            />
                            <button
                              onClick={() => handleAddComment(goal.goalId)}
                              disabled={isSubmitting || !newComment.trim()}
                              className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ad9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'comparison' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4">
                  <button
                    onClick={() => setComparisonMode('side-by-side')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      comparisonMode === 'side-by-side'
                        ? 'bg-[#6c47ff] text-white'
                        : 'bg-[#1E293B] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                    Side by Side
                  </button>
                  <button
                    onClick={() => setComparisonMode('metrics')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      comparisonMode === 'metrics'
                        ? 'bg-[#6c47ff] text-white'
                        : 'bg-[#1E293B] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    Metrics Comparison
                  </button>
                </div>

                {comparisonMode === 'side-by-side' ? (
                  <div className="grid gap-4">
                    {filteredGoals.map((goal) => (
                      <div
                        key={goal.goalId}
                        className="bg-[#151524] rounded-lg border border-gray-800/50 p-4"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-white">{goal.employeeName}</h3>
                            {getStatusIcon(goal.status)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                Due {format(new Date(goal.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{goal.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#151524] rounded-lg border border-gray-800/50 p-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400">Progress</h4>
                        {filteredGoals.map((goal) => (
                          <div key={goal.goalId} className="flex flex-col gap-2">
                            <span className="text-sm text-white">{goal.employeeName}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-[#1E293B] rounded-full">
                                <div
                                  className="h-full bg-[#6c47ff] rounded-full"
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-400">{goal.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400">Status</h4>
                        {filteredGoals.map((goal) => (
                          <div key={goal.goalId} className="flex flex-col gap-2">
                            <span className="text-sm text-white">{goal.employeeName}</span>
                            <span className={`text-sm ${
                              goal.status === GoalStatus.APPROVED
                                ? 'text-green-500'
                                : goal.status === GoalStatus.REJECTED
                                ? 'text-red-500'
                                : 'text-blue-500'
                            }`}>
                              {goal.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400">Timeline</h4>
                        {filteredGoals.map((goal) => (
                          <div key={goal.goalId} className="flex flex-col gap-2">
                            <span className="text-sm text-white">{goal.employeeName}</span>
                            <span className="text-sm text-gray-400">
                              {format(new Date(goal.createdAt), 'MMM dd')} - {format(new Date(goal.dueDate), 'MMM dd')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === 'history' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      selectedStatus === 'all'
                        ? 'bg-[#6c47ff] text-white'
                        : 'bg-[#1E293B] text-gray-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedStatus(GoalStatus.APPROVED)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      selectedStatus === GoalStatus.APPROVED
                        ? 'bg-[#6c47ff] text-white'
                        : 'bg-[#1E293B] text-gray-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approvals
                  </button>
                  <button
                    onClick={() => setSelectedStatus(GoalStatus.REJECTED)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      selectedStatus === GoalStatus.REJECTED
                        ? 'bg-[#6c47ff] text-white'
                        : 'bg-[#1E293B] text-gray-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Rejections
                  </button>
                </div>

                <div className="space-y-4">
                  {approvalHistory
                    .filter(entry => selectedStatus === 'all' || 
                      (selectedStatus === GoalStatus.APPROVED && entry.action === 'approve') ||
                      (selectedStatus === GoalStatus.REJECTED && entry.action === 'reject'))
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-[#151524] rounded-lg border border-gray-800/50 p-4"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {entry.action === 'approve' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="text-white">{entry.userName}</span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
                          </span>
                          {entry.comment && (
                            <p className="text-sm text-gray-400 mt-2">{entry.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}