-- 🎓 CREDIT U: MASTER CURRICULUM SEED
-- Based on CREDIT_U_CURRICULUM_MASTER.md (Full Detail Version)
-- Version: 2.1 (Sovereign)
-- 1. CLEANUP (Safe Delete)
DELETE FROM public.lessons;
DELETE FROM public.modules;
DELETE FROM public.courses;
-- 2. COURSES (The 6 Levels)
-- LEVEL 1: FOUNDATION
INSERT INTO public.courses (
        id,
        title,
        slug,
        track,
        description,
        instructor,
        level,
        credits_value,
        image_url
    )
VALUES (
        'course_foundation',
        'Level 1: Foundation (Orientation)',
        'foundation-orientation',
        'Mindset',
        'Shift from Survivor to Architect. The Wealth Game begins here.',
        'The Dean',
        'Foundation',
        100,
        '/assets/thumbnails/foundation.jpg'
    );
-- LEVEL 2: FRESHMAN
INSERT INTO public.courses (
        id,
        title,
        slug,
        track,
        description,
        instructor,
        level,
        credits_value,
        image_url
    )
VALUES (
        'course_freshman',
        'Level 2: The Mechanics',
        'freshman-mechanics',
        'Personal Credit',
        'Master the inputs. Learn to manipulate the 5 levers of FICO.',
        'Professor Leverage',
        'Freshman',
        200,
        '/assets/thumbnails/freshman.jpg'
    );
-- LEVEL 3: SOPHOMORE
INSERT INTO public.courses (
        id,
        title,
        slug,
        track,
        description,
        instructor,
        level,
        credits_value,
        image_url
    )
VALUES (
        'course_sophomore',
        'Level 3: The Builder',
        'sophomore-builder',
        'Credit Building',
        'Active construction. Adding positive lines and removing simple errors.',
        'The Architect',
        'Sophomore',
        300,
        '/assets/thumbnails/sophomore.jpg'
    );
-- LEVEL 4: JUNIOR
INSERT INTO public.courses (
        id,
        title,
        slug,
        track,
        description,
        instructor,
        level,
        credits_value,
        image_url
    )
VALUES (
        'course_junior',
        'Level 4: The Warrior',
        'junior-warrior',
        'Disputes',
        'Advanced disputing and aggressive repair tactics.',
        'General Shield',
        'Junior',
        400,
        '/assets/thumbnails/junior.jpg'
    );
-- LEVEL 5: SENIOR
INSERT INTO public.courses (
        id,
        title,
        slug,
        track,
        description,
        instructor,
        level,
        credits_value,
        image_url
    )
VALUES (
        'course_senior',
        'Level 5: The Strategist',
        'senior-strategist',
        'Optimization',
        'High-level optimization and preparing for mortgage/auto funding.',
        'The Strategist',
        'Senior',
        500,
        '/assets/thumbnails/senior.jpg'
    );
-- LEVEL 6: GRADUATE
INSERT INTO public.courses (
        id,
        title,
        slug,
        track,
        description,
        instructor,
        level,
        credits_value,
        image_url
    )
VALUES (
        'course_graduate',
        'Level 6: The Sovereign',
        'graduate-sovereign',
        'Business Credit',
        'Leveraging credit for wealth creation. Business funding and travel hacking.',
        'The Chairman',
        'Graduate',
        1000,
        '/assets/thumbnails/graduate.jpg'
    );
-- 3. MODULES
-- FOUNDATION MODULES
INSERT INTO public.modules (id, course_id, title, "order")
VALUES (
        'mod_found_1',
        'course_foundation',
        'The Mindset Shift',
        1
    ),
    (
        'mod_found_2',
        'course_foundation',
        'The System Explained',
        2
    );
-- FRESHMAN MODULES
INSERT INTO public.modules (id, course_id, title, "order")
VALUES (
        'mod_fresh_1',
        'course_freshman',
        'Decoding The Report',
        1
    ),
    (
        'mod_fresh_2',
        'course_freshman',
        'The 5 Factors Deep Dive',
        2
    );
