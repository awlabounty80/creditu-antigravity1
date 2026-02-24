-- Create Table for Dorm Week Pre-Registration Funnel
-- Target: Supabase / PostgreSQL
-- Idempotent Migration for Dorm Week Pre-Registration
-- This script safely sets up the table and RLS policies.
-- 1. Policies must be dropped before recreate or table drop
DROP POLICY IF EXISTS "Allow public insert for pre-registration" ON public.dorm_week_pre_reg;
DROP POLICY IF EXISTS "Allow admin read access" ON public.dorm_week_pre_reg;
-- 2. Create or Update the Table
CREATE TABLE IF NOT EXISTS public.dorm_week_pre_reg (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    biggest_struggle TEXT,
    credit_score_range TEXT,
    source TEXT DEFAULT 'Direct',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tags TEXT [] DEFAULT '{}'
);
-- Enable RLS (Row Level Security)
ALTER TABLE public.dorm_week_pre_reg ENABLE ROW LEVEL SECURITY;
-- 3. Re-create Policies
-- Allow anyone to pre-register (Public Insert)
CREATE POLICY "Allow public insert for pre-registration" ON public.dorm_week_pre_reg FOR
INSERT WITH CHECK (true);
-- Allow authenticated admins to see leads (Admin Read)
CREATE POLICY "Allow admin read access" ON public.dorm_week_pre_reg FOR
SELECT USING (
        auth.jwt()->>'role' IN ('admin', 'dean', 'founder')
    );
-- Add Table Metadata
COMMENT ON TABLE public.dorm_week_pre_reg IS 'Leads and VVIP registrations for the March 2026 Dorm Week intake.';