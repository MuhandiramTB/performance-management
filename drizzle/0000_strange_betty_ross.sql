CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_unique" UNIQUE("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"deadline" timestamp with time zone,
	"userId" text NOT NULL,
	"templateId" text,
	"priority" integer DEFAULT 0,
	"status" text DEFAULT 'pending' NOT NULL,
	"feedback" text,
	"createdat" timestamp with time zone DEFAULT now(),
	"updatedat" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"read" boolean DEFAULT false,
	"createdat" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"role" text NOT NULL,
	"department" varchar(255),
	"manager_id" varchar(255),
	"provider" varchar(50),
	"provider_account_id" varchar(255),
	"session_token" varchar(255),
	"createdat" timestamp with time zone DEFAULT now(),
	"updatedat" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

-- Modify existing enums
ALTER TYPE goal_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE goal_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE goal_status ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE goal_status ADD VALUE IF NOT EXISTS 'archived';

ALTER TYPE rating_period ADD VALUE IF NOT EXISTS 'goal_setting';

ALTER TYPE rating_scale RENAME TO rating_scale_old;
CREATE TYPE rating_scale AS ENUM (
	'outstanding',
	'exceeds_expectations',
	'meets_expectations',
	'needs_improvement',
	'unsatisfactory'
);
ALTER TABLE performance_ratings 
	ALTER COLUMN self_rating TYPE rating_scale USING self_rating::text::rating_scale,
	ALTER COLUMN manager_rating TYPE rating_scale USING manager_rating::text::rating_scale;
DROP TYPE rating_scale_old;

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS position varchar(255);

-- Create performance_periods table
CREATE TABLE IF NOT EXISTS performance_periods (
	id text PRIMARY KEY,
	name text NOT NULL,
	start_date timestamptz NOT NULL,
	end_date timestamptz NOT NULL,
	goal_setting_deadline timestamptz NOT NULL,
	self_rating_deadline timestamptz NOT NULL,
	manager_rating_deadline timestamptz NOT NULL,
	is_active boolean DEFAULT true,
	createdat timestamptz DEFAULT now(),
	updatedat timestamptz DEFAULT now()
);

-- Add new columns to goals table
ALTER TABLE goals 
	ADD COLUMN IF NOT EXISTS period_id text REFERENCES performance_periods(id),
	ADD COLUMN IF NOT EXISTS weight integer DEFAULT 1,
	ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0,
	ADD COLUMN IF NOT EXISTS last_status_update timestamptz;

-- Add new columns to performance_ratings table
ALTER TABLE performance_ratings
	ADD COLUMN IF NOT EXISTS period_id text REFERENCES performance_periods(id),
	ADD COLUMN IF NOT EXISTS overall_rating rating_scale,
	ADD COLUMN IF NOT EXISTS submitted_at timestamptz;

-- Create goal_progress_updates table
CREATE TABLE IF NOT EXISTS goal_progress_updates (
	id text PRIMARY KEY,
	goal_id text NOT NULL REFERENCES goals(id),
	progress integer NOT NULL,
	comments text,
	updated_by text NOT NULL REFERENCES users(id),
	createdat timestamptz DEFAULT now()
);

-- Add period_id to performance_feedback table
ALTER TABLE performance_feedback
	ADD COLUMN IF NOT EXISTS period_id text REFERENCES performance_periods(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goals_employee_period ON goals(employee_id, period_id);
CREATE INDEX IF NOT EXISTS idx_goals_manager_period ON goals(manager_id, period_id);
CREATE INDEX IF NOT EXISTS idx_ratings_employee_period ON performance_ratings(employee_id, period_id);
CREATE INDEX IF NOT EXISTS idx_feedback_employee_period ON performance_feedback(employee_id, period_id);