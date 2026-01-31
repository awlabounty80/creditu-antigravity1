/**
 * CREDIT U™ - PROGRESSIVE LEARNING ARCHITECTURE
 * 6-Level Curriculum Framework
 * 
 * This system implements a progressive learning model where students
 * advance through increasingly sophisticated content based on demonstrated
 * mastery, not time spent.
 */

export type LearningLevel =
    | 'ORIENTATION'
    | 'FRESHMAN'
    | 'SOPHOMORE'
    | 'JUNIOR'
    | 'SENIOR'
    | 'GRADUATE';

export interface LevelDefinition {
    id: LearningLevel;
    levelNumber: number;
    title: string;
    goal: string;
    focus: string;
    authorizedSources: string[];
    extractionRules: string[];
    prohibitedContent: string[];
    activities: string[];
    advancementCriteria: string[];
    estimatedLessons: number;
}

export const LEARNING_LEVELS: Record<LearningLevel, LevelDefinition> = {
    ORIENTATION: {
        id: 'ORIENTATION',
        levelNumber: 1,
        title: 'Orientation / Foundations',
        goal: 'Literacy & awareness (no strategy)',
        focus: 'What credit is, not how to manipulate it',
        authorizedSources: [
            'Credit bureau education pages (Experian, Equifax, TransUnion)',
            'CFPB consumer basics',
            'Open educational resources (OER)'
        ],
        extractionRules: [
            'Extract definitions and vocabulary',
            'Extract credit report sections',
            'Ignore advice language',
            'Cross-check definitions across 2+ sources'
        ],
        prohibitedContent: [
            'Strategy or manipulation tactics',
            'Promises or guarantees',
            'Advice language',
            'Optimization techniques'
        ],
        activities: [
            '"What is credit?" videos',
            'Glossary tools',
            'Entry-level quizzes',
            'Visual metaphors (credit file, timeline)'
        ],
        advancementCriteria: [
            'Complete basic literacy quiz (70%+)',
            'Can identify credit report sections',
            'Demonstrates vocabulary understanding'
        ],
        estimatedLessons: 15
    },

    FRESHMAN: {
        id: 'FRESHMAN',
        levelNumber: 2,
        title: 'Freshman – Understanding Credit',
        goal: 'Structure & rules',
        focus: 'Credit factors and reporting logic',
        authorizedSources: [
            'Experian / Equifax / TransUnion education',
            'FICO education portals (myFICO.com)',
            'CFPB Q&A sections'
        ],
        extractionRules: [
            'Extract factor categories (payment history, utilization, etc.)',
            'Extract influence language ("most impactful")',
            'Avoid formulas or promises',
            'Focus on cause-and-effect relationships'
        ],
        prohibitedContent: [
            'Proprietary scoring formulas',
            'Guaranteed outcomes',
            'Specific score predictions',
            'Manipulation tactics'
        ],
        activities: [
            'Factor-by-factor lessons',
            'Score range explainers',
            'Scenario quizzes ("what impacts scores?")',
            'Cause-and-effect simulations'
        ],
        advancementCriteria: [
            'Pass factor comprehension quizzes (70%+)',
            'Understand cause-and-effect relationships',
            'Can explain all 5 FICO factors'
        ],
        estimatedLessons: 100
    },

    SOPHOMORE: {
        id: 'SOPHOMORE',
        levelNumber: 3,
        title: 'Sophomore – Managing Credit',
        goal: 'Behavior & maintenance',
        focus: 'Rights, responsibilities, and timelines',
        authorizedSources: [
            'CFPB consumer protection',
            'FTC consumer education',
            'Federal Reserve consumer education',
            'NACHA (payment timing)'
        ],
        extractionRules: [
            'Extract dispute steps and processes',
            'Extract payment posting timing',
            'Extract consumer protections (FCRA, FDCPA)',
            'Translate into plain language'
        ],
        prohibitedContent: [
            'Legal advice',
            'Guaranteed dispute outcomes',
            'Loopholes or tricks',
            'Non-compliant tactics'
        ],
        activities: [
            'Dispute education tools',
            'Payment timing explainers',
            'Rights-based quizzes',
            'Visual process walkthroughs'
        ],
        advancementCriteria: [
            'Can explain dispute process (FCRA)',
            'Understands payment consequences',
            'Demonstrates rights awareness'
        ],
        estimatedLessons: 100
    },

    JUNIOR: {
        id: 'JUNIOR',
        levelNumber: 4,
        title: 'Junior – Strategic Credit & Money',
        goal: 'Planning & decision-making (educational)',
        focus: 'Qualification frameworks and money flow',
        authorizedSources: [
            'Federal Reserve',
            'HUD / Fannie Mae / Freddie Mac (education sections)',
            'IRS income definitions',
            'SBA education pages'
        ],
        extractionRules: [
            'Extract DTI concepts and thresholds',
            'Extract documentation categories',
            'Extract general planning frameworks',
            'Avoid approval language'
        ],
        prohibitedContent: [
            'Approval guarantees',
            'Specific lender recommendations',
            'Tax advice',
            'Business advice'
        ],
        activities: [
            'Educational planners',
            'Budgeting frameworks',
            'Scenario simulations',
            'Strategy comparison quizzes'
        ],
        advancementCriteria: [
            'Demonstrates planning literacy',
            'Can evaluate scenarios without guarantees',
            'Understands qualification frameworks'
        ],
        estimatedLessons: 100
    },

    SENIOR: {
        id: 'SENIOR',
        levelNumber: 5,
        title: 'Senior – Optimization & Preparation',
        goal: 'Readiness & system thinking',
        focus: 'Realistic context and preparation logic',
        authorizedSources: [
            'CFPB homeownership education',
            'VA housing education',
            'BLS & Census (benchmarks)',
            'Federal Reserve economic data'
        ],
        extractionRules: [
            'Extract timelines and milestones',
            'Extract averages and benchmarks',
            'Extract readiness indicators',
            'No predictions or guarantees'
        ],
        prohibitedContent: [
            'Market predictions',
            'Investment advice',
            'Guaranteed timelines',
            'Specific recommendations'
        ],
        activities: [
            'Readiness checklists',
            'Timeline planners',
            'Advanced scenario quizzes',
            'Visual systems maps'
        ],
        advancementCriteria: [
            'Completes readiness assessments',
            'Understands risk vs preparation',
            'Demonstrates systems thinking'
        ],
        estimatedLessons: 100
    },

    GRADUATE: {
        id: 'GRADUATE',
        levelNumber: 6,
        title: 'Graduate – Application & Simulation',
        goal: 'Safe application without advice',
        focus: 'Synthesis of all prior knowledge',
        authorizedSources: [
            'All prior authorized sources (cross-verified)',
            'OER instructional design standards'
        ],
        extractionRules: [
            'Recombine existing verified knowledge',
            'No new facts introduced',
            'Synthesis and application only',
            'Cross-reference all prior levels'
        ],
        prohibitedContent: [
            'New unverified information',
            'Financial advice',
            'Guarantees or promises',
            'Individualized recommendations'
        ],
        activities: [
            'Full simulations (educational)',
            'Capstone scenarios',
            'Decision-tree walkthroughs',
            'Mastery assessments'
        ],
        advancementCriteria: [
            'Demonstrates mastery across all domains',
            'Ready for ongoing learning loops',
            'Can synthesize complex scenarios'
        ],
        estimatedLessons: 100
    }
};

