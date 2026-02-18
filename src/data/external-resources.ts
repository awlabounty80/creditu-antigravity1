export interface ExternalResource {
    id: string;
    category: string;
    title: string;
    url: string;
    description: string;
    tags: string[]; // e.g., 'Official', 'Tool', 'PDF'
}

export const EXTERNAL_RESOURCES: ExternalResource[] = [
    // Credit Reports & Scores
    {
        id: 'RES-001',
        category: 'Credit Reports & Scores',
        title: 'AnnualCreditReport.com',
        url: 'https://www.annualcreditreport.com/index.action',
        description: 'Get official credit reports (free annual + free weekly online access on-site).',
        tags: ['Official', 'Free Report']
    },
    {
        id: 'RES-002',
        category: 'Credit Reports & Scores',
        title: 'Review Your Report Guide',
        url: 'https://www.annualcreditreport.com/reviewYourReport.action',
        description: 'What to look for and how to review your official report.',
        tags: ['Guide', 'Official']
    },
    {
        id: 'RES-003',
        category: 'Credit Reports & Scores',
        title: 'CFPB - How to Get Free Reports',
        url: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-get-a-free-copy-of-my-credit-reports-en-5/',
        description: 'Step-by-step to request reports + safety warnings about look-alike sites.',
        tags: ['Guide', 'CFPB']
    },
    {
        id: 'RES-004',
        category: 'Credit Reports & Scores',
        title: 'FTC - Free Credit Reports',
        url: 'https://consumer.ftc.gov/articles/free-credit-reports',
        description: 'Consumer guidance + avoiding fake “free report” traps.',
        tags: ['Guide', 'FTC']
    },
    {
        id: 'RES-005',
        category: 'Credit Reports & Scores',
        title: 'CFPB - Reports & Scores Hub',
        url: 'https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/',
        description: 'Educational hub for reports, scores, errors, and monitoring.',
        tags: ['Hub', 'CFPB']
    },

    // Disputes (Bureaus)
    {
        id: 'RES-006',
        category: 'Disputes',
        title: 'Experian Dispute Center',
        url: 'https://www.experian.com/disputes/main.html',
        description: 'File disputes and track disputes with Experian.',
        tags: ['Tool', 'Bureau']
    },
    {
        id: 'RES-007',
        category: 'Disputes',
        title: 'Equifax Dispute',
        url: 'https://www.equifax.com/personal/credit-report-services/credit-dispute/',
        description: 'Dispute inaccuracies with Equifax.',
        tags: ['Tool', 'Bureau']
    },
    {
        id: 'RES-008',
        category: 'Disputes',
        title: 'TransUnion Dispute',
        url: 'https://www.transunion.com/credit-disputes/dispute-your-credit',
        description: 'Dispute inaccuracies with TransUnion.',
        tags: ['Tool', 'Bureau']
    },
    {
        id: 'RES-009',
        category: 'Disputes',
        title: 'Innovis Consumer Dispute',
        url: 'https://www.innovis.com/personal/creditReport',
        description: 'Dispute/report request with Innovis (4th bureau many people forget).',
        tags: ['Tool', 'Bureau']
    },

    // Security (Freeze/Lock)
    {
        id: 'RES-010',
        category: 'Protection',
        title: 'Experian Security Freeze',
        url: 'https://www.experian.com/freeze/center.html',
        description: 'Place/lift a security freeze.',
        tags: ['Tool', 'Security']
    },
    {
        id: 'RES-011',
        category: 'Protection',
        title: 'Equifax Security Freeze',
        url: 'https://www.equifax.com/personal/credit-report-services/credit-freeze/',
        description: 'Place/lift a security freeze.',
        tags: ['Tool', 'Security']
    },
    {
        id: 'RES-012',
        category: 'Protection',
        title: 'TransUnion Credit Freeze',
        url: 'https://www.transunion.com/credit-freeze',
        description: 'Place/lift a security freeze.',
        tags: ['Tool', 'Security']
    },
    {
        id: 'RES-013',
        category: 'Protection',
        title: 'ChexSystems Security Freeze',
        url: 'https://www.chexsystems.com/security-freeze',
        description: 'Freeze banking/chex report to reduce account fraud.',
        tags: ['Tool', 'Security']
    },

    // Specialty Reports
    {
        id: 'RES-014',
        category: 'Banking & Specialty',
        title: 'ChexSystems Consumer Disclosure',
        url: 'https://www.chexsystems.com/request-reports/consumer-disclosure',
        description: 'Get your ChexSystems report (bank account screening).',
        tags: ['Tool', 'Report']
    },
    {
        id: 'RES-015',
        category: 'Banking & Specialty',
        title: 'LexisNexis Consumer Disclosure',
        url: 'https://consumer.risk.lexisnexis.com/request',
        description: 'Request LexisNexis consumer disclosure (often impacts verification/screening).',
        tags: ['Tool', 'Report']
    },
    {
        id: 'RES-016',
        category: 'Banking & Specialty',
        title: 'OptOutPrescreen',
        url: 'https://www.optoutprescreen.com/',
        description: 'Opt out of prescreened credit/insurance offers (reduce spam/identity risk).',
        tags: ['Tool', 'Privacy']
    },

    // Identity Theft
    {
        id: 'RES-017',
        category: 'Protection',
        title: 'IdentityTheft.gov',
        url: 'https://www.identitytheft.gov/',
        description: 'Official FTC recovery plan + reports + letters.',
        tags: ['Official', 'Recovery']
    },
    {
        id: 'RES-018',
        category: 'Protection',
        title: 'ReportFraud.ftc.gov',
        url: 'https://reportfraud.ftc.gov/',
        description: 'Report scams and fraud.',
        tags: ['Official', 'Reporting']
    },
    {
        id: 'RES-019',
        category: 'Protection',
        title: 'National Do Not Call Registry',
        url: 'https://www.donotcall.gov/',
        description: 'Reduce unwanted calls (scam reduction layer).',
        tags: ['Tool', 'Privacy']
    },

    // Debt & Collections
    {
        id: 'RES-020',
        category: 'Debt',
        title: 'CFPB - Debt Collection Rights',
        url: 'https://www.consumerfinance.gov/consumer-tools/debt-collection/answers/know-your-rights/',
        description: 'Consumer rights + stopping contact + timelines.',
        tags: ['Guide', 'CFPB']
    },
    {
        id: 'RES-021',
        category: 'Debt',
        title: 'CFPB - Sample Letters',
        url: 'https://www.consumerfinance.gov/consumer-tools/debt-collection/answers/basics/',
        description: 'Templates for "Not My Debt", "Stop Contacting", and Validation.',
        tags: ['Templates', 'CFPB']
    },
    {
        id: 'RES-022',
        category: 'Debt',
        title: 'FTC - FDCPA Text',
        url: 'https://www.ftc.gov/legal-library/browse/rules/fair-debt-collection-practices-act-text',
        description: 'Official law text reference.',
        tags: ['Legal', 'FTC']
    },

    // Complaints
    {
        id: 'RES-023',
        category: 'Disputes',
        title: 'CFPB - Submit a Complaint',
        url: 'https://www.consumerfinance.gov/complaint/',
        description: 'File complaints about financial products/services.',
        tags: ['Tool', 'Complaint']
    },
    {
        id: 'RES-024',
        category: 'Banking & Specialty',
        title: 'OCC - HelpWithMyBank',
        url: 'https://helpwithmybank.gov/',
        description: 'Banking questions + complaint path (national banks).',
        tags: ['Tool', 'Banking']
    },

    // Budgeting
    {
        id: 'RES-025',
        category: 'Start Here',
        title: 'MyMoney.gov',
        url: 'https://www.mymoney.gov/',
        description: 'Federal financial education hub.',
        tags: ['Official', 'Education']
    },
    {
        id: 'RES-026',
        category: 'Start Here',
        title: 'FDIC Money Smart',
        url: 'https://www.fdic.gov/resources/consumers/money-smart/',
        description: 'Free financial education curriculum.',
        tags: ['Education', 'FDIC']
    },

    // Home & Mortgage
    {
        id: 'RES-027',
        category: 'Home & Wealth',
        title: 'HUD Housing Counseling',
        url: 'https://www.hud.gov/stat/sfh/housing-counseling',
        description: 'Find HUD-approved housing counseling agencies.',
        tags: ['Official', 'Housing']
    },
    {
        id: 'RES-028',
        category: 'Home & Wealth',
        title: 'Fannie Mae HomeView',
        url: 'https://www.fanniemae.com/education',
        description: 'Free homebuyer education course + certificate.',
        tags: ['Course', 'Real Estate']
    },

    // Student Loans
    {
        id: 'RES-029',
        category: 'Student Loans',
        title: 'FAFSA',
        url: 'https://studentaid.gov/h/apply-for-aid/fafsa',
        description: 'Apply for federal financial aid.',
        tags: ['Tool', 'Federal']
    },
    {
        id: 'RES-030',
        category: 'Student Loans',
        title: 'Loan Simulator',
        url: 'https://studentaid.gov/loan-simulator',
        description: 'Estimate payments + choose best plan.',
        tags: ['Calculator', 'Federal']
    },

    // Taxes
    {
        id: 'RES-031',
        category: 'Taxes',
        title: 'IRS Free File',
        url: 'https://www.irs.gov/file-your-taxes-for-free',
        description: 'IRS free filing options.',
        tags: ['Tool', 'IRS']
    },
    {
        id: 'RES-032',
        category: 'Taxes',
        title: 'Where’s My Refund',
        url: 'https://www.irs.gov/wheres-my-refund',
        description: 'Official IRS refund tracker.',
        tags: ['Tool', 'IRS']
    },

    // Investing
    {
        id: 'RES-033',
        category: 'Investing',
        title: 'Investor.gov (SEC)',
        url: 'https://www.investor.gov/',
        description: 'Investor education + planning tools.',
        tags: ['Official', 'SEC']
    },
    {
        id: 'RES-034',
        category: 'Investing',
        title: 'Compound Interest Calculator',
        url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
        description: 'Show growth math (Official SEC tool).',
        tags: ['Calculator', 'SEC']
    },
    {
        id: 'RES-035',
        category: 'Investing',
        title: 'BrokerCheck (FINRA)',
        url: 'https://brokercheck.finra.org/',
        description: 'Check background of brokers/advisors.',
        tags: ['Tool', 'Safety']
    },

    // Business
    {
        id: 'RES-036',
        category: 'Business',
        title: 'SBA Learning Center',
        url: 'https://www.sba.gov/learning-center',
        description: 'Free courses for business basics + funding.',
        tags: ['Education', 'SBA']
    },
    {
        id: 'RES-037',
        category: 'Business',
        title: 'Apply for EIN',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
        description: 'Free EIN application (business foundation).',
        tags: ['Tool', 'IRS']
    },
];

export const RESOURCE_CATEGORIES = [
    'Start Here',
    'Credit Reports & Scores',
    'Disputes',
    'Protection',
    'Debt',
    'Banking & Specialty',
    'Home & Wealth',
    'Student Loans',
    'Taxes',
    'Investing',
    'Business'
] as const;
