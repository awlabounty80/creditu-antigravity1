-- KNOWLEDGE BASE SCHEMA
-- Defines the structure for Articles, Tags, and User Interactions
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
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    difficulty TEXT DEFAULT 'Freshman',
    -- 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'
    reading_time_minutes INTEGER DEFAULT 5,
    -- embedding vector(1536), -- Uncomment if pgvector is enabled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Tags (Taxonomy)
CREATE TABLE IF NOT EXISTS public.knowledge_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);
-- 3. Article Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.knowledge_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);
-- 4. User Bookmarks (Saved Items)
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, article_id)
);
-- 5. User Completed Articles (Already defined in progression_system? If so, skip or ensure compatibility)
-- Checks if table exists, if not create it.
CREATE TABLE IF NOT EXISTS public.user_completed_articles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_uuid UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, article_uuid)
);
-- RLS Policies
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Articles" ON public.knowledge_articles FOR
SELECT USING (is_published = true);
ALTER TABLE public.knowledge_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Tags" ON public.knowledge_tags FOR
SELECT USING (true);
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Article Tags" ON public.article_tags FOR
SELECT USING (true);
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Manage Bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);
ALTER TABLE public.user_completed_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Manage Completions" ON public.user_completed_articles FOR ALL USING (auth.uid() = user_id);