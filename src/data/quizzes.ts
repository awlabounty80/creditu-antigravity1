/**
 * CREDIT U™ INTERACTIVE QUIZZES
 * Format: QUIZ (with answer logic)
 * Source-verified questions and explanations
 */

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    source: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface Quiz {
    id: string;
    title: string;
    category: string;
    level: 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR';
    passingScore: number;
    questions: QuizQuestion[];
    relatedArticle?: string;
}

export const QUIZZES: Record<string, Quiz> = {
    'QUIZ-001': {
        id: 'QUIZ-001',
        title: 'FCRA Rights and Protections',
        category: 'Consumer Law',
        level: 'FRESHMAN',
        passingScore: 70,
        relatedArticle: 'KB-001',
        questions: [
            {
                id: 'Q001-1',
                question: 'How many free credit reports are you entitled to per year under FCRA?',
                options: [
                    'One from each bureau (3 total)',
                    'One combined report',
                    'Unlimited reports',
                    'None unless you pay'
                ],
                correctAnswer: 0,
                explanation: 'Under FCRA, you are entitled to one free report from each of the three major bureaus (Experian, Equifax, TransUnion) every 12 months via AnnualCreditReport.com.',
                source: '15 U.S.C. § 1681j',
                difficulty: 'EASY'
            },
            {
                id: 'Q001-2',
                question: 'How long do credit bureaus have to investigate a dispute?',
                options: [
                    '15 days',
                    '30 days',
                    '60 days',
                    '90 days'
                ],
                correctAnswer: 1,
                explanation: 'Credit bureaus must complete their investigation within 30 days of receiving your dispute, unless they determine the dispute is frivolous.',
                source: '15 U.S.C. § 1681i(a)(1)',
                difficulty: 'MEDIUM'
            },
            {
                id: 'Q001-3',
                question: 'How long can most negative information remain on your credit report?',
                options: [
                    '3 years',
                    '5 years',
                    '7 years',
                    '10 years'
                ],
                correctAnswer: 2,
                explanation: 'Most negative information (late payments, collections, charge-offs) must be removed after 7 years from the date of first delinquency. Bankruptcies can remain for 10 years.',
                source: '15 U.S.C. § 1681c',
                difficulty: 'EASY'
            },
            {
                id: 'Q001-4',
                question: 'What must a company do if they deny you credit based on your credit report?',
                options: [
                    'Nothing, it is their decision',
                    'Provide a verbal explanation',
                    'Send an adverse action notice with bureau contact info',
                    'Automatically approve you for a smaller amount'
                ],
                correctAnswer: 2,
                explanation: 'Companies must send an adverse action notice that includes the name and contact information of the credit bureau that provided the report, and inform you of your right to dispute.',
                source: '15 U.S.C. § 1681m(a)',
                difficulty: 'MEDIUM'
            },
            {
                id: 'Q001-5',
                question: 'Can you sue a credit bureau for FCRA violations?',
                options: [
                    'No, only the FTC can take action',
                    'Yes, for actual and statutory damages',
                    'Only if you hire a lawyer first',
                    'Only for damages over $10,000'
                ],
                correctAnswer: 1,
                explanation: 'You can sue credit bureaus for willful or negligent FCRA violations and recover actual damages, statutory damages ($100-$1,000 per violation), and attorney fees.',
                source: '15 U.S.C. § 1681n, § 1681o',
                difficulty: 'HARD'
            }
        ]
    },

    'QUIZ-002': {
        id: 'QUIZ-002',
        title: 'Credit Score Factors',
        category: 'Credit Scoring',
        level: 'FRESHMAN',
        passingScore: 70,
        relatedArticle: 'KB-002',
        questions: [
            {
                id: 'Q002-1',
                question: 'What percentage of your FICO score is determined by payment history?',
                options: [
                    '25%',
                    '30%',
                    '35%',
                    '40%'
                ],
                correctAnswer: 2,
                explanation: 'Payment history is the most important factor in your FICO score, accounting for approximately 35%.',
                source: 'myFICO.com - What\'s in my FICO Scores',
                difficulty: 'EASY'
            },
            {
                id: 'Q002-2',
                question: 'What is the ideal credit utilization rate for score optimization?',
                options: [
                    'Below 50%',
                    'Below 30%',
                    'Below 10%',
                    'Exactly 0%'
                ],
                correctAnswer: 2,
                explanation: 'While keeping utilization below 30% is recommended, utilization below 10% is ideal for maximizing your credit score.',
                source: 'Experian.com - Credit Utilization Rate',
                difficulty: 'MEDIUM'
            },
            {
                id: 'Q002-3',
                question: 'Which action will LOWER your credit score?',
                options: [
                    'Paying off a credit card balance',
                    'Becoming an authorized user on an old account',
                    'Closing your oldest credit card',
                    'Requesting a credit limit increase'
                ],
                correctAnswer: 2,
                explanation: 'Closing your oldest account can shorten your average credit history and reduce total available credit, both of which can lower your score.',
                source: 'CFPB - What is a credit score?',
                difficulty: 'MEDIUM'
            },
            {
                id: 'Q002-4',
                question: 'How long do hard inquiries remain on your credit report?',
                options: [
                    '6 months',
                    '1 year',
                    '2 years',
                    '7 years'
                ],
                correctAnswer: 2,
                explanation: 'Hard inquiries remain on your report for 2 years but typically only affect your score for the first 12 months.',
                source: 'myFICO.com - Credit Checks and Inquiries',
                difficulty: 'EASY'
            },
            {
                id: 'Q002-5',
                question: 'What is "credit mix" in FICO scoring?',
                options: [
                    'The total number of credit accounts you have',
                    'The variety of credit types (cards, loans, mortgages)',
                    'The ratio of good to bad accounts',
                    'The mix of open and closed accounts'
                ],
                correctAnswer: 1,
                explanation: 'Credit mix refers to the variety of credit types you manage, including revolving credit (cards), installment loans (auto, mortgage), and open accounts. It accounts for about 10% of your FICO score.',
                source: 'myFICO.com - What\'s in my FICO Scores',
                difficulty: 'MEDIUM'
            }
        ]
    }
};

export function calculateQuizScore(quiz: Quiz, userAnswers: number[]): {
    score: number;
    passed: boolean;
    feedback: string[];
} {
    let correct = 0;
    const feedback: string[] = [];

    quiz.questions.forEach((q, index) => {
        if (userAnswers[index] === q.correctAnswer) {
            correct++;
            feedback.push(`✓ Question ${index + 1}: Correct`);
        } else {
            feedback.push(`✗ Question ${index + 1}: Incorrect. ${q.explanation}`);
        }
    });

    const score = (correct / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    return { score, passed, feedback };
}
