-- FINANCIAL NERVOUS SYSTEM REPORT
-- Tracks the user's progress through the 5-day reset
CREATE TABLE public.financial_reset_progress (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    current_day INTEGER DEFAULT 1,
    -- Status
    is_complete BOOLEAN DEFAULT false,
    last_completed_at TIMESTAMP WITH TIME ZONE,
    -- Form Data
    stress_response TEXT,
    -- Day 1 input
    -- Timestamps for locking logic
    day_1_completed_at TIMESTAMP WITH TIME ZONE,
    day_2_completed_at TIMESTAMP WITH TIME ZONE,
    day_3_completed_at TIMESTAMP WITH TIME ZONE,
    day_4_completed_at TIMESTAMP WITH TIME ZONE,
    day_5_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS
ALTER TABLE public.financial_reset_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reset progress" ON public.financial_reset_progress FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own reset progress" ON public.financial_reset_progress FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reset progress" ON public.financial_reset_progress FOR
INSERT WITH CHECK (auth.uid() = user_id);