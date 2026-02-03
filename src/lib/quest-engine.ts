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

// Templates for Procedural Generation
export const TEMPLATES = [
    {
        id: 'utilize_windfall',
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
    }

    // @ts-expect-error: Dynamic generation
    const choices = template.generate(...params);

    return {
        id: index + 1,
        title: template.title,
        // @ts-expect-error: Dynamic description
        description: template.desc(...params),
        // @ts-expect-error: Icon mapping
        icon: ICONS[template.icon] || Wallet,
        themeColor: template.theme,
        templateId: template.id,
        choices: choices.sort(() => Math.random() - 0.5) // Shuffle choices
    }
}
