-- UPDATE LESSON VIDEOS (FORCE CACHE BUST)
UPDATE public.lessons
SET content = '/assets/dean-welcome-v2.mp4?v=3'
WHERE id = 'less_1_1';
UPDATE public.lessons
SET content = '/assets/dean-part-2.mp4?v=3'
WHERE id = 'less_1_2';