-- Migration: Unified Moo Rewards Store
-- Date: 2026-03-09

-- 1. Create Store Items Catalog
CREATE TABLE IF NOT EXISTS public.moo_store_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    section TEXT NOT NULL, -- 'power_tools', 'access', 'identity', 'digital_goods', 'spiritual', 'real_world'
    cost INTEGER NOT NULL DEFAULT 0,
    icon_slug TEXT, -- Zap, Lock, Crown, etc.
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Student Inventory (Ownership)
CREATE TABLE IF NOT EXISTS public.student_inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.moo_store_items(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- 3. Purchase RPC Function
CREATE OR REPLACE FUNCTION public.purchase_moo_item(p_item_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID;
    v_item_cost INTEGER;
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    -- Get item cost
    SELECT cost INTO v_item_cost FROM public.moo_store_items WHERE id = p_item_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Item not found');
    END IF;

    -- Get current balance
    SELECT total_points INTO v_current_balance FROM public.student_moo_points WHERE user_id = v_user_id;
    IF v_current_balance IS NULL THEN v_current_balance := 0; END IF;

    -- Check funds
    IF v_current_balance < v_item_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient Moo Points');
    END IF;

    -- Check if already owned
    IF EXISTS (SELECT 1 FROM public.student_inventory WHERE user_id = v_user_id AND item_id = p_item_id) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Item already owned');
    END IF;

    -- Deduct points
    UPDATE public.student_moo_points 
    SET total_points = total_points - v_item_cost,
        updated_at = NOW()
    WHERE user_id = v_user_id
    RETURNING total_points INTO v_new_balance;

    -- Award item
    INSERT INTO public.student_inventory (user_id, item_id)
    VALUES (v_user_id, p_item_id);

    RETURN jsonb_build_object(
        'success', true, 
        'remaining_points', v_new_balance
    );
END;
$$;

-- 4. RLS Policies
ALTER TABLE public.moo_store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Store items are public" ON public.moo_store_items;
CREATE POLICY "Store items are public" ON public.moo_store_items FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Users can view own inventory" ON public.student_inventory;
CREATE POLICY "Users can view own inventory" ON public.student_inventory FOR SELECT USING (auth.uid() = user_id);

-- 5. Seed Initial Data
INSERT INTO public.moo_store_items (title, description, section, cost, icon_slug)
VALUES 
('Goodwill Adjustment Template', 'Request removal of a single late payment from a good standing account.', 'power_tools', 300, 'handshake'),
('Pay-For-Delete Agreement', 'Binding contract to remove collections upon payment.', 'power_tools', 500, 'shield'),
('Metro 2® Compliance Manual', 'Deep dive into the data format used by bureaus.', 'digital_goods', 800, 'book'),
('Credit Empire Wallpaper', 'High-res digital art for your dashboard.', 'digital_goods', 50, 'image'),
('AI Dispute Engine Access', 'Unlimited generations with Dr. Leverage.', 'access', 1000, 'cpu'),
('Private Strategy Call', '15-min consultation with a chaotic good credit expert.', 'access', 5000, 'headphones'),
('Founder Badge', 'Permanent profile distinction.', 'identity', 5000, 'crown'),
('Scholar Title', 'Display "Scholar" on your ID.', 'identity', 1000, 'award')
ON CONFLICT DO NOTHING;
