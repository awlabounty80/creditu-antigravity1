-- CURRICULUM V2 SEED - CREDIT U
-- Implements the "Knowledge OS" 4-Track Master Plan
-- CLEANUP
DELETE FROM public.lessons;
DELETE FROM public.modules;
DELETE FROM public.courses;
-- =============================================
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
        'c_credit_101',
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
-- Modules for Credit 101
INSERT INTO public.modules (id, course_id, title, "order")
VALUES (
        'm_c101_1',
        'c_credit_101',
        'What Credit Really Is',
        1
    ),
    (
        'm_c101_2',
        'c_credit_101',
        'The 5 FICO Pillars',
        2
    ),
    (
        'm_c101_3',
        'c_credit_101',
        'How Lenders Judge You',
        3
    ),
    ('m_c101_4', 'c_credit_101', 'Credit Myths', 4),
    ('m_c101_5', 'c_credit_101', 'Playing to Win', 5);
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
        'l_c101_1',
        'm_c101_1',
        'Trust, Risk, & Algorithms',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        '## Context\nMost people think credit is money. It is not. It is trust.\n\n## Core Lesson\nCredit is a measure of risk. The algorithm doesn''t care about your feelings, it cares about your patterns.\n\n## Action Step\n- [ ] Download your credit report.\n- [ ] Identify one negative item.'
    ),
    (
        'l_c101_2',
        'm_c101_2',
        'The 5 Factors Explained',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        '## The Formula\n1. Payment History (35%)\n2. Utilization (30%)\n3. Age (15%)\n4. Mix (10%)\n5. New Credit (10%)\n\n## Action Step\n- [ ] Calculate your aggregate utilization.'
    ),
    (
        'l_c101_3',
        'm_c101_3',
        'The Lender''s View',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        '## The 3 Cs\nCharacter, Capacity, Collateral. This is what they look for.\n\n## Action Step\n- [ ] List your assets.'
    ),
    (
        'l_c101_4',
        'm_c101_4',
        'Myths That Cost You',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        '## The Myths\n"Checking my score hurts it." - False.\n"I need to carry a balance." - False.\n\n## Action Step\n- [ ] Set up auto-pay for the minimum.'
    ),
    (
        'l_c101_5',
        'm_c101_5',
        'Start Playing to Win',
        'video',
        12,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        '## Strategy\nPay twice a month. Before the statement date, and by the due date.\n\n## Action Step\n- [ ] Change payment dates to align with paychecks.\n\n> "Your credit is not your character — it is a system you can learn and control."'
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
        'c_biz_101',
        'Business Funding: Bag Security',
        'business-funding',
        'Transition from consumer to owner. Secure 0% interest capital and protect your assets.',
        'Dean Sterling',
        120,
        'Senior',
        60,
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
        'Business Credit'
    );
INSERT INTO public.modules (id, course_id, title, "order")
VALUES (
        'm_biz_1',
        'c_biz_101',
        'Consumer vs Business',
        1
    ),
    ('m_biz_2', 'c_biz_101', 'Entity Setup', 2),
    ('m_biz_3', 'c_biz_101', 'Business Bureaus', 3),
    ('m_biz_4', 'c_biz_101', 'Capital Stacking', 4),
    ('m_biz_5', 'c_biz_101', 'Protecting the Bag', 5);
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
        'l_biz_1',
        'm_biz_1',
        'The Great Divide',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        '## Key Differences\nConsumer credit links to your SSN. Business credit links to your EIN.\n\n## Action Step\n- [ ] Verify you have an EIN.'
    ),
    (
        'l_biz_2',
        'm_biz_2',
        'Credibility Signals',
        'video',
        20,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        '## The 411\nAddress, Phone, Website, Email. If these look fake, you get denied.\n\n## Action Step\n- [ ] Audit your business digital footprint.'
    ),
    (
        'l_biz_3',
        'm_biz_3',
        'Nav, D&B, Experian',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        '## The Big 3\nDun & Bradstreet is king here. You need a DUNS number.\n\n## Action Step\n- [ ] Register for a DUNS number.'
    ),
    (
        'l_biz_4',
        'm_biz_4',
        'The Funding Ladder',
        'video',
        25,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        '## Tier 1 to Tier 4\nVendor credit -> Store cards -> Cash cards -> Bank lines.\n\n## Action Step\n- [ ] Apply for one Tier 1 vendor account (e.g. Uline).'
    ),
    (
        'l_biz_5',
        'm_biz_5',
        'Risk & Compliance',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        '## Compliance\nDon''t mix funds. Keep records. Pay taxes.\n\n## Action Step\n- [ ] Open a strategic business checking account.\n\n> "You don’t ask for money — you qualify for it."'
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
        'c_rebuild_101',
        'Dispute Tactics: Legal Jiu-Jitsu',
        'dispute-tactics',
        'Don''t beg. Enforce. Learn lawful, ethical dispute strategies under the FCRA.',
        'Prof. Nia Truth',
        60,
        'Junior',
        45,
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80',
        'Credit Rebuild'
    );
