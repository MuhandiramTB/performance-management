interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  avatar?: string
  lastActive?: string
}

interface UserModalProps {
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
  newUser: {
    name: string
    email: string
    role: string
    status: string
  }
  setNewUser: (user: { name: string; email: string; role: string; status: string }) => void
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function UserModal({
  selectedUser,
  setSelectedUser,
  newUser,
  setNewUser,
  isOpen,
  onClose,
  onSubmit
}: UserModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[#1a1b2e] rounded-lg w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            {selectedUser ? 'Edit User' : 'Add New User'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Name</label>
            <input
              type="text"
              value={selectedUser ? selectedUser.name : newUser.name}
              onChange={(e) => selectedUser 
                ? setSelectedUser({...selectedUser, name: e.target.value})
                : setNewUser({...newUser, name: e.target.value})
              }
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={selectedUser ? selectedUser.email : newUser.email}
              onChange={(e) => selectedUser
                ? setSelectedUser({...selectedUser, email: e.target.value})
                : setNewUser({...newUser, email: e.target.value})
              }
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Role</label>
            <select
              value={selectedUser ? selectedUser.role : newUser.role}
              onChange={(e) => selectedUser
                ? setSelectedUser({...selectedUser, role: e.target.value})
                : setNewUser({...newUser, role: e.target.value})
              }
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-[#6c47ff] transition-colors"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select
              value={selectedUser ? selectedUser.status : newUser.status}
              onChange={(e) => selectedUser
                ? setSelectedUser({...selectedUser, status: e.target.value})
                : setNewUser({...newUser, status: e.target.value})
              }
              className="w-full px-3 py-2 bg-[#252a3d] border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-[#6c47ff] transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-medium bg-[#6c47ff] text-white rounded-lg hover:bg-[#5538cc] transition-colors"
          >
            {selectedUser ? 'Update User' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  )
} 