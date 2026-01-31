-- STEP 1: FORCE SCHEMA REPAIR
-- Run this block FIRST. It adds the missing columns safely.
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS credits_value INTEGER DEFAULT 0;
ALTER TABLE public.modules
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.modules
ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 5;
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text';
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS is_free_preview BOOLEAN DEFAULT false;
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS content_markdown TEXT;
-- Ensure unique slug constraint (Safe Block)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'courses_slug_key'
) THEN -- Remove duplicates first just in case
DELETE FROM public.courses
WHERE id IN (
        SELECT id
        FROM (
                SELECT id,
                    ROW_NUMBER() OVER (
                        partition BY slug
                        ORDER BY created_at DESC
                    ) as rnum
                FROM public.courses
            ) t
        WHERE t.rnum > 1
    );
ALTER TABLE public.courses
ADD CONSTRAINT courses_slug_key UNIQUE (slug);
END IF;
END $$;