-- STANDARDISING ADMIN ROLE
-- Matches the frontend code: if (profile?.role !== 'admin')

-- 1. Add 'role' column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- 2. Grant Admin Rights (Example)
-- Replace 'dev@example.com' with your actual email or user_id
-- UPDATE public.user_profiles SET role = 'admin' WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your_email@example.com');

-- For now, we rely on the RLS policy we set earlier or Manual Updates in Supabase Dashboard.
-- This script ensures the COLUMN exists so the app doesn't crash when checking profile.role.
