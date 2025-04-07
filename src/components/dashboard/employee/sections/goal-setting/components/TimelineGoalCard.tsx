'use client'

import { format } from 'date-fns'
import { 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Goal, GoalStatus } from '@/models/performance'

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

const getProgressColor = (progress: number) => {
  if (progress >= 75) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-red-500'
}

interface TimelineGoalCardProps {
  goal: Goal
}

export function TimelineGoalCard({ goal }: TimelineGoalCardProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#6c47ff]" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white">{goal.description.split('\n')[0]}</h4>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(goal.status)}`}>
              {getStatusIcon(goal.status)}
              <span className="ml-1">{goal.status}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(goal.dueDate), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-400">{goal.description.split('\n').slice(1).join('\n')}</p>
        <div className="mt-2">
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
} 