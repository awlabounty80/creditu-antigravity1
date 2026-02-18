-- ARCHITECT_CURRICULUM_UPDATE.sql
-- PURPOSE: Update Lesson 1 & 2 with FULL curriculum structure complying with "Curriculum Architect" standards.
-- INCLUDES: Original Teaching, Real-Life Examples, Moo Point Actions, Knowledge Checks, and OPTIONAL EXTERNAL LINKS.
-- =========================================================
-- LESSON 1: WELCOME TO THE WEALTH GAME
-- =========================================================
UPDATE public.lessons
SET content_markdown = '# Welcome to the Wealth Game

## Learning Objective
Define credit not as debt, but as a reputation currency that buys speed and access.

## Original Teaching: The Mindset Shift
Most people are taught that credit is a trap—a way to buy shoes and dinners you can''t afford. That is the "Consumer Mindset." At Credit U, we teach the **Architect Mindset**.

Credit is **Leverage**. It is the ability to access capital today based on your reputation for keeping promises. Wealthy individuals use credit to buy assets (things that pay them), while consumers use credit to buy liabilities (things that cost them).

## Real-Life Example
Imagine you want to start a landscaping business.
*   **Cash Way:** You save $50 a week for 3 years to buy a professional mower. You lose 3 years of profit.
*   **Credit Way:** You use a 0% business card to buy the mower today. You use the mower to earn $500/week. You pay off the card in 2 months. You keep 34 months of pure profit.

## Credit U Framework: The Trust Scoreboard
Your credit score is not a judgment of your worth as a human. It is simply a "Trust Scoreboard." It tells strangers (banks) how likely you are to keep your word.

## Moo Point Action Step
**Download the Credit U Vision Board.**
Write "850" in the center. List 3 assets you will buy once your credit is optimized (e.g., First Rental Property, Business Inventory, Family Home).

## Knowledge Check
1.  **True or False:** Credit is free money. (False - it is Trust).
2.  **True or False:** You should use credit to buy liabilities. (False - use it for Assets).

## Credit Lab Application
Navigate to your Dashboard. Note your current score. This is your starting line.

---
### Optional Public Education Resource (External Link)
*   [CFPB: Credit Reports and Scores](https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/)
    *(Public Education Resource – Not Affiliated with Credit U)*
'
WHERE id IN ('less_1_1', 'l_c101_1');
-- =========================================================
-- LESSON 2: THE MATRIX (HOW IT WORKS)
-- =========================================================
UPDATE public.lessons
SET content_markdown = '# The Matrix (How It Works)

## Learning Objective
Explain the relationship between the three major players: You, The Data Furnishers, and The Credit Bureaus.

## Original Teaching: The Data Triangle
The credit system is a game of "Telephone." You need to know who is whispering what.

1.  **The Data Furnishers (The Teachers):** These are your banks, credit unions, and lenders. They "grade" you every month (Paid on time? Late?). They send this report card to...
2.  **The Data Collectors (The Gossips):** Equifax, TransUnion, and Experian. These correspond to the "Credit Bureaus" (CRAs). They don''t check if the grade is true; they just write it down in your permanent record.
3.  **The Scorekeeper (The Algorithm):** FICO. This is a math formula that looks at the messy notes from the Bureaus and spits out a number (300-850).

## Real-Life Example
If a teacher (Bank) accidentally marks you absent when you were in class, the Principal''s record (Bureau) will show "Absent." The report card (Score) will drop.
You don''t argue with the report card (FICO). You don''t argue with the Principal (Bureau). You make the Teacher (Bank) correct their mistake, OR you prove to the Principal that the Teacher is lying.

## Credit U Framework: "Factual Disputing"
This relationship is why we use **Federal Law (FCRA)**. The law says the Bureaus must verify accuracy. If they can''t prove it''s true, they must delete it.

## Moo Point Action Step
Log in to the **Credit Lab** tab. Look at your "3 Bureau Report." Identify which of the three bureaus has the lowest score. Usually, this means that specific bureau has a "gossip" item the others don''t.

## Knowledge Check
1.  **Who creates your credit score?** (FICO/VantageScore - The Algorithm).
2.  **Who collects the data?** (The 3 Bureaus: Equifax, Experian, TransUnion).

## Credit Lab Application
Use the "Dispute Wizard" to see how we challenge incorrect data with the Bureaus.

---
### Optional Public Education Resource (External Link)
*   [FTC: Understanding Your Credit](https://consumer.ftc.gov/articles/understanding-your-credit)
    *(Public Education Resource – Not Affiliated with Credit U)*
'
WHERE id IN ('less_1_2', 'l_c101_2');