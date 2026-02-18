-- Add points column to profiles table if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'profiles'
        AND COLUMN_NAME = 'points'
) THEN
ALTER TABLE profiles
ADD COLUMN points INTEGER DEFAULT 0;
END IF;
END $$;
-- Update RLS for profiles to ensure users can see their own points
-- (Usually exists in general profile policies, but good to ensure)
CREATE POLICY "Users can view own points" ON profiles FOR
SELECT USING (auth.uid() = id);