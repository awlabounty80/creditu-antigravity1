-- FIX: Clean Slate Migration for Moo Store
-- This script drops the old tables to resolve the "uuid vs text" conflict.

-- 1. DROP OLD TABLES (Force Cleanup)
drop table if exists public.student_inventory cascade;
drop table if exists public.moo_store_items cascade;

-- 2. RE-CREATE STORE ITEMS (With UUID)
create table public.moo_store_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  section text not null, -- 'CREDIT_POWER_TOOLS', 'ACCESS_AND_AUTHORITY', 'IDENTITY_AND_STATUS', 'DIGITAL_GOODS', 'SPIRITUAL_AND_MINDSET', 'REAL_WORLD'
  cost int not null default 0,
  icon_slug text, -- e.g. 'Zap', 'Lock', 'Crown'
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. RE-CREATE INVENTORY
create table public.student_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.moo_store_items(id) on delete cascade,
  acquired_at timestamptz not null default now(),
  unique(user_id, item_id)
);

-- 4. RLS POLICIES
alter table public.moo_store_items enable row level security;
alter table public.student_inventory enable row level security;

create policy "store_read_all" on public.moo_store_items for select to authenticated using (is_published = true);
create policy "inventory_read_own" on public.student_inventory for select to authenticated using (user_id = auth.uid());

-- 5. RPC FUNCTION (Drop old one first)
drop function if exists purchase_moo_item(uuid);

create or replace function purchase_moo_item(p_item_id uuid)
returns jsonb as $$
declare
  v_item_cost int;
  v_user_balance int;
  v_new_balance int;
begin
  -- Get item cost
  select cost into v_item_cost from public.moo_store_items where id = p_item_id;
  if not found then
    return json_build_object('success', false, 'message', 'Item not found');
  end if;

  -- Get user balance (using user_profiles.moo_points)
  select moo_points into v_user_balance from public.user_profiles where user_id = auth.uid();
  
  -- Handle null balance
  if v_user_balance is null then v_user_balance := 0; end if;

  -- Check funds
  if v_user_balance < v_item_cost then
    return json_build_object('success', false, 'message', 'Insufficient Moo Points');
  end if;

  -- Check if already owned
  if exists (select 1 from public.student_inventory where user_id = auth.uid() and item_id = p_item_id) then
    return json_build_object('success', false, 'message', 'Item already owned');
  end if;

  -- Deduct points
  update public.user_profiles 
  set moo_points = moo_points - v_item_cost 
  where user_id = auth.uid()
  returning moo_points into v_new_balance;

  -- Award item
  insert into public.student_inventory (user_id, item_id)
  values (auth.uid(), p_item_id);

  return json_build_object('success', true, 'new_balance', v_new_balance);
end;
$$ language plpgsql security definer;


-- 6. SEED DATA

-- SECTION 1: CREDIT POWER TOOLS
insert into public.moo_store_items (title, description, section, cost, icon_slug) values
('AI Credit Report Breakdown', 'Instant analysis of negative items.', 'CREDIT_POWER_TOOLS', 500, 'Cpu'),
('Premium Dispute Letter Generator', 'Unlock advanced legal templates.', 'CREDIT_POWER_TOOLS', 800, 'FileText'),
('Score Simulation Engine', 'Predict future score changes.', 'CREDIT_POWER_TOOLS', 1200, 'Activity');

-- SECTION 2: ACCESS AND AUTHORITY
insert into public.moo_store_items (title, description, section, cost, icon_slug) values
('Office Hours Access', 'Join the weekly live Q&A.', 'ACCESS_AND_AUTHORITY', 1500, 'Users'),
('Priority Response Pass', 'Skip the line for support.', 'ACCESS_AND_AUTHORITY', 2000, 'Zap'),
('Private Channel Entry', 'Access to the "High Council" chat.', 'ACCESS_AND_AUTHORITY', 3000, 'Lock');

-- SECTION 3: IDENTITY AND STATUS
insert into public.moo_store_items (title, description, section, cost, icon_slug) values
('Founder Badge', 'Permanent profile distinction.', 'IDENTITY_AND_STATUS', 5000, 'Crown'),
('Streak Multiplier (x1.5)', 'Earn points faster for 7 days.', 'IDENTITY_AND_STATUS', 2500, 'Flame'),
('Scholar Title', 'Display "Scholar" on your ID.', 'IDENTITY_AND_STATUS', 1000, 'Award');

-- SECTION 4: DIGITAL GOODS
insert into public.moo_store_items (title, description, section, cost, icon_slug) values
('Debt Snowball Planner', 'Excel/PDF workbook for debt payoff.', 'DIGITAL_GOODS', 300, 'Table'),
('Dispute Tracking Journal', 'Keep records of every letter sent.', 'DIGITAL_GOODS', 300, 'Book'),
('Budgeting Master Sheet', 'The ultimate monthly tracker.', 'DIGITAL_GOODS', 300, 'PieChart');

-- SECTION 5: SPIRITUAL AND MINDSET
insert into public.moo_store_items (title, description, section, cost, icon_slug) values
('Financial Peace Meditation', '10-minute guided audio.', 'SPIRITUAL_AND_MINDSET', 100, 'Headphones'),
('Stewardship Affirmations', 'Daily prompts for abundance.', 'SPIRITUAL_AND_MINDSET', 100, 'Sun'),
('Wait Room Unlock', 'Access the archives of patience.', 'SPIRITUAL_AND_MINDSET', 500, 'Clock');

-- SECTION 6: REAL WORLD PERKS
insert into public.moo_store_items (title, description, section, cost, icon_slug) values
('Live Event Early Access', '72-hour head start on tickets.', 'REAL_WORLD', 1000, 'Ticket'),
('Tuition Price Lock', 'Lock your current rate forever.', 'REAL_WORLD', 5000, 'Shield');
