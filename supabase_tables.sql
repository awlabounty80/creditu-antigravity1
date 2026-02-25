-- MISSING TABLES SETUP
-- Run this to create the core application tables.

-- 1. Credit Reports
create table if not exists public.credit_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  report_source text default 'myfreescorenow',
  report_date date,
  parse_status text not null check (parse_status in ('pending','parsed','failed')) default 'pending',
  score_experian int,
  score_equifax int,
  score_transunion int,
  file_object_path text
);
alter table public.credit_reports enable row level security;

-- 2. Credit Accounts
create table if not exists public.credit_accounts (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.credit_reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  bureau text check (bureau in ('EX','EQ','TU')),
  account_type text, 
  creditor_name text,
  masked_account text,
  status text,
  date_opened date,
  last_reported date,
  balance numeric,
  credit_limit numeric,
  past_due numeric,
  payment_status text,
  derogatory_flag boolean default false,
  notes text
);
alter table public.credit_accounts enable row level security;

-- 3. Monthly Snapshots
create table if not exists public.monthly_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  snapshot_month date not null,
  score int,
  utilization_pct numeric,
  total_collections int,
  total_chargeoffs int,
  total_lates int,
  total_inquiries_12mo int,
  narrative text
);
alter table public.monthly_snapshots enable row level security;

-- 4. Action Queue
create table if not exists public.action_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  cycle_month date not null,
  action_type text not null,
  priority int not null default 50,
  account_id uuid references public.credit_accounts(id) on delete set null,
  title text not null,
  rationale text not null,
  next_step text,
  is_completed boolean not null default false
);
alter table public.action_queue enable row level security;

-- 5. Payment Targets
create table if not exists public.payment_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_month date not null,
  account_id uuid references public.credit_accounts(id) on delete set null,
  target_utilization_pct numeric not null default 7,
  current_utilization_pct numeric,
  suggested_payment_amount numeric,
  rationale text
);
alter table public.payment_targets enable row level security;

-- 6. Message Log
create table if not exists public.message_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  channel text not null,
  template_key text not null,
  status text not null default 'queued',
  meta jsonb
);
alter table public.message_log enable row level security;

-- 7. Letter History
create table if not exists public.letter_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  account_id uuid,
  cycle_month date not null,
  reason text,
  generated_at timestamptz default now()
);
alter table public.letter_history enable row level security;
