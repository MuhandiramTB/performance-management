'use client'

import { useState } from 'react'
import { Search, Filter, ChevronRight, Calendar, Users, Clock, AlertCircle, BarChart2, CheckCircle2, XCircle } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled'
  priority: 'High' | 'Medium' | 'Low'
  startDate: string
  endDate: string
  progress: number
  team: {
    name: string
    avatar: string
    role: string
  }[]
  tasks: {
    total: number
    completed: number
    overdue: number
  }
  budget: {
    allocated: number
    spent: number
    currency: string
  }
}

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')

  // Mock data - replace with actual data from your backend
  const projects: Project[] = [
    {
      id: 1,
      title: 'Customer Portal Redesign',
      description: 'Modernize the customer portal with improved UX and new features',
      status: 'In Progress',
      priority: 'High',
      startDate: '2024-03-01',
      endDate: '2024-04-15',
      progress: 65,
      team: [
        {
          name: 'Sarah Wilson',
          avatar: '/avatars/sarah.jpg',
          role: 'Lead Designer'
        },
        {
          name: 'Michael Chen',
          avatar: '/avatars/michael.jpg',
          role: 'Frontend Developer'
        }
      ],
      tasks: {
        total: 24,
        completed: 16,
        overdue: 2
      },
      budget: {
        allocated: 50000,
        spent: 32500,
        currency: 'USD'
      }
    },
    // Add more mock projects here
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-500'
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500'
      case 'On Hold':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'Cancelled':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-purple-500/10 text-purple-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-500'
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'Low':
        return 'bg-green-500/10 text-green-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || project.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
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
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#151524] rounded-lg p-4 hover:bg-[#1c1c2e] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-white">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6c47ff] rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>Team</span>
                    </div>
                    <div className="flex -space-x-2 mt-2">
                      {project.team.map((member, index) => (
                        <div key={index} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full ring-2 ring-[#151524]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BarChart2 className="w-4 h-4" />
                      <span>Tasks</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-white">{project.tasks.completed}/{project.tasks.total}</span>
                      </div>
                      {project.tasks.overdue > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">{project.tasks.overdue} overdue</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Timeline</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-white">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Budget</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-white">
                        {project.budget.spent.toLocaleString()} / {project.budget.allocated.toLocaleString()} {project.budget.currency}
                      </div>
                      <div className="w-full h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-[#6c47ff] rounded-full"
                          style={{ width: `${(project.budget.spent / project.budget.allocated) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No projects found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
} 