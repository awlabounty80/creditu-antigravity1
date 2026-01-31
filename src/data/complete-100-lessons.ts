import { BatchLessonDefinition } from '@/lib/batch-processor';
import { LESSONS_11_25 } from './lessons-11-25';
import { LESSONS_26_50 } from './lessons-26-50';
import { LESSONS_51_75 } from './lessons-51-75';
import { LESSONS_76_100 } from './lessons-76-100';

/**
 * COMPLETE 100-LESSON BATCH
 * Freshman: Foundations of Credit
 * Professor: DR_LEVERAGE
 * Audience: Adults rebuilding credit
 * 
 * Source-verified content from:
 * - FICO/myFICO educational materials
 * - CFPB consumer education
 * - Federal law (FCRA, FDCPA)
 * - Credit bureau educational content
 */

// Lessons 1-10 (fully detailed)
const LESSONS_1_10: BatchLessonDefinition[] = [
    {
        lessonId: 'FRESH-CF-001',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'What Credit Really Is',
        teachingObjective: 'Students will understand credit as a financial tool and its role in the economy.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 5,
        structurePoints: {
            introContext: 'Credit is not debt—it is access. Understanding this distinction changes everything.',
            coreInstruction: [
                'Credit is the ability to obtain goods or services before payment, based on trust that payment will be made in the future.',
                'It is a contractual agreement between lender and borrower.',
                'Credit enables economic growth by allowing consumers to make purchases they could not afford immediately.',
                'Your creditworthiness is measured and recorded by credit bureaus.',
                'Responsible credit use builds financial opportunity; misuse creates long-term barriers.'
            ],
            reinforcementSummary: 'Credit is a tool. Like any tool, it can build or destroy depending on how you use it.'
        }
    },
    {
        lessonId: 'FRESH-CF-002',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Why Credit Scores Exist',
        teachingObjective: 'Students will understand the purpose and function of credit scoring systems.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Before credit scores, lending decisions were subjective and often discriminatory. Scores were created to standardize risk assessment.',
            coreInstruction: [
                'Credit scores were developed to predict the likelihood of loan repayment.',
                'FICO introduced the first widely-used credit score in 1989.',
                'Scores allow lenders to make faster, more consistent decisions.',
                'They reduce (but do not eliminate) bias in lending.',
                'Scores range from 300-850, with higher scores indicating lower risk.',
                'Multiple scoring models exist (FICO, VantageScore), but FICO is most widely used.'
            ],
            reinforcementSummary: 'Your score is a risk prediction tool. It does not measure your worth—it measures your payment patterns.'
        }
    },
    {
        lessonId: 'FRESH-CF-003',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'The Five Factors of a Credit Score',
        teachingObjective: 'Students will identify and explain the five components of FICO credit scoring.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 8,
        structurePoints: {
            introContext: 'Your credit score is not random. It is calculated using five weighted factors. Knowing them gives you control.',
            coreInstruction: [
                'Payment History (35%): Whether you pay bills on time.',
                'Amounts Owed (30%): How much credit you are using relative to your limits.',
                'Length of Credit History (15%): How long your accounts have been open.',
                'New Credit (10%): Recent credit inquiries and new accounts.',
                'Credit Mix (10%): Variety of credit types (cards, loans, mortgages).',
                'Payment history is the single most important factor.',
                'These percentages are approximate and may vary slightly by individual.'
            ],
            reinforcementSummary: 'Master these five factors, and you master your score. Ignore them, and your score masters you.'
        }
    },
    {
        lessonId: 'FRESH-CF-004',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Payment History Explained',
        teachingObjective: 'Students will understand how payment history is calculated and its impact on credit scores.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 7,
        structurePoints: {
            introContext: 'Payment history is 35% of your score. One late payment can drop your score by 100 points.',
            coreInstruction: [
                'Payment history tracks whether you pay bills by the due date.',
                'Payments more than 30 days late are reported to credit bureaus.',
                'The severity of late payments increases at 60, 90, and 120+ days.',
                'Recent late payments hurt more than old ones.',
                'Charge-offs, collections, and bankruptcies severely damage this category.',
                'Positive payment history rebuilds over time but requires consistency.',
                'Even one missed payment can remain on your report for 7 years.'
            ],
            reinforcementSummary: 'Your payment history is your financial reputation. Protect it like your life depends on it—because financially, it does.'
        }
    },
    {
        lessonId: 'FRESH-CF-005',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Credit Utilization Explained',
        teachingObjective: 'Students will calculate credit utilization and understand its impact on scores.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 7,
        structurePoints: {
            introContext: 'Credit utilization is the second most important factor in your score. Most people do not understand how it works.',
            coreInstruction: [
                'Utilization is the percentage of available credit you are using.',
                'Formula: (Total Balances / Total Credit Limits) × 100.',
                'Experts recommend keeping utilization below 30%.',
                'Utilization below 10% is ideal for score optimization.',
                'Both overall utilization and per-card utilization matter.',
                'Utilization is calculated monthly based on statement balances.',
                'Paying down balances before the statement date can improve utilization immediately.'
            ],
            reinforcementSummary: 'Low utilization signals financial control. High utilization signals risk. Control your balances, control your score.'
        }
    },
    {
        lessonId: 'FRESH-CF-006',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Length of Credit History',
        teachingObjective: 'Students will understand how account age affects credit scores.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Time is a factor you cannot rush. But you can protect it.',
            coreInstruction: [
                'Length of credit history accounts for 15% of your score.',
                'FICO considers: age of oldest account, age of newest account, and average age of all accounts.',
                'Older accounts demonstrate long-term creditworthiness.',
                'Closing old accounts shortens your credit history and can lower your score.',
                'Authorized user accounts can help build history if the primary account is old.',
                'There is no "minimum" history required, but longer is better.'
            ],
            reinforcementSummary: 'Your oldest account is an asset. Keep it open, keep it active, and let time work for you.'
        }
    },
    {
        lessonId: 'FRESH-CF-007',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Credit Mix',
        teachingObjective: 'Students will understand the role of credit diversity in scoring.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 5,
        structurePoints: {
            introContext: 'Lenders want to see that you can manage different types of credit responsibly.',
            coreInstruction: [
                'Credit mix accounts for 10% of your score.',
                'Types of credit include: revolving (credit cards), installment (auto loans, mortgages), and open (charge cards).',
                'Having a mix of credit types can improve your score.',
                'However, you should never take on debt solely to improve credit mix.',
                'This factor matters most for people with thin credit files.',
                'A strong payment history outweighs a weak credit mix.'
            ],
            reinforcementSummary: 'Diversity matters, but not at the cost of unnecessary debt. Build mix naturally over time.'
        }
    },
    {
        lessonId: 'FRESH-CF-008',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Hard vs Soft Inquiries',
        teachingObjective: 'Students will differentiate between inquiry types and understand their impact.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Not all credit checks are equal. Knowing the difference protects your score.',
            coreInstruction: [
                'Hard inquiries occur when you apply for credit (loans, credit cards).',
                'Hard inquiries can lower your score by 5-10 points temporarily.',
                'Multiple hard inquiries for the same type of loan (e.g., mortgage) within 14-45 days count as one inquiry.',
                'Soft inquiries occur when you check your own credit or when companies pre-screen you for offers.',
                'Soft inquiries do not affect your score.',
                'Hard inquiries remain on your report for 2 years but only impact your score for 1 year.'
            ],
            reinforcementSummary: 'Check your own credit freely. Apply for new credit strategically.'
        }
    },
    {
        lessonId: 'FRESH-CF-009',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Authorized Users',
        teachingObjective: 'Students will understand how authorized user status can build or harm credit.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Becoming an authorized user can build credit fast—or destroy it just as quickly.',
            coreInstruction: [
                'An authorized user is added to someone else\'s credit card account.',
                'The account history (positive or negative) may appear on the authorized user\'s credit report.',
                'This can help build credit for people with no history.',
                'However, if the primary account holder misses payments, it can damage the authorized user\'s credit.',
                'Not all issuers report authorized user accounts to credit bureaus.',
                'You can be removed as an authorized user at any time.',
                'Choose primary account holders with excellent payment history and low utilization.'
            ],
            reinforcementSummary: 'Authorized user status is borrowed credit history. Choose your lender wisely.'
        }
    },
    {
        lessonId: 'FRESH-CF-010',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Why Closing Accounts Hurts',
        teachingObjective: 'Students will understand the negative effects of closing credit accounts.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Closing a credit card feels responsible. But it can damage your score in multiple ways.',
            coreInstruction: [
                'Closing an account reduces your total available credit, increasing utilization.',
                'It can shorten your average account age if the account is old.',
                'Closed accounts in good standing remain on your report for 10 years.',
                'Closed accounts with negative history remain for 7 years.',
                'If you must close an account, close newer ones and keep older ones open.',
                'Keeping accounts open with small recurring charges (like subscriptions) maintains activity.'
            ],
            reinforcementSummary: 'Keep old accounts open. Keep them active. Let time and history work for you.'
        }
    }
];

// Combine all lessons
export const COMPLETE_100_LESSONS: BatchLessonDefinition[] = [
    ...LESSONS_1_10,
    ...LESSONS_11_25,
    ...LESSONS_26_50,
    ...LESSONS_51_75,
    ...LESSONS_76_100
];

// Export count for validation
export const LESSON_COUNT = COMPLETE_100_LESSONS.length;
