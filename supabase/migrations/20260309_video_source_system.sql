-- Migration: Video Source Lockdown & Ingestion System
-- Date: 2026-03-09

-- 1. Create Video Sources Table
CREATE TABLE IF NOT EXISTS public.video_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id TEXT NOT NULL, -- UUID or Text ID from legacy/client curriculum
    title TEXT NOT NULL,
    description TEXT,
    source_platform TEXT NOT NULL DEFAULT 'Uploaded', -- 'Uploaded', 'YouTube', 'Vimeo', 'Vimeo public', 'Dailymotion', 'Archive.org'
    source_type TEXT NOT NULL DEFAULT 'Uploaded', -- 'Admin Uploaded', 'Verified Institution', 'Public Match'
    video_url TEXT NOT NULL,
    embed_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER DEFAULT 0,
    is_uploaded BOOLEAN DEFAULT true,
    is_admin_approved BOOLEAN DEFAULT true,
    is_public_source BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'uploaded', -- 'uploaded', 'matched_pending_review', 'approved_external', 'rejected', 'archived'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.video_sources ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Video Sources" ON public.video_sources FOR
SELECT USING (true);

CREATE POLICY "Admin All Access Video Sources" ON public.video_sources FOR ALL 
USING (auth.jwt() ->> 'email' = 'awlabounty80@gmail.com');

-- 2. Update Lesson Progress / Student Progress for Moo Points
-- If student_progress table doesn't have moo_points column, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_progress' AND column_name = 'moo_points_awarded') THEN
        ALTER TABLE public.student_progress ADD COLUMN moo_points_awarded INTEGER DEFAULT 0;
    END IF;
END $$;

-- 3. Failsafe Marker for Lessons
-- This ensures we can easily identify lessons without videos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'status') THEN
        ALTER TABLE public.lessons ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
END $$;
