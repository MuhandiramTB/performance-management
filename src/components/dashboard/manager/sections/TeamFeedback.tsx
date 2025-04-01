'use client'

import { useState } from 'react'
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  Tag,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  User,
  Plus,
  X
} from 'lucide-react'

interface Feedback {
  id: number
  from: {
    name: string
    avatar: string
    role: string
  }
  to: {
    name: string
    avatar: string
    role: string
  }
  type: 'Praise' | 'Improvement' | 'General'
  message: string
  tags: string[]
  createdAt: string
  isPrivate: boolean
  rating?: number
  status: 'Pending' | 'Reviewed' | 'Archived'
}

export function Feedback() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    to: '',
    type: 'General',
    message: '',
    tags: [] as string[],
    isPrivate: false,
    rating: 0
  })

  // Initialize feedbacks as empty array
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [teamMembers, setTeamMembers] = useState<Array<{ id: number, name: string, role: string }>>([])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Praise':
        return <ThumbsUp className="w-4 h-4 text-green-500" />
      case 'Improvement':
        return <ThumbsDown className="w-4 h-4 text-yellow-500" />
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Praise':
        return 'bg-green-500/10 text-green-500'
      case 'Improvement':
        return 'bg-yellow-500/10 text-yellow-500'
      default:
        return 'bg-blue-500/10 text-blue-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'Reviewed':
        return 'bg-green-500/10 text-green-500'
      case 'Archived':
        return 'bg-gray-500/10 text-gray-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.to.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || feedback.type === selectedType
    const matchesTag = selectedTag === 'all' || feedback.tags.includes(selectedTag)
    const matchesStatus = selectedStatus === 'all' || feedback.status === selectedStatus

    return matchesSearch && matchesType && matchesTag && matchesStatus
  })

  const handleSubmitFeedback = () => {
    // Add the new feedback to the list
    const newFeedbackItem: Feedback = {
      id: feedbacks.length + 1,
      from: {
        name: 'You',
        avatar: '/avatars/default.jpg',
        role: 'Manager'
      },
      to: {
        name: newFeedback.to,
        avatar: '/avatars/default.jpg',
        role: 'Team Member'
      },
      type: newFeedback.type as 'Praise' | 'Improvement' | 'General',
      message: newFeedback.message,
      tags: newFeedback.tags,
      createdAt: new Date().toISOString(),
      isPrivate: newFeedback.isPrivate,
      rating: newFeedback.rating,
      status: 'Pending'
    }

    // In a real application, you would make an API call here
    console.log('Submitting feedback:', newFeedbackItem)
    
    // Reset the form and close the modal
    setNewFeedback({
      to: '',
      type: 'General',
      message: '',
      tags: [],
      isPrivate: false,
      rating: 0
    })
    setIsNewFeedbackModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Team Feedback</h1>
            <p className="text-gray-400 mt-1">Provide and manage performance feedback</p>
          </div>
        </div>
        <button
          onClick={() => setIsNewFeedbackModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Feedback
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          >
            <option value="all">All Types</option>
            <option value="Praise">Praise</option>
            <option value="Improvement">Improvement</option>
            <option value="General">General</option>
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid gap-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-[#151524] rounded-lg p-6 hover:bg-[#1c1c2e] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feedback.from.avatar}
                      alt={feedback.from.name}
                      className="w-10 h-10 rounded-full ring-2 ring-[#151524]"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feedback.to.avatar}
                      alt={feedback.to.name}
                      className="w-10 h-10 rounded-full ring-2 ring-[#151524]"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      <span className="text-white">{feedback.from.name}</span>
                      {' → '}
                      <span className="text-white">{feedback.to.name}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {getTypeIcon(feedback.type)}
                        <span className={`text-xs font-medium ${getTypeColor(feedback.type)}`}>
                          {feedback.type}
                        </span>
                      </div>
                      {feedback.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">{feedback.rating}/5</span>
                        </div>
                      )}
                      <span className={`text-xs font-medium ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-300">{feedback.message}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {feedback.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-[#1E293B] rounded-full"
                    >
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
            </div>
          </div>
        ))}
      </div>

      {filteredFeedbacks.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
            <SlidersHorizontal className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No feedback found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* New Feedback Modal */}
      {isNewFeedbackModalOpen && (
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
                onClick={() => setIsNewFeedbackModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                  <User className="w-4 h-4" />
                  Team Member
                </label>
                <select
                  value={newFeedback.to}
                  onChange={(e) => setNewFeedback({ ...newFeedback, to: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                >
                  <option value="">Select team member</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name} • {member.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                  <MessageSquare className="w-4 h-4" />
                  Feedback Type
                </label>
                <select
                  value={newFeedback.type}
                  onChange={(e) => setNewFeedback({ ...newFeedback, type: e.target.value })}
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
                      onClick={() => setNewFeedback({ ...newFeedback, rating })}
                      className={`p-2 rounded-lg transition-colors ${
                        newFeedback.rating === rating
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
                  value={newFeedback.message}
                  onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
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
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const newTags = newFeedback.tags.includes(tag)
                          ? newFeedback.tags.filter(t => t !== tag)
                          : [...newFeedback.tags, tag]
                        setNewFeedback({ ...newFeedback, tags: newTags })
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        newFeedback.tags.includes(tag)
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
                  checked={newFeedback.isPrivate}
                  onChange={(e) => setNewFeedback({ ...newFeedback, isPrivate: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-800 text-[#6c47ff] focus:ring-[#6c47ff]"
                />
                <label htmlFor="private" className="text-sm text-gray-400">
                  Make this feedback private
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-800">
              <button
                onClick={() => setIsNewFeedbackModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!newFeedback.to || !newFeedback.message}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 