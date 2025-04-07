'use client'

import { useEffect } from 'react'
import { 
  Target, 
  FileText,
  Calendar as CalendarIcon,
  AlertCircle,
  LayoutGrid,
  Tag,
  X,
  Plus,
  Save,
  Loader2,
  ChevronDown
} from 'lucide-react'
import { GoalPriority } from '@/models/performance'
import { cn } from '@/lib/utils'

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

export function GoalForm({ 
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
}: GoalFormProps) {
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