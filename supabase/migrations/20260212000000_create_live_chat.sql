-- Create streams table
create table if not exists public.streams (
    id text primary key,
    title text,
    is_live boolean default false,
    stream_url text,
    viewer_count int default 0,
    updated_at timestamptz default now()
);
-- Seed initial stream
insert into public.streams (id, title, is_live)
values ('lecture_hall_1', 'Lecture Hall', false) on conflict (id) do nothing;
-- Create chat_messages table
create table if not exists public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    room_id text references public.streams(id),
    user_id uuid,
    -- referencing auth.users ideally, but keeping loose for simplicity
    user_name text,
    avatar_url text,
    message text,
    created_at timestamptz default now(),
    role text default 'student'
);
-- Enable Realtime
alter publication supabase_realtime
add table public.chat_messages;
alter publication supabase_realtime
add table public.streams;
-- RLS Policies
alter table public.streams enable row level security;
alter table public.chat_messages enable row level security;
-- Stream Policies
create policy "Anyone can view streams" on public.streams for
select using (true);
create policy "Admins can update streams" on public.streams for
update using (
        exists (
            select 1
            from public.profiles
            where profiles.id = auth.uid()
                and profiles.role in ('admin', 'dean')
        )
    );
-- Chat Policies
create policy "Anyone can view chat" on public.chat_messages for
select using (true);
create policy "Authenticated users can post chat" on public.chat_messages for
insert with check (auth.role() = 'authenticated');