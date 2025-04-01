'use client'

import { useState, useEffect } from 'react'
import { SystemSettings } from './SystemSettings'
import { UserManagement } from './UserManagement'
import { RefreshCw, Filter, Download, Clock, Search } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
}

interface SystemSetting {
  id: string
  name: string
  value: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'time'
  options?: string[]
  description: string
  category: 'general' | 'security' | 'performance' | 'notifications'
}

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  status: 'success' | 'warning' | 'error'
}

export function AdminManagement() {
  // User Management State
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [logFilter, setLogFilter] = useState('all')
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // System Settings State
  const [settings, setSettings] = useState<SystemSetting[]>([
    {
      id: 'site-name',
      name: 'Site Name',
      value: 'Performance Management System',
      type: 'text',
      description: 'The name of your performance management system',
      category: 'general'
    },
    {
      id: 'timezone',
      name: 'System Timezone',
      value: 'UTC',
      type: 'select',
      options: [
        'UTC',
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Asia/Singapore',
        'Australia/Sydney'
      ],
      description: 'Default timezone for the system',
      category: 'general'
    },
    {
      id: 'date-format',
      name: 'Date Format',
      value: 'MM/DD/YYYY',
      type: 'select',
      options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
      description: 'Default date format for the system',
      category: 'general'
    },
    {
      id: 'time-format',
      name: 'Time Format',
      value: '12h',
      type: 'select',
      options: ['12h', '24h'],
      description: 'Default time format for the system',
      category: 'general'
    },
    {
      id: 'working-hours-start',
      name: 'Working Hours Start',
      value: '09:00',
      type: 'time',
      description: 'Default start time for working hours',
      category: 'general'
    },
    {
      id: 'working-hours-end',
      name: 'Working Hours End',
      value: '17:00',
      type: 'time',
      description: 'Default end time for working hours',
      category: 'general'
    },
    {
      id: 'maintenance-mode',
      name: 'Maintenance Mode',
      value: 'false',
      type: 'boolean',
      description: 'Enable maintenance mode to restrict access',
      category: 'general'
    },
    {
      id: 'session-timeout',
      name: 'Session Timeout',
      value: '30',
      type: 'number',
      description: 'Session timeout in minutes',
      category: 'security'
    },
    {
      id: 'password-policy',
      name: 'Password Policy',
      value: 'strong',
      type: 'select',
      options: ['basic', 'strong', 'very-strong'],
      description: 'Password complexity requirements',
      category: 'security'
    },
    {
      id: 'cache-duration',
      name: 'Cache Duration',
      value: '3600',
      type: 'number',
      description: 'Cache duration in seconds',
      category: 'performance'
    },
    {
      id: 'max-upload-size',
      name: 'Max Upload Size',
      value: '10',
      type: 'number',
      description: 'Maximum file upload size in MB',
      category: 'performance'
    },
    {
      id: 'email-notifications',
      name: 'Email Notifications',
      value: 'true',
      type: 'boolean',
      description: 'Enable email notifications',
      category: 'notifications'
    },
    {
      id: 'notification-frequency',
      name: 'Notification Frequency',
      value: 'daily',
      type: 'select',
      options: ['immediate', 'daily', 'weekly'],
      description: 'How often to send notifications',
      category: 'notifications'
    }
  ])

  // Add new state for audit logs
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [logDateFilter, setLogDateFilter] = useState('all')
  const [logSearchTerm, setLogSearchTerm] = useState('')

  // User Management Functions
  const handleAddUser = async (user: Omit<User, 'id'>) => {
    try {
      const newUser = {
        ...user,
        id: Date.now().toString(),
        lastLogin: new Date().toLocaleString()
      }
      setUsers(prevUsers => [...prevUsers, newUser])
      
      setAuditLogs(prevLogs => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        user: 'System',
        action: 'User Added',
        details: `Added new user: ${user.name}`,
        status: 'success'
      }, ...prevLogs])
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  }

  const handleEditUser = async (id: string, updatedUser: Partial<User>) => {
    try {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      )
      
      setAuditLogs(prevLogs => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        user: 'System',
        action: 'User Updated',
        details: `Updated user: ${updatedUser.name || 'Unknown'}`,
        status: 'success'
      }, ...prevLogs])
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const userToDelete = users.find(user => user.id === id)
      if (!userToDelete) {
        throw new Error('User not found')
      }

      if (userToDelete.role === 'Admin' && users.filter(u => u.role === 'Admin').length === 1) {
        alert('Cannot delete the last admin user')
        return
      }

      setUsers(prevUsers => prevUsers.filter(user => user.id !== id))
      
      setAuditLogs(prevLogs => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        user: 'System',
        action: 'User Deleted',
        details: `Deleted user: ${userToDelete.name}`,
        status: 'success'
      }, ...prevLogs])
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // System Settings Functions
  const handleSaveSettings = async (newSettings: SystemSetting[]) => {
    try {
      setSettings(newSettings)
      
      setAuditLogs(prevLogs => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        user: 'System',
        action: 'Settings Updated',
        details: 'System settings have been updated',
        status: 'success'
      }, ...prevLogs])
    } catch (error) {
      console.error('Error saving settings:', error)
      throw error
    }
  }

  // Audit Logs Functions
  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log)
    setIsLogModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Add refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Here you would typically fetch fresh data from your API
      setIsRefreshing(false)
    } catch (error) {
      console.error('Error refreshing data:', error)
      setIsRefreshing(false)
    }
  }

  // Add export logs function
  const handleExportLogs = () => {
    const csvContent = auditLogs
      .map(log => `${log.timestamp},${log.user},${log.action},${log.details},${log.status}`)
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filter audit logs
  const filteredLogs = auditLogs
    .filter(log => {
      const matchesStatus = logFilter === 'all' || log.status === logFilter
      const matchesSearch = logSearchTerm === '' || 
        log.action.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(logSearchTerm.toLowerCase())
      
      let matchesDate = true
      if (logDateFilter !== 'all') {
        const logDate = new Date(log.timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        
        switch (logDateFilter) {
          case 'today':
            matchesDate = logDate.toDateString() === today.toDateString()
            break
          case 'yesterday':
            matchesDate = logDate.toDateString() === yesterday.toDateString()
            break
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            matchesDate = logDate >= weekAgo
            break
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            matchesDate = logDate >= monthAgo
            break
        }
      }
      
      return matchesStatus && matchesSearch && matchesDate
    })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User Account Management Panel */}
      <div className="bg-[#151524] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">User Management</h2>
        </div>
        <UserManagement
          users={users}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      {/* System Settings Configuration */}
      <div className="bg-[#151524] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">System Settings</h2>
        </div>
        <SystemSettings settings={settings} onSave={handleSaveSettings} />
      </div>

      {/* Audit Logs Panel */}
      <div className="bg-[#151524] rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-white">Audit Logs</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportLogs}
              className="p-2 text-gray-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
              title="Export Logs"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={logSearchTerm}
                onChange={(e) => setLogSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <select
                value={logDateFilter}
                onChange={(e) => setLogDateFilter(e.target.value)}
                className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              onClick={() => handleViewLog(log)}
              className="p-4 bg-[#1E293B] rounded-lg hover:bg-[#151524] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                    <h3 className="text-white font-medium">{log.action}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{log.details}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </div>
                </div>
                <span className="text-sm text-gray-400">{log.user}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 