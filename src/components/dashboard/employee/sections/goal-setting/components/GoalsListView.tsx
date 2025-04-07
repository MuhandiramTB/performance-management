'use client'

import { Goal } from '@/models/performance'
import { EmptyState } from './EmptyState'
import { GoalCard } from './GoalCard'

interface GoalsListViewProps {
  filteredGoals: Goal[]
  searchTerm: string
  selectedStatus: string
  selectedCategory: string
  setSearchTerm: (term: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedCategory: (category: string) => void
}

export function GoalsListView({ 
  filteredGoals, 
  searchTerm, 
  selectedStatus, 
  selectedCategory, 
  setSearchTerm, 
  setSelectedStatus, 
  setSelectedCategory 
}: GoalsListViewProps) {
  return (
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
} 