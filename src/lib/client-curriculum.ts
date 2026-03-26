/**
 * CREDIT U™ - CLIENT-SIDE CURRICULUM GENERATOR
 * 
 * Converts the 100 lesson scripts into playable courses with rotating video content
 */

import { COMPLETE_100_LESSONS } from '../data/complete-100-lessons';


export interface ClientLesson {
    id: string;
    title: string;
    content_markdown: string;
    video_url: string;
    duration_minutes: number;
    type: 'video';
    is_free_preview: boolean;
    order_index: number;
    xp_reward: number;
    action_step: string;
    // EXTENDED VIDEO OBJECT ENFORCEMENT
    video_object: {
        type: 'ai_professor' | 'voiceover_slides' | 'placeholder';
        title: string;
        duration_estimate: number;
        thumbnail_image: string;
        playback_status: 'ready' | 'pending' | 'rendering';
        external_resource_url?: string;
        external_resource_title?: string;
        video_assets?: {
            lecture?: string;
            explainer?: string;
            short?: string;
            infographic?: string;
            cinematic?: string | string[];
        };
    };
}

export interface ClientModule {
    id: string;
    title: string;
    description: string;
    order_index: number;
    lessons: ClientLesson[];
}

export interface ClientCourse {
    id: string;
    title: string;
    description: string;
    level: string;
    track: string;
    is_published: boolean;
    status: 'LIVE' | 'DRAFT' | 'ARCHIVED';
    credits_value: number;
    modules: ClientModule[];
}

/**
 * Generate client-side courses from lesson data
 */
