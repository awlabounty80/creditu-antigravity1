-- MOO MOO EMPORIUM (REWARDS STORE)
-- 1. Create Rewards Catalog
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'digital',
    -- digital, merch, service
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Create User Redemptions Log
CREATE TABLE IF NOT EXISTS public.user_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'fulfilled' -- fulfilled, pending (for merch/service)
);
-- 3. Security Policies
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active rewards" ON public.rewards FOR
SELECT USING (is_active = true);
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own redemptions" ON public.user_rewards FOR
SELECT USING (auth.uid() = user_id);
-- 4. Seed Data
INSERT INTO public.rewards (name, description, cost, category, image_url)
VALUES (
        'The "Delete Anything" Dispute Template',
        'The exact letter sequence used to remove bankruptcies.',
        500,
        'digital',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500'
    ),
    (
        'Credit U "Billionaire" Hoodie',
        'Limited edition Navy & Gold heavy-weight hoodie.',
        2500,
        'merch',
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'
    ),
    (
        '15-Minute Strategy Call',
        'Direct 1-on-1 with a Senior Credit Analyst.',
        5000,
        'service',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'
    ),
    (
        'The 800 Club Gold Card',
        'Metal membership card sent to your home.',
        10000,
        'merch',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500'
    ) ON CONFLICT DO NOTHING;
-- 5. RPC Function: Purchase Reward
CREATE OR REPLACE FUNCTION public.purchase_reward(reward_uuid UUID) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE reward_cost INTEGER;
user_points INTEGER;
BEGIN -- Get cost
SELECT cost INTO reward_cost
FROM public.rewards
WHERE id = reward_uuid;
IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'message', 'Reward not found');
END IF;
-- Get user balance
SELECT moo_points INTO user_points
FROM public.profiles
WHERE id = auth.uid();
-- Check funds
IF user_points < reward_cost THEN RETURN jsonb_build_object(
    'success',
    false,
    'message',
    'Insufficient Moo Points'
);
END IF;
-- Deduct points
UPDATE public.profiles
SET moo_points = moo_points - reward_cost
WHERE id = auth.uid();
-- Record transaction
INSERT INTO public.user_rewards (user_id, reward_id)
VALUES (auth.uid(), reward_uuid);
RETURN jsonb_build_object(
    'success',
    true,
    'new_balance',
    user_points - reward_cost
);
END;
$$;