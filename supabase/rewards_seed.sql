-- REBUILD REWARDS SCHEMA (To support Text IDs)
-- WARNING: This resets the rewards table!
-- 1. Drop existing tables/fns to avoid conflicts
DROP TABLE IF EXISTS public.user_rewards;
DROP TABLE IF EXISTS public.rewards;
DROP FUNCTION IF EXISTS public.purchase_reward_v2;
-- 2. Create Rewards Table (ID is TEXT now, for readable keys like 'goodwill_letter')
CREATE TABLE public.rewards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    section TEXT DEFAULT 'market',
    icon_key TEXT DEFAULT 'gift',
    unlock_threshold INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Create User Rewards Log
CREATE TABLE public.user_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id TEXT REFERENCES public.rewards(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0
);
-- 4. Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.rewards FOR
SELECT USING (true);
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users Own Data" ON public.user_rewards FOR ALL USING (auth.uid() = user_id);
-- Allow users to update their own logs (for usage tracking)
CREATE POLICY "Users Update Own Logs" ON public.user_rewards FOR
UPDATE USING (auth.uid() = user_id);
-- 5. Seed Data (Matches Frontend CONTENT_MAP)
INSERT INTO public.rewards (id, title, description, cost, section, icon_key)
VALUES (
        'goodwill_letter',
        'Goodwill Adjustment Letter',
        'Professional template to request removal of late payments. Includes legal citations.',
        500,
        'power_tools',
        'heart_handshake'
    ),
    (
        'pay_delete',
        'Pay for Delete Agreement',
        'Contract template to negotiate debt deletion upon payment. Essential for collections.',
        750,
        'power_tools',
        'handshake'
    ),
    (
        'dispute_ai',
        'AI Dispute Wizard Access',
        'Unlimited access to the AI-powered dispute letter generator.',
        2500,
        'access',
        'cpu'
    ),
    (
        'simulator',
        'Credit Simulator Pro',
        'Advanced scenario modeling to predict score changes before you act.',
        1500,
        'access',
        'calculator'
    ),
    (
        'wallpaper_1',
        'Empire Mindset Wallpaper',
        'High-resolution digital art for your devices. 4K quality.',
        100,
        'digital',
        'image'
    ),
    (
        'metro2_guide',
        'Metro 2® Compliance Guide',
        'Deep dive into the data format used by bureaus. For advanced repair.',
        1000,
        'power_tools',
        'book'
    ),
    (
        'black_card',
        'Credit U Black Card',
        'Symbolic status symbol. Grants access to "The Boardroom" (Coming Soon).',
        10000,
        'identity',
        'crown'
    );
-- 6. RPC Function for Purchase (Updated for Text ID)
CREATE OR REPLACE FUNCTION public.purchase_reward_v2(reward_uuid TEXT) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE reward_cost INTEGER;
user_points INTEGER;
BEGIN -- Get cost
SELECT cost INTO reward_cost
FROM public.rewards
WHERE id = reward_uuid;
IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'message', 'Reward not found');
END IF;
-- Get user points
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
-- Transaction
UPDATE public.profiles
SET moo_points = moo_points - reward_cost
WHERE id = auth.uid();
INSERT INTO public.user_rewards (
        user_id,
        reward_id,
        access_count,
        last_accessed_at
    )
VALUES (auth.uid(), reward_uuid, 0, NULL);
RETURN jsonb_build_object(
    'success',
    true,
    'remaining_points',
    user_points - reward_cost
);
END;
$$;
-- 7. RPC for Incrementing Access
CREATE OR REPLACE FUNCTION public.increment_access(r_id TEXT, u_id UUID) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN
UPDATE public.user_rewards
SET access_count = access_count + 1,
    last_accessed_at = NOW()
WHERE user_id = u_id
    AND reward_id = r_id;
END;
$$;