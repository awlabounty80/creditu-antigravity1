-- triggers.sql
-- FIXED VERSION: Removed 'email' column from user_profiles insert (it does not exist in schema)
-- FIXED VERSION: Grants 'active' status immediately

-- 1. Drop old versions
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Create the Function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- A. Create Profile (Removed 'email' which was causing the crash)
  insert into public.user_profiles (user_id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  -- B. Create Membership (Active)
  insert into public.memberships (user_id, status)
  values (new.id, 'active');
  
  -- C. Create Upgrade Window
  insert into public.upgrade_windows (user_id, closes_at)
  values (new.id, now() + interval '7 days');

  return new;
end;
$$ language plpgsql security definer;

-- 3. Create the Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
