-- Insert sample users
INSERT INTO users (id, name, email, role) VALUES
('user_1', 'Admin User', 'admin@example.com', 'admin'),
('user_2', 'Manager User', 'manager@example.com', 'manager'),
('user_3', 'Employee User', 'employee@example.com', 'employee');

-- Insert sample goals
INSERT INTO goals (id, title, description, deadline, userId, status) VALUES
('goal_1', 'Complete Project A', 'Finish all tasks for Project A', CURRENT_TIMESTAMP + INTERVAL '30 days', 'user_3', 'pending'),
('goal_2', 'Learn New Technology', 'Complete online course on React', CURRENT_TIMESTAMP + INTERVAL '60 days', 'user_3', 'approved'),
('goal_3', 'Team Leadership', 'Lead weekly team meetings', CURRENT_TIMESTAMP + INTERVAL '90 days', 'user_2', 'completed');

-- Insert sample notifications
INSERT INTO notifications (id, userId, type, message, data) VALUES
('notif_1', 'user_3', 'goal_approved', 'Your goal has been approved', '{"goalId": "goal_2"}'),
('notif_2', 'user_2', 'new_goal', 'New goal submitted for approval', '{"goalId": "goal_1"}');
