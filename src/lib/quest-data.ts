
export const QUEST_DATA = [
    // --- BANKING & CHECKS ---
    {
        id: 'overdraft_opt_in',
        title: 'Debit Card Decline',
        desc: () => "You try to buy coffee for $5 but have $3 in your account. The transaction is declined. Is this good?",
        icon: 'Wallet',
        theme: 'text-emerald-500',
        generate: () => [
            { id: 'A', text: "No, it's embarrassing.", feedback: "Maybe, but it saved you a $35 overdraft fee because you didn't 'Opt-In' to overdraft protection.", isCorrect: true, points: 50, statImpact: { score: 0, cash: +35 } },
            { id: 'B', text: "Yes, I want it to go through.", feedback: "Bad move. That coffee would cost you $5 + $35 fee. Always opt-out of debit overdrafts.", isCorrect: false, points: 10, statImpact: { score: 0, cash: -35 } }
        ]
    },
    {
        id: 'chexsystems_clearing',
        title: 'Blacklisted',
        desc: () => "You are on ChexSystems for an unpaid overdraft 4 years ago. How long does it stay?",
        icon: 'Shield',
        theme: 'text-slate-400',
        generate: () => [
            { id: 'A', text: "7 Years", feedback: "Incorrect. ChexSystems usually clears after 5 years.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "5 Years", feedback: "Correct. You are almost in the clear.", isCorrect: true, points: 50, statImpact: { score: 0, cash: 0 } }
        ]
    },

    // --- CREDIT REPORTING ---
    {
        id: 'annual_credit_report',
        title: 'Free Reports',
        desc: () => "Where is the ONLY government-authorized source for free weekly credit reports?",
        icon: 'Shield',
        theme: 'text-blue-500',
        generate: () => [
            { id: 'A', text: "FreeCreditReport.com", feedback: "No, that's a private company with ads.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "AnnualCreditReport.com", feedback: "Correct. This is the official site mandated by federal law.", isCorrect: true, points: 50, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'freeze_vs_lock',
        title: 'Freeze or Lock?',
        desc: () => "You want the strongest legal protection against identity theft. Do you Freeze or Lock your file?",
        icon: 'Shield',
        theme: 'text-indigo-400',
        generate: () => [
            { id: 'A', text: "Credit Lock", feedback: "Convenient app feature, but lacks the federal legal guarantee of a Freeze.", isCorrect: false, points: 20, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "Security Freeze", feedback: "Correct. A Freeze is federally regulated and free by law.", isCorrect: true, points: 100, statImpact: { score: +10, cash: 0 } }
        ]
    },

    // --- CARD FEATURES ---
    {
        id: 'balance_transfer_fee',
        title: '0% APR Trap',
        desc: () => "You transfer $5,000 to a 0% APR card. The transfer fee is 3%. How much does it cost upfront?",
        icon: 'CreditCard',
        theme: 'text-yellow-400',
        generate: () => [
            { id: 'A', text: "$0", feedback: "Incorrect. 0% Interest doesn't mean $0 fees.", isCorrect: false, points: 0, statImpact: { score: 0, cash: -150 } },
            { id: 'B', text: "$150", feedback: "Correct. 3% of $5,000 is $150. Still cheaper than paying 20% interest!", isCorrect: true, points: 75, statImpact: { score: +10, cash: -150 } }
        ]
    },
    {
        id: 'annual_fee_downgrade',
        title: 'Premier Card Renewal',
        desc: () => "Your $95 annual fee card is renewing, but you don't use the perks anymore. What's the best credit move?",
        icon: 'CreditCard',
        theme: 'text-purple-400',
        generate: () => [
            { id: 'A', text: "Cancel the card.", feedback: "Avoid if possible. You lose the credit history and limit.", isCorrect: false, points: 10, statImpact: { score: -10, cash: 0 } },
            { id: 'B', text: "Downgrade to a no-fee version.", feedback: "Pro Move. You keep the history and limit, but lose the fee.", isCorrect: true, points: 100, statImpact: { score: +5, cash: +95 } }
        ]
    },

    // --- FRAUD & SECURITY ---
    {
        id: 'phishing_text',
        title: 'The "Fraud" Alert',
        desc: () => "You get a text: 'Wells Fargo Alert: Suspicious charge of $900. Click here to verify.' You have a Wells Fargo card.",
        icon: 'AlertTriangle',
        theme: 'text-red-500',
        generate: () => [
            { id: 'A', text: "Click and login fast.", feedback: "Stop! That's a phishing link. They will steal your password.", isCorrect: false, points: 0, statImpact: { score: 0, cash: -900 } },
            { id: 'B', text: "Call the number on the back of your card.", feedback: "Correct. Never trust the text link. Verify with the official source.", isCorrect: true, points: 100, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'gas_pump_skimmer',
        title: 'At the Pump',
        desc: () => "You are getting gas. The card reader looks loose and has a hidden camera. What do you do?",
        icon: 'AlertTriangle',
        theme: 'text-orange-500',
        generate: () => [
            { id: 'A', text: "Use Debit logic.", feedback: "Dangerous! Skimmers steal your PIN and drain your cash instantly.", isCorrect: false, points: 10, statImpact: { score: 0, cash: -500 } },
            { id: 'B', text: "Go inside or use Credit.", feedback: "Correct. Credit cards have better fraud protection, and going inside is safer.", isCorrect: true, points: 75, statImpact: { score: 0, cash: 0 } }
        ]
    },

    // --- MORTGAGE & AUTO ---
    {
        id: 'bbrz_mortgage_score',
        title: 'Mortgage Scores',
        desc: () => "You have a 750 FICO 8 score. You apply for a mortgage. The lender says your score is 710. Why?",
        icon: 'TrendingUp',
        theme: 'text-indigo-600',
        generate: () => [
            { id: 'A', text: "They are lying.", feedback: "Unlikely.", isCorrect: false, points: 0, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "Mortgages use FICO 2, 4, and 5.", feedback: "Correct. Mortgage models are older and stricter than FICO 8.", isCorrect: true, points: 150, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'gap_insurance',
        title: 'Totaled Car',
        desc: () => "You owe $20k on your car. It gets totaled, but insurance only pays the value: $15k. Who pays the $5k gap?",
        icon: 'AlertTriangle',
        theme: 'text-red-400',
        generate: () => [
            { id: 'A', text: "The Insurance Company.", feedback: "No, they only pay Actual Cash Value.", isCorrect: false, points: 0, statImpact: { score: 0, cash: -5000 } },
            { id: 'B', text: "You (unless you have GAP Insurance).", feedback: "Correct. GAP insurance covers the 'gap' between loan balance and car value.", isCorrect: true, points: 75, statImpact: { score: 0, cash: 0 } }
        ]
    },

    // --- COLLECTIONS & LAWS ---
    {
        id: 'fdcpa_hours',
        title: 'Midnight Calls',
        desc: () => "A debt collector calls you at 9:30 PM. Is this legal?",
        icon: 'Scale',
        theme: 'text-purple-500',
        generate: () => [
            { id: 'A', text: "Yes.", feedback: "Incorrect.", isCorrect: false, points: 0, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "No.", feedback: "Correct. FDCPA prohibits calls before 8am or after 9pm local time.", isCorrect: true, points: 50, statImpact: { score: +10, cash: 0 } }
        ]
    },
    {
        id: 'cease_and_desist',
        title: 'Stop the Calls',
        desc: () => "How do you legally force a collector to stop calling you?",
        icon: 'Scale',
        theme: 'text-slate-400',
        generate: () => [
            { id: 'A', text: "Change your number.", feedback: "Temporary fix.", isCorrect: false, points: 10, statImpact: { score: 0, cash: -20 } },
            { id: 'B', text: "Send a Cease and Desist letter.", feedback: "Correct. Under federal law, they must stop contacting you (except to sue).", isCorrect: true, points: 100, statImpact: { score: +5, cash: 0 } }
        ]
    },

    // --- STUDENT LOANS ---
    {
        id: 'student_loan_rehab',
        title: 'Defaulted Loans',
        desc: () => "You have a defaulted federal student loan. How can you remove the default status?",
        icon: 'TrendingUp',
        theme: 'text-indigo-400',
        generate: () => [
            { id: 'A', text: "Loan Rehabilitation.", feedback: "Correct. Make 9 on-time payments, and the default is removed from your history.", isCorrect: true, points: 150, statImpact: { score: +40, cash: 0 } },
            { id: 'B', text: "Wait 7 years.", feedback: "Bad idea. Student loans rarely disappear and the government can garnish wages.", isCorrect: false, points: 0, statImpact: { score: -20, cash: 0 } }
        ]
    },
    {
        id: 'pslf_program',
        title: 'Public Service',
        desc: () => "You work for a non-profit. What program might forgive your student loans tax-free?",
        icon: 'Wallet',
        theme: 'text-emerald-400',
        generate: () => [
            { id: 'A', text: "Bankruptcy.", feedback: "Nearly impossible for student loans.", isCorrect: false, points: 0, statImpact: { score: -100, cash: 0 } },
            { id: 'B', text: "PSLF.", feedback: "Correct. Public Service Loan Forgiveness forgives balance after 120 qualifying payments.", isCorrect: true, points: 100, statImpact: { score: +20, cash: 0 } }
        ]
    },

    // --- CREDIT BASICS & SCORING ---
    {
        id: 'utilization_basics',
        title: 'Utilization Impact',
        desc: () => "You have a $1,000 limit card. You spend $900 but pay it off in full on the due date. The statement closes with $900.",
        icon: 'TrendingUp',
        theme: 'text-yellow-400',
        generate: () => [
            { id: 'A', text: "Score drops significantly.", feedback: "Correct! The statement balance is what reports. $900/$1000 is 90% utilization.", isCorrect: true, points: 50, statImpact: { score: -20, cash: 0 } },
            { id: 'B', text: "Score stays the same.", feedback: "False. Even if you pay in full, reporting a high balance hurts your score temporarily.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'payment_history_weight',
        title: 'The Heavy Hitter',
        desc: () => "Which factor makes up the largest percentage of your FICO score?",
        icon: 'Scale',
        theme: 'text-blue-400',
        generate: () => [
            { id: 'A', text: "Utilization (30%)", feedback: "Close, but not the biggest.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "Payment History (35%)", feedback: "Correct! On-time payments are the foundation of your score.", isCorrect: true, points: 50, statImpact: { score: 0, cash: 0 } },
            { id: 'C', text: "Credit Age (15%)", feedback: "Important, but not the main driver.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'credit_age_average',
        title: 'Closing Old Cards',
        desc: (age: number) => `You have a card you haven't used in ${age} years. It has no annual fee. Should you close it?`,
        icon: 'Shield',
        theme: 'text-emerald-400',
        generate: () => [
            { id: 'A', text: "Yes, declutter your wallet.", feedback: "Bad move! Closing it lowers your Average Age of Accounts and total credit limit.", isCorrect: false, points: 10, statImpact: { score: -10, cash: 0 } },
            { id: 'B', text: "No, keep it open.", feedback: "Wisdom. Put a small subscription on it to keep it active. It helps your extensive history.", isCorrect: true, points: 50, statImpact: { score: +5, cash: 0 } }
        ]
    },
    {
        id: 'hard_vs_soft_inquiry',
        title: 'Checking Your Score',
        desc: () => "You check your own credit score on an app like Credit Karma or Experian. Does this hurt your score?",
        icon: 'AlertTriangle',
        theme: 'text-indigo-400',
        generate: () => [
            { id: 'A', text: "Yes, it's an inquiry.", feedback: "Incorrect. Checking your own credit is always a Soft Pull.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "No, never.", feedback: "Correct. You can check your own score daily without any penalty.", isCorrect: true, points: 50, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'grace_period',
        title: 'The Grace Period',
        desc: () => "You pay your full statement balance by the due date every month. How much interest do you pay?",
        icon: 'Wallet',
        theme: 'text-emerald-400',
        generate: () => [
            { id: 'A', text: "None ($0).", feedback: "Correct! This is the 'Grace Period'. Use the bank's money for free.", isCorrect: true, points: 75, statImpact: { score: 0, cash: +20 } },
            { id: 'B', text: "It depends on the APR.", feedback: "No. Designating a purchase as 'Revolving' charges interest, but paying in full avoids it entirely.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } }
        ]
    },

    // --- ADVANCED STRATEGIES & BUSINESS ---
    {
        id: 'authorized_user_risk',
        title: 'Piggyback Risk',
        desc: () => "You are an Authorized User on a friend's card. They max out the card and miss a payment. What happens to you?",
        icon: 'AlertTriangle',
        theme: 'text-red-500',
        generate: () => [
            { id: 'A', text: "Nothing, it's not my debt.", feedback: "False! The negative history mirrors onto your report as well.", isCorrect: false, points: 10, statImpact: { score: -20, cash: 0 } },
            { id: 'B', text: "My score drops.", feedback: "Correct. Ensure the primary cardholder is responsible, or remove yourself immediately.", isCorrect: true, points: 100, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'cfpb_timeline',
        title: 'Federal Clock',
        desc: () => "You file a CFPB complaint against a bank. How long do they have to respond?",
        icon: 'Scale',
        theme: 'text-purple-400',
        generate: () => [
            { id: 'A', text: "30 Days", feedback: "Close, but usually faster.", isCorrect: false, points: 20, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "15 Days", feedback: "Correct. They must provide a substantive response within 15 days usually.", isCorrect: true, points: 100, statImpact: { score: +10, cash: 0 } }
        ]
    },
    {
        id: 'chex_systems',
        title: 'The Banking Report',
        desc: () => "You were denied a checking account. Which reporting agency is likely responsible?",
        icon: 'Shield',
        theme: 'text-slate-400',
        generate: () => [
            { id: 'A', text: "Equifax", feedback: "Unlikely. Banks use a different system for deposit history.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "ChexSystems", feedback: "Correct. ChexSystems tracks overdrafts and banking history.", isCorrect: true, points: 75, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'lexis_nexis',
        title: 'The Secret Agency',
        desc: () => "You want to freeze 'secondary' bureaus to stop bankruptcies from validating. Who is the big one?",
        icon: 'Shield',
        theme: 'text-blue-500',
        generate: () => [
            { id: 'A', text: "Innovis", feedback: "They are a secondary bureau, but not the main public record aggregator.", isCorrect: false, points: 20, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "LexisNexis", feedback: "Bingo. Freezing LexisNexis can sometimes prevent public records from verifying.", isCorrect: true, points: 150, statImpact: { score: +20, cash: 0 } }
        ]
    },
    {
        id: 'goodwill_letter',
        title: 'The Goodwill Play',
        desc: () => "You have one late payment from 2 years ago on an otherwise perfect account. What's the best strategy?",
        icon: 'CreditCard',
        theme: 'text-indigo-400',
        generate: () => [
            { id: 'A', text: "Dispute as 'Not Mine'.", feedback: "Risky. Factual disputes might fail on a valid late payment.", isCorrect: false, points: 20, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "Write a Goodwill Letter.", feedback: "Correct. Asking for forgiveness from the CEO/Exec office often works for one-off mistakes.", isCorrect: true, points: 100, statImpact: { score: +10, cash: 0 } }
        ]
    },
    {
        id: 'business_ein',
        title: 'Corporate Identity',
        desc: () => "You want to build business credit separate from personal. What is the first thing you need?",
        icon: 'TrendingUp',
        theme: 'text-cyan-400',
        generate: () => [
            { id: 'A', text: "An LLC and EIN.", feedback: "Correct. The EIN acts as the social security number for your business.", isCorrect: true, points: 50, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "A Business Credit Card.", feedback: "No, you need the entity first to get the card.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'net_30',
        title: 'Trade Lines',
        desc: () => "What is a 'Net 30' account?",
        icon: 'Wallet',
        theme: 'text-emerald-500',
        generate: () => [
            { id: 'A', text: "An account where you pay in full within 30 days.", feedback: "Correct. Vendors like Uline or Grainger report these payments to business bureaus.", isCorrect: true, points: 75, statImpact: { score: +10, cash: 0 } },
            { id: 'B', text: "An internet account for 30 users.", feedback: "Incorrect.", isCorrect: false, points: 0, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'pg_guarantee',
        title: 'The Personal Guarantee',
        desc: () => "Most starter business cards require a 'PG'. What does this mean?",
        icon: 'AlertTriangle',
        theme: 'text-orange-400',
        generate: () => [
            { id: 'A', text: "Pre-Guaranteed Approval.", feedback: "Wishful thinking.", isCorrect: false, points: 0, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "Personal Guarantee.", feedback: "Correct. If the business fails to pay, YOU are personally liable.", isCorrect: true, points: 50, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'duns_number',
        title: 'Dun & Bradstreet',
        desc: () => "Which identifier is essential for your D&B business credit file?",
        icon: 'Shield',
        theme: 'text-blue-600',
        generate: () => [
            { id: 'A', text: "DUNS Number.", feedback: "Correct. Data Universal Numbering System is the standard for business credit.", isCorrect: true, points: 50, statImpact: { score: +5, cash: 0 } },
            { id: 'B', text: "SSN.", feedback: "No, that's for personal credit.", isCorrect: false, points: 10, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'dti_ratio',
        title: 'Buying Power',
        desc: () => "Lenders look at DTI to approve a mortgage. What is it?",
        icon: 'Scale',
        theme: 'text-indigo-500',
        generate: () => [
            { id: 'A', text: "Debt-to-Income Ratio.", feedback: "Correct. Monthly Usage / Monthly Gross Income. Keep it under 43%.", isCorrect: true, points: 75, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "Down-to-Interest Ratio.", feedback: "Incorrect.", isCorrect: false, points: 0, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'shopping_window',
        title: 'Rate Shopping',
        desc: () => "You apply for 3 different mortgages in one week to find the best rate. How many inquiries count?",
        icon: 'TrendingUp',
        theme: 'text-emerald-400',
        generate: () => [
            { id: 'A', text: "Three.", feedback: "Incorrect. FICO models group them.", isCorrect: false, points: 10, statImpact: { score: -15, cash: 0 } },
            { id: 'B', text: "One.", feedback: "Correct! Mortgage/Auto inquiries within 14-45 days count as one for scoring.", isCorrect: true, points: 100, statImpact: { score: 0, cash: +50 } }
        ]
    },
    {
        id: 'pmi_insurance',
        title: 'The 20% Rule',
        desc: () => "You put 5% down on a home. What extra fee will you likely pay?",
        icon: 'Wallet',
        theme: 'text-red-400',
        generate: () => [
            { id: 'A', text: "PMI (Private Mortgage Insurance).", feedback: "Correct. It protects the lender, not you. Eliminate it by reaching 20% equity.", isCorrect: true, points: 50, statImpact: { score: 0, cash: -50 } },
            { id: 'B', text: "Nothing.", feedback: "Incorrect. Lenders require insurance for low down payments.", isCorrect: false, points: 0, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'validation_letter',
        title: 'Debt Validation',
        desc: () => "A collector sends you a dunning letter. You have 30 days to...",
        icon: 'Shield',
        theme: 'text-amber-500',
        generate: () => [
            { id: 'A', text: "Pay it.", feedback: "No! Never pay without validating.", isCorrect: false, points: 0, statImpact: { score: -10, cash: -50 } },
            { id: 'B', text: "Request Validation.", feedback: "Correct. Send a Debt Validation Letter. If they can't prove it, they can't collect.", isCorrect: true, points: 100, statImpact: { score: +10, cash: 0 } }
        ]
    },
    {
        id: 'statute_limitations',
        title: 'Too Old to Sue',
        desc: () => "A debt is 10 years old (past your state's Statute of Limitations). Can they sue you?",
        icon: 'Scale',
        theme: 'text-slate-400',
        generate: () => [
            { id: 'A', text: "Yes, they can always sue.", feedback: "They *can* file, but you have an absolute defense. It's 'Time-Barred'.", isCorrect: false, points: 30, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "No, it's Time-Barred.", feedback: "Correct. If you show up and say 'Statute of Limitations', the case is dismissed.", isCorrect: true, points: 100, statImpact: { score: 0, cash: 0 } }
        ]
    },
    {
        id: 'metro2',
        title: 'The Code',
        desc: () => "Credit bureaus don't read letters; they read data. What is the data language they use?",
        icon: 'CreditCard',
        theme: 'text-indigo-600',
        generate: () => [
            { id: 'A', text: "ASCII", feedback: "Too generic.", isCorrect: false, points: 0, statImpact: { score: 0, cash: 0 } },
            { id: 'B', text: "Metro 2", feedback: "Correct. Factual disputes focus on Metro 2 compliance errors.", isCorrect: true, points: 200, statImpact: { score: +20, cash: 0 } }
        ]
    }
]
