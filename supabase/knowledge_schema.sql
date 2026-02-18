-- KNOWLEDGE OS SCHEMA v1.0
-- Phase 1 of Master Plan
-- 1. Knowledge Articles (The Core Content)
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    content TEXT,
    -- Markdown content
    pillar TEXT NOT NULL,
    -- 'Foundations', 'Strategy', 'Business', 'Restoration', 'Mindset'
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    difficulty TEXT DEFAULT 'Freshman',
    -- 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'
    reading_time_minutes INTEGER DEFAULT 5,
    -- embedding vector(1536), -- Commented out until pgvector is confirmed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Tags
CREATE TABLE IF NOT EXISTS public.knowledge_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);
-- 3. Article Tags
CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.knowledge_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);
-- 4. User Bookmarks
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, article_id)
);
-- 5. RPC Function for Article Completion (Gamification Hook)
CREATE OR REPLACE FUNCTION public.complete_article(article_uuid UUID) RETURNS void AS $$
DECLARE user_points_earned INTEGER := 50;
BEGIN -- 1. Check if already completed? (Optional, skipping for now)
-- 2. Award Points (Updates Profile)
UPDATE public.profiles
SET moo_points = moo_points + user_points_earned
WHERE id = auth.uid();
-- 3. Log Completion (Optional, needs a table)
-- INSERT INTO public.article_completions ...
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- RLS Policies
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Articles" ON public.knowledge_articles FOR
SELECT USING (is_published = true);
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);
-- SEED DATA
INSERT INTO public.knowledge_articles (
        title,
        slug,
        pillar,
        summary,
        content,
        is_published,
        difficulty
    )
VALUES (
        'The 5 FICO Factors: Decoding the Algorithm',
        'fico-5-factors',
        'Foundations',
        'The specific breakdown of how payment history, utilization, age, mix, and inquiries impact your score.',
        '## The Anatomy of the Algorithm...',
        true,
        'Freshman'
    ) ON CONFLICT (slug) DO NOTHING;