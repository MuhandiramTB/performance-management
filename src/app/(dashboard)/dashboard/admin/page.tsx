'use client'

import { useState } from 'react'
import { UserManagement } from '@/components/dashboard/admin/sections/UserManagement'
import { SystemSettings } from '@/components/dashboard/admin/sections/SystemSettings'
import { DashboardOverview } from '@/components/dashboard/admin/sections/DashboardOverview'
import { AuditLogs } from '@/components/dashboard/admin/sections/AuditLogs'
import { AdminManagement } from '@/components/dashboard/admin/sections/AdminManagement'

import DashboardLayout from '@/components/layouts/DashboardLayout'
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Shield,
  BarChart2,
  FileText,
  Bell
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
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<User[]>([
    
    
  ])

  const mockSettings: SystemSetting[] = [
    
  ]

  const mockAuditLogs: AuditLog[] = [
    
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
      id: 'admin-management',
      label: 'Admin Management',
      icon: Bell,
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400'
    }
  ]

  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newId = (users.length + 1).toString()
    const newUser: User = {
      ...user,
      id: newId
    }
    setUsers([...users, newUser])
  }

  const handleEditUser = (id: string, updatedUser: Partial<User>) => {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      const updatedUsers = [...users]
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        ...updatedUser
      }
      setUsers(updatedUsers)
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const handleSaveSettings = (settings: SystemSetting[]) => {
    console.log('Saving settings:', settings)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
        return (
          <AuditLogs
            logs={mockAuditLogs}
            totalLogs={120}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )
        case 'admin-management':
        return (
          <AdminManagement
          />
        )
      case 'dashboard':
      default:
        return (
          <DashboardOverview
            totalUsers={users.length}
            activeSessions={42}
            systemUptime="99.9%"
            securityAlerts={3}
            recentActivity={mockAuditLogs}
          />
        )
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
