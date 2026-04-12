-- Credit U Curriculum Schema (User Provided)
-- 1) Tracks (e.g., Freshman 5 Personal Credit Tracks)
create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Modules (units inside tracks)
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.tracks(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  order_index int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (track_id, slug)
);

-- 3) Lessons (the actual content)
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text,
  content_type text not null default 'mixed', -- video|reading|mixed|quiz
  video_url text,
  reading_markdown text,
  duration_seconds int,
  order_index int not null default 0,
  is_published boolean not null default false,

  -- Compliance / trust layer
  source_verified boolean not null default false,
  sources jsonb not null default '[]'::jsonb,  -- [{label, url, authority}]
  compliance_tags text[] not null default '{}'::text[],

  -- Optional: takeaways for right rail
  key_takeaways text[] not null default '{}'::text[],

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

-- 4) Student Progress (required)
create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, -- auth.users.id
  lesson_id uuid not null references public.lessons(id) on delete cascade,

  status text not null default 'not_started', -- not_started|in_progress|complete
  progress_percent int not null default 0,    -- 0-100
  score int,                                  -- for quizzes later
  started_at timestamptz,
  completed_at timestamptz,
  last_seen_at timestamptz not null default now(),

  -- gamification hooks (future-ready)
  xp_earned int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- 5) Field Notes (right rail notes per lesson)
create table if not exists public.lesson_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- 6) Student Streaks (retention loop)
create table if not exists public.student_streaks (
  user_id uuid primary key,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_modules_track_order on public.modules(track_id, order_index);
create index if not exists idx_lessons_module_order on public.lessons(module_id, order_index);
create index if not exists idx_progress_user on public.student_progress(user_id);
create index if not exists idx_notes_user on public.lesson_notes(user_id);

-- RLS POLICIES (Added 2024-01-29)

alter table public.tracks enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.student_progress enable row level security;
alter table public.lesson_notes enable row level security;
alter table public.student_streaks enable row level security;

-- Published content readable by anyone authenticated
create policy "tracks_read_published"
on public.tracks for select
to authenticated
using (is_published = true);

create policy "modules_read_published"
on public.modules for select
to authenticated
using (is_published = true);

create policy "lessons_read_published"
on public.lessons for select
to authenticated
using (is_published = true);

-- Progress: only owner
create policy "progress_select_own"
on public.student_progress for select
to authenticated
using (user_id = auth.uid());

create policy "progress_upsert_own"
on public.student_progress for insert
to authenticated
with check (user_id = auth.uid());

create policy "progress_update_own"
on public.student_progress for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Notes: only owner
create policy "notes_select_own"
on public.lesson_notes for select
to authenticated
using (user_id = auth.uid());

create policy "notes_upsert_own"
on public.lesson_notes for insert
to authenticated
with check (user_id = auth.uid());

create policy "notes_update_own"
on public.lesson_notes for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Streaks: only owner
create policy "streaks_select_own"
on public.student_streaks for select
to authenticated
using (user_id = auth.uid());

create policy "streaks_upsert_own"
on public.student_streaks for insert
to authenticated
with check (user_id = auth.uid());

create policy "streaks_update_own"
on public.student_streaks for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
