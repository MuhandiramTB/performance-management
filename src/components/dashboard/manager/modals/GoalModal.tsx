'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Goal {
  id?: number
  title: string
  description: string
  assignee: string
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Not Started' | 'In Progress' | 'Completed'
  progress: number
}

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (goal: Goal) => void
  goal?: Goal
}

export function GoalModal({ isOpen, onClose, onSubmit, goal }: GoalModalProps) {
  const [formData, setFormData] = useState<Goal>(
    goal || {
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Not Started',
      progress: 0
    }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof Goal, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Goal, string>> = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.assignee.trim()) newErrors.assignee = 'Assignee is required'
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else {
      const selectedDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100'
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
            {goal ? 'Edit Goal' : 'Create Goal'}
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
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.title ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (errors.description) setErrors({ ...errors, description: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] min-h-[100px] ${
                errors.description ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Assignee
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => {
                setFormData({ ...formData, assignee: e.target.value })
                if (errors.assignee) setErrors({ ...errors, assignee: '' })
              }}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.assignee ? 'border-red-500' : 'border-gray-700'
              }`}
              required
            />
            {errors.assignee && <p className="mt-1 text-sm text-red-500">{errors.assignee}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => {
                setFormData({ ...formData, dueDate: e.target.value })
                if (errors.dueDate) setErrors({ ...errors, dueDate: '' })
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                errors.dueDate ? 'border-red-500' : 'border-gray-700'
              } [color-scheme:dark]`}
              required
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Goal['priority'] })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Goal['status'] })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {goal && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Progress
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => {
                  setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })
                  if (errors.progress) setErrors({ ...errors, progress: '' })
                }}
                className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] ${
                  errors.progress ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.progress && <p className="mt-1 text-sm text-red-500">{errors.progress}</p>}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
            >
              {goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 