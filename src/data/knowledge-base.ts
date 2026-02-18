/**
 * CREDIT U™ KNOWLEDGE BASE ARTICLES
 * Source-verified educational content
 * Format: KNOWLEDGE_BASE_ARTICLE
 */

export const KNOWLEDGE_BASE_ARTICLES = {
    'fcra-overview': {
        id: 'KB-001',
        title: 'The Ultimate Guide to FCRA Rights',
        category: 'Legal',
        level: 'FRESHMAN',
        lastUpdated: '2026-01-20',
        author: 'Dean Sterling',
        sources: ['15 U.S.C. § 1681', 'FTC.gov'],
        content: `
# The Ultimate Guide to FCRA Rights

## The Constitution of Credit
The **Fair Credit Reporting Act (FCRA)** is not just a set of rules; it is your sword and shield. Enacted in 1970, it governs how credit bureaus (Equifax, Experian, TransUnion) collect, store, and sell your data.

## Your Core Rights

### 1. The Right to Accuracy (Section 611)
If you dispute an item, the bureau **must** investigate it within 30 days. They cannot just say "the bank said it's true." They must perform a reasonable investigation. If they cannot verify it, **they must delete it**.

### 2. The Right to Privacy (Section 604)
Your credit report is private. Only entities with a "Permissible Purpose" (like a lender you applied with, or a landlord) can look at it. If an unauthorized person pulls your credit, you can sue them for $1,000 per violation.

### 3. The Right to Fairness
Data must be fair. Bankruptcies cannot stay forever (10 years max). Most other negatives must vanish after 7 years. This is the statute of limitations for *reporting*, distinct from the statute for *suing*.

## How to Weaponize the FCRA
- **Never Dispute Online:** When you dispute online, you often waive your right to sue. Always send certified letters.
- **Demand Proof:** Don't just say "not mine." Demand they verify the *completeness* and *accuracy* of the data field by field (Metro 2 compliance).
        `,
        relatedArticles: ['KB-005', 'KB-006'],
        quiz: [
            {
                id: 'q1',
                question: 'Under FCRA Section 611, how long does a credit bureau have to investigate a dispute?',
                options: ['14 Days', '30 Days', '45 Days', '60 Days'],
                correctAnswer: 1,
                explanation: 'The FCRA mandates a 30-day investigation window. If they fail to verify within this time, the item must be deleted.'
            },
            {
                id: 'q2',
                question: 'If a credit bureau cannot verify a disputed item, what must they do?',
                options: ['Mark it as "Disputed"', 'Keep it but lower the impact', 'Delete it', 'Ask the creditor again'],
                correctAnswer: 2,
                explanation: 'If an item cannot be verified with the furnisher, it must be permanently deleted from your report.'
            },
            {
                id: 'q3',
                question: 'Which section of the FCRA governs "Permissible Purpose"?',
                options: ['Section 604', 'Section 609', 'Section 611', 'Section 623'],
                correctAnswer: 0,
                explanation: 'Section 604 defines who has the legal right (permissible purpose) to access your credit report.'
            }
        ]
    },
    'credit-utilization': {
        id: 'KB-002',
        title: 'Credit Utilization: The 30% Myth vs Reality',
        category: 'Scoring',
        level: 'FRESHMAN',
        author: 'Credit U Faculty',
        lastUpdated: '2026-01-22',
        sources: ['FICO Score 8 Models'],
        content: `
# Credit Utilization: The 30% Myth vs Reality

## The 30% Myth
You've heard it a million times: "Keep your utilization under 30%." This is **safe advice**, but it is not **optimal advice**. 

- **At 29% utilization**, you are passing.
- **At 3% utilization**, you are excelling.

## The AZEO Method
To maximize your FICO score, use the **All Zero Except One (AZEO)** method:
1. Pay off every credit card to $0 before the statement cuts.
2. Leave a tiny balance (e.g., $10-$20) on **one** bank credit card.
3. This reports a roughly 1% utilization.

## Why 1% is better than 0%
FICO penalizes "non-use" slightly. If every single revolving account reports $0, the algorithm thinks you aren't using credit. You lose ~15-20 points. By reporting $10 on one card, you avoid the "all zero" penalty.
        `,
        relatedArticles: ['KB-009', 'KB-012'],
        quiz: [
            {
                id: 'q1',
                question: 'What does AZEO stand for?',
                options: ['Always Zero Every One', 'All Zero Except One', 'Account Zeroing Every October', 'Authorized Zeroing Emergency Option'],
                correctAnswer: 1,
                explanation: 'AZEO stands for All Zero Except One, a strategy where all cards report $0 except for one card reporting a small balance.'
            },
            {
                id: 'q2',
                question: 'Why is 1% utilization often better than 0%?',
                options: ['It proves you have a job', '0% triggers a "non-use" penalty', 'Banks close 0% accounts instantly', 'It is not better, 0% is always best'],
                correctAnswer: 1,
                explanation: 'FICO scoring models often apply a small penalty if all revolving accounts report $0 balance, assuming inactivity.'
            },
            {
                id: 'q3',
                question: 'When should you pay your balance to achieve AZEO?',
                options: ['On the due date', 'After the due date', 'Before the statement closing date', 'Once a year'],
                correctAnswer: 2,
                explanation: 'You must pay before the statement closing date, as that is when the balance is usually snapshotted and reported to bureaus.'
            }
        ]
    },
    'hard-inquiries': {
        id: 'KB-003',
        title: 'How to Remove Hard Inquiries (The Legal Way)',
        category: 'Dispute Strategy',
        level: 'JUNIOR',
        author: 'Legal Team',
        lastUpdated: '2026-01-25',
        sources: ['15 U.S.C. § 1681b'],
        content: `
# Removing Hard Inquiries

## The Concept of "Permissible Purpose"
A hard inquiry can only exist on your report if the creditor had "Permissible Purpose" (FCRA Section 604) and your authorization.

## The Strategy
1. **Identify Unrecognized Inquiries**: If you didn't apply, it's fraud. Freeze your report and dispute it immediately.
2. **The "Non-Account" Inquiry**: If you applied for a car loan and 10 banks pulled your credit, you can often dispute the 9 you didn't go with. While "rate shopping" is allowed, the bureaus often fail to consolidate them properly.
3. **Freeze Secondary Bureaus**: Before disputing, freeze **SageStream** and **LexisNexis**. These are the data furnaces that secondary lenders check.

## Warning
**Do not dispute inquiries attached to open, active accounts.** If you dispute the inquiry for your current Amex card, Amex may close your account for fraud.
        `,
        relatedArticles: ['KB-013'],
        quiz: [
            {
                id: 'q1',
                question: 'Which secondary bureaus should you considers freezing before disputing inquiries?',
                options: ['Equifax & TransUnion', 'SageStream & LexisNexis', 'ChexSystems', 'Innovis'],
                correctAnswer: 1,
                explanation: 'SageStream and LexisNexis are often used to validate inquiry data; freezing them can prevent the main bureaus from verifying the inquiry.'
            },
            {
                id: 'q2',
                question: 'Why should you NEVER dispute an inquiry attached to an open, active account?',
                options: ['It is illegal', 'The creditor may close your account for fraud', 'It lowers your score', 'The bureau will ignore it'],
                correctAnswer: 1,
                explanation: 'Creditors view disputing the inquiry for an active account as a claim that the account was opened fraudulently, leading them to close it.'
            },
            {
                id: 'q3',
                question: 'What is required for a hard inquiry to be legal?',
                options: ['Permissible Purpose & Authorization', 'A valid driver license', 'A score above 600', 'Approval from the bureau'],
                correctAnswer: 0,
                explanation: 'Under FCRA Section 604, a creditor needs "Permissible Purpose" and your authorization (usually via application) to pull your credit.'
            }
        ]
    },
    'debt-snowball': {
        id: 'KB-004',
        title: 'Debt Snowball vs. Avalanche: Mathematical Breakdown',
        category: 'Debt',
        level: 'FRESHMAN',
        author: 'Financial Planner',
        lastUpdated: '2026-01-28',
        sources: ['Harvard Business Review Benefit Studies'],
        content: `
# Snowball vs. Avalanche

## The Avalanche (Mathematically Superior)
Sort debts by **Interest Rate (Highest to Lowest)**.
- You pay somewhat less interest over time.
- It is the most logical path.

## The Snowball (Psychologically Superior)
Sort debts by **Balance (Lowest to Highest)**.
- **Win fast**: You might pay off a $500 medical bill in month 1.
- **Momentum**: That "win" releases dopamine. You feel progress.
- **Cash Flow**: Eliminating a monthly payment frees up cash for the next debt.

## The Verdict
Credit U recommends the **Snowball Method** for most people. Why? Because debt is not just a math problem; it's a behavior problem. The behavior of quitting is the biggest risk. Snowball keeps you in the fight.
        `,
        relatedArticles: ['KB-007'],
        quiz: [
            {
                id: 'q1',
                question: 'Which debt repayment method is mathematically superior because it saves the most interest?',
                options: ['Snowball', 'Avalanche', 'Consolidation', 'Bankruptcy'],
                correctAnswer: 1,
                explanation: 'The Avalanche method targets high-interest debt first, mathematically saving the most money over time.'
            },
            {
                id: 'q2',
                question: 'Why does the Snowball method often work better for people despite the math?',
                options: ['It is faster', 'It creates psychological momentum', 'Banks prefer it', 'It lowers your interest rate'],
                correctAnswer: 1,
                explanation: 'The Snowball method focuses on quick wins (paying off small debts), which builds motivation and prevents quitting.'
            },
            {
                id: 'q3',
                question: 'In the Snowball method, how do you sort your debts?',
                options: ['Highest Balance to Lowest', 'Lowest Balance to Highest', 'Highest Interest Rate', 'Alphabetically'],
                correctAnswer: 1,
                explanation: 'Snowball sorts debts by balance, starting with the smallest balance to get a quick "win".'
            }
        ]
    },
    'section-609': {
        id: 'KB-005',
        title: 'Section 609 Dispute Letters Explained',
        category: 'Dispute Strategy',
        level: 'SOPHOMORE',
        author: 'Dean Sterling',
        lastUpdated: '2026-02-01',
        sources: ['FCRA Section 609'],
        content: `
# Section 609: The Magic Letter?

## What is it?
Section 609 of the FCRA deals with your right to request copies of your file and the sources of information. A "609 Letter" is a request for the credit bureau to verify not just the *existence* of the debt, but the *accuracy* of the reporting.

## What you are actually asking
You are asking: "Show me the original contract with my wet signature. Show me the billing history that proves this balance is exactly $452.12."

## The Pivot
When the bureau replies (usually with a generic list), you then pivot to **Section 611**. "You failed to provide the verifiable proof I requested under Section 609. Therefore, under Section 611(a)(5)(A), you must delete this unverified item."

**Success Rate**: Moderate to High, but requires persistence (3-4 rounds of letters).
        `,
        relatedArticles: ['KB-001', 'KB-015'],
        quiz: [
            {
                id: 'q1',
                question: 'What is the primary purpose of a Section 609 letter?',
                options: ['To sue the bureau', 'To request verification of accuracy and sources', 'To freeze your report', 'To update your address'],
                correctAnswer: 1,
                explanation: 'Section 609 allows you to request the underlying documents and sources that verify the information on your report.'
            },
            {
                id: 'q2',
                question: 'If the bureau fails to provide the requested proof, which section do you use next?',
                options: ['Section 604', 'Section 611', 'Chapter 7', 'Section 623'],
                correctAnswer: 1,
                explanation: 'You pivot to Section 611, arguing that because they failed to verify the item (as requested in 609), it must be deleted.'
            },
            {
                id: 'q3',
                question: 'Does a 609 letter guarantee removal?',
                options: ['Yes, always', 'No, strictly luck', 'No, but it forces a deeper investigation', 'Yes, if sent locally'],
                correctAnswer: 2,
                explanation: 'It is not a magic wand, but it forces the bureau to look for specific records they often do not have, increasing removal odds.'
            }
        ]
    },
    'dofd-explained': {
        id: 'KB-006',
        title: 'Understanding "Date of First Delinquency" (DOFD)',
        category: 'Legal',
        level: 'JUNIOR',
        author: 'Credit U Faculty',
        lastUpdated: '2026-02-02',
        sources: ['FCRA Section 605'],
        content: `
# The Doomsday Clock: Date of First Delinquency

## What is DOFD?
The **Date of First Delinquency** is the specific month and year you stopped paying the account and *never caught up*. 
- It sets the timer for the **7-year reporting limit**.
- It sets the timer for the **Statute of Limitations (SOL)** for lawsuits.

## The Danger of "Re-Aging"
Unscrupulous debt collectors will sometimes update the DOFD to the date *they* bought the debt. This is illegal. It keeps the debt on your report longer than 7 years.
- **Check Your Report**: Look at the "On Record Until" date. Subtract 7 years. That should be your DOFD.
- **Dispute Re-Aging**: If a collector sets a recent DOFD for an old debt, dispute it citing **FCRA violations**.
        `,
        relatedArticles: ['KB-010'],
        quiz: [
            {
                id: 'q1',
                question: 'What does DOFD stand for?',
                options: ['Date of Final Discharge', 'Date of First Delinquency', 'Dept of Financial Defense', 'Date of Filling Debt'],
                correctAnswer: 1,
                explanation: 'Date of First Delinquency signifies when the account first went negative and never became current again.'
            },
            {
                id: 'q2',
                question: 'How long does a delinquent account generally stay on your credit report?',
                options: ['5 Years', '7 Years', '10 Years', 'Forever'],
                correctAnswer: 1,
                explanation: 'Most negative items fall off 7 years after the Date of First Delinquency.'
            },
            {
                id: 'q3',
                question: 'What is "Re-Aging"?',
                options: ['Making a debt look newer than it is', 'Making a debt look old', 'Paying off a debt', 'Closing an account'],
                correctAnswer: 0,
                explanation: 'Re-aging is an illegal practice where collectors change the DOFD to keep the debt on your report longer.'
            }
        ]
    },
    'pay-for-delete': {
        id: 'KB-007',
        title: 'Pay for Delete: Negotiating with Collectors',
        category: 'Debt',
        level: 'SENIOR',
        author: 'Negotiation Specialist',
        lastUpdated: '2026-02-03',
        sources: ['Industry Practice'],
        content: `
# Pay for Delete

## The Gentlemen's Agreement
"Pay for Delete" is a negotiation where you agree to pay a collection agency (usually 30-50% of the balance) *only if* they agree to delete the tradeline from your credit report.

## Will they do it?
- **Original Creditors (Chase, Amex)**: Almost never. They have strict policies.
- **Debt Buyers (Midland, Portfolio Recovery)**: Often yes. Their business model is buying bad debt for pennies. If you pay them dollars, they win. They don't care about the accuracy of the credit report.

## The Process
1. **Get it in Writing**: Never pay over the phone based on a "promise." Email or mail an agreement.
2. **The "Restrictive Endorsement"**: (Risky) sending a check with "Cashing this check constitutes agreement to delete account XYZ" written on the back.
3. **Follow Up**: If they take the money and don't delete, dispute the account with the bureaus as "Paid in full - Agreed to delete."
        `,
        relatedArticles: ['KB-004', 'KB-010'],
        quiz: [
            {
                id: 'q1',
                question: 'Which type of creditor is MOST likely to accept a Pay for Delete?',
                options: ['Original Creditors (Chase, Amex)', 'Debt Buyers (Collection Agencies)', 'Mortgage Lenders', 'Student Loan Servicers'],
                correctAnswer: 1,
                explanation: 'Debt buyers purchase debt for pennies on the dollar and are profit-motivated; they are flexible unlike original banks.'
            },
            {
                id: 'q2',
                question: 'Why must you get the agreement in writing?',
                options: ['To show your friends', 'Because phone promises are notoriously unreliable', 'It is required by law', 'To fax it to the IRS'],
                correctAnswer: 1,
                explanation: 'Collection agents often promise deletion to get a payment, then "forget" to do it. Written proof is essential.'
            },
            {
                id: 'q3',
                question: 'Does paying a collection normally remove it from your report?',
                options: ['Yes', 'No, it updates to "Paid Collection"', 'Yes, immediately', 'Only if it is medical'],
                correctAnswer: 1,
                explanation: 'Standard payment just updates the status to "Paid Collection," which is still a negative mark. Hence the need for Pay for Delete.'
            }
        ]
    },
    'bk-7-13': {
        id: 'KB-008',
        title: 'Bankruptcy Chapters 7 vs 13',
        category: 'Legal',
        level: 'JUNIOR',
        author: 'Legal Team',
        lastUpdated: '2026-02-04',
        sources: ['US Bankruptcy Code'],
        content: `
# Bankruptcy: The Nuclear Option

## Chapter 7 (Liquidation)
- **Who**: People with little income/assets (must pass Means Test).
- **What**: Wipes out unsecured debt (credit cards, medical).
- **Cost**: You may lose luxury assets (boat, second car). Most basics are exempt.
- **Credit Impact**: Stays on report for **10 years**.
- **Speed**: Discharged in 3-4 months.

## Chapter 13 (Reorganization)
- **Who**: People with steady income who want to keep assets (e.g., house in foreclosure).
- **What**: You repay a portion of debt over 3-5 years.
- **Credit Impact**: Stays on report for **7 years**.
- **Speed**: Takes 3-5 years to complete.

## Strategic Default
Sometimes, doing nothing is better than BK. If you are "judgment proof" (no assets, income exempt), creditors can sue you but can't collect.
        `,
        relatedArticles: ['KB-006'],
        quiz: [
            {
                id: 'q1',
                question: 'How long does a Chapter 7 bankruptcy stay on your credit report?',
                options: ['5 Years', '7 Years', '10 Years', '15 Years'],
                correctAnswer: 2,
                explanation: 'Chapter 7 is the most severe and remains on your public record for 10 years.'
            },
            {
                id: 'q2',
                question: 'Which chapter involves a repayment plan over 3-5 years?',
                options: ['Chapter 7', 'Chapter 11', 'Chapter 13', 'Chapter 9'],
                correctAnswer: 2,
                explanation: 'Chapter 13 is a "wage earner\'s plan" that reorganizes debt into manageable payments over time.'
            },
            {
                id: 'q3',
                question: 'What does it mean to be "Judgment Proof"?',
                options: ['You have a good lawyer', 'You have no assets or income legally seizable by creditors', 'You have won in court', 'You are bankrupt'],
                correctAnswer: 1,
                explanation: 'Being judgment proof means creditors can sue you, but you have nothing they can legally take to satisfy the judgment.'
            }
        ]
    },
    'fico-8-9': {
        id: 'KB-009',
        title: 'FICO 8 vs FICO 9: Scoring Models Compared',
        category: 'Scoring',
        level: 'SOPHOMORE',
        author: 'Analytics Dept',
        lastUpdated: '2026-02-05',
        sources: ['FICO Technical Specs'],
        content: `
# Battle of the Algorithms: FICO 8 vs 9

## FICO 8 (The Standard)
- Used by most lenders today.
- Treats paid collections as negative (unless removed).
- Treats medical debt the same as other debt.

## FICO 9 (The Modern)
- **Paid Collections**: Ignored! If you pay a collection, it stops hurting your score.
- **Medical Debt**: Weighted less heavily than credit card debt.
- **Rental History**: Can factor in rent payments if reported (e.g., via Rental Kharma).

## Why you need to know
If you are applying for an auto loan (often FICO 8) vs a personal loan (might be FICO 9), your scores could be 50 points different. Knowing which model a lender uses helps you prepare your report.
        `,
        relatedArticles: ['KB-002', 'KB-020'],
        quiz: [
            {
                id: 'q1',
                question: 'How does FICO 9 treat paid collections compared to FICO 8?',
                options: ['Same penalty', 'Worse penalty', 'It ignores them entirely', 'Only counts if >$500'],
                correctAnswer: 2,
                explanation: 'FICO 9 disregards paid collections, providing a huge incentive to settle debts even without a deletion (though deletion is still better).'
            },
            {
                id: 'q2',
                question: 'Which scoring model is currently the most widely used?',
                options: ['FICO 2', 'FICO 5', 'FICO 8', 'FICO 9'],
                correctAnswer: 2,
                explanation: 'FICO 8 remains the industry standard for most lending decisions, though FICO 9 is gaining adoption.'
            },
            {
                id: 'q3',
                question: 'How does FICO 9 handle medical debt?',
                options: ['It ignores it', 'It weighs it less heavily than other debt', 'It weighs it double', 'No difference'],
                correctAnswer: 1,
                explanation: 'FICO 9 differentiates medical debt from consumer debt, penalizing it less severely.'
            }
        ]
    },
    'zombie-debt': {
        id: 'KB-010',
        title: 'Dealing with "Zombie Debt" and Statute of Limitations',
        category: 'Legal',
        level: 'SENIOR',
        author: 'Legal Team',
        lastUpdated: '2026-02-06',
        sources: ['Statutes of Limitations by State'],
        content: `
# Zombie Debt

## What is it?
Debt that is **Time-Barred**. The Statute of Limitations (SOL) for suing you has passed (usually 3-6 years depending on state). 

## The Trap
Collectors buy this debt for pennies. They call you. "Just pay $5 good faith."
**DO NOT PAY $5.**
In many states, making *any* payment restarts the Statute of Limitations. You just brought the Zombie back to life. Now they can sue you for the full amount + interest.

## The Defense
1. **Send a Cease and Desist**: "I refuse to pay this debt. It is time-barred. Do not contact me again."
2. **Check Your Report**: It should not be on your credit report if it's >7 years old. If it is, dispute it immediately as "Obsolete."
        `,
        relatedArticles: ['KB-006', 'KB-007'],
        quiz: [
            {
                id: 'q1',
                question: 'What is "Time-Barred" debt?',
                options: ['Debt older than 1 year', 'Debt past the Statute of Limitations for lawsuits', 'Debt held by zombies', 'Debt secured by a bar'],
                correctAnswer: 1,
                explanation: 'Time-barred debt is old enough that the creditor can no longer legally sue you to collect it.'
            },
            {
                id: 'q2',
                question: 'What is the "Zombie Debt" trap?',
                options: ['They eat your brains', 'Paying a small amount restarts the Statute of Limitations', 'They hire zombies to collect', 'The debt doubles every month'],
                correctAnswer: 1,
                explanation: 'Collectors try to trick you into making a small "good faith" payment, which often legally resets the clock, allowing them to sue you again.'
            },
            {
                id: 'q3',
                question: 'If a debt is time-barred, can it still be reported on your credit report?',
                options: ['Yes, forever', 'No, never', 'Only if it is < 7 years old', 'Only if you agree'],
                correctAnswer: 2,
                explanation: 'The reporting limit (7 years) and the lawsuit limit (SOL) are different. A debt can be time-barred from lawsuits but still appear on your report if less than 7 years old.'
            }
        ]
    },
    'medical-debt': {
        id: 'KB-011',
        title: 'Medical Debt Rights: The No Surprises Act',
        category: 'Legal',
        level: 'FRESHMAN',
        author: 'Credit U Faculty',
        lastUpdated: '2026-02-07',
        sources: ['No Surprises Act', 'Equifax/Experian/TransUnion Joint Policy'],
        content: `
# Medical Debt: A New Era

## The Big Changes
1. **Paid Medical Debt is Gone**: As of July 2022, paid medical collection debt is no longer included on consumer credit reports.
2. **One Year Waiting Period**: Unpaid medical collection debt cannot be reported until it is at least 365 days past due. This gives you a year to fight the insurance company.
3. **Under $500**: Medical collection debt under $500 is generally not reported by the big three bureaus.

## The No Surprises Act
Federal law protects you from surprise bills when you get emergency care or get treated by an out-of-network provider at an in-network hospital.
- **Action**: If you get a surprise bill, call the provider and say: "I am disputing this bill under the No Surprises Act. Please pause all collection activity."
        `,
        relatedArticles: ['KB-001', 'KB-009'],
        quiz: [
            {
                id: 'q1',
                question: 'Does paid medical debt appear on your credit report?',
                options: ['Yes, for 7 years', 'No, it is removed entirely', 'Only if over $500', 'Yes, but as "Paid"'],
                correctAnswer: 1,
                explanation: 'As of 2022, paid medical collections are no longer reported on credit reports.'
            },
            {
                id: 'q2',
                question: 'How long must a medical debt go unpaid before it can be reported?',
                options: ['30 Days', '90 Days', '180 Days', '365 Days'],
                correctAnswer: 3,
                explanation: 'There is a 365-day waiting period before unpaid medical collections can appear on your report.'
            },
            {
                id: 'q3',
                question: 'What federal law protects you from surprise out-of-network bills?',
                options: ['ACA', 'No Surprises Act', 'HIPAA', 'FCRA'],
                correctAnswer: 1,
                explanation: 'The No Surprises Act protects patients from unexpected bills for emergency services or out-of-network providers at inside-network facilities.'
            }
        ]
    },
    'authorized-user': {
        id: 'KB-012',
        title: 'Authorized User Tradelines: Pros & Cons',
        category: 'Scoring',
        level: 'FRESHMAN',
        author: 'Dean Sterling',
        lastUpdated: '2026-02-08',
        sources: ['FICO High Achiever Study'],
        content: `
# Authorized Users (Piggybacking)

## The Hack
You can be added as an **Authorized User (AU)** on someone else's credit card (like a parent or spouse). You get their entire history for that account on your report.
- **Pros**: Instant age, instant limit, instant positive history.
- **Cons**: If they miss a payment or max out the card, your score crashes too.

## The "Anti-Abuse" Algorithm
FICO 8 and newer models have logic to detect "fake" authorized users (buying tradelines from strangers).
- **Family Match**: The algorithm looks for matching last names or addresses.
- **Tradeline Age**: Adding a 20-year-old account to a 2-year-old credit file looks suspicious but usually still helps.

## Best Practice
Only ask someone with:
1. Perfect payment history (0 lates).
2. Low utilization (<10%) on that specific card.
3. Long history (>5 years).
        `,
        relatedArticles: ['KB-002', 'KB-009'],
        quiz: [
            {
                id: 'q1',
                question: 'What is the primary benefit of becoming an Authorized User?',
                options: ['You get free money', 'You inherit the account history (age and payments)', 'Your debt is wiped out', 'You get a higher interest rate'],
                correctAnswer: 1,
                explanation: 'Being an AU allows you to "piggyback" on the primary account holder\'s positive credit history.'
            },
            {
                id: 'q2',
                question: 'Can being an Authorized User hurt your score?',
                options: ['No, never', 'Yes, if the primary user misses payments or has high utilization', 'Only if you spend money', 'Yes, it costs 50 points automatically'],
                correctAnswer: 1,
                explanation: 'Negative activity (late payments, high utilization) on the primary account will also reflect on your Authorized User report.'
            },
            {
                id: 'q3',
                question: 'Does FICO try to detect "fake" Authorized Users?',
                options: ['No, they don\'t care', 'Yes, checking for family relations/address match', 'Only for mortgages', 'Yes, but only for business cards'],
                correctAnswer: 1,
                explanation: 'Newer FICO models look for shared addresses or last names to ensure the AU relationship is legitimate (e.g., family).'
            }
        ]
    },
    'credit-freeze': {
        id: 'KB-013',
        title: 'How to Freeze Your Credit (and Why You Should)',
        category: 'Security',
        level: 'FRESHMAN',
        author: 'Security Team',
        lastUpdated: '2026-02-08',
        sources: ['Federal Law S.2155'],
        content: `
# Freezing Your Credit: The Ultimate Shield

## What is a Freeze?
A **Security Freeze** locks your credit report. No one (including you) can open a new account in your name.
- It is **Free** (Federally mandated).
- It does **not** affect your score.
- You can "Thaw" it instantly via app/web when you want to apply for something.

## Why do it?
Data breaches are inevitable. Equifax leaked 147 million records. T-Mobile leaked 50 million. Your social security number is likely already on the dark web.
A freeze makes that stolen data useless. A thief can have your SSN, DOB, and Address, but if the bank can't pull your report, they won't issue the loan.

## How to do it
Download the apps for:
1. **Experian**
2. **TransUnion**
3. **myEquifax**
Toggle "Freeze" to ON. Done.
        `,
        relatedArticles: ['KB-019'],
        quiz: [
            {
                id: 'q1',
                question: 'Does freezing your credit report hurt your credit score?',
                options: ['Yes, heavily', 'No, not at all', 'Only temporarily', 'Yes, if done too often'],
                correctAnswer: 1,
                explanation: 'A security freeze has strictly zero impact on your credit score; it simply blocks access to the report.'
            },
            {
                id: 'q2',
                question: 'How much does it cost to freeze your credit?',
                options: ['$10 per bureau', '$30 one-time fee', 'Free (Federally Mandated)', '$5 per month'],
                correctAnswer: 2,
                explanation: 'Since 2018, federal law requires credit bureaus to offer credit freezes and thaws for free.'
            },
            {
                id: 'q3',
                question: 'If your credit is frozen, can you apply for a new loan?',
                options: ['Yes, immediately', 'No, you must "Thaw" it first', 'Only for cars', 'Yes, but interest is higher'],
                correctAnswer: 1,
                explanation: 'You must temporarily lift (thaw) the freeze before applying so the lender can access your report.'
            }
        ]
    },
    'student-loans': {
        id: 'KB-014',
        title: 'Student Loan Rehabilitation vs Consolidation',
        category: 'Debt',
        level: 'SOPHOMORE',
        author: 'Financial Aid Expert',
        lastUpdated: '2026-02-09',
        sources: ['Department of Education'],
        content: `
# Fixing Defaulted Student Loans

## The Problem
You defaulted on a federal student loan. It's destroying your credit.

## Option 1: Rehabilitation (The Credit Fixer)
- **Process**: You agree to make 9 reasonable monthly payments (often $5 based on income) within 10 months.
- **Benefit**: The "Default" status is **removed** from your credit history. The late payments remain, but the default is gone.
- **Limit**: You can only do this **once**.

## Option 2: Consolidation (The Quick Fix)
- **Process**: You take out a new Direct Consolidation Loan to pay off the old ones.
- **Benefit**: Instantly gets you out of default.
- **Drawback**: The "Default" status remains on your credit report for 7 years. It just shows as "Paid in Full" with a history of default.

**Verdict**: If you care about your score, **Rehabilitation** is usually better.
        `,
        relatedArticles: ['KB-004'],
        quiz: [
            {
                id: 'q1',
                question: 'Which method removes the "Default" status from your credit report?',
                options: ['Consolidation', 'Rehabilitation', 'Deferment', 'Forbearance'],
                correctAnswer: 1,
                explanation: 'Rehabilitation allows you to remove the default status after 9 on-time payments.'
            },
            {
                id: 'q2',
                question: 'Does Consolidation remove the history of default?',
                options: ['Yes', 'No, it stays for 7 years', 'Yes, for a fee', 'Only if you consolidate with a private lender'],
                correctAnswer: 1,
                explanation: 'Consolidation pays off the old loan, but the record of the old loan defaulting remains on your report for 7 years.'
            },
            {
                id: 'q3',
                question: 'How many times can you Rehabilitate a student loan?',
                options: ['Unlimited', 'Once', 'Twice', 'Every 5 years'],
                correctAnswer: 1,
                explanation: 'Rehabilitation is a one-time opportunity per loan.'
            }
        ]
    },
    'goodwill-letters': {
        id: 'KB-015',
        title: 'Goodwill Letters: Removing Late Payments',
        category: 'Dispute Strategy',
        level: 'SOPHOMORE',
        author: 'Credit U Faculty',
        lastUpdated: '2026-02-09',
        sources: ['Industry Best Practice'],
        content: `
# The Goodwill Letter

## The Strategy
You aren't disputing the error. You are admitting you messed up, explaining why (tragedy, illness, error), and asking for mercy.

## The Target
Send this to the **CEO's office** or **Executive Customer Relations**, not the general PO Box.

## The Script (Concept)
"I have been a loyal customer for 5 years. In Jan 2024, I was hospitalized for COVID-19 (see attached). I missed one specific payment. I immediately caught up and have been perfect since. This single blemish is hurting my ability to buy a home for my family. Would you consider a 'Goodwill Adjustment' to remove this 30-day late mark?"

**Success Rate**: Low for big banks, High for Credit Unions and retail cards.
        `,
        relatedArticles: ['KB-003', 'KB-005'],
        quiz: [
            {
                id: 'q1',
                question: 'What is a Goodwill Letter?',
                options: ['A legal dispute', 'A request for removal based on kindness/circumstance', 'A demand for validation', 'A receipt of payment'],
                correctAnswer: 1,
                explanation: 'A goodwill letter asks the creditor to remove a negative mark out of courtesy, explaining extenuating circumstances.'
            },
            {
                id: 'q2',
                question: 'Who is the best target for a designated Goodwill Letter?',
                options: ['Customer Service', 'The CEO/Executive Office', 'The Credit Bureau', 'The Collection Agency'],
                correctAnswer: 1,
                explanation: 'Executive offices have more power to grant exceptions than standard customer service reps.'
            },
            {
                id: 'q3',
                question: 'Are creditors legally required to grant goodwill adjustments?',
                options: ['Yes, FCRA Section 623', 'No, it is voluntary', 'Yes, if you pay', 'Only for medical debt'],
                correctAnswer: 1,
                explanation: 'Creditors are required to report accurately; removing a valid late payment is purely at their discretion (goodwill).'
            }
        ]
    },
    'mortgage-underwriting': {
        id: 'KB-016',
        title: 'Mortgage Underwriting: DTI & LTV Explained',
        category: 'Lending',
        level: 'JUNIOR',
        author: 'Mortgage Underwriter',
        lastUpdated: '2026-02-10',
        sources: ['Fannie Mae Selling Guide'],
        content: `
# Mortgage Math: DTI and LTV

## DTI: Debt-to-Income Ratio
- **Front-End DTI**: (Housing Costs) / (Gross Income). Ideal: < 28%.
- **Back-End DTI**: (Housing + All Debt Payments) / (Gross Income). Ideal: < 36% (Max 43-50% for FHA).
- **Hack**: Pay off small installment loans (car, student) to lower your monthly obligation, drastically improving DTI.

## LTV: Loan-to-Value Ratio
- **Formula**: (Loan Amount) / (Home Value).
- **Impact**: 
  - > 80% LTV usually requires PMI (Private Mortgage Insurance).
  - < 80% LTV gets better rates and no PMI.

**Pro Tip**: Lenders look at the *lower* of the Appraised Value or Purchase Price. You can't use "instant equity" to avoid PMI on a purchase.
        `,
        relatedArticles: ['KB-017', 'KB-002'],
        quiz: [
            {
                id: 'q1',
                question: 'What is the ideal "Front-End" DTI ratio for most loans?',
                options: ['< 28%', '< 36%', '< 43%', '< 50%'],
                correctAnswer: 0,
                explanation: 'A front-end DTI (housing cost only) of 28% or lower is the standard benchmark for conventional loans.'
            },
            {
                id: 'q2',
                question: 'LTV stands for:',
                options: ['Loan to Value', 'Long Term Value', 'Loan Tax Variable', 'Liability Total Value'],
                correctAnswer: 0,
                explanation: 'Loan-to-Value ratio compares the loan amount to the home\'s appraised value.'
            },
            {
                id: 'q3',
                question: 'What usually happens if your LTV is above 80%?',
                options: ['Loan denied', 'You need PMI', 'Interest rate drops', 'You get cash back'],
                correctAnswer: 1,
                explanation: 'Lenders typically require Private Mortgage Insurance (PMI) to protect them against default if you have less than 20% equity.'
            }
        ]
    },
    'va-residual-income': {
        id: 'KB-017',
        title: 'VA Loan Residual Income Requirements',
        category: 'Lending',
        level: 'SENIOR',
        author: 'VA Specialist',
        lastUpdated: '2026-02-10',
        sources: ['VA Lenders Handbook, Chapter 4'],
        content: `
# VA Loans: The Residual Income Test

## The Special Rule
Almost all loans focus on DTI (Debt-to-Income). VA loans are unique. They look at **Residual Income**.
- **Definition**: How much net cash do you have left over after paying mortgage + debts + taxes + utilities + maintenance.

## Why it matters
The VA wants to know you can afford food and gas.
- **Example**: A family of 4 in the Midwest needs ~$1,003 in residual income.
- **Power**: If you hit the residual income target allowed by 120%, the VA allows a DTI up to **60% or more**. This is unheard of in Conventional lending.

**Takeaway**: If you have high income but high debt, a VA loan is the most flexible product in existence.
        `,
        relatedArticles: ['KB-016'],
        quiz: [
            {
                id: 'q1',
                question: 'What unique metric do VA loans look at instead of just DTI?',
                options: ['Credit Score', 'Residual Income', 'Net Worth', 'Investment Portfolio'],
                correctAnswer: 1,
                explanation: 'VA loans focus heavily on Residual Income—the actual cash left over for living expenses after bills.'
            },
            {
                id: 'q2',
                question: 'What is the typical down payment requirement for a VA loan?',
                options: ['20%', '10%', '3.5%', '0%'],
                correctAnswer: 3,
                explanation: 'One of the biggest benefits of VA loans is 0% down payment for eligible veterans.'
            },
            {
                id: 'q3',
                question: 'Who is eligible for a VA loan?',
                options: ['Everyone', 'First time buyers', 'Veterans and Active Duty Military', 'Low income families'],
                correctAnswer: 2,
                explanation: 'VA loans are an earned benefit for Veterans, Active Duty service members, and eligible surviving spouses.'
            }
        ]
    },
    'chexsystems': {
        id: 'KB-018',
        title: 'ChexSystems: The "Other" Credit Report',
        category: 'Banking',
        level: 'SOPHOMORE',
        author: 'Banking Insider',
        lastUpdated: '2026-02-11',
        sources: ['ChexSystems Consumer Disclosure'],
        content: `
# ChexSystems: Banking Jail

## What is it?
A reporting agency for **Checking Accounts**. If you bounce checks, commit fraud, or leave an account with a negative balance, you go into ChexSystems for **5 years**.

## The Consequence
You cannot open a bank account at 80% of major banks.

## The Fix
1. **Pay it**: Unlike credit, paying the bank often results in immediate removal (if you negotiate it).
2. **Dispute it**: "I did not authorize these overdraft fees." (Standard dispute tactics apply).
3. **Second Chance Banking**: Use "Non-ChexSystems" banks like **Chime**, **Varo**, or **SoFi**, or look for local Credit Unions with "Fresh Start" checking.
        `,
        relatedArticles: ['KB-001', 'KB-019'],
        quiz: [
            {
                id: 'q1',
                question: 'What does ChexSystems report?',
                options: ['Credit Card Usage', 'Checking/Savings Account History', 'Employment History', 'Criminal Record'],
                correctAnswer: 1,
                explanation: 'ChexSystems is a consumer reporting agency that tracks banking activity, specifically mishandled accounts (overdrafts, fraud).'
            },
            {
                id: 'q2',
                question: 'How long do derogatory marks stay on ChexSystems?',
                options: ['2 Years', '5 Years', '7 Years', '10 Years'],
                correctAnswer: 1,
                explanation: 'ChexSystems keeps records of negative banking history for 5 years.'
            },
            {
                id: 'q3',
                question: 'If you are blacklisted by ChexSystems, what can you do?',
                options: ['Nothing', 'Use cash only', 'Open a "Second Chance" bank account', 'Change your name'],
                correctAnswer: 2,
                explanation: 'Many banks and credit unions offer special "Second Chance" or "Fresh Start" accounts for those on the ChexSystems blacklist.'
            }
        ]
    },
    'id-theft-recovery': {
        id: 'KB-019',
        title: 'Identity Theft Recovery Steps (FTC)',
        category: 'Security',
        level: 'CRITICAL',
        author: 'Security Team',
        lastUpdated: '2026-02-11',
        sources: ['IdentityTheft.gov'],
        content: `
# ID Theft: Defcon 1 Protocol

## Immediate Steps
1. **Freeze Everything**: Experian, Equifax, TransUnion, ChexSystems, Innovis.
2. **File an FTC Affidavit**: Go to IdentityTheft.gov. This creates your "Identity Theft Report."
3. **File a Police Report**: Take your FTC Affidavit to the local police. They probably won't investigate, but you need the *Paper Report*.

## Blocking Information (FCRA Section 605B)
This is your superpower.
- Send the Police Report + FTC Affidavit to the bureaus.
- Cite **Section 605B of the FCRA**.
- **Demand**: They must BLOCK the reporting of any information resulting from the theft within **4 business days**. 
- This is much faster than a standard 30-day dispute.
        `,
        relatedArticles: ['KB-013', 'KB-003'],
        quiz: [
            {
                id: 'q1',
                question: 'What documents do you need to block ID theft info?',
                options: ['Driver License', 'FTC Affidavit & Police Report', 'Utility Bill', 'Birth Certificate'],
                correctAnswer: 1,
                explanation: 'To invoke Section 605B blocking, you must provide an Identity Theft Report (FTC Affidavit) and proof of filing with law enforcement.'
            },
            {
                id: 'q2',
                question: 'How fast must a bureau block ID theft info after receiving your request?',
                options: ['30 Days', '14 Days', '4 Business Days', 'Immediately'],
                correctAnswer: 2,
                explanation: 'FCRA Section 605B mandates a block within 4 business days of receiving a valid request.'
            },
            {
                id: 'q3',
                question: 'Where should you go to file your initial affidavit?',
                options: ['Police Station', 'IdentityTheft.gov', 'CreditKarma', 'Social Security Office'],
                correctAnswer: 1,
                explanation: 'IdentityTheft.gov is the official government site to create your Identity Theft Report/Affidavit.'
            }
        ]
    },
    'metro-2-format': {
        id: 'KB-020',
        title: 'Metro 2 Format: How Credit Reporting Works',
        category: 'Technical',
        level: 'SENIOR',
        author: 'Dean Sterling',
        lastUpdated: '2026-02-11',
        sources: ['CDIA Metro 2 Resource Guide'],
        content: `
# Metro 2®: The Code of Credit

## The Language
Credit reporting is not English. It is a standardized data format called **Metro 2®** maintained by the CDIA (Consumer Data Industry Association).

## Why it matters to you
When you dispute, you are often arguing about English ("I paid this"). The bureau is investigating Code.
- **Field 17A**: Date of Account Information.
- **Field 24**: Date of First Delinquency.
- **Field 38**: Account Status.

## The Strategy
Legitimate disputes point out **Data Integrity Errors**. 
"This account is reporting Status 93 (Collection) but the Payment History Profile shows 'C' (Current) for the same month. This is a logical impossibility under Metro 2 standards. Please correct or delete."

**Warning**: This is advanced. Using Metro 2 terminology incorrectly can get your dispute labelled "frivolous" (credit repair template).
        `,
        relatedArticles: ['KB-001'],
        quiz: [
            {
                id: 'q1',
                question: 'What is Metro 2?',
                options: ['A subway system', 'The standard data format for credit reporting', 'A credit score', 'A law firm'],
                correctAnswer: 1,
                explanation: 'Metro 2 is the industry-standard electronic data format used by furnishers to report credit history to bureaus.'
            },
            {
                id: 'q2',
                question: 'Why is Metro 2 important for disputes?',
                options: ['It allows you to find technical data inconsistencies', 'It makes the letter look professional', 'It scares the bureau', 'It is required by law'],
                correctAnswer: 0,
                explanation: 'Disputing based on Metro 2 compliance targets objective, technical errors in the raw data string rather than subjective arguments.'
            },
            {
                id: 'q3',
                question: 'What is the risk of using Metro 2 terms incorrectly?',
                options: ['None', 'You might be sued', 'Your dispute may be labeled "frivolous"', 'Your score goes down'],
                correctAnswer: 2,
                explanation: 'Bureaus have filters for "credit repair templates." Using advanced terms incorrectly can flag your letter as spam/frivolous.'
            }
        ]
    }
};
