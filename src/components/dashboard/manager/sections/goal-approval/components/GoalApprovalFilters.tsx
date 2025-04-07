import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GoalStatus } from '@/models/performance'

interface GoalApprovalFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedStatus: string
  setSelectedStatus: (value: string) => void
  selectedEmployee: string
  setSelectedEmployee: (value: string) => void
}

export function GoalApprovalFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedEmployee,
  setSelectedEmployee,
}: GoalApprovalFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Input
        placeholder="Search goals..."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value={GoalStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={GoalStatus.APPROVED}>Approved</SelectItem>
          <SelectItem value={GoalStatus.REJECTED}>Rejected</SelectItem>
          <SelectItem value={GoalStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={GoalStatus.COMPLETED}>Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by employee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employees</SelectItem>
          {/* Employee list will be populated dynamically */}
        </SelectContent>
      </Select>
    </div>
  )
} 