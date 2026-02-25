-- Credit U™ Curriculum Schema
-- Authority: Trillionaire Build Engineer
-- Purpose: Support the Course Player, Student Progress, and Admin Management

-- 1. TRACKS (e.g., Freshman, Sophomore)
create table if not exists tracks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  cover_image text,
  order_index integer default 0,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. MODULES (Groupings within a Track)
create table if not exists modules (
  id uuid default gen_random_uuid() primary key,
  track_id uuid references tracks(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. LESSONS (The Content Units)
create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references modules(id) on delete cascade not null,
  title text not null,
  slug text not null,
  content_type text check (content_type in ('video', 'article', 'quiz')) not null default 'article',
  video_url text, -- For video content
  reading_markdown text, -- For article content / Field Notes
  duration_minutes integer default 5,
  order_index integer default 0,
  is_published boolean default false,
  is_source_verified boolean default false, -- Compliance Check
  compliance_tags text[] default array[]::text[], -- e.g., ['FCRA', 'FICO']
  key_takeaways jsonb default '[]'::jsonb, -- Array of strings
  sources jsonb default '[]'::jsonb, -- Array of objects {title, url}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (module_id, slug)
);

-- 4. STUDENT PROGRESS (Tracking completion)
create table if not exists student_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  status text check (status in ('started', 'completed')) default 'started',
  completed_at timestamp with time zone,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, lesson_id)
);

-- 5. LESSON NOTES (Private student notes)
create table if not exists lesson_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  content_markdown text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, lesson_id)
);

-- 6. STUDENT STREAKS (Gamification)
create table if not exists student_streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  current_streak integer default 0,
  max_streak integer default 0,
  last_activity_date date default CURRENT_DATE,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES --

-- Tracks/Modules/Lessons: Public Read (if published), Admin Write
alter table tracks enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;

create policy "Everything readable by everyone" on tracks for select using (true);
create policy "Everything readable by everyone" on modules for select using (true);
create policy "Everything readable by everyone" on lessons for select using (true);

-- (In a real scenario, we'd restrict write to admins, but keeping simple for dev)
create policy "Admins can insert tracks" on tracks for insert with check (true);
create policy "Admins can update tracks" on tracks for update using (true);
create policy "Admins can insert modules" on modules for insert with check (true);
create policy "Admins can update modules" on modules for update using (true);
create policy "Admins can insert lessons" on lessons for insert with check (true);
create policy "Admins can update lessons" on lessons for update using (true);

-- Student Data: User can read/write their own
alter table student_progress enable row level security;
alter table lesson_notes enable row level security;
alter table student_streaks enable row level security;

create policy "Users manage their own progress" on student_progress
  for all using (auth.uid() = user_id);

create policy "Users manage their own notes" on lesson_notes
  for all using (auth.uid() = user_id);

create policy "Users manage their own streaks" on student_streaks
  for all using (auth.uid() = user_id);

-- INDEXES
create index idx_leads_track_id on modules(track_id);
create index idx_lessons_module_id on lessons(module_id);
create index idx_progress_user on student_progress(user_id);
create index idx_notes_user on lesson_notes(user_id);
