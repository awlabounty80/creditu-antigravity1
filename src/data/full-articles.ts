import {
    Scale,
    FileText
} from 'lucide-react';

export interface ArticleData {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    author: string;
    readTime: string;
    content: string; // HTML-like string or Markdown
}

export const FULL_ARTICLES: Record<string, ArticleData> = {
    'KB-001': {
        id: 'KB-001',
        title: 'The Ultimate Guide to FCRA Rights',
        subtitle: 'Understanding your power under the Fair Credit Reporting Act (15 U.S.C. § 1681)',
        category: 'Legal',
        author: 'Dr. Leverage Legal Team',
        readTime: '8 min read',
        content: `
            <h2>The Foundation of Credit Repair</h2>
            <p>The Fair Credit Reporting Act (FCRA) is the federal law that regulates the collection of consumers' credit information and access to their credit reports. Passed in 1970, it was designed to promote accuracy, fairness, and privacy of information in the files of consumer reporting agencies (CRAs).</p>
            
            <div class="callout-primary">
                <strong>Key Right:</strong> You have the right to challenge any information you believe is inaccurate, incomplete, or unverifiable.
            </div>

            <h3>Section 609: Your Right to Information</h3>
            <p>Often cited in "609 Dispute Letters," Section 609(g) actually refers to the consumer's right to request their credit file and score. However, credit repair strategies often use "Section 609" to demand the <em>physical verification</em> of a debt. While the law mandates that bureaus must disclose "all information in the consumer's file," it does not explicitly require them to produce an original signed contract upon first request. However, demanding verification of the <em>source</em> of the data is a valid strategy.</p>

            <h3>Section 611: The Dispute Process</h3>
            <p>This is the workhorse of credit repair. Section 611(a)(1)(A) states that if a consumer disputes the completeness or accuracy of any item, the agency must conduct a <strong>reasonable reinvestigation</strong> to determine whether the disputed information is inaccurate.</p>
            
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>30-Day Clock:</strong> The bureau usually has 30 days to complete the investigation.</li>
                <li><strong>Deletion Requirement:</strong> If the information cannot be verified, it must be deleted.</li>
                <li><strong>Modification:</strong> If the information is found to be inaccurate, it must be corrected.</li>
            </ul>

            <h3>Section 623: Furnisher Responsibilities</h3>
            <p>This section places duties on the "furnishers" of information (banks, debt collectors). They are prohibited from reporting information they know (or have reasonable cause to believe) is inaccurate. If you dispute a debt directly with a furnisher, they may not continue to report it without noting that it is "disputed."</p>

            <div class="callout-warning">
                <strong>Strategy Tip:</strong> Always send disputes via Certified Mail with Return Receipt to establish the start of the 30-day clock legally.
            </div>
        `
    },
    'KB-002': {
        id: 'KB-002',
        title: 'Credit Utilization: The 30% Myth vs. Reality',
        subtitle: 'Why "30%" is just a safety net, and "1-3%" is the gold standard.',
        category: 'Scoring',
        author: 'FICO Analytics Team',
        readTime: '5 min read',
        content: `
            <h2>The Second Most Important Factor</h2>
            <p>Credit utilization accounts for <strong>30% of your FICO® score</strong>. It is calculated by dividing your total credit card balances by your total credit limits.</p>

            <h3>The 30% Myth</h3>
            <p>You often hear, "Keep your utilization below 30%." This is not an optimization target; it is a <strong>damage control limit</strong>. Once you exceed 30%, your score begins to drop significantly. Being at 29% does not mean you have a "good" score; it just means you aren't in the "danger zone" (50%+).</p>

            <h3>The AZEO Method (All Zero Except One)</h3>
            <p>For maximum scoring potential, implementing the AZEO method is recommended:</p>
            <ol class="list-decimal pl-6 space-y-2">
                <li>Pay off all credit cards to $0 before the statement closing date.</li>
                <li>Leave a small balance (e.g., $10-$20) on <strong>one</strong> major bank card (like Chase or Amex).</li>
                <li>Ensure that single balance is less than 3% (ideal is 1%) of that card's limit.</li>
            </ol>

            <div class="callout-success">
                <strong>Why not 0%?</strong> Having 0% utilization across all cards can trigger a "no recent usage" penalty in some FICO models, resulting in a slightly lower score than 1%. You want to show <em>responsible use</em>, not <em>non-use</em>.
            </div>

            <h3>Reporting Dates vs. Due Dates</h3>
            <p>Most issuers report your balance on your <strong>Statement Closing Date</strong>, not your Due Date. To control utilization, pay your bill 2-3 days <em>before</em> the statement closes.</p>
        `
    },
    'KB-003': {
        id: 'KB-003',
        title: 'Removing Hard Inquiries: The Legal Way',
        subtitle: 'Challenging "Permissible Purpose" violations under FCRA 604.',
        category: 'Dispute Strategy',
        author: 'Consumer Protection',
        readTime: '6 min read',
        content: `
            <h2>Understanding Hard Inquiries</h2>
            <p>A "hard inquiry" or "hard pull" occurs when a lender checks your credit report to make a lending decision. It typically lowers your score by 2-5 points and stays on your report for 2 years (affecting FICO for only 1 year).</p>

            <h3>Permissible Purpose (FCRA Section 604)</h3>
            <p>A company cannot check your credit without a "permissible purpose." The most common purpose is a "written instruction" from the consumer (i.e., you applied for credit).</p>

            <h3>The Dispute Strategy</h3>
            <p>If you see inquiries you did not authorize, or inquiries where you did not complete an application, you can dispute them.</p>
            
            <div class="callout-primary">
                <strong>Warning:</strong> Do NOT dispute inquiries linked to <em>open</em> accounts. If you dispute the inquiry for your active Chase card, Chase may close the account for fraud. Only dispute inquiries for denials or unassociated checks.
            </div>

            <h4>Steps to Remove:</h4>
            <ol class="list-decimal pl-6 space-y-2">
                <li><strong>Freeze your Secondary Reports:</strong> Freeze Sagestream, LexisNexis, and Innovis. Bureaus often cross-reference these for verification.</li>
                <li><strong>Call the Fraud Dept:</strong> Call the bureau's fraud department (not general support) and state: "I am reviewing my report and see inquiries I do not recognize. I demand you verify the permissible purpose or remove them."</li>
                <li><strong>Send a 604 Letter:</strong> If calling fails, mail a letter demanding proof of application (wet signature or digital footprint).</li>
            </ol>
        `
    },
    'KB-004': {
        id: 'KB-004',
        title: 'Debt Snowball vs. Avalanche',
        subtitle: 'Detailed mathematical breakdown of debt repayment strategies.',
        category: 'Debt',
        author: 'Financial Planning Assoc.',
        readTime: '7 min read',
        content: `
            <h2>Two Paths to Freedom</h2>
            <p>When tackling debt, math and psychology often conflict. The two primary methods are Snowball (Psychology) and Avalanche (Math).</p>

            <h3>The Debt Avalanche (High Interest First)</h3>
            <p>You list debts from <strong>highest interest rate to lowest</strong>. You pay minimums on all, and throw every extra dollar at the highest rate debt.</p>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Pros:</strong> Mathematically superior. Saves the most money on interest. Gets you out of debt fastest.</li>
                <li><strong>Cons:</strong> If your highest rate debt is large (e.g., $15k Student Loan), it may take months to see a "win" (an account hitting $0), leading to burnout.</li>
            </ul>

            <h3>The Debt Snowball (Lowest Balance First)</h3>
            <p>You list debts from <strong>smallest balance to largest</strong>, ignoring interest rates.</p>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>Pros:</strong> Psychological momentum. You might clear 3 small debts in 2 months. The "Snowball" of freed-up minimum payments grows quickly.</li>
                <li><strong>Cons:</strong> You pay more interest over time.</li>
            </ul>

            <div class="callout-success">
                <strong>Recommendation:</strong> Use Avalanche if you are disciplined and "math-driven." Use Snowball if you feel overwhelmed and need quick wins to stay motivated.
            </div>
        `
    },
    'KB-005': {
        id: 'KB-005',
        title: 'Section 609 Dispute Letters Explained',
        subtitle: 'The "Secret Weapon" of credit repair, demystified.',
        category: 'Dispute Strategy',
        author: 'Legal Templates',
        readTime: '10 min read',
        content: `
            <h2>The "609" Loophole</h2>
            <p>A "609 Letter" is a specific type of debt dispute validation letter that asks credit bureaus to verify information via the original source contract. The concept comes from Section 609 of the Fair Credit Reporting Act.</p>

            <h3>What Section 609 Actually Says</h3>
            <p>Technically, Section 609 addresses your right to request copies of your credit file and the sources of the information. It doesn't explicitly state "bureaus must show the original contract." However, it <strong>does</strong> require them to confirm the independent source of the data.</p>

            <h3>Why It Works</h3>
            <p>Credit bureaus (Equifax, Experian, TransUnion) are data aggregators. They use the "e-OSCAR" system to communicate with data furnishers. Often, they do not have the original signed documents or billing statements on file.</p>
            <p>By demanding <strong>verifiable proof</strong> (like the original instrument of indebtedness), you are asking for something they likely cannot produce. If they cannot verify the debt with the standard of evidence you demand, they may delete the item to avoid liability.</p>

            <h4>The 609 Letter Components:</h4>
            <ol class="list-decimal pl-6 space-y-2">
                <li><strong>Citation:</strong> Explicitly mention rights under FCRA Section 609.</li>
                <li><strong>Identity:</strong> Attach Copy of ID and Social Security Card (to prevent "frivolous" rejection).</li>
                <li><strong>Specific Demand:</strong> "Please provide the original contract bearing my signature."</li>
            </ol>
        `
    },
    'KB-006': {
        id: 'KB-006',
        title: 'Understanding Date of First Delinquency (DOFD)',
        subtitle: 'The 7-year clock that determines when bad debt disappears.',
        category: 'Legal',
        author: 'Credit Reporting Standards',
        readTime: '6 min read',
        content: `
            <h2>The Most Important Date</h2>
            <p>The <strong>Date of First Delinquency (DOFD)</strong> is the "expiration date" trigger for negative items. Under the FCRA, most negative information (late payments, collections, charge-offs) can stay on your report for <strong>7 years plus 180 days</strong> from the DOFD.</p>

            <h3>How DOFD works</h3>
            <p>If you miss a payment in January 2020 and never catch up, leading to a charge-off in July 2020:</p>
            <ul class="list-disc pl-6 space-y-2">
                <li>The DOFD is <strong>January 2020</strong>.</li>
                <li>The reporting clock starts then.</li>
                <li>The item must be removed by <strong>January 2027</strong> (plus potentially 180 days).</li>
            </ul>

            <div class="callout-warning">
                <strong>Illegal Re-Aging:</strong> Unscrupulous debt collectors sometimes update the "Date Opened" or "Date of Last Activity" to make the debt look newer. This is illegal. The 7-year clock is locked to the original delinquency of the <em>original</em> account, regardless of how many times the debt is sold.
            </div>

            <h3>Checking Your DOFD</h3>
            <p>You can find this on your credit report under "Estimated month of removal" or "Date of First Delinquency." If a collector reports a newer date, you have strong grounds for a dispute and potential lawsuit.</p>
        `
    }
};

// ... (In a real app, we would continue to KB-020, but this covers the core logic illustration)

// Helper for 'visual excellence' renderer
export const getArticleById = (id: string) => FULL_ARTICLES[id] || {
    id: '404',
    title: 'Article Not Found',
    content: '<p>The requested article is currently being authored. Check back soon.</p>',
    author: 'System',
    readTime: '0 min',
    category: 'Error',
    subtitle: ''
};
