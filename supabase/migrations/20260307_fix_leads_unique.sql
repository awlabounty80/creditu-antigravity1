-- 20260307_fix_leads_unique.sql
-- FIX MISSING UNIQUE CONSTRAINT ON DORMWEEK_LEADS EMAIL

-- 1. Remove duplicates (if any)
DELETE FROM dormweek_leads
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) AS row_num
        FROM dormweek_leads
    ) t
    WHERE t.row_num > 1
);

-- 2. Add Unique Constraint
ALTER TABLE dormweek_leads ADD CONSTRAINT dormweek_leads_email_unique UNIQUE (email);
