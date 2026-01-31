-- SEED DATA FOR KNOWLEDGE BASE
-- Clears existing to prevent duplicates during dev
TRUNCATE TABLE public.article_tags CASCADE;
TRUNCATE TABLE public.knowledge_articles CASCADE;
TRUNCATE TABLE public.knowledge_tags CASCADE;
-- 1. Insert Tags
INSERT INTO public.knowledge_tags (name, slug)
VALUES ('Credit Scoring', 'credit-scoring'),
    ('Legal', 'legal'),
    ('Business Structure', 'business-structure'),
    ('Mindset', 'mindset'),
    ('Funding', 'funding'),
    ('Real Estate', 'real-estate'),
    ('Travel Hacking', 'travel-hacking'),
    ('Taxes', 'taxes'),
    ('Disputes', 'disputes'),
    ('Automation', 'automation');
-- 2. Insert Knowledge Articles (30 Items)
-- PILLAR: FOUNDATIONS
INSERT INTO public.knowledge_articles (
        title,
        slug,
        pillar,
        difficulty,
        content,
        summary,
        is_published,
        reading_time_minutes
    )
VALUES (
        'The 5 FICO Factors: Decoding the Algorithm',
        '5-fico-factors',
        'Foundations',
        'Freshman',
        '# The FICO Pie Chart\nTo master the game, you must know the rules. The FICO algorithm is broken down into 5 distinct categories...\n\n1. Payment History (35%)\n2. Utilization (30%)\n3. Length of History (15%)\n4. Credit Mix (10%)\n5. New Credit (10%)',
        'The breakdown of how the 35/30/15/10/10 rule dictates your financial power.',
        true,
        5
    ),
    (
        'What "On Time" Really Means',
        'what-on-time-means',
        'Foundations',
        'Freshman',
        '# The 30-Day Rule\nBanks have a grace period. The algorithm does not...',
        'Understanding the difference between a late fee and a late payment marker.',
        true,
        3
    ),
    (
        'Utilization Mastery: The 30% vs 10% Rule',
        'utilization-mastery',
        'Foundations',
        'Sophomore',
        '# The Utilization Myth\nThey tell you 30% is okay. They are lying. To be elite, you need 1-3%...',
        'Why "under 30%" keeps you average and "under 10%" makes you elite.',
        true,
        6
    ),
    (
        'Hard Inquiries vs. Soft Inquiries',
        'hard-vs-soft-inquiries',
        'Foundations',
        'Freshman',
        '# The Look vs The Touch\nA soft pull is a peek. A hard pull is an application...',
        'Defining the impact of shopping for credit.',
        true,
        4
    ),
    (
        'The secondary Bureaus: LexisNexis & friends',
        'secondary-bureaus',
        'Foundations',
        'Junior',
        '# The Hidden Watchers\nYou know the big 3. But do you know SageStream, Ars, and LexisNexis?',
        'An introduction to the shadow reporting agencies.',
        true,
        8
    ),
    (
        'Reading a Raw Credit Report',
        'reading-raw-report',
        'Foundations',
        'Sophomore',
        '# Decoding the Matrix\nRaw data looks intimidating. Here is how to parse Metro 2 code strings...',
        'How to read the unformatted data banks use.',
        true,
        10
    );
-- PILLAR: RESTORATION
INSERT INTO public.knowledge_articles (
        title,
        slug,
        pillar,
        difficulty,
        content,
        summary,
        is_published,
        reading_time_minutes
    )
VALUES (
        'The Metaphysics of a 609 Letter',
        'metaphysics-609',
        'Restoration',
        'Sophomore',
        '# Section 609 of the FCRA\nIt is not a magic wand. It is a request for verification...',
        'The truth about the most famous dispute letter in history.',
        true,
        7
    ),
    (
        'Bankruptcy Removal: The Impossible Possible',
        'bankruptcy-removal',
        'Restoration',
        'Senior',
        '# Procedural Compliance\nCourts do not verify data with bureaus. This is your loophole...',
        'Advanced strategies for public record suppression.',
        true,
        12
    ),
    (
        'Medical Debt: HIPAA vs FCRA',
        'medical-debt-hipaa',
        'Restoration',
        'Junior',
        '# The Privacy Shield\nYour medical history is private. If a collector knows it, they broke the law...',
        'Using privacy laws to delete medical collections.',
        true,
        6
    ),
    (
        'Goodwill Letters: The Art of Asking',
        'goodwill-letters',
        'Restoration',
        'Freshman',
        '# CEO Email Hacks\nSometimes honey works better than vinegar...',
        'Templates for asking executives to forgive a late payment.',
        true,
        5
    ),
    (
        'ChexSystems: Reclaiming Your Banking',
        'chexsystems-removal',
        'Restoration',
        'Sophomore',
        '# The Blacklist\nBanned from opening a bank account? Here is the dispute flow...',
        'How to get back into the banking system after a closure.',
        true,
        6
    ),
    (
        'Identity Theft vs. Familial Fraud',
        'id-theft-fraud',
        'Restoration',
        'Junior',
        '# When Mom Ruins Your Credit\nA difficult conversation, but a necessary dispute...',
        'Navigating the legalities of family-induced credit damage.',
        true,
        9
    );
-- PILLAR: BUSINESS
INSERT INTO public.knowledge_articles (
        title,
        slug,
        pillar,
        difficulty,
        content,
        summary,
        is_published,
        reading_time_minutes
    )
