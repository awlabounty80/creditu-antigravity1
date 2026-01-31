-- REPAIR SCHEMA AND SEED SCRIPT
-- This script will:
-- 1. Add any missing columns that the frontend expects.
-- 2. Populate the curriculum with the correct data.
DO $$ BEGIN -- =========================================================================
-- PART 1: REPAIR SCHEMA (Missing Columns)
-- =========================================================================
-- 1. COURSES Table Updates
-- Add thumbnail_url
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'courses'
        AND column_name = 'thumbnail_url'
) THEN
ALTER TABLE public.courses
ADD COLUMN thumbnail_url TEXT;
END IF;
-- Add credits_value
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'courses'
        AND column_name = 'credits_value'
) THEN
ALTER TABLE public.courses
ADD COLUMN credits_value INTEGER DEFAULT 0;
END IF;
-- Ensure unique slug constraint
IF NOT EXISTS (
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
-- 2. MODULES Table Updates
-- Add order_index
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'modules'
        AND column_name = 'order_index'
) THEN
ALTER TABLE public.modules
ADD COLUMN order_index INTEGER DEFAULT 0;
END IF;
-- Add description
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'modules'
        AND column_name = 'description'
) THEN
ALTER TABLE public.modules
ADD COLUMN description TEXT;
END IF;
-- 3. LESSONS Table Updates
-- Add order_index
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'lessons'
        AND column_name = 'order_index'
) THEN
ALTER TABLE public.lessons
ADD COLUMN order_index INTEGER DEFAULT 0;
END IF;
-- Add duration_minutes
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'lessons'
        AND column_name = 'duration_minutes'
) THEN
ALTER TABLE public.lessons
ADD COLUMN duration_minutes INTEGER DEFAULT 5;
END IF;
-- Add type (video/text) - logic often handled in frontend by null video_url, but just in case
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'lessons'
        AND column_name = 'type'
) THEN
ALTER TABLE public.lessons
ADD COLUMN type TEXT DEFAULT 'text';
END IF;
-- Add is_free_preview
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'lessons'
        AND column_name = 'is_free_preview'
) THEN
ALTER TABLE public.lessons
ADD COLUMN is_free_preview BOOLEAN DEFAULT false;
END IF;
-- Add video_url
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'lessons'
        AND column_name = 'video_url'
) THEN
ALTER TABLE public.lessons
ADD COLUMN video_url TEXT;
END IF;
-- Add content_markdown
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'lessons'
        AND column_name = 'content_markdown'
) THEN
ALTER TABLE public.lessons
ADD COLUMN content_markdown TEXT;
END IF;
END $$;
-- =========================================================================
-- PART 2: SEED DATA (Now safe to run)
-- =========================================================================
DO $$
DECLARE course_id_1 UUID;
course_id_2 UUID;
course_id_3 UUID;
course_id_4 UUID;
mod_id UUID;
BEGIN -- 1. Credit 101
INSERT INTO public.courses (
        title,
        slug,
        description,
        level,
        credits_value,
        is_published,
        thumbnail_url
    )
VALUES (
        'Credit 101: The Rules of the Game',
        'credit-101',
        'Stop playing blind. Learn the 5 pillars of the FICO algorithm and how the banking system actually works.',
        'freshman',
        30,
        true,
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000'
    ) ON CONFLICT (slug) DO
UPDATE
SET title = EXCLUDED.title
RETURNING id INTO course_id_1;
-- DELETE old modules for this course to rebuild structure cleanly
DELETE FROM public.modules
WHERE course_id = course_id_1;
-- Module 1
INSERT INTO public.modules (course_id, title, order_index, description)
VALUES (
        course_id_1,
        'The Algorithm Decoded',
        1,
        'Understanding the math.'
    )
RETURNING id INTO mod_id;
INSERT INTO public.lessons (
        module_id,
        title,
        duration_minutes,
        type,
        order_index,
        is_free_preview,
        video_url,
        content_markdown
    )
VALUES (
        mod_id,
        'Welcome to the Matrix',
        5,
        'video',
        1,
        true,
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        '## Welcome\n\nIntroduction to the course.'
    ),
    (
        mod_id,
        'Payment History (35%)',
        12,
        'video',
        2,
        false,
        null,
        '## Payment History\n\nThis is the biggest factor.'
    ),
    (
        mod_id,
        'Utilization (30%)',
        15,
        'text',
        3,
        false,
        null,
        '## Utilization\n\nKeep it under 10%.'::text
    );
