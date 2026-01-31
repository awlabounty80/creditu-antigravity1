-- Integrated Campus Schema
-- 1. Forum Threads
create table if not exists public.forum_threads (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    category text not null,
    -- 'General', 'Success Stories', 'Disputes', 'Credit Scoring'
    author_id uuid references auth.users(id),
    views integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- 2. Forum Posts (Replies)
create table if not exists public.forum_posts (
    id uuid default gen_random_uuid() primary key,
    thread_id uuid references public.forum_threads(id) on delete cascade not null,
    author_id uuid references auth.users(id),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- 3. User Lesson Progress
create table if not exists public.user_progress (
    user_id uuid references auth.users(id) not null,
    lesson_id uuid references public.lessons(id) not null,
    -- Assumes lessons table exists (from seed.sql implied schema)
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, lesson_id)
);
-- RLS Policies (Simple for now: public read, auth write)
alter table public.forum_threads enable row level security;
alter table public.forum_posts enable row level security;
alter table public.user_progress enable row level security;
create policy "Public threads are viewable by everyone." on public.forum_threads for
select using (true);
create policy "Users can insert their own threads." on public.forum_threads for
insert with check (auth.uid() = author_id);
create policy "Public posts are viewable by everyone." on public.forum_posts for
select using (true);
create policy "Users can insert their own posts." on public.forum_posts for
insert with check (auth.uid() = author_id);
create policy "Users can view their own progress." on public.user_progress for
select using (auth.uid() = user_id);
create policy "Users can update their own progress." on public.user_progress for
insert with check (auth.uid() = user_id);