VALUES (
        'LLC Structuring for High-Net-Worth Protection',
        'llc-structuring',
        'Business',
        'Senior',
        '# The Wyoming Strategy\nWhy billionaires love Wyoming, Delaware, and Nevada...',
        'Advanced entity structuring for anonymity and protection.',
        true,
        15
    ),
    (
        'The DUNS Number: Your Business SSN',
        'duns-number',
        'Business',
        'Freshman',
        '# Data Universal Numbering System\nWithout it, you do not exist. Here is how to get it free...',
        'Setting up your Dun & Bradstreet profile correctly.',
        true,
        5
    ),
    (
        'Tier 1 Vendor Credit: The Starter Pack',
        'tier-1-vendors',
        'Business',
        'Freshman',
        '# Net-30 Accounts\nUline, Quill, Grainger. The holy trinity of building Paydex...',
        'The first 3 steps to building a business credit score.',
        true,
        6
    ),
    (
        'Corporate Leases: Driving for Free',
        'corporate-leases',
        'Business',
        'Junior',
        '# Section 179 Vehicle Deduction\nPut the G-Wagon in the business name. Write it off...',
        'How to acquire vehicles without using personal credit.',
        true,
        8
    ),
    (
        'Business Credit Cards: 0% Interest Stacking',
        '0-interest-stacking',
        'Business',
        'Sophomore',
        '# The Balance Transfer Game\nHow to float capital for 18 months without paying a dime...',
        'Strategies for leveraging introductory APR offers.',
        true,
        10
    ),
    (
        'Shelf Corps: Buying History',
        'shelf-corps',
        'Business',
        'Graduate',
        '# Aged Entities\nBuying a 10-year-old LLC to get instant funding credibility...',
        'The risks and rewards of buying aged corporations.',
        true,
        12
    );
-- PILLAR: STRATEGY
INSERT INTO public.knowledge_articles (
        title,
        slug,
        pillar,
        difficulty,
        content,
        summary,
        is_published,
        reading_time_minutes
    )
VALUES (
        'Manufactured Spending: Points & Miles',
        'manufactured-spending',
        'Strategy',
        'Graduate',
        '# The infinite Loop\nBuying gift cards, liquidating them, paying the bill...',
        'High-risk, high-reward travel hacking techniques.',
        true,
        15
    ),
    (
        'The Authorized User Hack (Tradelines)',
        'authorized-user-hack',
        'Strategy',
        'Freshman',
        '# Piggybacking\nBorrowing history from a relative with perfect credit...',
        'How to boost a score by 50 points in 30 days.',
        true,
        5
    ),
    (
        'Credit Card churning: The Cycle',
        'credit-card-churning',
        'Strategy',
        'Sophomore',
        '# Sign-up Bonuses\nOpening cards just for the bonus, then downgrading...',
        'Systematic acquisition of sign-up bonuses.',
        true,
        7
    ),
    (
        'Credit Limits: The Art of the Increase',
        'cli-increase',
        'Strategy',
        'Junior',
        '# Soft Pull Increases\nWhich banks give you more money without checking your report...',
        'How to double your total available credit limit.',
        true,
        6
    ),
    (
        'Foreign Transaction Fees & Currency',
        'foreign-fees',
        'Strategy',
        'Freshman',
        '# Global Spending\nNever pay in USD when abroad. Always pay in local currency...',
        'Optimizing international spend.',
        true,
        4
    ),
    (
        'Amex Centurion: The Black Card Path',
        'amex-black-card',
        'Strategy',
        'Senior',
        '# The Invite\nIt is not about credit score. It is about spend volume...',
        'What it actually takes to get the invite.',
        true,
        8
    );
-- PILLAR: MINDSET
INSERT INTO public.knowledge_articles (
        title,
        slug,
        pillar,
        difficulty,
        content,
        summary,
        is_published,
        reading_time_minutes
    )
VALUES (
        'The Psychology of Debt: Breaking Chains',
        'psychology-of-debt',
        'Mindset',
        'Freshman',
        '# Scarcity vs Abundance\nDebt is not evil. Consumer debt is a trap; business debt is a tool...',
        'Shifting from a debtor mindset to a leverage mindset.',
        true,
        10
    ),
    (
        'Financial Trauma: Healing the Past',
        'financial-trauma',
        'Mindset',
        'Sophomore',
        '# Generational Curses\nIf your parents were bad with money, it is not your fault. It is your responsibility...',
        'Addressing the emotional root of poor financial decisions.',
        true,
        12
    ),
    (
        'The Law of Attraction in Finance',
        'loa-finance',
        'Mindset',
        'Junior',
        '# Vibrational Alignment\nYou cannot attract wealth while fearing poverty...',
        'Using metaphysical principles to improve financial outcomes.',
        true,
        8
    ),
    (
        'Stewardship: The Spiritual Discipline',
        'stewardship',
        'Mindset',
        'Senior',
        '# Managing the Kingdom\nMoney is a test of character. How you handle $100 is how you handle $1M...',
        'Biblical and spiritual principles of wealth management.',
        true,
        10
    ),
    (
        'Delayed Gratification: The Billionaire Trait',
        'delayed-gratification',
        'Mindset',
        'Freshman',
        '# The Marshmallow Test\nBuying the Gucci belt now vs buying the Gucci stock later...',
        'Training your brain to prefer long-term gains.',
        true,
        6
    ),
    (
        'Networking: Your Network is Your Net Worth',
        'networking-net-worth',
        'Mindset',
        'Sophomore',
        '# Room Access\nYou need to be in rooms where "How much?" is not asked...',
        'The value of social capital over financial capital.',
        true,
        7
    );