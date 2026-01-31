-- Update Courses to include Tracks and Prerequisites
-- FIX: Using UUID for prerequisite_id to match public.courses table definition
-- 1. Cleanup first (in case of partial previous run)
ALTER TABLE public.courses DROP COLUMN IF EXISTS prerequisite_id;
-- 2. Add Track Column
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS track text DEFAULT 'Personal Credit Track';
-- 3. Add Prerequisites Column (REFERENCES UUID)
ALTER TABLE public.courses
ADD COLUMN prerequisite_id UUID REFERENCES public.courses(id);
-- 4. Update Existing Courses to match Tracks
UPDATE public.courses
SET track = 'Personal Credit Track',
    level = 'Freshman'
WHERE slug = 'credit-101';
UPDATE public.courses
SET track = 'Credit Rebuild & Recovery Track',
    level = 'Junior'
WHERE slug = 'dispute-tactics';
UPDATE public.courses
SET track = 'Business Credit Track',
    level = 'Senior'
WHERE slug = 'business-funding';
-- 5. Create new Course: "Wealth Mindset" 
-- Note: Excluding 'id' to allow UUID autogeneration
INSERT INTO public.courses (
        title,
        slug,
        description,
        instructor,
        duration_minutes,
        level,
        credits_value,
        image_url,
        track
    )
VALUES (
        'Wealth Mindset: Breaking Generational Curses',
        'wealth-mindset',
        'Re-wire your brain for abundance. The psychology of credit.',
        'Dr. Legacy',
        40,
        'Freshman',
        20,
        'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80',
        'Emotional + Financial Healing Track'
    ) ON CONFLICT (slug) DO NOTHING;