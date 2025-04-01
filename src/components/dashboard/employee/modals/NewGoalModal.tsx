'use client'

import { useState } from 'react'
import { X, Target } from 'lucide-react'

interface Goal {
  title: string
  description: string
  dueDate: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue'
  progress: number
}

interface NewGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (goal: Goal) => void
}

export function NewGoalModal({ isOpen, onClose, onSubmit }: NewGoalModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      dueDate,
      status: 'Not Started',
      progress: 0
    })
    // Reset form
    setTitle('')
    setDescription('')
    setDueDate('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#151524] rounded-xl border border-gray-800/50 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">New Performance Goal</h2>
          </div>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
              Goal Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-gray-800/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              placeholder="Enter goal title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-gray-800/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 min-h-[100px]"
              placeholder="Describe your goal in detail"
              required
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-400 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-gray-800/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-all duration-200"
            >
              Submit Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}