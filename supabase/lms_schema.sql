-- EMERGENCY LMS RESET (Schema Sync)
-- 1. Nuke it (Cascade deletes everything linked)
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
-- 2. Clean Rebuild (Courses)
CREATE TABLE public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    track TEXT DEFAULT 'Personal Credit',
    description TEXT,
    instructor TEXT,
    level TEXT,
    image_url TEXT,
    credits_value INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Modules
CREATE TABLE public.modules (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 4. Lessons
CREATE TABLE public.lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    -- IMPORTANT: Generic content field
    type TEXT DEFAULT 'text',
    duration_minutes INTEGER DEFAULT 5,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 5. Enrollments
CREATE TABLE public.enrollments (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, course_id)
);
-- 6. Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Courses" ON public.courses FOR
SELECT USING (true);
CREATE POLICY "Public Read Modules" ON public.modules FOR
SELECT USING (true);
CREATE POLICY "Public Read Lessons" ON public.lessons FOR
SELECT USING (true);
CREATE POLICY "Users enroll" ON public.enrollments FOR ALL USING (auth.uid() = user_id);
-- 7. SEED DATA (Restore c001 and pc101)
-- Courses
INSERT INTO public.courses (
        id,
        title,
        slug,
        track,
        description,
        instructor,
        credits_value,
        image_url
    )
VALUES (
        'c001',
        'Credit 101: The Rules',
        'credit-101',
        'Personal Credit',
        'Stop playing blind.',
        'Dr. Wealth',
        30,
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80'
    ),
    (
        'pc101',
        'FICO Algorithms Explained',
        'fico-algo',
        'Personal Credit',
        'Deep dive into filters.',
        'Dr. Wealth',
        50,
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80'
    );
-- Modules
INSERT INTO public.modules (id, course_id, title, "order")
VALUES ('m_c001_1', 'c001', 'Welcome to Credit U', 1),
    ('m_pc101_1', 'pc101', 'FICO Breakdown', 1);
-- Lessons (Using Youtube Embeds)
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'l_c001_1_1',
        'm_c001_1',
        'Mission Briefing',
        'video',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        5,
        1
    ),
    (
        'l_pc101_1_1',
        'm_pc101_1',
        '35% Payment History',
        'video',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        10,
        1
    );