-- 4. LESSONS (Foundation)
-- Lesson 1.1: Welcome to the Wealth Game
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_1_1',
        'mod_found_1',
        'Welcome to the Wealth Game',
        'video',
        '/assets/dean-welcome-v2.mp4',
        5,
        1
    );
-- Lesson 1.2: The Matrix
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_1_2',
        'mod_found_1',
        'The Matrix (How It Works)',
        'video',
        '/assets/dean-part-2.mp4',
        7,
        2
    );
-- Lesson 1.3: The 5 Pillars (Hand Method)
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_1_3',
        'mod_found_2',
        'The 5 Pillars of Power',
        'text',
        '# The 5 Pillars of Power (FICO Breakdown)\n\n**Objective:** Memorize the percentage breakdown of a credit score using the Credit U "Hand" method.\n\n### The "Grip Strength" Rule\nYour credit score isn''t random magic. It''s a formula based on 5 factors. Visualize a hand holding a bag of money.\n\n1.  **Thumb (35% - The Grip): Payment History.** If you slip here, you drop the bag. This is the most critical factor. One late payment is a broken thumb.\n2.  **Index Finger (30% - The Direction): Utilization.** How much of your limit are you using? Pointing at too much debt weakens your grip.\n3.  **Middle Finger (15% - The Length): Age of History.** The longest finger. It grows over time. New credit drags this average down.\n4.  **Ring Finger (10% - The Commitment): Credit Mix.** Are you married to the game? Lenders like meaningful relationships—installment loans and credit cards.\n5.  **Pinky (10% - The Weakest): New Credit.** Don''t poke around too much (Hard Inquiries). Too many touches make you look desperate.\n\n**Moo Point Action:**\nLook at your hand. Touch your thumb to your index finger. Say "65 Percent." That is your focus.',
        10,
        3
    );
-- Lesson 1.4: Debt vs Leverage
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_1_4',
        'mod_found_2',
        'Debt vs. Leverage',
        'text',
        '# Debt vs. Leverage\n\n**Objective:** Distinguish between "Toxic Debt" and "Power Leverage" to build a wealthy mindset.\n\n### Not all debt is created equal.\n\n*   **Toxic Debt (Liabilities):** Buying things that lose value or disappear. Shoes, vacations, dinners, cars that just drive you to work. You pay interest to look rich.\n*   **Power Leverage (Assets):** Buying things that PAY YOU. Real estate, business inventory, education that increases income. You pay interest to GET rich.\n\n**The Golden Rule:**\nCredit U scholars pay their "Toxic" credit card debt in full every month. We never pay interest on a pair of sneakers. We only pay interest on assets that earn more than the interest costs.\n\n**The "ROI Filter":**\nBefore swiping your card, ask: "Will this purchase put money back in my pocket?" If no, pay cash or don''t buy it.\n\n**Moo Point Action:**\nDetailed review of your last statement. Circle one "Toxic" purchase you could have avoided.',
        8,
        4
    );
-- Lesson 1.5: Rules of Engagement
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_1_5',
        'mod_found_2',
        'The Rules of Engagement',
        'text',
        '# The Rules of Engagement (FCRA Rights)\n\n**Objective:** Introduce the concept that the credit report is a legal document, and it must be 100% accurate.\n\n### Your Bill of Rights\nThe Fair Credit Reporting Act (FCRA) gives you the power to fight the giants.\n\n*   **Rule #1: Accuracy.** Everything on your report must be 100% accurate. If the date, balance, or name is even slightly wrong, it must go.\n*   **Rule #2: Verification.** If you challenge an item, the bureau MUST prove it''s yours with evidence. If they can''t find the contract, they must delete it.\n*   **Rule #3: Timeliness.** They have 30 days to answer your dispute. If they are silent, they lose.\n\nYou are not asking for a favor; you are demanding federal compliance.\n\n**Moo Point Action:**\nMemorize the phrase: "Maximum Possible Accuracy." This is your sword.',
        10,
        5
    );
