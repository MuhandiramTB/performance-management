-- Create enums
CREATE TYPE role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE goal_status AS ENUM ('pending', 'approved', 'rejected', 'modified');
CREATE TYPE rating_period AS ENUM ('self_rating', 'manager_rating', 'completed');
CREATE TYPE rating_scale AS ENUM ('exceeds', 'meets', 'needs_improvement', 'unsatisfactory');

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    email_verified timestamp,
    image text,
    role role NOT NULL,
    department varchar(255),
    manager_id varchar(255),
    provider varchar(50),
    provider_account_id varchar(255),
    session_token varchar(255),
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goals (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    employee_id text NOT NULL REFERENCES users(id),
    manager_id text NOT NULL REFERENCES users(id),
    status goal_status DEFAULT 'pending',
    priority integer DEFAULT 0,
    deadline timestamp with time zone,
    manager_comments text,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_ratings (
    id text PRIMARY KEY,
    goal_id text NOT NULL REFERENCES goals(id),
    employee_id text NOT NULL REFERENCES users(id),
    manager_id text NOT NULL REFERENCES users(id),
    self_rating rating_scale,
    manager_rating rating_scale,
    self_comments text,
    manager_comments text,
    rating_period rating_period DEFAULT 'self_rating',
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_feedback (
    id text PRIMARY KEY,
    employee_id text NOT NULL REFERENCES users(id),
    manager_id text NOT NULL REFERENCES users(id),
    feedback text NOT NULL,
    is_manager_feedback boolean DEFAULT false,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_reports (
    id text PRIMARY KEY,
    employee_id text NOT NULL REFERENCES users(id),
    manager_id text NOT NULL REFERENCES users(id),
    report_data jsonb NOT NULL,
    report_type text NOT NULL,
    period_start timestamp with time zone NOT NULL,
    period_end timestamp with time zone NOT NULL,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES users(id),
    type text NOT NULL,
    message text NOT NULL,
    data jsonb,
    read boolean DEFAULT false,
    createdat timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS system_config (
    id text PRIMARY KEY,
    key text NOT NULL UNIQUE,
    value jsonb NOT NULL,
    description text,
    updated_by text NOT NULL REFERENCES users(id),
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rating_periods (
    id text PRIMARY KEY,
    name text NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    type rating_period NOT NULL,
    is_active boolean DEFAULT true,
    created_by text NOT NULL REFERENCES users(id),
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
); 