'use client'

import { useState } from 'react'
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  Tag,
  Filter,
  Search,
  ChevronRight,
  Plus,
  X
} from 'lucide-react'

interface FeedbackStats {
  icon: React.ElementType
  label: string
  value: number
  bgColor: string
  iconColor: string
}

interface FeedbackItem {
  id: number
  author: {
    name: string
    role: string
    avatar: string
  }
  message: string
  timestamp: string
  status: 'Pending Response' | 'Responded'
  response?: string
  type: 'Praise' | 'Improvement' | 'General'
  rating?: number
  tags: string[]
  isPrivate: boolean
}

export function Feedback() {
  const [feedbackResponse, setFeedbackResponse] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false)
  const [newFeedback, setNewFeedback] = useState<{
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

  // Initialize state variables for data
  const [stats, setStats] = useState<FeedbackStats[]>([])
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

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

  const filteredFeedback = recentFeedback.filter(feedback => {
    const matchesSearch = feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || feedback.type === selectedType
    const matchesTag = selectedTag === 'all' || feedback.tags.includes(selectedTag)

    return matchesSearch && matchesType && matchesTag
  })

  const handleSubmitResponse = (feedbackId: number) => {
    if (!feedbackResponse.trim()) return

    // Update the feedback item with the response
    // This would typically involve an API call
    console.log('Submitting response for feedback:', feedbackId, feedbackResponse)
    setFeedbackResponse('')
  }

  const handleSubmitFeedback = () => {
    if (!newFeedback.message.trim()) return

    // Create new feedback item
    const newFeedbackItem: FeedbackItem = {
      id: recentFeedback.length + 1,
      author: {
        name: 'You',
        role: 'Employee',
        avatar: 'Y'
      },
      message: newFeedback.message,
      timestamp: 'Just now',
      status: 'Pending Response',
      type: newFeedback.type,
      rating: newFeedback.rating,
      tags: newFeedback.tags,
      isPrivate: newFeedback.isPrivate
    }

    // In a real application, you would make an API call here
    console.log('Submitting new feedback:', newFeedbackItem)
    
    // Reset the form and close the modal
    setNewFeedback({
      message: '',
      type: 'General',
      rating: 0,
      tags: [],
      isPrivate: false
    })
    setIsNewFeedbackModalOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#151524] rounded-lg p-6 flex flex-col"
          >
            <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <span className="text-sm text-gray-400">{stat.label}</span>
            <span className="text-3xl font-semibold text-white mt-1">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Performance Feedback</h1>
            <p className="text-gray-400 mt-1">Share and receive feedback on performance</p>
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
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-[#151524] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Feedback</h2>
        <div className="space-y-8">
          {filteredFeedback.map((feedback) => (
            <div key={feedback.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">{feedback.author.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{feedback.author.name}</h3>
                      <p className="text-sm text-gray-400">
                        {feedback.author.role} • {feedback.timestamp}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                      <span className={`text-sm ${
                        feedback.status === 'Responded' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {feedback.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-300">{feedback.message}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
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
                  
                  {feedback.response ? (
                    <div className="mt-4 pl-4 border-l-2 border-gray-800">
                      <p className="text-gray-400">{feedback.response}</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <textarea
                        placeholder="Add your response..."
                        value={feedbackResponse}
                        onChange={(e) => setFeedbackResponse(e.target.value)}
                        className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] resize-none"
                        rows={4}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleSubmitResponse(feedback.id)}
                          disabled={!feedbackResponse.trim()}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          Send Response
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                  <MessageSquare className="w-4 h-4" />
                  Feedback Type
                </label>
                <select
                  value={newFeedback.type}
                  onChange={(e) => setNewFeedback({ ...newFeedback, type: e.target.value as 'Praise' | 'Improvement' | 'General' })}
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
                disabled={!newFeedback.message.trim()}
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