-- Lesson 1.6: Financial Avatar
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_1_6',
        'mod_found_2',
        'Your Financial Avatar',
        'text',
        '# Your Financial Avatar\n\n**Objective:** Understand that your "Credit Report" is a digital character that lenders judge.\n\n### The Paper Mirror\nLenders never meet *you*. They don''t know you''re a good person, a hard worker, or a loving parent. They only meet your **Avatar** (Your Credit Report).\n\n*   If your Avatar looks messy (late payments, high balances), the lender locks the door.\n*   If your Avatar looks sharp (on time, low utilization), the lender rolls out the red carpet.\n\nWe are here to groom your Avatar until it looks like a millionaire.\n\n**Moo Point Action:**\nDownload your credit report PDF. This is your "Selfie." Look at it.',
        8,
        6
    );
-- Lesson 1.7: Mission 800
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_1_7',
        'mod_found_2',
        'Mission 800: Setting the Target',
        'text',
        '# Mission 800 (Setting the Target)\n\n**Objective:** Define the specific goal (700+ or 800+) and understand the cost of a low score.\n\n### The Interest Tax\nWhy aim for 800? Because life is cheaper at the top.\n\n*   **500-600 (The Danger Zone):** You pay double or triple for everything. Rent is harder. Cars cost more.\n*   **600-700 (The Building Zone):** You can get approved, but you pay a "stupid tax" in interest.\n*   **740-800+ (The Sovereign Zone):** You become the boss. Banks fight for your business with 0% rates and VIP perks.\n\n**Example:** A 580 score pays $600/mo for a car. A 780 score pays $400/mo for the *same car*. That $200 difference is money straight out of your pocket.\n\n**Moo Point Action:**\nWrite down your current score and your goal score. Commit to closing the gap.',
        5,
        7
    );
-- 5. LESSONS (Freshman)
-- Lesson 2.1: Reading the Scoreboard
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_2_1',
        'mod_fresh_1',
        'Reading the Scoreboard',
        'text',
        '# Reading the Scoreboard\n\n**Objective:** Decode the confusing layout of a credit report to find errors.\n\n### Anatomy of the File\nCredit reports are intentionally boring and confusing. We decode them.\n\n1.  **Section 1: Personal Info.** (Names, Addresses). Watch for errors here—wrong addresses can link you to other people''s bad debt!\n2.  **Section 2: Trade Lines.** (Your Accounts). This is the meat. Look for "Status" (Current/Late) and "Balance."\n3.  **Section 3: Inquiries.** (Who looked). Hard vs. Soft.\n4.  **Section 4: Public Records/Collections.** The "Red Flags."\n\n**Moo Point Action:**\nGo through your report. Highlight every single name or address that is old or misspelled. We will delete those later.',
        15,
        1
    );
-- Lesson 2.2: The 35% Rule
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_2_2',
        'mod_fresh_2',
        'The 35% Rule (Perfect Payment)',
        'text',
        '# The 35% Rule (Perfect Payment)\n\n**Objective:** Strategies to ensure you never miss a payment again.\n\n### The Autopilot Shield\nPayment History is 35% of your score. You cannot afford a "zero" in this category.\n\n*   **The Trap:** Relying on memory. Life gets busy. You *will* forget.\n*   **The Strategy:** Automation is the ultimate shield.\n*   **The Method:** Set up **Autopay for the Minimum Due** on every single account.\n\n*Wait, minimum?* Yes. You should still pay the full balance manually to save interest. But if you get sick/busy/lost, the Autopay catches you. It prevents the "Late Payment" mark.\n\n**Moo Point Action:**\nLog into your bank *right now* and set "Autopay Minimum" for your credit cards.',
        10,
        2
    );
-- Lesson 2.3: Utilization Magic
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_2_3',
        'mod_fresh_2',
        'Utilization Magic (30/10/0)',
        'text',
        '# Utilization Magic (30/10/0)\n\n**Objective:** How to hack your utilization date to maximize your score.\n\n### The Sniper Payment\nUtilization is 30% of your score. Most people fail this because of *timing*.\n\n**The Secret:** There are two dates.\n1.  **Due Date:** When you must pay to avoid fees.\n2.  **Statement Date (Reporting Date):** When the bank takes a "snapshot" of your balance and sends it to the bureaus.\n\nIf you pay on the *Due Date*, the *Statement Date* has usually already passed. The high balance is already on your report!\n\n**The Hack:** Pay your balance down to 1-3% roughly **3 days BEFORE the Statement Date**.\n\n**Moo Point Action:**\nCall your bank or check your bill. Find out your "Statement Closing Date" (NOT the Due Date).',
        12,
        3
    );
