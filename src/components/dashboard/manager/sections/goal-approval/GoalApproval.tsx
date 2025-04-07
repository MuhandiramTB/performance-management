'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Goal, GoalStatus } from '@/models/performance'
import { toast } from 'react-hot-toast'
import { GoalApprovalHeader } from './components/GoalApprovalHeader'
import { GoalApprovalFilters } from './components/GoalApprovalFilters'
import { GoalApprovalCard } from './components/GoalApprovalCard'
import { GoalApprovalModal } from './components/GoalApprovalModal'

interface GoalApprovalProps {
  goals: Goal[]
  onGoalUpdate: (goal: Goal) => void
}

export function GoalApproval({ goals, onGoalUpdate }: GoalApprovalProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comment, setComment] = useState('')

  const handleApprove = async (goal: Goal) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/goals/${goal.goalId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: GoalStatus.APPROVED,
          comment,
          approvedBy: user?.id,
          approvedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve goal')
      }

      const updatedGoal = await response.json()
      onGoalUpdate(updatedGoal)
      setShowModal(false)
      setComment('')
      toast.success('Goal approved successfully')

      // Send notification to employee
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'GOAL_APPROVED',
          recipientId: goal.employeeId,
          senderId: user?.id,
          goalId: goal.goalId,
          message: `Your goal "${goal.title}" has been approved`,
        }),
      })
    } catch (error) {
      console.error('Failed to approve goal:', error)
      toast.error('Failed to approve goal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (goal: Goal) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/goals/${goal.goalId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: GoalStatus.REJECTED,
          comment,
          rejectedBy: user?.id,
          rejectedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject goal')
      }

      const updatedGoal = await response.json()
      onGoalUpdate(updatedGoal)
      setShowModal(false)
      setComment('')
      toast.success('Goal rejected successfully')

      // Send notification to employee
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'GOAL_REJECTED',
          recipientId: goal.employeeId,
          senderId: user?.id,
          goalId: goal.goalId,
          message: `Your goal "${goal.title}" has been rejected. Please review the comments and resubmit.`,
        }),
      })
    } catch (error) {
      console.error('Failed to reject goal:', error)
      toast.error('Failed to reject goal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestModification = async (goal: Goal) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/goals/${goal.goalId}/modify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: GoalStatus.PENDING,
          comment,
          modifiedBy: user?.id,
          modifiedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to request modification')
      }

      const updatedGoal = await response.json()
      onGoalUpdate(updatedGoal)
      setShowModal(false)
      setComment('')
      toast.success('Modification requested successfully')

      // Send notification to employee
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'GOAL_MODIFICATION_REQUESTED',
          recipientId: goal.employeeId,
          senderId: user?.id,
          goalId: goal.goalId,
          message: `Your goal "${goal.title}" requires modifications. Please review the comments and update accordingly.`,
        }),
      })
    } catch (error) {
      console.error('Failed to request modification:', error)
      toast.error('Failed to request modification')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    const matchesEmployee = selectedEmployee === 'all' || goal.employeeId === selectedEmployee
    return matchesSearch && matchesStatus && matchesEmployee
  })

  return (
    <div className="space-y-6">
      <GoalApprovalHeader />
      
      <GoalApprovalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
      
      <div className="space-y-4">
        {filteredGoals.map(goal => (
          <GoalApprovalCard
            key={goal.goalId}
            goal={goal}
            onApprove={() => {
              setSelectedGoal(goal)
              setShowModal(true)
            }}
            onReject={() => {
              setSelectedGoal(goal)
              setShowModal(true)
            }}
            onRequestModification={() => {
              setSelectedGoal(goal)
              setShowModal(true)
            }}
          />
        ))}
      </div>

      {selectedGoal && (
        <GoalApprovalModal
          show={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedGoal(null)
            setComment('')
          }}
          goal={selectedGoal}
          comment={comment}
          setComment={setComment}
          onApprove={() => handleApprove(selectedGoal)}
          onReject={() => handleReject(selectedGoal)}
          onRequestModification={() => handleRequestModification(selectedGoal)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
} 