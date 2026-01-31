-- Create Quest History Table
create table public.quest_history (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    template_id text not null,
    -- 'utilize_windfall', 'store_card', etc.
    is_correct boolean not null,
    created_at timestamptz default now()
);
-- RLS
alter table public.quest_history enable row level security;
create policy "Users can insert own history" on public.quest_history for
insert with check (auth.uid() = user_id);
create policy "Users can view own history" on public.quest_history for
select using (auth.uid() = user_id);
-- RPC to get mastery Data
create or replace function get_quest_stats(user_uuid uuid) returns jsonb language plpgsql security definer as $$
declare result jsonb;
begin
select jsonb_object_agg(
        template_id,
        jsonb_build_object(
            'attempts',
            count(*),
            'correct',
            count(*) filter (
                where is_correct = true
            ),
            'last_correct',
            bool_or(is_correct) -- distinct check might be improved
        )
    ) into result
from quest_history
where user_id = user_uuid
group by template_id;
return result;
end;
$$;