-- Admin Policies
-- Run this to enable the Operations HQ to access all data
-- Profiles: Allow reading all profiles (for User Table)
create policy "Admin Read All Profiles" on public.profiles for
select using (true);
-- Profiles: Allow updating points (for God Mode)
create policy "Admin Update Profiles" on public.profiles for
update using (true);
-- Note: In a real production environment, 'true' should be replaced with an
-- admin check like: (auth.jwt() ->> 'email') = 'admin@credituniversity.com'