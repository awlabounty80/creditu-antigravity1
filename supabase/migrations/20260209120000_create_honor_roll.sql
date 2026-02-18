create table if not exists honor_roll (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    display_name text,
    cumulative_gpa numeric(4, 2) not null,
    total_credits integer not null default 0,
    academic_level text check (
        academic_level in (
            'freshman',
            'sophomore',
            'junior',
            'senior',
            'graduate',
            'foundation'
        )
    ),
    honor_type text check (
        honor_type in (
            'summa_cum_laude',
            'magna_cum_laude',
            'cum_laude',
            'deans_list'
        )
    ),
    last_updated timestamptz default now(),
    opt_in boolean default true,
    unique(user_id)
);
-- Enable RLS
alter table honor_roll enable row level security;
-- Policy: Public read for opt-in students
create policy "Honor Roll is viewable by everyone" on honor_roll for
select using (opt_in = true);
-- Policy: Users can see themselves regardless of opt-in
create policy "Users can see their own honor roll status" on honor_roll for
select using (auth.uid() = user_id);
-- Policy: Users can update their own opt-in status
create policy "Users can update their own opt-in" on honor_roll for
update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Create index for performance
create index honor_roll_gpa_idx on honor_roll (cumulative_gpa desc);