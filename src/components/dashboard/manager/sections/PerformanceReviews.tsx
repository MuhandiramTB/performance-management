'use client'

import { useState } from 'react'
import { Calendar, Star, BarChart2, Search, Filter, ChevronRight, Clock } from 'lucide-react'

interface Review {
  id: number
  employeeName: string
  employeeAvatar: string
  role: string
  department: string
  reviewType: 'Annual' | 'Quarterly' | 'Monthly'
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue'
  dueDate: string
  rating?: number
  completedAt?: string
}

export function PerformanceReviews() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [reviews, setReviews] = useState<Review[]>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-500'
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500'
      case 'Overdue':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-yellow-500/10 text-yellow-500'
    }
  }

  const getReviewTypeIcon = (type: string) => {
    switch (type) {
      case 'Annual':
        return <Calendar className="w-4 h-4" />
      case 'Quarterly':
        return <BarChart2 className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus
    const matchesType = selectedType === 'all' || review.reviewType === selectedType

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-white">Performance Reviews</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Types</option>
              <option value="Annual">Annual</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#151524] rounded-lg p-4 hover:bg-[#1c1c2e] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={review.employeeAvatar}
                    alt={review.employeeName}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{review.employeeName}</h3>
                  <p className="text-sm text-gray-400">{review.role} • {review.department}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      {getReviewTypeIcon(review.reviewType)}
                      <span>{review.reviewType} Review</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    {review.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-400">{review.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  Due {new Date(review.dueDate).toLocaleDateString()}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No reviews found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
} 