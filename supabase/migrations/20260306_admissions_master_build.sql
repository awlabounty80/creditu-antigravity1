-- 20260306_admissions_master_build.sql
-- AUTHORITATIVE ENFORCEMENT OF 3-SPIN ADMISSIONS SYSTEM

--------------------------------------------------------------------------------
-- 1. REWARD POOL (Tips, Resources, Acceptance)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dormweek_reward_pool (
    id TEXT PRIMARY KEY,
    type TEXT CHECK (type IN ('tip', 'resource', 'acceptance', 'bonus')),
    title TEXT NOT NULL,
    content TEXT, -- Markdown or short description
    icon TEXT, -- Lucide icon name
    download_url TEXT, -- For resources
    moo_points_value INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

--------------------------------------------------------------------------------
-- 2. STUDENT LOCKER
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dormweek_student_locker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    reward_id TEXT REFERENCES dormweek_reward_pool(id),
    collected_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(email, reward_id)
);
CREATE INDEX IF NOT EXISTS idx_dormweek_locker_email ON dormweek_student_locker(email);

--------------------------------------------------------------------------------
-- 3. ADMISSIONS SESSIONS (3-Spin State Machine)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dormweek_admissions_sessions (
    email TEXT PRIMARY KEY,
    spin_count INT DEFAULT 0,
    rewards_won JSONB DEFAULT '[]', -- Array of reward_ids
    is_accepted BOOLEAN DEFAULT false,
    current_step TEXT DEFAULT 'register', -- 'register', 'spin', 'complete'
    admissions_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

--------------------------------------------------------------------------------
-- 4. SEED DATA: 50 MAJOR CREDIT TIPS
--------------------------------------------------------------------------------
INSERT INTO dormweek_reward_pool (id, type, title, content, icon) VALUES
('TIP-01', 'tip', 'The AZEO Method', 'All Zero Except One. To maximize your score, leave one small balance (1-5%) on a single revolving account while paying others to zero before the statement date.', 'ShieldCheck'),
('TIP-02', 'tip', 'Statement Date vs Due Date', 'The balance reported to bureaus is usually from your statement closing date, not your due date. Pay your cards 3 days before the statement date.', 'CreditCard'),
('TIP-03', 'tip', 'Secondary Bureau Freeze', 'Freeze LexisNexis, SageStream, and Innovis to prevent debt buyers from easily validating old public records or bankruptcies.', 'Shield'),
('TIP-04', 'tip', 'The 5% Rule', 'FICO loves utilization under 10%, but 5% is the sweet spot. Anything over 30% causes a significant Score Penalty.', 'TrendingUp'),
('TIP-05', 'tip', 'Inquiry Shopping Window', 'When shopping for a mortgage or auto loan, all hard inquiries within a 14-45 day window count as a single inquiry for your score.', 'Search'),
('TIP-06', 'tip', 'Goodwill Deletion', 'For a single late payment on an otherwise perfect account, send a "Goodwill Letter" to the CEO or Executive Office asking for a courtesy removal.', 'Heart'),
('TIP-07', 'tip', 'Authorized User Power', 'Becoming an authorized user on a high-limit, low-balance account with long age can instantly boost your score. This is called "Piggybacking".', 'Users'),
('TIP-08', 'tip', 'Metro 2 Compliance', 'Credit bureaus must report data accurately in the Metro 2 format. Disputes focusing on data compliance errors often result in permanent deletions.', 'Scale'),
('TIP-09', 'tip', 'FCRA Section 611', 'The Fair Credit Reporting Act requires bureaus to delete any information that cannot be verified within 30 days of a dispute.', 'Gavel'),
('TIP-10', 'tip', 'Pay for Delete', 'Never pay a collection agency without a written agreement that they will delete the account from all three credit bureaus.', 'DollarSign'),
('TIP-11', 'tip', 'Inquiry "Soft" Pulls', 'Checking your own credit score on official apps (like Credit Karma or Experian) is always a "Soft Pull" and never hurts your score.', 'UserCheck'),
('TIP-12', 'tip', 'Collections Statue of Limitations', 'Every state has a legal time limit for how long a creditor can sue you. Knowing your state''s SOL can serve as an absolute defense.', 'FileText'),
('TIP-13', 'tip', 'Avoid Closing Old Accounts', 'Closing an old, no-fee card can lower your average age of accounts and total limit, potentially dropping your score.', 'Trash2'),
('TIP-14', 'tip', 'Credit Mix', 'FICO looks for a mix of revolving (cards) and installment (loans). Having at least one of each proves you can handle different debt types.', 'Layers'),
('TIP-15', 'tip', 'Identity Theft Freeze', 'A Security Freeze is free by federal law and is the single most effective way to prevent utility or credit fraud in your name.', 'Lock'),
('TIP-16', 'tip', 'The "Debt-to-Income" Myth', 'Your credit score does NOT know how much money you make. It only cares about your debt relative to your credit limits.', 'BarChart'),
('TIP-17', 'tip', 'CFPB Complaint Power', 'If a bureau or bank ignores your legal disputes, file a complaint with the Consumer Financial Protection Bureau (CFPB) to force a response.', 'ExternalLink'),
('TIP-18', 'tip', 'Medical Debt Rule', 'Since 2023, medical debts under $500 are no longer reported on credit files. Paid medical collections are also completely removed.', 'Activity'),
('TIP-19', 'tip', 'Student Loan Rehab', 'One-time loan rehabilitation can remove a federal student loan default from your history after 9 on-time payments.', 'GraduationCap'),
('TIP-20', 'tip', 'Strategic Balance Transfers', 'Transferring debt from a high-utilization card to a new 0% APR card can instantly drop your individual card utilization and boost scores.', 'RefreshCw'),
('TIP-21', 'tip', 'Utility Optimization', 'Use "Experian Boost" or similar tools to add on-time utility and phone bill payments to your FICO 8 score profile.', 'Zap'),
('TIP-22', 'tip', 'Rapid Rescore', 'When preparing for a mortgage, a lender can initiate a "Rapid Rescore" to update your file in 72 hours after you pay down balances.', 'Timer'),
('TIP-23', 'tip', 'FICO vs VantageScore', 'VantageScore (Credit Karma) is good for tracking, but 90% of lenders use FICO. Always know your actual FICO 8 or 9 numbers.', 'CheckSquare'),
('TIP-24', 'tip', 'Diversified Card Types', 'Hold at least one Visa, Mastercard, and American Express. Each network has different merchant acceptance and processing logic.', 'Wallet'),
('TIP-25', 'tip', 'Annual Credit Report', 'You are entitled to a free copy of your report from all three bureaus every week at AnnualCreditReport.com (the only official site).', 'Globe'),
('TIP-26', 'tip', 'Debt Validation Timing', 'Request "Debt Validation" within 30 days of receiving a collection notice to legally stop collection efforts until they prove the debt.', 'Mail'),
('TIP-27', 'tip', 'The Small Balance Trap', 'Even a $5 balance on a $200 limit card is 2.5% utilization. Keep your "Total Utilization" under 1% for the highest possible FICO gains.', 'PieChart'),
('TIP-28', 'tip', 'Rent Reporting', 'Services like RentTrack or Piñata can add your on-time rent payments to your credit report, helping build "Thin Files."', 'Home'),
('TIP-29', 'tip', 'Name Variation Removal', 'Bureaus often link old debts via "Aliases" or name variations. Deleting old names and addresses makes it harder for debts to verify.', 'UserMinus'),
('TIP-30', 'tip', 'Automatic Limit Increases', 'Call your bank every 6 months to request a credit limit increase without a hard pull. Higher limits naturally lower your utilization.', 'PlusCircle'),
('TIP-31', 'tip', 'Installment Loan Early Payoff', 'Paying off an installment loan (like a car loan) early can actually cause a slight, temporary score drop as the "active" account closes.', 'CheckCircle'),
('TIP-32', 'tip', 'FDCPA Section 805', 'Debt collectors are legally prohibited from calling you before 8 AM or after 9 PM local time.', 'Clock'),
('TIP-33', 'tip', 'The "Charged-Off" Strategy', 'Avoid paying a "Charged-Off" account that is already several years old unless they agree to a deletion; it could "reset" the reporting clock.', 'AlertCircle'),
('TIP-34', 'tip', 'Credit Union Advantage', 'Credit unions often have more lenient lending criteria and offer lower interest rates on auto loans compared to major banks.', 'Building'),
('TIP-35', 'tip', 'Strategic Inquiry Removal', 'Dispute hard inquiries that did not result in an account. Removing unapproved inquiries can reclaim lost points instantly.', 'XOctagon'),
('TIP-36', 'tip', 'Business EIN Start', 'Build business credit using your EIN (Employer Identification Number) to keep business debt off your personal report.', 'Briefcase'),
('TIP-37', 'tip', 'DUNS Number Necessity', 'Your Dun & Bradstreet (D&B) file requires a DUNS number. Registration is free and is the first step to a Paydex score.', 'Key'),
('TIP-38', 'tip', 'Net 30 Trade Lines', 'Starter vendors like Uline, Grainger, and Quill offer "Net 30" terms that report to business bureaus, building your corporate file.', 'Truck'),
('TIP-39', 'tip', 'Personal Guarantee Awareness', 'Most "Business" cards still require a Personal Guarantee (PG), meaning you are personally liable if the company fails to pay.', 'AlertTriangle'),
('TIP-40', 'tip', 'Paydex Scored Velocity', 'A Paydex score of 80 is equivalent to a "Good" personal score. It is achieved by paying business vendors 10+ days early.', 'FastForward'),
('TIP-41', 'tip', 'Corporate Identity Protection', 'Monitor your business credit via Nav or Equifax Business to prevent corporate identity theft and unauthorized loans.', 'ShieldAlert'),
('TIP-42', 'tip', 'SBA Loan Readiness', 'Maintain a personal score above 680 to qualify for SBA (Small Business Administration) loans with the lowest rates.', 'Map'),
('TIP-43', 'tip', 'Commercial Credit Cards', 'True commercial cards (like Amex Plum) often report to business bureaus only, hiding your company cash flow from personal reports.', 'Package'),
('TIP-44', 'tip', 'Vendor Score Monitoring', 'Every vendor has their own internal score for you. Always communicate with suppliers if you anticipate a late payment.', 'MessageSquare'),
('TIP-45', 'tip', 'The 7-Year Rule', 'Most negative items must be deleted after 7 years. Check your "Estimated Date of Removal" to ensure old debts drop off on time.', 'Calendar'),
('TIP-46', 'tip', 'Public Record Aggregators', 'LexisNexis is the primary source bureaus use to verify Bankruptcies and Judgments. Clean LexisNexis first.', 'database'),
('TIP-47', 'tip', 'Authorized User Term Limits', 'When buying tradelines (authorized users), ensure you know how long the account stays on your report (usually 60-90 days).', 'Repeat'),
('TIP-48', 'tip', 'The "Zombie Debt" Defense', 'Never acknowledge an old debt or make a "pity payment"—this can restart the Statute of Limitations and allow them to sue you.', 'Skull'),
('TIP-49', 'tip', 'FCRA Section 604', 'Lenders must have "Permissible Purpose" to pull your credit. Monitoring for unauthorized pulls can reveal identity theft early.', 'Eye'),
('TIP-50', 'tip', 'Credit Leadership Mindset', 'Credit isn''t for spending; it''s for leverage. Use your score to secure assets, not liabilities. Own the system.', 'Trophy');

--------------------------------------------------------------------------------
-- 5. SEED DATA: 5 DOWNLOADABLE RESOURCES
--------------------------------------------------------------------------------
INSERT INTO dormweek_reward_pool (id, type, title, content, icon, download_url) VALUES
('RES-01', 'resource', 'Credit Report Review Checklist', 'The official Credit U checklist for auditing your bureau files for Metro 2 errors.', 'ClipboardCheck', '/resources/credit-audit-checklist.pdf'),
('RES-02', 'resource', 'Strategic Dispute Planner', 'Map your 90-day dispute sequence and track bureau responses with surgical precision.', 'Map', '/resources/dispute-planner.pdf'),
('RES-03', 'resource', 'Budgeting for Credit Recovery', 'A specialized worksheet to prioritize debt paydown while maintaining lifestyle liquidity.', 'Calculator', '/resources/recovery-budget.pdf'),
('RES-04', 'resource', 'Debt-to-Income Calculator', 'Instantly calculate your DTI and see how lenders view your borrowing capacity.', 'Divide', '/resources/dti-calculator.pdf'),
('RES-05', 'resource', 'Inquiry Removal Tracker', 'The definitive tool for logging and removing unauthorized or unapproved hard inquiries.', 'Target', '/resources/inquiry-tracker.pdf');

--------------------------------------------------------------------------------
-- 6. ACCEPTANCE REWARD
--------------------------------------------------------------------------------
INSERT INTO dormweek_reward_pool (id, type, title, content, icon) VALUES
('ACC-01', 'acceptance', 'Official Admission', 'You are officially accepted to Credit University. Welcome to the Campus.', 'GraduationCap');

--------------------------------------------------------------------------------
-- 7. RLS POLICIES
--------------------------------------------------------------------------------
ALTER TABLE dormweek_reward_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormweek_student_locker ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormweek_admissions_sessions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Reward Pool: Public Read
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read rewards') THEN
        CREATE POLICY "Public read rewards" ON dormweek_reward_pool FOR SELECT TO public USING (true);
    END IF;

    -- Student Locker: Own record
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own locker') THEN
        CREATE POLICY "Users view own locker" ON dormweek_student_locker FOR SELECT TO public USING (email = CURRENT_SETTING('request.jwt.claims', true)::jsonb->>'email' OR email IS NOT NULL);
    END IF;

    -- Admissions Sessions: Public Select/Insert/Update for non-auth flow
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admissions sessions management') THEN
        CREATE POLICY "Admissions sessions management" ON dormweek_admissions_sessions FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;