-- Lesson 2.4: Age & Wisdom
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_2_4',
        'mod_fresh_2',
        'Age & Wisdom (Patience)',
        'text',
        '# Age & Wisdom (Patience)\n\n**Objective:** Why closing old cards hurts you and how to preserve history.\n\n### The Anchor Card\nLenders love stability. They want to see you''ve managed credit for a long time (15% of Score).\n\n*   **The Mistake:** Promoting "Closing old cards." When you close a 10-year-old card, you erase 10 years of history from this calculation. Your score drops.\n*   **The Fix:** Keep your oldest cards open forever. Even if the rewards suck.\n\n**Strategy:** Put a tiny subscription (like Netflix or iCloud, $1/mo) on it and set it to autopay. Throw the card in a drawer. It will build your history while you sleep.\n\n**Moo Point Action:**\nIdentify your oldest account. Ensure it''s active and has a small transaction to keep it from being closed for inactivity.',
        10,
        4
    );
-- Lesson 2.5: The Mix
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_2_5',
        'mod_fresh_2',
        'The Mix (Variety is Spice)',
        'text',
        '# The Mix (Variety is Spice)\n\n**Objective:** Understanding Revolving vs. Installment credit.\n\n### The Healthy Diet\nCredit Mix is 10% of your score. It shows you can handle different *types* of stress.\n\n*   **Revolving Credit:** Credit Cards. Balance goes up and down. Requires discipline.\n*   **Installment Credit:** Loans (Auto, Student, Personal). Fixed payment every month. Requires consistency.\n\nA profile with only credit cards is "thin." A profile with both is "thick" and robust.\n\n**Moo Point Action:**\nAudit your report. Do you have both types? If not, note it for your Sophomore strategy.',
        10,
        5
    );
-- Lesson 2.6: Inquiry Buffer
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_2_6',
        'mod_fresh_2',
        'The Inquiry Buffer',
        'text',
        '# The Inquiry Buffer\n\n**Objective:** Hard vs. Soft Pulls and how to protect your score.\n\n### The Velvet Rope\nEvery time you ask for credit, it counts as a "Hard Inquiry" (New Credit - 10%).\n\n*   **Hard Inquiry:** You applied for a loan. Drops score 3-5 points. Stays for 2 years.\n*   **Soft Inquiry:** You checked your own score, or a lender pre-approved you. **Does NOT affect score.**\n\nToo many Hard Inquiries in a short time makes you look desperate and risky.\n\n**Strategy:** Treat your credit report like a VIP club. Don''t let just any lender in. Only let them run your credit if you are 99% sure you will buy/get approved.\n\n**Moo Point Action:**\nCount your hard inquiries in the last 24 months. If you have more than 5, you need to "Garden" (stop applying) for 6 months.',
        8,
        6
    );
-- Lesson 2.7: Dispute Primer
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        duration_minutes,
        "order"
    )
VALUES (
        'less_2_7',
        'mod_fresh_2',
        'The Dispute Primer (Intro to War)',
        'text',
        '# The Dispute Primer (Intro to War)\n\n**Objective:** Introduction to challenging negative items.\n\n### Factual Disputing\nThis is where we go on offense. If there is a negative item (Late payment, Collection) on your report, you have the right to challenge it.\n\n*   **The Mindset:** We don''t ask nicely for forgiveness ("Goodwill"). We demand proof of accuracy ("Validation").\n*   **The Process:** You identify an error (wrong balance, wrong date, open when should be closed). You send a letter effectively saying: "Prove this is 100% accurate or remove it."\n\nThis is the core of Credit Repair. It''s not magic; it''s bureaucracy combat.\n\n**Moo Point Action:**\nOpen the "Credit Lab" tool and look at a sample dispute letter. That is your weapon for Level 3.',
        12,
        7
    );