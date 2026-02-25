-- MISSING TABLE: Upgrade Windows
create table if not exists public.upgrade_windows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  opened_at timestamptz not null default now(),
  closes_at timestamptz not null,
  closed_at timestamptz,
  status text not null check (status in ('open','closed','converted')) default 'open',
  trigger_report_id uuid references public.credit_reports(id) on delete set null
);
alter table public.upgrade_windows enable row level security;

-- JUST IN CASE: Base User Tables (If these are missing, Auth crashes too)
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  phone text,
  timezone text default 'America/Chicago',
  score int -- Needed for the update in triggers
);
alter table public.user_profiles enable row level security;

create table if not exists public.memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null check (status in ('free','active','past_due','canceled')) default 'free',
  plan_price numeric not null default 39.99,
  started_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.memberships enable row level security;
