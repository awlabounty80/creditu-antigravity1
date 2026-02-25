-- FIXED MOO STORE SCRIPT (UUIDs everywhere)

-- 1. Reset (Drop old tables to avoid conflicts)
drop table if exists public.moo_store_purchases;
drop table if exists public.moo_store_items;

-- 2. Create Items Table (Using UUID for ID)
create table public.moo_store_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  price_cents int default 0,
  image_url text,
  is_free_item boolean default false,
  is_member_only boolean default false,
  is_active boolean default true,
  sort_order int default 100,
  created_at timestamptz default now()
);

-- 3. Create Purchases Table
create table public.moo_store_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  item_id uuid references public.moo_store_items(id) on delete cascade,
  purchased_at timestamptz default now()
);

-- 4. RLS
alter table public.moo_store_items enable row level security;
alter table public.moo_store_purchases enable row level security;

create policy "moo_view_active" on public.moo_store_items for select using (is_active = true);
create policy "moo_purchases_own" on public.moo_store_purchases for select using (auth.uid() = user_id);
create policy "moo_purchases_add" on public.moo_store_purchases for insert with check (auth.uid() = user_id);

-- 5. Seed Data
insert into public.moo_store_items (name, description, category, price_cents, is_free_item, is_member_only, sort_order)
values
  ('Credit U Sticker Pack', 'Digital assets to show your pride.', 'Swag', 0, true, false, 1),
  ('Monthly Budget Tracker', 'Advanced spreadsheet for tracking expenses.', 'Tools', 0, true, false, 2),
  ('Debt Snowball Calculator', 'Optimize your payoff strategy.', 'Tools', 499, false, true, 3),
  ('Bureau Freeze Guide', 'Step-by-step PDF guide to locking your report.', 'Education', 0, false, true, 4),
  ('Credit U Alumni Hoodie', 'Premium heavyweight hoodie (Physical).', 'Swag', 4999, false, true, 5),
  ('Dispute Letter Templates (Advanced)', 'The full suite of 50+ templates.', 'Tools', 0, false, true, 6);
