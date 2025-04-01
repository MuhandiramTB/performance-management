'use client'

import { useState } from 'react'
import { X, Star, Tag, Lock, Unlock } from 'lucide-react'

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

export function NewFeedbackModal({ isOpen, onClose, onSubmit, availableTags }: NewFeedbackModalProps) {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'Praise' | 'Improvement' | 'General'>('General')
  const [rating, setRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      message,
      type,
      rating,
      tags: selectedTags,
      isPrivate
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#151524] rounded-xl border border-gray-800/50 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <h2 className="text-xl font-semibold text-white">New Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your feedback message..."
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
              rows={4}
              required
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'Praise' | 'Improvement' | 'General')}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
            >
              <option value="General">General</option>
              <option value="Praise">Praise</option>
              <option value="Improvement">Improvement</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="p-1 hover:bg-[#6c47ff]/10 rounded-lg transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      value <= rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-[#6c47ff]/20 text-[#6c47ff]'
                      : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
              {isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {isPrivate ? 'Private Feedback' : 'Public Feedback'}
            </label>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1a1a2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <span
                className={`${
                  isPrivate ? 'translate-x-6 bg-[#6c47ff]' : 'translate-x-1 bg-gray-600'
                } inline-block h-4 w-4 transform rounded-full transition-transform`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 