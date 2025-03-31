'use client'

import { useState } from 'react'
import { Trophy, Star, Target, Search, Filter, ChevronRight, Calendar, Award, Medal } from 'lucide-react'

interface Achievement {
  id: number
  title: string
  description: string
  achievedBy: {
    name: string
    avatar: string
    role: string
  }
  type: 'Individual' | 'Team' | 'Department'
  category: 'Performance' | 'Innovation' | 'Leadership' | 'Collaboration'
  date: string
  impact: string
  recognition: 'Gold' | 'Silver' | 'Bronze'
  metrics?: {
    label: string
    value: string
  }[]
}

export function TeamAchievements() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const getRecognitionIcon = (recognition: string) => {
    switch (recognition) {
      case 'Gold':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'Silver':
        return <Award className="w-5 h-5 text-gray-400" />
      case 'Bronze':
        return <Medal className="w-5 h-5 text-orange-500" />
      default:
        return <Star className="w-5 h-5 text-blue-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Performance':
        return 'bg-purple-500/10 text-purple-500'
      case 'Innovation':
        return 'bg-blue-500/10 text-blue-500'
      case 'Leadership':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'Collaboration':
        return 'bg-green-500/10 text-green-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual':
        return 'bg-blue-500/10 text-blue-500'
      case 'Team':
        return 'bg-green-500/10 text-green-500'
      case 'Department':
        return 'bg-purple-500/10 text-purple-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.achievedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || achievement.type === selectedType
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-white">Team Achievements</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
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
              <option value="Individual">Individual</option>
              <option value="Team">Team</option>
              <option value="Department">Department</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Categories</option>
              <option value="Performance">Performance</option>
              <option value="Innovation">Innovation</option>
              <option value="Leadership">Leadership</option>
              <option value="Collaboration">Collaboration</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-[#151524] rounded-lg p-4 hover:bg-[#1c1c2e] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={achievement.achievedBy.avatar}
                    alt={achievement.achievedBy.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-white">{achievement.title}</h3>
                    {getRecognitionIcon(achievement.recognition)}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(achievement.type)}`}>
                      {achievement.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(achievement.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>{achievement.impact}</span>
                    </div>
                  </div>
                  {achievement.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {achievement.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-3">
                          <div className="text-sm text-gray-400">{metric.label}</div>
                          <div className="text-lg font-semibold text-white mt-1">{metric.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No achievements found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
} 