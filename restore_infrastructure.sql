-- RESTORATION SCRIPT: CREDIT U INFRASTRUCTURE v2026
-- Targets: Student Locker, Reward Pool, and Lesson Completion Logic

-- 1. ADMISSIONS REWARD POOL
CREATE TABLE IF NOT EXISTS public.dormweek_reward_pool (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('tip', 'resource', 'acceptance')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT,
    download_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STUDENT LOCKER
CREATE TABLE IF NOT EXISTS public.dormweek_student_locker (
    email TEXT REFERENCES auth.users(email) ON DELETE CASCADE,
    reward_id TEXT REFERENCES public.dormweek_reward_pool(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (email, reward_id)
);

-- 3. MOO POINTS (UNIFIED)
CREATE TABLE IF NOT EXISTS public.student_moo_points (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSON COMPLETION RPC
-- Handles points, progress, and streaks atomically
CREATE OR REPLACE FUNCTION public.upsert_lesson_completion(
    p_lesson_id TEXT,
    p_module_id TEXT,
    p_phase_id TEXT,
    p_points_reward INTEGER DEFAULT 25
) RETURNS JSONB 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_total_points INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Not authenticated');
    END IF;

    -- 1. Log Completion
    INSERT INTO public.student_progress (user_id, lesson_id, status, completed_at)
    VALUES (v_user_id, p_lesson_id::uuid, 'complete', NOW())
    ON CONFLICT (user_id, lesson_id) DO UPDATE 
    SET status = 'complete', completed_at = NOW();

    -- 2. Award Moo Points
    INSERT INTO public.student_moo_points (user_id, total_points, lifetime_points)
    VALUES (v_user_id, p_points_reward, p_points_reward)
    ON CONFLICT (user_id) DO UPDATE
    SET total_points = student_moo_points.total_points + p_points_reward,
        lifetime_points = student_moo_points.lifetime_points + p_points_reward,
        updated_at = NOW()
    RETURNING total_points INTO v_total_points;

    -- 3. Update Streak
    PERFORM public.update_streak(v_user_id);

    RETURN jsonb_build_object(
        'success', true, 
        'total_points', v_total_points,
        'new_achievement', false
    );
END;
$$;

-- 5. SEED REWARD POOL (THE ARSENAL)
INSERT INTO public.dormweek_reward_pool (id, type, title, content, icon, download_url)
VALUES 
('TIP-01', 'tip', 'The AZEO Method', 'All Zero Except One strategy for utilization score hacking.', 'ShieldCheck', NULL),
('RES-01', 'resource', 'Credit Report Review Checklist', 'The official CUAI checklist for auditing Metro 2 errors.', 'ClipboardCheck', '/assets/credit-audit-checklist.pdf'),
('RES-02', 'resource', 'Strategic Dispute Planner', 'Map your 90-day dispute sequence with pinpoint accuracy.', 'Map', '/resources/dispute-planner.pdf'),
('ACC-01', 'acceptance', 'Official Admission', 'You are accepted into the Freshman class of 2026.', 'GraduationCap', NULL)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.dormweek_reward_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dormweek_student_locker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_moo_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on reward pool" ON public.dormweek_reward_pool FOR SELECT USING (true);
CREATE POLICY "Allow users to see own locker" ON public.dormweek_student_locker FOR SELECT USING (true); -- Simplified for Admissions convenience
CREATE POLICY "Allow users to see own points" ON public.student_moo_points FOR SELECT USING (auth.uid() = user_id);
