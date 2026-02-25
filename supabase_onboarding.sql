
-- CORRECTED: Add Onboarding Fields to User Profiles (Using user_id)
-- 1. Ensure table structure (if missing)
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text,
  full_name text,
  avatar_url text,
  updated_at timestamptz
);

-- 2. Add Path Columns
alter table public.user_profiles 
add column if not exists onboarding_path text,
add column if not exists onboarding_completed boolean default false;

-- 3. RLS Policies (Using correctly identified 'user_id' column)
alter table public.user_profiles enable row level security;

-- Drop old policies if they exist to prevent conflicts/errors
drop policy if exists "profiles_read_all" on public.user_profiles;
drop policy if exists "profiles_update_own" on public.user_profiles;
drop policy if exists "profiles_insert_own" on public.user_profiles;

create policy "profiles_read_all" on public.user_profiles for select to authenticated using (true);
create policy "profiles_update_own" on public.user_profiles for update to authenticated using (user_id = auth.uid());
create policy "profiles_insert_own" on public.user_profiles for insert to authenticated with check (user_id = auth.uid());
