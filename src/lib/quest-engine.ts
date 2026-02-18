import { Wallet, TrendingUp, Shield, AlertTriangle, CreditCard, Scale } from 'lucide-react'

export type Choice = {
    id: string
    text: string
    feedback: string
    isCorrect: boolean
    points: number
    statImpact: { score: number; cash: number }
}

export type Scenario = {
    id: number
    title: string
    description: string
    icon: any
    themeColor: string
    templateId: string
    choices: Choice[]
}

const ICONS = {
    Wallet,
    TrendingUp,
    Shield,
    AlertTriangle,
    CreditCard,
    Scale
}

import { QUEST_DATA } from './quest-data'

// Templates for Procedural Generation
export const TEMPLATES = [
    ...QUEST_DATA,
    {
        id: 'utilize_windfall',
        // ... (rest of original templates)
        title: 'The Windfall',
        desc: (amount: number, balance: number) => `You just received a $${amount} bonus! Your credit card balance is $${balance}. What's the strategic move?`,
        icon: 'Wallet',
        theme: 'text-emerald-400',
        generate: (amount: number, balance: number) => {
            return [
                {
                    id: 'A',
                    text: `Buy a luxury item for $${Math.floor(amount * 0.6)} and pay the rest on debt.`,
                    feedback: "Warning! Splitting the money leaves debt accumulating interest. Pay high-interest debt first!",
                    isCorrect: false,
                    points: 10,
                    statImpact: { score: -5, cash: -amount }
                },
                {
                    id: 'B',
                    text: `Pay off the $${balance} balance completely.`,
                    feedback: "Excellent! Dropping utilization to 0% provides the biggest immediate boost to your credit score.",
                    isCorrect: true,
                    points: 100,
                    statImpact: { score: +25, cash: -balance }
                },
                {
                    id: 'C',
                    text: `Put all $${amount} in savings.`,
                    feedback: "Safe choice, but holding high-interest debt drags your score and wallet down.",
                    isCorrect: false,
                    points: 30,
                    statImpact: { score: 0, cash: +amount }
                }
            ]
        }
    },
    {
        id: 'store_card',
        title: 'The Register Trap',
        desc: (discount: number) => `The clerk offers ${discount}% off your purchase if you open a store credit card right now. Do you take it?`,
        icon: 'TrendingUp',
        theme: 'text-blue-400',
        generate: (_discount: number) => [
            {
                id: 'A',
                text: `Yes! Save the money!`,
                feedback: "Trap! A hard inquiry triggers immediately. Store cards have low limits and high rates. Not worth the small discount.",
                isCorrect: false,
                points: 15,
                statImpact: { score: -5, cash: 20 }
            },
            {
                id: 'B',
                text: `No thanks, I'll use my existing card.`,
                feedback: "Smart. Protecting your 5/24 status and avoiding hard pulls is worth more than a one-time discount.",
                isCorrect: true,
                points: 50,
                statImpact: { score: 0, cash: 0 }
            }

        ]
    },
    {
        id: 'ghost_debt',
        title: 'Zombie Debt',
        desc: (age: number) => `A collector calls about a debt from ${age} years ago. They are aggressive. What do you do?`,
        icon: 'Shield',
        theme: 'text-amber-400',
        generate: (_age: number) => [
            {
                id: 'A',
                text: "Pay slightly to show good faith.",
                feedback: "Critical Error! Paying even $1 can 'revive' the Statute of Limitations, making the whole debt legally collectible again.",
                isCorrect: false,
                points: 0,
                statImpact: { score: -10, cash: -50 }
            },
            {
                id: 'B',
                text: "Demand Validation via Mail.",
                feedback: "Correct. Never admit ownership on the phone. Exercise your rights under FDCPA.",
                isCorrect: true,
                points: 150,
                statImpact: { score: +10, cash: 0 }
            }
        ]
    },
    {
        id: 'limit_increase',
        title: 'Limit Increase',
        desc: () => `Your bank offers to increase your credit limit from $1,000 to $3,000. It requires a Soft Pull.`,
        icon: 'CreditCard',
        theme: 'text-purple-400',
        generate: () => [
            {
                id: 'A',
                text: "Accept it immediately.",
                feedback: "Great move! Higher limits lower your overall utilization percentage, assuming you don't spend more.",
                isCorrect: true,
                points: 75,
                statImpact: { score: +15, cash: 0 }
            },
            {
                id: 'B',
                text: "Decline, more credit is risky.",
                feedback: "A missed opportunity. As long as you have discipline, higher limits are a key tool for growth.",
                isCorrect: false,
                points: 20,
                statImpact: { score: 0, cash: 0 }
            }
        ]
    },
    {
        id: 'cosign',
        title: 'The Favor',
        desc: () => `Your cousin asks you to co-sign for their new car. They promise to pay every month.`,
        icon: 'Scale',
        theme: 'text-red-400',
        generate: () => [
            {
                id: 'A',
                text: "Sign it, family first.",
                feedback: "Dangerous! You are 100% liable for that debt. If they miss one payment, it hits YOUR credit report instantly.",
                isCorrect: false,
                points: 10,
                statImpact: { score: -5, cash: 0 }
            },
            {
                id: 'B',
                text: "Politely decline.",
                feedback: "Wisdom. Never co-sign unless you are willing and able to pay the entire debt yourself.",
                isCorrect: true,
                points: 100,
                statImpact: { score: 0, cash: 0 }
            }
        ]
    },
    {
        id: 'dispute_law',
        title: 'Legal Eagle',
        desc: () => `You found a glaring error on your Equifax report. You are writing a dispute letter. Which law gives them 30 days to investigate?`,
        icon: 'Scale',
        theme: 'text-indigo-400',
        generate: () => [
            {
                id: 'A',
                text: "The Fair Credit Reporting Act (FCRA), Section 611.",
                feedback: "Bullseye! Section 611 mandates a reasonable investigation, usually within 30 days.",
                isCorrect: true,
                points: 120,
                statImpact: { score: +5, cash: 0 }
            },
            {
                id: 'B',
                text: "The Patriot Act.",
                feedback: "Incorrect. The Patriot Act deals with terrorism and identity verification, not credit disputes.",
                isCorrect: false,
                points: 10,
                statImpact: { score: 0, cash: 0 }
            }
        ]
    },
    // ------------------------------------------------------------------
    // ADVANCED TACTICS (TIER 2)
    // ------------------------------------------------------------------
    {
        id: 'pay_for_delete',
        title: 'The Negotiation',
        desc: (amount: number) => `A collection agency agrees to settle a $${amount} debt for $${Math.floor(amount * 0.5)}. They send a letter saying 'Paid in Full'.`,
        icon: 'Scale',
        theme: 'text-rose-400',
        generate: (_amount: number) => [
            {
                id: 'A',
                text: "Pay it immediately to save 50%.",
                feedback: "Mistake. A 'Paid' collection is just as damaging as an 'Unpaid' one (FICO 8). You wasted money for 0 score increase.",
                isCorrect: false,
                points: 20,
                statImpact: { score: 0, cash: -50 }
            },
            {
                id: 'B',
                text: "Demand 'Pay for Delete' in writing first.",
                feedback: "Grandmaster Move. Unless they agree to DELETE the tradeline entirely, they get nothing. Leverage is everything.",
                isCorrect: true,
                points: 200,
                statImpact: { score: +40, cash: 0 }
            }
        ]
    },
    {
        id: 'statement_hack',
        title: 'The AZEO Method',
        desc: () => `Your Due Date is the 15th. Your Statement Date is the 20th. When should you pay your credit card to maximize your score?`,
        icon: 'TrendingUp',
        theme: 'text-cyan-400',
        generate: () => [
            {
                id: 'A',
                text: "On the 15th (Due Date).",
                feedback: "Good, but not optimal. If you pay on the 15th, new charges between 15th-20th might report, ruining your utilization.",
                isCorrect: false,
                points: 50,
                statImpact: { score: +5, cash: 0 }
            },
            {
                id: 'B',
                text: "By the 19th (Before Statement Closes).",
                feedback: "Perfect. The 'Statement Balance' is what gets reported to bureaus, not the active balance. Leave $5 (AZEO) to avoid '0 usage' penalties.",
                isCorrect: true,
                points: 150,
                statImpact: { score: +20, cash: 0 }
            }
        ]
    },
    {
        id: 'piggyback',
        title: 'Authorized User',
        desc: (age: number) => `A friend with perfect credit offers to add you as an Authorized User on their ${age}-year-old card.`,
        icon: 'CreditCard',
        theme: 'text-emerald-400',
        generate: () => [
            {
                id: 'A',
                text: "Accept the offer.",
                feedback: "Smart! You inherit the entire history of that card. This is called 'Piggybacking' and is the fastest way to build history.",
                isCorrect: true,
                points: 100,
                statImpact: { score: +35, cash: 0 }
            },
            {
                id: 'B',
                text: "Decline, it's not my credit.",
                feedback: "Honest, but strategically weak. FICO algorithms explicitly allow authorized user history to count.",
                isCorrect: false,
                points: 10,
                statImpact: { score: 0, cash: 0 }
            }
        ]
    },
    {
        id: 'nuclear_cfpb',
        title: 'The Nuclear Option',
        desc: () => `Experian verified a fraudulent account even after you sent a police report. They are ignoring your letters.`,
        icon: 'AlertTriangle',
        theme: 'text-red-500',
        generate: () => [
            {
                id: 'A',
                text: "Send another letter to Experian.",
                feedback: "Definition of insanity. If they ignored the first valid dispute, they will likely ignore the second.",
                isCorrect: false,
                points: 10,
                statImpact: { score: -5, cash: 0 }
            },
            {
                id: 'B',
                text: "File a CFPB Complaint.",
                feedback: "Nuclear Launch Detected. Bureaus fear the CFPB. They must respond within 15 days or face federal fines. This usually forces deletion.",
                isCorrect: true,
                points: 250,
                statImpact: { score: +50, cash: 0 }
            }
        ]
    }
]

