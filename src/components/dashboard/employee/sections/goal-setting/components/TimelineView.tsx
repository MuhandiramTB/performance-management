'use client'

import { Goal } from '@/models/performance'
import { TimelineGoalCard } from './TimelineGoalCard'

interface TimelineViewProps {
  filteredGoals: Goal[]
}

export function TimelineView({ filteredGoals }: TimelineViewProps) {
  return (
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
} 