-- Migration: Create user_disputes table
CREATE TABLE public.user_disputes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    creditor_name TEXT NOT NULL,
    dispute_reason TEXT NOT NULL,
    letter_content TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    -- 'draft', 'sent', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS
ALTER TABLE public.user_disputes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own disputes" ON public.user_disputes;
CREATE POLICY "Users view own disputes" ON public.user_disputes FOR
SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert own disputes" ON public.user_disputes;
CREATE POLICY "Users insert own disputes" ON public.user_disputes FOR
INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own disputes" ON public.user_disputes;
CREATE POLICY "Users update own disputes" ON public.user_disputes FOR
UPDATE USING (auth.uid() = user_id);