'use client'

import { useState } from 'react'

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
  type: 'text' | 'number' | 'boolean' | 'select'
  options?: string[]
  description: string
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [newUser, setNewUser] = useState<Partial<User>>({})

  // System Settings State
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null)
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [logFilter, setLogFilter] = useState('all')
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // User Management Functions
  const handleAddUser = () => {
    setNewUser({})
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        // Find the user to be deleted
        const userToDelete = users.find(user => user.id === userId)
        if (!userToDelete) {
          throw new Error('User not found')
        }

        // Prevent deleting the last admin
        if (userToDelete.role === 'Admin' && users.filter(u => u.role === 'Admin').length === 1) {
          alert('Cannot delete the last admin user')
          return
        }

        // Update the users state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
        
        // Add to audit logs
        setAuditLogs(prevLogs => [{
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          user: 'System',
          action: 'User Deleted',
          details: `Deleted user: ${userToDelete.name}`,
          status: 'success'
        }, ...prevLogs])
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user. Please try again.')
      
      // Add error to audit logs
      setAuditLogs(prevLogs => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        user: 'System',
        action: 'User Deletion Failed',
        details: `Failed to delete user with ID: ${userId}`,
        status: 'error'
      }, ...prevLogs])
    }
  }

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...newUser } : user
      ))
    } else {
      setUsers([...users, { ...newUser as User, id: Date.now().toString() }])
    }
    setIsUserModalOpen(false)
    setSelectedUser(null)
    setNewUser({})
  }

  // System Settings Functions
  const handleEditSetting = (setting: SystemSetting) => {
    setSelectedSetting(setting)
    setIsSettingModalOpen(true)
  }

  const handleSaveSetting = () => {
    if (selectedSetting) {
      setSettings(settings.map(setting =>
        setting.id === selectedSetting.id ? { ...setting, value: selectedSetting.value } : setting
      ))
    }
    setIsSettingModalOpen(false)
    setSelectedSetting(null)
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User Account Management Panel */}
      <div className="bg-[#151524] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add User
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="space-y-3">
            {users.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-[#1E293B] rounded-lg hover:bg-[#151524] transition-colors"
              >
                <div>
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Last login: {user.lastLogin}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-3 py-1 text-sm text-white bg-blue-500/20 rounded hover:bg-blue-500/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 text-sm text-red-400 bg-red-500/20 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Settings Configuration */}
      <div className="bg-[#151524] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">System Settings</h2>
          <button
            onClick={() => setIsSettingModalOpen(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div className="space-y-4">
          {settings.map(setting => (
            <div
              key={setting.id}
              className="p-4 bg-[#1E293B] rounded-lg hover:bg-[#151524] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{setting.name}</h3>
                <button
                  onClick={() => handleEditSetting(setting)}
                  className="px-3 py-1 text-sm text-white bg-purple-500/20 rounded hover:bg-purple-500/30 transition-colors"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-2">{setting.description}</p>
              <div className="flex items-center gap-2">
                {setting.type === 'boolean' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={setting.value === 'true'}
                      onChange={(e) => handleEditSetting({ ...setting, value: e.target.checked.toString() })}
                      className="w-4 h-4 rounded border-gray-700 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      {setting.value === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ) : (
                  <input
                    type={setting.type === 'number' ? 'number' : 'text'}
                    value={setting.value}
                    onChange={(e) => handleEditSetting({ ...setting, value: e.target.value })}
                    className="w-full px-3 py-2 bg-[#151524] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Access */}
      <div className="bg-[#151524] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Audit Logs</h2>
          <div className="flex items-center gap-2">
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Logs</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            <button 
              onClick={() => setAuditLogs([...auditLogs])}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {auditLogs.map(log => (
            <div
              key={log.id}
              className="p-4 bg-[#1E293B] rounded-lg cursor-pointer hover:bg-[#151524] transition-colors"
              onClick={() => handleViewLog(log)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                  <h3 className="text-white font-medium">{log.action}</h3>
                </div>
                <span className="text-sm text-gray-400">{log.timestamp}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{log.details}</p>
              <div className="text-sm text-gray-500">
                User: {log.user}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#151524] rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => {
                  setIsUserModalOpen(false)
                  setSelectedUser(null)
                  setNewUser({})
                }}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name || ''}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role || ''}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Status
                </label>
                <select
                  value={newUser.status || ''}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User['status'] })}
                  className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsUserModalOpen(false)
                  setSelectedUser(null)
                  setNewUser({})
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingModalOpen && selectedSetting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#151524] rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Edit Setting
              </h3>
              <button
                onClick={() => {
                  setIsSettingModalOpen(false)
                  setSelectedSetting(null)
                }}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {selectedSetting.name}
                </label>
                <p className="text-sm text-gray-500 mb-2">{selectedSetting.description}</p>
                {selectedSetting.type === 'boolean' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSetting.value === 'true'}
                      onChange={(e) => setSelectedSetting({ ...selectedSetting, value: e.target.checked.toString() })}
                      className="w-4 h-4 rounded border-gray-700 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-400">
                      {selectedSetting.value === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ) : (
                  <input
                    type={selectedSetting.type === 'number' ? 'number' : 'text'}
                    value={selectedSetting.value}
                    onChange={(e) => setSelectedSetting({ ...selectedSetting, value: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsSettingModalOpen(false)
                  setSelectedSetting(null)
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSetting}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {isLogModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#151524] rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Log Details
              </h3>
              <button
                onClick={() => {
                  setIsLogModalOpen(false)
                  setSelectedLog(null)
                }}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Action
                </label>
                <p className="text-white">{selectedLog.action}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Details
                </label>
                <p className="text-gray-300">{selectedLog.details}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  User
                </label>
                <p className="text-gray-300">{selectedLog.user}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Timestamp
                </label>
                <p className="text-gray-300">{selectedLog.timestamp}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedLog.status)}`} />
                  <span className="text-gray-300 capitalize">{selectedLog.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setIsLogModalOpen(false)
                  setSelectedLog(null)
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 