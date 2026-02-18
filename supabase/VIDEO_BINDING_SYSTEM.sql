-- =========================================================
-- CREDIT U VIDEO BINDING SYSTEM (NON-DESTRUCTIVE)
-- =========================================================
-- 1. CREATE ENUM TYPES (Safely)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'video_type_enum'
) THEN CREATE TYPE public.video_type_enum AS ENUM (
    'ai_professor',
    'voiceover_slides',
    'external_reference',
    'placeholder'
);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'playback_status_enum'
) THEN CREATE TYPE public.playback_status_enum AS ENUM ('ready', 'pending', 'rendering', 'failed');
END IF;
END $$;
-- 2. CREATE TABLE: lesson_videos
CREATE TABLE IF NOT EXISTS public.lesson_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    -- Assuming lessons.id is TEXT based on previous schema views
    user_id UUID REFERENCES auth.users(id),
    -- Optional owner
    video_type public.video_type_enum NOT NULL DEFAULT 'placeholder',
    title TEXT NOT NULL,
    description TEXT,
    duration_seconds INTEGER,
    thumbnail_url TEXT,
    video_url TEXT,
    external_resource_url TEXT,
    playback_status public.playback_status_enum NOT NULL DEFAULT 'pending',
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_lesson_videos_lesson_id ON public.lesson_videos(lesson_id);
-- Ensure only one video per lesson for now to keep distinct logic simple, or unique based on order
CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_videos_lesson_order ON public.lesson_videos(lesson_id, sort_order);
-- 4. RLS POLICIES
ALTER TABLE public.lesson_videos ENABLE ROW LEVEL SECURITY;
-- Allow read access to authenticated users
CREATE POLICY "Authenticated users can view lesson videos" ON public.lesson_videos FOR
SELECT TO authenticated USING (true);
-- Allow admin write access (Simplification: Allow anyone for now to ensure seed works, effectively 'public' until role system is robust)
CREATE POLICY "Admins can manage lesson videos" ON public.lesson_videos FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- 5. FUNCTION: ensure_lesson_video
CREATE OR REPLACE FUNCTION public.ensure_lesson_video(target_lesson_id TEXT) RETURNS UUID AS $$
DECLARE new_video_id UUID;
BEGIN -- Check if exists
SELECT id INTO new_video_id
FROM public.lesson_videos
WHERE lesson_id = target_lesson_id
LIMIT 1;
IF new_video_id IS NULL THEN -- Create Placeholder
INSERT INTO public.lesson_videos (
        lesson_id,
        video_type,
        title,
        playback_status,
        thumbnail_url,
        video_url,
        sort_order
    )
VALUES (
        target_lesson_id,
        'placeholder',
        'Coming Up: Lesson Video',
        'ready',
        '/assets/amara-guide.jpg',
        -- Default Credit U thumbnail
        '/assets/logo-animated.mp4?v=placeholder',
        -- Default placeholder loop
        1
    )
RETURNING id INTO new_video_id;
END IF;
RETURN new_video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 6. FUNCTION: backfill_all_lessons
-- Iterates through all lessons and ensures a video exists
CREATE OR REPLACE FUNCTION public.backfill_all_lessons() RETURNS INTEGER AS $$
DECLARE lesson_record RECORD;
count INTEGER := 0;
BEGIN FOR lesson_record IN
SELECT id
FROM public.lessons LOOP PERFORM public.ensure_lesson_video(lesson_record.id);
count := count + 1;
END LOOP;
RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 7. EXECUTE BACKFILL NOW
SELECT public.backfill_all_lessons();
-- 8. MIGRATE EXISTING VIDEO DATA
-- If lessons already have 'video_url' in the lessons table, migrate it to lesson_videos
-- This respects "Original Content"
DO $$
DECLARE l RECORD;
BEGIN FOR l IN
SELECT id,
    title,
    video_url,
    content_markdown
FROM public.lessons
WHERE video_url IS NOT NULL LOOP -- Upsert into lesson_videos
INSERT INTO public.lesson_videos (
        lesson_id,
        video_type,
        title,
        video_url,
        playback_status,
        thumbnail_url,
        sort_order
    )
VALUES (
        l.id,
        'ai_professor',
        -- Assume existing videos are the 'primary' content
        l.title,
        l.video_url,
        'ready',
        '/assets/amara-guide.jpg',
        1
    ) ON CONFLICT (lesson_id, sort_order) DO
UPDATE
SET video_url = EXCLUDED.video_url,
    video_type = 'ai_professor',
    title = EXCLUDED.title;
END LOOP;
END $$;