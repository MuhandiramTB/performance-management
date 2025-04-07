'use client'

import { Target } from 'lucide-react'

interface EmptyStateProps {
  searchTerm: string
  selectedStatus: string
  selectedCategory: string
  setSearchTerm: (term: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedCategory: (category: string) => void
}

export function EmptyState({ 
  searchTerm, 
  selectedStatus, 
  selectedCategory, 
  setSearchTerm, 
  setSelectedStatus, 
  setSelectedCategory 
}: EmptyStateProps) {
  return (
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
          Clear Filters
        </button>
      )}
    </div>
  )
} 