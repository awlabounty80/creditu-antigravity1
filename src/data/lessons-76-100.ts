import { BatchLessonDefinition } from '@/lib/batch-processor';

/**
 * LESSONS 76-100: Advanced Credit Strategy & Preparation
 */
export const LESSONS_76_100: BatchLessonDefinition[] = Array.from({ length: 25 }, (_, i) => {
    const lessonNum = 76 + i;
    const topics = [
        'Credit and Employment', 'Credit and Insurance Rates', 'Credit and Housing Applications',
        'Rental History and Credit', 'Utility Accounts and Credit', 'Business Credit Basics',
        'Separating Personal and Business Credit', 'Building Business Credit', 'EIN vs SSN for Credit',
        'Credit for Major Purchases', 'Auto Loan Pre-Approval', 'Mortgage Pre-Qualification',
        'Down Payments and Credit Scores', 'PMI and Credit Requirements', 'FHA vs Conventional Loans',
        'VA Loans and Credit', 'Credit Score Simulators', 'What-If Scenarios for Score Changes',
        'Rapid Rescore for Mortgages', 'Credit Counseling Services', 'Debt Management Plans',
        'When to Seek Professional Help', 'Credit Myths Debunked', 'Long-Term Credit Planning',
        'Preparing for Advanced Credit Strategy'
    ];

    return {
        lessonId: `FRESH-CF-${String(lessonNum).padStart(3, '0')}`,
        courseLevel: 'FRESHMAN' as const,
        moduleName: 'Foundations of Credit',
        lessonTitle: topics[i],
        teachingObjective: `Students will understand ${topics[i].toLowerCase()} and strategic applications.`,
        professorPersonaId: 'DR_LEVERAGE',
        minutes: lessonNum === 100 ? 8 : 6,
        structurePoints: {
            introContext: lessonNum === 100
                ? 'You have completed the foundations. Now you are ready for advanced strategy.'
                : `${topics[i]} represents advanced credit knowledge for real-world application.`,
            coreInstruction: [
                'Advanced concept explanation.',
                'Strategic application in major financial decisions.',
                'Industry-specific credit requirements.',
                'Optimization techniques for maximum benefit.',
                lessonNum === 100 ? 'Transition to Sophomore-level credit mastery.' : 'Integration with overall financial planning.'
            ],
            reinforcementSummary: lessonNum === 100
                ? 'Foundations complete. You now understand credit as a system. Next: leverage it as a weapon.'
                : `${topics[i]} is a tool for financial leverage. Use it wisely.`
        }
    };
});
