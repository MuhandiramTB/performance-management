'use client'

import { useState } from 'react'
import { Bell, User, Target, Star, MessageSquare, BarChart as BarChartIcon, LogOut, CheckCircle, Clock, Circle, Calendar, TrendingUp, X, Plus, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { GoalStatus } from '@/models/performance'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface Notification {
  id: number
  type: 'warning' | 'info' | 'success'
  message: string
  time: string
  read: boolean
}

interface Task {
  id: number
  title: string
  type: 'goal' | 'rating' | 'feedback'
  status: 'pending' | 'completed'
  dueDate: string
}

interface PerformancePhase {
  id: string
  name: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
  startDate: string
  endDate: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  type: 'goal' | 'rating' | 'feedback' | 'review'
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'completed' | 'overdue'
}

interface GoalProgress {
  id: string
  title: string
  progress: number
  target: number
  status: 'on-track' | 'behind' | 'completed'
  deadline: string
}

interface PerformanceMetric {
  date: string
  rating: number
  goalsCompleted: number
  feedbackReceived: number
}

function GoalProgressTracker({ goals }: { goals: GoalProgress[] }) {
  if (!goals || goals.length === 0) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Goal Progress</h3>
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">No goals found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Goal Progress</h3>
        <TrendingUp className="w-5 h-5 text-blue-400" />
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{goal.title}</span>
              <span className="text-sm text-gray-400">{goal.progress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  goal.status === 'on-track'
                    ? 'bg-green-500'
                    : goal.status === 'behind'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Target: {goal.target}%</span>
              <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationSystem({ notifications, onNotificationClick }: { 
  notifications: Notification[], 
  onNotificationClick: (id: number) => void 
}) {
  const [showAll, setShowAll] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">No notifications</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-gray-400 hover:text-white"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>
      <div className="space-y-3">
        {(showAll ? notifications : notifications.slice(0, 3)).map((notification) => (
          <div
            key={notification.id}
            onClick={() => onNotificationClick(notification.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              notification.read
                ? 'bg-gray-800/50 hover:bg-gray-800/70'
                : 'bg-blue-500/10 hover:bg-blue-500/20'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 mt-1 rounded-full ${
                notification.type === 'warning'
                  ? 'bg-yellow-500'
                  : notification.type === 'info'
                  ? 'bg-blue-500'
                  : 'bg-green-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-white">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
              {!notification.read && (
                <button className="p-1 hover:bg-gray-800/50 rounded-full">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickActionMenu({ actions }: { actions: QuickAction[] }) {
  const router = useRouter()

  const handleActionClick = (action: QuickAction) => {
    switch (action.type) {
      case 'goal':
        router.push('/dashboard/employee/goals')
        break
      case 'rating':
        router.push('/dashboard/employee/self-rating')
        break
      case 'feedback':
        router.push('/dashboard/employee/feedback')
        break
      case 'review':
        router.push('/dashboard/employee/review')
        break
    }
  }

  if (!actions || actions.length === 0) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <Plus className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">No actions available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <Plus className="w-5 h-5 text-blue-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`p-4 rounded-lg text-left transition-colors ${
              action.status === 'pending'
                ? 'bg-blue-500/10 hover:bg-blue-500/20'
                : action.status === 'completed'
                ? 'bg-green-500/10 hover:bg-green-500/20'
                : 'bg-red-500/10 hover:bg-red-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">{action.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{action.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                action.priority === 'high'
                  ? 'bg-red-500/20 text-red-400'
                  : action.priority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {action.priority}
              </span>
              <span className="text-xs text-gray-400">
                Due: {new Date(action.dueDate).toLocaleDateString()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function PerformanceMetrics({ data }: { data: PerformanceMetric[] }) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded-full text-xs ${
                timeRange === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-full text-xs ${
                timeRange === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1 rounded-full text-xs ${
                timeRange === 'quarter'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Quarter
            </button>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">No performance data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-full text-xs ${
              timeRange === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-full text-xs ${
              timeRange === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('quarter')}
            className={`px-3 py-1 rounded-full text-xs ${
              timeRange === 'quarter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Performance Rating Trend</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRating)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Goals & Feedback</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="goalsCompleted" fill="#10B981" name="Goals Completed" />
              <Bar dataKey="feedbackReceived" fill="#F59E0B" name="Feedback Received" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export function EmployeeOverview() {
  const router = useRouter()
  const { user, signOut } = useAuth()

  // Handle the case where user might be null
  const userDisplayName = user?.name || 'User'
  const userRole = user?.role || 'employee'

  const handleNotificationClick = (id: number) => {
    // TODO: Implement notification read status update
  }

  const handleQuickLinkClick = (route: string) => {
    router.push(`/dashboard/employee/${route}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalProgressTracker goals={[]} />
        <NotificationSystem 
          notifications={[]} 
          onNotificationClick={handleNotificationClick} 
        />
      </div>
      <QuickActionMenu actions={[]} />
      <PerformanceMetrics data={[]} />
      {/* Performance Cycle Progress */}
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Cycle Progress</h3>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800/50 -translate-y-1/2"></div>
          
          {/* Phases */}
          <div className="relative flex justify-between">
            {/* TODO: Add real performance phases data */}
          </div>
        </div>
      </div>
    </div>
  )
} 