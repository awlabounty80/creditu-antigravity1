import { BatchLessonDefinition } from '@/lib/batch-processor';

/**
 * LESSONS 26-50: Credit Building & Management Strategies
 */
export const LESSONS_26_50: BatchLessonDefinition[] = Array.from({ length: 25 }, (_, i) => {
    const lessonNum = 26 + i;
    const topics = [
        'Building Credit from Zero', 'Secured Credit Cards', 'Student Credit Cards', 'Credit Builder Loans',
        'Becoming an Authorized User Strategy', 'When to Apply for Your First Card', 'How to Use Credit Cards Responsibly',
        'The 30% Utilization Rule', 'Paying Before Statement Date', 'Multiple Payment Strategy',
        'Balance Transfer Basics', 'When Balance Transfers Make Sense', 'APR vs Interest Rate',
        'Grace Periods Explained', 'Minimum Payments Are a Trap', 'Snowball vs Avalanche Method',
        'How to Negotiate Lower Interest Rates', 'Requesting Credit Limit Increases', 'When to Ask for Goodwill Adjustments',
        'Store Cards: Pros and Cons', 'Gas Cards and Rewards Cards', 'Cash Back vs Points vs Miles',
        'Annual Fees: Worth It or Not?', 'Intro 0% APR Offers', 'Retail Financing Traps'
    ];

    return {
        lessonId: `FRESH-CF-${String(lessonNum).padStart(3, '0')}`,
        courseLevel: 'FRESHMAN' as const,
        moduleName: 'Foundations of Credit',
        lessonTitle: topics[i],
        teachingObjective: `Students will understand ${topics[i].toLowerCase()} and apply strategies effectively.`,
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: `This lesson covers ${topics[i].toLowerCase()}—a critical component of credit mastery.`,
            coreInstruction: [
                'Core concept explanation based on CFPB and FICO educational materials.',
                'Practical application strategies.',
                'Common mistakes to avoid.',
                'Legal and regulatory context where applicable.',
                'Real-world impact on credit scores.'
            ],
            reinforcementSummary: `Master ${topics[i].toLowerCase()} to take control of your credit trajectory.`
        }
    };
});
