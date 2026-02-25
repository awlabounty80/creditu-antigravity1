-- STEP 1: DESTROY OLD STORE
-- Run this script FIRST to clear the conflicted tables.

DROP TABLE IF EXISTS public.student_inventory CASCADE;
DROP TABLE IF EXISTS public.moo_store_items CASCADE;
DROP FUNCTION IF EXISTS purchase_moo_item(uuid);

-- Verify they are gone (Optional select to confirm)
-- select * from public.moo_store_items; -- Should error "relation does not exist"
