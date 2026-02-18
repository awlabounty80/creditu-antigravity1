-- SUPREME CURRICULUM SEED: FRESHMAN FOUNDATIONS
-- TARGETS: The "Welcome" and "Matrix" lessons (first 2 videos)
-- PURPOSE: Ensure these lessons ALWAYS play the locally hosted Dean videos.
-- OVERWRITES: Both 'less_1_1' style IDs and 'l_c101_1' style IDs to catch all variations.
-- 1. TRACK 1: PERSONAL CREDIT (FRESHMAN)
-- We update the "Lessons" table directly.
-- LESSON 1.1: WELCOME TO THE WEALTH GAME
-- Update for 'less_1_1' (Master Seed ID)
UPDATE public.lessons
SET video_url = '/assets/dean-welcome-v2.mp4',
    content = '/assets/dean-welcome-v2.mp4',
    -- Legacy field support
    type = 'video',
    title = 'Welcome to the Wealth Game',
    content_markdown = '# Welcome to the Wealth Game

**Objective:** Define credit not as debt, but as a reputation currency that buys speed and access.

### The Truth

*   **The Old Way:** Consumer Mindset using credit for liabilities.
*   **The Credit U Way:** Architect Mindset using credit for **Leverage**.

**The Trust Scoreboard:**
Your credit report isn''t a judgment of your worth; it''s a scoreboard of your discipline. A high score tells the world, "I keep my promises."

**Moo Point Action:**
Download your specialized Credit U "Vision Board" from the Tools section.'
WHERE id = 'less_1_1';
-- Update for 'l_c101_1' (V2 Seed ID)
UPDATE public.lessons
SET video_url = '/assets/dean-welcome-v2.mp4',
    content = '/assets/dean-welcome-v2.mp4',
    type = 'video',
    title = 'Welcome to the Wealth Game',
    content_markdown = '# Welcome to the Wealth Game (V2)

**Objective:** Define credit not as debt, but as a reputation currency that buys speed and access.

### The Truth
Your credit report is a legal document. It is your reputation currency.

**Action Step:**
Watch the video above completely. It sets the tone for your entire financial future.'
WHERE id = 'l_c101_1';
-- LESSON 1.2: THE MATRIX (HOW IT WORKS)
-- Update for 'less_1_2' (Master Seed ID)
UPDATE public.lessons
SET video_url = '/assets/dean-part-2.mp4',
    content = '/assets/dean-part-2.mp4',
    type = 'video',
    title = 'The Matrix (How It Works)',
    content_markdown = '# The Matrix (How It Actually Works)

**Objective:** Explain the relationship between You, Lenders, Bureaus, and FICO.

### The Data Triangle
1.  **The Data Furnishers (Teachers):** Banks/Lenders. They report behavior.
2.  **The Data Collectors (Gossips):** Equifax, TransUnion, Experian. They compile data.
3.  **The Scorekeeper (Admissions):** FICO. They calculate risk.

**The Cheat Code:**
If a Teacher reports the wrong grade, you force the Gossips to correct the record using Federal Law (FCRA).'
WHERE id = 'less_1_2';
-- Update for 'l_c101_2' (V2 Seed ID)
UPDATE public.lessons
SET video_url = '/assets/dean-part-2.mp4',
    content = '/assets/dean-part-2.mp4',
    type = 'video',
    title = 'The Matrix (How It Works)',
    content_markdown = '# The Matrix

Three players rule your financial life:
1. Furnishers (Banks)
2. CRAs (Bureaus)
3. Scorers (FICO)

Understand who is who, and you can win the game.'
WHERE id = 'l_c101_2';
-- INSERT IF MISSING (Fallback for empty DB)
-- If less_1_1 doesn't exist, we insert it.
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        video_url,
        duration_minutes,
        "order"
    )
SELECT 'less_1_1',
    'mod_found_1',
    'Welcome to the Wealth Game',
    'video',
    '/assets/dean-welcome-v2.mp4',
    '/assets/dean-welcome-v2.mp4',
    5,
    1
WHERE NOT EXISTS (
        SELECT 1
        FROM public.lessons
        WHERE id = 'less_1_1'
    )
    AND EXISTS (
        SELECT 1
        FROM public.modules
        WHERE id = 'mod_found_1'
    );
INSERT INTO public.lessons (
        id,
        module_id,
        title,
        type,
        content,
        video_url,
        duration_minutes,
        "order"
    )
SELECT 'less_1_2',
    'mod_found_1',
    'The Matrix',
    'video',
    '/assets/dean-part-2.mp4',
    '/assets/dean-part-2.mp4',
    7,
    2
WHERE NOT EXISTS (
        SELECT 1
        FROM public.lessons
        WHERE id = 'less_1_2'
    )
    AND EXISTS (
        SELECT 1
        FROM public.modules
        WHERE id = 'mod_found_1'
    );