-- Migration: Add Metadata Column to Student Progress
-- Purpose: Store FNS lab state and other richer progress data
-- Date: 2026-04-19

ALTER TABLE public.student_progress 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN public.student_progress.metadata IS 'Stores rich state for labs and complex lessons (e.g., fns current step, preferences).';
