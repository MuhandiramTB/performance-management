'use client'

import { useState } from 'react'
import { Search, Plus, MoreVertical, Mail, Phone, Star, Edit2, Trash2 } from 'lucide-react'

interface TeamMember {
  id: number
  name: string
  role: string
  email: string
  phone: string
  performance: number
  avatar: string
  status: 'Active' | 'On Leave' | 'Remote'
}

export function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showActions, setShowActions] = useState<number | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-400'
      case 'On Leave':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'Remote':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Team Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors">
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#151524] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
        />
      </div>

      {/* Team Members List */}
      <div className="bg-[#151524] rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-800">
          {filteredMembers.map((member) => (
            <div key={member.id} className="p-4 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">{member.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Contact Info */}
                  <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{member.performance}%</span>
                  </div>

                  {/* Status */}
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>

                  {/* Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setShowActions(showActions === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {showActions === member.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] rounded-lg shadow-lg py-1 z-10">
                        <button className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          Edit Member
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Remove Member
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 