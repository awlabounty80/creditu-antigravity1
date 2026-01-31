-- FINAL ACTIVATION SCRIPT v1.2 (Optimized for Existing Schema)
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS vector;
-- =============================================================================
-- PART 1: KNOWLEDGE OS (New Tables)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    content TEXT,
    pillar TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    difficulty TEXT DEFAULT 'Freshman',
    reading_time_minutes INTEGER DEFAULT 5,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.knowledge_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.knowledge_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, article_id)
);
-- RLS
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON public.knowledge_articles;
CREATE POLICY "Public articles are viewable by everyone" ON public.knowledge_articles FOR
SELECT USING (is_published = true);
-- =============================================================================
-- PART 2: MOO STORE V2
-- =============================================================================
-- Drop old tables if they exist to refresh schema
DROP TABLE IF EXISTS public.user_rewards CASCADE;
DROP TABLE IF EXISTS public.rewards CASCADE;
CREATE TABLE public.rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    icon_key TEXT,
    resource_url TEXT,
    unlock_threshold INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    stock_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE public.user_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'fulfilled',
    meta_data JSONB
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active" ON public.rewards FOR
SELECT USING (true);
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own" ON public.user_rewards FOR
SELECT USING (auth.uid() = user_id);
INSERT INTO public.rewards (
        section,
        title,
        description,
        cost,
        icon_key,
        unlock_threshold
    )
VALUES (
        'power_tools',
        'AI Credit Analysis',
        'Instant deep-scan of your credit report.',
        500,
        'cpu',
        0
    ),
    (
        'power_tools',
        'The "Delete Anything" Letter',
        'Aggressive dispute template.',
        800,
        'shield_alert',
        0
    ),
    (
        'power_tools',
        'FICO Simulator Pro',
        'Unlock advanced scenarios.',
        300,
        'activity',
        0
    ),
    (
        'access',
        'Office Hours (Group)',
        'Access to live Q&A with Dean Sterling.',
        1500,
        'users',
        1000
    ),
    (
        'identity',
        'Founder''s Circle Badge',
        'Permanent profile distinction.',
        5000,
        'crown',
        0
    ),
    (
        'identity',
        'Streak Shield',
        'Protect your daily streak.',
        300,
        'shield',
        0
    ),
    (
        'digital',
        'Wealth Architect Planner',
        'PDF Workbook for 5-year vision.',
        150,
        'book',
        0
    );
-- Purchase RPC
CREATE OR REPLACE FUNCTION public.purchase_reward_v2(reward_uuid UUID) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE reward_rec RECORD;
user_points INTEGER;
BEGIN
SELECT * INTO reward_rec
FROM public.rewards
WHERE id = reward_uuid;
IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'message', 'Item not found');
END IF;
SELECT moo_points INTO user_points
FROM public.profiles
WHERE id = auth.uid();
IF user_points < reward_rec.cost THEN RETURN jsonb_build_object(
    'success',
    false,
    'message',
    'Insufficient Alignment Points'
);
END IF;
UPDATE public.profiles
SET moo_points = moo_points - reward_rec.cost
WHERE id = auth.uid();
INSERT INTO public.user_rewards (user_id, reward_id, status)
VALUES (auth.uid(), reward_uuid, 'fulfilled');
RETURN jsonb_build_object(
    'success',
    true,
    'remaining_points',
    user_points - reward_rec.cost
);
END;
$$;
-- =============================================================================
-- PART 3: LESSON PROGRESS (RPC)
-- =============================================================================
-- Note: Uses existing 'lesson_completions' table from original schema
-- Or 'lesson_progress' if preferred. We will use 'lesson_completions' to match schema.sql
CREATE OR REPLACE FUNCTION public.complete_lesson(lesson_id_input UUID, points_reward INT) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE current_user_id UUID;
already_done BOOLEAN;
BEGIN current_user_id := auth.uid();
-- Check if already completed (lesson_completions table uses UUID for lesson_id)
-- We assume input is UUID. If frontend sends string ID, we cast.
SELECT EXISTS (
        SELECT 1
        FROM public.lesson_completions
        WHERE user_id = current_user_id
            AND lesson_id = lesson_id_input
    ) INTO already_done;
IF already_done THEN RETURN jsonb_build_object('success', false, 'message', 'Already completed');
END IF;
INSERT INTO public.lesson_completions (user_id, lesson_id)
VALUES (current_user_id, lesson_id_input);
UPDATE public.profiles
SET moo_points = COALESCE(moo_points, 0) + points_reward
WHERE id = current_user_id;
RETURN jsonb_build_object('success', true, 'points_awarded', points_reward);
END;
$$;