-- 💰 MICRO-OFFER SYSTEM (Tripwires & Front-End Revenue)
-- This table tracks products that leads can buy BEFORE full enrollment.
CREATE TABLE IF NOT EXISTS public.micro_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    -- e.g. 'credit-reset', 'leverage-class'
    title TEXT NOT NULL,
    headline TEXT NOT NULL,
    description TEXT [],
    -- Array of bullet points/benefits
    price DECIMAL(10, 2) NOT NULL,
    tag_to_apply TEXT NOT NULL,
    -- The CRM tag added upon purchase
    icon_key TEXT DEFAULT 'Star',
    custom_cta TEXT DEFAULT 'Secure Access Now',
    video_url TEXT,
    -- Optional pitch video
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- RLS: Public can read offers, Admin can manage.
ALTER TABLE public.micro_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for micro-offers" ON public.micro_offers FOR
SELECT USING (true);
-- Seed Initial Blueprint Offers
INSERT INTO public.micro_offers (
        slug,
        title,
        headline,
        description,
        price,
        tag_to_apply,
        icon_key
    )
VALUES (
        'credit-reset',
        '$9 Credit Reset Mini-Class',
        'The Rapid Bureau Cleanse Sequence',
        ARRAY ['3-Step Error Removal Method', 'The "Admin Shield" Template', 'Rapid Score Bump Protocol'],
        9.00,
        'Purchased_Reset_Class',
        'RefreshCw'
    ),
    (
        'leverage-class',
        '$27 Credit Leverage Class',
        'How to Hide Utilization & Jump 30 Points',
        ARRAY ['The Utilization Masking Technique', 'Balance Transfer Secrets', 'Authorized User Power-Plays'],
        27.00,
        'Purchased_Leverage_Class',
        'TrendingUp'
    ),
    (
        'bootcamp',
        'Business Credit Bootcamp',
        'Pre-Screening for High-Ticket Funding',
        ARRAY ['Business EIN Setup Mastery', 'Tier 1 Vendor List', 'Funding Readiness Checklist'],
        47.00,
        'Purchased_Business_Bootcamp',
        'GraduationCap'
    ) ON CONFLICT (slug) DO
UPDATE
SET headline = EXCLUDED.headline,
    description = EXCLUDED.description,
    price = EXCLUDED.price;