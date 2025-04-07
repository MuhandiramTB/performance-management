import { Goal } from '@/models/performance'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface GoalApprovalModalProps {
  show: boolean
  onClose: () => void
  goal: Goal
  comment: string
  setComment: (value: string) => void
  onApprove: () => void
  onReject: () => void
  onRequestModification: () => void
  isSubmitting: boolean
}

export function GoalApprovalModal({
  show,
  onClose,
  goal,
  comment,
  setComment,
  onApprove,
  onReject,
  onRequestModification,
  isSubmitting,
}: GoalApprovalModalProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Goal: {goal.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Add a comment (optional)</label>
            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Add your comments here..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={onApprove}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={onReject}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={onRequestModification}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Request Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 