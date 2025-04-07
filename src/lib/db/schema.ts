import { sql } from 'drizzle-orm'
import {
  serial,
  timestamp,
  varchar,
  integer,
  boolean,
  json,
  pgTable,
  text,
  jsonb,
  primaryKey,
  unique,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { InferModel } from 'drizzle-orm'

// Enums
export const roleEnum = pgEnum('role', ['admin', 'manager', 'employee'])
export const goalStatusEnum = pgEnum('goal_status', ['pending', 'approved', 'rejected', 'modified'])
export const ratingPeriodEnum = pgEnum('rating_period', ['self_rating', 'manager_rating', 'completed'])
export const ratingScaleEnum = pgEnum('rating_scale', ['exceeds', 'meets', 'needs_improvement', 'unsatisfactory'])

// Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  role: roleEnum('role').notNull(),
  department: varchar('department', { length: 255 }),
  managerId: varchar('manager_id', { length: 255 }),
  provider: varchar('provider', { length: 50 }),
  providerAccountId: varchar('provider_account_id', { length: 255 }),
  sessionToken: varchar('session_token', { length: 255 }),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

// Goals Table
export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  employeeId: text('employee_id').notNull().references(() => users.id),
  managerId: text('manager_id').notNull().references(() => users.id),
  status: goalStatusEnum('status').default('pending'),
  priority: integer('priority').default(0),
  deadline: timestamp('deadline', { withTimezone: true }),
  managerComments: text('manager_comments'),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

// Performance Ratings Table
export const performanceRatings = pgTable('performance_ratings', {
  id: text('id').primaryKey(),
  goalId: text('goal_id').notNull().references(() => goals.id),
  employeeId: text('employee_id').notNull().references(() => users.id),
  managerId: text('manager_id').notNull().references(() => users.id),
  selfRating: ratingScaleEnum('self_rating'),
  managerRating: ratingScaleEnum('manager_rating'),
  selfComments: text('self_comments'),
  managerComments: text('manager_comments'),
  ratingPeriod: ratingPeriodEnum('rating_period').default('self_rating'),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

// Performance Feedback Table
export const performanceFeedback = pgTable('performance_feedback', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull().references(() => users.id),
  managerId: text('manager_id').notNull().references(() => users.id),
  feedback: text('feedback').notNull(),
  isManagerFeedback: boolean('is_manager_feedback').default(false),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

// Performance Reports Table
export const performanceReports = pgTable('performance_reports', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull().references(() => users.id),
  managerId: text('manager_id').notNull().references(() => users.id),
  reportData: jsonb('report_data').notNull(),
  reportType: text('report_type').notNull(),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

// Notifications Table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  message: text('message').notNull(),
  data: jsonb('data'),
  read: boolean('read').default(false),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
})

// System Configuration Table (Admin only)
export const systemConfig = pgTable('system_config', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedBy: text('updated_by').notNull().references(() => users.id),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

// Rating Periods Table
export const ratingPeriods = pgTable('rating_periods', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  type: ratingPeriodEnum('type').notNull(),
  isActive: boolean('is_active').default(true),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

export const accounts = pgTable(
  'accounts',
  {
    id: text('id').primaryKey().default(sql`uuid()`),
    userId: text('userid').notNull().references(() => users.id),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provideraccountid').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (acc) => ({
    providerProviderAccountIdKey: unique().on(acc.provider, acc.providerAccountId),
  })
)

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().default(sql`uuid()`),
  sessionToken: text('sessiontoken').notNull().unique(),
  userId: text('userid').notNull().references(() => users.id),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
})

export type User = InferModel<typeof users>
export type VerificationToken = InferModel<typeof verificationTokens>
export type Goal = InferModel<typeof goals>
export type PerformanceRating = InferModel<typeof performanceRatings>
export type PerformanceFeedback = InferModel<typeof performanceFeedback>
export type PerformanceReport = InferModel<typeof performanceReports>
export type Notification = InferModel<typeof notifications>
export type Account = InferModel<typeof accounts>
export type Session = InferModel<typeof sessions>
export type SystemConfig = InferModel<typeof systemConfig>
export type RatingPeriod = InferModel<typeof ratingPeriods> 