INSERT INTO public.modules (id, course_id, title, "order")
VALUES (
        'm_reb_1',
        'c_rebuild_101',
        'Why Errors Exist',
        1
    ),
    ('m_reb_2', 'c_rebuild_101', 'FCRA Basics', 2),
    (
        'm_reb_3',
        'c_rebuild_101',
        'Documentation Strategy',
        3
    ),
    (
        'm_reb_4',
        'c_rebuild_101',
        'Leverage & Language',
        4
    ),
    ('m_reb_5', 'c_rebuild_101', 'After Deletion', 5);
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
        'l_reb_1',
        'm_reb_1',
        'The Error Economy',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        '## The Reality\nBureaus are data aggregators. They process millions of updates. They make mistakes.\n\n## Action Step\n- [ ] Highlight every error on your report.'
    ),
    (
        'l_reb_2',
        'm_reb_2',
        'Know Your Rights (FCRA)',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        '## Section 609\nYou have the right to verification. If they can''t verify, they must delete.\n\n## Action Step\n- [ ] Read the FCRA Summary of Rights.'
    ),
    (
        'l_reb_3',
        'm_reb_3',
        'Paper Trails',
        'video',
        12,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        '## Certified Mail\nNever dispute online. Always send certified mail with return receipt.\n\n## Action Step\n- [ ] Buy a folder for your dispute tracking.'
    ),
    (
        'l_reb_4',
        'm_reb_4',
        'Words Matter',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        '## The Language\nDon''t say "it''s not mine" unless it isn''t. Say "I demand verification of this account."\n\n## Action Step\n- [ ] Draft your first dispute letter.'
    ),
    (
        'l_reb_5',
        'm_reb_5',
        'New Beginnings',
        'video',
        10,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        '## Maintenance\nOnce deleted, you must build positive history.\n\n## Action Step\n- [ ] Add a secured card if you have no open accounts.\n\n> "You are not begging — you are enforcing accuracy."'
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
        'c_mindset_101',
        'Wealth Mindset: Breaking Curses',
        'wealth-mindset',
        'Heal your money story. Understand how trauma affects financial behavior.',
        'Dr. Cornelius Wealth',
        90,
        'All Levels',
        50,
        'https://images.unsplash.com/photo-1536009190979-3291dca1319c?auto=format&fit=crop&q=80',
        'Emotional Healing'
    );
INSERT INTO public.modules (id, course_id, title, "order")
VALUES (
        'm_mind_1',
        'c_mindset_101',
        'Nervous System & Money',
        1
    ),
    (
        'm_mind_2',
        'c_mindset_101',
        'Scarcity vs Strategy',
        2
    ),
    (
        'm_mind_3',
        'c_mindset_101',
        'Financial Shame',
        3
    ),
    (
        'm_mind_4',
        'c_mindset_101',
        'Rewriting Identity',
        4
    ),
    ('m_mind_5', 'c_mindset_101', 'Forward Wisdom', 5);
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
        'l_mind_1',
        'm_mind_1',
        'Fight, Flight, or Freeze',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        '## The Body Keeps the Score\nFinancial stress triggers survival mechanisms. You cannot budget your way out of trauma.\n\n## Action Step\n- [ ] Identify your physical reaction to checking your bank account.'
    ),
    (
        'l_mind_2',
        'm_mind_2',
        'The Scarcity Trap',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        '## Abundance is a Practice\nScarcity says "there is never enough." Strategy says "I can create enough."\n\n## Action Step\n- [ ] Write down 3 abundance affirmations.'
    ),
    (
        'l_mind_3',
        'm_mind_3',
        'Releasing Shame',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        '## Silence is the Enemy\nShame grows in the dark. Talk about money with safe people.\n\n## Action Step\n- [ ] Forgive yourself for one past financial mistake.'
    ),
    (
        'l_mind_4',
        'm_mind_4',
        'New Identity',
        'video',
        20,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        '## Who Are You?\nYou are not "broke." You are "pre-rich." You are a builder.\n\n## Action Step\n- [ ] Visualize your life 5 years from now.'
    ),
    (
        'l_mind_5',
        'm_mind_5',
        'The Legacy',
        'video',
        15,
        1,
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        '## Passing it On\nGenerational wealth is not just money. It is knowledge. It is peace.\n\n## Action Step\n- [ ] Teach one financial concept to a child or family member.\n\n> "Healing your money story changes your bloodline."'
    );