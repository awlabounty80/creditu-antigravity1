-- COMPREHENSIVE FIX & SEED SCRIPT
-- 1. Cleans up duplicate slugs
-- 2. Enforces Unique Constraint
-- 3. Seeds the Data
DO $$
DECLARE course_id_1 UUID;
course_id_2 UUID;
course_id_3 UUID;
course_id_4 UUID;
mod_id UUID;
BEGIN -- =========================================================================
-- PART 1: FIX SCHEMA
-- =========================================================================
-- Cleanup duplicates (Keep newest)
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
-- Add Constraint if missing
IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'courses_slug_key'
) THEN
ALTER TABLE public.courses
ADD CONSTRAINT courses_slug_key UNIQUE (slug);
END IF;
-- =========================================================================
-- PART 2: SEED DATA
-- =========================================================================
-- 1. Credit 101
INSERT INTO public.courses (
        title,
        slug,
        description,
        level,
        credits_value,
        is_published
    )
VALUES (
        'Credit 101: The Rules of the Game',
        'credit-101',
        'Stop playing blind. Learn the 5 pillars of the FICO algorithm and how the banking system actually works.',
        'freshman',
        30,
        true
    ) ON CONFLICT (slug) DO
UPDATE
SET title = EXCLUDED.title
RETURNING id INTO course_id_1;
-- DELETE old modules for a clean slate
DELETE FROM public.modules
WHERE course_id = course_id_1;
INSERT INTO public.modules (course_id, title, order_index)
VALUES (course_id_1, 'The Algorithm Decoded', 1)
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
        '## Utilization\n\nKeep it under 10%.'
    );
INSERT INTO public.modules (course_id, title, order_index)
VALUES (course_id_1, 'Bureaucracy Hacking', 2)
RETURNING id INTO mod_id;
INSERT INTO public.lessons (
        module_id,
        title,
        duration_minutes,
        type,
        order_index,
        is_free_preview
    )
VALUES (
        mod_id,
        'Freezing Secondary Bureaus',
        10,
        'text',
        1,
        false
    ),
    (
        mod_id,
        'Opting Out of LexisNexis',
        20,
        'text',
        2,
        false
    );
-- 2. Dispute Tactics
INSERT INTO public.courses (
        title,
        slug,
        description,
        level,
        credits_value,
        is_published
    )
VALUES (
        'Dispute Tactics: Legal Jiu-Jitsu',
        'dispute-tactics',
        'Don''t beg for deletions—demand them. Learn to leverage the FCRA, FDCPA, and Metro 2 compliance standards.',
        'sophomore',
        45,
        true
    ) ON CONFLICT (slug) DO
UPDATE
SET title = EXCLUDED.title
RETURNING id INTO course_id_2;
DELETE FROM public.modules
WHERE course_id = course_id_2;
INSERT INTO public.modules (course_id, title, order_index)
VALUES (course_id_2, 'Consumer Law Foundations', 1)
RETURNING id INTO mod_id;
INSERT INTO public.lessons (
        module_id,
        title,
        duration_minutes,
        type,
        order_index,
        is_free_preview
    )
VALUES (mod_id, 'The 609 Loophole', 15, 'video', 1, true),
    (
        mod_id,
        'Metro 2 Compliance',
        25,
        'text',
        2,
        false
    );
-- 3. Business Funding
INSERT INTO public.courses (
        title,
        slug,
        description,
        level,
        credits_value,
        is_published
    )
VALUES (
        'Business Funding: Bag Security',
        'business-funding',
        'Transition from consumer to owner. How to structure your LLC, build a Paydex score, and access 0% interest capital.',
        'junior',
        60,
        true
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
        is_published
    )
VALUES (
        'Real Estate Leverage',
        'real-estate-leverage',
        'Using your personal credit to acquire cash-flowing assets without your own capital.',
        'senior',
        100,
        true
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
        is_free_preview
    )
VALUES (mod_id, 'Subject To Deals', 40, 'video', 1, true),
    (
        mod_id,
        'BRRRR Method Explained',
        20,
        'text',
        2,
        false
    );
END $$;