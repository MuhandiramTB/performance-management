'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface TeamMember {
  id?: number
  name: string
  role: string
  email: string
  phone: string
  performance: number
  avatar: string
  status: 'Active' | 'On Leave' | 'Remote'
}

interface TeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (member: TeamMember) => void
  member?: TeamMember
}

export function TeamMemberModal({ isOpen, onClose, onSubmit, member }: TeamMemberModalProps) {
  const [formData, setFormData] = useState<TeamMember>(
    member || {
      name: '',
      role: '',
      email: '',
      phone: '',
      performance: 0,
      avatar: '',
      status: 'Active'
    }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof TeamMember, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TeamMember, string>> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.role.trim()) newErrors.role = 'Role is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format'
    }
    if (formData.performance < 0 || formData.performance > 100) {
      newErrors.performance = 'Performance must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151524] rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => {
                setFormData({ ...formData, role: e.target.value })
                if (errors.role) setErrors({ ...errors, role: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.role ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value })
                if (errors.phone) setErrors({ ...errors, phone: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.phone ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Performance Rating (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.performance}
              onChange={(e) => {
                setFormData({ ...formData, performance: parseInt(e.target.value) || 0 })
                if (errors.performance) setErrors({ ...errors, performance: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.performance ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.performance && <p className="mt-1 text-sm text-red-500">{errors.performance}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TeamMember['status'] })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
            >
              {member ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 