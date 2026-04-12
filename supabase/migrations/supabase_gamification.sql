-- Gamification Schema (Additive Phase 1B)

-- 1. Student Wallets (XP)
create table if not exists public.student_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp_total int not null default 0,
  xp_lifetime int not null default 0,
  last_xp_awarded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.student_wallets enable row level security;
create policy "wallets_read_own" on public.student_wallets for select to authenticated using (user_id = auth.uid());
create policy "wallets_update_own" on public.student_wallets for update to authenticated using (user_id = auth.uid());

-- 2. Badges
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon text, -- Lucide icon name
  xp_reward int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.badges enable row level security;
create policy "badges_read_published" on public.badges for select to authenticated using (is_published = true);

-- 3. Student Badges (Earned)
create table if not exists public.student_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);
alter table public.student_badges enable row level security;
create policy "student_badges_read_own" on public.student_badges for select to authenticated using (user_id = auth.uid());
create policy "student_badges_insert_own" on public.student_badges for insert to authenticated with check (user_id = auth.uid());

-- 4. Lesson Prerequisites
create table if not exists public.lesson_prereqs (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  prereq_lesson_id uuid not null references public.lessons(id) on delete cascade,
  primary key (lesson_id, prereq_lesson_id)
);
alter table public.lesson_prereqs enable row level security;
create policy "prereqs_read_all" on public.lesson_prereqs for select to authenticated using (true);


-- RPC: Award XP (Atomic increment)
create or replace function award_xp(p_user_id uuid, p_amount int)
returns void as $$
begin
  insert into public.student_wallets (user_id, xp_total, xp_lifetime, last_xp_awarded_at)
  values (p_user_id, p_amount, p_amount, now())
  on conflict (user_id) do update
  set xp_total = student_wallets.xp_total + p_amount,
      xp_lifetime = student_wallets.xp_lifetime + p_amount,
      last_xp_awarded_at = now();
end;
$$ language plpgsql security definer;

-- RPC: Update Streak (Daily logic)
create or replace function update_streak(p_user_id uuid)
returns jsonb as $$
declare
  v_last_active date;
  v_current_streak int;
  v_best_streak int;
  v_today date := current_date;
  v_result jsonb;
begin
  -- Get current state
  select last_active_date, current_streak, best_streak 
  into v_last_active, v_current_streak, v_best_streak
  from public.student_streaks
  where user_id = p_user_id;

  if not found then
    -- First time ever
    insert into public.student_streaks (user_id, current_streak, best_streak, last_active_date)
    values (p_user_id, 1, 1, v_today);
    return json_build_object('streak', 1, 'updated', true);
  end if;

  if v_last_active = v_today then
    -- Already active today, no change
    return json_build_object('streak', v_current_streak, 'updated', false);
  elsif v_last_active = v_today - 1 then
    -- Consecutive day
    v_current_streak := v_current_streak + 1;
    if v_current_streak > v_best_streak then
      v_best_streak := v_current_streak;
    end if;
    
    update public.student_streaks
    set current_streak = v_current_streak,
        best_streak = v_best_streak,
        last_active_date = v_today,
        updated_at = now()
    where user_id = p_user_id;
    
    return json_build_object('streak', v_current_streak, 'updated', true);
  else
    -- Streak broken (missed at least one day)
    update public.student_streaks
    set current_streak = 1,
        last_active_date = v_today,
        updated_at = now()
    where user_id = p_user_id;
    
    return json_build_object('streak', 1, 'updated', true);
  end if;
end;
$$ language plpgsql security definer;

-- Seed Data (Badges)
insert into public.badges (slug, title, description, icon, xp_reward)
values 
('freshman_initiated', 'Freshman Initiated', 'Completed your first lesson.', 'Zap', 50),
('bureau_scholar', 'Bureau Scholar', 'Completed the 3 Bureaus lesson.', 'Book', 100),
('consistency_3', 'Hat Trick', '3 Day Streak.', 'Flame', 150),
('note_taker', 'Field Reporter', 'Saved your first field note.', 'PenTool', 25)
on conflict (slug) do nothing;
