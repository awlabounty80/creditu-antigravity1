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

// Lessons 1-10 (FULLY UPDATED SOVEREIGN CURRICULUM)
const LESSONS_1_10: BatchLessonDefinition[] = [
    // --- FOUNDATION (Level 1) ---
    {
        lessonId: 'less_1_1',
        courseLevel: 'FOUNDATION',
        moduleName: 'The Mindset Shift',
        lessonTitle: 'Welcome to the Wealth Game',
        teachingObjective: 'Define credit not as debt, but as a reputation currency that buys speed and access.',
        professorPersonaId: 'THE_DEAN',
        minutes: 5,
        structurePoints: {
            introContext: 'Most people think credit is just a trap. We view it as Leverage.',
            coreInstruction: [
                'Consumer Mindset vs. Architect Mindset: Consumers use credit for liabilities. Architects use it for assets.',
                'The Trust Scoreboard: Your score is not your worth; it is a measure of your discipline.',
                'Speed & Access: Cash is slow. Credit is fast. We use credit to access capital today for assets that pay us tomorrow.'
            ],
            reinforcementSummary: 'Money is a game. Credit is the cheat code. Learn the rules to win.'
        }
    },
    {
        lessonId: 'less_1_2',
        courseLevel: 'FOUNDATION',
        moduleName: 'The Mindset Shift',
        lessonTitle: 'The Matrix (How It Works)',
        teachingObjective: 'Explain the relationship between You, Lenders, Bureaus, and FICO.',
        professorPersonaId: 'THE_DEAN',
        minutes: 7,
        structurePoints: {
            introContext: 'The system has three players: The Teachers (Banks), The Gossips (Bureaus), and The Scorekeeper (FICO).',
            coreInstruction: [
                'Data Furnishers: Banks report your behavior.',
                'Data Collectors: Bureaus (Equifax, TransUnion, Experian) compile the data.',
                'The Scorekeeper: FICO calculates the risk score based on the data.',
                'The Cheat Code: If the data is wrong, you fight the Gossips, not the Scorekeeper.'
            ],
            reinforcementSummary: 'Know who the enemy is. It is usually a data error, not a math error.'
        }
    },
    {
        lessonId: 'less_1_3',
        courseLevel: 'FOUNDATION',
        moduleName: 'The System Explained',
        lessonTitle: 'The 5 Pillars of Power',
        teachingObjective: 'Memorize the FICO factors using the Hand Method.',
        professorPersonaId: 'THE_DEAN',
        minutes: 10,
        structurePoints: {
            introContext: 'Your score is calculated based on 5 known factors. Visualize a hand gripping a bag of money.',
            coreInstruction: [
                'Thumb (35%): Payment History. The grip strength.',
                'Index Finger (30%): Utilization. The direction you point.',
                'Middle Finger (15%): Age of History. The longest finger.',
                'Ring Finger (10%): Credit Mix. The commitment.',
                'Pinky (10%): New Credit. The weak link.'
            ],
            reinforcementSummary: '35% + 30% = 65%. Focus on Payment History and Utilization to win.'
        }
    },
    {
        lessonId: 'less_1_4',
        courseLevel: 'FOUNDATION',
        moduleName: 'The System Explained',
        lessonTitle: 'Debt vs. Leverage',
        teachingObjective: 'Distinguish between Toxic Liabilities and Wealth-Building Assets.',
        professorPersonaId: 'THE_DEAN',
        minutes: 8,
        structurePoints: {
            introContext: 'Not all debt is created equal. Some makes you poor, some makes you rich.',
            coreInstruction: [
                'Toxic Debt: Liabilities that lose value (Shoes, Cars, Dinners).',
                'Power Leverage: Assets that gain value (Real Estate, Business).',
                'Rule: Never pay interest on shoes. Only pay interest on assets.'
            ],
            reinforcementSummary: 'If it doesn\'t put money in your pocket, pay cash or don\'t buy it.'
        }
    },
    // --- FRESHMAN (Level 2) ---
    {
        lessonId: 'less_2_1',
        courseLevel: 'FRESHMAN',
        moduleName: 'Decoding The Report',
        lessonTitle: 'Reading the Scoreboard',
        teachingObjective: 'Decode the confusing layout of a credit report to find errors.',
        professorPersonaId: 'PROF_LEVERAGE',
        minutes: 15,
        structurePoints: {
            introContext: 'Credit reports are boring on purpose. We verify everything.',
            coreInstruction: [
                'Personal Info: Check for old addresses and wrong names.',
                'Trade Lines: The meat. Status and Balance.',
                'Inquiries: Who looked?',
                'Public Records: The red flags.'
            ],
            reinforcementSummary: 'A single wrong address can link you to someone else\'s debt. Scrub it clean.'
        }
    },
    {
        lessonId: 'less_2_2',
        courseLevel: 'FRESHMAN',
        moduleName: 'The 5 Factors Deep Dive',
        lessonTitle: 'The 35% Rule (Perfect Payment)',
        teachingObjective: 'Strategies to ensure you never miss a payment again.',
        professorPersonaId: 'PROF_LEVERAGE',
        minutes: 10,
        structurePoints: {
            introContext: 'Payment History is 35%. You cannot afford a zero here.',
            coreInstruction: [
                'The Trap: Relying on memory.',
                'The Shield: Autopay Minimum.',
                'Strategy: Set every card to autopay the minimum due. Pay the rest manually.'
            ],
            reinforcementSummary: 'Automation is the ultimate discipline.'
        }
    },
    {
        lessonId: 'less_2_3',
        courseLevel: 'FRESHMAN',
        moduleName: 'The 5 Factors Deep Dive',
        lessonTitle: 'Utilization Magic (30/10/0)',
        teachingObjective: 'How to hack your utilization date to maximize your score.',
        professorPersonaId: 'PROF_LEVERAGE',
        minutes: 12,
        structurePoints: {
            introContext: 'Utilization is 30%. Timing is everything.',
            coreInstruction: [
                'Two Dates: Due Date vs. Statement Date.',
                'The Hack: Pay balance to 1-3% BEFORE the Statement Date.',
                'Result: The bank reports a low balance, your score skyromets.'
            ],
            reinforcementSummary: 'Don\'t let them report your high balance. Sniper pay it early.'
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
