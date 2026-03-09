-- 20260307_locker_rls_fix.sql
-- FIXES RLS FOR STUDENT LOCKER AND POINTS LEDGER FOR PUBLIC ADMISSIONS FLOW

DO $$ 
BEGIN
    -- 1. Student Locker: Allow public insert/update during admissions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public management of locker') THEN
        CREATE POLICY "Public management of locker" ON dormweek_student_locker FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;

    -- 2. Points Ledger: Allow public insert during admissions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert points') THEN
        CREATE POLICY "Public insert points" ON dormweek_points_ledger FOR INSERT TO public WITH CHECK (true);
    END IF;

    -- 3. Student Status: Allow public upsert during admissions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public status management') THEN
        CREATE POLICY "Public status management" ON dormweek_student_status FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;