export function generateClientCourses(): ClientCourse[] {
    const modules: ClientModule[] = [];
    
    // CINEMATIC REEL MAPPING (Multi-Asset)
    const ELITE_CINEMATIC_REEL = [
        '/assets/cinematic/fico_cube.png',
        '/assets/cinematic/sovereign_student.png',
        '/assets/cinematic/800_gauge.png',
        '/assets/cinematic/success_pillar.png',
        '/assets/cinematic/sophomore_audit_command_elite.png'
    ];

    const HBCU_LEGACY_REEL = [
        '/assets/cinematic/hbcu_homecoming.png',
        '/assets/cinematic/hbcu_mentor.png',
        '/assets/cinematic/hbcu_matrix.png',
        '/assets/cinematic/hbcu_innovation.png'
    ];

    const cinematicReels: Record<string, string[]> = {
        'welcome-wealth-game': [
            '/assets/cinematic/freshman_intro_gates.png',
            '/assets/cinematic/sovereign_student.png',
            '/assets/cinematic/800_gauge.png',
            '/assets/cinematic/success_pillar.png'
        ],
        'the-matrix': [
            '/assets/cinematic/algorithm_matrix_blueprint.png',
            '/assets/cinematic/data_matrix_flow.png',
            '/assets/cinematic/fico_cube.png',
            '/assets/cinematic/success_pillar.png'
        ],
        'the-5-pillars': [
            '/assets/cinematic/five_pillars_gold.png',
            '/assets/cinematic/hand_pillar_method.png',
            '/assets/cinematic/fico_cube.png',
            '/assets/cinematic/success_pillar.png'
        ],
        'debt-vs-leverage': [
            '/assets/cinematic/leverage_scale_navy.png',
            '/assets/cinematic/toxic_debt_vortex.png',
            '/assets/cinematic/fico_cube.png',
            '/assets/cinematic/success_pillar.png'
        ],
        'fcra-rights': [
            '/assets/cinematic/wealth_shield_blueprint.png',
            '/assets/cinematic/data_matrix_flow.png',
            '/assets/cinematic/fico_cube.png',
            '/assets/cinematic/success_pillar.png'
        ],
        'financial-avatar': [
            '/assets/cinematic/sovereign_hoodie_avatar.png',
            '/assets/cinematic/algorithm_matrix_blueprint.png',
            '/assets/cinematic/fico_cube.png',
            '/assets/cinematic/success_pillar.png'
        ],
        'mission-800': [
            '/assets/cinematic/trust_scoreboard_digital.png',
            '/assets/cinematic/800_gauge.png',
            '/assets/cinematic/success_pillar.png',
            '/assets/cinematic/fico_cube.png'
        ],
        'reading-the-scoreboard': [
            '/assets/cinematic/trust_scoreboard_digital.png',
            '/assets/cinematic/fico_cube.png',
            '/assets/cinematic/sovereign_student.png',
            '/assets/cinematic/success_pillar.png'
        ],
        'the-35-percent-rule': [
            '/assets/cinematic/five_pillars_gold.png',
            '/assets/cinematic/hand_pillar_method.png',
            '/assets/cinematic/success_pillar.png',
            '/assets/cinematic/fico_cube.png'
        ],
        'utilization-magic': [
            '/assets/cinematic/800_gauge.png',
            '/assets/cinematic/success_pillar.png'
        ],
        // PHASE 3: JUNIOR ASSETS (Dispute & Legal Mastery)
        'junior-intro': ['/assets/cinematic/junior_cfpb_command_center.png', '/assets/cinematic/hbcu_mentor.png', '/assets/cinematic/success_pillar.png', '/assets/cinematic/fico_cube.png'],
        'junior-bureau': ['/assets/cinematic/junior_bureau_vault.png', '/assets/cinematic/junior_metro2.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'junior-legal': ['/assets/cinematic/junior_fcra_sanctum.png', '/assets/cinematic/sophomore_legal_scroll.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'junior-dispute': ['/assets/cinematic/junior_dispute_engine.png', '/assets/cinematic/sophomore_validation_seal.png', '/assets/cinematic/800_gauge.png', '/assets/cinematic/success_pillar.png'],
        'junior-id-theft': ['/assets/cinematic/junior_identity_shield.png', '/assets/cinematic/sophomore_identity_shield.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'junior-settlement': ['/assets/cinematic/junior_negotiation.png', '/assets/cinematic/sophomore_settlement.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'junior-medical': ['/assets/cinematic/junior_metro2.png', '/assets/cinematic/hbcu_innovation.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        // PHASE 4: SENIOR ASSETS (Wealth & Legacy)
        'senior-home': ['/assets/cinematic/senior_home_ownership.png', '/assets/cinematic/hbcu_homecoming.png', '/assets/cinematic/success_pillar.png', '/assets/cinematic/fico_cube.png'],
        'senior-trust': ['/assets/cinematic/senior_trust_vault.png', '/assets/cinematic/hbcu_mentor.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'senior-generational': ['/assets/cinematic/senior_generational_wealth.png', '/assets/cinematic/hbcu_matrix.png', '/assets/cinematic/800_gauge.png', '/assets/cinematic/success_pillar.png'],
        'senior-real-estate': ['/assets/cinematic/senior_real_estate.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'senior-business': ['/assets/cinematic/senior_business_empire.png', '/assets/cinematic/hbcu_innovation.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'senior-estate': ['/assets/cinematic/senior_estate_planning.png', '/assets/cinematic/sophomore_legal_scroll.png', '/assets/cinematic/trust_scoreboard_digital.png', '/assets/cinematic/success_pillar.png'],
        'senior-tax': ['/assets/cinematic/senior_tax_strategy.png', '/assets/cinematic/junior_metro2.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'senior-military': ['/assets/cinematic/hbcu_mentor.png', '/assets/cinematic/junior_fcra_sanctum.png', '/assets/cinematic/success_pillar.png', '/assets/cinematic/fico_cube.png'],
        // PHASE 2: SOPHOMORE ASSETS (Evidence & Auditing Theme - ELITE V2)
        'FRESH-CF-051': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/trust_scoreboard_digital.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-052': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/sophomore_fdcpa_shield.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-053': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/sophomore_validation_seal.png', '/assets/cinematic/five_pillars_gold.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-054': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/sophomore_settlement.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-055': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_judgment_hammer.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-056': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/sophomore_zombie_debt.png', '/assets/cinematic/sophomore_identity_shield.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-057': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/hbcu_homecoming.png', '/assets/cinematic/sovereign_student.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-058': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/hbcu_mentor.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-059': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/hbcu_matrix.png', '/assets/cinematic/five_pillars_gold.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-060': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/hbcu_innovation.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-061': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/sophomore_legal_scroll.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-062': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/sophomore_judgment_hammer.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-063': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/sophomore_bureau_sanctum.png', '/assets/cinematic/800_gauge.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-064': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/sophomore_zombie_debt.png', '/assets/cinematic/toxic_debt_vortex.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-065': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_identity_shield.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-066': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/sophomore_settlement.png', '/assets/cinematic/sovereign_student.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-067': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/hbcu_homecoming.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-068': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/hbcu_mentor.png', '/assets/cinematic/800_gauge.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-069': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/hbcu_matrix.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-070': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/hbcu_innovation.png', '/assets/cinematic/800_gauge.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-071': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/sophomore_audit_magnifier.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-072': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/sophomore_fdcpa_shield.png', '/assets/cinematic/800_gauge.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-073': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/sophomore_bureau_sanctum.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-074': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/sophomore_validation_seal.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-075': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_identity_shield.png', '/assets/cinematic/sovereign_student.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-076': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/sophomore_settlement.png', '/assets/cinematic/trust_scoreboard_digital.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-077': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/sophomore_judgment_hammer.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-078': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/sophomore_bureau_sanctum.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-079': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/hbcu_matrix.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-080': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/hbcu_innovation.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-081': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/sophomore_legal_scroll.png', '/assets/cinematic/trust_scoreboard_digital.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-082': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/sophomore_validation_seal.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-083': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/sophomore_identity_shield.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-084': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/sophomore_settlement.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-085': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_judgment_hammer.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-086': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/hbcu_homecoming.png', '/assets/cinematic/trust_scoreboard_digital.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-087': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/hbcu_mentor.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-088': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/hbcu_matrix.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-089': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/hbcu_innovation.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-090': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_legal_scroll.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-091': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/sophomore_validation_seal.png', '/assets/cinematic/trust_scoreboard_digital.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-092': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/sophomore_identity_shield.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-093': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/sophomore_settlement.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-094': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/sophomore_judgment_hammer.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-095': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_bureau_sanctum.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-096': ['/assets/cinematic/sophomore_bureau_deepdive_elite.png', '/assets/cinematic/hbcu_homecoming.png', '/assets/cinematic/trust_scoreboard_digital.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-097': ['/assets/cinematic/sophomore_legal_arsenal_elite.png', '/assets/cinematic/hbcu_mentor.png', '/assets/cinematic/leverage_scale_navy.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-098': ['/assets/cinematic/sophomore_strategic_dispute_elite.png', '/assets/cinematic/hbcu_matrix.png', '/assets/cinematic/wealth_shield_blueprint.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-099': ['/assets/cinematic/sophomore_identity_restoration_elite.png', '/assets/cinematic/hbcu_innovation.png', '/assets/cinematic/data_matrix_flow.png', '/assets/cinematic/success_pillar.png'],
        'FRESH-CF-100': ['/assets/cinematic/sophomore_audit_command_elite.png', '/assets/cinematic/sophomore_legal_scroll.png', '/assets/cinematic/fico_cube.png', '/assets/cinematic/success_pillar.png']
    };

    // JUNIOR MODULES DEFINITION (CFPB INTEGRATED)
    const juniorModules = [
        { title: "Common Credit Report Errors", action: "Circle inaccuracies on your current report." },
        { title: "The Dispute Process Step-by-Step", action: "Draft a dispute letter using the CUAI template." },
        { title: "Handling Debt Collectors", action: "Download the 'Debt Log' to track all communications." },
        { title: "Debt Action Planning", action: "Complete the Debt-to-Income (DTI) calculator." },
        { title: "Identity Theft: First Response", action: "Visit IdentityTheft.gov to start a recovery plan." },
        { title: "Medical Debt Protections", action: "Use the 'Avoiding Medical Debt' handout." },
        { title: "Student Loan Repayment Options", action: "Research 'Graduated Payment Plans' for private loans." },
        { title: "FCRA & Regulation V Rights", action: "Review the 'Summary of Rights' PDF." },
        { title: "Spotting Red Flags & Scams", action: "List 3 warning signs of 'Credit Repair' scams." },
        { title: "Submitting a CFPB Complaint", action: "Log into consumerfinance.gov to file a formal issue." },
        { title: "Background Screening Rights", action: "Request a copy of your tenant screening report." },
        { title: "Junior Capstone: The Cleanup", action: "Submit a verification of all current disputes." }
    ];

    // SENIOR MODULES DEFINITION
    const seniorModules = [
        { title: "Building Credit from Zero", action: "Research 3 secured credit card options." },
        { title: "Comparing Financial Products", action: "Use the 'Choosing Financial Products' comparison tool." },
        { title: "Planning for Large Purchases", action: "Set a 'SMART Goal' for a home or auto down payment." },
        { title: "Prepaid vs. Payroll Card Rights", action: "Identify the fees associated with your current cards." },
        { title: "Asset Building & ABLE Accounts", action: "Check eligibility for tax-advantaged savings." },
        { title: "Rebuilding After Bankruptcy", action: "Create a 12-month 'Credit Re-entry' timeline." },
        { title: "Auto Loan Mastery", action: "Use the 'Know Before You Owe' auto loan guide." },
        { title: "Protecting Your Identity Long-Term", action: "Place a security freeze on all 3 bureaus." },
        { title: "Managing Seasonal Income", action: "Build a 'Cash Flow Budget' for the year." },
        { title: "Negotiating with Creditors", action: "Use the 'Ask CFPB' guide for settlement scripts." },
        { title: "Military & Veteran Protections", action: "Review SCRA and MLA interest rate caps." },
        { title: "Senior Capstone: Graduation", action: "Submit your Final Credit Mastery Action Plan." }
    ];

    // 1. FOUNDATION LESSONS (Freshman & Sophomore)
    const FOUNDATION_LESSONS = COMPLETE_100_LESSONS;
    
    // Divide 100 lessons into 24 modules (12 Freshman, 12 Sophomore)
    for (let i = 0; i < 24; i++) {
        const isFreshman = i < 12;
        const lessonsPerModule = 4; // 24 * 4 = 96. Last module gets the remainder.
        const start = i * lessonsPerModule;
        const end = (i === 23) ? 100 : (i + 1) * lessonsPerModule;
        const currentLessons = FOUNDATION_LESSONS.slice(start, end);
        
        if (currentLessons.length === 0) continue;

        modules.push({
            id: `${isFreshman ? 'fresh' : 'soph'}-mod-${(i % 12) + 1}`,
            title: `${isFreshman ? 'Freshman' : 'Sophomore'} Module ${(i % 12) + 1}: ${currentLessons[0].moduleName}`,
            description: `Core training on ${currentLessons[0].moduleName}.`,
            order_index: i,
            lessons: currentLessons.map((l, idx) => {
                // Determine Cinematic Asset
                // Map legacy lesson IDs to their cinematic slugs or use IDs directly
                const cidMap: Record<string, string> = {
                    'less_1_1': 'welcome-wealth-game', // Welcome
                    'less_1_2': 'the-matrix',           // Matrix
                    'less_1_3': 'the-5-pillars',        // 5 Pillars
                    'less_1_4': 'debt-vs-leverage',     // Debt vs Leverage
                    'less_1_5': 'fcra-rights',          // FCRA
                    'less_1_6': 'financial-avatar',     // Avatar
                    'less_1_7': 'mission-800',          // Mission 800
                    'less_1_8': 'reading-the-scoreboard', // Reading Scoreboard (LESSON 101 placeholder)
                    'less_1_9': 'the-35-percent-rule',  // 35% Rule
                    'less_1_10': 'utilization-magic',    // Utilization
                    'less_2_1': 'reading-the-scoreboard' // Reading the Scoreboard (Actual)
                };
                
                const rawCid = cidMap[l.lessonId] || l.lessonId;
                const cid = cinematicReels[rawCid] ? rawCid : 'ELITE_FALLBACK';
                
                // Ensure cinematicReels has the fallback
                if (!cinematicReels['ELITE_FALLBACK']) {
                    cinematicReels['ELITE_FALLBACK'] = ELITE_CINEMATIC_REEL;
                }

                return {
                    id: l.lessonId,
                    title: l.lessonTitle,
                    content_markdown: `
# ${l.lessonTitle}

## Mission Context
${l.structurePoints.introContext}

## Tactical Instruction
${l.structurePoints.coreInstruction.map((point: string) => `• ${point}`).join('\n')}

## Strategy Summary
${l.structurePoints.reinforcementSummary}
                    `.trim(),
                    video_url: (cinematicReels[cid] && cinematicReels[cid][0]) || '/assets/logo-animated.mp4',
                    duration_minutes: l.minutes,
                    type: 'video',
                    is_free_preview: i === 0 && idx === 0,
                    order_index: idx,
                    xp_reward: 25,
                    action_step: l.structurePoints.reinforcementSummary || "Apply this lesson to your credit profile.",
                    video_object: {
                        type: 'ai_professor',
                        title: l.lessonTitle,
                        duration_estimate: l.minutes,
                        thumbnail_image: '/assets/dr-leverage-transmission.png',
                        playback_status: 'ready',
                        video_assets: {
                            lecture: '/assets/logo-animated.mp4',
                            cinematic: (cinematicReels[cid] ? cinematicReels[cid] : ['/assets/logo-animated.mp4']) as any
                        }
                    }
                };
            })
        });
    }


    // 2. JUNIOR expansion
    juniorModules.forEach((m, i) => {
        modules.push({
            id: `junior-mod-${i+1}`,
            title: `Junior Module ${i+1}: ${m.title}`,
            description: "Advanced fixing and legal dispute strategies.",
            order_index: i + 12,
            lessons: [{
                id: `junior-less-${i+1}`,
                title: m.title,
                content_markdown: `# ${m.title}\n\nThis module covers ${m.title} using CFPB guidelines.`,
                video_url: '/assets/logo-animated.mp4',
                duration_minutes: 10,
                type: 'video',
                is_free_preview: false,
                order_index: 0,
                xp_reward: 25,
                action_step: m.action,
                video_object: {
                    type: 'ai_professor',
                    title: m.title,
                    duration_estimate: 10,
                    thumbnail_image: '/assets/dr-leverage-transmission.png',
                    playback_status: 'ready',
                    video_assets: {
                        lecture: '/assets/logo-animated.mp4',
                        cinematic: (() => {
                            const map: Record<number, string> = {
                                0: 'junior-dispute',
                                1: 'junior-id-theft',
                                2: 'junior-medical',
                                3: 'junior-settlement',
                                4: 'junior-legal',
                                5: 'junior-legal',
                                6: 'junior-intro',
                                7: 'junior-bureau',
                                8: 'junior-intro'
                            };
                            const cid = map[i] || 'junior-intro';
                            return (cinematicReels[cid] || HBCU_LEGACY_REEL);
                        })()
                    }
                }
            }]
        });
    });

    // 3. SENIOR expansion
    seniorModules.forEach((m, i) => {
        modules.push({
            id: `senior-mod-${i+1}`,
            title: `Senior Module ${i+1}: ${m.title}`,
            description: "Wealth building and master strategy.",
            order_index: i + 24,
            lessons: [{
                id: `senior-less-${i+1}`,
                title: m.title,
                content_markdown: `# ${m.title}\n\nMaster the strategy of ${m.title}.`,
                video_url: '/assets/logo-animated.mp4',
                duration_minutes: 15,
                type: 'video',
                is_free_preview: false,
                order_index: 0,
                xp_reward: 25,
                action_step: m.action,
                video_object: {
                    type: 'ai_professor',
                    title: m.title,
                    duration_estimate: 15,
                    thumbnail_image: '/assets/dr-leverage-transmission.png',
                    playback_status: 'ready',
                    video_assets: {
                        lecture: '/assets/logo-animated.mp4',
                        cinematic: (() => {
                            const map: Record<number, string> = {
                                0: 'senior-business',
                                1: 'junior-intro',
                                2: 'senior-home',
                                4: 'senior-generational',
                                5: 'senior-trust',
                                6: 'senior-real-estate',
                                7: 'senior-generational',
                                9: 'senior-estate',
                                10: 'senior-military',
                                11: 'senior-generational'
                            };
                            const cid = map[i] || 'senior-generational';
                            return (cinematicReels[cid] || HBCU_LEGACY_REEL);
                        })()
                    }
                }
            }]
        });
    });

    const course: ClientCourse = {
        id: 'freshman-foundations',
        title: 'Credit U™: Full University Curriculum',
        description: 'Elite, AI-driven university curriculum from Freshman to Senior level.',
        level: 'UNIVERSITY',
        track: 'Foundations to Mastery',
        is_published: true,
        status: 'LIVE',
        credits_value: 50,
        modules
    };

    return [course];
}

/**
 * Get a specific course by ID
 */
export function getClientCourse(courseId: string): ClientCourse | null {
    const courses = generateClientCourses();
    return courses.find(c => c.id === courseId) || null;
}

/**
 * Get all client courses
 */
export function getAllClientCourses(): ClientCourse[] {
    return generateClientCourses();
}
