-- CURRICULUM V2 SEED - CREDIT U
-- Implements the "Knowledge OS" 4-Track Master Plan
-- Uses UUIDs for compatibility with strict schema.
-- CLEANUP
DELETE FROM public.lessons;
DELETE FROM public.modules;
DELETE FROM public.courses;
DO $$
DECLARE -- Course IDs
    c1_id UUID := gen_random_uuid();
c2_id UUID := gen_random_uuid();
c3_id UUID := gen_random_uuid();
c4_id UUID := gen_random_uuid();
-- Module IDs
m_id UUID;
BEGIN -- =============================================
-- TRACK 1: PERSONAL CREDIT
-- Course: Credit 101: The Rules of the Game
-- =============================================
INSERT INTO public.courses (
        id,
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
        c1_id,
        'Credit 101: The Rules of the Game',
        'credit-101',
        'The foundation. Understand the 5 pillars, the algorithm, and how to stop playing blind.',
        'Dean Sterling',
        90,
        'Freshman',
        30,
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
        'Personal Credit'
    );
-- Module 1
INSERT INTO public.modules (course_id, title, "order")
VALUES (c1_id, 'What Credit Really Is', 1)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Trust, Risk, & Algorithms',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        '## Context\nMost people think credit is money. It is not. It is trust.\n\n## Core Lesson\nCredit is a measure of risk.'
    );
-- Module 2
INSERT INTO public.modules (course_id, title, "order")
VALUES (c1_id, 'The 5 FICO Pillars', 2)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'The 5 Factors Explained',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        '## The Formula\n1. Payment History (35%)\n2. Utilization (30%)\n3. Age (15%)\n4. Mix (10%)\n5. New Credit (10%)'
    );
-- Module 3
INSERT INTO public.modules (course_id, title, "order")
VALUES (c1_id, 'How Lenders Judge You', 3)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'The Lender''s View',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        '## The 3 Cs\nCharacter, Capacity, Collateral.'
    );
-- Module 4
INSERT INTO public.modules (course_id, title, "order")
VALUES (c1_id, 'Credit Myths', 4)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Myths That Cost You',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        '## The Myths\nChecking your score does NOT hurt it.'
    );
-- Module 5
INSERT INTO public.modules (course_id, title, "order")
VALUES (c1_id, 'Playing to Win', 5)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Start Playing to Win',
        'video',
        12,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        '## Strategy\nPay twice a month.'
    );
-- =============================================
-- TRACK 2: BUSINESS CREDIT
-- Course: Business Funding: Bag Security
-- =============================================
INSERT INTO public.courses (
        id,
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
        c2_id,
        'Business Funding: Bag Security',
        'business-funding',
        'Transition from consumer to owner.',
        'Dean Sterling',
        120,
        'Senior',
        60,
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
        'Business Credit'
    );
-- Module 1
INSERT INTO public.modules (course_id, title, "order")
VALUES (c2_id, 'Consumer vs Business', 1)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'The Great Divide',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        '## Key Differences\nEIN vs SSN.'
    );
-- Module 2
INSERT INTO public.modules (course_id, title, "order")
VALUES (c2_id, 'Entity Setup', 2)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Credibility Signals',
        'video',
        20,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        '## The 411\nGet a real business phone number.'
    );
-- Module 3
INSERT INTO public.modules (course_id, title, "order")
VALUES (c2_id, 'Business Bureaus', 3)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Nav, D&B, Experian',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        '## DUNS Number\nYou need one.'
    );
-- Module 4
INSERT INTO public.modules (course_id, title, "order")
VALUES (c2_id, 'Capital Stacking', 4)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'The Funding Ladder',
        'video',
        25,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        '## Tier 1\nUline, Grainger, Quill.'
    );
-- Module 5
INSERT INTO public.modules (course_id, title, "order")
VALUES (c2_id, 'Protecting the Bag', 5)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Risk & Compliance',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        '## Compliance\nPay your taxes.'
    );
-- =============================================
-- TRACK 3: CREDIT REBUILD
-- Course: Dispute Tactics: Legal Jiu-Jitsu
-- =============================================
INSERT INTO public.courses (
        id,
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
        c3_id,
        'Dispute Tactics: Legal Jiu-Jitsu',
        'dispute-tactics',
        'Learn lawful strategies under the FCRA.',
        'Prof. Nia Truth',
        60,
        'Junior',
        45,
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80',
        'Credit Rebuild'
    );
INSERT INTO public.modules (course_id, title, "order")
VALUES (c3_id, 'Why Errors Exist', 1)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'The Error Economy',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        '## Errors\nThey function on volume.'
    );
INSERT INTO public.modules (course_id, title, "order")
VALUES (c3_id, 'FCRA Basics', 2)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Know Your Rights',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        '## FCRA\nFederal Law protects you.'
    );
INSERT INTO public.modules (course_id, title, "order")
VALUES (c3_id, 'Documentation Strategy', 3)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Paper Trails',
        'video',
        12,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        '## Certified Mail\nAlways.'
    );
INSERT INTO public.modules (course_id, title, "order")
VALUES (c3_id, 'Leverage & Language', 4)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Words Matter',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        '## Demand Verification\nDo not just say "not mine".'
    );
-- =============================================
-- TRACK 4: EMOTIONAL HEALING
-- Course: Wealth Mindset: Breaking Generational Curses
-- =============================================
INSERT INTO public.courses (
        id,
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
        c4_id,
        'Wealth Mindset: Breaking Curses',
        'wealth-mindset',
        'Heal your money story.',
        'Dr. Cornelius Wealth',
        90,
        'All Levels',
        50,
        'https://images.unsplash.com/photo-1536009190979-3291dca1319c?auto=format&fit=crop&q=80',
        'Emotional Healing'
    );
INSERT INTO public.modules (course_id, title, "order")
VALUES (c4_id, 'Nervous System & Money', 1)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Fight, Flight, or Freeze',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        '## Trauma\nYour body remembers poverty.'
    );
INSERT INTO public.modules (course_id, title, "order")
VALUES (c4_id, 'Scarcity vs Strategy', 2)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'The Scarcity Trap',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        '## Abundance\nIt is a practice.'
    );
INSERT INTO public.modules (course_id, title, "order")
VALUES (c4_id, 'Financial Shame', 3)
RETURNING id INTO m_id;
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
        gen_random_uuid(),
        m_id,
        'Releasing Shame',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        '## Shame\nIt dies when you speak it.'
    );
END $$;