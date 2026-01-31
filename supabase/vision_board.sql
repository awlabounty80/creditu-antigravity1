-- Vision Board Tables
create table if not exists public.vision_items (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    type text check (type in ('goal', 'image', 'text')) not null,
    category text,
    -- 'home', 'auto', 'business', 'travel', 'other'
    content text not null,
    -- text or image url
    caption text,
    target_score integer,
    created_at timestamptz default now()
);
alter table public.vision_items enable row level security;
create policy "Users manage own vision items" on public.vision_items for all using (auth.uid() = user_id);