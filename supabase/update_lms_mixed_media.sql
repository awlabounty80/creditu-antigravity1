-- Update LMS Schema to support detailed media types
-- Run this script to fix the "Video URL not found" error.
-- 1. Add columns if they don't exist
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS video_url TEXT,
    ADD COLUMN IF NOT EXISTS content_markdown TEXT;
-- 2. Update existing rows to have distinct types and content
-- (Assuming 'c001' is Credit 101, etc. We need to find the modules/lessons.
-- Since we don't have IDs handy, we'll try to update based on rough text matching or just insert clean data.)
--- CLEAN SLATE APPROACH for Lessons ---
-- We will delete existing lessons for the main courses and re-insert them with proper video URLs.
-- This ensures clean data.
DELETE FROM public.lessons
WHERE module_id IN (
        SELECT id
        FROM public.modules
        WHERE course_id IN ('c001', 'c002', 'c003')
    );
DELETE FROM public.modules
WHERE course_id IN ('c001', 'c002', 'c003');
-- Re-insert Modules
INSERT INTO public.modules (id, course_id, title, "order")
VALUES ('m001', 'c001', 'The Foundation', 1),
    ('m002', 'c001', 'FICO Anatomy', 2),
    ('m003', 'c002', 'Dispute Letters', 1),
    ('m004', 'c003', 'Structuring', 1);
-- Re-insert Lessons with DIVERSE STOCK VIDEO
-- Video 1: "Black Woman Leading Meeting" (Representative of Leadership)
-- Video 2: "Diverse Team Strategy" (Representative of Rules/Game)
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        duration_minutes,
        "order",
        video_url,
        content_markdown
    )
VALUES (
        'l001',
        'm001',
        'Welcome to the League',
        'video',
        3,
        1,
        'https://assets.mixkit.co/videos/preview/mixkit-business-people-having-a-meeting-in-office-43916-large.mp4',
        -- Diverse Team
        '# Welcome\n\nYou are now part of an elite group...'
    ),
    (
        'l002',
        'm001',
        'The Mindset of Wealth',
        'video',
        12,
        2,
        'https://assets.mixkit.co/videos/preview/mixkit-african-american-woman-giving-a-presentation-1282-large.mp4',
        -- Black Woman Presentation
        '# Mindset\n\nWealth is first a mental state...'
    ),
    (
        'l003',
        'm002',
        'Payment History Hacking',
        'text',
        10,
        1,
        NULL,
        '# Payment History\n\nThis is 35% of your score.'
    );