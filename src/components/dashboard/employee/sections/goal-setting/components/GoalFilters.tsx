'use client'

import { Search } from 'lucide-react'
import { GoalStatus } from '@/models/performance'

const goalCategories = [
  'Project Management',
  'Professional Development',
  'Performance',
  'Teamwork',
  'Leadership',
  'Innovation',
  'Customer Service',
  'Technical Skills'
]

interface GoalFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function GoalFilters({ 
  searchTerm, 
  setSearchTerm, 
  selectedStatus, 
  setSelectedStatus, 
  selectedCategory, 
  setSelectedCategory 
}: GoalFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search goals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-8 py-2 text-sm text-white placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
        >
          <option value="all">All Statuses</option>
          <option value={GoalStatus.PENDING}>Pending</option>
          <option value={GoalStatus.APPROVED}>Approved</option>
          <option value={GoalStatus.REJECTED}>Rejected</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
        >
          <option value="all">All Categories</option>
          {goalCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  )
} 