-- Module 2
INSERT INTO public.modules (course_id, title, order_index, description)
VALUES (
        course_id_1,
        'Bureaucracy Hacking',
        2,
        'Navigating the bureaus.'
    )
RETURNING id INTO mod_id;
INSERT INTO public.lessons (
        module_id,
        title,
        duration_minutes,
        type,
        order_index,
        is_free_preview,
        content_markdown
    )
VALUES (
        mod_id,
        'Freezing Secondary Bureaus',
        10,
        'text',
        1,
        false,
        '## Freezing\n\nHow to freeze Innovis, etc.'
    ),
    (
        mod_id,
        'Opting Out of LexisNexis',
        20,
        'text',
        2,
        false,
        '## Opt Out\n\nStep by step guide.'
    );
-- 2. Dispute Tactics
INSERT INTO public.courses (
        title,
        slug,
        description,
        level,
        credits_value,
        is_published,
        thumbnail_url
    )
VALUES (
        'Dispute Tactics: Legal Jiu-Jitsu',
        'dispute-tactics',
        'Don''t beg for deletions—demand them. Learn to leverage the FCRA, FDCPA, and Metro 2 compliance standards.',
        'sophomore',
        45,
        true,
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2000'
    ) ON CONFLICT (slug) DO
UPDATE
SET title = EXCLUDED.title
RETURNING id INTO course_id_2;
DELETE FROM public.modules
WHERE course_id = course_id_2;
INSERT INTO public.modules (course_id, title, order_index, description)
VALUES (
        course_id_2,
        'Consumer Law Foundations',
        1,
        'Knowing your rights.'
    )
RETURNING id INTO mod_id;
INSERT INTO public.lessons (
        module_id,
        title,
        duration_minutes,
        type,
        order_index,
        is_free_preview,
        video_url
    )
VALUES (
        mod_id,
        'The 609 Loophole',
        15,
        'video',
        1,
        true,
        'https://www.youtube.com/embed/fake-id'
    ),
    (
        mod_id,
        'Metro 2 Compliance',
        25,
        'text',
        2,
        false,
        null
    );
-- 3. Business Funding
INSERT INTO public.courses (
        title,
        slug,
        description,
        level,
        credits_value,
        is_published,
        thumbnail_url
    )
VALUES (
        'Business Funding: Bag Security',
        'business-funding',
        'Transition from consumer to owner. How to structure your LLC, build a Paydex score, and access 0% interest capital.',
        'junior',
        60,
        true,
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000'
    ) ON CONFLICT (slug) DO
UPDATE
SET title = EXCLUDED.title
RETURNING id INTO course_id_3;
DELETE FROM public.modules
WHERE course_id = course_id_3;
INSERT INTO public.modules (course_id, title, order_index)
VALUES (course_id_3, 'Entity Structure', 1)
RETURNING id INTO mod_id;
INSERT INTO public.lessons (
        module_id,
        title,
        duration_minutes,
        type,
        order_index,
        is_free_preview
    )
VALUES (mod_id, 'LLC vs Corp', 10, 'text', 1, true),
    (mod_id, 'EIN & DUNS Setup', 30, 'text', 2, false);
-- 4. Real Estate Leverage
INSERT INTO public.courses (
        title,
        slug,
        description,
        level,
        credits_value,
        is_published,
        thumbnail_url
    )
VALUES (
        'Real Estate Leverage',
        'real-estate-leverage',
        'Using your personal credit to acquire cash-flowing assets without your own capital.',
        'senior',
        100,
        true,
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071'
    ) ON CONFLICT (slug) DO
UPDATE
SET title = EXCLUDED.title
RETURNING id INTO course_id_4;
DELETE FROM public.modules
WHERE course_id = course_id_4;
INSERT INTO public.modules (course_id, title, order_index)
VALUES (course_id_4, 'Acquisition Strategies', 1)
RETURNING id INTO mod_id;
INSERT INTO public.lessons (
        module_id,
        title,
        duration_minutes,
        type,
        order_index,
        is_free_preview,
        video_url
    )
VALUES (
        mod_id,
        'Subject To Deals',
        40,
        'video',
        1,
        true,
        'https://www.youtube.com/embed/fake-id-2'
    ),
    (
        mod_id,
        'BRRRR Method Explained',
        20,
        'text',
        2,
        false,
        null
    );
END $$;