'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  Users,
  BarChart,
  History,
  FileText,
  Scale,
  Search,
  Filter,
  ChevronDown,
  Star,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Equal
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  role: string
  department: string
  selfRating: number
  managerRating: number
  status: 'pending' | 'completed' | 'overdue'
  lastUpdated: Date
}

interface RatingHistory {
  id: string
  employeeId: string
  period: string
  selfRating: number
  managerRating: number
  feedback: string
  createdAt: Date
}

interface FeedbackTemplate {
  id: string
  category: string
  questions: string[]
  suggestions: string[]
}

export function ManagerRating() {
  const [view, setView] = useState<'overview' | 'comparison' | 'history' | 'templates' | 'calibration'>('overview')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([])
  const [feedbackTemplates, setFeedbackTemplates] = useState<FeedbackTemplate[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    // Simulate fetching data
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        role: 'Senior Developer',
        department: 'Engineering',
        selfRating: 4.5,
        managerRating: 4.0,
        status: 'completed',
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Product Manager',
        department: 'Product',
        selfRating: 4.0,
        managerRating: 4.2,
        status: 'pending',
        lastUpdated: new Date()
      }
    ]

    const mockHistory: RatingHistory[] = [
      {
        id: '1',
        employeeId: '1',
        period: 'Q1 2024',
        selfRating: 4.5,
        managerRating: 4.0,
        feedback: 'Strong performance in Q1',
        createdAt: new Date()
      }
    ]

    const mockTemplates: FeedbackTemplate[] = [
      {
        id: '1',
        category: 'Technical Skills',
        questions: [
          'How has the employee demonstrated technical growth?',
          'What areas need improvement?'
        ],
        suggestions: [
          'Provide specific examples of technical achievements',
          'Suggest relevant training or certifications'
        ]
      }
    ]

    setEmployees(mockEmployees)
    setRatingHistory(mockHistory)
    setFeedbackTemplates(mockTemplates)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getRatingTrend = (selfRating: number, managerRating: number) => {
    if (selfRating > managerRating) {
      return <TrendingUp className="w-5 h-5 text-green-500" />
    } else if (selfRating < managerRating) {
      return <TrendingDown className="w-5 h-5 text-red-500" />
    } else {
      return <Equal className="w-5 h-5 text-gray-500" />
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-none flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-[#151524] border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <Star className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Manager Ratings</h1>
            <p className="text-gray-400 mt-1">Review and manage employee ratings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('overview')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              view === 'overview'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            Team Overview
          </button>
          <button
            onClick={() => setView('comparison')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              view === 'comparison'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <BarChart className="w-5 h-5" />
            Comparison
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              view === 'history'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-5 h-5" />
            History
          </button>
          <button
            onClick={() => setView('templates')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              view === 'templates'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            Templates
          </button>
          <button
            onClick={() => setView('calibration')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              view === 'calibration'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <Scale className="w-5 h-5" />
            Calibration
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] w-full"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {view === 'overview' && (
              <div className="grid gap-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-[#151524] rounded-lg border border-gray-800/50 p-4"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">{employee.name}</h3>
                          <p className="text-sm text-gray-400">{employee.role} - {employee.department}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(employee.status)}
                          <span className="text-sm text-gray-400">
                            Last updated: {format(new Date(employee.lastUpdated), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#1E293B] rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Self Rating</h4>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-xl font-semibold text-white">{employee.selfRating}</span>
                          </div>
                        </div>
                        <div className="bg-[#1E293B] rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Manager Rating</h4>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#6c47ff]" />
                            <span className="text-xl font-semibold text-white">{employee.managerRating}</span>
                            {getRatingTrend(employee.selfRating, employee.managerRating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'comparison' && (
              <div className="bg-[#151524] rounded-lg border border-gray-800/50 p-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Rating Distribution</h4>
                    {filteredEmployees.map((employee) => (
                      <div key={employee.id} className="flex flex-col gap-2">
                        <span className="text-sm text-white">{employee.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-[#1E293B] rounded-full">
                            <div
                              className="h-full bg-[#6c47ff] rounded-full"
                              style={{ width: `${(employee.managerRating / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400">{employee.managerRating}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Rating Gaps</h4>
                    {filteredEmployees.map((employee) => (
                      <div key={employee.id} className="flex flex-col gap-2">
                        <span className="text-sm text-white">{employee.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-[#1E293B] rounded-full">
                            <div
                              className="h-full bg-[#6c47ff] rounded-full"
                              style={{ width: `${Math.abs(employee.selfRating - employee.managerRating) * 20}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400">
                            {Math.abs(employee.selfRating - employee.managerRating).toFixed(1)} points
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === 'history' && (
              <div className="space-y-4">
                {ratingHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#151524] rounded-lg border border-gray-800/50 p-4"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">{entry.period}</h3>
                        <span className="text-sm text-gray-400">
                          {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#1E293B] rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Self Rating</h4>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-xl font-semibold text-white">{entry.selfRating}</span>
                          </div>
                        </div>
                        <div className="bg-[#1E293B] rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Manager Rating</h4>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#6c47ff]" />
                            <span className="text-xl font-semibold text-white">{entry.managerRating}</span>
                            {getRatingTrend(entry.selfRating, entry.managerRating)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Feedback</h4>
                        <p className="text-sm text-gray-400">{entry.feedback}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'templates' && (
              <div className="grid gap-4">
                {feedbackTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-[#151524] rounded-lg border border-gray-800/50 p-4"
                  >
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-medium text-white">{template.category}</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Questions</h4>
                          <ul className="space-y-2">
                            {template.questions.map((question, index) => (
                              <li key={index} className="text-sm text-gray-400">
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Suggestions</h4>
                          <ul className="space-y-2">
                            {template.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-gray-400">
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'calibration' && (
              <div className="bg-[#151524] rounded-lg border border-gray-800/50 p-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Rating Distribution</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#1E293B] rounded-full">
                        <div
                          className="h-full bg-[#6c47ff] rounded-full"
                          style={{ width: '60%' }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">60% within range</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Outliers</h4>
                    {filteredEmployees
                      .filter(employee => Math.abs(employee.selfRating - employee.managerRating) > 1)
                      .map((employee) => (
                        <div key={employee.id} className="flex flex-col gap-2">
                          <span className="text-sm text-white">{employee.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#1E293B] rounded-full">
                              <div
                                className="h-full bg-[#6c47ff] rounded-full"
                                style={{ width: `${Math.abs(employee.selfRating - employee.managerRating) * 20}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400">
                              {Math.abs(employee.selfRating - employee.managerRating).toFixed(1)} points
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}