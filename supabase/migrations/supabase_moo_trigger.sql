-- 1. Ensure user_profiles has moo_points (AuthContext uses this table)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS moo_points INTEGER DEFAULT 0;

-- 2. Create lesson_progress table (if not exists)
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    lesson_id TEXT NOT NULL,
    status TEXT DEFAULT 'started',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- 3. RLS for lesson_progress
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON public.lesson_progress;
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.lesson_progress;
CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.lesson_progress;
CREATE POLICY "Users can insert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Clean up old trigger
DROP TRIGGER IF EXISTS on_lesson_completed ON public.lesson_progress;
DROP FUNCTION IF EXISTS grant_moo_points_on_completion();

-- 5. Improved Function (Security Definer to bypass RLS for point updates)
CREATE OR REPLACE FUNCTION grant_moo_points_on_completion()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
AS $$
BEGIN
  -- Logic: If status changes to 'completed', boost points in user_profiles
  -- We target 'user_profiles' because that is what the App's AuthContext uses.
  IF NEW.status = 'completed' AND (COALESCE(OLD.status, '') != 'completed') THEN
    UPDATE public.user_profiles 
    SET moo_points = COALESCE(moo_points, 0) + 50 
    WHERE user_id = NEW.user_id; 
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. The Trigger
CREATE TRIGGER on_lesson_completed
  AFTER UPDATE ON public.lesson_progress 
  FOR EACH ROW
  EXECUTE FUNCTION grant_moo_points_on_completion();
