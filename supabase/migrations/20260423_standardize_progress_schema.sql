-- Migration: Standardize Progress Schema
-- Purpose: Add content_id for non-UUID identifiers (labs) and make lesson_id nullable
-- Date: 2026-04-23

-- 1. Add content_id column
ALTER TABLE public.student_progress 
ADD COLUMN IF NOT EXISTS content_id TEXT;

-- 2. Make lesson_id nullable
ALTER TABLE public.student_progress 
ALTER COLUMN lesson_id DROP NOT NULL;

-- 3. Create unique index for content_id based progress
-- This allows idempotent upserts on (user_id, content_id) for labs
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_progress_user_content 
ON public.student_progress (user_id, content_id) 
WHERE lesson_id IS NULL;

-- 4. Comment for documentation
COMMENT ON COLUMN public.student_progress.content_id IS 'Secondary identifier for non-UUID content (e.g., fns-core, specialized labs).';
