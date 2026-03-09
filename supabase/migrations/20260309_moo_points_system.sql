-- Migration: Phase 25 Moo Points & Lesson Completion System
-- Date: 2026-03-09

-- 1. Create/Update Student Progress Table (Normalized)
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL, -- UUID or Slug ID
    module_id TEXT, -- Added for phase/module level tracking
    phase_id TEXT,  -- Added for phase/module level tracking
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    moo_points_awarded INTEGER DEFAULT 25,
    UNIQUE(user_id, lesson_id)
);

-- 2. Create Student Moo Points Table (Wallet)
CREATE TABLE IF NOT EXISTS public.student_moo_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Student Achievements Table
CREATE TABLE IF NOT EXISTS public.student_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_slug TEXT NOT NULL, -- 'first-lesson', '100-points', 'module-master', 'phase-graduate'
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    moo_points_bonus INTEGER DEFAULT 0,
    UNIQUE(user_id, achievement_slug)
);

-- 4. Atomic Function: Upsert Lesson Completion and Award Points
CREATE OR REPLACE FUNCTION public.upsert_lesson_completion(
    p_lesson_id TEXT,
    p_module_id TEXT,
    p_phase_id TEXT,
    p_points_reward INTEGER DEFAULT 25
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID;
    v_already_done BOOLEAN;
    v_total_points INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    -- 1. Check if already completed
    SELECT EXISTS (
        SELECT 1 FROM public.student_progress 
        WHERE user_id = v_user_id AND lesson_id = p_lesson_id
    ) INTO v_already_done;

    IF v_already_done THEN
        RETURN jsonb_build_object('success', false, 'message', 'Already completed');
    END IF;

    -- 2. Record Completion
    INSERT INTO public.student_progress (user_id, lesson_id, module_id, phase_id, completed, moo_points_awarded)
    VALUES (v_user_id, p_lesson_id, p_module_id, p_phase_id, true, p_points_reward);

    -- 3. Increment Wallet
    INSERT INTO public.student_moo_points (user_id, total_points)
    VALUES (v_user_id, p_points_reward)
    ON CONFLICT (user_id) DO UPDATE 
    SET total_points = public.student_moo_points.total_points + EXCLUDED.total_points,
        updated_at = NOW()
    RETURNING total_points INTO v_total_points;

    -- 4. Check for Milestone Achievements (Optional but Recommended)
    -- First Lesson Achievement
    IF NOT EXISTS (SELECT 1 FROM public.student_achievements WHERE user_id = v_user_id AND achievement_slug = 'first-lesson') THEN
        INSERT INTO public.student_achievements (user_id, achievement_slug, moo_points_bonus)
        VALUES (v_user_id, 'first-lesson', 50);
        
        -- Add bonus points to wallet
        UPDATE public.student_moo_points 
        SET total_points = total_points + 50,
            updated_at = NOW()
        WHERE user_id = v_user_id
        RETURNING total_points INTO v_total_points;
    END IF;

    RETURN jsonb_build_object(
        'success', true, 
        'points_awarded', p_points_reward, 
        'total_points', v_total_points,
        'new_achievement', (SELECT COUNT(*) FROM public.student_achievements WHERE user_id = v_user_id AND awarded_at > NOW() - INTERVAL '1 second') > 0
    );
END;
$$;

-- RLS Policies
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_moo_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.student_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own points" ON public.student_moo_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON public.student_achievements FOR SELECT USING (auth.uid() = user_id);
