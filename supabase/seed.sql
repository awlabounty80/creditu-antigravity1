-- Clean up existing data for a fresh start (optional, be careful in prod)
TRUNCATE TABLE user_progress CASCADE;
TRUNCATE TABLE lessons CASCADE;
TRUNCATE TABLE modules CASCADE;
TRUNCATE TABLE courses CASCADE;
TRUNCATE TABLE badges CASCADE;
-- 1. Insert Courses
-- "Credit 101: The Rules of the Game"
-- Instructor: Dr. Cornelius Wealth
INSERT INTO courses (
        id,
        title,
        description,
        instructor,
        duration_minutes,
        level,
        image_url,
        sorting_order
    )
VALUES (
        'c001',
        'Credit 101: The Rules of the Game',
        'Stop playing blind. Learn the 5 pillars of the FICO algorithm and how the banking system actually works. This is your freshman orientation to financial sovereignty.',
        'Dr. Cornelius Wealth',
        45,
        'Freshman',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000',
        1
    );
-- "Dispute Tactics: Legal Jiu-Jitsu"
-- Instructor: Prof. Nia Truth
INSERT INTO courses (
        id,
        title,
        description,
        instructor,
        duration_minutes,
        level,
        image_url,
        sorting_order
    )
VALUES (
        'c002',
        'Dispute Tactics: Legal Jiu-Jitsu',
        'Don''t beg for deletions—demand them. Learn to leverage the FCRA, FDCPA, and Metro 2 compliance standards to clean your report efficiently.',
        'Prof. Nia Truth',
        60,
        'Junior',
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2000',
        2
    );
-- "Business Funding: The Bag Security"
-- Instructor: The Dean (AI)
INSERT INTO courses (
        id,
        title,
        description,
        instructor,
        duration_minutes,
        level,
        image_url,
        sorting_order
    )
VALUES (
        'c003',
        'Business Funding: Bag Security',
        'Transition from consumer to owner. How to structure your LLC, build a Paydex score, and access 0% interest capital.',
        'The Dean',
        90,
        'Senior',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
        3
    );
-- 2. Insert Modules for Credit 101
INSERT INTO modules (id, course_id, title, "order")
VALUES ('m001', 'c001', 'The 35%: Payment History', 1),
    (
        'm002',
        'c001',
        'The 30%: Utilization Mastery',
        2
    ),
    ('m003', 'c001', 'The 15%: Length of Credit', 3);
-- 3. Insert Lessons for Module 1
INSERT INTO lessons (
        id,
        module_id,
        title,
        content,
        type,
        duration_minutes,
        "order"
    )
VALUES (
        'l001',
        'm001',
        'What "On Time" Really Means',
        'Banks have a grace period, but the algorithm does not. Learn how 30-day lates damage your score for 7 years and how to use "Goodwill Letters" to remove them.',
        'video',
        10,
        1
    ),
    (
        'l002',
        'm001',
        'The Autopay Safety Net',
        'Set it and forget it. We will configure your primary checking account to ensure you never miss a minimum payment again.',
        'text',
        5,
        2
    ),
    (
        'l003',
        'm001',
        'Quiz: Payment History',
        'Test your knowledge on payment impacts.',
        'quiz',
        5,
        3
    );
-- 4. Insert Badges
INSERT INTO badges (
        id,
        name,
        description,
        icon,
        requirement_type,
        requirement_value
    )
VALUES (
        'b001',
        'Freshman Orientation',
        'Completed the first course and started the journey.',
        'GraduationCap',
        'course_completion',
        1
    ),
    (
        'b002',
        'Freedom Fighter',
        'Generated your first dispute letter in the Credit Lab.',
        'Scroll',
        'disputes_generated',
        1
    ),
    (
        'b003',
        'The Architect',
        'Added 3 goals to your Vision Board.',
        'Layout',
        'vision_board',
        3
    ),
    (
        'b004',
        '800 Club',
        'This is strictly for the elite. Achieved a credit score of 800+.',
        'Crown',
        'credit_score',
        800
    );