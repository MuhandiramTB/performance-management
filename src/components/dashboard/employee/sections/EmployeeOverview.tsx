'use client'

import { useState } from 'react'
import { Bell, User, Target, Star, MessageSquare, BarChart, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { GoalStatus } from '@/models/performance'

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

export function EmployeeOverview() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'warning',
      message: 'Your goal submission is pending approval',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      message: 'New feedback received from your manager',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'success',
      message: 'Self-assessment completed successfully',
      time: '1 day ago',
      read: true,
    },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Submit Q1 Goals',
      type: 'goal',
      status: 'pending',
      dueDate: '2024-03-31',
    },
    {
      id: 2,
      title: 'Complete Self-Rating',
      type: 'rating',
      status: 'pending',
      dueDate: '2024-04-15',
    },
    {
      id: 3,
      title: 'Review Manager Feedback',
      type: 'feedback',
      status: 'completed',
      dueDate: '2024-04-10',
    },
  ])

  const router = useRouter()
  const { user, signOut } = useAuth()

  // Handle the case where user might be null
  const userDisplayName = user?.name || 'User'
  const userRole = user?.role || 'employee'

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const handleQuickLinkClick = (route: string) => {
    router.push(`/dashboard/employee/${route}`)
  }

  return (
    <div className="space-y-6">
  

      {/* Notifications and Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications Panel */}
        <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  notification.read ? 'bg-[#151524]' : 'bg-blue-500/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    notification.type === 'info' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Panel */}
        <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pending Tasks</h3>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-[#151524] border border-gray-800/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{task.title}</p>
                    <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 