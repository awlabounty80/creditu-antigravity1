-- Credit U™ - The World's Most Powerful AI Education Platform
-- Database Schema v1.0
-- Security: Row Level Security (RLS) is ENABLED on ALL tables.
--------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
--------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('student', 'professor', 'admin', 'dean');
CREATE TYPE academic_level AS ENUM (
    'foundation',
    'freshman',
    'sophomore',
    'junior',
    'senior',
    'graduate'
);
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
--------------------------------------------------------------------------------
-- 2. PUBLIC PROFILES (Extends auth.users)
--------------------------------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    -- Identity
    first_name TEXT,
    last_name TEXT,
    student_id_number TEXT UNIQUE,
    -- e.g. "CU-2024-8293"
    avatar_url TEXT,
    -- Academic Status
    role user_role DEFAULT 'student',
    academic_level academic_level DEFAULT 'foundation',
    gpa NUMERIC(3, 2) DEFAULT 0.00,
    credits_earned INTEGER DEFAULT 0,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Gamification
    moo_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS: Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
--------------------------------------------------------------------------------
-- 3. CURRICULUM ENGINE
--------------------------------------------------------------------------------
-- Courses (e.g., "Credit 101")
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    level academic_level NOT NULL,
    credits_value INTEGER DEFAULT 3,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Modules (e.g., "History of Credit")
CREATE TABLE public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Lessons (e.g., "What is FICO?")
CREATE TABLE public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_markdown TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    order_index INTEGER NOT NULL,
    is_free_preview BOOLEAN DEFAULT false
);
-- RLS: Curriculum
-- Everyone can view published courses. Only admins can edit.
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published courses are viewable by everyone" ON public.courses FOR
SELECT USING (is_published = true);
CREATE POLICY "Modules viewable" ON public.modules FOR
SELECT USING (true);
CREATE POLICY "Lessons viewable" ON public.lessons FOR
SELECT USING (true);
--------------------------------------------------------------------------------
-- 4. STUDENT PROGRESS
--------------------------------------------------------------------------------
CREATE TABLE public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
CREATE TABLE public.lesson_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);
-- RLS: Progress
-- Students can only see their own progress.
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own enrollments" ON public.enrollments FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own completions" ON public.lesson_completions FOR
SELECT USING (auth.uid() = user_id);
--------------------------------------------------------------------------------
-- 5. CREDIT LAB (Secure User Data)
--------------------------------------------------------------------------------
CREATE TABLE public.credit_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    report_provider TEXT,
    -- 'experian', 'transunion', 'equifax'
    score INTEGER,
    report_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_url TEXT,
    -- Secure storage path
    parsed_data JSONB -- The AI extracted data
);
-- RLS: Credit Lab
-- STRICT: Only the user can see their own credit report.
ALTER TABLE public.credit_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own reports" ON public.credit_reports FOR ALL USING (auth.uid() = user_id);
--------------------------------------------------------------------------------
-- 6. FUNCTIONS & TRIGGERS
--------------------------------------------------------------------------------
-- Helper to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, email, first_name)
VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name'
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();