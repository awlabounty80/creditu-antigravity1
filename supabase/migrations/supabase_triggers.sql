-- 1. Drop old versions
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Create the Function (UPDATED: Grants 'active' status)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create Profile
  insert into public.user_profiles (user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);

  -- Create Membership (UPDATED: 'active' so you can see the Dashboard immediately)
  insert into public.memberships (user_id, status)
  values (new.id, 'active');
  
  -- Create Upgrade Window
  insert into public.upgrade_windows (user_id, closes_at)
  values (new.id, now() + interval '7 days');

  return new;
end;
$$ language plpgsql security definer;

-- 3. Create the Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
