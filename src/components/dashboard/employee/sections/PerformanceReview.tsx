'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  Star, 
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Send,
  ThumbsUp,
  Search,
  Filter,
  User,
  Target,
  Download
} from 'lucide-react'
import { Goal, Rating, GoalStatus } from '@/models/performance'

interface Employee {
  id: string
  name: string
  role: string
  department: string
}

interface Manager {
  id: string
  name: string
  role: string
  department: string
}

// Sample data for demonstration
const sampleEmployee: Employee = {
  id: '101',
  name: 'John Smith',
  role: 'Senior Developer',
  department: 'Engineering'
}

const sampleManager: Manager = {
  id: '201',
  name: 'Sarah Johnson',
  role: 'Engineering Manager',
  department: 'Engineering'
}

const sampleGoals: Goal[] = [
  {
    goalId: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    description: "Improve Team Productivity\nIncrease team output by 25% through process optimization and better resource allocation",
    status: GoalStatus.APPROVED,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date('2024-12-31'),
    progress: 75,
    category: 'Team Management',
    tags: ['productivity', 'optimization'],
    priority: 'high'
  },
  {
    goalId: '2',
    employeeId: '101',
    employeeName: 'John Doe',
    description: "Enhance Technical Skills\nComplete advanced training in React and TypeScript",
    status: GoalStatus.APPROVED,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date('2024-09-30'),
    progress: 60,
    category: 'Professional Development',
    tags: ['technical', 'training'],
    priority: 'medium'
  },
  {
    goalId: '3',
    employeeId: '101',
    employeeName: 'John Doe',
    description: "Improve Documentation\nCreate comprehensive documentation for all major features",
    status: GoalStatus.APPROVED,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date('2024-06-30'),
    progress: 40,
    category: 'Documentation',
    tags: ['documentation', 'process'],
    priority: 'low'
  }
]

const sampleRatings: Record<string, Rating> = {
  '1': {
    ratingId: '1',
    goalId: '1',
    employeeRating: 4,
    managerRating: 5,
    feedback: "Excellent work on improving team productivity. The new processes have significantly increased output.",
    submittedAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  },
  '2': {
    ratingId: '2',
    goalId: '2',
    employeeRating: 5,
    managerRating: 4,
    feedback: "Great job on customer satisfaction. The new support protocols have been very effective.",
    submittedAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  },
  '3': {
    ratingId: '3',
    goalId: '3',
    employeeRating: 3,
    managerRating: 3,
    feedback: "Project delivery was on track but faced some challenges. Good recovery plan implementation.",
    submittedAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12')
  }
}

export function PerformanceReview() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.PENDING:
        return 'bg-yellow-500/10 text-yellow-400'
      case GoalStatus.APPROVED:
        return 'bg-green-500/10 text-green-400'
      case GoalStatus.REJECTED:
        return 'bg-red-500/10 text-red-400'
      default:
        return 'bg-gray-500/10 text-gray-400'
    }
  }

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.PENDING:
        return <Clock className="w-4 h-4" />
      case GoalStatus.APPROVED:
        return <CheckCircle className="w-4 h-4" />
      case GoalStatus.REJECTED:
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredGoals = sampleGoals.filter(goal => {
    const matchesSearch = goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Add sorting functionality
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    // Sort by status (Rejected first, then Pending, then Approved)
    const statusOrder = { [GoalStatus.REJECTED]: 0, [GoalStatus.PENDING]: 1, [GoalStatus.APPROVED]: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const handleDownloadReview = () => {
    // Simulate downloading the performance review
    console.log('Downloading performance review...')
  }

  if (selectedGoal) {
    const rating = sampleRatings[selectedGoal.goalId]
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedGoal(null)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
              <Star className="w-5 h-5 text-[#6c47ff]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Performance Review</h1>
              <p className="text-gray-400 mt-1">View your performance assessment</p>
            </div>
          </div>
        </div>

        <div className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50">
          {/* Employee Info */}
          <div className="p-8 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#6c47ff]/10 rounded-lg">
                  <User className="w-6 h-6 text-[#6c47ff]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{sampleEmployee.name}</h2>
                  <p className="text-gray-400">{sampleEmployee.role} • {sampleEmployee.department}</p>
                </div>
              </div>
              <button
                onClick={handleDownloadReview}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] text-white rounded-lg hover:bg-[#2d3748] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Review
              </button>
            </div>
          </div>

          {/* Goal Details */}
          <div className="p-8 border-b border-gray-800/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {selectedGoal.description.split('\n')[0]}
                </h3>
                <p className="text-gray-400 text-lg mb-6">
                  {selectedGoal.description.split('\n').slice(1).join('\n')}
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Due {selectedGoal.createdAt.toLocaleDateString()}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedGoal.status)} flex items-center gap-1`}>
                    {getStatusIcon(selectedGoal.status)}
                    {selectedGoal.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="p-8 space-y-8">
            {/* Self Rating */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Self Assessment</h4>
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-5 h-5 text-green-400" />
                <span className="text-white">Your Rating: {rating.employeeRating}/5</span>
              </div>
              <p className="text-gray-400">{rating.feedback}</p>
            </div>

            {/* Manager Rating */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Manager Assessment</h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#1E293B] rounded-lg">
                    <User className="w-5 h-5 text-[#6c47ff]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{sampleManager.name}</p>
                    <p className="text-sm text-gray-400">{sampleManager.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Rating: {rating.managerRating}/5</span>
                </div>
              </div>
              <p className="text-gray-400">{rating.feedback}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <Star className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Performance Review</h1>
            <p className="text-gray-400 mt-1">View your performance assessments and feedback</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          >
            <option value="all">All Status</option>
            <option value={GoalStatus.PENDING}>Pending</option>
            <option value={GoalStatus.APPROVED}>Approved</option>
            <option value={GoalStatus.REJECTED}>Rejected</option>
          </select>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid gap-6">
        {sortedGoals.map((goal) => {
          const rating = sampleRatings[goal.goalId]
          return (
            <div
              key={goal.goalId}
              className="bg-[#151524] rounded-lg overflow-hidden border border-gray-800/50 hover:border-[#6c47ff]/30 transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedGoal(goal)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">
                      {goal.description.split('\n')[0]}
                    </h2>
                    <p className="text-gray-400 line-clamp-2">
                      {goal.description.split('\n').slice(1).join('\n')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)} flex items-center gap-1`}>
                    {getStatusIcon(goal.status)}
                    {goal.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due {goal.createdAt.toLocaleDateString()}
                  </span>
                </div>

                {/* Ratings Summary */}
                {rating && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] rounded-lg">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white">Your Rating: {rating.employeeRating}/5</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white">Manager Rating: {rating.managerRating}/5</span>
                    </div>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <div className="p-4 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedGoal(goal)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3dd8] transition-colors"
                >
                  <Target className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {sortedGoals.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1E293B] mb-4">
            <AlertTriangle className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No goals found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
} 