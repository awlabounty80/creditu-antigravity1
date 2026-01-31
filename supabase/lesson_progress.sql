-- Create a table for Lesson Progress that mirrors the Lovable logic
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, lesson_id)
);
-- Enable RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
-- Policies
CREATE POLICY "Users can view their own progress" ON public.lesson_progress FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.lesson_progress FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.lesson_progress FOR
UPDATE USING (auth.uid() = user_id);
-- RPC Function to mark lesson complete securely
CREATE OR REPLACE FUNCTION public.complete_lesson(lesson_id TEXT, points_reward INT) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE current_user_id UUID;
already_done BOOLEAN;
BEGIN current_user_id := auth.uid();
-- Check if already completed
SELECT EXISTS (
        SELECT 1
        FROM public.lesson_progress
        WHERE user_id = current_user_id
            AND lesson_id = complete_lesson.lesson_id
    ) INTO already_done;
IF already_done THEN RETURN jsonb_build_object('success', false, 'message', 'Already completed');
END IF;
-- Record Completion
INSERT INTO public.lesson_progress (user_id, lesson_id, is_completed)
VALUES (current_user_id, lesson_id, true);
-- Award Points (Reusing existing moo_point logic if possible, or direct update)
-- Assuming profiles table exists with moo_points
UPDATE public.profiles
SET moo_points = COALESCE(moo_points, 0) + points_reward
WHERE id = current_user_id;
RETURN jsonb_build_object('success', true, 'points_awarded', points_reward);
END;
$$;