/**
 * Calculate total curriculum size
 */
export const TOTAL_CURRICULUM_LESSONS = Object.values(LEARNING_LEVELS)
    .reduce((sum, level) => sum + level.estimatedLessons, 0);

/**
 * Get level by number
 */
export function getLevelByNumber(levelNumber: number): LevelDefinition | null {
    return Object.values(LEARNING_LEVELS).find(l => l.levelNumber === levelNumber) || null;
}

/**
 * Get next level
 */
export function getNextLevel(currentLevel: LearningLevel): LevelDefinition | null {
    const current = LEARNING_LEVELS[currentLevel];
    return getLevelByNumber(current.levelNumber + 1);
}

/**
 * Check if student meets advancement criteria
 * (In production, this would query actual student progress data)
 */
export function canAdvanceToNextLevel(
    currentLevel: LearningLevel,
    studentProgress: {
        quizzesPassed: number;
        lessonsCompleted: number;
        criteriaMetCount: number;
    }
): boolean {
    const level = LEARNING_LEVELS[currentLevel];
    const requiredCriteria = level.advancementCriteria.length;

    // Student must meet all advancement criteria
    return studentProgress.criteriaMetCount >= requiredCriteria;
}

/**
 * Get curriculum summary
 */
export function getCurriculumSummary() {
    return {
        totalLevels: Object.keys(LEARNING_LEVELS).length,
        totalLessons: TOTAL_CURRICULUM_LESSONS,
        levels: Object.values(LEARNING_LEVELS).map(level => ({
            id: level.id,
            title: level.title,
            lessons: level.estimatedLessons,
            focus: level.focus
        }))
    };
}
