'use client'

import { useState } from 'react'
import { MessageSquare, Star, Tag, X, Send } from 'lucide-react'

interface NewFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: {
    message: string
    type: 'Praise' | 'Improvement' | 'General'
    rating: number
    tags: string[]
    isPrivate: boolean
  }) => void
  availableTags: string[]
}

export function NewFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  availableTags
}: NewFeedbackModalProps) {
  const [feedback, setFeedback] = useState<{
    message: string
    type: 'Praise' | 'Improvement' | 'General'
    rating: number
    tags: string[]
    isPrivate: boolean
  }>({
    message: '',
    type: 'General',
    rating: 0,
    tags: [],
    isPrivate: false
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.message.trim()) return
    onSubmit(feedback)
    setFeedback({
      message: '',
      type: 'General',
      rating: 0,
      tags: [],
      isPrivate: false
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#151524] rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-[#6c47ff]" />
            </div>
            <h2 className="text-xl font-semibold text-white">New Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <MessageSquare className="w-4 h-4" />
              Feedback Type
            </label>
            <select
              value={feedback.type}
              onChange={(e) => setFeedback({ ...feedback, type: e.target.value as 'Praise' | 'Improvement' | 'General' })}
              className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="General">General</option>
              <option value="Praise">Praise</option>
              <option value="Improvement">Improvement</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <Star className="w-4 h-4" />
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, rating })}
                  className={`p-2 rounded-lg transition-colors ${
                    feedback.rating === rating
                      ? 'bg-[#6c47ff] text-white'
                      : 'bg-[#1E293B] text-gray-400 hover:text-white'
                  }`}
                >
                  <Star className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <MessageSquare className="w-4 h-4" />
              Message
            </label>
            <textarea
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              placeholder="Provide detailed feedback..."
              className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] min-h-[150px] resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const newTags = feedback.tags.includes(tag)
                      ? feedback.tags.filter(t => t !== tag)
                      : [...feedback.tags, tag]
                    setFeedback({ ...feedback, tags: newTags })
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    feedback.tags.includes(tag)
                      ? 'bg-[#6c47ff] text-white'
                      : 'bg-[#1E293B] text-gray-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="private"
              checked={feedback.isPrivate}
              onChange={(e) => setFeedback({ ...feedback, isPrivate: e.target.checked })}
              className="w-4 h-4 rounded border-gray-800 text-[#6c47ff] focus:ring-[#6c47ff]"
            />
            <label htmlFor="private" className="text-sm text-gray-400">
              Make this feedback private
            </label>
          </div>
        </form>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!feedback.message.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  )
} 