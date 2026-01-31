-- Create table for storing credit reports
create table public.credit_reports (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    file_path text not null,
    -- Supabase Storage path
    provider text default 'manual_upload',
    -- For now, we assume PDF upload
    status text check (
        status in ('processing', 'analyzed', 'error', 'archived')
    ) default 'processing',
    report_date date default CURRENT_DATE,
    upload_timestamp timestamptz default now(),
    encrypted_metadata jsonb -- For storing parsed results
);
-- Enable RLS
alter table public.credit_reports enable row level security;
-- Policies
-- Policies
DROP POLICY IF EXISTS "Users can view their own reports" ON public.credit_reports;
create policy "Users can view their own reports" on public.credit_reports for
select using (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can upload their own reports" ON public.credit_reports;
create policy "Users can upload their own reports" on public.credit_reports for
insert with check (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own reports" ON public.credit_reports;
create policy "Users can update their own reports" on public.credit_reports for
update using (auth.uid() = user_id);
-- Create storage bucket for secure reports if it doesn't exist
-- Note: You generally create buckets in the dashboard, but we can document the requirement.
-- Bucket Name: 'secure-reports'
-- Public: FALSE (Very Important)