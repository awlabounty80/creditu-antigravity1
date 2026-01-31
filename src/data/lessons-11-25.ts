import { BatchLessonDefinition } from '@/lib/batch-processor';

/**
 * LESSONS 11-25: Credit Reports & Bureaus
 */
export const LESSONS_11_25: BatchLessonDefinition[] = [
    {
        lessonId: 'FRESH-CF-011',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'The Three Credit Bureaus',
        teachingObjective: 'Students will identify the three major credit bureaus and their roles.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Three private companies control your financial access. Know who they are.',
            coreInstruction: ['Experian, Equifax, and TransUnion are the three major bureaus.', 'They collect and sell your credit data to lenders.', 'Each bureau may have different information about you.', 'They are for-profit corporations, not government agencies.', 'You have legal rights under FCRA to dispute errors with each bureau.'],
            reinforcementSummary: 'These three companies do not work for you. But federal law gives you power over them.'
        }
    },
    {
        lessonId: 'FRESH-CF-012',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'How to Read a Credit Report',
        teachingObjective: 'Students will identify the four main sections of a credit report.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 7,
        structurePoints: {
            introContext: 'Your credit report is a legal document. Reading it correctly is a survival skill.',
            coreInstruction: ['Personal Information: Name, addresses, SSN, employment.', 'Credit Accounts: All loans and credit cards with payment history.', 'Credit Inquiries: Record of who checked your credit.', 'Public Records: Bankruptcies, liens, judgments.', 'Errors in any section can cost you thousands in higher interest rates.'],
            reinforcementSummary: 'This document controls access to housing, loans, and jobs. Read every line.'
        }
    },
    {
        lessonId: 'FRESH-CF-013',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Your Rights Under FCRA',
        teachingObjective: 'Students will understand their rights under the Fair Credit Reporting Act.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 7,
        structurePoints: {
            introContext: 'The FCRA is federal law. It gives you enforceable rights over your credit data.',
            coreInstruction: ['You can access your credit report for free once per year from each bureau.', 'You can dispute inaccurate information.', 'Bureaus must investigate disputes within 30 days.', 'Unverified information must be removed.', 'Negative items must be removed after 7 years (10 for bankruptcy).', 'You can sue bureaus for FCRA violations.'],
            reinforcementSummary: 'These are not suggestions. They are your legal rights. Use them.'
        }
    },
    {
        lessonId: 'FRESH-CF-014',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'How to Get Your Free Credit Reports',
        teachingObjective: 'Students will know how to obtain free annual credit reports legally.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 5,
        structurePoints: {
            introContext: 'You are entitled to free reports. But you must know where to get them.',
            coreInstruction: ['AnnualCreditReport.com is the only federally authorized free source.', 'You get one free report per bureau per year.', 'Do NOT use sites that require credit card information for "free" reports.', 'You can request all three at once or space them throughout the year.', 'Checking your own report is a soft inquiry and does not hurt your score.'],
            reinforcementSummary: 'Free means free. No credit card. No trial. AnnualCreditReport.com only.'
        }
    },
    {
        lessonId: 'FRESH-CF-015',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Common Credit Report Errors',
        teachingObjective: 'Students will identify the most common types of credit report errors.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Studies show 1 in 5 credit reports contain errors. Yours might be one of them.',
            coreInstruction: ['Accounts that do not belong to you.', 'Incorrect payment history or late payments you made on time.', 'Accounts listed as open that you closed.', 'Duplicate accounts.', 'Incorrect credit limits.', 'Outdated negative information (older than 7 years).'],
            reinforcementSummary: 'Errors are common. Finding them is your responsibility. Fixing them is your right.'
        }
    },
    {
        lessonId: 'FRESH-CF-016',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Identity Theft and Credit Reports',
        teachingObjective: 'Students will understand how identity theft appears on credit reports.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Identity theft can destroy your credit before you even know it happened.',
            coreInstruction: ['Fraudulent accounts opened in your name will appear on your report.', 'You are not responsible for fraudulent debt if you report it properly.', 'File a police report and FTC identity theft report immediately.', 'Place a fraud alert or credit freeze on your reports.', 'Dispute fraudulent accounts with each bureau.', 'Monitor your credit regularly to catch fraud early.'],
            reinforcementSummary: 'Identity theft is not your fault. But recovery is your responsibility. Act fast.'
        }
    },
    {
        lessonId: 'FRESH-CF-017',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Credit Freezes vs Fraud Alerts',
        teachingObjective: 'Students will differentiate between credit freezes and fraud alerts.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Both tools protect your credit. But they work differently.',
            coreInstruction: ['A credit freeze blocks all access to your credit report.', 'Lenders cannot pull your credit while it is frozen.', 'You must unfreeze (temporarily or permanently) to apply for credit.', 'Freezes are free and do not affect your credit score.', 'A fraud alert warns lenders to verify your identity before extending credit.', 'Fraud alerts last 1 year (or 7 years for identity theft victims).'],
            reinforcementSummary: 'Freeze for maximum protection. Alert for convenience. Choose based on your risk.'
        }
    },
    {
        lessonId: 'FRESH-CF-018',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Disputing Credit Report Errors',
        teachingObjective: 'Students will understand the dispute process under FCRA.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 7,
        structurePoints: {
            introContext: 'Disputing errors is your legal right. The process is specific and enforceable.',
            coreInstruction: ['Identify the error and gather supporting documents.', 'File a dispute with the credit bureau (online, mail, or phone).', 'The bureau must investigate within 30 days.', 'The creditor must verify the information or it must be removed.', 'If the dispute is successful, the error is deleted.', 'If unsuccessful, you can add a statement to your report or escalate.'],
            reinforcementSummary: 'Disputes are not requests. They are legal demands. Follow the process precisely.'
        }
    },
    {
        lessonId: 'FRESH-CF-019',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'What Stays on Your Credit Report',
        teachingObjective: 'Students will know how long different items remain on credit reports.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Time heals credit wounds. But you must know the timeline.',
            coreInstruction: ['Late payments: 7 years from the date of delinquency.', 'Collections: 7 years from the original delinquency date.', 'Chapter 7 bankruptcy: 10 years.', 'Chapter 13 bankruptcy: 7 years.', 'Foreclosures: 7 years.', 'Hard inquiries: 2 years (but only impact score for 1 year).', 'Positive accounts: 10 years after closure.'],
            reinforcementSummary: 'Negative items expire. Positive items endure. Time is on your side if you wait it out.'
        }
    },
    {
        lessonId: 'FRESH-CF-020',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Credit Monitoring Services',
        teachingObjective: 'Students will evaluate the value and limitations of credit monitoring.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Credit monitoring is marketed heavily. But is it necessary?',
            coreInstruction: ['Monitoring services alert you to changes on your credit report.', 'Many are free (Credit Karma, bank-provided monitoring).', 'Paid services offer additional features like identity theft insurance.', 'Monitoring does not prevent fraud—it only detects it.', 'You can monitor manually by checking your free annual reports.', 'Monitoring is useful but not essential if you check reports regularly.'],
            reinforcementSummary: 'Monitoring is a tool, not a shield. Use free options unless you need premium features.'
        }
    },
    {
        lessonId: 'FRESH-CF-021',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Understanding FICO vs VantageScore',
        teachingObjective: 'Students will differentiate between FICO and VantageScore models.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Not all credit scores are created equal. Know which one lenders use.',
            coreInstruction: ['FICO is used by 90% of lenders.', 'VantageScore was created by the three bureaus as an alternative.', 'Both use 300-850 ranges but calculate scores differently.', 'FICO weighs payment history more heavily.', 'VantageScore updates faster with new data.', 'Free credit monitoring sites often show VantageScore, not FICO.'],
            reinforcementSummary: 'FICO is the score that matters for most lending decisions. Know the difference.'
        }
    },
    {
        lessonId: 'FRESH-CF-022',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Credit Score Ranges Explained',
        teachingObjective: 'Students will understand credit score tiers and their implications.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Your score determines your interest rate. Know where you stand.',
            coreInstruction: ['300-579: Poor (high risk, limited credit access).', '580-669: Fair (subprime rates, higher deposits).', '670-739: Good (average rates, standard approval).', '740-799: Very Good (below-average rates, strong approval).', '800-850: Exceptional (best rates, premium offers).', 'Most people fall in the 600-750 range.'],
            reinforcementSummary: 'Your score tier determines your cost of borrowing. Move up one tier, save thousands.'
        }
    },
    {
        lessonId: 'FRESH-CF-023',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'Why You Have Multiple Credit Scores',
        teachingObjective: 'Students will understand why credit scores vary across sources.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'You do not have one credit score. You have dozens. Here is why.',
            coreInstruction: ['Each bureau may have different data about you.', 'Different scoring models (FICO 8, FICO 9, VantageScore) calculate differently.', 'Industry-specific scores exist (auto, mortgage, credit card).', 'Scores update at different times based on when creditors report.', 'The score you see may not be the score lenders use.', 'Focus on trends, not individual score variations.'],
            reinforcementSummary: 'Your score is not a single number. It is a range. Understand the system, not just the number.'
        }
    },
    {
        lessonId: 'FRESH-CF-024',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'How Often Credit Scores Update',
        teachingObjective: 'Students will understand credit score update cycles.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 5,
        structurePoints: {
            introContext: 'Your score does not update in real time. Know the cycle.',
            coreInstruction: ['Creditors report to bureaus monthly, usually on your statement date.', 'Bureaus update your report within days of receiving data.', 'Your score recalculates when your report changes.', 'Different creditors report on different schedules.', 'Paying off a balance may not reflect immediately.', 'Check your score monthly to track trends.'],
            reinforcementSummary: 'Scores lag behind your actions. Be patient. Consistency wins over time.'
        }
    },
    {
        lessonId: 'FRESH-CF-025',
        courseLevel: 'FRESHMAN',
        moduleName: 'Foundations of Credit',
        lessonTitle: 'The Impact of Public Records',
        teachingObjective: 'Students will understand how public records affect credit.',
        professorPersonaId: 'DR_LEVERAGE',
        minutes: 6,
        structurePoints: {
            introContext: 'Public records are the most damaging items on your credit report.',
            coreInstruction: ['Bankruptcies, tax liens, and civil judgments are public records.', 'They can drop your score by 100-200 points.', 'Bankruptcies remain for 7-10 years.', 'Tax liens (if unpaid) can remain indefinitely.', 'Civil judgments remain for 7 years.', 'Paying off a public record does not remove it, but it shows as "satisfied."'],
            reinforcementSummary: 'Public records are financial scars. Avoid them at all costs. If you have them, rebuild around them.'
        }
    }
];
