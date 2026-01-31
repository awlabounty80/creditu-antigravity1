-- MOO STORE ENGINE V2 - SOVEREIGN EXCHANGE SYSTEM
-- 1. Reset (if needed for dev, but safely)
DROP TABLE IF EXISTS public.rewards CASCADE;
DROP TABLE IF EXISTS public.user_rewards CASCADE;
-- 2. Rewards Catalog (Enhanced)
CREATE TABLE public.rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section TEXT NOT NULL,
    -- 'power_tools', 'access', 'identity', 'digital', 'spiritual', 'real_world'
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    icon_key TEXT,
    -- Frontend icon mapping
    resource_url TEXT,
    -- For immediate downloads
    unlock_threshold INTEGER DEFAULT 0,
    -- Points earned total required to seeing/unlocking
    is_featured BOOLEAN DEFAULT false,
    stock_limit INTEGER,
    -- NULL = infinite
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. User Redemptions (Ledger)
CREATE TABLE public.user_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'fulfilled',
    -- 'fulfilled', 'pending', 'revoked'
    meta_data JSONB -- Stores specific usage data (e.g. ticket codes)
);
-- 4. RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active" ON public.rewards FOR
SELECT USING (true);
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own" ON public.user_rewards FOR
SELECT USING (auth.uid() = user_id);
-- 5. Seed Data (The Credit University Catalog)
INSERT INTO public.rewards (
        section,
        title,
        description,
        cost,
        icon_key,
        unlock_threshold
    )
VALUES -- SECTION 1: POWER TOOLS
    (
        'power_tools',
        'AI Credit Analysis',
        'Instant deep-scan of your credit report for hidden violations.',
        500,
        'cpu',
        0
    ),
    (
        'power_tools',
        'The "Delete Anything" Letter',
        'Restricted aggression level dispute template.',
        800,
        'shield_alert',
        0
    ),
    (
        'power_tools',
        'FICO Simulator Pro',
        'Unlock advanced "what-if" scenarios in the Credit Lab.',
        300,
        'activity',
        0
    ),
    -- SECTION 2: ACCESS
    (
        'access',
        'Office Hours (Group)',
        'Access to the next live Q&A with Dean Sterling.',
        1500,
        'users',
        1000
    ),
    (
        'access',
        'Priority Support Ticket',
        'Skip the line for support inquiries (One-time use).',
        2000,
        'ticket',
        500
    ),
    -- SECTION 3: IDENTITY
    (
        'identity',
        'Founder''s Circle Badge',
        'Permanent profile distinction. Shows you were here first.',
        5000,
        'crown',
        0
    ),
    (
        'identity',
        'Streak Shield',
        'Protect your daily streak from one missed day.',
        300,
        'shield',
        0
    ),
    -- SECTION 4: DIGITAL GOODS
    (
        'digital',
        'Wealth Architect Planner',
        'PDF Workbook for organizing your 5-year vision.',
        150,
        'book',
        0
    ),
    (
        'digital',
        'Debt Snowball Calculator',
        'Excel/Sheets template to destroy debt mathematically.',
        100,
        'calculator',
        0
    ),
    -- SECTION 5: SPIRITUAL
    (
        'spiritual',
        'Financial Anxiety Reset',
        '10-minute guided audio to lower cortisol and increase focus.',
        50,
        'headphones',
        0
    ),
    (
        'spiritual',
        'The Steward''s Prayer',
        'Morning declaration for wealth stewardship.',
        25,
        'sun',
        0
    ),
    -- SECTION 6: REAL WORLD
    (
        'real_world',
        'Annual Summit Ticket',
        'Early bird entry to the Credit U Live Event.',
        15000,
        'map_pin',
        5000
    ) ON CONFLICT DO NOTHING;
-- 6. Purchase Function (Transaction Safe)
CREATE OR REPLACE FUNCTION public.purchase_reward_v2(reward_uuid UUID) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE reward_rec RECORD;
user_points INTEGER;
BEGIN -- Fetch Reward
SELECT * INTO reward_rec
FROM public.rewards
WHERE id = reward_uuid;
IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'message', 'Item not found');
END IF;
-- Check Account
SELECT moo_points INTO user_points
FROM public.profiles
WHERE id = auth.uid();
IF user_points < reward_rec.cost THEN RETURN jsonb_build_object(
    'success',
    false,
    'message',
    'Insufficient Alignment Points'
);
END IF;
-- Deduct
UPDATE public.profiles
SET moo_points = moo_points - reward_rec.cost
WHERE id = auth.uid();
-- Ledger
INSERT INTO public.user_rewards (user_id, reward_id, status)
VALUES (auth.uid(), reward_uuid, 'fulfilled');
RETURN jsonb_build_object(
    'success',
    true,
    'remaining_points',
    user_points - reward_rec.cost
);
END;
$$;