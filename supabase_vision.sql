
-- Vision Board Schema

-- 1. Create table
create table if not exists public.user_visions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  image_url text, -- For now, we might use presets or external URLs
  category text, -- 'Home', 'Auto', 'Travel', 'Wealth'
  is_completed boolean default false,
  created_at timestamptz not null default now()
);

-- 2. RLS
alter table public.user_visions enable row level security;

create policy "visions_read_own" on public.user_visions for select to authenticated using (user_id = auth.uid());
create policy "visions_insert_own" on public.user_visions for insert to authenticated with check (user_id = auth.uid());
create policy "visions_update_own" on public.user_visions for update to authenticated using (user_id = auth.uid());
create policy "visions_delete_own" on public.user_visions for delete to authenticated using (user_id = auth.uid());
