/**
 * CREDIT U™ - STUDENT PROGRESS TRACKING SYSTEM
 * 
 * Tracks student advancement through the 6-level learning architecture
 * Manages completion status, quiz scores, and advancement eligibility
 */

import { LearningLevel } from './learning-levels';

export interface StudentProgress {
    userId: string;
    currentLevel: LearningLevel;
    completedLevels: LearningLevel[];

    // Lesson tracking
    lessonsCompleted: string[]; // lesson IDs
    lessonsInProgress: string[];
    totalLessonsWatched: number;

    // Quiz tracking
    quizzesPassed: {
        quizId: string;
        score: number;
        passedAt: Date;
    }[];
    quizzesAttempted: {
        quizId: string;
        score: number;
        attemptedAt: Date;
    }[];

    // Tool usage
    toolsUsed: {
        toolId: string;
        usedAt: Date;
        count: number;
    }[];

    // Advancement criteria
    criteriaMetByLevel: Record<LearningLevel, {
        criteriaId: string;
        met: boolean;
        metAt?: Date;
    }[]>;

    // Gamification
    mooPoints: number;
    achievements: string[];
    streak: number;
    lastActiveDate: Date;

    // Metadata
    enrolledAt: Date;
    lastUpdated: Date;
}

export interface LessonProgress {
    lessonId: string;
    userId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number; // 0-100
    watchTime: number; // seconds
    notesCount: number;
    completedAt?: Date;
    lastWatchedAt: Date;
}

export interface QuizAttempt {
    attemptId: string;
    quizId: string;
    userId: string;
    answers: number[];
    score: number;
    passed: boolean;
    timeSpent: number; // seconds
    attemptedAt: Date;
}

export interface AdvancementCriteria {
    criteriaId: string;
    level: LearningLevel;
    description: string;
    type: 'quiz' | 'lesson' | 'comprehension' | 'activity';
    requirement: {
        quizId?: string;
        minScore?: number;
        lessonIds?: string[];
        activityType?: string;
    };
}

/**
 * Calculate if student can advance to next level
 */
export function canAdvanceToNextLevel(progress: StudentProgress, level: LearningLevel): boolean {
    const criteria = progress.criteriaMetByLevel[level];
    if (!criteria) return false;

    // All criteria must be met
    return criteria.every(c => c.met);
}

/**
 * Calculate overall progress percentage
 */
export function calculateOverallProgress(progress: StudentProgress): number {
    const totalLevels = 6;
    const completedLevels = progress.completedLevels.length;
    const currentLevelProgress = calculateCurrentLevelProgress(progress);

    return ((completedLevels + currentLevelProgress) / totalLevels) * 100;
}

/**
 * Calculate current level progress
 */
export function calculateCurrentLevelProgress(progress: StudentProgress): number {
    const criteria = progress.criteriaMetByLevel[progress.currentLevel];
    if (!criteria || criteria.length === 0) return 0;

    const metCount = criteria.filter(c => c.met).length;
    return metCount / criteria.length;
}

/**
 * Award Moo Points for activity
 */
export function awardMooPoints(
    progress: StudentProgress,
    activity: 'lesson' | 'quiz' | 'tool' | 'daily_login',
    amount?: number
): number {
    const points = amount || {
        lesson: 100,
        quiz: 50,
        tool: 25,
        daily_login: 10
    }[activity];

    return progress.mooPoints + points;
}

/**
 * Check and update daily streak
 */
export function updateStreak(progress: StudentProgress): number {
    const today = new Date();
    const lastActive = new Date(progress.lastActiveDate);

    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
        // Consecutive day - increment streak
        return progress.streak + 1;
    } else if (daysDiff === 0) {
        // Same day - maintain streak
        return progress.streak;
    } else {
        // Streak broken - reset to 1
        return 1;
    }
}

/**
 * Get next milestone
 */
export function getNextMilestone(progress: StudentProgress): {
    type: 'level' | 'lessons' | 'quizzes' | 'points';
    description: string;
    current: number;
    target: number;
    progress: number;
} | null {
    // Check for level advancement
    const currentLevelProgress = calculateCurrentLevelProgress(progress);
    if (currentLevelProgress < 1) {
        return {
            type: 'level',
            description: `Complete ${progress.currentLevel} level`,
            current: Math.floor(currentLevelProgress * 100),
            target: 100,
            progress: currentLevelProgress * 100
        };
    }

    // Check for lesson milestones
    const lessonMilestones = [10, 25, 50, 100, 200, 300, 400, 500];
    const nextLessonMilestone = lessonMilestones.find(m => m > progress.totalLessonsWatched);
    if (nextLessonMilestone) {
        return {
            type: 'lessons',
            description: `Watch ${nextLessonMilestone} lessons`,
            current: progress.totalLessonsWatched,
            target: nextLessonMilestone,
            progress: (progress.totalLessonsWatched / nextLessonMilestone) * 100
        };
    }

    return null;
}

