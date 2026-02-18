-- Create lesson_completions table if not exists
create table if not exists public.lesson_completions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    lesson_id text not null,
    completed_at timestamptz default now(),
    unique(user_id, lesson_id),
    points_awarded int default 0
);
-- RLS
alter table public.lesson_completions enable row level security;
drop policy if exists "Users view own completions" on public.lesson_completions;
create policy "Users view own completions" on public.lesson_completions for
select using (auth.uid() = user_id);
drop policy if exists "Users insert own completions" on public.lesson_completions;
create policy "Users insert own completions" on public.lesson_completions for
insert with check (auth.uid() = user_id);
-- Create enrollments table
create table if not exists public.enrollments (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    course_id text not null,
    progress_percent int default 0,
    enrolled_at timestamptz default now(),
    last_accessed timestamptz default now(),
    unique(user_id, course_id)
);
-- RLS
alter table public.enrollments enable row level security;
drop policy if exists "Users view own enrollments" on public.enrollments;
create policy "Users view own enrollments" on public.enrollments for
select using (auth.uid() = user_id);
drop policy if exists "Users update own enrollments" on public.enrollments;
create policy "Users update own enrollments" on public.enrollments for
update using (auth.uid() = user_id);
drop policy if exists "Users insert own enrollments" on public.enrollments;
create policy "Users insert own enrollments" on public.enrollments for
insert with check (auth.uid() = user_id);
-- Create complete_lesson RPC
create or replace function public.complete_lesson(lesson_id_input text, points_reward int) returns json as $$
declare current_user_id uuid;
completion_record public.lesson_completions;
already_completed boolean;
begin current_user_id := auth.uid();
-- Check if already completed
select exists(
        select 1
        from public.lesson_completions
        where user_id = current_user_id
            and lesson_id = lesson_id_input
    ) into already_completed;
if already_completed then return json_build_object('success', false, 'message', 'Already completed');
end if;
-- Insert completion
insert into public.lesson_completions (user_id, lesson_id, points_awarded)
values (current_user_id, lesson_id_input, points_reward)
returning * into completion_record;
-- Award Points (assuming profiles table has moo_points)
update public.profiles
set moo_points = coalesce(moo_points, 0) + points_reward
where id = current_user_id;
return json_build_object('success', true, 'points', points_reward);
end;
$$ language plpgsql security definer;