import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Goal, GoalStatus } from '@/models/performance'
import { CheckCircle, XCircle, AlertCircle, CalendarIcon } from 'lucide-react'

interface GoalApprovalCardProps {
  goal: Goal
  onApprove: () => void
  onReject: () => void
  onRequestModification: () => void
}

export function GoalApprovalCard({
  goal,
  onApprove,
  onReject,
  onRequestModification,
}: GoalApprovalCardProps) {
  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case GoalStatus.APPROVED:
        return 'bg-green-100 text-green-800'
      case GoalStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case GoalStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case GoalStatus.COMPLETED:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{goal.title}</CardTitle>
        <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{goal.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>Due: {format(new Date(goal.dueDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <span>Progress: {goal.progress}%</span>
            </div>
          </div>

          {goal.status === GoalStatus.PENDING && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onApprove}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onReject}
                className="flex items-center"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRequestModification}
                className="flex items-center"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Request Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 