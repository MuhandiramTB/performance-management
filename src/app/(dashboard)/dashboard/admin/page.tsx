'use client'

import { useState } from 'react'
import { UserManagement } from '@/components/dashboard/admin/sections/UserManagement'
import { SystemSettings } from '@/components/dashboard/admin/sections/SystemSettings'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Shield,
  BarChart2,
  FileText,
  Bell,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

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
  action: string
  user: string
  timestamp: string
  details: string
  type: 'info' | 'warning' | 'success' | 'error'
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'employee',
      status: 'active',
      lastLogin: '2024-03-20T10:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-03-19T15:30:00Z'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      role: 'employee',
      status: 'inactive',
      lastLogin: '2024-03-15T09:45:00Z'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'manager',
      status: 'pending',
      lastLogin: '2024-03-18T14:20:00Z'
    },
    {
      id: '5',
      name: 'Michael Wilson',
      email: 'michael@example.com',
      role: 'employee',
      status: 'active',
      lastLogin: '2024-03-20T11:30:00Z'
    }
  ])

  // Mock data for demonstration
  const mockSettings: SystemSetting[] = [
    {
      id: '1',
      name: 'siteName',
      value: 'Performance Management System',
      type: 'text',
      description: 'The name of the site displayed to users',
      category: 'general'
    },
    {
      id: '2',
      name: 'maintenanceMode',
      value: 'false',
      type: 'boolean',
      description: 'Whether the site is in maintenance mode',
      category: 'general'
    },
    {
      id: '3',
      name: 'allowRegistration',
      value: 'true',
      type: 'boolean',
      description: 'Whether new user registration is allowed',
      category: 'security'
    }
  ]

  const mockAuditLogs: AuditLog[] = [
    {
      id: '1',
      action: 'User Login',
      user: 'admin@example.com',
      timestamp: '2024-03-20T10:15:00Z',
      details: 'Successful login from IP 192.168.1.1',
      type: 'success'
    },
    {
      id: '2',
      action: 'System Update',
      user: 'system',
      timestamp: '2024-03-20T09:30:00Z',
      details: 'System updated to version 2.1.0',
      type: 'info'
    },
    {
      id: '3',
      action: 'Failed Login Attempt',
      user: 'unknown',
      timestamp: '2024-03-20T09:15:00Z',
      details: 'Failed login attempt from IP 203.0.113.1',
      type: 'warning'
    },
    {
      id: '4',
      action: 'User Created',
      user: 'admin@example.com',
      timestamp: '2024-03-19T16:45:00Z',
      details: 'New user account created: jane@example.com',
      type: 'success'
    },
    {
      id: '5',
      action: 'Database Backup',
      user: 'system',
      timestamp: '2024-03-19T03:00:00Z',
      details: 'Daily database backup completed successfully',
      type: 'success'
    }
  ]

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      bgColor: 'bg-[#6c47ff]/10',
      textColor: 'text-[#6c47ff]'
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: Settings,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: FileText,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400'
    }
  ]

  const handleAddUser = (user: Omit<User, 'id'>) => {
    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = (users.length + 1).toString()
    
    // Create a new user with the generated ID
    const newUser: User = {
      ...user,
      id: newId
    }
    
    // Add the new user to the state
    setUsers([...users, newUser])
    
    // In a real application, you would also make an API call to persist the data
    console.log('Adding user:', newUser)
  }

  const handleEditUser = (id: string, updatedUser: Partial<User>) => {
    // Find the user to update
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex !== -1) {
      // Create a new array with the updated user
      const updatedUsers = [...users]
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        ...updatedUser
      }
      
      // Update the state
      setUsers(updatedUsers)
      
      // In a real application, you would also make an API call to persist the data
      console.log('Editing user:', id, updatedUser)
    }
  }

  const handleDeleteUser = (id: string) => {
    // Filter out the user to delete
    const updatedUsers = users.filter(user => user.id !== id)
    
    // Update the state
    setUsers(updatedUsers)
    
    // In a real application, you would also make an API call to persist the data
    console.log('Deleting user:', id)
  }

  const handleSaveSettings = (settings: SystemSetting[]) => {
    console.log('Saving settings:', settings)
  }

  const renderDashboardOverview = () => {
  return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                +12%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>
          
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-white mt-1">42</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                +5%
              </span>
              <span className="text-gray-400 ml-2">from last hour</span>
            </div>
          </div>
          
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Uptime</p>
                <p className="text-2xl font-bold text-white mt-1">99.9%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                All systems operational
              </span>
            </div>
          </div>

          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Security Alerts</p>
                <p className="text-2xl font-bold text-white mt-1">3</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Requires attention
              </span>
            </div>
          </div>
                  </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
              {mockAuditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-[#151524] hover:bg-[#1E293B] transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.type === 'warning' ? 'bg-yellow-500' :
                    log.type === 'info' ? 'bg-blue-500' :
                    log.type === 'error' ? 'bg-red-500' :
                          'bg-green-500'
                        }`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-white">{log.action}</p>
                      <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
            </div>

          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-white">Database</span>
                </div>
                <span className="text-sm text-gray-400">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-white">API Server</span>
                    </div>
                <span className="text-sm text-gray-400">100%</span>
                    </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-white">Cache Server</span>
                  </div>
                <span className="text-sm text-gray-400">85%</span>
                  </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-white">File Storage</span>
                </div>
                <span className="text-sm text-gray-400">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAuditLogs = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Audit Logs</h2>
          <div className="flex space-x-2">
            <select className="bg-[#151524] border border-gray-800/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Actions</option>
              <option value="login">Logins</option>
              <option value="user">User Actions</option>
              <option value="system">System Actions</option>
            </select>
            <select className="bg-[#151524] border border-gray-800/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#151524] text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#151524] transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {log.user}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {log.details}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                        log.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                        log.type === 'error' ? 'bg-red-500/10 text-red-400' :
                        'bg-green-500/10 text-green-400'
                      }`}>
                        {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">Showing 5 of 120 logs</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-[#151524] border border-gray-800/50 rounded-lg text-sm text-white hover:bg-[#1E293B] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 rounded-lg text-sm text-white hover:bg-blue-600 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 'user-management':
        return (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        )
      case 'system-settings':
        return (
          <SystemSettings
            settings={mockSettings}
            onSave={handleSaveSettings}
          />
        )
      case 'audit-logs':
        return renderAuditLogs()
      case 'dashboard':
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <DashboardLayout
      title="Admin Portal"
      menuItems={menuItems}
      role="admin"
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      {renderContent()}
    </DashboardLayout>
  )
}
