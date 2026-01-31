-- GLOBAL CAMPUS SCHEMA (COMMUNITY)
-- 1. Forum Threads
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    -- 'General', 'Success Stories', 'Credit Strategies', etc.
    content TEXT,
    -- Initial post content
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Forum Replies (for diving deeper)
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Security
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
-- Everyone can read threads
CREATE POLICY "Public threads" ON public.forum_threads FOR
SELECT USING (true);
CREATE POLICY "Public replies" ON public.forum_replies FOR
SELECT USING (true);
-- Authenticated users can create threads
CREATE POLICY "Users create threads" ON public.forum_threads FOR
INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users create replies" ON public.forum_replies FOR
INSERT WITH CHECK (auth.uid() = author_id);
-- 4. Realtime Enabler (Optional but requested in code)
-- You must enable Realtime in Supabase Dashboard -> Database -> Replication for 'forum_threads'
-- 5. Seed Data
INSERT INTO public.forum_threads (title, category, views, created_at)
VALUES (
        'How I deleted 5 Collections in 30 Days',
        'Success Stories',
        1205,
        NOW() - INTERVAL '2 days'
    ),
    (
        'Understanding the 30% Rule vs AZEO',
        'Credit Strategies',
        840,
        NOW() - INTERVAL '5 days'
    ),
    (
        'Has anyone tried the "Method of Verification" letter?',
        'Dispute Strategies',
        450,
        NOW() - INTERVAL '1 day'
    ) ON CONFLICT DO NOTHING;