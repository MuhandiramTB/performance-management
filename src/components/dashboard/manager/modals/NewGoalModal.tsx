'use client'

import { useState } from 'react'
import { X, Target, Calendar, BarChart3, ChevronRight } from 'lucide-react'

interface NewGoalModalProps {
  onClose: () => void
  onSubmit: (goal: {
    title: string
    description: string
    dueDate: string
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue'
    progress: number
  }) => void
}

export function NewGoalModal({ onClose, onSubmit }: NewGoalModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [progress, setProgress] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      dueDate,
      status: 'Not Started',
      progress
    })
  }

  return (
    <div className=" mt-15 fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#151524] rounded-xl p-6 w-full max-w-md border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
              <Target className="w-5 h-5 text-[#6c47ff]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Create New Goal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-1">
              <ChevronRight className="w-4 h-4" />
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-1">
              <ChevronRight className="w-4 h-4" />
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-1">
              <Calendar className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="progress" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-1">
              <BarChart3 className="w-4 h-4" />
              Initial Progress
            </label>
            <input
              type="range"
              id="progress"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>0%</span>
              <span>{progress}%</span>
              <span>100%</span>
            </div>
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
              className="px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}