export function generateScenario(index: number, targetTemplateId?: string): Scenario {
    // Randomize or Select Target
    const template = targetTemplateId
        ? TEMPLATES.find(t => t.id === targetTemplateId) || TEMPLATES[0]
        : TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

    // Generate Params based on template type
    let params: any[] = []

    if (template.id === 'utilize_windfall') {
        const amount = [500, 1000, 2000, 5000][Math.floor(Math.random() * 4)];
        const balance = Math.floor(amount * 0.8);
        params = [amount, balance];
    } else if (template.id === 'store_card') {
        params = [Math.floor(Math.random() * 20) + 10]; // 10-30%
    } else if (template.id === 'ghost_debt') {
        params = [Math.floor(Math.random() * 5) + 3]; // 3-8 years
    } else if (template.id === 'pay_for_delete') {
        const debt = [500, 1200, 2500, 5000][Math.floor(Math.random() * 4)];
        params = [debt];
    } else if (template.id === 'piggyback') {
        params = [Math.floor(Math.random() * 10) + 5]; // 5-15 years
    }

    // @ts-ignore
    const choices = template.generate(...params);

    return {
        id: index + 1,
        title: template.title,
        // @ts-ignore
        description: template.desc(...params),
        // @ts-ignore
        icon: ICONS[template.icon] || Wallet,
        themeColor: template.theme,
        templateId: template.id,
        choices: choices.sort(() => Math.random() - 0.5) // Shuffle choices
    }
}
