'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { UserModal } from '../modals/UserModal'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  avatar?: string
  lastActive?: string
}

interface UserManagementProps {
  onBack: () => void
}

export function UserManagement({ onBack }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  })
  const supabase = createClient()

  // Search users
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Implement search logic
  }

  // Enhanced user management functions
  const handleAddUser = async () => {
    if (!supabase) {
      console.error('Supabase client is not available')
      return
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()

      if (error) throw error

      setUsers(prev => [...prev, data[0]])
      setIsAddUserModalOpen(false)
      setNewUser({ name: '', email: '', role: 'user', status: 'active' })
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const handleEditUser = async (user: User) => {
    setSelectedUser(user)
    setIsAddUserModalOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser || !supabase) {
      console.error('Supabase client is not available or no user selected')
      return
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(selectedUser)
        .eq('id', selectedUser.id)

      if (error) throw error

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u))
      setIsAddUserModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?') || !supabase) {
      return
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg bg-[#1a1b2e]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-white">User Management</h2>
        </div>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5538cc] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add User</span>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1a1b2e] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
        />
        <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="bg-[#1a1b2e] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 border-b border-gray-700/50 text-sm font-medium text-gray-400">
          <div>Avatar</div>
          <div>User Info</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y divide-gray-700/50">
          {['Sarah Wilson', 'Mike Johnson', 'Alex Thompson'].map((user, index) => (
            <div key={user} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                index === 0 ? 'bg-[#6c47ff]' : index === 1 ? 'bg-[#4CAF50]' : 'bg-[#FF9800]'
              }`}>
                {user.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-white font-medium">{user}</h3>
                <p className="text-sm text-gray-400">{`${user.toLowerCase().replace(' ', '.')}@example.com`}</p>
              </div>
              <div className="text-gray-400">
                {index === 0 ? 'Admin' : index === 1 ? 'User' : 'Manager'}
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  index === 2 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                }`}>
                  {index === 2 ? 'Away' : 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditUser({
                    id: index.toString(),
                    name: user,
                    email: `${user.toLowerCase().replace(' ', '.')}@example.com`,
                    role: index === 0 ? 'admin' : index === 1 ? 'user' : 'manager',
                    status: index === 2 ? 'away' : 'active'
                  })}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#252a3d]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteUser(index.toString())}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-[#252a3d]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Modal */}
      {isAddUserModalOpen && (
        <UserModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          newUser={newUser}
          setNewUser={setNewUser}
          isOpen={isAddUserModalOpen}
          onClose={() => {
            setIsAddUserModalOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
        />
      )}
    </div>
  )
} 