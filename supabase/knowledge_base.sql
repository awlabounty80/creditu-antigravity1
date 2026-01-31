-- KNOWLEDGE BASE SCHEMA
-- Phase 1 Foundation
-- 1. Knowledge Articles
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
    -- embedding vector(1536), -- Reserved for Phase 3 (RAG)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Tags
CREATE TABLE IF NOT EXISTS public.knowledge_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);
-- 3. Article Tags (Junction)
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
-- 5. RLS Policies
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
-- Public/Student Read Access
CREATE POLICY "Everyone can read published articles" ON public.knowledge_articles FOR
SELECT USING (is_published = true);
CREATE POLICY "Everyone can read tags" ON public.knowledge_tags FOR
SELECT USING (true);
CREATE POLICY "Everyone can read article tags" ON public.article_tags FOR
SELECT USING (true);
-- User Bookmarks Policies
CREATE POLICY "Users can view own bookmarks" ON public.user_bookmarks FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);
-- Admin Write Access (Simulated for potentially all auth users for now, or strict admin later)
-- For MVP, we allow authenticated users to be "Admins" for content creation if they have the right role, 
-- but for now let's just allow all authenticated users to read.
-- We will rely on the dashboard for 'write' checks or add a specific policy if needed.
-- For safety, we grant Insert/Update only to service_role or specific admin UUIDs usually.
-- Here, we'll leave Write policies restricted to service_role (Admin Dashboard) by default, 
-- unless we want the 'Instructor' role to write.