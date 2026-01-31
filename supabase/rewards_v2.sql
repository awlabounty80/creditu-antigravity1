-- REWARDS SYSTEM V2
-- 1. Create Rewards Table
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    section TEXT DEFAULT 'all',
    -- 'power_tools', 'access', 'identity', etc.
    icon_key TEXT DEFAULT 'gift',
    unlock_threshold INTEGER DEFAULT 0,
    -- Min points required to see/buy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view rewards" ON public.rewards FOR
SELECT USING (true);
-- 2. Create User Rewards (Inventory) Table
CREATE TABLE IF NOT EXISTS public.user_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rewards" ON public.user_rewards FOR
SELECT USING (auth.uid() = user_id);
-- 3. Seed Initial Rewards
INSERT INTO public.rewards (title, description, cost, section, icon_key)
VALUES (
        'Dispute AI Pro',
        'Unlock unlimited AI-generated dispute letters.',
        500,
        'power_tools',
        'cpu'
    ),
    (
        'FICO® Simulator+',
        'Access advanced simulation scenarios.',
        300,
        'power_tools',
        'calculator'
    ),
    (
        'Priority Support',
        'Get 24/7 priority access to Credit U experts.',
        1000,
        'access',
        'headphones'
    ),
    (
        'Sovereign ID Card',
        'Physical member ID card mailed to you.',
        2500,
        'identity',
        'shield'
    ),
    (
        'Wealth Mindset Audio',
        'Exclusive 10-hour audio course.',
        150,
        'digital',
        'headphones'
    ),
    (
        'Inner Circle Access',
        'Join the private Discord channel.',
        5000,
        'community',
        'crown'
    );
-- 4. RPC: Purchase Reward
-- Handles point deduction and inventory addition atomically
CREATE OR REPLACE FUNCTION public.purchase_reward_v2(reward_uuid UUID) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE item_cost INTEGER;
user_points INTEGER;
existing_purchase BOOLEAN;
BEGIN -- Get cost
SELECT cost INTO item_cost
FROM public.rewards
WHERE id = reward_uuid;
IF item_cost IS NULL THEN RETURN jsonb_build_object('success', false, 'message', 'Item not found');
END IF;
-- Get user points
SELECT moo_points INTO user_points
FROM public.profiles
WHERE id = auth.uid();
IF user_points < item_cost THEN RETURN jsonb_build_object(
    'success',
    false,
    'message',
    'Insufficient points'
);
END IF;
-- Check if already owned (optional, depends on item type. Assuming consumables for now allow dupes? No, let's limit 1 for now)
-- SELECT EXISTS (SELECT 1 FROM public.user_rewards WHERE user_id = auth.uid() AND reward_id = reward_uuid) INTO existing_purchase;
-- IF existing_purchase THEN
--    RETURN jsonb_build_object('success', false, 'message', 'Already owned');
-- END IF;
-- Deduct points
UPDATE public.profiles
SET moo_points = moo_points - item_cost
WHERE id = auth.uid();
-- Add to inventory
INSERT INTO public.user_rewards (user_id, reward_id)
VALUES (auth.uid(), reward_uuid);
-- Return success and new balance
RETURN jsonb_build_object(
    'success',
    true,
    'remaining_points',
    user_points - item_cost
);
END;
$$;