-- ENABLE USERS TO UPDATE THEIR OWN PROFILE AND MEMBERSHIP
-- (Required for the "Activate Member Tier" Dev Button)

-- 1. Memberships (user_id is the foreign key)
alter table public.memberships enable row level security;
drop policy if exists "memberships_view_own" on public.memberships;
create policy "memberships_view_own" on public.memberships for select using (auth.uid() = user_id);

drop policy if exists "memberships_update_own" on public.memberships;
create policy "memberships_update_own" on public.memberships for update using (auth.uid() = user_id);

drop policy if exists "memberships_insert_own" on public.memberships;
create policy "memberships_insert_own" on public.memberships for insert with check (auth.uid() = user_id);

-- 2. User Profiles (user_id is the primary key/fk)
alter table public.user_profiles enable row level security;
drop policy if exists "profiles_view_own" on public.user_profiles;
create policy "profiles_view_own" on public.user_profiles for select using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.user_profiles;
create policy "profiles_update_own" on public.user_profiles for update using (auth.uid() = user_id);
