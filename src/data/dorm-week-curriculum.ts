
export interface DormDay {
    id: number;
    title: string;
    theme: string;
    script: string[];
    videoUrl?: string;
    requiresInput?: boolean;
    task: string;
    checklistItems: string[];
    worksheetPath?: string;
    rewardPoints: number;
}

export const DORM_WEEK_CURRICULUM: DormDay[] = [
    {
        id: 1,
        title: 'Identity Reframe',
        theme: 'PSYCHOLOGICAL RESET',
        script: [
            "Welcome to the system re-architecture.",
            "Credit is not math—it is behavior.",
            "Today we delete the 'Consumer' identity and install the 'Architect' protocol."
        ],
        videoUrl: "/assets/dean-welcome-v2.mp4",
        requiresInput: true,
        task: "System Reality Scan",
        checklistItems: [
            "Watch Dean's Initiation Protocol",
            "Complete Identity Audit Worksheet",
            "Set Primary 30-Day Mission"
        ],
        worksheetPath: "/resources/credit-snapshot",
        rewardPoints: 250
    },
    {
        id: 2,
        title: 'Credit Architect',
        theme: 'BUREAU MASTERY',
        script: [
            "We are now accessing the data layer.",
            "You cannot fight a war without a map.",
            "Learn to read the matrix of your report and identify the structural flaws holding you back."
        ],
        videoUrl: "/assets/dr-leverage-matrix.mp4",
        task: "Bureau Review",
        checklistItems: [
            "Download & Scan Bureau Files",
            "Execute Bureau Control Worksheet",
            "Identify 3 Negative Data Points"
        ],
        worksheetPath: "/resources/bureau-control",
        rewardPoints: 300
    },
    {
        id: 3,
        title: 'Funding Position',
        theme: 'APPROVAL READINESS',
        script: [
            "Approvals are not luck. They are math.",
            "We are positioning your profile for institutional capital.",
            "Banks do not lend to people; they lend to positions. Let's build yours."
        ],
        videoUrl: "/assets/dean-part-2.mp4",
        task: "Optimization Setup",
        checklistItems: [
            "Perform Psychological Burn Ritual",
            "Calculate Debt-to-Income Position",
            "Verify Utilization Targets"
        ],
        worksheetPath: "/resources/burn-ritual",
        rewardPoints: 350
    },
    {
        id: 4,
        title: 'Execution',
        theme: '90-DAY BATTLE PLAN',
        script: [
            "Strategy without execution is hallucination.",
            "Generating your custom 90-day attack sequence.",
            "This is your automated path to the 700 Club and beyond."
        ],
        task: "Sequence Generation",
        checklistItems: [
            "Generate 30-60-90 Day Plan",
            "Set Autopay Defense Systems",
            "Review Final Approval Probability"
        ],
        worksheetPath: "/resources/approval-readiness",
        rewardPoints: 500
    },
    {
        id: 5,
        title: 'Graduation Reset',
        theme: 'THE ASCENSION',
        script: [
            "Protocol Complete.",
            "You have survived the reset. You are no longer a Freshman.",
            "Take the Oath. Claim your new status. Enter the game."
        ],
        videoUrl: "/assets/celebration-loop.mp4",
        task: "Oath of Excellence",
        checklistItems: [
            "Sign the Architect Oath of Excellence",
            "Claim Dorm Week Certification",
            "Unlock Freshman Foundations Access"
        ],
        worksheetPath: "/resources/oath",
        rewardPoints: 1000
    }
];
