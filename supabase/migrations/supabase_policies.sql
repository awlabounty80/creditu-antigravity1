-- policies.sql
-- ENABLE FULL CRUD FOR AUTHENTICATED USERS
-- (Required because the "Automation" runs client-side)

-- 1. Credit Reports
create policy "reports_insert_own" on public.credit_reports for insert with check (auth.uid() = user_id);
create policy "reports_update_own" on public.credit_reports for update using (auth.uid() = user_id);
create policy "reports_delete_own" on public.credit_reports for delete using (auth.uid() = user_id);

-- 2. Credit Accounts
create policy "accounts_insert_own" on public.credit_accounts for insert with check (auth.uid() = user_id);
create policy "accounts_update_own" on public.credit_accounts for update using (auth.uid() = user_id);
create policy "accounts_delete_own" on public.credit_accounts for delete using (auth.uid() = user_id);

-- 3. Monthly Snapshots
create policy "snapshots_insert_own" on public.monthly_snapshots for insert with check (auth.uid() = user_id);
create policy "snapshots_update_own" on public.monthly_snapshots for update using (auth.uid() = user_id);
create policy "snapshots_delete_own" on public.monthly_snapshots for delete using (auth.uid() = user_id);

-- 4. Action Queue
create policy "actions_insert_own" on public.action_queue for insert with check (auth.uid() = user_id);
create policy "actions_update_own" on public.action_queue for update using (auth.uid() = user_id);
create policy "actions_delete_own" on public.action_queue for delete using (auth.uid() = user_id);

-- 5. Payment Targets
create policy "targets_insert_own" on public.payment_targets for insert with check (auth.uid() = user_id);
create policy "targets_update_own" on public.payment_targets for update using (auth.uid() = user_id);
create policy "targets_delete_own" on public.payment_targets for delete using (auth.uid() = user_id);

-- 6. Upgrade Windows
create policy "windows_insert_own" on public.upgrade_windows for insert with check (auth.uid() = user_id);
create policy "windows_update_own" on public.upgrade_windows for update using (auth.uid() = user_id);

-- 7. Message Log
create policy "messages_insert_own" on public.message_log for insert with check (auth.uid() = user_id);
