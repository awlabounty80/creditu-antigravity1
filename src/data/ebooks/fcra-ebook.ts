import { EBookMetadata, EBookBlock } from '@/components/library/InteractiveEBook';

export const FCRA_EBOOK_METADATA: EBookMetadata = {
    title: "Understanding the Fair Credit Reporting Act (FCRA)",
    program: "Foundations Protocol",
    series: "Credit Law Series",
    attribution: "Credit U Faculty",
    readTime: "7–10 Minutes",
    reward: 50,
    status: "Official Credit U Curriculum Text",
    date: "January 20, 2026"
};

export const FCRA_EBOOK_BLOCKS: EBookBlock[] = [
    { type: 'hero', id: 'block-1' },
    {
        type: 'section',
        id: 'block-2',
        title: "WELCOME TO CREDIT AUTHORITY",
        content: "The Fair Credit Reporting Act (FCRA) is not just a document; it is your source of authority in the financial matrix. It is a federal law that gives you as a consumer the clarity, protection, and leverage you need over the credit data giants. \n\nBy the end of this protocol, you will shift from a passive participant in credit reporting to a master of your own data profile.",
        checkpoint: "I acknowledge that my credit data is protected by federal law."
    },
    {
        type: 'video',
        id: 'block-3',
        voiceScript: "Welcome to Credit University. Today you are stepping into understanding, not fear. The Fair Credit Reporting Act exists to protect you. As you move through this lesson, remember—knowledge is leverage, and you are learning to use yours.",
        visualDesc: "Dark navy background with soft gold motion lines"
    },
    {
        type: 'section',
        id: 'block-4',
        title: "WHAT IS THE FCRA?",
        content: "The Fair Credit Reporting Act (15 U.S.C. § 1681 et seq.) was enacted in 1970 with a singular mission: to ensure accuracy, fairness, and privacy in the way credit bureaus handle your information. \n\nThis law governs the parties that collect and share your data, including the 'Big Three' credit bureaus (Experian, Equifax, TransUnion), lenders, employers, and insurers. If it deals with your credit metadata, it deals with the FCRA.",
        checkpoint: "The FCRA is a federal consumer protection law."
    },
    {
        type: 'section',
        id: 'block-5',
        title: "YOUR RIGHTS UNDER THE FCRA",
        content: "Under the FCRA, you hold several high-level rights: \n\n- **Access to Your Credit Report**: You have the right to know what is in your file. \n- **Right to Dispute**: If you find an error, you have a divine legal right to demand a correction. \n- **Right to Privacy**: Your data cannot be shared with just anyone; there must be a 'permissible purpose'.",
        checkpoint: "Errors on my credit report are disputable by law."
    },
    {
        type: 'video',
        id: 'block-6',
        voiceScript: "You do not ask permission to dispute errors. You exercise a legal right. The law requires credit bureaus to respond to you.",
        visualDesc: "Neural spectrum pulse"
    },
    {
        type: 'section',
        id: 'block-7',
        title: "PERMISSIBLE PURPOSE",
        content: "Not everyone has the right to look at your credit history. To access your report, an entity must have a 'permissible purpose' defined by law. \n\nAllowed reasons include: \n- Creditors (when you apply for credit) \n- Landlords (when you apply for a lease) \n- Employers (only with your explicit written consent) \n- Insurers (to underwrite personal insurance) \n\nAny access without a valid purpose is a federal violation.",
        checkpoint: "Not everyone has the right to access my credit report."
    },
    {
        type: 'table',
        id: 'block-8',
        title: "CREDIT REPORT TIMELINES",
        headers: ["Data Type", "Retention Period", "Legal Impact"],
        rows: [
            ["Negative Information", "7 Years", "Gradually decreases"],
            ["Ch. 7 Bankruptcies", "10 Years", "Severe"],
            ["Ch. 13 Bankruptcies", "7 Years", "Severe"],
            ["Positive Information", "Indefinite", "Highly beneficial"],
            ["Inquiries", "2 Years", "Minor"]
        ],
        checkpoint: "Some negative credit information is time-limited by law."
    },
    {
        type: 'process',
        id: 'block-9',
        title: "HOW TO FILE A DISPUTE",
        steps: [
            "Review your credit report thoroughly",
            "Identify specific factual errors or unverifiable data",
            "Gather supporting documentation for your claim",
            "Submit the dispute to the relevant credit bureau",
            "Bureau investigates and responds (typically 30 days)",
            "Review results and verify the update"
        ],
        checkpoint: "I understand the dispute process."
    },
    {
        type: 'section',
        id: 'block-10',
        title: "ENFORCEMENT & ACCOUNTABILITY",
        content: "The FCRA isn't just a set of rules; it has teeth. If a credit bureau or lender knowingly violates your rights, you can seek enforcement. \n\nPotential remedies include: \n- Actual damages sustained by the consumer \n- Statutory penalties ($100 - $1,000 per violation) \n- Attorney's fees and costs \n- Formal complaints via the CFPB and FTC.",
        checkpoint: "The FCRA has enforceable consequences."
    },
    {
        type: 'action_items',
        id: 'block-11',
        items: [
            "Pull all three credit reports from AnnualCreditReport.com",
            "Identify inaccurate items or zombie accounts",
            "Submit a formal dispute protocol",
            "Track all bureau responses and correspondence"
        ]
    },
    {
        type: 'video',
        id: 'block-12',
        voiceScript: "You’ve completed this Foundations Protocol. What you learned today gives you authority tomorrow. Credit knowledge changes outcomes—and now you have it.",
        visualDesc: "Final completion transmission"
    }
];
