/**
 * CREDIT U™ EDUCATIONAL CALCULATORS
 * Format: CALCULATOR_EXPLANATION + TOOL_LOGIC_DESCRIPTION
 * Source-verified formulas and educational context
 */

export interface Calculator {
    id: string;
    name: string;
    category: string;
    description: string;
    educationalContext: string;
    sources: string[];
    inputs: CalculatorInput[];
    formula: string;
    disclaimers: string[];
}

export interface CalculatorInput {
    id: string;
    label: string;
    type: 'number' | 'currency' | 'percentage';
    min?: number;
    max?: number;
    default?: number;
    helpText: string;
}

export const CALCULATORS: Record<string, Calculator> = {
    'CALC-001': {
        id: 'CALC-001',
        name: 'Credit Utilization Calculator',
        category: 'Credit Scoring',
        description: 'Calculate your credit utilization rate and see how it impacts your credit score.',
        educationalContext: `
Credit utilization is the ratio of your credit card balances to your total credit limits. It is the second most important factor in your FICO score (approximately 30%).

**Why It Matters:**
- Utilization above 30% can lower your score
- Utilization below 10% is optimal
- Both overall and per-card utilization are considered

**How to Improve:**
- Pay down balances
- Request credit limit increases
- Pay before statement date
- Keep old accounts open
    `,
        sources: [
            'myFICO.com - Credit Utilization',
            'Experian.com - What is Credit Utilization',
            'CFPB - Credit Reports and Scores'
        ],
        inputs: [
            {
                id: 'totalBalances',
                label: 'Total Credit Card Balances',
                type: 'currency',
                min: 0,
                default: 3000,
                helpText: 'Sum of all your credit card balances'
            },
            {
                id: 'totalLimits',
                label: 'Total Credit Limits',
                type: 'currency',
                min: 1,
                default: 10000,
                helpText: 'Sum of all your credit card limits'
            }
        ],
        formula: '(totalBalances / totalLimits) × 100',
        disclaimers: [
            'This calculator provides educational estimates only.',
            'Actual credit score impact varies by individual credit profile.',
            'Consult your credit reports for accurate balance and limit information.',
            'This is not financial advice.'
        ]
    },

    'CALC-002': {
        id: 'CALC-002',
        name: 'Debt-to-Income (DTI) Ratio Calculator',
        category: 'Lending Standards',
        description: 'Calculate your DTI ratio to understand mortgage and loan qualification thresholds.',
        educationalContext: `
Debt-to-Income (DTI) ratio is a key metric lenders use to assess your ability to repay debt. It compares your monthly debt payments to your gross monthly income.

**DTI Thresholds (General Guidelines):**
- Below 36%: Excellent (most lenders)
- 36-43%: Acceptable (conventional loans)
- 43-50%: May qualify for FHA/VA loans
- Above 50%: High risk, limited options

**What Counts as Debt:**
- Mortgage/rent
- Car loans
- Student loans
- Credit card minimum payments
- Personal loans
- Child support/alimony

**What Does NOT Count:**
- Utilities
- Insurance
- Groceries
- Transportation costs
    `,
        sources: [
            'CFPB - Debt-to-Income Calculator',
            'Fannie Mae - Eligibility Matrix',
            'HUD.gov - FHA Loan Requirements'
        ],
        inputs: [
            {
                id: 'monthlyDebt',
                label: 'Total Monthly Debt Payments',
                type: 'currency',
                min: 0,
                default: 2000,
                helpText: 'Include mortgage, car, student loans, credit cards, etc.'
            },
            {
                id: 'monthlyIncome',
                label: 'Gross Monthly Income',
                type: 'currency',
                min: 1,
                default: 5000,
                helpText: 'Income before taxes and deductions'
            }
        ],
        formula: '(monthlyDebt / monthlyIncome) × 100',
        disclaimers: [
            'DTI thresholds vary by lender and loan type.',
            'This calculator uses general industry standards.',
            'Actual loan approval depends on multiple factors including credit score.',
            'Consult with a licensed mortgage professional for personalized guidance.',
            'This is educational information, not lending advice.'
        ]
    },

    'CALC-003': {
        id: 'CALC-003',
        name: 'Debt Payoff Calculator (Snowball vs Avalanche)',
        category: 'Debt Management',
        description: 'Compare debt payoff strategies and calculate time to debt freedom.',
        educationalContext: `
Two primary debt payoff strategies exist:

**Snowball Method:**
- Pay off smallest balance first
- Psychological wins build momentum
- May cost more in interest

**Avalanche Method:**
- Pay off highest interest rate first
- Mathematically optimal
- Saves the most money

**Which to Choose:**
- Snowball: If you need motivation and quick wins
- Avalanche: If you want to minimize total interest paid
- Hybrid: Combine both based on your situation

**Key Principle:**
Both methods require making minimum payments on all debts while putting extra money toward one target debt.
    `,
        sources: [
            'CFPB - Managing Debt',
            'Federal Reserve - Consumer Credit',
            'Khan Academy - Debt Payoff Strategies'
        ],
        inputs: [
            {
                id: 'totalDebt',
                label: 'Total Debt Amount',
                type: 'currency',
                min: 0,
                default: 15000,
                helpText: 'Sum of all debts you want to pay off'
            },
            {
                id: 'avgInterestRate',
                label: 'Average Interest Rate',
                type: 'percentage',
                min: 0,
                max: 100,
                default: 18,
                helpText: 'Weighted average APR across all debts'
            },
            {
                id: 'monthlyPayment',
                label: 'Total Monthly Payment',
                type: 'currency',
                min: 1,
                default: 500,
                helpText: 'Amount you can afford to pay monthly'
            }
        ],
        formula: 'Months = log(monthlyPayment / (monthlyPayment - (totalDebt × avgInterestRate / 1200))) / log(1 + avgInterestRate / 1200)',
        disclaimers: [
            'This calculator provides estimates based on consistent payments.',
            'Actual payoff time may vary due to fees, rate changes, or payment variations.',
            'Does not account for new debt accumulation.',
            'Consult a certified credit counselor for personalized debt management plans.',
            'This is educational information, not financial advice.'
        ]
    }
};

