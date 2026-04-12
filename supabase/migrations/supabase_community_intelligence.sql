-- ANTIGRAVITY INTELLIGENCE
-- Run this to enable the Honor Roll and Network Stats

-- 1. SECURE LEADERBOARD (Honor Roll)
-- Returns top students without exposing private emails
CREATE OR REPLACE FUNCTION get_honor_roll()
RETURNS TABLE (
  username TEXT,
  moo_points INTEGER,
  tier TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(up.username, 'Anonymous Student') as username,
    COALESCE(up.moo_points, 0) as moo_points,
    -- Determine Tier based on points (Logic can be customized)
    CASE 
      WHEN up.moo_points > 5000 THEN 'Legend'
      WHEN up.moo_points > 1000 THEN 'Scholar'
      ELSE 'Member'
    END as tier
  FROM public.user_profiles up
  ORDER BY up.moo_points DESC
  LIMIT 50;
END;
$$;

-- 2. GLOBAL NETWORK STATS
-- Aggregates data for the community dashboard
CREATE OR REPLACE FUNCTION get_network_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_users INTEGER;
  total_points INTEGER;
  total_lessons INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_users FROM public.user_profiles;
  SELECT SUM(moo_points) INTO total_points FROM public.user_profiles;
  -- Assuming lesson_progress table exists
  SELECT COUNT(*) INTO total_lessons FROM public.lesson_progress WHERE status = 'completed';

  RETURN jsonb_build_object(
    'total_users', total_users,
    'total_points', COALESCE(total_points, 0),
    'total_lessons', COALESCE(total_lessons, 0)
  );
END;
$$;
