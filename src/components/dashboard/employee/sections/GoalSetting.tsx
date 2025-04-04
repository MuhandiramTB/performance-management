'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  Target, 
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
  Plus,
  Tag,
  FileText,
  CheckCircle2,
  X,
  Edit,
  Trash2,
  Save,
  Loader2,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  AlertCircle,
  CheckCircle as CheckCircleIcon,
  Star,
  StarHalf,
  StarOff,
  LayoutGrid,
  RefreshCw
} from 'lucide-react'
import { Goal, GoalStatus, GoalPriority } from '@/models/performance'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useAuth } from '@/contexts/AuthContext'

// Goal templates for quick creation
const goalTemplates = [
  {
    id: 'template-1',
    title: 'Project Completion',
    description: 'Complete [Project Name] by [Date] with [Specific Deliverables]',
    category: 'Project Management'
  },
  {
    id: 'template-2',
    title: 'Skill Development',
    description: 'Master [Skill Name] by completing [Course/Certification] by [Date]',
    category: 'Professional Development'
  },
  {
    id: 'template-3',
    title: 'Performance Improvement',
    description: 'Improve [Metric] by [Percentage] by [Date] through [Specific Actions]',
    category: 'Performance'
  },
  {
    id: 'template-4',
    title: 'Team Collaboration',
    description: 'Collaborate with [Team/Department] to achieve [Specific Outcome] by [Date]',
    category: 'Teamwork'
  }
]

// Goal categories for organization
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

interface GoalFormData {
  title: string
  description: string
  dueDate: string
  priority: GoalPriority
  category: string
  tags: string[]
  progress: number
}

interface GoalFormProps {
  showForm: boolean
  setShowForm: (show: boolean) => void
  formData: GoalFormData
  setFormData: (data: GoalFormData) => void
  handleSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  selectedTemplate: string | null
  setSelectedTemplate: (id: string | null) => void
  tagInput: string
  setTagInput: (tag: string) => void
  handleAddTag: () => void
  handleRemoveTag: (tag: string) => void
}

// Utility functions for styling
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

const getPriorityColor = (priority: GoalPriority) => {
  switch (priority) {
    case GoalPriority.HIGH:
      return 'bg-red-500/10 text-red-400'
    case GoalPriority.MEDIUM:
      return 'bg-yellow-500/10 text-yellow-400'
    case GoalPriority.LOW:
      return 'bg-green-500/10 text-green-400'
    default:
      return 'bg-gray-500/10 text-gray-400'
  }
}

const getPriorityIcon = (priority: GoalPriority) => {
  switch (priority) {
    case GoalPriority.HIGH:
      return <AlertCircle className="w-4 h-4" />
    case GoalPriority.MEDIUM:
      return <StarHalf className="w-4 h-4" />
    case GoalPriority.LOW:
      return <StarOff className="w-4 h-4" />
    default:
      return <Star className="w-4 h-4" />
  }
}

const getProgressColor = (progress: number) => {
  if (progress >= 75) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-red-500'
}

