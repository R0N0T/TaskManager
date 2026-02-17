-- Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'USER',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tasks Table
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL, -- TODO, IN_PROGRESS, DONE
    priority VARCHAR(20), -- LOW, MEDIUM, HIGH
    due_date TIMESTAMP,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Reminders Table
CREATE TABLE reminder (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP,
    recurring BOOLEAN DEFAULT FALSE,
    days_of_week VARCHAR(50),
    task_id BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(100),
    reminder_type VARCHAR(20),
    status VARCHAR(20)
);

-- Create Push Subscriptions Table
CREATE TABLE push_subscription (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    endpoint VARCHAR(512) NOT NULL,
    p256dh VARCHAR(512) NOT NULL,
    auth VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Notes Table (Integer ID in Entity)
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    note_title VARCHAR(255) NOT NULL,
    note_content VARCHAR(5000)
);

-- Create Habit Table
CREATE TABLE habit (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255)
);

-- Create HabitCompletion Table
CREATE TABLE habit_completion (
    id BIGSERIAL PRIMARY KEY,
    date DATE,
    habit_id BIGINT REFERENCES habit(id) ON DELETE CASCADE
);

-- Create Pomodoro Table
CREATE TABLE pomodoro (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    duration_minutes INTEGER,
    short_break_minutes INTEGER,
    long_break_minutes INTEGER,
    cycles INTEGER,
    current_cycles INTEGER,
    status VARCHAR(50),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

-- Create Notification Table
CREATE TABLE notification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_reminders_user_id ON reminder(user_id);
