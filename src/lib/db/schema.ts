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
} from 'drizzle-orm/pg-core'
import { InferModel } from 'drizzle-orm'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  role: text('role', { enum: ['admin', 'manager', 'employee'] }).notNull(),
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

export const goals = pgTable('goals', {
  id: text('id').primaryKey().default(sql`uuid()`),
  title: text('title').notNull(),
  description: text('description'),
  deadline: timestamp('deadline', { withTimezone: true }),
  userId: text('userid').notNull().references(() => users.id),
  templateId: text('templateid'),
  priority: integer('priority').default(0),
  status: text('status', { enum: ['pending', 'approved', 'rejected', 'completed'] }).notNull().default('pending'),
  feedback: text('feedback'),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().default(sql`uuid()`),
  userId: text('userid').notNull().references(() => users.id),
  type: text('type').notNull(),
  message: text('message').notNull(),
  data: jsonb('data'),
  read: boolean('read').default(false),
  createdAt: timestamp('createdat', { withTimezone: true }).defaultNow(),
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
export type Notification = InferModel<typeof notifications>
export type Account = InferModel<typeof accounts>
export type Session = InferModel<typeof sessions> 