// Component for the header section
const GoalSettingHeader = ({ 
  viewMode, 
  setViewMode, 
  setShowForm 
}: { 
  viewMode: 'list' | 'timeline', 
  setViewMode: (mode: 'list' | 'timeline') => void, 
  setShowForm: (show: boolean) => void 
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-white">Goal Setting</h2>
      <p className="text-gray-400">Set and track your performance goals</p>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setViewMode(viewMode === 'list' ? 'timeline' : 'list')}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-800 bg-[#1E293B] text-white hover:bg-[#2d3748] h-10 px-4 py-2"
      >
        {viewMode === 'list' ? (
          <>
            <BarChart3 className="mr-2 h-4 w-4" />
            Timeline View
          </>
        ) : (
          <>
            <LayoutGrid className="mr-2 h-4 w-4" />
            List View
          </>
        )}
      </button>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#6c47ff] text-white hover:bg-[#5a3dd8] h-10 px-4 py-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Goal
      </button>
    </div>
  </div>
)

// Component for the filters section
const GoalFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedStatus, 
  setSelectedStatus, 
  selectedCategory, 
  setSelectedCategory 
}: { 
  searchTerm: string, 
  setSearchTerm: (term: string) => void, 
  selectedStatus: string, 
  setSelectedStatus: (status: string) => void, 
  selectedCategory: string, 
  setSelectedCategory: (category: string) => void 
}) => (
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

const GoalForm: React.FC<GoalFormProps> = ({ 
  showForm, 
  setShowForm, 
  formData, 
  setFormData, 
  handleSubmit, 
  isSubmitting, 
  selectedTemplate, 
  setSelectedTemplate, 
  tagInput, 
  setTagInput, 
  handleAddTag, 
  handleRemoveTag 
}) => {
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showForm])

  if (!showForm) return null

  const handleTemplateSelect = (templateId: string) => {
    const template = goalTemplates.find(t => t.id === templateId)
    if (template) {
      setFormData({
        ...formData,
        title: template.title,
        description: template.description,
        category: template.category
      })
      setSelectedTemplate(templateId)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(e)
  }

  return (
    <div className="fixed inset-0 z-[9999]" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" onClick={() => setShowForm(false)} />
      <div className="fixed left-[25%] top-[15%] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#151524] rounded-lg shadow-xl my-4">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-800 bg-[#151524] p-6 rounded-t-lg">
              <h3 className="text-xl font-semibold text-white">Create New Goal</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Goal Templates */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400">Goal Templates</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {goalTemplates.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template.id)}
                        className={cn(
                          "flex flex-col items-start p-4 rounded-lg border text-left transition-all hover:shadow-md",
                          selectedTemplate === template.id
                            ? "border-[#6c47ff] bg-[#6c47ff]/10 shadow-[#6c47ff]/10"
                            : "border-gray-800 hover:bg-gray-800/50"
                        )}
                      >
                        <span className="font-medium text-white">{template.title}</span>
                        <span className="mt-1 text-xs text-gray-400">{template.category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Goal Title
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-shadow"
                        placeholder="Enter a clear, concise title for your goal"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent min-h-[120px] transition-shadow resize-y"
                        placeholder="Describe your goal in detail..."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        Due Date
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-shadow [&::-webkit-calendar-picker-indicator]:bg-white/10 [&::-webkit-calendar-picker-indicator]:hover:bg-white/20 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        Priority
                      </label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value as GoalPriority })}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-shadow appearance-none cursor-pointer"
                        >
                          <option value={GoalPriority.LOW}>Low</option>
                          <option value={GoalPriority.MEDIUM}>Medium</option>
                          <option value={GoalPriority.HIGH}>High</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Category
                    </label>
                    <div className="relative">
                      <LayoutGrid className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-shadow appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select a category</option>
                        {goalCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Tags
                    </label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-lg border border-gray-800 bg-[#1E293B] px-3 py-1 text-sm text-white"
                          >
                            <Tag className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 rounded-full p-0.5 hover:bg-gray-700 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-shadow"
                            placeholder="Add tags and press Enter"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-2.5 bg-[#1E293B] border border-gray-800 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          <Plus className="h-5 w-5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      Initial Progress
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6c47ff] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#6c47ff] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>0%</span>
                        <span>{formData.progress}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-50 flex items-center justify-end gap-3 border-t border-gray-800 bg-[#151524] p-6 rounded-b-lg">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3dd8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Submit Goal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for the empty state
const EmptyState = ({ 
  searchTerm, 
  selectedStatus, 
  selectedCategory, 
  setSearchTerm, 
  setSelectedStatus, 
  setSelectedCategory 
}: { 
  searchTerm: string, 
  selectedStatus: string, 
  selectedCategory: string, 
  setSearchTerm: (term: string) => void, 
  setSelectedStatus: (status: string) => void, 
  setSelectedCategory: (category: string) => void 
}) => (
  <div className="flex flex-col items-center justify-center p-8 border border-gray-800 rounded-lg bg-[#151524]">
    <Target className="h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium mb-1 text-white">No goals found</h3>
    <p className="text-gray-400 text-center mb-4">
      {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
        ? "No goals match your current filters. Try adjusting your search criteria."
        : "You haven't created any goals yet. Click the 'New Goal' button to get started."}
    </p>
    {(searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all') && (
      <button
        onClick={() => {
          setSearchTerm('')
          setSelectedStatus('all')
          setSelectedCategory('all')
        }}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-800 bg-[#1E293B] text-white hover:bg-[#2d3748] h-9 px-4 py-2"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Clear Filters
      </button>
    )}
  </div>
)

// Component for a single goal card in list view
const GoalCard = ({ goal }: { goal: Goal }) => (
  <div className="rounded-lg border border-gray-800 bg-[#151524] text-white shadow-sm">
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold leading-none tracking-tight">{goal.description.split('\n')[0]}</h3>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(goal.status)}`}>
              {getStatusIcon(goal.status)}
              <span className="ml-1">{goal.status}</span>
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(goal.priority || GoalPriority.MEDIUM)}`}>
              {getPriorityIcon(goal.priority || GoalPriority.MEDIUM)}
              <span className="ml-1">{goal.priority || GoalPriority.MEDIUM}</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">{goal.description.split('\n').slice(1).join('\n')}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {goal.category && (
              <span className="inline-flex items-center rounded-full border border-gray-800 bg-[#1E293B] px-2.5 py-0.5 text-xs font-semibold text-white">
                {goal.category}
              </span>
            )}
            {goal.tags && goal.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-gray-800 bg-[#1E293B] px-2.5 py-0.5 text-xs font-semibold text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Due: {format(new Date(goal.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="w-full sm:w-32">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-400">{goal.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(goal.progress || 0)}`}
                style={{ width: `${goal.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Component for a single goal card in timeline view
const TimelineGoalCard = ({ goal }: { goal: Goal }) => (
  <div className="relative pl-8 pb-6 last:pb-0">
    <div className="absolute left-0 top-0 h-full w-px bg-gray-800" />
    <div className="absolute left-0 top-0 h-4 w-4 rounded-full border-2 border-[#151524] bg-[#6c47ff]" />
    
    <div className="rounded-lg border border-gray-800 bg-[#1E293B] p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <h4 className="font-medium">{goal.description.split('\n')[0]}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(goal.status)}`}>
              {getStatusIcon(goal.status)}
              <span className="ml-1">{goal.status}</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            {format(new Date(goal.dueDate), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-gray-400">{goal.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(goal.progress || 0)}`}
            style={{ width: `${goal.progress || 0}%` }}
          />
        </div>
      </div>
    </div>
  </div>
)

// Component for the goals list view
const GoalsListView = ({ 
  filteredGoals, 
  searchTerm, 
  selectedStatus, 
  selectedCategory, 
  setSearchTerm, 
  setSelectedStatus, 
  setSelectedCategory 
}: { 
  filteredGoals: Goal[], 
  searchTerm: string, 
  selectedStatus: string, 
  selectedCategory: string, 
  setSearchTerm: (term: string) => void, 
  setSelectedStatus: (status: string) => void, 
  setSelectedCategory: (category: string) => void 
}) => (
  <div className="space-y-4">
    {filteredGoals.length === 0 ? (
      <EmptyState 
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        setSearchTerm={setSearchTerm}
        setSelectedStatus={setSelectedStatus}
        setSelectedCategory={setSelectedCategory}
      />
    ) : (
      filteredGoals.map(goal => (
        <GoalCard key={`goal-${goal.goalId}`} goal={goal} />
      ))
    )}
  </div>
)

// Component for the timeline view
const TimelineView = ({ filteredGoals }: { filteredGoals: Goal[] }) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-gray-800 bg-[#151524] text-white shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Goal Timeline</h3>
      <div className="space-y-6">
        {filteredGoals.map(goal => (
          <TimelineGoalCard key={`timeline-${goal.goalId}`} goal={goal} />
        ))}
      </div>
    </div>
  </div>
)

// Main component
export function GoalSetting() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: GoalPriority.MEDIUM,
    category: '',
    tags: [],
    progress: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
  const [tagInput, setTagInput] = useState('')
  const [goals, setGoals] = useState<Goal[]>([])

  // Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return
      
      try {
        const response = await fetch(`/api/goals/employee/${user.id}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login'
            return
          }
          throw new Error('Failed to fetch goals')
        }
        
        const data = await response.json()
        setGoals(data)
      } catch (error) {
        console.error('Failed to fetch goals:', error)
        toast.error('Failed to load goals')
      }
    }

    fetchGoals()
  }, [user])

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error('Title is required')
        setIsSubmitting(false)
        return
      }
      if (!formData.description.trim()) {
        toast.error('Description is required')
        setIsSubmitting(false)
        return
      }
      if (!formData.dueDate) {
        toast.error('Due date is required')
        setIsSubmitting(false)
        return
      }
      if (!formData.category) {
        toast.error('Category is required')
        setIsSubmitting(false)
        return
      }

      // Validate deadline is a future date
      const deadlineDate = new Date(formData.dueDate)
      if (deadlineDate <= new Date()) {
        toast.error('Deadline must be a future date')
        setIsSubmitting(false)
        return
      }

      const newGoal = {
        employeeId: user?.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: deadlineDate.toISOString(),
        priority: formData.priority,
        category: formData.category,
        tags: formData.tags,
        progress: formData.progress || 0,
        status: GoalStatus.PENDING
      }
      
      const response = await fetch('/api/goals/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newGoal),
      })

      // Handle authentication error
      if (response.status === 401) {
        window.location.href = '/login'
        return
      }

      let responseData
      try {
        // Try to parse the response as JSON
        responseData = await response.json()
      } catch (parseError) {
        // If parsing fails, handle it based on the response status
        if (!response.ok) {
          throw new Error(`Failed to create goal: ${response.statusText}`)
        }
      }

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to create goal')
      }

      // If we have valid response data, use it, otherwise create a default goal object
      const createdGoal = responseData || {
        ...newGoal,
        goalId: Date.now().toString(), // Temporary ID if not provided by server
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setGoals(prevGoals => [...prevGoals, createdGoal])
      setShowForm(false)
      
      // Reset form data
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: GoalPriority.MEDIUM,
        category: '',
        tags: [],
        progress: 0
      })
      setSelectedTemplate(null)
      toast.success('Goal submitted successfully')
    } catch (error) {
      console.error('Failed to submit goal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit goal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || goal.category === selectedCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-6">
      <GoalSettingHeader 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        setShowForm={setShowForm} 
      />
      
      <GoalFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        selectedStatus={selectedStatus} 
        setSelectedStatus={setSelectedStatus} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      
      <GoalForm 
        showForm={showForm} 
        setShowForm={setShowForm} 
        formData={formData} 
        setFormData={setFormData} 
        handleSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        selectedTemplate={selectedTemplate} 
        setSelectedTemplate={setSelectedTemplate} 
        tagInput={tagInput} 
        setTagInput={setTagInput} 
        handleAddTag={handleAddTag} 
        handleRemoveTag={handleRemoveTag} 
      />
      
      {viewMode === 'list' ? (
        <GoalsListView 
          filteredGoals={filteredGoals} 
          searchTerm={searchTerm} 
          selectedStatus={selectedStatus} 
          selectedCategory={selectedCategory} 
          setSearchTerm={setSearchTerm} 
          setSelectedStatus={setSelectedStatus} 
          setSelectedCategory={setSelectedCategory} 
        />
      ) : (
        <TimelineView filteredGoals={filteredGoals} />
      )}
    </div>
  )
}