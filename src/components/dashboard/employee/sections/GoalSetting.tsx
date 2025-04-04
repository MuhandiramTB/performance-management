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

// Component for the goal form
const GoalForm = ({ 
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
}: { 
  showForm: boolean, 
  setShowForm: (show: boolean) => void, 
  formData: GoalFormData, 
  setFormData: (data: GoalFormData) => void, 
  handleSubmit: (e: React.FormEvent) => void, 
  isSubmitting: boolean, 
  selectedTemplate: string | null, 
  setSelectedTemplate: (id: string | null) => void, 
  tagInput: string, 
  setTagInput: (tag: string) => void, 
  handleAddTag: () => void, 
  handleRemoveTag: (tag: string) => void 
}) => {
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

  return (
    <div className="rounded-lg border border-gray-800 bg-[#151524] text-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Create New Goal</h3>
          <button
            onClick={() => setShowForm(false)}
            className="rounded-full p-1 hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Templates */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Goal Templates</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-md border text-left transition-colors",
                    selectedTemplate === template.id
                      ? "border-[#6c47ff] bg-[#6c47ff]/10"
                      : "border-gray-800 hover:bg-gray-800"
                  )}
                >
                  <span className="font-medium">{template.title}</span>
                  <span className="text-xs text-gray-400">{template.category}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Goal Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-400">Goal Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
              placeholder="Enter a clear, concise title for your goal"
              required
            />
          </div>
          
          {/* Goal Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-400">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="flex min-h-[120px] w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
              placeholder="Describe your goal in detail. What do you want to achieve? How will you measure success?"
              required
            />
          </div>
          
          {/* Due Date and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-400">Due Date</label>
              <div className="relative">
                <input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
                  required
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium text-gray-400">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as GoalPriority })}
                className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
              >
                <option value={GoalPriority.LOW}>Low</option>
                <option value={GoalPriority.MEDIUM}>Medium</option>
                <option value={GoalPriority.HIGH}>High</option>
              </select>
            </div>
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-400">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
              required
            >
              <option value="">Select a category</option>
              {goalCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-gray-400">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-gray-800 bg-[#1E293B] px-2.5 py-0.5 text-xs font-semibold text-white"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full p-0.5 hover:bg-gray-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex h-10 w-full rounded-md border border-gray-800 bg-[#1E293B] px-3 py-2 text-sm text-white placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff]"
                placeholder="Add tags and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-800 bg-[#1E293B] text-white hover:bg-[#2d3748] h-10 px-4 py-2"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <label htmlFor="progress" className="text-sm font-medium text-gray-400">Initial Progress</label>
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>{formData.progress}%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-800 bg-[#1E293B] text-white hover:bg-[#2d3748] h-10 px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#6c47ff] text-white hover:bg-[#5a3dd8] h-10 px-4 py-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Goal
                </>
              )}
            </button>
          </div>
        </form>
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
      try {
        // Replace with actual API call
        const response = await fetch('/api/goals')
        if (response.ok) {
          const data = await response.json()
          setGoals(data)
        }
      } catch (error) {
        console.error('Failed to fetch goals:', error)
      }
    }

    fetchGoals()
  }, [])

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
      // Replace with actual API call
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dueDate: new Date(formData.dueDate),
          status: GoalStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      })
      
      if (response.ok) {
        const newGoal = await response.json()
        setGoals([...goals, newGoal])
        setShowForm(false)
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
      }
    } catch (error) {
      console.error('Failed to create goal:', error)
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