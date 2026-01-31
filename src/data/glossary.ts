/**
 * CREDIT U™ GLOSSARY
 * Format: GLOSSARY_ENTRY
 * Source-verified definitions with legal and regulatory context
 */

export interface GlossaryEntry {
    term: string;
    definition: string;
    context: string;
    relatedTerms: string[];
    sources: string[];
    legalReference?: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
    'credit-report': {
        term: 'Credit Report',
        definition: 'A detailed record of your credit history compiled by credit bureaus, including personal information, credit accounts, payment history, credit inquiries, and public records.',
        context: 'Credit reports are used by lenders, employers, landlords, and insurers to assess your creditworthiness and financial responsibility. Under FCRA, you have the right to access your reports for free annually.',
        relatedTerms: ['credit-score', 'credit-bureau', 'fcra'],
        sources: ['15 U.S.C. § 1681a(d)', 'CFPB.gov', 'AnnualCreditReport.com'],
        legalReference: '15 U.S.C. § 1681a(d) - Definition of consumer report'
    },

    'credit-score': {
        term: 'Credit Score',
        definition: 'A three-digit number (typically 300-850) that represents your creditworthiness based on information in your credit report. FICO and VantageScore are the most common scoring models.',
        context: 'Credit scores are calculated using algorithms that weigh factors like payment history (35%), amounts owed (30%), length of credit history (15%), new credit (10%), and credit mix (10%). Higher scores indicate lower risk to lenders.',
        relatedTerms: ['fico-score', 'vantagescore', 'credit-report'],
        sources: ['myFICO.com', 'Experian.com', 'CFPB - Credit Scores'],
        legalReference: undefined
    },

    'fcra': {
        term: 'Fair Credit Reporting Act (FCRA)',
        definition: 'Federal law enacted in 1970 that regulates the collection, dissemination, and use of consumer credit information. It gives consumers rights to access, dispute, and control their credit data.',
        context: 'FCRA requires credit bureaus to maintain accurate information, investigate disputes within 30 days, remove unverified data, and limit who can access your credit report. Violations can result in statutory damages of $100-$1,000 per violation.',
        relatedTerms: ['credit-bureau', 'dispute', 'adverse-action'],
        sources: ['15 U.S.C. § 1681 et seq.', 'FTC.gov', 'CFPB.gov'],
        legalReference: '15 U.S.C. § 1681 et seq.'
    },

    'fdcpa': {
        term: 'Fair Debt Collection Practices Act (FDCPA)',
        definition: 'Federal law that prohibits abusive, deceptive, and unfair debt collection practices by third-party debt collectors.',
        context: 'FDCPA limits when collectors can contact you, prohibits harassment and false statements, and requires debt validation. It applies to third-party collectors, not original creditors. Violations can result in damages up to $1,000 plus attorney fees.',
        relatedTerms: ['debt-collector', 'debt-validation', 'cease-and-desist'],
        sources: ['15 U.S.C. § 1692 et seq.', 'FTC.gov', 'CFPB.gov'],
        legalReference: '15 U.S.C. § 1692 et seq.'
    },

    'credit-utilization': {
        term: 'Credit Utilization',
        definition: 'The ratio of your current credit card balances to your total credit limits, expressed as a percentage. Formula: (Total Balances / Total Limits) × 100.',
        context: 'Credit utilization is the second most important factor in FICO scores (approximately 30%). Experts recommend keeping utilization below 30%, with below 10% being optimal. Both overall and per-card utilization are considered.',
        relatedTerms: ['credit-score', 'credit-limit', 'revolving-credit'],
        sources: ['myFICO.com', 'Experian.com', 'CFPB.gov'],
        legalReference: undefined
    },

    'hard-inquiry': {
        term: 'Hard Inquiry',
        definition: 'A credit check that occurs when you apply for credit (loan, credit card, mortgage). Hard inquiries can temporarily lower your credit score by 5-10 points.',
        context: 'Hard inquiries remain on your credit report for 2 years but typically only affect your score for 12 months. Multiple inquiries for the same type of loan within 14-45 days are treated as a single inquiry to allow rate shopping.',
        relatedTerms: ['soft-inquiry', 'credit-score', 'rate-shopping'],
        sources: ['myFICO.com', 'CFPB - Credit Inquiries'],
        legalReference: undefined
    },

    'soft-inquiry': {
        term: 'Soft Inquiry',
        definition: 'A credit check that does not affect your credit score. Occurs when you check your own credit, when employers screen you, or when companies pre-screen you for offers.',
        context: 'Soft inquiries are visible only to you on your credit report and do not impact lending decisions. You can check your credit as often as you want without penalty.',
        relatedTerms: ['hard-inquiry', 'credit-monitoring'],
        sources: ['myFICO.com', 'Experian.com'],
        legalReference: undefined
    },

    'charge-off': {
        term: 'Charge-Off',
        definition: 'A debt that a creditor has given up trying to collect and written off as a loss for accounting purposes, typically after 180 days of non-payment.',
        context: 'A charge-off severely damages your credit score and remains on your report for 7 years. You still legally owe the debt even after charge-off. The account may be sold to a collection agency.',
        relatedTerms: ['collection', 'debt-validation', 'statute-of-limitations'],
        sources: ['CFPB - Charge-offs', 'FTC.gov'],
        legalReference: undefined
    },

    'debt-validation': {
        term: 'Debt Validation',
        definition: 'Your right under FDCPA to request that a debt collector provide proof that you owe a debt and that they have the legal right to collect it.',
        context: 'You must request validation in writing within 30 days of first contact. The collector must cease collection efforts until they provide validation. If they cannot validate, the debt must be removed from your credit report.',
        relatedTerms: ['fdcpa', 'debt-collector', 'collection'],
        sources: ['15 U.S.C. § 1692g', 'CFPB.gov', 'FTC.gov'],
        legalReference: '15 U.S.C. § 1692g - Validation of debts'
    },

    'statute-of-limitations': {
        term: 'Statute of Limitations (Debt)',
        definition: 'The time period during which a creditor can legally sue you to collect a debt. Varies by state and debt type (typically 3-6 years).',
        context: 'After the statute expires, the debt becomes "time-barred" and cannot be enforced in court. However, it may still appear on your credit report for 7 years. Making a payment can restart the clock in some states.',
        relatedTerms: ['zombie-debt', 'charge-off', 'collection'],
        sources: ['FTC.gov - Time-Barred Debts', 'CFPB.gov'],
        legalReference: 'Varies by state law'
    }
};

export function searchGlossary(query: string): GlossaryEntry[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(GLOSSARY).filter(entry =>
        entry.term.toLowerCase().includes(lowerQuery) ||
        entry.definition.toLowerCase().includes(lowerQuery)
    );
}
