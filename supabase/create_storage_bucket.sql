-- Create a new public bucket for campus assets
insert into storage.buckets (id, name, public)
values ('campus-assets', 'campus-assets', true) on conflict (id) do nothing;
-- Set up security policies
create policy "Public Access" on storage.objects for
select using (bucket_id = 'campus-assets');
create policy "Authenticated Uploads" on storage.objects for
insert with check (
        bucket_id = 'campus-assets'
        and auth.role() = 'authenticated'
    );