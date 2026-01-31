import { useGamification } from './useGamification'

export interface Offer {
    id: string
    title: string
    description: string
    value: string
    type: 'funding' | 'business' | 'mentorship'
}

export function useRevenue() {
    const { points } = useGamification()

    // Mock "Credit Score Improvement" (In real app, we'd calculate this from reports)
    // We'll use points as a proxy for engagement/readiness

    let readinessScore = 0
    let potentialFunding = 0
    const offers: Offer[] = []

    // Algorithm: The "Credit Cow" Logic
    if (points > 100) {
        readinessScore = 40
        potentialFunding = 10000
    }
    if (points > 500) {
        readinessScore = 75
        potentialFunding = 50000
        offers.push({
            id: 'biz-1',
            title: 'Business Credit Starter',
            description: 'You are ready to incorporate and build Tier 1 credit.',
            value: '$50k Potential',
            type: 'business'
        })
    }
    if (points > 1000) {
        readinessScore = 95
        potentialFunding = 150000
        offers.push({
            id: 'fund-1',
            title: '0% Interest Funding Suite',
            description: 'Elite lenders are looking for profiles like yours.',
            value: '$150k Potential',
            type: 'funding'
        })
    }

    return {
        readinessScore,
        potentialFunding,
        offers,
        isEligible: offers.length > 0
    }
}
