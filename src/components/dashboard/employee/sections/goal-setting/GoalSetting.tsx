'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Goal, GoalStatus, GoalPriority } from '@/models/performance'
import { toast } from 'react-hot-toast'
import { GoalSettingHeader } from './components/GoalSettingHeader'
import { GoalFilters } from './components/GoalFilters'
import { GoalForm } from './components/GoalForm'
import { GoalsListView } from './components/GoalsListView'
import { TimelineView } from './components/TimelineView'

interface GoalFormData {
  title: string
  description: string
  dueDate: string
  priority: GoalPriority
  category: string
  tags: string[]
  progress: number
}

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

      if (response.status === 401) {
        window.location.href = '/login'
        return
      }

      let responseData
      try {
        responseData = await response.json()
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`Failed to create goal: ${response.statusText}`)
        }
      }

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to create goal')
      }

      const createdGoal = responseData || {
        ...newGoal,
        goalId: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setGoals(prevGoals => [...prevGoals, createdGoal])
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