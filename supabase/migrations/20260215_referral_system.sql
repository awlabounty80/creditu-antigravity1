-- Referral System Tables
-- 1. Referrals Table - Track all referral activities
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_email TEXT NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE
    SET NULL,
        referral_code TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        -- pending, signed_up, active
        points_awarded INTEGER DEFAULT 0,
        referral_type TEXT NOT NULL,
        -- email, social, certificate
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        signed_up_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Social Shares Table - Track social media shares
CREATE TABLE IF NOT EXISTS social_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    -- facebook, twitter, linkedin, instagram, email
    share_type TEXT NOT NULL,
    -- certificate, general, task_completion
    points_awarded INTEGER DEFAULT 0,
    shared_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);
-- 3. Points Transactions Table - Track all point awards
CREATE TABLE IF NOT EXISTS points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    -- referral_signup, social_share, email_referral, task_completion
    description TEXT,
    reference_id UUID,
    -- Links to referral or share record
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);
-- 4. Daily Tasks Table - Track daily sharing opportunities
CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_date DATE NOT NULL DEFAULT CURRENT_DATE,
    task_type TEXT NOT NULL,
    -- email_share, social_share, lesson_complete
    completed BOOLEAN DEFAULT FALSE,
    points_awarded INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    UNIQUE(user_id, task_date, task_type)
);
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_email ON referrals(referred_email);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_social_shares_user ON social_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON daily_tasks(user_id, task_date);
-- Row Level Security Policies
-- Referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referrals" ON referrals FOR
SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create referrals" ON referrals FOR
INSERT WITH CHECK (auth.uid() = referrer_id);
-- Social Shares
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own shares" ON social_shares FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create shares" ON social_shares FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Points Transactions
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON points_transactions FOR
SELECT USING (auth.uid() = user_id);
-- Daily Tasks
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tasks" ON daily_tasks FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON daily_tasks FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON daily_tasks FOR
UPDATE USING (auth.uid() = user_id);
-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE code TEXT;
exists BOOLEAN;
BEGIN LOOP code := 'CRU-' || upper(
    substring(
        md5(random()::text)
        from 1 for 8
    )
);
SELECT EXISTS(
        SELECT 1
        FROM referrals
        WHERE referral_code = code
    ) INTO exists;
EXIT
WHEN NOT exists;
END LOOP;
RETURN code;
END;
$$ LANGUAGE plpgsql;
-- Function to award points
CREATE OR REPLACE FUNCTION award_points(
        p_user_id UUID,
        p_points INTEGER,
        p_transaction_type TEXT,
        p_description TEXT DEFAULT NULL,
        p_reference_id UUID DEFAULT NULL
    ) RETURNS UUID AS $$
DECLARE transaction_id UUID;
BEGIN -- Insert points transaction
INSERT INTO points_transactions (
        user_id,
        points,
        transaction_type,
        description,
        reference_id
    )
VALUES (
        p_user_id,
        p_points,
        p_transaction_type,
        p_description,
        p_reference_id
    )
RETURNING id INTO transaction_id;
-- Update user's total points (using moo_points column)
UPDATE profiles
SET moo_points = COALESCE(moo_points, 0) + p_points,
    updated_at = NOW()
WHERE id = p_user_id;
RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;
-- Trigger to award points when referral signs up
CREATE OR REPLACE FUNCTION handle_referral_signup() RETURNS TRIGGER AS $$ BEGIN IF NEW.status = 'signed_up'
    AND OLD.status = 'pending' THEN -- Award 2600 points to referrer
    PERFORM award_points(
        NEW.referrer_id,
        2600,
        'referral_signup',
        'Referral signup bonus for ' || NEW.referred_email,
        NEW.id
    );
-- Update referral record
NEW.points_awarded = 2600;
NEW.signed_up_at = NOW();
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER on_referral_signup BEFORE
UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION handle_referral_signup();