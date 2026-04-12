-- ==========================================
-- ANTIGRAVITY ECONOMY: REAL ECONOMY SCRIPT (v3 - Force Clean)
-- ==========================================
-- This script fixes the "cannot drop table" error by using CASCADE.

-- 0. CLEANUP (Forcefully remove old tables and dependencies)
-- We use CASCADE to automatically drop foreign keys and dependent tables (like moo_store_purchases).
DROP TABLE IF EXISTS public.moo_store_purchases CASCADE; -- Drop the table causing the conflict
DROP TABLE IF EXISTS public.moo_purchases CASCADE;
DROP TABLE IF EXISTS public.moo_store_items CASCADE;

-- 1. EXTEND USER_PROFILES
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS moo_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. ASSET EXCHANGE TABLE (TEXT ID)
CREATE TABLE public.moo_store_items (
  id TEXT PRIMARY KEY, -- 'quantum-ai', 'grant-blueprint', etc.
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  tier TEXT DEFAULT 'common',
  category TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.moo_store_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read items" ON public.moo_store_items FOR SELECT USING (true);

-- 3. TRANSACTION HISTORY
CREATE TABLE public.moo_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  item_id TEXT REFERENCES public.moo_store_items(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.moo_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own purchases" ON public.moo_purchases FOR SELECT USING (auth.uid() = user_id);

-- 4. PURCHASE RPC (Text ID compatible)
CREATE OR REPLACE FUNCTION purchase_moo_item(item_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER 
AS $$
DECLARE
    item_price INTEGER;
    user_balance INTEGER;
    current_user_id UUID;
    new_balance INTEGER;
BEGIN
    current_user_id := auth.uid();
    
    -- 1. Get Price
    SELECT price INTO item_price FROM moo_store_items WHERE id = purchase_moo_item.item_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Item not found');
    END IF;

    -- 2. Get Balance
    SELECT moo_points INTO user_balance FROM user_profiles WHERE user_id = current_user_id;

    -- 3. Check Liquidity
    IF user_balance >= item_price THEN
        -- Deduct
        UPDATE public.user_profiles 
        SET moo_points = moo_points - item_price 
        WHERE user_id = current_user_id
        RETURNING moo_points INTO new_balance;
        
        -- Log
        INSERT INTO public.moo_purchases (user_id, item_id) 
        VALUES (current_user_id, purchase_moo_item.item_id);
        
        RETURN jsonb_build_object('success', true, 'new_balance', new_balance);
    ELSE
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient $CU liquidity.');
    END IF;
END;
$$;

-- 5. REWARD TRIGGER
CREATE OR REPLACE FUNCTION grant_moo_points_on_completion()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'completed' AND (COALESCE(OLD.status, '') != 'completed') THEN
    UPDATE public.user_profiles 
    SET moo_points = COALESCE(moo_points, 0) + 50 
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_lesson_completed ON public.lesson_progress;
CREATE TRIGGER on_lesson_completed
  AFTER UPDATE ON public.lesson_progress 
  FOR EACH ROW
  EXECUTE FUNCTION grant_moo_points_on_completion();

-- 6. SEED DATA
INSERT INTO public.moo_store_items (id, name, description, price, tier, category, icon) -- Added ID
VALUES 
('quantum-ai', 'Quantum Syllabus AI', 'AI-driven indexing of course materials.', 0, 'common', 'Data', 'Zap'),
('grant-blueprint', 'Institutional Grant Blueprint', 'Master templates for research stipends.', 0, 'rare', 'Capital', 'FileText'),
('dean-archive', 'The Dean''s Private Archive', 'Legendary 1-on-1 access to university leadership.', 2500, 'legendary', 'Sovereign', 'Trophy')
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
price = EXCLUDED.price;