/**
 * Get student statistics
 */
export function getStudentStats(progress: StudentProgress) {
    return {
        totalLessons: progress.lessonsCompleted.length,
        totalQuizzes: progress.quizzesPassed.length,
        totalTools: progress.toolsUsed.reduce((sum, t) => sum + t.count, 0),
        mooPoints: progress.mooPoints,
        streak: progress.streak,
        currentLevel: progress.currentLevel,
        completedLevels: progress.completedLevels.length,
        overallProgress: calculateOverallProgress(progress),
        currentLevelProgress: calculateCurrentLevelProgress(progress) * 100,
        achievements: progress.achievements.length,
        daysActive: Math.floor(
            (new Date().getTime() - new Date(progress.enrolledAt).getTime()) / (1000 * 60 * 60 * 24)
        )
    };
}

/**
 * Initialize new student progress
 */
export function initializeStudentProgress(userId: string): StudentProgress {
    const now = new Date();

    return {
        userId,
        currentLevel: 'ORIENTATION',
        completedLevels: [],
        lessonsCompleted: [],
        lessonsInProgress: [],
        totalLessonsWatched: 0,
        quizzesPassed: [],
        quizzesAttempted: [],
        toolsUsed: [],
        criteriaMetByLevel: {
            ORIENTATION: [],
            FRESHMAN: [],
            SOPHOMORE: [],
            JUNIOR: [],
            SENIOR: [],
            GRADUATE: []
        },
        mooPoints: 0,
        achievements: [],
        streak: 0,
        lastActiveDate: now,
        enrolledAt: now,
        lastUpdated: now
    };
}

/**
 * Mark lesson as completed
 */
export function markLessonCompleted(
    progress: StudentProgress,
    lessonId: string
): StudentProgress {
    if (progress.lessonsCompleted.includes(lessonId)) {
        return progress; // Already completed
    }

    return {
        ...progress,
        lessonsCompleted: [...progress.lessonsCompleted, lessonId],
        lessonsInProgress: progress.lessonsInProgress.filter(id => id !== lessonId),
        totalLessonsWatched: progress.totalLessonsWatched + 1,
        mooPoints: awardMooPoints(progress, 'lesson'),
        lastUpdated: new Date()
    };
}

/**
 * Record quiz attempt
 */
export function recordQuizAttempt(
    progress: StudentProgress,
    quizId: string,
    score: number,
    passed: boolean
): StudentProgress {
    const now = new Date();

    const newAttempt = {
        quizId,
        score,
        attemptedAt: now
    };

    const updates: Partial<StudentProgress> = {
        quizzesAttempted: [...progress.quizzesAttempted, newAttempt],
        lastUpdated: now
    };

    if (passed && !progress.quizzesPassed.find(q => q.quizId === quizId)) {
        updates.quizzesPassed = [
            ...progress.quizzesPassed,
            { quizId, score, passedAt: now }
        ];
        updates.mooPoints = awardMooPoints(progress, 'quiz');
    }

    return {
        ...progress,
        ...updates
    };
}

/**
 * Record tool usage
 */
export function recordToolUsage(
    progress: StudentProgress,
    toolId: string
): StudentProgress {
    const now = new Date();
    const existingTool = progress.toolsUsed.find(t => t.toolId === toolId);

    if (existingTool) {
        return {
            ...progress,
            toolsUsed: progress.toolsUsed.map(t =>
                t.toolId === toolId
                    ? { ...t, count: t.count + 1, usedAt: now }
                    : t
            ),
            mooPoints: awardMooPoints(progress, 'tool'),
            lastUpdated: now
        };
    }

    return {
        ...progress,
        toolsUsed: [
            ...progress.toolsUsed,
            { toolId, usedAt: now, count: 1 }
        ],
        mooPoints: awardMooPoints(progress, 'tool'),
        lastUpdated: now
    };
}
