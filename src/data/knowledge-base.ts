/**
 * CREDIT U™ KNOWLEDGE BASE ARTICLES
 * Source-verified educational content
 * Format: KNOWLEDGE_BASE_ARTICLE
 */

export const KNOWLEDGE_BASE_ARTICLES = {
    'fcra-overview': {
        id: 'KB-001',
        title: 'Understanding the Fair Credit Reporting Act (FCRA)',
        category: 'Consumer Law',
        level: 'FRESHMAN',
        lastUpdated: '2026-01-20',
        sources: ['15 U.S.C. § 1681', 'FTC.gov', 'CFPB.gov'],
        content: `
# Understanding the Fair Credit Reporting Act (FCRA)

## What is the FCRA?

The Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., is a federal law enacted in 1970 to promote accuracy, fairness, and privacy of consumer information in credit reporting.

## Your Rights Under FCRA

### 1. Access to Your Credit Report
- You are entitled to one free credit report every 12 months from each of the three major credit bureaus (Experian, Equifax, TransUnion).
- Access your reports at AnnualCreditReport.com (the only federally authorized source).
- Additional free reports are available if you are denied credit, employment, or insurance based on your credit report.

### 2. Dispute Inaccurate Information
- You have the right to dispute incomplete or inaccurate information.
- Credit bureaus must investigate disputes within 30 days.
- If information cannot be verified, it must be removed from your report.

### 3. Limits on Report Access
- Credit reports can only be accessed for permissible purposes:
  - Credit applications
  - Employment screening (with your consent)
  - Insurance underwriting
  - Court orders or subpoenas
- Unauthorized access is a violation of federal law.

### 4. Obsolete Information Removal
- Most negative information must be removed after 7 years.
- Bankruptcies can remain for up to 10 years.
- Positive information can remain indefinitely.

### 5. Notification of Negative Actions
- If you are denied credit, employment, or insurance based on your credit report, the company must:
  - Notify you in writing
  - Provide the name and contact information of the credit bureau
  - Inform you of your right to dispute

## How to Exercise Your Rights

### Filing a Dispute
1. Identify the error on your credit report
2. Gather supporting documentation
3. Submit a dispute to the credit bureau (online, mail, or phone)
4. The bureau must investigate within 30 days
5. If the dispute is successful, the error is removed

### Enforcement
- Violations of FCRA can result in actual damages, statutory damages ($100-$1,000 per violation), and attorney's fees.
- File complaints with the Consumer Financial Protection Bureau (CFPB) or Federal Trade Commission (FTC).

## Key Takeaways

- The FCRA gives you enforceable legal rights over your credit data.
- Credit bureaus are private companies, but they must comply with federal law.
- Monitoring your credit and disputing errors is your responsibility.
- These rights apply to all consumers, regardless of credit score.

**Sources:**
- 15 U.S.C. § 1681 (Fair Credit Reporting Act)
- Consumer Financial Protection Bureau (consumerfinance.gov)
- Federal Trade Commission (ftc.gov/credit)
    `,
        relatedArticles: ['KB-002', 'KB-003', 'KB-010'],
        quiz: 'QUIZ-001'
    },

    'credit-utilization': {
        id: 'KB-002',
        title: 'Credit Utilization: The 30% Rule Explained',
        category: 'Credit Scoring',
        level: 'FRESHMAN',
        lastUpdated: '2026-01-20',
        sources: ['myFICO.com', 'Experian.com', 'CFPB.gov'],
        content: `
# Credit Utilization: The 30% Rule Explained

## What is Credit Utilization?

Credit utilization is the ratio of your current credit card balances to your total credit limits. It is the second most important factor in your FICO credit score, accounting for approximately 30% of your score.

## How to Calculate Utilization

### Formula
\`\`\`
Utilization Rate = (Total Credit Card Balances / Total Credit Limits) × 100
\`\`\`

### Example
- Total credit limits: $10,000
- Total balances: $3,000
- Utilization: ($3,000 / $10,000) × 100 = 30%

## Why Utilization Matters

### Lender Perspective
- High utilization suggests you may be overextended financially.
- Low utilization indicates you use credit responsibly and are not dependent on it.

### Score Impact
- Utilization above 30% can lower your score.
- Utilization above 50% significantly damages your score.
- Utilization below 10% is optimal for score maximization.

## Per-Card vs Overall Utilization

Both matter:
- **Overall Utilization**: Total balances across all cards divided by total limits.
- **Per-Card Utilization**: Balance on each individual card divided by that card's limit.

**Best Practice**: Keep both overall and per-card utilization below 30%.

## How to Lower Utilization

### 1. Pay Down Balances
- The most direct method.
- Prioritize cards with the highest utilization rates.

### 2. Pay Before Statement Date
- Utilization is typically calculated based on your statement balance.
- Making payments before your statement closes can lower reported utilization.

### 3. Request Credit Limit Increases
- Increases your total available credit, lowering utilization.
- Only effective if you do not increase spending.

### 4. Keep Old Accounts Open
- Closing accounts reduces total available credit, increasing utilization.

## Common Misconceptions

### Myth: Carrying a balance improves your score.
**Reality**: Paying in full each month is optimal. Carrying a balance costs you interest without credit benefit.

### Myth: 0% utilization is best.
**Reality**: Some utilization (1-9%) shows active credit use. 0% may suggest inactivity.

### Myth: Utilization has long-term memory.
**Reality**: Utilization is recalculated monthly. Lowering balances improves your score quickly.

## Key Takeaways

- Keep utilization below 30% (ideally below 10%).
- Both overall and per-card utilization matter.
- Utilization updates monthly and has no "memory."
- Lowering utilization is one of the fastest ways to improve your score.

**Sources:**
- myFICO.com - Understanding Credit Utilization
- Experian.com - What is Credit Utilization?
- Consumer Financial Protection Bureau - Credit Reports and Scores
    `,
        relatedArticles: ['KB-001', 'KB-005', 'KB-008'],
        calculator: 'CALC-001'
    }
};