// Calculator execution function
export function executeCalculator(
    calculatorId: string,
    inputs: Record<string, number>
): {
    result: number;
    interpretation: string;
    recommendations: string[];
} {
    const calc = CALCULATORS[calculatorId];
    if (!calc) throw new Error('Calculator not found');

    let result = 0;
    let interpretation = '';
    let recommendations: string[] = [];

    switch (calculatorId) {
        case 'CALC-001': // Credit Utilization
            result = (inputs.totalBalances / inputs.totalLimits) * 100;
            if (result < 10) {
                interpretation = 'Excellent - Your utilization is optimal for credit scoring.';
                recommendations = ['Maintain this low utilization.', 'Consider using credit occasionally to show activity.'];
            } else if (result < 30) {
                interpretation = 'Good - Your utilization is within recommended guidelines.';
                recommendations = ['Keep utilization below 30%.', 'Pay down balances to reach below 10% for score optimization.'];
            } else if (result < 50) {
                interpretation = 'Fair - Your utilization may be negatively impacting your score.';
                recommendations = ['Pay down balances to below 30%.', 'Consider requesting credit limit increases.', 'Avoid closing old accounts.'];
            } else {
                interpretation = 'Poor - High utilization is likely significantly lowering your score.';
                recommendations = ['Prioritize paying down balances immediately.', 'Stop using credit cards until utilization is below 30%.', 'Consider balance transfer or debt consolidation.'];
            }
            break;

        case 'CALC-002': // DTI
            result = (inputs.monthlyDebt / inputs.monthlyIncome) * 100;
            if (result < 36) {
                interpretation = 'Excellent - You meet most lender requirements.';
                recommendations = ['You qualify for most loan types.', 'Maintain this healthy debt level.'];
            } else if (result < 43) {
                interpretation = 'Good - You may qualify for conventional loans.';
                recommendations = ['You are within acceptable range for many lenders.', 'Consider paying down debt to improve approval odds.'];
            } else if (result < 50) {
                interpretation = 'Fair - Limited to FHA/VA loans or subprime lenders.';
                recommendations = ['Focus on reducing monthly debt payments.', 'Increase income if possible.', 'Consider FHA loans which allow higher DTI.'];
            } else {
                interpretation = 'Poor - Debt level may prevent loan approval.';
                recommendations = ['Significantly reduce monthly debt obligations.', 'Delay major purchases until DTI improves.', 'Consult a credit counselor for debt management strategies.'];
            }
            break;

        case 'CALC-003': { // Debt Payoff
            const monthlyRate = inputs.avgInterestRate / 100 / 12;
            const months = Math.log(inputs.monthlyPayment / (inputs.monthlyPayment - inputs.totalDebt * monthlyRate)) / Math.log(1 + monthlyRate);
            result = Math.ceil(months);
            const years = Math.floor(result / 12);
            const remainingMonths = result % 12;
            interpretation = `You will be debt-free in ${years} years and ${remainingMonths} months.`;
            const totalPaid = inputs.monthlyPayment * result;
            const totalInterest = totalPaid - inputs.totalDebt;
            recommendations = [
                `Total amount paid: $${totalPaid.toFixed(2)}`,
                `Total interest paid: $${totalInterest.toFixed(2)}`,
                'Increase monthly payment to reduce payoff time.',
                'Focus on highest interest debts first (avalanche method) to save money.'
            ];
            break;
        }
    }

    return { result, interpretation, recommendations };
}
