'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Send, ThumbsUp, MessageSquare, Clock, AlertCircle, Star, RefreshCw } from 'lucide-react'
import { NewFeedbackModal } from '@/components/dashboard/manager/components/NewFeedbackModal'

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
  type: 'Praise' | 'Improvement' | 'General'
  rating?: number
  tags: string[]
  isPrivate: boolean
  response?: string
}

interface FeedbackStats {
  icon: any
  label: string
  value: number
  bgColor: string
  iconColor: string
}

// Add sample data
const sampleFeedback: FeedbackItem[] = [
  {
    id: 1,
    author: {
      name: 'Sarah Manager',
      role: 'Team Lead',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Manager&background=6c47ff&color=fff'
    },
    message: 'Great job on leading the frontend migration project. Your technical expertise and leadership skills were instrumental in its success.',
    timestamp: '2024-03-15T10:00:00Z',
    status: 'Pending Response',
    type: 'Praise',
    rating: 5,
    tags: ['Leadership', 'Technical Skills'],
    isPrivate: false
  },
  {
    id: 2,
    author: {
      name: 'Sarah Manager',
      role: 'Team Lead',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Manager&background=6c47ff&color=fff'
    },
    message: 'Consider improving documentation for your code changes. This will help other team members understand and maintain the codebase better.',
    timestamp: '2024-03-14T15:30:00Z',
    status: 'Responded',
    response: 'Thank you for the feedback. I will start adding more detailed comments and documentation to my code.',
    type: 'Improvement',
    tags: ['Documentation', 'Teamwork'],
    isPrivate: true
  }
]

const sampleStats: FeedbackStats[] = [
  {
    icon: ThumbsUp,
    label: 'Praise Received',
    value: 12,
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-500'
  },
  {
    icon: MessageSquare,
    label: 'Total Feedback',
    value: 15,
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500'
  },
  {
    icon: Clock,
    label: 'Pending Response',
    value: 2,
    bgColor: 'bg-yellow-500/10',
    iconColor: 'text-yellow-500'
  }
]

export function Feedback() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    to: '',
    type: 'General',
    message: '',
    tags: [] as string[],
    isPrivate: false,
    rating: 0
  })

  // Initialize with sample data
  const [stats, setStats] = useState<FeedbackStats[]>(sampleStats)
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>(sampleFeedback)
  const [feedbackResponse, setFeedbackResponse] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmitResponse = async (feedbackId: number) => {
    if (!feedbackResponse.trim()) {
      console.error('Please enter a response')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRecentFeedback(recentFeedback.map(f => 
        f.id === feedbackId 
          ? { 
              ...f, 
              response: feedbackResponse, 
              status: 'Responded',
              timestamp: new Date().toISOString()
            }
          : f
      ))
      
      // Clear response
      setFeedbackResponse('')
      
      // Update stats
      setStats(stats.map(stat => 
        stat.label === 'Pending Response'
          ? { ...stat, value: stat.value - 1 }
          : stat
      ))
    } catch (error) {
      console.error('Error submitting response:', error)
      setError('Failed to submit response')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFeedback = async (feedback: { 
    message: string
    type: 'Praise' | 'Improvement' | 'General'
    rating: number
    tags: string[]
    isPrivate: boolean
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const createdFeedback: FeedbackItem = {
        ...feedback,
        id: recentFeedback.length + 1,
        timestamp: new Date().toISOString(),
        status: 'Pending Response',
        author: {
          name: 'Current User',
          role: 'Employee',
          avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6c47ff&color=fff'
        }
      }
      
      setRecentFeedback([createdFeedback, ...recentFeedback])
      setIsNewFeedbackModalOpen(false)
      
      // Update stats
      setStats(stats.map(stat => {
        if (stat.label === 'Total Feedback') return { ...stat, value: stat.value + 1 }
        if (stat.label === 'Pending Response') return { ...stat, value: stat.value + 1 }
        if (stat.label === 'Praise Received' && feedback.type === 'Praise') {
          return { ...stat, value: stat.value + 1 }
        }
        return stat
      }))
    } catch (error) {
      console.error('Error creating feedback:', error)
      setError('Failed to create feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFeedback = recentFeedback.filter(feedback => {
    const matchesSearch = feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || feedback.type === selectedType
    const matchesTag = selectedTag === 'all' || feedback.tags.includes(selectedTag)
    const matchesStatus = selectedStatus === 'all' || feedback.status === selectedStatus

    return matchesSearch && matchesType && matchesTag && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Feedback</h1>
          <p className="text-gray-400 mt-1">Provide and manage feedback for your team members</p>
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
            {['Leadership', 'Technical Skills', 'Documentation', 'Teamwork'].map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-[#151524] border border-gray-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Pending Response">Pending Response</option>
            <option value="Responded">Responded</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map(feedback => (
          <div
            key={feedback.id}
            className="p-6 bg-[#151524] rounded-xl border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200"
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
                    disabled={isLoading || !feedbackResponse.trim()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Response
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {feedback.response && (
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Response</h4>
                <p className="text-white">{feedback.response}</p>
              </div>
            )}
          </div>
        ))}

        {filteredFeedback.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1E293B] mb-4">
              <AlertCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white">No feedback found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* New Feedback Modal */}
      {isNewFeedbackModalOpen && (
        <NewFeedbackModal
          isOpen={isNewFeedbackModalOpen}
          onClose={() => setIsNewFeedbackModalOpen(false)}
          onSubmit={handleAddFeedback}
          availableTags={['Leadership', 'Technical Skills', 'Documentation', 'Teamwork']}
        />
      )}
    </div>
  )
} 