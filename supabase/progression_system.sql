-- PROGRESSION SYSTEM SCHEMA
-- 1. Track Completed Articles
CREATE TABLE IF NOT EXISTS public.user_completed_articles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points_awarded INTEGER DEFAULT 50,
    PRIMARY KEY (user_id, article_id)
);
ALTER TABLE public.user_completed_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_completed_articles FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark articles complete" ON public.user_completed_articles FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- 2. User Disputes (Drafts & History)
CREATE TABLE IF NOT EXISTS public.user_disputes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    creditor_name TEXT NOT NULL,
    dispute_reason TEXT NOT NULL,
    letter_content TEXT,
    -- Redacted or Full
    status TEXT DEFAULT 'draft',
    -- draft, exported, printed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.user_disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own disputes" ON public.user_disputes FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create disputes" ON public.user_disputes FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own disputes" ON public.user_disputes FOR
UPDATE USING (auth.uid() = user_id);
-- 3. RPC Function to Award Points Safely
-- This function marks the article as complete AND increments the user's points in one transaction.
CREATE OR REPLACE FUNCTION public.complete_article(article_uuid UUID) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE is_already_done BOOLEAN;
BEGIN -- Check if already completed
SELECT EXISTS (
        SELECT 1
        FROM public.user_completed_articles
        WHERE user_id = auth.uid()
            AND article_id = article_uuid
    ) INTO is_already_done;
IF is_already_done THEN RETURN jsonb_build_object('success', false, 'message', 'Already completed');
END IF;
-- Insert completion record
INSERT INTO public.user_completed_articles (user_id, article_id, points_awarded)
VALUES (auth.uid(), article_uuid, 50);
-- Increment User Profile Points
UPDATE public.profiles
SET moo_points = COALESCE(moo_points, 0) + 50
WHERE id = auth.uid();
RETURN jsonb_build_object('success', true, 'points', 50);
END;
$$;