-- Seed Data for Credit U Curriculum (SQL)
-- Run this in your Supabase SQL Editor AFTER creating the schema.

-- 1. Create 'Freshman Core' Track
with new_track as (
  insert into public.tracks (slug, title, description, icon, is_published, order_index)
  values (
    'freshman-core', 
    'Freshman Core', 
    'The foundational knowledge required to understand the credit system and your place in it.',
    'BookOpen',
    true,
    1
  )
  returning id
),
-- 2. Create 'Credit Fundamentals' Module
new_module as (
  insert into public.modules (track_id, slug, title, description, order_index, is_published)
  select 
    id, 
    'credit-fundamentals', 
    'Credit Fundamentals', 
    'Understanding the board game.', 
    1, 
    true
  from new_track
  returning id
)
-- 3. Create Demo Lessons
insert into public.lessons (
  module_id, slug, title, summary, content_type, reading_markdown, duration_seconds, order_index, is_published, source_verified, key_takeaways
)
values 
(
  (select id from new_module limit 1),
  'the-game-of-credit',
  'The Game of Credit',
  'Credit is not money. Credit is trust.',
  'mixed',
  '# The Game of Credit\n\nCredit is not money. Credit is **trust**. The word comes from the Latin *credere*, meaning "to believe".\n\n## The Referee\nFICO is the referee. They decide the score.',
  300, -- 5 mins
  1,
  true,
  true,
  array['Credit is Trust', 'FICO is the referee']
),
(
  (select id from new_module limit 1),
  'the-3-bureaus',
  'The 3 Bureaus',
  'Experian, Equifax, TransUnion.',
  'video',
  '# The Data Brokers\n\nThey are private companies, not the government.',
  600, -- 10 mins
  2,
  true,
  true,
  array['They are private companies', 'You are the product']
);
