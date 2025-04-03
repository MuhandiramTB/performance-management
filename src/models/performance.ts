export enum UserRole {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  ADMIN = 'Admin'
}

export enum GoalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  userId: string;
  name: string;
  role: UserRole;
  department: string;
}

export interface Goal {
  goalId: string;
  employeeId: string;
  employeeName: string;
  description: string;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  progress: number;
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Rating {
  ratingId: string;
  goalId: string;
  employeeRating: number;
  managerRating?: number;
  feedback?: string;
  submittedAt: Date;
  updatedAt: Date;
}

// Business rules validation functions
export class PerformanceRules {
  static canSubmitRating(goal: Goal, currentDate: Date, ratingPeriodStart: Date, ratingPeriodEnd: Date): boolean {
    // Check if goal is approved
    if (goal.status !== GoalStatus.APPROVED) {
      return false;
    }

    // Check if current date is within rating period
    return currentDate >= ratingPeriodStart && currentDate <= ratingPeriodEnd;
  }

  static canViewFeedback(rating: Rating, user: User): boolean {
    // Both employee and manager can view feedback
    return user.role === UserRole.EMPLOYEE || user.role === UserRole.MANAGER;
  }

  static canApproveGoal(goal: Goal, user: User): boolean {
    // Only managers can approve goals
    return user.role === UserRole.MANAGER;
  }
} 