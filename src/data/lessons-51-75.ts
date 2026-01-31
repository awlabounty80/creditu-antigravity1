import { BatchLessonDefinition } from '@/lib/batch-processor';

/**
 * LESSONS 51-75: Debt Management & Recovery
 */
export const LESSONS_51_75: BatchLessonDefinition[] = Array.from({ length: 25 }, (_, i) => {
    const lessonNum = 51 + i;
    const topics = [
        'Understanding Collections', 'Your Rights Under FDCPA', 'Debt Validation Letters',
        'Pay for Delete Negotiations', 'Statute of Limitations on Debt', 'Zombie Debt Explained',
        'Dealing with Debt Collectors', 'When to Hire a Credit Repair Company', 'DIY Credit Repair',
        'Goodwill Letters That Work', 'Charge-Offs Explained', 'Settling Debt for Less',
        'Tax Implications of Settled Debt', 'Bankruptcy Basics', 'Chapter 7 vs Chapter 13',
        'Rebuilding After Bankruptcy', 'Foreclosure and Your Credit', 'Short Sales vs Foreclosure',
        'Student Loan Default Recovery', 'Medical Debt and Credit Reports', 'Divorce and Credit',
        'Death and Credit Accounts', 'Co-Signing Risks', 'Joint Accounts vs Authorized Users',
        'Removing Yourself from Joint Debt'
    ];

    return {
        lessonId: `FRESH-CF-${String(lessonNum).padStart(3, '0')}`,
        courseLevel: 'FRESHMAN' as const,
        moduleName: 'Foundations of Credit',
        lessonTitle: topics[i],
        teachingObjective: `Students will understand ${topics[i].toLowerCase()} and legal protections.`,
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 7,
        structurePoints: {
            introContext: `${topics[i]} is a critical recovery topic governed by federal law.`,
            coreInstruction: [
                'Legal framework (FDCPA, FCRA, bankruptcy code).',
                'Consumer rights and protections.',
                'Step-by-step process for resolution.',
                'Common creditor tactics and how to counter them.',
                'Long-term credit impact and recovery timeline.'
            ],
            reinforcementSummary: `${topics[i]} requires knowledge of your rights. Use the law as your shield.`
        }
    };
});
