'use client'

import { useState, useEffect } from 'react'
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
  X,
  RefreshCw
} from 'lucide-react'
import { NewFeedbackModal } from '../modals/NewFeedbackModal'

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<FeedbackStats[]>([])
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback')
      if (!response.ok) throw new Error('Failed to fetch feedback')
      const data = await response.json()
      setRecentFeedback(data)
      
      // Update stats
      setStats([
        {
          icon: ThumbsUp,
          label: 'Praise',
          value: data.filter((f: FeedbackItem) => f.type === 'Praise').length,
          bgColor: 'bg-green-500/10',
          iconColor: 'text-green-500'
        },
        {
          icon: ThumbsDown,
          label: 'Improvement',
          value: data.filter((f: FeedbackItem) => f.type === 'Improvement').length,
          bgColor: 'bg-yellow-500/10',
          iconColor: 'text-yellow-500'
        },
        {
          icon: MessageSquare,
          label: 'General',
          value: data.filter((f: FeedbackItem) => f.type === 'General').length,
          bgColor: 'bg-blue-500/10',
          iconColor: 'text-blue-500'
        }
      ])

      // Update tags
      const tags = new Set<string>()
      data.forEach((f: FeedbackItem) => {
        f.tags.forEach(tag => tags.add(tag))
      })
      setAllTags(Array.from(tags))
    } catch (error) {
      console.error('Error fetching feedback:', error)
      setError('Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitResponse = async (feedbackId: number) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: feedbackId,
          response: feedbackResponse,
          status: 'Responded'
        })
      })
      if (!response.ok) throw new Error('Failed to submit response')
      
      setRecentFeedback(recentFeedback.map(f => 
        f.id === feedbackId 
          ? { ...f, response: feedbackResponse, status: 'Responded' }
          : f
      ))
      setFeedbackResponse('')
    } catch (error) {
      console.error('Error submitting response:', error)
      setError('Failed to submit response')
    }
  }

  const handleAddFeedback = async (newFeedback: Omit<FeedbackItem, 'id' | 'timestamp' | 'status'>) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback)
      })
      if (!response.ok) throw new Error('Failed to create feedback')
      
      const createdFeedback = await response.json()
      setRecentFeedback([createdFeedback, ...recentFeedback])
      setIsNewFeedbackModalOpen(false)
    } catch (error) {
      console.error('Error creating feedback:', error)
      setError('Failed to create feedback')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  const filteredFeedback = recentFeedback.filter(feedback => {
    const matchesSearch = feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || feedback.type === selectedType
    const matchesTag = selectedTag === 'all' || feedback.tags.includes(selectedTag)

    return matchesSearch && matchesType && matchesTag
  })

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Feedback</h1>
          <p className="text-gray-400 mt-1">View and respond to feedback from your manager</p>
        </div>
        <button
          onClick={() => setIsNewFeedbackModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-all duration-200 hover:shadow-lg hover:shadow-[#6c47ff]/20"
        >
          <Plus className="w-5 h-5" />
          New Feedback
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-[#151524] rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{stat.label}</h3>
                <p className="text-3xl font-semibold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#151524] border border-gray-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-[#151524] border border-gray-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Praise">Praise</option>
            <option value="Improvement">Improvement</option>
            <option value="General">General</option>
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 bg-[#151524] border border-gray-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map(feedback => (
          <div
            key={feedback.id}
            className="p-6 bg-[#151524] rounded-xl border border-gray-800/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6c47ff]/10 flex items-center justify-center">
                  <span className="text-[#6c47ff] font-medium">
                    {feedback.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-white">{feedback.author.name}</h3>
                  <p className="text-sm text-gray-400">{feedback.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  feedback.status === 'Responded' 
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {feedback.status}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(feedback.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-white">{feedback.message}</p>
              {feedback.rating && (
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < feedback.rating! ? 'text-yellow-500 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {feedback.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-[#6c47ff]/10 text-[#6c47ff] rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {feedback.status === 'Pending Response' && (
              <div className="mt-4">
                <textarea
                  value={feedbackResponse}
                  onChange={(e) => setFeedbackResponse(e.target.value)}
                  placeholder="Write your response..."
                  className="w-full px-4 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSubmitResponse(feedback.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Response
                  </button>
                </div>
              </div>
            )}

            {feedback.response && (
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Your Response</h4>
                <p className="text-white">{feedback.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 