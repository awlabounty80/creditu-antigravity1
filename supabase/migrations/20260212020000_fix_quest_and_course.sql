-- Fix get_quest_stats RPC
create or replace function public.get_quest_stats(user_uuid uuid) returns json as $$
declare result json;
begin
select coalesce(
        json_object_agg(
            template_id,
            json_build_object(
                'attempts',
                count(*),
                'correct',
                count(*) filter (
                    where is_correct
                )
            )
        ),
        '{}'::json
    ) into result
from public.quest_history
where user_id = user_uuid;
return result;
end;
$$ language plpgsql security definer;
-- Ensure quest_history exists
create table if not exists public.quest_history (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    template_id text not null,
    is_correct boolean default false,
    created_at timestamptz default now()
);
-- RLS for quest_history
alter table public.quest_history enable row level security;
-- Drop existing policies to avoid conflicts
drop policy if exists "Users manage own quest history" on public.quest_history;
create policy "Users manage own quest history" on public.quest_history for all using (auth.uid() = user_id);
-- Ensure user_progress exists
create table if not exists public.user_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    lesson_id text not null,
    is_completed boolean default false,
    completed_at timestamptz default now(),
    unique(user_id, lesson_id)
);
-- RLS for user_progress
alter table public.user_progress enable row level security;
drop policy if exists "Users manage own progress" on public.user_progress;
create policy "Users manage own progress" on public.user_progress for all using (auth.uid() = user_id);
-- Grant permissions
grant select,
    insert,
    update on public.quest_history to authenticated;
grant select,
    insert,
    update on public.user_progress to authenticated;