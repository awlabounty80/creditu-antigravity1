begin;
-- =========================================================
-- 1) CREATE A GLOBAL DEFAULT CREDIT U INTRO VIDEO
-- =========================================================
-- This row represents the standard intro shown on every lesson.
-- video_url can be updated later without breaking bindings.
insert into public.lesson_videos (
        lesson_id,
        user_id,
        video_type,
        title,
        description,
        duration_seconds,
        video_url,
        thumbnail_url,
        playback_status,
        sort_order
    )
select l.id as lesson_id,
    null as user_id,
    'ai_professor'::public.video_type_enum,
    'Welcome to Credit U',
    'This is the official Credit U lesson introduction. Your professor will guide you through today' s class.',
  45,
  ' / assets / dean - welcome - v2.mp4 ', -- Default intro video
  ' / assets / amara - guide.jpg ', -- Default thumbnail
  ' ready '::public.playback_status_enum,
  1
from public.lessons l
where not exists (
  select 1
  from public.lesson_videos lv
  where lv.lesson_id = l.id
    and lv.sort_order = 1
);

-- =========================================================
-- 2) ENSURE FUTURE LESSONS ALSO GET THE INTRO
-- =========================================================

create or replace function public.attach_default_intro_video()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.lesson_videos (
    lesson_id,
    user_id,
    video_type,
    title,
    description,
    duration_seconds,
    video_url,
    thumbnail_url,
    playback_status,
    sort_order
  )
  values (
    new.id,
    null,
    ' ai_professor ',
    ' Welcome to Credit U ',
    ' This is the official Credit U lesson introduction.',
    45,
    ' / assets / dean - welcome - v2.mp4 ',
    ' / assets / amara - guide.jpg ',
    ' ready ',
    1
  );

  return new;
end;
$$;

-- Attach trigger ONLY if lessons table exists
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = ' public '
      and table_name = ' lessons '
  ) then
    drop trigger if exists trg_lessons_default_intro on public.lessons;

    create trigger trg_lessons_default_intro
    after insert on public.lessons
    for each row
    execute function public.attach_default_intro_video();
  end if;
end $$;

commit;