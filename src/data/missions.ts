
export interface Mission {
    id: string;
    title: string;
    description: string;
    xp: number;
    category: 'Repair' | 'Defense' | 'Strategy' | 'Knowledge';
    status: 'locked' | 'active' | 'completed';
    actionLabel: string;
    actionPath: string;
    requiredLevel?: number;
    deadline?: string; // e.g. "3 Days"
}

export const MISSIONS: Mission[] = [
    {
        id: 'M-001',
        title: '90-Day Reconstruction',
        description: 'Initiate your first round of disputes to clear inaccuracies.',
        xp: 500,
        category: 'Repair',
        status: 'active',
        actionLabel: 'Enter Lab',
        actionPath: '/dashboard/credit-lab',
        deadline: '45 Days'
    },
    {
        id: 'M-002',
        title: 'Fortress Protocol',
        description: 'Secure your profile by freezing all three major bureaus.',
        xp: 300,
        category: 'Defense',
        status: 'active',
        actionLabel: 'Execute Freeze',
        actionPath: '/dashboard/credit-lab/freeze'
    },
    {
        id: 'M-003',
        title: 'Neural Calibration',
        description: 'Complete the Financial Nervous System orientation.',
        xp: 150,
        category: 'Strategy',
        status: 'active',
        actionLabel: 'Start Orientation',
        actionPath: '/dashboard/orientation'
    },
    {
        id: 'M-004',
        title: 'Voice Command',
        description: 'Train the AI to recognize your dispute intent.',
        xp: 200,
        category: 'Defense',
        status: 'locked',
        actionLabel: 'Unlock Lab',
        actionPath: '/dashboard/voice-training',
        requiredLevel: 2
    }
];
