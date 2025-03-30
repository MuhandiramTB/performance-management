'use client'

import { useState } from 'react'
import { MessageSquare, ThumbsUp, ThumbsDown, Search, Filter, ChevronRight, Tag } from 'lucide-react'

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
}

export function TeamFeedback() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  // Mock data - replace with actual data from your backend
  const feedbacks: Feedback[] = [
    {
      id: 1,
      from: {
        name: 'Michael Chen',
        avatar: '/avatars/michael.jpg',
        role: 'Tech Lead'
      },
      to: {
        name: 'Emma Davis',
        avatar: '/avatars/emma.jpg',
        role: 'Software Engineer'
      },
      type: 'Praise',
      message: 'Excellent work on the new feature implementation. Your attention to detail and code quality are outstanding.',
      tags: ['Technical Skills', 'Code Quality', 'Initiative'],
      createdAt: '2024-03-15T14:30:00',
      isPrivate: false
    },
    // Add more mock feedback here
  ]

  const allTags = Array.from(new Set(feedbacks.flatMap(f => f.tags)))

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

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.to.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || feedback.type === selectedType
    const matchesTag = selectedTag === 'all' || feedback.tags.includes(selectedTag)

    return matchesSearch && matchesType && matchesTag
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-white">Team Feedback</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Types</option>
              <option value="Praise">Praise</option>
              <option value="Improvement">Improvement</option>
              <option value="General">General</option>
            </select>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-[#151524] rounded-lg p-4 hover:bg-[#1c1c2e] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feedback.from.avatar}
                      alt={feedback.from.name}
                      className="w-8 h-8 rounded-full ring-2 ring-[#151524]"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feedback.to.avatar}
                      alt={feedback.to.name}
                      className="w-8 h-8 rounded-full ring-2 ring-[#151524]"
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
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-gray-300">{feedback.message}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {feedback.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full"
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
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No feedback found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
} 