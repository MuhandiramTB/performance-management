-- Drop existing tables if they exist
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "verification_tokens" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "goals" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Create tables with correct schema
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

CREATE TABLE "accounts" (
  "id" text PRIMARY KEY NOT NULL,
  "userid" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "provideraccountid" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  CONSTRAINT "accounts_provider_provideraccountid_unique" UNIQUE("provider","provideraccountid"),
  CONSTRAINT "accounts_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE "sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "sessiontoken" text NOT NULL,
  "userid" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  CONSTRAINT "sessions_sessiontoken_unique" UNIQUE("sessiontoken"),
  CONSTRAINT "sessions_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);

CREATE TABLE "goals" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "deadline" timestamp with time zone,
  "userid" text NOT NULL,
  "templateid" text,
  "priority" integer DEFAULT 0,
  "status" text DEFAULT 'pending' NOT NULL,
  "feedback" text,
  "createdat" timestamp with time zone DEFAULT now(),
  "updatedat" timestamp with time zone DEFAULT now(),
  CONSTRAINT "goals_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE "notifications" (
  "id" text PRIMARY KEY NOT NULL,
  "userid" text NOT NULL,
  "type" text NOT NULL,
  "message" text NOT NULL,
  "data" jsonb,
  "read" boolean DEFAULT false,
  "createdat" timestamp with time zone DEFAULT now(),
  CONSTRAINT "notifications_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action
); 