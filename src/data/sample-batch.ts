import { BatchLessonDefinition } from '@/lib/batch-processor';

/**
 * SAMPLE BATCH: FRESHMAN CREDIT FOUNDATIONS
 * 
 * This demonstrates the exact structure required for batch generation.
 * Each lesson follows institutional standards.
 */

export const FRESHMAN_CREDIT_BATCH: BatchLessonDefinition[] = [
    {
        lessonId: 'FRESH-CF-001',
        courseLevel: 'FRESHMAN',
        moduleName: 'Credit Foundations',
        lessonTitle: 'What is Credit?',
        teachingObjective: 'Students will understand the definition of credit and its role in the financial system.',
        professorPersonaId: 'AMARA_DEAN',
        minutes: 5,
        structurePoints: {
            introContext: 'Credit is the foundation of modern financial systems. Understanding it is your first step toward financial sovereignty.',
            coreInstruction: [
                'Credit is the ability to borrow money or access goods/services with the understanding you will pay later.',
                'It is based on trust between lender and borrower.',
                'Your credit history is a record of how you have managed borrowed money.',
                'Credit enables major purchases: homes, cars, education.',
                'Mismanaged credit can limit opportunities for decades.'
            ],
            reinforcementSummary: 'Credit is trust made measurable. Your next lesson will explore how that trust is scored.'
        }
    },
    {
        lessonId: 'FRESH-CF-002',
        courseLevel: 'FRESHMAN',
        moduleName: 'Credit Foundations',
        lessonTitle: 'The Three Credit Bureaus',
        teachingObjective: 'Students will identify the three major credit bureaus and understand their role.',
        professorPersonaId: 'AMARA_DEAN',
        minutes: 6,
        structurePoints: {
            introContext: 'Your credit data is collected and stored by three private companies. You need to know who they are.',
            coreInstruction: [
                'The three bureaus are Experian, Equifax, and TransUnion.',
                'They are private, for-profit corporations—not government agencies.',
                'Lenders report your payment history to these bureaus.',
                'Each bureau may have slightly different data about you.',
                'You have the legal right to dispute inaccurate information with each bureau.',
                'Under federal law (FCRA), you can access your reports for free annually.'
            ],
            reinforcementSummary: 'These three companies hold the data that shapes your financial access. Knowing them is power.'
        }
    },
    {
        lessonId: 'FRESH-CF-003',
        courseLevel: 'FRESHMAN',
        moduleName: 'Credit Foundations',
        lessonTitle: 'Understanding Credit Scores',
        teachingObjective: 'Students will learn what a credit score is and the factors that influence it.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 8,
        structurePoints: {
            introContext: 'A credit score is a three-digit number that summarizes your creditworthiness. It is not arbitrary—it follows a formula.',
            coreInstruction: [
                'FICO scores range from 300 to 850.',
                'Five factors determine your score: Payment History (35%), Amounts Owed (30%), Length of Credit History (15%), New Credit (10%), Credit Mix (10%).',
                'Payment history is the most important factor.',
                'High balances relative to your credit limit hurt your score.',
                'Closing old accounts can shorten your credit history and lower your score.',
                'Scores are calculated using algorithms, not human judgment.'
            ],
            reinforcementSummary: 'Your score is a reflection of behavior patterns. Change the behavior, change the score.'
        }
    },
    {
        lessonId: 'FRESH-CF-004',
        courseLevel: 'FRESHMAN',
        moduleName: 'Credit Foundations',
        lessonTitle: 'Reading Your Credit Report',
        teachingObjective: 'Students will be able to identify the key sections of a credit report.',
        professorPersonaId: 'AMARA_DEAN',
        minutes: 7,
        structurePoints: {
            introContext: 'Your credit report is a legal document. You must know how to read it to protect yourself.',
            coreInstruction: [
                'Reports contain four main sections: Personal Information, Credit Accounts, Credit Inquiries, Public Records.',
                'Personal Information includes your name, addresses, SSN, and employment history.',
                'Credit Accounts show every loan or credit card, including payment history and balances.',
                'Inquiries are records of who has checked your credit.',
                'Public Records include bankruptcies, tax liens, and civil judgments.',
                'Errors in any section can damage your score and must be disputed.'
            ],
            reinforcementSummary: 'This document determines access to housing, loans, and jobs. Read it like your future depends on it—because it does.'
        }
    },
    {
        lessonId: 'FRESH-CF-005',
        courseLevel: 'FRESHMAN',
        moduleName: 'Credit Foundations',
        lessonTitle: 'Your Rights Under the FCRA',
        teachingObjective: 'Students will understand their legal rights under the Fair Credit Reporting Act.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'The Fair Credit Reporting Act is federal law. It gives you power over your credit data.',
            coreInstruction: [
                'You have the right to access your credit report for free once per year from each bureau.',
                'You have the right to dispute inaccurate or incomplete information.',
                'Bureaus must investigate disputes within 30 days.',
                'If information cannot be verified, it must be removed.',
                'You can add a statement to your report explaining negative items.',
                'Negative information generally must be removed after 7 years (10 for bankruptcy).'
            ],
            reinforcementSummary: 'These rights are not suggestions. They are law. Use them.'
        }
    }
];
