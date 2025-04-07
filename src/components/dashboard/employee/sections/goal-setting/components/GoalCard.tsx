'use client'

import { format } from 'date-fns'
import { 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Star,
  StarHalf,
  StarOff
} from 'lucide-react'
import { Goal, GoalStatus, GoalPriority } from '@/models/performance'

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

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  return (
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
} 