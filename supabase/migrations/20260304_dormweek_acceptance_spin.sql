-- 20260304_dormweek_acceptance_spin.sql
-- NON-DESTRUCTIVE ADDITIONS FOR DORM WEEK ACCEPTANCE SPIN

-- Site State Configuration
CREATE TABLE IF NOT EXISTS dormweek_site_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mode TEXT CHECK (mode IN ('prereg', 'dormweek', 'closed')) DEFAULT 'prereg',
    dorm_week_start TIMESTAMPTZ,
    dorm_week_end TIMESTAMPTZ,
    apply_redirect_mode TEXT CHECK (apply_redirect_mode IN ('redirect_to_dormweek', 'daily_spin')) DEFAULT 'redirect_to_dormweek',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads Capture (Public)
CREATE TABLE IF NOT EXISTS dormweek_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    phone TEXT,
    source TEXT DEFAULT 'apply',
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dormweek_leads_email ON dormweek_leads(email);

-- Student Status & Dorm Key Tracking
CREATE TABLE IF NOT EXISTS dormweek_student_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    acceptance_status TEXT CHECK (acceptance_status IN ('accepted', 'almost', 'scholarship', 'founders', 'pending')) DEFAULT 'pending',
    dorm_key BOOLEAN DEFAULT false,
    member_override BOOLEAN DEFAULT false,
    admin_override BOOLEAN DEFAULT false,
    last_spin_at TIMESTAMPTZ,
    spins_today INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dormweek_student_status_email ON dormweek_student_status(email);

-- Daily Spin Audit for Persistence and Rate Limiting
CREATE TABLE IF NOT EXISTS dormweek_daily_spins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    spin_date DATE NOT NULL,
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(email, spin_date)
);

-- Parallel Points Ledger
CREATE TABLE IF NOT EXISTS dormweek_points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    delta INT,
    source TEXT,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Security Configuration
ALTER TABLE dormweek_site_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormweek_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormweek_student_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormweek_daily_spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormweek_points_ledger ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ 
BEGIN
    -- Site State: Public Read
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read site state') THEN
        CREATE POLICY "Public read site state" ON dormweek_site_state FOR SELECT TO public USING (true);
    END IF;

    -- Leads: Public Insert
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert leads') THEN
        CREATE POLICY "Public insert leads" ON dormweek_leads FOR INSERT TO public WITH CHECK (true);
    END IF;

    -- Student Status: Own record
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own status') THEN
        CREATE POLICY "Users view own status" ON dormweek_student_status FOR SELECT TO authenticated USING (auth.uid() = user_id OR email = auth.jwt()->>'email');
    END IF;

    -- Daily Spins: Own record
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own spins') THEN
        CREATE POLICY "Users view own spins" ON dormweek_daily_spins FOR SELECT TO authenticated USING (auth.uid() = user_id OR email = auth.jwt()->>'email');
    END IF;

    -- Points Ledger: Own record
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own points') THEN
        CREATE POLICY "Users view own points" ON dormweek_points_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id OR email = auth.jwt()->>'email');
    END IF;
END $$;
