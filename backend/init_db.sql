-- Reset Schema
DROP TABLE IF EXISTS calm_sessions CASCADE;
DROP TABLE IF EXISTS mood_logs CASCADE;
DROP TABLE IF EXISTS health_centers CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS anonymous_questions CASCADE;
DROP TABLE IF EXISTS post_reactions CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS psychologist_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255), -- Optional for anonymous
    email VARCHAR(255) UNIQUE, -- Optional for anonymous
    password_hash VARCHAR(255), -- Optional for anonymous
    is_anonymous BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'PATIENT', -- PATIENT, PSYCHOLOGIST, ADMIN
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Psychologist Profiles Table
CREATE TABLE IF NOT EXISTS psychologist_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    specialization VARCHAR(255),
    hourly_rate DECIMAL(10, 2),
    is_approved BOOLEAN DEFAULT FALSE,
    availability JSONB -- e.g., {"monday": ["09:00-12:00", "13:00-17:00"]}
);

-- Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    psychologist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED, COMPLETED
    meet_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL, -- USER, AI
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communities / Support Groups
CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'MENTAL_HEALTH', -- 'MENTAL_HEALTH' or 'SRH'
    professional_id INTEGER REFERENCES psychologist_profiles(user_id), -- To show "Dr. Uwase inside"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Posts (Anonymous)
CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    tag VARCHAR(50), -- #anxiety, #periods, etc.
    is_flagged BOOLEAN DEFAULT FALSE, -- For AI moderation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post Reactions Table
CREATE TABLE IF NOT EXISTS post_reactions (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(50) NOT NULL, -- e.g., LIKE, HEART, HUG
    UNIQUE(post_id, user_id, reaction_type)
);

-- Ask a Professional (Anonymous Q&A)
CREATE TABLE IF NOT EXISTS anonymous_questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    professional_id INTEGER REFERENCES psychologist_profiles(user_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'MENTAL_HEALTH' or 'SRH'
    question_text TEXT NOT NULL,
    answer_text TEXT,
    is_answered BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses (Mental Health & SRH)
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'MENTAL_HEALTH' or 'SRH'
    verified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Centers (Find services nearby)
CREATE TABLE IF NOT EXISTS health_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- Isange One Stop Centre, Youth Clinic, etc.
    address TEXT,
    note TEXT, -- "Girls 15+ can visit without consent"
    latitude DECIMAL,
    longitude DECIMAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mood Tracking (Enhanced)
CREATE TABLE IF NOT EXISTS mood_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calm Sessions (VR Tracking)
CREATE TABLE IF NOT EXISTS calm_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    scene_name VARCHAR(100), -- 'Forest', 'Beach', 'Sky'
    duration_seconds INTEGER,
    mood_after_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
